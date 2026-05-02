let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("list");


const addbtn = document.getElementById("add-btn");
addbtn.addEventListener("click", addTransaction);

function addTransaction() {
  const textValue = text.value;
  const amountValue = amount.value;
  const typeValue = type.value;

  if (textValue === "" || amountValue === "") {
    alert("Please enter all fields");
    return;
  }

  const li = document.createElement("li");

  li.classList.add(typeValue); // adds 'income' or 'expense'

  li.innerHTML = `
    ${textValue} - Ksh ${amountValue}
    <button class="delete-btn">x</button>
  `;

  list.appendChild(li);

  // clear inputs
  text.value = "";
  amount.value = "";
}

document.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    addTransaction();
  }
});

function addTransaction() {
  const textValue = text.value;
  const amountValue = +amount.value; // + converts to number
  const typeValue = type.value;

  if (textValue === "" || amountValue === "") {
    alert("Please enter all fields");
    return;
  }

  const transaction = {
    id: Date.now(),
    text: textValue,
    amount: amountValue,
    type: typeValue
  };

  transactions.push(transaction);

  addTransactionToDOM(transaction);

  updateValues();

  text.value = "";
  amount.value = "";
}

function addTransactionToDOM(transaction) {
  const li = document.createElement("li");

  li.classList.add(transaction.type);

  li.innerHTML = `
    ${transaction.text} - Ksh ${transaction.amount}
    <button class="delete-btn">x</button>
  `;

  list.appendChild(li);
}

function updateValues() {
  const amounts = transactions.map(t => t.type === "expense" ? -t.amount : t.amount);

  const total = amounts.reduce((acc, item) => acc + item, 0);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => acc + item, 0);

  const expense = amounts
    .filter(item => item < 0)
    .reduce((acc, item) => acc + item, 0);

  document.getElementById("balance").innerText = `Ksh ${total}`;
  document.getElementById("income").innerText = `Ksh ${income}`;
  document.getElementById("expenses").innerText = `Ksh ${Math.abs(expense)}`;
}

function addTransactionToDOM(transaction) {
  const li = document.createElement("li");

  li.classList.add(transaction.type);

  li.innerHTML = `
    ${transaction.text} - Ksh ${transaction.amount}
    <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(li);
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);

  refreshUI();
}

function refreshUI() {
  list.innerHTML = "";

  transactions.forEach(addTransactionToDOM);

  updateValues();
}

function saveToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function addTransaction() {
  const textValue = text.value;
  const amountValue = +amount.value;
  const typeValue = type.value;

  if (textValue === "" || amountValue === "") {
    alert("Please enter all fields");
    return;
  }

  const transaction = {
    id: Date.now(),
    text: textValue,
    amount: amountValue,
    type: typeValue
  };

  transactions.push(transaction);

  saveToLocalStorage(); // 🔥 ADD THIS

  refreshUI();

  text.value = "";
  amount.value = "";
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);

  saveToLocalStorage(); // 🔥 ADD THIS

  refreshUI();
}

refreshUI();

const mpesaText = document.getElementById("mpesa-text");
const parseBtn = document.getElementById("parse-btn");

parseBtn.addEventListener("click", parseMpesa);

function parseMpesa() {
  const msg = mpesaText.value;

  if (!msg) {
    alert("Paste M-Pesa message first");
    return;
  }

  // Extract amount
  let amountMatch = msg.match(/Ksh\s?([\d,]+)/i);
  let amount = amountMatch ? amountMatch[1].replace(/,/g, "") : "";

  // Detect type
  let lowerMsg = msg.toLowerCase();
  let typeValue = lowerMsg.includes("received") ? "income" : "expense";

  // Fill form automatically
  document.getElementById("amount").value = amount;
  document.getElementById("type").value = typeValue;

  // Optional: auto description
  document.getElementById("text").value = "M-Pesa Transaction";
}