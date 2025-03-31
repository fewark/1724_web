import express from "express";


const router = express.Router();

// GET /api/file
router.get("/", (req, res) => {
    res.send("this is file route");
});

// router.get("/", authenticate, (req, res) => {
//     res.send("this is file route using autentication");
// });

// example cases
// router.post("/adduser", createUser);
// router.post("/login", loginUser);
// router.post("/logout", verifyJWT, logoutUser);
// router.put("/update", verifyJWT, updateUser);
// router.delete("/delete", verifyJWT,  deleteUser);


export default router;
