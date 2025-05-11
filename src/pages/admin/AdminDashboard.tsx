import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileQuestion, 
  Users, 
  BarChart3,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { useQuiz } from "@/contexts/QuizContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type QuizSubmission = {
  id: number;
  user: string;
  quiz: string;
  quizId: number;
  score: number;
  maxScore: number;
  date: string;
};

// Custom colors for charts
const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6'];

const AdminDashboard = () => {
  const { quizzes, categories, fetchInitialData } = useQuiz();
  const { toast } = useToast();
  const [recentSubmissions, setRecentSubmissions] = useState<QuizSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Initial loading state
  const [isRefreshLoading, setIsRefreshLoading] = useState(false); // Separate state for refresh operations
  const [activityData, setActivityData] = useState<any[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Used to trigger refreshes
  const [isRefreshing, setIsRefreshing] = useState(false); // State to prevent duplicate refreshes
  const [initialLoadComplete, setInitialLoadComplete] = useState(false); // Flag to track initial load
  const [uniqueUserCount, setUniqueUserCount] = useState(0);
  const [totalQuizAttempts, setTotalQuizAttempts] = useState(0);
  
  // Use refs to track debounce timer and subscription status
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastRefreshTimeRef = useRef<number>(0);
  const subscriptionSetupRef = useRef(false);
  const MIN_REFRESH_INTERVAL = 3000; // Minimum time between refreshes (3 seconds)
  
  // Function to safely trigger a refresh with debouncing
  const refreshDashboard = useCallback(() => {
    const now = Date.now();
    
    // Check if we're already refreshing or if we've refreshed too recently
    if (isRefreshing || now - lastRefreshTimeRef.current < MIN_REFRESH_INTERVAL) {
      console.log("Refresh skipped - already refreshing or too soon");
      return;
    }
    
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set a new timer to refresh after a delay
    debounceTimerRef.current = setTimeout(() => {
      console.log("Executing debounced refresh");
      setRefreshTrigger(prev => prev + 1);
      lastRefreshTimeRef.current = Date.now();
    }, 1000); // 1 second debounce time
    
  }, [isRefreshing]);
  
  // Initial data load - runs only once
  useEffect(() => {
    const initialLoad = async () => {
      setIsLoading(true);
      
      try {
        await fetchInitialData();
        
        // Fetch recent quiz submissions
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('quiz_submissions')
          .select('id, quizid, username, score, maxscore, completedat')
          .order('completedat', { ascending: false })
          .limit(10);
        
        if (submissionsError) throw submissionsError;
        
        // Get total number of quiz attempts
        const { data: totalAttemptsData, error: totalAttemptsError } = await supabase
          .from('quiz_submissions')
          .select('id', { count: 'exact' });
        
        if (totalAttemptsError) throw totalAttemptsError;
        
        // Get count of unique users
        const { data: uniqueUsersData, error: uniqueUsersError } = await supabase
          .from('quiz_submissions')
          .select('username')
          .order('username');
        
        if (uniqueUsersError) throw uniqueUsersError;
        
        // Count unique usernames
        const uniqueUsernames = new Set<string>();
        (uniqueUsersData || []).forEach(item => {
          if (item.username) uniqueUsernames.add(item.username);
        });
        
        setUniqueUserCount(uniqueUsernames.size);
        setTotalQuizAttempts(totalAttemptsData.length);
        
        const formattedSubmissions = (submissionsData || []).map((sub) => {
          // Find quiz title
          const quizTitle = quizzes.find(q => q.id === sub.quizid)?.title || 'Unknown Quiz';
          
          return {
            id: sub.id,
            user: sub.username,
            quiz: quizTitle,
            quizId: sub.quizid,
            score: sub.score,
            maxScore: sub.maxscore,
            date: formatDate(sub.completedat)
          };
        });
        
        setRecentSubmissions(formattedSubmissions);
        
        // Generate activity data (last 7 days)
        const activityStats = generateActivityData(submissionsData);
        setActivityData(activityStats);
        
        setInitialLoadComplete(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error loading dashboard data",
          description: "There was a problem loading the dashboard data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    initialLoad();
    // Run this effect only once
  }, []);
  
  // Effect for refresh data fetching only - depends on refreshTrigger
  useEffect(() => {
    // Skip the first run (which is handled by initialLoad)
    if (!initialLoadComplete) return;
    
    const refreshData = async () => {
      setIsRefreshing(true);
      setIsRefreshLoading(true); // Use refresh-specific loading state
      
      try {
        // Fetch recent quiz submissions without refetching quizzes/categories
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('quiz_submissions')
          .select('id, quizid, username, score, maxscore, completedat')
          .order('completedat', { ascending: false })
          .limit(10);
        
        if (submissionsError) throw submissionsError;
        
        // Get updated total number of quiz attempts
        const { data: totalAttemptsData, error: totalAttemptsError } = await supabase
          .from('quiz_submissions')
          .select('id', { count: 'exact' });
        
        if (totalAttemptsError) throw totalAttemptsError;
        
        // Get updated count of unique users
        const { data: uniqueUsersData, error: uniqueUsersError } = await supabase
          .from('quiz_submissions')
          .select('username')
          .order('username');
        
        if (uniqueUsersError) throw uniqueUsersError;
        
        // Count unique usernames
        const uniqueUsernames = new Set<string>();
        (uniqueUsersData || []).forEach(item => {
          if (item.username) uniqueUsernames.add(item.username);
        });
        
        setUniqueUserCount(uniqueUsernames.size);
        setTotalQuizAttempts(totalAttemptsData.length);
        
        const formattedSubmissions = (submissionsData || []).map((sub) => {
          // Find quiz title
          const quizTitle = quizzes.find(q => q.id === sub.quizid)?.title || 'Unknown Quiz';
          
          return {
            id: sub.id,
            user: sub.username,
            quiz: quizTitle,
            quizId: sub.quizid,
            score: sub.score,
            maxScore: sub.maxscore,
            date: formatDate(sub.completedat)
          };
        });
        
        setRecentSubmissions(formattedSubmissions);
        
        // Generate activity data (last 7 days)
        const activityStats = generateActivityData(submissionsData);
        setActivityData(activityStats);
        
      } catch (error) {
        console.error("Error refreshing data:", error);
        // Silent refresh failures, don't show toast for every refresh error
      } finally {
        setIsRefreshLoading(false);
        // Add a small delay before allowing new refreshes to prevent rapid successive updates
        setTimeout(() => {
          setIsRefreshing(false);
        }, 2000);
      }
    };
    
    refreshData();
  }, [quizzes, refreshTrigger, initialLoadComplete]);
  
  // Separate effect for subscription setup - runs only once
  useEffect(() => {
    // Don't set up subscription if it's already been set up
    if (subscriptionSetupRef.current) return;
    
    // Mark subscription as set up
    subscriptionSetupRef.current = true;
    
    // Set up real-time subscription for quiz submissions with improved debouncing
      console.log("Setting up real-time subscription");
      
      const channel = supabase
        .channel('dashboard-updates')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'quiz_submissions' 
          }, 
          (payload) => {
            console.log('Quiz submission changed:', payload.eventType, payload.new);
            refreshDashboard();
          }
        )
        .subscribe((status) => {
          console.log("Subscription status:", status);
        });
        
      return () => {
        console.log("Cleaning up real-time subscription");
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        supabase.removeChannel(channel);
      subscriptionSetupRef.current = false;
    };
  }, [refreshDashboard]);
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return diffMins <= 1 ? "just now" : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return diffDays === 1 ? "Yesterday" : `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Generate mock activity data based on submissions
  const generateActivityData = (submissions: any[] = []) => {
    const days = 7;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];
      
      // Count submissions for this day
      const daySubmissions = submissions.filter(sub => 
        new Date(sub.completedat).toISOString().split('T')[0] === dayStr
      ).length;
      
      data.push({
        name: i === 0 ? 'Today' : i === 1 ? 'Yesterday' : date.toLocaleDateString('en-US', { weekday: 'short' }),
        submissions: daySubmissions,
        date: dayStr,
      });
    }
    
    return data;
  };

  // Calculate statistics
  const publishedQuizzes = quizzes.filter(q => q.status === "Published").length;
  const draftQuizzes = quizzes.filter(q => q.status === "Draft").length;
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Quizzes</p>
                <h3 className="text-2xl font-bold mt-1">{quizzes.length}</h3>
              </div>
              <div className="p-3 bg-quiz-purple/10 rounded-full">
                <FileQuestion className="h-6 w-6 text-quiz-purple" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <div className="flex gap-2">
                <span className="text-green-500 font-medium">{publishedQuizzes} Published</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-amber-500 font-medium">{draftQuizzes} Draft</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <h3 className="text-2xl font-bold mt-1">{uniqueUserCount || 0}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">Active </span>
              <span className="text-muted-foreground ml-1">quiz participants</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quiz Attempts</p>
                <h3 className="text-2xl font-bold mt-1">{totalQuizAttempts || 0}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">Total </span>
              <span className="text-muted-foreground ml-1">quiz attempts</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts & Tables */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activityData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="submissions"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Recent Quiz Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-quiz-purple border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">User</th>
                      <th className="py-3 px-4 text-left font-medium">Quiz</th>
                      <th className="py-3 px-4 text-left font-medium">Score</th>
                      <th className="py-3 px-4 text-left font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSubmissions.length > 0 ? (
                      recentSubmissions.map((submission) => (
                        <tr key={submission.id} className="border-b">
                          <td className="py-3 px-4">{submission.user}</td>
                          <td className="py-3 px-4">{submission.quiz}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              (submission.score / submission.maxScore) * 100 >= 90 ? 'bg-green-100 text-green-800' : 
                              (submission.score / submission.maxScore) * 100 >= 70 ? 'bg-blue-100 text-blue-800' : 
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {`${submission.score}/${submission.maxScore} (${Math.round((submission.score / submission.maxScore) * 100)}%)`}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{submission.date}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-muted-foreground">
                          No quiz submissions yet
                        </td>
                      </tr>
                    )}
                    {isRefreshLoading && (
                      <tr>
                        <td colSpan={4} className="py-1 text-center">
                          <div className="inline-block animate-pulse text-xs text-muted-foreground">Refreshing data...</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
