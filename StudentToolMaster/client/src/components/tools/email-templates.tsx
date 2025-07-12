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
  Mail, 
  Copy, 
  Edit, 
  Trash2, 
  Plus, 
  Send, 
  FileText,
  User,
  GraduationCap,
  Briefcase,
  Clock,
  Star,
  X
} from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'academic' | 'professional' | 'personal';
  tags: string[];
  createdAt: Date;
  lastUsed?: Date;
}

export function EmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<EmailTemplate>>({
    name: '',
    subject: '',
    body: '',
    category: 'personal',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [customizedEmail, setCustomizedEmail] = useState({ subject: '', body: '' });
  const { toast } = useToast();

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.body) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const template: EmailTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name!,
      subject: newTemplate.subject!,
      body: newTemplate.body!,
      category: newTemplate.category as 'academic' | 'professional' | 'personal',
      tags: newTemplate.tags || [],
      createdAt: new Date(),
    };

    setTemplates(prev => [...prev, template]);
    setNewTemplate({
      name: '',
      subject: '',
      body: '',
      category: 'personal',
      tags: []
    });
    setIsCreating(false);
    setTagInput('');

    toast({
      title: "Template Created",
      description: "Your email template has been saved successfully.",
    });
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
    if (selectedTemplate?.id === id) {
      setSelectedTemplate(null);
    }
    toast({
      title: "Template Deleted",
      description: "Email template has been removed.",
    });
  };

  const handleUseTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setCustomizedEmail({
      subject: template.subject,
      body: template.body
    });
    
    // Update last used date
    setTemplates(prev => prev.map(t => 
      t.id === template.id ? { ...t, lastUsed: new Date() } : t
    ));
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Email content copied to clipboard.",
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !newTemplate.tags?.includes(tagInput.trim())) {
      setNewTemplate(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewTemplate(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic': return <GraduationCap className="w-4 h-4" />;
      case 'professional': return <Briefcase className="w-4 h-4" />;
      case 'personal': return <User className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'professional': return 'bg-green-100 text-green-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          Create and manage custom email templates for your subjects and needs
        </p>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Email Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={newTemplate.name || ''}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Professor Meeting Request"
                />
              </div>
              
              <div>
                <Label htmlFor="template-category">Category</Label>
                <Select
                  value={newTemplate.category}
                  onValueChange={(value) => setNewTemplate(prev => ({ ...prev, category: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="template-subject">Email Subject</Label>
                <Input
                  id="template-subject"
                  value={newTemplate.subject || ''}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter email subject"
                />
              </div>

              <div>
                <Label htmlFor="template-body">Email Body</Label>
                <Textarea
                  id="template-body"
                  value={newTemplate.body || ''}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, body: e.target.value }))}
                  placeholder="Enter your email template content..."
                  className="min-h-[200px]"
                />
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tags (e.g., meeting, assignment)"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newTemplate.tags?.map((tag, index) => (
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
                <Button onClick={handleCreateTemplate}>
                  Create Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">My Templates</TabsTrigger>
          <TabsTrigger value="compose">Compose Email</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-4">
          {templates.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Templates Yet</h3>
                  <p className="text-text-secondary mb-4">
                    Create your first email template to get started
                  </p>
                  <Button onClick={() => setIsCreating(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        {getCategoryIcon(template.category)}
                        <span>{template.name}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={getCategoryColor(template.category)}>
                          {template.category}
                        </Badge>
                        <Button
                          onClick={() => handleDeleteTemplate(template.id)}
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
                      <div>
                        <p className="text-sm font-medium text-gray-700">Subject:</p>
                        <p className="text-sm text-gray-600">{template.subject}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Preview:</p>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {template.body.substring(0, 150)}...
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {template.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <div className="text-xs text-gray-500">
                          Created: {template.createdAt.toLocaleDateString()}
                          {template.lastUsed && (
                            <span className="ml-2">
                              Last used: {template.lastUsed.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <Button
                          onClick={() => handleUseTemplate(template)}
                          size="sm"
                          variant="outline"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="compose" className="space-y-4">
          {selectedTemplate ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Edit className="w-5 h-5" />
                  <span>Customize Email</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="custom-subject">Subject</Label>
                  <Input
                    id="custom-subject"
                    value={customizedEmail.subject}
                    onChange={(e) => setCustomizedEmail(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Email subject"
                  />
                </div>
                <div>
                  <Label htmlFor="custom-body">Body</Label>
                  <Textarea
                    id="custom-body"
                    value={customizedEmail.body}
                    onChange={(e) => setCustomizedEmail(prev => ({ ...prev, body: e.target.value }))}
                    placeholder="Email body"
                    className="min-h-[300px]"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => handleCopyToClipboard(`Subject: ${customizedEmail.subject}\n\n${customizedEmail.body}`)}
                    variant="outline"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Email
                  </Button>
                  <Button
                    onClick={() => {
                      const emailBody = encodeURIComponent(customizedEmail.body);
                      const emailSubject = encodeURIComponent(customizedEmail.subject);
                      window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`);
                    }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Template</h3>
                  <p className="text-text-secondary">
                    Choose a template from your collection to customize and send
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}