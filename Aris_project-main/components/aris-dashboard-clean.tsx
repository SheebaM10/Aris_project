"use client"

/**
 * ARIS Enhanced Dashboard - Clean Production Version
 * 
 * Features:
 * - Dynamic data from APIs (no hardcoded values)
 * - Connected skill requests and AI analysis
 * - Working email functionality with Outlook integration
 * - Clean interface without unnecessary real-time features
 * - Focus on core HR functionality
 */

import React from "react"
import useSWR from "swr"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { getBestTrainingResourceForSkill } from "@/lib/training-links"
import { ExcelImport } from "@/components/excel-import"
import {
  Brain,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Search,
  Plus,
  Send,
  Target,
  Calendar,
  Award,
  Briefcase,
  Mail,
  Building,
  User,
  Settings,
  X,
  FileText,
  Activity,
  Upload
} from "lucide-react"

// Data fetcher function
const fetcher = (url: string) => fetch(url).then((r) => r.json())

// Type definitions
interface SkillRequirement {
  skill: string
  level: string // "beginner", "intermediate", "expert"
  count: number
  mandatory: boolean
}

interface SkillRequest {
  id: string
  requestId: string
  clientName: string
  clientEmail?: string
  projectName: string
  projectDescription?: string
  requestedBy: string
  requestDate: string
  requiredStartDate: string
  projectDurationWeeks: number
  teamSizeRequired: number
  priority: 'urgent' | 'high' | 'medium' | 'low'
  status: 'pending' | 'analyzing' | 'proposed' | 'training_scheduled' | 'profiles_sent' | 'interviews_scheduled' | 'fulfilled'
  skills: SkillRequirement[]
  analysis?: any
}

interface ResourceMatch {
  id: string
  name: string
  email: string
  department: string
  role: string
  matchPercentage: number
  readinessStatus: 'ready_now' | 'ready_2weeks' | 'ready_4weeks' | 'needs_hiring'
  currentSkills: { skill: string; level: string }[]
  trainingNeeded: string[]
  estimatedReadyDate?: string
  availability: string
  experience: string
  currentProjects: number
  completedProjects: number
}

