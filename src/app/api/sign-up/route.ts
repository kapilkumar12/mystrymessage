import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
export const runtime = "nodejs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
// import { success } from "zod";

export async function POST(request:Request) {
  
   await dbConnect();
   
   try {

    const {username, email, password} = await request.json()

   const existingVerifiedUserByUsername = await UserModel.findOne({username, isVerified:true})

if(existingVerifiedUserByUsername){
    return Response.json({
     success:false,
     message:"Username is already taken"   
    }, {status:400}
)
}

const existingVerifiedUserByEmail = await UserModel.findOne({email})

const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

if(existingVerifiedUserByEmail) {

if (existingVerifiedUserByEmail.isVerified) {
    return Response.json({
      success:false,
     message:"User already exist with this email"   
    },{status:400})
} else{
    const hashedPassword = await bcrypt.hash(password, 10)
    existingVerifiedUserByEmail.password = hashedPassword;
    existingVerifiedUserByEmail.verifyCode = verifyCode;
    existingVerifiedUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)
    await existingVerifiedUserByEmail.save()
}


} else{
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour from now

 const newUser = new UserModel({
  username,
  email,
  password: hashedPassword,
  verifyCode,
  verifyCodeExpiry: expiryDate,
  isVerified: false,
  isAcceptingMessages: true,
  messages: []
    })
    await newUser.save();
}

const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    
if (!emailResponse.success) {
    return Response.json({
      success:false,
     message:emailResponse.message   
    }, {status:500})
}
    
return Response.json({
      success:true,
     message:"User registered successfully. Please verify your email."   
    }, {status:201})

   } catch (error:any) {
    console.error("Error Registering user", error)
    return Response.json({
        success:false,
        message:"Error Registering user"
    }, {status:500})
   }

}