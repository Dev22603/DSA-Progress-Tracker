import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Prisma Client
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Helper to load JSON
function loadJSON(relativePath) {
  const fullPath = path.join(__dirname, relativePath);
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

async function seedQuestions() {
  console.log('Seeding questions...');
  const questions = loadJSON('data/questions.json');

  for (const q of questions) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: {},
      create: {
        id: q.id,
        problem_id: q.problem_id,
        problem_name: q.problem_name,
        company_tags: Array.isArray(q.company_tags)
          ? q.company_tags
          : JSON.parse(q.company_tags || '[]'),
        leetcode_link: q.leetcode_link || null,
        gfg_link: q.gfg_link || null,
        code360_link: q.code360_link || null,
        tuf_article: q.tuf_article || null,
        tuf_yt_video_link: q.tuf_yt_video_link || null,
        difficulty: q.difficulty,
        leetcode_premium_question: q.leetcode_premium_question || false,
        tuf_link: q.tuf_link || null
      }
    });
  }

  console.log('✓ Questions seeded');
}

async function seedSheets() {
  console.log('Seeding sheets...');
  const sheets = loadJSON('data/sheets.json');

  for (const s of sheets) {
    await prisma.sheet.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        name: s.name,
        number_of_questions: s.number_of_questions,
        has_sub_steps: s.has_sub_steps || false
      }
    });
  }

  console.log('✓ Sheets seeded');
}

async function seedSheetQuestions() {
  console.log('Seeding sheet questions...');
  const sq = loadJSON('data/sheet_questions.json');

  for (const item of sq) {
    await prisma.sheetQuestion.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        question_id: item.question_id,
        sheet_id: item.sheet_id,
        step_number: item.step_number,
        sub_step_number: item.sub_step_number || 0
      }
    });
  }

  console.log('✓ SheetQuestions seeded');
}

async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Seed in the correct order (sheets and questions first, then the junction table)
    await seedQuestions();
    await seedSheets();
    await seedSheetQuestions();

    console.log('\n✅ Database seeded successfully!');
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    throw error;
  }
}

// Execute the seed
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
