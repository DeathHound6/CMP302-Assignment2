// TYPEDEFS
/**
 * @typedef {Object} Book
 * @property {String} name
 * @property {String} author
 * @property {Number} cost
 * @property {String} url
 * @property {String} image
 */

// module imports
const express = require("express");
const axios = new (require("axios")).Axios({});
const { readFileSync } = require("fs");

// create global variables
const HTTP_PORT = 3000;
const app = express();
const cart = ["1", "5", "6"]; // REMOVE TESTING VALUES BEFORE SUBMITTING

app.listen(HTTP_PORT, function() {
    console.log(`Listening at http://localhost:${HTTP_PORT}`);
});

app.use("/public", express.static(`${__dirname}/public`));
app.use(express.json());

app.get("/", async(req, res) => {
    res.status(200).sendFile(`${__dirname}/html/index.html`);
});
app.get("/catalogue", async(req, res) => {
    res.status(200).sendFile(`${__dirname}/html/catalogue.html`);
});
app.get("/catalogue/json", async(req, res) => {
    const books = JSON.parse(readFileSync(`${__dirname}/books.json`).toString());
    res.status(200).json({ books });
});
app.get("/catalogue/:name", async(req, res) => {
    res.status(200).sendFile(`${__dirname}/html/book.html`);
});
app.get("/catalogue/:name/json", async(req, res) => {
    const books = JSON.parse((await axios.get("http://localhost:3000/catalogue/json", { headers: { "content-type": "application/json" }}))?.data)?.books;
    if (!books?.length)
        return res.status(400).send();
    const book = books.find(e => e.name == decodeURIComponent(req.params.name));
    if (!book)
        return res.status(404).send();
    res.status(200).json({ book });
});
app.get("/cart", async(req, res) => {
    res.status(200).sendFile(`${__dirname}/html/cart.html`);
});
app.get("/cart/json", async(req, res) => {
    res.status(200).json({ cart });
});
app.post("/cart", async(req, res) => {
    const bookName = req.body.name;
    const book = JSON.parse((await axios.get(`http://localhost:3000/catalogue/${bookName}/json`, { headers: { "content-type": "application/json" }}))?.data)?.book;
    if (!book)
        return res.status(404).send();
    cart.push(book.name);
    res.status(200).send();
});
app.delete("/cart", async(req, res) => {
    const bookName = req.body.name;
    const cartObj = JSON.parse((await axios.get("http://localhost:3000/cart/json", { headers: { "content-type": "application/json" }}))?.data)?.cart;
    const cartIndex = cartObj.findIndex(e => e == bookName);
    if (cartIndex == -1)
        return res.status(404).send();
    cart.splice(cartIndex, 1);
    res.status(200).send();
});
app.get("/checkout", async(req, res) => {
    res.status(200).sendFile(`${__dirname}/html/checkout.html`);
});
app.post("/checkout", async(req, res) => {
    const cart = JSON.parse((await axios.get("http://localhost:3000/cart/json", { headers: { "content-type": "application/json" }}))?.data)?.cart;
    for (const bookName of cart)
        (await axios.delete("http://localhost:3000/cart", { data: { name: bookName }}));
    res.status(200).send();
});