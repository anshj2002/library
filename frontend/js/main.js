document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const BASE_URL = 'library-production-4ef2.up.railway.app'; 

    // Login functionality
    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const response = await fetch(`${BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('role', data.role);
            window.location.href = 'books.html';
        } else {
            alert(data.msg);
        }
    });

    // Registration functionality
    document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        const response = await fetch(`${BASE_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Registration successful!');
            window.location.href = 'login.html';
        } else {
            alert(data.msg);
        }
    });

    // Fetch books for members and librarians
    async function fetchBooks() {
        const response = await fetch(`${BASE_URL}/api/books`, {
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
        const response = await fetch(`${BASE_URL}/api/books/${bookId}/borrow`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            alert('Book borrowed successfully');
            fetchBooks();
        } else {
            alert('Failed to borrow book');
        }
    };

    // Delete book functionality (for librarians)
    window.deleteBook = async (bookId) => {
        const response = await fetch(`${BASE_URL}/api/books/${bookId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            alert('Book deleted successfully');
            fetchBooks();
        } else {
            alert('Failed to delete book');
        }
    };

    // Initial data fetch
    if (token) {
        fetchBooks();
    }
});
