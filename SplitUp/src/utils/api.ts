import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-37e4af85`;

// Get auth token from localStorage
export function getAuthToken(): string | null {
  return localStorage.getItem('access_token');
}

// Set auth token in localStorage
export function setAuthToken(token: string) {
  localStorage.setItem('access_token', token);
}

// Clear auth token from localStorage
export function clearAuthToken() {
  localStorage.removeItem('access_token');
}

// Make authenticated API request
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ========== AUTH API ==========

export async function signup(email: string, password: string, name: string, phone?: string, upiId?: string) {
  const response = await apiRequest('/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, phone, upiId }),
  });
  return response;
}

export async function login(email: string, password: string) {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  if (!data.session) throw new Error('No session returned');

  setAuthToken(data.session.access_token);
  return data;
}

export async function logout() {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );

  await supabase.auth.signOut();
  clearAuthToken();
}

export async function getSession() {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );

  const { data, error } = await supabase.auth.getSession();
  
  if (data.session) {
    setAuthToken(data.session.access_token);
    return data.session;
  }
  
  return null;
}

// ========== USER API ==========

export async function getCurrentUser() {
  return apiRequest('/user/me');
}

export async function updateCurrentUser(updates: any) {
  return apiRequest('/user/me', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// ========== FRIENDS API ==========

export async function getFriends() {
  return apiRequest('/friends');
}

export async function searchUsers(query: string) {
  return apiRequest('/friends/search', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
}

export async function sendFriendRequest(friendEmail: string) {
  return apiRequest('/friends/request', {
    method: 'POST',
    body: JSON.stringify({ friendEmail }),
  });
}

export async function acceptFriendRequest(friendId: string) {
  return apiRequest('/friends/accept', {
    method: 'POST',
    body: JSON.stringify({ friendId }),
  });
}

export async function rejectFriendRequest(friendId: string) {
  return apiRequest('/friends/reject', {
    method: 'POST',
    body: JSON.stringify({ friendId }),
  });
}

// ========== GROUPS API ==========

export async function getGroups() {
  return apiRequest('/groups');
}

export async function createGroup(name: string, memberIds: string[]) {
  return apiRequest('/groups', {
    method: 'POST',
    body: JSON.stringify({ name, memberIds }),
  });
}

export async function getGroupDetails(groupId: string) {
  return apiRequest(`/groups/${groupId}`);
}

export async function addGroupMember(groupId: string, memberId: string) {
  return apiRequest(`/groups/${groupId}/members`, {
    method: 'POST',
    body: JSON.stringify({ memberId }),
  });
}

// ========== EXPENSES API ==========

export async function createExpense(expense: {
  description: string;
  amount: number;
  groupId: string;
  category?: string;
  date?: string;
  notes?: string;
  isRecurring?: boolean;
  paidBy?: string;
  splits: { userId: string; amount: number }[];
}) {
  return apiRequest('/expenses', {
    method: 'POST',
    body: JSON.stringify(expense),
  });
}

export async function getExpenses() {
  return apiRequest('/expenses');
}

// ========== SETTLEMENTS API ==========

export async function createSettlement(settlement: {
  fromUserId: string;
  toUserId: string;
  amount: number;
  groupId?: string;
  paymentMethod?: string;
}) {
  return apiRequest('/settlements', {
    method: 'POST',
    body: JSON.stringify(settlement),
  });
}

export async function getSettlements() {
  return apiRequest('/settlements');
}

// ========== BALANCES API ==========

export async function getBalances() {
  return apiRequest('/balances');
}

export async function getStatistics() {
  return apiRequest('/statistics');
}
