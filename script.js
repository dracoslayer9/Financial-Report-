document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("financial-form");
    const reportBody = document.getElementById("report-body");
    const totalBalanceEl = document.getElementById("total-balance");

    let totalBalance = 0;
    let incomeData = 0;
    let expenseData = {};
    
    // Initialize Chart
    const ctx = document.getElementById("financialChart").getContext("2d");
    let financialChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Income", "Expenses"],
            datasets: [{
                label: "Income vs Expenses",
                data: [0, 0], 
                backgroundColor: ["#28a745", "#ff4757"],
            }]
        }
    });

    function updateChart() {
        financialChart.data.datasets[0].data = [incomeData, Object.values(expenseData).reduce((a, b) => a + b, 0)];
        financialChart.update();
    }

    function updateBalance() {
        totalBalanceEl.textContent = totalBalance.toFixed(2);
    }

    function addRow(date, description, income, expenseCategory, expense) {
        const row = document.createElement("tr");
        const balance = income - expense;
        totalBalance += balance;
        incomeData += income;

        if (expenseCategory) {
            expenseData[expenseCategory] = (expenseData[expenseCategory] || 0) + expense;
        }

        row.innerHTML = `
            <td>${date}</td>
            <td>${description}</td>
            <td>${income.toFixed(2)}</td>
            <td>${expenseCategory || "N/A"}</td>
            <td>${expense.toFixed(2)}</td>
            <td>${balance.toFixed(2)}</td>
            <td><button class="delete-btn">Delete</button></td>
        `;

        row.querySelector(".delete-btn").addEventListener("click", function () {
            totalBalance -= balance;
            incomeData -= income;
            if (expenseCategory) {
                expenseData[expenseCategory] -= expense;
            }
            row.remove();
            updateBalance();
            updateChart();
        });

        reportBody.appendChild(row);
        updateBalance();
        updateChart();
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const date = document.getElementById("date").value;
        const description = document.getElementById("description").value;
        const income = parseFloat(document.getElementById("income").value) || 0;
        const expenseCategory = document.getElementById("expense-category").value;
        const expense = parseFloat(document.getElementById("expense").value) || 0;

        if (!date || !description) {
            alert("Please fill in all fields.");
            return;
        }

        addRow(date, description, income, expenseCategory, expense);
        form.reset();
    });
});