import React from "react";
import ConnectionError from "./ConnectoinError";
import { withRouter } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };

    this.props.history.listen((location, action) => {
      // location is an object like window.location
      if (this.state.hasError) {
        this.setState(
          { hasError: false }
          // this.errorBoundary.current.state.error = null
        );
      }
    });
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ConnectionError />;
    }

    return this.props.children;
  }
}
export default withRouter(ErrorBoundary);
