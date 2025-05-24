import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            maxWidth: '500px'
          }}>
            <h1 style={{ color: '#d32f2f', marginBottom: '20px' }}>
              Oops! Something went wrong
            </h1>
            <p style={{ color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
              We apologize for the inconvenience. An unexpected error occurred while loading this page.
              Our team has been notified and is working to fix the issue.
            </p>
            <div style={{ marginBottom: '30px' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: '#40c793',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                Reload Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  background: 'transparent',
                  color: '#40c793',
                  border: '1px solid #40c793',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Go Home
              </button>
            </div>
            <details style={{ textAlign: 'left', fontSize: '14px', color: '#999' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
                Technical Details (for developers)
              </summary>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px'
              }}>
                {this.state.error?.stack}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
