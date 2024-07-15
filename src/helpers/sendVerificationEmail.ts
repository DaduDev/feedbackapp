import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationemail(
    email: string,
    username: string,
    verificationCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Email',
            react: VerificationEmail({username, otp: verificationCode}),
          });
        return {success: true, message: "Verification email sent"};
    } catch (emailError) {
        console.log("Error sending verification email: ", emailError);
        return {success: false, message: "Failed to send verification email"};
    }
}