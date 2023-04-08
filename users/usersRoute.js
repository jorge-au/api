const express = require("express");
const route = express.Router();
const{listAll, listOne, addOne, editOne, removeOne} = require("./usersControl")

route.get("/", listAll);

route.get("/:id", listOne);

route.post("/", addOne);

route.patch("/:user", editOne);

route.delete("/:id", removeOne);


module.exports = route;