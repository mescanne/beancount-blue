/**
 * Beancount Blue Clearing House JS
 */

export default {
    init: async function() {
        console.log("Clearing House JS Initialized");
        const root = document.getElementById('clearing-house-root');
        if (!root) return;

        const extBaseUrl = window.location.pathname.split("extension/")[0] + "extension/BankSync/";
        const getTransactionsUrl = extBaseUrl + "get_transactions";
        const commitTransactionsUrl = extBaseUrl + "commit_transactions";

        let transactionsData = {};
        let currentAccount = null;

        // Fava ledger data for auto-complete
        let ledgerData = { accounts: [], payees: [] };
        try {
            const dataEl = document.getElementById('ledger-data');
            if (dataEl) {
                ledgerData = JSON.parse(dataEl.textContent);
            }
        } catch (e) {
            console.error("Failed to parse ledger data for autocomplete:", e);
        }

        async function loadData() {
            try {
                const res = await fetch(getTransactionsUrl);
                const data = await res.json();
                if (data.status === 'success') {
                    transactionsData = data.accounts;
                    renderSidebar();
                } else {
                    document.getElementById('ch-queues').innerHTML = `<p style="color:var(--color-background-negative);">Error: ${data.message}</p>`;
                }
            } catch (e) {
                document.getElementById('ch-queues').innerHTML = `<p style="color:var(--color-background-negative);">Failed to load transactions. Check console.</p>`;
                console.error("Fetch error:", e);
            }
        }

        function formatAccountName(acc) {
            const parts = acc.split(':');
            if (parts.length > 2) {
                return parts.slice(-2).join(':');
            }
            return acc;
        }

        function renderSidebar() {
            const sidebar = document.getElementById('ch-queues');
            sidebar.innerHTML = '';

            const accounts = Object.keys(transactionsData);
            if (accounts.length === 0) {
                sidebar.innerHTML = '<p>No pending transactions.</p>';
                document.getElementById('ch-main').innerHTML = `
                    <div style="text-align: center; margin-top: 20%;">
                        <h2>All caught up! 🎉</h2>
                        <p>No transactions awaiting review.</p>
                    </div>`;
                return;
            }

            accounts.forEach(acc => {
                const count = transactionsData[acc].length;
                const div = document.createElement('div');
                div.className = 'ch-account-item';
                div.innerHTML = `
                    <div style="font-weight: 500;">${formatAccountName(acc)}</div>
                    <small style="color: var(--color-text-lighter);">${count} pending</small>
                `;
                div.onclick = () => {
                    document.querySelectorAll('.ch-account-item').forEach(el => el.classList.remove('active'));
                    div.classList.add('active');
                    currentAccount = acc;
                    renderGrid(acc);
                };
                if (currentAccount === acc) {
                    div.classList.add('active');
                }
                sidebar.appendChild(div);
            });

            if (currentAccount && transactionsData[currentAccount]) {
                renderGrid(currentAccount);
            }
        }

        window.toggleCHDetail = function(idx, btn) {
            const row = document.getElementById('detail-' + idx);
            if (row) {
                row.classList.toggle('open');
                btn.classList.toggle('open');
            }
        };

        window.addPosting = function(idx) {
            const tx = transactionsData[currentAccount][idx];
            tx.postings.push({ account: "", amount: "", currency: "" });
            renderGrid(currentAccount);
            // Re-open detail
            const row = document.getElementById('detail-' + idx);
            if (row) {
                row.classList.add('open');
                document.getElementById('btn-expander-' + idx).classList.add('open');
            }
        };

        window.removePosting = function(txIdx, pIdx) {
            const tx = transactionsData[currentAccount][txIdx];
            tx.postings.splice(pIdx, 1);
            renderGrid(currentAccount);
            const row = document.getElementById('detail-' + txIdx);
            if (row) {
                row.classList.add('open');
                document.getElementById('btn-expander-' + txIdx).classList.add('open');
            }
        };

        window.updateTxField = function(idx, field, value) {
            transactionsData[currentAccount][idx][field] = value;
        };

        window.updatePostingField = function(txIdx, pIdx, field, value) {
            transactionsData[currentAccount][txIdx].postings[pIdx][field] = value;
        };

        window.commitQueue = async function() {
            if (!currentAccount) return;
            const txns = transactionsData[currentAccount];

            // Validate all transactions balance
            for (let i = 0; i < txns.length; i++) {
                const tx = txns[i];
                if (tx.type === "Transaction") {
                    let sum = 0.0;
                    tx.postings.forEach(p => {
                        if (p.amount) {
                            sum += parseFloat(p.amount) || 0.0;
                        }
                    });
                    if (Math.abs(sum) > 0.001) {
                        alert(`Transaction on ${tx.date} (${tx.payee}) does not balance. Sum: ${sum}`);
                        return;
                    }
                }
            }

            const btn = document.getElementById('btn-commit-queue');
            const originalText = btn.innerText;
            btn.disabled = true;
            btn.innerText = "Committing...";

            try {
                const res = await fetch(commitTransactionsUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ transactions: txns })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    delete transactionsData[currentAccount];
                    currentAccount = null;
                    renderSidebar();
                    if (Object.keys(transactionsData).length === 0) {
                        document.getElementById('ch-main').innerHTML = `
                            <div style="text-align: center; margin-top: 20%;">
                                <h2>Queue Committed! 🎉</h2>
                                <p>Transactions saved successfully.</p>
                            </div>`;
                    }
                } else {
                    alert("Commit failed: " + data.message);
                }
            } catch (err) {
                alert("Commit error: " + err.message);
            } finally {
                if (document.getElementById('btn-commit-queue')) {
                    btn.disabled = false;
                    btn.innerText = originalText;
                }
            }
        };

        function renderGrid(account) {
            const main = document.getElementById('ch-main');
            const txns = transactionsData[account];

            let html = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h2 style="margin: 0;">Reviewing: ${formatAccountName(account)}</h2>
                    <div>
                        <span style="color: var(--color-text-lighter); font-weight: 500; margin-right: 15px;">${txns.length} entries</span>
                        <button id="btn-commit-queue" class="btn btn-primary" onclick="window.commitQueue()">Commit Queue</button>
                    </div>
                </div>
            `;

            html += `<table class="ch-grid">
                <thead>
                    <tr>
                        <th style="width: 40px; text-align: center;">#</th>
                        <th style="width: 100px;">Date</th>
                        <th>Payee & Narration</th>
                        <th style="width: 250px;">Account (Predicted)</th>
                        <th style="width: 100px; text-align: right;">Amount</th>
                    </tr>
                </thead>
                <tbody>`;

            txns.forEach((tx, idx) => {
                if (tx.type === "Transaction") {
                    const confClass = tx.confidence >= 0.90 ? 'confidence-high' : 'confidence-low';
                    const confidencePct = (tx.confidence * 100).toFixed(0);

                    // Determine main account to show in grid
                    let displayAcc = tx.postings.length > 1 ? tx.postings[1].account : "";
                    let displayAmt = tx.postings.length > 0 ? tx.postings[0].amount : "";
                    let displayCur = tx.postings.length > 0 ? tx.postings[0].currency : "";

                    html += `
                        <tr>
                            <td class="${confClass}" style="text-align: center;">
                                <button id="btn-expander-${idx}" class="ch-btn-expander" onclick="window.toggleCHDetail(${idx}, this)">▶</button>
                            </td>
                            <td><input type="date" value="${tx.date}" onchange="window.updateTxField(${idx}, 'date', this.value)" style="width: 110px; border:none; background:transparent;"></td>
                            <td>
                                <input type="text" value="${tx.payee}" placeholder="Payee" onchange="window.updateTxField(${idx}, 'payee', this.value)" list="ch-payees" style="font-weight: 500; width: 100%; border:none; background:transparent;">
                                <input type="text" value="${tx.narration}" placeholder="Narration" onchange="window.updateTxField(${idx}, 'narration', this.value)" style="font-size: 0.9em; color: var(--color-text-lighter); width: 100%; border:none; background:transparent; margin-top:2px;">
                            </td>
                            <td>
                                <div style="font-weight: 500;">${displayAcc.split(':').slice(-2).join(':')}</div>
                                <div style="font-size: 0.85em; color: var(--color-text-lighter);">Confidence: ${confidencePct}%</div>
                            </td>
                            <td style="text-align: right; font-variant-numeric: tabular-nums; font-weight: 500;">
                                ${displayAmt} ${displayCur}
                            </td>
                        </tr>
                        <tr class="detail-row" id="detail-${idx}">
                            <td colspan="5">
                                <div class="detail-content" style="padding: 15px; border-radius: 6px; background: var(--color-sidebar-background);">
                                    <div style="margin-bottom: 10px; display:flex; justify-content: space-between;">
                                        <strong>Postings</strong>
                                        <button class="btn" onclick="window.addPosting(${idx})" style="padding: 2px 8px; font-size: 0.85em;">+ Add Posting</button>
                                    </div>
                                    <table style="width: 100%; margin-bottom: 10px;">
                    `;

                    tx.postings.forEach((p, pIdx) => {
                        html += `
                            <tr>
                                <td style="padding: 4px;">
                                    <input type="text" value="${p.account}" onchange="window.updatePostingField(${idx}, ${pIdx}, 'account', this.value)" list="ch-accounts" style="width: 100%; padding: 4px;" placeholder="Account">
                                </td>
                                <td style="padding: 4px; width: 120px;">
                                    <input type="text" value="${p.amount}" onchange="window.updatePostingField(${idx}, ${pIdx}, 'amount', this.value)" style="width: 100%; padding: 4px; text-align: right;" placeholder="Amount">
                                </td>
                                <td style="padding: 4px; width: 60px;">
                                    <input type="text" value="${p.currency}" onchange="window.updatePostingField(${idx}, ${pIdx}, 'currency', this.value)" style="width: 100%; padding: 4px;" placeholder="Cur">
                                </td>
                                <td style="padding: 4px; width: 30px; text-align: center;">
                                    <button onclick="window.removePosting(${idx}, ${pIdx})" style="color: var(--color-background-negative); border: none; background: transparent; cursor: pointer;">&times;</button>
                                </td>
                            </tr>
                        `;
                    });

                    html += `
                                    </table>
                                </div>
                            </td>
                        </tr>
                    `;
                } else if (tx.type === "Balance") {
                    html += `
                        <tr style="background: var(--color-sidebar-background);">
                            <td style="text-align: center;">⚖️</td>
                            <td>${tx.date}</td>
                            <td colspan="2">
                                <strong>Expected Balance</strong> for ${tx.account.split(':').slice(-2).join(':')}
                            </td>
                            <td style="text-align: right; font-variant-numeric: tabular-nums; font-weight: bold;">
                                ${tx.amount} ${tx.currency}
                            </td>
                        </tr>
                    `;
                }
            });

            html += `</tbody></table>`;

            // Datalists for autocomplete
            html += `<datalist id="ch-accounts">`;
            ledgerData.accounts.forEach(acc => {
                html += `<option value="${acc}">`;
            });
            html += `</datalist>`;

            html += `<datalist id="ch-payees">`;
            ledgerData.payees.forEach(p => {
                html += `<option value="${p}">`;
            });
            html += `</datalist>`;

            main.innerHTML = html;
        }

        loadData();
    }
};
