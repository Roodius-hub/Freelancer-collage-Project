
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { useSession } from "next-auth/react";


type JobCardProps = {
  id: string;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  biddingEndsAt: string;
  status?: string;
  clientId:string;
};

export default function JobCard(job: JobCardProps) {
  const router = useRouter();

  const {data:session, status} = useSession();
  
    if(status === "loading") return null;
  
    const Userrole = session?.user?.role;
    console.log(Userrole)

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

  const isOpen = (job.status ?? "OPEN").toUpperCase() === "OPEN";

  return (
  <Card
  onClick={() => {
    if (isOpen) router.push(`/apply/${job.id}`);
  }}
  className={`group relative h-[210px] cursor-pointer  overflow-hidden rounded-2xl !border-0 !ring-0 bg-[#101012] text-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:!border-0 hover:!ring-0 hover:bg-[#151517] hover:shadow-[0_12px_35px_rgba(0,0,0,0.4)] ${
    !isOpen ? "cursor-not-allowed opacity-60" : ""
  }`}
>
      {/* Hover glow */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-emerald-500/[0.04] blur-3xl transition-all duration-500 group-hover:bg-emerald-500/[0.12]" />

      <CardContent className="relative flex h-full flex-col justify-between p-5 sm:p-6">

        {/* Job title and status */}
        <div className="-mt-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="line-clamp-1 text-base font-semibold tracking-tight text-zinc-100 transition-colors duration-200 group-hover:text-white">
              {job.title}
            </h2>

            <span
              className={`h-2 w-2 shrink-0 rounded-full transition-shadow duration-300 ${
                isOpen
                  ? "bg-emerald-400 group-hover:shadow-[0_0_10px_#34d399]"
                  : "bg-zinc-600"
              }`}
            />
          </div>

          {/* Budget */}
          <p className="mt-2 text-sm font-medium tracking-wide text-zinc-400">
            ₹{job.budgetMin.toLocaleString("en-IN")}
            <span className="mx-1.5 text-zinc-600">–</span>
            ₹{job.budgetMax.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Bottom section */}
        <div className="flex items-end justify-between gap-4 border-t border-zinc-800/80 pt-7">

          {/* Dates */}
          <div className="min-w-0 space-y-2">
            <div className="grid grid-cols-[100px_1fr] items-center gap-2 text-xs">
              <span className="text-zinc-500">Deadline</span>
              <span className="whitespace-nowrap text-zinc-300">
                {formatDate(job.deadline)}
              </span>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center gap-2 text-xs">
              <span className="text-zinc-500">Bidding closes</span>
              <span className="whitespace-nowrap text-zinc-300">
                {formatDate(job.biddingEndsAt)}
              </span>
            </div>
          </div>

          {/* Action */}
          <div
  className={`flex shrink-0 items-center gap-1.5 pb-0.5 text-xs font-semibold transition-all duration-200 ${
    isOpen
      ? "text-zinc-400 group-hover:translate-x-1 group-hover:text-emerald-400"
      : "text-zinc-600"
  }`}
>
  {Userrole === "FREELANCER" && isOpen ? (
    <button
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/apply/${job.id}`);
      }}
      className="flex items-center gap-1.5"
    >
      Apply Now
      <ArrowUpRight size={15} />
    </button>
  ) : Userrole === "CLIENT" && isOpen ? (
    <>
      View project
      <ArrowUpRight size={15} />
    </>
  ) : (
    <>
      Closed
      <ArrowUpRight size={15} />
    </>
  )}
</div>
        </div>
      </CardContent>
    </Card>
  );
}
