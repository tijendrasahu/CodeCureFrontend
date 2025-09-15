export const API_CONFIG = {
  BASE_URL: 'https://xbll7p88-5000.inc1.devtunnels.ms/patients',
  ENDPOINTS: {
    REGISTER: '/register',
    LOGIN: '/login',
    PROFILE_DETAILS: '/profile-details',
    PROFILE_UPDATE: '/profile-details-update',
    EVENTS: '/events',
    REPORT_UPLOAD: '/report/upload',
    REPORT_LIST: '/report/list',
    REPORT_DOWNLOAD: '/report/download',
    ISSUE_SUBMIT: '/issue',
    ISSUE_LIST: '/issue/list',
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
  MULTIPART_HEADERS: {
    'Content-Type': 'multipart/form-data',
  },
};

export const getAuthHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export const getMultipartAuthHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
});
