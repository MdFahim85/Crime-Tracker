import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col gap-y-10 justify-center items-center h-screen bg-[url(/bg.jpg)] bg-cover bg-center bg-emerald-950 bg-blend-overlay">
      <h1 className="text-2xl text-white font-semibold">
        Report, Track, Prevent - For a Safer Tomorrow
      </h1>
      <p className="text-md text-white font-medium">
        Safeguarding Together - Your Bridge to a Secure Environment
      </p>
      <Link
        to="/report"
        className="block mt-5 md:mt-0 py-2 px-4 rounded text-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600"
      >
        Report a Crime
      </Link>
    </div>
  );
}

export default Home;
