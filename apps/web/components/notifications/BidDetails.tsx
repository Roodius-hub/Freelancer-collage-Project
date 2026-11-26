"use client";

import { BIDS_TYPE, Review } from "@/Types/types";
import { toast } from "sonner";

import axios from "axios";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  IndianRupee,
  BriefcaseBusiness,
  UserRound,
  Check,
  X,
  Copy,
  Star,
  MessageSquareQuote,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import ReviewForm from "../shared/Review";
// type Bid = {
//   id: string;
//   amount: number;
//   deliveryDays: number;
//   proposal: string;
//   status: "PENDING" | "ACCEPTED" | "REJECTED";
//   createdAt: string;
//   updatedAt: string;
//   freelancerId: string;
// 
//   freelancer: {
//     id: string;
//     name: string;
//     picture: string;
//   };
// 
//   job: {
//     id: string;
//     title: string;
//     clientId: string;
//   };
// };

type Props = {
  bid: BIDS_TYPE;
  // onAccept?: (bidId: string) => void;
  // onReject?: (bidId: string) => void;
};

export default function BidDetails({
  bid,
  // onAccept,
  // onReject,
}: Props) {
  const [status, setStatus] = useState(bid.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [review, SetReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const statusStyles = {
    PENDING: "bg-yellow-500/10 text-yellow-500",
    ACCEPTED: "bg-green-500/10 text-green-500",
    REJECTED: "bg-red-500/10 text-red-500",
  };

  const router = useRouter();
  const { data: session } = useSession();

  const [chatLoading, setChatLoading] = useState(false);


  // reviews
  useEffect(() => {
    const fetchReviews = async () => {
    try {
      setReviewsLoading(true);

      const response = await axios.get(
        `http://localhost:3001/reviews/freelancer/${bid.freelancerId}`,
        {withCredentials:true}
      );
      console.log("Reviews",response.data.reviews)
      SetReviews(response.data.reviews);
    } catch (error) {
      console.error("Failed to fetch freelancer reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  fetchReviews();
  }, [bid.freelancerId])

  const handleOpenChat = async () => {
    try {
      setChatLoading(true);

      // Create a conversation or retrieve the existing one
      const response = await api.post(
        `/conversations/${bid.id}`
      );

      const conversationId = response.data.conversation.id;

      // Navigate to the chat page
      router.push(`/chat/${conversationId}`);

    } catch (error) {
      console.error("Failed to open conversation:", error);
    } finally {
      setChatLoading(false);
    }
  };

  const updateBidStatus = async (
    newStatus: "ACCEPTED" | "REJECTED"
  ) => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.patch(
        `http://localhost:3001/bids/${bid.id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      setStatus(response.data.updatedBid.status);
      toast.success(
        newStatus === "ACCEPTED"
          ? "Bid accepted successfully!"
          : "Bid rejected successfully!"
      );
    } catch (error) {
      console.error(error);
      setError("Unable to update bid status. Please try again.");
      toast.error("Failed to update bid status.");
    } finally {
      setLoading(false);
    }
  };

  console.log(bid);

  //update job state 
  const handleupdateJobStatus = async (jobStatus: "COMPLETED") => {
    try {
      const res = await axios.patch(`http://localhost:3001/jobs/jobstatus/${bid.job.id}`,
        { status: jobStatus },
        { withCredentials: true });
      console.log(res.data);
      console.log("Marked As Completed")
      router.refresh();
    } catch (err) {
      console.log(err);
    }
  }

  const handleReviewSubmit = async (data: {
    rating: number;
    comment: string;
  }) => {
    await axios.post(
      `http://localhost:3001/reviews/${bid.job.id}`,
      data,
      { withCredentials: true }
    );
  };

 
 
return (
  <div className="relative left-1/2 flex h-screen w-screen max-w-none -translate-x-1/2 overflow-hidden">

    {/* Left panel - Bid Details */}
    <div className="min-w-0 flex-1 overflow-y-auto border-r border-white/10 px-8 py-8">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/notifications"
          className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to notifications
        </Link>

        <span className={`rounded-full px-4 py-1.5 text-xs font-medium ${statusStyles[status]}`}>
          {status}
        </span>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Bid Details</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Review freelancer proposal and project details.
        </p>
      </div>

      {/* Freelancer information */}
      <section className="mb-5 rounded-xl border border-white/10 bg-zinc-900/50 p-6">
        <div className="flex items-center gap-4">
          <Image
            src={bid.freelancer.picture}
            alt={bid.freelancer.name}
            width={56}
            height={56}
            className="shrink-0 rounded-full object-cover"
          />

          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold">{bid.freelancer.name}</h2>
            <p className="mt-0.5 text-sm text-zinc-400">Freelancer</p>
          </div>

          <button className="rounded-lg border border-white/10 p-2.5 transition-colors hover:bg-white/5">
            <UserRound size={18} />
          </button>
        </div>

        <div className="mt-5 border-t border-white/10 pt-5">
          <p className="mb-1 text-xs text-zinc-500">Freelancer ID</p>
          <p className="break-all text-sm text-zinc-300">{bid.freelancerId}</p>
        </div>
      </section>

      {/* Job information */}
      <section className="mb-5 rounded-xl border border-white/10 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <BriefcaseBusiness size={18} />
          <h2 className="text-base font-semibold">Project Information</h2>
        </div>

        <p className="break-words text-sm leading-relaxed text-zinc-200">
          {bid.job.description}
        </p>

        <p className="mt-3 text-xs text-zinc-500">Job ID: {bid.job.id}</p>
      </section>

      {/* Bid information */}
      <section className="mb-5 rounded-xl border border-white/10 bg-zinc-900/50 p-6">
        <h2 className="mb-4 text-base font-semibold">Bid Information</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-white/5 p-5">
            <div className="flex items-center gap-2 text-zinc-400">
              <IndianRupee size={16} />
              <span className="text-sm">Bid Amount</span>
            </div>

            <p className="mt-3 text-2xl font-semibold">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(bid.amount)}
            </p>
          </div>

          <div className="rounded-lg bg-white/5 p-5">
            <div className="flex items-center gap-2 text-zinc-400">
              <Clock size={16} />
              <span className="text-sm">Delivery Time</span>
            </div>

            <p className="mt-3 text-2xl font-semibold">
              {bid.deliveryDays} Days
            </p>
          </div>
        </div>
      </section>

      {/* Proposal */}
      <section className="mb-5 rounded-xl border border-white/10 bg-zinc-900/50 p-6">
        <h2 className="mb-4 text-base font-semibold">Freelancer Proposal</h2>

        <p className="whitespace-pre-wrap break-words text-sm leading-7 text-zinc-300">
          {bid.proposal}
        </p>
      </section>

      {/* Timeline */}
      <section className="mb-5 rounded-xl border border-white/10 bg-zinc-900/50 p-6">
        <h2 className="mb-4 text-base font-semibold">Bid Timeline</h2>

        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <CalendarDays size={18} className="mt-0.5 shrink-0 text-zinc-400" />

            <div>
              <p className="text-sm">Bid submitted</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {new Date(bid.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock size={18} className="mt-0.5 shrink-0 text-zinc-400" />

            <div>
              <p className="text-sm">Last updated</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {new Date(bid.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Actions */}
      {status === "PENDING" && (
        <div className="mb-5 flex justify-end gap-3">
          <button
            disabled={loading}
            onClick={() => updateBidStatus("REJECTED")}
            className="flex items-center gap-2 rounded-lg border border-red-500/30 px-5 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
          >
            <X size={16} />
            Reject Bid
          </button>

          <button
            disabled={loading}
            onClick={() => updateBidStatus("ACCEPTED")}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
          >
            <Check size={16} />
            {loading ? "Updating..." : "Accept Bid"}
          </button>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {bid.status === "ACCEPTED" && (
        <div className="mb-5 flex items-center gap-3">
          <button
            onClick={handleOpenChat}
            disabled={chatLoading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
          >
            {chatLoading ? "Opening Chat..." : "Chat"}
          </button>

          <button
            onClick={() => handleupdateJobStatus("COMPLETED")}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-600"
          >
            Mark as Completed
          </button>
        </div>
      )}

      {bid.job.status === "COMPLETED" && (
        <ReviewForm onSubmit={handleReviewSubmit} alreadyReviewed={true} />
      )}

    </div>

    {/* Right panel - Freelancer Reviews */}
    <aside className="w-[380px] shrink-0 overflow-y-auto px-6 py-8">

  <div className="sticky top-8">
    <h2 className="mb-1 text-lg font-semibold">
      Freelancer Reviews
    </h2>

    <p className="mb-6 text-sm text-zinc-400">
      Reviews from clients who worked with {bid.freelancer.name}
    </p>

    <div className="space-y-4">
      {reviewsLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-zinc-900/50"
            />
          ))}
        </div>
      ) : review.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-8 text-center">
          <MessageSquareQuote
            size={28}
            className="mx-auto mb-3 text-zinc-600"
          />
          <p className="text-sm font-medium text-zinc-300">
            No reviews yet
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            This freelancer hasn't received any reviews.
          </p>
        </div>
      ) : (
        review.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-zinc-900/70 p-5 transition-all duration-200 hover:border-indigo-500/30 hover:bg-zinc-900"
          >
            {/* Client details */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                <UserRound size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-white">
                  {item.client?.name || "Anonymous Client"}
                </h3>
                <p className="text-xs text-zinc-500">
                  Client Review
                </p>
              </div>

              <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1.5">
                <Star
                  size={14}
                  className="fill-amber-400 text-amber-400"
                />
                <span className="text-sm font-semibold text-amber-400">
                  {item.rating}/5
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-white/[0.07]" />

            {/* Review comment */}
            <div className="flex gap-2">
              <MessageSquareQuote
                size={17}
                className="mt-0.5 shrink-0 text-zinc-500"
              />

              <p className="break-words text-sm leading-6 text-zinc-300">
                {item.comment}
              </p>
            </div>

            {/* Star rating */}
            <div className="mt-4 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={13}
                  className={
                    star <= item.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-zinc-700"
                  }
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  </div>

</aside>

  </div>
);

}
