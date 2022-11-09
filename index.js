// TYPEDEFS
/**
 * @typedef {Object} Book
 * @property {String} name
 * @property {String} author
 * @property {Number} cost
 * @property {String} url
 */

// module imports
const express = require("express");
const axios = new (require("axios")).Axios({});
const { readFileSync } = require("fs");

// create global variables
const HTTP_PORT = 3000;
const app = express();

app.listen(HTTP_PORT, function() {
    console.log(`Listening at http://localhost:${HTTP_PORT}`);
});

app.use("/public", express.static(`${__dirname}/public`));
app.use(express.json());

app.get("/", async(req, res) => {
    res.status(200).sendFile(`${__dirname}/html/index.html`);
});
app.get("/catalogue", async(req, res) => {
     if (req.headers["content-type"] == "application/json") {
        /**
         * @type {Array<Book>}
         */
        const books = JSON.parse(readFileSync(`${__dirname}/books.json`).toString());
        return res.status(200).json({ books });
    }
    res.status(200).sendFile(`${__dirname}/html/catalogue.html`);
});
app.get("/catalogue/:name", async(req, res) => {
    if (req.headers["content-type"] == "application/json") {
        /**
         * @type {Array<Book>|null}
         */
        const books = JSON.parse((await axios.get("http://localhost:3000/catalogue", { headers: { "content-type": "application/json" }}))?.data)?.books;
        if (!books?.length)
            return res.status(400).send();
        const book = books.find(e => e.name == decodeURIComponent(req.params.name));
        if (!book)
            return res.status(404).send();
        return res.status(200).json({ book });
    }
    res.status(200).sendFile(`${__dirname}/html/book.html`);
});