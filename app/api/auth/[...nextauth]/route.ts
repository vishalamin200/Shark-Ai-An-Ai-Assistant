import mongo_connection from "@/lib/mongo_connection";
import UserModel from "@/models/Users";
import NextAuth, { Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module 'next-auth' {
    interface Session {
        user: {
            id?: string,
            name?: string,
            email?: string,
            image?: string,
            userId?: string,
        }
    }
}

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        async signIn({ user }: { user: User }) {

            try {
                await mongo_connection()
                console.log()
                const existingUser = await UserModel.findOne({ email: user?.email })
                if (!existingUser) {
                    await UserModel.create({
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
        },
        async session({ session }: { session: Session }) {
            try {
                await mongo_connection()
                const user = await UserModel.findOne({ email: session?.user?.email })
                if (user && session?.user) {
                    session.user.userId = user?._id.toString()
                }

                return session
            } catch (error) {
                console.log("Error in Signin", (error as Error).message)
                return session
            }
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
