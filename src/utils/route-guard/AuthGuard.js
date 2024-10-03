import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { clearProfile } from "../../redux/slices/userSlice";

// ==============================|| AUTH GUARD ||============================== //
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

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // Local state to track whether the token verification is complete
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    //   console.log(verifyToken(token));
    //   if (!verifyToken(token)) {
    //     dispatch(clearProfile());
    //     navigate("/sign-in", { replace: true });
    //   }
    // }, [token, dispatch, navigate]);

    // if (!isLoggedIn || !verifyToken(token)) {
    //   return null; // Prevent rendering protected content
    // }

    // return children;
    const verifyAndRedirect = () => {
      if (!verifyToken(token)) {
        dispatch(clearProfile());
        navigate("/sign-in", { replace: true });
      } else {
        setIsVerified(true); // Token is valid, allow rendering
      }
    };

    verifyAndRedirect();
  }, [token, dispatch, navigate]);

  // Prevent rendering the children until token is verified
  if (!isVerified) {
    return null; // or you could show a loader here
  }

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default AuthGuard;
