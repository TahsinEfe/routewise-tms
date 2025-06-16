const API_URL = "http://localhost:7070/api/vehicle-types";

// Get auth token from localStorage
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('routewise_user') || '{}');
    return user.token || '';
};

// Get all vehicle types
export async function getAllVehicleTypes() {
    const response = await fetch(API_URL, {
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

// Get vehicle type by ID
export async function getVehicleTypeById(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch vehicle type");
    }
    return response.json();
}

// Create new vehicle type
export async function createVehicleType(vehicleTypeData) {
    console.log('Creating vehicle type with data:', vehicleTypeData);

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(vehicleTypeData)
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
        }
        console.error('Create vehicle type error:', errorData);
        throw new Error(errorData.message || "Failed to create vehicle type");
    }
    return response.json();
}

// Update vehicle type
export async function updateVehicleType(id, vehicleTypeData) {
    console.log('Updating vehicle type with data:', vehicleTypeData);

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(vehicleTypeData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Update vehicle type error:', errorData);
        throw new Error(errorData.message || "Failed to update vehicle type");
    }
    return response.json();
}

// Delete vehicle type
export async function deleteVehicleType(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Delete vehicle type error:', errorData);
        throw new Error(errorData.message || "Failed to delete vehicle type");
    }
    return true;
} 