import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signup.schema";

export async function POST(request: Request) {
    await dbConnect();

    try {   
        const  { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({
            username: decodedUsername,
        })

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = user.verifyCodeExpiry > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json(
                {
                    success: true,
                    message: "User verified successfully",
                },
                { status: 200 }
            );
        } else {
            // code invalid
            if (!isCodeValid) {
                return Response.json(
                    {
                        success: false,
                        message: "Invalid verification code",
                    },
                    { status: 400 }
                );
            } else { 
                // code expired
                return Response.json(
                    {
                        success: false,
                        message: "Verification code has expired",
                    },
                    { status: 400 }
                );
            }
        }
    } catch (e) {
        console.log("error verifying user", e);
        return Response.json(
            {
                success: false,
                message: "error verifying user",
                error: e,
            },
            { status: 500 }
        );
    }
}