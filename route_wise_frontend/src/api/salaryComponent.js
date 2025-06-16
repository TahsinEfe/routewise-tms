import axios from 'axios';

const API_BASE_URL = 'http://localhost:7070/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all salary component types
export const getAllSalaryComponentTypes = async () => {
  try {
    console.log('Fetching all salary component types...');
    const response = await api.get('/salary-component-types');
    console.log('Salary component types response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching salary component types:', error);
    throw error;
  }
};

// Create new salary component type
export const createSalaryComponentType = async (componentData) => {
  try {
    console.log('Creating salary component type:', componentData);
    
    // Transform frontend data to backend DTO format
    const dto = {
      componentTypeName: componentData.componentName,
      description: componentData.description || null
    };
    
    console.log('Sending salary component type DTO:', dto);
    const response = await api.post('/salary-component-types', dto);
    console.log('Create salary component type response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating salary component type:', error);
    throw error;
  }
};

// Delete salary component type
export const deleteSalaryComponentType = async (id) => {
  try {
    console.log('Deleting salary component type:', id);
    const response = await api.delete(`/salary-component-types/${id}`);
    console.log('Delete salary component type response:', response.status);
    return response.data;
  } catch (error) {
    console.error('Error deleting salary component type:', error);
    throw error;
  }
}; 