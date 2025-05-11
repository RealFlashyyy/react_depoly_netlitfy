import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/components/AdminLayout";
import Index from "./pages/Index";
import QuizzesPage from "./pages/QuizzesPage";
import QuizTakingPage from "./pages/QuizTakingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminQuizzes from "./pages/admin/AdminQuizzes";
import QuizQuestions from "./pages/admin/QuizQuestions";
import AdminUsers from "./pages/admin/AdminUsers";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import NotFound from "./pages/NotFound";
import { QuizProvider } from "./contexts/QuizContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <QuizProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              
              {/* Client Routes */}
              <Route path="/" element={
                <MainLayout>
                  <Index />
                </MainLayout>
              } />
              <Route path="/quizzes" element={
                <MainLayout>
                  <QuizzesPage />
                </MainLayout>
              } />
              <Route path="/quiz/:quizId" element={
                <MainLayout>
                  <QuizTakingPage />
                </MainLayout>
              } />
              <Route path="/about" element={
                <MainLayout>
                  <AboutPage />
                </MainLayout>
              } />
              <Route path="/contact" element={
                <MainLayout>
                  <ContactPage />
                </MainLayout>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/quizzes" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <AdminQuizzes />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/quizzes/:quizId/questions" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <QuizQuestions />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <AdminUsers />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              
              {/* Catch All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QuizProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
