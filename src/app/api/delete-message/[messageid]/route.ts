import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth"

export async function DELETE(  
request: Request,
  context: { params: { messageid: string } | Promise<{ messageid: string }> }) {

  const params = context.params instanceof Promise ? await context.params : context.params;
  const messageId = params.messageid;

  if (!messageId) {
    return new Response(
      JSON.stringify({ success: false, message: "Message ID not provided" }),
      { status: 400 }
    );
  }
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user:User =  session?.user as User;
       
       if (!session || !session.user) {
        return Response.json(
            { success: false, message: "Not authenticated" },
            { status: 401 }
        );
       }
    
try {
    const updateResult = await UserModel.updateOne(
        {_id:user._id},
        { $pull: { messages: { _id: messageId }}}
    )

    if (updateResult.modifiedCount === 0) {
        return Response.json(
            { success: false, message: "Message not found or already deleted" },
            { status: 404 }
        );
    }

    return Response.json(
            { success: true, message: "Message deleted successfully" },
            { status: 200 }
        );


} catch (error) {
    
    return Response.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
    )
}}