import Aside from "./components/Header/Menu/Aside"
import StudentImg from '../assets/img/student.png'
import ProfessorImg from '../assets/img/Professor.png'
import AdmininstratorImg from '../assets/img/admin.png'
import ApplicationImg from '../assets/img/app.png'
import FacultiesImg from '../assets/img/ft.png'
import DepartmentImg from '../assets/img/dp.png'
import CourseImg from '../assets/img/cs.png'
import AnalysisImg from '../assets/img/piedata.png'
import ExamImg from '../assets/img/exam.png'
import FileManager from '../assets/img/fileManager.png'
import EmailImg from '../assets/img/exam.png'
import ZoomSchedule from '../assets/img/zoom.png'
import { useEffect, useState } from 'react';
import ApiServices from "../services/ApiServices"
import HeaderNav from "./components/Header/Nav/HeaderNav"
import { Link } from "react-router-dom"

const Default = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Fetch data from your API and set it in the state
    const fetchData = async () => {
      try {
        const response = await ApiServices.getAllCounter();
        
        setApiData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <>
  <HeaderNav/>
   <Aside />
      {loading ? (
        <>
          <div className="spin" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="custom-loader"></div>
          </div>
        </>
              
      ) : (
          <>
             <div className="content-wrapper" >
              <section className="content  text-dark">
                 <ol className="breadcrumb">
                    <li><a href="#"><i className="fa fa-home"></i> Home </a></li>
                    <li className="active">Administrative </li>
                    <li className="active">Dashboard</li>
                  </ol>
                <div className="container-fluid">
                <hr className="border-dark"/>
                <div className="row">
                <div className="col-12 col-sm-6 col-md-3">
                  <Link to={"/students"} style={{color:'#000'}}>
                    <div className="info-box">
                      <span className="info-box-icon bg-navy elevation-1"> <img src={StudentImg} alt="" style={{ maxWidth: '50px' }} /></span>
                      <div className="info-box-content">
                        <span className="info-box-text">{apiData?.data?.StudentList}</span>
                        <span className="info-box-number">Students </span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                  <Link to={"/professors"} style={{color:'#000'}}>
                    <div className="info-box mb-3">
                      <span className="info-box-icon elevation-1" style={{backgroundColor:'#d81b60'}}> <img src={ProfessorImg} alt="" style={{ maxWidth: '50px' }} /></span>
                      <div className="info-box-content">
                        <span className="info-box-text">{apiData?.data?.LecturerList}</span>
                        <span className="info-box-number">Professors </span>
                      </div>
                    </div>
                  </Link>
                </div>
                  <div className="col-12 col-sm-6 col-md-3">
                    <Link to={"/user/list"} style={{ color: '#000' }}>
                      <div className="info-box mb-3">
                        <span className="info-box-icon  elevation-1" style={{backgroundColor:'#001f3f'}}> <img src={AdmininstratorImg} alt="" style={{ maxWidth: '50px' }} /></span>
                        <div className="info-box-content">
                          <span className="info-box-text">{apiData?.data?.UsersList}</span>
                          <span className="info-box-number">Administrators </span>
                        </div>
                      </div>
                    </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                  <Link to={"/application"} style={{color:'#000'}}>
                    <div className="info-box mb-3">
                      <span className="info-box-icon elevation-1" style={{backgroundColor:'#0073b7'}}> <img src={ApplicationImg} alt="" style={{ maxWidth: '50px' }} /></span>
                      <div className="info-box-content">
                        <span className="info-box-text">{apiData?.data?.CategoryList}</span>
                        <span className="info-box-number">Application</span>
                      </div>
                    </div>
                  </Link>
                </div>
                 <div className="col-12 col-sm-6 col-md-3">
                  <Link to={"/faculties"} style={{color:'#000'}}>
                    <div className="info-box mb-3">
                      <span className="info-box-icon elevation-1" style={{backgroundColor:'#8B008B'}}> <img src={FacultiesImg} alt="" style={{ maxWidth: '50px' }} /></span>
                      <div className="info-box-content">
                        <span className="info-box-text">{apiData?.data?.FacultyList}</span>
                        <span className="info-box-number">Faculties</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                  <Link to={"/department"} style={{color:'#000'}}>
                    <div className="info-box mb-3">
                      <span className="info-box-icon elevation-1" style={{backgroundColor:'#B22222'}}> <img src={DepartmentImg} alt="" style={{ maxWidth: '50px' }} /></span>
                      <div className="info-box-content">
                        <span className="info-box-text">{apiData?.data?.DepartmentList}</span>
                        <span className="info-box-number">Department</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                  <Link to={"/course"} style={{color:'#000'}}>
                    <div className="info-box mb-3">
                      <span className="info-box-icon elevation-1" style={{backgroundColor:'#f39c12'}}> <img src={CourseImg} alt="" style={{ maxWidth: '50px' }} /></span>
                      <div className="info-box-content">
                        <span className="info-box-text">483479</span>
                        <span className="info-box-number">Courses</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                 <Link to={"/data_analysis"} style={{color:'#000'}}>
                    <div className="info-box mb-3">
                      <span className="info-box-icon elevation-1" style={{backgroundColor:'#605ca8 '}}> <img src={AnalysisImg} alt="" style={{ maxWidth: '50px' }} /></span>
                      <div className="info-box-content">
                        <span className="info-box-text"><br/></span>
                        <span className="info-box-number">Data Analysis</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                  <Link to={"/exam_review"} style={{color:'#000'}}>
                    <div className="info-box mb-3">
                      <span className="info-box-icon elevation-1" style={{backgroundColor:'#ff851b'}}> <img src={ExamImg} alt="" style={{ maxWidth: '50px' }} /></span>
                      <div className="info-box-content">
                        <span className="info-box-text"><br/></span>
                        <span className="info-box-number">Exam Review</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                  <Link to={"/admin_file_manager"} style={{color:'#000'}}>
                    <div className="info-box mb-3">
                      <span className="info-box-icon elevation-1" style={{backgroundColor:'#8B008B'}}> <img src={FileManager} alt="" style={{ maxWidth: '50px' }} /></span>
                      <div className="info-box-content">
                        <span className="info-box-text"><br/></span>
                        <span className="info-box-number">File Manager</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                  <Link to={"/admin_inbox"} style={{color:'#000'}}>
                    <div className="info-box mb-3">
                      <span className="info-box-icon elevation-1" style={{backgroundColor:'#9e5629'}}> <img src={EmailImg} alt="" style={{ maxWidth: '50px' }} /></span>
                      <div className="info-box-content">
                        <span className="info-box-text"><br/></span>
                        <span className="info-box-number">Messages & Email</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                  <Link to={"/admin_zoom_schedules"} style={{color:'#000'}}>
                    <div className="info-box mb-3">
                      <span className="info-box-icon elevation-1" style={{backgroundColor:'#0073b7'}}> <img src={ZoomSchedule} alt="" style={{ maxWidth: '50px' }} /></span>
                      <div className="info-box-content">
                        <span className="info-box-text"><br/></span>
                        <span className="info-box-number">Zoom Schedule</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>
  
        <div className="modal fade" id="viewer_modal" role='dialog'>
          <div className="modal-dialog modal-md" role="document">
            <div className="modal-content">
              <button type="button" className="btn-close" data-dismiss="modal"><span className="fa fa-times"></span></button>
            </div>
          </div>
              </div>
      
  
    </div>
        </>
      )}
   
    
    <footer className="main-footer text-sm">
      <strong>Copyright © 2024. 
      
      </strong>
      All rights reserved.
      <div className="float-right d-none d-sm-inline-block">
        <b>POMS-PHP (by: <a href="mailto:oretnom23@gmail.com" target="blank">oretnom23</a> )</b> v1.0
      </div>
    </footer>
    </>
  )
}

export default Default
