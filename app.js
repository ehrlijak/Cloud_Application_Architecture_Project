const express = require("express");
const app = express();

app.use(express.json());

// routes
app.use("/category", require("./routes/category"));
app.use("/transaction", require("./routes/transaction"));

app.get("/", (req, res) => {
    res.json({ status: "Backend running" });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});