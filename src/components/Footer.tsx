import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-slate-400 border-t border-slate-800 py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2">
           <span className="font-semibold text-slate-200">FoodOrder</span>
           <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <div className="flex gap-6">
            <Link to="/" className="hover:text-slate-200 transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-slate-200 transition-colors">Terms of Service</Link>
            <Link to="/" className="hover:text-slate-200 transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
