const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('this is message route');// this gets executed when user visit http://localhost:3000/user
});

// example cases
// router.post("/adduser", createUser);
// router.post("/login", loginUser);
// router.post("/logout", verifyJWT, logoutUser);
// router.put("/update", verifyJWT, updateUser);
// router.delete("/delete", verifyJWT,  deleteUser);

module.exports = router;