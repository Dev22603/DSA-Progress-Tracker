# Prisma Seed Data

This directory contains JSON files used to seed the database with initial data.

**Note:** These JSON data files are tracked in git and contain the actual seed data used by `npm run prisma:seed`.

## Files

- `questions.json` - Contains DSA problem questions with links and metadata
- `sheets.json` - Contains DSA practice sheets (e.g., Striver's A2Z, Blind 75)
- `sheet_questions.json` - Junction table linking questions to sheets with step numbers

## Running the Seed

```bash
# From the backend directory
npm run prisma:seed

# Or after migrations (seed runs automatically)
npm run prisma:migrate
```

## Data Structure

### questions.json
```json
{
  "id": 1,
  "problem_id": "unique-problem-id",
  "problem_name": "Problem Name",
  "company_tags": ["Company1", "Company2"],
  "leetcode_link": "https://...",
  "gfg_link": "https://...",
  "code360_link": null,
  "tuf_article": null,
  "tuf_yt_video_link": null,
  "difficulty": 1,
  "leetcode_premium_question": false,
  "tuf_link": null
}
```

### sheets.json
```json
{
  "id": 1,
  "name": "Sheet Name",
  "number_of_questions": 100,
  "has_sub_steps": true
}
```

### sheet_questions.json
```json
{
  "id": 1,
  "question_id": 1,
  "sheet_id": 1,
  "step_number": 1,
  "sub_step_number": 1
}
```

## Notes

- The seed file uses `upsert` operations, so it's safe to run multiple times
- Foreign key relationships are maintained (questions and sheets must exist before sheet_questions)
