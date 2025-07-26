/**
 * Test Supabase Integration
 * Verifies that Supabase state sync is working correctly
 */

require('dotenv').config();
const SupabaseSync = require('./utils/supabaseSync');

async function testSupabaseSync() {
  console.log('🧪 Testing Supabase Integration...\n');

  const supabaseSync = new SupabaseSync();

  try {
    // Test 1: Insert new workflow state
    console.log('1️⃣ Testing workflow state insertion...');
    const testPostId = `test-${Date.now()}`;
    
    const insertResult = await supabaseSync.insertWorkflowState(testPostId, {
      title: 'Test Blog Post',
      current_phase: 'SEO',
      next_agent: 'BlogAgent',
      status: 'in_progress',
      agents_run: [],
      metadata: { test: true }
    });
    
    console.log('✅ Insert successful:', insertResult);

    // Test 2: Get workflow state
    console.log('\n2️⃣ Testing workflow state retrieval...');
    const getResult = await supabaseSync.getWorkflowState(testPostId);
    console.log('✅ Get successful:', getResult);

    // Test 3: Update workflow state
    console.log('\n3️⃣ Testing workflow state update...');
    const updateResult = await supabaseSync.updateWorkflowState(testPostId, {
      current_phase: 'SEO_COMPLETE',
      next_agent: 'BlogAgent',
      status: 'in_progress',
      agents_run: ['SEOAgent'],
      metadata: { seo_score: 85, test: true }
    });
    
    console.log('✅ Update successful:', updateResult);

    // Test 4: Verify final state
    console.log('\n4️⃣ Verifying final state...');
    const finalState = await supabaseSync.getWorkflowState(testPostId);
    console.log('✅ Final state:', finalState);

    console.log('\n🎉 All Supabase tests passed!');
    console.log('Your Supabase integration is working correctly.');

  } catch (error) {
    console.error('\n❌ Supabase test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
    console.log('2. Verify your Supabase project has the blog_workflow_state table');
    console.log('3. Ensure your service role key has proper permissions');
  }
}

// Run the test
testSupabaseSync(); 