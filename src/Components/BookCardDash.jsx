import React, { use, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function BookCardDash(props) {
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    async function handleRemove() {
        const bookid = props.book_id;
        console.log(bookid);
        console.log(userInfo);
        if(userInfo) {
            try {
                const response = await axios.post("http://localhost:3000/getremovalbook",{bookid,userInfo},{withCredentials:true});
                if(response.status === 200) {
                    window.location.reload();
                }
            } catch (error) {
                console.log(error);
            }
        }
        else {
            console.log("user info not available");
        }
        
    }

    useEffect(()=>{
        const checkAuthentication = async () => {
            try {
                const response = await axios.get("http://localhost:3000/auth/check", {
                    withCredentials: true // Allows Cookies to Be Sent/Received
                  })
                  if(response.data.authenticated) {
                    setUserInfo(response.data.user)
                    
                  }
                  else{
                    console.log(error);
                  }
            } catch (error) {
                console.log(error);
            }
        }
        checkAuthentication();
    },[]);

    // useEffect(()=>{
    //     if(userInfo) {
    //         console.log("authenticated user:",userInfo);
    //     }

    // },[userInfo]);


    return (
        <div style={{display:"flex", justifyContent:"center"}}>
        <div className="totalbookcarddashboard">
            <div className="card book-card">
                <img src={props.book_thumbnail} className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{props.book_name}</h5>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">{props.book_author}</li>
                </ul>
                <div className="card-body" style={{display:"flex", justifyContent:"center"}}>
                    <button className="card-button" onClick={handleRemove}>Remove</button>
                </div>
            </div>
        </div>
        </div>
    )

}


export default BookCardDash;