
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-quiz-purple to-quiz-blue">
      <div className="quiz-container text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Test Your Knowledge?
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
          Join thousands of learners expanding their horizons through our engaging quizzes. 
          Start your learning journey today!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-white text-quiz-purple hover:bg-gray-100">
            <Link to="/quizzes">Explore Quizzes</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
