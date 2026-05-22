const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

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

    return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
