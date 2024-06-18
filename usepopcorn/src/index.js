import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import StarRating from './StarRating';

function Test(){
const [movieRating, setMovieRating] =useState(0)
return <>
  <StarRating maxRating={5} color={"purple"} message={["terrible","bad","ok","good","amazing"]} setMovieRating={setMovieRating}/>

  <p>this movie was rated {movieRating} stars</p>
</>

}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App/>

<Test/>

  </React.StrictMode>
);


{/* <StarRating maxRating={5} color={"red"} size={20} message={["terrible","bad","ok","good","amazing"]}/>
<StarRating maxRating={5} color={"blue"} size={50} message={["terrible","bad","ok","good","amazing"]} defaultRating={3}/> */}