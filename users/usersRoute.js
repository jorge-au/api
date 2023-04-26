const express = require("express");
const route = express.Router();
const {validatorCreatedUser, validatorLoginUser, validatorResetPassword} = require("../validators/users");
const{listAll, listOne, register, login, forgot, reset, saveNewPass, editOne, removeOne} = require("./usersControl");
const fileUpload = require("../utils/handleStorage");

// Get all users
route.get("/", listAll);

// Get user by id
route.get("/:id", listOne);

// Register new user
route.post("/register", fileUpload.single("file"), validatorCreatedUser, register);

// Login user
route.post("/login", validatorLoginUser, login);

//Frogot password
route.post("/forgot-password", forgot); //Desde el front entra el mail del usuario quien olvido el password

//Create and send magic link
route.get("/reset/:token", reset);//Mostramos el formulario de recuperacion de password

route.post("/reset/:token", validatorResetPassword, saveNewPass); //Recibimos la nueva contrasenia desde el formulario

// Patch user
route.patch("/:id", editOne);

// Delete User by id
route.delete("/:id", removeOne);

module.exports = route;