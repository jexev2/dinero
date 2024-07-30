// Función para cargar perfil de usuario
function loadUserProfile() {
    const username = localStorage.getItem('authenticatedUser');
    if (!username) {
        window.location.href = 'login.html';
        return;
    }

    fetch('data/users.json')
        .then(response => response.json())
        .then(users => {
            const user = users.find(u => u.username === username);
            if (user) {
                document.getElementById('profileName').textContent = user.username;
                document.getElementById('profileEmail').textContent = user.email;
                document.getElementById('profileImage').src = user.profileImage;
                document.getElementById('accountBalance').textContent = `$${user.balance.toFixed(2)}`;
                document.getElementById('interestEarned').textContent = `$${user.interestEarned.toFixed(2)}`;
            }
        })
        .catch(error => console.error('Error al cargar el perfil de usuario:', error));
}

// Función para cargar transacciones de usuario
function loadUserTransactions() {
    const username = localStorage.getItem('authenticatedUser');
    fetch('data/transactions.json')
        .then(response => response.json())
        .then(transactions => {
            const userTransactions = transactions.find(t => t.username === username).transactions;
            const transactionsList = document.getElementById('transactionsList');
            transactionsList.innerHTML = '';
            userTransactions.forEach(transaction => {
                const listItem = document.createElement('li');
                listItem.textContent = `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}: $${transaction.amount.toFixed(2)} - ${transaction.date}`;
                transactionsList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error al cargar transacciones:', error));
}

// Función para manejar el cierre de sesión
function logout() {
    localStorage.removeItem('authenticatedUser');
    window.location.href = 'login.html';
}

// Inicializar el perfil y transacciones si el usuario está autenticado
document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
    loadUserTransactions();
});

// Función para inicializar el gráfico de ganancias
function initializeEarningsChart() {
    const ctx = document.getElementById('earningsChart').getContext('2d');

    // Datos de ejemplo para el gráfico (estos deberían ser dinámicos según tus datos)
    const earningsData = {
        labels: [], // Aquí se añadirán las fechas
        datasets: [{
            label: 'Ganancias',
            data: [], // Aquí se añadirán las ganancias
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false
        }]
    };

    const earningsChart = new Chart(ctx, {
        type: 'line',
        data: earningsData,
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    title: {
                        display: true,
                        text: 'Fecha'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Ganancias ($)'
                    },
                    beginAtZero: true
                }
            }
        }
    });

    // Función para actualizar los datos del gráfico con las ganancias reales
    function updateEarningsData(user) {
        const now = new Date();
        earningsData.labels.push(now);
        earningsData.datasets[0].data.push(user.interestEarned);

        earningsChart.update();
    }

    // Llamar a la función para cargar los datos iniciales del usuario
    fetch('data/users.json')
        .then(response => response.json())
        .then(users => {
            const username = localStorage.getItem('authenticatedUser');
            const user = users.find(u => u.username === username);
            if (user) {
                updateEarningsData(user);
            }
        })
        .catch(error => console.error('Error al cargar el perfil de usuario:', error));
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    initializeEarningsChart();
});