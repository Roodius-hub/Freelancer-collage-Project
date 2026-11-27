
import MyPostedJobs from "@/components/client/MyPostedJobs";

export default function ClientJobsPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            My Posted Jobs
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Manage your jobs and review freelancer applications.
          </p>
        </div>

        <MyPostedJobs />
      </div>
    </main>
  );
}
