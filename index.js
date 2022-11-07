// TYPEDEFS
/**
 * @typedef {Object} Book
 * @property {String} name
 * @property {String} author
 * @property {Number} cost
 */

// module imports
const express = require("express");
const { Server } = require("socket.io");
const { readFileSync } = require("fs");

// create global variables
const HTTP_PORT = 3000;
const SOCKET_PORT = 3001;
const app = express();
const io = new Server(SOCKET_PORT, {
    path: "/"
});

io.on("connection", async(socket) => {
    //console.log(`${socket.id} has connected`);
    socket.on("request-book", async() => {
        /**
         * @type {Array<Book>}
         */
        const books = JSON.parse(readFileSync(`${__dirname}/books.json`).toString());
        console.log(books);
        socket.emit("get-book", books);
    });
});

app.listen(HTTP_PORT, function() {
    console.log(`Listening at http://localhost:${PORT}`);
});

app.use("/public", express.static(`${__dirname}/public`));
app.use(express.json());

app.get("/", async(req, res) => {
    res.sendFile(`${__dirname}/html/index.html`);
});
app.get("/book", async(req, res) => {
    res.sendFile(`${__dirname}/html/book.html`);
});
app.get("/books", async(req, res) => {
    res.sendFile(`${__dirname}/html/books.html`);
});