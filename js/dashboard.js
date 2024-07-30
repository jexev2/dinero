// dashboard.js: Funcionalidad específica para dashboard.html

document.addEventListener('DOMContentLoaded', function() {
    const username = 'usuario1'; // Este sería el nombre de usuario del usuario logueado

    // Cargar perfil de usuario y transacciones
    loadUserProfile(username);
    loadUserTransactions(username);
});

// Función para cargar el perfil del usuario
function loadUserProfile(username) {
    fetch('users.json')
        .then(response => response.json())
        .then(users => {
            const user = users.find(u => u.username === username);
            if (user) {
                document.getElementById('profileImage').src = user.profileImage;
                document.getElementById('username').innerText = user.username;
                document.getElementById('email').innerText = user.email;
                document.getElementById('balance').innerText = `$${user.balance.toFixed(2)}`;
                document.getElementById('interestEarned').innerText = `$${user.interestEarned.toFixed(2)}`;

                // Renderizar el gráfico de ganancias
                renderChart({
                    labels: ['Jul 1', 'Jul 2', 'Jul 3', 'Jul 4', 'Jul 5'], // Ejemplo de fechas
                    values: [0, 1.50, 3.00, 4.50, 6.00] // Ejemplo de ganancias acumuladas
                });
            } else {
                console.error('Usuario no encontrado');
            }
        })
        .catch(error => console.error('Error al cargar los datos de usuario:', error));
}

// Función para cargar las transacciones del usuario
function loadUserTransactions(username) {
    fetch('transactions.json')
        .then(response => response.json())
        .then(transactions => {
            const userTransactions = transactions.filter(t => t.username === username);
            if (userTransactions.length > 0) {
                const transactionsList = document.getElementById('transactionsList');
                transactionsList.innerHTML = '';

                userTransactions.forEach(transaction => {
                    const listItem = document.createElement('li');
                    listItem.innerText = `${transaction.date} - ${transaction.description}: $${transaction.amount.toFixed(2)}`;
                    transactionsList.appendChild(listItem);
                });
            } else {
                console.log('No se encontraron transacciones para el usuario');
            }
        })
        .catch(error => console.error('Error al cargar las transacciones:', error));
}

// Función para renderizar el gráfico de ganancias
function renderChart(data) {
    const ctx = document.getElementById('earningsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Ganancias',
                data: data.values,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}