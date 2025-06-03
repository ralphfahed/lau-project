import React, { useState, useEffect } from "react";
import "./LoginRegister.css";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginRegister = () => {
  // Login state variables
  //username hiye lvalue li hala2
  //setusername hoye update value bada teje bi func
  //usestate = chou hiye lvalue taba3 username haliyan
  //false or true is used for rememberd or logedin
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userLogError, setUserLogError] = useState("");
  const [passLogError, setPassLogError] = useState("");
  const [isRemembered, setIsRemembered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [loading, setLoading] = useState(false);

  // to navigate between pages.
  const navigate = useNavigate();

  // Registration state variables
  const [usernameregister, setUsernameRegister] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [passwordregister, setPasswordRegister] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [agreeError, setAgreeError] = useState("");
  const [message, setMessage] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [emailError, setEmailError] = useState("");

  //state for show/hide password

  const [showPassword, setShowPassword] = useState(false);
  // On component mount, load username from localStorage if exists
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setIsRemembered(true);
    }
  }, []);

  //Functions to update state when user types in inputs or checks checkboxes
  function handleUsername(e) {
    setUsername(e.target.value);
    setUserLogError("");
  }

  function handlePassword(e) {
    setPassword(e.target.value);
    setPassLogError("");
  }

  function handleUsernameRegister(e) {
    setUsernameRegister(e.target.value);
  }

  function handlePasswordRegister(e) {
    setPasswordRegister(e.target.value);
  }

  function handleEmailRegister(e) {
    setEmailRegister(e.target.value);
    setEmailError(""); // clear error when typing
  }

  function handleAgreeTerms(e) {
    setIsAgreed(e.target.checked);
  }

  function handleCheck(e) {
    setIsRemembered(e.target.checked);
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // login funciton

  function handleLogin(e) {
    e.preventDefault(); // Prevents page reload on form submit.

    // Check for empty fields
    //If the user didn’t enter a username or password:
    //setUserLogError(...) shows an error.+ Same for password
    if (!username) {
      setUserLogError("Please enter a username.");
    }
    if (!password) {
      setPassLogError("Please enter a password.");
    }

    //  This stops the function if either field is still empty.
    if (!username || !password) {
      return;
    }

    // Proceed with the fetch if both fields are filled
    //fetch(...): Sends a request to the backend (your Python/Flask server).
    // http://localhost:5000/login: This is the URL of your login API.
    //method is a POST request (used to send data).
    //headers tells the server: “I’m sending JSON data”.
    //body ta eloun kif bade data tbayen

    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 🔥 VERY IMPORTANT for sessions
      body: JSON.stringify({
        username,
        password,
        remember: isRemembered,
      }),
    })
      .then((response) => {
        setLoading(false); // Stop loading

        if (response.ok) {
          // Save username to localStorage if checkbox is checked
          if (isRemembered) {
            localStorage.setItem("rememberedUsername", username);
          } else {
            localStorage.removeItem("rememberedUsername");
          }
          navigate("/home");
        } else {
          setUserLogError("Incorrect username or password.");
          setPassLogError("Incorrect username or password.");
        }
      })
      .catch((error) => {
        setLoading(false); // Stop loading

        console.error("Error:", error);
        setUserLogError("Server error. Please try again later.");
      });
  }

  // Register function
  // This is an arrow function with async, because you’ll use await inside it.
  const handleRegister = async (e) => {
    e.preventDefault();

    //Checks if: A username is entered , A password is entered , The user agreed to the terms (checkbox)
    // If all inputs are valid, send request to backend:
    if (
      usernameregister !== "" &&
      emailRegister !== "" &&
      passwordregister !== "" &&
      isAgreed
    ) {
      try {
        const res = await fetch("http://localhost:5000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: usernameregister,
            email: emailRegister,
            password: passwordregister,
          }),
        });

        let data;
        try {
          data = await res.json(); //Waits for the server to send a response in JSON format.
        } catch (jsonError) {
          throw new Error("Invalid JSON response from server.");
        }

        if (res.status === 201) {
          // Delay to show success message then switch to login form
          toast.success(data.message); // Show success popup
          // Clear inputs on successful registration
          setUsernameRegister("");
          setEmailRegister("");
          setPasswordRegister("");
          setIsAgreed(false);
          setTimeout(() => {
            setMessage("");
            setAction("");
          });
        } else if (res.status === 400) {
          // Missing username or password
          toast.error(data.message || "Missing required fields.");
          if (!usernameregister)
            setUserNameError("Please enter a valid username.");
          if (!emailRegister) setEmailError("Please enter a valid email."); // email error
          if (!passwordregister)
            setPasswordError("Please enter a valid password.");
        } else {
          // Other error (e.g. 500)
          toast.error(data.message || "Registration failed.");
        }
      } catch (err) {
        // If the server has issues:
        console.error(err);
        toast.error("Server error. Please try again later."); // Show toast for server error
      }
    } else {
      if (usernameregister === "")
        setUserNameError("Please enter a valid username.");
      if (emailRegister === "") setEmailError("Please enter a valid email."); // email check
      if (passwordregister === "")
        setPasswordError("Please enter a valid password.");
      if (!isAgreed) setAgreeError("Please agree to the terms and conditions.");
    }
  };

  // Toggle between login and register forms
  //If action === "login", show the login form
  //If action === "register", show the register form
  //If action === "", show nothing or a default
  const [action, setAction] = useState("");

  //This function resets the registration form and tells your app to switch to the registration view.
  //It’s usually called when the user clicks a “Register” link or button.
  //function registerLink is used on click of the register => chaghleta tfade linputs

  function registerLink() {
    setAction("active");
    setUsernameRegister("");
    setPasswordRegister("");
    setUserNameError("");
    setPasswordError("");
    setAgreeError("");
    setIsAgreed(false);
    setMessage("");
    setEmailRegister("");
  }
  //function loginLink is used on click of the register => chaghleta tfade linputs
  function loginLink() {
    // Only clear username if NOT remembered
    if (!isRemembered) {
      setUsername("");
    }
    setAction("");
    setUsername("");
    setPassword("");
    setUserLogError("");
    setPassLogError("");
    setIsRemembered(false);
  }

  //<div className={wrapper ${action}}>
  //This div has a class wrapper plus whatever the value of the React state variable action is.
  // For example, if action is "active", the full class becomes "wrapper active". This is useful for toggling styles, like showing/hiding forms.
  //
  //
  //
  //
  return (
    <div className="login-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={`wrapper ${action}`}>
        {/* Login Form */}
        <div className="form-box login">
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <div className="input-box">
              <input
                type="text"
                value={username}
                onChange={handleUsername}
                placeholder="Username"
              />
              {userLogError && <p className="error-message">{userLogError}</p>}
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePassword}
                placeholder="Password"
              />
              {passLogError && <p className="error-message">{passLogError}</p>}

              {/* Toggle Icon */}
              <span className="icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {/* pass icon
              <FaLock className="icon" /> */}
            </div>
            <div className="remember-forgot">
              <label>
                <input
                  type="checkbox"
                  checked={isRemembered}
                  onChange={handleCheck}
                />
                Remember me
              </label>
              {/* <a href="#">Forgot password?</a> */}
            </div>
            <button type="submit" disabled={loading}>
              {loading ? <div className="loader"></div> : "Login"}
            </button>

            <div className="register-link">
              <p>
                Don't have an account?{" "}
                <a href="#" onClick={registerLink}>
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Register Form */}
        <div className="form-box register">
          <h1>Registration</h1>
          <form onSubmit={handleRegister}>
            <div className="input-box">
              <input
                type="text"
                value={usernameregister}
                onChange={handleUsernameRegister}
                placeholder="Username"
              />
              {userNameError && (
                <p className="error-message">{userNameError}</p>
              )}
              <FaUser className="icon" />
            </div>

            <div className="input-box">
              <input
                type="email"
                value={emailRegister}
                onChange={(e) => setEmailRegister(e.target.value)}
                placeholder="Email"
              />
              {emailError && <p className="error-message">{emailError}</p>}
              <FaEnvelope className="icon" />
            </div>

            <div className="input-box">
              <input
                type="password"
                value={passwordregister}
                onChange={handlePasswordRegister}
                placeholder="Password"
              />
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}
              <FaLock className="icon" />
            </div>

            <div className="agreeTerms">
              <label>
                <input
                  className="inputAgree"
                  type="checkbox"
                  checked={isAgreed}
                  onChange={handleAgreeTerms}
                />
                I agree to the terms & conditions
              </label>
              {agreeError && <p className="error-message">{agreeError}</p>}
            </div>

            <button type="submit">Register</button>
            {message && <p>{message}</p>}
            <div className="register-link">
              <p>
                Already have an account?{" "}
                <a href="/login" onClick={loginLink}>
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
