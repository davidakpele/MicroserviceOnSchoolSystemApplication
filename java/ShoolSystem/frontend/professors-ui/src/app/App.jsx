/* eslint-disable react/prop-types */

import { Navigate, Route, Routes } from 'react-router-dom';
import Default from '../views/Default';
import Login from '../auth/Login';
import Decentralize from '../views/Decentralize';
import ManagementStudents from '../views/Students';
import StudentAttendanceRecords from '../views/StudentAttendanceRecords';
import StudentProfile from '../views/StudentProfile';
import MarkAttendance from '../views/MarkAttendance';
import AttendanceRecords from '../views/AttendanceRecords';
import AttendanceReport from '../views/AttendanceReport';
import { ExamSetUp } from '../views/ExamSetUp';
import { CreateExamSetUp } from '../views/components/Add/CreateExamSetUp';
import  CreateQuestionBySerialNumber  from '../views/components/Add/CreateQuestionBySerialNumber';
import { EditExaminationSettings } from '../views/components/Edit/EditExaminationSettings';
import { QuestionsList } from '../views/components/Questions/QuestionsList';
import EditUserProfile from '../views/components/Edit/EditUserProfile';


const GetUserInfo = localStorage.getItem('appData');
const GetManagementAuthInfo = localStorage.getItem('OAappData');
// Parse the JSON string to an object
const ParseUserDataInfo = JSON.parse(GetUserInfo)
const ParseManagementDataInfo = JSON.parse(GetManagementAuthInfo)
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

const AuthManagement = () => {
    if (ParseManagementDataInfo && Object.prototype.hasOwnProperty.call(ParseManagementDataInfo, 'OAuser')) {
        // Access the "app" property
        UserProperty = ParseManagementDataInfo.OAuser.person;
        return UserProperty;
    } else {
        return null;
    }
}

let UserAuthContext = AuthUser();
let UserManagerContext = AuthManagement();

setVerification = (
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
                {/* Public routes */}
                <Route path='/students' element={<IsAUTHORIZATION_WITH_DASHBOARD_ROUTES><ManagementStudents /></IsAUTHORIZATION_WITH_DASHBOARD_ROUTES>}> </Route>
                <Route path='/student_attendance_records/:id' element={<IsAUTHORIZATION_WITH_DASHBOARD_ROUTES><StudentAttendanceRecords /></IsAUTHORIZATION_WITH_DASHBOARD_ROUTES>}> </Route>
                <Route path='/student_profile/:id' element={<IsAUTHORIZATION_WITH_DASHBOARD_ROUTES><StudentProfile /></IsAUTHORIZATION_WITH_DASHBOARD_ROUTES>}> </Route>
                <Route path='/mark_attendance' element={<IsAUTHORIZATION_WITH_DASHBOARD_ROUTES><MarkAttendance /></IsAUTHORIZATION_WITH_DASHBOARD_ROUTES>}> </Route>
                <Route path='/attendance_records' element={<IsAUTHORIZATION_WITH_DASHBOARD_ROUTES><AttendanceRecords /></IsAUTHORIZATION_WITH_DASHBOARD_ROUTES>}> </Route>
                <Route path='/attendance_report' element={<IsAUTHORIZATION_WITH_DASHBOARD_ROUTES><AttendanceReport /></IsAUTHORIZATION_WITH_DASHBOARD_ROUTES>}> </Route>
                <Route path='/exam_setup' element={<IsAUTHORIZATION_WITH_DASHBOARD_ROUTES><ExamSetUp /></IsAUTHORIZATION_WITH_DASHBOARD_ROUTES>}> </Route>
                <Route path='/exam/create_exam' element={<IsAUTHORIZATION_WITH_DASHBOARD_ROUTES><CreateExamSetUp /></IsAUTHORIZATION_WITH_DASHBOARD_ROUTES>}> </Route>
                <Route path="/create/exam/form/examinationId/:examinationId/serialNumber/:serialNumber"element={<IsAUTHORIZATION_WITH_DASHBOARD_ROUTES><CreateQuestionBySerialNumber /></IsAUTHORIZATION_WITH_DASHBOARD_ROUTES>}> </Route>
                <Route path="/exam/edit/id/:id"element={<IsAUTHORIZATION_WITH_DASHBOARD_ROUTES><EditExaminationSettings /></IsAUTHORIZATION_WITH_DASHBOARD_ROUTES>}> </Route>
                <Route path="/exam/questions/view/id/:id"element={<IsAUTHORIZATION_WITH_DASHBOARD_ROUTES><QuestionsList /></IsAUTHORIZATION_WITH_DASHBOARD_ROUTES>}> </Route>
                <Route path="/user/account/id/:id"element={<IsAUTHORIZATION_WITH_DASHBOARD_ROUTES><EditUserProfile /></IsAUTHORIZATION_WITH_DASHBOARD_ROUTES>}> </Route>
                <Route path='/oc/select/multiple/channel' element={<PROFESSOR_AUTHORIZATION_ROUTES><Decentralize /></PROFESSOR_AUTHORIZATION_ROUTES>}> </Route>
                <Route path='/auth/login' element={<AUTHENTICATED_PUBLIC><Login /></AUTHENTICATED_PUBLIC>}> </Route>
                <Route path='*' element={<IsAUTHORIZATION_WITH_DASHBOARD_ROUTES><Default /></IsAUTHORIZATION_WITH_DASHBOARD_ROUTES>}> </Route>
                <Route path='/' element={<IsAUTHORIZATION_WITH_DASHBOARD_ROUTES><Default /></IsAUTHORIZATION_WITH_DASHBOARD_ROUTES>}></Route>
       
            </Routes>
        </>
    )
}
function AUTHENTICATED_PUBLIC({ children }) {
    if (CURRENT_USER_TYPE == USER_TYPES.PUBLIC || CURRENT_USER_TYPE == USER_TYPES.PROFESSOR_AUTHENTICATION || CURRENT_USER_TYPE == USER_TYPES.STUDENT_AUTHENTICATION || CURRENT_USER_TYPE == USER_TYPES.AUTHENTICATED_USER) {
        return <>
            {children}
        </>
    } else {
        return <Navigate to={'/'}/>
    }
}

