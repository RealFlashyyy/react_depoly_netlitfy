
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, MoreHorizontal, Trash, Edit, FileQuestion, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/dataUtils";
import { QuizType } from "@/utils/dataUtils";

type QuizTableProps = {
  quizzes: QuizType[];
  onDeleteQuiz: (id: number) => void;
  onDuplicateQuiz: (id: number) => void;
  onEditQuestions?: (id: number) => void;
};

const QuizTable = ({ quizzes, onDeleteQuiz, onDuplicateQuiz, onEditQuestions }: QuizTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Questions</TableHead>
          <TableHead>Attempts</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quizzes.map((quiz) => (
          <TableRow key={quiz.id}>
            <TableCell className="font-medium">{quiz.title}</TableCell>
            <TableCell>{quiz.category}</TableCell>
            <TableCell>{quiz.questionsCount}</TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {quiz.attempts}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge 
                variant={quiz.status === "Published" ? "default" : "outline"}
                className={quiz.status === "Published" ? "bg-green-500" : ""}
              >
                {quiz.status}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(quiz.lastUpdated)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onDuplicateQuiz(quiz.id)}
                    className="cursor-pointer"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Duplicate</span>
                  </DropdownMenuItem>
                  {onEditQuestions && (
                    <DropdownMenuItem
                      onClick={() => onEditQuestions(quiz.id)}
                      className="cursor-pointer"
                    >
                      <FileQuestion className="mr-2 h-4 w-4" />
                      <span>Edit Questions</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => onDeleteQuiz(quiz.id)}
                    className="cursor-pointer text-red-600"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default QuizTable;
