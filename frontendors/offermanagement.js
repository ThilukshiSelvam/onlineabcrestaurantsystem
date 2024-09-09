document.addEventListener('DOMContentLoaded', function() {
    const manageOffersButton = document.getElementById('manageOffersButton');
    const manageOffersSection = document.getElementById('manageOffersSection');
    const createOfferForm = document.getElementById('offerForm');
    const cancelOfferButton = document.getElementById('cancelOfferButton');
    const searchOffersButton = document.getElementById('searchOffersButton');
    const searchInput = document.getElementById('searchInput');
    const offersTableBody = document.getElementById('offersTableBody');
    const updateOfferPopup = document.getElementById('updateOfferPopup');
    const updateOfferForm = document.getElementById('updateOfferForm');
    const closeUpdatePopup = document.getElementById('closeUpdatePopup');
    const offerupdateRestaurantId = document.getElementById('offerupdateRestaurantId');
    const restaurantSelect = document.getElementById('restaurantId');

    let currentOfferId = null;

    manageOffersButton.addEventListener('click', function() {
        manageOffersSection.style.display = "block";
        staffManagement.style.display = 'none';
        restaurantManagement.style.display = 'none';
        categoryManagement.style.display = 'none';
        document.getElementById("dineinTablesSection").style.display = "none";
        document.getElementById("facilityManagementSection").style.display = "none";
        foodManagementSection.style.display = 'none';
        offerRestaurants();
        loadOffers();
    });

    cancelOfferButton.addEventListener('click', function() {
        createOfferForm.reset();
    });

    searchOffersButton.addEventListener('click', function() {
        loadOffers(searchInput.value);
    });

    function offerRestaurants() {
        fetch('http://localhost:5786/api/admin/restaurants/getAllRestaurants', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const restaurants = data;
            restaurantSelect.innerHTML = '';
            offerupdateRestaurantId.innerHTML = '';
            restaurants.forEach(restaurant => {
                const option = document.createElement('option');
                option.value = restaurant.id;
                option.textContent = restaurant.name;
                restaurantSelect.appendChild(option);
                const updateOption = document.createElement('option');
                updateOption.value = restaurant.id;
                updateOption.textContent = restaurant.name;
                offerupdateRestaurantId.appendChild(updateOption);
            });
        })
        .catch(error => console.error('Error fetching restaurants:', error));
    }

    function loadOffers(restaurantId = '') {
        const url = restaurantId ? 
            `http://localhost:5786/api/admin/offers/restaurant/${restaurantId}` : 
            'http://localhost:5786/api/admin/offers/getAlloffers';

        fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const offers = data.offers || [];
            offersTableBody.innerHTML = '';
            offers.forEach(offer => {
                const startDate = new Date(offer.startDate);
                const endDate = new Date(offer.endDate);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${offer.id}</td>
                    <td>${offer.title}</td>
                    <td>${offer.description}</td>
                    <td>${offer.discountPercentage}</td>
                    <td>${isNaN(startDate) ? 'Invalid Date' : startDate.toLocaleString()}</td>
                    <td>${isNaN(endDate) ? 'Invalid Date' : endDate.toLocaleString()}</td>
                    <td>${offer.restaurant.name}</td>
                    <td>
                        <button class="updateOfferButton" data-id="${offer.id}">Update</button>
                        <button class="deleteOfferButton" data-id="${offer.id}">Delete</button>
                    </td>
                `;
                offersTableBody.appendChild(row);
            });

            document.querySelectorAll('.updateOfferButton').forEach(button => {
                button.addEventListener('click', function() {
                    editOffer(this.dataset.id);
                });
            });

            document.querySelectorAll('.deleteOfferButton').forEach(button => {
                button.addEventListener('click', function() {
                    deleteOffer(this.dataset.id);
                });
            });
        })
        .catch(error => console.error('Error loading offers:', error));
    }

    window.editOffer = function(id) {
        fetch(`http://localhost:5786/api/admin/offers/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const offer = data;
            document.getElementById('updateOfferId').value = offer.id;
            document.getElementById('updateTitle').value = offer.title;
            document.getElementById('updateDescription').value = offer.description;
            document.getElementById('updateDiscountPercentage').value = offer.discountPercentage;
            document.getElementById('updateStartDate').value = new Date(offer.startDate).toISOString().slice(0, 16);
            document.getElementById('updateEndDate').value = new Date(offer.endDate).toISOString().slice(0, 16);
            document.getElementById('offerupdateRestaurantId').value = offer.restaurant.id;
            updateOfferPopup.classList.remove('hidden');
            currentOfferId = id;
        })
        .catch(error => console.error('Error fetching offer:', error));
    };

    window.deleteOffer = function(id) {
        fetch(`http://localhost:5786/api/admin/offers/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        })
        .then(response => response.json())
        .then(() => {
            loadOffers(searchInput.value);
        })
        .catch(error => console.error('Error deleting offer:', error));
    };

    updateOfferForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const offer = {
            title: document.getElementById('updateTitle').value,
            description: document.getElementById('updateDescription').value,
            discountPercentage: document.getElementById('updateDiscountPercentage').value,
            startDate: document.getElementById('updateStartDate').value,
            endDate: document.getElementById('updateEndDate').value,
            restaurant: {
                id: document.getElementById('offerupdateRestaurantId').value
            }
        };

        fetch(`http://localhost:5786/api/admin/offers/${currentOfferId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(offer)
        })
        .then(response => response.json())
        .then(() => {
            updateOfferPopup.classList.add('hidden');
            loadOffers(searchInput.value);
        })
        .catch(error => console.error('Error updating offer:', error));
    });

    closeUpdatePopup.addEventListener('click', function() {
        updateOfferPopup.classList.add('hidden');
    });

    createOfferForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const offer = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            discountPercentage: document.getElementById('discountPercentage').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            restaurant: {
                id: document.getElementById('restaurantId').value
            }
        };

        fetch(`http://localhost:5786/api/admin/offers/restaurant/${offer.restaurant.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(offer)
        })
        .then(response => response.json())
        .then(() => {
            createOfferForm.reset();
            loadOffers(); // Optionally pass a specific restaurant ID if needed
        })
        .catch(error => console.error('Error creating offer:', error));
    });
});

