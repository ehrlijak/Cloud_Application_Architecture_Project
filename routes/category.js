const express = require("express");
const router = express.Router();
const dao = require("../dao/categoryDao");

// CREATE
router.post("/create", (req, res) => {
    try {
        res.json(dao.create(req.body));
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// LIST
router.get("/list", (req, res) => {
    res.json(dao.list());
});

// GET
router.get("/:id", (req, res) => {
    const result = dao.get(req.params.id);
    if (!result) return res.status(404).json({ error: "categoryDoesNotExist" });
    res.json(result);
});

// UPDATE
router.post("/update", (req, res) => {
    try {
        res.json(dao.update(req.body));
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// DELETE
router.post("/delete", (req, res) => {
    try {
        dao.remove(req.body.id);
        res.json({ success: true });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

module.exports = router;