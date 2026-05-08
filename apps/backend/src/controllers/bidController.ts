import  { db } from "../db/db";
import type {Request, Response} from "express";


//place bid 


const placeBid = async (req: Request, res: Response) => {

    if(!req.user?.id) {
        return res.status(401).json({
            message: "User Not Found"
        })
    }

    const userid:string = req.user?.id as string;  // current use who biding 
    const jobid = req.params.id as string;      // someone jobid
    const {amount, message, } = req.body;  // make it default 
    

    if(!jobid) {
        return res.status(401).json({
            message: "Job not found"
        })
    }

    if(amount === '' && message  === '') {
        return res.status(401).json({
            message: "Bid and Message Cant be Empty"
        })
    }   

    // now we need do a Db transaction call or other method

    // try {
    //     const response = await db.job.upsert({

    //     }) 

    // } catch (error) {   
    //     console.log(error); 
    //     return res.status(401).json({
    //         message: "Error while updating bid"
    //     })
    // }


}