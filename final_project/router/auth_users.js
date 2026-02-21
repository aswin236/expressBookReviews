const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
   return users.some(user => user.username === username);
};

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => 
    user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!isValid(username)) {
    return res.status(404).json({ message: "User not registered" });
  }

  if (authenticatedUser(username, password)) {

    const accessToken = jwt.sign(
      { username: username },
      "fingerprint_customer",
      { expiresIn: "1h" }
    );

    req.session.authorization = {
      accessToken
    };

    return res.status(200).json({
      message: "User successfully logged in",
      token: accessToken
    });

  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Get username from decoded JWT (set in index.js auth middleware)
  const username = req.user.username;

  // Initialize reviews object if not present
  if (!book.reviews) {
    book.reviews = {};
  }

  // Add or modify review
  book.reviews[username] = review;

  return res.status(200).json({
    message: "Review successfully added/updated",
    reviews: book.reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const username = req.user.username;
  
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!book.reviews || !book.reviews[username]) {
      return res.status(404).json({ message: "No review found for this user" });
    }
  
    // Delete only this user's review
    delete book.reviews[username];
  
    return res.status(200).json({
      message: "Review successfully deleted",
      reviews: book.reviews
    });
  })

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
