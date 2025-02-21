import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");
    const username = urlParams.get("username");
    const profilePicture = urlParams.get("profile_picture");
    const id = urlParams.get("id");
    const role = urlParams.get("role");
    const googleid = urlParams.get("googleid");

    const user = {
      token,
      email,
      username,
      profilePicture,
      id,
      role,
      googleid,
    };
  
    if (token) {
      // Save token and user info in localStorage or global state
      localStorage.setItem("user", JSON.stringify({ access_token: token, token_type: "Bearer", user: user }));

      // Redirect to dashboard or home page
      navigate("/dashboard");
    } else {
      navigate("/auth"); // If something went wrong, send them back to login
    }
  }, [navigate]);

  return <div>Logging you in...</div>;
};

export default GoogleAuthCallback;
