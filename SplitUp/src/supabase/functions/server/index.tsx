import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Supabase client with service role (for server operations)
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to verify user authentication
async function verifyAuth(authHeader: string | null) {
  if (!authHeader) {
    return { error: 'Missing authorization header', user: null };
  }
  
  const accessToken = authHeader.split(' ')[1];
  if (!accessToken) {
    return { error: 'Invalid authorization format', user: null };
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user) {
    return { error: 'Unauthorized', user: null };
  }
  
  return { error: null, user };
}

// Health check endpoint
app.get("/make-server-37e4af85/health", (c) => {
  return c.json({ status: "ok" });
});

// ========== AUTH ROUTES ==========

// Sign up
app.post("/make-server-37e4af85/signup", async (c) => {
  try {
    const { email, password, name, phone, upiId } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Error creating user in Supabase Auth:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store additional user data in KV
    const userId = data.user.id;
    await kv.set(`user:${userId}`, {
      id: userId,
      email,
      name,
      phone: phone || null,
      upiId: upiId || null,
      createdAt: new Date().toISOString()
    });

    // Initialize user's friend list
    await kv.set(`user:${userId}:friends`, []);
    
    // Initialize user's groups list
    await kv.set(`user:${userId}:groups`, []);

    return c.json({ 
      success: true, 
      user: { id: userId, email, name, phone, upiId }
    });
  } catch (error) {
    console.log('Error in signup:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// ========== USER ROUTES ==========

// Get current user profile
app.get("/make-server-37e4af85/user/me", async (c) => {
  const { error: authError, user: authUser } = await verifyAuth(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const userData = await kv.get(`user:${authUser!.id}`);
    
    if (!userData) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ user: userData });
  } catch (error) {
    console.log('Error fetching user profile:', error);
    return c.json({ error: 'Failed to fetch user profile' }, 500);
  }
});

// Update current user profile
app.put("/make-server-37e4af85/user/me", async (c) => {
  const { error: authError, user: authUser } = await verifyAuth(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const updates = await c.req.json();
    const currentUser = await kv.get(`user:${authUser!.id}`);
    
    if (!currentUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    const updatedUser = {
      ...currentUser,
      ...updates,
      id: authUser!.id, // Prevent ID change
      email: currentUser.email, // Prevent email change
    };

    await kv.set(`user:${authUser!.id}`, updatedUser);

    return c.json({ user: updatedUser });
  } catch (error) {
    console.log('Error updating user profile:', error);
    return c.json({ error: 'Failed to update user profile' }, 500);
  }
});

// ========== FRIENDS ROUTES ==========

// Get user's friends
app.get("/make-server-37e4af85/friends", async (c) => {
  const { error: authError, user: authUser } = await verifyAuth(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const friendIds = await kv.get(`user:${authUser!.id}:friends`) || [];
    const friendRequests = await kv.get(`user:${authUser!.id}:friend_requests`) || [];
    
    // Fetch friend details
    const friends = [];
    for (const friendId of friendIds) {
      const friend = await kv.get(`user:${friendId}`);
      if (friend) {
        // Calculate balance with this friend
        const balance = await calculateBalanceWithUser(authUser!.id, friendId);
        friends.push({ ...friend, balance, status: 'active' });
      }
    }

    // Fetch pending friend requests
    const pending = [];
    for (const requesterId of friendRequests) {
      const requester = await kv.get(`user:${requesterId}`);
      if (requester) {
        pending.push({ ...requester, balance: 0, status: 'pending' });
      }
    }

    return c.json({ friends: [...friends, ...pending] });
  } catch (error) {
    console.log('Error fetching friends:', error);
    return c.json({ error: 'Failed to fetch friends' }, 500);
  }
});

// Search for users by email, phone, or UPI ID
app.post("/make-server-37e4af85/friends/search", async (c) => {
  const { error: authError, user: authUser } = await verifyAuth(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const { query } = await c.req.json();
    
    if (!query) {
      return c.json({ error: 'Search query required' }, 400);
    }

    // Search users by prefix (email, phone, upiId)
    const allUsers = await kv.getByPrefix('user:');
    const results = [];

    for (const userData of allUsers) {
      // Skip non-user keys and self
      if (!userData.email || userData.id === authUser!.id) continue;
      
      const matchesEmail = userData.email && userData.email.toLowerCase().includes(query.toLowerCase());
      const matchesPhone = userData.phone && userData.phone.includes(query);
      const matchesUpi = userData.upiId && userData.upiId.toLowerCase().includes(query.toLowerCase());
      const matchesName = userData.name && userData.name.toLowerCase().includes(query.toLowerCase());

      if (matchesEmail || matchesPhone || matchesUpi || matchesName) {
        results.push({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          upiId: userData.upiId
        });
      }
    }

    return c.json({ users: results });
  } catch (error) {
    console.log('Error searching users:', error);
    return c.json({ error: 'Failed to search users' }, 500);
  }
});

// Send friend request
app.post("/make-server-37e4af85/friends/request", async (c) => {
  const { error: authError, user: authUser } = await verifyAuth(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const { friendEmail } = await c.req.json();
    
    // Find user by email
    const allUsers = await kv.getByPrefix('user:');
    const targetUser = allUsers.find(u => u.email === friendEmail && u.id);
    
    if (!targetUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    if (targetUser.id === authUser!.id) {
      return c.json({ error: 'Cannot add yourself as friend' }, 400);
    }

    // Check if already friends
    const myFriends = await kv.get(`user:${authUser!.id}:friends`) || [];
    if (myFriends.includes(targetUser.id)) {
      return c.json({ error: 'Already friends' }, 400);
    }

    // Add to target user's friend requests
    const targetRequests = await kv.get(`user:${targetUser.id}:friend_requests`) || [];
    if (!targetRequests.includes(authUser!.id)) {
      targetRequests.push(authUser!.id);
      await kv.set(`user:${targetUser.id}:friend_requests`, targetRequests);
    }

    return c.json({ success: true, message: 'Friend request sent' });
  } catch (error) {
    console.log('Error sending friend request:', error);
    return c.json({ error: 'Failed to send friend request' }, 500);
  }
});

// Accept friend request
app.post("/make-server-37e4af85/friends/accept", async (c) => {
  const { error: authError, user: authUser } = await verifyAuth(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const { friendId } = await c.req.json();
    
    // Remove from friend requests
    const myRequests = await kv.get(`user:${authUser!.id}:friend_requests`) || [];
    const updatedRequests = myRequests.filter((id: string) => id !== friendId);
    await kv.set(`user:${authUser!.id}:friend_requests`, updatedRequests);

    // Add to both users' friend lists
    const myFriends = await kv.get(`user:${authUser!.id}:friends`) || [];
    if (!myFriends.includes(friendId)) {
      myFriends.push(friendId);
      await kv.set(`user:${authUser!.id}:friends`, myFriends);
    }

    const theirFriends = await kv.get(`user:${friendId}:friends`) || [];
    if (!theirFriends.includes(authUser!.id)) {
      theirFriends.push(authUser!.id);
      await kv.set(`user:${friendId}:friends`, theirFriends);
    }

    return c.json({ success: true, message: 'Friend request accepted' });
  } catch (error) {
    console.log('Error accepting friend request:', error);
    return c.json({ error: 'Failed to accept friend request' }, 500);
  }
});

// Reject friend request
app.post("/make-server-37e4af85/friends/reject", async (c) => {
  const { error: authError, user: authUser } = await verifyAuth(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const { friendId } = await c.req.json();
    
    // Remove from friend requests
    const myRequests = await kv.get(`user:${authUser!.id}:friend_requests`) || [];
    const updatedRequests = myRequests.filter((id: string) => id !== friendId);
    await kv.set(`user:${authUser!.id}:friend_requests`, updatedRequests);

    return c.json({ success: true, message: 'Friend request rejected' });
  } catch (error) {
    console.log('Error rejecting friend request:', error);
    return c.json({ error: 'Failed to reject friend request' }, 500);
  }
});

// ========== GROUPS ROUTES ==========

// Get user's groups
app.get("/make-server-37e4af85/groups", async (c) => {
  const { error: authError, user: authUser } = await verifyAuth(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const groupIds = await kv.get(`user:${authUser!.id}:groups`) || [];
    const groups = [];

    for (const groupId of groupIds) {
      const group = await kv.get(`group:${groupId}`);
      if (group) {
        const members = await kv.get(`group:${groupId}:members`) || [];
        const balance = await calculateGroupBalance(authUser!.id, groupId);
        
        groups.push({
          ...group,
          members: members.length,
          balance
        });
      }
    }

    return c.json({ groups });
  } catch (error) {
    console.log('Error fetching groups:', error);
    return c.json({ error: 'Failed to fetch groups' }, 500);
  }
});

// Create group
app.post("/make-server-37e4af85/groups", async (c) => {
  const { error: authError, user: authUser } = await verifyAuth(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const { name, memberIds } = await c.req.json();
    
    if (!name) {
      return c.json({ error: 'Group name required' }, 400);
    }

    const groupId = crypto.randomUUID();
    const group = {
      id: groupId,
      name,
      createdBy: authUser!.id,
      createdAt: new Date().toISOString()
    };

    await kv.set(`group:${groupId}`, group);

    // Add members (including creator)
    const members = [authUser!.id, ...(memberIds || [])];
    const uniqueMembers = [...new Set(members)];
    await kv.set(`group:${groupId}:members`, uniqueMembers);

    // Add group to each member's group list
    for (const memberId of uniqueMembers) {
      const userGroups = await kv.get(`user:${memberId}:groups`) || [];
      if (!userGroups.includes(groupId)) {
        userGroups.push(groupId);
        await kv.set(`user:${memberId}:groups`, userGroups);
      }
    }

    // Initialize expenses list
    await kv.set(`group:${groupId}:expenses`, []);

    return c.json({ group: { ...group, members: uniqueMembers.length, balance: 0 } });
  } catch (error) {
    console.log('Error creating group:', error);
    return c.json({ error: 'Failed to create group' }, 500);
  }
});

// Get group details
app.get("/make-server-37e4af85/groups/:id", async (c) => {
  const { error: authError, user: authUser } = await verifyAuth(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const groupId = c.req.param('id');
    const group = await kv.get(`group:${groupId}`);
    
    if (!group) {
      return c.json({ error: 'Group not found' }, 404);
    }

    // Verify user is member
    const members = await kv.get(`group:${groupId}:members`) || [];
    if (!members.includes(authUser!.id)) {
      return c.json({ error: 'Not a member of this group' }, 403);
    }

    // Get member details
    const memberDetails = [];
    for (const memberId of members) {
      const member = await kv.get(`user:${memberId}`);
      if (member) {
        memberDetails.push({
          id: member.id,
          name: member.name,
          email: member.email
        });
      }
    }

    // Get expenses
    const expenseIds = await kv.get(`group:${groupId}:expenses`) || [];
    const expenses = [];
    for (const expenseId of expenseIds) {
      const expense = await kv.get(`expense:${expenseId}`);
      if (expense) {
        expenses.push(expense);
      }
    }

    // Calculate balances
    const balances = await calculateGroupBalances(groupId, members);

    return c.json({ 
      group: {
        ...group,
        members: memberDetails,
        expenses,
        balances
      }
    });
  } catch (error) {
    console.log('Error fetching group details:', error);
    return c.json({ error: 'Failed to fetch group details' }, 500);
  }
});

// Add member to group
app.post("/make-server-37e4af85/groups/:id/members", async (c) => {
  const { error: authError, user: authUser } = await verifyAuth(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const groupId = c.req.param('id');
    const { memberId } = await c.req.json();

    const group = await kv.get(`group:${groupId}`);
    if (!group) {
      return c.json({ error: 'Group not found' }, 404);
    }

    const members = await kv.get(`group:${groupId}:members`) || [];
    
    if (!members.includes(memberId)) {
      members.push(memberId);
      await kv.set(`group:${groupId}:members`, members);

      // Add group to new member's list
      const userGroups = await kv.get(`user:${memberId}:groups`) || [];
      if (!userGroups.includes(groupId)) {
        userGroups.push(groupId);
        await kv.set(`user:${memberId}:groups`, userGroups);
      }
    }

    return c.json({ success: true, message: 'Member added' });
  } catch (error) {
    console.log('Error adding member to group:', error);
    return c.json({ error: 'Failed to add member' }, 500);
  }
});

// ========== EXPENSES ROUTES ==========

// Create expense
app.post("/make-server-37e4af85/expenses", async (c) => {
  const { error: authError, user: authUser } = await verifyAuth(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const { 
      description, 
      amount, 
      groupId, 
      category, 
      date, 
      notes, 
      isRecurring,
      paidBy,
      splits 
    } = await c.req.json();

    if (!description || !amount || !groupId || !splits) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Verify user is in group
    const members = await kv.get(`group:${groupId}:members`) || [];
    if (!members.includes(authUser!.id)) {
      return c.json({ error: 'Not a member of this group' }, 403);
    }

    const expenseId = crypto.randomUUID();
    const expense = {
      id: expenseId,
      description,
      amount: parseFloat(amount),
      groupId,
      category: category || 'other',
      date: date || new Date().toISOString(),
      notes: notes || '',
      isRecurring: isRecurring || false,
      paidBy: paidBy || authUser!.id,
      createdBy: authUser!.id,
      createdAt: new Date().toISOString()
    };

    await kv.set(`expense:${expenseId}`, expense);

    // Store splits
    await kv.set(`expense:${expenseId}:splits`, splits);

    // Add expense to group
    const groupExpenses = await kv.get(`group:${groupId}:expenses`) || [];
    groupExpenses.push(expenseId);
    await kv.set(`group:${groupId}:expenses`, groupExpenses);

    return c.json({ expense: { ...expense, splits } });
  } catch (error) {
    console.log('Error creating expense:', error);
    return c.json({ error: 'Failed to create expense' }, 500);
  }
});

// Get all expenses for user
app.get("/make-server-37e4af85/expenses", async (c) => {
  const { error: authError, user: authUser } = await verifyAuth(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const groupIds = await kv.get(`user:${authUser!.id}:groups`) || [];
    const allExpenses = [];

    for (const groupId of groupIds) {
      const expenseIds = await kv.get(`group:${groupId}:expenses`) || [];
      
      for (const expenseId of expenseIds) {
        const expense = await kv.get(`expense:${expenseId}`);
        if (expense) {
          const splits = await kv.get(`expense:${expenseId}:splits`) || [];
          const group = await kv.get(`group:${groupId}`);
          const paidByUser = await kv.get(`user:${expense.paidBy}`);
          
          allExpenses.push({
            ...expense,
            splits,
            groupName: group?.name || 'Unknown',
            paidByName: paidByUser?.name || 'Unknown'
          });
        }
      }
    }

    // Sort by date (newest first)
    allExpenses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ expenses: allExpenses });
  } catch (error) {
    console.log('Error fetching expenses:', error);
    return c.json({ error: 'Failed to fetch expenses' }, 500);
  }
});

// ========== SETTLEMENTS ROUTES ==========

// Create settlement
app.post("/make-server-37e4af85/settlements", async (c) => {
  const { error: authError, user: authUser } = await verifyAuth(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const { fromUserId, toUserId, amount, groupId, paymentMethod } = await c.req.json();

    if (!fromUserId || !toUserId || !amount) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const settlementId = crypto.randomUUID();
    const settlement = {
      id: settlementId,
      fromUserId,
      toUserId,
      amount: parseFloat(amount),
      groupId: groupId || null,
      paymentMethod: paymentMethod || null,
      settledAt: new Date().toISOString(),
      createdBy: authUser!.id
    };

    await kv.set(`settlement:${settlementId}`, settlement);

    // Add to settlements list
    const allSettlements = await kv.get('settlements') || [];
    allSettlements.push(settlementId);
    await kv.set('settlements', allSettlements);

    return c.json({ settlement });
  } catch (error) {
    console.log('Error creating settlement:', error);
    return c.json({ error: 'Failed to create settlement' }, 500);
  }
});

// Get settlements
app.get("/make-server-37e4af85/settlements", async (c) => {
  const { error: authError, user: authUser } = await verifyAuth(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const settlementIds = await kv.get('settlements') || [];
    const settlements = [];

    for (const settlementId of settlementIds) {
      const settlement = await kv.get(`settlement:${settlementId}`);
      if (settlement && (settlement.fromUserId === authUser!.id || settlement.toUserId === authUser!.id)) {
        const fromUser = await kv.get(`user:${settlement.fromUserId}`);
        const toUser = await kv.get(`user:${settlement.toUserId}`);
        
        settlements.push({
          ...settlement,
          fromUserName: fromUser?.name || 'Unknown',
          toUserName: toUser?.name || 'Unknown'
        });
      }
    }

    // Sort by date (newest first)
    settlements.sort((a, b) => new Date(b.settledAt).getTime() - new Date(a.settledAt).getTime());

    return c.json({ settlements });
  } catch (error) {
    console.log('Error fetching settlements:', error);
    return c.json({ error: 'Failed to fetch settlements' }, 500);
  }
});

// ========== BALANCE CALCULATION ROUTES ==========

// Get user's overall balances
app.get("/make-server-37e4af85/balances", async (c) => {
  const { error: authError, user: authUser } = await verifyAuth(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const groupIds = await kv.get(`user:${authUser!.id}:groups`) || [];
    let totalOwed = 0;
    let totalOwing = 0;

    for (const groupId of groupIds) {
      const balance = await calculateGroupBalance(authUser!.id, groupId);
      if (balance > 0) {
        totalOwed += balance;
      } else {
        totalOwing += Math.abs(balance);
      }
    }

    return c.json({ 
      totalOwed: Math.round(totalOwed * 100) / 100, 
      totalOwing: Math.round(totalOwing * 100) / 100,
      netBalance: Math.round((totalOwed - totalOwing) * 100) / 100
    });
  } catch (error) {
    console.log('Error calculating balances:', error);
    return c.json({ error: 'Failed to calculate balances' }, 500);
  }
});

// Get statistics
app.get("/make-server-37e4af85/statistics", async (c) => {
  const { error: authError, user: authUser } = await verifyAuth(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const groupIds = await kv.get(`user:${authUser!.id}:groups`) || [];
    let totalSpent = 0;
    const categoryTotals: Record<string, number> = {};
    const monthlySpending: Record<string, number> = {};

    for (const groupId of groupIds) {
      const expenseIds = await kv.get(`group:${groupId}:expenses`) || [];
      
      for (const expenseId of expenseIds) {
        const expense = await kv.get(`expense:${expenseId}`);
        if (expense) {
          const splits = await kv.get(`expense:${expenseId}:splits`) || [];
          const userSplit = splits.find((s: any) => s.userId === authUser!.id);
          
          if (userSplit) {
            totalSpent += userSplit.amount;
            
            // Category breakdown
            const category = expense.category || 'other';
            categoryTotals[category] = (categoryTotals[category] || 0) + userSplit.amount;
            
            // Monthly breakdown
            const month = new Date(expense.date).toISOString().substring(0, 7);
            monthlySpending[month] = (monthlySpending[month] || 0) + userSplit.amount;
          }
        }
      }
    }

    return c.json({
      totalSpent: Math.round(totalSpent * 100) / 100,
      categoryTotals,
      monthlySpending
    });
  } catch (error) {
    console.log('Error calculating statistics:', error);
    return c.json({ error: 'Failed to calculate statistics' }, 500);
  }
});

// ========== HELPER FUNCTIONS ==========

async function calculateBalanceWithUser(userId: string, friendId: string): Promise<number> {
  const groupIds = await kv.get(`user:${userId}:groups`) || [];
  let balance = 0;

  for (const groupId of groupIds) {
    const members = await kv.get(`group:${groupId}:members`) || [];
    
    // Only consider groups where both users are members
    if (members.includes(friendId)) {
      const expenseIds = await kv.get(`group:${groupId}:expenses`) || [];
      
      for (const expenseId of expenseIds) {
        const expense = await kv.get(`expense:${expenseId}`);
        if (!expense) continue;
        
        const splits = await kv.get(`expense:${expenseId}:splits`) || [];
        const userSplit = splits.find((s: any) => s.userId === userId);
        const friendSplit = splits.find((s: any) => s.userId === friendId);
        
        if (expense.paidBy === userId && friendSplit) {
          // User paid, friend owes them
          balance += friendSplit.amount;
        } else if (expense.paidBy === friendId && userSplit) {
          // Friend paid, user owes them
          balance -= userSplit.amount;
        }
      }
    }
  }

  // Account for settlements
  const settlementIds = await kv.get('settlements') || [];
  for (const settlementId of settlementIds) {
    const settlement = await kv.get(`settlement:${settlementId}`);
    if (!settlement) continue;
    
    if (settlement.fromUserId === friendId && settlement.toUserId === userId) {
      balance -= settlement.amount;
    } else if (settlement.fromUserId === userId && settlement.toUserId === friendId) {
      balance += settlement.amount;
    }
  }

  return Math.round(balance * 100) / 100;
}

async function calculateGroupBalance(userId: string, groupId: string): Promise<number> {
  const expenseIds = await kv.get(`group:${groupId}:expenses`) || [];
  let balance = 0;

  for (const expenseId of expenseIds) {
    const expense = await kv.get(`expense:${expenseId}`);
    if (!expense) continue;
    
    const splits = await kv.get(`expense:${expenseId}:splits`) || [];
    const userSplit = splits.find((s: any) => s.userId === userId);
    
    if (expense.paidBy === userId) {
      // User paid, calculate how much others owe them
      const othersTotal = splits
        .filter((s: any) => s.userId !== userId)
        .reduce((sum: number, s: any) => sum + s.amount, 0);
      balance += othersTotal;
    } else if (userSplit) {
      // Someone else paid, user owes them
      balance -= userSplit.amount;
    }
  }

  return Math.round(balance * 100) / 100;
}

async function calculateGroupBalances(groupId: string, memberIds: string[]): Promise<Record<string, number>> {
  const balances: Record<string, number> = {};
  
  for (const memberId of memberIds) {
    balances[memberId] = await calculateGroupBalance(memberId, groupId);
  }
  
  return balances;
}

Deno.serve(app.fetch);
