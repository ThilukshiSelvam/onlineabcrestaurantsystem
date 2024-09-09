// Dine-in management

document.getElementById("manageDineinTablesBtn").addEventListener("click", function() {
    document.getElementById("dineinTablesSection").style.display = "block";
    document.getElementById("staffManagement").style.display = 'none'; // Ensure these IDs exist
    document.getElementById("restaurantManagement").style.display = 'none'; // Ensure these IDs exist
    document.getElementById("categoryManagement").style.display = 'none'; // Ensure these IDs exist
    document.getElementById("manageOffersSection").style.display = "none"; // Ensure these IDs exist
    document.getElementById("facilityManagementSection").style.display = "none"; // Ensure these IDs exist
    foodManagementSection.style.display = 'none';
    existRestaurants();  // Load restaurants for the dropdown
    loadAllDineinTables(); // Load all dine-in tables
});

document.getElementById("createDineinTableForm").addEventListener("submit", function(event) {
    event.preventDefault();
    createDineinTable();
});

document.getElementById("searchTableBtn").addEventListener("click", function() {
    const tableId = document.getElementById("searchTableInput").value;
    if (tableId) {
        searchDineinTableById(tableId);
    }
});

document.getElementById("cancelUpdateBtn").addEventListener("click", function() {
    document.getElementById("updateDineinTablePopup").style.display = "none";
});

function existRestaurants() {
    fetch('http://localhost:5786/api/restaurants/getAllRestaurants', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(restaurants => {
        const dineinrestaurantDropdown = document.getElementById("dineinrestaurantIdDropdown");
        const dineinupdateRestaurantDropdown = document.getElementById("dineinupdateRestaurantIdDropdown");
        dineinrestaurantDropdown.innerHTML = '';
        dineinupdateRestaurantDropdown.innerHTML = '';
        restaurants.forEach(restaurant => {
            const option = document.createElement("option");
            option.value = restaurant.id;
            option.text = restaurant.name;
            dineinrestaurantDropdown.add(option);

            const updateOption = option.cloneNode(true);
            dineinupdateRestaurantDropdown.add(updateOption);
        });
    });
}

function loadAllDineinTables() {
    fetch('http://localhost:5786/api/tables/getAllDineinTables', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(tables => {
        const tableBody = document.getElementById("dineinTablesTable").querySelector("tbody");
        tableBody.innerHTML = '';
        tables.forEach(table => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${table.id}</td>
                <td>${table.restaurantId}</td>
                <td>${table.tableNumber}</td>
                <td>${table.seats}</td>
                <td>${table.available ? 'Yes' : 'No'}</td>
                <td>
                    <button onclick="opendineInUpdatePopup(${table.id})">Update</button>
                    <button onclick="deleteDineinTable(${table.id})">Delete</button>
                    <button onclick="toggleAvailability(${table.id}, ${!table.available})">${table.available ? 'Make Unavailable' : 'Make Available'}</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    });
}

function createDineinTable() {
    const dineinTable = {
        restaurantId: document.getElementById("dineinrestaurantIdDropdown").value,
        tableNumber: document.getElementById("tableNumber").value,
        seats: document.getElementById("seatsDropdown").value,
        available: document.getElementById("available").checked
    };

    fetch('http://localhost:5786/api/tables', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dineinTable)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadAllDineinTables();
        document.getElementById("createDineinTableForm").reset();
    });
}

function searchDineinTableById(tableId) {
    fetch(`http://localhost:5786/api/tables/${tableId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(table => {
        const tableBody = document.getElementById("dineinTablesTable").querySelector("tbody");
        tableBody.innerHTML = '';
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${table.id}</td>
            <td>${table.restaurantId}</td>
            <td>${table.tableNumber}</td>
            <td>${table.seats}</td>
            <td>${table.available ? 'Yes' : 'No'}</td>
            <td>
                <button onclick="openUpdatePopup(${table.id})">Update</button>
                <button onclick="deleteDineinTable(${table.id})">Delete</button>
                <button onclick="toggleAvailability(${table.id}, ${!table.available})">${table.available ? 'Make Unavailable' : 'Make Available'}</button>
            </td>
        `;
        tableBody.appendChild(row);
    })
    .catch(error => {
        alert('Dine-in Table not found');
    });
}

function opendineInUpdatePopup(tableId) {
    fetch(`http://localhost:5786/api/tables/${tableId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(table => {
        document.getElementById("updateTableId").value = table.id;
        document.getElementById("dineinupdateRestaurantIdDropdown").value = table.restaurantId;
        document.getElementById("updateTableNumber").value = table.tableNumber;
        document.getElementById("updateSeatsDropdown").value = table.seats;

        document.getElementById("updateDineinTablePopup").style.display = "block";
    });
}

document.getElementById("updateDineinTableForm").addEventListener("submit", function(event) {
    event.preventDefault();
    updateDineinTable();
});

function updateDineinTable() {
    const tableId = document.getElementById("updateTableId").value;

    const updatedTable = {
        restaurantId: document.getElementById("dineinupdateRestaurantIdDropdown").value,
        tableNumber: document.getElementById("updateTableNumber").value,
        seats: document.getElementById("updateSeatsDropdown").value,
    };

    fetch(`http://localhost:5786/api/tables/${tableId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTable)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadAllDineinTables();
        document.getElementById("updateDineinTablePopup").style.display = "none";
    });
}

function deleteDineinTable(tableId) {
    if (confirm('Are you sure you want to delete this table?')) {
        fetch(`http://localhost:5786/api/tables/${tableId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadAllDineinTables();
        });
    }
}

function toggleAvailability(tableId, available) {
    fetch(`http://localhost:5786/api/tables/${tableId}/availability`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isAvailable: available })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update availability');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        loadAllDineinTables();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating availability');
    });
}
