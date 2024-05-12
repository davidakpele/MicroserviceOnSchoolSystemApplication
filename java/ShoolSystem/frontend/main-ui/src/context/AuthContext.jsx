/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, useReducer  } from "react"
import { useNavigate } from "react-router-dom";
import $ from 'jquery';
import API from '../api/axios'
const AuthContext = createContext({});

const initialState = {
  isAuthenticated: false,
  // other user-related data can be stored here
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false };
    default:
      return state;
  }
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const Userlogin = () => dispatch({ type: 'LOGIN' });
  const logout = () => dispatch({ type: 'LOGOUT' });
  const [user, setUser] = useState(null) 
  const [FullUserDetails, setFullUserDetails] = useState(null) 
  const [userId, setUserId] = useState(null) 
  const [errors, setErrors] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  
  const navigate = useNavigate();

 

  // Function to set the entire JSON object to localStorage
  const setAppDataToLocalStorage = (token, name, uid) => {
    console.log(token);
    // Set an item in localStorage
    sessionStorage.setItem('jwt', token);
    const appData = {
      "app": {
        "alignment": "right",
        "color": "#76a617"
      },
      "user": {
        "hasConversations": false,
        "locale": "en",
        "id":uid,
        "authUser": name,
        "_jwt_": {
          "iot_pack":token,
        }
      },
    };

    // Convert the object to a JSON string
    const appDataString = JSON.stringify(appData);
      // Store the string in localStorage
      localStorage.setItem('appData', appDataString);
      localStorage.setItem('jwt', token);
      sessionStorage.setItem('application_', appDataString);
  };


  const clearCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  };



  const logOutUser = () => {
     API.get("auth/logout",)
    .then((success) => {
      window.location = '/';  
      localStorage.clear();
      sessionStorage.clear();
      clearCookie('jwt');
      if ($.cookie("jwt") != null) {
        $.cookie("jwt", null, { path: '/' });
        $.removeCookie('jwt', { path: '/' });
      }
    }).catch((error) => {
      console.log(error);
    })
  }


  
  return <AuthContext.Provider value={{...state, setAppDataToLocalStorage, logout, Userlogin, AuthProvider, useAuth, user, errors, logOutUser, FullUserDetails , userId}}>
    {children}
  </AuthContext.Provider>

}

// eslint-disable-next-line react-refresh/only-export-components
export default function useAuthContext() {
  return useContext(AuthContext)
}