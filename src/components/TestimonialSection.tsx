
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content: "This quiz platform has significantly improved my knowledge in various subjects. The diverse question formats keep me engaged.",
    author: "Alex Johnson",
    role: "University Student",
    rating: 5
  },
  {
    id: 2,
    content: "As a teacher, I find this platform incredibly useful for creating quizzes for my students. The analytics help me understand their progress.",
    author: "Sarah Williams",
    role: "High School Teacher",
    rating: 5
  },
  {
    id: 3,
    content: "The community challenges are my favorite feature. Competing with others makes learning much more exciting and motivating.",
    author: "Michael Chen",
    role: "Software Developer",
    rating: 4
  }
];

const TestimonialSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="quiz-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="gradient-text">What Our Users</span> Are Saying
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how our platform is helping people enhance their knowledge
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="quiz-card flex flex-col p-8"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <p className="text-foreground mb-6 flex-grow">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-quiz-purple-dark">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
