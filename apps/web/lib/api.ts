"use client";

const BASE_URL = "http://localhost:3001";

export async function getJobs(){
    const res = await fetch(`${BASE_URL}/jobs`);
    
    return res.json();
}

export async function CreateJobs(data:any) {
    const res = await fetch(`${BASE_URL}/createJobs`, {
        method:'POST',
        body:JSON.stringify(data), 
        headers: {"Content-Type": "application/json"}
    });

    return res.json();
}

