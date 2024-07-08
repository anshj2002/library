document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const BASE_URL = 'https://library-production-4ef2.up.railway.app';

    // Login functionality
    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('role', data.role);
            window.location.href = 'books.html';  // Redirect to books page after successful login
        } else {
            alert(data.msg);  // Show error message if login fails
        }
    });

    // Registration functionality
    document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;  // Assuming you have a role field in your registration form
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Registration successful!');
            window.location.href = 'login.html';  // Redirect to login page after successful registration
        } else {
            alert(data.msg);  // Show error message if registration fails
        }
    });

    // Fetch books for members and librarians
    async function fetchBooks() {
        const response = await fetch(`${BASE_URL}/books`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const books = await response.json();
        const booksContainer = document.getElementById('booksContainer');
        booksContainer.innerHTML = books.map(book => `
            <div class="book">
                <h3>${book.title}</h3>
                <p>Author: ${book.author}</p>
                <p>Status: ${book.status}</p>
                ${role === 'MEMBER' && book.status === 'AVAILABLE' ? `<button onclick="borrowBook(${book.id})">Borrow</button>` : ''}
                ${role === 'LIBRARIAN' ? `<button onclick="deleteBook(${book.id})">Delete</button>` : ''}
            </div>
        `).join('');
    }

    // Borrow book functionality
    window.borrowBook = async (bookId) => {
        const response = await fetch(`${BASE_URL}/books/${bookId}/borrow`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            alert('Book borrowed successfully');
            fetchBooks();  // Refresh books list after borrowing
        } else {
            alert('Failed to borrow book');
        }
    };

    // Delete book functionality (for librarians)
    window.deleteBook = async (bookId) => {
        const response = await fetch(`${BASE_URL}/books/${bookId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            alert('Book deleted successfully');
            fetchBooks();  // Refresh books list after deletion
        } else {
            alert('Failed to delete book');
        }
    };

    
    if (token) {
        fetchBooks();  
    }
});
