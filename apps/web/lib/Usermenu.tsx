"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react"
import { FaGoogle } from 'react-icons/fa'; // Font Awesome version
import { FaGithub } from "react-icons/fa";
import AuthButton from "./Authbutton";
import { UserRole } from "./UserRole";


export default function   UserMenu() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const [role , SetRole] = useState(false);
  
  if (status === "loading") return null

  // 🔓 NOT LOGGED IN
  if (!session) {
    return (
      <div>

      
      <div className=" visible flex items-center gap-2 cursor-pointer" onClick={() => {
        SetRole(!role)
      }}>
        {
          !role ? <UserRole /> : <AuthButton /> 
        }
      {/* <UserRole /> */}
      </div>
      </div>
    )
  }

  // 🔐 LOGGED IN
  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <img
          src={session.user?.image || "/default.png"}
          className="w-9 h-9 rounded-full border border-[#2a2a2a]"
        />
        <span className="text-white text-sm">
          {session.user?.name || "User"}
        </span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-[#111] border border-[#2a2a2a] rounded-lg shadow-lg p-2">
          <button className="w-full text-left px-3 py-2 hover:bg-[#222] rounded">
            Profile
          </button>

          <button className="w-full text-left px-3 py-2 hover:bg-[#222] rounded">
            Dashboard
          </button>

          <button
            onClick={() => signOut()}
            className="w-full text-left px-3 py-2 hover:bg-[#222] rounded text-red-400"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}