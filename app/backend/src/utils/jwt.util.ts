import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export type AccessPayload = { sub: string };

export function signAccess(payload: AccessPayload): string {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}
export function signRefresh(payload: AccessPayload): string {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}
export function verifyAccess(token: string): AccessPayload {
    return jwt.verify(token, ACCESS_SECRET) as AccessPayload;
}
export function verifyRefresh(token: string): AccessPayload {
    return jwt.verify(token, REFRESH_SECRET) as AccessPayload;
}
