"use client";

import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa"
import { TiCode } from "react-icons/ti";
import axios from "axios";


export const UserRole = () => {
    const [role, Setrole] = useState("");

    const handleRole = async (v:string) => {
        try {
                Setrole(v);
            console.log(v);
            const res = await axios.post(`http://localhost:3000/api-2/auth-role`, {
                            role: v 
            })
        } catch (error) {
            console.log(error);
        }
        
    }


    return (
        <>
        <div className="flex items-center justify-between">
            <div className="rounded-md p-4">
                <button onClick={async () => {
                    handleRole("CLIENT")                    
                }}
                className="text-gray-300 hover:cursor-pointer text-sm hover:text-white flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:bg-[#222] transition"><FaUserCircle />Client</button>
            </div>

            <div className="">
                <button onClick={async () => {
                    handleRole("FREELANCER")
                }}
                className="text-gray-300 hover:cursor-pointer text-sm hover:text-white flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:bg-[#222] transition"><TiCode /> Freelancer </button>
            </div>
        </div>
        </>
    )
}