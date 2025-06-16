const API_URL = "http://localhost:7070/api/employees";

// Get auth token and user info from localStorage
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('routewise_user') || '{}');
    return user.token || '';
};

const getUserInfo = () => {
    const user = JSON.parse(localStorage.getItem('routewise_user') || '{}');
    return user;
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
    const userInfo = getUserInfo();
    
    // Transform frontend data to backend DTO format
    const backendData = {
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        dateOfBirth: employeeData.dateOfBirth || null,
        phone: employeeData.phone,
        address: employeeData.address,
        email: employeeData.email,
        hireDate: employeeData.hireDate,
        employeeTypeId: employeeData.employeeTypeId,
        departmentId: employeeData.departmentId,
        userId: employeeData.userId || null,
        companyId: employeeData.companyId || userInfo.companyId || 1 // Use user's company ID
    };

    console.log('Creating employee with data:', backendData);

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(backendData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Create employee error:', errorData);
        throw new Error(errorData.message || "Failed to create employee");
    }
    return response.json();
}

// Update employee
export async function updateEmployee(id, employeeData) {
    const userInfo = getUserInfo();
    
    // Transform frontend data to backend DTO format
    const backendData = {
        employeeId: id,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        dateOfBirth: employeeData.dateOfBirth || null,
        phone: employeeData.phone,
        address: employeeData.address,
        email: employeeData.email,
        hireDate: employeeData.hireDate,
        employeeTypeId: employeeData.employeeTypeId,
        departmentId: employeeData.departmentId,
        userId: employeeData.userId || null,
        companyId: employeeData.companyId || userInfo.companyId || 1 // Use user's company ID
    };

    console.log('Updating employee with data:', backendData);

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(backendData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Update employee error:', errorData);
        throw new Error(errorData.message || "Failed to update employee");
    }
    return response.json();
}

// Delete employee (soft delete)
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
        throw new Error(errorData.message || "Failed to delete employee");
    }
    return true;
} 