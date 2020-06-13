//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();
const md5= require("md5");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});
//its not simple javascript object but object created from mongoose schema class
const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String
  }
);
//key used to encrypt database


const User = new mongoose.model("User", userSchema);

app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
  const newUser = new User({
    email: req.body.username,
    //use md5 to turn this password into irreversable hash
    password: md5(req.body.password)
  });
//user can only view secrets page, if he has successfully been created on database
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post("/login", function(req,res){
  const username= req.body.username;
  const password= md5(req.body.password);
  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  });
});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
