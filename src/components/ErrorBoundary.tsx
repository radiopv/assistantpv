import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorAlert } from './ErrorAlert';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorAlert
          message={this.state.error?.message || "Une erreur inattendue s'est produite"}
          retry={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}