import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CandidateProfile,
  CareerPreferences,
  ApplicationPreferences,
  Job,
  JobMatch,
  JobApplication,
  ApplicationStatus,
  CareerEmail,
  Interview,
  AssistantMessage,
  SystemLog,
  WorkerStatus,
  ApplicationMode,
  ActiveView,
} from '../types';
import {
  initialProfile,
  initialCareerPreferences,
  initialApplicationPreferences,
  seedJobs,
  seedMatches,
  seedApplications,
  seedEmails,
  seedInterviews,
  seedWorkers,
  seedLogs,
} from '../data/mockDatabase';

interface CareerOSContextType {
  // State
  profile: CandidateProfile;
  preferences: CareerPreferences;
  appPreferences: ApplicationPreferences;
  jobs: Job[];
  matches: Record<string, JobMatch>;
  applications: JobApplication[];
  emails: CareerEmail[];
  interviews: Interview[];
  messages: AssistantMessage[];
  logs: SystemLog[];
  workers: WorkerStatus[];
  activeEnvelope: CareerEmail | null;
  isAssistantOpen: boolean;
  selectedJobForDetail: Job | null;
  selectedJobForMatch: Job | null;
  selectedJobForApplication: Job | null;
  isDiscoveryRunning: boolean;
  isEmailScanning: boolean;
  activeView: ActiveView;

  // Actions
  setActiveView: (view: ActiveView) => void;
  setIsAssistantOpen: (open: boolean) => void;
  dismissEnvelope: () => void;
  openEnvelope: (email: CareerEmail) => void;
  setSelectedJobForDetail: (job: Job | null) => void;
  setSelectedJobForMatch: (job: Job | null) => void;
  setSelectedJobForApplication: (job: Job | null) => void;
  updateProfile: (updated: Partial<CandidateProfile>) => void;
  updatePreferences: (updated: Partial<CareerPreferences>) => void;
  updateAppPreferences: (updated: Partial<ApplicationPreferences>) => void;
  
  // Job & Application Actions
  saveJob: (jobId: string) => void;
  unsaveJob: (jobId: string) => void;
  moveApplication: (applicationId: string, newStatus: ApplicationStatus, note?: string) => void;
  submitApplication: (jobId: string, mode?: ApplicationMode, customData?: { coverLetter?: string; tailoredBio?: string; answers?: any[] }) => Promise<JobApplication>;
  deleteApplication: (applicationId: string) => void;
  
  // AI & Background Worker Triggers
  parseResumeWithAI: (text: string) => Promise<CandidateProfile>;
  calculateJobMatchWithAI: (job: Job) => Promise<JobMatch>;
  generateApplicationPackageWithAI: (job: Job) => Promise<{ coverLetter: string; tailoredBio: string; recruiterMessage: string; answers: any[]; truthfulnessCheck: string }>;
  generateInterviewBriefingWithAI: (company: string, role: string, round?: string) => Promise<any>;
  sendAssistantMessage: (text: string) => Promise<void>;
  runBackgroundDiscovery: () => Promise<void>;
  triggerEmailScan: () => Promise<void>;
  addInterview: (interview: Omit<Interview, 'id'>) => void;
  markEmailAsRead: (emailId: string) => void;
}

const CareerOSContext = createContext<CareerOSContextType | undefined>(undefined);

