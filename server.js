const express = require('express');

// include the logger lib 
const morgan = require('morgan');

// bring in the BlogRouter object to make it available
const blogRouter = require('./blogRouter');

// instantiate the express app
const app = express();

// add logging output
app.use(morgan('common'));

app.use(express.static('public'));

// React to GET command
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// when requests come into `/blog-posts`,
// we'll route them to the express
// router instance we've imported. Remember,
// this router instance acts as modular, mini-express apps.
app.use('/blog-posts', blogRouter);

// Need to create functions to start and close the
// server for testing.
let server;

function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
        server = app.listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve(server);
        }).on('error', err => {
            reject(err)
        });
    });
}

function closeServer() {
    return new Promise((resolve, reject) => {
        console.log(`Closing server`);
        server.close(err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

// for the case where the server is started directly, like
// using `nodemon server.js`, then we need this block.
if (require.main === module) {
    runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
