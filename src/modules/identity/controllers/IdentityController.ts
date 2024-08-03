import { Request, Response, NextFunction } from "express";
import { IdentityRequest } from "../types";
import { IdentityResponse } from "../types";
import { identityService } from "../services";

export async function postIdentity(
  req: Request<{}, {}, IdentityRequest>,
  res: Response<IdentityResponse>,
  next: NextFunction
) {
  try {
    const response = await identityService.findOrCreateContact(req.body);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}
