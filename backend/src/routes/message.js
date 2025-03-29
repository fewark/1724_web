import express from "express";


const router = express.Router();

// GET /api/message
router.get("/", (req, res) => {
    // this gets executed when user visit http://localhost:3000/message
    res.send("this is message route");
});

// router.get("/", authenticate, (req, res) => {
//     res.send("this is message route using autentication");
// });

// example cases
// router.post("/adduser", createUser);
// router.post("/login", loginUser);
// router.post("/logout", verifyJWT, logoutUser);
// router.put("/update", verifyJWT, updateUser);
// router.delete("/delete", verifyJWT,  deleteUser);

export default router;
