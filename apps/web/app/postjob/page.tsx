"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostJob() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    bids: "",
    deadline: "",
    biddingEndsAt: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData);

    try {
       const response  = await axios.post("http://localhost:3001/jobs/create", formData ,{
        withCredentials: true
       })

       console.log(response.data);
       
       if (response.status == 200) {
          router.push("/")
       } 
    } catch (err) {
      console.log(err);
    }

  };

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white ">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">
            Post a Job
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Tell freelancers what you need and set your budget.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Title */}
          <Input
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={7}
              placeholder="Describe what you need..."
              className="w-full resize-none rounded-lg border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="mb-3 block text-sm font-medium text-zinc-300">
              Budget
            </label>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Minimum (INR)"
                name="budgetMin"
                type="number"
                value={formData.budgetMin}
                onChange={handleChange}
              />

              <Input
                label="Maximum (INR)"
                name="budgetMax"
                type="number"
                value={formData.budgetMax}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Number of bids */}
          <Input
            label="Maximum Bids (Enter Numbers of max bids)"
            name="bids"
            type="number"
            value={formData.bids}
            onChange={handleChange}
          />

          {/* Dates */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Deadline & Time
              </label>

              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Bidding Ends At & Time
              </label>

              <input
                type="datetime-local"
                name="biddingEndsAt"
                value={formData.biddingEndsAt}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700"
              />
            </div>

          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full rounded-lg bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              Post Job
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}


function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  icon,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-3.5 text-zinc-600">
            {icon}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full rounded-lg border border-zinc-800 bg-black py-3 pr-4 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700 ${
            icon ? "pl-10" : "px-4"
          }`}
        />
      </div>
    </div>
  );
}