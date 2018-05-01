const express = require('express');

// we're going to use the router
const router = express.Router();

// include the ability to parse the body
const bodyParser = require('body-parser');

// bring in the BlogPosts object to make it available
const {BlogPosts} = require('./models');

// instantiate the body parser and the express app
const jsonParser = bodyParser.json();
const app = express();

// Create some blog posts to start with
const blogpost1 = `
       The quick red fox jumped over the lazy brown dog.
`;
const blogpost2 = `
       Twas brillig and the slithy toves did gire and gimple in the wabe.
`;
const blogpost3 = `
       One bright day in the middle of the night, two dead boys got up to fight.
`;
BlogPosts.create("About foxes", blogpost1, "Ange")
BlogPosts.create("The Jabberwock", blogpost2, "Dee")
BlogPosts.create("The Backwards Rhyme", blogpost3, "Sue")

// React to GET command
router.get("/", (req, res) => {
    res.json(BlogPosts.get());
});

// React to PUT command
router.put("/:id", jsonParser, (req, res) => {
    const requiredFields = ['id', 'title', 'content', 'author'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    if (req.params.id !== req.body.id) {
      const message = (
        `Request path id (${req.params.id}) and request body id `
        `(${req.body.id}) must match`);
      console.error(message);
      return res.status(400).send(message);
    }
    console.log(`Updating blog post \`${req.params.id}\``);
    const updatedItem = BlogPosts.update({
      id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      author: req.params.author,
      publishDate: Date.now()
    });
    res.status(204).end();
  });

// React to POST command
router.post("/", jsonParser, (req, res) => {
  // ensure 'title', 'content', 'author' are in request body
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(item);
});

// React to DELETE command
router.delete("/:id", (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post \`${req.params.ID}\``);
    res.status(204).end();
  });

module.exports = router;