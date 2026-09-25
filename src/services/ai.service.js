import OpenAI from "openai";
import { linkedinSystemPrompt } from "../prompts/linkedin.prompt.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateLinkedInPost(
  topic,
  category = null,
  recentPosts = []
) {
  const history = recentPosts.length
    ? recentPosts
        .map(
          (post, index) => `
RECENT POST ${index + 1}

Topic: ${post.topic}
Category: ${post.category || "Uncategorized"}

Content:
${post.content}
`
        )
        .join("\n---\n")
    : "There are no previous posts yet.";

  const response = await openai.responses.create({
    model: "gpt-5.6-luna",
    instructions: linkedinSystemPrompt,

    input: `
Create a new LinkedIn Company Page post for Syntronic Labs.

TODAY'S ASSIGNMENT

Topic:
${topic}

Category:
${category || "General"}

RECENT POST HISTORY

${history}

IMPORTANT:

Use the recent posts only to understand what Syntronic Labs
has already discussed.

Do not copy their wording, structure, opening, examples,
bullet points, conclusion, or central argument.

The new post must provide substantially different value.

If today's topic overlaps with a recent post, approach it
from a meaningfully different angle rather than paraphrasing
the previous post.

Return only the finished LinkedIn post.
`,
  });

  return response.output_text;
}