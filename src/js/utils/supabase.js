// supabase.js - Fixed Version
const SUPABASE_URL = "https://rcqjidncnlqowdsukjqk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjcWppZG5jbmxxb3dkc3VranFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NzM2OTgsImV4cCI6MjA4NDI0OTY5OH0.o8ncEcOeJMr0aNb7PCfLy3jQ4F5Uz8dxVVOw48CiyxY";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Sign up user and create profile automatically
 */
async function signUp(email, password, fullName) {
  try {
    console.log('Starting signup process...');
    
    // إنشاء حساب المستخدم
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
      console.error('Auth error:', authError);
      return { user: null, error: authError };
    }

    if (!authData.user) {
      return { user: null, error: { message: 'Failed to create user' } };
    }

    console.log('User created:', authData.user.id);

    // انتظر قليلاً لإنشاء الملف الشخصي تلقائياً (Trigger)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // محاولة الحصول على الملف الشخصي
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    // إذا لم يتم إنشاء الملف الشخصي تلقائياً، أنشئه يدوياً
    if (profileError || !profile) {
      console.log('Creating profile manually...');
      
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          email: email,
          full_name: fullName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Profile creation error:', insertError);
        return { user: authData.user, error: insertError };
      }

      profile = newProfile;
    }

    // إنشاء الدور الافتراضي
    const { error: roleError } = await supabase
      .from('roles')
      .insert([{ 
        user_id: authData.user.id, 
        role: 'user' 
      }]);

    if (roleError) {
      console.warn('Role creation warning:', roleError);
    }

    console.log('Signup successful!');
    return { 
      user: authData.user, 
      profile,
      error: null 
    };

  } catch (error) {
    console.error('Unexpected signup error:', error);
    return { 
      user: null, 
      error: { message: error.message || 'Signup failed' } 
    };
  }
}

/**
 * Sign in user
 */
async function signIn(email, password) {
  try {
    console.log('Starting signin process...');
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    if (authError) {
      console.error('Sign in error:', authError);
      return { 
        user: null, 
        error: authError 
      };
    }

    if (!authData.user) {
      return { 
        user: null, 
        error: { message: 'Login failed' } 
      };
    }

    console.log('Sign in successful:', authData.user.id);

    // الحصول على الملف الشخصي
    const { profile } = await getOrCreateProfile(authData.user);
    
    // الحصول على الدور
    const { role } = await getUserRole(authData.user.id);

    return {
      user: authData.user,
      session: authData.session,
      profile: profile || null,
      role: role || 'user',
      error: null
    };

  } catch (error) {
    console.error('Unexpected signin error:', error);
    return { 
      user: null, 
      error: { message: error.message || 'Login failed' } 
    };
  }
}

/**
 * Get or create profile
 */
async function getOrCreateProfile(user) {
  try {
    // محاولة الحصول على الملف الشخصي
    let { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile && !error) {
      return { profile, error: null };
    }

    // إذا لم يوجد الملف الشخصي، أنشئه
    if (error && error.code === 'PGRST116') {
      console.log('Profile not found, creating...');
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email.split('@')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (createError) {
        console.error('Profile creation error:', createError);
        return { profile: null, error: createError };
      }

      return { profile: newProfile, error: null };
    }

    return { profile: null, error };

  } catch (error) {
    console.error('getOrCreateProfile error:', error);
    return { profile: null, error };
  }
}

/**
 * Get user role
 */
async function getUserRole(userId) {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      // إنشاء الدور الافتراضي إذا لم يوجد
      if (error.code === 'PGRST116') {
        console.log('Role not found, creating default role...');
        
        const { data: newRole } = await supabase
          .from('roles')
          .insert([{ 
            user_id: userId, 
            role: 'user' 
          }])
          .select('role')
          .single();

        return { 
          role: newRole?.role || 'user', 
          error: null 
        };
      }
      return { role: 'user', error };
    }

    return { role: data.role, error: null };

  } catch (error) {
    console.error('getUserRole error:', error);
    return { role: 'user', error };
  }
}

/**
 * Sign out
 */
async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
    return { error };
  } catch (error) {
    console.error('Unexpected sign out error:', error);
    return { error };
  }
}

/**
 * Require authentication (لحماية صفحات Dashboard)
 */
async function requireAuth(redirectUrl = 'login.html') {
  try {
    // التحقق من الجلسة
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.log('No session found, redirecting...');
      window.location.href = redirectUrl;
      return { user: null, profile: null, role: null };
    }

    // الحصول على المستخدم
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('No user found, redirecting...');
      window.location.href = redirectUrl;
      return { user: null, profile: null, role: null };
    }

    // الحصول على الملف الشخصي والدور
    const { profile } = await getOrCreateProfile(user);
    const { role } = await getUserRole(user.id);

    return { 
      user, 
      profile: profile || null, 
      role: role || 'user' 
    };

  } catch (error) {
    console.error('requireAuth error:', error);
    window.location.href = redirectUrl;
    return { user: null, profile: null, role: null };
  }
}

/**
 * Check authentication status
 */
async function isAuthenticated() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.error('isAuthenticated error:', error);
    return false;
  }
}

/**
 * Listen to auth state changes
 */
function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event);
    callback(event, session);
  });
  return subscription;
}

/**
 * Update user profile
 */
async function updateProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Update profile error:', error);
      return { profile: null, error };
    }

    return { profile: data, error: null };

  } catch (error) {
    console.error('Unexpected update profile error:', error);
    return { profile: null, error };
  }
}

// Export functions (اختياري للاستخدام مع modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    supabase,
    signUp,
    signIn,
    signOut,
    requireAuth,
    isAuthenticated,
    onAuthStateChange,
    updateProfile,
    getOrCreateProfile,
    getUserRole
  };
}