# DSA Progress Tracker — API Reference

Base URL: `http://localhost:5000/api`

Auth: JWT via `Authorization: Bearer <token>` header where required.

CORS: Allowed origin `http://localhost:5173`.

---

## Auth

- POST `/auth/signup`
  - **Auth:** Public
  - **Description:** Register a new user.
  - **Body (JSON):**
    - `first_name`: string, 2-100 chars
    - `last_name`: string, 2-100 chars
    - `email`: string (email)
    - `password`: string (must match policy)
    - `role`: `"ADMIN" | "USER"` (optional, defaults to `"USER"`)
  - **Demo Request Body (paste here):**
    ```json
    {
      "first_name": "",
      "last_name": "",
      "email": "",
      "password": "",
      "role": "USER"
    }
    ```
  - **Success 201:** Returns JWT and user info.
  - **Errors:** 400 validation or existing user, 500 server error
  - **Demo Response (paste here):**
    ```json
    {
    "status": 201,
    "message": "User created successfully",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiaXNoYS5ndXB0YUBnbWFpbC5jb20iLCJmaXJzdF9uYW1lIjoiSXNoYSIsImxhc3RfbmFtZSI6Ikd1cHRhIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3NjQ5NjIxMjYsImV4cCI6MTc2NDk3NjUyNn0.ALVm_ZIo8rkvGpsGs34LZltPKSZ0-gcnURMtBy7RPm4",
        "id": 1,
        "email": "isha.gupta@gmail.com"
        }
    }
    ```

- POST `/auth/login`
  - **Auth:** Public
  - **Description:** Login and receive access token.
  - **Body (JSON):**
    - `email`: string (email)
    - `password`: string
  - **Demo Request Body (paste here):**
    ```json
    {
      "email": "",
      "password": ""
    }
    ```
  - **Success 200:** Returns JWT and user profile fields.
  - **Errors:** 400 invalid credentials, 500 server error
  - **Demo Response (paste here):**
    ```json
    {
    "status": 200,
    "message": "Login successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiaXNoYS5ndXB0YUBnbWFpbC5jb20iLCJmaXJzdF9uYW1lIjoiSXNoYSIsImxhc3RfbmFtZSI6Ikd1cHRhIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3NjQ5NjIzMDUsImV4cCI6MTc2NDk3NjcwNX0.UWZVBKJpdh6saIwJAq0Gk6CUy-WE3H_yJsf7yJ73N0U",
        "userId": 1,
        "first_name": "Isha",
        "last_name": "Gupta",
        "email": "isha.gupta@gmail.com",
        "role": "USER"
        }
    }
    ```

---

## Users

- GET `/users`
  - **Auth:** Required (role: `ADMIN`)
  - **Description:** List all users.
  - **Headers:** `Authorization: Bearer <token>`
  - **Query Params:** none
  - **Demo Query Params (paste here):**
    ```json
    {}
    ```
  - **Success 200:** List of users.
  - **Errors:** 401 unauthorized (no/invalid token), 403 forbidden (non-admin), 500 server error
  - **Demo Response (paste here):**
    ```json
    {
    "status": 200,
    "message": "Users retrieved successfully",
    "data":     [
            {
                "id": 3,
                "first_name": "Vatsal",
                "last_name": "Shah",
                "email": "vatsalshah2304@gmail.com",
                "role": "USER",
                "created_at": "2025-12-05T19:19:10.141Z"
            },
            {
                "id": 2,
                "first_name": "Dev",
                "last_name": "Bachani",
                "email": "devcodes2206@gmail.com",
                "role": "ADMIN",
                "created_at": "2025-12-05T19:19:04.377Z"
            },
            {
                "id": 1,
                "first_name": "Isha",
                "last_name": "Gupta",
                "email": "isha.gupta@gmail.com",
                "role": "USER",
                "created_at": "2025-12-05T19:15:26.058Z"
            }
        ]
    }
    ```

