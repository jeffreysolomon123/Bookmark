import React, {useEffect, useState } from "react";
import Header from "../Components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const[email, setEmail] = useState('');
  const[password,setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(()=>{
    const checkAuthentication = async () => {
        try {
            const response = await axios.get("http://localhost:3000/auth/check", {
                withCredentials: true 
            })
            if(response.data.authenticated) {
                navigate('/dashboard');   
            }
        } catch (error) {
            console.log("error in login page check authorisation part",error);
        }
    }
    checkAuthentication();
},[])

  async function submitLogin(e) {
    e.preventDefault();

    try {
      
      await axios.post("http://localhost:3000/login", {email,password}, {withCredentials:true});
      navigate('/dashboard');

    } catch (error) {
      alert("Username or Password is wrong!");
      console.log("error login");
    }
  }
  return (
    <div>
      <Header 
      displayLoginButton="none"
      displaySignUpButton="block"
      displayDashboardButton = "none"
      displayLogOutButton = "none"
      />
      <form>
        <div class="mb-3 px-5">
          <label for="exampleInputEmail1" class="form-label">
            Email address
          </label>
          <input
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            onChange={(e)=>{setEmail(e.target.value)}}
          ></input>
        </div>
        <div class="mb-3 px-5">
          <label for="exampleInputPassword1" class="form-label">
            Password
          </label>
          <input
            type="password"
            class="form-control"
            id="exampleInputPassword1"
            onChange={(e)=>{setPassword(e.target.value)}}
          ></input>
        <button type="submit" class="btn btn-primary mt-4" onClick={submitLogin}>
          Submit
        </button>
        </div>
      </form>

    </div>
  );
}

export default Login;
