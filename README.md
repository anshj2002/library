# Library Management System

## Introduction

The Library Management System is a web-based application designed to facilitate efficient management of books and users in a library setting. Developed using Flask for the backend and HTML/CSS/JavaScript for the frontend, it provides functionalities for user registration, authentication, book management, and borrowing/returning books. This README provides an overview of the system architecture, technologies used, deployment instructions, and API documentation.

## Technology Stack

### Backend
- **Framework**: Flask
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT (JSON Web Tokens)

### Frontend
- **Languages**: HTML, CSS, JavaScript
- **Framework/Libraries**: Bootstrap for styling

### Deployment
- **Backend**: Deployed on Railway, using PostgreSQL for database storage.
- **Frontend**: Hosted on GitHub Pages.

## Architecture

The system follows a client-server architecture:
- **Client**: HTML/CSS/JavaScript frontend communicates with the Flask backend via RESTful APIs.
- **Server**: Flask server processes requests, interacts with the PostgreSQL database using SQLAlchemy for ORM operations.

## APIs

### Endpoints

- **POST `/register`**
  - Registers a new user with username, password, and role (Member or Librarian).
  
- **POST `/login`**
  - Authenticates user credentials and returns a JWT token for accessing protected endpoints.

- **POST `/books`**
  - Adds a new book to the library database.
  
- **GET `/books`**
  - Retrieves a list of all books in the library.

- **PUT `/books/<book_id>`**
  - Updates the details of a specific book.

- **DELETE `/books/<book_id>`**
  - Deletes a specific book from the library.

- **POST `/books/<book_id>/borrow`**
  - Marks a book as borrowed by the authenticated user.

- **POST `/books/<book_id>/return`**
  - Marks a borrowed book as returned by the authenticated user.

## Deployment Process

### Backend Deployment on Railway

1. **Setup Railway Project**: Create a Railway project and link it to your GitHub repository.
   
2. **Environment Variables**: Set up environment variables for database connection and JWT secret key in Railway.

3. **Deploy**: Railway automatically deploys changes from your GitHub repository.

### Frontend Deployment on GitHub Pages

1. **Build**: Compile your frontend code (HTML, CSS, JavaScript) into a production-ready format.

2. **Deploy**: Push the built code to a GitHub repository dedicated to hosting GitHub Pages.

3. **Configure**: In repository settings, set up GitHub Pages to deploy from the `main` branch (or another branch of choice).

## Local Development

To run the project locally:
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/library-management-system.git
   cd library-management-system
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Backend dependencies
   cd backend
   pip install -r requirements.txt

   # Frontend dependencies
   cd ../frontend
   # Typically, no additional dependencies for basic HTML/CSS/JS

   cd ..
   ```

3. Set up environment variables:
   - Create a `.env` file in the `backend` directory with:
     ```
     DATABASE_URL=your_postgresql_database_url
     SECRET_KEY=your_jwt_secret_key
     ```

4. Run the backend Flask server:
   ```bash
   cd backend
   python app.py
   ```

5. Access the frontend:
   - Open `index.html` or `login.html` from the `frontend` directory in a web browser.

         Flow :-
     
![image](https://github.com/anshj2002/library/assets/97294496/186d836e-d94f-4c53-8b75-2c3aab7c68a1)

    Explanation:

  User Registration/Login:

Users can either register with a new account or login with existing credentials.
Authentication is handled to verify user identity and manage access.

  User Role:

Based on the role (Member or Librarian) assigned during registration or login, different functionalities are available.

  Member Actions:

* View Books: Members can see the list of available books.
* Borrow Book: Members can borrow a book from the library.
* Return Book: Members can return a borrowed book.

  Librarian Actions:

* Add New Book: Librarians can add a new book to the library database.
* Edit Book: Librarians can modify details (title, author) of existing books.
* Delete Book: Librarians can remove books from the library collection.
* View Books (all):

   Librarians can view all books in the library, including details like availability and status.