function PROFESSOR_AUTHORIZATION_ROUTES({ children }) {
    const userContainer = localStorage.getItem('OAappData');
    // Parse the JSON string to an object
    const appData = JSON.parse(userContainer);
    var isTrue = "";
    // Check if the "app" property exists in the parsed object
    if ((appData && Object.prototype.hasOwnProperty.call(appData, 'OAuser'))) {
        if ((appData && Object.prototype.hasOwnProperty.call(appData.OAuser, "BaseRole"))) {
            if (appData.OAuser.BaseRole != "" || appData.OAuser.BaseRole != null) {
               isTrue = appData.IotController.systemType;
                setVerification = (UserManagerContext != null && UserManagerContext !== "" && (UserManagerContext.toLowerCase() === 'professor' || UserManagerContext.toUpperCase() === 'PROFESSOR' && isTrue || !isTrue)) ? "PROFESSOR_PASS" :"ACTIVATE_PUBLIC" 
                if (setVerification == USER_TYPES.PROFESSOR_AUTHENTICATION) {
                    return <Navigate to={'/'}/>
                } else { 
                    return <>
                        {children}
                    </>
                } 
            }
        } else {
           return <>
            {children}
        </>
        }
    } else {
        //redirect user to the prev page
        window.history.go(-1)
    }
}

function IsAUTHORIZATION_WITH_DASHBOARD_ROUTES({ children }) {
     const userContainer = localStorage.getItem('OAappData');
    // Parse the JSON string to an object
    const appData = JSON.parse(userContainer);
    var isTrue = "";
    // Check if the "app" property exists in the parsed object
    if ((appData && Object.prototype.hasOwnProperty.call(appData, 'OAuser'))) {
        if ((appData && Object.prototype.hasOwnProperty.call(appData.OAuser, "BaseRole"))) {
            if (appData.OAuser.BaseRole != "" || appData.OAuser.BaseRole != null) {
                isTrue = appData.IotController.systemType;
                setVerification = (UserManagerContext != null && UserManagerContext !== "" && (UserManagerContext.toLowerCase() === 'professor' || UserManagerContext.toUpperCase() === 'PROFESSOR' && isTrue || !isTrue)) ? "PROFESSOR_PASS" :"ACTIVATE_PUBLIC" 
                if (setVerification == USER_TYPES.PROFESSOR_AUTHENTICATION) {
                    return <>
                        {children}
                    </>
                } else {
                    return <Navigate to={'/'} />
                } 
            } else {
                return <Navigate to={'/auth/login'} />
            }
        } else {
           return <Navigate to={'/auth/login'} />
            //redirect user to the prev page
           // window.history.go(-1)
        }
    } else {
        return <Navigate to={'/auth/login'} />
    } 
}


export default App