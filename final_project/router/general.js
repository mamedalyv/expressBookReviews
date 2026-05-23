const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
const { users } = require("./users.js");
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Please provide a username and password" });
    }

    // Check if username already exists
    const userExists = users.some((user) => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Register the new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(JSON.stringify(books, null, 4));
});


public_users.get('/books/promise', (req, res) => {
    new Promise((resolve, reject) => {
        const bookList = books;
        if (bookList) {
            resolve(bookList);
        } else {
            reject(new Error("Books not found"));
        }
    })
    .then(bookList => {
        return res.status(200).json(JSON.stringify(bookList, null, 4));
    })
    .catch(error => {
        return res.status(500).json({ message: "Error fetching books", error: error.message });
    });
});


public_users.get('/books/async', async (req, res) => {
    try {
        const bookList = await new Promise((resolve, reject) => {
            if (books) {
                resolve(books);
            } else {
                reject(new Error("Books not found"));
            }
        });
        return res.status(200).json(JSON.stringify(bookList, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});



// Existing code — Task 2
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(JSON.stringify(book, null, 4));
});

// Task 11 — Promise callbacks
public_users.get('/isbn/promise/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject(new Error("Book not found"));
        }
    })
    .then(book => {
        return res.status(200).json(JSON.stringify(book, null, 4));
    })
    .catch(error => {
        return res.status(404).json({ message: error.message });
    });
});

// Task 11 — Async-await
public_users.get('/isbn/async/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const book = await new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject(new Error("Book not found"));
            }
        });
        return res.status(200).json(JSON.stringify(book, null, 4));
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});
  

// Existing code — Task 3
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    const authorBooks = [];
    bookKeys.forEach((key) => {
        if (books[key].author === author) {
            authorBooks.push(books[key]);
        }
    });
    if (authorBooks.length > 0) {
        return res.status(200).json(authorBooks);
    }
    return res.status(404).json({ message: "Author not found" });
});

// Task 12 — Promise callbacks
public_users.get('/author/promise/:author', (req, res) => {
    const author = req.params.author;

    new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        const authorBooks = [];
        bookKeys.forEach((key) => {
            if (books[key].author === author) {
                authorBooks.push(books[key]);
            }
        });
        if (authorBooks.length > 0) {
            resolve(authorBooks);
        } else {
            reject(new Error("Author not found"));
        }
    })
    .then(authorBooks => {
        return res.status(200).json(authorBooks);
    })
    .catch(error => {
        return res.status(404).json({ message: error.message });
    });
});

// Task 12 — Async-await
public_users.get('/author/async/:author', async (req, res) => {
    const author = req.params.author;

    try {
        const authorBooks = await new Promise((resolve, reject) => {
            const bookKeys = Object.keys(books);
            const authorBooks = [];
            bookKeys.forEach((key) => {
                if (books[key].author === author) {
                    authorBooks.push(books[key]);
                }
            });
            if (authorBooks.length > 0) {
                resolve(authorBooks);
            } else {
                reject(new Error("Author not found"));
            }
        });
        return res.status(200).json(authorBooks);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});


// Existing code — Task 4
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    const titleBooks = [];
    bookKeys.forEach((key) => {
        if (books[key].title === title) {
            titleBooks.push(books[key]);
        }
    });
    if (titleBooks.length > 0) {
        return res.status(200).json(titleBooks);
    }
    return res.status(404).json({ message: "Title not found" });
});

// Task 13 — Promise callbacks
public_users.get('/title/promise/:title', (req, res) => {
    const title = req.params.title;

    new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        const titleBooks = [];
        bookKeys.forEach((key) => {
            if (books[key].title === title) {
                titleBooks.push(books[key]);
            }
        });
        if (titleBooks.length > 0) {
            resolve(titleBooks);
        } else {
            reject(new Error("Title not found"));
        }
    })
    .then(titleBooks => {
        return res.status(200).json(titleBooks);
    })
    .catch(error => {
        return res.status(404).json({ message: error.message });
    });
});

// Task 13 — Async-await
public_users.get('/title/async/:title', async (req, res) => {
    const title = req.params.title;

    try {
        const titleBooks = await new Promise((resolve, reject) => {
            const bookKeys = Object.keys(books);
            const titleBooks = [];
            bookKeys.forEach((key) => {
                if (books[key].title === title) {
                    titleBooks.push(books[key]);
                }
            });
            if (titleBooks.length > 0) {
                resolve(titleBooks);
            } else {
                reject(new Error("Title not found"));
            }
        });
        return res.status(200).json(titleBooks);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});


// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
