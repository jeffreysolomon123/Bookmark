import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import axios from "axios";
import BookCardDash from "../Components/BookCardDash";


function Dashboard() {
    const navigate = useNavigate();
    const[userInfo, setUserInfo] = useState(null);
    const[retrievedBooks,setRetrievedBooks] = useState([]);
    useEffect(() => {
        const checkAuthentication = async ()=>{
            try {
                const response = await axios.get("http://localhost:3000/auth/check", {
                    withCredentials: true // Allows Cookies to Be Sent/Received
                })

                if(!response.data.authenticated){
                    navigate("/login") // redirectto login page if not authenticated
                }

                else {
                    setUserInfo(response.data.user);
                }
            } catch (error) {
                console.log("Error checking authentication: ",error);
                navigate("/login");
            }
        }

        


        const fetchBooks = async () => {
            try {
                const response = await axios.get("http://localhost:3000/getmarkedbooks",{withCredentials: true});
                let bookArray = [];
                for (let index = 0; index < response.data.length; index++) {
                    // console.log(response.data);
                     const element = response.data[index];
                     //console.log(element)
                     const book_id = element.book_id;
                     //console.log(book_id); //gives the id's of the books 
                     
                     const book = await axios.get(`https://www.googleapis.com/books/v1/volumes/${book_id}`);
                     // console.log(book.data.volumeInfo.title);
                     // console.log(book.data.volumeInfo.authors[0]);
                     // console.log(book.data.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/128x193");
                     const currentBook = {
                         book_id: book_id,
                         book_name : book.data.volumeInfo.title,
                         book_author : book.data.volumeInfo.authors[0],
                         book_thumbnail : book.data.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/128x193"
                     };
                     bookArray.push(currentBook);
                 }
                 setRetrievedBooks(bookArray)
                 
                 //console.log(bookArray)   // in the format [{...},{...},]
            } catch (error) {
                console.log("error fetching boks",error);
            }
            
        }
   
        checkAuthentication();
        fetchBooks();
    },[navigate]);


    return(
        <div>
            <Header 
            displayLoginButton="none"
            displaySignUpButton="none"
            displayDashboardButton = "none"
            displayLogOutButton = "block"
            />
        <h2 className="galleryheading">My Books</h2>
        

        <div className="seach-items-dashboard">
        {retrievedBooks.map((eachBook)=> (
            <BookCardDash 
            book_id = {eachBook.book_id}
            book_name = {eachBook.book_name}
            book_author  = {eachBook.book_author}
            book_thumbnail = {eachBook.book_thumbnail}
            />
        ))}
        </div>
        
       
        
        </div>
    )
}

export default Dashboard;