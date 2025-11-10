// Main Application
import { Button, Card, Alert } from '@focuspulse/ui';
import { formatDate, delay } from '@focuspulse/utils';

async function main() {
  console.log('FocusPulse Application Started');
  console.log('Current Date:', formatDate(new Date()));

  // Simulate some UI rendering
  console.log('\n--- UI Components Demo ---');
  console.log(Button('click me'));
  console.log(Card('welcome', 'This is a Bun workspace example'));
  console.log(Alert('System is running', 'info'));

  // Simulate async operation
  console.log('\nWaiting 2 seconds...');
  await delay(2000);
  console.log('Done!');
}

// Run the application
main().catch(console.error);