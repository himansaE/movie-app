import { Link } from "react-router-dom";
import React from "react";

export default function firebase_code_to_text(c) {
  if (c === "auth/invalid-email") return "Enter valid Email";
  if (c === "auth/wrong-password") return "Password is wrong";
  if (c === "auth/weak-password")
    return "Password is weak. Use strong Password";
  if (c === "auth/network-request-failed") return "Connection problem ";
  if (c === "auth/too-many-requests")
    return "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.";
  if (c === "auth/user-not-found")
    return (
      <div>
        No account found for this Email.&nbsp;
        <Link to="/signup">Create an Account</Link>
      </div>
    );
  if (c === "auth/email-already-in-use")
    return (
      <div>
        Email is in use.&nbsp;<Link to="/login">Login here</Link>{" "}
      </div>
    );
  return c;
}
