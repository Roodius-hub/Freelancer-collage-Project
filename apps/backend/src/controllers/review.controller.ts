import { Request, Response } from "express";
import { Prisma } from "@repo/db";
import { db } from "../db/db"; // Adjust this import to your Prisma client

export const createReview = async (req: Request, res: Response) => {
  try {
    const reviewerId = req.user?.id;
    const reviewerRole = req.user?.role;
    const { jobId } = req.params;
    const { rating, comment } = req.body;

    // 1. Check authentication
    if (!reviewerId || !reviewerRole) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // 2. Validate review input
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    if (typeof comment !== "string" || !comment.trim()) {
      return res.status(400).json({
        message: "Comment is required",
      });
    }

    // 3. Find the job and its selected freelancer
    const job = await db.job.findUnique({
      where: { id: jobId },
      include: {
        selectedBid: true,
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // 4. Only completed jobs can be reviewed
    if (job.status !== "COMPLETED") {
      return res.status(400).json({
        message: "You can review only completed jobs",
      });
    }

    if (!job.selectedBid) {
      return res.status(400).json({
        message: "This job has no selected freelancer",
      });
    }

    const clientId = job.clientId;
    const freelancerId = job.selectedBid.freelancerId;

    // 5. Verify which participant is submitting the review
    let reviewRole: "CLIENT" | "FREELANCER";

    if (reviewerRole === "CLIENT" && reviewerId === clientId) {
      reviewRole = "CLIENT";
    } else if (
      reviewerRole === "FREELANCER" &&
      reviewerId === freelancerId
    ) {
      reviewRole = "FREELANCER";
    } else {
      return res.status(403).json({
        message: "You are not allowed to review this job",
      });
    }

    // 6. Create the review
    const review = await db.review.create({
      data: {
        rating,
        comment: comment.trim(),
        reviewerRole: reviewRole,
        clientId,
        freelancerId,
        jobId,
      },
    });

    return res.status(201).json({
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    // 7. Prevent duplicate reviews
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        message: "You have already reviewed this job",
      });
    }

    console.error("Create review error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// get all reviews of specific user 
export  const allReviewsOfSpecificUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { freelancerId } = req.params;

    if (!freelancerId) {
      return res.status(400).json({
        message: "Freelancer ID is required",
      });
    }

    const reviews = await db.review.findMany({
      where: {
        freelancerId,
        reviewerRole: "CLIENT",
      },
      include: {
        client: {
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
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return res.status(200).json({
      message: "Reviews fetched successfully",
      reviews,
      reviewCount: reviews.length,
      averageRating: Number(averageRating.toFixed(1)),
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};