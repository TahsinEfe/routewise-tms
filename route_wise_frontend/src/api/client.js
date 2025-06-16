const API_URL = "http://localhost:7070/api/clients";

// Get auth token and user info from localStorage
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('routewise_user') || '{}');
    return user.token || '';
};

const getUserInfo = () => {
    const user = JSON.parse(localStorage.getItem('routewise_user') || '{}');
    return user;
};

// Get all clients
export async function getAllClients() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch clients");
    }
    return response.json();
}

// Get client by ID
export async function getClientById(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch client");
    }
    return response.json();
}

// Create new client
export async function createClient(clientData) {
    const userInfo = getUserInfo();
    
    // Transform frontend data to backend DTO format
    const backendData = {
        companyName: clientData.companyName,
        contactName: clientData.contactName,
        phone: clientData.phone,
        email: clientData.email,
        billingAddress: clientData.billingAddress,
        shippingAddress: clientData.shippingAddress || clientData.billingAddress, // Use billing as default if shipping is empty
        accountManagerId: clientData.accountManagerId || null,
        userId: 1, // Temporary: use fixed user ID until auth is properly configured
        companyId: 1 // Temporary: use fixed company ID
    };

    console.log('User info:', userInfo);
    console.log('Creating client with data:', backendData);

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
        console.error('Create client error:', errorData);
        console.error('Response status:', response.status);
        console.error('Response headers:', response.headers);
        throw new Error(errorData.message || "Failed to create client");
    }
    return response.json();
}

// Update client
export async function updateClient(id, clientData) {
    const userInfo = getUserInfo();
    
    // Transform frontend data to backend DTO format
    const backendData = {
        clientId: id,
        companyName: clientData.companyName,
        contactName: clientData.contactName,
        phone: clientData.phone,
        email: clientData.email,
        billingAddress: clientData.billingAddress,
        shippingAddress: clientData.shippingAddress || clientData.billingAddress, // Use billing as default if shipping is empty
        accountManagerId: clientData.accountManagerId || null,
        userId: 1, // Temporary: use fixed user ID until auth is properly configured
        companyId: 1 // Temporary: use fixed company ID
    };

    console.log('Updating client with data:', backendData);

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
        console.error('Update client error:', errorData);
        throw new Error(errorData.message || "Failed to update client");
    }
    return response.json();
}

// Delete client (soft delete)
export async function deleteClient(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Delete client error:', errorData);
        throw new Error(errorData.message || "Failed to delete client");
    }
    return true;
} 