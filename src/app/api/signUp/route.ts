import { sendVerificationemail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request){
    await dbConnect();

    try {
        const {username, email, password} = await request.json();
        const existingUserVerifiedByUserName = await UserModel.findOne({
            username,
            isVerified: true,
        })
        if(existingUserVerifiedByUserName){
            return Response.json({
                success: false,
                message: "User Already Exists"
            },
            {
                status: 400
            })
        }
        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exists with this Email"
                }, {status: 401})
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpires = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();

            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpires: expiryDate,
                isVerified: false,
                isAcceptedMessage: true,
                messages: [],
            })
            await newUser.save()

        }
        const emailResponse = await sendVerificationemail(email, username, verifyCode)
        if(!emailResponse.success) {
            return Response.json({
                success: false,
                message: "Error Sending Email"
            }, {status: 500})
        }
        return Response.json({
            success: true,
            message: "User Registered Successfully, please verify your email"
        }, {status: 201})
    }
     catch (error) {
        console.log("Error Registering User", error);
        return Response.json({
            success: false,
            message: "Error Registering User"
        }, {
            status: 500
        })
    }
}