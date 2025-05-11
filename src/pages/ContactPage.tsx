
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Send,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ContactPage = () => {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you soon.",
        variant: "default"
      });
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }, 1500);
  };

  return (
    <div className="bg-background animate-fade-in">
      {/* Hero Section */}
      <section className="pyc-20 bg-gradient-to-b from-quiz-purple/10 to-background">
        <div className="quiz-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Get in</span> Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Have questions, feedback, or suggestions? We'd love to hear from you! 
            Reach out to our team using the contact information below or fill out the form.
          </p>
        </div>
      </section>
      
      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="quiz-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="quiz-card">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-quiz-purple/10 p-3 rounded-full mb-4">
                  <MapPin className="h-6 w-6 text-quiz-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Our Location</h3>
                <p className="text-muted-foreground">
                  1 Chruch Walk<br />
                  London, LE10 1DW<br />
                  United Kingdom
                </p>
              </CardContent>
            </Card>
            
            <Card className="quiz-card">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-quiz-purple/10 p-3 rounded-full mb-4">
                  <Mail className="h-6 w-6 text-quiz-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <p className="text-muted-foreground mb-1">
                  General Inquiries:
                </p>
                <a href="mailto:contact@quizmaster.com" className="text-quiz-purple hover:text-quiz-purple-dark">
                  contact@quizmaster.com
                </a>
                <p className="text-muted-foreground mt-2 mb-1">
                  Support:
                </p>
                <a href="mailto:support@quizmaster.com" className="text-quiz-purple hover:text-quiz-purple-dark">
                  support@quizmaster.com
                </a>
              </CardContent>
            </Card>
            
            <Card className="quiz-card">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-quiz-purple/10 p-3 rounded-full mb-4">
                  <Phone className="h-6 w-6 text-quiz-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <p className="text-muted-foreground mb-1">
                  Main Office:
                </p>
                <a href="tel:+15551234567" className="text-quiz-purple hover:text-quiz-purple-dark">
                  +44 (555) 123-4567
                </a>
                <p className="text-muted-foreground mt-3 mb-1">
                  Business Hours:
                </p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Monday - Friday: 9am - 5pm EST</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Contact Form & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Send Us a Message</h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>
              
              {isSubmitted ? (
                <Card className="quiz-card">
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div className="bg-green-100 p-3 rounded-full mb-6">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. We've received your message and will get back to you shortly.
                    </p>
                    <Button 
                      onClick={() => setIsSubmitted(false)}
                      className="bg-quiz-purple hover:bg-quiz-purple-dark"
                    >
                      Send Another Message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Your Name
                      </label>
                      <Input 
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        placeholder="John Smith"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Your Email
                      </label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input 
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea 
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      placeholder="Your message here..."
                      rows={6}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-quiz-purple hover:bg-quiz-purple-dark"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Our Location</h2>
                <p className="text-muted-foreground">
                  Find us at our headquarters in Knowledge City
                </p>
              </div>
              
              <div className="rounded-xl overflow-hidden h-[400px] shadow-lg">
                {/* Map placeholder - in a real application, this would be a Google Maps or other map integration */}
                <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-quiz-purple mb-3 mx-auto" />
                    <p className="text-muted-foreground">
                      Interactive map would be displayed here
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <Card className="flex-1 quiz-card">
                  <CardContent className="p-4 flex items-center gap-4">
                    <MessageSquare className="h-6 w-6 text-quiz-purple" />
                    <div>
                      <h3 className="font-medium">Live Chat</h3>
                      <p className="text-sm text-muted-foreground">Available 24/7</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="flex-1 quiz-card">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Mail className="h-6 w-6 text-quiz-purple" />
                    <div>
                      <h3 className="font-medium">Email Support</h3>
                      <p className="text-sm text-muted-foreground">Response within 24h</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="quiz-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="quiz-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">How do I create an account?</h3>
                <p className="text-muted-foreground">
                  Click on the "Sign Up" button in the top right corner of the page and follow the instructions to create your account.
                </p>
              </CardContent>
            </Card>
            
            <Card className="quiz-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Are all quizzes free to access?</h3>
                <p className="text-muted-foreground">
                  Yes, every quizz is free to access. You can choose between a mixture of categories of your choosing.
                </p>
              </CardContent>
            </Card>
            
            <Card className="quiz-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Can I create my own quizzes?</h3>
                <p className="text-muted-foreground">
                  No, only members that are experts can create the quizzes you can send feedback for what quizzes you want or feedback if you want to see your progress.
                </p>
              </CardContent>
            </Card>
            
            <Card className="quiz-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">How do I track my progress?</h3>
                <p className="text-muted-foreground">
                  An expert will email you your progress by using the contact information you can ask how your progress is. Quizmaster has a bunch of experts to help you with that.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
