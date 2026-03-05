import express from "express";
import { addAnswer } from "../controllers/answers";
import { restrictToAuthenticated } from "../middlewares/authentication";

const router = express.Router();

router.post("/", restrictToAuthenticated, addAnswer);

module.exports = router;
