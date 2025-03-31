import express from "express";


const router = express.Router();

// GET /api/user
router.get("/", (req, res) => {
    // this gets executed when user visit http://localhost:3000/user
    res.send("this is user route");
});

// router.get("/", authenticate, (req, res) => {
//     res.send("this is user route using autentication");
// });

// example cases
// router.post("/adduser", createUser);
// router.post("/login", loginUser);
// router.post("/logout", verifyJWT, logoutUser);
// router.put("/update", verifyJWT, updateUser);
// router.delete("/delete", verifyJWT,  deleteUser);

export default router;
