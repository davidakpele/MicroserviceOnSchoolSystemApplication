/* eslint-disable no-unused-vars */
import  { Component } from 'react';
import api from "../api/axios";
import $ from 'jquery'

class ApiServices extends Component {
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
      authenticate_ = async ({ ...data }) => {
        try {
            await api.post("/private/auth/login", JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            }).then((result) => {
                if (result.status == 200) {
                    $('.error').show()
                    $('.errormsgContainer').hide()
                    // set the user as logged in and store the token in local storage
                    const token = result.data.token;
                    const name = result.data.name;
                    const WhosIn = result.data.message;
                    const role = result.data.role;
                    const uid = result.data.id;
                    // Apply setCookie
                    this.setCookie('jwt', token, 30);
                    this.setAppDataToLocalStorageForUser(token,role,WhosIn, name, uid)
                    setTimeout(function () {
                        window.location.replace("/");
                    }, 0);
                }
            }).catch((error) => {
                $('.error').show()
                $('.errormsgContainer').html(error.response.data.error);
            })
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }


    
   getAllUserRole = () => {
        const userToken = localStorage.getItem('appData');
        // Parse the JSON string to an object
        const appData = JSON.parse(userToken);
        // Check if the "app" property exists in the parsed object
        if (appData && Object.prototype.hasOwnProperty.call(appData, 'user')) {
        // Access the "app" property
            return appData.user.id;
        }
    }

