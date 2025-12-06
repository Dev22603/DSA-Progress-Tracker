"use client";

import { UIEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";
const SHEET_ID = 1;

type SheetQuestion = {
  id: number;
  problem_id: string;
  problem_name: string;
  company_tags: string[];
  leetcode_link: string | null;
  gfg_link: string | null;
  code360_link: string | null;
  tuf_article: string | null;
  tuf_yt_video_link: string | null;
  difficulty: number;
  leetcode_premium_question: boolean;
  tuf_link: string | null;
  sheetQuestions: { step_number: number; sub_step_number: number }[];
};

type ProgressItem = {
  id: number;
  done: boolean;
  note: string;
  leetcode_done: boolean;
  gfg_done: boolean;
  code360_done: boolean;
  created_at: string;
  updated_at: string;
  question: SheetQuestion;
};

type ToggleField = "done" | "leetcode_done" | "gfg_done" | "code360_done";

export default function SheetPage() {
  const router = useRouter();
  const [items, setItems] = useState<ProgressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [detailItem, setDetailItem] = useState<ProgressItem | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const sortByStep = (list: ProgressItem[]): ProgressItem[] => {
      return [...list].sort((a, b) => {
        const aStep = a.question.sheetQuestions[0]?.step_number ?? 0;
        const aSub = a.question.sheetQuestions[0]?.sub_step_number ?? 0;
        const bStep = b.question.sheetQuestions[0]?.step_number ?? 0;
        const bSub = b.question.sheetQuestions[0]?.sub_step_number ?? 0;

        if (aStep !== bStep) return aStep - bStep;
        return aSub - bSub;
      });
    };

    const fetchWithToken = async (authToken: string) => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/sheet_progress?sheetId=${SHEET_ID}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        const json = await response.json();

        if (!response.ok) {
          throw new Error(json?.message || "Failed to load sheet");
        }

        const progress: ProgressItem[] =
          json?.data?.progress ?? json?.data ?? [];

        setItems(sortByStep(progress));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPublic = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/sheet_questions?sheetId=${SHEET_ID}`,
        );

        const json = await response.json();

        if (!response.ok) {
          throw new Error(json?.message || "Failed to load sheet");
        }

        const questions: SheetQuestion[] =
          json?.data?.questions ?? json?.data ?? [];

        const mapped: ProgressItem[] = questions.map((q) => ({
          id: q.id,
          done: false,
          note: "",
          leetcode_done: false,
          gfg_done: false,
          code360_done: false,
          created_at: "",
          updated_at: "",
          question: q,
        }));

        setItems(sortByStep(mapped));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchWithToken(token);
    } else {
      fetchPublic();
    }
  }, []);

  const handleLogout = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("redirectAfterLogin");
    setIsLoggedIn(false);
    router.push("/");
  };

  const requireAuth = (): string | null => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/sheet");
      router.push("/login");
      return null;
    }

    return token;
  };

  const handleToggle = async (
    item: ProgressItem,
    field: ToggleField,
  ): Promise<void> => {
    const token = requireAuth();
    if (!token) return;

    const previous = items;
    setItems((current) =>
      current.map((row) =>
        row.id === item.id ? { ...row, [field]: !row[field] } : row,
      ),
    );

    try {
      const isMainDone = field === "done";
      const url = isMainDone
        ? `${API_BASE_URL}/toggle_question`
        : `${API_BASE_URL}/toggle_question_site`;
      const body = isMainDone
        ? { question_id: item.question.id }
        : { question_id: item.question.id, site: field };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to update progress");
      }
    } catch (err) {
      setItems(previous);
      setError(
        err instanceof Error ? err.message : "Failed to update progress.",
      );
    }
  };

  const loadMore = () => {
    if (isLoadingMore || visibleCount >= items.length) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((current) => Math.min(current + 20, items.length));
      setIsLoadingMore(false);
    }, 400);
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (
      target.scrollTop + target.clientHeight >=
      target.scrollHeight - 48
    ) {
      loadMore();
    }
  };

  const difficultyLabel = (value: number): string => {
    if (value === 0) return "Easy";
    if (value === 1) return "Medium";
    if (value === 2) return "Hard";
    return "Unknown";
  };

  const difficultyColor = (value: number): string => {
    if (value === 0)
      return "bg-green-500/10 text-green-500 border-green-500/40";
    if (value === 1)
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/40";
    if (value === 2) return "bg-red-500/10 text-red-500 border-red-500/40";
    return "bg-gray-500/10 text-gray-400 border-gray-500/40";
  };

  const visibleItems = items.slice(0, visibleCount);

  return (
    <div className="min-h-screen flex flex-col px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">DSA Problems Sheet</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Track your progress across structured DSA problems.
          </p>
        </div>
        <div className="flex gap-3 justify-end mr-16">
          <Link
            href="/"
            className="px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg text-sm font-medium hover:bg-foreground/5 transition"
          >
            Home
          </Link>
          {isLoggedIn && (
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-semibold transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/40 rounded-lg text-sm text-red-500">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            Loading sheet...
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            No problems found for this sheet.
          </p>
        </div>
      ) : (
        <div className="bg-white/90 dark:bg-gray-950/80 backdrop-blur-sm rounded-lg shadow-sm flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <div
              className="max-h-[70vh] overflow-y-auto"
              onScroll={handleScroll}
            >
              <table className="min-w-full text-xs sm:text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                      #
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 min-w-[200px]">
                      Problem
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                      LC
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                      LC Done
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                      GFG
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                      GFG Done
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Code360
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Code360 Done
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Done
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Note
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Video
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Difficulty
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/70 dark:divide-gray-800/60">
                  {visibleItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className={item.done ? "bg-green-500/5" : ""}
                    >
                      <td className="px-3 py-2 align-top text-gray-600 dark:text-gray-400">
                        {index + 1}
                      </td>
                      <td className="px-3 py-2 align-top">
                        <button
                          onClick={() => setDetailItem(item)}
                          className="text-left text-blue-500 hover:text-blue-600 font-medium line-clamp-2"
                        >
                          {item.question.problem_name}
                        </button>
                      </td>
                      <td className="px-3 py-2 align-top">
                        {item.question.leetcode_link ? (
                          <a
                            href={item.question.leetcode_link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500 hover:text-blue-600 underline"
                          >
                            link
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 align-top">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-500 rounded border-gray-300 cursor-pointer"
                          checked={item.leetcode_done}
                          onChange={() => handleToggle(item, "leetcode_done")}
                        />
                      </td>
                      <td className="px-3 py-2 align-top">
                        {item.question.gfg_link ? (
                          <a
                            href={item.question.gfg_link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500 hover:text-blue-600 underline"
                          >
                            link
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 align-top">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-500 rounded border-gray-300 cursor-pointer"
                          checked={item.gfg_done}
                          onChange={() => handleToggle(item, "gfg_done")}
                        />
                      </td>
                      <td className="px-3 py-2 align-top">
                        {item.question.code360_link ? (
                          <a
                            href={item.question.code360_link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500 hover:text-blue-600 underline"
                          >
                            link
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 align-top">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-500 rounded border-gray-300 cursor-pointer"
                          checked={item.code360_done}
                          onChange={() => handleToggle(item, "code360_done")}
                        />
                      </td>
                      <td className="px-3 py-2 align-top">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-500 rounded border-gray-300 cursor-pointer"
                          checked={item.done}
                          onChange={() => handleToggle(item, "done")}
                        />
                      </td>
                      <td className="px-3 py-2 align-top">
                        <button
                          type="button"
                          className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                          onClick={() => requireAuth()}
                        >
                          Note (soon)
                        </button>
                      </td>
                      <td className="px-3 py-2 align-top">
                        {item.question.tuf_yt_video_link ? (
                          <a
                            href={item.question.tuf_yt_video_link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="w-4 h-4"
                              fill="currentColor"
                            >
                              <path d="M10 15.5l6-3.5-6-3.5v7z" />
                              <path d="M21.8 8.001a3.001 3.001 0 0 0-2.113-2.127C17.733 5.25 12 5.25 12 5.25s-5.733 0-7.687.624A3.001 3.001 0 0 0 2.2 8.001C1.575 9.96 1.575 12 1.575 12s0 2.04.625 3.999a3.001 3.001 0 0 0 2.113 2.127C6.267 18.75 12 18.75 12 18.75s5.733 0 7.687-.624a3.001 3.001 0 0 0 2.113-2.127C22.425 14.04 22.425 12 22.425 12s0-2.04-.625-3.999z" />
                            </svg>
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 align-top">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full border text-[10px] sm:text-xs font-medium ${difficultyColor(
                            item.question.difficulty,
                          )}`}
                        >
                          {difficultyLabel(item.question.difficulty)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {isLoadingMore && (
                    <tr>
                      <td
                        colSpan={12}
                        className="px-3 py-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        <span className="inline-flex gap-1 items-center">
                          <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                          <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150" />
                          <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300" />
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {detailItem && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-lg w-full p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-2">
              {detailItem.question.problem_name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Difficulty:{" "}
              <span
                className={`inline-flex px-2 py-1 rounded-full border text-[11px] font-medium ${difficultyColor(
                  detailItem.question.difficulty,
                )}`}
              >
                {difficultyLabel(detailItem.question.difficulty)}
              </span>
            </p>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <span className="font-medium">Problem ID:</span>{" "}
                {detailItem.question.problem_id}
              </p>
              <p>
                <span className="font-medium">Company Tags:</span>{" "}
                {detailItem.question.company_tags?.length
                  ? detailItem.question.company_tags.join(", ")
                  : "None"}
              </p>
              <p>
                <span className="font-medium">TUF Article:</span>{" "}
                {detailItem.question.tuf_article ? (
                  <a
                    href={detailItem.question.tuf_article}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 hover:text-blue-600 underline"
                  >
                    Open
                  </a>
                ) : (
                  "Not available"
                )}
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm"
                onClick={() => setDetailItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
