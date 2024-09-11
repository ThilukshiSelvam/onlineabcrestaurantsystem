document.addEventListener('DOMContentLoaded', () => {
    const manageFoodBtn = document.getElementById('manageFoodBtn');
    const foodCategoryDropdown = document.getElementById("foodCategory");
    const foodRestaurantDropdown = document.getElementById("foodRestaurant");
    const createFoodForm = document.getElementById("createFoodForm");
    const foodTableBody = document.querySelector("#foodTable tbody");

    const jwtToken = localStorage.getItem('jwtToken');

    // Toggle section visibility
    manageFoodBtn.addEventListener('click', () => {
        foodManagementSection.style.display = 'block';
        restaurantManagement.style.display = 'none';
        categoryManagement.style.display = 'none';
        document.getElementById("dineinTablesSection").style.display = "none";
        manageOffersSection.style.display = "none";
        document.getElementById("facilityManagementSection").style.display = "none";
    });

    // Function to fetch categories and populate the dropdown
    const fetchCategories = async (restaurantId) => {
        try {
            const response = await fetch(`http://localhost:5786/api/category/restaurant/${restaurantId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const categories = await response.json();
                populateCategoryDropdown(categories);
            } else {
                console.error("Failed to fetch categories");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Function to populate the category dropdown
    const populateCategoryDropdown = (categories) => {
        foodCategoryDropdown.innerHTML = ""; // Clear existing options

        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            foodCategoryDropdown.appendChild(option);
        });
    };

    // Function to fetch all restaurants and populate the restaurant dropdown
    const fetchRestaurants = async () => {
        try {
            const response = await fetch("http://localhost:5786/api/admin/restaurants/getAllRestaurants", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const restaurants = await response.json();
                populateRestaurantDropdown(restaurants);
            } else {
                console.error("Failed to fetch restaurants");
            }
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    };

    // Function to populate the restaurant dropdown
    const populateRestaurantDropdown = (restaurants) => {
        restaurants.forEach(restaurant => {
            const option = document.createElement("option");
            option.value = restaurant.id;
            option.textContent = restaurant.name;
            foodRestaurantDropdown.appendChild(option);
        });
    };

    // Event listener to fetch and display categories based on selected restaurant
    foodRestaurantDropdown.addEventListener("change", () => {
        const restaurantId = foodRestaurantDropdown.value;
        if (restaurantId) {
            fetchCategories(restaurantId); // Fetch and populate categories based on selected restaurant
        }
    });

    // Function to add food
    const addFood = async (event) => {
        event.preventDefault();

        const foodData = {
            name: document.getElementById("foodName").value,
            description: document.getElementById("foodDescription").value,
            price: parseFloat(document.getElementById("foodPrice").value),
            foodCategoryId: parseInt(foodCategoryDropdown.value),
            restaurantId: parseInt(foodRestaurantDropdown.value),
            images: document.getElementById("foodImages").value.split(',').map(image => image.trim()),
            isVegetarian: document.getElementById("isVegetarian").checked,
            isSeasonal: document.getElementById("isSeasonal").checked
        };

        try {
            const response = await fetch("http://localhost:5786/api/admin/food", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(foodData)
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                createFoodForm.reset();
                fetchAndDisplayFood();
            } else if (response.status === 409) {
                alert("Food with this name already exists in the selected restaurant.");
            } else {
                const error = await response.json();
                alert(`Failed to add food: ${error.message}`);
            }
        } catch (error) {
            console.error("Error adding food:", error);
            alert("An error occurred while adding the food.");
        }
    };

    // Function to fetch and display all food items in the table
    const fetchAndDisplayFood = async () => {
        try {
            const response = await fetch("http://localhost:5786/api/admin/food/getallFood", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const foodItems = await response.json();
                populateFoodTable(foodItems);
            } else {
                console.error("Failed to fetch food items");
            }
        } catch (error) {
            console.error("Error fetching food items:", error);
        }
    };

    // Function to populate the food table
    const populateFoodTable = (foodItems) => {
        foodTableBody.innerHTML = ""; // Clear existing rows

        foodItems.forEach(food => {
            const categoryName = food.foodCategory ? food.foodCategory.name : 'N/A';
            const restaurantName = food.restaurant ? food.restaurant.name : 'N/A';

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${food.id}</td>
                <td>${food.name}</td>
                <td>${food.description}</td>
                <td>${food.price}</td>
                <td>${categoryName}</td>
                <td>${restaurantName}</td>
                <td>${food.isVegetarian ? 'Yes' : 'No'}</td>
                <td>${food.isSeasonal ? 'Yes' : 'No'}</td>
                <td>${food.available ? 'Yes' : 'No'}</td> <!-- Display availability -->
                <td>
                    <button class="update-btn" data-id="${food.id}">Update</button>
                    <button class="delete-btn" data-id="${food.id}">Delete</button>
                    <button class="toggle-availability-btn" data-food-id="${food.id}" data-available="${food.available}">
                        ${food.available ? 'Mark as Unavailable' : 'Mark as Available'}
                    </button>
                </td>
            `;

            foodTableBody.appendChild(row);
        });

        // Attach event listeners for update, delete, and toggle availability buttons
        document.querySelectorAll('.update-btn').forEach(button => {
            button.addEventListener('click', handleUpdateFood);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDeleteFood);
        });

        document.querySelectorAll('.toggle-availability-btn').forEach(button => {
            button.addEventListener('click', handleToggleAvailability);
        });
    };

    // Function to handle the deletion of a food item
    const handleDeleteFood = async (event) => {
        const foodId = event.target.dataset.id;

        if (confirm("Are you sure you want to delete this food item?")) {
            try {
                const response = await fetch(`http://localhost:5786/api/admin/food/${foodId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    alert("Food deleted successfully.");
                    fetchAndDisplayFood(); // Refresh the food table after deletion
                } else if (response.status === 404) {
                    alert("Food not found.");
                } else {
                    alert("Failed to delete food.");
                }
            } catch (error) {
                console.error("Error deleting food:", error);
                alert("An error occurred while deleting the food.");
            }
        }
    };

    // Function to handle the toggling of food availability status
    const handleToggleAvailability = async (event) => {
        const foodId = event.target.dataset.foodId;
        const currentStatus = event.target.dataset.available === 'true';

        try {
            const response = await fetch(`http://localhost:5786/api/admin/food/${foodId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                alert("Food availability status updated successfully.");
                fetchAndDisplayFood(); // Refresh the food table after updating the availability status
            } else if (response.status === 404) {
                alert("Food not found.");
            } else {
                alert("Failed to update food availability.");
            }
        } catch (error) {
            console.error("Error updating food availability:", error);
            alert("An error occurred while updating food availability.");
        }
    };

// Function to handle food updates
const handleUpdateFood = async (event) => {
    const foodId = event.target.dataset.id;
    console.log("Update button clicked for food ID:", foodId);

    const updateFoodForm = document.getElementById("updateFoodForm");
    console.log(updateFoodForm); 

   // Log to check if the form is found in the DOM

    if (!updateFoodForm) {
        console.error("Update form not found in the DOM.");
        return; // Exit if the form is missing
    }

    // Ensure the form and elements are correctly selected
 
    const updateFoodName = document.getElementById("updateFoodName");
    const updateFoodDescription = document.getElementById("updateFoodDescription");
    const updateFoodPrice = document.getElementById("updateFoodPrice");
    const updateFoodCategory = document.getElementById("updateFoodCategoryId"); // Fixed ID
    const updateFoodRestaurant = document.getElementById("updateFoodRestaurantId"); // Fixed ID
    const updateIsVegetarian = document.getElementById("updateFoodVegetarian");
    const updateIsSeasonal = document.getElementById("updateFoodSeasonal");

    if (!updateFoodForm || !updateFoodName || !updateFoodDescription || !updateFoodPrice || 
        !updateFoodCategory || !updateFoodRestaurant || 
        !updateIsVegetarian || !updateIsSeasonal) {
        console.error("Update form or elements are not found");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5786/api/admin/food/getFoodById/${foodId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const food = await response.json();

            updateFoodName.value = food.name;
            updateFoodDescription.value = food.description;
            updateFoodPrice.value = food.price;
            updateFoodCategory.value = food.foodCategory.id;
            updateFoodRestaurant.value = food.restaurant.id;
            updateIsVegetarian.checked = food.isVegetarian;
            updateIsSeasonal.checked = food.isSeasonal;

            // Attach the submit event listener
            updateFoodForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const updatedFoodData = {
                    name: updateFoodName.value,
                    description: updateFoodDescription.value,
                    price: parseFloat(updateFoodPrice.value),
                    foodCategoryId: parseInt(updateFoodCategory.value),
                    restaurantId: parseInt(updateFoodRestaurant.value),
                    isVegetarian: updateIsVegetarian.checked,
                    isSeasonal: updateIsSeasonal.checked
                };

                try {
                    const updateResponse = await fetch(`http://localhost:5786/api/admin/food/update/${foodId}`, {
                        method: "PUT",
                        headers: {
                            "Authorization": `Bearer ${jwtToken}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(updatedFoodData)
                    });

                    if (updateResponse.ok) {
                        alert("Food updated successfully.");
                        fetchAndDisplayFood(); // Refresh the food table after updating
                    } else {
                        alert("Failed to update food.");
                    }
                } catch (error) {
                    console.error("Error updating food:", error);
                    alert("An error occurred while updating the food.");
                }
            }, { once: true }); // Ensure listener is added only once
        } else {
            alert("Failed to fetch food details.");
        }
    } catch (error) {
        console.error("Error fetching food details:", error);
    }
};



    // Initialize the form with categories and restaurants
    fetchRestaurants();
    fetchAndDisplayFood();

    createFoodForm.addEventListener('submit', addFood);
});
