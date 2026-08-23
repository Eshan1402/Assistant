export type ApplicationMode = 'manual' | 'assisted' | 'authorized_auto';
export type RemotePreference = 'remote' | 'hybrid' | 'onsite' | 'any';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
export type EmploymentType = 'full-time' | 'contract' | 'part-time' | 'internship';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  headline?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  bio: string;
  skills: string[];
  technologies: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: string[];
  links: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    twitter?: string;
  };
  resumeFileName?: string;
  resumeRawText?: string;
  parsedAt?: string;
}

export interface CareerPreferences {
  targetTitles: string[];
  targetIndustries: string[];
  targetCountries: string[];
  targetCities: string[];
  remotePreference: RemotePreference;
  minSalary: number;
  currency: string;
  experienceLevel: ExperienceLevel;
  employmentType: EmploymentType;
  preferredTech: string[];
  preferredCompanies: string[];
  companiesToAvoid: string[];
  visaRequired: boolean;
  willingToRelocate: boolean;
}

export interface ApplicationPreferences {
  mode: ApplicationMode;
  minMatchScore: number;
  dailyApplicationLimit: number;
  maxPerCompany: number;
  autoCoverLetter: boolean;
  autoCustomizeResume: boolean;
  autoAnswerQuestions: boolean;
  notificationLevel: 'critical' | 'important' | 'all';
  emailIntegrationEnabled: boolean;
  voiceAssistantEnabled: boolean;
}

export interface Job {
  id: string;
  externalId: string;
  company: string;
  companyLogo?: string;
  companyWebsite?: string;
  role: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  location: string;
  country: string;
  remoteType: 'remote' | 'hybrid' | 'onsite';
  employmentType: EmploymentType;
  experienceReq: string;
  postedAt: string;
  applicationUrl: string;
  source: 'LinkedIn API' | 'Greenhouse API' | 'Lever ATS' | 'Workday Feed' | 'RemoteOK' | 'TechJobs India' | 'Wellfound';
  sourceUrl?: string;
  isEasyApplyPermitted: boolean;
}

export interface JobMatch {
  jobId: string;
  overallScore: number; // 0 - 100
  breakdown: {
    semanticScore: number; // 30%
    skillsScore: number;   // 25%
    experienceScore: number; // 15%
    locationScore: number; // 10%
    educationScore: number; // 10%
    preferenceScore: number; // 10%
  };
  whyMatches: string[];
  missingRequirements: string[];
  recommendation: 'Apply' | 'Consider' | 'Skip';
  analysisSummary: string;
}

export type ApplicationStatus =
  | 'discovered'
  | 'saved'
  | 'ready'
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export interface ApplicationEvent {
  id: string;
  timestamp: string;
  type: string;
  title: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface JobApplication {
  id: string;
  jobId: string;
  job: Job;
  status: ApplicationStatus;
  appliedAt?: string;
  submissionMode?: ApplicationMode;
  matchScore: number;
  resumeVersion: string;
  coverLetter: string;
  tailoredBio?: string;
  recruiterMessage?: string;
  answers: { question: string; answer: string }[];
  recruiterContact?: {
    name: string;
    email: string;
    role: string;
  };
  notes: string;
  externalAppId?: string;
  events: ApplicationEvent[];
  updatedAt: string;
}

export type EmailCategory =
  | 'recruiter'
  | 'interview_invite'
  | 'rejection'
  | 'assessment'
  | 'confirmation'
  | 'offer'
  | 'followup';

export type EmailPriority = 'critical' | 'important' | 'normal' | 'silent';

export interface CareerEmail {
  id: string;
  sender: string;
  senderEmail: string;
  company: string;
  subject: string;
  snippet: string;
  fullText: string;
  category: EmailCategory;
  priority: EmailPriority;
  receivedAt: string;
  matchedApplicationId?: string;
  isRead: boolean;
  isActionRequired: boolean;
  suggestedAction?: string;
}

export interface InterviewBriefing {
  companyOverview: string;
  predictedQuestions: string[];
  tailoredTalkingPoints: string[];
  questionsToAsk: string[];
  interviewerTips: string[];
}

export interface Interview {
  id: string;
  applicationId: string;
  company: string;
  role: string;
  date: string;
  time: string;
  round: string;
  interviewers: string[];
  meetingLink: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  briefing?: InterviewBriefing;
}

export interface AssistantMessage {
  id: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
  timestamp: string;
  actionType?: 'view_job' | 'view_interview' | 'view_email' | 'run_discovery' | 'apply_job' | 'open_kanban';
  actionPayload?: any;
  eventTrigger?: string;
}

export interface SystemLog {
  taskId: string;
  timestamp: string;
  workerName: string;
  action: string;
  status: 'success' | 'running' | 'failed' | 'warning';
  durationMs: number;
  details: string;
  metadata?: Record<string, any>;
}

export interface WorkerStatus {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'scheduled' | 'paused';
  lastRun: string;
  nextRun: string;
  processedCount: number;
  successRate: number;
}

export type ActiveView =
  | 'home'
  | 'dashboard'
  | 'jobs'
  | 'kanban'
  | 'emails'
  | 'interviews'
  | 'analytics'
  | 'automation'
  | 'profile';
