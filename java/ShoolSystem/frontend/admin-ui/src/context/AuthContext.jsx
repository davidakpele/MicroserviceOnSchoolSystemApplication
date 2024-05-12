
import { createContext, useContext, useState, useReducer  } from "react"
import $ from 'jquery';
import API from '../api/axios'
const AuthContext = createContext({});

const initialState = {
    isAuthenticated: false,
    user: {},
    token: '',
    loading: false,
    error: null,
    is_teacher: false,
    is_student: false,
    is_parent: false,
    is_staff: false,
    is_user: false,
    userId: '',
    userRole: '',
    userRoleName: '',
    userRoleType: '',
    userRoleTypeId: '',
    userRoleTypeName: '',
    userRoleTypeDescription: '',
    userRoleTypeDescriptionId: '',
    userRoleTypeDescriptionName: '',

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

  const Userlogin = () => dispatch({ type: 'LOGIN' });
  const logout = () => dispatch({ type: 'LOGOUT' });
  const [user, setUser] = useState(null) 
  const [FullUserDetails, setFullUserDetails] = useState(null) 
  const [userId, setUserId] = useState(null) 
  const [isFetching, setIsFetching] = useState(false);
  
  const getUser = async () => {
    const userToken = localStorage.getItem('appData');
     // Parse the JSON string to an object
    const appData = JSON.parse(userToken);
   // Check if the "app" property exists in the parsed object
    if (appData && Object.prototype.hasOwnProperty.call(appData, 'app')) {
      // Access the "app" property
      const username = appData.user.authUser;
      const uid = appData.user.id;
      setFullUserDetails(username);
      const firstName = username.split(" ")[0];
      setUser(firstName)
      setUserId(uid)
    } 
   
  }

  const getUserRole = ()=> {
    const userToken = localStorage.getItem('appData');
    // Parse the JSON string to an object
    const appData = JSON.parse(userToken);
    // Check if the "app" property exists in the parsed object
    if (appData && Object.prototype.hasOwnProperty.call(appData, 'user')) {
      // Access the "app" property
      return appData.user.role;
    } 
  }
  const getManagementDetails = () => {
    const userContainer = localStorage.getItem('OAappData');
    // Parse the JSON string to an object
    const appData = JSON.parse(userContainer);

    // Check if the "app" property exists in the parsed object
    if ((appData && Object.prototype.hasOwnProperty.call(appData, 'OAuser')) && (appData && Object.prototype.hasOwnProperty.call(appData, 'IotController'))) {
      // Access the "app" property
      const data = {'IotAccessType':appData.IotController.systemType,'username':appData.OAuser.authUser, 'role':appData.OAuser.role, 'isActiveDashboard':appData.OAuser.BaseRole, 'id':appData.OAuser.id, 'jwt':appData.OAuser._jwt_.iot_pack}
      return data;
    } 
  }
  // Set a Cookie
  const setCookie=(cName, cValue, expDays)=> {
    let date = new Date();
    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
  }

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

  const FetchUsersList = async ({ ...data }) => { 
    const token = data.jwt;
    const id = data.id;
    try {
      if (isFetching) {
        return;
      }
      const response = await API.get('/api/v1/list/'+id,{
        headers: { Authorization: `Bearer ${token}` },
      });
      const resultData = response.data;
      setIsFetching(false)
      return resultData;
      
    } catch (error) {
      setIsFetching(false)
    }
    
  }

  const logOutUser = () => {
     API.get("auth/logout",)
    .then(() => {
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


  
  return <AuthContext.Provider value={{...state, getManagementDetails, setAppDataToLocalStorage, setCookie, getUserRole, FetchUsersList, logout, Userlogin, AuthProvider, useAuth, user, getUser, logOutUser, FullUserDetails , userId}}>
    {children}
  </AuthContext.Provider>

}

// eslint-disable-next-line react-refresh/only-export-components
export default function useAuthContext() {
  return useContext(AuthContext)
}