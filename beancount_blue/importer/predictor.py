# pyright: reportUnknownMemberType=false, reportUnknownVariableType=false, reportUnknownArgumentType=false
import logging
from collections.abc import Iterable
from pathlib import Path
from typing import Any

import joblib  # type: ignore
import numpy as np  # type: ignore
from beancount.core.data import Transaction
from sklearn.feature_extraction.text import CountVectorizer  # type: ignore
from sklearn.linear_model import SGDClassifier  # type: ignore
from sklearn.pipeline import Pipeline  # type: ignore

from .importer import ImportedTransaction

log = logging.getLogger(__name__)


class LogisticRegressionPredictor:
    """A lightweight Logistic Regression classifier for text using scikit-learn."""

    def __init__(self) -> None:
        self.pipeline = Pipeline([
            ("vect", CountVectorizer(token_pattern=r"(?u)\b\w+\b", lowercase=True)),  # noqa: S106
            ("clf", SGDClassifier(loss="log_loss", max_iter=1000, tol=1e-3, penalty="l2", alpha=1e-4, random_state=42)),
        ])
        self.is_trained = False

    def train(self, docs: list[str], labels: list[str]) -> None:
        if not docs:
            return

        valid_docs: list[str] = []
        valid_labels: list[str] = []
        for d, lbl in zip(docs, labels, strict=True):
            if lbl:
                valid_docs.append(d)
                valid_labels.append(lbl)

        # SGDClassifier needs at least 2 classes
        if len(set(valid_labels)) < 2:
            valid_docs.append("dummy doc for single class fallback")
            valid_labels.append("dummy_label")

        self.pipeline.fit(valid_docs, valid_labels)
        self.is_trained = True

    def predict(self, doc: str) -> tuple[str | None, float]:
        if not self.is_trained:
            return None, 0.0

        try:
            probs = self.pipeline.predict_proba([doc])[0]
        except Exception:
            return None, 0.0

        max_idx = int(np.argmax(probs))
        best_label = self.pipeline.classes_[max_idx]
        confidence = probs[max_idx]

        # Ignore dummy label
        if best_label == "dummy_label":
            return None, 0.0

        return str(best_label), float(confidence)

    def explain(self, doc: str) -> dict[str, Any]:
        """Returns detailed scoring for the document to diagnose predictions."""
        if not self.is_trained:
            return {}

        vect = self.pipeline.named_steps["vect"]
        clf = self.pipeline.named_steps["clf"]

        words = vect.build_analyzer()(doc)
        tokens = list(set(words).intersection(vect.vocabulary_.keys()))

        try:
            probs = self.pipeline.predict_proba([doc])[0]
        except Exception:
            return {}

        sorted_indices = np.argsort(probs)[::-1]

        results: list[dict[str, Any]] = []
        for idx in sorted_indices[:5]:
            label = clf.classes_[idx]
            if label == "dummy_label":
                continue

            conf = probs[idx]

            # Find feature contributions
            feature_scores: dict[str, Any] = {}
            c_coef = clf.coef_[idx] if len(clf.classes_) > 2 else (clf.coef_[0] if idx == 1 else -clf.coef_[0])

            for w in tokens:
                f_idx = vect.vocabulary_[w]
                score = c_coef[f_idx]
                if score != 0:
                    feature_scores[w] = {"count": words.count(w), "log_prob": float(score)}

            results.append({
                "label": str(label),
                "confidence": float(conf),
                "log_prob": float(np.log(conf + 1e-10)),
                "word_scores": feature_scores,
            })

        return {"tokens": words, "top_classes": results}


