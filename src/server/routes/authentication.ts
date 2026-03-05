import express from "express";
import { register, login, logout } from "../controllers/authentication";

const router = express.Router();

router.post("/register", register);
router.get("/login", login);
router.get("/logout", logout);

module.exports = router;
