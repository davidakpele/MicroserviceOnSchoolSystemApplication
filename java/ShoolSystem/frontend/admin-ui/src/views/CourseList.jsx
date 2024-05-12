/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import $ from 'jquery';
import DataTable from 'datatables.net-dt';
import 'datatables.net-dt/css/jquery.dataTables.css'
import {useEffect, useRef, useState } from 'react';
import ApiServices from "../services/ApiServices";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Link } from "react-router-dom"
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'select2';
import 'select2/dist/css/select2.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import HeaderNav from './components/Header/Nav/HeaderNav';
import Aside from './components/Header/Menu/Aside';

const CourseList = (props) => {
    const tableRef = useRef([]);
    const [show, setShow] = useState(false);
    const [showEditModal, setEditModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [classData, setClassData] = useState([]);
    const [semesterdata, setSemesterData] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [showAdditionalFields, setShowAdditionalFields] = useState(true);
    const [showEditForm, setShowEditForm] = useState(false);
    const [classApiData, setClassApiData] = useState({
        id: '',
        title: '',
        CourseCode: '',
        CourseUnit:'',
    });
    const [creationData, setCreationData] = useState({
        id:'',
        Department: '',
        Class: '',
        Semester: '',
        CourseCode: '',
        CourseUnit: '',
        CourseName:'',
        CourseStatus:'',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ApiServices.getAllCourses();
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
        // Initialize DataTable when the component mounts
        $(tableRef.current).DataTable();
        // CleanUp when the component unmounts
        return () => {
        // Destroy DataTable to avoid memory leaks
        $(tableRef.current).DataTable().destroy(true);
        };
    }, []);
    
    useEffect(() => {
        const handleResize = () => {
        setShowAdditionalFields(window.innerWidth < 1165);
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
  
    const handleCheckboxChange = (event) => {
        $('#iz').hide();
        const { id } = event.target;
        let count = 0;
        if (id === 'chk_all') {
            let inputs = $(".checkboxid");
            let boolx = [];
            for (let i = 0; i < inputs.length; i++) {
            let type = inputs[i].getAttribute("type");
            if (type === "checkbox") {
            if (event.target.checked) {
                count++;
                $('#iz').show();
                boolx.push(inputs[i].value);
                inputs[i].checked = true;
            } else {
                $('#iz').hide();
                inputs[i].checked = false;
            }
            }
        }
        document.getElementById("deletebadge").innerHTML = count;
        const element = document.getElementById('delete__Btn');
        element.addEventListener("click", () => { 
            Swal.fire({
            title: "Are you sure?",
            text: 'You will not be able to recover this record!',
            icon: 'warning',
            type: "question",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            background: '#fff',
            backdrop: `rgba(0,0,123,0.4)`,
            confirmButtonText: 'Yes, Delete!',
            // using theN & done promise callback
            }).then(async(result) => {
            if (result.isConfirmed) {
                // call your delete api
               const response = await ApiServices.DeleteCourseById({ "id": boolx })
                if (response == 200) {
                    toast.success("Successfully Deleted.");
                    setTimeout(() => {
                        window.location.reload(true);
                    }, 1000);
                } else {
                    toast.warning("Something went wrong.")
                }
            }
            });
        })
        }
    };

    const handleCheckBoxChangleSingle = () =>{
      $('#iz').hide();
      let items = document.querySelectorAll('.checkboxid');
      let StringData = [];
      let count = 0;
      for (var i in items) {
        if (items[i].checked) {
          count++;
        }
      }
      if (count == 1) {
        $('#iz').show();
        for (i = 0; i < items.length; i++) {
          if (items[i].checked) {
            StringData.push(items[i].value);
            document.getElementById("deletebadge").innerHTML = count;
          }
        }
      } else if (count > 1) {
        $('#iz').show();
        for (i = 0; i < items.length; i++) {
          if (items[i].checked) {
            StringData.push(items[i].value);
            document.getElementById("deletebadge").innerHTML = count;
          }
        }
      } else {
        $('#iz').hide();
        items[i].checked = false;
        var checkbox = document.getElementById("chk_all");
        checkbox.checked = false;
      }
        const element = document.getElementById('delete__Btn')
        element.addEventListener("click", () => {
            Swal.fire({
            title: "Are you sure?",
            text: 'You will not be able to recover this record!',
            icon: 'warning',
            type: "question",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            background: '#fff',
            backdrop: `rgba(0,0,123,0.4)`,
            confirmButtonText: 'Yes, Delete!',
            // using theN & done promise callback
            }).then(async(result) => {
            if (result.isConfirmed) {
                // call your delete api
                const response = await ApiServices.DeleteCourseById({ "id": StringData })
                if (response == 200) {
                    toast.success("Successfully Deleted.");
                    setTimeout(() => {
                        window.location.reload(true);
                    }, 1000);
                } else {
                    toast.warning("Something went wrong.")
                }
            }
            }); 
        });
    }

    const OpenHandleEditCourseModal = async (id) => {
        const response = await ApiServices.getCourseById(id);
        const getDepartmentList = await ApiServices.getAllDepartment();
        const getClassList = await ApiServices.getAllClasses();
        const getSemesterList =await ApiServices.getAllSemesters();
        if (response.status == 200) {
            setShowEditForm(true);
            setEditModal(true)
            setCreationData((prevSemester) => ({
                ...prevSemester,
                id: response.data.id,
                Department: response.data.departmentId,
                Class: response.data.classId,
                Semester: response.data.semesterId,
                CourseCode: response.data.courseCode,
                CourseUnit: response.data.courseUnit,
                CourseName:response.data.courseTitle,
                CourseStatus:response.data.courseStatus,
            }));
            setDepartmentData(getDepartmentList.data)
            setClassData(getClassList.data);
            setSemesterData(getSemesterList.data)
            
        }
    }

    const validateEditCourseData = (creationData) => { 
        let errors = {};
       if (!creationData.Department) {
            errors.Department = 'Department field is required';
        }
        if (!creationData.Class) {
            errors.Class = 'Class field is required';
        }
        if (!creationData.Semester) {
            errors.Semester = 'Semester field is required';
        }
        if (!creationData.CourseCode) {
            errors.CourseCode = 'Course Code field is required';
        }
        if (!creationData.CourseUnit) {
            errors.CourseUnit = 'Course Unit field is required';
        }
        if (!creationData.CourseName) {
            errors.CourseName = 'Course Name field is required';
        }
        if (!creationData.CourseStatus) {
            errors.CourseStatus = 'Course Status field is required';
        }
        
        if (creationData.Department && creationData.Department != ""
            && creationData.Class && creationData.Class != ""
            && creationData.Semester && creationData.Semester != ""
            && creationData.CourseCode && creationData.CourseCode!=""
            && creationData.CourseUnit && creationData.CourseUnit !=""
            && creationData.CourseName && creationData.CourseName !=""
            && creationData.CourseStatus && creationData.CourseStatus !="")  {
            const data = {"id": creationData.id, "departmentId":creationData.Department, "classId":creationData.Class, "semesterId":creationData.Semester, "courseCode": creationData.CourseCode, "courseTitle":creationData.CourseName, "courseUnit":creationData.CourseUnit , "courseStatus":creationData.CourseStatus}
            FireEditSave({ data })
        }
        return errors;
    }

    const HandleSaveEditCourseData = (event) => {
        event.preventDefault()
        const errors = validateEditCourseData(creationData);
        setFormErrors(errors);
    }

    const HandleDeleteCourse = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: 'You will not be able to recover this record!',
            icon: 'warning',
            type: "question",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            background: '#fff',
            backdrop: `rgba(0,0,123,0.4)`,
            confirmButtonText: 'Yes, Delete!',
            // using theN & done promise callback
            }).then( async(result) => {
                if (result.isConfirmed) {
                    // call your delete api
                    const response = await ApiServices.DeleteCourseById({ "id": [id] })
                    if (response == 200) {
                        toast.success("Successfully Deleted.");
                        setTimeout(() => {
                            window.location.reload(true);
                        }, 1000);
                    } else {
                        toast.warning("Something went wrong.")
                    }
                }
            });
    }

    const CloseCreateNewCourseModal = () => {
        setShow(false);
        setFormErrors("")
        setCreationData("")
    }

    const handleClose = () => {
        setEditModal(false);
        setShowEditForm(false);
        setFormErrors("")
    }

    const OpenCreateNewCourseModal = async () => {
        setCreationData("")
        const getDepartmentList = await ApiServices.getAllDepartment();
        const getClassList = await ApiServices.getAllClasses();
        const getSemesterList =await ApiServices.getAllSemesters();

        setDepartmentData(getDepartmentList.data)
        setClassData(getClassList.data);
        setSemesterData(getSemesterList.data)
        setShow(true);
    }

    const HandleCreateNewCourse = (event) => {
        event.preventDefault()
        const errors = validateCreateClassData(creationData);
        setFormErrors(errors);
    }

    const validateCreateClassData= (creationData)=> {
        let errors = {};
       
        if (!creationData.Department) {
            errors.Department = 'Department field is required';
        }
        if (!creationData.Class) {
            errors.Class = 'Class field is required';
        }
        if (!creationData.Semester) {
            errors.Semester = 'Semester field is required';
        }
        if (!creationData.CourseCode) {
            errors.CourseCode = 'Course Code field is required';
        }
        if (!creationData.CourseUnit) {
            errors.CourseUnit = 'Course Unit field is required';
        }
        if (!creationData.CourseName) {
            errors.CourseName = 'Course Name field is required';
        }
        if (!creationData.CourseStatus) {
            errors.CourseStatus = 'Course Status field is required';
        }
        
        if (creationData.Department && creationData.Department != ""
            && creationData.Class && creationData.Class != ""
            && creationData.Semester && creationData.Semester != ""
            && creationData.CourseCode && creationData.CourseCode!=""
            && creationData.CourseUnit && creationData.CourseUnit !=""
            && creationData.CourseName && creationData.CourseName !=""
            && creationData.CourseStatus && creationData.CourseStatus !="")  {
            const data = {"departmentId":creationData.Department, "classId":creationData.Class, "semesterId":creationData.Semester, "courseCode": creationData.CourseCode, "courseTitle":creationData.CourseName, "courseUnit":creationData.CourseUnit , "courseStatus":creationData.CourseStatus}
            FireSendCreation({ data })
        }
        return errors;
    }

    const handleCreateSelectChange = (event) => {
        const value = event.target.value;
        setCreationData({...creationData, [event.target.name] : value});
    }

    const FireSendCreation = async ({data}) => {
        let errors = {};
        const resutlt = await ApiServices.saveNewCourse({ data })
        if (resutlt.response !=null && resutlt.response.status != 200) {
            errors.title = resutlt.response.data.error;
            setFormErrors(errors);
            } else {
            toast.success("Successful Created.!");
            setTimeout(() => {
                window.location.reload(true);
            }, 1000);
        }
    }

    const FireEditSave = async ({data}) => {
        let errors = {};
        const resutlt = await ApiServices.saveEditCourse({ data })
        if (resutlt.response !=null && resutlt.response.status != 200) {
            errors.title = resutlt.response.data.error;
            setFormErrors(errors);
            } else {
            toast.success("Successful Updated.!");
            setTimeout(() => {
                window.location.reload(true);
            }, 1000);
        }
    }

    const OnChangeEditInput = (e) => {
        const { name, value } = e.target;
        // Updating the studentData state with the edited value
        setCreationData(prevData => ({
        ...prevData,
        [name]: value,
        }));
    };
    
    const columns = [
        { header: 'S/N', accessorKey: 'id', Cell: ({ row }) => <div>{row.index + 1}</div> },
        { accessorKey: "deleteAll",
            header:<label className="mcui-checkbox"><input type="checkbox"  id="chk_all" onChange={handleCheckboxChange} /> <div><svg className="mcui-check" viewBox="-2 -2 35 35" aria-hidden="true"><title>checkmark-circle</title><polyline points="7.57 15.87 12.62 21.07 23.43 9.93" /></svg></div></label>,
            Cell: ({ row }) => (
            <label className="checkbox-container"><input type="checkbox" className="checkboxid" name="checkuser[]" value={row.original.id} onChange={handleCheckBoxChangleSingle}/><span className="checkmark"></span></label>
            )
        },
        {header: 'Course~Code', accessorKey: 'courseCode'},
        {header: 'Course~Name', accessorKey: 'courseTitle'},
        {header: 'Course~Unit', accessorKey: 'courseUnit'},
        {header: 'Course~Status', accessorKey: 'courseStatus'},
        {header: 'Actions', accessorKey: 'checkbox',
        Cell: ({ row }) => (
        <div className="flex d-flex" style={{ display: 'flex' }}>
            <div className="text-center">
                <button onClick={() =>OpenHandleEditCourseModal(row.original.id)} style={{width:'30px', alignItems:'center', textAlign:'center', borderRadius: '3px',boxShadow: 'none',border: '1px solid transparent', background:'#0073b7', }}>
                    <i className="fa fa-pencil" style={{marginLeft:'3px', color:'#fff'}}></i>
                </button>&nbsp;
                <button onClick={() =>HandleDeleteCourse(row.original.id)} style={{width:'30px', alignItems:'center', textAlign:'center', borderRadius: '3px',boxShadow: 'none',border: '1px solid transparent', background:'#dd4b39'}}>
                    <i className="fa fa-trash" style={{marginLeft:'3px', color:'#fff'}}></i>
                </button>
            </div>
        </div>
    ),
    },
    ];
 
  const table = useMaterialReactTable({ data, columns });
    return (
      <>
    <ToastContainer />
      <HeaderNav />
      <Aside/>
      
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
                <section className="content  text-dark">
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-home"></i> Home </a></li>
                        <li className="active">Application </li>
                        <li className="active">Course List</li>
                    </ol>
                    <div className="container-fluid">
                      <hr className="border-dark"/>
                        <div className="row">
                            <div className="col-12 col-sm-12 col-md-12">
                                <section className="content container-fluid">
                                    <div className="box">
                                        <div className="box-header with-border">
                                            <h3 className="box-title">Master Student  Data</h3>
                                            <div className="box-tools pull-right">
                                                <button type="button" className="btn btn-box-tool" data-widget="collapse">
                                                    <i className="fa fa-minus"></i>
                                                </button>
                                            </div>
                                            <div className="box-body">
                                                <div className="mt-2 mb-4">
                                                    <button onClick={OpenCreateNewCourseModal} type="button" className="btn btn-sm bg-blue btn-flat"><i className="fa fa-plus"></i> Add Data</button>
                                                    <div className="pull-right insiderBox" id="iz" style={{ display: "none" }}>
                                                        <button id="delete__Btn" title="Delete This Professor" className="mr-4 btn btn-sm btn-danger btn-flat" type="button"><i className="fa fa-trash"></i> Delete</button>
                                                        <button disabled="disabled" className="btn btn-sm" style={{ backgroundColor: "#000000", borderRadius: "25px" }}><span className="pull-left" id="deletebadge" style={{ color: "#fff" }}>Selected</span></button>
                                                    </div>
                                                </div>
                                                <div className={showAdditionalFields ? "":"d-flex" }>
                                                    <div className="col-md-12">
                                                        <MaterialReactTable table={table} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                            
                                    <Modal show={show} onHide={CloseCreateNewCourseModal} animation={false} {...props} size="lg" aria-labelledby="contained-modal-title-vcenter">
                                        <Modal.Header closeButton>
                                            <Modal.Title>Add New Data</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <form method="post" onSubmit={HandleCreateNewCourse} autoComplete='off'>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <Form.Label htmlFor="department">Department::*</Form.Label>
                                                        <Form.Select aria-label="Department" name="Department" defaultValue={creationData.Department} onChange={handleCreateSelectChange} className={`form-control ${formErrors.Department ? 'is-invalid' : ''}`} >
                                                            <option value={''}>-Select-</option>
                                                            {departmentData.map((departmentItem) => (
                                                                <option key={departmentItem.id} value={departmentItem.id}>
                                                                {departmentItem.departmentName}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                        {formErrors.Department && <div className="invalid-feedback">{formErrors.Department}</div>}
                                                    </div>
                                                    <div className="col-md-6 col-sm-12 col-xs-12">
                                                        <Form.Label htmlFor="className">Class::*</Form.Label>
                                                        <Form.Select aria-label="Class" name="Class" defaultValue={creationData.Class}  onChange={handleCreateSelectChange} className={`form-control ${formErrors.Class ? 'is-invalid' : ''}`} >
                                                            <option value={''}>-Select-</option>
                                                            {classData.map((classItem) => (
                                                                <option key={classItem.id} value={classItem.id}>
                                                                {classItem.title}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                        {formErrors.Class && <div className="invalid-feedback">{formErrors.Class}</div>}
                                                    </div>
                                                    <div className="col-md-6 col-sm-12 col-xs-12">
                                                        <Form.Label htmlFor="semester">Semester:*</Form.Label>
                                                        <Form.Select aria-label="Semester" name="Semester" defaultValue={creationData.Semester}  onChange={handleCreateSelectChange} className={`form-control ${formErrors.Semester ? 'is-invalid' : ''}`} >
                                                            <option value={''}>-Select-</option>
                                                            {semesterdata.map((semesterItem) => (
                                                                <option key={semesterItem.id} value={semesterItem.id}>
                                                                {semesterItem.title}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                        {formErrors.Semester && <div className="invalid-feedback">{formErrors.Semester}</div>}
                                                    </div>
                                                    <div className="col-md-6 col-sm-12 col-xs-12">
                                                        <Form.Label htmlFor="Course Code">Course Code:*</Form.Label>
                                                        <Form.Control type="text" id="CourseCode" name='CourseCode' aria-describedby="CourseCode" defaultValue={creationData.CourseCode} className={`form-control ${formErrors.CourseCode ? 'is-invalid' : ''}`} onChange={(e)=>OnChangeEditInput(e)}/>
                                                        {formErrors.CourseCode && <div className="invalid-feedback">{formErrors.CourseCode}</div>}
                                                    </div>
                                                    <div className="col-md-6 col-sm-12 col-xs-12">
                                                        <Form.Label htmlFor="Course Name">Course Name:*</Form.Label>
                                                        <Form.Control type="text" id="CourseName" name='CourseName' aria-describedby="CourseName" defaultValue={creationData.CourseName} className={`form-control ${formErrors.CourseName ? 'is-invalid' : ''}`} onChange={(e)=>OnChangeEditInput(e)}/>
                                                        {formErrors.CourseName && <div className="invalid-feedback">{formErrors.CourseName}</div>}
                                                    </div>
                                                    <div className="col-md-6 col-sm-12 col-xs-12">
                                                        <Form.Label htmlFor="CourseUnit">Course Unit:*</Form.Label>
                                                        <Form.Control type="text" id="CourseUnit" name='CourseUnit' aria-describedby="CourseUnit" defaultValue={creationData.CourseUnit} className={`form-control ${formErrors.CourseUnit ? 'is-invalid' : ''}`} onChange={(e)=>OnChangeEditInput(e)}/>
                                                        {formErrors.CourseUnit && <div className="invalid-feedback">{formErrors.CourseUnit}</div>}       
                                                    </div>
                                                    <div className="col-md-6 col-sm-12 col-xs-12">
                                                        <Form.Label htmlFor="CourseStatus">Class Status:*</Form.Label>  
                                                        <Form.Select id="CourseStatus" name="CourseStatus" defaultValue={creationData.CourseStatus}  onChange={handleCreateSelectChange} className={`form-control ${formErrors.CourseStatus ? 'is-invalid' : ''}`} >
                                                            <option value={''}>-Select-</option>
                                                            <option value={'C'}>C</option>
                                                            <option value={'E'}>E</option>
                                                        </Form.Select>
                                                        {formErrors.CourseStatus && <div className="invalid-feedback">{formErrors.CourseStatus}</div>}       
                                                    </div>
                                                </div>
                                            </form>   
                                        </Modal.Body>                
                                        <Modal.Footer>
                                            <Button variant="primary" onClick={HandleCreateNewCourse}>Save Now</Button>
                                        </Modal.Footer>
                                    </Modal>
                                    
                                    {showEditForm && (
                                        <>
                                            <Modal show={showEditModal} onHide={handleClose}  animation={false} {...props} size="lg" aria-labelledby="contained-modal-title-vcenter">
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Add New Data</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <form method="post" onSubmit={HandleSaveEditCourseData}>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <Form.Label htmlFor="department">Department::*</Form.Label>
                                                                <Form.Select aria-label="Department" name="Department" defaultValue={creationData.Department} onChange={handleCreateSelectChange} className={`form-control ${formErrors.Department ? 'is-invalid' : ''}`} >
                                                                    <option value={''}>-Select-</option>
                                                                    {departmentData.map((departmentItem) => (
                                                                        <option key={departmentItem.id} value={departmentItem.id}>
                                                                        {departmentItem.departmentName}
                                                                        </option>
                                                                    ))}
                                                                </Form.Select>
                                                                {formErrors.Department && <div className="invalid-feedback">{formErrors.Department}</div>}
                                                            </div>
                                                            <div className="col-md-6 col-sm-12 col-xs-12">
                                                                <Form.Label htmlFor="className">Class::*</Form.Label>
                                                                <Form.Select aria-label="Class" name="Class" defaultValue={creationData.Class}  onChange={handleCreateSelectChange} className={`form-control ${formErrors.Class ? 'is-invalid' : ''}`} >
                                                                    <option value={''}>-Select-</option>
                                                                    {classData.map((classItem) => (
                                                                        <option key={classItem.id} value={classItem.id}>
                                                                        {classItem.title}
                                                                        </option>
                                                                    ))}
                                                                </Form.Select>
                                                                {formErrors.Class && <div className="invalid-feedback">{formErrors.Class}</div>}
                                                            </div>
                                                            <div className="col-md-6 col-sm-12 col-xs-12">
                                                                <Form.Label htmlFor="semester">Semester:*</Form.Label>
                                                                <Form.Select aria-label="Semester" name="Semester" defaultValue={creationData.Semester}  onChange={handleCreateSelectChange} className={`form-control ${formErrors.Semester ? 'is-invalid' : ''}`} >
                                                                    <option value={''}>-Select-</option>
                                                                    {semesterdata.map((semesterItem) => (
                                                                        <option key={semesterItem.id} value={semesterItem.id}>
                                                                        {semesterItem.title}
                                                                        </option>
                                                                    ))}
                                                                </Form.Select>
                                                                {formErrors.Semester && <div className="invalid-feedback">{formErrors.Semester}</div>}
                                                            </div>
                                                            <div className="col-md-6 col-sm-12 col-xs-12">
                                                                <Form.Label htmlFor="Course Code">Course Code:*</Form.Label>
                                                                <Form.Control type="text" id="CourseCode" name='CourseCode' aria-describedby="CourseCode" defaultValue={creationData.CourseCode} className={`form-control ${formErrors.CourseCode ? 'is-invalid' : ''}`} onChange={(e)=>OnChangeEditInput(e)}/>
                                                                {formErrors.CourseCode && <div className="invalid-feedback">{formErrors.CourseCode}</div>}
                                                            </div>
                                                            <div className="col-md-6 col-sm-12 col-xs-12">
                                                                <Form.Label htmlFor="Course Name">Course Name:*</Form.Label>
                                                                <Form.Control type="text" id="CourseName" name='CourseName' aria-describedby="CourseName" defaultValue={creationData.CourseName} className={`form-control ${formErrors.CourseName ? 'is-invalid' : ''}`} onChange={(e)=>OnChangeEditInput(e)}/>
                                                                {formErrors.CourseName && <div className="invalid-feedback">{formErrors.CourseName}</div>}
                                                            </div>
                                                            <div className="col-md-6 col-sm-12 col-xs-12">
                                                                <Form.Label htmlFor="CourseUnit">Course Unit:*</Form.Label>
                                                                <Form.Control type="text" id="CourseUnit" name='CourseUnit' aria-describedby="CourseUnit" defaultValue={creationData.CourseUnit} className={`form-control ${formErrors.CourseUnit ? 'is-invalid' : ''}`} onChange={(e)=>OnChangeEditInput(e)}/>
                                                                {formErrors.CourseUnit && <div className="invalid-feedback">{formErrors.CourseUnit}</div>}       
                                                            </div>
                                                            <div className="col-md-6 col-sm-12 col-xs-12">
                                                                <Form.Label htmlFor="CourseStatus">Class Status:*</Form.Label>  
                                                                <Form.Select id="CourseStatus" name="CourseStatus" defaultValue={creationData.CourseStatus}  onChange={handleCreateSelectChange} className={`form-control ${formErrors.CourseStatus ? 'is-invalid' : ''}`} >
                                                                    <option value={''}>-Select-</option>
                                                                    <option value={'C'}>C</option>
                                                                    <option value={'E'}>E</option>
                                                                </Form.Select>
                                                                {formErrors.CourseStatus && <div className="invalid-feedback">{formErrors.CourseStatus}</div>}       
                                                            </div>
                                                        </div>
                                                    </form>   
                                                </Modal.Body>                
                                                <Modal.Footer>
                                                    <Button variant="primary" onClick={HandleSaveEditCourseData}>Save Now</Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </>
                                    )}
                                </section> 
                            </div>
                        </div>
                    </div>
                </section>
            </div>
           
            </>
        )
    }
    </>
  )
}

export default CourseList
