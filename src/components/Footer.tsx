
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-quiz-dark-purple text-white">
      <div className="quiz-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <div className="h-8 w-8 bg-quiz-purple rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <span className="ml-2 text-xl font-bold">QuizMaster</span>
            </div>
            <p className="text-gray-300 mb-6">
              Expanding minds through interactive and engaging quizzes. Learn, challenge yourself, and grow with us.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/quizzes" className="text-gray-300 hover:text-white transition-colors">
                  Explore Quizzes
                </Link>
              </li>
              <li>
                <Link to="/quizzes" className="text-gray-300 hover:text-white transition-colors">
                  Popular Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/quizzes" className="text-gray-300 hover:text-white transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/quizzes" className="text-gray-300 hover:text-white transition-colors">
                  Science
                </Link>
              </li>
              <li>
                <Link to="/quizzes" className="text-gray-300 hover:text-white transition-colors">
                  Literature
                </Link>
              </li>
              <li>
                <Link to="/quizzes" className="text-gray-300 hover:text-white transition-colors">
                  General Knowledge
                </Link>
              </li>
              <li>
                <Link to="/quizzes" className="text-gray-300 hover:text-white transition-colors">
                  Geography
                </Link>
              </li>
              <li>
                <Link to="/quizzes" className="text-gray-300 hover:text-white transition-colors">
                  Health
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-quiz-purple mr-3 mt-0.5" />
                <span className="text-gray-300">
                  1 Chruch Walk, London, LE10 1DW
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-quiz-purple mr-3" />
                <span className="text-gray-300">+44 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-quiz-purple mr-3" />
                <span className="text-gray-300">contact@quizmaster.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} QuizMaster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
