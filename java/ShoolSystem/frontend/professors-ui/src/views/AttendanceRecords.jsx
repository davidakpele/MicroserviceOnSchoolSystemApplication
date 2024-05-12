/* eslint-disable no-unused-vars */
import HeaderNav from './components/Header/Nav/HeaderNav';
import Aside from './components/Header/Menu/Aside';
import { useEffect, useRef, useState} from 'react'; 
import ApiServices from "../services/WebServices";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClose, faPencil } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import $ from 'jquery'

const AttendanceRecords = (props) => {
    const tableRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [dep, setDep] = useState({})
    const [cc, setClsCon]= useState(false)
    const [ss, setSemCon]= useState(false)
    const [ssc, setCour] = useState(false)
    const [show, setShow] = useState(false);
    const [istableVisible, setIsTableVisible]= useState(false)
    const [isClass, setClass] = useState([])
    const [isSemester, setSemester] = useState([])
    const [isCourse, setCourse] = useState([])
    const [studentsAttendanceData, setStudentsAttendanceData] = useState([]);
    const [studentsAttendanceEditData, setStudentsAttendanceEditData] = useState([]);
    const [selectedAttendanceTypes, setSelectedAttendanceTypes] = useState({});
    const [editattendance, setEditAttendance] = useState({
        id: '',
        attendanceId: '',
        createdOn:''
    });
    const [tableHeaderData, setTableHeaderData] = useState({
        department: '',
        class: '',
        semester: '',
        course: '',
        date:''
    });
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

    const handleClose = () => {
        setSelectedAttendanceTypes("")
        setFormErrors("")
        setShow(false);
    } 

    const handleAttendanceTypeChange = (studentId, attendanceType) => {
        setSelectedAttendanceTypes({
            ...selectedAttendanceTypes,
            [studentId]: attendanceType
        });
    };

    const edit_attendance = async (studentId) => {
        setSelectedAttendanceTypes("")
        const resp = await ApiServices.fetchSingleStudentsOnSameDepartmentWithAppointmentList(studentId, apiData.departmentId, apiData.classId, apiData.semesterId, apiData.courseId, apiData.date);
        if (resp.data.length !== 0) {
            const data = resp.data.data || [];
            const record = resp.data.record || [];
            const details = resp.data.details || [];
            const attendance_id = resp.data.attendance_id || '';
            
            if (data.length > 0) {
                const timeoN = record[0]?.createdOn
                const uid = record[0].studentId;
                const timeFormat = formatDate(timeoN);
                setEditAttendance({
                    id:uid,
                    attendanceId: attendance_id,
                    createdOn:timeFormat
                })
                if (record.length === 0) {
                    // No record found
                    const NotFound = (
                        <tr key={1}>
                            <td colSpan={4} className="text-center">
                                <div className="alert alert-info alert-dismissible fade show" role="alert">
                                    <strong>Error!</strong> You have not marked student attendance for this course and date.
                                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                    setStudentsAttendanceEditData([NotFound]);
                } else {
                    
                    const students = data.map((student, index) => {
                        const names = `${student.records[0]?.firstname || ''} ${student.records[0]?.surname || ''}`;
                        const id = student.id;
                        const attendanceRecord = record[index];
                        // Check if attendanceRecord is defined and has attendanceType
                        if (attendanceRecord && attendanceRecord.attendanceType !== undefined) {
                            const attendanceType = attendanceRecord.attendanceType;
                            // Render based on attendanceType
                            const renderAttendanceType = () => {
                                if (attendanceType == 1) {
                                    return (
                                        <>
                                            Present <FontAwesomeIcon icon={faCheck} style={{ color: '#008d4c', fontSize: '18px', fontWeight: '400' }} />
                                        </>
                                    );
                                } else if (attendanceType == 2) {
                                    return (
                                        <>
                                            Absent <FontAwesomeIcon icon={faClose} style={{ color: '#d73925', fontSize: '18px', fontWeight: '400' }} />
                                        </>
                                    );
                                } else {
                                    return null;
                                }
                            };
                            const isChecked = selectedAttendanceTypes[studentId] === attendanceType;
                            return (
                                <tr key={id}>
                                    <td className="text-center">{index + 1}</td>
                                    <td>{names}</td>
                                    <td>{renderAttendanceType()}</td>
                                    <td>
                                        <div className="row">
                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                                <div className="form-group">
                                                    <div className="d-flex custom-control quiz-input-present position-relative"> 
                                                        <input type="hidden" name={`student_id[${id}]`} value={id} />
                                                        <label htmlFor={`present_${id}`} className='font-weight-normal'>
                                                            <span className="quiz-option-number-attendance-present">P</span>
                                                            <input
                                                                type="radio"
                                                                id={`present_${id}`}
                                                                name={`type[${id}]`}
                                                                value="1"
                                                                onChange={() => handleAttendanceTypeChange(id, 1)}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>      
                                            <div className="col-sm-12 col-md-6 col-lg-6">
                                                <div className="form-group mb-3">
                                                    <div className="d-flex custom-control quiz-input-absent position-relative"> 
                                                        <input type="hidden" name={`student_id[${id}]`} value={id} />
                                                        <label htmlFor={`absent_${id}`} className='font-weight-normal'>
                                                            <span className="quiz-option-number-attendance-absent">A</span>
                                                             <input
                                                                type="radio"
                                                                id={`absent_${id}`}
                                                                name={`type[${id}]`}
                                                                value="2"
                                                                onChange={() => handleAttendanceTypeChange(id, 2)}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div> 
                                        </div>
                                    </td>
                                </tr>
                            );
                        }
                    });

                    setStudentsAttendanceEditData(students);
                }
            }
        }
        setShow(true)
    }

    const formatDate=(inputDateStr)=> {
        // Create a new Date object from the input date string
        const inputDate = new Date(inputDateStr);

        // Define months array for getting the month name
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Extract components from the Date object
        const year = inputDate.getFullYear(); 
        const monthIndex = inputDate.getMonth(); 
        const day = inputDate.getDate(); 

        // Get the month name from the months array based on the month index
        const monthName = months[monthIndex];

        // Format the date string as "Month Day Year" (e.g., "April 4 2024")
        const formattedDate = `${monthName} ${day} ${year}`;

        return formattedDate;
    }

   const saveUpdates = async (attendanceId, studentId) => {
       // Check if at least one attendance type is selected for each student
    
    if (selectedAttendanceTypes.length ==0) {
        setFormErrors({ attendanceTypes: 'Please select attendance type (Present or Absent) for this students before saving.'});
        return false;
    } else {
        setFormErrors("")
        var attendanceType = selectedAttendanceTypes[studentId]
       const response = await ApiServices.saveAttendanceUpdates({studentId, attendanceId, attendanceType});
        if (response.status ==200) {
           fetchStudents(apiData);
        }
    }
};


    const fetchStudents = async (apiData) => {
        const resp = await ApiServices.fetchStudentsOnSameDepartmentWithAppointmentList(apiData.departmentId, apiData.classId, apiData.semesterId, apiData.courseId, apiData.date);
        
        if (resp.data.length !== 0) {
            const data = resp.data.data || [];
            const record = resp.data.record || [];
            const details = resp.data.details || [];
            const attendance_id = resp.attendance_id || '';

            if (data.length > 0) {
                const formattedDetails = {
                    departmentName: details[0]?.departmentName || '',
                    courseTitle: details[0]?.courseTitle || '',
                    semesterName: details[0]?.semesterName || '',
                    className: details[0]?.className || '33',
                    createdOn: record[0]?.createdOn || '',
                };
                const timeFormat = formatDate(record[0]?.createdOn);
                console.log(timeFormat);
                setTableHeaderData({
                    department: formattedDetails.departmentName,
                    class: formattedDetails.className,
                    semester: formattedDetails.semesterName,
                    course: formattedDetails.courseTitle,
                    date:timeFormat
                })

                if (record.length === 0) {
                    // No record found
                    const NotFound = (
                        <tr key={1}>
                            <td colSpan={4} className="text-center">
                                <div className="alert alert-info alert-dismissible fade show" role="alert">
                                    <strong>Error!</strong> You have not marked student attendance for this course and date.
                                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                    setStudentsAttendanceData([NotFound]);
                } else {
                    
                    const students = data.map((student, index) => {
                        const names = `${student.records[0]?.firstname || ''} ${student.records[0]?.surname || ''}`;
                        const id = student.id;
                        const attendanceRecord  = record[index];
                        // Check if attendanceRecord is defined and has attendanceType
                        if (attendanceRecord && attendanceRecord.attendanceType !== undefined) {
                            const attendanceType = attendanceRecord.attendanceType;
                            // Render based on attendanceType
                            const renderAttendanceType = () => {
                                if (attendanceType == 1) {
                                    return (
                                        <>
                                            Present <FontAwesomeIcon icon={faCheck} style={{ color: '#008d4c', fontSize: '18px', fontWeight: '400' }} />
                                        </>
                                    );
                                } else if (attendanceType == 2) {
                                    return (
                                        <>
                                            Absent <FontAwesomeIcon icon={faClose} style={{ color: '#d73925', fontSize: '18px', fontWeight: '400' }} />
                                        </>
                                    );
                                } else {
                                    return null; // Handle other cases if needed
                                }
                            };

                            return (
                                <tr key={id}>
                                    <td className="text-center">{index + 1}</td>
                                    <td>{names}</td>
                                    <td>{renderAttendanceType()}</td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            className="btn btn-flat btn-primary"
                                            onClick={() => edit_attendance(id)}
                                            style={{ width: '40px', height: '30px' }}
                                        >
                                            <FontAwesomeIcon icon={faPencil} />
                                        </Button>
                                    </td>
                                </tr>
                            );
                        }
                    });

                    setStudentsAttendanceData(students);
                }
            }

            setIsTableVisible(true);
        }
    };

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
                              <li className="active">Review Student Attandance Record</li>
                          </ol>
                      </section>
                      <section className="content  mb-5 text-dark">
                          <div className="container-fluid">
                              <div className="defaultCard">
                                  <div className="defaultCardHeader">
                                      <div className="pull-left">
                                          <i className="fa fa-users bg-r" aria-hidden="true"></i>
                                          <span className="bolder-3 bg-r">Attandance Records</span>
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
                                                                  <button type="submit" className="SearchBTN btn bg-blue" style={{padding:'5px', width:'8rem'}} title="filter data" onClick={HandleFormData}><i className="pull-left fa fa-search"></i>Filter</button>
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
                          <section className="content  text-dark mt-5" id="table_clone">
                              <div className="container-fluid">
                                  <div className="defaultCard">
                                      <div className="defaultCardHeader">
                                          <div className="pull-left">
                                              <i className="fa fa-users bg-r" aria-hidden="true"></i>
                                              <span className="bolder-3 bg-r">STUDENT ATTENDANCE RECORD`S</span>
                                          </div>
                                      </div>
                                          <div className="card-body">
                                            
                                          {istableVisible ? (
                                              <>
                                            <table width="100%">
                                                <tr>
                                                    <td width="50%">
                                                        <p>Department: <b className="repdepartment">{(tableHeaderData ? tableHeaderData.department :'')}</b></p>
                                                        <p>Course: <b className="repcourse">{(tableHeaderData ? tableHeaderData.course :'')}</b></p>
                                                    </td>
                                                    <td width="50%">
                                                        <p>Class: <b className="repclass">{(tableHeaderData ? tableHeaderData.class :'')}</b></p>
                                                        <p>Date: <b className="doc">{(tableHeaderData ? tableHeaderData.date :'')}</b></p>
                                                    </td>
                                                </tr>
                                            </table>
                                            <table className='table table-bordered table-hover att-list' ref={tableRef} >
                                                <thead>
                                                    <tr>
                                                        <th className="text-center" width="5%">S/N</th>
                                                        <th width="20%">Student</th>
                                                        <th>Attendance</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                            <tbody>{studentsAttendanceData}</tbody>
                                        </table>
                                              </>
                                          ) : (<><h2 className='text-center '>STUDENT ATTENDANCE RECORD&apos;S</h2></>)}
                                      </div>
                                  </div>
                              </div>
                          </section>
                      </section>
                          {show ? <>
                              <Modal {...props}
                                size="lg"
                                show={show} onHide={handleClose} animation={false}>
                                <Modal.Header closeButton>
                                <Modal.Title>Edit Student Attendance</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <form method="post" className="form-group">
                                        <div className="modal-body">
                                            <h6>Attendance Record on <span className='editTimeZone'>{editattendance ?editattendance.createdOn : ""}</span> </h6>
                                            <table width="100%" className="table table-bordered table-hover">
                                            <thead>
                                            <tr>
                                                <th className="text-center" width="5%">S/N</th>
                                                <th width="20%">Student Name</th>
                                                <th>Attendance (BEFORE)</th>
                                                <th className="text-center">Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>{studentsAttendanceEditData} </tbody>
                                        </table>
                                        </div>
                                          <input type="text" name="editAttendanceId" defaultValue={editattendance.attendanceId} className='hidden'  readOnly />
                                          <input type="text" name="editStudentId" defaultValue={editattendance.id}  className='hidden' readOnly />    
                                    </form>
                                {formErrors.attendanceTypes && (
                                    <div className="alert alert-danger" role="alert">
                                        {formErrors.attendanceTypes}
                                    </div>
                                )}
                                </Modal.Body>
                                  <Modal.Footer>
                                      <div className="d-flex gap-3">
                                      <Button variant="secondary" onClick={handleClose}>
                                            Close
                                        </Button>
                                        <Button variant="primary" onClick={() => saveUpdates(editattendance.attendanceId, editattendance.id)}>
                                            Save Changes
                                        </Button>
                                      </div>
                                
                                </Modal.Footer>
                            </Modal>
                          </> :''}
                  </div>
              </>)}     
          
    </>
  )
}

export default AttendanceRecords
