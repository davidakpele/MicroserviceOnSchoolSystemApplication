/* eslint-disable no-unused-vars */
import HeaderNav from './components/Header/Nav/HeaderNav';
import Aside from './components/Header/Menu/Aside';
import { Link } from "react-router-dom"
import { useEffect, useState} from 'react';
import UseAuthContext from '../context/AuthContext';
import ApiServices from "../services/WebServices";

const MarkAttendance = () => {
    const [loading, setLoading] = useState(true);
    const [dep, setDep] = useState({})
    const [cc, setClsCon]= useState(false)
    const [ss, setSemCon]= useState(false)
    const [ssc, setCour]= useState(false)
    const [istableVisible, setIsTableVisible]= useState(false)
    const [isClass, setClass] = useState([])
    const [isSemester, setSemester] = useState([])
    const [isCourse, setCourse] = useState([])
    const [errors, setErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [data, setData] = useState({
        department: '',
        class: '',
        semester: '',
        course: '',
        date:''
    });
    const [attendanceData, setAttendanceData] = useState({
        'departmentId': '',
        'gender': '',
        'studentId': '',
        'firstname': '',
        'surname': '',
    });
    const [apiData, setApiDaa] = useState({
        'departmentId': '',
        'classId': '',
        'semesterId': '',
        'courseId': '',
        "date":'' 
    })

    useEffect(() => {
        const currentDate = new Date().toISOString().split('T')[0];
         setApiDaa(prevData => ({
            ...prevData,
            date: currentDate,
        }));
      const fetchData = async () => {
        try {
            const userContainer = localStorage.getItem('OAappData');
            // Parse the JSON string to an object
            const appData = JSON.parse(userContainer);
            if ((appData && Object.prototype.hasOwnProperty.call(appData, 'OAuser'))) {
                if ((appData && Object.prototype.hasOwnProperty.call(appData.OAuser, "BaseRole"))) {
                    if (appData.OAuser.BaseRole != "" || appData.OAuser.BaseRole != null) {
                        const id = appData.OAuser.BaseRole;
                        const token = appData.OAuser._jwt_.iot_pack;
                        const response = await ApiServices.getDepartmentById(token, id);
                        setDep(response.data);
                        setLoading(false);
                    } else {
                       setLoading(true); 
                    }
                }else {
                    setLoading(true); 
                }
            }else {
                setLoading(true); 
            }
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false);
        }
      };
        fetchData();
    }, []);
    
    const HandleFormData = async (event) => { 
        event.preventDefault()
        const errors = validateFetchStudentForAttendance(apiData)
        
        setFormErrors(errors);
    }

    const validateFetchStudentForAttendance = (apiData) => {
        let errors = {};
        if (!apiData.departmentId) {
            errors.department = 'Department field is required';
        }
        if (!apiData.classId) {
            errors.class = 'Class field is required';
        }
        if (!apiData.semesterId) {
            errors.semester = 'Semester field is required';
        }
        if (!apiData.courseId) {
            errors.course = 'Course field is required';
        }
        if (!apiData.date) {
            errors.date = 'Date field is required';
        }
        if (apiData.classId != "" && apiData.courseId != "" && apiData.date != "" && apiData.departmentId != "" && apiData.semesterId != "") {
            //fetch all students on this department and same semester offering same course
            fetchStudents(apiData);
            setAttendanceData([]);
        }
        
        return errors;
    }

    const fetchStudents = async (apiData) => {
        const response = await ApiServices.fetchStudentsOnSameDepartment(apiData.departmentId, apiData.classId, apiData.semesterId, apiData.courseId, apiData.date);
        if (response.data.length !== 0) {
            setIsTableVisible(true);
            setErrors({});
            setSuccessMsg("")
            setAttendanceData("");
            setAttendanceData(response.data);
        }
    }
    const handleInputChange = async(e) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value,
        }));
        setApiDaa(prevData => ({
            ...prevData,
            departmentId: value,
        }));

        if (value == "" || value == null) {
            setClass([])
            setSemester([])
            setClsCon(false)
            setSemCon(false)
            return false;
        } else {
            const response = await ApiServices.getAllClasses();
            if (response.data.length !==0) {
                setClsCon(true)
                setClass(response.data);
            }
            
        }
    };

    const HandleClassChanges = async (e) => {
        const { name, value } = e.target;
        if (value == "" || value == null) {
            setSemCon(false)
            setSemester([]);
            return false;
        } else {
            setApiDaa(prevData => ({
                ...prevData,
                classId: value,
            }));
            const response = await ApiServices.getSemesterByClassId(value);
            if (response.data.length !==0) {
                setSemCon(true)
                setSemester(response.data);
            }
        }
    }

    const handleSelectSemester = async (e) => {
        const { name, value } = e.target;
        if (value == "") {
            setCour(false)
            setCourse([]);
            return false;
        } else {
            setApiDaa(prevData => ({
                ...prevData,
                semesterId: value,
            }));
            const response = await ApiServices.getClassByDepartmentAndClassAndSemester(apiData.departmentId, apiData.classId, value);
            if (response.data.length !==0) {
                setCour(true)
                setCourse(response.data);
            }
        }     
        
    }

    const handleSelectCourse = async (e) => {
        const { name, value } = e.target;
        setApiDaa(prevData => ({
            ...prevData,
            courseId: value,
        }));
    }

    const HandleDate = async (e) => {
        const { name, value } = e.target;
        setApiDaa(prevData => ({
            ...prevData,
            date: value,
        }));
    }

    const handleAttendanceData = async (e) => {
        e.preventDefault()
        // Validate form data
        let hasError = false;
        attendanceData.forEach((student) => {
            const presentRadio = document.getElementById(`present_${student.studentId}`);
            const absentRadio = document.getElementById(`absent_${student.studentId}`);
            if (!presentRadio.checked && !absentRadio.checked) {
                hasError = true;
            }
        });
        if (hasError) {
            setErrors({ message: 'Please select a radio button for each student.' });
        } else {
            setErrors({});

            // Prepare data for submission
            const formData = attendanceData.map((student) => {
                const presentRadio = document.getElementById(`present_${student.studentId}`);
                const absentRadio = document.getElementById(`absent_${student.studentId}`);
                return {
                    departmentId: apiData.departmentId,
                    classId: apiData.classId,
                    semesterId:apiData.semesterId,
                    courseId: apiData.courseId,
                    date:apiData.date,
                    studentId: student.studentId,
                    attendanceType: presentRadio.checked ? '1' : '2'
                };
            });

            try {
                //check if attendance have already been marked on this data in this particular course
                const checkExist  = await ApiServices.checkIfAttendanceAlreadyMarked({'departmentId':apiData.departmentId,'classId': apiData.classId, 'semesterId':apiData.semesterId,'courseId': apiData.courseId, 'date':apiData.date})
                if (checkExist.data ==404) {
                    // Make POST request to backend
                    const response = await ApiServices.studentAttendance(JSON.stringify(formData));
                    if (response.status==200) {
                        // Handle success response
                        setSuccessMsg({ message: 'Attendance data submitted successfully' })
                        // Reset form or perform other actions as needed
                    } else {
                        setSuccessMsg("")
                        // Handle error response
                        console.error('Failed to submit attendance data');
                    }
                } else {
                    setSuccessMsg("")
                    hasError = true;
                    setErrors({ message: "Already marked attendance with the selected course and date." })
                }
            } catch (error) {
                console.error('Error submitting attendance data:', error);
            }
        }
    }


  return (
    <>
      <HeaderNav />
      <Aside />
          {loading ? (
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
                              <li className="active">Attendance </li>
                              <li className="active">Mark Student Attendance</li>
                          </ol>
                      </section>
                      <section className="content  mb-5 text-dark">
                          <div className="container-fluid">
                              <div className="defaultCard">
                                  <div className="defaultCardHeader">
                                      <div className="pull-left">
                                          <i className="fa fa-users bg-r" aria-hidden="true"></i>
                                          <span className="bolder-3 bg-r">Mark Attandance</span>
                                      </div>
                                  </div>
                                  <div className="card-body">
                                      <section className="content">
                                          <div className="box">
                                              <div className="row">
                                                  <form method="post" className="form-group" onSubmit={HandleFormData}>
                                                      <div className="col-md-12">
                                                          <div className="row">
                                                              <div className="col-md-4 col-sm-12 col-lg-4 col-xs-12">
                                                                  <label htmlFor="Department" className='input-label'>Department:*</label>
                                                                  <select name="department" className={`form-control ${formErrors.department ? 'is-invalid' : ''}`}  defaultValue="" onChange={handleInputChange}>
                                                                      <option value="">--Empty--</option>
                                                                      <option key={dep.id} value={dep.id}>{dep.departmentName} </option>
                                                                  </select>
                                                                  {formErrors.department && <div className="invalid-feedback">{formErrors.department}</div>}
                                                              </div>
                                                              <div className="col-md-4 col-sm-12 col-lg-4 col-xs-12">
                                                                  <label htmlFor="Class" className='input-label'>Class:*</label>
                                                                  <select name="class"  className={`form-control ${formErrors.class ? 'is-invalid' : ''}`}onChange={HandleClassChanges}>
                                                                      <option value="">{cc ? '--Select--' : '--Empty--'}</option>
                                                                      {isClass.map((clas) => (
                                                                          <option key={clas.id} value={clas.id}>
                                                                              {clas.title}
                                                                          </option>
                                                                      ))}
                                                                  </select>
                                                                  {formErrors.class && <div className="invalid-feedback">{formErrors.class}</div>}
                                                              </div>
                                                              <div className="col-md-4 col-sm-12 col-lg-4 col-xs-12">
                                                                  <label htmlFor="Semester" className='input-label'>Semester:*</label>
                                                                  <select name="semester"  className={`form-control ${formErrors.semester ? 'is-invalid' : ''}`}onChange={handleSelectSemester}>
                                                                      <option value="">{ss ? '--Select--' : '--Empty--'}</option>
                                                                      {isSemester.map((semester) => (
                                                                          <option key={semester.id} value={semester.id}>
                                                                              {semester.title}
                                                                          </option>
                                                                      ))}
                                                                  </select>
                                                                  {formErrors.semester && <div className="invalid-feedback">{formErrors.semester}</div>}
                                                              </div>
                                                              <div className="col-md-4 col-sm-12 col-lg-4 col-xs-12">
                                                                  <label htmlFor="Course" className='input-label'>Course:*</label>
                                                                  <select name="courseId"  className={`form-control ${formErrors.course ? 'is-invalid' : ''}`}onChange={handleSelectCourse}>
                                                                      <option value="">{ssc ? '--Select--' : '--Empty--'}</option>
                                                                      {isCourse.map((course) => (
                                                                          <option key={course.id} value={course.id}>
                                                                              {course.courseTitle}
                                                                          </option>
                                                                      ))}
                                                                  </select>
                                                                  {formErrors.course && <div className="invalid-feedback">{formErrors.course}</div>}
                                                              </div>
                                                              <div className="col-md-4 col-sm-12 col-lg-4 col-xs-12">
                                                                <label htmlFor="FROMDate" className='input-label'>Date:*</label>
                                                                <input type="date" name="date"  className={`form-control ${formErrors.date ? 'is-invalid' : ''}`} defaultValue={apiData.date} style={{ width: '100%' }} onChange={HandleDate} />
                                                                {formErrors.date && <div className="invalid-feedback">{formErrors.date}</div>}
                                                              </div>
                                                              <div className="col-md-4 col-sm-12 col-lg-4 col-xs-12">
                                                                  <button type="submit" className="SearchBTN btn bg-blue btn-primary" title="filter data" onClick={HandleFormData}><i className="pull-left fa fa-search"></i>Search Data</button>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </form>
                                              </div>
                                          </div>
                                      </section>
                                  </div>
                              </div>
                          </div>
                          <section className="content  text-dark mt-5">
                              <div className="container-fluid">
                                  <div className="defaultCard">
                                      <div className="defaultCardHeader">
                                          <div className="pull-left">
                                              <i className="fa fa-users bg-r" aria-hidden="true"></i>
                                              <span className="bolder-3 bg-r">Please Select Class First.</span>
                                          </div>
                                      </div>
                                      <div className="card-body">
                                          {istableVisible ? (
                                              <>
                                               <form method="post" id="__attendanceForm" onSubmit={handleAttendanceData}>
                                                    <div className="row">
                                                        {/* Error message */}
                                                        {errors.message && (
                                                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                                                {errors.message}
                                                                 <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                                                    <span aria-hidden="true">&times;</span>
                                                                </button>
                                                            </div>
                                                        )}
                                                        {/* Sucess message */}
                                                        {successMsg.message && (
                                                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                                                {successMsg.message}
                                                                 <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                                                    <span aria-hidden="true">&times;</span>
                                                                </button>
                                                            </div>      
                                                        )}
                                                        <div className="col-md-12" id="att-list">
                                                            <table style={{ margin: "10px" }} className="w-100 table table-striped table-bordered table-hover" id="dosen">
                                                            <thead>
                                                                <tr>
                                                                    <th colSpan="4" className="header-tb attendance-table-header">Attendance Record on <span className="DocOn">{apiData.date}</span></th></tr>
                                                                <tr></tr>
                                                                </thead>
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Student Fullname</th>
                                                                    <th>Student Gender</th>
                                                                    <th className="text-center">Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {attendanceData.map((student, index) => (
                                                                    <tr key={index}>
                                                                    <td className="text-center">{index + 1}</td>
                                                                    <td>{student.firstname} {student.surname}</td>
                                                                    <td>{student.gender}</td>
                                                                    <td>
                                                                        <div className="row">
                                                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                                                                <div className="form-group mb-3">
                                                                                    <div className="custom-control quiz-input-present position-relative"> 
                                                                                        <input type="hidden" name={`student_id[${student.studentId}]`} value={student.studentId} />
                                                                                        <label htmlFor={`present_${student.studentId}`} className='font-weight-normal'>
                                                                                            <span className="quiz-option-number-attendance-present">P</span>
                                                                                            <input type="radio" value="1" name={`type[${student.studentId}]`} id={`present_${student.studentId}`} />
                                                                                            <span className='ml-1'>Present<i className="fa fa-check ml-2" aria-hidden="true" style={{color:'#63b412'}}></i></span>
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>      
                                                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                                                                <div className="form-group mb-3">
                                                                                    <div className="custom-control quiz-input-absent position-relative"> 
                                                                                        <input type="hidden" name={`student_id[${student.studentId}]`} value={student.studentId} />
                                                                                        <label htmlFor={`absent_${student.studentId}`} className='font-weight-normal'>
                                                                                            <span className="quiz-option-number-attendance-absent">A</span>
                                                                                            <input type="radio" value="2" name={`type[${student.studentId}]`} id={`absent_${student.studentId}`} />
                                                                                            <span className='ml-1'>Absent<i className="fa fa-times ml-2" aria-hidden="true" style={{color:'#b63e12'}}></i></span>
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                            </div> 
                                                                        </div>
                                                                         
                                                                    </td>
                                                                    </tr>
                                                                ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div className="col-md-12" id="submit-btn-field">
                                                        <center>
                                                            <button className="btn btn-primary btn-sm col-sm-5 pull-left" onClick={handleAttendanceData}>Save attendance</button>
                                                        </center>
                                                    </div>
                                                    </div>
                                                </form>
                                              </>
                                          ) : (<><h6 className='text-center'><i>Please Select Class First.</i></h6></>)}
                                      </div>
                                  </div>
                              </div>
                          </section>
                      </section>
                  </div>
              </>)}     
          
    </>
  )
}

export default MarkAttendance
