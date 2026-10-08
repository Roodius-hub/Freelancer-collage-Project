
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
        <div className="px-10 py-10 max-w-7xl mx-auto overflow-visible">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobs.map((job: any) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
        </div>
    )
}