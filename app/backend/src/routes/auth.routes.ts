import { Router } from "express";
import createError from "http-errors";
import User from "../models/User.model";
import { validate } from "../middleware/validate.middleware";
import { requireAuth } from "../middleware/auth.middleware";
import { SignupCheckSchema, SignupCompleteSchema, LoginSchema } from "../schemas/auth.schemas";
import { hashPassword, verifyPassword, hashToken, verifyTokenHash } from "../utils/password.util";
import { signAccess, signRefresh, verifyRefresh } from "../utils/jwt.util";
import type { Request, Response, NextFunction } from "express";

const router = Router();

/** Step 1: check availability */
router.post(
    "/signup/check",
    validate(SignupCheckSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body as { email: string };
            const exists = await User.exists({ email });
            res.json({ message: exists ? "exists" : "available" });
        } catch (e) {
            next(e);
        }
    }
);

/** Step 2: create user and issue tokens */
router.post(
    "/signup/complete",
    validate(SignupCompleteSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body as { email: string; password: string };

            const exists = await User.exists({ email });
            if (exists) throw createError(409, "user exists");

            const passwordHash = await hashPassword(password);
            await User.create({ email, passwordHash });

            const accessToken = signAccess({ sub: email });
            const refreshToken = signRefresh({ sub: email });
            const refreshTokenHash = await hashToken(refreshToken);
            await User.updateOne({ email }, { $set: { refreshTokenHash } });

            setRefreshCookie(res, refreshToken);
            return res.status(201).json({ message: "user created", accessToken });
        } catch (e) {
            next(e);
        }
    }
);

/** Login */
router.post(
    "/login",
    validate(LoginSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body as { email: string; password: string };
            const user = await User.findOne({ email }).lean();
            if (!user) throw createError(401, "invalid credentials");

            const ok = await verifyPassword(password, user.passwordHash);
            if (!ok) throw createError(401, "invalid credentials");

            const accessToken = signAccess({ sub: email });
            const refreshToken = signRefresh({ sub: email });
            const refreshTokenHash = await hashToken(refreshToken);
            await User.updateOne({ email }, { $set: { refreshTokenHash } });

            setRefreshCookie(res, refreshToken);
            res.json({ token: accessToken });
        } catch (e) {
            next(e);
        }
    }
);

/** Refresh rotation */
router.post("/auth/refresh", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.refresh_token as string | undefined;
        if (!token) throw createError(401, "no refresh token");

        const payload = verifyRefresh(token);
        const user = await User.findOne({ email: payload.sub }).lean();
        if (!user || !user.refreshTokenHash) throw createError(401, "invalid refresh");

        const valid = await verifyTokenHash(token, user.refreshTokenHash);
        if (!valid) throw createError(401, "rotated/invalid refresh");

        const newRefresh = signRefresh({ sub: payload.sub });
        const newRefreshHash = await hashToken(newRefresh);
        await User.updateOne({ email: payload.sub }, { $set: { refreshTokenHash: newRefreshHash } });

        const accessToken = signAccess({ sub: payload.sub });
        setRefreshCookie(res, newRefresh);
        res.json({ token: accessToken });
    } catch (e) {
        next(e);
    }
});

/** Logout */
router.post("/logout", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.refresh_token as string | undefined;
        if (token) {
            const payload = safeVerify(token);
            if (payload?.sub) {
                await User.updateOne({ email: payload.sub }, { $unset: { refreshTokenHash: 1 } });
            }
        }
        clearRefreshCookie(res);
        res.json({ message: "logged out" });
    } catch (e) {
        next(e);
    }
});

/** Protected example */
router.get("/profile", requireAuth, async (req: Request, res: Response) => {
    res.json({ user: req.user!.sub });
});

export default router;

/* helpers */
function setRefreshCookie(res: Response, token: string) {
    const secure = String(process.env.COOKIE_SECURE) === "true";
    res.cookie("refresh_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}
function clearRefreshCookie(res: Response) {
    const secure = String(process.env.COOKIE_SECURE) === "true";
    res.cookie("refresh_token", "", {
        httpOnly: true,
        sameSite: "lax",
        secure,
        path: "/",
        maxAge: 0
    });
}
function safeVerify(token: string) {
    try {
        return verifyRefresh(token);
    } catch {
        return null;
    }
}
