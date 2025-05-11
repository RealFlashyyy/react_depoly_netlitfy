
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Clock, 
  User, 
  Star, 
  CheckCircle2, 
  BookOpen,
  Brain,
  Code, 
  Globe, 
  Lightbulb,
  HeartPulse
} from "lucide-react";
import { useQuiz } from "@/contexts/QuizContext";
import { QuizType } from "@/types/quiz";

const categoryIcons: Record<string, JSX.Element> = {
  "technology": <Code className="h-4 w-4" />,
  "science": <Brain className="h-4 w-4" />,
  "literature": <BookOpen className="h-4 w-4" />,
  "general": <Lightbulb className="h-4 w-4" />,
  "geography": <Globe className="h-4 w-4" />,
  "health": <HeartPulse className="h-4 w-4" />
};

const difficultyColors: Record<string, string> = {
  "Beginner": "bg-green-100 text-green-800",
  "Intermediate": "bg-blue-100 text-blue-800",
  "Advanced": "bg-purple-100 text-purple-800"
};

// Define a consistent type for category tabs
interface CategoryTab {
  id: string;
  name: string;
  icon?: JSX.Element;
}

const QuizzesPage = () => {
  const { categories, quizzes, fetchInitialData } = useQuiz();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchInitialData();
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    // Remove fetchInitialData from dependency array to prevent infinite loop
  }, []);
  
  const filteredQuizzes = quizzes.filter(quiz => {
    // Only show published quizzes
    if (quiz.status !== 'Published') return false;
    
    const matchesCategory = activeCategory === "all" || 
                           quiz.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Create categories tabs from the fetched categories with a consistent type
  const categoryTabs: CategoryTab[] = [
    { id: "all", name: "All Categories" },
    ...categories.map(cat => ({
      id: cat.name.toLowerCase(),
      name: cat.name,
      icon: categoryIcons[cat.icon.toLowerCase()] || <BookOpen className="h-4 w-4" />
    }))
  ];

  const handleStartQuiz = (quizId: number) => {
    navigate(`/quiz/${quizId}`);
  };

  if (isLoading) {
    return (
      <div className="py-12 bg-background animate-fade-in">
        <div className="quiz-container">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Explore Our Quizzes</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Loading quizzes...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-quiz-purple border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-background animate-fade-in">
      <div className="quiz-container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Explore Our Quizzes</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover quizzes across various categories to challenge yourself and expand your knowledge
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search quizzes..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        
        {/* Categories Tabs */}
        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveCategory} value={activeCategory}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 overflow-x-auto">
            {categoryTabs.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                {/* Safely use optional icon property */}
                {category.icon}
                <span className="hidden md:inline">{category.name}</span>
                <span className="inline md:hidden">{category.id === "all" ? "All" : category.name.split(" ")[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* Quiz Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.length > 0 ? (
              filteredQuizzes.map(quiz => (
                <Card key={quiz.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={quiz.thumbnailUrl || "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&h=400&q=80"} 
                      alt={quiz.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <Badge className={difficultyColors[quiz.difficulty] || "bg-gray-100 text-gray-800"}>
                        {quiz.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">{quiz.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{quiz.description}</p>
                    <div className="flex flex-wrap gap-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1 mr-4">
                        <CheckCircle2 className="h-4 w-4 text-quiz-purple" />
                        <span>{quiz.questionsCount} Questions</span>
                      </div>
                      <div className="flex items-center gap-1 mr-4">
                        <Clock className="h-4 w-4 text-quiz-purple" />
                        <span>{quiz.timeEstimate}</span>
                      </div>
                      <div className="flex items-center gap-1 mr-4">
                        <User className="h-4 w-4 text-quiz-purple" />
                        <span>{quiz.attempts.toLocaleString()} Attempts</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span>{quiz.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-quiz-purple hover:bg-quiz-purple-dark"
                      onClick={() => handleStartQuiz(quiz.id)}
                    >
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-muted-foreground">No quizzes found matching your criteria</p>
                <Button 
                  variant="link" 
                  className="text-quiz-purple mt-2"
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchTerm("");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default QuizzesPage;
