import axios from "axios";
import {
   MapPin,
  UserRound,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  Mail,
  Phone,
  Clock,
  Star,
  BadgeCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

function ClientInformation({ client, loading }: {
  client: any;
  loading: boolean;
}) {

    console.log(client);
  const formatMemberDate = (date?: string) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <aside className="rounded-2xl border border-white/[0.07] bg-[#111113] p-6">
        <p className="text-sm text-zinc-500">Loading client...</p>
      </aside>
    );
  }

  if (!client) {
    return (
      <aside className="rounded-2xl border border-white/[0.07] bg-[#111113] p-6">
        <p className="text-sm text-zinc-500">
          Client information unavailable.
        </p>
      </aside>
    );
  }

  const address = Array.isArray(client.address)
    ? client.address[0]
    : client.address;

  const rating = client.averageRating ?? client.rating;
  const reviewCount = client.reviewCount ?? client.reviews?.length ?? 0;

  const verificationItems = [
    { label: "Identity verified", verified: client.identityVerified, icon: BadgeCheck },
    { label: "Payment verified", verified: client.paymentVerified, icon: ShieldCheck },
    { label: "Deposit made", verified: client.depositMade, icon: CreditCard },
    { label: "Email verified", verified: client.emailVerified, icon: Mail },
    { label: "Phone verified", verified: client.phoneVerified, icon: Phone },
  ];

  const verifiedItems = verificationItems.filter(
    (item) => item.verified === true
  );

  return (
    <aside className="rounded-2xl border border-white/[0.07] bg-[#111113] p-6">

      {/* Heading */}
      <h2 className="text-lg font-semibold text-white">
        About the Client
      </h2>

      {/* Client details */}
      <div className="mt-6 space-y-4">

        <div className="flex items-center gap-3 text-sm text-zinc-300">
          <MapPin size={17} className="shrink-0 text-zinc-400" />
          {address?.city || "Location not provided"}
        </div>

        <div className="flex items-center gap-3 text-sm text-zinc-300">
          <MapPin size={17} className="shrink-0 text-zinc-400" />
          {address?.country || "Country not provided"}
        </div>

        {/* Rating */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <UserRound size={17} className="text-zinc-400" />

          <div className="flex items-center gap-0.5 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                fill={
                  rating && star <= Math.round(Number(rating))
                    ? "currentColor"
                    : "none"
                }
              />
            ))}
          </div>

          <span className="text-zinc-300">
            {rating != null ? Number(rating).toFixed(1) : "New"}
          </span>

          <MessageSquare size={16} className="ml-2 text-zinc-500" />
          <span className="text-zinc-400">{reviewCount}</span>
        </div>

        {/* Member since */}
        <div className="flex items-center gap-3 text-sm text-zinc-300">
          <Clock size={17} className="shrink-0 text-zinc-400" />
          Member since {formatMemberDate(client.createdAt)}
        </div>

      </div>

      {/* Client engagement */}
      <div className="mt-8 border-t border-white/[0.07] pt-6">
        <h3 className="text-sm font-semibold text-white">
          Client Engagement
        </h3>

        <p className="mt-3 text-sm leading-6 text-zinc-500">
          Client engagement statistics are not available yet.
        </p>
      </div>

      {/* Verification */}
      <div className="mt-7">
        <h3 className="text-sm font-semibold text-white">
          Client Verification
        </h3>

        <div className="mt-4 space-y-4">
          {verifiedItems.length > 0 ? (
            verifiedItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 text-sm text-zinc-300"
                >
                  <Icon size={17} className="shrink-0 text-emerald-400" />
                  {item.label}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-zinc-500">
              No verification information available.
            </p>
          )}

          {/* Profile completion */}
          <div className="flex items-center gap-3 text-sm text-zinc-300">
            <UserRound size={17} className="text-zinc-400" />
            {client.bio && client.name && client.email
              ? "Profile information provided"
              : "Profile incomplete"}
          </div>
        </div>
      </div>

    </aside>
  );
}

export default ClientInformation;