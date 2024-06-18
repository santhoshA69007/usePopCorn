import { useState,useEffect,useRef } from "react";

// import NavBar from "./components/nav"
import StarRating  from "./StarRating"
import { useMovie } from "./useMovie";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./usekey";


const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);





export default function App() {

 
  const[selectedId,setSelectedId] = useState(null);
  const[query, setQuery] = useState("");
  const{error,movies,loading,API}=useMovie(query,onCloseMovie);
  const[watched,setWatched]=useLocalStorageState([
    {
      imdbID: "tt1375666",
      Title: "Inception",
      Year: "2010",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
      runtime: 148,
      imdbRating: 8.8,
      userRating: 10,
    },
    {
      imdbID: "tt0088763",
      Title: "Back to the Future",
      Year: "1985",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
      runtime: 116,
      imdbRating: 8.5,
      userRating: 9,
    },
  ],'watched') 
  



function onCloseMovie(){
setSelectedId(null);

}

function handleAddWatched(movie){
  setWatched((watched)=>[...watched,movie]);

}

function handleDeleteWatched(id) {
 console.log("this from delting "+id)
  
  setWatched(watched => watched.filter(movie => movie.imdbId !== id));
}




  
  
  return ( 
    <>
    <NavBar>
     <Logo/>
     <SearchBar query={query} setQuery={setQuery}/>
     <NumResults movies={movies}/>
     </NavBar>

     <Main>

      <Box> 

        {/* {loading?<Loading/>:<MoviesList movies={movies}/> } */}
        {loading&&<Loading />}

        {!loading&&!error&&<MoviesList selectedId={selectedId}  setSelectedId={setSelectedId} movies={movies}/>}
        {error &&<Error error={error} />}

      </Box>

       <Box> 

        {
        

        selectedId?<MovieDetails key={selectedId} selectedId={selectedId} onCloseMovie={onCloseMovie} onAddWatched={handleAddWatched} watched={watched} API={API}/>:<>

        <WatchedSummary watched={watched} />
        <WatchedMovieList watched={watched} handleDeleteWatched={handleDeleteWatched}/>
        </>
        
        }
       </Box>

     </Main>


    </>
     );
}


