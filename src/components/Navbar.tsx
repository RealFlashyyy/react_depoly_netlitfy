
import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogIn, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useContext(AuthContext);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Successfully signed out");
      navigate("/");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="quiz-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="h-8 w-8 bg-quiz-purple rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span className="ml-2 text-xl font-bold text-foreground">QuizMaster</span>
          </Link>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link 
              to="/" 
              className={`font-medium ${isActive('/') ? 'text-quiz-purple' : 'text-foreground hover:text-quiz-purple transition-colors'}`}
            >
              Home
            </Link>
            <Link 
              to="/quizzes" 
              className={`font-medium ${isActive('/quizzes') ? 'text-quiz-purple' : 'text-foreground hover:text-quiz-purple transition-colors'}`}
            >
              Quizzes
            </Link>
            <Link 
              to="/about" 
              className={`font-medium ${isActive('/about') ? 'text-quiz-purple' : 'text-foreground hover:text-quiz-purple transition-colors'}`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`font-medium ${isActive('/contact') ? 'text-quiz-purple' : 'text-foreground hover:text-quiz-purple transition-colors'}`}
            >
              Contact
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`font-medium ${isActive('/admin') ? 'text-quiz-purple' : 'text-foreground hover:text-quiz-purple transition-colors'}`}
              >
                Admin
              </Link>
            )}
          </div>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {user ? (
              <Button variant="outline" className="flex items-center gap-2" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => navigate("/signin")}
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
                <Button 
                  className="bg-quiz-purple hover:bg-quiz-purple-dark flex items-center gap-2"
                  onClick={() => navigate("/signup")}
                >
                  <User className="h-4 w-4" />
                  Sign Up
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md font-medium ${isActive('/') ? 'bg-accent text-quiz-purple' : 'text-foreground hover:bg-muted'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/quizzes" 
                className={`px-3 py-2 rounded-md font-medium ${isActive('/quizzes') ? 'bg-accent text-quiz-purple' : 'text-foreground hover:bg-muted'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Quizzes
              </Link>
              <Link 
                to="/about" 
                className={`px-3 py-2 rounded-md font-medium ${isActive('/about') ? 'bg-accent text-quiz-purple' : 'text-foreground hover:bg-muted'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className={`px-3 py-2 rounded-md font-medium ${isActive('/contact') ? 'bg-accent text-quiz-purple' : 'text-foreground hover:bg-muted'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className={`px-3 py-2 rounded-md font-medium ${isActive('/admin') ? 'bg-accent text-quiz-purple' : 'text-foreground hover:bg-muted'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <div className="flex flex-col space-y-2 pt-3 border-t border-border">
                {user ? (
                  <Button variant="outline" className="justify-start" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => {
                        navigate("/signin");
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                    <Button 
                      className="bg-quiz-purple hover:bg-quiz-purple-dark justify-start"
                      onClick={() => {
                        navigate("/signup");
                        setIsMenuOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
