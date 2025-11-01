import type { Request, Response, NextFunction } from "express";

export function notFound(_req: Request, _res: Response, next: NextFunction) {
    next({ status: 404, message: "Not found" });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    const status = err.status || 500;
    const message = err.message || "Server error";
    res.status(status).json({ error: message });
}
