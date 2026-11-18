import Link from "next/link";
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BIDS_TYPE } from "@/Types/types";

export function NotificationButton() {
    const [bids, SetBids] = useState<BIDS_TYPE[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isPinned, setIsPinned] = useState(false);

    // Ref Hook  For persistence Opening Of Notification pannel
    const notificationRef = useRef<HTMLDivElement>(null);
    
      // Close when clicking outside
      useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
          if (
            notificationRef.current &&
            !notificationRef.current.contains(event.target as Node)
          ) {
            setIsOpen(false);
            setIsPinned(false);
          }
        }
    
        document.addEventListener("mousedown", handleOutsideClick);
    
        return () => {
          document.removeEventListener("mousedown", handleOutsideClick);
        };
      }, []);
    
    useEffect(() => {
        console.log("useEffecRuns");
        const  fetchBids = async () => {
            try {
                const response = await axios.get("http://localhost:3001/bids/notifications-bids", { withCredentials: true });
                console.log(response.data.notifications);
                SetBids(response.data.notifications);
            } catch (error) {
                console.log(error);
            }
        } 
        fetchBids();
    }, [isOpen])
    
  return (
    <div
         ref={notificationRef}
         className="relative"
         onMouseLeave={() => {
           if (!isPinned) {
             setIsOpen(false);
           }
         }}
       >
         {/* Bell button */}
         <button
           onClick={() => {
             setIsPinned(true);
             setIsOpen(true);
           }}
           className="relative rounded-full p-2 hover:bg-white/5"
         >
           <Bell size={20} />
   
           <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500" />
         </button>
   
         {/* Popover */}
         <div
           className={`
             absolute right-0 top-full z-50 mt-3
             w-80 rounded-xl border border-white/10
             bg-zinc-950 shadow-xl
             transition-all duration-200
             ${
               isOpen
                 ? "visible opacity-100"
                 : "invisible opacity-0 pointer-events-none"
             }
           `}
         >
           <div className="flex items-center justify-between p-4">
             <h3 className="font-semibold">Notifications</h3>
   
             <button className="text-xs text-zinc-400">
               Mark all as read
             </button>
           </div>
   
           <div className="max-h-96 overflow-y-auto">
                  {bids.map((item, i) => (
                      <div key={i}>
                        <NotificationItem
                          id={item.id}
                          title={item.proposal}
                          amount={item.amount}
                        />
                 </div>
             ))}
           </div>
   
           <Link
             href="/notifications"
             className="block border-t border-white/10 p-3 text-center text-sm"
           >
             View all notifications
           </Link>
         </div>
       </div>
  );
}

function NotificationItem({
  id,
  title,
  amount,
}: {
  id: string;
  title: string;
  amount: number;
}) {
  return (
    <Link
      href={`/notifications/${id}`}
      className="block p-4 transition-colors hover:bg-white/5"
    >
      <h4 className="text-sm font-medium">{title}</h4>
      <p className="mt-1 text-xs text-zinc-400">
        {amount}
      </p>
    </Link>
  );
}