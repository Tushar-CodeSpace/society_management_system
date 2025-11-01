import { useState } from "react";
import { SignupForm } from "@/components/signup-form";
import { PasswordForm } from "@/components/password-form";

export default function SignUpPage() {
    const [email, setEmail] = useState<string | null>(null);

    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                {!email && <SignupForm onAvailable={(e) => setEmail(e)} />}
                {email && <PasswordForm email={email} onBack={() => setEmail(null)} />}
            </div>
        </div>
    );
}
