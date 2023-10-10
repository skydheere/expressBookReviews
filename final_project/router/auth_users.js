const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

let isUserExits = users.filter((user)=>{
  return user.username === username
});
if(isUserExits.length > 0){
  return true;
} else {
  return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

    let authenticateUsers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(authenticateUsers.length > 0){
      return true;
    } else {
      return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here

  const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
      }
      return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const isbn = req.params.isbn;
  let username = req.session.authorization['username']
  console.log("req.session.authorization ", req.session.authorization['username']);
  let review = books[isbn]['reviews'][username]
  if (review) {
      books[isbn]['reviews'][username] = req.query.review
      res.send(`${username}'s review updated successfully!`)
  } else {
      books[isbn]['reviews'][username] = req.query.review
      res.send(`${username}'s review added successfully!`)
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let username = req.session.authorization['username']
  let review = books[isbn]['reviews'][username]
  if (review) {
      delete books[isbn]['reviews'][username]
      res.send(`${username}'s review deleted successfully!`)
  } else {
      res.send(`${username}'s review deleted successfully!`)
  }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;