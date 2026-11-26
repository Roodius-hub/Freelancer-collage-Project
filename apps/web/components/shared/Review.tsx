
"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";

interface ReviewFormProps {
  onSubmit: (data: { rating: number; comment: string }) => Promise<void>;
  alreadyReviewed: boolean;
}

export default function ReviewForm({
  onSubmit,
  alreadyReviewed,
}: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleSubmit = async () => {
    if (!comment.trim()) {
      setError("Please write a review.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await onSubmit({
        rating,
        comment: comment.trim(),
      });
      // console.log(res.data);
      setComment("");
    } catch (error) {
      console.error("Review submission error:", error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
          `Request failed: ${error.response?.status || "Network error"}`
        );
      } else {
        setError("Something went wrong while submitting your review.");
      }
    } finally {
      setLoading(false);
    }
  };


  if (alreadyReviewed) {
    return (
      <p className="text-sm text-zinc-500">
        You have already reviewed this client.
      </p>
    );
  }

  return (
    <div className="mt-7 border-t border-white/[0.07] pt-6">
      <h3 className="text-sm font-semibold text-white">
        Write a Review
      </h3>

      <p className="mt-1 text-xs text-zinc-500">
        Share your experience working with this client.
      </p>

      <div className="mt-4 flex gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            aria-label={`Rate ${value} stars`}
          >
            <Star
              size={22}
              className={
                value <= rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-zinc-600"
              }
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your experience..."
        rows={4}
        className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-[#18181b] p-3 text-sm text-white outline-none focus:border-indigo-500"
      />

      {error && (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !comment.trim()}
        className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}
