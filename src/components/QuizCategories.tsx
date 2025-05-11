
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Brain, BookOpen, Lightbulb, Globe, HeartPulse } from "lucide-react";
import { useQuiz } from "@/contexts/QuizContext";

// Icon mapping
const iconMap: Record<string, JSX.Element> = {
  "code": <Code className="h-8 w-8 text-quiz-purple" />,
  "brain": <Brain className="h-8 w-8 text-quiz-purple" />,
  "book": <BookOpen className="h-8 w-8 text-quiz-purple" />,
  "lightbulb": <Lightbulb className="h-8 w-8 text-quiz-purple" />,
  "globe": <Globe className="h-8 w-8 text-quiz-purple" />,
  "heart": <HeartPulse className="h-8 w-8 text-quiz-purple" />
};

// Background color mapping
const bgColorMap: Record<string, string> = {
  "code": "bg-blue-50",
  "brain": "bg-green-50",
  "book": "bg-yellow-50",
  "lightbulb": "bg-orange-50",
  "globe": "bg-purple-50",
  "heart": "bg-pink-50"
};

const QuizCategories = () => {
  const { categories } = useQuiz();
  
  return (
    <section className="py-20 bg-accent/50">
      <div className="quiz-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="gradient-text">Popular</span> Quiz Categories
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Discover quizzes across a wide range of subjects to challenge yourself
            </p>
          </div>
          <Button asChild variant="link" className="text-quiz-purple mt-4 md:mt-0">
            <Link to="/quizzes" className="flex items-center gap-2">
              View all categories <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link to="/quizzes" key={category.id}>
              <div className={`quiz-card flex items-center gap-4 p-6 ${bgColorMap[category.icon] || 'bg-blue-50'} border-transparent hover:border-quiz-purple-light cursor-pointer`}>
                <div className="p-3 rounded-full bg-white">
                  {iconMap[category.icon] || <Code className="h-8 w-8 text-quiz-purple" />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.quizCount} quizzes</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuizCategories;