class TransactionPredictor:
    """Manages ML predictors for Postings (counter accounts) and Payees."""

    def __init__(self, model_path: Path):
        self.model_path = model_path
        self.posting_predictor = LogisticRegressionPredictor()
        self.payee_predictor = LogisticRegressionPredictor()

    def train(
        self,
        entries: Iterable[Any],
        anchor_accounts: list[str],
        skip_accounts: list[str],
        remap_accounts: dict[str, str] | None = None,
        imported_entries: list[ImportedTransaction] | None = None,
    ) -> None:
        log.info(f"Training predictors using anchors: {anchor_accounts}")
        posting_docs: list[str] = []
        posting_labels: list[str] = []
        payee_docs: list[str] = []
        payee_labels: list[str] = []

        skip_set = set(skip_accounts)
        anchor_set = set(anchor_accounts)
        remap = remap_accounts or {}

        imp_index = {}
        if imported_entries:
            for imp_tx in imported_entries:
                imp_index[imp_tx.id] = imp_tx

        count = 0
        for entry in entries:
            if not isinstance(entry, Transaction):
                continue

            has_anchor = any(p.account in anchor_set for p in entry.postings)
            if not has_anchor:
                continue

            # Attempt to map to raw API data via unique IDs
            t_ids = set(entry.links)
            if entry.meta and "id" in entry.meta:
                t_ids.add(entry.meta["id"])

            imp_tx = None
            for tid in t_ids:
                if tid in imp_index:
                    imp_tx = imp_index[tid]
                    break

            doc_parts: list[str] = []
            if imp_tx:
                if imp_tx.payee:
                    doc_parts.append(str(imp_tx.payee))
                if imp_tx.narration:
                    doc_parts.append(str(imp_tx.narration))
                if imp_tx.category:
                    doc_parts.append(str(imp_tx.category))
                doc = " ".join(doc_parts)
            else:
                # Symmetrical feature extraction from Beancount ledger metadata as fallback
                cat = entry.meta.get("category", "") if entry.meta else ""

                if entry.payee:
                    doc_parts.append(entry.payee)
                if entry.narration:
                    doc_parts.append(entry.narration)
                if cat:
                    doc_parts.append(str(cat))
                doc = " ".join(doc_parts)

            # Predict Posting
            other_accounts = [
                remap.get(p.account, p.account)
                for p in entry.postings
                if p.account not in anchor_set and p.account not in skip_set
            ]
            if other_accounts:
                label = " ".join(sorted(other_accounts))
                posting_docs.append(doc)
                posting_labels.append(label)

            # Predict Payee
            if entry.payee:
                payee_docs.append(doc)
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
                doc_parts.append(str(tx.payee))
            if tx.narration:
                doc_parts.append(str(tx.narration))
            if tx.category:
                doc_parts.append(str(tx.category))
            doc = " ".join(doc_parts)

            # 1. Posting Prediction
            if not tx.counter_account:
                label, conf = self.posting_predictor.predict(doc)
                if label and conf >= min_confidence:
                    accounts = label.split(" ")
                    tx.counter_account = accounts[0]
                    tx.meta["conf_counteraccount"] = f"{label} (confidence {conf * 100:.0f}%)"
                    tx.meta["conf_debug_posting"] = doc
                    predictions_made += 1

            # 2. Payee Prediction
            p_label, p_conf = self.payee_predictor.predict(doc)
            if p_label and p_conf >= min_confidence:
                tx.payee = p_label
                tx.meta["conf_payee"] = f"{p_label} (confidence {p_conf * 100:.0f}%)"
                tx.meta["conf_debug_payee"] = doc

        log.info(f"Applied predictions to {predictions_made} / {len(imp_txns)} transactions.")

    def save(self) -> None:
        data = {
            "postings": self.posting_predictor,
            "payees": self.payee_predictor,
        }
        with self.model_path.open("wb") as f:
            joblib.dump(data, f)

    def load(self) -> None:
        if not self.model_path.exists():
            return

        try:
            with self.model_path.open("rb") as f:
                data = joblib.load(f)

            if isinstance(data, dict) and "postings" in data and "payees" in data:
                self.posting_predictor = data["postings"]
                self.payee_predictor = data["payees"]
            else:
                log.warning("Invalid model format, triggering retrain on next pass.")
        except Exception:
            log.warning("Failed to load model (likely old JSON format), triggering retrain on next pass.")
