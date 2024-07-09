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

    async function fetchBooks() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/books`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                displayBooks(data);
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error('Fetch books error:', error.message);
            alert('Failed to fetch books. Please try again.');
        }
    }

    function displayBooks(books) {
        const booksList = document.getElementById('booksList');
        booksList.innerHTML = '';

        books.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book');

            const titleElement = document.createElement('h3');
            titleElement.textContent = book.title;

            const authorElement = document.createElement('p');
            authorElement.textContent = `Author: ${book.author}`;

            const statusElement = document.createElement('p');
            statusElement.textContent = `Status: ${book.status}`;

            // Add update and delete buttons for LIBRARIAN
            if (book.role === 'LIBRARIAN') {
                const updateButton = document.createElement('button');
                updateButton.textContent = 'Update';
                updateButton.addEventListener('click', () => updateBook(book.id));
                bookDiv.appendChild(updateButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deleteBook(book.id));
                bookDiv.appendChild(deleteButton);
            }

            bookDiv.appendChild(titleElement);
            bookDiv.appendChild(authorElement);
            bookDiv.appendChild(statusElement);

            booksList.appendChild(bookDiv);
        });
    }

    // Handle add book form submission
    const addBookForm = document.getElementById('addBookFormElement');
    addBookForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(addBookForm);
        const title = formData.get('title');
        const author = formData.get('author');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/books`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, author })
            });
            const data = await response.json();

            if (response.ok) {
                alert(data.msg);
                addBookForm.reset();
                fetchBooks(); // Refresh books list after adding
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error('Add book error:', error.message);
            alert('Failed to add book. Please try again.');
        }
    });

    // Functions for update and delete book
    async function updateBook(bookId) {
        // Implement update book functionality here
        console.log(`Update book with ID ${bookId}`);
        // You can create a form or modal for update operation
    }

    async function deleteBook(bookId) {
        // Implement delete book functionality here
        console.log(`Delete book with ID ${bookId}`);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/books/${bookId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                alert(data.msg);
                fetchBooks(); // Refresh books list after deleting
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error('Delete book error:', error.message);
            alert('Failed to delete book. Please try again.');
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
