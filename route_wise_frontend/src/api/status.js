const API_URL = "http://localhost:7070/api/statuses";

// Get auth token and user info from localStorage
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('routewise_user') || '{}');
    return user.token || '';
};

const getUserInfo = () => {
    return JSON.parse(localStorage.getItem('routewise_user') || '{}');
};

// Get all statuses
export async function getAllStatuses() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch statuses");
    }
    return response.json();
}

// Get status by ID
export async function getStatusById(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch status");
    }
    return response.json();
}

// Create new status (admin only)
export async function createStatus(statusData) {
    console.log('Creating status with data:', statusData);

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(statusData)
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
        }
        console.error('Create status error:', errorData);
        throw new Error(errorData.message || "Failed to create status");
    }
    return response.json();
}

// Update status (admin only)
export async function updateStatus(id, statusData) {
    console.log('Updating status with data:', statusData);

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(statusData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Update status error:', errorData);
        throw new Error(errorData.message || "Failed to update status");
    }
    return response.json();
}

// Delete status (admin only)
export async function deleteStatus(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Delete status error:', errorData);
        throw new Error(errorData.message || "Failed to delete status");
    }
    return true;
} 