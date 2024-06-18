
import {useState,useEffect} from "react"
const API="b444ba7c"

export  function useMovie(query, callBack){

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const[error, setError] = useState("");
    
   

  
        const controller=new AbortController();
          useEffect(function() {
        
            async function APICALL() {
           
        
              try{
                setLoading(true);
                setError('');
                const res = await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=${API}&s=${query}`,{signal:controller.signal});
                console.log(res.ok);
                
               
                if(!res.ok) throw new Error("something went wrong plz check your internet conneciton");
                 
                
                const data = await res.json();
        
                if(data.Response === "False") throw new Error("there is no movies in that name!");
                
                  setMovies(data.Search);
                  console.log(data);
                  setError("")
                
                  
                }
              catch(err){
                console.log(err.message);
                if(err.name!=="AbortError"){
                setError(err.message);
                }
              }
              finally{
                setLoading(false);
              }
        
              if(query.length<=3){
                setError("")
                setMovies([])
                return
              }
            }
            callBack();
            APICALL();
        
        
            return function(){
              controller.abort();
            }
          },[query]);
        

return {error,movies,loading,API}

}