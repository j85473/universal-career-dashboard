import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { deepseekApiKey, apifyApiKey, rapidApiKey, serpApiKey, resumeText, goalsText, locationsText } = data;

    if (!deepseekApiKey) {
      return NextResponse.json({ error: 'DeepSeek API Key is required' }, { status: 400 });
    }

    const settings = await prisma.userSettings.upsert({
      where: { id: 'global' },
      update: {
        deepseekApiKey,
        apifyApiKey,
        rapidApiKey,
        serpApiKey,
        resumeText,
        goalsText,
        locationsText
      },
      create: {
        id: 'global',
        deepseekApiKey,
        apifyApiKey,
        rapidApiKey,
        serpApiKey,
        resumeText,
        goalsText,
        locationsText
      }
    });

    await prisma.contextProfile.upsert({
      where: { id: "global" },
      update: {
        rulesText: `GOALS: ${goalsText}\n\nLOCATIONS: ${locationsText || 'Any'}\n\nRESUME:\n${resumeText}`
      },
      create: {
        id: "global",
        rulesText: `GOALS: ${goalsText}\n\nLOCATIONS: ${locationsText || 'Any'}\n\nRESUME:\n${resumeText}`
      }
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("Setup API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
