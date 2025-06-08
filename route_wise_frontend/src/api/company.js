const API_URL = "http://localhost:7070/api/companies";

export async function getAllCompanies() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch companies');
    return await res.json();
}

export async function getCompanyById(companyId) {
    const res = await fetch(`${API_URL}/${companyId}`);
    if (!res.ok) throw new Error('Company not found');
    return await res.json(); // CompanyDto
}

export async function createCompany(companyData) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyData),
    });
    if (!res.ok) throw new Error('Failed to create company');
    return await res.json();
}

export async function updateCompany(companyId, companyData) {
    const res = await fetch(`${API_URL}/${companyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyData),
    });
    if (!res.ok) throw new Error('Failed to update company');
    return await res.json();
}

export async function deleteCompany(companyId) {
    const res = await fetch(`${API_URL}/${companyId}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error('Failed to delete company');
    return true;
}
