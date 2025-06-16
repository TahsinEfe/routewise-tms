const ITEM_API_URL = "http://localhost:7070/api/order-items";

// Get auth token and user info from localStorage
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('routewise_user') || '{}');
    return user.token || '';
};

const getUserInfo = () => {
    return JSON.parse(localStorage.getItem('routewise_user') || '{}');
};

// Siparişe ürün ekle
export async function addOrderItem(orderItemData) {
    console.log('Adding order item with data:', orderItemData);

    const res = await fetch(ITEM_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(orderItemData),
    });
    if (!res.ok) {
        let errorData;
        try {
            errorData = await res.json();
        } catch (e) {
            errorData = { message: `HTTP ${res.status}: ${res.statusText}` };
        }
        console.error('Add order item error:', errorData);
        throw new Error(errorData.message || 'Failed to add order item');
    }
    return await res.json();
}

// Siparişteki ürünleri getir
export async function getOrderItemsByOrderId(orderId) {
    const res = await fetch(`${ITEM_API_URL}/order/${orderId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });
    if (!res.ok) {
        const errorData = await res.json();
        console.error('Get order items error:', errorData);
        throw new Error(errorData.message || 'Failed to fetch order items');
    }
    return await res.json();
}

// Sipariş ürünü sil
export async function deleteOrderItem(orderItemId) {
    const res = await fetch(`${ITEM_API_URL}/${orderItemId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        }
    });
    if (!res.ok) {
        const errorData = await res.json();
        console.error('Delete order item error:', errorData);
        throw new Error(errorData.message || 'Failed to delete order item');
    }
    return true;
}
