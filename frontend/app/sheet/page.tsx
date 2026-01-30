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
  const [noteItem, setNoteItem] = useState<ProgressItem | null>(null);
  const [noteText, setNoteText] = useState("");

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

  const openNoteModal = (item: ProgressItem) => {
    const token = requireAuth();
    if (!token) return;
    setNoteItem(item);
    setNoteText(item.note);
  };

  const saveNote = () => {
    if (!noteItem) return;
    setItems((current) =>
      current.map((row) =>
        row.id === noteItem.id ? { ...row, note: noteText } : row,
      ),
    );
    // TODO: API call to persist note
    setNoteItem(null);
    setNoteText("");
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

  const difficultyStyle = (value: number): string => {
    if (value === 0) return "bg-teal/15 text-teal border-teal/40";
    if (value === 1) return "bg-yellow/20 text-yellow-600 dark:text-yellow border-yellow/40";
    if (value === 2) return "bg-danger/10 text-danger border-danger/40";
    return "bg-surface text-muted border-border";
  };

  const completedCount = items.filter((i) => i.done).length;
  const visibleItems = items.slice(0, visibleCount);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header bar */}
      <div className="bg-background border-b-2 border-border px-6 lg:px-8 py-6">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-1">
              Problem Sheet
            </h1>
            <p className="text-muted text-sm sm:text-base">
              {items.length > 0 ? (
                <>
                  <span className="font-bold text-foreground">{completedCount}</span>
                  <span className="text-muted"> / {items.length} completed</span>
                  {completedCount > 0 && (
                    <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-pink/20 text-pink-dark dark:text-pink rounded-full text-xs font-bold">
                      {Math.round((completedCount / items.length) * 100)}%
                    </span>
                  )}
                </>
              ) : (
                "Track your progress across structured DSA problems."
              )}
            </p>
          </div>
          {/* Progress bar */}
          {items.length > 0 && (
            <div className="w-full sm:w-64 flex-shrink-0">
              <div className="w-full h-3 bg-surface rounded-full border-2 border-border overflow-hidden">
                <div
                  className="h-full bg-teal rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(completedCount / items.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mx-6 lg:mx-8 mt-4">
          <div className="max-w-[1400px] mx-auto p-4 bg-danger/10 border-2 border-danger/30 rounded-xl text-sm text-danger font-medium flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError("")} className="ml-4 font-bold hover:opacity-70">
              &times;
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-3 border-border border-t-pink rounded-full animate-spin" />
            <span className="text-muted text-sm font-medium">Loading problems...</span>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-border">
              <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-muted font-medium">No problems found for this sheet.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 px-6 lg:px-8 py-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="bg-background border-2 border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto relative">
                <div
                  className={`max-h-[75vh] overflow-y-auto transition-all duration-200 ${
                    isLoadingMore ? "opacity-60" : ""
                  }`}
                  onScroll={handleScroll}
                >
                  <table className="w-full text-sm">
                    <thead className="bg-surface sticky top-0 z-10 border-b-2 border-border">
                      <tr>
                        <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider text-muted w-12">
                          #
                        </th>
                        <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider text-muted min-w-[240px]">
                          Problem
                        </th>
                        <th className="px-4 py-3 text-center font-bold text-xs uppercase tracking-wider text-muted">
                          LC
                        </th>
                        <th className="px-4 py-3 text-center font-bold text-xs uppercase tracking-wider text-muted">
                          GFG
                        </th>
                        <th className="px-4 py-3 text-center font-bold text-xs uppercase tracking-wider text-muted">
                          Code360
                        </th>
                        <th className="px-4 py-3 text-center font-bold text-xs uppercase tracking-wider text-muted">
                          Done
                        </th>
                        <th className="px-4 py-3 text-center font-bold text-xs uppercase tracking-wider text-muted">
                          Note
                        </th>
                        <th className="px-4 py-3 text-center font-bold text-xs uppercase tracking-wider text-muted">
                          Video
                        </th>
                        <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider text-muted">
                          Difficulty
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleItems.map((item, index) => (
                        <tr
                          key={item.id}
                          className={`border-b border-border/50 transition-colors duration-100 hover:bg-surface/60 ${
                            item.done ? "bg-teal/[0.03]" : ""
                          }`}
                        >
                          <td className="px-4 py-3 text-muted font-mono text-xs">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setDetailItem(item)}
                              className={`text-left font-semibold transition-colors line-clamp-1 ${
                                item.done
                                  ? "text-teal line-through decoration-teal/40"
                                  : "text-foreground hover:text-pink"
                              }`}
                            >
                              {item.question.problem_name}
                            </button>
                          </td>

                          {/* LC */}
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              {item.question.leetcode_link ? (
                                <a
                                  href={item.question.leetcode_link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs font-bold text-muted hover:text-foreground underline underline-offset-2 decoration-border hover:decoration-foreground transition-colors"
                                >
                                  link
                                </a>
                              ) : (
                                <span className="text-border text-xs">&mdash;</span>
                              )}
                              <input
                                type="checkbox"
                                checked={item.leetcode_done}
                                onChange={() => handleToggle(item, "leetcode_done")}
                              />
                            </div>
                          </td>

                          {/* GFG */}
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              {item.question.gfg_link ? (
                                <a
                                  href={item.question.gfg_link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs font-bold text-muted hover:text-foreground underline underline-offset-2 decoration-border hover:decoration-foreground transition-colors"
                                >
                                  link
                                </a>
                              ) : (
                                <span className="text-border text-xs">&mdash;</span>
                              )}
                              <input
                                type="checkbox"
                                checked={item.gfg_done}
                                onChange={() => handleToggle(item, "gfg_done")}
                              />
                            </div>
                          </td>

                          {/* Code360 */}
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              {item.question.code360_link ? (
                                <a
                                  href={item.question.code360_link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs font-bold text-muted hover:text-foreground underline underline-offset-2 decoration-border hover:decoration-foreground transition-colors"
                                >
                                  link
                                </a>
                              ) : (
                                <span className="text-border text-xs">&mdash;</span>
                              )}
                              <input
                                type="checkbox"
                                checked={item.code360_done}
                                onChange={() => handleToggle(item, "code360_done")}
                              />
                            </div>
                          </td>

                          {/* Done */}
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={item.done}
                              onChange={() => handleToggle(item, "done")}
                            />
                          </td>

                          {/* Note */}
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              className={`px-3 py-1.5 text-xs font-bold rounded-full border-2 transition-all ${
                                item.note
                                  ? "border-yellow/40 bg-yellow/10 text-yellow-600 dark:text-yellow hover:border-yellow hover:bg-yellow/20"
                                  : "border-border hover:border-foreground hover:bg-surface"
                              }`}
                              onClick={() => openNoteModal(item)}
                            >
                              {item.note ? `${item.note.slice(0, 5)}…` : "Note"}
                            </button>
                          </td>

                          {/* Video */}
                          <td className="px-4 py-3 text-center">
                            {item.question.tuf_yt_video_link ? (
                              <a
                                href={item.question.tuf_yt_video_link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-danger/10 text-danger hover:bg-danger/20 border-2 border-danger/20 hover:border-danger/40 transition-all"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  className="w-3.5 h-3.5"
                                  fill="currentColor"
                                >
                                  <path d="M21.8 8.001a3.001 3.001 0 0 0-2.113-2.127C17.733 5.25 12 5.25 12 5.25s-5.733 0-7.687.624A3.001 3.001 0 0 0 2.2 8.001C1.575 9.96 1.575 12 1.575 12s0 2.04.625 3.999a3.001 3.001 0 0 0 2.113 2.127C6.267 18.75 12 18.75 12 18.75s5.733 0 7.687-.624a3.001 3.001 0 0 0 2.113-2.127C22.425 14.04 22.425 12 22.425 12s0-2.04-.625-3.999zM10 15.5V8.5l6 3.5-6 3.5z" />
                                </svg>
                              </a>
                            ) : (
                              <span className="text-border text-xs">&mdash;</span>
                            )}
                          </td>

                          {/* Difficulty */}
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full border-2 text-[11px] font-bold ${difficultyStyle(
                                item.question.difficulty,
                              )}`}
                            >
                              {difficultyLabel(item.question.difficulty)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {isLoadingMore && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[1px]">
                    <div className="w-8 h-8 border-3 border-border border-t-pink rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Bottom bar */}
              <div className="border-t-2 border-border bg-surface px-4 py-3 flex items-center justify-between text-xs text-muted">
                <span>
                  Showing {visibleItems.length} of {items.length} problems
                </span>
                {visibleCount < items.length && (
                  <button
                    onClick={loadMore}
                    className="px-4 py-1.5 bg-foreground text-background rounded-full font-bold hover:opacity-80 transition-opacity text-xs"
                  >
                    Load more
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {noteItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => { setNoteItem(null); setNoteText(""); }}
        >
          <div
            className="bg-background rounded-2xl max-w-md w-full border-2 border-border shadow-[8px_8px_0_0_var(--yellow)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pt-6 pb-4 border-b-2 border-border">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-black leading-snug">
                  Note &mdash; {noteItem.question.problem_name}
                </h2>
                <button
                  type="button"
                  onClick={() => { setNoteItem(null); setNoteText(""); }}
                  className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full border-2 border-border hover:border-foreground hover:bg-surface transition-all text-muted hover:text-foreground"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-5">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write your note here..."
                rows={5}
                className="w-full px-4 py-3 bg-surface border-2 border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-foreground transition-colors resize-none text-sm"
                autoFocus
              />
            </div>
            <div className="px-6 py-4 border-t-2 border-border bg-surface flex justify-end gap-3">
              <button
                type="button"
                className="px-5 py-2.5 rounded-full font-bold text-sm border-2 border-border hover:border-foreground hover:bg-background transition-all"
                onClick={() => { setNoteItem(null); setNoteText(""); }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-6 py-2.5 bg-foreground text-background rounded-full font-bold text-sm hover:opacity-80 transition-opacity"
                onClick={saveNote}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setDetailItem(null)}
        >
          <div
            className="bg-background rounded-2xl max-w-lg w-full border-2 border-border shadow-[8px_8px_0_0_var(--pink)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="px-6 pt-6 pb-4 border-b-2 border-border">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-black leading-snug">
                  {detailItem.question.problem_name}
                </h2>
                <button
                  type="button"
                  onClick={() => setDetailItem(null)}
                  className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full border-2 border-border hover:border-foreground hover:bg-surface transition-all text-muted hover:text-foreground"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-3">
                <span
                  className={`inline-flex px-3 py-1 rounded-full border-2 text-xs font-bold ${difficultyStyle(
                    detailItem.question.difficulty,
                  )}`}
                >
                  {difficultyLabel(detailItem.question.difficulty)}
                </span>
              </div>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <span className="font-bold text-muted w-28 flex-shrink-0">Problem ID</span>
                <span className="font-mono text-foreground">{detailItem.question.problem_id}</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="font-bold text-muted w-28 flex-shrink-0">Company Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {detailItem.question.company_tags?.length ? (
                    detailItem.question.company_tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-surface border border-border rounded-full text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted">None</span>
                  )}
                </div>
              </div>
              {detailItem.question.tuf_article && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-bold text-muted w-28 flex-shrink-0">TUF Article</span>
                  <a
                    href={detailItem.question.tuf_article}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-teal underline underline-offset-2 hover:text-teal-dark transition-colors"
                  >
                    Read article &rarr;
                  </a>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t-2 border-border bg-surface flex justify-end">
              <button
                type="button"
                className="px-6 py-2.5 bg-foreground text-background rounded-full font-bold text-sm hover:opacity-80 transition-opacity"
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
