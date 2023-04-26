require("dotenv").config();
require("./database/config");
const PORT = process.env.PORT || 3000;
const express = require('express');
const hbs = require("express-handlebars");
const path = require("path");
const server = express();

server.use(express.json());
server.use(express.urlencoded({extended: true})); //lectura de formularios
server.use(express.static('public'));

// Bootstrap files via static routes
server.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
server.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));

// Handlebars setup
server.set("view engine", "hbs");
server.set("views", path.join(__dirname, "views"));
server.engine("hbs", hbs.engine({extname: "hbs"}));

server.get("/", (req, res) => {
	const content = `
	<h1>Server con Express</h1>
	<pre>Construyendo una api con Express</pre>`
	res.send(content)
});

// Router for /users endpoint
server.use("/users", require("./users/usersRoute"));

// Router for /posts endpoint
server.use("/posts", require("./posts/postsRoute"))

// Catch error 
server.use((req, res, next) => {
	let error = new Error()
	error.status = 404
	error.message = "Resource not found"
	next(error)
});

// Error handler (manejador de errores)
server.use((error, req, res, next) => {
	if(!error.status){
		error.status = 500;
		error.message = "Internal error server"
	}
	res
	.status(error.status)
	.json({status: error.status, message: error.message})
});

// Runn server
server.listen(PORT, (err)=>{
	if(err){
		console.log(`There ir an error: ${err}`)
	} else {
		console.log(`Server running on the port: ${PORT}`)
	}
});