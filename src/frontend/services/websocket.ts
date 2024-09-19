import { store, RootState } from '../store';
import { updateTransactionStatus } from '../store/actions/transactionActions';
import { addNotification } from '../store/actions/notificationActions';

const WS_BASE_URL = 'wss://api.example.com/ws';
let socket: WebSocket | null = null;

// Initialize and manage the WebSocket connection
export function initializeWebSocket(): void {
  // Create WebSocket connection to WS_BASE_URL
  socket = new WebSocket(WS_BASE_URL);

  // Set up event listeners for open, message, error, and close events
  socket.addEventListener('open', handleOpen);
  socket.addEventListener('message', handleMessage);
  socket.addEventListener('error', handleError);
  socket.addEventListener('close', handleClose);

  // Implement connection retry logic with exponential backoff
  let retryCount = 0;
  const maxRetry = 5;
  const baseDelay = 1000;

  function handleOpen(event: Event): void {
    console.log('WebSocket connection established');
    retryCount = 0;
    
    // Handle authentication by sending token on connection
    const token = (store.getState() as RootState).auth.token;
    if (token) {
      sendMessage({ type: 'authenticate', token });
    }
  }

  function handleMessage(event: MessageEvent): void {
    // Process incoming messages and dispatch appropriate actions
    const data = JSON.parse(event.data);
    
    switch (data.type) {
      case 'transaction_update':
        store.dispatch(updateTransactionStatus(data.transactionId, data.status));
        break;
      case 'notification':
        store.dispatch(addNotification(data.message));
        break;
      // Add more cases as needed
    }
  }

  function handleError(event: Event): void {
    console.error('WebSocket error:', event);
  }

  function handleClose(event: CloseEvent): void {
    console.log('WebSocket connection closed');
    
    if (retryCount < maxRetry) {
      const delay = Math.pow(2, retryCount) * baseDelay;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${retryCount + 1}/${maxRetry})...`);
        initializeWebSocket();
      }, delay);
      retryCount++;
    } else {
      console.error('Max retry attempts reached. Unable to establish WebSocket connection.');
    }
  }
}

// Sends a message through the WebSocket connection
export function sendMessage(message: object): boolean {
  // Check if WebSocket connection is open
  if (socket && socket.readyState === WebSocket.OPEN) {
    // Stringify the message object
    const messageString = JSON.stringify(message);
    
    // Send the stringified message through the WebSocket
    socket.send(messageString);
    
    // Return success status
    return true;
  }
  
  console.error('WebSocket connection is not open');
  return false;
}

// Subscribes to real-time updates for a specific transaction
export function subscribeToTransactionUpdates(transactionId: string): void {
  // Create subscription message object
  const subscriptionMessage = {
    type: 'subscribe',
    entity: 'transaction',
    id: transactionId
  };
  
  // Call sendMessage function with subscription message
  sendMessage(subscriptionMessage);
}

// Unsubscribes from real-time updates for a specific transaction
export function unsubscribeFromTransactionUpdates(transactionId: string): void {
  // Create unsubscription message object
  const unsubscriptionMessage = {
    type: 'unsubscribe',
    entity: 'transaction',
    id: transactionId
  };
  
  // Call sendMessage function with unsubscription message
  sendMessage(unsubscriptionMessage);
}

// Human tasks:
// TODO: Implement robust error handling for WebSocket connection failures
// TODO: Add support for automatic reconnection with exponential backoff
// TODO: Implement message queuing for offline support
// TODO: Add heartbeat mechanism to detect and recover from zombie connections
// TODO: Implement support for multiple simultaneous WebSocket connections
// TODO: Add compression support for WebSocket messages
// TODO: Implement end-to-end encryption for sensitive data
// TODO: Add logging and monitoring for WebSocket connections and messages
// TODO: Implement rate limiting to prevent abuse of WebSocket connections