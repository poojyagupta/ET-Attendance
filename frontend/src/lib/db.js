import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

function readDB() {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export function getUsers() {
  return readDB().users;
}

export function addUser(user) {
  const db = readDB();
  db.users.push(user);
  writeDB(db);
}
export function addSchedule(schedule) {
  const db = readDB();

  const newSchedule = {
    id: Date.now().toString(), // ✅ ADD THIS
    ...schedule,
  };

  db.schedule.push(newSchedule);

  writeDB(db);
}

export function getSchedules() {
  return readDB().schedule;
}

export function approveUser(id) {
  const db = readDB();

  const user = db.users.find((u) => u.id === id);

  if (!user) return;

  user.status = "approved";

  writeDB(db);
}

export function updateSchedule(updatedSchedule) {
  const db = readDB();

  const index = db.schedule.findIndex((s) => s.id === updatedSchedule.id);

  if (index === -1) return;

  db.schedule[index] = updatedSchedule;

  writeDB(db);
}

export function getAttendance() {
  const db = readDB();
  return db.attendance || [];
}

export function saveTeacherAttendance({
  scheduleId,
  teacherId,
  date,
  status, // "present" | "absent"
}) {
  const db = readDB();

  const existing = db.attendance.find(
    (a) =>
      a.scheduleId === scheduleId &&
      a.date === date &&
      a.teacherId === teacherId,
  );

  if (existing) {
    existing.teacherStatus = status;
    existing.markedByTeacherAt = new Date().toISOString();
  } else {
    db.attendance.push({
      id: Date.now().toString(),
      scheduleId,
      teacherId,
      date,
      teacherStatus: status,
      parentStatus: "pending",
      markedByTeacherAt: new Date().toISOString(),
    });
  }

  writeDB(db);
}
export function saveParentAttendance({ scheduleId, parentId, date, status }) {
  const db = readDB();

  const existing = db.attendance.find(
    (a) => a.scheduleId === scheduleId && a.date === date,
  );

  if (!existing) return; // teacher must mark first

  existing.parentId = parentId;
  existing.parentStatus = status;
  existing.confirmedByParentAt = new Date().toISOString();

  writeDB(db);
}
