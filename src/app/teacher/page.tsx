"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/hooks/use-auth";
import { Users, Activity, Trophy, ChevronLeft, Search, Calendar } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  role: string;
  target_date: string;
  created_at: string;
  testCount: number;
  avgScore: number;
  lastActive: number;
}

interface StudentDetail {
  profile: {
    id: string;
    name: string;
    email: string;
    role: string;
    target_date: string;
    created_at: string;
  };
  records: {
    id: string;
    timestamp: number;
    type: string;
    section: string | null;
    quiz_section: string | null;
    quiz_part: string | null;
    overall_score: number;
    scores: Record<string, number>;
  }[];
  scheduleItems: {
    id: string;
    date: string;
    section: string;
    label: string;
    completed: boolean;
  }[];
}

function scoreColor(score: number): string {
  if (score >= 10) return "text-green-600";
  if (score >= 8) return "text-blue-600";
  if (score >= 6) return "text-yellow-600";
  return "text-red-600";
}

function formatDate(d: string | number): string {
  const date = typeof d === "number" ? new Date(d) : new Date(d);
  return new Intl.DateTimeFormat("en-CA", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function timeAgo(ts: number): string {
  if (!ts) return "Never";
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function TeacherPage() {
  const router = useRouter();
  const { currentUser, loading: authLoading } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [teacherId, setTeacherId] = useState<string>("");

  const fetchStudents = useCallback(async (tid: string) => {
    try {
      const res = await fetch(`/api/admin?action=teacher-students&teacherId=${tid}`);
      if (res.status === 403) {
        setError("Access denied. Teacher or admin role required.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setStudents(data);
      }
    } catch {
      setError("Failed to fetch students.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/login");
      return;
    }
    if (!authLoading && currentUser) {
      // Get viewer's role and ID
      fetch("/api/admin?action=debug")
        .then((r) => r.json())
        .then((d) => {
          if (d.role !== "admin" && d.role !== "teacher" && d.role !== "editor") {
            setError("Access denied. Teacher, editor, or admin role required.");
            setLoading(false);
            return;
          }
          setTeacherId(d.userId);
          fetchStudents(d.userId);
        })
        .catch(() => {
          setError("Failed to verify permissions.");
          setLoading(false);
        });
    }
  }, [authLoading, currentUser, router, fetchStudents]);

  const fetchStudentDetail = async (studentId: string) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin?action=user-details&userId=${studentId}`);
      const data = await res.json();
      setSelectedStudent(data);
    } catch {
      setError("Failed to fetch student details.");
    }
    setDetailLoading(false);
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6b4c9a]" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--background)" }}>
        <Card className="w-full max-w-md border-2 border-red-200 rounded-2xl">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-lg font-medium text-red-600 mb-2">{error}</p>
            <Button onClick={() => router.push("/dashboard")} className="rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white mt-4">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.testCount > 0).length;
  const totalTests = students.reduce((sum, s) => sum + s.testCount, 0);
  const avgScore = totalTests > 0
    ? Math.round(students.reduce((sum, s) => sum + s.avgScore * s.testCount, 0) / totalTests)
    : 0;

  // Student detail view
  if (selectedStudent) {
    const p = selectedStudent.profile;
    const records = selectedStudent.records;
    const schedule = selectedStudent.scheduleItems;
    const completedSchedule = schedule.filter((s) => s.completed).length;

    return (
      <main className="min-h-screen bg-grid" style={{ backgroundColor: "var(--background)" }}>
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
          <div className="max-w-screen-xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedStudent(null)}
                className="rounded-full"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <span className="text-lg font-bold text-[#1a1a2e]">{p.name}</span>
              <Badge className={
                p.role === "user" ? "bg-green-100 text-green-700 border-green-200" :
                "bg-gray-100 text-gray-600 border-gray-200"
              }>
                {p.role}
              </Badge>
            </div>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 py-8">
          {/* Student info */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card className="border-2 border-[#e2ddd5] rounded-2xl">
              <CardContent className="pt-5 text-center">
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="text-sm font-medium text-[#1a1a2e] truncate">{p.email}</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#e2ddd5] rounded-2xl">
              <CardContent className="pt-5 text-center">
                <p className="text-xs text-muted-foreground mb-1">Joined</p>
                <p className="text-sm font-medium text-[#1a1a2e]">{formatDate(p.created_at)}</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#e2ddd5] rounded-2xl">
              <CardContent className="pt-5 text-center">
                <p className="text-xs text-muted-foreground mb-1">Target Date</p>
                <p className="text-sm font-medium text-[#1a1a2e]">{p.target_date || "Not set"}</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#e2ddd5] rounded-2xl">
              <CardContent className="pt-5 text-center">
                <p className="text-xs text-muted-foreground mb-1">Schedule Progress</p>
                <p className="text-sm font-medium text-[#1a1a2e]">{completedSchedule}/{schedule.length} items</p>
                {schedule.length > 0 && <Progress value={(completedSchedule / schedule.length) * 100} className="h-1.5 mt-2" />}
              </CardContent>
            </Card>
          </div>

          {/* Test history */}
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-3">Test History ({records.length})</h3>
          {records.length === 0 ? (
            <Card className="border-2 border-dashed border-[#e2ddd5] rounded-2xl mb-6">
              <CardContent className="pt-6 pb-6 text-center">
                <p className="text-sm text-muted-foreground">No test records found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4 mb-6">
              {records.map((r) => {
                const label = r.type === "full"
                  ? "Full Mock Test"
                  : r.type === "section"
                  ? `${(r.section || "").charAt(0).toUpperCase() + (r.section || "").slice(1)} Practice`
                  : `${(r.quiz_section || "").charAt(0).toUpperCase() + (r.quiz_section || "").slice(1)} Quiz — Part ${Number(r.quiz_part) + 1}`;

                const badgeColor = r.type === "full"
                  ? "bg-purple-100 text-[#6b4c9a] border-purple-200"
                  : r.quiz_section === "listening" || r.section === "listening"
                  ? "bg-orange-100 text-orange-700 border-orange-200"
                  : r.quiz_section === "reading" || r.section === "reading"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : r.quiz_section === "writing" || r.section === "writing"
                  ? "bg-purple-100 text-purple-700 border-purple-200"
                  : "bg-pink-100 text-pink-700 border-pink-200";

                return (
                  <Card key={r.id} className="border-2 border-[#e2ddd5] rounded-2xl break-inside-avoid">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge className={`${badgeColor} border text-[10px] mb-1`}>{r.type}</Badge>
                          <p className="text-sm font-medium text-[#1a1a2e]">{label}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(r.timestamp)}</p>
                        </div>
                        <p className={`text-2xl font-bold ${scoreColor(r.overall_score)}`}>{r.overall_score}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    );
  }

  // Students list view
  return (
    <main className="min-h-screen bg-grid" style={{ backgroundColor: "var(--background)" }}>
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#1a1a2e] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#6b4c9a]" /> My Students
          </h1>
          <Button size="sm" onClick={() => router.push("/dashboard")} className="rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white">
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Users, value: totalStudents, label: "Total Students", color: "text-[#6b4c9a]" },
            { icon: Activity, value: activeStudents, label: "Active Students", color: "text-green-600" },
            { icon: Trophy, value: totalTests, label: "Total Tests", color: "text-blue-600" },
            { icon: Trophy, value: avgScore, label: "Avg Score", color: scoreColor(avgScore) },
          ].map((stat) => (
            <Card key={stat.label} className="border-2 border-[#e2ddd5] rounded-2xl">
              <CardContent className="pt-5 text-center">
                <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full border border-[#e2ddd5] rounded-full pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#6b4c9a] transition-colors"
          />
        </div>

        {/* Students table */}
        <Card className="border-2 border-[#e2ddd5] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2ddd5] bg-gray-50/50">
                  <th className="text-left px-4 py-3 font-medium text-[#1a1a2e]">Student</th>
                  <th className="text-left px-4 py-3 font-medium text-[#1a1a2e]">Role</th>
                  <th className="text-center px-4 py-3 font-medium text-[#1a1a2e]">Tests</th>
                  <th className="text-center px-4 py-3 font-medium text-[#1a1a2e]">Avg Score</th>
                  <th className="text-left px-4 py-3 font-medium text-[#1a1a2e]">Last Active</th>
                  <th className="text-left px-4 py-3 font-medium text-[#1a1a2e]">Target Date</th>
                  <th className="text-right px-4 py-3 font-medium text-[#1a1a2e]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-[#e2ddd5] hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <button onClick={() => fetchStudentDetail(s.id)} className="text-left hover:underline">
                        <p className="font-medium text-[#1a1a2e]">{s.name || "—"}</p>
                        <p className="text-xs text-muted-foreground">{s.email}</p>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={
                        s.role === "user" ? "bg-green-100 text-green-700 border-green-200 border" :
                        "bg-gray-100 text-gray-600 border-gray-200 border"
                      }>
                        {s.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center font-medium">{s.testCount}</td>
                    <td className="px-4 py-3 text-center">
                      {s.testCount > 0 ? (
                        <span className={`font-bold ${scoreColor(s.avgScore)}`}>{s.avgScore}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">{timeAgo(s.lastActive)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        {s.target_date ? (
                          <><Calendar className="w-3 h-3" /> {s.target_date}</>
                        ) : "Not set"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fetchStudentDetail(s.id)}
                        className="rounded-full text-xs px-3"
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      {students.length === 0 ? "No students assigned yet." : "No students found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {detailLoading && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6b4c9a]" />
          </div>
        )}
      </div>
    </main>
  );
}
