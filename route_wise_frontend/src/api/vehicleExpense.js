const API_URL = "http://localhost:7070/api/vehicle-expenses";

// Get auth token from localStorage
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('routewise_user') || '{}');
    return user.token || '';
};

// Get all vehicle expenses
export async function getAllVehicleExpenses() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch vehicle expenses");
    }
    return response.json();
}

// Get vehicle expenses by vehicle ID
export async function getVehicleExpensesByVehicleId(vehicleId) {
    const response = await fetch(`${API_URL}/vehicle/${vehicleId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch vehicle expenses");
    }
    return response.json();
}

// Get vehicle expenses by company ID
export async function getVehicleExpensesByCompanyId(companyId) {
    const response = await fetch(`${API_URL}/company/${companyId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch vehicle expenses");
    }
    return response.json();
}

// Create new vehicle expense
export async function createVehicleExpense(expenseData) {
    // Transform data to match backend DTO
    const backendData = {
        vehicleId: expenseData.vehicleId,
        expenseDate: expenseData.expenseDate,
        categoryId: expenseData.categoryId || 1, // Default category
        description: expenseData.description,
        amount: parseFloat(expenseData.amount),
        companyId: 1 // Temporary: use fixed company ID
    };

    console.log('Creating vehicle expense with data:', backendData);

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
        console.error('Create vehicle expense error:', errorData);
        throw new Error(errorData.message || "Failed to create vehicle expense");
    }
    return response.json();
}

// Delete vehicle expense
export async function deleteVehicleExpense(expenseId) {
    const response = await fetch(`${API_URL}/${expenseId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Delete vehicle expense error:', errorData);
        throw new Error(errorData.message || "Failed to delete vehicle expense");
    }
    return true;
} 