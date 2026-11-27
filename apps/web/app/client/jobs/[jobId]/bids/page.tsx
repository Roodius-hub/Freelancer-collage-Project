
import MyPostedJobBids from "@/components/client/MyPostedJobBids";

export default function JobBidsPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-2xl font-bold">
          Job Applications
        </h1>

        <p className="mb-8 mt-2 text-sm text-zinc-400">
          Review and compare freelancers who applied for your job.
        </p>

        <MyPostedJobBids />

      </div>
    </main>
  );
}
