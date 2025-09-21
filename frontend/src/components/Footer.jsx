import { Mail, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-6 mt-auto">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4">
        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="mailto:mortuza.aziz.47@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            <Mail size={22} />
          </a>

          <a
            href="https://github.com/mdfahim85"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            <Github size={22} />
          </a>

          <a
            href="https://www.linkedin.com/in/mdfahim85/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            <Linkedin size={22} />
          </a>
        </div>

        <p className="text-sm text-gray-400 text-center">
          © 2025 All rights reserved -{" "}
          <a
            href="mailto:mortuza.aziz.47@gmail.com"
            className="hover:text-blue-400"
          >
            mortuza.aziz.47@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}
