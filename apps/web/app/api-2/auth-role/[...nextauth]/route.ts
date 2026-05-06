import  { NextRequest, NextResponse } from "next/server"
import {roleState} from "../../../../atom/index" 
import {useRecoilState} from "recoil" 



// post request
export async function POST(request:Request) {
    const userRole = await request.json();
    const [role, SetRole] = useRecoilState(roleState);

    SetRole(userRole);
    console.log(role);
    return  Response.json({ROLE: role})
}