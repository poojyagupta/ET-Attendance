export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-center py-4 mt-10">
      <p className="text-sm">
        © {new Date().getFullYear()} ET Attendance System
      </p>

      <p className="text-xs text-gray-400 mt-1">Built for EasyTutors</p>
    </footer>
  );
}
