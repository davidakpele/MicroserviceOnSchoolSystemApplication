
import HeaderNav from './components/Header/Nav/HeaderNav';
import Aside from './components/Header/Menu/Aside';
import { useEffect, useRef, useState} from 'react';
import ApiServices from "../services/WebServices";
import $ from 'jquery'

const AttendanceReport = () => {
    const tableRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [dep, setDep] = useState({})
    const [cc, setClsCon]= useState(false)
    const [ss, setSemCon]= useState(false)
    const [ssc, setCour] = useState(false)
    const [istableVisible, setIsTableVisible]= useState(false)
    const [isClass, setClass] = useState([])
    const [isSemester, setSemester] = useState([])
    const [isCourse, setCourse] = useState([])
    const [studentsAttendanceData, setStudentsAttendanceData] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [tableHeaderData, setTableHeaderData] = useState({
        department: '',
        class: '',
        semester: '',
        course: '',
        date:''
    });
  
    const [apiData, setApiDaa] = useState({
        'departmentId': '',
        'classId': '',
        'semesterId': '',
        'courseId': '',
        "month":'' 
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
        if (!apiData.month) {
            errors.month = 'Month field is required';
        }
        if (apiData.classId != "" && apiData.courseId != "" && apiData.month != "" && apiData.departmentId != "" && apiData.semesterId != "") {
            //fetch all students on this department and same semester offering same course
            fetchStudents(apiData);
        }
        
        return errors;
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
        // Get the month name from the months array based on the month index
        const monthName = months[monthIndex];

        // Format the date string as "Month Day Year" (e.g., "April 4 2024")
        const formattedDate = `${monthName} ${year}`;

        return formattedDate;
    }

    const fetchStudents = async (apiData) => {
        const resp = await ApiServices.fetchStudentsOnSameDepartmentWithAppointmentListByMonth(apiData.departmentId, apiData.classId, apiData.semesterId, apiData.courseId, apiData.month);
        if (resp.data.length !== 0) {
            const data = resp.data.data || [];
            const recordDetails = resp.data.record || [];
            const details = resp.data.details || [];
            var _table = $('#table_clone_att').clone()
            $('#att-list__att').html('')
            $('#att-list__att').append(_table)
            if (data.length > 0) {

                const formattedDetails = {
                    departmentName: details[0]?.departmentName || '',
                    courseTitle: details[0]?.courseTitle || '',
                    semesterName: details[0]?.semesterName || '',
                    createdOn: recordDetails[0]?.createdOn || '',
                    className: details[0]?.className || '',
                };
                const timeFormat = formatDate(apiData.month);
                setTableHeaderData({
                    department: formattedDetails.departmentName,
                    class: formattedDetails.className,
                    semester: formattedDetails.semesterName,
                    course: formattedDetails.courseTitle,
                    date:timeFormat
                })
                if (recordDetails.length === 0) {
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
                    if (Object.keys(data).length > 0) {
                        var i = 1;
                         const attendanceRows = [];
                        Object.keys(data).map(function (k) {
                            var name = data[k].records[0].firstname + ' ' + data[k].records[0].surname;
                            var id = data[k].id;
                            var present = 0;
                            var absent = 0;
                            if (Object.keys(recordDetails).length > 0) { 
                                if (recordDetails[id].length > 0) {
                                     Object.keys(recordDetails[id]).map(i => {
                                        if (recordDetails[id][i].attendanceType == 2)
                                            absent = parseInt(absent) + 1;
                                        if (recordDetails[id][i].attendanceType == 1)
                                            present = parseInt(present) + 1;
                                    })
                                }
                            }
                            
                            attendanceRows.push(
                                <>
                                <tr key={id}>
                                <td className="text-center">{i++}</td>
                                <td>{name}</td>
                                <td>{present}</td>
                                <td>{absent}</td>
                                </tr>
                                </>
                        )
                            // Set the JSX elements to the state variable
                            setStudentsAttendanceData(attendanceRows);
                            setIsTableVisible(true);
                        })
                    }
                }
            }
        }
    };

    const handleInputChange = async(e) => {
        const { value } = e.target;
       
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
        const { value } = e.target;
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
        const { value } = e.target;
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
        const { value } = e.target;
        setApiDaa(prevData => ({
            ...prevData,
            courseId: value,
        }));
    }

    const HandleDate = async (e) => {
        const { value } = e.target;
        setApiDaa(prevData => ({
            ...prevData,
            month: value,
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
                              <li className="active">View Student Attendance Report</li>
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
                                                                <input type="month" name="month"  className={`form-control ${formErrors.month ? 'is-invalid' : ''}`} defaultValue={apiData.month} style={{ width: '100%' }} onChange={HandleDate} />
                                                                {formErrors.month && <div className="invalid-feedback">{formErrors.month}</div>}
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
                                              <span className="bolder-3 bg-r">STUDENT ATTENDANCE REPORT`S</span>
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
                                                        <p>Month of: <b className="doc">{(tableHeaderData ? tableHeaderData.date :'')}</b></p>
                                                    </td>
                                                </tr>
                                            </table>
                                            <table className='table table-bordered table-hover att-list' ref={tableRef} >
                                                <thead>
                                                    <tr>
                                                        <th className="text-center" width="5%">S/N</th>
                                                        <th width="20%">Student</th>
                                                        <th>Present</th>
                                                        <th>Absent</th>
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
                  </div>
        </>)}     
          
    </>
  )
}

export default AttendanceReport
