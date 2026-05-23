const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
const { users } = require("./users.js");
const public_users = express.Router();
const axios = require('axios');


// ===== Task 1: Register User =====
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Ensure both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Please provide a username and password" });
    }

    // Check if username already exists in the users array
    const userExists = users.some((user) => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Add new user to the users array
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});


// ===== Task 1: Get all books =====
public_users.get('/', function (req, res) {
    // Return the entire books object as a formatted JSON string
    return res.status(200).json(JSON.stringify(books, null, 4));
});


// ===== Task 10: Get all books using Promise callbacks =====
public_users.get('/books/promise', (req, res) => {
    new Promise((resolve, reject) => {
        // Resolve with books if available, otherwise reject
        if (books) {
            resolve(books);
        } else {
            reject(new Error("Books not found"));
        }
    })
    .then(bookList => {
        // Return the book list as a formatted JSON string on success
        return res.status(200).json(JSON.stringify(bookList, null, 4));
    })
    .catch(error => {
        // Handle errors if books are unavailable
        return res.status(500).json({ message: "Error fetching books", error: error.message });
    });
});


// ===== Task 10: Get all books using Async-Await =====
public_users.get('/books/async', async (req, res) => {
    try {
        // Await resolution of the promise that fetches all books
        const bookList = await new Promise((resolve, reject) => {
            if (books) {
                resolve(books);
            } else {
                reject(new Error("Books not found"));
            }
        });
        // Return the book list as a formatted JSON string
        return res.status(200).json(JSON.stringify(bookList, null, 4));
    } catch (error) {
        // Handle errors if books are unavailable
        return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});


// ===== Task 2: Get book details by ISBN =====
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    // Return 404 if the book is not found
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(JSON.stringify(book, null, 4));
});


// ===== Task 11: Get book details by ISBN using Promise callbacks =====
public_users.get('/isbn/promise/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    new Promise((resolve, reject) => {
        const book = books[isbn];
        // Resolve with book if found, otherwise reject with error
        if (book) {
            resolve(book);
        } else {
            reject(new Error("Book not found"));
        }
    })
    .then(book => {
        // Return book details as formatted JSON on success
        return res.status(200).json(JSON.stringify(book, null, 4));
    })
    .catch(error => {
        // Return 404 if the book is not found
        return res.status(404).json({ message: error.message });
    });
});


// ===== Task 11: Get book details by ISBN using Async-Await =====
public_users.get('/isbn/async/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        // Await resolution of the promise that fetches the book by ISBN
        const book = await new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject(new Error("Book not found"));
            }
        });
        // Return book details as formatted JSON
        return res.status(200).json(JSON.stringify(book, null, 4));
    } catch (error) {
        // Return 404 if the book is not found
        return res.status(404).json({ message: error.message });
    }
});


// ===== Task 3: Get book details by Author =====
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    // Get all keys from the books object
    const bookKeys = Object.keys(books);

    // Filter books that match the provided author name
    const authorBooks = [];
    bookKeys.forEach((key) => {
        if (books[key].author === author) {
            authorBooks.push(books[key]);
        }
    });

    // Return matching books or 404 if none found
    if (authorBooks.length > 0) {
        return res.status(200).json(authorBooks);
    }
    return res.status(404).json({ message: "Author not found" });
});


// ===== Task 12: Get book details by Author using Promise callbacks =====
public_users.get('/author/promise/:author', (req, res) => {
    const author = req.params.author;

    new Promise((resolve, reject) => {
        // Get all keys from the books object
        const bookKeys = Object.keys(books);

        // Iterate through books and collect those matching the author
        const authorBooks = [];
        bookKeys.forEach((key) => {
            if (books[key].author === author) {
                authorBooks.push(books[key]);
            }
        });

        // Resolve if matches found, otherwise reject
        if (authorBooks.length > 0) {
            resolve(authorBooks);
        } else {
            reject(new Error("Author not found"));
        }
    })
    .then(authorBooks => {
        // Return matching books on success
        return res.status(200).json(authorBooks);
    })
    .catch(error => {
        // Return 404 if no books found for the author
        return res.status(404).json({ message: error.message });
    });
});


// ===== Task 12: Get book details by Author using Async-Await =====
public_users.get('/author/async/:author', async (req, res) => {
    const author = req.params.author;

    try {
        // Await resolution of the promise that filters books by author
        const authorBooks = await new Promise((resolve, reject) => {
            // Get all keys from the books object
            const bookKeys = Object.keys(books);

            // Iterate through books and collect those matching the author
            const authorBooks = [];
            bookKeys.forEach((key) => {
                if (books[key].author === author) {
                    authorBooks.push(books[key]);
                }
            });

            // Resolve if matches found, otherwise reject
            if (authorBooks.length > 0) {
                resolve(authorBooks);
            } else {
                reject(new Error("Author not found"));
            }
        });
        // Return matching books
        return res.status(200).json(authorBooks);
    } catch (error) {
        // Return 404 if no books found for the author
        return res.status(404).json({ message: error.message });
    }
});


// ===== Task 4: Get book details by Title =====
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    // Get all keys from the books object
    const bookKeys = Object.keys(books);

    // Filter books that match the provided title
    const titleBooks = [];
    bookKeys.forEach((key) => {
        if (books[key].title === title) {
            titleBooks.push(books[key]);
        }
    });

    // Return matching books or 404 if none found
    if (titleBooks.length > 0) {
        return res.status(200).json(titleBooks);
    }
    return res.status(404).json({ message: "Title not found" });
});


// ===== Task 13: Get book details by Title using Promise callbacks =====
public_users.get('/title/promise/:title', (req, res) => {
    const title = req.params.title;

    new Promise((resolve, reject) => {
        // Get all keys from the books object
        const bookKeys = Object.keys(books);

        // Iterate through books and collect those matching the title
        const titleBooks = [];
        bookKeys.forEach((key) => {
            if (books[key].title === title) {
                titleBooks.push(books[key]);
            }
        });

        // Resolve if matches found, otherwise reject
        if (titleBooks.length > 0) {
            resolve(titleBooks);
        } else {
            reject(new Error("Title not found"));
        }
    })
    .then(titleBooks => {
        // Return matching books on success
        return res.status(200).json(titleBooks);
    })
    .catch(error => {
        // Return 404 if no books found for the title
        return res.status(404).json({ message: error.message });
    });
});


// ===== Task 13: Get book details by Title using Async-Await =====
public_users.get('/title/async/:title', async (req, res) => {
    const title = req.params.title;

    try {
        // Await resolution of the promise that filters books by title
        const titleBooks = await new Promise((resolve, reject) => {
            // Get all keys from the books object
            const bookKeys = Object.keys(books);

            // Iterate through books and collect those matching the title
            const titleBooks = [];
            bookKeys.forEach((key) => {
                if (books[key].title === title) {
                    titleBooks.push(books[key]);
                }
            });

            // Resolve if matches found, otherwise reject
            if (titleBooks.length > 0) {
                resolve(titleBooks);
            } else {
                reject(new Error("Title not found"));
            }
        });
        // Return matching books
        return res.status(200).json(titleBooks);
    } catch (error) {
        // Return 404 if no books found for the title
        return res.status(404).json({ message: error.message });
    }
});


// ===== Task 5: Get book reviews by ISBN =====
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    // Return 404 if book does not exist
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Return the reviews object for the book
    return res.status(200).json(book.reviews);
});

module.exports.general = public_users;