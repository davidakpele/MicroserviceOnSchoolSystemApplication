/* eslint-disable no-unused-vars */
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Link } from "react-router-dom"
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'select2';
import HeaderNav from './components/Header/Nav/HeaderNav';
import Aside from './components/Header/Menu/Aside';
import Form from 'react-bootstrap/Form';
import { useEffect, useState} from 'react';
import UseAuthContext from '../context/AuthContext';
import ApiServices from "../services/WebServices";
import StudentImg from '../assets/img/student.png'
import ExamImg from '../assets/img/studentexam.png'
import AttendenceImg from '../assets/img/attendance.png'
import ZoomIng from '../assets/img/zoom.png'
import FileManager from '../assets/img/fileManager.png'
import EmailImg from '../assets/img/email.png'
import Settings from '../assets/img/setting.png'

const Default = () => {
  const { getManagementDetails } = UseAuthContext();
  const [username, setUsername] = useState('');
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true);
  const [studentCounter, setStudentCounter] = useState("")
  const [isMultipleDepartment, setIsMultipleDepartment]= useState(true);
  useEffect(() => {
    document.title = 'Dashboard Controller';
    const name = (getManagementDetails() !== undefined && getManagementDetails().username !== '') ? getManagementDetails().username : '';
    const id  = (getManagementDetails() !== undefined && getManagementDetails().id !== '') ? getManagementDetails().id : '';
    const token  =(getManagementDetails() !== undefined && getManagementDetails().jwt !== '') ? getManagementDetails().jwt : '';
    const activeDepartment =(getManagementDetails() !== undefined && getManagementDetails().isActiveDashboard !== '') ? getManagementDetails().isActiveDashboard : ''; 
    const dashboardType =(getManagementDetails() !== undefined && getManagementDetails().IotAccessType !== '') ? getManagementDetails().IotAccessType : ''; 
    if (dashboardType) {
      setIsMultipleDepartment(true)
    } else {
      setIsMultipleDepartment(false)
    }
      try {
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
            });
          await ApiServices.getCountStudentInMyDepartment(activeDepartment, token)
            .then(response => {
              if (response.status == 200) {
                setLoading(false);
                setStudentCounter(response.data.data.StudentList)
              }
            })
        }
        appointedDepartments(id)
        
      }catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
  }, [getManagementDetails]);


  const handleInputChange = (event) => { 
    const { name, value } = event.target;
    if (value == "") {
      return false;
    } else {
      ApiServices.setManageDashboard(value)
    }
  }
  return (
    <>
      <ToastContainer />
      <HeaderNav />
      <Aside />
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
                <section className="content-header bd-762Qa">
                  <ol className="breadcrumb">
                    <li><a href="#"><i className="fa fa-home"></i> Home </a></li>
                    <li className="active">Application </li>
                    <li className="active">Dashboard</li>
                  </ol>
                  <div className="form-slim mb-5">
                    {isMultipleDepartment ? (
                        <>
                      <form method="POST" id="InitiateOnlinePayment" className="mb-5" autoComplete="off">
                      <select style={{ marginBottom:'30px'}} name="departmentName" id="DashboardList" value={data.departmentName} onChange={handleInputChange} className=' w-100'>
                      <option value="">--Select--</option>
                      {data.map((departments) => (
                        <option key={departments.id} value={departments.id}>
                          {departments.departmentName}
                        </option>
                      ))}
                    </select>     
                  </form>
                  </>
                ):(<></>)}
                    
                  </div>
                </section>
              <section className="content  text-dark">
                <div className="container-fluid">
                  <div className="defaultCard">
                    <div className="defaultCardHeader">
                      <div className="pull-left">
                        <i className="fa fa-users bg-r" aria-hidden="true"></i>
                        <span className="bolder-3 bg-r">Professor Dashboard Center</span>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                      <div className="col-12 col-sm-6 col-md-3">
                        <Link to={"/students"} style={{color:'#000'}}>
                          <div className="info-box">
                            <span className="info-box-icon elevation-1" style={{backgroundColor:'#483D8B'}}> <img src={StudentImg} alt="" style={{ maxWidth: '50px', }} /></span>
                            <div className="info-box-content">
                              <span className="info-box-text">{studentCounter}</span>
                              <span className="info-box-number">Students </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="col-12 col-sm-6 col-md-3">
                        <Link to={"/mark_attendance"} style={{color:'#000'}}>
                          <div className="info-box">
                            <span className="info-box-icon bg-green elevation-1"> <img src={AttendenceImg} alt="" style={{ maxWidth: '50px' }} /></span>
                            <div className="info-box-content">
                              <span className="info-box-text"><br/></span>
                              <span className="info-box-number">Attendance </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="col-12 col-sm-6 col-md-3">
                        <Link to={"/exam_setup"} style={{color:'#000'}}>
                          <div className="info-box">
                            <span className="info-box-icon bg-navy elevation-1"> <img src={ExamImg} alt="" style={{ maxWidth: '50px' }} /></span>
                            <div className="info-box-content">
                              <span className="info-box-text"><br/></span>
                              <span className="info-box-number">Examination Center </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="col-12 col-sm-6 col-md-3">
                        <Link to={"/zoom"} style={{color:'#000'}}>
                          <div className="info-box">
                            <span className="info-box-icon bg-blue elevation-1"> <img src={ZoomIng} alt="" style={{ maxWidth: '50px' }} /></span>
                            <div className="info-box-content">
                              <span className="info-box-text"><br/></span>
                              <span className="info-box-number">Zoom Schedule </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="col-12 col-sm-6 col-md-3">
                        <Link to={"/file_manager"} style={{color:'#000'}}>
                          <div className="info-box">
                            <span className="info-box-icon elevation-1" style={{backgroundColor:'#8B008B'}}> <img src={FileManager} alt="" style={{ maxWidth: '50px' }} /></span>
                            <div className="info-box-content">
                              <span className="info-box-text"><br/></span>
                              <span className="info-box-number">File Manager</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="col-12 col-sm-6 col-md-3">
                        <Link to={"/exam=views&actions=view_table&start=1"} style={{color:'#000'}}>
                          <div className="info-box">
                            <span className="info-box-icon elevation-1" style={{backgroundColor:'#9e5629'}}> <img src={EmailImg} alt="" style={{ maxWidth: '50px' }} /></span>
                            <div className="info-box-content">
                              <span className="info-box-text"><br/></span>
                              <span className="info-box-number">Message & Email</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="col-12 col-sm-6 col-md-3">
                        <Link to={"/exam=views&actions=view_table&start=1"} style={{color:'#000'}}>
                          <div className="info-box">
                            <span className="info-box-icon elevation-1" style={{backgroundColor:'#08438a'}}> <img src={Settings} alt="" style={{ maxWidth: '50px' }} /></span>
                            <div className="info-box-content">
                              <span className="info-box-text"><br/></span>
                              <span className="info-box-number">Settings </span>
                            </div>
                          </div>
                        </Link>
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

export default Default
