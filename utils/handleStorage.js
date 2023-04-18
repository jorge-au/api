const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, callback)=> {
        const pathStorage = `${__dirname}/../public`
        callback(null, pathStorage)
    },
    filename: (req, file, callback)=> {
        const extencion = file.originalname.split(".").pop()
        const filename = `img${Date.now()}.${extencion}`
        callback(null, filename)
    }
});

//creamos el midleware
const fileUpload = multer({storage})

module.exports = fileUpload;
