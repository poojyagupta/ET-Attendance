"use client";

import { useEffect, useState } from "react";

export default function ParentClient() {
  const [today, setToday] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/parent/classes")
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((data) => {
        setToday(data.today);
        setAll(data.all);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  async function confirmAttendance(scheduleId, status) {
    await fetch("/api/attendance/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduleId, status }),
    });

    setToday((prev) =>
      prev.map((c) =>
        c.id === scheduleId ? { ...c, parentStatus: status } : c,
      ),
    );
  }

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-8 space-y-10">
      {/* TODAY */}
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-xl font-semibold mb-4">Today’s Class</h1>

        {today.length === 0 ? (
          <p className="text-gray-500">No class today 🎉</p>
        ) : (
          <table className="w-full border text-center">
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Time</th>
                <th>Confirm</th>
              </tr>
            </thead>
            <tbody>
              {today.map((c) => (
                <tr key={c.id} className="border">
                  <td>{c.teacherName}</td>
                  <td>
                    {c.startTime} – {c.endTime}
                  </td>

                  <td>
                    {c.parentStatus ? (
                      <span
                        className={`font-semibold ${
                          c.parentStatus === "present"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {c.parentStatus.toUpperCase()} ✓
                      </span>
                    ) : (
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => confirmAttendance(c.id, "present")}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        >
                          Present
                        </button>
                        <button
                          onClick={() => confirmAttendance(c.id, "absent")}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Absent
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

      {/* ALL */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">All Schedules</h2>

        <table className="w-full border text-center">
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Days</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {all.map((c) => (
              <tr key={c.id} className="border">
                <td>{c.teacherName}</td>
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
