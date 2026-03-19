"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/hooks/use-auth";
import { Users, Activity, Trophy, Trash2, ChevronLeft, ChevronDown, ChevronRight, Search } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  testCount: number;
  avgScore: number;
  lastActive: number;
}

interface UserDetail {
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

export default function AdminPage() {
  const router = useRouter();
  const { currentUser, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [viewerRole, setViewerRole] = useState<string>("");
  const [pendingRoleChange, setPendingRoleChange] = useState<{ userId: string; userName: string; currentRole: string; newRole: string } | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [teachers, setTeachers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [assignmentMap, setAssignmentMap] = useState<Map<string, string>>(new Map()); // studentId -> teacherId
  const [expandedTeachers, setExpandedTeachers] = useState<Set<string>>(new Set());

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin?action=users");
      if (res.status === 403) {
        setError("Access denied. Admin role required.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setUsers(data);
      }
    } catch {
      setError("Failed to fetch users.");
    }
    setLoading(false);
  }, []);

  const fetchTeachersAndAssignments = useCallback(async () => {
    try {
      const [tRes, aRes] = await Promise.all([
        fetch("/api/admin?action=teachers"),
        fetch("/api/admin?action=all-assignments"),
      ]);
      const teacherData = await tRes.json();
      const assignmentData = await aRes.json();
      if (Array.isArray(teacherData)) setTeachers(teacherData);
      if (Array.isArray(assignmentData)) {
        const map = new Map<string, string>();
        for (const a of assignmentData) {
          map.set(a.student_id, a.teacher_id);
        }
        setAssignmentMap(map);
      }
    } catch {
      // non-critical, fail silently
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/login");
      return;
    }
    if (!authLoading && currentUser) {
      fetchUsers();
      fetchTeachersAndAssignments();
      // Fetch viewer's own role
      fetch("/api/admin?action=debug")
        .then((r) => r.json())
        .then((d) => { if (d.role) setViewerRole(d.role); })
        .catch(() => {});
    }
  }, [authLoading, currentUser, router, fetchUsers, fetchTeachersAndAssignments]);

  const assignStudent = async (studentId: string, teacherId: string) => {
    if (teacherId === "") {
      // Unassign from current teacher
      const currentTeacher = assignmentMap.get(studentId);
      if (!currentTeacher) return;
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unassign-student", teacherId: currentTeacher, studentId }),
      });
    } else {
      // Unassign from previous teacher first if any
      const currentTeacher = assignmentMap.get(studentId);
      if (currentTeacher && currentTeacher !== teacherId) {
        await fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "unassign-student", teacherId: currentTeacher, studentId }),
        });
      }
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "assign-student", teacherId, studentId }),
      });
    }
    fetchTeachersAndAssignments();
  };

  const fetchUserDetail = async (userId: string) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin?action=user-details&userId=${userId}`);
      const data = await res.json();
      setSelectedUser(data);
    } catch {
      setError("Failed to fetch user details.");
    }
    setDetailLoading(false);
  };

  const requestRoleChange = (userId: string, newRole: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user || user.role === newRole) return;
    setPendingRoleChange({ userId, userName: user.name || user.email, currentRole: user.role, newRole });
    setRoleDialogOpen(true);
  };

  const confirmRoleChange = async () => {
    if (!pendingRoleChange) return;
    const { userId, newRole } = pendingRoleChange;
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update-role", userId, role: newRole }),
    });
    setRoleDialogOpen(false);
    setPendingRoleChange(null);
    fetchUsers();
    if (selectedUser?.profile.id === userId) {
      fetchUserDetail(userId);
    }
  };

  const deleteUserRecords = async (userId: string) => {
    if (!window.confirm("⚠️ WARNING: This will permanently delete ALL test records and schedule items for this user. Continue?")) return;
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete-user-records", userId }),
    });
    fetchUsers();
    if (selectedUser?.profile.id === userId) {
      fetchUserDetail(userId);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm("⚠️ WARNING: This will permanently DELETE this user account and ALL their data. This cannot be undone.\n\nAre you sure?")) return;
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete-user", userId }),
    });
    const data = await res.json();
    if (data.error) {
      alert("Failed to delete user: " + data.error);
      return;
    }
    setSelectedUser(null);
    fetchUsers();
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

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.testCount > 0).length;
  const isViewerAdmin = viewerRole === "admin";

  const toggleTeacher = (teacherId: string) => {
    setExpandedTeachers((prev) => {
      const next = new Set(prev);
      if (next.has(teacherId)) next.delete(teacherId);
      else next.add(teacherId);
      return next;
    });
  };

  // Build grouped structure: admins, teachers (with nested students), unassigned
  const adminUsers = filtered.filter((u) => u.role === "admin");
  const teacherUsers = filtered.filter((u) => u.role === "teacher");
  const assignedStudentIds = new Set(assignmentMap.keys());
  const unassignedUsers = filtered.filter(
    (u) => (u.role === "user" || u.role === "subscriber") && !assignedStudentIds.has(u.id)
  );

  // Build a reverse map: teacherId -> students (from filtered list)
  const teacherStudentsMap = new Map<string, AdminUser[]>();
  for (const [studentId, teacherId] of assignmentMap) {
    const student = filtered.find((u) => u.id === studentId);
    if (student) {
      if (!teacherStudentsMap.has(teacherId)) teacherStudentsMap.set(teacherId, []);
      teacherStudentsMap.get(teacherId)!.push(student);
    }
  }

  const totalTests = users.reduce((s, u) => s + u.testCount, 0);
  const avgScore = totalTests > 0
    ? Math.round(users.reduce((s, u) => s + u.avgScore * u.testCount, 0) / totalTests)
    : 0;

  // Detail view
  if (selectedUser) {
    const p = selectedUser.profile;
    const records = selectedUser.records;
    const schedule = selectedUser.scheduleItems;
    const completedSchedule = schedule.filter((s) => s.completed).length;

    return (
      <main className="min-h-screen bg-grid" style={{ backgroundColor: "var(--background)" }}>
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
          <div className="max-w-screen-xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedUser(null)}
                className="rounded-full"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <span className="text-lg font-bold text-[#1a1a2e]">{p.name}</span>
              <Badge className={
                p.role === "admin" ? "bg-purple-100 text-purple-700 border-purple-200" :
                p.role === "teacher" ? "bg-blue-100 text-blue-700 border-blue-200" :
                p.role === "user" ? "bg-green-100 text-green-700 border-green-200" :
                "bg-gray-100 text-gray-600 border-gray-200"
              }>
                {p.role}
              </Badge>
            </div>
            {isViewerAdmin && (
              <div className="flex gap-2">
                <select
                  value={p.role}
                  onChange={(e) => requestRoleChange(p.id, e.target.value)}
                  className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium bg-white focus:outline-none focus:border-[#6b4c9a]"
                >
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="user">User</option>
                  <option value="subscriber">Subscriber</option>
                </select>
                <Button size="sm" variant="outline" onClick={() => deleteUserRecords(p.id)} className="rounded-full text-red-600 border-red-300 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-1" /> Clear Data
                </Button>
                <Button size="sm" variant="outline" onClick={() => deleteUser(p.id)} className="rounded-full text-red-600 bg-red-50 border-red-400 hover:bg-red-100">
                  <Trash2 className="w-4 h-4 mr-1" /> Delete User
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 py-8">
          {/* User info */}
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

  // Users list view
  return (
    <main className="min-h-screen bg-grid" style={{ backgroundColor: "var(--background)" }}>
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#1a1a2e] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#6b4c9a]" /> User Management
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
            { icon: Users, value: totalUsers, label: "Total Users", color: "text-[#6b4c9a]" },
            { icon: Activity, value: activeUsers, label: "Active Users", color: "text-green-600" },
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

        {/* Users table */}
        <Card className="border-2 border-[#e2ddd5] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2ddd5] bg-gray-50/50">
                  <th className="text-left px-4 py-3 font-medium text-[#1a1a2e]">User</th>
                  <th className="text-left px-4 py-3 font-medium text-[#1a1a2e]">Role</th>
                  <th className="text-center px-4 py-3 font-medium text-[#1a1a2e]">Tests</th>
                  <th className="text-center px-4 py-3 font-medium text-[#1a1a2e]">Avg Score</th>
                  <th className="text-left px-4 py-3 font-medium text-[#1a1a2e]">Last Active</th>
                  <th className="text-left px-4 py-3 font-medium text-[#1a1a2e]">Joined</th>
                  <th className="text-right px-4 py-3 font-medium text-[#1a1a2e]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Admin users */}
                {adminUsers.map((u) => (
                  <tr key={u.id} className="border-b border-[#e2ddd5] hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <button onClick={() => fetchUserDetail(u.id)} className="text-left hover:underline">
                        <p className="font-medium text-[#1a1a2e]">{u.name || "—"}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="bg-purple-100 text-purple-700 border-purple-200 border">{u.role}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center font-medium">{u.testCount}</td>
                    <td className="px-4 py-3 text-center">
                      {u.testCount > 0 ? (
                        <span className={`font-bold ${scoreColor(u.avgScore)}`}>{u.avgScore}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">{timeAgo(u.lastActive)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(new Date(u.created_at))}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="outline" onClick={() => fetchUserDetail(u.id)} className="rounded-full text-xs px-3">
                          View
                        </Button>
                        {isViewerAdmin && (
                          <select
                            value={u.role}
                            onChange={(e) => requestRoleChange(u.id, e.target.value)}
                            className="rounded-full border border-gray-300 px-2 py-1 text-xs font-medium bg-white focus:outline-none focus:border-[#6b4c9a]"
                          >
                            <option value="admin">Admin</option>
                            <option value="teacher">Teacher</option>
                            <option value="user">User</option>
                            <option value="subscriber">Subscriber</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Teachers with accordion */}
                {teacherUsers.map((t) => {
                  const assignedStudents = teacherStudentsMap.get(t.id) || [];
                  const isExpanded = expandedTeachers.has(t.id);
                  return (
                    <React.Fragment key={t.id}>
                      {/* Teacher row */}
                      <tr className="border-b border-[#e2ddd5] bg-blue-50/30 hover:bg-blue-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {assignedStudents.length > 0 && (
                              <button
                                onClick={() => toggleTeacher(t.id)}
                                className="p-0.5 rounded hover:bg-blue-100 transition-colors"
                              >
                                {isExpanded
                                  ? <ChevronDown className="w-4 h-4 text-blue-600" />
                                  : <ChevronRight className="w-4 h-4 text-blue-600" />
                                }
                              </button>
                            )}
                            <button onClick={() => fetchUserDetail(t.id)} className="text-left hover:underline">
                              <p className="font-medium text-[#1a1a2e]">{t.name || "—"}</p>
                              <p className="text-xs text-muted-foreground">{t.email}</p>
                            </button>
                            {assignedStudents.length > 0 && (
                              <span className="text-[10px] font-medium text-blue-600 bg-blue-100 border border-blue-200 rounded-full px-1.5 py-0.5">
                                {assignedStudents.length} student{assignedStudents.length !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200 border">{t.role}</Badge>
                        </td>
                        <td className="px-4 py-3 text-center font-medium">{t.testCount}</td>
                        <td className="px-4 py-3 text-center">
                          {t.testCount > 0 ? (
                            <span className={`font-bold ${scoreColor(t.avgScore)}`}>{t.avgScore}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-muted-foreground">{timeAgo(t.lastActive)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-muted-foreground">
                            {new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(new Date(t.created_at))}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="outline" onClick={() => fetchUserDetail(t.id)} className="rounded-full text-xs px-3">
                              View
                            </Button>
                            {isViewerAdmin && (
                              <select
                                value={t.role}
                                onChange={(e) => requestRoleChange(t.id, e.target.value)}
                                className="rounded-full border border-gray-300 px-2 py-1 text-xs font-medium bg-white focus:outline-none focus:border-[#6b4c9a]"
                              >
                                <option value="admin">Admin</option>
                                <option value="teacher">Teacher</option>
                                <option value="user">User</option>
                                <option value="subscriber">Subscriber</option>
                              </select>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Nested assigned students */}
                      {isExpanded && assignedStudents.map((s) => (
                        <tr key={s.id} className="border-b border-[#e2ddd5] bg-blue-50/10 hover:bg-blue-50/30 transition-colors">
                          <td className="py-3 pr-4 pl-12">
                            <button onClick={() => fetchUserDetail(s.id)} className="text-left hover:underline">
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
                            <span className="text-xs text-muted-foreground">
                              {new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(new Date(s.created_at))}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-1 justify-end">
                              <Button size="sm" variant="outline" onClick={() => fetchUserDetail(s.id)} className="rounded-full text-xs px-3">
                                View
                              </Button>
                              {isViewerAdmin && (
                                <>
                                  <select
                                    value={t.id}
                                    onChange={(e) => assignStudent(s.id, e.target.value)}
                                    className="rounded-full border border-gray-300 px-2 py-1 text-xs font-medium bg-white focus:outline-none focus:border-[#6b4c9a] max-w-[120px]"
                                  >
                                    <option value="">Unassign</option>
                                    {teachers.map((teacher) => (
                                      <option key={teacher.id} value={teacher.id}>{teacher.name || teacher.email}</option>
                                    ))}
                                  </select>
                                  <select
                                    value={s.role}
                                    onChange={(e) => requestRoleChange(s.id, e.target.value)}
                                    className="rounded-full border border-gray-300 px-2 py-1 text-xs font-medium bg-white focus:outline-none focus:border-[#6b4c9a]"
                                  >
                                    <option value="admin">Admin</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="user">User</option>
                                    <option value="subscriber">Subscriber</option>
                                  </select>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}

                {/* Unassigned users/subscribers */}
                {unassignedUsers.length > 0 && (adminUsers.length > 0 || teacherUsers.length > 0) && (
                  <tr>
                    <td colSpan={7} className="px-4 py-2 bg-gray-50/50">
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Unassigned</span>
                    </td>
                  </tr>
                )}
                {unassignedUsers.map((u) => (
                  <tr key={u.id} className="border-b border-[#e2ddd5] hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <button onClick={() => fetchUserDetail(u.id)} className="text-left hover:underline">
                        <p className="font-medium text-[#1a1a2e]">{u.name || "—"}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={
                        u.role === "user" ? "bg-green-100 text-green-700 border-green-200 border" :
                        "bg-gray-100 text-gray-600 border-gray-200 border"
                      }>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center font-medium">{u.testCount}</td>
                    <td className="px-4 py-3 text-center">
                      {u.testCount > 0 ? (
                        <span className={`font-bold ${scoreColor(u.avgScore)}`}>{u.avgScore}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">{timeAgo(u.lastActive)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(new Date(u.created_at))}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="outline" onClick={() => fetchUserDetail(u.id)} className="rounded-full text-xs px-3">
                          View
                        </Button>
                        {isViewerAdmin && (
                          <>
                            <select
                              value=""
                              onChange={(e) => assignStudent(u.id, e.target.value)}
                              className="rounded-full border border-gray-300 px-2 py-1 text-xs font-medium bg-white focus:outline-none focus:border-[#6b4c9a] max-w-[120px]"
                            >
                              <option value="">Assign to...</option>
                              {teachers.map((t) => (
                                <option key={t.id} value={t.id}>{t.name || t.email}</option>
                              ))}
                            </select>
                            <select
                              value={u.role}
                              onChange={(e) => requestRoleChange(u.id, e.target.value)}
                              className="rounded-full border border-gray-300 px-2 py-1 text-xs font-medium bg-white focus:outline-none focus:border-[#6b4c9a]"
                            >
                              <option value="admin">Admin</option>
                              <option value="teacher">Teacher</option>
                              <option value="user">User</option>
                              <option value="subscriber">Subscriber</option>
                            </select>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No users found.
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

      {/* Role change confirmation dialog */}
      <AlertDialog.Root open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop className="fixed inset-0 bg-black/40 z-50 transition-opacity" />
          <AlertDialog.Popup className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl border-2 border-[#e2ddd5] bg-white p-6 shadow-xl">
            <AlertDialog.Title className="text-lg font-bold text-[#1a1a2e]">
              Confirm Role Change
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
              {pendingRoleChange && (
                <>
                  Change <span className="font-semibold text-[#1a1a2e]">{pendingRoleChange.userName}</span>&apos;s role from{" "}
                  <Badge className={
                    pendingRoleChange.currentRole === "admin" ? "bg-purple-100 text-purple-700 border-purple-200 border" :
                    pendingRoleChange.currentRole === "teacher" ? "bg-blue-100 text-blue-700 border-blue-200 border" :
                    pendingRoleChange.currentRole === "user" ? "bg-green-100 text-green-700 border-green-200 border" :
                    "bg-gray-100 text-gray-600 border-gray-200 border"
                  }>
                    {pendingRoleChange.currentRole}
                  </Badge>{" "}
                  to{" "}
                  <Badge className={
                    pendingRoleChange.newRole === "admin" ? "bg-purple-100 text-purple-700 border-purple-200 border" :
                    pendingRoleChange.newRole === "teacher" ? "bg-blue-100 text-blue-700 border-blue-200 border" :
                    pendingRoleChange.newRole === "user" ? "bg-green-100 text-green-700 border-green-200 border" :
                    "bg-gray-100 text-gray-600 border-gray-200 border"
                  }>
                    {pendingRoleChange.newRole}
                  </Badge>
                  ?
                </>
              )}
            </AlertDialog.Description>
            <div className="mt-6 flex justify-end gap-3">
              <AlertDialog.Close
                className="px-4 py-2 rounded-full text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => setPendingRoleChange(null)}
              >
                Cancel
              </AlertDialog.Close>
              <button
                onClick={confirmRoleChange}
                className="px-4 py-2 rounded-full text-sm font-medium bg-[#6b4c9a] text-white hover:bg-[#5a3d85] transition-colors"
              >
                Confirm
              </button>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </main>
  );
}
