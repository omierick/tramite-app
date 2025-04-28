// src/components/ErrorBoundary.jsx
import { Component } from "react";
import { toast } from "react-toastify";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    toast.error("⚠️ Algo salió mal inesperadamente.");
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <h2>Algo salió mal... 😢</h2>
          <p>Estamos trabajando para solucionarlo. Por favor intenta recargar la página.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;