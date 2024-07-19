import {NextAuthOptions} from "next-auth";
import CredentialProviders from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialProviders({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if(!user) {
                        throw new Error("No user Found")
                    }
                    if(!user.isVerified) {
                        throw new Error("User not verified, please verify your account first")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error("Invalid credentials")
                    }
                } catch (error: any) {
                    throw new Error("Invalid credentials", error)
                }
              }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if(token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session
        },
        async jwt({ token, user }) {
            if(user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token
        }
    },
    pages: {
        signIn: '/signin',
        error: '/error',
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.SECRET,

}
