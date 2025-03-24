import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Gallery from '../Components/Gallery';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../App.css';



function Home() {
    const[userInfo, setUserInfo] = useState(null);
    useEffect(()=>{
        const checkAuthentication = async () => {
            try {
                const response = await axios.get("http://localhost:3000/auth/check", {
                    withCredentials: true 
                })
                if(response.data.authenticated) {
                    setUserInfo(response.data.user);
                }
            } catch (error) {
                console.log("error in home page authorisation part");
            }
        }
        checkAuthentication();
    },[])



    return (
        <div>
            <Header
                displayLoginButton="none"
                displaySignUpButton="none"
                displayDashboardButton = "block"
                displayLogOutButton = "none"
            />
            <Gallery />

        </div>
    )
}

export default Home;