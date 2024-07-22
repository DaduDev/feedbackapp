import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 400})
    }

    const userId = user._id
    const {acceptMessages} =  await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {isAcceptedMessage: acceptMessages}, {new: true})
        if(!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user"
            }, {status: 500})
        }
        return Response.json({
            success: true,
            message: "User updated successfully"
        }, {status: 200})
    } catch (error) {
        console.log("Failed to update user", error)
        return Response.json({
            success: false,
            message: "Failed to update user"
        }, {status: 500})
    }
}

export async function GET(request: Request) {
    dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 400})
    }

    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId)
        if(!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 404})
        }
        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptedMessage
        }, {status: 200})
    } catch (error) {
        console.log("Error in getting Message Acceptance status", error)
        return Response.json({
            success: false,
            message: "Error in getting Message Acceptance status"
        }, {status: 500})
    }
}