"use client";

import { BIDS_TYPE } from "@/Types/types";
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
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
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
  const statusStyles = {
    PENDING: "bg-yellow-500/10 text-yellow-500",
    ACCEPTED: "bg-green-500/10 text-green-500",
    REJECTED: "bg-red-500/10 text-red-500",
  };

  const router = useRouter();
  const { data: session } = useSession();
  
  const [chatLoading, setChatLoading] = useState(false);
  
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
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/notifications"
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to notifications
        </Link>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            statusStyles[status]
          }`}
        >
          {status}
        </span>
      </div>

      <div className="space-y-6">

        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold">
            Bid Details
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Review freelancer proposal and project details.
          </p>
        </div>

        {/* Freelancer information */}
        <section className="rounded-xl border border-white/10 bg-zinc-900/50 p-5">
          <div className="flex items-center gap-4">

            <Image
              src={bid.freelancer.picture}
              alt={bid.freelancer.name}
              width={56}
              height={56}
              className="rounded-full object-cover"
            />

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold">
                {bid.freelancer.name}
              </h2>

              <p className="text-sm text-zinc-400">
                Freelancer
              </p>
            </div>

            <button className="rounded-lg border border-white/10 p-2 hover:bg-white/5">
              <UserRound size={18} />
            </button>

          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="text-xs text-zinc-500">
              Freelancer ID
            </p>
            <p className="mt-1 break-all text-sm">
              {bid.freelancerId}
            </p>
          </div>
        </section>

        {/* Job information */}
        <section className="rounded-xl border border-white/10 bg-zinc-900/50 p-5">

          <div className="mb-4 flex items-center gap-2">
            <BriefcaseBusiness size={19} />
            <h2 className="font-semibold">
              Project Information
            </h2>
          </div>

          <h3 className="text-lg font-medium">
            {bid.job.description}
          </h3>

          <p className="mt-2 text-sm text-zinc-500">
            Job ID: {bid.job.id}
          </p>
                  {/*<p>{ bid.job.status}</p>*/}
        </section>

        {/* Bid information */}
        <section className="rounded-xl border border-white/10 bg-zinc-900/50 p-5">

          <h2 className="mb-4 font-semibold">
            Bid Information
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <IndianRupee size={17} />
                <span className="text-sm">Bid Amount</span>
              </div>

              <p className="mt-2 text-2xl font-semibold">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(bid.amount)}
              </p>
            </div>

            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <Clock size={17} />
                <span className="text-sm">Delivery Time</span>
              </div>

              <p className="mt-2 text-2xl font-semibold">
                {bid.deliveryDays} Days
              </p>
            </div>

          </div>

        </section>

        {/* Proposal */}
        <section className="rounded-xl border border-white/10 bg-zinc-900/50 p-5">

          <h2 className="mb-4 font-semibold">
            Freelancer Proposal
          </h2>

          <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
            {bid.proposal}
          </p>

        </section>

        {/* Timeline */}
        <section className="rounded-xl border border-white/10 bg-zinc-900/50 p-5">

          <h2 className="mb-4 font-semibold">
            Bid Timeline
          </h2>

          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <CalendarDays size={18} className="text-zinc-400" />

              <div>
                <p className="text-sm">Bid submitted</p>
                <p className="text-xs text-zinc-500">
                  {new Date(bid.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock size={18} className="text-zinc-400" />

              <div>
                <p className="text-sm">Last updated</p>
                <p className="text-xs text-zinc-500">
                  {new Date(bid.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

          </div>

        </section>

        {/* Actions */}
        {status === "PENDING" && (
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                      <button
                          disabled={ loading }
              onClick={() => updateBidStatus("REJECTED")}
              className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 px-5 py-3 text-sm text-red-400 hover:bg-red-500/10"
            >
              <X size={17} />
              Reject Bid
            </button>

                      <button
                          disabled={ loading }
              onClick={() => updateBidStatus("ACCEPTED")}
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-500"
            >
              <Check size={17} />
              {loading ? "Updating..." : "Accept Bid"}
            </button>

          </div>
        )}
        {error && (
          <p className="text-sm text-red-400">{error}</p>
              )}

        {/* if accepted */}
        {bid.status === "ACCEPTED" && (
          <button
            onClick={handleOpenChat}
            disabled={chatLoading}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {chatLoading ? "Opening Chat..." : "Chat"}
          </button>
        )}
      </div>
    </main>
  );
}
