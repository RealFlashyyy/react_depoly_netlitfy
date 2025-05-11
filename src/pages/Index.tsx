
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import QuizCategories from "@/components/QuizCategories";
import TestimonialSection from "@/components/TestimonialSection";
import CallToAction from "@/components/CallToAction";

const Index = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <HeroSection />

      {/* Feature Section */}
      <FeatureSection />

      {/* Quiz Categories Preview */}
      <QuizCategories />

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* Call To Action */}
      <CallToAction />
    </div>
  );
};

export default Index;
