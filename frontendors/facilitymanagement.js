document.addEventListener('DOMContentLoaded', function () {

    // Function to load all restaurants into the dropdown
    function facilityRestaurant() {
        fetch('http://localhost:5786/api/restaurants/getAllRestaurants', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(restaurants => {
            const facilityRestaurantDropdown = document.getElementById("facilityRestaurant");
            facilityRestaurantDropdown.innerHTML = ''; // Clear existing options

            restaurants.forEach(restaurant => {
                const option = document.createElement("option");
                option.value = restaurant.id;
                option.text = restaurant.name;
                facilityRestaurantDropdown.add(option); // Add options to the dropdown
            });
        })
        .catch(error => console.error('Error fetching restaurants:', error));
    }

    // Function to load all facilities
    function facilities() {
        fetch('http://localhost:5786/api/admin/facility/getAllFacilities', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch facilities');
            }
            return response.json();
        })
        .then(responseData => {
            if (responseData.data && Array.isArray(responseData.data)) {
                const facilityTableBody = document.getElementById("facilityTable").querySelector("tbody");
                facilityTableBody.innerHTML = '';

                responseData.data.forEach(facility => {
                    const row = document.createElement("tr");

                    row.innerHTML = `
                        <td>${facility.id}</td>
                        <td>${facility.name}</td>
                        <td>${facility.description}</td>
                        <td>${facility.restaurant ? facility.restaurant.name : 'N/A'}</td>
                        <td class="action-buttons">
                            <button class="update-btn" data-id="${facility.id}" onclick="showUpdateFacilityPopup(${facility.id})">Update</button>
                            <button class="delete-btn" data-id="${facility.id}" onclick="deleteFacility(${facility.id})">Delete</button>
                        </td>
                    `;

                    facilityTableBody.appendChild(row);
                });
            } else {
                console.error('Invalid response format:', responseData);
            }
        })
        .catch(error => console.error('Error fetching facilities:', error));
    }

    // Function to create a new facility
    document.getElementById("createFacilityForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const facilityData = {
            name: document.getElementById("facilityName").value,
            description: document.getElementById("facilityDescription").value,
            restaurantId: document.getElementById("facilityRestaurant").value
        };

        fetch('http://localhost:5786/api/admin/facility/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(facilityData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) { // Assuming API returns a success flag
                facilities();
                document.getElementById("createFacilityForm").reset();
            }
        })
        .catch(error => console.error('Error creating facility:', error));
    });

    // Function to show the update facility popup
    window.showUpdateFacilityPopup = function(id) {
        fetch(`http://localhost:5786/api/admin/facility/getById/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch facility details');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("updateFacilityId").value = data.id;
            document.getElementById("updateFacilityName").value = data.name;
            document.getElementById("updateFacilityDescription").value = data.description;
            document.getElementById("updateFacilityRestaurant").value = data.restaurant ? data.restaurant.id : '';
            document.getElementById("updateFacilityPopup").style.display = "block";
            
        })
        .catch(error => console.error('Error fetching facility details:', error));
    };

    // Function to update a facility
    document.getElementById("updateFacilityForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const facilityData = {
            name: document.getElementById("updateFacilityName").value,
            description: document.getElementById("updateFacilityDescription").value,
            restaurantId: document.getElementById("updateFacilityRestaurant").value
        };

        const facilityId = document.getElementById("updateFacilityId").value;

        fetch(`http://localhost:5786/api/admin/facility/update/${facilityId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(facilityData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) { // Assuming API returns a success flag
                facilities();
                document.getElementById("updateFacilityPopup").style.display = "none";
            }
        })
        .catch(error => console.error('Error updating facility:', error));
    });

    // Function to delete a facility
    window.deleteFacility = function(id) {
        if (confirm("Are you sure you want to delete this facility?")) {
            fetch(`http://localhost:5786/api/admin/facility/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.success) { // Assuming API returns a success flag
                   facilities();
                }
            })
            .catch(error => console.error('Error deleting facility:', error));
        }
    };

    // Event listener for managing facilities button
    document.getElementById("manageFacilitiesBtn").addEventListener("click", function () {
        document.getElementById("facilityManagementSection").style.display = "block";
        staffManagement.style.display = 'none';
        restaurantManagement.style.display = 'none';  // Hide restaurant management section
        categoryManagement.style.display = 'none';
        document.getElementById("dineinTablesSection").style.display = "none";
        manageOffersSection.style.display = "none";
        foodManagementSection.style.display = 'none';
        facilityRestaurant();
        facilities();
    });

    // Close popup form
    document.getElementById("closePopupBtn").addEventListener("click", function () {
        document.getElementById("updateFacilityPopup").style.display = "none";
    });

    // Initial load of restaurants and facilities
    facilityRestaurant();
    facilities();
});
