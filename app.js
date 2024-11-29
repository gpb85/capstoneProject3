import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// Middleware for static files (e.g., CSS)
app.use(express.static("public"));
// Middleware for form URL-encoded (for normal HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware for JSON requests (for AJAX)
app.use(express.json());

let posts = [];
let postIdCounter = 1; //counter for generating unique posts IDs

// Get route - Render page with posts
app.get("/", (req, res) => {
  res.render("index.ejs", { posts });
});

// Function to generate unique ID combining timestamp and counter
function generateUniqueId() {
  return Date.now() + "-" + postIdCounter++; // Combines timestamp and increasing counter for uniqueness
}

// Post route - Add new post
app.post("/submit", (req, res) => {
  const { subject, text } = req.body;
  if (subject && text) {
    const newPost = { id: generateUniqueId(), subject, text };
    posts.push(newPost);
    console.log("Data posts array:", posts);
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid Input" });
  }
});

// Post route - Clear all posts
app.post("/clear", (req, res) => {
  posts = []; // Clear the posts array
  console.log("All posts are cleared", posts);
  res.status(200).json({ success: true });
});

//delete route- delete a specific post by ID
app.delete("/delete/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  if (isNaN(postId)) {
    return res.status(400).json({ success: false, message: "Invalid post ID" });
  }

  //find and remove the post by ID
  posts = posts.filter((post) => post.id !== postId);
  console.log(`Post with ID ${postId} deleted`);

  //respond with success
  res.status(200).json({ success: true });
});

//PUT route-Update a specific post by ID

app.put("/edit/:id", (req, res) => {
  const postId = parseInt(req.params.id); //Parse the ID from the request parameters
  if (isNaN(postId)) {
    return res.status(400).json({ success: false, message: "Invalid post ID" });
  }
  const { subject, text } = req.body; //Destructure the new subject & text from the request body

  //Find the index of the post with the matching ID

  const postIndex = posts.findIndex((post) => post.id === postId);

  if (postIndex !== -1) {
    //Update the post with the new values if found
    posts[postIndex].subject = subject;
    posts[postIndex].text = text;
    console.log(`Post with ID${postId} updated`, posts[postIndex]);
    res.status(200).json({ success: true });
  } else {
    //If no matching post is found , send a 404 error
    console.error(`Post with ID ${postId} not found`);
    res.status(404).json({ success: false, message: "Post not found" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});
