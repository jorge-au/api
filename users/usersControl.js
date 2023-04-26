// Aqui va la logica de mi api
const {
    getAllUsers,
    getUserById,
    registerUser,
    loginUser,
    editUserById,
    deleteUserById
} = require("./usersModel");
const notNumber = require("../utils/notNumber");
const {hashPassword, checkPassword} = require("../utils/handlePassword");
const { tokenSign, tokenVerify } = require("../utils/handleJWT");
const {matchedData} = require("express-validator");
const nodemailer = require("nodemailer");
const url = process.env.url_base;

// List all users
const listAll = async(req, res, next) => {
    const dbResponse = await getAllUsers();
    if(dbResponse instanceof Error) return next(dbResponse);
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
    const cleanBody = matchedData(req);
    const image = url + req.file.filename;
    const password = await hashPassword(req.body.password);
    const dbResponse = await registerUser({...cleanBody, password, image});//ES6 pasword: password
    if(dbResponse instanceof Error) return next(dbResponse);
    const user = {
        name: cleanBody.name,
        email: cleanBody.email
    };
    const tokenData = {
        token: await tokenSign(user, "2h")
    }
    res.status(201).json({user: req.body.name, Token_info: tokenData});
};

// Login user
const login = async(req, res, next) => {
    const cleanBody = matchedData(req);
    const dbResponse = await loginUser(cleanBody.email);
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

/*Config nodemailer* */
const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.mailtrap_user,
      pass: process.env.mailtrap_pass
    }
  });

//Forgot password
const forgot = async(req, res, next) => {
    const dbResponse = await loginUser(req.body.email);
    if(!dbResponse.length) return next();
    const user = {
        id: dbResponse[0].id,
        name: dbResponse[0].name,
        email: dbResponse[0].email
    };
    const token = await tokenSign(user, "15m");
    const link = `${process.env.url_base}users/reset/${token}`;
    const mailDetails = {
        from: "Tech-support@mydomain.com",
        to: user.email,
        subject: "Password recovery",
        html: `
        <h2>Password Recovery Service</h2>
        <p>To reset your password please click on the link and follow instructions</p>
        <a href="${link}">Click to recover your password</a>
        `
    }
    transport.sendMail(mailDetails, (err, data) => {
        if (err) return next(err);
        res.status(200).json({ message: `Hi ${user.name}, we've sent an email with instructions to ${user.email}. You've got 15 minutes to reset your password. Hurry up!` });
    })
};

// Reset password (GET)
// Mostramos el formulario de recuperacion de password
const reset = async (req, res, next) => {
    const token = req.params.token;
    const tokenStatus = await tokenVerify(req.params.token);
    if(tokenStatus instanceof Error) {
        res.status(403).json({message: "Invalid or Expired Token"})
    } else {
        res.render("reset", {token, tokenStatus});
    }
};

// Reset password (POST)
// Recibe la nueva password desde el formulario de recuperacion de password
const saveNewPass = async(req, res, next) => {
    const { token } = req.params
    const tokenStatus = await tokenVerify(token)
    if (tokenStatus instanceof Error) return next(tokenStatus);
    const password = await hashPassword(req.body.password_1)
    const dbResponse = await editUserById(tokenStatus.id, { password })
    dbResponse instanceof Error ? next(dbResponse) : res.status(200).json({ message: `Password changed for user ${tokenStatus.name}` })
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

module.exports = {
    listAll,
    listOne,
    register,
    login,
    forgot,
    reset, 
    saveNewPass,
    editOne,
    removeOne
};