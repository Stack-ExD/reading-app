import { NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

export async function POST(req: Request) {
  try {
    const { passage } = await req.json();
    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "system",
          content: `You are a teacher. Generate 3 reading comprehension questions based on the provided text. Some questions should give the user a reason
          to remember what they have read instead of just reciting lines from the passage.
        Return ONLY a Raw JSON object with the following format:
        {
          "questions": [
            {
          "id": 1,
              "question": "Question text here",
            },
            {
            "id": 2,
              "question": "Question text here",

            },
            {
            "id": 3,
              "question": "Question text here",

            }
          ]
        }`,
        },
        {
          role: "user",
          content: passage,
        },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content || "{}";

    // Clean up content if it contains markdown code blocks
    const cleanContent = (content as string)
      .replace(/```json\n?|```/g, "")
      .trim();

    let parsedContent;
    try {
      parsedContent = JSON.parse(cleanContent);
    } catch (e) {
      console.error("Failed to parse JSON:", cleanContent);
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 500 },
      );
    }
    return NextResponse.json(
      parsedContent.questions || "Failed to generate questions",
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 },
    );
  }
}
