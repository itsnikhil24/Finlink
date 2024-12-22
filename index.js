const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const User = require("./models/usermodel"); // Import the user model
const Request = require("./models/request"); // Import the request model
const app = express();
const http=require("http").Server(app);
const PORT = 3000;
const io=require("socket.io")(http);


var usp =io.of('/user-namespace')


// Middleware
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer Setup for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Add timestamp to avoid duplicate file names
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only image files are allowed."));
    }
    cb(null, true);
  },
});

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/");

  jwt.verify(token, "secretKey", (err, decoded) => {
    if (err) return res.redirect("/");
    req.userId = decoded.userId; // Attach userId to the request
    next();
  });
};

// Routes

// Render Login Page
app.get("/", (req, res) => res.render("login-page"));

// Render Profile Form with User ID
app.get("/form", authenticateToken, (req, res) => {
  res.render("form", { userId: req.userId });
});

app.get("/home", authenticateToken, (req, res) => {
  res.render("home", { userId: req.userId });
});

app.get("/profile",(req,res)=>{
  res.render("personal-dashboard.ejs")
})

app.get("/barter",(req,res)=>{
  res.render("barter.ejs");
})

// Chat Page Route
app.get('/chat/:userId', authenticateToken, async (req, res) => {
  const targetUserId = req.params.userId;
  const currentUserId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).send('Invalid user ID');
  }

  try {
      const targetUser = await User.findById(targetUserId); // or Request if needed
      // const name =await Request.findById(targetUserId);
      const user = await Request.findOne({ request_user: targetUser });
      console.log(user);
      if (!targetUser) {
          return res.status(404).send('User not found');
      }

      // Assuming the image is stored in the 'uploads' directory inside 'public'
      const targetUserImage = `/${user.Image}`;

      res.render('chatapplication.ejs', {
          currentUserId,
          targetUserId,
          targetUserName: targetUser.name,
          targetUserImage: targetUserImage
      });
  } catch (error) {
      console.error('Error fetching user:', error.message);
      res.status(500).send('Internal server error');
  }
});



// Get Requests to Display (excluding the user's own requests)
app.get("/financialland", authenticateToken, async (req, res) => {
  try {
    // Fetch all requests and exclude the logged-in user's requests
    const userid = await User.findById(req.userId);
    const requests = await Request.find({ request_user: { $ne: req.userId } }) // Excludes the current user's requests

      .populate("request_user"); // Fetch requests with user details

    res.render("financialass.ejs", { requests ,userid});
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).send("Internal Server Error");
  }
});


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
    const token = jwt.sign({ userId: userRecord._id }, "secretKey", { expiresIn: "1h" });
    res.cookie("token", token);
    res.redirect("/home");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Login failed.");
  }
});

// Create Request
app.post("/createrequest", authenticateToken, upload.single("profile_pic"), async (req, res) => {
  const { occupation, current_status, financial_goal } = req.body;
  const profilePicPath = req.file ? req.file.path : null;
  const userId = req.userId;

  if (!occupation || !current_status || !financial_goal) {
    return res.status(400).send("All fields are required.");
  }

  try {
    // Create a new Request in the Request model
    const newRequest = new Request({
      request_user: userId,
      occupation,
      current_status,
      financial_goal,
      Image: profilePicPath,
    });

    await newRequest.save();

    res.redirect("/financialland"); // Redirect to the financial landing page
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).send("Internal Server Error");
  }
});

io.on('connection', (socket) => {
  // Get the user ID from the handshake authentication token
  const userId = socket.handshake.auth.token;

  // If the user ID is not valid, disconnect the user
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.error('Invalid user ID');
      return socket.disconnect(true); // Disconnect the user if ID is invalid
  }

  // Join the socket to the room named after the user ID (this is important for private messaging)
  socket.join(userId);
  console.log(`User ${userId} connected`);

  // Handle incoming messages
  socket.on('send-message', (data) => {
      const { senderId, receiverId, message } = data;

      // Validate receiverId and senderId
      if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
          console.error('Invalid receiver ID');
          return;
      }

      if (!message || typeof message !== 'string' || message.trim() === '') {
          console.error('Invalid message');
          return;
      }

      // Broadcast the message to the receiver's room if receiver is online
      // Ensure receiver exists and is connected before emitting the message
      io.to(receiverId).emit('receive-message', {
          senderId,
          message,
          timestamp: new Date(),
      });

      console.log(`Message sent from ${senderId} to ${receiverId}: ${message}`);
  });

  // Listen for any disconnect events
  socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
  });

});

app.get("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the authentication token
  res.redirect("/"); // Redirect to login page
});


// Start the Server
http.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
