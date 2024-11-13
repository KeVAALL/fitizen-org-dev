// Third-party imports
import PropTypes from "prop-types";

// React imports
import { useEffect, useState } from "react";

// React Router imports
import { useNavigate } from "react-router-dom";

// Redux imports
import { useSelector, useDispatch } from "react-redux";
import { clearProfile } from "../../redux/slices/userSlice";

// Project-specific imports
import { verifyToken } from "../UtilityFunctions";
import { removeCurrentEventId } from "../../redux/slices/addEventSlice";
import { removeCurrentEvent } from "../../redux/slices/eventSlice";
import { removeOrgProfile } from "../../redux/slices/profileSlice";

// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

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
        dispatch(removeCurrentEventId());
        dispatch(removeCurrentEvent());
        dispatch(removeOrgProfile());
        navigate("/sign-in", { replace: true });
        window.location.reload();
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
