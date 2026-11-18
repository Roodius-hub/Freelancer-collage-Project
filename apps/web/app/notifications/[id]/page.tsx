"use client";


import { useEffect, useState } from "react"
import { BIDS_TYPE } from "@/Types/types";
import axios from "axios";
import { useParams } from "next/navigation";
import BidDetails from "@/components/notifications/BidDetails";


export default  function NotificationDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const { id } = useParams();
    
    const [bids_data, SetBids] = useState<BIDS_TYPE[]>([]);
  // Fetch notification from database using id
  useEffect(() => {
      console.log("useEffecRuns");
      const  fetchBids = async () => {
          try {
              const response = await axios.get(`http://localhost:3001/bids/get-bids/${id}`, { withCredentials: true });
              console.log(response.data.biding);
              SetBids(response.data.biding);
          } catch (error) {
              console.log(error);
          }
      } 
      fetchBids();
  }, [])
    
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">
        Notification Details
      </h1>
        <BidDetails bid={bids_data}/>
    </main>
  );
}

