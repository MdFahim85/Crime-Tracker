import { Link } from "react-router-dom";
import { Home, ArrowLeft, AlertTriangle, Compass } from "lucide-react";

function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white px-4 overflow-hidden">
      <div className="relative z-10 text-center mb-8">
        <div className="relative mb-8">
          <h1 className="text-[12rem] sm:text-[16rem] font-black tracking-wider drop-shadow-2xl bg-gradient-to-b from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            404
          </h1>
          <div className="absolute inset-0 text-[12rem] sm:text-[16rem] font-black tracking-wider text-blue-500/20 blur-sm">
            404
          </div>
        </div>

        <div className="relative mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-blue-500 px-6 py-3 rounded-xl rotate-3 shadow-2xl border border-blue-400/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-white animate-bounce" />
              <span className="text-white font-bold text-lg">
                Page Not Found
              </span>
            </div>
          </div>
        </div>

        <div className="mb-12 max-w-lg mx-auto">
          <p className="text-xl text-gray-300 leading-relaxed mb-4">
            Oops! Looks like you've wandeblue into uncharted territory.
          </p>
          <p className="text-gray-400">
            The page you're looking for doesn't exist or has been moved. But
            don't worry — we'll help you find your way back.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            to="/"
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25"
          >
            <Home className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            Take Me Home
            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
            Go Back
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm mt-5">
        <div className="flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} CrimeTracker</span>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
