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

    async function handleAddBookForm(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const title = formData.get('title');
        const author = formData.get('author');

        try {
            const response = await fetch(`${BASE_URL}/books`, {
                method: 'POST',
                body: JSON.stringify({ title, author }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                alert('Book added successfully.');
                window.location.reload(); // Reload to fetch the updated list of books
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error('Add book error:', error.message);
            alert('Failed to add book. Please try again.');
        }
    }

    async function fetchBooks() {
        try {
            const response = await fetch(`${BASE_URL}/books`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                const booksList = document.getElementById('booksList');
                booksList.innerHTML = ''; // Clear existing list

                data.forEach(book => {
                    const bookItem = document.createElement('div');
                    bookItem.className = 'book';
                    bookItem.innerHTML = `
                        <h3>${book.title}</h3>
                        <p>${book.author}</p>
                        <p>Status: ${book.status}</p>
                        <button onclick="handleBorrowBook(${book.id})">Borrow</button>
                        <button onclick="handleReturnBook(${book.id})">Return</button>
                        <button onclick="handleEditBook(${book.id})">Edit</button>
                        <button onclick="handleDeleteBook(${book.id})">Delete</button>
                    `;
                    booksList.appendChild(bookItem);
                });
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error('Fetch books error:', error.message);
            alert('Failed to fetch books. Please try again.');
        }
    }

    async function handleBorrowBook(bookId) {
        try {
            const response = await fetch(`${BASE_URL}/books/${bookId}/borrow`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                alert('Book borrowed successfully.');
                window.location.reload(); // Reload to update the status
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error('Borrow book error:', error.message);
            alert('Failed to borrow book. Please try again.');
        }
    }

    async function handleReturnBook(bookId) {
        try {
            const response = await fetch(`${BASE_URL}/books/${bookId}/return`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                alert('Book returned successfully.');
                window.location.reload(); // Reload to update the status
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error('Return book error:', error.message);
            alert('Failed to return book. Please try again.');
        }
    }

    async function handleEditBook(bookId) {
        const newTitle = prompt('Enter new title:');
        const newAuthor = prompt('Enter new author:');

        if (!newTitle || !newAuthor) {
            return alert('Both title and author are required.');
        }

        try {
            const response = await fetch(`${BASE_URL}/books/${bookId}`, {
                method: 'PUT',
                body: JSON.stringify({ title: newTitle, author: newAuthor }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                alert('Book updated successfully.');
                window.location.reload(); // Reload to fetch the updated list of books
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error('Edit book error:', error.message);
            alert('Failed to update book. Please try again.');
        }
    }

    async function handleDeleteBook(bookId) {
        if (!confirm('Are you sure you want to delete this book?')) {
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/books/${bookId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                alert('Book deleted successfully.');
                window.location.reload(); // Reload to fetch the updated list of books
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

    const addBookForm = document.getElementById('addBookFormElement');
    if (addBookForm) {
        addBookForm.addEventListener('submit', handleAddBookForm);
    }

    if (document.getElementById('booksList')) {
        fetchBooks();
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    }

    if (!localStorage.getItem('token') && window.location.pathname !== '/login.html' && window.location.pathname !== '/register.html') {
        window.location.href = 'login.html';
    }
});
