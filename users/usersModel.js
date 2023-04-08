const pool = require("../database/config");

const getAllUsers = async() => {
    const query = `SELECT * FROM users`
    try {
        return await pool.query(query)
    } catch (error) {
        return {"error": error.code}
    }
};

const getUserById = async(id) => {
    const query = `SELECT * FROM users WHERE id = ${id}`
    try {
        return await pool.query(query)
    } catch (error) {
        return { "error": error.code}
    }
};

const addNewUser = async(user) => {
    const query = `INSERT INTO users SET ?`;
    try {
        return await pool.query(query, user);
    } catch (error) {
        return { "error": error.code }
    }
};

const editUserById = async(id, user) => {
    const query = `UPDATE users SET ? WHERE id = ${id}`;
    try {
        return await pool.query(query, user)
    } catch (error) {
        return {"error": error.code};
    }
};

const deleteUserById = async(id) => {
    const query = `DELETE FROM users WHERE id = ${id}`;
    try {
        return await pool.query(query)
    } catch (error) {
        return { "error": error.code}
    }
};

module.exports = {
    getAllUsers,
    getUserById, 
    addNewUser,
    editUserById,
    deleteUserById
};