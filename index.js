const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/usermodel"); // Import the user model

const app = express();
const PORT = 3000;

// Middleware
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));




// Routes

// Render Login Page
app.get("/", (req, res) => res.render("login-page"));

// User Registration
app.post("/register", async (req, res) => {
  try {
    const { name, username, password, phone_number } = req.body;

    // Validate input
    if (!name || !username || !password || !phone_number) {
      return res.status(400).send("All fields are required.");
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("User already exists.");
    }

    // Hash password and save new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, username, password: hashedPassword, phone_number });

    await newUser.save();
    res.redirect("/");
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send("Error registering user.");
  }
});

// User Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const userRecord = await User.findOne({ username });
    if (!userRecord) {
      return res.status(400).send("User not found.");
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, userRecord.password);
    if (!isPasswordMatch) {
      return res.status(400).send("Incorrect password.");
    }

    // Generate JWT token
    const token = jwt.sign({ username: userRecord.username }, "secretKey", { expiresIn: "1h" });
    res.cookie("token", token);
    res.redirect("/home");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Login failed.");
  }
});

// Render Home Page
app.get("/home", (req, res) => {
  res.render("home.ejs");
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
