import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth"
import { acceptMessagesSchema } from "@/schemas/acceptMessagesSchema";

export async function POST(request: Request) {
    await dbConnect();

   const session = await getServerSession(authOptions);
   const user = session?.user as { _id: string };
   
   if (!session || !session.user) {
    return Response.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
    );
   }

   const userId = user._id;
   const body = await request.json();
   const parsed = acceptMessagesSchema.safeParse(body);

   if (!parsed.success) {
    return Response.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }
 const { acceptMessages } = parsed.data;

   try {
   const updateUser = await UserModel.findByIdAndUpdate(userId, {isAcceptingMessages: acceptMessages}, { new: true })
    
if (!updateUser) {
    return Response.json(
        { success: false, message: "failed to update user status to accept messages" },
        { status: 401 }
    );
   }

   return Response.json(
        { success: true, message: "Message acceptance status updated successfully", 
        data: {
          isAcceptingMessages: updateUser.isAcceptingMessages,
        },
         },
        { status: 200 }
    );

   } catch (error) {
    console.log("failed to update user status to accept messages")
    return Response.json(
        { success: false, message: "failed to update user status to accept messages" },
        { status: 500 }
    );
   } 
}

export async function GET(request: Request) {
     await dbConnect();

    const session = await getServerSession(authOptions);
   const user:User =  session?.user as User;
   
   if (!session || !session.user) {
    return Response.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
    );
   }

   const userId = user._id;
   try {
    const foundUser = await UserModel.findById(userId);

      if (!foundUser) {
    return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
    );
   }
   return Response.json(
  {
    success: true,
   data: {
          isAcceptingMessages: foundUser.isAcceptingMessages, // ✅ DB VALUE
        },
  },
  { status: 200 }
);
   } catch (error) {
    return Response.json(
        { success: false, message: "Error retrieving user message acceptance status" },
        { status: 500 }
    )
   }
}