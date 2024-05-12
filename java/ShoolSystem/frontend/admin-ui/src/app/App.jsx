/* eslint-disable react/prop-types */
import '../assets/css/admin/assets/dist/css/mystyle.css'
import '../assets/css/styles.css'
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../auth/Login';
import ProfessorsList from '../views/ProfessorsList';
import Default from '../views/Default';
import Students from '../views/Students';
import ViewStudentRecords from '../views/ViewStudentRecords';
import ApplicationList from '../views/ApplicationList';
import Faculties from '../views/Faculties';
import DepartmentList from '../views/DepartmentList';
import AdminUserList from '../views/AccountProfile';
import ClassList from '../views/ClassList';
import SemesterList from '../views/SemesterList';
import CourseList from '../views/CourseList';
import SubjectList from '../views/SubjectList';
import UserList from '../views/UserList';


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

setVerification = ((UserAuthContext != null && UserAuthContext !== "" && (UserAuthContext.toLowerCase() === 'administrator' || UserAuthContext.toUpperCase() === 'ADMINISTRATOR' || UserAuthContext.toUpperCase() ===  'Administrator' )) ? "USER_ZERO" :"ACTIVATE_PUBLIC");

const USER_TYPES = {
    PUBLIC: 'ACTIVATE_PUBLIC',
    AUTHENTICATED_USER: 'USER_ZERO',
    AUTHENTICATION_USER_LOGIN:setVerification
}

const CURRENT_USER_TYPE = USER_TYPES.AUTHENTICATION_USER_LOGIN

const App = () => {

    return (
        <>
            <Routes>
                {/*AUTHENTICATED routes for users  [Employee and Employer]*/}
                <Route path='/' element={<AUTHENTICATED_USER><Default /></AUTHENTICATED_USER>}> </Route>
                <Route path='*' element={<AUTHENTICATED_USER><Default /></AUTHENTICATED_USER>}> </Route>
                <Route path='/students' element={<AUTHENTICATED_USER><Students /></AUTHENTICATED_USER>}> </Route>
                <Route path='/student/view/:id' element={<AUTHENTICATED_USER><ViewStudentRecords /></AUTHENTICATED_USER>}> </Route>
                <Route path='/application' element={<AUTHENTICATED_USER><ApplicationList /></AUTHENTICATED_USER>}> </Route>
                <Route path='/faculties' element={<AUTHENTICATED_USER><Faculties /></AUTHENTICATED_USER>}> </Route>
                <Route path='/department' element={<AUTHENTICATED_USER><DepartmentList /></AUTHENTICATED_USER>}> </Route>
                <Route path='/classes' element={<AUTHENTICATED_USER><ClassList /></AUTHENTICATED_USER>}> </Route>
                <Route path='/semesters' element={<AUTHENTICATED_USER><SemesterList /></AUTHENTICATED_USER>}> </Route>
                <Route path='/courses' element={<AUTHENTICATED_USER><CourseList /></AUTHENTICATED_USER>}> </Route>
                <Route path='/subjects' element={<AUTHENTICATED_USER><SubjectList /></AUTHENTICATED_USER>}> </Route>
                <Route path='/professors' element={<AUTHENTICATED_USER><ProfessorsList /></AUTHENTICATED_USER>}> </Route>
                <Route path='/users/:id' element={<AUTHENTICATED_USER><AdminUserList /></AUTHENTICATED_USER>}> </Route>
                <Route path='/user/list' element={<AUTHENTICATED_USER><UserList /></AUTHENTICATED_USER>}> </Route>
                {/* Public access route */}
                <Route path='/auth/login' element={<PublicRoute><Login /></PublicRoute>}> </Route>
                
            </Routes>
        </>
    )
}

function PublicRoute({ children }) {
    if (CURRENT_USER_TYPE == USER_TYPES.PUBLIC) {
        return <>
            {children}
        </>
    } else {
        return <Navigate to={'/'}/>
    }
}


function AUTHENTICATED_USER({ children }) {
    setVerification = (UserAuthContext != null && UserAuthContext !== "" && (UserAuthContext.toLowerCase() === 'administrator' || UserAuthContext.toUpperCase() === 'ADMINISTRATOR' || UserAuthContext.toUpperCase() === 'Administrator')) ? "USER_ZERO" :"ACTIVATE_PUBLIC"
     if (setVerification == USER_TYPES.AUTHENTICATED_USER) {
        return <>
            {children}
        </>
     } else {
         return <Navigate to={'/auth/login'}/>
    }
}


export default App