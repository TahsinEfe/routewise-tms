const API_URL = "http://localhost:7070/api/orders";

// TÜM SİPARİŞLERİ LİSTELE
export async function getAllOrders() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json(); // OrderDto[]
}

// TEK SİPARİŞİ GETİR
export async function getOrderById(orderId) {
    const res = await fetch(`${API_URL}/${orderId}`);
    if (!res.ok) throw new Error('Order not found');
    return await res.json(); // OrderDto
}

// SİPARİŞ OLUŞTUR
export async function createOrder(orderData) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error('Failed to create order');
    return await res.json();
}

// SİPARİŞ GÜNCELLE
export async function updateOrder(orderId, orderData) {
    const res = await fetch(`${API_URL}/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error('Failed to update order');
    return await res.json();
}

// SİPARİŞ SİL
export async function deleteOrder(orderId) {
    const res = await fetch(`${API_URL}/${orderId}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error('Failed to delete order');
    return true;
}