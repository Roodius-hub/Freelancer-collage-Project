
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  CalendarDays,
  IndianRupee,
  Users,
  ArrowRight,
} from "lucide-react";
import api from "@/lib/axios";

interface Job {
  id: string;
  title: string;
  description: string;
  budgetMax: number;
  budgetMin: number;
  status: string;
  createdAt: string;
  deadline?: string;
  _count: {
    bids: number;
  };
}

export default function MyPostedJobs() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("jobs/my-jobs");

      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setError("Unable to load your posted jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "IN_PROGRESS":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "COMPLETED":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-44 animate-pulse rounded-xl border border-white/10 bg-zinc-900/50"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
        <p className="text-sm text-red-400">{error}</p>
        <button
          onClick={fetchMyJobs}
          className="mt-3 text-sm text-white underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-zinc-900/50 px-6 py-16 text-center">
        <BriefcaseBusiness className="mx-auto mb-4 size-10 text-zinc-600" />
        <h3 className="text-lg font-semibold text-white">
          No jobs posted yet
        </h3>
        <p className="mt-2 text-sm text-zinc-400">
          Your posted jobs will appear here.
        </p>
        <button
          onClick={() => router.push("/postjob")}
          className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm text-white transition hover:bg-indigo-500"
        >
          Post a Job
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="rounded-xl border border-white/10 bg-[#111318] p-6 transition hover:border-white/20"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-white">
                {job.title}
              </h3>

              <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">
                {job.description}
              </p>
            </div>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                job.status
              )}`}
            >
              {job.status.replace("_", " ")}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/[0.08] pt-4">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <IndianRupee className="size-4" />
              {job.budgetMin} -  {job.budgetMax} 
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Users className="size-4" />
              {job._count.bids} Bids
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <CalendarDays className="size-4" />
              {new Date(job.createdAt).toLocaleDateString()}
            </div>
          </div>

          {job.status === "OPEN" && (
            <div className="mt-5 flex justify-end">
              <button
                onClick={() =>
                  router.push(`/client/jobs/${job.id}/bids`)
                }
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
              >
                View All Bids
                <ArrowRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
