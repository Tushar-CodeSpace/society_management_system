import type { Request, Response, NextFunction } from "express";
import type { ZodObject } from "zod";

export const validate =
    (schema: ZodObject) =>
        (req: Request, _res: Response, next: NextFunction) => {
            const parsed = schema.safeParse({
                body: req.body,
                params: req.params,
                query: req.query
            });
            if (!parsed.success) {
                const errors = parsed.error.issues.map((issue) => issue.message);
                const msg = errors.join(", ");
                return next({ status: 400, message: msg });
            }
            next();
        };

