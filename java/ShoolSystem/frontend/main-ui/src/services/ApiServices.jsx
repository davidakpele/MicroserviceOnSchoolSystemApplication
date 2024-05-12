import  { Component } from 'react';
import api from "../api/axios";
import $ from 'jquery'

class ApiServices extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            errors: null,
            data: null,
            user: null,
            isAuthenticated: false,
            isAuthenticating: false,
            isLoggedIn: false,
            isLoggingIn: false,
            isRegistering: false,
            isRegistered: false,
            isLoggingOut: false,
            isLoggedOut: false,
            isFetchingUserDetails: false,
            isFetchingUsersList: false,
            isFetchingManagementDetails: false,
            isFetchingUserManagementDetails: false
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
           return error
        }
    }

    FetechFacultiesBaseOnSelectedApplicationId = async ({ ...data }) => {
        const id = data.id;
        try {
           const result = await api.get("/api/v1/collections/getfaculties/" + id)
            return result;
        } catch (error) {
            return error;
        }
    }

    FetechProgramsBaseOnSelectedApplicationId = async ({ ...data }) => {
        const id = data.id;
        try {
           const response = await api.get("/api/v1/collections/getprograms/" + id)
            return response;
        } catch (error) {
            return error;
        }
    }

    FetechEntryLevelBaseOnSelectedApplicationId = async ({ ...data }) => {
        const id = data.id;
        try {
           const response = await api.get("/api/v1/collections/getentrylevels/" + id)
            return response;
        } catch (error) {
           return error;
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
}

export default new ApiServices();