import HeaderNav from '../../components/Header/Nav/HeaderNav';
import Aside from '../../components/Header/Menu/Aside';
import { useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiServices from '../../../services/WebServices';

export const CreateExamSetUp = () => {
    const navigateHistory = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dep, setDep] = useState({})
    const [formErrors, setFormErrors] = useState({});
    const [isClass, setClass] = useState([])
    const [isSemester, setSemester] = useState([])
    const [isCourse, setCourse] = useState([])
    const [cc, setClsCon]= useState(false)
    const [ss, setSemCon]= useState(false)
    const [ssc, setCour] = useState(false)
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [duration, setDuration] = useState('')
    const [apiData, setApiData] = useState({
        'departmentId': '',
        'classId': '',
        'semesterId': '',
        'courseId': '',
        'subjectName':'',
        'duedate': '',
        'startingTime': '',
        'endingTime': '',
        'duration':'',
        'totaltNumberQuestions':'',
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
    
    const handleInputFields = (event) => {
        const { name, value } = event.target;
        setApiData({ ...apiData, [name]: value });
    };
    
    const handleInputChange = async(e) => {
        const { value } = e.target;
    
        setApiData(prevData => ({
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
            setApiData(prevData => ({
                ...prevData,
                classId: value,
            }));
            const response = await ApiServices.getSemesterByClassId(value);
            if (response.data.length !== 0) {
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
            setApiData(prevData => ({
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
        if (value == "") {
            setApiData(prevData => ({
                ...prevData,
                subjectName: '',
            }));
            return false;
        } else {
            setApiData(prevData => ({
                ...prevData,
                courseId: value,
            }));
            const response = await ApiServices.getCourseById(value);
            if (response.data.length !== 0) {
                setApiData(prevData => ({
                    ...prevData,
                    subjectName: response.data.courseCode,
                }));
            }
        }
    }

    const HandleFormData = async (event) => { 
        event.preventDefault()
        const errors = validateFetchStudentForAttendance(apiData)
        setFormErrors(errors);
    }

    const handleStartTimeChange = (event) => {
        const { value } = event.target;
        setStartTime(value);
        calculateDuration(value, endTime);
        setApiData({ ...apiData, startingTime: value });
    };

    const handleEndTimeChange = (event) => {
        const { value } = event.target;
        setEndTime(value);
        calculateDuration(startTime, value);
        setApiData(apiData => ({
            ...apiData,
            endingTime: value,
            duration: duration
        }))
    };

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
        if (!apiData.duedate) {
            errors.duedate = 'Due Date/expiring date field is required';
        }
        if (!apiData.startingTime) {
            errors.startingTime = 'Starting time field is required';
        }
        if (!apiData.endingTime) {
            errors.endingTime = 'Ending time field is required';
        }

        if (!apiData.totaltNumberQuestions) {
            errors.totaltNumberQuestions = 'Total number of question time field is required';
        }
        if (apiData.classId != "" && apiData.courseId != "" && apiData.date != "" && apiData.departmentId != "" && apiData.semesterId != ""
             && apiData.duedate !="" && apiData.endingTime !="" && apiData.startingTime !="" && apiData.totaltNumberQuestions !="") {
            //Save data
            const time = timeCheck(apiData.startingTime, apiData.endingTime)
            if (time[1] >= 45 || time[0] >= 1) {
                apiData.duration = duration
                
                saveExaminationSettings(apiData)
            } else {
                errors.endingTime ='Duration must be at least 45 minutes.'
            }
        }
        return errors;
    }

    const saveExaminationSettings = async (apiData) => {
        const response = await ApiServices.saveExamSettings(apiData)
        console.log(response.status);
        if (response.status ==201) {
            //redirect to form page
            navigateHistory('/create/exam/form/examinationId/'+response.data.id+'/serialNumber/'+response.data.totalQuestions)
        }
    }

    const timeCheck = (start, end) => {
        if (start && end) {
            const timeStringToMilliseconds = (timeStr) => {
                const [time, period] = timeStr.split(/(?=[AP]M)/); // split time and period (AM/PM)
                const [hours, minutes, seconds] = time.split(':').map(Number);

                let hours24 = hours;
                if (period === 'PM' && hours !== 12) {
                    hours24 += 12;
                } else if (period === 'AM' && hours === 12) {
                    hours24 = 0; // Midnight
                }

                const date = new Date();
                date.setHours(hours24, minutes, seconds, 0); // Set time components
                return date.getTime(); // Get time in milliseconds since January 1, 1970
            };

            const startTimeMs = timeStringToMilliseconds(start);
            const endTimeMs = timeStringToMilliseconds(end);

            const timeDifference = endTimeMs - startTimeMs;

            const millisecondsInSecond = 1000;
            const millisecondsInMinute = 60 * millisecondsInSecond;
            const millisecondsInHour = 60 * millisecondsInMinute;

            const hours = Math.floor(timeDifference / millisecondsInHour);
            const remainingMillis = timeDifference % millisecondsInHour;
            const minutes = Math.floor(remainingMillis / millisecondsInMinute);
            const seconds = Math.floor((remainingMillis % millisecondsInMinute) / millisecondsInSecond);
            var e = [hours, minutes, seconds]
            return e;
        }
    }

    const calculateDuration = (start, end) => {
        if (start && end) {
            const timeStringToMilliseconds = (timeStr) => {
                const [time, period] = timeStr.split(/(?=[AP]M)/); // split time and period (AM/PM)
                const [hours, minutes, seconds] = time.split(':').map(Number);

                let hours24 = hours;
                if (period === 'PM' && hours !== 12) {
                    hours24 += 12;
                } else if (period === 'AM' && hours === 12) {
                    hours24 = 0; // Midnight
                }

                const date = new Date();
                date.setHours(hours24, minutes, seconds, 0); // Set time components
                return date.getTime(); // Get time in milliseconds since January 1, 1970
            };

            const startTimeMs = timeStringToMilliseconds(start);
            const endTimeMs = timeStringToMilliseconds(end);

            const timeDifference = endTimeMs - startTimeMs;

            const millisecondsInSecond = 1000;
            const millisecondsInMinute = 60 * millisecondsInSecond;
            const millisecondsInHour = 60 * millisecondsInMinute;

            const hours = Math.floor(timeDifference / millisecondsInHour);
            const remainingMillis = timeDifference % millisecondsInHour;
            const minutes = Math.floor(remainingMillis / millisecondsInMinute);
            const seconds = Math.floor((remainingMillis % millisecondsInMinute) / millisecondsInSecond);
          
            if (minutes >= 45 || hours >= 1 ) {
                var duration = hours +' hours, ' +minutes+ ' minutes, '+ seconds +' seconds'
                setApiData({ ...apiData, duration: duration });
                setDuration(duration);
                setApiData(apiData => ({
                    ...apiData,
                    duration: duration
                }))
                setFormErrors({ 'endingTime': '' });
                var e = [hours, minutes, seconds]
                return e;
            } else {
                setFormErrors({'endingTime': 'Duration must be at least 45 minutes' }); 
            }
            
        }
    };

   
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
                              <li className="active">Application </li>
                              <li className="active">Student Profile</li>
                          </ol>
                          <div className="pull-left mt-5">
                            <Link to={"/exam_setup"}>
                                <button type="button" className="btn btn-sm btn-flat btn-secondary">
                                    <i className="fa fa-arrow-left"></i>Go Back
                                </button>
                            </Link>
                        </div> 
                      </section>
                      <section className="content mt-5 mb-5 text-dark" >
                        <section className="content text-dark mt-2">
                            <div className="container">
                                <div className="defaultCard mb-5 pb-5">
                                    <div className="defaultCardHeader">
                                        <div className="pull-left">
                                            <i className="fa fa-users bg-r" aria-hidden="true"></i>
                                            <span className="bolder-3 bg-r">Manage Exams Data</span>
                                        </div>
                                    </div>
                                    <h3 className="title1 text-center text-nowrap"><b>Enter Exam Details</b></h3>
                                    <form className="form-group" onSubmit={HandleFormData} name="form" autoComplete="off" method="POST" style={{ margin: "6px 12px" }}>
                                        <div className="row">
                                            <div className="col-md-4 col-sm-12 col-lg-4 col-xs-12">
                                                <label htmlFor="Department" className='input-label'>Department:*</label>
                                                <select name="department" className={`form-control w-100 ${formErrors.department ? 'is-invalid' : ''}`}  defaultValue="" onChange={handleInputChange}>
                                                    <option value="">--Empty--</option>
                                                    <option key={dep.id} value={dep.id}>{dep.departmentName} </option>
                                                </select>
                                                {formErrors.department && <div className="invalid-feedback">{formErrors.department}</div>}
                                            </div>
                                            <div className="col-md-4 col-sm-12 col-lg-4 col-xs-12">
                                                <label htmlFor="Class" className='input-label'>Class:*</label>
                                                <select name="class"  className={`form-control w-100 ${formErrors.class ? 'is-invalid' : ''}`}onChange={HandleClassChanges}>
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
                                                <select name="semester"  className={`form-control w-100 ${formErrors.semester ? 'is-invalid' : ''}`}onChange={handleSelectSemester}>
                                                    <option value="">{ss ? '--Select--' : '--Empty--'}</option>
                                                    {isSemester.map((semester) => (
                                                        <option key={semester.id} value={semester.id}>
                                                            {semester.title}
                                                        </option>
                                                    ))}
                                                </select>
                                                {formErrors.semester && <div className="invalid-feedback">{formErrors.semester}</div>}
                                            </div>
                                            <div className="col-md-3 col-sm-12 col-lg-3 col-xs-12">
                                                <label htmlFor="Course" className='input-label'>Course:*</label>
                                                <select name="courseId"  className={`form-control w-100 ${formErrors.course ? 'is-invalid' : ''}`} onChange={handleSelectCourse}>
                                                    <option value="">{ssc ? '--Select--' : '--Empty--'}</option>
                                                    {isCourse.map((course) => (
                                                        <option key={course.id} value={course.id}>
                                                            {course.courseTitle}
                                                        </option>
                                                    ))}
                                                </select>
                                                {formErrors.course && <div className="invalid-feedback">{formErrors.course}</div>}
                                            </div>
                                            <div className="col-md-3 col-sm-12 col-lg-3 col-xs-12">
                                                <label className='input-label' htmlFor="name">Subject Name:*</label> 
                                                <input id="name" name="name" placeholder="Enter Exam Title" defaultValue={apiData.subjectName} className="form-control w-100    input-md" type="text" readOnly/>
                                            </div>
                                            <div className="col-md-3 col-sm-12 col-lg-3 col-xs-12">
                                                <label className='input-label' htmlFor="name">Due Date:*</label> 
                                                <input id="duedate" name="duedate" className={`form-control w-100 ${formErrors.duedate ? 'is-invalid' : ''}`} value={apiData.duedate} type="date" onChange={handleInputFields}/>
                                                {formErrors.duedate && <div className="invalid-feedback">{formErrors.duedate}</div>}
                                            </div>
                                            <div className="col-md-3 col-sm-12 col-lg-3 col-xs-12">
                                                <label className='input-label' htmlFor="total">Total Question:*</label>
                                                <input id="total" name="totaltNumberQuestions"  placeholder="Enter total number of questions" className={`form-control w-100 ${formErrors.totaltNumberQuestions ? 'is-invalid' : ''}`} type="number" value={apiData.totaltNumberQuestions} step="2" onChange={handleInputFields}/>
                                                {formErrors.totaltNumberQuestions && <div className="invalid-feedback">{formErrors.totaltNumberQuestions}</div>}
                                            </div>
                                            <div className="col-md-4 col-sm-12 col-lg-4 col-xs-12">
                                                <label className='input-label' htmlFor="appt-time">Set StartTime: </label>
                                                <input className={`form-control w-100 ${formErrors.startingTime ? 'is-invalid' : ''}`} type="time" name="startingTime" value={startTime} step="2" onChange={handleStartTimeChange} />
                                                {formErrors.startingTime && <div className="invalid-feedback">{formErrors.startingTime}</div>}
                                            </div>
                                            <div className="col-md-4 col-sm-12 col-lg-4 col-xs-12">
                                                <label className='input-label' htmlFor="appt-time">Set EndTime: </label>
                                                <input className={`form-control w-100 ${formErrors.endingTime ? 'is-invalid' : ''}`} type="time" name="endingTime" value={endTime} step="2" onChange={handleEndTimeChange}/>
                                                {formErrors.endingTime && <div className="invalid-feedback">{formErrors.endingTime}</div>}
                                            </div>
                                            <div className="col-md-4 col-sm-12 col-lg-4 col-xs-12">
                                                <label className='input-label' htmlFor="duration">Duration Time:*</label> 
                                                <input id="duration" name="duration" defaultValue={duration} className="form-control w-100    input-md" type="text" readOnly/>
                                            </div>   
                                        </div>
                                            
                                        <div className="col-md-12 "><br/>
                                            <button className="btn btn-primary Contiunebtn pull-right" onClick={HandleFormData} type="submit" style={{ width: "50%" }}>Contiune</button>
                                        </div>
                                    </form>
                                </div>
                            </div>  
                        </section>
                    </section>
                </div>
              </>
          )}
      </>
  )
}

