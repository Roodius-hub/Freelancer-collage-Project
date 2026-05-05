import  { NextRequest, NextResponse } from "next/server"
import {roleState} from "../../../../atom/index" 
import {useRecoilState} from "recoil" 

export async function POST(request:Request) {
    const userRole = await request.json();
    const [role, SetRole] = useRecoilState(roleState);

    SetRole(userRole);

    return  Response.json({ROLE: role})
}