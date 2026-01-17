/**
 * Supabase Configuration and Client Setup
 * 
 * This file initializes the Supabase client and provides authentication utilities.
 * Replace SUPABASE_URL and SUPABASE_ANON_KEY with your actual Supabase project credentials.
 */

// Import Supabase client from CDN (loaded via script tag in HTML)
// Make sure to include this in your HTML: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

// Supabase project configuration
const SUPABASE_URL = 'https://rcqjidncnlqowdsukjqk.supabase.co'; // Replace with your Supabase project URL
const SUPABASE_ANON_KEY = 'sb_publishable_kWaC6QvF8PcAbyldQiovvg_7duu8AgR';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Authentication Helper Functions
 */

/**
 * Sign up a new user with email and password
 * Automatically creates a profile in the profiles table
 * 
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} fullName - User's full name
 * @returns {Promise<{user, error, profile}>}
 */
async function signUp(email, password, fullName) {
    try {
        // Sign up the user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName
                }
            }
        });

        if (authError) {
            return { user: null, error: authError, profile: null };
        }

        // Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Fetch the created profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profileError) {
            console.warn('Profile fetch error:', profileError);
            // Profile might not exist yet due to trigger delay, we'll fetch it on login
        }

        return {
            user: authData.user,
            error: null,
            profile: profile || null
        };
    } catch (error) {
        console.error('Signup error:', error);
        return { user: null, error, profile: null };
    }
}

/**
 * Sign in an existing user
 * Fetches and ensures profile exists
 * 
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<{user, session, error, profile}>}
 */
async function signIn(email, password) {
    try {
        // Sign in the user
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            return { user: null, session: null, error: authError, profile: null, role: null };
        }

        // Fetch or create profile
        const { profile, error: profileError } = await getOrCreateProfile(authData.user);

        if (profileError) {
            console.warn('Profile error:', profileError);
        }

        // Fetch user role
        const { role, error: roleError } = await getUserRole(authData.user.id);

        if (roleError) {
            console.warn('Role error:', roleError);
        }

        return {
            user: authData.user,
            session: authData.session,
            error: null,
            profile: profile || null,
            role: role || 'user' // Default to 'user' if role fetch fails
        };
    } catch (error) {
        console.error('Sign in error:', error);
        return { user: null, session: null, error, profile: null, role: null };
    }
}

/**
 * Get or create a profile for the authenticated user
 * Ensures profile exists, creates one if it doesn't
 * 
 * @param {object} user - The authenticated user object
 * @returns {Promise<{profile, error}>}
 */
async function getOrCreateProfile(user) {
    try {
        // Try to fetch existing profile
        let { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        // If profile exists, return it
        if (profile && !fetchError) {
            return { profile, error: null };
        }

        // If profile doesn't exist, create it
        if (fetchError && fetchError.code === 'PGRST116') {
            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: user.id,
                        email: user.email,
                        full_name: user.user_metadata?.full_name || '',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ])
                .select()
                .single();

            if (createError) {
                console.error('Profile creation error:', createError);
                return { profile: null, error: createError };
            }

            return { profile: newProfile, error: null };
        }

        // Other errors
        return { profile: null, error: fetchError };
    } catch (error) {
        console.error('Get or create profile error:', error);
        return { profile: null, error };
    }
}

/**
 * Get user role from roles table
 * 
 * @param {string} userId - User's ID
 * @returns {Promise<{role, error}>}
 */
async function getUserRole(userId) {
    try {
        const { data: roleData, error } = await supabase
            .from('roles')
            .select('role')
            .eq('user_id', userId)
            .single();

        if (error) {
            // If no role found, create default 'user' role
            if (error.code === 'PGRST116') {
                const { data: newRole, error: createError } = await supabase
                    .from('roles')
                    .insert([{ user_id: userId, role: 'user' }])
                    .select('role')
                    .single();

                if (createError) {
                    console.error('Role creation error:', createError);
                    return { role: 'user', error: createError };
                }

                return { role: newRole.role, error: null };
            }

            console.error('Get role error:', error);
            return { role: 'user', error }; // Default to 'user' on error
        }

        return { role: roleData.role, error: null };
    } catch (error) {
        console.error('Get user role error:', error);
        return { role: 'user', error };
    }
}

