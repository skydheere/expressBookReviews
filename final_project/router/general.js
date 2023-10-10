const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Return books
function getBooks() {
  return new Promise((resolve, reject) => {
      resolve(books);
  });
}


function getBooks1(callback) {
  
    callback(books);
 
}


function getByISBN(isbn) {
  return new Promise((resolve, reject) => {
      let isbnNumber = parseInt(isbn);
      if (books[isbnNumber]) {
          resolve(books[isbnNumber]);
      } else {
          reject({status:404, message:`ISBN ${isbn} not found`});
      }
  })
}


public_users.post("/register", (req,res) => {
  //Write your code here

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  getBooks1((result) => {
    res.send(JSON.stringify(result))
  });
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbnToFind = req.params.isbn;
  getByISBN(isbnToFind)
  .then(
    result => res.send(result),
    error => res.status(error.status).json({message: error.message})); 
 });
  
// Get book details based on author
public_users.get('/author/:author', function  (req, res) {
  //Write your code here
  const authorToFind = req.params.author;
   getBooks()
  .then((bookEntries) => Object.values(bookEntries))
  .then((books) => books.filter((book) => book.author === authorToFind))
  .then((filteredBooks) => res.send({"bookByAuthor":filteredBooks}));

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const titleToFind = req.params.title;


   getBooks()
  .then((bookEntries) => Object.values(bookEntries))
  .then((books) => books.filter((book) => book.title === titleToFind))
  .then((filteredBooks) => res.send({"bookByTitle":filteredBooks}));
  // return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here


  getByISBN(req.params.isbn)
  .then(
      result => res.send(result.reviews),
      error => res.status(error.status).json({message: error.message})
  );
  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;