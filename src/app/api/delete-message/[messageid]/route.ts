import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(
    request: Request,
    { params }: { params: { messageid: string } }
) {
    const messageId = params.messageid;
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated",
            },
            { status: 401 }
        );
    }

    try {
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        );

        if (updatedResult.modifiedCount === 0) {
            return Response.json(
                {
                    success: false,
                    message: "mostly already deleted bro",
                },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Message deleted successfully",
            },
            { status: 200 }
        );
    } catch (e) {
        console.log("error in delete message route", e);
        return Response.json(
            {
                success: false,
                message: "Unable to delete message",
            },
            { status: 500 }
        );
    }
}
