
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
    UserRound,
    IndianRupee,
    CalendarDays,
    Star,
    BriefcaseBusiness,
    ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

interface Freelancer {
    id: string;
    name: string;
    picture?: string | null;
    experience?: number;
    rating?: number;
}

interface Bid {
    id: string;
    proposal: string;
    amount: number;
    deliveryDays: number | null;
    status: string;
    freelancer: Freelancer;
    createdAt: string;
}

type SortOption = "best" | "experienced" | "proposal";

interface ProposalEvaluation {
    bidId: string;
    score: number;
    explanation: string;
    strengths: string[];
    weaknesses: string[];
}


export default function MyPostedJobBids() {
    const params = useParams();
    const router = useRouter();

    const jobId = params.jobId as string;

    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [evaluations, setEvaluations] = useState<ProposalEvaluation[]>([]);
    const [evaluating, setEvaluating] = useState(false);
    const [evaluationError, setEvaluationError] = useState("");
    const [sortOption, setSortOption] = useState<SortOption>("best");


    const sortedBids = useMemo(() => {
        const result = [...bids];

        switch (sortOption) {
            case "best":
                return result.sort(
                    (a, b) =>
                        (b.freelancer.rating ?? 0) -
                        (a.freelancer.rating ?? 0)
                );

            case "experienced":
                return result.sort(
                    (a, b) =>
                        (b.freelancer.experience ?? 0) -
                        (a.freelancer.experience ?? 0)
                );

            case "proposal":
                return result.sort(
                    (a, b) => b.proposal.length - a.proposal.length
                );

            default:
                return result;
        }
    }, [bids, sortOption]);

    const fetchBids = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/bids/${jobId}/bids`);

            setBids(response.data.bids || []);
        } catch (error) {
            console.error("Failed to fetch job bids:", error);
            setError("Unable to load bids for this job.");
        } finally {
            setLoading(false);
        }
    };

    const handleEvaluateProposals = async () => {
  try {
    setEvaluating(true);
    setEvaluationError("");

    const response = await api.post(
      `/bids/${jobId}/evaluate`
    );

    setEvaluations(response.data.evaluations || []);
  } catch (error) {
    console.error("Proposal evaluation failed:", error);
    setEvaluationError("Unable to evaluate proposals. Please try again.");
  } finally {
    setEvaluating(false);
  }
};

    useEffect(() => {
        if (jobId) {
            fetchBids();
        }
    }, [jobId]);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="h-48 animate-pulse rounded-xl border border-white/10 bg-zinc-900/50"
                    />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                <p className="text-sm text-red-400">{error}</p>

                <button
                    onClick={fetchBids}
                    className="mt-4 text-sm text-white underline"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (bids.length === 0) {
        return (
            <div className="rounded-xl border border-white/10 bg-zinc-900/50 px-6 py-16 text-center">
                <UserRound className="mx-auto mb-4 size-10 text-zinc-600" />

                <h3 className="text-lg font-semibold text-white">
                    No bids received yet
                </h3>

                <p className="mt-2 text-sm text-zinc-400">
                    Freelancer applications for this job will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Evaluation / Sorting controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-zinc-400">
                    {bids.length} applications received
                </p>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSortOption("best")}
                        className={`rounded-lg px-4 py-2 text-xs transition ${sortOption === "best"
                                ? "bg-indigo-500 text-white"
                                : "border border-white/10 text-zinc-400 hover:bg-white/5"
                            }`}
                    >
                        Best Freelancer
                    </button>

                    <button
                        onClick={() => setSortOption("experienced")}
                        className={`rounded-lg px-4 py-2 text-xs transition ${sortOption === "experienced"
                                ? "bg-indigo-500 text-white"
                                : "border border-white/10 text-zinc-400 hover:bg-white/5"
                            }`}
                    >
                        Most Experienced
                    </button>

                    <button
                        onClick={() => setSortOption("proposal")}
                        className={`rounded-lg px-4 py-2 text-xs transition ${sortOption === "proposal"
                                ? "bg-indigo-500 text-white"
                                : "border border-white/10 text-zinc-400 hover:bg-white/5"
                            }`}
                    >
                        Best Proposal
                    </button>
                </div>
            </div>

            {/* Bid cards */}
            {sortedBids.map((bid) => (
                <div
                    key={bid.id}
                    className="rounded-xl border border-white/10 bg-[#111318] p-6 transition hover:border-white/20"
                >
                    {evaluations.length > 0 &&
  (() => {
    const evaluation = evaluations.find(
      (item) => item.bidId === bid.id
    );

    if (!evaluation) return null;

    return (
      <div className="mb-5 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-indigo-300">
            AI Proposal Evaluation
          </h4>

          <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-sm font-semibold text-indigo-300">
            {evaluation.score}/100
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-zinc-300">
          {evaluation.explanation}
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold text-green-400">
              Strengths
            </p>

            {evaluation.strengths.map((strength, index) => (
              <p key={index} className="mb-1 text-xs text-zinc-400">
                + {strength}
              </p>
            ))}
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-red-400">
              Weaknesses
            </p>

            {evaluation.weaknesses.map((weakness, index) => (
              <p key={index} className="mb-1 text-xs text-zinc-400">
                - {weakness}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  })()}
                    {/* Freelancer details */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-indigo-500/10 text-indigo-400">
                                {bid.freelancer.picture ? (
                                    <img
                                        src={bid.freelancer.picture}
                                        alt={bid.freelancer.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <UserRound size={22} />
                                )}
                            </div>

                            <div>
                                <h3 className="font-semibold text-white">
                                    {bid.freelancer.name}
                                </h3>

                                <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                                    {bid.freelancer.rating !== undefined && (
                                        <span className="flex items-center gap-1">
                                            <Star className="size-3 fill-amber-400 text-amber-400" />
                                            {bid.freelancer.rating}
                                        </span>
                                    )}

                                    {bid.freelancer.experience !== undefined && (
                                        <span className="flex items-center gap-1">
                                            <BriefcaseBusiness className="size-3" />
                                            {bid.freelancer.experience} years experience
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                            {bid.status}
                        </span>
                    </div>

                    {/* Bid information */}
                    <div className="mt-5 flex flex-wrap gap-6 border-y border-white/[0.08] py-4">
                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                            <IndianRupee className="size-4 text-zinc-500" />
                            {bid.amount}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                            <CalendarDays className="size-4 text-zinc-500" />
                            {bid.deliveryDays} days
                        </div>
                    </div>

                    {/* Proposal */}
                    <div className="mt-5">
                        <h4 className="mb-2 text-sm font-semibold text-white">
                            Freelancer Proposal
                        </h4>

                        <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-400">
                            {bid.proposal}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex justify-end">
                        <button
                            onClick={() =>
                                router.push(`/freelancer/${bid.freelancer.id}`)
                            }
                            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                        >
                            View Freelancer
                        </button>
                    </div>
                </div>
            ))}
            <div className="flex flex-wrap items-center gap-3">
  <button
    onClick={handleEvaluateProposals}
    disabled={evaluating || bids.length === 0}
    className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {evaluating ? (
      <>
        <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        Evaluating Proposals...
      </>
    ) : (
      <>
        <Star className="size-4" />
        AI Best Proposal
      </>
    )}
  </button>

  {evaluationError && (
    <p className="text-xs text-red-400">
      {evaluationError}
    </p>
  )}
</div>
        </div>
    );
}
