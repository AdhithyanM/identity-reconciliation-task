import express, { Router } from "express";

import identityRoutes from "../modules/identity/index";

const router: Router = express.Router();

router.use("/identity", identityRoutes);
// other entity specific routes

export default router;
