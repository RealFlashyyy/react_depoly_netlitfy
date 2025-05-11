
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, Book, Award, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-accent to-background py-20 sm:py-32">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNCQkJCQkIiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTZWMGg2djMwem0tNiAwSDI0VjBoNnYzMHpNMzYgNDJ2MThoLTZWNDJoNnptLTYgMGgtNnYxOGg2VjQyeiIvPjwvZz48L2c+PC9zdmc+')] bg-center opacity-10"></div>
      <div className="quiz-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="gradient-text">Learn & Shine</span> With Interactive Quizzes
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Expand your knowledge through fun, engaging quizzes across various categories. 
              Perfect for students, professionals, and curious minds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-quiz-purple hover:bg-quiz-purple-dark">
                <Link to="/quizzes">Explore Quizzes</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-quiz-purple" />
                <span>30+ Quizzes</span>
              </div>
              <div className="flex items-center gap-2">
                <Book className="h-5 w-5 text-quiz-purple" />
                <span>20+ Categories</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-quiz-purple" />
                <span>10K+ Users</span>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] w-full lg:h-[600px]">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
              <div className="glass-card absolute w-64 h-44 md:w-80 md:h-56 left-0 top-0 bg-white p-6 shadow-lg rounded-lg z-20 transform -rotate-6">
                <div className="font-semibold text-lg text-quiz-purple-dark mb-2">Science Quiz</div>
                <div className="text-sm text-muted-foreground mb-4">Test your knowledge of biology, chemistry, and physics</div>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-quiz-purple" />
                  <span className="text-sm font-medium">42 questions</span>
                </div>
              </div>
              <div className="glass-card absolute w-64 h-44 md:w-80 md:h-56 right-0 bottom-0 bg-white p-6 shadow-lg rounded-lg z-10 transform rotate-6">
                <div className="font-semibold text-lg text-quiz-purple-dark mb-2">History Quiz</div>
                <div className="text-sm text-muted-foreground mb-4">Journey through important historical events</div>
                <div className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-quiz-purple" />
                  <span className="text-sm font-medium">38 questions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
