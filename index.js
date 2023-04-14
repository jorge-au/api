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
server.use((req, res, next) => {
	let error = new Error()
	error.status = 404
	error.message = "Resource not found"
	next(error)
});

// Error handler (manejador de errores)
server.use((error, req, res, next) => {
	if(!error.status) error.status = 500;
	error.status
	error.message
	res.status(error.status).json({status: error.status, message: error.message})
});

// Runn server
server.listen(PORT, (err)=>{
	if(err){
		console.log(`There ir an error: ${err}`)
	} else {
		console.log(`Server running on the port: ${PORT}`)
	}
});