import json
import logging
import math
import re
from collections import defaultdict
from collections.abc import Iterable
from pathlib import Path
from typing import Any

from beancount.core.data import Transaction

from .importer import ImportedTransaction

log = logging.getLogger(__name__)


def tokenize(text: str | None) -> list[str]:
    """Tokenizes text into lowercase words, stripping non-alphanumeric chars."""
    if not text:
        return []
    text = str(text).lower()
    return [w for w in re.split(r"\W+", text) if len(w) > 1]


class NaiveBayesPredictor:
    """A lightweight Multinomial Naive Bayes classifier for text."""

    def __init__(self) -> None:
        self.classes: dict[str, int] = defaultdict(int)
        self.word_counts: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
        self.class_word_totals: dict[str, int] = defaultdict(int)
        self.vocab: set[str] = set()
        self.total_docs: int = 0

    def train(self, docs: list[str], labels: list[str]) -> None:
        self.__init__()  # reset
        for doc, label in zip(docs, labels, strict=True):
            self.classes[label] += 1
            self.total_docs += 1
            words = tokenize(doc)
            for w in words:
                self.word_counts[label][w] += 1
                self.class_word_totals[label] += 1
                self.vocab.add(w)

    def predict(self, doc: str) -> tuple[str | None, float]:
        if not self.classes:
            return None, 0.0

        words = tokenize(doc)
        best_label = None
        best_log_prob = -float("inf")
        vocab_size = len(self.vocab)
        log_probs: dict[str, float] = {}

        for label, count in self.classes.items():
            log_prob = math.log(count / self.total_docs)
            for w in words:
                # Laplace smoothing
                w_count = self.word_counts[label].get(w, 0)
                prob = (w_count + 1) / (self.class_word_totals[label] + vocab_size)
                log_prob += math.log(prob)
            log_probs[label] = log_prob

            if log_prob > best_log_prob:
                best_log_prob = log_prob
                best_label = label

        if not best_label:
            return None, 0.0

        # Softmax to compute confidence
        max_lp = max(log_probs.values())
        try:
            sum_exp = sum(math.exp(lp - max_lp) for lp in log_probs.values())
            confidence = math.exp(log_probs[best_label] - max_lp) / sum_exp
        except OverflowError:
            confidence = 1.0

        return best_label, confidence


class TransactionPredictor:
    """Manages ML predictors for Postings (counter accounts) and Payees."""

    def __init__(self, model_path: Path):
        self.model_path = model_path
        self.posting_predictor = NaiveBayesPredictor()
        self.payee_predictor = NaiveBayesPredictor()

    def train(self, entries: Iterable[Any], anchor_accounts: list[str], skip_accounts: list[str]) -> None:
        log.info(f"Training predictors using anchors: {anchor_accounts}")
        posting_docs: list[str] = []
        posting_labels: list[str] = []
        payee_docs: list[str] = []
        payee_labels: list[str] = []

        skip_set = set(skip_accounts)
        anchor_set = set(anchor_accounts)

        count = 0
        for entry in entries:
            if not isinstance(entry, Transaction):
                continue

            has_anchor = any(p.account in anchor_set for p in entry.postings)
            if not has_anchor:
                continue

            doc_parts: list[str] = []
            if entry.payee:
                doc_parts.append(entry.payee)
            if entry.narration:
                doc_parts.append(entry.narration)
            doc = " ".join(doc_parts)

            # Predict Posting
            other_accounts = [
                p.account for p in entry.postings if p.account not in anchor_set and p.account not in skip_set
            ]
            if other_accounts:
                label = " ".join(sorted(other_accounts))
                posting_docs.append(doc)
                posting_labels.append(label)

            # Predict Payee
            if entry.payee:
                payee_docs.append(entry.narration or "")
                payee_labels.append(entry.payee)

            count += 1

        self.posting_predictor.train(posting_docs, posting_labels)
        self.payee_predictor.train(payee_docs, payee_labels)
        log.info(f"Trained on {count} transactions.")
        self.save()

    def apply_predictions(self, imp_txns: list[ImportedTransaction], min_confidence: float = 0.5) -> None:
        predictions_made = 0
        for tx in imp_txns:
            doc_parts: list[str] = []
            if tx.payee:
                doc_parts.append(tx.payee)
            if tx.narration:
                doc_parts.append(tx.narration)
            if tx.category:
                doc_parts.append(tx.category)
            doc = " ".join(doc_parts)

            # 1. Posting Prediction
            if not tx.counter_account:
                label, conf = self.posting_predictor.predict(doc)
                if label and conf >= min_confidence:
                    accounts = label.split(" ")
                    tx.counter_account = accounts[0]
                    tx.meta["conf_counteraccount"] = f"{label} (confidence {conf * 100:.0f}%)"
                    predictions_made += 1

            # 2. Payee Prediction
            if tx.narration:
                p_doc = f"{tx.narration} {tx.category or ''}"
                p_label, p_conf = self.payee_predictor.predict(p_doc)
                if p_label and p_conf >= min_confidence:
                    tx.payee = p_label
                    tx.meta["conf_payee"] = f"{p_label} (confidence {p_conf * 100:.0f}%)"

        log.info(f"Applied predictions to {predictions_made} / {len(imp_txns)} transactions.")

    def save(self) -> None:
        data = {
            "postings": {
                "classes": dict(self.posting_predictor.classes),
                "word_counts": {k: dict(v) for k, v in self.posting_predictor.word_counts.items()},
                "class_word_totals": dict(self.posting_predictor.class_word_totals),
                "vocab": list(self.posting_predictor.vocab),
                "total_docs": self.posting_predictor.total_docs,
            },
            "payees": {
                "classes": dict(self.payee_predictor.classes),
                "word_counts": {k: dict(v) for k, v in self.payee_predictor.word_counts.items()},
                "class_word_totals": dict(self.payee_predictor.class_word_totals),
                "vocab": list(self.payee_predictor.vocab),
                "total_docs": self.payee_predictor.total_docs,
            },
        }
        with self.model_path.open("w") as f:
            json.dump(data, f)

    def load(self) -> None:
        if not self.model_path.exists():
            return
        with self.model_path.open("r") as f:
            data = json.load(f)

        p1 = data["postings"]
        self.posting_predictor.classes = defaultdict(int, p1["classes"])
        self.posting_predictor.word_counts = defaultdict(
            lambda: defaultdict(int), {k: defaultdict(int, v) for k, v in p1["word_counts"].items()}
        )
        self.posting_predictor.class_word_totals = defaultdict(int, p1["class_word_totals"])
        self.posting_predictor.vocab = set(p1["vocab"])
        self.posting_predictor.total_docs = p1["total_docs"]

        p2 = data["payees"]
        self.payee_predictor.classes = defaultdict(int, p2["classes"])
        self.payee_predictor.word_counts = defaultdict(
            lambda: defaultdict(int), {k: defaultdict(int, v) for k, v in p2["word_counts"].items()}
        )
        self.payee_predictor.class_word_totals = defaultdict(int, p2["class_word_totals"])
        self.payee_predictor.vocab = set(p2["vocab"])
        self.payee_predictor.total_docs = p2["total_docs"]
