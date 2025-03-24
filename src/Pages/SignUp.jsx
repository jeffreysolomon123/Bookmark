import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";




function SignUp() {
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
            console.log("error in sugnup page check authorisation part");
        }
    }
    checkAuthentication();
},[])





  async function submitSignUp(e) {
    e.preventDefault();

    try {
      
      const response = await axios.post("http://localhost:3000/signuptest", {email,password}, {withCredentials:true});
      if(response.status === 200) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.log("error signing up",error);
    }
  }

  return (
    <div>
      <Header 
      displayLoginButton="block"
      displaySignUpButton="none"
      displayDashboardButton = "none"
      displayLogOutButton = "none"
      />
      <h2 className="logintext">Sign Up</h2>
      <form>
        <div class="mb-3 px-5 poppins-regular">
          <label for="exampleInputEmail1" class="form-label poppins-regular">
            Email address
          </label>
          <input
          className="poppins-regular form-control"
          style={{maxWidth:"500px"}}
            type="email"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            onChange={(e)=>{setEmail(e.target.value)}}
          ></input>
        </div>
        <div class="mb-3 px-5">
          <label for="exampleInputPassword1" class="form-label poppins-regular">
            Password
          </label>
          <input
          className="poppins-regular form-control"
          style={{maxWidth:"500px"}}
            type="password"
            id="exampleInputPassword1"
            onChange={(e)=>{setPassword(e.target.value)}}
          ></input>
        <button type="submit" class="poppins-regular btn btn-primary mt-4" onClick={submitSignUp}>
          Submit
        </button>
        </div>
      </form>

    </div>
  );
}

export default SignUp;
