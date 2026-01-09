import { NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

export async function POST(req: Request) {
  try {
    const { passage, questions, userAnswers } = await req.json();

    const prompt = `Passage: "${passage}"
    Questions and Answers:
    ${JSON.stringify(
      questions.map((q: { question: string; id: number }) => ({
        question: q.question,
        answer: userAnswers[q.id] || "No answer provided",
      }))
    )}
    
    Evaluate the user's answers. If the answers are wrong explain why.
    
    Return ONLY a Raw JSON object with the following format:
    {
      "score": count of correct answers,
      "total": total number of questions,
      "feedback": "Some feedback here"
    }`;

    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "system",
          content: "You are a helpful teaching assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0,
    });

    const content = response.choices[0].message.content || "{}";

    // Clean up content if it contains markdown code blocks
    const cleanContent = content.replace(/```json\n?|```/g, "").trim();

    let parsedContent;
    try {
      parsedContent = JSON.parse(cleanContent);
    } catch (e) {
      console.error("Failed to parse JSON:", cleanContent);
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedContent);
  } catch (error) {
    console.error("Evaluation Error:", error);
    return NextResponse.json({
      error: "Evaluation Error",
      status: 500,
    });
  }
}
