document.addEventListener('DOMContentLoaded', () => {
  let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  let total = 0;

  // DOM Elements
  const form = document.getElementById('expenseForm');
  const descriptionInput = document.getElementById('description');
  const amountInput = document.getElementById('amount');
  const dateInput = document.getElementById('date');
  const categoryInput = document.getElementById('category');
  const expensesList = document.getElementById('expensesList');
  const totalExpensesEl = document.getElementById('totalExpenses');

  // Set today's date
  dateInput.value = new Date().toISOString().split('T')[0];

  // Render expenses
  function renderExpenses() {
    expensesList.innerHTML = '';
    total = 0;

    if (expenses.length === 0) {
      expensesList.innerHTML = '<li class="no-expenses">No expenses added yet. Start tracking!</li>';
      updateTotal();
      return;
    }

    expenses.forEach((expense, index) => {
      const li = document.createElement('li');
      li.className = 'expense-item';
      li.innerHTML = `
        <div class="expense-details">
          <div class="expense-desc">${expense.description}</div>
          <div class="expense-meta">
            ${expense.date} | ${expense.category || 'Uncategorized'}
          </div>
        </div>
        <div class="expense-amount">₹${parseFloat(expense.amount).toFixed(2)}</div>
        <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
      `;
      expensesList.appendChild(li);
      total += parseFloat(expense.amount);
    });

    updateTotal();
    saveToStorage();
  }

  // Update total display
  function updateTotal() {
    totalExpensesEl.textContent = `₹${total.toFixed(2)}`;
  }

  // Save to localStorage
  function saveToStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

  // Delete expense (exposed globally for onclick)
  window.deleteExpense = function(index) {
    if (confirm('Are you sure you want to delete this expense?')) {
      expenses.splice(index, 1);
      renderExpenses();
    }
  };

  // Add expense
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;
    const category = categoryInput.value;

    if (!description || isNaN(amount) || amount <= 0 || !date) {
      alert("Please fill out all required fields with valid data.");
      return;
    }

    const expense = { description, amount, date, category };
    expenses.push(expense);
    renderExpenses();

    form.reset();
    dateInput.value = new Date().toISOString().split('T')[0];
    descriptionInput.focus();
  });

  // Initial render
  renderExpenses();
});