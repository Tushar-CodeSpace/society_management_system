import * as React from "react";
import { useNavigate } from "react-router-dom";
import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type PasswordFormProps = React.ComponentProps<"div"> & {
    email: string;
    onBack?: () => void;
};

export function PasswordForm({ className, email, onBack, ...props }: PasswordFormProps) {
    const navigate = useNavigate();
    const [password, setPassword] = React.useState("");
    const [confirm, setConfirm] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:4000/signup/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.error || "Signup failed.");

            // Save token first
            localStorage.setItem("token", "temp_token");
            window.dispatchEvent(new Event("auth"));
            navigate("/home", { replace: true });

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Network error. Try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={onSubmit}>
                <FieldGroup>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <a
                            href="#"
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex size-8 items-center justify-center rounded-md">
                                <GalleryVerticalEnd className="size-6" />
                            </div>
                            <span className="sr-only">Acme Inc.</span>
                        </a>
                        <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
                        <FieldDescription>Set your account password</FieldDescription>
                        <FieldDescription className="text-xs opacity-70 break-all">
                            {email}
                        </FieldDescription>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <FieldLabel htmlFor="confirm">Confirm Password</FieldLabel>
                        <Input
                            id="confirm"
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <FieldDescription className="text-xs">
                            Min 8 chars. Include letters and numbers.
                        </FieldDescription>
                    </Field>

                    {error && (
                        <FieldDescription className="text-red-600">{error}</FieldDescription>
                    )}

                    <Field>
                        <div className="flex gap-2">
                            {onBack && (
                                <Button
                                    className="flex-2"
                                    variant="outline"
                                    type="button"
                                    onClick={onBack}
                                    disabled={loading}
                                >
                                    Back
                                </Button>
                            )}
                            <Button className="flex-2" type="submit" disabled={loading}>
                                {loading ? "Creating..." : "Create Account"}
                            </Button>
                        </div>
                    </Field>
                </FieldGroup>
            </form>

            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    );
}
