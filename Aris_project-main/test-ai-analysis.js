// Simple test script to verify AI analysis is working
const testAnalysis = async () => {
  try {
    console.log('🧪 Testing AI Analysis...')
    
    // Test data
    const testRequest = {
      requestId: 'TEST-001',
      skills: [
        { skill: 'Python', level: 'expert', count: 2, mandatory: true },
        { skill: 'Machine Learning', level: 'intermediate', count: 1, mandatory: true },
        { skill: 'React', level: 'beginner', count: 1, mandatory: false }
      ],
      teamSize: 3
    }
    
    const response = await fetch('http://localhost:3000/api/ai-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testRequest)
    })
    
    const result = await response.json()
    
    if (result.success) {
      console.log('✅ AI Analysis Test Passed!')
      console.log('Results:', {
        readyNow: result.analysis.readyNow.length,
        ready2Weeks: result.analysis.ready2Weeks.length,
        ready4Weeks: result.analysis.ready4Weeks.length,
        externalHireNeeded: result.analysis.externalHireNeeded,
        confidenceScore: result.analysis.confidenceScore
      })
    } else {
      console.log('❌ AI Analysis Test Failed:', result.error)
    }
  } catch (error) {
    console.log('❌ Test Error:', error.message)
  }
}

// Run test if this is executed directly
if (typeof window === 'undefined') {
  testAnalysis()
}

module.exports = { testAnalysis }
