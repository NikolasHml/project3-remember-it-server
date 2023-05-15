const router = require("express").Router();

const Content = require("../models/Content.model");
const Memory = require("../models/Memory.model");

// POST /content - creates new content for memory
router.post("/content", (req, res, next) => {
    const { title, description, memoryId } = req.body;

    Content.create({ title, description, memory: memoryId })
        .then(newContent => {
            return Memory.findByIdAndUpdate(memoryId, { $push: { content: newContent._id } } );
        })
        .then(response => res.json(response))
        .catch(err => res.json(err));
});

module.exports = router; 