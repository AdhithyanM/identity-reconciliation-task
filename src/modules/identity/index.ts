import express, { Router } from "express";
import postIdentity from "./controllers/postIdentity";

const router: Router = express.Router();

router.post("/", postIdentity);

export default router;
