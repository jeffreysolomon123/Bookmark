import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../App.css';

function Header(props) {
  const navigate = useNavigate();

  function handleLoginClick() {
    navigate("/login");
  }

  function handleSignUpClick() {
    navigate("/signup");
  }

  function handleDashboardClick() {
    navigate("/dashboard");
  }

  async function handleLogOutClick() {
    try {
        await axios.post("http://localhost:3000/logout", {} , {withCredentials:true});
        navigate("/login");
    } catch (error) {
        console.log("Error during logout!");
    }
  }
  return (
    <div>
      <nav class="navbar mynavbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand mynavlogotext ms-3" href="/">
            BookMark
          </a>
          <button
            class="btn myloginbtn btn-primary ms-auto"
            style={{ display: props.displayLoginButton }}
            type="button"
            onClick={handleLoginClick}
          >
            Login
          </button>
          <button
            className="btn mybooksbtn btn-primary ms-auto"
            style={{ display: props.displayDashboardButton }}
            type="button"
            onClick={handleDashboardClick}
          >
            My Books ➔
          </button>
          <button
            class="btn mysignupnbtn mybtn btn-primary ms-2"
            style={{ display: props.displaySignUpButton }}
            type="button"
            onClick={handleSignUpClick}
          >
            Sign Up
          </button>
          <button
            class="btn mylogoutbtn btn-primary ms-2"
            style={{ display: props.displayLogOutButton }}
            type="button"
            onClick={handleLogOutClick}
          >
            Log Out
          </button>
        </div>
      </nav>
    </div>
  );
}
export default Header;
