
import {useState,useEffect} from "react"

export function useLocalStorageState(intialState,key) {

    const [value, setValue] = useState(function(){
        const returnValue=localStorage.getItem(key);
        return key?JSON.parse(returnValue):intialState;;
      });

    useEffect(function () {
       
        localStorage.setItem("watched",JSON.stringify(value)); 
        
        },[value])


return [value,setValue]

}