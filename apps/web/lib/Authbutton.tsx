"use client";

import { signIn, signOut, useSession } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { useState } from "react";
import { useRouter } from "next/navigation";
import {useAtom} from "jotai"
import  { roleState } from "@/atom"
export default function AuthButton(){
    const role = useAtom(roleState)
    const router = useRouter();
    const { data:session, status } = useSession();
    // const [open, setOpen] = useState(false);
    if(!session) {
        return <div className="gap-2 flex items-center justify-center">
    <button onClick={() => {
        signIn("google", {callbackUrl:'/'})}} className="bg-[#a026da] p-3 pl-8 pr-8 rounded-lg"> <FcGoogle/> </button>
    <button onClick={() => { 
        signIn("github" , {callbackUrl:'/', role})}} className="bg-[#0a85a7] p-3 pl-8 pr-8 rounded-lg"> <FaGithub/> </button>
    </div>
    }
}