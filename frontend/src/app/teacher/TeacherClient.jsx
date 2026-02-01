"use client";

import { useEffect, useState } from "react";

export default function TeacherClient() {
  const [today, setToday] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  const todayDate = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    fetch("/api/teacher/classes")
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((data) => {
        setToday(data.today);
        setAll(data.all);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load classes:", err);
        setLoading(false);
      });
  }, []);

  async function markAttendance(scheduleId) {
    try {
      const res = await fetch("/api/attendance/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduleId,
          date: todayDate,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      // ✅ Update UI without reload
      setToday((prev) =>
        prev.map((c) =>
          c.id === scheduleId ? { ...c, teacherMarked: true } : c,
        ),
      );
    } catch (err) {
      console.error("Attendance error:", err);
      alert("Failed to save attendance");
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-10">
      {/* ===== TODAY'S CLASSES ===== */}
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-xl font-semibold mb-4">Today’s Classes</h1>

        {today.length === 0 ? (
          <p className="text-gray-500">No classes today 🎉</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr>
                <th>Student</th>
                <th>Time</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {today.map((c) => (
                <tr key={c.id} className="text-center border">
                  <td>{c.parentName}</td>
                  <td>
                    {c.startTime} – {c.endTime}
                  </td>
                  <td>
                    {c.teacherMarked ? (
                      <span className="text-green-600 font-semibold">
                        Present ✓
                      </span>
                    ) : (
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => markAttendance(c.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        >
                          Mark Present
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===== ALL SCHEDULES ===== */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">All My Schedules</h2>

        <table className="w-full border">
          <thead>
            <tr>
              <th>Student</th>
              <th>Days</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {all.map((c) => (
              <tr key={c.id} className="text-center border">
                <td>{c.parentName}</td>
                <td>{c.days.join(", ")}</td>
                <td>
                  {c.startTime} – {c.endTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
