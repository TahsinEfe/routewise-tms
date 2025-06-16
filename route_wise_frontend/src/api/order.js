const API_URL = "http://localhost:7070/api/orders";

// Get auth token and user info from localStorage
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('routewise_user') || '{}');
    return user.token || '';
};

const getUserInfo = () => {
    return JSON.parse(localStorage.getItem('routewise_user') || '{}');
};

// TÜM SİPARİŞLERİ LİSTELE
export async function getAllOrders() {
    const res = await fetch(API_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json(); // OrderDto[]
}

// TEK SİPARİŞİ GETİR
export async function getOrderById(orderId) {
    const res = await fetch(`${API_URL}/${orderId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });
    if (!res.ok) throw new Error('Order not found');
    return await res.json(); // OrderDto
}

// SİPARİŞ OLUŞTUR
export async function createOrder(orderData) {
    const userInfo = getUserInfo();
    
    // Ensure companyId is set
    const backendData = {
        ...orderData,
        companyId: orderData.companyId || userInfo.companyId || 1
    };

    console.log('Creating order with data:', backendData);

    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(backendData),
    });
    if (!res.ok) {
        let errorData;
        try {
            errorData = await res.json();
        } catch (e) {
            errorData = { message: `HTTP ${res.status}: ${res.statusText}` };
        }
        console.error('Create order error:', errorData);
        throw new Error(errorData.message || 'Failed to create order');
    }
    return await res.json();
}

// SİPARİŞ GÜNCELLE
export async function updateOrder(orderId, orderData) {
    const userInfo = getUserInfo();
    
    // Ensure companyId is set
    const backendData = {
        ...orderData,
        companyId: orderData.companyId || userInfo.companyId || 1
    };

    console.log('Updating order with data:', backendData);

    const res = await fetch(`${API_URL}/${orderId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(backendData),
    });
    if (!res.ok) {
        const errorData = await res.json();
        console.error('Update order error:', errorData);
        throw new Error(errorData.message || 'Failed to update order');
    }
    return await res.json();
}

// SİPARİŞ SİL
export async function deleteOrder(orderId) {
    const res = await fetch(`${API_URL}/${orderId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });
    if (!res.ok) {
        const errorData = await res.json();
        console.error('Delete order error:', errorData);
        throw new Error(errorData.message || 'Failed to delete order');
    }
    return true;
}