import express from "express";
import { getUsers, Register, Login, Logout, searchUsers } from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { getValidator } from "./validation.js";

const router = express.Router();

router.get('/users', verifyToken, searchUsers, getUsers);
router.post('/users', getValidator, Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logut', Logout);


export default router;