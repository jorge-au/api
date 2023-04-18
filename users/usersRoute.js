const express = require("express");
const route = express.Router();
const {validatorCreatedUser} = require("../validators/users");
const{listAll, listOne, register, login, editOne, removeOne} = require("./usersControl");
const fileUpload = require("../utils/handleStorage");

// Get all users
route.get("/", listAll);

// Get user by id
route.get("/:id", listOne);

// Register new user
route.post("/register", fileUpload.single("file"), validatorCreatedUser, register);

// Login user
route.post("/login", login);

// Patch user
route.patch("/:id", editOne);

// Delete User by id
route.delete("/:id", removeOne);

module.exports = route;