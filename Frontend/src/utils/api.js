export const fetchWithAuth = async (url, options = {}) => {
  const token = sessionStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Token ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Handle unauthorized access
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userName');
    window.location.href = '/login';
    return;
  }

  return response;
}; 