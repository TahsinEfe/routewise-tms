const API_URL = "http://localhost:7070/api/vehicles";

// Get auth token and user info from localStorage
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('routewise_user') || '{}');
    return user.token || '';
};

const getUserInfo = () => {
    const user = JSON.parse(localStorage.getItem('routewise_user') || '{}');
    return user;
};

// Get all vehicles
export async function getAllVehicles() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch vehicles");
    }
    return response.json();
}

// Get vehicle by ID
export async function getVehicleById(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch vehicle");
    }
    return response.json();
}

// Create new vehicle
export async function createVehicle(vehicleData) {
    const userInfo = getUserInfo();
    
    // Transform frontend data to backend DTO format
    const backendData = {
        licensePlate: vehicleData.licensePlate,
        vehicleTypeId: vehicleData.vehicleTypeId,
        assignedDriverId: vehicleData.assignedDriverId || null,
        companyId: 1 // Temporary: use fixed company ID
    };

    console.log('User info:', userInfo);
    console.log('Creating vehicle with data:', backendData);

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(backendData)
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
        }
        console.error('Create vehicle error:', errorData);
        console.error('Response status:', response.status);
        console.error('Response headers:', response.headers);
        throw new Error(errorData.message || "Failed to create vehicle");
    }
    return response.json();
}

// Update vehicle
export async function updateVehicle(id, vehicleData) {
    const userInfo = getUserInfo();
    
    // Transform frontend data to backend DTO format
    const backendData = {
        vehicleId: id,
        licensePlate: vehicleData.licensePlate,
        vehicleTypeId: vehicleData.vehicleTypeId,
        assignedDriverId: vehicleData.assignedDriverId || null,
        companyId: 1 // Temporary: use fixed company ID
    };

    console.log('Updating vehicle with data:', backendData);

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
        console.error('Update vehicle error:', errorData);
        throw new Error(errorData.message || "Failed to update vehicle");
    }
    return response.json();
}

// Delete vehicle (hard delete)
export async function deleteVehicle(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Delete vehicle error:', errorData);
        throw new Error(errorData.message || "Failed to delete vehicle");
    }
    return true;
}

// Get all vehicle types (for dropdown)
export async function getAllVehicleTypes() {
    const response = await fetch("http://localhost:7070/api/vehicle-types", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch vehicle types");
    }
    return response.json();
}

// Get all employees (for driver assignment dropdown)
export async function getAllEmployees() {
    const response = await fetch("http://localhost:7070/api/employees", {
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