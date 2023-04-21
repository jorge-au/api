const router = require("express").Router();
const {listAll, addOne} = require("./postsController");
const isAuth = require("../middlewares/isAuth");

router.get("/", listAll);
router.post("/", isAuth, addOne);

module.exports = router;