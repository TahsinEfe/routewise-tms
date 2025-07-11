const API_URL = "http://localhost:7070/api/employees";

// Get auth token and user info from localStorage
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('routewise_user') || '{}');
    return user.token || '';
};

const getUserInfo = () => {
    return JSON.parse(localStorage.getItem('routewise_user') || '{}');
};

// Get all employees
export async function getAllEmployees() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch employees");
    }
    return response.json();
}

// Get employee by ID
export async function getEmployeeById(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch employee");
    }
    return response.json();
}

// Create new employee
export async function createEmployee(employeeData) {
    console.log('Creating employee with data:', employeeData);

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(employeeData)
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
        }
        console.error('Create employee error:', errorData);
        throw new Error(errorData.message || "Failed to create employee");
    }
    return response.json();
}

// Update employee
export async function updateEmployee(id, employeeData) {
    console.log('Updating employee with data:', employeeData);

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(employeeData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Update employee error:', errorData);
        throw new Error(errorData.message || "Failed to update employee");
    }
    return response.json();
}

// Delete employee
export async function deleteEmployee(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Delete employee error:', errorData);
        throw new Error(errorData.message || "Failed to delete employee");
    }
    return true;
} 