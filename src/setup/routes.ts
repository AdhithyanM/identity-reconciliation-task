import express, { Router } from "express";

import identityRoutes from "../modules/identity/index";

const router: Router = express.Router();

router.use("/identity", identityRoutes);
// other domain specific routes

export default router;
