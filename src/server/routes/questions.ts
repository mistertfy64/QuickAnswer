import express from "express";
import { addQuestion, getQuestion } from "../controllers/questions";
import { restrictToAuthenticated } from "../middlewares/authentication";

const router = express.Router();

router.get("/:id", getQuestion);
router.post("/", restrictToAuthenticated, addQuestion);

module.exports = router;
