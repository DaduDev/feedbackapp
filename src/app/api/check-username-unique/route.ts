import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { userNameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UserNameQuerySchema = z.object({
    username: userNameValidation
})

export async function GET(request: Request) {
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get("username")
        }
        const result = UserNameQuerySchema.safeParse(queryParam)
        console.log(result)
        if(!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: "Invalid username"
            }, {status: 400})
        } 
        const {username} = result.data
    } catch (error) {
        console.log("Error checking username", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, {status: 500})
    }
}