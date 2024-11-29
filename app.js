import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

//middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

let posts = [];
let postIdCounter = 1;

//Route to render
app.get("/", (req, res) => {
  res.render("index.ejs", { posts });
});

// Route create new post

app.post("/submit", async (req, res) => {
  try {
    const { subject, text } = req.body;

    if (!subject || !text) throw new Error("Invalid Input");

    const newPost = { id: postIdCounter++, subject, text };
    posts.push(newPost);

    console.log("Post added:", posts);
    res.status(200).json({ success: true, post: newPost });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

//route for clear all

app.post("/clear", async (req, res) => {
  try {
    posts = [];
    console.log("All posts are cleared");
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("error clearing posts", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

//route delete a specific post

app.delete("/delete/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    posts = posts.filter((post) => post.id !== postId);
    console.log(`Post with id ${postId} deleted`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting post", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

//route edit specific post

app.put("/edit/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const { subject, text } = req.body;
    if (!subject || !text) {
      throw new Error("Missing fields");
    }

    const postIndex = posts.findIndex((post) => post.id === postId);
    console.log(`Post with ID ${postId} updated`, posts[postIndex]);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating post", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});