export function ARISEnhancedDashboard() {
  // State management
  const [activeTab, setActiveTab] = React.useState<'overview' | 'requests' | 'analysis' | 'workforce' | 'import'>('overview')
  const { toast } = useToast()

  // API Data fetching
  const { data: employeeData, mutate: mutateEmployees } = useSWR("/api/data", fetcher)
  const { data: skillRequestsData, mutate: mutateSkillRequests } = useSWR("/api/skill-requests", fetcher)
  
  const employees = employeeData?.employees || []
  const skillRequests = skillRequestsData?.requests || []

  // Form state for new skill request
  const [newRequest, setNewRequest] = React.useState({
    clientName: '',
    projectName: '',
    clientEmail: '',
    projectDescription: '',
    requiredStartDate: '',
    projectDurationWeeks: 12,
    teamSizeRequired: 3,
    priority: 'medium' as const,
    skills: [] as SkillRequirement[]
  })

  // Skill addition state
  const [selectedSkill, setSelectedSkill] = React.useState('')
  const [skillLevel, setSkillLevel] = React.useState('intermediate')
  const [skillCount, setSkillCount] = React.useState('1')
  const [isMandatory, setIsMandatory] = React.useState(true)

  // Analysis state
  const [currentAnalysis, setCurrentAnalysis] = React.useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)

  // Email state
  const [emailData, setEmailData] = React.useState({
    to: '',
    subject: '',
    message: '',
    type: 'general'
  })
  const [isSendingEmail, setIsSendingEmail] = React.useState(false)

  // Available skills list
  const availableSkills = [
    'Python', 'Java', 'JavaScript', 'React', 'Node.js', 'Angular', 'Vue.js',
    'Machine Learning', 'Deep Learning', 'AI/ML', 'TensorFlow', 'PyTorch',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Spring Boot',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
    'DevOps', 'CI/CD', 'Jenkins', 'Git', 'Linux',
    'Microservices', 'GraphQL', 'REST APIs', 'TypeScript',
    'Natural Language Processing', 'Computer Vision', 'Generative AI'
  ]

  // Add skill to request
  const addSkill = () => {
    if (selectedSkill && !newRequest.skills.find(s => s.skill === selectedSkill)) {
      const skill: SkillRequirement = {
        skill: selectedSkill,
        level: skillLevel,
        count: parseInt(skillCount),
        mandatory: isMandatory
      }
      setNewRequest({
        ...newRequest,
        skills: [...newRequest.skills, skill]
      })
      setSelectedSkill('')
      setSkillLevel('intermediate')
      setSkillCount('1')
      setIsMandatory(true)
    }
  }

  // Remove skill from request
  const removeSkill = (skillToRemove: string) => {
    setNewRequest({
      ...newRequest,
      skills: newRequest.skills.filter(s => s.skill !== skillToRemove)
    })
  }

  // Submit new skill request
  const submitRequest = async () => {
    try {
      if (!newRequest.clientName || !newRequest.projectName || newRequest.skills.length === 0) {
        toast({
          title: "Missing Information",
          description: "Please fill in client name, project name, and add at least one skill.",
          variant: "destructive"
        })
        return
      }

      const response = await fetch('/api/skill-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest)
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Skill request created successfully"
        })
        
        // Reset form
        setNewRequest({
          clientName: '',
          projectName: '',
          clientEmail: '',
          projectDescription: '',
          requiredStartDate: '',
          projectDurationWeeks: 12,
          teamSizeRequired: 3,
          priority: 'medium',
          skills: []
        })
        
        // Refresh data
        mutateSkillRequests()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create skill request",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request",
        variant: "destructive"
      })
    }
  }

  // Run AI analysis
  const runAnalysis = async (request: SkillRequest) => {
    setIsAnalyzing(true)
    try {
      // Check if we have employees available
      if (employees.length === 0) {
        toast({
          title: "No Data Available",
          description: "Please import employee data before running AI analysis",
          variant: "destructive"
        })
        setActiveTab('import')
        return
      }

      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: request.requestId,
          skills: request.skills,
          teamSize: request.teamSizeRequired
        })
      })

      const result = await response.json()

      if (result.success) {
        setCurrentAnalysis(result.analysis)
        setActiveTab('analysis')
        toast({
          title: "Analysis Complete",
          description: `AI analysis completed with ${result.analysis.readyNow.length} ready now, ${result.analysis.ready2Weeks.length} ready in 2 weeks`
        })
      } else {
        toast({
          title: "Analysis Failed",
          description: result.error || "Failed to run analysis",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Analysis error:', error)
      toast({
        title: "Error",
        description: "Failed to run AI analysis",
        variant: "destructive"
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Send email
  const sendEmail = async () => {
    if (!emailData.to || !emailData.subject || !emailData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all email fields",
        variant: "destructive"
      })
      return
    }

    setIsSendingEmail(true)
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Email Sent",
          description: `Email sent successfully via ${result.provider}`
        })
        
        // Reset form
        setEmailData({
          to: '',
          subject: '',
          message: '',
          type: 'general'
        })
      } else {
        toast({
          title: "Email Failed",
          description: result.error || "Failed to send email",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive"
      })
    } finally {
      setIsSendingEmail(false)
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'analyzing': return 'bg-blue-100 text-blue-800'
      case 'proposed': return 'bg-purple-100 text-purple-800'
      case 'training_scheduled': return 'bg-orange-100 text-orange-800'
      case 'profiles_sent': return 'bg-yellow-100 text-yellow-800'
      case 'interviews_scheduled': return 'bg-indigo-100 text-indigo-800'
      case 'fulfilled': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests">Skill Requests</TabsTrigger>
          <TabsTrigger value="workforce">Workforce</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="flex items-center p-6">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                  <p className="text-2xl font-bold">{employees.length}</p>
                  {employees.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">Import data to get started</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold">
                    {employees.filter((emp: any) => emp.availability === 'Available').length}
                  </p>
                  {employees.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">No data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <FileText className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Requests</p>
                  <p className="text-2xl font-bold">{skillRequests.length}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">In Analysis</p>
                  <p className="text-2xl font-bold">
                    {skillRequests.filter((req: any) => req.status === 'analyzing').length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Import Prompt or Recent Activity */}
          {employees.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Welcome to ARIS</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Get started by importing your employee data to unlock the full potential of workforce intelligence and skill management.
                </p>
                <Button 
                  onClick={() => setActiveTab('import')}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Import Employee Data
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Skill Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillRequests.slice(0, 3).map((request: SkillRequest) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{request.projectName}</p>
                        <p className="text-sm text-muted-foreground">{request.clientName}</p>
                        <p className="text-xs text-muted-foreground">Team Size: {request.teamSizeRequired}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {skillRequests.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No skill requests found. Create one to get started.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Skill Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          {/* Create New Request */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Skill Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Client Name *</label>
                  <Input
                    value={newRequest.clientName}
                    onChange={(e) => setNewRequest({...newRequest, clientName: e.target.value})}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Client Email</label>
                  <Input
                    value={newRequest.clientEmail}
                    onChange={(e) => setNewRequest({...newRequest, clientEmail: e.target.value})}
                    placeholder="client@company.com"
                    type="email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Project Name *</label>
                  <Input
                    value={newRequest.projectName}
                    onChange={(e) => setNewRequest({...newRequest, projectName: e.target.value})}
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Required Start Date</label>
                  <Input
                    type="date"
                    value={newRequest.requiredStartDate}
                    onChange={(e) => setNewRequest({...newRequest, requiredStartDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Duration (weeks)</label>
                  <Input
                    type="number"
                    value={newRequest.projectDurationWeeks}
                    onChange={(e) => setNewRequest({...newRequest, projectDurationWeeks: parseInt(e.target.value)})}
                    min="1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Team Size</label>
                  <Input
                    type="number"
                    value={newRequest.teamSizeRequired}
                    onChange={(e) => setNewRequest({...newRequest, teamSizeRequired: parseInt(e.target.value)})}
                    min="1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={newRequest.priority} onValueChange={(value: any) => setNewRequest({...newRequest, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Project Description</label>
                <Textarea
                  value={newRequest.projectDescription}
                  onChange={(e) => setNewRequest({...newRequest, projectDescription: e.target.value})}
                  placeholder="Describe the project requirements..."
                  rows={3}
                />
              </div>

              {/* Skills Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Required Skills</h3>
                
                {/* Add Skill Form */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                  <div>
                    <label className="text-sm font-medium">Skill</label>
                     <Input
      type="text"
      placeholder="Enter skill"
      value={selectedSkill}
      onChange={(e) => setSelectedSkill(e.target.value)}
      />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Level</label>
                    <Select value={skillLevel} onValueChange={setSkillLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Count</label>
                    <Input
                      type="number"
                      value={skillCount}
                      onChange={(e) => setSkillCount(e.target.value)}
                      min="1"
                    />
                  </div>
                  
                  <Button onClick={addSkill} className="h-10">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Skills List */}
                <div className="space-y-2">
                  {newRequest.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{skill.skill}</Badge>
                        <Badge variant="secondary">{skill.level}</Badge>
                        <span className="text-sm text-muted-foreground">Count: {skill.count}</span>
                       
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill.skill)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={submitRequest} className="w-full">
                Create Skill Request
              </Button>
            </CardContent>
          </Card>

          {/* Existing Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                All Skill Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillRequests.map((request: SkillRequest) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{request.projectName}</h3>
                        <p className="text-sm text-muted-foreground">{request.clientName}</p>
                        <p className="text-xs text-muted-foreground">ID: {request.requestId}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                      <div>
                        <span className="font-medium">Team Size:</span> {request.teamSizeRequired}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {request.projectDurationWeeks} weeks
                      </div>
                      <div>
                        <span className="font-medium">Start Date:</span> {request.requiredStartDate || 'TBD'}
                      </div>
                      <div>
                        <span className="font-medium">Requested:</span> {request.requestDate}
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="font-medium text-sm">Required Skills:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {request.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill.skill} ({skill.level}) x{skill.count}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => runAnalysis(request)}
                        disabled={isAnalyzing || employees.length === 0}
                        title={employees.length === 0 ? "Import employee data first" : ""}
                      >
                        {isAnalyzing ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Brain className="h-4 w-4 mr-2" />
                            Run AI Analysis
                          </>
                        )}
                      </Button>
                      {employees.length === 0 && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          No data available
                        </Badge>
                      )}
                      
                      {request.clientEmail && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEmailData({
                              to: request.clientEmail!,
                              subject: `Update on ${request.projectName}`,
                              message: `Dear ${request.clientName},\n\nWe wanted to provide you with an update on your project "${request.projectName}".\n\nBest regards,\nARIS Team`,
                              type: 'general'
                            })
                            setActiveTab('workforce') // Use workforce tab for email
                          }}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email Client
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {skillRequests.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No skill requests found</p>
                    <p className="text-sm text-muted-foreground">Create your first skill request above</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          {currentAnalysis ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Analysis Results - {currentAnalysis.requestId}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Confidence Score: {currentAnalysis.confidenceScore}%</span>
                    <span>Analysis Time: {new Date(currentAnalysis.analysisTime).toLocaleString()}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Ready Now */}
                    <div>
                      <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Ready Now ({currentAnalysis.readyNow.length})
                      </h3>
                      <div className="grid gap-3">
                        {currentAnalysis.readyNow.map((resource: ResourceMatch) => (
                          <div key={resource.id} className="border rounded-lg p-4 bg-green-50">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium">{resource.name}</h4>
                                <p className="text-sm text-muted-foreground">{resource.role} • {resource.department}</p>
                                <p className="text-xs text-muted-foreground">{resource.email}</p>
                              </div>
                              <div className="text-right">
                                <Badge className="bg-green-100 text-green-800 mb-1">
                                  {resource.matchPercentage}% Match
                                </Badge>
                                <p className="text-xs text-muted-foreground">{resource.availability}</p>
                              </div>
                            </div>
                            <div className="mb-2">
                              <span className="text-xs font-medium text-muted-foreground">Current Skills:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {resource.currentSkills.map((skill, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {skill.skill} ({skill.level})
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Experience: {resource.experience}</span>
                              <span>Projects: {resource.currentProjects} active, {resource.completedProjects} completed</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-3 w-full"
                              onClick={async () => {
                                if (!resource.email) {
                                  alert('Employee email not available');
                                  return;
                                }
                                const subject = `You have been shortlisted!`;
                                const message = `Dear ${resource.name},\n\nCongratulations! You have been shortlisted for the project based on your skill set. Please check your dashboard for more details.`;
                                try {
                                  const response = await fetch('/api/email', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ to: resource.email, subject, message })
                                  });
                                  const result = await response.json();
                                  if (result.success) {
                                    alert('Email sent successfully!');
                                  } else {
                                    alert('Failed to send email.');
                                  }
                                } catch (err) {
                                  alert('Error sending email.');
                                }
                              }}
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Send Email
                            </Button>
                          </div>
                        ))}
                        {currentAnalysis.readyNow.length === 0 && (
                          <p className="text-muted-foreground text-sm">No employees ready immediately</p>
                        )}
                      </div>
                    </div>

                    {/* Ready in 2 Weeks */}
                    <div>
                      <h3 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Ready in 2 Weeks ({currentAnalysis.ready2Weeks.length})
                      </h3>
                      <div className="grid gap-3">
                        {currentAnalysis.ready2Weeks.map((resource: ResourceMatch) => (
                          <div key={resource.id} className="border rounded-lg p-4 bg-orange-50">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium">{resource.name}</h4>
                                <p className="text-sm text-muted-foreground">{resource.role} • {resource.department}</p>
                                <p className="text-xs text-muted-foreground">{resource.email}</p>
                              </div>
                              <div className="text-right">
                                <Badge className="bg-orange-100 text-orange-800 mb-1">
                                  {resource.matchPercentage}% Match
                                </Badge>
                                <p className="text-xs text-muted-foreground">Ready: {resource.estimatedReadyDate}</p>
                              </div>
                            </div>

                            {resource.trainingNeeded.length > 0 && (
                              <div className="mb-2">
                                <span className="text-xs font-medium text-muted-foreground">Training Needed:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {resource.trainingNeeded.map((training, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {training}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            <Button
                              size="sm"
                              className="mt-2 w-full"
                              onClick={async () => {
                                if (!resource.email) {
                                  alert('Employee email not available');
                                  return;
                                }
                                const subject = 'Training Request – Skill Alignment';
                                const message = 'Please review your training assignment.';
                                try {
                                  const response = await fetch('/api/email', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      to: resource.email,
                                      subject,
                                      message,
                                      type: 'skill_alignment',
                                      data: {
                                        employeeName: resource.name,
                                        skills: (resource.trainingNeeded && resource.trainingNeeded.length > 0) ? resource.trainingNeeded : ['Python', 'Java'],
                                        trainingLink: getBestTrainingResourceForSkill(resource.trainingNeeded?.[0] || 'Java').url,
                                        hrTeamName: 'HR Team'
                                      }
                                    })
                                  });
                                  const result = await response.json();
                                  if (response.ok && result.success) {
                                    alert('Skill alignment email sent!');
                                  } else {
                                    alert('Failed to send email.');
                                  }
                                } catch (err) {
                                  alert('Error sending email.');
                                }
                              }}
                            >
                              Send Skill Alignment Email
                            </Button>
                           
                          </div>
                        ))}
                        {currentAnalysis.ready2Weeks.length === 0 && (
                          <p className="text-muted-foreground text-sm">No employees ready in 2 weeks</p>
                        )}
                      </div>
                    </div>

                    {/* Ready in 4 Weeks */}
                    <div>
                      <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Ready in 4 Weeks ({currentAnalysis.ready4Weeks.length})
                      </h3>
                      <div className="grid gap-3">
                        {currentAnalysis.ready4Weeks.map((resource: ResourceMatch) => (
                          <div key={resource.id} className="border rounded-lg p-4 bg-blue-50">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium">{resource.name}</h4>
                                <p className="text-sm text-muted-foreground">{resource.role} • {resource.department}</p>
                                <p className="text-xs text-muted-foreground">{resource.email}</p>
                              </div>
                              <div className="text-right">
                                <Badge className="bg-blue-100 text-blue-800 mb-1">
                                  {resource.matchPercentage}% Match
                                </Badge>
                                <p className="text-xs text-muted-foreground">Ready: {resource.estimatedReadyDate}</p>
                              </div>
                            </div>

                            {resource.trainingNeeded.length > 0 && (
                              <div className="mb-2">
                                <span className="text-xs font-medium text-muted-foreground">Training Needed:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {resource.trainingNeeded.map((training, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {training}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        {currentAnalysis.ready4Weeks.length === 0 && (
                          <p className="text-muted-foreground text-sm">No employees ready in 4 weeks</p>
                        )}
                      </div>
                    </div>

                    {/* External Hiring */}
                    {currentAnalysis.externalHireNeeded > 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>External Hiring Required:</strong> {currentAnalysis.externalHireNeeded} additional team member(s) needed
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Recommended Actions */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Recommended Actions
                      </h3>
                      <div className="space-y-2">
                        {currentAnalysis.recommendedActions.map((action: string, index: number) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                            <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>
                            <p className="text-sm">{action}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Analysis Results</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Run AI analysis on a skill request to see detailed workforce matching results
                </p>
                <Button onClick={() => setActiveTab('requests')}>
                  Go to Skill Requests
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Workforce Tab */}
        <TabsContent value="workforce" className="space-y-6">
          {/* Email Communication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Communication
              </CardTitle>
              <div className="flex gap-2 mt-2">
                
                
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">To *</label>
                  <Input
                    value={emailData.to}
                    onChange={(e) => setEmailData({...emailData, to: e.target.value})}
                    placeholder="recipient@company.com"
                    type="email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Subject *</label>
                  <Input
                    value={emailData.subject}
                    onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                    placeholder="Email subject"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Message *</label>
                <Textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                  placeholder="Type your message here..."
                  rows={6}
                />
              </div>

              <Button 
                onClick={sendEmail} 
                disabled={isSendingEmail}
                className="w-full"
              >
                {isSendingEmail ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Employee Directory */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employee Directory
                {employeeData?.dataSource === 'imported' && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Imported Data
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {employees.map((employee: any) => (
                  <div key={employee.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{employee.name}</h3>
                        <p className="text-sm text-muted-foreground">{employee.role}</p>
                        <p className="text-xs text-muted-foreground">{employee.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={employee.availability === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {employee.availability}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{employee.location}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-xs font-medium text-muted-foreground">Skills:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {employee.skills.map((skill: any, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill.skill} ({skill.level})
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Experience: {employee.experience}</span>
                      <span>Projects: {employee.currentProjects} active, {employee.completedProjects} completed</span>
                    </div>
                  </div>
                ))}
                
                {employees.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Employee Data Available</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Import your employee data using the Import tab to get started with workforce management.
                    </p>
                    <Button 
                      onClick={() => setActiveTab('import')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Go to Import Tab
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Import Tab */}
        <TabsContent value="import" className="space-y-6">
          <ExcelImport />
        </TabsContent>
      </Tabs>
    </div>
  )
}
