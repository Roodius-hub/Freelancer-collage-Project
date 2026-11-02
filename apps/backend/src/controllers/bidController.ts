import { db } from "../db/db";
import type { Request, Response } from "express";


//place bid 
export const placeBid = async (req: Request, res: Response) => {

    if (!req.user?.id) {
        return res.status(401).json({
            message: "User Not Found"
        })
    }
    console.log(req.body);
    const freeID: string = req.user?.id as string;  // current use who biding 
    const jobid = req.params.jobId as string;      // someone jobid
    const { amount, message, days } = req.body;  // make it default 

    console.log("bid data: ",amount,message,days);

    if (!jobid) {
        return res.status(401).json({
            message: "Job not found"
        })
    }

    if (amount === '' || message === '' || days === '') {
        return res.status(401).json({
            message: "Bid and Message Cant be Empty"
        })
    }

    // now we need do a Db transaction call or other method

    try {
        const response = await db.bid.upsert({
            // data:{
            //     freelancerId:freeID,
            //     amount:amount,
            //     jobId:jobid,
            //     deliveryDays:days,
            //     proposal:message,
            // }
            where: {
                freelancerId_jobId: {
                    freelancerId: freeID,
                    jobId: jobid,
                }
            }, // Unique condition to find existing record
            update: {
                amount: parseFloat(amount),
                deliveryDays: parseInt(days),
                proposal: message,
            }, // Data to apply if record exists
            create: {
                freelancerId: freeID,
                amount: parseFloat(amount),
                jobId: jobid,
                deliveryDays: parseInt(days),
                proposal: message,
            }, // Data to use if record does not exist
        })
        console.log(response, "bid created");
        return res.status(200).json({
            "message": "Bid created successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while updating bid"
        })
    }
}