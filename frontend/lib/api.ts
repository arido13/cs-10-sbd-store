const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  payload?: T;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_by: number;
  created_at: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
}

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const parseResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const rawBody = await response.text();

  if (!rawBody) {
    return {
      success: response.ok,
      message: response.ok ? 'OK' : 'Request failed',
    };
  }

  try {
    return JSON.parse(rawBody) as ApiResponse<T>;
  } catch {
    return {
      success: response.ok,
      message: rawBody,
    };
  }
};

export const api = {
  login: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return parseResponse<LoginResponse>(response);
  },

  register: async (data: {
    name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<ApiResponse<RegisterResponse>> => {
    const response = await fetch(`${API_URL}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return parseResponse<RegisterResponse>(response);
  },

  getAllItems: async (): Promise<ApiResponse<Item[]>> => {
    const response = await fetch(`${API_URL}/items`);
    return parseResponse<Item[]>(response);
  },

  getItemById: async (id: number): Promise<ApiResponse<Item>> => {
    const response = await fetch(`${API_URL}/items/${id}`);
    return parseResponse<Item>(response);
  },

  createItem: async (data: {
    name: string;
    description: string;
    price: number;
    stock: number;
  }): Promise<ApiResponse<Item>> => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return parseResponse<Item>(response);
  },
};
