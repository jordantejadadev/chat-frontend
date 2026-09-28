import api from "../api/axios";

export async function getAllUsers() {
    const response = await api.get("/users");
    return response.data;
}