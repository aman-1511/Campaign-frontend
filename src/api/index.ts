import axios from 'axios';
import { Campaign, CampaignFormData, LinkedInProfile, PersonalizedMessage, Lead } from '../types';

// const LINKEDIN_EMAIL = 'aman212343221@gmail.com';
// const LINKEDIN_PASSWORD = 'Chaudhary@1212';

// Hardcode the API URL to ensure HTTP is used
const API_BASE_URL = 'http://18.206.140.165:5001/api';

// Create axios instance with configurations to handle mixed content
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle mixed content issues
api.interceptors.request.use((config) => {
  // For deployed environments, if we detect we're on HTTPS but calling HTTP
  if (window.location.protocol === 'https:' && config.url?.startsWith('http:')) {
    console.log('Detected mixed content request, attempting to fix:', config.url);
    
    // Try to use relative URL instead which will inherit the protocol
    if (config.url.includes('18.206.140.165:5001')) {
      // Extract just the path part
      const urlParts = config.url.split('18.206.140.165:5001');
      if (urlParts.length > 1) {
        config.url = urlParts[1];
        console.log('Using relative URL instead:', config.url);
      }
    }
  }
  return config;
});

// Campaign API calls - endpoints are now relative to the baseURL
export const getCampaigns = async (): Promise<Campaign[]> => {
  const response = await api.get('/campaigns'); // Now hits http://localhost:5001/api/campaigns
  return response.data;
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