import {
  CandidateProfile,
  CareerPreferences,
  ApplicationPreferences,
  Job,
  JobMatch,
  JobApplication,
  CareerEmail,
  Interview,
  SystemLog,
  WorkerStatus,
} from '../types';

export const initialProfile: CandidateProfile = {
  id: 'cand_eshan_001',
  userId: 'usr_eshan_001',
  fullName: 'Eshan Saxena',
  email: 'eshanbsaxena@gmail.com',
  phone: '+91-9068499452',
  location: 'Agra, India',
  headline: 'Software Developer (AI & Full Stack)',
  bio: 'AI-Powered Full Stack Software Engineer specializing in building production-grade SaaS platforms that integrate LLM/GenAI (Google Gemini, OpenAI) into real-world business workflows. Proven track record delivering full-stack systems using React, Node.js/ASP.NET Core, and MongoDB/SQL Server that automate manual processes, cut operational time by over 90%, and scale to hundreds of users.',
  skills: [
    'JavaScript',
    'Python',
    'Java',
    'SQL',
    'React.js',
    'TailwindCSS',
    'Vite',
    'ASP.NET Core',
    'Node.js',
    'Express.js',
    'REST APIs',
    'Google Gemini API',
    'OpenAI API',
    'Prompt Engineering',
    'TensorFlow',
    'OpenCV',
    'MongoDB',
    'SQL Server',
    'PostgreSQL',
    'Docker',
    'AWS',
    'CI/CD (GitHub Actions)',
    'Microservices'
  ],
  technologies: [
    'React 19',
    'ASP.NET Core',
    'Node.js',
    'Google Gemini API',
    'MongoDB',
    'Docker',
    'GitHub Actions'
  ],
  experience: [
    {
      id: 'exp_1',
      role: 'Software Developer',
      company: 'Infominer Group',
      location: 'Agra, India',
      startDate: '2026-08',
      isCurrent: true,
      highlights: [
        'Engineered an AI-powered PD Automator SaaS platform in ASP.NET Core, React.js, Node.js, and MongoDB, cutting report preparation time by 92%.',
        'Built a multilingual NLP extraction engine using Google Gemini API to auto-populate underwriting forms.',
        'Developed a real-time "Waterfall" cash flow computation engine for credit reports.',
        'Architected an HTML-to-PDF report generation pipeline via Google Drive API and Gemini AI.'
      ],
    },
    {
      id: 'exp_2',
      role: 'Junior Web Developer',
      company: 'Career Point Ltd.',
      location: 'Agra, India',
      startDate: '2024-06',
      endDate: '2024-09',
      isCurrent: false,
      highlights: [
        'Engineered modular React.js components integrated with RESTful APIs, improving application responsiveness by 35% for 500+ users.',
        'Partnered with product and engineering teams to accelerate feature delivery by 40%.'
      ],
    },
  ],
  education: [
    {
      id: 'edu_1',
      institution: 'GLA University',
      degree: 'Bachelor of Technology',
      field: 'Computer Science and Engineering',
      startDate: '2022',
      endDate: '2026',
      gpa: '',
    },
  ],
  projects: [
    {
      id: 'proj_1',
      title: 'AI Interview Coach',
      description: 'Full-stack AI interview platform integrating OpenAI/Gemini APIs to generate dynamic technical and HR questions.',
      technologies: ['React.js', 'Node.js', 'MongoDB', 'OpenAI/Gemini API', 'LLMs'],
    },
    {
      id: 'proj_2',
      title: 'Enterprise E-Commerce Platform',
      description: 'Production-ready MERN application with JWT auth and RBAC across 15+ RESTful endpoints.',
      technologies: ['MERN Stack', 'JWT', 'REST APIs'],
    },
    {
      id: 'proj_3',
      title: 'AI Gesture Recognition System',
      description: 'Real-time computer-vision gesture-control system achieving 92% accuracy at sub-50ms latency.',
      technologies: ['Python', 'OpenCV', 'TensorFlow'],
    }
  ],
  certifications: [
    'JPMorgan Chase – Software Engineering Simulation (Forage)',
    'Goldman Sachs – Operations Simulation (Forage)'
  ],
  links: {
    github: 'https://github.com/Eshan1402',
    linkedin: 'https://linkedin.com/in/eshanbsaxena',
  },
  resumeFileName: 'Eshan_Saxena_Resume.pdf',
  resumeRawText: 'AI-Powered Full Stack Software Engineer specializing in building production-grade SaaS platforms that integrate LLM/GenAI.',
  parsedAt: new Date().toISOString(),
};

export const initialCareerPreferences: CareerPreferences = {
  targetTitles: [
    'Senior Full-Stack Engineer',
    'Staff Software Engineer',
    'Senior Frontend Engineer',
    'Backend Engineer (Distributed Systems)',
    'AI Systems / Full-Stack Engineer',
  ],
  targetIndustries: ['AI & Developer Tools', 'Fintech', 'SaaS Platforms', 'Cloud Infrastructure', 'Productivity'],
  targetCountries: ['India', 'United States', 'Remote (Global)', 'Germany', 'Singapore', 'United Kingdom'],
  targetCities: ['Bengaluru', 'San Francisco', 'New York', 'London', 'Berlin', 'Remote'],
  remotePreference: 'remote',
  minSalary: 3800000,
  currency: 'INR',
  experienceLevel: 'senior',
  employmentType: 'full-time',
  preferredTech: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Next.js', 'Redis', 'Python', 'LLMs'],
  preferredCompanies: ['Stripe', 'Linear', 'Vercel', 'Supabase', 'OpenAI', 'Razorpay', 'Figma', 'Swiggy', 'Zerodha', 'Notion'],
  companiesToAvoid: ['Legacy Outsourcing Corp', 'CryptoScam Ltd'],
  visaRequired: false,
  willingToRelocate: true,
};

export const initialApplicationPreferences: ApplicationPreferences = {
  mode: 'assisted',
  minMatchScore: 80,
  dailyApplicationLimit: 8,
  maxPerCompany: 2,
  autoCoverLetter: true,
  autoCustomizeResume: true,
  autoAnswerQuestions: true,
  notificationLevel: 'all',
  emailIntegrationEnabled: true,
  voiceAssistantEnabled: true,
};

export const seedJobs: Job[] = [];
export const seedMatches: Record<string, JobMatch> = {};
export const seedApplications: JobApplication[] = [];
export const seedEmails: CareerEmail[] = [];
export const seedInterviews: Interview[] = [];
export const seedWorkers: WorkerStatus[] = [];
export const seedLogs: SystemLog[] = [];
