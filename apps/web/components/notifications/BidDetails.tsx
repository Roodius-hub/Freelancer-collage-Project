
import { BIDS_TYPE } from "@/Types/types";
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
  const statusStyles = {
    PENDING: "bg-yellow-500/10 text-yellow-500",
    ACCEPTED: "bg-green-500/10 text-green-500",
    REJECTED: "bg-red-500/10 text-red-500",
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
            statusStyles[bid.status]
          }`}
        >
          {bid.status}
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
            {bid.job.title}
          </h3>

          <p className="mt-2 text-sm text-zinc-500">
            Job ID: {bid.job.id}
          </p>

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
        {bid.status === "PENDING" && (
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              // onClick={() => onReject?.(bid.id)}
              className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 px-5 py-3 text-sm text-red-400 hover:bg-red-500/10"
            >
              <X size={17} />
              Reject Bid
            </button>

            <button
              // onClick={() => onAccept?.(bid.id)}
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-500"
            >
              <Check size={17} />
              Accept Bid
            </button>

          </div>
        )}

      </div>
    </main>
  );
}
