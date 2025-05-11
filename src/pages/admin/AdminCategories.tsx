
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  ArrowUpDown, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Code, 
  Brain,
  BookOpen,
  Lightbulb,
  Globe,
  HeartPulse,
  Rocket
} from "lucide-react";
import CategoryDialog from "@/components/admin/CategoryDialog";
import { toast } from "sonner";

const iconComponents = {
  code: <Code className="h-4 w-4" />,
  brain: <Brain className="h-4 w-4" />,
  book: <BookOpen className="h-4 w-4" />,
  lightbulb: <Lightbulb className="h-4 w-4" />,
  globe: <Globe className="h-4 w-4" />,
  heart: <HeartPulse className="h-4 w-4" />,
  rocket: <Rocket className="h-4 w-4" />,
};

// Initial categories data
const initialCategoriesData = [
  {
    id: 1,
    name: "Technology",
    icon: "code",
    quizCount: 24,
    description: "Quizzes related to programming, computers, and digital technology",
    createdAt: "2023-01-15"
  },
  {
    id: 2,
    name: "Science",
    icon: "brain",
    quizCount: 18,
    description: "Quizzes covering various fields of science including physics, chemistry, and biology",
    createdAt: "2023-01-20"
  },
  {
    id: 3,
    name: "Literature",
    icon: "book",
    quizCount: 15,
    description: "Test your knowledge of books, authors, and literary works",
    createdAt: "2023-02-05"
  },
  {
    id: 4,
    name: "General Knowledge",
    icon: "lightbulb",
    quizCount: 32,
    description: "A mix of questions covering a wide range of general topics",
    createdAt: "2023-02-10"
  },
  {
    id: 5,
    name: "Geography",
    icon: "globe",
    quizCount: 22,
    description: "Questions about countries, capitals, landmarks, and geographical features",
    createdAt: "2023-03-01"
  },
  {
    id: 6,
    name: "Health",
    icon: "heart",
    quizCount: 17,
    description: "Quizzes on health, nutrition, fitness, and medical knowledge",
    createdAt: "2023-03-15"
  }
];

const AdminCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState(initialCategoriesData);
  
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle adding a new category
  const handleAddCategory = (categoryData: any) => {
    const newCategory = {
      id: categories.length + 1,
      name: categoryData.name,
      icon: categoryData.icon,
      quizCount: 0,
      description: categoryData.description,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setCategories([...categories, newCategory]);
  };

  // Function to handle category deletion
  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(category => category.id !== id));
    toast.success("Category deleted successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>
        <CategoryDialog onCategorySave={handleAddCategory} />
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Manage Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search categories..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          
          {/* Table */}
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left font-medium">
                    <div className="flex items-center gap-1">
                      Name
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left font-medium hidden md:table-cell">Description</th>
                  <th className="py-3 px-4 text-left font-medium">Quizzes</th>
                  <th className="py-3 px-4 text-left font-medium hidden lg:table-cell">Created</th>
                  <th className="py-3 px-4 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 font-medium">
                        <div className="p-1 rounded-md bg-muted">
                          {iconComponents[category.icon as keyof typeof iconComponents]}
                        </div>
                        {category.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">
                      {category.description.length > 50 
                        ? `${category.description.substring(0, 50)}...` 
                        : category.description}
                    </td>
                    <td className="py-3 px-4">{category.quizCount}</td>
                    <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground">{category.createdAt}</td>
                    <td className="py-3 px-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="flex items-center gap-2 text-destructive"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filteredCategories.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">
                      No categories found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCategories;
