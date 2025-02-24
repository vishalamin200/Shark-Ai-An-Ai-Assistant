import mongo_connection from "@/lib/mongo_connection";
import UserModel from "@/models/Users";
import NextAuth, { User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    callbacks:{
        async signIn({user} : {user:User}){
            try {
                await mongo_connection()
                const existingUser = await UserModel.findOne({ email: user?.email })
                if (!existingUser) {
                    await UserModel.create({
                        googleId:user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image
                    })
                }
                return true 
            } catch (error) {
                console.log("Error in Signin", (error as Error).message)
                return false
            } 
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };