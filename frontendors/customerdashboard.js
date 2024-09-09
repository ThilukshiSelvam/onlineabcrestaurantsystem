document.addEventListener('DOMContentLoaded', () => {
    const profile = document.querySelector('.profile');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const manageQueriesBtn = document.getElementById('manageQueriesBtn');
    const viewMadeReservationsBtn = document.getElementById('viewMadeReservationsBtn');
    const MakeReservationsBtn = document.getElementById('MakeReservationsBtn');
    const manageQueriesSection = document.getElementById('manageQueries');
    const viewMadeReservationsSection = document.getElementById('viewMadeReservations');
    const MakeReservationsSection = document.getElementById('MakeReservations');
    const jwtToken = localStorage.getItem('jwtToken');
    const logoutBtn = document.getElementById('logoutBtn');
    const restaurantCardsContainer = document.getElementById('restaurantCards');
    const reservationModal = document.getElementById('reservationModal');
    const dineinTableSelect = document.getElementById('dineinTable');
    const reservationForm = document.getElementById('reservationForm');

    let availableTables = []; // Define availableTables in a higher scope

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
        viewMadeReservationsSection.style.display = 'none';
        MakeReservationsSection.style.display = 'none';
    });

    viewMadeReservationsBtn.addEventListener('click', () => {
        manageQueriesSection.style.display = 'none';
        viewMadeReservationsSection.style.display = 'block';
        MakeReservationsSection.style.display = 'none';
    });

    MakeReservationsBtn.addEventListener('click', () => {
        manageQueriesSection.style.display = 'none';
        viewMadeReservationsSection.style.display = 'none';
        MakeReservationsSection.style.display = 'block';
        fetchRestaurants();
    });

    // Function to fetch all restaurants
    async function fetchRestaurants() {
        try {
            const response = await fetch('http://localhost:5786/api/restaurants/getAllRestaurants', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':  `Bearer ${jwtToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch restaurants');
            }
            const restaurants = await response.json();
            displayRestaurants(restaurants);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Function to display restaurants as cards
    function displayRestaurants(restaurants) {
        restaurantCardsContainer.innerHTML = ''; // Clear any existing content
        restaurants.forEach(restaurant => {
            const card = document.createElement('div');
            card.className = 'restaurant-card';
            card.dataset.restaurantId = restaurant.id;
            card.innerHTML = `
                <h3>${restaurant.name}</h3>
            `;
            card.addEventListener('click', () => selectRestaurant(restaurant.id));
            restaurantCardsContainer.appendChild(card);
        });
    }

    // Function to handle restaurant selection
    async function selectRestaurant(restaurantId) {
        // Store the selected restaurant ID in the hidden input field
        document.getElementById('selectedRestaurantId').value = restaurantId;

        // Fetch and populate the tables for the selected restaurant
        await fetchDineinTables(restaurantId);

        // Show the reservation form modal
        reservationModal.style.display = 'block';
    }

    // Function to fetch dine-in tables based on the selected restaurant
    async function fetchDineinTables(restaurantId) {
        try {
            const response = await fetch('http://localhost:5786/api/tables/getAllDineinTables', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':  `Bearer ${jwtToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch dine-in tables');
            }
            const dineinTables = await response.json();
            populateDineinTables(dineinTables, restaurantId);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Function to populate the dine-in tables dropdown
    function populateDineinTables(dineinTables, restaurantId) {
        dineinTableSelect.innerHTML = ''; // Clear any existing options
    
        availableTables = dineinTables
            .filter(table => table.restaurantId === restaurantId && table.available);
    
        if (availableTables.length === 0) {
            alert("No tables available for this restaurant. Sorry! 😔 Please check our other restaurants.");
            reservationModal.style.display = 'none';  // Closing the modal
            return;
        }
            
        availableTables.forEach(table => {
            const option = document.createElement('option');
            option.value = table.id;
            option.textContent = `Table ${table.tableNumber} (Seats: ${table.seats})`;
            dineinTableSelect.appendChild(option);
        });
    }

    // Event listener to close the modal
    document.querySelector('.close-button').addEventListener('click', function() {
        reservationModal.style.display = 'none';
    });

    // Event listener to handle reservation form submission
    reservationForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Get the selected dine-in table and number of guests
        const selectedTableId = document.getElementById('dineinTable').value;
        const numberOfGuests = parseInt(document.getElementById('numberOfGuests').value, 10);

        // Find the selected table's data
        const selectedTable = availableTables.find(table => table.id == selectedTableId);

        if (!selectedTable) {
            alert('Selected table is not available.');
            return;
        }

        // Check if the number of guests exceeds the table's seat capacity
        if (numberOfGuests > selectedTable.seats) {
            alert(`The selected table only has ${selectedTable.seats} seats available. Please reduce the number of guests or choose a different table.`);
            return;
        }

        // Get selected payment method
        const paymentMethod = document.getElementById('paymentMethod').value;

        // Set payment status based on the selected method
        let paymentStatus = 'paid'; // Since any selected method means it's paid

        // Prepare the reservation data
        const reservationData = {
            restaurantId: document.getElementById('selectedRestaurantId').value,
            dineinTableId: selectedTableId,
            reservationTime: document.getElementById('reservationTime').value,
            numberOfGuests: numberOfGuests,
            specialRequests: document.getElementById('specialRequests').value,
            paymentMethod: paymentMethod,
            paymentStatus: paymentStatus // Include payment status
        };

        // Submit the reservation data
        fetch('http://localhost:5786/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}` // If JWT is used
            },
            body: JSON.stringify(reservationData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message); // Handle any error messages from backend
            } else {
                alert('Reservation successfully created!');
                reservationModal.style.display = 'none'; // Close modal on success
            }
        })
        .catch(error => {
            console.error('Error creating reservation:', error);
        });
    });
});
