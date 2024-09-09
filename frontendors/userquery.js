document.addEventListener('DOMContentLoaded', () => {
    const queryForm = document.getElementById('query-form');

    queryForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the form from submitting the default way

        // Gather form data
        const userId = document.getElementById('userId').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validate input
        if (!subject || !message) {
            alert('Please fill in the subject and message.');
            return;
        }

        // Create a data object
        const data = {
            userId: userId ? parseInt(userId, 10) : undefined, // Include userId only if it is provided
            subject: subject,
            message: message
        };

        try {
            // Send a POST request
            const response = await fetch('http://localhost:5786/api/user-queries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // Assuming JWT token is stored in localStorage
                },
                body: JSON.stringify(data)
            });

            // Handle the response
            if (response.ok) {
                const result = await response.json();
                alert('Your query has been submitted successfully.');
                queryForm.reset(); // Clear form fields
            } else {
                const error = await response.json();
                alert(`Failed to submit query: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting your query.');
        }
    });
});
