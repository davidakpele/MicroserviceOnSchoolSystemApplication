/* eslint-disable no-unused-vars */
import Header from "./components/Header/Header"
import "../assets/css/Login.css";
import { Link } from "react-router-dom";
import style from './Decentralize.module.css'
import { useEffect, useState} from 'react';
import 'select2';
import 'select2/dist/css/select2.min.css';
import Form from 'react-bootstrap/Form';
import UseAuthContext from '../context/AuthContext';
import ApiServices from "../services/WebServices";
import Swal from 'sweetalert2';

const Decentralize = () => {
  const [formErrors, setFormErrors] = useState({});
  const { getManagementDetails } = UseAuthContext();
  const [username, setUsername] = useState('');
  const [data, setData] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState({
    'id': '',
    'departmentName':'',
  })
  useEffect(() => {

    document.title = 'Dashboard Controller';
    const name = getManagementDetails().username;
    const id  =getManagementDetails().id;
    const token  =getManagementDetails().jwt;
    if (!name) {
      getManagementDetails()
    } else {
      setUsername(name);
    }
    const appointedDepartments = async (id) => {
      await ApiServices.appointProfessorToDepartmentManagement(token, id)
        .then(response => {
          if (response.status == 200) {
            if (response.data.appointed == true) {
              setData(response.data.departments)
            }
          }
        })
    }
    appointedDepartments(id)
  }, [getManagementDetails]);

  const handleInputChange = (event) => {
    setSelectedDepartment({ ...selectedDepartment, id: event.target.value });
  }
  
  const AskLogOut = (e) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout",
      type: "question",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d73925",
      confirmButtonText: "Yes, process!",
      cancelButtonText: "No, cancel please!",
      closeOnConfirm: false,
      closeOnCancel: false
    }).then(async(result) => {
      if (result.isConfirmed) {
         const token  =getManagementDetails().jwt;
        ApiServices.logoutManagement(token)
      }
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let errors = {};
    if (!selectedDepartment.id) {
      errors.departmentName = 'Please select the department dashboard you wish to manage.';
    } else {
      ApiServices.setManageDashboard(selectedDepartment.id)
    }
    setFormErrors(errors)
    
  }
  return (
    <>
      <div className={style.bg}>
        <Header/>
          <div id="payment__validate" className={style.payment__validate}>
            <div className="loading">
                <div className={[style.loader, style.loadingStyle].join(' ')}>Loading...</div>
            </div>
          </div>
          <div className="auth-container mt-5 ui-auth-widget">
            <div id="errorMessage" className={[style.error, style.error_ico].join(' ')} style={{ display: 'none' }}></div>
            <div id="success" className={style.SuccessMessage}></div>
            <h5 className="text-center">DASHBOARD CONTROL</h5>
            <p className="text-muted">{ username }, Welcome to Dashboard Controls Center, The School Admin has appointed you to different Department to handle. Here is where you can select the Department you can to login into. Access has been given to also migrate into another Dashboard you wish to run or manage.</p>
            <form method="POST" id="InitiateOnlinePayment" autoComplete="off" onSubmit={handleSubmit}>
                <div className="element">
                    <Form.Label htmlFor="DashboardList" className={style.label}>Select Department Dashboard </Form.Label>
                    <Form.Select aria-label="Default select example" name="departmentName" id="DashboardList" value={data.departmentName} onChange={handleInputChange} className={`form-control w-100 ${formErrors.departmentName ? 'is-invalid' : ''}`}>
                      <option value="">--Select--</option>
                      {data.map((departments) => (
                        <option key={departments.id} value={departments.id}>
                          {departments.departmentName}
                        </option>
                      ))}
                    </Form.Select>
                    {formErrors.departmentName && <div className="invalid-feedback">{formErrors.departmentName}</div>}       
                </div>
                <div className="element" >
                    <input name="submit" type="submit" id="submit" value="Continue" style={{background: 'rgb(35, 131, 173)', height:'40px'}} onClick={handleSubmit} />
                </div>
            </form>
            <div className="text-center">
                <div className="text-muted mt-4">Logout your account?<button onClick={AskLogOut} className="pull-right btn" style={{background: "#c60d00",color: "#fff",padding: "3px 10px",borderRadius: "5px",fontWeight:"bold"}} id="logoutBtn" >Click</button></div>
            </div>
          </div>
    </div>
    </>
  )
}
export default Decentralize
