# Documentation Prompt

One prompt. Paste it into Claude Code, fill in the variables block at the bottom, and send.

If you give it a single function → it produces a deep-dive on that function.
If you give it a set of files across a module → it produces a full system overview.
The scope is determined entirely by what you put in the variables block. The instructions are the same either way.

---

## THE PROMPT

> Copy everything from `---START---` to `---END---` and paste it into Claude Code.
> Fill in only the variables block at the very bottom before sending. Do not modify anything else.

---START---

I am new to this codebase and have zero context on what I am asking you to document. Read every file listed in the variables block at the bottom before writing a single word. Do not assume, infer, or describe what something "probably does." If you need to understand a dependency, open it. Everything in this document must come from reading actual source code.

---

## What to Produce

Create a markdown documentation file at the output path specified in the variables block. The file must fully document the code I have pointed you to — at whatever level of depth that code requires. A single function gets the same treatment as an entire module: nothing is skimmed, nothing is summarized away.

---

## Required Document Structure

Produce every section below, in this order. Do not skip any section. If a section genuinely does not apply (e.g. no cache layer exists), write the section heading and one sentence explaining why it does not apply.

---

### Section 1: Mental Model

Before any code, any file names, or any technical detail: write a plain-English explanation of what this code does and how it is structured. Identify every distinct concern or "world" the system or function operates in (e.g. a write side and a read side, a hot path and a background path, a sync step and an async step). Explain how these concerns connect and where they are completely independent of each other. A non-engineer reading this section should be able to describe the system's shape without having seen any code.

---

### Section 2: Every Entry Point

List every place that triggers execution of this code — every API endpoint, queue worker, webhook handler, scheduled job, event listener, or direct function call that starts the flow. For each entry point:

- The HTTP method and full route (if applicable), the file, the function name, and the approximate line number
- A complete ASCII call tree from that entry point down to the last side effect, using this notation throughout:

```
entryFunction()
    │
    ├─ calls functionA(arg1, // type — what this argument is
    │                  arg2) // type — what this argument is
    │         └─ file.ts → innerFunction()
    │               ├─ does X
    │               └─ returns Y → used by: callerFunction for purpose Z
    │
    └─ calls functionB()
          → file.ts
          → what it does
          → what it returns
```

- The exact shape of any data that is written, synced, published, or persisted — shown as a code block with every field visible

---

### Section 3: The Full Execution Flow

Trace the complete path of execution from start to finish. For every function call in sequence:

- The file and function name
- Every parameter, annotated inline
- What it does internally
- What it returns and where that return value flows next

For every cache interaction, show all of the following in one block — never split across sentences:
```
CHECK key: resource:{param}:suffix
  Type: STRING / HASH / SET / ZSET / LIST
  TTL: Xs (Y minutes/hours)
HIT  → [exact shape returned]
MISS → file.ts → fallbackFunction()
         → [exact operation: query, API call, computation]
         → Returns: [exact type and shape]
         → Cached before returning
Transformed to: [show the transformation in code]
Used in: [next function] for [specific purpose]
```

For every database operation, show the exact query or ORM call, the parameters, and the return shape.

For every background task, queue publish, or side effect triggered: name it, show where it is triggered, and describe what it does.

---

### Section 4: Post-Load Transformations

If data is transformed, merged, filtered, or restructured after being loaded — show the exact transformation code with an inline comment on every line. Then explain in plain English why this transformation exists and what would break without it.

---

### Section 5: Algorithms, Formulas, and Non-Trivial Logic

For any scoring function, decay formula, ranking algorithm, threshold check, or non-trivial calculation:

- Show the formula or algorithm as actual code first
- Explain every variable and constant by name and role
- Show a fully worked example with concrete numbers
- Show a table mapping sample inputs to outputs — enough rows to demonstrate the shape of the curve or behavior
- Explain why this specific approach was chosen over a simpler or different alternative

---

### Section 6: Every File and Its Role

A directory tree of every file involved. For each file: what it exports, what it is solely responsible for, and what other files call it.

---

### Section 7: All External Storage Operations

A markdown table with columns:

| Operation | Function | File | Triggered By |

---

### Section 8: All Cache and Storage Keys

Every key pattern in use, its storage type, its TTL, and what it holds.

---

### Section 9: Configuration Constants

A table of every constant, threshold, flag, or tunable value referenced in this code:

| Constant | File | Actual Value | What It Controls | Effect of Changing It |

---

### Section 10: What Does NOT Happen Here

List every responsibility a reader might reasonably expect this code to have — but which actually lives elsewhere. For each: state the exact file and function where it does happen, and explain why the split was made that way. This section prevents misattribution and is as important as every section above it.

---

### Section 11: Edge Cases

For each edge case: describe the input condition, trace exactly what the code does, and explain why that outcome is correct or safe.

Cover at minimum:
- Empty inputs (empty arrays, null, undefined)
- A cache miss that also returns nothing from the database
- All items removed by a filter or validation step
- Concurrent execution (if a lock, mutex, or atomic check exists — trace the locking mechanism completely, including what happens when the lock is not acquired)

---

### Section 12: Quick Reference

A table for anyone who needs to make a change and doesn't want to read the whole document:

| I need to... | Go to file | Change function or variable |

Cover at minimum: changing a threshold or config value, disabling a feature, debugging a specific record or user, invalidating or clearing a cache, adding a new trigger or entry point.

---

## Writing Rules

Every rule applies to every section. No exceptions.

1. Read first, write second. Open every file in the variables block. Follow every import that matters. Never describe something you have not read.
2. Call trees use `│`, `├─`, `└─`, `▼`, `→`, `↓` consistently throughout. Every node shows the file name and function name — never just a prose description of what happens.
3. Annotate every parameter at every call site inline: `functionName(id, // string — the record's unique identifier`
4. Show full cache key patterns with `{placeholder}` notation. Never write "the user cache key" — write the actual pattern.
5. Show HIT and MISS for every single cache call. If you do not know the MISS path, read the cache layer file before writing.
6. Show actual constant values alongside constant names. Write `TIMEOUT = 30` not just `TIMEOUT`.
7. Show data shapes as code — TypeScript interfaces or object literals. Never describe a shape in prose.
8. Trace data forward from every return value. Write "Used in: [function] for [purpose]" after every return.
9. Count things explicitly. "Exactly 4 entry points." "3 parallel fetches." Never leave a quantity as "several" or "a number of."
10. Use tables for anything comparative — permission rules, state machines, timing comparisons, score breakdowns. Never a prose list.
11. Explain every non-obvious decision in a named subsection. Any flag, formula choice, ordering decision, or architectural pattern that is not immediately obvious from reading the line deserves a section answering: why this way and not another way?
12. Be exhaustive. This document's entire purpose is to give a reader with zero prior context complete understanding. When in doubt, include more.

---

## Variables

> Fill in everything below this line before sending. Do not modify anything above it.

**What to document:**
[Write one sentence describing what you are asking Claude to document — the function name, the module name, or the system name]

**Files to read:**
- [file path 1]
- [file path 2]
- [add as many as needed]

**Output file path:**
[Where to write the documentation file]

---END---
