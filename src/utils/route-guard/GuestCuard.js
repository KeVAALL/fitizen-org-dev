import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";

const verifyToken = (authToken) => {
  if (!authToken) {
    return false;
  }
  const decoded = jwtDecode(authToken);

  /**
   * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

const GuestGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.userProfile);
  const token = useSelector((state) => state.user.token);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isVerified =
    (user?.Is_Email_Verified && user?.Is_Mobile_Verified) ||
    (user?.Is_Google_Verified && user?.Is_Mobile_Verified);
  console.log(user);

  useEffect(() => {
    if (isLoggedIn && verifyToken(token) && isVerified) {
      console.log("Here");
      const redirectPath = location?.state?.from?.pathname || "/";
      navigate(redirectPath, { replace: true });
    }
  }, [
    isLoggedIn,
    isVerified,
    token,
    navigate,
    location?.state?.from?.pathname,
  ]);

  //   if (isLoggedIn && verifyToken(token)) {
  //     return null; // Prevent rendering children if logged in
  //   }

  return children;
};

export default GuestGuard;
