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
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Users</h1>

        <table className="w-full border">
          <thead className="bg-green-100">
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="text-center border">
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.status}</td>
                <td>
                  {u.status === "pending" && (
                    <form action="/api/approve" method="POST">
                      <input type="hidden" name="id" value={u.id} />
                      <button className="bg-green-600 text-white px-3 py-1 rounded">
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
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold text-green-700 mb-4">Schedules</h2>

        <table className="w-full border text-center">
          <thead className="bg-orange-100">
            <tr>
              <th>Teacher</th>
              <th>Student</th>
              <th>Days</th>
              <th>Timing</th>
              <th>Edit</th>
            </tr>
          </thead>

          <tbody>
            {schedules.map((s) => (
              <tr key={s.id} className="border">
                <td>{getName(s.teacherId)}</td>
                <td>{getName(s.parentId)}</td>
                <td>{s.days?.join(", ")}</td>
                <td>
                  {s.startTime} - {s.endTime}
                </td>
                <td>
                  <button
                    onClick={() => editSchedule(s)}
                    className="bg-orange-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
