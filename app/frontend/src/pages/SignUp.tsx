import { useState } from "react";
import { OTPForm } from "@/components/otp-form";
import { SignupForm } from "@/components/signup-form";

export default function SignUpPage() {
    const [showOTPForm, setShowOTPForm] = useState(false);

    const handleSubmit = () => {
        setShowOTPForm(true);
    };

    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                {!showOTPForm && <SignupForm onSubmit={handleSubmit} />}
                {showOTPForm && <OTPForm />}
            </div>
        </div>
    );
}

