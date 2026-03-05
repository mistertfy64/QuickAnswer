import express from "express";
import { register, login, logout, me } from "../controllers/authentication";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", me);

module.exports = router;