- DELETE `/users`
  - **Auth:** Required (self)
  - **Description:** Delete the authenticated user account.
  - **Headers:** `Authorization: Bearer <token>`
  - **Body:** none
  - **Success 200:** Deleted user info
  - **Errors:** 401/400 token issues, 500 server error
  - **Demo Response (paste here):**
    ```json
    {
    "status": 200,
    "message": "User deleted successfully",
    "data": {
        "id": 1,
        "first_name": "Isha",
        "last_name": "Gupta",
        "email": "isha.gupta@gmail.com",
        "role": "USER",
        "created_at": "2025-12-05T19:15:26.058Z"
        }
    }
    ```

---

## Progress

- GET `/complete_progress`
  - **Auth:** Required
  - **Description:** Fetch complete progress for the authenticated user.
  - **Headers:** `Authorization: Bearer <token>`
  - **Query Params:** none
  - **Demo Query Params (paste here):**
    ```json
    {}
    ```
  - **Success 200:** `{ status, message, data }` where `data` is full progress object.
  - **Errors:** 401/400 token issues
  - **Demo Response (paste here):**
    ```json
    {
    "status": 200,
    "message": "User progress retrieved successfully",
    "data": [
        {
            "id": 456,
            "done": false,
            "note": "",
            "leetcode_done": false,
            "gfg_done": false,
            "code360_done": false,
            "created_at": "2025-12-05T19:19:04.407Z",
            "updated_at": "2025-12-05T19:19:04.407Z",
            "question": {
                "id": 1,
                "problem_id": "srinpttpt",
                "problem_name": "User Input / Output",
                "company_tags": [],
                "leetcode_link": null,
                "gfg_link": "https://www.geeksforgeeks.org/problems/c-input-output2432/1",
                "code360_link": "https://www.codingninjas.com/studio/problems/two-sum-iv---input-is-a-bst_4444818",
                "tuf_article": "https://takeuforward.org/c/c-basic-input-output/",
                "tuf_yt_video_link": "https://youtu.be/EAR7De6Goz4?t=250",
                "difficulty": 0,
                "leetcode_premium_question": false,
                "tuf_link": "https://takeuforward.org/plus/dsa/problems/input-output"
            }
        },
        {
            "id": 457,
            "done": false,
            "note": "",
            "leetcode_done": false,
            "gfg_done": false,
            "code360_done": false,
            "created_at": "2025-12-05T19:19:04.420Z",
            "updated_at": "2025-12-05T19:19:04.420Z",
            "question": {
                "id": 2,
                "problem_id": "dttyps",
                "problem_name": "Data Types",
                "company_tags": [],
                "leetcode_link": null,
                "gfg_link": null,
                "code360_link": "https://www.codingninjas.com/studio/library/dart-data-types",
                "tuf_article": null,
                "tuf_yt_video_link": "https://youtu.be/EAR7De6Goz4?t=755",
                "difficulty": 0,
                "leetcode_premium_question": false,
                "tuf_link": "https://takeuforward.org/plus/dsa/problems/cpp"
            }
        },

        ]
    }
    ```

