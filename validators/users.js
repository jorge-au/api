const {check, validationResult} = require("express-validator");

const validatorCreatedUser = [
    check("name")
    .exists().withMessage("Name is required")
    .trim()//quita los espacios de los lados (se llama sanitizacion)
    .isAlpha('en-US', {ignore: ' '}).withMessage("Only letters")
    .notEmpty().withMessage("Name must  not be empty")
    .isLength({min: 2, max: 90}).withMessage("Character count: min 2; max 90"),

    check("email")
    .exists().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail(),//convierte las minusculas las entradas en mayusculas

    check("password")
    .exists().withMessage("Password is required")
    .isLength({min:8, max:15}).withMessage("Password must be at least 8 characters long")
    .trim(),

    (req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){//aqui se pregunta si errors no esta vacio
            return res.status(400).json({errores: errors.array()})
        } else {
            next()
        }
    }
];

module.exports = {validatorCreatedUser};