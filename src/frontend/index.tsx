import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

// Render the root App component
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Function to report web vitals metrics
function reportWebVitals(onPerfEntry?: (metric: any) => void) {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
}

// Human tasks:
// TODO: Implement error boundary at the root level to catch and log any unhandled errors
// TODO: Add environment-specific configuration loading (e.g., different API endpoints for dev/prod)
// TODO: Implement service worker registration for offline support and faster loading
// TODO: Add global event listeners for tracking user activity or handling app-wide events
// TODO: Implement internationalization setup if the app needs to support multiple languages
// TODO: Add performance monitoring setup (e.g., integrating with an APM tool)
// TODO: Implement feature flags system for gradual rollout of new features
// TODO: Add setup for A/B testing if required for the application
// TODO: Implement proper handling of browser compatibility issues