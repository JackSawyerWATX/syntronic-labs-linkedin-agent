import OpenAI from "openai";
import { linkedinSystemPrompt } from "../prompts/linkedin.prompt.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateLinkedInPost(topic) {
  const response = await openai.responses.create({
    model: "gpt-5.6",
    instructions: linkedinSystemPrompt,
    input: `
Create a LinkedIn Company Page post for Syntronic Labs.

Today's topic:
${topic}
`,
  });

  return response.output_text;
}