import express from "express";
// import authenticate from "../middleware/authenticate";


const router = express.Router();

// GET /api/chat
router.get("/", (req, res) => {
    res.send("this is chat room route");
});

// router.get("/", authenticate, (req, res) => {
//     res.send("this is chat room route using autentication");
// });

// example cases
// router.post("/addChat", createChat);
// router.put("/update", updateChat);
// router.delete("/delete", deleteChat);


export default router;
