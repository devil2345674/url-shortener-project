const validUrl = require("valid-url");``
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "config", "config.env") });

const express = require("express");
const shortid = require("shortid");
const db = require("./database");

const app = express();
app.use(express.static("public"));
const port = process.env.PORT || 5500;

app.use(express.json());

/*
==================================
CREATE SHORT URL
==================================
*/

app.post("/shorten", (req, res) => {

    const { originalUrl } = req.body;
    
    if (!validUrl.isUri(originalUrl)) {
        return res.status(400).json({
            message: "Invalid URL"
        });
    }

    const shortCode = shortid.generate();

    const query = `
    INSERT INTO urls (originalUrl, shortCode)
    VALUES (?, ?)
    `;

    db.run(query, [originalUrl, shortCode], function(err) {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.json({
            shortUrl: `${process.env.BASE_URL}/${shortCode}`
        });
    });
});

/*
==================================
REDIRECT URL
==================================
*/

app.get("/:shortCode", (req, res) => {

    const query = `
    SELECT * FROM urls WHERE shortCode = ?
    `;

    db.get(query, [req.params.shortCode], (err, row) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        if (row) {
            return res.redirect(row.originalUrl);
        }

        res.status(404).json({
            message: "URL Not Found"
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});