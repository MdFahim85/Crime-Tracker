import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
function Home() {
  return (
    <div className="flex flex-col gap-y-5 justify-center items-center h-screen bg-[url(/bg.jpg)] bg-cover bg-center bg-slate-800 bg-blend-overlay">
      <div className="px-2 space-y-4 text-center">
        <h1 className="py-2 text-xl md:text-3xl xl:text-6xl text-white font-semibold">
          CrimeTracker
        </h1>
        <h3 className="text-lg md:text-2xl xl:text-3xl text-white font-semibold">
          Report, Track, Prevent - For a Safer Tomorrow
        </h3>
        <p className="text-wrap text-sm md:text-lg text-white font-medium">
          Safeguarding Together - Your Bridge to a Secure Environment
        </p>
      </div>
      <Link to="/report">
        <Button className=" bg-slate-500 text-white hover:bg-slate-700">
          Report a Crime
        </Button>
      </Link>
    </div>
  );
}

export default Home;
