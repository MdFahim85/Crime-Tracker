import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 text-white px-4">
      <h1 className="text-[8rem] font-extrabold tracking-widest drop-shadow-lg">
        404
      </h1>
      <div className="bg-red-500 px-3 py-1 rounded rotate-12 absolute">
        Page Not Found
      </div>

      <p className="mt-8 text-lg text-gray-300 text-center max-w-md">
        Oops! The page you're looking for doesn’t exist or has been moved. But
        don't worry — you can find your way back.
      </p>

      <Link
        to="/"
        className="mt-6 inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg transition-transform duration-200 hover:scale-105"
      >
        Take Me Home
      </Link>

      <div className="absolute bottom-4 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} CrimeTracker
      </div>
    </div>
  );
}

export default NotFound;
