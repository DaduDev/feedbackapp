import { openai } from '@ai-sdk/openai';
import { streamText, StreamData } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
  
    const data = new StreamData();
    const prompt = ""
  
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