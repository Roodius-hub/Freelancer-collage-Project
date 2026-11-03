
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";

import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Wallet,
} from "lucide-react";

type ApplyFormProps = {
  jobId: string;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  biddingEndsAt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  clientId: string;
};

export default function Applyform({
  jobId,
  title,
  description,
  budgetMin,
  budgetMax,
  deadline,
  biddingEndsAt,
  status,
}: ApplyFormProps) {
  const router = useRouter();

  const [bid, setBid] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // console.log(bid,deliveryDays,proposal);

  const {data:session} = useSession();
  const Userrole = session?.user?.role;

  const formatDate = (date: string) => {
    if (!date) return "Not specified";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "Not specified";

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isOpen = status?.toUpperCase() === "OPEN";

  async function submitBid() {
    setError("");

    const amount = Number(bid);
    const days = Number(deliveryDays);

    if (!bid || !Number.isFinite(amount) || amount <= 0) {
      setError("Please enter a valid bid amount.");
      return;
    }

    if (amount < budgetMin || amount > budgetMax) {
      setError(`Your bid must be between ₹${budgetMin} and ₹${budgetMax}.`);
      return;
    }

    if (!Number.isInteger(days) || days <= 0) {
      setError("Please enter a valid delivery time.");
      return;
    }

    if (proposal.trim().length < 100) {
      setError("Your proposal must contain at least 100 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`http://localhost:3001/bids/jobs/${jobId}/?apply=1/role=freelancer`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          amount,
          deliveryDays: days,
          proposal: proposal.trim(),
        }),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit proposal.");
      }

      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Back navigation */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to jobs
        </button>

        {/* JOB DETAILS */}
        <section className="rounded-2xl border border-white/[0.07] bg-[#111113] p-6 sm:p-8">

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
              Project details
            </p>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                isOpen
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {status}
            </span>
          </div>

          <h1 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>

          <p className="mt-5 whitespace-pre-line text-sm leading-7 text-zinc-400">
            {description}
          </p>

          <div className="mt-8 grid gap-6 border-t border-white/[0.07] pt-6 sm:grid-cols-3">

            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Wallet size={15} />
                Project budget
              </div>
              <p className="mt-2 font-semibold">
                ₹{budgetMin.toLocaleString("en-IN")} – ₹
                {budgetMax.toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <CalendarDays size={15} />
                Deadline
              </div>
              <p className="mt-2 font-semibold">
                {formatDate(deadline)}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Clock3 size={15} />
                Bidding closes
              </div>
              <p className="mt-2 font-semibold">
                {formatDate(biddingEndsAt)}
              </p>
            </div>

          </div>
        </section>

        {/* PROPOSAL FORM */}
        {isOpen ? (
          <section className="rounded-2xl border border-white/[0.07] bg-[#111113] p-6 sm:p-8">

            <div className="mb-8">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-400">
                Your application
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                Submit your proposal
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Explain your approach and make an offer for this project.
              </p>
            </div>

            {/* Bid amount */}
            <div className="mb-7">
              <label className="mb-3 block text-sm font-medium">
                Your bid amount
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                  ₹
                </span>

                <Input
                  type="number"
                  min={budgetMin}
                  max={budgetMax}
                  placeholder="Enter your price"
                  value={bid}
                  onChange={(e) => setBid(e.target.value)}
                  className="h-12 border-zinc-700 bg-black pl-9 text-white placeholder:text-zinc-600 focus-visible:ring-emerald-500"
                />
              </div>

              <p className="mt-2 text-xs text-zinc-500">
                Budget: ₹{budgetMin.toLocaleString("en-IN")} – ₹
                {budgetMax.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Delivery days */}
            <div className="mb-8">
              <label className="mb-3 block text-sm font-medium">
                Estimated delivery time
              </label>

              <div className="relative">
                <Input
                  type="number"
                  min="1"
                  placeholder="Number of days"
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                  className="h-12 border-zinc-700 bg-black pr-16 text-white placeholder:text-zinc-600 focus-visible:ring-emerald-500"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                  Days
                </span>
              </div>
            </div>

            {/* Cover letter */}
            <div className="mb-7">
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium">
                  Your proposal
                </label>

                <span className="text-xs text-zinc-500">
                  {proposal.length}/2000
                </span>
              </div>

              <Textarea
                value={proposal}
                onChange={(e) => setProposal(e.target.value.slice(0, 2000))}
                maxLength={2000}
                placeholder="Introduce yourself, explain your understanding of the project, and describe how you plan to deliver it..."
                className="min-h-[220px] resize-y border-zinc-700 bg-black p-4 text-sm leading-7 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-emerald-500"
              />

              <p className="mt-2 text-xs text-zinc-500">
                Minimum 100 characters. Write a personalized proposal.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-900 bg-red-950/30 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Live offer preview */}
            <div className="mb-6 flex items-center justify-between rounded-xl border border-white/[0.07] bg-black p-4">
              <div>
                <p className="text-xs text-zinc-500">Your offer</p>
                <p className="mt-1 text-lg font-semibold text-emerald-400">
                  {bid ? `₹${Number(bid).toLocaleString("en-IN")}` : "₹ —"}
                </p>
              </div>

              <p className="text-xs text-zinc-500">
                {deliveryDays ? `${deliveryDays} days delivery` : "No timeline"}
              </p>
            </div>

            {/* Submit */}
            <div>
              {Userrole === "CLIENT" ? <Button
              disabled={loading}
              className="h-12 w-full bg-red-500 text-sm font-semibold text-black hover:bg-red-400 disabled:opacity-50"
            >
              You are not able to  apply
              {<ArrowUpRight size={17} />}
            </Button> : 
              <Button
              onClick={submitBid}
              disabled={loading}
              className="h-12 w-full bg-emerald-500 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit proposal"}
              {!loading && <ArrowUpRight size={17} />}
            </Button>
              }
            </div>

            <p className="mt-4 text-center text-xs text-zinc-600">
              Review your offer before submitting.
            </p>

          </section>
        ) : (
          <div className="rounded-2xl border border-white/[0.07] bg-[#111113] p-6 text-center">
            <p className="text-sm text-zinc-400">
              This project is no longer accepting proposals.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}