- GET `/sheet_progress`
  - **Auth:** Required
  - **Description:** Fetch progress for a specific sheet for the authenticated user.
  - **Headers:** `Authorization: Bearer <token>`
  - **Query Params:**
    - `sheetId`: number (required)
  - **Demo Query Params (paste here):**
    ```json
    {
      "sheetId": 1
    }
    ```
  - **Success 200:** `{ status, message, data: { sheet: string, progress: [...] } }`
  - **Errors:** 401/400 token issues
  - **Demo Response (paste here):**
    ```json
    {
    "status": 200,
    "message": "User progress retrieved successfully",
    "data": {
        "sheet": "A2Z Sheet",
        "progress": [
            {
                "id": 1,
                "done": false,
                "note": "",
                "leetcode_done": false,
                "gfg_done": false,
                "code360_done": false,
                "created_at": "2025-12-05T19:29:23.850Z",
                "updated_at": "2025-12-05T19:29:23.850Z",
                "question": {
                    "id": 1,
                    "problem_id": "srinpttpt",
                    "problem_name": "User Input / Output",
                    "company_tags": [],
                    "leetcode_link": null,
                    "gfg_link": "https://www.geeksforgeeks.org/problems/c-input-output2432/1",
                    "code360_link": "https://www.codingninjas.com/studio/problems/two-sum-iv---input-is-a-bst_4444818",
                    "tuf_article": "https://takeuforward.org/c/c-basic-input-output/",
                    "tuf_yt_video_link": "https://youtu.be/EAR7De6Goz4?t=250",
                    "difficulty": 0,
                    "leetcode_premium_question": false,
                    "tuf_link": "https://takeuforward.org/plus/dsa/problems/input-output",
                    "sheetQuestions": [
                        {
                            "step_number": 1,
                            "sub_step_number": 1
                        }
                    ]
                }
            },
            {
                "id": 2,
                "done": false,
                "note": "",
                "leetcode_done": false,
                "gfg_done": false,
                "code360_done": false,
                "created_at": "2025-12-05T19:29:27.029Z",
                "updated_at": "2025-12-05T19:29:27.029Z",
                "question": {
                    "id": 455,
                    "problem_id": "cntplindrmicsbsqncingivnstring",
                    "problem_name": "Count palindromic subsequence in given string",
                    "company_tags": [],
                    "leetcode_link": null,
                    "gfg_link": "https://www.geeksforgeeks.org/problems/count-palindromic-subsequences/1",
                    "code360_link": "https://www.codingninjas.com/studio/problems/count-palindromic-subsequences---ii-_3125886",
                    "tuf_article": null,
                    "tuf_yt_video_link": null,
                    "difficulty": 2,
                    "leetcode_premium_question": false,
                    "tuf_link": "https://takeuforward.org/plus/dsa/problems/count-palindromic-subsequences",
                    "sheetQuestions": [
                        {
                            "step_number": 18,
                            "sub_step_number": 1
                        }
                        ]
                    }
                }
            ]
        }
    }
    ```

- POST `/toggle_question`
  - **Auth:** Required
  - **Description:** Toggle `done` for a question for the authenticated user.
  - **Headers:** `Authorization: Bearer <token>`
  - **Body (JSON):**
    - `question_id`: number (required)
  - **Demo Request Body (paste here):**
    ```json
    {
      "question_id": 123
    }
    ```
  - **Success 200:** `{ status, message, data: toggledQuestion }`
  - **Errors:** 401/400 token issues
  - **Demo Response (paste here):**
    ```json
    {
    "status": 200,
    "message": "Question toggled successfully",
    "data": {
        "id": 2399,
        "user_id": 6,
        "question_id": 123,
        "done": true,
        "note": "",
        "leetcode_done": false,
        "gfg_done": false,
        "code360_done": false,
        "created_at": "2025-12-05T19:29:24.764Z",
        "updated_at": "2025-12-05T19:34:07.623Z"
        }
    }
    ```

- POST `/toggle_question_site`
  - **Auth:** Required
  - **Description:** Toggle completion for a specific site (leetcode/gfg/code360) for a question for the authenticated user.
  - **Headers:** `Authorization: Bearer <token>`
  - **Body (JSON):**
    - `question_id`: number (required)
    - `site`: string (required) — e.g. `"leetcode" | "gfg" | "code360"`
  - **Demo Request Body (paste here):**
    ```json
    {
    "question_id": 123,
    "site":"code360_done"
    // "site":"gfg_done"
    // "site":"leetcode_done"
    }
    ```
  - **Success 200:** `{ status, message, data: toggledQuestion }`
  - **Errors:** 401/400 token issues
  - **Demo Response (paste here):**
    ```json
    {
    "status": 200,
    "message": "Question toggled successfully",
    "data": {
        "id": 2399,
        "user_id": 6,
        "question_id": 123,
        "done": true,
        "note": "",
        "leetcode_done": false,
        "gfg_done": false,
        "code360_done": true,
        "created_at": "2025-12-05T19:29:24.764Z",
        "updated_at": "2025-12-05T19:34:27.324Z"
        }
    }
    ```

---

## Notes
- All protected endpoints expect a valid JWT signed with `JWT_SECRET` and will respond with `401` if missing/invalid.
- Pagination for problems is not defined in current routes; if added later (e.g., `/problems?page=&limit=`), document it here.
- Response shapes follow `{ status, message, data }` in most controllers.
