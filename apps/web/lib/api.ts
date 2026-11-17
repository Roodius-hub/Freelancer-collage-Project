"use client";

import axios from "axios";

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

export async function uploadAddress(city:string, state:string, country:string, zipCode:string, street:string) {
    try {
        const response = await axios.post("http://localhost:3001/user/address", {
            city,
            state,
            country,
            zipCode,
            street
        }, {
              withCredentials:true
        })
        const res = response.data;
        console.log(res);

        return res;
    } catch (err) {
        console.log(err);
    }
}


export async function GetAddress() {
    try {
        const response = await axios.get("http://localhost:3001/user/get-address", {
            withCredentials: true
        });
        const user_address = response.data.address;
        console.log(user_address);
        return user_address
    } catch (error) {
        console.log(error);
    }
}