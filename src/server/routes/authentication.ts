import express from "express";
import { register, login } from "../controllers/authentication";

const router = express.Router();

router.post("/register", register);
router.get("/login", login);

module.exports = router;
