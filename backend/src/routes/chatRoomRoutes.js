const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('this is chat room route');// this gets executed when user visit http://localhost:3000/chat
});

// example cases
// router.post("/addChat", createChat);
// router.put("/update", updateChat);
// router.delete("/delete", deleteChat);

module.exports = router;