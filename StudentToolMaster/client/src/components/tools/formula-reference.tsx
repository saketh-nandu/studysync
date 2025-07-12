import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Search, 
  BookOpen, 
  Calculator, 
  Trash2, 
  Edit, 
  Copy, 
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Tag
} from "lucide-react";

interface Formula {
  id: string;
  name: string;
  formula: string;
  description: string;
  subject: string;
  category: string;
  variables: string[];
  examples: string[];
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
}

export function FormulaReference() {
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [expandedFormula, setExpandedFormula] = useState<string | null>(null);
  const [newFormula, setNewFormula] = useState<Partial<Formula>>({
    name: '',
    formula: '',
    description: '',
    subject: '',
    category: '',
    variables: [],
    examples: [],
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [variableInput, setVariableInput] = useState('');
  const [exampleInput, setExampleInput] = useState('');
  const { toast } = useToast();

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Statistics', 'Engineering', 'Economics', 'Other'];
  const categories = ['Basic', 'Advanced', 'Applied', 'Theoretical', 'Practical'];

  const handleCreateFormula = () => {
    if (!newFormula.name || !newFormula.formula || !newFormula.subject) {
      toast({
        title: "Missing Information",
        description: "Please fill in the required fields (name, formula, subject).",
        variant: "destructive",
      });
      return;
    }

    const formula: Formula = {
      id: Date.now().toString(),
      name: newFormula.name!,
      formula: newFormula.formula!,
      description: newFormula.description || '',
      subject: newFormula.subject!,
      category: newFormula.category || 'Basic',
      variables: newFormula.variables || [],
      examples: newFormula.examples || [],
      tags: newFormula.tags || [],
      isFavorite: false,
      createdAt: new Date(),
    };

    setFormulas(prev => [...prev, formula]);
    setNewFormula({
      name: '',
      formula: '',
      description: '',
      subject: '',
      category: '',
      variables: [],
      examples: [],
      tags: []
    });
    setIsCreating(false);
    setTagInput('');
    setVariableInput('');
    setExampleInput('');

    toast({
      title: "Formula Added",
      description: "Your formula has been saved successfully.",
    });
  };

  const handleDeleteFormula = (id: string) => {
    setFormulas(prev => prev.filter(formula => formula.id !== id));
    toast({
      title: "Formula Deleted",
      description: "Formula has been removed from your collection.",
    });
  };

  const toggleFavorite = (id: string) => {
    setFormulas(prev => prev.map(formula => 
      formula.id === id ? { ...formula, isFavorite: !formula.isFavorite } : formula
    ));
  };

  const handleCopyFormula = (formula: Formula) => {
    navigator.clipboard.writeText(formula.formula);
    toast({
      title: "Copied",
      description: "Formula copied to clipboard.",
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !newFormula.tags?.includes(tagInput.trim())) {
      setNewFormula(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const addVariable = () => {
    if (variableInput.trim() && !newFormula.variables?.includes(variableInput.trim())) {
      setNewFormula(prev => ({
        ...prev,
        variables: [...(prev.variables || []), variableInput.trim()]
      }));
      setVariableInput('');
    }
  };

  const addExample = () => {
    if (exampleInput.trim() && !newFormula.examples?.includes(exampleInput.trim())) {
      setNewFormula(prev => ({
        ...prev,
        examples: [...(prev.examples || []), exampleInput.trim()]
      }));
      setExampleInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewFormula(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const removeVariable = (variableToRemove: string) => {
    setNewFormula(prev => ({
      ...prev,
      variables: prev.variables?.filter(variable => variable !== variableToRemove) || []
    }));
  };

  const removeExample = (exampleToRemove: string) => {
    setNewFormula(prev => ({
      ...prev,
      examples: prev.examples?.filter(example => example !== exampleToRemove) || []
    }));
  };

  const filteredFormulas = formulas.filter(formula => {
    const matchesSearch = formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formula.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formula.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || formula.subject === selectedSubject;
    const matchesCategory = selectedCategory === 'all' || formula.category === selectedCategory;
    return matchesSearch && matchesSubject && matchesCategory;
  });

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Mathematics': 'bg-blue-100 text-blue-800',
      'Physics': 'bg-purple-100 text-purple-800',
      'Chemistry': 'bg-green-100 text-green-800',
      'Statistics': 'bg-yellow-100 text-yellow-800',
      'Engineering': 'bg-red-100 text-red-800',
      'Economics': 'bg-indigo-100 text-indigo-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[subject as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          Create and manage your formula reference library
        </p>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Formula
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Formula</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="formula-name">Formula Name *</Label>
                  <Input
                    id="formula-name"
                    value={newFormula.name || ''}
                    onChange={(e) => setNewFormula(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Quadratic Formula"
                  />
                </div>
                <div>
                  <Label htmlFor="formula-subject">Subject *</Label>
                  <Select
                    value={newFormula.subject}
                    onValueChange={(value) => setNewFormula(prev => ({ ...prev, subject: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="formula-formula">Formula *</Label>
                <Input
                  id="formula-formula"
                  value={newFormula.formula || ''}
                  onChange={(e) => setNewFormula(prev => ({ ...prev, formula: e.target.value }))}
                  placeholder="e.g., x = (-b ± √(b²-4ac)) / 2a"
                />
              </div>

              <div>
                <Label htmlFor="formula-description">Description</Label>
                <Textarea
                  id="formula-description"
                  value={newFormula.description || ''}
                  onChange={(e) => setNewFormula(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe when and how to use this formula"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="formula-category">Category</Label>
                <Select
                  value={newFormula.category}
                  onValueChange={(value) => setNewFormula(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Variables</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    value={variableInput}
                    onChange={(e) => setVariableInput(e.target.value)}
                    placeholder="e.g., x = unknown value"
                    onKeyPress={(e) => e.key === 'Enter' && addVariable()}
                  />
                  <Button type="button" onClick={addVariable} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newFormula.variables?.map((variable, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {variable}
                      <button
                        onClick={() => removeVariable(variable)}
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Examples</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    value={exampleInput}
                    onChange={(e) => setExampleInput(e.target.value)}
                    placeholder="e.g., For x² - 5x + 6 = 0"
                    onKeyPress={(e) => e.key === 'Enter' && addExample()}
                  />
                  <Button type="button" onClick={addExample} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newFormula.examples?.map((example, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {example}
                      <button
                        onClick={() => removeExample(example)}
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="e.g., algebra, equations"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newFormula.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateFormula}>
                  Add Formula
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search formulas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map(subject => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredFormulas.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Formulas Yet</h3>
              <p className="text-text-secondary mb-4">
                {formulas.length === 0 
                  ? "Add your first formula to build your reference library"
                  : "No formulas match your search criteria"
                }
              </p>
              {formulas.length === 0 && (
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Formula
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredFormulas.map((formula) => (
            <Card key={formula.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Calculator className="w-5 h-5" />
                    <span>{formula.name}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSubjectColor(formula.subject)}>
                      {formula.subject}
                    </Badge>
                    <Button
                      onClick={() => toggleFavorite(formula.id)}
                      variant="ghost"
                      size="sm"
                      className={formula.isFavorite ? 'text-yellow-500' : ''}
                    >
                      <Star className={`w-4 h-4 ${formula.isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteFormula(formula.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono bg-white px-2 py-1 rounded">
                        {formula.formula}
                      </code>
                      <Button
                        onClick={() => handleCopyFormula(formula)}
                        size="sm"
                        variant="ghost"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {formula.description && (
                    <p className="text-sm text-gray-600">{formula.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {formula.category}
                    </Badge>
                    {formula.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {(formula.variables.length > 0 || formula.examples.length > 0) && (
                    <div>
                      <Button
                        onClick={() => setExpandedFormula(expandedFormula === formula.id ? null : formula.id)}
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto"
                      >
                        {expandedFormula === formula.id ? (
                          <ChevronUp className="w-4 h-4 mr-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 mr-1" />
                        )}
                        {expandedFormula === formula.id ? 'Hide Details' : 'Show Details'}
                      </Button>
                      
                      {expandedFormula === formula.id && (
                        <div className="mt-2 space-y-2">
                          {formula.variables.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">Variables:</h4>
                              <div className="flex flex-wrap gap-1">
                                {formula.variables.map((variable, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {variable}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {formula.examples.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">Examples:</h4>
                              <div className="space-y-1">
                                {formula.examples.map((example, index) => (
                                  <div key={index} className="text-xs bg-blue-50 p-2 rounded">
                                    {example}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}