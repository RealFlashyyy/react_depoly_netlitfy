
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  Code, Brain, BookOpen, Lightbulb, Globe, HeartPulse, PlusCircle, Rocket
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categorySchema = z.object({
  name: z.string().min(3, { message: "Category name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  icon: z.string({ required_error: "Please select an icon" }),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

type CategoryDialogProps = {
  onCategorySave: (category: CategoryFormValues) => void;
};

const icons = [
  { value: "code", label: "Technology", icon: Code },
  { value: "brain", label: "Science", icon: Brain },
  { value: "book", label: "Literature", icon: BookOpen },
  { value: "lightbulb", label: "General Knowledge", icon: Lightbulb },
  { value: "globe", label: "Geography", icon: Globe },
  { value: "heart", label: "Health", icon: HeartPulse },
  { value: "rocket", label: "Space", icon: Rocket },
];

const CategoryDialog = ({ onCategorySave }: CategoryDialogProps) => {
  const [open, setOpen] = useState(false);
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
    },
  });

  const handleSubmit = (values: CategoryFormValues) => {
    onCategorySave(values);
    form.reset();
    setOpen(false);
    toast.success("Category created successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-quiz-purple hover:bg-quiz-purple-dark">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. History" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide a brief description of this category..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {icons.map((icon) => {
                        const Icon = icon.icon;
                        return (
                          <SelectItem key={icon.value} value={icon.value}>
                            <div className="flex items-center">
                              <Icon className="h-4 w-4 mr-2" />
                              <span>{icon.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-quiz-purple hover:bg-quiz-purple-dark">
                Create Category
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
