import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Prisma Client
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Helper to load JSON
function loadJSON(relativePath) {
  const fullPath = path.join(__dirname, relativePath);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

// Parser for company tags
function parseCompanyTags(str) {
  if (!str) return [];
  // safe for multi word companies
  return str
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function seedQuestions() {
  console.log("Seeding questions...");
  const questions = loadJSON("data/questions.json");

  for (const q of questions) {
    await prisma.question.upsert({
      // use problem_id since id is autoincrement
      where: { problem_id: q.problem_id },
      update: {},

      create: {
        problem_id: q.problem_id,
        problem_name: q.problem_name,
        company_tags: Array.isArray(q.company_tags)
          ? q.company_tags
          : parseCompanyTags(q.company_tags),
        leetcode_link: q.leetcode_link || null,
        gfg_link: q.gfg_link || null,
        code360_link: q.code360_link || null,
        tuf_article: q.tuf_article || null,
        tuf_yt_video_link: q.tuf_yt_video_link || null,
        difficulty: q.difficulty ?? 0,
        leetcode_premium_question: q.leetcode_premium_question || false,
        tuf_link: q.tuf_link || null,
      },
    });
  }

  console.log("✓ Questions seeded");
}

async function seedSheets() {
  console.log("Seeding sheets...");
  const sheets = loadJSON("data/sheets.json");

  for (const s of sheets) {
    await prisma.sheet.upsert({
      // use name as unique identifier
      where: { name: s.name },
      update: {},
      create: {
        name: s.name,
        number_of_questions: s.number_of_questions,
        has_sub_steps: s.has_sub_steps || false,
      },
    });
  }

  console.log("✓ Sheets seeded");
}

async function seedSheetQuestions() {
  console.log("Seeding sheet questions...");
  const sq = loadJSON("data/sheet_questions.json");

  for (const item of sq) {
    await prisma.sheetQuestion.upsert({
      where: {
        question_id_sheet_id_step_number_sub_step_number: {
          question_id: item.question_id,
          sheet_id: item.sheet_id,
          step_number: item.step_number,
          sub_step_number: item.sub_step_number || 0
        }
      },
      update: {},
      create: {
        question_id: item.question_id,
        sheet_id: item.sheet_id,
        step_number: item.step_number,
        sub_step_number: item.sub_step_number || 0
      }
    });

  }

  console.log("✓ SheetQuestions seeded");
}

async function main() {
  console.log("🌱 Starting database seed...\n");

  try {
    await seedQuestions();
    await seedSheets();
    await seedSheetQuestions();

    console.log("\n✅ Database seeded successfully!");
  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
