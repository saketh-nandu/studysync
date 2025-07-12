import { FlashcardCreator } from "@/components/tools/flashcard-creator";
import { FormulaReference } from "@/components/tools/formula-reference";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  GraduationCap, 
  BookOpen, 
  Calculator, 
  Beaker, 
  Code, 
  Search, 
  Play, 
  BookMarked,
  HelpCircle,
  FileText,
  ChevronRight
} from "lucide-react";

export default function Academic() {
  const [searchTerm, setSearchTerm] = useState("");
  const [codeInput, setCodeInput] = useState('print("Hello, World!")');
  const { toast } = useToast();

  const [customFormulas, setCustomFormulas] = useState<any[]>([]);

  const questionBanks = [
    { name: "Mathematics Set A", questions: 25, topic: "Linear Algebra", difficulty: "Medium" },
    { name: "Physics Set B", questions: 30, topic: "Mechanics", difficulty: "Hard" },
    { name: "Chemistry Set C", questions: 20, topic: "Organic Chemistry", difficulty: "Easy" },
  ];

  const handleRunCode = () => {
    toast({
      title: "Code Executed",
      description: "Hello, World!",
    });
  };

  const handleDictionarySearch = () => {
    if (searchTerm.trim()) {
      toast({
        title: "Dictionary",
        description: `Searching for "${searchTerm}"...`,
      });
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Academic Tools</h1>
          <p className="text-text-secondary mt-1">Master your subjects with interactive learning tools</p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="outline" className="bg-blue-50">
            <GraduationCap className="w-3 h-3 mr-1" />
            Study Tools
          </Badge>
          <Badge variant="outline" className="bg-green-50">
            <BookOpen className="w-3 h-3 mr-1" />
            Practice
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Flashcard Creator */}
        <Card className="md:col-span-2 lg:col-span-1 card-hover animate-scale-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-purple-600" />
              </div>
              <span>Smart Flashcards</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FlashcardCreator />
          </CardContent>
        </Card>

        {/* Question Bank Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-blue-500" />
              </div>
              <span>Question Bank</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-4">Generate practice questions from content</p>
            <div className="space-y-3">
              {questionBanks.map((bank, index) => (
                <div key={index} className="bg-surface-variant p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{bank.name}</p>
                    <Badge variant={
                      bank.difficulty === 'Easy' ? 'outline' : 
                      bank.difficulty === 'Medium' ? 'secondary' : 'destructive'
                    }>
                      {bank.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-secondary">
                    {bank.questions} questions • {bank.topic}
                  </p>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" size="sm">
              Generate New Set
            </Button>
          </CardContent>
        </Card>

        {/* Research Paper Outline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-green-500" />
              </div>
              <span>Research Paper Outline</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-4">Structure your research papers</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <ChevronRight className="w-3 h-3" />
                <span>I. Introduction</span>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <ChevronRight className="w-3 h-3" />
                <span>A. Background</span>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <ChevronRight className="w-3 h-3" />
                <span>B. Thesis Statement</span>
              </div>
              <div className="flex items-center space-x-2">
                <ChevronRight className="w-3 h-3" />
                <span>II. Literature Review</span>
              </div>
              <div className="flex items-center space-x-2">
                <ChevronRight className="w-3 h-3" />
                <span>III. Methodology</span>
              </div>
              <div className="flex items-center space-x-2">
                <ChevronRight className="w-3 h-3" />
                <span>IV. Results</span>
              </div>
              <div className="flex items-center space-x-2">
                <ChevronRight className="w-3 h-3" />
                <span>V. Conclusion</span>
              </div>
            </div>
            <Button className="w-full mt-4" size="sm">
              Create Outline
            </Button>
          </CardContent>
        </Card>

        {/* Formula Reference */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Calculator className="w-4 h-4 text-orange-500" />
              </div>
              <span>Formula Reference</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormulaReference />
          </CardContent>
        </Card>

        {/* Code Compiler */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                <Code className="w-4 h-4 text-indigo-500" />
              </div>
              <span>Code Compiler</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-4">Run code in multiple languages</p>
            <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono mb-3">
              <div className="text-white mb-2">Python:</div>
              <div>{codeInput}</div>
              <div className="text-gray-400 mt-2">Output: Hello, World!</div>
            </div>
            <Button onClick={handleRunCode} size="sm" className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Run Code
            </Button>
          </CardContent>
        </Card>

        {/* Dictionary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                <BookMarked className="w-4 h-4 text-cyan-500" />
              </div>
              <span>Dictionary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-4">Comprehensive dictionary with offline access</p>
            <div className="flex space-x-2">
              <Input 
                type="text" 
                placeholder="Search word..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleDictionarySearch()}
              />
              <Button onClick={handleDictionarySearch} size="sm">
                <Search className="w-4 h-4" />
              </Button>
            </div>
            {searchTerm && (
              <div className="mt-3 p-3 bg-surface-variant rounded-lg">
                <p className="text-sm font-medium">No results found</p>
                <p className="text-xs text-text-secondary">Try searching for a different word</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
