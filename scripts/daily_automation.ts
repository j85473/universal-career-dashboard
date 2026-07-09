import { ingestJobs } from '../src/lib/jobIngestion';
import { scoreJobs } from '../src/lib/jobScoring';
import { prisma } from '../src/lib/prisma';
import { callGemini } from '../src/lib/gemini';

// Set up env variables if not running through Next.js
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });



async function runCron() {
  console.log("=== STARTING DAILY AUTOMATION ===");
  

  
  console.log("=== DAILY AUTOMATION COMPLETE ===");
}

runCron().catch(console.error);
