// Category Management

document.addEventListener('DOMContentLoaded', function () {
    const manageCategoryBtn = document.getElementById('manageCategoryBtn');
    const categoryManagement = document.getElementById('categoryManagement');
    const createCategoryForm = document.getElementById('createCategoryForm');
    const cancelCreateCategory = document.getElementById('cancelCreateCategory');
    const searchCategoriesBtn = document.getElementById('searchCategoriesBtn');
    const restaurantDropdown = document.getElementById('restaurantDropdown');
    const categoryTable = document.getElementById('categoryTable').getElementsByTagName('tbody')[0];
    const searchRestaurantId = document.getElementById('searchRestaurantId');

    manageCategoryBtn.addEventListener('click', () => {
        categoryManagement.style.display = categoryManagement.style.display === 'none' ? 'block' : 'none';
        if (categoryManagement.style.display === 'block') {
            manageOffersSection.style.display = "none";
            staffManagement.style.display = 'none';
            restaurantManagement.style.display = 'none';  // Hide restaurant management section
            document.getElementById("dineinTablesSection").style.display = "none";
            document.getElementById("facilityManagementSection").style.display = "none";
            foodManagementSection.style.display = 'none';
            loadRestaurantDropdown();
            loadAllCategories();
        }
        staffManagement.style.display = 'none';
        restaurantManagement.style.display = 'none';
        document.getElementById("dineinTablesSection").style.display = "none";
    });

    cancelCreateCategory.addEventListener('click', () => {
        createCategoryForm.reset();
    });

    createCategoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(createCategoryForm);
        const data = {
            name: formData.get('categoryName'),
            restaurant_id: formData.get('restaurantId')
        };
        const response = await fetch('http://localhost:5786/api/admin/category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        alert(result.message);
        createCategoryForm.reset();
        loadAllCategories();
    });

    searchCategoriesBtn.addEventListener('click', async () => {
        const restaurantId = searchRestaurantId.value;
        if (restaurantId) {
            const response = await fetch(`http://localhost:5786/api/category/restaurant/${restaurantId}`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });
            const categories = await response.json();
            updateCategoryTable(categories);
        }
    });

    async function loadRestaurantDropdown() {
        try {
            const response = await fetch('http://localhost:5786/api/admin/restaurants/getAllRestaurants', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`, // Add your JWT token here
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch restaurants');
            }

            const restaurants = await response.json();
            if (restaurantDropdown) {
                restaurantDropdown.innerHTML = '<option value="">Select Restaurant</option>';
                restaurants.forEach(restaurant => {
                    const option = document.createElement('option');
                    option.value = restaurant.id;
                    option.textContent = restaurant.name;
                    restaurantDropdown.appendChild(option);
                });
            } else {
                console.error('Restaurant dropdown element is not found');
            }
        } catch (error) {
            console.error('Error loading restaurant dropdown:', error);
            if (restaurantDropdown) {
                restaurantDropdown.innerHTML = '<option value="">Error loading restaurants</option>';
            }
        }
    }

    async function loadAllCategories() {
        const response = await fetch('http://localhost:5786/api/admin/getAllCategory', {
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        });
        const categories = await response.json();
        updateCategoryTable(categories);
    }

    function updateCategoryTable(categories) {
        categoryTable.innerHTML = '';
        categories.forEach(category => {
            const row = categoryTable.insertRow();
            row.insertCell(0).textContent = category.id;
            row.insertCell(1).textContent = category.name;
            row.insertCell(2).textContent = category.restaurant_id; // Replace with restaurant name if needed

            const actionsCell = row.insertCell(3);
            const updateBtn = document.createElement('button');
            updateBtn.textContent = 'Update';
            updateBtn.onclick = () => openUpdateForm(category);
            actionsCell.appendChild(updateBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteCategory(category.id);
            actionsCell.appendChild(deleteBtn);
        });
    }

    async function openUpdateForm(category) {
        const modal = document.getElementById('updateCategoryModal');
        const updateCategoryForm = document.getElementById('updateCategoryForm');
        const updateRestaurantDropdown = document.getElementById('updateRestaurantId');

        // Load available restaurants for the dropdown
        await categoryRestaurantDropdown(updateRestaurantDropdown);

        // Populate the form with current category details
        document.getElementById('updateCategoryId').value = category.id;
        document.getElementById('updateCategoryName').value = category.name;
        updateRestaurantDropdown.value = category.restaurant_id; // Set the current restaurant ID

        // Show the modal
        modal.style.display = 'block';

        // Handle form submission
        updateCategoryForm.onsubmit = async function (e) {
            e.preventDefault();

            const data = {
                name: document.getElementById('updateCategoryName').value,
                restaurant_id: updateRestaurantDropdown.value
            };

            await fetch(`http://localhost:5786/api/admin/category/${category.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify(data)
            });

            modal.style.display = 'none';
            loadAllCategories();
        };
    }

    async function categoryRestaurantDropdown(dropdown) {
        try {
            const response = await fetch('http://localhost:5786/api/admin/restaurants/getAllRestaurants', {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch restaurants');
            }
            const restaurants = await response.json();
            if (dropdown) {
                dropdown.innerHTML = '<option value="">Select Restaurant</option>';
                restaurants.forEach(restaurant => {
                    const option = document.createElement('option');
                    option.value = restaurant.id;
                    option.textContent = restaurant.name;
                    dropdown.appendChild(option);
                });
            } else {
                console.error('Dropdown element is not found');
            }
        } catch (error) {
            console.error('Error loading restaurant dropdown:', error);
            if (dropdown) {
                dropdown.innerHTML = '<option value="">Error loading restaurants</option>';
            }
        }
    }

    // Close the modal when the user clicks outside of it
    window.onclick = function (event) {
        const modal = document.getElementById('updateCategoryModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    async function deleteCategory(id) {
        const response = await fetch(`http://localhost:5786/api/admin/category/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        });
        const result = await response.json();
        alert(result.message);
        loadAllCategories();
    }
});
