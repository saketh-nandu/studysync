import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
}

interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: string[];
}

export function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      address: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
  });
  const [newSkill, setNewSkill] = useState("");
  const [newProject, setNewProject] = useState("");
  const [activeTab, setActiveTab] = useState("personal");
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: resumes = [] } = useQuery({
    queryKey: ["/api/projects"],
  });

  const savedResumes = resumes.filter((p: any) => p.type === "resume");

  const saveResumeMutation = useMutation({
    mutationFn: (resume: any) =>
      apiRequest("POST", "/api/projects", {
        title: `Resume - ${resumeData.personalInfo.name || "Untitled"}`,
        type: "resume",
        data: resume,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Resume saved",
        description: "Your resume has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const handleAddExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { title: "", company: "", duration: "", description: "" },
      ],
    }));
  };

  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const handleRemoveExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleAddEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: "", institution: "", year: "", gpa: "" },
      ],
    }));
  };

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const handleRemoveEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleAddProject = () => {
    if (newProject.trim()) {
      setResumeData(prev => ({
        ...prev,
        projects: [...prev.projects, newProject.trim()],
      }));
      setNewProject("");
    }
  };

  const handleRemoveProject = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const handleSaveResume = () => {
    if (!resumeData.personalInfo.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    saveResumeMutation.mutate(resumeData);
  };

  const handleLoadResume = (resume: any) => {
    setResumeData(resume.data);
    setPreviewMode(false);
    toast({
      title: "Resume loaded",
      description: "Resume data has been loaded successfully.",
    });
  };

  const handleExportResume = () => {
    // Create HTML content for the resume
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume - ${resumeData.personalInfo.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; }
            .name { font-size: 2.5em; font-weight: bold; color: #2c3e50; }
            .contact { color: #7f8c8d; margin: 10px 0; }
            .section { margin: 20px 0; }
            .section-title { font-size: 1.4em; font-weight: bold; color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 5px; margin-bottom: 15px; }
            .item { margin: 10px 0; }
            .item-title { font-weight: bold; color: #2c3e50; }
            .item-subtitle { color: #7f8c8d; font-style: italic; }
            .skills { display: flex; flex-wrap: wrap; gap: 10px; }
            .skill { background: #ecf0f1; padding: 5px 10px; border-radius: 15px; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="name">${resumeData.personalInfo.name}</div>
            <div class="contact">
              ${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone}<br>
              ${resumeData.personalInfo.address}
            </div>
          </div>
          
          ${resumeData.personalInfo.summary ? `
            <div class="section">
              <div class="section-title">Professional Summary</div>
              <p>${resumeData.personalInfo.summary}</p>
            </div>
          ` : ''}
          
          ${resumeData.experience.length > 0 ? `
            <div class="section">
              <div class="section-title">Experience</div>
              ${resumeData.experience.map(exp => `
                <div class="item">
                  <div class="item-title">${exp.title}</div>
                  <div class="item-subtitle">${exp.company} | ${exp.duration}</div>
                  <p>${exp.description}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${resumeData.education.length > 0 ? `
            <div class="section">
              <div class="section-title">Education</div>
              ${resumeData.education.map(edu => `
                <div class="item">
                  <div class="item-title">${edu.degree}</div>
                  <div class="item-subtitle">${edu.institution} | ${edu.year}</div>
                  ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${resumeData.skills.length > 0 ? `
            <div class="section">
              <div class="section-title">Skills</div>
              <div class="skills">
                ${resumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
              </div>
            </div>
          ` : ''}
          
          ${resumeData.projects.length > 0 ? `
            <div class="section">
              <div class="section-title">Projects</div>
              ${resumeData.projects.map(project => `
                <div class="item">
                  <div class="item-title">${project}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </body>
      </html>
    `;

    // Create and download the file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Resume exported!",
      description: "Your resume has been downloaded as an HTML file.",
    });
  };

  if (previewMode) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setPreviewMode(false)}
            variant="outline"
            size="sm"
          >
            <span className="material-icons text-sm mr-1">edit</span>
            Edit Resume
          </Button>
          <div className="flex space-x-2">
            <Button onClick={handleExportResume} size="sm">
              <span className="material-icons text-sm mr-1">download</span>
              Export PDF
            </Button>
            <Button onClick={handleSaveResume} size="sm">
              <span className="material-icons text-sm mr-1">save</span>
              Save
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="max-w-2xl mx-auto bg-white text-black p-8 shadow-lg">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold mb-2">{resumeData.personalInfo.name}</h1>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{resumeData.personalInfo.email} • {resumeData.personalInfo.phone}</p>
                  <p>{resumeData.personalInfo.address}</p>
                </div>
              </div>

              {/* Summary */}
              {resumeData.personalInfo.summary && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3 border-b border-gray-300 pb-1">
                    Professional Summary
                  </h2>
                  <p className="text-sm">{resumeData.personalInfo.summary}</p>
                </div>
              )}

              {/* Experience */}
              {resumeData.experience.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3 border-b border-gray-300 pb-1">
                    Experience
                  </h2>
                  <div className="space-y-4">
                    {resumeData.experience.map((exp, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium">{exp.title}</h3>
                          <span className="text-sm text-gray-600">{exp.duration}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{exp.company}</p>
                        <p className="text-sm">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {resumeData.education.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3 border-b border-gray-300 pb-1">
                    Education
                  </h2>
                  <div className="space-y-2">
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{edu.degree}</h3>
                          <p className="text-sm text-gray-600">{edu.institution}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{edu.year}</p>
                          {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {resumeData.skills.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3 border-b border-gray-300 pb-1">
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {resumeData.projects.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3 border-b border-gray-300 pb-1">
                    Projects
                  </h2>
                  <ul className="space-y-1">
                    {resumeData.projects.map((project, index) => (
                      <li key={index} className="text-sm">• {project}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Resume Builder</h3>
        <div className="flex space-x-2">
          <Button onClick={() => setPreviewMode(true)} size="sm" variant="outline">
            <span className="material-icons text-sm mr-1">visibility</span>
            Preview
          </Button>
          <Button onClick={handleSaveResume} size="sm">
            <span className="material-icons text-sm mr-1">save</span>
            Save
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Full Name"
                value={resumeData.personalInfo.name}
                onChange={(e) => handlePersonalInfoChange("name", e.target.value)}
              />
              <Input
                placeholder="Email"
                value={resumeData.personalInfo.email}
                onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
              />
              <Input
                placeholder="Phone"
                value={resumeData.personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
              />
              <Input
                placeholder="Address"
                value={resumeData.personalInfo.address}
                onChange={(e) => handlePersonalInfoChange("address", e.target.value)}
              />
              <Textarea
                placeholder="Professional Summary"
                value={resumeData.personalInfo.summary}
                onChange={(e) => handlePersonalInfoChange("summary", e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {savedResumes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Saved Resumes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {savedResumes.map((resume: any) => (
                    <div key={resume.id} className="flex items-center justify-between p-2 bg-surface-variant rounded">
                      <span className="text-sm">{resume.title}</span>
                      <Button
                        onClick={() => handleLoadResume(resume)}
                        size="sm"
                        variant="outline"
                      >
                        Load
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Work Experience</CardTitle>
                <Button onClick={handleAddExperience} size="sm">
                  <span className="material-icons text-sm mr-1">add</span>
                  Add Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="p-3 bg-surface-variant rounded space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Job Title"
                          value={exp.title}
                          onChange={(e) => handleExperienceChange(index, "title", e.target.value)}
                        />
                        <Input
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                        />
                        <Input
                          placeholder="Duration (e.g., 2020-2022)"
                          value={exp.duration}
                          onChange={(e) => handleExperienceChange(index, "duration", e.target.value)}
                        />
                        <Textarea
                          placeholder="Description"
                          value={exp.description}
                          onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                          rows={3}
                        />
                      </div>
                      <Button
                        onClick={() => handleRemoveExperience(index)}
                        size="sm"
                        variant="ghost"
                        className="ml-2"
                      >
                        <span className="material-icons text-sm">delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Education</CardTitle>
                <Button onClick={handleAddEducation} size="sm">
                  <span className="material-icons text-sm mr-1">add</span>
                  Add Education
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="p-3 bg-surface-variant rounded space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                        />
                        <Input
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                        />
                        <Input
                          placeholder="Year"
                          value={edu.year}
                          onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                        />
                        <Input
                          placeholder="GPA (optional)"
                          value={edu.gpa || ""}
                          onChange={(e) => handleEducationChange(index, "gpa", e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={() => handleRemoveEducation(index)}
                        size="sm"
                        variant="ghost"
                        className="ml-2"
                      >
                        <span className="material-icons text-sm">delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Skills & Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Skills</label>
                <div className="flex space-x-2 mb-3">
                  <Input
                    placeholder="Add skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                  />
                  <Button onClick={handleAddSkill} size="sm">
                    <span className="material-icons text-sm">add</span>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer">
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(index)}
                        className="ml-2 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Projects</label>
                <div className="flex space-x-2 mb-3">
                  <Input
                    placeholder="Add project..."
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddProject()}
                  />
                  <Button onClick={handleAddProject} size="sm">
                    <span className="material-icons text-sm">add</span>
                  </Button>
                </div>
                <div className="space-y-2">
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-surface-variant rounded">
                      <span className="text-sm">{project}</span>
                      <Button
                        onClick={() => handleRemoveProject(index)}
                        size="sm"
                        variant="ghost"
                      >
                        <span className="material-icons text-sm">delete</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
