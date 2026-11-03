"use client"

import { FaWallet } from "react-icons/fa"
import Logosvg from "@/public/logo"
import { useRouter } from "next/navigation"
import AuthButton from "@/lib/Authbutton"
import UserMenu from "@/lib/Usermenu"
import { useSession } from "next-auth/react"; 


export function Navbar() {
  const router = useRouter()
  const {data:session, status} = useSession();

  if(status === "loading") return null;

  const Userrole = session?.user?.role;
  console.log(Userrole)

  return (
    <nav className="bgfixed top-0 left-0 w-full z-50 bg-black border-b border-[#1f1f1f]">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between p-[0.5]">

        {/* Logo */}
        <div className="flex items-center">
          <Logosvg className="scale-75" />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Nav Links */}
          <div>
             {Userrole === "CLIENT" && (
           <a className="text-gray-300 hover:cursor-pointer text-[11px] hover:text-white flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:bg-[#222] hover:border-purple-500 transition" onClick={() => setTimeout(() => {
            router.push("/postjob")
          }, 1000)}>Post Job</a>
      )}
          </div>
          <a className="text-gray-300 hover:cursor-pointer text-[11px] hover:text-white flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:bg-[#222] hover:border-purple-500 transition">Home</a>
          <a className="text-gray-300 hover:cursor-pointer text-[11px] hover:text-white flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:bg-[#222] hover:border-purple-500 transition" >Jobs</a>
       

          {/* Wallet Button (fixed dark style) */}
          {/* <button className="text-sm flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:bg-[#222] transition hover:cursor-pointer">
            <FaWallet />
            Connect Wallet
          </button> */}

          {/* Login Button */}
          <div  className="text-sm hover:cursor-pointer">
                {/* <AuthButton/> */}
         <UserMenu/>
          </div>
        </div>
      </div>
    </nav>
  )
}