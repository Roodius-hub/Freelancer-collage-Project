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
    const { amount, proposal, deliveryDays } = req.body;  // make it default 

    console.log("bid data: ",amount,proposal,deliveryDays);

    if (!jobid) {
        return res.status(401).json({
            message: "Job not found"
        })
    }

    if (amount === '' || proposal === '' || deliveryDays === '') {
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
                deliveryDays: parseInt(deliveryDays),
                proposal: proposal,
            }, // Data to apply if record exists
            create: {
                freelancerId: freeID,
                amount: parseFloat(amount),
                jobId: jobid,
                deliveryDays: parseInt(deliveryDays),
                proposal: proposal,
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

//get bids by id 
export const getBids = async (req: Request, res: Response) => {
    const currentUserId = req.user?.id; 
    
    if (!currentUserId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    try {
      const notifications = await db.bid.findMany({
        where: {
          job: {
            clientId: currentUserId,
          },
        },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              clientId: true,
            },
          },
          freelancer: {
            select: {
              id: true,
              name: true,
              picture: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });
        console.log(notifications);
        return res.status(200).json({
            notifications
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
              message:"Internal Server Error"
          })
    } 
}


export const getSpeceficBids = async (req: Request, res: Response) => {
    const currentUserId = req.user?.id; 
    const { bidId } = req.params;
    console.log("REQUESTED bidID BACKEND", bidId);
    if (!currentUserId) {
      return res.status(401).json({
        message: "Unauthorized",  
      });
    }
    
    try {
        console.log("INSIDE TRY CATCH")
      const biding = await db.bid.findUnique({
          where: {
              id: bidId as string,
          job: {
            clientId: currentUserId,
          },
        },
        include: {
            job: true,
            freelancer:true,
          },
        });
      if (!biding) {
            return res.status(404).json({
              message: "Bid not found",
            });
          }
      
          return res.status(200).json({ biding });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
              message:"Internal Server Error"
          })
    } 
}