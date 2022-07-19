var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const { uuid } = require("uuidv4");
const { blogsDB } = require("../mongo");

const createUser = async (username, passwordHash) => {
  try {
    const collection = await blogsDB().collection("users");
    const user = {
      username: username,
      password: passwordHash,
      uid: uuid(),
    };
    await collection.insertOne(user);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

router.post("/register-user", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const saltRounds = 5;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const userSaveSuccess = await createUser(username, hash);
    res.json({ success: userSaveSuccess }).status(200);
  } catch (error) {
    res.json({ success: error }).status(500);
  }
});

router.post("/login-user", async (req, res) => {
  try {
    const user = await collection.findOne({
      username: req.body.username,
    });
    const match = await bcrypt.compare(req.body.password, user.password);
    res.json({ success: match }).status(200);
  } catch (error) {
    res.json({ success: error }).status(500);
  }
});

module.exports = router;
