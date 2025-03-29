import express from "express";
import { compare } from "bcrypt";
import sign from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


const router = express.Router();
const prisma = new PrismaClient();

// router.get("/", authenticate, (req, res) => {
router.get("/", (req, res) => {
    res.send("this is auth route using autentication");
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "3h" }
        );

        return res.json({ token });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});


const SALT_ROUNDS = 10;

// REGISTER route
router.post("/register", async (req, res) => {
    const { username, email, password, profilePicture } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "username, email, and password are required" });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(409).json({ error: "Email is already registered" });
        }
        // console.log("hi there:", password)

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // console.log("hi there:", hashedPassword)

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                profilePicture: profilePicture || "", // Optional default
            },
        });

        const token = jwt.sign(
            { id: newUser.id, username: newUser.username, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "3h" }
        );

        return res.status(201).json({ message: "User registered", token });
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
