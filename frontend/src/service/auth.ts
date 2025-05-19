
import axios from 'axios';
interface LoginResponse {
  message: string;
  accessToken: string;
}
interface RegisterResponse {
  message: string;
}
const url = 'http://localhost:3000/api/v1'
export async function Login (email: string, password: string): Promise<LoginResponse>{
    try {
        const response = await axios.post(`${url}/auth/login`, {
            email,
            password
        })
        const data: LoginResponse = response.data;
        if(!response.data.success){
            throw new Error(data.message);
        }
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred');
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}