function MovieDetails({selectedId,onCloseMovie,onAddWatched,watched,API}) {

  const[movie,setMovie]=useState({})
  const[isLoading,setIsLoading]=useState(false)
  const[userRating,setUserRating]=useState(null)
  const[test,setTest]=useState(0)
  const testing=useRef(0)

const isWatched=watched.map((movie)=>movie.imdbId).includes(selectedId);


if(userRating){
  testing.current++;
  console.log("this from the stars how many times we have pressed :"+testing.current);
}

const{Title:title,
  Year:year,
  Poster: poster,
  Runtime:runtime,
  imdbRating,
  Released:released,
  Actors:actors,
  Director:director,
  Genre:genre,
  Plot:plot

}=movie;
console.log(title,year)
const watchedUserRating=watched.find((movie)=>movie.imdbId===selectedId)?.userRating;
console.log(watchedUserRating)

function handleAdd() {

  const newWatchedMovie={
    imdbId:selectedId,
    title,
    year,
    poster,
    imdbRating:Number(imdbRating),
    runtime:Number(runtime.split(" ").at(0)),
    userRating:userRating,
    
  }


  setTest(Number(userRating))
  setTest((test)=>(test+imdbRating)/2)
  console.log(test)
  console.log(newWatchedMovie)
  onAddWatched(newWatchedMovie);
  onCloseMovie();
  
}


useKey("escape",onCloseMovie);

  useEffect(function(){
    async function getMovieDetails(){
      setIsLoading(true)
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API}&i=${selectedId}`);
      console.log(res.ok);
      const data= await res.json();
      console.log(data);
      setMovie(data)
      setIsLoading(false)
    }
    getMovieDetails()
  },[selectedId])

useEffect(function(){
if (!title)return;
  document.title=`MOVIE|${title}`

  return function (){
    document.title="usePopCorn"
    console.log("this from from the clean up funciton"+title);
    
  }
},[title])



  return <div className="details"> 

  {isLoading?<Loading/>: 
  <>

  <header className="details-overview">
  <button onClick={onCloseMovie} className="btn-back"> &larr; </button>
  <img src={poster} alt={`Poster of ${movie} movie`}/>
<h2>{title}</h2>
<p>
  {released} &bull; {runtime}
</p>
<p>
  {genre}
</p>

<p><span>⭐</span>{imdbRating} IMDB rating</p>

  </header>
  <section>
  {!isWatched ?<>

  <StarRating maxRating={10} size={24} onSetRating={setUserRating}/>
  {userRating>0 &&
  <button className="btn-add" onClick={handleAdd}>+ Add to list</button>
  }

  </>:<p>You Rated this movie {watchedUserRating} 🌟</p>

  }
    <p><em>{plot}</em></p>
    <p>Starring {actors}</p>
    <p>Directed by {director}</p>
  
  </section>
  </> 

  }
   
  </div>
}



function Error({error}) {

  return <div className="error">

          <span>⛔{error}</span>

  </div>


  
}



function Loading(params) {
  return <div className="loader">
      <h2>Loading...</h2>

  </div>
  
}

function Box({children}) {
 
  const [isOpen, setIsOpen] = useState(true);


  return <div className="box">
    <button
      className="btn-toggle"
      onClick={() => setIsOpen((open) => !open)}
    >
      {isOpen ? "–" : "+"}
    </button>
    {isOpen && children}
  </div>
  
}

function Main({children}) {

  return <main className="main">
 {children}
  
</main>
  
}

function Logo(params) {
  return <div className="logo">
  <span role="img">🍿</span>
  <h1>usePopcorn</h1>
</div>
  
}

function NumResults({movies}){
  console.log("this is from Num result    " +  movies)
  return <p className="num-results">
  Found <strong>{movies?movies.length:""}</strong> results
</p>
}

function NavBar({children}) {

return <nav className="nav-bar">
{children}
</nav>
}
function SearchBar({query,setQuery}) {
  const inputEl=useRef(null)
  useEffect(function(){
    inputEl.current.focus();
  },[])


useKey("enter",function(){

  if(document.activeElement===inputEl.current) return;
  inputEl.current.focus();
  setQuery("");


})

  return <input
  className="search"
  type="text"
  placeholder="Search movies..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  ref={inputEl}
/>
  
}
function ListBox({children}) {
  
  const [isOpen1, setIsOpen1] = useState(true);
  return  <div className="box">
  <button
    className="btn-toggle"
    onClick={() => setIsOpen1((open) => !open)}
  >
    {isOpen1 ? "–" : "+"}
  </button>
  {isOpen1 && children}
</div>
  
}
function MoviesList({movies,selectedId,setSelectedId}) {

  return <ul className="list list-movies">
  {movies?.map((movie) => (
 <Movie movie={movie} key={movie.imdbID} selectedId={selectedId} setSelectedId={setSelectedId}/>
  ))}
</ul>


function Movie({movie,setSelectedId,selectedId}) {


function selectedMovie(){

  setSelectedId(movie.imdbID);

}

  return <li onClick={selectedMovie} key={movie.imdbID}>
  <img src={movie.Poster} alt={`${movie.Title} poster`} />
  <h3>{movie.Title}</h3>
  <div>
    <p>
      <span>🗓</span>
      <span>{movie.Year}</span>
    </p>
  </div>
</li>
  
}
  
}



function WatchedSummary({watched}) {
  console.log(watched);
  
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return <div className="summary">
  <h2>Movies you watched</h2>
  <div>
    <p>
      <span>#️⃣</span>
      <span>{watched.length} movies</span>
    </p>
    <p>
      <span>⭐️</span>
      <span>{avgImdbRating}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{avgUserRating}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{avgRuntime} min</span>
    </p>
  </div>
</div>
  
}

function WatchedMovieList({watched,handleDeleteWatched}) {
  console.log(watched);
  
  const bla=watched.map((movie) => (movie.imdbId))
  console.log(bla)

 return <ul className="list">
  {watched.length>0?watched.map((movie) => (
    <WatchedMovie movie={movie} key={movie.imdbId} handleDeleteWatched={handleDeleteWatched}/>
   
  )):""}
</ul>
  
}

function WatchedMovie({movie,handleDeleteWatched}) {

  return <li>
  <img src={movie.poster} alt={`${movie.title} poster`}  />
  <h3>{movie.Title}</h3>
  <div>
    <p>
      <span>⭐️</span>
      <span>{movie.imdbRating}</span>
 
    </p>
    <p>
      <span>🌟</span>
      <span>{movie.userRating}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{movie.runtime} min</span>
    </p>
    <button className="btn-delete" onClick={()=>handleDeleteWatched(movie.imdbId)}>X</button>
  </div>
</li>
  
}