/* eslint-disable react/prop-types */
import { Navigate, Route, Routes } from 'react-router-dom';
import Default from './../pages/Default';
import InitialPaymentUi from './../pages/initialPayment';
import Login from '../pages/auth/login';
import ProgramEntryRequirements from '../pages/ProgramEntryRequirements';
import Register from '../pages/auth/Register';



const GetUserInfo = localStorage.getItem('appData');
// Parse the JSON string to an object
const ParseUserDataInfo = JSON.parse(GetUserInfo)
var setVerification, UserProperty;
// Check if the "app" property exists in the parsed object
const AuthUser = () => {
    if (ParseUserDataInfo && Object.prototype.hasOwnProperty.call(ParseUserDataInfo, 'user')) {
        // Access the "app" property
        UserProperty = ParseUserDataInfo.user.person;
        return UserProperty;
    } else {
        return null;
    }
}

let UserAuthContext = AuthUser();


setVerification = (
  (UserAuthContext != null && UserAuthContext !== "" && (UserAuthContext.toLowerCase() === 'student' || UserAuthContext.toUpperCase() === 'STUDENT' || UserAuthContext.toUpperCase() ==='Student')) ? 
    "STUDENT_PASS" :
  (UserAuthContext != null && UserAuthContext !== "" && (UserAuthContext.toLowerCase() === 'professor' || UserAuthContext.toUpperCase() === 'PROFESSOR' || UserAuthContext.toUpperCase() ==='Professor')) ? 
    "PROFESSOR_PASS" :
  (UserAuthContext != null && UserAuthContext !== "" && (UserAuthContext.toLowerCase() === 'administrator' || UserAuthContext.toUpperCase() === 'ADMINISTRATOR' || UserAuthContext.toUpperCase() ===  'Administrator' )) ? 
    "USER_ZERO" :
  "ACTIVATE_PUBLIC"
);

const USER_TYPES = {
    PUBLIC: 'ACTIVATE_PUBLIC',
    STUDENT_AUTHENTICATION: 'STUDENT_PASS',
    PROFESSOR_AUTHENTICATION: 'PROFESSOR_PASS',
    AUTHENTICATED_USER: 'USER_ZERO',
    AUTHENTICATION_USER_LOGIN:setVerification
}

const CURRENT_USER_TYPE = USER_TYPES.AUTHENTICATION_USER_LOGIN

const App = () => {

  return (
    <>
      <Routes>
        <Route path='/' element={<PUBLIC_ROUTES><Default /></PUBLIC_ROUTES>} />
        <Route path='*' element={<PUBLIC_ROUTES><Default /></PUBLIC_ROUTES>} />
        <Route path='/initialPayment' element={<PUBLIC_ROUTES><InitialPaymentUi /></PUBLIC_ROUTES>} />
        <Route path='/programmeEntryRequirements' element={<PUBLIC_ROUTES><ProgramEntryRequirements /></PUBLIC_ROUTES>} />
        <Route path='/auth/login' element={<><Login /></>} />
        <Route path='/auth/register' element={<><Register /></>} />
      </Routes>
    </>
  )
}

function PUBLIC_ROUTES({ children }) {
    if (CURRENT_USER_TYPE == USER_TYPES.PUBLIC) {
        return <>
            {children}
        </>
    } else {
        return <Navigate to={'/'}/>
    }
}
export default App