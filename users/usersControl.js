// Aqui va la logica de mi api
const {getAllUsers,getUserById, registerUser, loginUser, editUserById, deleteUserById} = require("./usersModel");
const notNumber = require("../utils/notNumber");
const {hashPassword, checkPassword} = require("../utils/handlePassword");

// List all users
const listAll = async(req, res, next) => {
    const dbResponse = await getAllUsers();
    if(dbResponse instanceof Error) {
        return next(dbResponse)
    } else {
        res.status(200).json(dbResponse);
    }
};

// List user By id
const listOne = async(req, res, next) => {
    if(notNumber(req.params.id, res)) return;
    const dbResponse = await getUserById(Number(req.params.id));
    if(dbResponse instanceof Error) return next(dbResponse);
    if(dbResponse.length){
        res.status(200).json(dbResponse)
    } else {
        next()
    }
};

// Register new user
const register = async(req, res, next) => {
    const password = await hashPassword(req.body.password);
    const dbResponse = await registerUser({...req.body, password});
    if(dbResponse instanceof Error) {
        next(dbResponse);
    } else {
        res.status(201).json(`User ${req.body.name} created!`);
    }
};

// Login user
const login = async(req, res, next) => {
    const dbResponse = await loginUser(req.body.email);
   if(!dbResponse.length){ // esta linea se lee, si dbresponse No tiene longitud osea esta en cero
     return next()
   } 
   if(await checkPassword(req.body.password, dbResponse[0].password)){
        res.sendStatus(200)
   } else {
    let error = new Error
    error.status = 401
    error.message = "Unauthorized"
    next(error)
   }
};

// Patch existing user
const editOne = async(req, res, next) => {
    if (notNumber(req.params.id, res)) return;
    const dbResponse = await editUserById(+req.params.id, req.body);
    if (dbResponse instanceof Error) return next(dbResponse);
    dbResponse.affectedRows ? res.status(200).json(req.body) : next()
};

// Delete user By Id
const removeOne = async(req, res, next) => {
    if(notNumber(req.params.id, res)) return 
    const dbResponse = await deleteUserById(Number(req.params.id));
    if(dbResponse instanceof Error) return next(dbResponse);
    if(dbResponse.affectedRows){
        res.status(204).end()
    } else{
        next()
    }
};

module.exports = {listAll, listOne, register, login, editOne, removeOne};