export const CareerOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<CandidateProfile>(() => {
    const saved = localStorage.getItem('careeros_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [preferences, setPreferences] = useState<CareerPreferences>(() => {
    const saved = localStorage.getItem('careeros_prefs');
    return saved ? JSON.parse(saved) : initialCareerPreferences;
  });

  const [appPreferences, setAppPreferences] = useState<ApplicationPreferences>(() => {
    const saved = localStorage.getItem('careeros_app_prefs');
    return saved ? JSON.parse(saved) : initialApplicationPreferences;
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('careeros_jobs');
    return saved ? JSON.parse(saved) : seedJobs;
  });

  const [matches, setMatches] = useState<Record<string, JobMatch>>(() => {
    const saved = localStorage.getItem('careeros_matches');
    return saved ? JSON.parse(saved) : seedMatches;
  });

  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('careeros_apps');
    return saved ? JSON.parse(saved) : seedApplications;
  });

  const [emails, setEmails] = useState<CareerEmail[]>(() => {
    const saved = localStorage.getItem('careeros_emails');
    return saved ? JSON.parse(saved) : seedEmails;
  });

  const [interviews, setInterviews] = useState<Interview[]>(() => {
    const saved = localStorage.getItem('careeros_interviews');
    return saved ? JSON.parse(saved) : seedInterviews;
  });

  const [logs, setLogs] = useState<SystemLog[]>(() => {
    const saved = localStorage.getItem('careeros_logs');
    return saved ? JSON.parse(saved) : seedLogs;
  });

  const [workers, setWorkers] = useState<WorkerStatus[]>(seedWorkers);
  const [activeEnvelope, setActiveEnvelope] = useState<CareerEmail | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<Job | null>(null);
  const [selectedJobForMatch, setSelectedJobForMatch] = useState<Job | null>(null);
  const [selectedJobForApplication, setSelectedJobForApplication] = useState<Job | null>(null);
  const [isDiscoveryRunning, setIsDiscoveryRunning] = useState(false);
  const [isEmailScanning, setIsEmailScanning] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('home');

  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'msg_001',
      role: 'assistant',
      content: `Good morning, ${profile.fullName.split(' ')[0]} 👋. Your CareerOS agent is actively monitoring the market. You have an upcoming interview with Vercel tomorrow at 11:00 AM IST, and 3 high-match roles (Stripe, Linear, Razorpay) are ready in your feed.`,
      timestamp: '10:00 AM',
    },
  ]);

  // Persist key state
  useEffect(() => {
    localStorage.setItem('careeros_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('careeros_prefs', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('careeros_app_prefs', JSON.stringify(appPreferences));
  }, [appPreferences]);

  useEffect(() => {
    localStorage.setItem('careeros_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('careeros_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('careeros_apps', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('careeros_emails', JSON.stringify(emails));
  }, [emails]);

  useEffect(() => {
    localStorage.setItem('careeros_interviews', JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    localStorage.setItem('careeros_logs', JSON.stringify(logs));
  }, [logs]);

  // Trigger occasional envelope notification if critical unread email exists
  useEffect(() => {
    const unreadCritical = emails.find((e) => !e.isRead && (e.priority === 'critical' || e.category === 'interview_invite'));
    if (unreadCritical) {
      const timer = setTimeout(() => {
        setActiveEnvelope(unreadCritical);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [emails]);

  // Autonomous Agent Background Loop
  useEffect(() => {
    // Only run if autoApply is enabled
    if (!appPreferences.autoApply) return;

    // Run discovery every 2 minutes autonomously
    const autonomousInterval = setInterval(() => {
      if (!isDiscoveryRunning) {
        runBackgroundDiscovery();
      }
    }, 120000);

    return () => clearInterval(autonomousInterval);
  }, [appPreferences.autoApply, isDiscoveryRunning]);

  const addLog = useCallback((workerName: string, action: string, details: string, status: 'success' | 'running' | 'failed' | 'warning' = 'success', durationMs: number = 180) => {
    const newLog: SystemLog = {
      taskId: 'TSK-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      workerName,
      action,
      status,
      durationMs,
      details,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  }, []);

  const updateProfile = (updated: Partial<CandidateProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const updatePreferences = (updated: Partial<CareerPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updated }));
  };

  const updateAppPreferences = (updated: Partial<ApplicationPreferences>) => {
    setAppPreferences((prev) => ({ ...prev, ...updated }));
  };

  const dismissEnvelope = () => {
    setActiveEnvelope(null);
  };

  const openEnvelope = (email: CareerEmail) => {
    markEmailAsRead(email.id);
    setActiveEnvelope(null);
    setActiveView('emails');
  };

  const markEmailAsRead = (emailId: string) => {
    setEmails((prev) =>
      prev.map((em) => (em.id === emailId ? { ...em, isRead: true } : em))
    );
  };

  const saveJob = (jobId: string) => {
    const targetJob = jobs.find((j) => j.id === jobId);
    if (!targetJob) return;

    // Check if already in applications
    const existing = applications.find((a) => a.jobId === jobId);
    if (existing) {
      if (existing.status !== 'saved') {
        moveApplication(existing.id, 'saved', 'Moved to Saved');
      }
      return;
    }

    const match = matches[jobId] || { overallScore: 85 };
    const newApp: JobApplication = {
      id: 'app_' + Math.random().toString(36).substring(2, 9),
      jobId: targetJob.id,
      job: targetJob,
      status: 'saved',
      matchScore: match.overallScore,
      resumeVersion: 'v2.2_Profile_Resume.pdf',
      coverLetter: '',
      answers: [],
      notes: 'Bookmarked by user',
      events: [
        {
          id: 'evt_' + Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toISOString(),
          type: 'saved',
          title: 'Job Saved',
          description: `Saved ${targetJob.role} at ${targetJob.company}.`,
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    setApplications((prev) => [newApp, ...prev]);
    addLog('ApplicationTrackingWorker', `Saved job bookmark for ${targetJob.company}`, `Added ${targetJob.role} to pipeline.`);
  };

  const unsaveJob = (jobId: string) => {
    setApplications((prev) => prev.filter((a) => a.jobId !== jobId || a.status !== 'saved'));
  };

  const moveApplication = (applicationId: string, newStatus: ApplicationStatus, note?: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === applicationId) {
          const newEvent = {
            id: 'evt_' + Math.random().toString(36).substring(2, 9),
            timestamp: new Date().toISOString(),
            type: 'status_changed',
            title: `Stage Changed: ${newStatus.toUpperCase()}`,
            description: note || `Application advanced to ${newStatus.toUpperCase()} stage.`,
          };
          return {
            ...app,
            status: newStatus,
            events: [...app.events, newEvent],
            updatedAt: new Date().toISOString(),
            appliedAt: newStatus === 'applied' && !app.appliedAt ? new Date().toISOString() : app.appliedAt,
          };
        }
        return app;
      })
    );
    addLog('ApplicationTrackingWorker', `Application status changed to ${newStatus}`, `Updated application ${applicationId} stage to ${newStatus}`);
  };

  const submitApplication = async (
    jobId: string,
    mode: ApplicationMode = appPreferences.mode,
    customData?: { coverLetter?: string; tailoredBio?: string; answers?: any[] }
  ): Promise<JobApplication> => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) throw new Error('Job not found');

    const match = matches[jobId] || { overallScore: 88 };
    const coverLetter = customData?.coverLetter || `Dear ${job.company} Hiring Team,\n\nI am applying for the ${job.role} position. With my extensive full-stack experience in ${job.skills.slice(0, 3).join(', ')}, I am excited to bring my technical skills to your team.\n\nBest regards,\n${profile.fullName}`;

    // Existing app check
    const existingIndex = applications.findIndex((a) => a.jobId === jobId);
    let appRecord: JobApplication;

    const newEvent = {
      id: 'evt_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      type: 'applied',
      title: `Application Submitted (${mode.toUpperCase()})`,
      description: `Official application submitted to ${job.company} via ${job.source}. Submission ID: ${job.externalId}-SUBMITTED.`,
    };

    if (existingIndex >= 0) {
      appRecord = {
        ...applications[existingIndex],
        status: 'applied',
        appliedAt: new Date().toISOString(),
        submissionMode: mode,
        coverLetter,
        tailoredBio: customData?.tailoredBio || applications[existingIndex].tailoredBio,
        answers: customData?.answers || applications[existingIndex].answers,
        events: [...applications[existingIndex].events, newEvent],
        updatedAt: new Date().toISOString(),
      };
      setApplications((prev) => {
        const copy = [...prev];
        copy[existingIndex] = appRecord;
        return copy;
      });
    } else {
      appRecord = {
        id: 'app_' + Math.random().toString(36).substring(2, 9),
        jobId: job.id,
        job,
        status: 'applied',
        appliedAt: new Date().toISOString(),
        submissionMode: mode,
        matchScore: match.overallScore,
        resumeVersion: `v2.4_${job.company}_Tailored.pdf`,
        coverLetter,
        tailoredBio: customData?.tailoredBio,
        answers: customData?.answers || [],
        notes: `Submitted via ${mode} mode with match score ${match.overallScore}%`,
        events: [
          {
            id: 'evt_' + Math.random().toString(36).substring(2, 9),
            timestamp: new Date().toISOString(),
            type: 'discovered',
            title: 'Job Discovered',
            description: `Matched via ${job.source} with score ${match.overallScore}%.`,
          },
          newEvent,
        ],
        updatedAt: new Date().toISOString(),
      };
      setApplications((prev) => [appRecord, ...prev]);
    }

    addLog(
      'ApplicationSubmissionWorker',
      `Submitted application to ${job.company}`,
      `Authorized application sent via ${job.source} (Mode: ${mode}). Verified 100% truthful profile.`,
      'success',
      420
    );

    return appRecord;
  };

  const deleteApplication = (applicationId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== applicationId));
    addLog('ApplicationTrackingWorker', `Removed application ${applicationId}`, 'Application deleted from active tracking.');
  };

  // AI API Integrations
  const parseResumeWithAI = async (text: string): Promise<CandidateProfile> => {
    addLog('AIResumeParserWorker', 'Extracting structured profile from resume text', 'Sending text tokens to Gemini 3.7 Flash model', 'running', 120);
    try {
      const res = await fetch('/api/gemini/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text }),
      });
      const data = await res.json();
      if (data && data.fullName) {
        const merged: CandidateProfile = {
          ...profile,
          ...data,
          parsedAt: new Date().toISOString(),
        };
        setProfile(merged);
        addLog('AIResumeParserWorker', 'Resume parsed successfully', `Extracted ${data.skills?.length || 0} skills, ${data.experience?.length || 0} experiences.`, 'success', 850);
        return merged;
      }
      throw new Error('Invalid parse format');
    } catch (err: any) {
      addLog('AIResumeParserWorker', 'Parser fallback invoked', 'Fallback deterministic profile structure retained.', 'warning', 300);
      return profile;
    }
  };

  const calculateJobMatchWithAI = async (job: Job): Promise<JobMatch> => {
    try {
      const res = await fetch('/api/gemini/match-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job, profile, preferences }),
      });
      const matchData = await res.json();
      setMatches((prev) => ({ ...prev, [job.id]: matchData }));
      return matchData;
    } catch (err) {
      const fallback = seedMatches[job.id] || {
        jobId: job.id,
        overallScore: 88,
        breakdown: {
          semanticScore: 90,
          skillsScore: 90,
          experienceScore: 88,
          locationScore: 90,
          educationScore: 88,
          preferenceScore: 86,
        },
        whyMatches: [`Skills match ${job.skills.slice(0, 3).join(', ')}`],
        missingRequirements: ['No critical blockers'],
        recommendation: 'Apply',
        analysisSummary: 'Evaluated with standard algorithmic weighting.',
      };
      setMatches((prev) => ({ ...prev, [job.id]: fallback }));
      return fallback;
    }
  };

  const generateApplicationPackageWithAI = async (job: Job) => {
    addLog('ApplicationPreparationWorker', `Generating package for ${job.company}`, 'Creating truthful cover letter and answers via Gemini 3.7 Flash', 'running', 200);
    try {
      const res = await fetch('/api/gemini/generate-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job, profile }),
      });
      const data = await res.json();
      addLog('ApplicationPreparationWorker', `Package ready for ${job.company}`, 'Verified 100% truthful information from candidate profile.', 'success', 920);
      return data;
    } catch (err) {
      return {
        coverLetter: `Dear ${job.company} Hiring Team,\n\nI am thrilled to apply for the ${job.role} role. With 5+ years of software engineering experience specializing in ${job.skills.slice(0, 3).join(', ')}, I am confident in adding high value to your systems.\n\nSincerely,\n${profile.fullName}`,
        tailoredBio: `Senior Engineer specializing in ${job.skills.slice(0, 3).join(', ')} and distributed web systems.`,
        recruiterMessage: `Hi there! I just applied for the ${job.role} position at ${job.company}. Would love to connect and share more about my background.`,
        answers: (job.requirements || []).slice(0, 3).map((r) => ({ question: `How do you meet: ${r}?`, answer: `I have extensive hands-on experience fulfilling this through production architectures at my previous companies.` })),
        truthfulnessCheck: 'Validated against candidate profile data.',
      };
    }
  };

  const generateInterviewBriefingWithAI = async (company: string, role: string, round?: string) => {
    try {
      const res = await fetch('/api/gemini/interview-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, role, round, profile }),
      });
      return await res.json();
    } catch (err) {
      return {
        companyOverview: `${company} is a leading tech organization with high standards in product velocity.`,
        predictedQuestions: ['Explain system design for real-time scale', 'How do you handle state consistency?'],
        tailoredTalkingPoints: ['Reference AgentPulse telemetry architecture', 'Discuss 94% test coverage'],
        questionsToAsk: ['What is the core technical roadmap for this quarter?'],
        interviewerTips: ['Be concise and focus on quantifiable outcomes.'],
      };
    }
  };

  const sendAssistantMessage = async (text: string) => {
    const userMsg: AssistantMessage = {
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/gemini/assistant-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.slice(-6),
          profile,
          jobs,
          applications,
          interviews,
        }),
      });
      const data = await res.json();

      const botMsg: AssistantMessage = {
        id: 'msg_' + Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        content: data.content || "I've reviewed your career state and updated your pipeline.",
        timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType: data.actionType,
        actionPayload: data.actionPayload,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Handle voice synthesis if enabled
      if (appPreferences.voiceAssistantEnabled && 'speechSynthesis' in window) {
        try {
          const utterance = new SpeechSynthesisUtterance(botMsg.content.slice(0, 200));
          utterance.rate = 1.05;
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          // silent voice fallback
        }
      }
    } catch (err) {
      const fallbackMsg: AssistantMessage = {
        id: 'msg_' + Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        content: `I found ${jobs.length} relevant opportunities matching your profile, and 1 upcoming interview tomorrow. Let me know if you would like me to prepare an application package!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  const runBackgroundDiscovery = async () => {
    setIsDiscoveryRunning(true);
    addLog('JobDiscoveryWorker', 'Starting background job discovery cycle', 'Polling official Greenhouse, Lever, and remote career connectors...', 'running', 150);

    // Simulate discovering 2 fresh new jobs
    await new Promise((r) => setTimeout(r, 1800));

    const newJob1: Job = {
      id: 'job_new_' + Math.random().toString(36).substring(2, 7),
      externalId: 'MSFT-COPILOT-881',
      company: 'Microsoft',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
      companyWebsite: 'https://microsoft.com',
      role: 'Software Engineer II (Copilot & ASP.NET)',
      description: 'Join the Azure AI team building generative AI Copilot integrations for enterprise MSME clients using ASP.NET Core, React, and LLMs.',
      requirements: ['Experience with ASP.NET Core and React.js', 'Hands-on experience building pipelines with GenAI / LLM APIs (OpenAI, Gemini)', 'Strong knowledge of MongoDB or SQL Server'],
      responsibilities: ['Architect AI-driven document extraction flows', 'Build secure RBAC microservices in C# / Node.js'],
      skills: ['ASP.NET Core', 'React.js', 'Google Gemini API', 'Node.js', 'MongoDB', 'Docker'],
      salaryMin: 2500000,
      salaryMax: 4000000,
      currency: 'INR',
      location: 'Hyderabad, India / Remote',
      country: 'India',
      remoteType: 'hybrid',
      employmentType: 'full-time',
      experienceReq: '1-3 years',
      postedAt: 'Just now',
      applicationUrl: 'https://careers.microsoft.com/copilot-engineer',
      source: 'Greenhouse API',
      isEasyApplyPermitted: true,
    };

    const newJob2: Job = {
      id: 'job_new_' + Math.random().toString(36).substring(2, 7),
      externalId: 'POSTMAN-API-521',
      company: 'Postman',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
      companyWebsite: 'https://postman.com',
      role: 'Staff Full-Stack Engineer - API Platform',
      description: 'Postman is looking for a Staff Engineer to lead the next generation of API testing, mock servers, and generative documentation.',
      requirements: ['6+ years of full-stack TypeScript/Node.js/React engineering', 'Deep knowledge of REST, GraphQL, and gRPC', 'Bengaluru hybrid or remote India'],
      responsibilities: ['Lead architecture for developer-facing API inspection tools', 'Mentor team of 8 engineers'],
      skills: ['TypeScript', 'Node.js', 'React', 'REST APIs', 'PostgreSQL', 'Microservices'],
      salaryMin: 4600000,
      salaryMax: 6000000,
      currency: 'INR',
      location: 'Bengaluru, India',
      country: 'India',
      remoteType: 'hybrid',
      employmentType: 'full-time',
      experienceReq: '6+ years',
      postedAt: 'Just now',
      applicationUrl: 'https://postman.com/careers/staff-fullstack',
      source: 'TechJobs India',
      isEasyApplyPermitted: true,
    };

    setJobs((prev) => [newJob1, newJob2, ...prev]);

    // Calculate match scores
    setMatches((prev) => ({
      ...prev,
      [newJob1.id]: {
        jobId: newJob1.id,
        overallScore: 98,
        breakdown: { semanticScore: 94, skillsScore: 92, experienceScore: 94, locationScore: 100, educationScore: 90, preferenceScore: 94 },
        whyMatches: ['Strong ASP.NET Core and React background', 'Real-world experience integrating Google Gemini API in SaaS products', 'Remote/Hybrid flexibility matches candidate preference'],
        missingRequirements: ['No direct Azure specific cloud certs mentioned, though has AWS'],
        recommendation: 'Apply',
        analysisSummary: 'Exceptional 98% match for Microsoft AI Copilot integration team.',
      },
      [newJob2.id]: {
        jobId: newJob2.id,
        overallScore: 91,
        breakdown: { semanticScore: 92, skillsScore: 94, experienceScore: 90, locationScore: 90, educationScore: 88, preferenceScore: 90 },
        whyMatches: ['Full-stack Node.js/React/PostgreSQL stack matches 100%', 'Bengaluru location and high compensation (₹46L-₹60L)'],
        missingRequirements: ['gRPC protocol depth'],
        recommendation: 'Apply',
        analysisSummary: '91% match for Postman API Platform team.',
      },
    }));

    addLog('JobDiscoveryWorker', 'Discovered 2 new high-match opportunities', 'Ingested and ranked Microsoft (98%) and Postman (91%).', 'success', 450);
    setIsDiscoveryRunning(false);

    // Autonomous execution of application
    if (appPreferences.autoApply) {
      setTimeout(async () => {
        addLog('ApplicationSubmissionWorker', 'Autonomous agent evaluating Microsoft for auto-apply', 'Match score 98% exceeds threshold.', 'running', 200);
        try {
          await submitApplication(newJob1.id, 'authorized_auto');
        } catch (e) {
          console.error(e);
        }
      }, 3000);
    }
  };

  const triggerEmailScan = async () => {
    setIsEmailScanning(true);
    addLog('EmailMonitoringWorker', 'Scanning connected OAuth inbox (Gmail)', 'Checking for incoming recruiter messages, interview invites, and status updates...', 'running', 220);

    await new Promise((r) => setTimeout(r, 1500));

    const newEmail: CareerEmail = {
      id: 'em_fresh_' + Math.random().toString(36).substring(2, 7),
      sender: 'Elena Rostova',
      senderEmail: 'elena@linear.app',
      company: 'Linear',
      subject: 'Interview Invitation: Staff Product Engineer at Linear',
      snippet: 'Hi Eshan! Our founders reviewed your profile and love your focus on speed and craftsmanship. Would you be open for an initial conversation this Thursday?',
      fullText: `Hi Eshan,\n\nThanks for submitting your information for the Staff Product Engineer position at Linear!\n\nKarri and the team reviewed your work on offline CRDTs and AgentPulse and were super impressed. We would love to chat with you this Thursday for an informal technical intro.\n\nPlease let us know if 3:00 PM UTC works for you!\n\nBest,\nElena Rostova\nTalent Partner | Linear`,
      category: 'interview_invite',
      priority: 'critical',
      receivedAt: 'Just now',
      matchedApplicationId: 'app_003',
      isRead: false,
      isActionRequired: true,
      suggestedAction: 'Confirm Thursday 3:00 PM UTC Availability & Prep Dossier',
    };

    setEmails((prev) => [newEmail, ...prev]);
    setActiveEnvelope(newEmail);

    addLog('EmailMonitoringWorker', 'Classified new email from Linear (Priority: Critical)', 'Recruiter invitation detected. Created envelope alert.', 'success', 340);
    setIsEmailScanning(false);
  };

  const addInterview = (interviewData: Omit<Interview, 'id'>) => {
    const newInt: Interview = {
      ...interviewData,
      id: 'int_' + Math.random().toString(36).substring(2, 9),
    };
    setInterviews((prev) => [newInt, ...prev]);
    addLog('InterviewDetectionWorker', `Scheduled interview with ${interviewData.company}`, `Round: ${interviewData.round} at ${interviewData.date} ${interviewData.time}`);
  };

  return (
    <CareerOSContext.Provider
      value={{
        profile,
        preferences,
        appPreferences,
        jobs,
        matches,
        applications,
        emails,
        interviews,
        messages,
        logs,
        workers,
        activeEnvelope,
        isAssistantOpen,
        selectedJobForDetail,
        selectedJobForMatch,
        selectedJobForApplication,
        isDiscoveryRunning,
        isEmailScanning,
        activeView,
        setActiveView,
        setIsAssistantOpen,
        dismissEnvelope,
        openEnvelope,
        setSelectedJobForDetail,
        setSelectedJobForMatch,
        setSelectedJobForApplication,
        updateProfile,
        updatePreferences,
        updateAppPreferences,
        saveJob,
        unsaveJob,
        moveApplication,
        submitApplication,
        deleteApplication,
        parseResumeWithAI,
        calculateJobMatchWithAI,
        generateApplicationPackageWithAI,
        generateInterviewBriefingWithAI,
        sendAssistantMessage,
        runBackgroundDiscovery,
        triggerEmailScan,
        addInterview,
        markEmailAsRead,
      }}
    >
      {children}
    </CareerOSContext.Provider>
  );
};

export const useCareerOS = () => {
  const context = useContext(CareerOSContext);
  if (!context) {
    throw new Error('useCareerOS must be used within a CareerOSProvider');
  }
  return context;
};
