import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./authContext";
import {io} from "socket.io-client"


 const SocketContext = createContext()

 export const useSocketContext = ()=>{
   return useContext(SocketContext)
}
 


export const SocketContextProvider = ({ children }) => {
    const[socket,setSocket] = useState(null)
     const[onlineUsers,setOnlineUsers] = useState([])
  const {authUser} = useAuthContext()

    useEffect(()=>{
   if(authUser ){
    const socket = io(import.meta.env.VITE_BACKEND_URL,{
        query :{
            userId :authUser._id
        }
    })

    setSocket(socket);
  
     socket.on("getOnlineUsers",(users)=>{
        setOnlineUsers(users)
     })

     return () => {
        socket.close();
        setSocket(null);  // Reset the socket state on cleanup
      };
   }else{
    if(socket){
        socket.close()
        setSocket(null)
    }
   }
    },[authUser])

    return (
        <SocketContext.Provider value={{socket,onlineUsers}}>
            {children}
        </SocketContext.Provider>
    )
}