// Aqui va la logica de mi api
const {getAllUsers,getUserById, addNewUser, editUserById, deleteUserById} = require("./usersModel");
const notNumber = require("../utils/notNumber");

// List all users
const listAll = async(req, res, next) => {
    const dbResponse = await getAllUsers();
    if(dbResponse.hasOwnProperty("error")) {
        return res.status(500).json(dbResponse)
    } else {
        res.status(200).json(dbResponse);
    }
};

// List user By id
const listOne = async(req, res, next) => {
    if(notNumber(req.params.id, res)) return;
    const dbResponse = await getUserById(Number(req.params.id));
    if(dbResponse.hasOwnProperty("error")) return res.status(500).json(dbResponse);
    if(dbResponse.length){
        res.status(200).json(dbResponse)
    } else {
        next()
    }
};

// Post new user
const addOne = async(req, res, next) => {
    const {name, userName, email} = req.body;
    if(!name || !userName || !email && (name === "" || userName === "" || email === "")) {
        let error = new Error("All fields required")
        error.status = 400
        next(error)
    }
    const dbResponse = await addNewUser(req.body);
    if(dbResponse.hasOwnProperty("error")){
         res.status(500).json(dbResponse)
    } else {
        res.status(201).json(req.body);
    }
};

// Patch existing user
const editOne = async(req, res, next) => {
    if (notNumber(req.params.id, res)) return;
    const dbResponse = await editUserById(+req.params.id, req.body)
    console.log(dbResponse)
    if (dbResponse.hasOwnProperty("error")) return res.status(500).json(dbResponse);
    dbResponse.affectedRows ? res.status(200).json(req.body) : next()
};

// Delete user By Id
const removeOne = async(req, res, next) => {
    if(notNumber(req.params.id, res)) return 
    const dbResponse = await deleteUserById(Number(req.params.id));
    if(dbResponse.hasOwnProperty("error")) return res.status(500).json(dbResponse)
    if(dbResponse.affectedRows){
        res.status(204).end()
    } else{
        next()
    }
};

module.exports = {listAll, listOne, addOne, editOne, removeOne};