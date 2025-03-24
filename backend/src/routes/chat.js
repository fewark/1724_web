import express from "express";


const router = express.Router();

// GET /api/chat
router.get("/", (req, res) => {
    res.send("this is chat room route");
});

// example cases
// router.post("/addChat", createChat);
// router.put("/update", updateChat);
// router.delete("/delete", deleteChat);


export default router;
