let chart;
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const text = document.getElementById("text");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const category = document.getElementById("category");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("list");
const emptyMsg = document.getElementById("empty-msg");

const mpesaText = document.getElementById("mpesa-text");
const parseBtn = document.getElementById("parse-btn");

// INIT
refreshUI();

// EVENTS
addBtn.addEventListener("click", addTransaction);

document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") addTransaction();
});

parseBtn.addEventListener("click", parseMpesa);

// ADD TRANSACTION
function addTransaction() {
  const textValue = text.value.trim();
  const amountValue = +amount.value;
  const typeValue = type.value;
  const categoryValue = category.value;

  if (!textValue || !amountValue) {
    alert("Please enter all fields");
    return;
  }

  const transaction = {
    id: Date.now(),
    text: textValue,
    amount: amountValue,
    type: typeValue,
    category: categoryValue
  };

  transactions.push(transaction);

  saveToLocalStorage();
  refreshUI();

  text.value = "";
  amount.value = "";
}

// DELETE
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);

  saveToLocalStorage();
  refreshUI();
}

// REFRESH UI
function refreshUI() {
  list.innerHTML = "";

  if (transactions.length === 0) {
    emptyMsg.style.display = "block";
  } else {
    emptyMsg.style.display = "none";
  }

  transactions.forEach(addTransactionToDOM);
  updateValues();
  renderChart(); // 🔥 ADD THIS
}

// ADD TO DOM
function addTransactionToDOM(transaction) {
  const li = document.createElement("li");

  li.classList.add(transaction.type);

  li.innerHTML = `
    <span>
      ${transaction.text}
      <span class="category">(${transaction.category})</span>
    </span>
    <span>
      Ksh ${transaction.amount}
      <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">x</button>
    </span>
  `;

  list.appendChild(li);
}

type.addEventListener("change", () => {
  if (type.value === "income") {
    category.disabled = true;
    category.value = "Other";
  } else {
    category.disabled = false;
  }
});

// UPDATE TOTALS
function updateValues() {
  const amounts = transactions.map(t =>
    t.type === "expense" ? -t.amount : t.amount
  );

  const total = amounts.reduce((a, b) => a + b, 0);
  const income = amounts.filter(a => a > 0).reduce((a, b) => a + b, 0);
  const expense = amounts.filter(a => a < 0).reduce((a, b) => a + b, 0);

  document.getElementById("balance").innerText = `Ksh ${total}`;
  document.getElementById("income").innerText = `Ksh ${income}`;
  document.getElementById("expenses").innerText = `Ksh ${Math.abs(expense)}`;
}

// SAVE
function saveToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// M-PESA PARSER
function parseMpesa() {
  const msg = mpesaText.value;

  if (!msg) {
    alert("Paste M-Pesa message first");
    return;
  }

  const amountMatch = msg.match(/Ksh\s?([\d,]+)/i);
  const amountValue = amountMatch ? amountMatch[1].replace(/,/g, "") : "";

  const lowerMsg = msg.toLowerCase();
  const typeValue = lowerMsg.includes("received") ? "income" : "expense";

  document.getElementById("amount").value = amountValue;
  document.getElementById("type").value = typeValue;
  document.getElementById("text").value = "M-Pesa Transaction";
}

function renderChart() {
  const expenseData = {};

  transactions.forEach(t => {
    if (t.type === "expense") {
      if (!expenseData[t.category]) {
        expenseData[t.category] = 0;
      }
      expenseData[t.category] += t.amount;
    }
  });

  const labels = Object.keys(expenseData);
  const data = Object.values(expenseData);

  const ctx = document.getElementById("expenseChart").getContext("2d");

  // Destroy old chart before creating new one
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Expenses by Category",
          data: data
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

const toggleBtn = document.getElementById("theme-toggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggleBtn.textContent = "☀️";
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    toggleBtn.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    toggleBtn.textContent = "🌙";
  }
});

