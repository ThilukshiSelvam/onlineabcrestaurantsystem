document.addEventListener('DOMContentLoaded', function() {
    const manageGalleryButton = document.getElementById('show-gallery-management');
    const galleryManagementSection = document.getElementById('gallery-management-section');
    const addImageForm = document.getElementById('add-image-form');
    const searchButton = document.getElementById('search-button');
    const galleryImagesContainer = document.getElementById('gallery-images');
    const updateImagePopup = document.getElementById('update-image-popup');
    const closePopup = document.querySelector('.close-popup');
    const updateImageForm = document.getElementById('update-image-form');
    const restaurantDropdown = document.getElementById('restaurant-dropdown');
    const updateRestaurantDropdown = document.getElementById('update-restaurant-dropdown');
    
    manageGalleryButton.addEventListener('click', function() {
        galleryManagementSection.style.display = galleryManagementSection.style.display === 'none' ? 'block' : 'none';
        staffManagement.style.display = 'none';
        restaurantManagement.style.display = 'none';  // Hide restaurant management section
        categoryManagement.style.display = 'none';
        document.getElementById("dineinTablesSection").style.display = "none";
        manageOffersSection.style.display = "none";
        document.getElementById("facilityManagementSection").style.display = "none";
        foodManagementSection.style.display = 'none';
        galleryRestaurants();  // Load restaurant data for dropdowns
        loadGalleryImages();  // Load existing gallery images
    });

    addImageForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const imageUrl = document.getElementById('image-url').value;
        const restaurantId = document.getElementById('restaurant-dropdown').value;
        
        fetch('http://localhost:5786/api/admin/gallery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ url: imageUrl, restaurantId: restaurantId }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            addImageForm.reset();
            loadGalleryImages();  // Refresh gallery images
        })
        .catch(error => console.error('Error:', error));
    });

    searchButton.addEventListener('click', function() {
        const imageId = document.getElementById('search-id').value;
        fetch(`http://localhost:5786/api/admin/gallery/${imageId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                galleryImagesContainer.innerHTML = '';
                if (data) {
                    displayImageDetails(data);
                } else {
                    galleryImagesContainer.innerHTML = '<p>No image found.</p>';
                }
            })
            .catch(error => console.error('Error:', error));
    });

    function galleryRestaurants() {
        fetch('http://localhost:5786/api/admin/restaurants/getAllRestaurants', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                const restaurants = data;
                restaurantDropdown.innerHTML = '';
                updateRestaurantDropdown.innerHTML = '';
                restaurants.forEach(restaurant => {
                    const option = document.createElement('option');
                    option.value = restaurant.id;
                    option.textContent = restaurant.name;
                    restaurantDropdown.appendChild(option);
                    updateRestaurantDropdown.appendChild(option.cloneNode(true));
                });
            })
            .catch(error => console.error('Error:', error));
    }

    function loadGalleryImages() {
        fetch('http://localhost:5786/api/admin/gallery', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                galleryImagesContainer.innerHTML = '';
                data.images.forEach(image => {
                    displayImageDetails(image);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    function displayImageDetails(image) {
        console.log(image.imageUrl);  // Check if the correct imageUrl is being returned
        
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `
            <p>ID: ${image.id}</p>
            <p>URL: ${image.imageUrl}</p>  <!-- Update this to image.imageUrl -->
            <p>Restaurant: ${image.restaurantId}</p>
            <button class="update-btn" onclick="openUpdatePopup(${image.id}, '${image.imageUrl}', ${image.restaurantId})">Update</button>  <!-- Update this to image.imageUrl -->
            <button class="delete-btn" onclick="deleteImage(${image.id})">Delete</button>
        `;
        galleryImagesContainer.appendChild(div);
    }
    

    window.openUpdatePopup = function(id, imageUrl, restaurantId) {
        document.getElementById('update-image-id').value = id;
        document.getElementById('update-image-url').value = imageUrl;  // Update this to imageUrl
        document.getElementById('update-restaurant-dropdown').value = restaurantId;
        updateImagePopup.style.display = 'flex';
    }
    

    window.deleteImage = function(id) {
        fetch(`http://localhost:5786/api/admin/gallery/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (response.ok) {
                loadGalleryImages();  // Refresh gallery images if successful
            }
        })
        .catch(error => console.error('Error:', error));
    }
    

    updateImageForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const id = document.getElementById('update-image-id').value;
        const url = document.getElementById('update-image-url').value;
        const restaurantId = document.getElementById('update-restaurant-dropdown').value;

        fetch(`http://localhost:5786/api/admin/gallery/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ url: url, restaurantId: restaurantId }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            updateImagePopup.style.display = 'none';
            loadGalleryImages();  // Refresh gallery images
        })
        .catch(error => console.error('Error:', error));
    });

    closePopup.addEventListener('click', function() {
        updateImagePopup.style.display = 'none';
    });
});
