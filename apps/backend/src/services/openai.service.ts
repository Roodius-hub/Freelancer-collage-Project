import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});


interface ProposalInput {
  bidId: string;
  proposal: string | null;
  amount: number;
  deliveryDays: number | null;
}

interface JobInput {
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: Date;
}

export const evaluateProposals = async (
  job: JobInput,
  bids: ProposalInput[]
) => {
  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-120b",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
You are an objective freelancer proposal evaluator.

Evaluate each proposal against the job requirements.

Consider:
1. Relevance to the job requirements.
2. Clarity of the proposed approach.
3. Understanding of expected deliverables.
4. Realism of the proposed timeline.
5. Budget suitability.

Rules:
- Evaluate only information provided in the job and bid.
- Never invent freelancer qualifications, experience, or achievements.
- Do not reward proposal length by itself.
- A missing proposal should receive a very low score.
- Do not automatically favor the cheapest bid.
- Scores must be between 0 and 100.
- Include a brief explanation and strengths and weaknesses.
- Return every bid exactly once, identified by its bidId.

Return valid JSON in this format:
{
  "evaluations": [
    {
      "bidId": "bid_id",
      "score": 85,
      "explanation": "Brief evaluation",
      "strengths": ["Strength 1"],
      "weaknesses": ["Weakness 1"]
    }
  ]
}
        `,
      },
      {
        role: "user",
        content: JSON.stringify({
          job: {
            title: job.title,
            description: job.description,
            budgetMin: job.budgetMin,
            budgetMax: job.budgetMax,
            deadline: job.deadline.toISOString(),
          },
          bids,
        }),
      },
    ],
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty evaluation.");
  }

  const parsed = JSON.parse(content);

  return parsed.evaluations;
};


export default openai;