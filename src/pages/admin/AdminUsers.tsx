import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, DownloadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Define user type for the component
type UserType = {
  id: string;
  email: string;
  createdAt: string;
  lastActivity?: string;
  isAdmin: boolean;
  quizAttempts: number;
};

const AdminUsers = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user: currentUser } = useContext(AuthContext);

  // Admin email constant
  const ADMIN_EMAIL = "samsjohn024@gmail.com";

  // Load users from quiz_submissions table
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Get users from quiz submissions table
        const { data: submissions, error: submissionsError } = await supabase
          .from('quiz_submissions')
          .select('username, completedat')
          .order('completedat', { ascending: false });
        
        if (submissionsError) throw submissionsError;
        
        // Create a map to track unique users and their quiz attempts
        const userMap = new Map();
        
        // Add the current user even if they haven't submitted quizzes
        if (currentUser?.email) {
          userMap.set(currentUser.email, {
            id: currentUser.id,
            email: currentUser.email,
            createdAt: new Date(currentUser.created_at || Date.now()).toISOString(),
            lastActivity: new Date().toISOString(),
            isAdmin: currentUser.email === ADMIN_EMAIL,
            quizAttempts: 0
          });
        }
        
        // Process all submissions to count attempts and find most recent activity
        submissions?.forEach(sub => {
          if (sub.username) {
            if (userMap.has(sub.username)) {
              const userData = userMap.get(sub.username);
              userData.quizAttempts++;
              
              // Update last activity if this submission is more recent
              if (sub.completedat && (!userData.lastActivity || new Date(sub.completedat) > new Date(userData.lastActivity))) {
                userData.lastActivity = sub.completedat;
              }
              
              userMap.set(sub.username, userData);
            } else {
              userMap.set(sub.username, {
                id: crypto.randomUUID(),
                email: sub.username,
                createdAt: sub.completedat || new Date().toISOString(),
                lastActivity: sub.completedat,
                isAdmin: sub.username === ADMIN_EMAIL,
                quizAttempts: 1
              });
            }
          }
        });
        
        // Convert map to array and sort by latest activity
        const usersArray = Array.from(userMap.values()).sort((a, b) => {
          const dateA = a.lastActivity ? new Date(a.lastActivity) : new Date(0);
          const dateB = b.lastActivity ? new Date(b.lastActivity) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
        
        setUsers(usersArray);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get initials for avatar
  const getInitials = (email: string) => {
    if (!email || email === "Unknown") return "U";
    return email.charAt(0).toUpperCase();
  };

  // Export users list to CSV
  const exportUsersToCSV = () => {
    if (users.length === 0) {
      toast.error("No users to export");
      return;
    }
    
    // Create CSV content
    const headers = "Email,Role,Registered,Last Activity,Quiz Attempts\n";
    const csvContent = users.map(user => {
      return `"${user.email}","${user.isAdmin ? 'Admin' : 'User'}","${formatDate(user.createdAt)}","${formatDate(user.lastActivity)}",${user.quizAttempts}`;
    }).join("\n");
    
    // Create download link
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'quiz-users.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Users exported successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button
          variant="outline"
          onClick={exportUsersToCSV}
          className="flex items-center gap-2"
        >
          <DownloadCloud className="h-4 w-4" />
          Export Users
        </Button>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search users by email..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Registered Users</CardTitle>
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
                    <th className="py-3 px-4 text-left font-medium">Role</th>
                    <th className="py-3 px-4 text-left font-medium">Registered</th>
                    <th className="py-3 px-4 text-left font-medium">Last Activity</th>
                    <th className="py-3 px-4 text-center font-medium">Quiz Attempts</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 bg-quiz-purple/10">
                              <AvatarFallback className="text-quiz-purple font-medium">
                                {getInitials(user.email)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span 
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.isAdmin ? 'bg-quiz-purple/10 text-quiz-purple' : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {user.isAdmin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {formatDate(user.lastActivity)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                            {user.quizAttempts}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-muted-foreground">
                        {searchTerm ? "No users match your search" : "No users found"}
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
  );
};

export default AdminUsers; 