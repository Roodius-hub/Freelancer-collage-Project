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
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    console.log("NOTIFICATION CONTROLLER HIT");
    console.log("Authenticated user:", req.user);
    console.log("User ID:", req.user?.id);
    console.log("User role:", req.user?.role);
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    let notifications;

    if (role === "CLIENT") {
      // Get bids submitted to jobs owned by this client
      notifications = await db.bid.findMany({
        where: {
          job: {
            clientId: userId,
          },
        },
        include: {
          freelancer: {
            select: {
              id: true,
              name: true,
              picture: true,
            },
          },
          job: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (role === "FREELANCER") {
      // Get this freelancer's processed bids
      notifications = await db.bid.findMany({
        where: {
          freelancerId: userId,
          status: {
            in: ["ACCEPTED", "REJECTED"],
          },
        },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      
      console.log("FREELANCER BID NOTIFICATIONS:", notifications);
    } else {
      return res.status(403).json({
        message: "Invalid user role",
      });
    }

    return res.status(200).json({
      message: "Notifications fetched successfully",
      notifications,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
};

export const getSpeceficBids = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    const role = req.user?.role;
    const { bidId } = req.params;

    console.log("REQUESTED BID ID:", bidId);
    console.log("CURRENT USER:", currentUserId);
    console.log("CURRENT ROLE:", role);

    if (!currentUserId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Fetch bid with related job and freelancer
    const bidding = await db.bid.findUnique({
      where: {
        id: bidId,
      },
      include: {
        job: true,
        freelancer: true,
      },
    });

    if (!bidding) {
      return res.status(404).json({
        message: "Bid not found",
      });
    }

    // CLIENT: Can access bids submitted to their own jobs
    if (role === "CLIENT") {
      if (bidding.job.clientId !== currentUserId) {
        return res.status(403).json({
          message: "You are not authorized to view this bid",
        });
      }
    }

    // FREELANCER: Can access only their own bids
    else if (role === "FREELANCER") {
      if (bidding.freelancerId !== currentUserId) {
        return res.status(403).json({
          message: "You are not authorized to view this bid",
        });
      }
    } else {
      return res.status(403).json({
        message: "Invalid user role",
      });
    }

    return res.status(200).json({
      message: "Bid fetched successfully",
      biding: bidding,
    });

  } catch (error) {
    console.error("GET SPECIFIC BID ERROR:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateBidStatus = async (req: Request, res: Response) => {
  try {
    const { bidId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        message: "Invalid bid status",
      });
    }

    const bid = await db.bid.findUnique({
      where: { id: bidId as string },
      include: { job: true },
    });

    if (!bid) {
      return res.status(404).json({
        message: "Bid not found",
      });
    }

    if (bid.job.clientId !== userId) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    if (bid.status !== "PENDING" || bid.job.status !== "OPEN") {
      return res.status(400).json({
        message: "Bid or job is no longer available",
      });
    }

    const result = await db.$transaction(async (tx) => {
      const updatedBid = await tx.bid.update({
        where: { id: bidId as string },
        data: { status },
      });

      let updatedJob = null;

      if (status === "ACCEPTED") {
        await tx.bid.updateMany({
          where: {
            jobId: bid.jobId,
            id: { not: bidId as string },
            status: "PENDING",
          },
          data: { status: "REJECTED" },
        });

        updatedJob = await tx.job.update({
          where: { id: bid.jobId },
          data: { status: "ASSIGNED", selectedBidId: bidId as string },
        });
      }

      return { updatedBid, updatedJob };
    });

    return res.status(200).json({
      message: `Bid ${status.toLowerCase()} successfully`,
      data: result,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update bid status",
    });
  }
};