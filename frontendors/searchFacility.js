
  document.getElementById("searchBtn").addEventListener("click", function() {
    // Get the keyword from the search input
    const keyword = document.getElementById("searchInput").value.trim();
    
    // Check if keyword is empty
    if (!keyword) {
      alert("Please enter a search keyword");
      return;
    }

    // Retrieve the JWT token from localStorage
    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
      alert("You are not logged in. Please login to search.");
      return;
    }

    // Make an API call to the backend search method with the JWT token
    fetch(`http://localhost:5786/api/facility/search?keyword=${keyword}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`, // Include JWT token in the request headers
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "error") {
        alert(data.message);
      } else {
        // Process and display the results
        displaySearchResults(data.data);
      }
    })
    .catch(error => console.error("Error fetching facilities:", error));
  });

  function displaySearchResults(facilities) {
    // Get the container where the results will be displayed
    const resultsContainer = document.getElementById("facilityResults");
  
    // Check if the results container exists
    if (!resultsContainer) {
      console.error("Error: Results container not found");
      return;
    }
  
    // Clear any existing results
    resultsContainer.innerHTML = '';
  
    if (facilities.length === 0) {
      resultsContainer.innerHTML = '<p>No facilities found for this keyword.</p>';
      return;
    }
  
    // Loop through facilities and create HTML elements to display each facility
    facilities.forEach(facility => {
      const li = document.createElement("li");
      li.classList.add("event-card", "has-before", "hover:shine");
  
      const banner = document.createElement("div");
      banner.classList.add("card-banner", "img-holder");
  
      // Facility details
      const name = document.createElement("h3");
      name.classList.add("card-title", "title-2", "text-center");
      name.innerText = facility.name;
  
      const restaurantName = document.createElement("p");
      restaurantName.classList.add("card-subtitle", "label-2", "text-center");
      restaurantName.innerText = facility.restaurant.name;
  
      const description = document.createElement("p");
      description.classList.add("card-content", "label-2", "text-center");
      description.innerText = facility.description;
  
      li.appendChild(banner);
      li.appendChild(restaurantName);
      li.appendChild(name);
      li.appendChild(description);
  
      resultsContainer.appendChild(li);
    });
  }
  


