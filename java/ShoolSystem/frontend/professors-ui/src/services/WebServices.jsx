import  { Component } from 'react';
import api from "../api/axios";
import $ from 'jquery';

class WebServices extends Component {
  

    getDepartmentById = async (token, id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/department/" + id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    fetchSingleStudentsOnSameDepartmentWithAppointmentList = async(studentId, departmentId, classId, semesterId, courseId, date)=>{
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/students/attendance/record/studentId/"+studentId+"/departmentId/"+departmentId+"/classId/"+classId+"/semesterId/"+semesterId+"/courseId/"+courseId+"/date/"+date, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }
    
    saveAttendanceUpdates = async ({ ...data }) => {
        try {
            const token = this.getUserDetails();
            
            const result = await api.put("/private/students/update/attendance/studentId/"+data.studentId, JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    fetchStudentsOnSameDepartmentWithAppointmentList = async(departmentId, classId, semesterId, courseId, date) => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/students/attendance/record/list/departmentId/"+departmentId+"/classId/"+classId+"/semesterId/"+semesterId+"/courseId/"+courseId+"/date/"+date, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    getAllClasses = async () => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/class/list", {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }
    
    getSemesterByClassId = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/semester/classId/"+id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    getClassByDepartmentAndClassAndSemester = async (departmentId, classId, semesterId)=> {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/course/departmentId/"+departmentId+"/classId/"+classId+"/semesterId/"+semesterId, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    getStudentInByDepartment = async(token, id) => {
        try {
            const result = await api.get("/private/students/Indepartment/"+id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            })
            return result 
        } catch (error) {
            return error;
        }
    }

    fetchStudentsOnSameDepartmentWithAppointmentListByMonth = async(departmentId, classId, semesterId, courseId, date) => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/students/attendance/report/departmentId/"+departmentId+"/classId/"+classId+"/semesterId/"+semesterId+"/courseId/"+courseId+"/date/"+date, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    appointProfessorToDepartmentManagement = async (token, id) => {
        try {
            const result = await api.get("/private/professor/withCategories/" + id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    getCountStudentInMyDepartment = async (activeDepartment, token) => {
        try {
            const result = await api.get("/private/student/count/byId/"+activeDepartment, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            })
            return result 
        } catch (error) {
            return error;
        }
    }

    getAllExamListByDepartmentId = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/all/exam/list/departmentId/"+id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
           return error;
        }
    }

    setAccessToExamStatusDisAbled = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.put("/private/examination/settings/status?action=change_status&status=false&id=" + id, {}, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    setAccessToExamStatusEnabled = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.put("/private/examination/settings/status?action=change_status&status=true&id=" + id, {}, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }
    
    deleteExamination = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.delete("/private/exam/settings/delete/examinationId/"+id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    fetchStudentsOnSameDepartment = async(departmentId, classId, semesterId, courseId) => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/students/attendance/courseId/"+courseId, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    checkIfAttendanceAlreadyMarked = async ({...data}) => {
       try {
            const token = this.getUserDetails();
            const result = await api.get("/private/students/attendance/departmentId/"+data.departmentId+'/classId/'+data.classId+'/semesterId/'+data.semesterId+'/courseId/'+data.courseId+'/date/'+data.date, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    studentAttendance = async (data) => {
        try {
            const token = this.getUserDetails();
            const result = await api.post("/private/student/attendance", data, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    authenticateSchoolManagement_ = async ({ ...data }) => {
        try {
            const result = await api.post("/auth/schoolmanagement/login", JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            return result 
        } catch (error) {
            return error;
        }
    }

    setManageDashboard = (id) => {
        const userContainer = localStorage.getItem('OAappData');
        // Parse the JSON string to an object
        const appData = JSON.parse(userContainer);
        // Check if the "OAappData" property exists in the parsed object
        if (appData && Object.prototype.hasOwnProperty.call(appData, 'OAuser')) {
            appData.OAuser.BaseRole = id;
            // Stringify the updated appData
            const appDataString = JSON.stringify(appData);
            // Store the string in localStorage and cookies 
            localStorage.setItem('OAappData', appDataString);
            // Store data in cookies
            document.cookie = `OAappData=${encodeURIComponent(appDataString)}; expires=${new Date(Date.now() + 86400000).toUTCString()}`;
            if (Object.prototype.hasOwnProperty.call(appData.OAuser, "BaseRole")) {
                //redirect to dashboard
                window.location='/'
            }
            return true;
        } else {
            return false;
        }
    }

    getExaminationSettingsDetailsById = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/edit/examination/"+id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
           return error;
        }
    }

    getCourseById = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/course/"+id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    saveExamSettings = async ({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.post("/private/examsetup/save", JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    VerifyExamExistence = async (examinationId) => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/exam/settings/"+examinationId, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
           return error;
        }
    }
    
    saveUpdateExamSettings = async ({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.put("/private/examsetup/update/examinationId/"+data.examinationId, JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

     getAllQuestionsCollections = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/exam/settings/questions?examinationId="+id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }  
    }

    createNewQuestion=async(formData, id) =>{
        try {
            const token = this.getUserDetails();
            const result = await api.post("/private/exam/question/save/new/examinationId/"+id, JSON.stringify(formData), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    editQuestionById =async (id) =>{
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/exam/question/"+id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
           return error;
        }
    }

    deleteQuestionById = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.delete("/private/exam/question/"+id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    updateQuestion = async(formData)=>{
        try {
            const token = this.getUserDetails();
            const result = await api.put("/private/exam/question/save/update/questionId/"+formData.questionsId, JSON.stringify(formData), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }
    
    redirectUserUrl = ({ ...data }) => {
        if (data.appointed) {

            if (data.multiple) { 
                const token = data.token;
                const name = data.name;
                const WhosIn = data.user;
                const role = data.role;
                const uid = data.id;
                const dashboardControllerType = true;
                // Apply setCookie
                this.setCookie('jwt', token, 30);
                this.setAppDataToLocalStorage(dashboardControllerType, token, role, WhosIn, name, uid)
                setTimeout(function () {
                    window.location.replace("/oc/select/multiple/channel");
                }, 0);
                
            } else {
                const token = data.token;
                const name = data.name;
                const WhosIn = data.user;
                const role = data.role;
                const uid = data.id;
                const dashboardControllerType = false;
                // Apply setCookie
                this.setCookie('jwt', token, 30);
                this.setAppDataToLocalStorage(dashboardControllerType, token, role, WhosIn, name, uid)
                
                const userContainer = localStorage.getItem('OAappData');
                // Parse the JSON string to an object
                const appData = JSON.parse(userContainer);
                // Check if the "OAappData" property exists in the parsed object
                if (appData && Object.prototype.hasOwnProperty.call(appData, 'OAuser')) {
                    appData.OAuser.BaseRole = data.message;
                    // Stringify the updated appData
                    const appDataString = JSON.stringify(appData);
                    // Store the string in localStorage and cookies 
                    localStorage.setItem('OAappData', appDataString);
                    
                    // Store data in cookies
                    document.cookie = `OAappData=${encodeURIComponent(appDataString)}; expires=${new Date(Date.now() + 86400000).toUTCString()}`;
                    if (Object.prototype.hasOwnProperty.call(appData.OAuser, "BaseRole")) {
                        
                        setTimeout(function () {
                            window.location='/'
                        }, 0);
                    }
                }
                
                // Update sessionStorage item OAuser and add BaseRole with value 121
                const SessionStorageAppData = JSON.parse(sessionStorage.getItem('OAapplication_')) || {}; // Parse existing data or initialize empty object
                SessionStorageAppData.OAuser = appData.OAuser || {}; // Ensure OAuser object exists
                SessionStorageAppData.OAuser.BaseRole = data.message; // Assign BaseRole value
                sessionStorage.setItem('OAapplication_', JSON.stringify(SessionStorageAppData)); // Store updated data

            }
        } 
    }

    getUserDetails=() =>{
        const userToken = localStorage.getItem('appData');
        const managementUserDetails = localStorage.getItem('OAappData');
        // Parse the JSON string to an object
        const appData = JSON.parse(userToken);
        const managementAppData = JSON.parse(managementUserDetails);
        // Check if the "app" property exists in the parsed object
        if (appData && Object.prototype.hasOwnProperty.call(appData, 'user')) {
            // Access the "app" property
            const AuthorizationToken = appData.user._jwt_.iot_pack;
            return AuthorizationToken; 
        } else if (managementAppData && Object.prototype.hasOwnProperty.call(managementAppData, 'OAuser')) {
            const AuthorizationToken = managementAppData.OAuser._jwt_.iot_pack;
            return AuthorizationToken; 
        } 
    }

    getAllRoleList = async () => {
       try {
            const token = this.getUserDetails();
            const result = await api.get("/private/role/list", {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        } 
    }
     getProfessorById = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/professor/" + id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

     saveEditProfessorDetailsById = async({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.put("/private/professor/email/update/professorId/"+data.data.UserAuthenticationInfo.id, { 'email': data.data.UserAuthenticationInfo.email }, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            return error;
        }
    }

    savePorfessorPasswordChanges = async ({ ...data }) => {
         try {
            const token = this.getUserDetails();
            const result = await api.put("/private/professor/changePassword/professorId/"+data.changePassword.id, JSON.stringify(data.changePassword), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            return error;
        }
    }
    
    logoutManagement = async () => {
        api.get("auth/management/logout")
        .then(() => {
            window.location = '/auth/login';  
            localStorage.clear();
            sessionStorage.clear();
            this.clearCookie('token_jwt');
            if ($.cookie("token_jwt") != null) {
                $.cookie("token_jwt", null, { path: '/' });
                $.removeCookie('token_jwt', { path: '/' });
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    clearCookie = (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    };

     //settings
    setCookie=(cName, cValue, expDays)=> {
        let date = new Date();
        date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
    }

    setAppDataToLocalStorage = (dashboardControllerType, token, role, WhosIn, name, uid) => {
        // Set an item in localStorage
        sessionStorage.setItem('token_jwt', token);
        const appData = {
            "OAuser": {
                "id": uid,
                "authUser": name,
                "person":WhosIn,
                "role":role,
                "_jwt_": {
                    "iot_pack": token,
                }
            },
            "IotController": {
                "systemType": dashboardControllerType,
            }
        };
         // Convert the object to a JSON string
        const appDataString = JSON.stringify(appData);
        // Store the string in localStorage
        localStorage.setItem('OAappData', appDataString);
        localStorage.setItem('token_jwt', token);
        sessionStorage.setItem('OAapplication_', appDataString)
    }

    
}

export default new WebServices();