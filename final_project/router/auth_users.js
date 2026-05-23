const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const { users } = require("./users.js");
const JWT_SECRET = "access";

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
    return users.some((user) => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Please provide username and password" });
    }

    // Check if credentials are valid
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Sign JWT and store in session
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
    req.session.token = token;
    req.session.username = username;

    return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.username;

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if review is provided
    if (!review) {
        return res.status(400).json({ message: "Please provide a review" });
    }

    // Add or modify the review — keyed by username so each user has one review per book
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/modified successfully", reviews: books[isbn].reviews });
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if user has a review for this book
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review found for this user" });
    }

    // Delete only the review belonging to the logged-in user
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
