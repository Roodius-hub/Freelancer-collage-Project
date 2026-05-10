import { db } from "../../src/db/db";
import jwt from "jsonwebtoken";

const secret = process.env.AUTH_SECRET;

const checkUser = (userid:string) => {
    const userId = db.user.findUnique({
        where: {
            id: userid
        }
    });
    

    
    
}