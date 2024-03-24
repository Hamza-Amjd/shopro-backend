const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const items = require('../models/items');


// ROUTE 1: Get All the items using: GET "/api/admin/fetchallitems". Login required
router.get('/fetchallitems', async (req, res) => {
    try {
        let item = await items.where(_id='64%')
        res.json(item)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 2: Add a new item using: POST "/api/admin/additem"
router.post('/additem',  [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('price', 'Enter a valid price'),
    body('image','Enter a valid image').isLength({ min: 2 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
    body("rating",'rating is not valid')]
    , async (req, res) => {
        try {
            const { title, description, price, image, category, rating } = req.body;

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const item = new items({
                title, description, price, image, category,rating
            })
            const saveditem = await item.save()

            res.json(saveditem)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

// ROUTE 3: Update an existing item using: PUT "/api/admin/updateitem". Login required
router.put('/updateitem/:id', async (req, res) => {
    const { title, description, price,image } = req.body;
    try {
        // Create a newItem object
        const newItem = {};
        if (title) { newItem.title = title };
        if (description) { newItem.description = description };
        if (price) { newItem.price = price };
        if (image) { newItem.image = image };
        // Find the item to be updated and update it
        let item = await items.findById(req.params.id);
        if (!item) { return res.status(404).send("Not Found") }

        item = await items.findByIdAndUpdate(req.params.id, { $set: newItem }, { new: true })
        res.json({ item });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 4: Delete an existing item using: DELETE "/api/admin/deleteitem". Login required
router.delete('/deleteitem/:id', async (req, res) => {
    try {
        // Find the item to be delete and delete it
        let item = await items.findById(req.params.id);
        if (!item) { return res.status(404).send("Not Found") }

        item = await items.findByIdAndDelete(req.params.id)
        res.json({ "Success": "item has been deleted", item: item });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router