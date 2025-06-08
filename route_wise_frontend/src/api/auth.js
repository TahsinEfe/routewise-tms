const API_URL = "http://localhost:7070/api/auth";

export async function register(userData) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Kayıt başarısız");
    }
    return response.json();
}

export async function login(loginData) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Giriş başarısız");
    }
    return response.json();
}
