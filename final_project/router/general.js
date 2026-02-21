const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  // Check if username already exists
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }
  // Add new user
  users.push({ username: username, password: password });
  return res.status(201).json({ message: "User successfully registered. Now you can login" });
}); 

// Get the book list available in the shop
public_users.get('/allbooks', function (req, res) {
    return res.status(200).json(books);
});
public_users.get('/',function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).send(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  } 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;   // Step 1: get ISBN from URL
  const book = books[isbn];      // Step 2: find book
  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 2));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
const axios = require('axios');
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/book/${isbn}`);
    return res.status(200).send(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }

});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase();
  const bookKeys = Object.keys(books);
  const matchingBooks = [];

  bookKeys.forEach(key => {
    if (books[key].author.toLowerCase() === author) {
      matchingBooks.push(books[key]);
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 2));
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});
const axios = require('axios');

public_users.get('/author/:author', async function (req, res) {

  const author = req.params.author;

  try {
    const response = await axios.get(
      `http://localhost:5000/books/author/${author}`
    );

    return res.status(200).send(
      JSON.stringify(response.data, null, 2)
    );

  } catch (error) {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();
  const bookKeys = Object.keys(books);
  const matchingBooks = [];

  bookKeys.forEach(key => {
    if (books[key].title.toLowerCase() === title) {
      matchingBooks.push(books[key]);
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 2));
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});
const axios = require('axios');

public_users.get('/title/:title', async function (req, res) {

  const title = req.params.title;

  try {
    const response = await axios.get(
      `http://localhost:5000/books/title/${title}`
    );

    return res.status(200).send(
      JSON.stringify(response.data, null, 2)
    );

  } catch (error) {
    return res.status(404).json({
      message: "No books found with this title"
    });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;   // Step 1: get ISBN
  const book = books[isbn];      // Step 2: find book
  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 2));
  } else {
    return res.status(404).json({ message: "Book not found" });
  } 
});

module.exports.general = public_users;
