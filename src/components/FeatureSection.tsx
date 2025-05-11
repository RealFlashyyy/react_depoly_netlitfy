
import { 
  Brain, 
  Medal, 
  BarChart3, 
  ClipboardCheck, 
  Users, 
  Shield 
} from "lucide-react";

const features = [
  {
    icon: <Brain className="h-10 w-10 text-quiz-purple" />,
    title: "Knowledge Enhancement",
    description: "Improve your understanding across various subjects with targeted quizzes designed by experts."
  },
  {
    icon: <Medal className="h-10 w-10 text-quiz-purple" />,
    title: "Get Feedback From Experts",
    description: "Earn amazing feedback from experts regarding how well you are doing for your quizzes."
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-quiz-purple" />,
    title: "Detailed Analytics",
    description: "Get insights into your performance with comprehensive statistics and improvement suggestions."
  },
  {
    icon: <ClipboardCheck className="h-10 w-10 text-quiz-purple" />,
    title: "Diverse Question Types",
    description: "Experience multiple question formats including MCQs, true/false, matching, and more."
  },
  {
    icon: <Users className="h-10 w-10 text-quiz-purple" />,
    title: "Community Challenges",
    description: "Compete with friends and other users in timed challenges and themed competitions."
  },
  {
    icon: <Shield className="h-10 w-10 text-quiz-purple" />,
    title: "Verified Content",
    description: "All quizzes are created by subject matter experts and regularly updated for accuracy."
  }
];

const FeatureSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="quiz-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="gradient-text">Why Choose</span> Our Quiz Platform?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform offers engaging features designed to make learning enjoyable and effective
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="quiz-card flex flex-col items-start p-8 hover:border-quiz-purple-light"
            >
              <div className="mb-5">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-quiz-purple-dark">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
