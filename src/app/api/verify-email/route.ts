import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verifySchema";
import { ZodError } from "zod";

export async function POST(request:Request) {

await dbConnect();

try {

const body = await request.json();
const { code } = verifySchema.parse(body);
const {searchParams} = new URL(request.url);
const email = searchParams.get("email");


if(!email){
    return Response.json(
      {
        success: false,
        message: "Email is required for verification",
      }, { status: 400 }  
    )
}

const user = await UserModel.findOne({email});

if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return Response.json(
        { success: false, message: "User already verified" },
        { status: 400 }
      );
    }

    if (user.verifyCode !== code) {
      return Response.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 }
      );
    }

    if (!user.verifyCodeExpiry || user.verifyCodeExpiry < new Date()) {
      return Response.json(
        { success: false, message: "Verification code expired" },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verifyCode = undefined;
    user.verifyCodeExpiry = undefined;

    await user.save();

    return Response.json(
  { success: true, message: "Email verified successfully" },
  { status: 200 }
);

  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        {
          success: false,
          message: error.issues[0]?.message ?? "Invalid input",
        },
        { status: 400 }
      );
    }

    console.error("Verify email error:", error);
    return Response.json(
      { success: false, message: "Failed to verify email" },
      { status: 500 }
    );
}


}