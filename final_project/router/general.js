const express = require('express');
let books = require("./booksdb.js");

let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (users.some(user => user.username === username)) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered"
    });
});

// Get all books
public_users.get("/", async (req, res) => {
    try {
        const result = await Promise.resolve(books);
        return res.status(200).json({ books: result });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get book by ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
    try {
        const result = await Promise.resolve(books[req.params.isbn]);

        if (!result) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get books by author
public_users.get("/author/:author", async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();

        const result = await Promise.resolve(
            Object.values(books).filter(
                book => book.author.toLowerCase() === author
            )
        );

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get books by title
public_users.get("/title/:title", async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();

        const result = await Promise.resolve(
            Object.values(books).filter(
                book => book.title.toLowerCase().includes(title)
            )
        );

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get book reviews
public_users.get("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;