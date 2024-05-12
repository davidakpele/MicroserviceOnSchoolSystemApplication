/* eslint-disable no-unused-vars */

import HeaderNav from './components/Header/Nav/HeaderNav';
import Aside from './components/Header/Menu/Aside';
import { useEffect, useState } from 'react';
import ApiServices from '../services/ApiServices'
import { useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';

const AccountProfile = () => {
    // Access the parameters from the URL
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({
        id: '',
        email:'',
        role: '',
        records: [{
            firstname: '',
            surname: '',
            gender: '',
            mobile: '',
            dateOfBirth:'',
            photoUrl:''
        }]
    });
    const [roleList, setRoleList] = useState([]);
    const [changePassword, setChangePassword] = useState({
        id:id,
        oldPassword: '',
        newPassword: '',
        confirmPassword:''
    })
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rolesResponse = await ApiServices.getAllRoleList();
                setRoleList(rolesResponse.data);
                const userResponse  = await ApiServices.getAllAdministratorUserById(id);
                setUserInfo(userResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
        return () => {};
    }, [id]);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setUserInfo({
        ...userInfo,
        [name]: value,
        });
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;

        setChangePassword({
        ...changePassword,
        [name]: value,
        });
    };

    const handleRecordInputChange = (e, index) => {
        const { name, value } = e.target;

         setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            records: [{
                ...prevUserInfo.records[0],
                [name]: value
            }]
        }));
    };

    const saveUpdateUserDetails = (event) => {
        event.preventDefault()
        const errors = validateEditFormData(userInfo);
        setFormErrors(errors);
    }

    const validateEditFormData = (userInfo) => {
        let errors = {};
        
        if (!userInfo.records[0].firstname) {
            errors.firstname = 'FirstName is required';
        }
        if (!userInfo.records[0].surname) {
            errors.surname = 'Surname is required';
        }
        if (!userInfo.records[0].gender) {
            errors.gender = 'Gender is required';
        }
        if (!userInfo.records[0].mobile) {
            errors.mobile = 'Mobile number is required';
        }
        if (!userInfo.records[0].dateOfBirth) {
            errors.dateOfBirth = 'Date Of Birth is required';
        }
        if (!userInfo.email) {
            errors.email = 'Email is required';
        }
        if (!userInfo.role) {
            errors.role = 'Role is required';
        }
        if (userInfo.records[0].firstname && userInfo.records[0].surname && userInfo.records[0].gender && userInfo.records[0].mobile && userInfo.records[0].dateOfBirth && userInfo.email && userInfo.role) {
            const data = {
                "UserAuthenticationInfo":{
                    "email":userInfo.email,
                    "id": userInfo.id,
                    "role":userInfo.role
                },
                "UserRecordInfo": {
                    "firstname": userInfo.records[0].firstname,
                    "surname": userInfo.records[0].surname,
                    "gender": userInfo.records[0].gender,
                    "mobile": userInfo.records[0].mobile,
                    "dateOfBirth":userInfo.records[0].dateOfBirth,
                    "photoUrl":''
                }
            }
            FireEditData({ data });
        }

        return errors;
    }

    const FireEditData = async ({data}) => {
        let errors = {};
        const result = await ApiServices.saveEditUserById({ data })
         if (result.response != null && result.response.status != 200) {
            errors.title = result.response.data.error;
            setFormErrors(errors);
         } else {
            toast.success("Successful Updated.!");
            setTimeout(() => {
                window.location.reload(true);
            }, 1000);
        }
    }

    const saveUpdateUserPassword = (event) => {
        event.preventDefault()
        const errors = validateChangePasswordFormData(changePassword);
        setFormErrors(errors);
    }

    const ClearForm = () => {
        setChangePassword("")
    }

    const validateChangePasswordFormData =(changePassword) => {
        let errors = {};
        
        if (!changePassword.oldPassword) {
            errors.oldPassword = 'Old Password is required';
        }
        if (!changePassword.newPassword) {
            errors.newPassword = 'Set New Password';
        }
        if (!changePassword.confirmPassword) {
            errors.confirmPassword = 'Re-type your new password';
        }  
        

        if (changePassword.oldPassword && changePassword.newPassword && changePassword.confirmPassword) {
            //check if new password match confirm password
            if (changePassword.newPassword != changePassword.confirmPassword) {
                errors.newPassword = 'Password are not the same.';
                errors.confirmPassword = 'Password are not the same.';
            } else {
                //
                saveNewPassword(changePassword)
            }
        }

        return errors;
    };

    const saveNewPassword =async(changePassword) => {
        let errors = {};
        const result = await ApiServices.savePasswordChange({ changePassword })
        if (result.response != null && result.response.status != 200) {
            errors.oldPassword = result.response.data;
            setFormErrors(errors);
         } else {
            toast.success("Password Successfully Change.!");
            setTimeout(() => {
                window.location.reload(true);
            }, 1000);
        }
    }

  return (
      <>
    <HeaderNav />
    <Aside />
    <ToastContainer />
          {
            loading ? (
                <>
                    <div className="spin" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                        <div className="custom-loader"></div>
                    </div>
                </>
            
            ) : (
                <>
                    <div className="content-wrapper" >
                        <section className="content text-dark">
                            <div className="container-fluid">
                                <hr className="border-dark"/>
                                <div className="row">
                                    <div className="col-md-6 ">
                                        <div className="card">
                                            <div className="card-header">Admin Data</div>
                                            <div className="card-body">
                                                <form  method="put" acceptCharset="utf-8" onSubmit={saveUpdateUserDetails} autoComplete='off'>
                                                    <div className="box-body pb-0">
                                                    <div className="form-group">
                                                        <Form.Label htmlFor="username" style={{display: 'inline-block', maxWidth: '100%', marginBottom: '5px',fontWeight: '400'}}>Username</Form.Label>
                                                        <input type="text" id="username" className="form-control" defaultValue={userInfo.email} readOnly disabled/>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-group col-sm-6 col-sm-6">
                                                            <Form.Label htmlFor="firstname" style={{display: 'inline-block', maxWidth: '100%', marginBottom: '5px',fontWeight: '400'}}>First Name</Form.Label>
                                                            <input type="text" id="firstname" name="firstname" className={`form-control ${formErrors.firstname ? 'is-invalid' : ''}`} defaultValue={userInfo.records[0].firstname} onChange={handleRecordInputChange} />
                                                            {formErrors.firstname && <div className="invalid-feedback">{formErrors.firstname}</div>}
                                                        </div>
                                                        <div className="form-group col-sm-6 col-sm-6">
                                                            <Form.Label htmlFor="surname" style={{display: 'inline-block', maxWidth: '100%', marginBottom: '5px',fontWeight: '400'}}>Surname</Form.Label>
                                                            <input type="text" id="surname" name="surname" className={`form-control ${formErrors.surname ? 'is-invalid' : ''}`} defaultValue={userInfo.records[0].surname} onChange={handleRecordInputChange} />
                                                            {formErrors.surname && <div className="invalid-feedback">{formErrors.surname}</div>}
                                                        </div>
                                                        <div className="form-group col-sm-6 col-sm-6">
                                                            <Form.Label htmlFor="mobile" style={{display: 'inline-block', maxWidth: '100%', marginBottom: '5px',fontWeight: '400'}}>Mobile Number</Form.Label>
                                                            <input type="text" name="mobile" id="mobile" className={`form-control ${formErrors.mobile ? 'is-invalid' : ''}`} defaultValue={userInfo.records[0].mobile} onChange={handleRecordInputChange} />
                                                            {formErrors.mobile && <div className="invalid-feedback">{formErrors.mobile}</div>}
                                                        </div>
                                                        <div className="form-group col-sm-6 col-sm-6">
                                                            <Form.Label htmlFor="gender" style={{display: 'inline-block', maxWidth: '100%', marginBottom: '5px',fontWeight: '400'}}>Gender</Form.Label>
                                                             <Form.Select aria-label="gender" id="gender" name="gender"  className={`form-control ${formErrors.gender ? 'is-invalid' : ''}`} defaultValue={userInfo.records[0].gender} onChange={handleRecordInputChange} >
                                                                <option value="">--Select--</option>
                                                                <option value="Male" selected={userInfo.records[0].gender === "Male"}>Male</option>
                                                                <option value="Female" selected={userInfo.records[0].gender === "Female"}>Female</option>
                                                             </Form.Select>
                                                            {formErrors.gender && <div className="invalid-feedback">{formErrors.gender}</div>}
                                                        </div>
                                                        <div className="form-group col-sm-6 col-sm-12">
                                                            <Form.Label htmlFor="dateOfBirth" style={{display: 'inline-block', maxWidth: '100%', marginBottom: '5px',fontWeight: '400'}}>Date of birth</Form.Label>
                                                            <input type="date" name="dateOfBirth" id='dateOfBirth'  className={`form-control ${formErrors.dateOfBirth ? 'is-invalid' : ''}`} defaultValue={userInfo.records[0].dateOfBirth} onChange={handleRecordInputChange}/>
                                                            {formErrors.dateOfBirth && <div className="invalid-feedback">{formErrors.dateOfBirth}</div>}
                                                        </div>
                                                        <div className="form-group col-sm-6 col-sm-6">
                                                            <Form.Label htmlFor="email" style={{display: 'inline-block', maxWidth: '100%', marginBottom: '5px',fontWeight: '400'}}>Email</Form.Label>
                                                            <input type="email" name="email"  className={`form-control ${formErrors.email ? 'is-invalid' : ''}`} defaultValue={userInfo.email} onChange={handleInputChange}/>
                                                            {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                                                        </div>
                                                        <div className="form-group col-sm-6 col-sm-6">
                                                            <Form.Label htmlFor="role" style={{display: 'inline-block', maxWidth: '100%', marginBottom: '5px',fontWeight: '400'}}>Role</Form.Label>
                                                             <Form.Select  aria-label="role" id="role"  name="role"  className={`form-control ${formErrors.role ? 'is-invalid' : ''}`} defaultValue={userInfo.role}  onChange={handleInputChange}>
                                                                <option value="">--Select--</option>
                                                                {roleList.map(role => (
                                                                    <option key={role.id} value={role.id} selected={userInfo.role === role.id}>{role.clearance}</option>
                                                                ))}
                                                             </Form.Select>
                                                            {formErrors.role && <div className="invalid-feedback">{formErrors.role}</div>}
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                                <div className="box-footer">
                                                    <button type="submit" id="btn-info" className="btn btn-success" onClick={saveUpdateUserDetails}>Save Edit</button>
                                                </div>
                                                </form> 
                                            </div>
                                        </div>
                                            
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card">
                                        <div className="card-header">Change Password</div>
                                        <div className="card-body">
                                            <form id="isUpdataPassword" method="post" acceptCharset="utf-8" onSubmit={saveUpdateUserPassword}>
                                                <input type="hidden" name="id" value="5327428" />
                                                <div className="form-group oji1">
                                                    <Form.Label htmlFor="old" style={{display: 'inline-block', maxWidth: '100%', marginBottom: '5px',fontWeight: '400'}}>Current Password</Form.Label>
                                                    <input type="password" value={changePassword.oldPassword} placeholder="Current Password" id="old" name="oldPassword" className={`form-control ${formErrors.oldPassword ? 'is-invalid' : ''}`} onChange={handlePasswordInputChange}/> 
                                                    {formErrors.oldPassword && <div className="invalid-feedback">{formErrors.oldPassword}</div>}
                                                </div>
                                                <div className="form-group">
                                                    <div className="form-group oji2">
                                                        <Form.Label htmlFor="new" style={{display: 'inline-block', maxWidth: '100%', marginBottom: '5px',fontWeight: '400'}}>New Password</Form.Label>
                                                        <input type="password" value={changePassword.newPassword} placeholder="New Password" id="new" name="newPassword" className={`form-control ${formErrors.newPassword ? 'is-invalid' : ''}`} onChange={handlePasswordInputChange}/>
                                                        {formErrors.newPassword && <div className="invalid-feedback">{formErrors.newPassword}</div>}
                                                    </div>
                                                    <div className="form-group oji3">
                                                        <Form.Label htmlFor="new_confirm" style={{display: 'inline-block', maxWidth: '100%', marginBottom: '5px',fontWeight: '400'}}>Confirmation Password</Form.Label>
                                                        <input type="password" value={changePassword.confirmPassword} placeholder="Confirmation Password" id="new_confirm" name='confirmPassword' className={`form-control ${formErrors.confirmPassword ? 'is-invalid' : ''}`} onChange={handlePasswordInputChange}/>
                                                        {formErrors.confirmPassword && <div className="invalid-feedback">{formErrors.confirmPassword}</div>}
                                                    </div>
                                                </div>
                                                <div className="box-footer">
                                                    <button type="reset" className="btn btn-flat btn-danger" onClick={ClearForm}><i className="fa fa-rotate-left"></i> Reset</button>
                                                    <button type="submit" id="btn-pass" className="btn btn-flat btn-primary" style={{width:'auto', marginLeft:'10px'}} onClick={saveUpdateUserPassword}>Change Password</button>            
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </>
            )}
   
   
    </>
  )
}

export default AccountProfile;
