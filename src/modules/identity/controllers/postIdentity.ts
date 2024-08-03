import { Request, Response, NextFunction } from "express";

function postIdentity(req: Request, res: Response, next: NextFunction) {
  // logic to read req and return res.
  console.log("request received");
  res.json({ message: "hello world" });
}

export default postIdentity;
