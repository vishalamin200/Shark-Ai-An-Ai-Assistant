"use client";

import { toggleProfile } from "@/redux/slices/chat.slice";
import { AppDispatch, RootState } from "@/redux/store";
import { LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

export default function LoginButton() {
    const { data: session } = useSession();
    const { profile } = useSelector((state: RootState) => state.chat)
    const dispatch = useDispatch<AppDispatch>()

    if (session) {

        return (
            <div className="relative">
                <div className="w-fit flex justify-end ">
                    <Image onClick={() => dispatch(toggleProfile())} src={session?.user?.image as string} alt="avatar" width={40} height={40} className="rounded-full h-10 w-18 cursor-pointer " />
                </div>
                {profile && <div className="absolute right-0 w-40 h-fit bg-chat text-lesswhite flex flex-col items-center gap-y-1 rounded-lg py-2 px-2 mt-3 md:mt-2 z-50">
                    <div className="language-btn gap-x-3" onClick={() => signOut()}><LogOut /> <p>Logout</p></div>
                </div>}

            </div>

        );
    }

    return (
        <button onClick={() => signIn("google")} className="px-4 py-2 bg-lesswhite text-black rounded-l-full rounded-r-full w-18 h-10">
            Log in
        </button>
    );
}
