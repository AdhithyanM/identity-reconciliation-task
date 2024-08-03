import express, { Router } from "express";
import { postIdentity } from "../identity/controllers/IdentityController";

const router: Router = express.Router();

router.post("/", postIdentity);

export default router;
