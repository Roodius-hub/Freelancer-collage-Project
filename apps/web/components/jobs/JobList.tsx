
"use client"
import  JobCard from "./JobCard"; 
import {useJobs} from "../../hooks/useJobs";
// import { jobs } from "@/dummy/dummy";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Joblist() {
      // const {jobs} = useJobs();  
    const [jobs, SetJobs] = useState<any[]>([]);

    useEffect(() => {
      const getJobs = async () => {
        try {
          const response = await axios.get("http://localhost:3001/jobs/alljobs");
          console.log(response.data);
          SetJobs(response.data.jobs);
        } catch (err) {
          console.log(err);
        }
    }
    getJobs();
    },[])
      
    return (    
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job: any) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
        </div>
    )
}