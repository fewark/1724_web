import {PrismaClient} from "@prisma/client";
import bcrypt, {compare} from "bcrypt";
import express from "express";
import {StatusCodes} from "http-status-codes";
import jwt from "jsonwebtoken";


const BCRYPT_SALT_ROUNDS = 10;

const router = express.Router();
const prisma = new PrismaClient();


router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await prisma.user.findUnique({where: {email}});

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({error: "Invalid email or password"});
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            return res.status(StatusCodes.UNAUTHORIZED).json({error: "Invalid email or password"});
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {expiresIn: "24h"}
        );

        return res.json({token});
    } catch (err) {
        console.error("Login error:", err);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
    }
});


// REGISTER route
router.post("/register", async (req, res) => {
    const {username, email, password, profilePicture} = req.body;

    if (!username || !email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "username, email, and password are required",
        });
    }

    try {
        const existingUser = await prisma.user.findUnique({where: {email}});

        if (existingUser) {
            return res.status(StatusCodes.CONFLICT).json({error: "Email is already registered"});
        }
        const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

        const newUser = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: passwordHash,

                // Optional default
                profilePicture: profilePicture || "",
            },
        });

        const token = jwt.sign(
            {id: newUser.id, username: newUser.username, email: newUser.email},
            process.env.JWT_SECRET,
            {expiresIn: "24h"}
        );

        return res.status(StatusCodes.CREATED).json({message: "User registered", token: token});
    } catch (err) {
        console.error("Registration error:", err);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
    }
});

export default router;
