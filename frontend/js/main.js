document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = 'https://library-production-4ef2.up.railway.app';
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const booksContainer = document.getElementById('booksContainer');
    const bookActionModal = $('#bookActionModal');
    const bookTitleElement = document.getElementById('bookTitle');
    const bookAuthorElement = document.getElementById('bookAuthor');
    const bookStatusElement = document.getElementById('bookStatus');
    const actionButtonsElement = document.getElementById('actionButtons');

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
    async function fetchBooks() {
        if (!token) {
            redirectToLogin();
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/books`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            const books = await response.json();
            displayBooks(books);
        } catch (error) {
            console.error('Error fetching books:', error.message);
            alert('Failed to fetch books');
        }
    }

    function displayBooks(books) {
        booksContainer.innerHTML = '';
        books.forEach(book => {
            const col = document.createElement('div');
            col.classList.add('col-md-4', 'mb-4');
            const card = createBookCard(book);
            col.appendChild(card);
            booksContainer.appendChild(col);
        });
    }

    function createBookCard(book) {
        const card = document.createElement('div');
        card.classList.add('card', 'h-100', 'shadow-sm');
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <p class="card-text">Author: ${book.author}</p>
                <p class="card-text">Status: ${book.status}</p>
                ${generateActionButtons(book)}
            </div>
        `;
        return card;
    }

    function generateActionButtons(book) {
        let buttonsHTML = '';
        if (role === 'LIBRARIAN') {
            buttonsHTML = `
                <button class="btn btn-warning btn-sm mr-2" onclick="openBookActionModal(${book.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id})">Delete</button>
            `;
        } else if (role === 'MEMBER') {
            if (book.status === 'AVAILABLE') {
                buttonsHTML = `<button class="btn btn-success btn-sm" onclick="borrowBook(${book.id})">Borrow</button>`;
            } else if (book.status === 'BORROWED') {
                buttonsHTML = `<button class="btn btn-primary btn-sm" onclick="returnBook(${book.id})">Return</button>`;
            }
        }
        return buttonsHTML;
    }

    async function openBookActionModal(bookId) {
        try {
            const response = await fetch(`${BASE_URL}/books/${bookId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch book details');
            }
            const book = await response.json();
            bookTitleElement.value = book.title;
            bookAuthorElement.value = book.author;
            bookStatusElement.value = book.status;
            actionButtonsElement.innerHTML = `
                <button type="button" class="btn btn-primary" onclick="updateBook(${book.id})">Update</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            `;
            bookActionModal.modal('show');
        } catch (error) {
            console.error('Error fetching book details:', error.message);
            alert('Failed to fetch book details');
        }
    }

    async function updateBook(bookId) {
        const title = bookTitleElement.value;
        const author = bookAuthorElement.value;
        const status = bookStatusElement.value;

        try {
            const response = await fetch(`${BASE_URL}/books/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, author, status })
            });
            if (!response.ok) {
                throw new Error('Failed to update book');
            }
            bookActionModal.modal('hide');
            fetchBooks();
            alert('Book updated successfully');
        } catch (error) {
            console.error('Error updating book:', error.message);
            alert('Failed to update book');
        }
    }

    async function deleteBook(bookId) {
        if (!confirm('Are you sure you want to delete this book?')) {
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/books/${bookId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete book');
            }
            fetchBooks();
            alert('Book deleted successfully');
        } catch (error) {
            console.error('Error deleting book:', error.message);
            alert('Failed to delete book');
        }
    }

    async function borrowBook(bookId) {
        try {
            const response = await fetch(`${BASE_URL}/books/${bookId}/borrow`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to borrow book');
            }
            fetchBooks();
            alert('Book borrowed successfully');
        } catch (error) {
            console.error('Error borrowing book:', error.message);
            alert('Failed to borrow book');
        }
    }
    async function addBook(event) {
        event.preventDefault();

        const formData = new FormData(addBookForm);
        const title = formData.get('title');
        const author = formData.get('author');

        try {
            const response = await fetch(`${BASE_URL}/books`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, author })
            });
            if (!response.ok) {
                throw new Error('Failed to add book');
            }
            fetchBooks();
            $('#addBookModal').modal('hide');
            addBookForm.reset();
            alert('Book added successfully');
        } catch (error) {
            console.error('Error adding book:', error.message);
            alert('Failed to add book');
        }
    }

    addBookForm.addEventListener('submit', addBook);


    async function returnBook(bookId) {
        try {
            const response = await fetch(`${BASE_URL}/books/${bookId}/return`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to return book');
            }
            fetchBooks();
            alert('Book returned successfully');
        } catch (error) {
            console.error('Error returning book:', error.message);
            alert('Failed to return book');
        }
    }

    function redirectToLogin() {
        alert('You need to login to access this page.');
        window.location.href = 'login.html';
    }

    fetchBooks();

});
