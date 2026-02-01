"use client";

import { useState, useEffect } from "react";

export default function AdminClient({ users }) {
  const teachers = users.filter(
    (u) => u.role === "teacher" && u.status === "approved",
  );

  const parents = users.filter(
    (u) => u.role === "parent" && u.status === "approved",
  );

  const [teacherId, setTeacherId] = useState("");
  const [parentId, setParentId] = useState("");
  const [days, setDays] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [schedules, setSchedules] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // ✅ Load schedules
  useEffect(() => {
    fetch("/api/schedules")
      .then((r) => r.json())
      .then(setSchedules);
  }, []);

  function toggleDay(day) {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }

  async function saveSchedule() {
    await fetch("/api/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        teacherId,
        parentId,
        days,
        startTime,
        endTime,
      }),
    });

    alert(editingId ? "Updated!" : "Saved!");

    window.location.reload();
  }

  function editSchedule(s) {
    setEditingId(s.id);
    setTeacherId(s.teacherId);
    setParentId(s.parentId);
    setDays(s.days);
    setStartTime(s.startTime);
    setEndTime(s.endTime);
  }

  const getName = (id) =>
    users.find((u) => u.id === id)?.name ||
    users.find((u) => u.id === id)?.email;

  return (
    <div className="p-8 space-y-10 bg-gray-50 min-h-screen">
      {/* ================= USERS ================= */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b">
          <h1 className="text-lg font-semibold text-gray-800">Users</h1>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 capitalize">
                    {u.role}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.status === "pending" && (
                      <form action="/api/approve" method="POST">
                        <input type="hidden" name="id" value={u.id} />
                        <button className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md">
                          Approve
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= CREATE SCHEDULE ================= */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold text-orange-600 mb-4">
          {editingId ? "Edit Schedule" : "Create Schedule"}
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <select
            className="border p-2"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
          >
            <option>Select Teacher</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name || t.email}
              </option>
            ))}
          </select>

          <select
            className="border p-2"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
          >
            <option>Select Parent</option>
            {parents.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name || p.email}
              </option>
            ))}
          </select>
        </div>

        {/* Days */}
        <div className="mb-4">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <label key={day} className="mr-3">
              <input
                type="checkbox"
                checked={days.includes(day)}
                onChange={() => toggleDay(day)}
              />{" "}
              {day}
            </label>
          ))}
        </div>

        {/* Time */}
        <div className="space-x-3 mb-4">
          <input
            type="time"
            className="border p-2"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          <input
            type="time"
            className="border p-2"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <button
          onClick={saveSchedule}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
        >
          {editingId ? "Update" : "Save"}
        </button>
      </div>

      {/* ================= SCHEDULE TABLE ================= */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Schedules</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {["Teacher", "Student", "Days", "Timing", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {schedules.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{getName(s.teacherId)}</td>
                  <td className="px-6 py-4 text-sm">{getName(s.parentId)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {s.days?.join(", ")}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-700">
                    {s.startTime} – {s.endTime}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-sm text-orange-600 hover:underline">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
