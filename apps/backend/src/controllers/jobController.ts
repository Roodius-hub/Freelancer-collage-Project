import { db } from "../db/db";
import { jobType } from "../types/jobTypes";
import { reqresTypes } from "../types/userTypes";
import type { Request, Response} from "express"

//create post
export const createJobs = async (req: Request, res: Response) => {

    if (!req.user?.id) {
        return res.status(401).json({message: "User not authenticated"});
    }

    const id:string = req.user?.id as string;
    const { title, description, budget , bids} =  req.body;  

    console.log(title, description, budget)
    
    try {
        const response = await db.job.create({
            data: {
                title,
                description,
                budget,
                bids,
                client:{
                    connect:{id:id}
                },
            },
        })

        console.log(response);

        return res.status(200).json({message:"Job created !"})

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Error"})
    }
}


// update User 
export const updateJob = async (req:Request, res:Response) => {
    if (!req.user?.id) {
        return res.status(401).json({message: "User not an authenticated"})
    }

    const jobId:string = req.params.jobId as string;
    const userid:string = req.user?.id as string;
    const { title, description, budget}  = req.body;

    try {
        const response = await db.job.updateMany({
            where:{
                id:jobId, 
                clientId:userid
            },
            data: {
                title, 
                description,
                budget,
            }
        })

        if(response.count == 0){
            return res.status(403).json({ message: "Unauthorized or Job not found" });
        }

        console.log(response, "Job updated !");
        return res.status(200).json({message: "Job updated Successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error while Updating Job Post"});
    }

}

// delete job 
export const deleteJob = async ({req, res}: reqresTypes) => {
    const jobId = req.params.jobId as string;
    const userid = req.user?.id;

    try {
        const response = await db.job.delete({
            where:{
                id:jobId,
                clientId:userid,
            },
        })
        console.log(response);

        return res.status(200).json({message :"User Deleted successfully"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error While Deleting Post"})
    }
}


// get post 

export  const getJobs= async ({req, res}: reqresTypes) => {
    try {
        const posts = await db.job.findMany({
            include: {
                client:true
            },
            orderBy:{
                createdAt:'desc'
            }
        });
        console.log(posts)
        return res.status(200).json(posts)
    } catch (error) {
        console.log(error);

        return res.status(500).json({message: "Internal Error"})
    }
}