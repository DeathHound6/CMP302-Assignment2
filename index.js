const express = require("express");
const { Server } = require("socket.io");

const app = express();
const io = new Server(3001, {
    path: "/"
});

const PORT = 3000;

io.on("connection", async(socket) => {
    //console.log(`${socket.id} has connected`);
    socket.on("request-book", async() => {
        
    });
});

app.listen(PORT, function() {
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