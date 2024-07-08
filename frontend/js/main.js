
async function handleLoginForm(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
        const response = await fetch('https://library-production-4ef2.up.railway.app/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const { access_token } = await response.json();
        localStorage.setItem('token', access_token);
        window.location.href = 'books.html'; // Redirect to books page on successful login
    } catch (error) {
        console.error('Login error:', error.message);
        alert('Login failed. Please check your credentials.');
    }
}

// Function to handle form submission for registration
async function handleRegistrationForm(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');
    const role = formData.get('role');

    try {
        const response = await fetch('https://library-production-4ef2.up.railway.app/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, role })
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        alert('Registration successful. Please login.');
        window.location.href = 'login.html'; // Redirect to login page after registration
    } catch (error) {
        console.error('Registration error:', error.message);
        alert('Registration failed. Please try again.');
    }
}

// Attach form submission handlers
document.getElementById('loginForm').addEventListener('submit', handleLoginForm);
document.getElementById('registerForm').addEventListener('submit', handleRegistrationForm);
