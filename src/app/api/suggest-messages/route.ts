import { openai } from '@ai-sdk/openai';
import { streamText, StreamData } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// const openAI = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
// })

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
  
    const data = new StreamData();
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '|'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? | | If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."
  
    const result = await streamText({
      model: openai('gpt-4-turbo-instruct'),
      maxTokens: 400,
      messages,
      onFinish() {
        data.close();
      },
      prompt,
    });
  
    return result.toAIStreamResponse({ data });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
        const {name, status, headers, message} = error
        return NextResponse.json({
            name, status, headers, message
        }, {status})
    } else {
        
    }
    console.error("Unexpected Error", error);
    throw error
  }
}