const router = require("express").Router();
const mongoose = require("mongoose");

const Content = require("../models/Content.model")
const Memory = require("../models/Memory.model");

// POST /memory - creates a new entry in the memory
router.post("/memory", (req, res, next) => {
    const { title } = req.body;

    Memory.create({ title, content: [] })
        .then(response => res.json(response))
        .catch(err => res.json(err));
})

// GET /memory - retrieves all of the entries in the memory
router.get("/memory", (req, res, next) => {
    Memory.find()
        .populate("content")
        .then(allContent => res.json(allContent))
        .catch(err => res.json(err))
})

// GET /memory/:memoryId - retrieves a specific memory by id (and therefore its content)
router.get("/memory/:memoryId", (req, res, next) => {
    const { memoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(memoryId)) {
        res.status(400).json({ message: "Specified id is not valid"});
        return;
    }

    // Each memory has a content array holding ids. Swapping id for actual content with populate
    Memory.findById(memoryId)
        .populate("content")
        .then(memory => res.status(200).json(memory))
        .catch(error => res.json(error))
});

// PUT /memory/:memoryId - Updates a specific memory by id
router.put("/memory/:memoryId", (req, res, next) => {
    const { memoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(memoryId)) {
        res.status(400).json({ message: "Specified id is not valid"});
        return;
    }

    Memory.findByIdAndUpdate(memoryId, req.body, { new: true })
        .then((updatedMemory) => res.json(updatedMemory))
        .catch(error => res.json(error));
});

// DELETE /memory/:memoryId - Deletes a specific memory by id
router.delete("/memory/:memoryId", (req, res, next) => {
    const { memoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(memoryId)) {
        res.status(400).json({ message: "Specified id is not valid"});
        return;
    }

    Memory.findByIdAndRemove(memoryId)
        .then(() => res.json({ message: `Memory with ${memoryId} is removed successfully`}))
        .catch(error => res.json(error));
});


module.exports = router; 