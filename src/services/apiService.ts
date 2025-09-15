import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, getAuthHeaders, getMultipartAuthHeaders } from '../config/apiConfig';

// Types
export interface RegisterRequest {
  first_name: string;
  last_name: string;
  age: string;
  dob: string;
  sex: 'M' | 'F';
  mobile: string;
  password: string;
  confirm_password: string;
  otp: string;
}

export interface RegisterResponse {
  message: string;
  unique_id: string;
}

export interface LoginRequest {
  mobile: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface ProfileResponse {
  profile: {
    _id: string;
    first_name: string;
    last_name: string;
    age: number;
    dob: string;
    sex: string;
    mobile: string;
    created_at: string;
    profile: {
      blood_group?: string;
      address?: string;
      email?: string;
      category?: string;
      father?: string;
      mother?: string;
      profile_image?: string;
    };
    unique_id: string;
  };
}

export interface ProfileUpdateRequest {
  blood_group?: string;
  email?: string;
  category?: string;
  father?: string;
  mother?: string;
  address?: string;
  profile_image?: any; // File object
}

export interface ProfileUpdateResponse {
  message: string;
  profile: {
    blood_group?: string;
    email?: string;
    category?: string;
    father?: string;
    mother?: string;
    address?: string;
    profile_image?: string;
  };
}

export interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
}

export interface EventsResponse {
  events: Event[];
}

export interface ReportUploadResponse {
  message: string;
  filename: string;
}

export interface Report {
  _id: string;
  user_id: string;
  filename: string;
  original_name: string;
  uploaded_at: string;
}

export interface ReportsListResponse {
  reports: Report[];
}

export interface IssueSubmitRequest {
  text?: string;
  language_code?: string;
  audio?: any; // File object
}

export interface IssueSubmitResponse {
  message: string;
}

export interface Issue {
  _id: string;
  user_id: string;
  created_at: string;
  text?: string;
  translated?: string;
  audio_filename?: string;
  audio_transcript?: string;
}

export interface IssuesListResponse {
  issues: Issue[];
}

// API Service Class
class ApiService {
  private async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('access_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  private async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('access_token', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  }

  private async clearToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('access_token');
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...API_CONFIG.HEADERS,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async makeMultipartRequest<T>(
    endpoint: string,
    formData: FormData,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        ...options,
        headers: {
          ...getMultipartAuthHeaders(await this.getToken() || ''),
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Multipart API request failed:', error);
      throw error;
    }
  }

  // Authentication APIs
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return this.makeRequest<RegisterResponse>(API_CONFIG.ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.makeRequest<LoginResponse>(API_CONFIG.ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Store the token
    await this.setToken(response.access_token);
    return response;
  }

  async logout(): Promise<void> {
    await this.clearToken();
  }

  // Profile APIs
  async getProfile(): Promise<ProfileResponse> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    return this.makeRequest<ProfileResponse>(API_CONFIG.ENDPOINTS.PROFILE_DETAILS, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  }

  async updateProfile(data: ProfileUpdateRequest): Promise<ProfileUpdateResponse> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    
    if (data.blood_group) formData.append('blood_group', data.blood_group);
    if (data.email) formData.append('email', data.email);
    if (data.category) formData.append('category', data.category);
    if (data.father) formData.append('father', data.father);
    if (data.mother) formData.append('mother', data.mother);
    if (data.address) formData.append('address', data.address);
    if (data.profile_image) {
      formData.append('profile_image', {
        uri: data.profile_image.uri,
        type: data.profile_image.type || 'image/jpeg',
        name: data.profile_image.name || 'profile.jpg',
      } as any);
    }

    return this.makeMultipartRequest<ProfileUpdateResponse>(
      API_CONFIG.ENDPOINTS.PROFILE_UPDATE,
      formData,
      { method: 'PUT' }
    );
  }

  // Events API
  async getEvents(): Promise<EventsResponse> {
    return this.makeRequest<EventsResponse>(API_CONFIG.ENDPOINTS.EVENTS, {
      method: 'GET',
    });
  }

  // Reports APIs
  async uploadReport(file: any): Promise<ReportUploadResponse> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type || 'application/pdf',
      name: file.name || 'report.pdf',
    } as any);

    return this.makeMultipartRequest<ReportUploadResponse>(
      API_CONFIG.ENDPOINTS.REPORT_UPLOAD,
      formData
    );
  }

  async getReports(): Promise<ReportsListResponse> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    return this.makeRequest<ReportsListResponse>(API_CONFIG.ENDPOINTS.REPORT_LIST, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  }

  async downloadReport(filename: string): Promise<Blob> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REPORT_DOWNLOAD}/${filename}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Download request failed:', error);
      throw error;
    }
  }

  // Issues APIs
  async submitIssue(data: IssueSubmitRequest): Promise<IssueSubmitResponse> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    
    if (data.text) formData.append('text', data.text);
    if (data.language_code) formData.append('language_code', data.language_code);
    if (data.audio) {
      formData.append('audio', {
        uri: data.audio.uri,
        type: data.audio.type || 'audio/wav',
        name: data.audio.name || 'audio.wav',
      } as any);
    }

    return this.makeMultipartRequest<IssueSubmitResponse>(
      API_CONFIG.ENDPOINTS.ISSUE_SUBMIT,
      formData
    );
  }

  async getIssues(): Promise<IssuesListResponse> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    return this.makeRequest<IssuesListResponse>(API_CONFIG.ENDPOINTS.ISSUE_LIST, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  }

  // Utility methods
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}

export const apiService = new ApiService();
