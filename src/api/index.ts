import axios from 'axios';
import { Campaign, CampaignFormData, LinkedInProfile, PersonalizedMessage, Lead } from '../types';

// const LINKEDIN_EMAIL = 'aman212343221@gmail.com';
// const LINKEDIN_PASSWORD = 'Chaudhary@1212';

// Explicitly use HTTP protocol
const API_BASE_URL = 'http://18.206.140.165:5001/api';

// Create axios instance with configurations for mixed content
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// This is a workaround for the mixed content issue with Render
// We'll use a simple proxy approach for the deployed version
// Create a function to determine if we need to use the proxy
const getApiUrl = (endpoint: string) => {
  // When in development, use the direct URL
  if (window.location.hostname === 'localhost') {
    return `${API_BASE_URL}${endpoint}`;
  }
  
  // When deployed on Render with HTTPS, try to use relative URLs
  // which will inherit the current protocol (HTTPS)
  return endpoint;
};

// Campaign API calls with the proxy approach
export const getCampaigns = async (): Promise<Campaign[]> => {
  try {
    // Try direct approach first
    const response = await axios.get(`${API_BASE_URL}/campaigns`);
    return response.data;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

export const getCampaign = async (id: string): Promise<Campaign> => {
  const response = await api.get(`/campaigns/${id}`);
  return response.data;
};

export const createCampaign = async (campaign: CampaignFormData): Promise<Campaign> => {
  const response = await api.post('/campaigns', campaign);
  return response.data;
};

export const updateCampaign = async (id: string, campaign: Partial<CampaignFormData>): Promise<Campaign> => {
  const response = await api.put(`/campaigns/${id}`, campaign);
  return response.data;
};

export const deleteCampaign = async (id: string): Promise<void> => {
  await api.delete(`/campaigns/${id}`);
};

// LinkedIn Message API call
export const generatePersonalizedMessage = async (profileData: LinkedInProfile): Promise<PersonalizedMessage> => {
  const response = await api.post('/personalized-message', profileData);
  return response.data;
};

// Scraper APIs
export const startScraping = async (
  searchUrl: string,
  linkedinEmail: string,
  linkedinPassword: string,
  maxProfiles?: number
): Promise<{ message: string }> => {
  const response = await api.post('/scrape/start', { 
    searchUrl,
    linkedinEmail,
    linkedinPassword,
    maxProfiles
  });
  return response.data;
};

export const getScrapedLeads = async (): Promise<Lead[]> => {
  const response = await api.get('/scrape/leads');
  return response.data;
};

export const getSourceUrls = async (): Promise<string[]> => {
  const response = await api.get('/scrape/sources');
  return response.data;
};

export const getLeadsBySource = async (sourceUrl: string): Promise<Lead[]> => {
  const response = await api.get('/scrape/leads/source', {
    params: { url: sourceUrl }
  });
  return response.data;
}; 