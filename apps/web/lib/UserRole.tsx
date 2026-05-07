"use client";

import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa"
import { TiCode } from "react-icons/ti";
import axios from "axios";
import { roleState } from "@/atom";
import { useAtom } from "jotai";


export const UserRole = () => {
    // const [oldrole, Setrole] = useState("");
    // const [role, setRole] = useAtom(roleState);

    return (
        <>
        <div className="flex items-center justify-between">
            <div className="rounded-md p-4">
                <button onClick={async () => {
                    const selectedRole = "CLIENT";
                    // setRole(selectedRole as any)
                    document.cookie = `role=${selectedRole}; path=/`;

                }}
                className="text-gray-300 hover:cursor-pointer text-sm hover:text-white flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:bg-[#222] transition"><FaUserCircle />Client</button>
            </div>

            <div className="">
                <button onClick={async () => {
                    const selectedRole = "FREELANCER";
                    // setRole(selectedRole as any);
                    document.cookie = `role=${selectedRole}; path=/`;
                }}
                className="text-gray-300 hover:cursor-pointer text-sm hover:text-white flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:bg-[#222] transition"><TiCode /> Freelancer </button>
            </div>
        </div>
        </>
    )
}