const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


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


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(JSON.stringify(book, null, 4));
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    
    // 1. Obtain all keys of the books object
    const bookKeys = Object.keys(books);
    
    // 2. Iterate through keys and collect matching books
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


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    // 1. Obtain all keys of the books object
    const bookKeys = Object.keys(books);

    // 2. Iterate through keys and collect matching books
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
