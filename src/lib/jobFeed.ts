import { Job } from '../types';

const JSEARCH_API_KEY = (import.meta as any).env?.VITE_JSEARCH_API_KEY || 'ak_o7bw55wbdopf51vttz1ki8mbabpbpdit2tg10e0c2jsurbl';

/**
 * Fetches real job postings from OpenWebNinja JSearch API.
 * @param query The search query (e.g., "Software Engineer in San Francisco")
 */
export async function fetchRealJobs(query: string, numPages: number = 1): Promise<Job[]> {
  if (!JSEARCH_API_KEY) {
    console.warn('JSearch API key is missing. Ensure VITE_JSEARCH_API_KEY is set in .env');
    return [];
  }

  const url = `https://api.openwebninja.com/jsearch/search-v2?query=${encodeURIComponent(query)}`;
  const options = {
    method: 'GET',
    headers: {
      'X-API-Key': JSEARCH_API_KEY,
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (result && result.data && Array.isArray(result.data)) {
      return result.data.map(mapJSearchJobToCareerOSJob);
    }

    return [];
  } catch (error) {
    console.error('Error fetching jobs from JSearch:', error);
    return [];
  }
}

/**
 * Maps a JSearch API job object to the CareerOS Job type.
 */
function mapJSearchJobToCareerOSJob(jSearchJob: any): Job {
  return {
    id: `job_${Math.random().toString(36).substring(2, 9)}_${jSearchJob.job_id || Date.now()}`,
    externalId: jSearchJob.job_id || '',
    company: jSearchJob.employer_name || 'Unknown Company',
    companyLogo: jSearchJob.employer_logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    companyWebsite: jSearchJob.employer_website || '',
    role: jSearchJob.job_title || 'Software Engineer',
    description: jSearchJob.job_description || '',
    requirements: [
      ...(jSearchJob.job_required_skills || []),
      ...(jSearchJob.job_required_education?.degree_level ? [`Degree: ${jSearchJob.job_required_education.degree_level}`] : [])
    ],
    responsibilities: [], // JSearch doesn't typically break this out neatly, it's all in description
    skills: jSearchJob.job_required_skills || [],
    salaryMin: jSearchJob.job_min_salary || 0,
    salaryMax: jSearchJob.job_max_salary || 0,
    currency: jSearchJob.job_salary_currency || 'USD',
    location: `${jSearchJob.job_city || ''}, ${jSearchJob.job_state || jSearchJob.job_country || ''}`.trim().replace(/^,|,$/g, ''),
    country: jSearchJob.job_country || 'Unknown',
    remoteType: jSearchJob.job_is_remote ? 'remote' : 'onsite',
    employmentType: (jSearchJob.job_employment_type || 'full-time').toLowerCase(),
    experienceReq: jSearchJob.job_required_experience?.required_experience_in_months
      ? `${Math.floor(jSearchJob.job_required_experience.required_experience_in_months / 12)}+ years`
      : 'Not Specified',
    postedAt: jSearchJob.job_posted_at_datetime_utc 
      ? new Date(jSearchJob.job_posted_at_datetime_utc).toLocaleDateString()
      : 'Recently',
    applicationUrl: jSearchJob.job_apply_link || jSearchJob.job_google_link || '',
    source: 'LinkedIn API',
    isEasyApplyPermitted: jSearchJob.job_apply_is_direct || false,
  };
}
