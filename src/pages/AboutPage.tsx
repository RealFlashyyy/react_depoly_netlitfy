
import { Card, CardContent } from "@/components/ui/card";
import { 
  Lightbulb, 
  Target, 
  Rocket, 
  Users, 
  Bookmark,
  BarChart3,
  Award,
  CheckCircle2
} from "lucide-react";

const AboutPage = () => {
  return (
    <div className="bg-background animate-fade-in">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-quiz-purple/10 to-background">
        <div className="quiz-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">About</span> QuizMaster
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to make learning engaging, interactive, and accessible to everyone. 
            Our platform offers thousands of quizzes across various categories to help you expand your knowledge.
          </p>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="py-16">
        <div className="quiz-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                QuizMaster was founded in 2025 by a group of educators and technologists who believed that learning should be fun and engaging. We noticed that traditional educational methods often fail to keep students interested, leading to decreased retention and understanding.
              </p>
              <p className="text-muted-foreground mb-4">
                Our solution was to create an interactive quiz platform that makes learning enjoyable while providing valuable feedback and insights to help users track their progress and identify areas for improvement.
              </p>
              <p className="text-muted-foreground">
                Today, QuizMaster serves thousands of users worldwide, from students preparing for exams to professionals looking to expand their knowledge in various fields. Our platform continues to grow with new features and quizzes added regularly.
              </p>
            </div>
            <div className="relative">
              <div className="glass-card p-6 rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=600" 
                  alt="Team Collaboration" 
                  className="rounded-lg w-full h-auto shadow-lg"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-quiz-purple rounded-lg p-4 shadow-lg hidden md:block">
                <div className="text-white text-center">
                  <div className="text-4xl font-bold">5K+</div>
                  <div className="text-sm">Quizzes Created</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="quiz-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Vision</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              We're committed to transforming the way people learn and engage with educational content
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Card className="quiz-card">
              <CardContent className="p-8 flex flex-col items-start">
                <div className="bg-quiz-purple/10 p-3 rounded-lg mb-6">
                  <Lightbulb className="h-8 w-8 text-quiz-purple" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To create an engaging learning platform that makes education accessible, interactive, and enjoyable for everyone. We believe that learning should be a lifelong journey, and our mission is to provide the tools and resources to support that journey.
                </p>
              </CardContent>
            </Card>
            
            <Card className="quiz-card">
              <CardContent className="p-8 flex flex-col items-start">
                <div className="bg-quiz-purple/10 p-3 rounded-lg mb-6">
                  <Target className="h-8 w-8 text-quiz-purple" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To become the leading global platform for interactive learning, where users of all ages and backgrounds can expand their knowledge, challenge themselves, and track their progress. We envision a world where learning is integrated seamlessly into daily life.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Core Values */}
      <section className="py-16">
        <div className="quiz-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              These principles guide everything we do at QuizMaster
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="quiz-card p-6">
              <div className="bg-quiz-purple/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-quiz-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Inclusivity</h3>
              <p className="text-muted-foreground">
                We create content accessible to users of all backgrounds, abilities, and learning styles.
              </p>
            </div>
            
            <div className="quiz-card p-6">
              <div className="bg-quiz-purple/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="h-7 w-7 text-quiz-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously improve our platform with new features and learning methodologies.
              </p>
            </div>
            
            <div className="quiz-card p-6">
              <div className="bg-quiz-purple/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-7 w-7 text-quiz-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-muted-foreground">
                We strive for the highest quality in our content, user experience, and service.
              </p>
            </div>
            
            <div className="quiz-card p-6">
              <div className="bg-quiz-purple/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Bookmark className="h-7 w-7 text-quiz-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reliability</h3>
              <p className="text-muted-foreground">
                We provide accurate, fact-checked content that users can trust for their learning.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Key Features */}
      <section className="py-16 bg-accent/50">
        <div className="quiz-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Discover what makes QuizMaster the perfect platform for your learning journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-start">
              <div className="bg-white p-3 rounded-full mb-4">
                <BarChart3 className="h-7 w-7 text-quiz-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-muted-foreground">
                Track your progress and identify areas for improvement with comprehensive performance analytics.
              </p>
            </div>
            
            <div className="flex flex-col items-start">
              <div className="bg-white p-3 rounded-full mb-4">
                <CheckCircle2 className="h-7 w-7 text-quiz-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Diverse Question Types</h3>
              <p className="text-muted-foreground">
                Experience a variety of question formats including multiple choice, true/false, matching, and more.
              </p>
            </div>
            
            <div className="flex flex-col items-start">
              <div className="bg-white p-3 rounded-full mb-4">
                <Users className="h-7 w-7 text-quiz-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Challenges</h3>
              <p className="text-muted-foreground">
                Compete with friends and other users in timed challenges and themed competitions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
