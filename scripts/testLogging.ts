/**
 * Test script for client-side logging
 * Run with: npx tsx scripts/testLogging.ts
 * Note: This test mocks browser APIs for Node.js environment
 */

// Mock browser APIs for Node.js environment
if (typeof window === 'undefined' && typeof global !== 'undefined') {
  Object.defineProperty(global, 'window', {
    value: {
      location: { href: 'http://localhost:3000/test' },
    },
    writable: true,
    configurable: true,
  });
  
  Object.defineProperty(global, 'navigator', {
    value: {
      userAgent: 'Node.js Test Agent',
      sendBeacon: () => true,
    },
    writable: true,
    configurable: true,
  });
}

import { logger } from '../lib/utils/logger';

console.log('🧪 Testing Client-Side Logging\n');

// Test basic logging levels
console.log('1. Testing Basic Log Levels:');
logger.debug('Debug message', { test: 'debug', value: 123 });
logger.info('Info message', { test: 'info', value: 456 });
logger.warn('Warning message', { test: 'warn', value: 789 });
logger.error('Error message', new Error('Test error'), { test: 'error', value: 999 });

console.log('\n2. Testing API Logging:');
logger.apiRequest('GET', '/api/dashboard/score', { userId: 'test-user-123' });
logger.apiResponse('GET', '/api/dashboard/score', 200, 150, { userId: 'test-user-123' });
logger.apiResponse('GET', '/api/dashboard/score', 404, 50, { userId: 'test-user-123' });
logger.apiError('POST', '/api/auth/login', new Error('Invalid credentials'), { userId: 'test-user-123' });

console.log('\n3. Testing User Actions:');
logger.userAction('login', { userId: 'test-user-123', method: 'email' });
logger.userAction('view_dashboard', { userId: 'test-user-123', page: 'dashboard' });
logger.userAction('submit_assessment', { userId: 'test-user-123', assessmentId: 'assess-456' });

console.log('\n4. Testing Performance Logging:');
logger.performance('component_render', 45, { component: 'Dashboard' });
logger.performance('api_call', 234, { endpoint: '/api/dashboard/score' });
logger.performance('data_processing', 1234, { records: 1000 });

console.log('\n5. Testing Error Scenarios:');
try {
  throw new Error('Simulated error');
} catch (error) {
  logger.error('Caught error in test', error instanceof Error ? error : new Error(String(error)), {
    test: 'error-handling',
    context: 'test-script',
  });
}

console.log('\n6. Testing Context Logging:');
logger.info('Complex context logging', {
  user: {
    id: 'user-123',
    email: 'test@example.com',
    role: 'admin',
  },
  request: {
    method: 'POST',
    endpoint: '/api/assessment',
    timestamp: new Date().toISOString(),
  },
  metadata: {
    version: '1.0.0',
    environment: 'development',
  },
});

console.log('\n✅ Client-side logging tests completed!');
console.log('Check the console output above to verify all log levels and formats.');
