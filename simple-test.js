#!/usr/bin/env node

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testSupabase() {
  console.log('🔍 Quick Supabase Test...');

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('Key:', supabaseKey ? '✅ Set' : '❌ Missing');

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing credentials');
    return;
  }

  try {
    console.log('🔌 Creating client...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('🔍 Testing query...');
    const { data, error } = await supabase
      .from('blog_workflow_state')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Query failed:', error.message);
    } else {
      console.log('✅ Success! Data:', data);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('🏁 Test complete');
}

testSupabase(); 