// Aqui va la logica de mi api
const {getAllUsers,getUserById, registerUser, loginUser, editUserById, deleteUserById} = require("./usersModel");
const notNumber = require("../utils/notNumber");
const {hashPassword, checkPassword} = require("../utils/handlePassword");
const { tokenSign } = require("../utils/handleJWT");
const url = process.env.url_base;

// List all users
const listAll = async(req, res, next) => {
    const dbResponse = await getAllUsers();
    if(dbResponse instanceof Error) {
        return next(dbResponse)
    }
    if(dbResponse.length){
        res.status(200).json(dbResponse)
    } else{
        next()
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
    const image = url + req.file.filename;
    const password = await hashPassword(req.body.password);
    const dbResponse = await registerUser({...req.body, password, image});//ES6 pasword: password
    if(dbResponse instanceof Error) return next(dbResponse);
    const user = {
        name: req.body.name,
        email: req.body.email
    }
    const tokenData = {
        token: await tokenSign(user, "2h")
    }
    res.status(201).json({user: req.body.name, Token_info: tokenData});
};

// Login user
const login = async(req, res, next) => {
    const dbResponse = await loginUser(req.body.email);
   if(!dbResponse.length){ // esta linea se lee, si dbresponse No tiene longitud osea esta en cero
     return next()
   } 
   if(await checkPassword(req.body.password, dbResponse[0].password)){
        const user = {
            id: dbResponse[0].id,
            name: dbResponse[0].name,
            email: dbResponse[0].email,
            image: dbResponse[0].image
        }
        const tokenData = {
            token: await tokenSign(user, "2h"),
            user: user
        }
        res.status(200).json({message: `user ${user.name} Logged in!`, Token_info: tokenData});
   } else {
    let error = new Error
    error.status = 401
    error.message = "Unauthorized"
    next(error)
   }
};

// Patch existing user
const editOne = async(req, res, next) => {
    if (notNumber(req.params.id, res)){
        return;
    }  
    const dbResponse = await editUserById(+req.params.id, req.body);
    if (dbResponse instanceof Error){
        return next(dbResponse);
    } 
    dbResponse.affectedRows ? res.status(200).json(req.body) : next()
};

// Delete user By Id
const removeOne = async(req, res, next) => {
    if(notNumber(req.params.id, res)) {
        return 
    }
    const dbResponse = await deleteUserById(Number(req.params.id));
    if(dbResponse instanceof Error){
        return next(dbResponse);
    } 
    if(dbResponse.affectedRows){
        res.status(204).end()
    } else{
        next()
    }
};

module.exports = {listAll, listOne, register, login, editOne, removeOne};