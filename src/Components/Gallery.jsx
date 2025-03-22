import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

function Gallery(props) {
  const[data,setData] = useState('');
  const[books, setBooks] = useState([]);
  const[loading,setLoading] = useState(false);
  const[error,setError] = useState(null); 

  useEffect(()=>{
    if(data.trim() === '') {
      setBooks([]);
      return;
    }




    const fetchBooks = async () => {
      try {
      setLoading(true);

       const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${data}&key=${API_KEY}`)
      setBooks(response.data.items || []);
      setError(null);
      
      } catch (error) {
        setError("Problem fetching books!");
      }
      finally {
        setLoading(false);
      }
    }

    const delayDebounceFn= setTimeout(() => {
      fetchBooks();
    }, 500); //wait for 500ms before making another request from the search bar


    return() => {
      clearTimeout(delayDebounceFn);
    }
    console.log(books);
  },[data]); //re-run the effect when 'data' changes



  return(
    <div>
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <form className="d-flex ms-auto me-3" role="search" method="post">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          name="searchedBook"
          onChange={(e) => {setData(e.target.value)}}
          onSubmit={e => { e.preventDefault(); }}
          onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }}
        ></input>
      </form>
    </nav>
    <div className="seach-items-home">
      {loading ? <p>Loading Books...</p> : null}
      {error ? <p>Error Fetching books!</p> : null}
      {books.map((book) => (
          <BookCard
            bookid={book.id}
            img={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/128x193"}
            name={book.volumeInfo.title}
            author={book.volumeInfo.authors ? book.volumeInfo.authors[0] : "Unknown Author"}
            message="message"
          />
        ))}

       {!loading ? (books.length === 0 && data ? <p>No books found!</p> : null) : null}

    </div>
  </div>
  
  )
  
  
}


export default Gallery;