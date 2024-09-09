document.addEventListener('DOMContentLoaded', () => {
    const profile = document.querySelector('.profile');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const manageQueriesBtn = document.getElementById('manageQueriesBtn');
    const viewReservationsBtn = document.getElementById('viewReservationsBtn');
    const manageQueriesSection = document.getElementById('manageQueries');
    const viewReservationsSection = document.getElementById('viewReservations');
    const queriesTableBody = document.getElementById('queriesTableBody');
    const jwtToken = localStorage.getItem('jwtToken');


    // Show/hide profile dropdown
profile.addEventListener('click', () => {
    profileDropdown.style.display = profileDropdown.style.display === 'none' ? 'block' : 'none';
});

// Handle logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('jwtToken');
    window.location.href = 'login.html'; // Redirect to login page
});


    // Toggle section visibility
    manageQueriesBtn.addEventListener('click', () => {
        manageQueriesSection.style.display = 'block';
        viewReservationsSection.style.display = 'none';
        fetchUserQueries();
    });

    viewReservationsBtn.addEventListener('click', () => {
        manageQueriesSection.style.display = 'none';
        viewReservationsSection.style.display = 'block';
        fetchReservations();
    });

    function fetchUserQueries() {
        console.log('Fetching user queries...'); // Debug log
        fetch('http://localhost:5786/api/user-queries', {
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        })
        .then(response => {
            console.log('Response received:', response); // Debug log
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data); // Debug log
            // Clear existing rows
            queriesTableBody.innerHTML = '';
   
            // Populate the table with query data
            data.forEach(query => {
                const row = document.createElement('tr');
   
                row.innerHTML = `
                    <td>${query.id}</td>
                    <td>${query.userId}</td>
                    <td>${query.subject}</td>
                    <td>${query.message}</td>
                    <td>${new Date(query.submissionTime).toLocaleString()}</td>
                    <td><button class="action-button" onclick="handleResponse(${query.id})">Response</button></td>
                `;
   
                queriesTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching user queries:', error));
    }
   

// Open the response modal
function handleResponse(queryId) {
    document.getElementById('queryId').value = queryId;
    document.getElementById('responseModal').style.display = 'block';
}

// Close the modal
function closeModal() {
    document.getElementById('responseModal').style.display = 'none';
}

// Submit the response
document.getElementById('responseForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const queryId = document.getElementById('queryId').value;
    const responseText = document.getElementById('responseText').value;

    const responseData = {
        queryId: queryId,
        response: responseText
    };

    // Send the response to the backend
    fetch('http://localhost:5786/api/query-responses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        },
        body: JSON.stringify(responseData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);  // Show success message
        closeModal();  // Close the modal
        // Optionally, refresh the query list here
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to submit response');
    });
});



    
    function fetchReservations() {
        const token = localStorage.getItem('jwtToken'); // Assuming JWT token is stored in localStorage
        fetch('http://localhost:5786/api/reservations/getAllReservations', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => displayReservations(data))
        .catch(error => console.error('Error fetching reservations:', error));
    }
    
    function displayReservations(reservations) {
        const reservationTableBody = document.getElementById('reservation-table-body');
        reservationTableBody.innerHTML = '';
    
        reservations.forEach(reservation => {
            const row = document.createElement('tr');
    
            row.innerHTML = `
                <td>${reservation.id}</td>
                <td>${reservation.restaurant.name}</td>
                <td>${reservation.user.id}</td>
                <td>Table ${reservation.dineinTable.tableNumber}, Seats: ${reservation.dineinTable.seats}</td>
                <td>${new Date(reservation.reservationTime).toLocaleString()}</td>
                <td>${reservation.numberOfGuests}</td>
                <td>${reservation.specialRequests || 'None'}</td>
                <td>${reservation.paymentStatus}</td>
                <td>${new Date(reservation.endTime).toLocaleString()}</td>
            `;
    
            reservationTableBody.appendChild(row);
        });
    }
    
});
