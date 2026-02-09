import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-background text-center px-4">
      <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          Delicious Food, <br className="hidden sm:inline" />
          <span className="text-primary">Delivered To You.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground w-full max-w-2xl mx-auto">
          Experience the best flavors in town. Order your favorite meals from top-rated restaurants and get them delivered hot and fresh.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/menu">
              View Menu <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link to="/menu">Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
