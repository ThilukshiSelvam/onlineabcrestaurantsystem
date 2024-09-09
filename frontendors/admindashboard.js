
const manageStaffBtn = document.getElementById('manageStaffBtn');
const staffManagement = document.getElementById('staffManagement');
const staffForm = document.getElementById('staffForm');
const staffTable = document.getElementById('staffTable').getElementsByTagName('tbody')[0];
const editModal = document.getElementById('editModal');
const closeModal = document.getElementsByClassName('close')[0];
const editStaffForm = document.getElementById('editStaffForm');
const profile = document.querySelector('.profile');
const profileDropdown = document.querySelector('.profile-dropdown');
const logoutBtn = document.getElementById('logoutBtn');
const jwtToken = localStorage.getItem('jwtToken');
let currentEditId = null;

// Toggle staff management visibility
manageStaffBtn.addEventListener('click', () => {
    staffManagement.style.display = 'block';
    restaurantManagement.style.display = 'none';  // Hide restaurant management section
    categoryManagement.style.display = 'none';
    document.getElementById("dineinTablesSection").style.display = "none";
    manageOffersSection.style.display = "none";
    document.getElementById("facilityManagementSection").style.display = "none";
    foodManagementSection.style.display = 'none';
    

    fetchStaffs();
});

manageRestaurantsBtn.addEventListener('click', () => {
    restaurantManagement.style.display = 'block';
    staffManagement.style.display = 'none';  // Hide staff management section
    categoryManagement.style.display = 'none';
    document.getElementById("dineinTablesSection").style.display = "none";
    manageOffersSection.style.display = "none";
    document.getElementById("facilityManagementSection").style.display = "none";
    foodManagementSection.style.display = 'none';
    loadAllRestaurants();
});

// Handle staff form submission
staffForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !email) {
        alert('Username and Email are required.');
        return;
    }

    const staffData = { username, email, password };

    fetch('http://localhost:5786/auth/addStaff', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(staffData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.message === 'Staff account created successfully') {
            staffForm.reset();
            fetchStaffs();
        }
    })
    .catch(error => console.error('Error:', error));
});

// Fetch staff members
function fetchStaffs() {
    fetch('http://localhost:5786/auth/getAllStaffs', {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        staffTable.innerHTML = '';
        data.forEach(staff => {
            const row = staffTable.insertRow();
            row.insertCell().textContent = staff.id;
            row.insertCell().textContent = staff.username;
            row.insertCell().textContent = staff.email;

            const actionsCell = row.insertCell();
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'edit-btn';
            editBtn.onclick = () => openEditModal(staff);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = () => deleteStaff(staff.id);

            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
        });
    })
    .catch(error => console.error('Error:', error));
}

// Open edit modal
function openEditModal(staff) {
    currentEditId = staff.id;
    document.getElementById('editUsername').value = staff.username;
    document.getElementById('editEmail').value = staff.email;
    document.getElementById('editPassword').value = ''; // Clear the password field

    editModal.style.display = 'block';
}

// Close edit modal
closeModal.onclick = () => {
    editModal.style.display = 'none';
}

// Close modal if clicked outside
window.onclick = (event) => {
    if (event.target === editModal) {
        editModal.style.display = 'none';
    }
}

// Handle edit staff form submission
editStaffForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('editUsername').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const password = document.getElementById('editPassword').value.trim();

    if (!username || !email) {
        alert('Username and Email are required.');
        return;
    }

    const staffData = { username, email, password };

    fetch(`http://localhost:5786/auth/updateStaff/${currentEditId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(staffData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.message === 'Staff account updated successfully') {
            editModal.style.display = 'none';
            fetchStaffs();
        }
    })
    .catch(error => console.error('Error:', error));
});

// Handle staff deletion
function deleteStaff(id) {
    if (!confirm('Are you sure you want to delete this staff?')) {
        return;
    }

    fetch(`http://localhost:5786/auth/deleteStaff/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.message === 'Staff account deleted successfully') {
            fetchStaffs();
        }
    })
    .catch(error => console.error('Error:', error));
}

// Show/hide profile dropdown
profile.addEventListener('click', () => {
    profileDropdown.style.display = profileDropdown.style.display === 'none' ? 'block' : 'none';
});

// Handle logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('jwtToken');
    window.location.href = 'login.html'; // Redirect to login page
});

// Initial fetch of staff members when page loads
fetchStaffs();


document.addEventListener("DOMContentLoaded", function () {

    // Manage Restaurants Button Toggle


    // Search Restaurant
    document.getElementById("searchRestaurantBtn").addEventListener("click", function () {
        searchRestaurant();
    });

    // Create Restaurant Button
    document.getElementById("createRestaurantBtn").addEventListener("click", function () {
        createRestaurant();
    });

    // Close Edit Restaurant Popup
    document.getElementById("closeEditRestaurantPopup").addEventListener("click", function () {
        document.getElementById("editRestaurantPopup").style.display = "none";
    });

    // Edit Restaurant Form Submission
    document.getElementById("editRestaurantForm").addEventListener("submit", function (e) {
        e.preventDefault();
        updateRestaurant();
    });
});

