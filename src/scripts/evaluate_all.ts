import { runDeepseekEvaluation } from '../lib/deepseekEvaluator';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  console.log('Starting DeepSeek Evaluation...');
  try {
    while (true) {
      const res = await runDeepseekEvaluation((msg) => console.log(msg));
      if (res.scoresProcessed === 0 && res.contextJobsProcessed === 0 && !res.contextUpdated) break;
    }
  } catch (e) {
    console.error('Error in DeepSeek:', e);
  }



  console.log('Done.');
  await prisma.$disconnect();
}

run();
