"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

type NotificationBid = {
  id: string;
  amount: number;
  proposal: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";

  freelancer?: {
    id: string;
    name: string;
    picture: string;
  };

  job: {
    id: string;
    title: string;
    status: "OPEN" | "ASSIGNED" | "COMPLETED" | "CANCELLED";
  };
};

export function NotificationButton() {
  const [bids, setBids] = useState<NotificationBid[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);

  const { data: session, status } = useSession();
  const userRole = session?.user?.role;

  // Close notification panel when clicking outside
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

  // Fetch notifications according to role
  useEffect(() => {
    if (status !== "authenticated" || !userRole) return;

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/bids/notifications-bids",
          { withCredentials: true }
        );
        console.log(response.data)
        setBids(response.data.notifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, [userRole, status]);

  if (status === "loading") return null;

  return (
    <div
      ref={notificationRef}
      className="relative"
      onMouseLeave={() => {
        if (!isPinned) setIsOpen(false);
      }}
    >
      {/* Bell button */}
      <button
        onClick={() => {
          setIsPinned(true);
          setIsOpen(!isOpen);
        }}
        className="relative rounded-full p-2 hover:bg-white/5"
      >
        <Bell size={20} />

        {bids.length > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500" />
        )}
      </button>

      {/* Notification popover */}
      <div
        className={`
          absolute right-0 top-full z-50 mt-3
          w-80 rounded-xl border border-white/10
          bg-zinc-950 shadow-xl
          transition-all duration-200
          ${
            isOpen
              ? "visible opacity-100"
              : "invisible pointer-events-none opacity-0"
          }
        `}
      >
        <div className="flex items-center justify-between p-4">
          <h3 className="font-semibold">Notifications</h3>
          <span className="text-xs text-zinc-500">
            {bids.length} updates
          </span>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {bids.length === 0 ? (
            <p className="p-5 text-center text-sm text-zinc-500">
              No notifications yet.
            </p>
          ) : (
            bids.map((item) => (
              <NotificationItem
                key={item.id}
                id={item.id}
                role={userRole}
                jobTitle={item.job.title}
                status={item.status}
                freelancerName={item.freelancer?.name}
                amount={item.amount}
              />
            ))
          )}
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
  role,
  jobTitle,
  status,
  freelancerName,
  amount,
}: {
  id: string;
  role: string;
  jobTitle: string;
  status: string;
  freelancerName?: string;
  amount: number;
}) {
  const isFreelancer = role === "FREELANCER";

  return (
    <Link
      href={`/notifications/${id}`}
      className="block border-t border-white/5 p-4 transition-colors hover:bg-white/5"
    >
      <h4 className="text-sm font-medium">
        {isFreelancer
          ? status === "ACCEPTED"
            ? "Your bid was accepted!"
            : "Your bid was not selected"
          : `New bid from ${freelancerName ?? "Freelancer"}`}
      </h4>

      <p className="mt-1 text-xs text-zinc-400">
        Job: {jobTitle}
      </p>

      <p className="mt-1 text-xs text-zinc-500">
        Bid amount: ₹{amount.toLocaleString("en-IN")}
      </p>

      <p
        className={`mt-2 text-xs font-medium ${
          status === "ACCEPTED"
            ? "text-green-400"
            : status === "REJECTED"
              ? "text-red-400"
              : "text-yellow-400"
        }`}
      >
        {status}
      </p>
    </Link>
  );
}