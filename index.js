require("dotenv").config();
require("./database/config");
const express = require('express');
const server = express();
const PORT = process.env.PORT || 3000;
const router = require("./users/usersRoute.js")

server.use(express.json())
server.use(express.urlencoded({extended: true}))

server.get("/", (req, res) => {
	const content = `
	<h1>Server con Express</h1>
	<pre>Construyendo una api con Express</pre>`
	res.send(content)
});

server.use("/users", router);

// Catch error 
server.use("*", (req, res) => {
	res.status(404).json({message: "Resource not founded"})
})
// Runn server
server.listen(PORT, (err)=>{
	if(err){
		console.log(`There ir an error: ${err}`)
	} else {
		console.log(`Server running on the port: ${PORT}`)
	}
});