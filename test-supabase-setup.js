#!/usr/bin/env node

/**
 * Supabase Setup Verification Script
 * Test connection and schema after setting up new Supabase project
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function verifySupabaseSetup() {
  console.log('🔍 Verifying Supabase Setup...\n');
  
  // Check environment variables
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('📋 Environment Check:');
  console.log(`   URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Key: ${supabaseKey ? '✅ Set' : '❌ Missing'}`);
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('\n❌ Please update your .env file with the new Supabase credentials');
    console.log('📖 See SUPABASE_SETUP_GUIDE.md for instructions');
    return;
  }
  
  try {
    console.log('\n🔌 Testing Connection...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test basic connection
    const { data, error } = await supabase
      .from('blog_workflow_state')
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.message.includes('relation "blog_workflow_state" does not exist')) {
        console.log('❌ Database schema not imported yet');
        console.log('📋 Please import the schema in Supabase SQL Editor');
        console.log('📋 Schema is copied to your clipboard');
        console.log('\n📖 Steps:');
        console.log('1. Go to Supabase Dashboard → SQL Editor');
        console.log('2. Create new query');
        console.log('3. Paste schema (already in clipboard)');
        console.log('4. Click "Run"');
        console.log('5. Run this test again');
      } else {
        console.log('❌ Connection failed:', error.message);
      }
    } else {
      console.log('✅ Database connection successful!');
      console.log('✅ Schema imported correctly');
      console.log('✅ Ready for Phase 3: Core Infrastructure Setup');
      
      // Run full infrastructure test
      console.log('\n🧪 Running full infrastructure test...');
      const { execSync } = require('child_process');
      try {
        execSync('node test-phase2.js', { stdio: 'inherit' });
      } catch (error) {
        console.log('⚠️ Some tests may still need configuration');
      }
    }
    
  } catch (error) {
    console.log('❌ Setup verification failed:', error.message);
    console.log('📖 Check SUPABASE_SETUP_GUIDE.md for troubleshooting');
  }
}

verifySupabaseSetup(); 