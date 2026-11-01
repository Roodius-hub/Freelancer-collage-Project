"use client"
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

// import { jobs } from "@/dummy/dummy";
import Applyform from "@/components/forms/ApplyForm";
import { useParams } from "next/navigation";
import axios from "axios";

export default function Apply() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) {
      setLoading(false);
      return;
    }

    const getJob = async () => {
      try {
        console.log("Job ID:", jobId);

        const response = await axios.get(
          `http://localhost:3001/jobs/getjobs/${jobId}`,
          {
            withCredentials: true,
          }
        );

        console.log("Job data:", response.data);

        setJob(response.data.job);

      } catch (error) {
        console.error("Error fetching job:", error);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    getJob();
  }, [jobId]);

  if (loading) {
    return <div className="p-10 text-center text-zinc-400">Loading job...</div>;
  }

  if (!job) {
    return <div className="p-10 text-center text-white">Job not found.</div>;
  }


  return (
    <div>
      <Applyform
        jobId={job.id}
        title={job.title}
        description={job.description}
        budgetMin={job.budgetMin}
        budgetMax={job.budgetMax}
        deadline={job.deadline}
        biddingEndsAt={job.biddingEndsAt}
        status={job.status}
        createdAt={job.createdAt}
        updatedAt={job.updatedAt}
        clientId={job.clientId}
      />
    </div>

  )
}