    FetechFacultiesBaseOnSelectedApplicationId = async ({ ...data }) => {
        const id = data.id;
        try {
           const result = await api.get("/api/v1/collections/getfaculties/" + id)
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    FetechProgramsBaseOnSelectedApplicationId = async ({ ...data }) => {
        const id = data.id;
        try {
           const response = await api.get("/api/v1/collections/getprograms/" + id)
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    FetechEntryLevelBaseOnSelectedApplicationId = async ({ ...data }) => {
        const id = data.id;
        try {
           const response = await api.get("/api/v1/collections/getentrylevels/" + id)
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    FetechDepartmentBaseOnSelectedApplicationId = async ({ ...data }) => {
        const id = data.id;
        try {
           const response = await api.get("/api/v1/collections/getdepartments/" + id)
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    saveRegistration = async ({ ...data }) => {
        try {
            await api.post("/auth/register",JSON.stringify(data.data),{
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
            }).then((result) => {
                if (result.status == 200) {
                    $('#AppRegistration').hide();
                    $('.errormsgContainer').hide();
                    $('.msgSuccess').empty();
                    $('.msgSuccess').html(result.data.message+"<br/><br/><span> Click here to verify short way,<br/><br/> <a href='"+result.data.verificationLink+"' class='btn btn-sm buttonResendEmail' target='_blank'>Verify Now</a></span>")
                    $('#messagediv').show()
                }
            }).catch((error) => {
                $('#messagediv').hide()
                $('.msgSuccess').empty();
                $('.error').show()
                $('.errormsgContainer').html(error.response.data.error);
            })
        } catch (error) {
            console.log(error);
        }
    }

    saveRegistrationByAdmin = async({ ...data }) => {
        try {
            return await api.post("/auth/register", JSON.stringify(data.data), {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            }).then((result) => {
                return result
            }).catch((error) => {
                return error;
            })
        } catch (error) {
            console.log(error);
        }
    }

    auth = async ({ ...data }) => {
       try {
            await api.post("/auth/login",JSON.stringify(data),{
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
            }).then((result) => {
                if (result.status == 200) {
                    $('.error').show()
                    $('.errormsgContainer').hide()
                    // set the user as logged in and store the token in local storage
                    
                    const token = result.data.token;
                    const name = result.data.name;
                    const WhosIn = result.data.message;
                    const role = result.data.role;
                    const uid = result.data.id;
                // Apply setCookie
               this.setCookie('jwt', token, 30);
                this.setAppDataToLocalStorageForUser(token, role, WhosIn, name, uid)
                    setTimeout(function () {
                        window.location.replace("/");
                    }, 0);
                }
            }).catch((error) => {
                $('.error').show()
                $('.errormsgContainer').html(error.response.data.error);
            })
        } catch (error) {
           console.error('Authentication failed', error);
        }
    }

    FetchStudentById = async (id) => {
        const token = this.getUserDetails();
        try {
            const response = await api.get("/private/student/" + id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            })
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    logout = async () => {
        api.get("auth/logout",)
        .then((success) => {
            window.location = '/admin/auth/login';  
            localStorage.clear();
            sessionStorage.clear();
            this.clearCookie('jwt');
            if ($.cookie("jwt") != null) {
                $.cookie("jwt", null, { path: '/' });
                $.removeCookie('jwt', { path: '/' });
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    getAllCounter = async () => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/collections/count", {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    FetchAllStudents = async () => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/student/list", {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    DeleteStudents = async ({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.post("/private/student/delete", JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    FetchAllCategories = async () => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/category/list", {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    getCategorById = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/category/" + id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    UpdateStudentProfile = async ({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.put("/private/student/update/" + data.id, data, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    CreateNewCategory = async ({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.post("/private/category/new", data, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }
    
    DeleteCategory = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.delete("/private/category/delete/" + id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    UpdateCategory = async ({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.put("/private/category/update/" + data.id, data, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    setCategoryStatusToVisible = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.put("/private/category/data?action=change_status&status=true&id=" + id, {}, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    setCategoryStatusToHiiden = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.put("/private/category/data?action=change_status&status=false&id=" + id, {}, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }
    
    getAllFaculties = async () => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/faculties/list", {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    CreateNewFaculty = async ({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.post("/private/faculty/create", data, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    getFacultyById = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/faculty/" + id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }
    
    UpdateFaculty = async ({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.put("/private/faculty/update/" + data.id, data, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    DeleteFaculty = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.delete("/private/faculty/delete/" + id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }
    
    getAllDepartment = async () => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/department/list", {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }
    
    CreateNewDepartment = async ({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.post("/private/department/create", data, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    DeleteDepartment = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.delete("/private/department/delete/" + id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

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

    UpdateDepartment = async ({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.put("/private/department/update/" + data.id, data, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }
    
    getAllProfessors = async () => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/professors/list", {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    updateProfessorDetails = async (data, id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.put("/private/professor/update/" + id, data, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    DeleteProfessor = async ({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.post("/private/professor/delete", JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
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

    registerNewProfessor = async ({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.post("/private/professor/add", JSON.stringify(data.requestdata), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            return error;
        }
    }

    setProfessorFeatureToEnabled = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.put("/private/features/data?action=change_features&features=true&id=" + id, {}, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    setProfessorFeatureToNotEnabled = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.put("/private/features/data?action=change_features&features=false&id=" + id, {}, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    storeProfessorApointmentBase =async ({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result =await api.post("/private/professor/appoint", JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            return error;
        }
    }

    UpdateProfessorApointmentBase = async ({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result =await api.put("/private/professor/update/appoint/"+data.professorId, JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            return error;
        }
    }

    deleteProfessorFromManagementRoleById = async ({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result =await api.delete("/private/professor/delete/FromManagementRole/"+data.id,{
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            return error;
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

    saveNewClass = async({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.post("/private/class/new", JSON.stringify(data.data), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            return error;
        }
    }

    saveEditClass = async({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.put("/private/class/update/"+data.data.id, JSON.stringify(data.data), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            return error;
        }
    }

    DeleteClassById = async ({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.post("/private/class/delete", JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    getClassById = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/class/"+id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    getAllSemesters = async () => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/semester/list", {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    saveNewSemester = async({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.post("/private/semester/new", JSON.stringify(data.data), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            return error;
        }
    }

    saveEditSemester = async({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.put("/private/semester/update/"+data.data.id, JSON.stringify(data.data), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            return error;
        }
    }
    
    DeleteSemesterById = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.delete("/private/semester/delete/"+id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    getSemesterById = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/semester/"+id, {
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

   
    getAllCourses = async () => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/courses/list", {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    DeleteCourseById = async ({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.post("/private/course/delete", JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    saveNewCourse = async({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.post("/private/course/new", JSON.stringify(data.data), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            return error;
        }
    }

    saveEditCourse = async({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.put("/private/course/update/"+data.data.id, JSON.stringify(data.data), {
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

    getAllSubjects = async () => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/subjects/list", {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }
    
    saveNewSubject = async({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.post("/private/subject/new", JSON.stringify(data.data), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            return error;
        }
    }

    DeleteSubjectById = async ({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.post("/private/subject/delete", JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    getSubjectById = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/subject/"+id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    saveEditSubject = async({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.put("/private/subject/update/"+data.data.id, JSON.stringify(data.data), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            return error;
        }
    }

    getAllAdministratorUserById = async (id) => {
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/user/"+id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            return error;
        }
    }
    
    saveEditUserById = async({ ...data }) => {
        try {
            console.log(data);
            const token = this.getUserDetails();
            const result = await api.put("/private/user/update/"+data.data.UserAuthenticationInfo.id, JSON.stringify(data.data), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            return error;
        }
    }
    
    savePasswordChange = async ({ ...data }) => {
         try {
            const token = this.getUserDetails();
            const result = await api.put("/private/user/changePassword/"+data.changePassword.id, JSON.stringify(data.changePassword), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            return error;
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
    
    getSupserUserList = async()=>{
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/users/list/" + this.getAllUserRole(), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    FetchUserById = async (id)=>{
        try {
            const token = this.getUserDetails();
            const result = await api.get("/private/user/"+id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }

    createNewUser = async({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.post("/private/user/add", JSON.stringify(data.data), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result;
        } catch (error) {
            return error;
        }
    }

    DeleteUsers = async ({ ...data }) => {
        try {
            const token = this.getUserDetails();
            const result = await api.post("/private/users/delete", JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
                credentials: 'include',
            });
            return result.status;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }









     setCookie=(cName, cValue, expDays)=> {
        let date = new Date();
        date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
    }

    setAppDataToLocalStorageForUser = (token, role, WhosIn, name, uid) => {
        // Set an item in localStorage
        sessionStorage.setItem('jwt', token);
        const appData = {
            "user": {
                "id": uid,
                "authUser": name,
                "person":WhosIn,
                "role":role,
                "_jwt_": {
                    "iot_pack": token,
                }
            },
        };
         // Convert the object to a JSON string
        const appDataString = JSON.stringify(appData);
        // Store the string in localStorage
        localStorage.setItem('appData', appDataString);
        localStorage.setItem('jwt', token);
        sessionStorage.setItem('application_', appDataString)
    }
}

export default new ApiServices();