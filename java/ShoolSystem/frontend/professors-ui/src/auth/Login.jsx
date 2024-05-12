
import style from "./Login.module.css"
import {useEffect, useState } from 'react';
import $ from "jquery"
import ApiServices from "../services/WebServices";

const Login = () => {
    const [formErrors, setFormErrors] = useState({});
    const [showAdditionalFields, setShowAdditionalFields] = useState(true);
    const [showErrorBox, setShowErrorBox] = useState(false);
    const [data, setData] = useState({
        accesscode: '',
        password:''
    })

    useEffect(() => {
        document.title="Login User"
        const handleResize = () => {
        setShowAdditionalFields(window.innerWidth < 900);
        };
        // Initial check on mount
        handleResize();
        // Attach the event listener
        window.addEventListener('resize', handleResize);
        // Clean up the event listener on unmount
        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }, []);
     
    const  start_loader=()=>{
        $('body').append('<div id="preloader"><div class="loader-holder"><div></div><div></div><div></div><div></div>')
    }

    const  end_loader=()=>{
        $('#preloader').fadeOut('fast', function() {
            $('#preloader').remove();
        })
    }

    const OnChangeEditInput = (e) => {
        const { name, value } = e.target;
        setData({...data, [name] : value});
    };

    const HandleFormSubmit = (e) => {
        e.preventDefault();
        start_loader()
        setShowErrorBox(false)
        // Perform your form validation here
        const errors = validateEditFormData(data);
        setFormErrors(errors);
    }  

    const validateEditFormData = (data) => {
        let errors = {};
        if (!data.accesscode || !data.password) {
            setShowErrorBox(true)
            end_loader()
            errors.message = 'Incorrect accesscode or password';
        } else if (data.accesscode && data.password || data.accesscode!="" && data.password !="") {
            requestSchoolManagementAuthentication(data)
        }
        return errors;
    }

    const requestSchoolManagementAuthentication = async (data) => {
        let errors = {};
        try {
            end_loader()
            const response = await ApiServices.authenticateSchoolManagement_({ "accesscode":data.accesscode, "password":data.password })
            if (response.data != null) {
               if (response.data.status==200) {
                    ApiServices.redirectUserUrl(response.data)
               } else {
                    errors.message =response.data.message
                    setShowErrorBox(true)
                    setFormErrors(errors);
               }
            } else {
                errors.message = 'Invalid credentials. Please try again.';
                setShowErrorBox(true)
                setFormErrors(errors);
            }
            
        } catch (error) {
        console.error('Error during login:', error);
        }
    }

    var ColClass = "";
    var ColClass2 = "";
    if (showAdditionalFields) {
        ColClass = 'col-md-12';
        ColClass2 = 'col-md-12';
    }else if (!showAdditionalFields)  {
        ColClass = 'col-md-8 ww-1'
        ColClass2 = 'col-md-4';
    } else {
        ColClass = 'col-md-12'
        ColClass2 = 'col-md-12';
    }
  return (
      <>
          <div className={`${style.login_page}`}>
              <h1 className={`${style.authHeader} text-center`}>Townsand University</h1>
              <div className="login-box">
                <div className="card card-outline">
                    <div className="card-header text-center">
                        <span style={{fontSize:'30px'}}>Login</span>
                    </div>
                    <div className="card-body">
                    <p className="login-box-msg">Management Login Portal</p>
                          {showErrorBox && (<>
                            <div className={`${style.warning} alert alert-danger`} role="alert">
                                <i className="fa fa-exclamation-triangle"></i>{formErrors.message}
                            </div>
                          </>
                          )}
                    
                    <form  method="post" autoComplete="off" onSubmit={HandleFormSubmit}>
                        <div className="input-group mb-3">
                            <input type="text" className={`form-control ${formErrors.message ? 'is-invalid' : ''}`} value={data.accesscode} name="accesscode" placeholder="Accesscode"  onChange={(e)=>OnChangeEditInput(e)}/>
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span className="fas fa-user"></span>
                                </div>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <input type="password" className={`form-control ${formErrors.message ? 'is-invalid' : ''}`}  value={data.password} name="password" placeholder="Password"  onChange={(e)=>OnChangeEditInput(e)}/>
                            <div className="input-group-append">
                                <div className="input-group-text">
                                <span className="fas fa-lock"></span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                             <div className={ColClass}>
                            </div>
                            <div className={ColClass2}>
                                <button type="submit" className={`${style.btnLogin} btn btn-primary btn-block`} onClick={HandleFormSubmit}>Sign In</button>
                            </div>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
          </div>
        
    </>
  )
}

export default Login
