const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const seedPath = path.join(__dirname, 'ats_seed.json');
  if (fs.existsSync(seedPath)) {
    console.log('Found ats_seed.json, loading ATS endpoints...');
    const data = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
    
    // Deduplicate in JS and map back to slug
    const uniqueMap = new Map();
    for (const item of data) {
      // Create a unique key for the composite ID
      const key = `${item.domain}-${item.platform}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, {
          slug: item.domain,
          platform: item.platform,
          status: "active" // Override all to active!
        });
      }
    }
    const uniqueData = Array.from(uniqueMap.values());
    
    console.log(`Seeding ${uniqueData.length} unique ATS endpoints...`);
    
    const BATCH_SIZE = 300;
    for (let i = 0; i < uniqueData.length; i += BATCH_SIZE) {
      const batch = uniqueData.slice(i, i + BATCH_SIZE);
      await prisma.$transaction(
        batch.map(item => 
          prisma.atsCompany.upsert({
            where: { slug_platform: { slug: item.slug, platform: item.platform } },
            update: item,
            create: item
          })
        )
      );
      if (i % 3000 === 0) console.log(`Inserted ${Math.min(i + BATCH_SIZE, uniqueData.length)} / ${uniqueData.length}`);
    }
    console.log('Finished seeding ATS companies.');
  } else {
    console.log('No ats_seed.json found. Skipping ATS seeding.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
