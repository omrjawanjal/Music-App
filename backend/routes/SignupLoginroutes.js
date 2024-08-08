const express = require("express");
const router = express.Router();
const Schema = require("../schema/Schema");

router.post("/create", async (req, res, next) => {
  const { name, username, email, password } = req.body;

  const existingUser = await Schema.findOne({ username: username });
  const existingEmail = await Schema.findOne({ email: email });

  if (existingUser) {
    return res
      .status(400)
      .json("Username already exists. Please choose a different username.");
  }
  if (existingEmail) {
    return res
      .status(400)
      .json("Email already exists. Please choose a different email.");
  }

  try {
    const newUser = await Schema.create({
      name,
      username,
      email,
      password,
    });
    return res.status(200).json("User added successfully");
  } catch (error) {
    next(error);
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  Schema.findOne({ username: username }).then((login) => {
    if (login) {
      if (login.password === password) {
        res.json("Login successfull");
      } else if (password === "") {
        return res.status(400).json("Enter password");
      } else {
        return res.status(400).json("Username or Password incorrect");
      }
    } else if (username === "" && password === "") {
      return res.status(400).json("Enter username and password");
    } else if (username === "") {
      return res.status(400).json("Enter username");
    } else {
      return res.status(400).json("No Record Exist");
    }
  });
});

router.post("/data", (req, res) => {
  const { username } = req.body;
  Schema.findOne({ username: username }).then((login) => {
    if (login) {
      return res.status(200).json(login);
    } else {
      return res.status(400).json("No record exits");
    }
  });
});

router.delete("/delete", async (req, res) => {
  try {
    const { username } = req.body;
    console.log(username);

    // Find the user with the provided username and delete it
    const deletedUser = await Schema.findOneAndDelete({
      username: username,
    });

    if (deletedUser) {
      res
        .status(200)
        .json({ message: "User deleted successfully", deletedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

router.post("/update", async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    // Check if a user with the provided username exists in the database
    const existingUser = await Schema.findOne({ username });

    if (existingUser) {
      // Update the existing user's information
      existingUser.name = name;
      existingUser.email = email;
      existingUser.password = password;
      await existingUser.save();

      res.status(200).json({ message: "User data updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to save/update user data" });
  }
});

module.exports = router;