/**
 * Check if user has admin role
 * 
 * @param {string} userId - User's ID
 * @returns {Promise<boolean>}
 */
async function isAdmin(userId) {
    const { role } = await getUserRole(userId);
    return role === 'admin';
}

/**
 * Get the current authenticated user, their profile, and role
 * 
 * @returns {Promise<{user, profile, role, error}>}
 */
async function getCurrentUser() {
    try {
        // Get current session
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return { user: null, profile: null, role: null, error: userError };
        }

        // Fetch profile
        const { profile, error: profileError } = await getOrCreateProfile(user);

        // Fetch role
        const { role, error: roleError } = await getUserRole(user.id);

        return {
            user,
            profile: profile || null,
            role: role || 'user',
            error: profileError || roleError
        };
    } catch (error) {
        console.error('Get current user error:', error);
        return { user: null, profile: null, role: null, error };
    }
}

/**
 * Sign out the current user
 * 
 * @returns {Promise<{error}>}
 */
async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        return { error };
    } catch (error) {
        console.error('Sign out error:', error);
        return { error };
    }
}

/**
 * Update user profile
 * 
 * @param {string} userId - User's ID
 * @param {object} updates - Profile fields to update
 * @returns {Promise<{profile, error}>}
 */
async function updateProfile(userId, updates) {
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            console.error('Profile update error:', error);
            return { profile: null, error };
        }

        return { profile, error: null };
    } catch (error) {
        console.error('Update profile error:', error);
        return { profile: null, error };
    }
}

/**
 * Fetch user profile by ID
 * 
 * @param {string} userId - User's ID
 * @returns {Promise<{profile, error}>}
 */
async function getProfile(userId) {
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Get profile error:', error);
            return { profile: null, error };
        }

        return { profile, error: null };
    } catch (error) {
        console.error('Get profile error:', error);
        return { profile: null, error };
    }
}

/**
 * Require authentication - redirect to login if not authenticated
 * Use this on protected pages - checks session BEFORE rendering content
 * 
 * @param {string} redirectUrl - URL to redirect to if not authenticated (default: '/pages/login.html')
 * @returns {Promise<{user, profile, role}>}
 */
async function requireAuth(redirectUrl = '../pages/login.html') {
    try {
        // First, check if there's an active session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            console.log('No active session found, redirecting to login');
            window.location.href = redirectUrl;
            return { user: null, profile: null, role: null };
        }

        // Get the current user from the session
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.log('Failed to get user, redirecting to login');
            window.location.href = redirectUrl;
            return { user: null, profile: null, role: null };
        }

        // Fetch or create profile
        const { profile, error: profileError } = await getOrCreateProfile(user);

        if (profileError) {
            console.warn('Profile error:', profileError);
        }

        // Fetch user role
        const { role, error: roleError } = await getUserRole(user.id);

        if (roleError) {
            console.warn('Role error:', roleError);
        }

        return {
            user,
            profile: profile || null,
            role: role || 'user'
        };
    } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = redirectUrl;
        return { user: null, profile: null, role: null };
    }
}

/**
 * Check if user is authenticated by verifying active session
 * 
 * @returns {Promise<boolean>}
 */
async function isAuthenticated() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        return !error && !!session;
    } catch (error) {
        console.error('Auth check error:', error);
        return false;
    }
}

/**
 * Listen to authentication state changes
 * 
 * @param {function} callback - Callback function to execute on auth state change
 * @returns {object} Subscription object with unsubscribe method
 */
function onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });

    return subscription;
}
