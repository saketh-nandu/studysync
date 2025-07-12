import { ResumeBuilder } from "@/components/tools/resume-builder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { FileText, Globe, Users, Briefcase, Award, Users2 } from "lucide-react";

export default function Career() {
  const { data: projects = [] } = useQuery({
    queryKey: ["/api/projects"],
  });

  const internships = [
    {
      title: "Software Engineering Intern",
      company: "Google",
      location: "Remote",
      salary: "$5000/month",
      type: "Full-time",
      posted: "2 days ago"
    },
    {
      title: "Data Science Intern",
      company: "Microsoft",
      location: "Seattle",
      salary: "$4500/month",
      type: "Full-time",
      posted: "5 days ago"
    },
    {
      title: "UX Design Intern",
      company: "Meta",
      location: "Menlo Park",
      salary: "$4000/month",
      type: "Full-time",
      posted: "1 week ago"
    }
  ];

  const scholarships = [
    {
      title: "STEM Excellence Award",
      amount: "$5000",
      deadline: "March 15, 2025",
      status: "Open"
    },
    {
      title: "Academic Merit Scholarship",
      amount: "$3000",
      deadline: "April 1, 2025",
      status: "Open"
    },
    {
      title: "Innovation Grant",
      amount: "$2500",
      deadline: "February 28, 2025",
      status: "Closing Soon"
    }
  ];

  const networkingEvents = [
    {
      title: "Tech Career Fair",
      date: "Tomorrow",
      location: "Student Center",
      type: "Career Fair"
    },
    {
      title: "Alumni Networking",
      date: "Next Friday",
      location: "Virtual",
      type: "Networking"
    },
    {
      title: "Industry Panel",
      date: "Next Week",
      location: "Auditorium",
      type: "Panel"
    }
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <h1 className="text-2xl font-bold">Career & Collaboration</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Resume Builder */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <span>Resume Builder</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResumeBuilder />
          </CardContent>
        </Card>

        {/* Portfolio Builder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-blue-500" />
              </div>
              <span>Portfolio Builder</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-4">Showcase your projects and skills</p>
            <div className="space-y-3">
              {projects.filter((p: any) => p.type === 'portfolio').slice(0, 3).map((project: any) => (
                <div key={project.id} className="bg-surface-variant p-3 rounded-lg">
                  <p className="text-sm font-medium">{project.title}</p>
                  <p className="text-xs text-text-secondary">{project.description}</p>
                </div>
              ))}
              {projects.filter((p: any) => p.type === 'portfolio').length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-text-secondary">No portfolio projects yet</p>
                </div>
              )}
            </div>
            <div className="flex space-x-2 mt-4">
              <Button size="sm" className="flex-1">Add Project</Button>
              <Button size="sm" variant="outline" className="flex-1">View Portfolio</Button>
            </div>
          </CardContent>
        </Card>

        {/* Group Project Manager */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-green-500" />
              </div>
              <span>Group Projects</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-4">Collaborate on group assignments</p>
            <div className="space-y-3">
              {projects.filter((p: any) => p.type === 'group').slice(0, 3).map((project: any) => (
                <div key={project.id} className="bg-surface-variant p-3 rounded-lg">
                  <p className="text-sm font-medium">{project.title}</p>
                  <p className="text-xs text-text-secondary">{project.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {projects.filter((p: any) => p.type === 'group').length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-text-secondary">No group projects yet</p>
                </div>
              )}
            </div>
            <Button size="sm" className="w-full mt-4">Create Project</Button>
          </CardContent>
        </Card>

        {/* Internship Finder */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-orange-500" />
              </div>
              <span>Internship Finder</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-4">Find internships matching your skills</p>
            <div className="space-y-4">
              {internships.map((internship, index) => (
                <div key={index} className="bg-surface-variant p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{internship.title}</h3>
                      <p className="text-sm text-text-secondary">{internship.company} • {internship.location}</p>
                    </div>
                    <Badge variant="outline">{internship.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-success">{internship.salary}</span>
                    <span className="text-xs text-text-secondary">{internship.posted}</span>
                  </div>
                  <Button size="sm" className="mt-3">Apply Now</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Networking Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Users2 className="w-4 h-4 text-purple-500" />
              </div>
              <span>Networking Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-4">Professional networking events</p>
            <div className="space-y-3">
              {networkingEvents.map((event, index) => (
                <div key={index} className="bg-surface-variant p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{event.title}</p>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                  <p className="text-xs text-text-secondary">{event.date} • {event.location}</p>
                </div>
              ))}
            </div>
            <Button size="sm" className="w-full mt-4">View All Events</Button>
          </CardContent>
        </Card>

        {/* Scholarship Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-yellow-500" />
              </div>
              <span>Scholarship Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-4">Find scholarships you qualify for</p>
            <div className="space-y-3">
              {scholarships.map((scholarship, index) => (
                <div key={index} className="bg-surface-variant p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{scholarship.title}</p>
                    <Badge variant={scholarship.status === 'Closing Soon' ? 'destructive' : 'default'}>
                      {scholarship.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-secondary">
                    {scholarship.amount} • Deadline: {scholarship.deadline}
                  </p>
                </div>
              ))}
            </div>
            <Button size="sm" className="w-full mt-4">Find More</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
