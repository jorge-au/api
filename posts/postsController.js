const { addNewPost, getPostsWith, getAllPosts } = require("./posts.Model");

const listAll = async(req, res, next)=>{
    let dbResponse = null
    if(req.query.title) {
        dbResponse = await getPostsWith(req.query.title)
    } else {
        dbResponse = await getAllPosts()
    }
    if(dbResponse instanceof Error) return next(dbResponse);
    if(dbResponse.length) {
        res.status(200).json(dbResponse)
    } else {
        next()
    }
};

const addOne = async (req, res, next) => {
    const dbResponse = await addNewPost({ userid: req.token.id, ...req.body });
    dbResponse instanceof Error
      ? next(dbResponse)
      : res.status(201).json({ message: `Post created by ${req.token.name}` });
};

module.exports = {listAll, addOne};