function toggleManagement(sectionId) {
    const sections = document.querySelectorAll(".management");
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.style.display = section.style.display === "block" ? "none" : "block";
        } else {
            section.style.display = "none";
        }
    });
}


// Load All Restaurants
function loadAllRestaurants() {
    fetch('http://localhost:5786/api/admin/restaurants/getAllRestaurants', {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
    .then(response => response.json())
    .then(restaurants => {
        const tableBody = document.getElementById("restaurantTableBody");
        tableBody.innerHTML = ""; // Clear existing rows

        restaurants.forEach(restaurant => {
            const address = `${restaurant.address.streetAddress}, ${restaurant.address.city}, ${restaurant.address.stateProvince}, ${restaurant.address.postalCode}, ${restaurant.address.country}`;
            const contactInfo = `Email: ${restaurant.contactInformation.email}, Mobile: ${restaurant.contactInformation.mobile}, Twitter: ${restaurant.contactInformation.twitter}, Instagram: ${restaurant.contactInformation.instagram}`;

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${restaurant.id}</td>
                <td>${restaurant.name}</td>
                <td>${restaurant.description}</td>
                <td>${restaurant.cuisineType}</td>
                <td>${address}</td>
                <td>${contactInfo}</td>
                <td>${restaurant.openingHours}</td>
                <td>${restaurant.images.join(', ')}</td>
                <td>${restaurant.registrationDate}</td>
                <td>${restaurant.open ? 'Open' : 'Closed'}</td>
                <td>
                    <button onclick="editRestaurant(${restaurant.id})">Edit</button>
                    <button onclick="deleteRestaurant(${restaurant.id})">Delete</button>
                    <button onclick="toggleRestaurantStatus(${restaurant.id})">
                        ${restaurant.open ? 'Close' : 'Open'}
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error loading restaurants:', error));
}


// Search Restaurants
function searchRestaurant() {
    const keyword = document.getElementById("searchRestaurantInput").value;

    fetch(`http://localhost:5786/api/admin/restaurants/search?keyword=${encodeURIComponent(keyword)}`, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    }
)
        .then(response => response.json())
        .then(restaurants => {
            const tableBody = document.getElementById("restaurantTableBody");
            tableBody.innerHTML = ""; // Clear existing rows

            restaurants.forEach(restaurant => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${restaurant.id}</td>
                    <td>${restaurant.name}</td>
                    <td>${restaurant.description}</td>
                    <td>${restaurant.cuisineType}</td>
                    <td>${restaurant.address}</td>
                    <td>${restaurant.contactInformation}</td>
                    <td>${restaurant.openingHours}</td>
                    <td>${restaurant.images.join(', ')}</td>
                    <td>${restaurant.registrationDate}</td>
                    <td>${restaurant.open ? 'Open' : 'Closed'}</td>
                    <td>
                        <button onclick="editRestaurant(${restaurant.id})">Edit</button>
                        <button onclick="deleteRestaurant(${restaurant.id})">Delete</button>
                        <button onclick="toggleRestaurantStatus(${restaurant.id})">
                            ${restaurant.open ? 'Close' : 'Open'}
                        </button>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error searching restaurants:', error));
}

// Edit Restaurant
function editRestaurant(id) {
    fetch(`http://localhost:5786/api/admin/restaurants/${id}`, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
    .then(response => response.json())
    .then(restaurant => {
        document.getElementById("editRestaurantId").value = restaurant.id;
        document.getElementById("editRestaurantName").value = restaurant.name;
        document.getElementById("editRestaurantDescription").value = restaurant.description;
        document.getElementById("editRestaurantCuisineType").value = restaurant.cuisineType;

        // Extract address fields
        document.getElementById("editRestaurantStreetAddress").value = restaurant.address.streetAddress;
        document.getElementById("editRestaurantCity").value = restaurant.address.city;
        document.getElementById("editRestaurantStateProvince").value = restaurant.address.stateProvince;
        document.getElementById("editRestaurantPostalCode").value = restaurant.address.postalCode;
        document.getElementById("editRestaurantCountry").value = restaurant.address.country;

        // Extract contact information fields
        document.getElementById("editRestaurantEmail").value = restaurant.contactInformation.email;
        document.getElementById("editRestaurantMobile").value = restaurant.contactInformation.mobile;
        document.getElementById("editRestaurantTwitter").value = restaurant.contactInformation.twitter;
        document.getElementById("editRestaurantInstagram").value = restaurant.contactInformation.instagram;

        document.getElementById("editRestaurantOpeningHours").value = restaurant.openingHours;
        document.getElementById("editRestaurantImages").value = restaurant.images.join(', ');

        document.getElementById("editRestaurantPopup").style.display = "block";
    })
    .catch(error => console.error('Error fetching restaurant details:', error));
}


// Update Restaurant
function updateRestaurant() {
    const id = document.getElementById("editRestaurantId").value;
    const restaurantData = {
        name: document.getElementById("editRestaurantName").value,
        description: document.getElementById("editRestaurantDescription").value,
        cuisineType: document.getElementById("editRestaurantCuisineType").value,
        address: {
            streetAddress: document.getElementById("editRestaurantStreetAddress").value,
            city: document.getElementById("editRestaurantCity").value,
            stateProvince: document.getElementById("editRestaurantStateProvince").value,
            postalCode: document.getElementById("editRestaurantPostalCode").value,
            country: document.getElementById("editRestaurantCountry").value
        },
        contactInformation: {
            email: document.getElementById("editRestaurantEmail").value,
            mobile: document.getElementById("editRestaurantMobile").value,
            twitter: document.getElementById("editRestaurantTwitter").value,
            instagram: document.getElementById("editRestaurantInstagram").value
        },
        openingHours: document.getElementById("editRestaurantOpeningHours").value,
        images: document.getElementById("editRestaurantImages").value.split(',').map(image => image.trim())
    };

    fetch(`http://localhost:5786/api/admin/restaurants/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(restaurantData)
    })
    .then(response => {
        if (response.ok) {
            alert('Restaurant updated successfully!');
            document.getElementById("editRestaurantPopup").style.display = "none";
            loadAllRestaurants();
        } else {
            alert('Failed to update restaurant.');
        }
    })
    .catch(error => console.error('Error updating restaurant:', error));
}


// Delete Restaurant
function deleteRestaurant(id) {
    if (confirm('Are you sure you want to delete this restaurant?')) {
        fetch(`http://localhost:5786/api/admin/restaurants/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
                
            }
        })
            .then(response => {
                if (response.ok) {
                    alert('Restaurant deleted successfully!');
                    loadAllRestaurants();
                } else {
                    alert('Failed to delete restaurant.');
                }
            })
            .catch(error => console.error('Error deleting restaurant:', error));
    }
}

// Toggle Restaurant Status
function toggleRestaurantStatus(id) {
    fetch(`http://localhost:5786/api/admin/restaurants/${id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
            
        }
    })
        .then(response => {
            if (response.ok) {
                alert('Restaurant status updated successfully!');
                loadAllRestaurants();
            } else {
                alert('Failed to update restaurant status.');
            }
        })
        .catch(error => console.error('Error updating restaurant status:', error));
}

// Function to clear the form fields
function clearCreateForm() {
    document.getElementById("createRestaurantForm").reset();
}

// Function to validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Function to validate phone number
function validatePhoneNumber(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(String(phone));
}

// Function to create a new restaurant
function createRestaurant() {
    const name = document.getElementById("createRestaurantName").value.trim();
    const description = document.getElementById("createRestaurantDescription").value.trim();
    const cuisineType = document.getElementById("createRestaurantCuisineType").value.trim();
    const streetAddress = document.getElementById("createRestaurantStreetAddress").value.trim();
    const city = document.getElementById("createRestaurantCity").value.trim();
    const stateProvince = document.getElementById("createRestaurantStateProvince").value.trim();
    const postalCode = document.getElementById("createRestaurantPostalCode").value.trim();
    const country = document.getElementById("createRestaurantCountry").value.trim();
    const email = document.getElementById("createRestaurantEmail").value.trim();
    const mobile = document.getElementById("createRestaurantMobile").value.trim();
    const twitter = document.getElementById("createRestaurantTwitter").value.trim();
    const instagram = document.getElementById("createRestaurantInstagram").value.trim();
    const openingHours = document.getElementById("createRestaurantOpeningHours").value.trim();
    const images = document.getElementById("createRestaurantImages").value.trim().split(',').map(image => image.trim());

    // Validate required fields
    if (!name || !description || !cuisineType || !streetAddress || !city || !stateProvince ||
        !postalCode || !country || !email || !mobile || !openingHours || !images.length) {
        alert('Please fill in all required fields.');
        return;
    }

    // Validate email
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Validate phone number
    if (!validatePhoneNumber(mobile)) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
    }

    const restaurantData = {
        name,
        description,
        cuisineType,
        address: {
            streetAddress,
            city,
            stateProvince,
            postalCode,
            country
        },
        contactInformation: {
            email,
            mobile,
            twitter,
            instagram
        },
        openingHours,
        images
    };

    fetch('http://localhost:5786/api/admin/restaurants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(restaurantData)
    })
    .then(response => {
        if (response.ok) {
            alert('Restaurant created successfully!');
            clearCreateForm();
            loadAllRestaurants(); // Reload the list of restaurants after creation
        } else {
            alert('Failed to create restaurant.');
        }
    })
    .catch(error => console.error('Error creating restaurant:', error));
}














