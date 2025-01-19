const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postRoutes = require("./routes/posts");

const app = express();

// Connect to MongoDB
mongoose
    .connect("mongodb://127.0.0.1:27017/bloggingPlatform", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); // Pass control to the next middleware
});

// Middleware for validating request body (applied globally to POST route)
const validatePost = (req, res, next) => {
    const { title, content, author } = req.body;
    if (!title || !content || !author) {
        return res.status(400).json({ error: "Title, content, and author are required" });
    }
    next();
};

// Apply the validation middleware to POST routes
app.post("/posts", validatePost);

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the Blogging Platform API");
});

// Blog post routes
app.use("/posts", postRoutes);

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
