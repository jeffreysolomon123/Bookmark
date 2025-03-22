import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function BookCard(props) {
  const navigate = useNavigate();
  const [buttonColour, setButtonColour] = useState('grey');
  const [buttonText, setButtonText] = useState('Mark Read');


  async function handleMarkReadButton() {
    try {
      const selectedBookName = props.name;
      const selectedBookId = props.bookid;
      //console.log(a,b);
      const response = await axios.get("http://localhost:3000/auth/check", {
        withCredentials: true // Allows Cookies to Be Sent/Received
      })

      if (!response.data.authenticated) {
        navigate("/login") // redirectto login page if not authenticated
      }
      else {
        try {
          const response = await axios.post("http://localhost:3000/booksubmit", { selectedBookId, selectedBookName }, { withCredentials: true });
          if (response.status === 401) {
            navigate('/login');
          }
          navigate("/dashboard");
          // setButtonColour('#00cc00');
          // setButtonText('marked read!');
        } catch (error) {
  
          console.log("error during submiting book", error);
        }
      }
      
    } catch (error) {
      console.log(error);
    }

  }
  return (
    <div>
      <div className="card book-card" style={{ width: "200px" }}>
        <img src={props.img} className="card-img-top" alt="..." />
        <div className="card-body">
          <h5 className="card-title">{props.name}</h5>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">{props.author}</li>
        </ul>
        <div className="card-body">
          <button style={{ backgroundColor: buttonColour }} onClick={handleMarkReadButton}>{buttonText}</button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;