document.addEventListener('DOMContentLoaded', () => {
    const queryForm = document.getElementById('query-form');

    queryForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the form's default submit behavior

        // Redirect to the login page and pass userquery.html as the redirect target
        window.location.href = '/login.html?redirect=submitquery.html';
    });
});
