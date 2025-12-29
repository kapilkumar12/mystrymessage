import {resend} from '../lib/resend';
import  VerificationEmail  from '../../emails/emailVerification';
import { ApiResponse } from '@/types/ApiResponse';
import { render } from "@react-email/render";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode:string
): Promise<ApiResponse> {

    try {

const html = await render(
      <VerificationEmail username={username} otp={verifyCode} />
    );
        
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to:[email],
      subject: 'Mystry Message | Verification email',
      html,
    });
    console.log("RESEND EMAIL RESPONSE:", data);

    if (error) {
  console.error("RESEND ERROR:", error);
  return {
    success: false,
    message: error.message
  };
}

        return {
        success:true,
        message:"Verification email send successfully"
        }
        
    } catch (emailError) {
        console.error("Error in send verification email", emailError)

        return {
        success:false,
        message:"Failed to send verification email"
        }
    }
    
}
