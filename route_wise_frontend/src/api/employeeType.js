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

// Get all employee types
export const getAllEmployeeTypes = async () => {
  try {
    console.log('Fetching all employee types...');
    const response = await api.get('/employee-types');
    console.log('Employee types response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching employee types:', error);
    throw error;
  }
};

// Get employee type by ID
export const getEmployeeTypeById = async (id) => {
  try {
    console.log('Fetching employee type by ID:', id);
    const response = await api.get(`/employee-types/${id}`);
    console.log('Employee type response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching employee type:', error);
    throw error;
  }
};

// Create new employee type
export const createEmployeeType = async (employeeTypeData) => {
  try {
    console.log('Creating employee type:', employeeTypeData);
    
    // Transform frontend data to backend DTO format
    const dto = {
      employeeTypeName: employeeTypeData.employeeTypeName,
      description: employeeTypeData.description || null
    };
    
    console.log('Sending employee type DTO:', dto);
    const response = await api.post('/employee-types', dto);
    console.log('Create employee type response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating employee type:', error);
    throw error;
  }
};

// Update employee type
export const updateEmployeeType = async (id, employeeTypeData) => {
  try {
    console.log('Updating employee type:', id, employeeTypeData);
    
    // Transform frontend data to backend DTO format
    const dto = {
      employeeTypeName: employeeTypeData.employeeTypeName,
      description: employeeTypeData.description || null
    };
    
    console.log('Sending employee type update DTO:', dto);
    const response = await api.put(`/employee-types/${id}`, dto);
    console.log('Update employee type response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating employee type:', error);
    throw error;
  }
};

// Delete employee type
export const deleteEmployeeType = async (id) => {
  try {
    console.log('Deleting employee type:', id);
    const response = await api.delete(`/employee-types/${id}`);
    console.log('Delete employee type response:', response.status);
    return response.data;
  } catch (error) {
    console.error('Error deleting employee type:', error);
    throw error;
  }
}; 