const ITEM_API_URL = "http://localhost:7070/api/order-items";

// Siparişe ürün ekle
export async function addOrderItem(orderItemData) {
    const res = await fetch(ITEM_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderItemData),
    });
    if (!res.ok) throw new Error('Failed to add order item');
    return await res.json();
}

// Siparişteki ürünleri getir
export async function getOrderItemsByOrderId(orderId) {
    const res = await fetch(`${ITEM_API_URL}/order/${orderId}`);
    if (!res.ok) throw new Error('Failed to fetch order items');
    return await res.json();
}

// Ürün sil
export async function deleteOrderItem(orderItemId) {
    const res = await fetch(`${ITEM_API_URL}/${orderItemId}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error('Failed to delete order item');
    return true;
}
