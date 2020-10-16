// TODO: Sample file, to be deleted.
const express = require('express');
const db = require('../connection')
const router = express.Router();

router.get('/', async (req, res, next) => {
    const todos = await db("todo");
    res.json({ data: todos, total: todos.length });
});

module.exports = router;