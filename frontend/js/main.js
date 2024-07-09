document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = 'https://library-production-4ef2.up.railway.app';

    async function handleRegistrationForm(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');
        const role = formData.get('role');

        try {
            const response = await fetch(`${BASE_URL}/register`, {
                method: 'POST',
                body: JSON.stringify({ username, password, role }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (response.ok) {
                alert('Registration successful. Please login.');
                window.location.href = 'login.html';
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error('Registration error:', error.message);
            alert('Registration failed. Please try again.');
        }
    }

    async function handleLoginForm(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.access_token);
                window.location.href = 'books.html';
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error('Login error:', error.message);
            alert('Login failed. Please try again.');
        }
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistrationForm);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginForm);
    }
});