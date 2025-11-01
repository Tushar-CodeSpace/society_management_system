import createError from "http-errors";
import type { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../utils/jwt.util";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return next(createError(401, "no token"));

    try {
        const payload = verifyAccess(token);
        req.user = { sub: payload.sub };
        return next();
    } catch {
        return next(createError(401, "invalid token"));
    }
}
