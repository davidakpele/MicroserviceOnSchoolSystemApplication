/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import DataTable from 'datatables.net-dt';
import 'datatables.net-dt/css/jquery.dataTables.css'
import $ from 'jquery';
import {useMemo, useEffect, useRef, useState } from 'react';
import ApiServices from "../services/ApiServices";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Link } from "react-router-dom"
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import userP from '../assets/img/admin.png'
import Aside from "./components/Header/Menu/Aside";
import HeaderNav from "./components/Header/Nav/HeaderNav";
import { useNavigate } from 'react-router-dom';


const Students = () => {
  const tableRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showAdditionalFields, setShowAdditionalFields] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isCreateNewProfessor, setIsCreateNewProfessor] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const [newUsersDetails, setnewUsersDetails] = useState({
    application: '', faculty: '',
    department: '', program: '',
    entrylevel: '', dob: '',
    gender:'', telephone:'',
    firstname: '', surname: '',
    email: '', nationalIdentificationNumber:'', relationshipstatus:''
  });
  const EmailRegaxValidation = (/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
  const [studentData, setStudentData] = useState({
    id: '',
    matricNumber: '',
    email: '',
    records: [
      {
        id:'',
        matricNumber:'',
        nationalIdentificationNumber: '',
        firstname: '',
        surname: '',
        dateOfBirth: '',
        gender: '',
        email: '',
        relationShipStatus: '',
        mobile: '',
      },
    ],
  });
  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await ApiServices.FetchAllStudents();
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
    // Cleanup when the component unmounts
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
          text: 'You will not be able to recover this student record!',
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
            const processDelete = await ApiServices.DeleteStudents({ "id": boolx });
            if (processDelete ==200) {
              toast.success("Successful Deleted.");
              setTimeout(() => {
                window.location.reload(true);
              }, 1000);
            } else {
              toast.error("Somethin went wrong in process student delete.");
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
          text: 'You will not be able to recover this student record!',
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
            const processDelete = await ApiServices.DeleteStudents({ "id": StringData });
            if (processDelete ==200) {
              toast.success("Successful Deleted.");
              setTimeout(() => {
                window.location.reload(true);
              }, 1000);
            } else {
              toast.error("Somethin went wrong in process student delete.");
            }
          }
        }); 
    });
  }
  
  const OpenStudentDetails = (id) => {
    navigate("/admin/student/view/"+id)
  }

  const handleInput = (e) => {
    const inputValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
      // Format the input as '1234 3444 6757 6757'
    const formattedInput = inputValue.replace(/(\d{4})/g, '$1 ').trim();
    // Limit the input to a maximum of 16 digits
    const limitedInput = formattedInput.slice(0, 19);
    setnewUsersDetails({
      ...newUsersDetails,
      nationalIdentificationNumber: limitedInput,
    });
  };

 
  const columns = useMemo(
    () => [
        {
        id: "rowNumber",
        header: "S/N",
        Cell: ({ row }) => <div>{row.index + 1}</div>
      },
       {
        accessorKey: "deleteAll",
        header:<label className="mcui-checkbox"><input type="checkbox"  id="chk_all" onChange={handleCheckboxChange} /> <div><svg className="mcui-check" viewBox="-2 -2 35 35" aria-hidden="true"><title>checkmark-circle</title><polyline points="7.57 15.87 12.62 21.07 23.43 9.93" /></svg></div></label>,
        Cell: ({ row }) => (
           <label className="checkbox-container"><input type="checkbox" className="checkboxid" name="checkuser[]" value={row.original.id} onChange={handleCheckBoxChangleSingle}/><span className="checkmark"></span></label>
        )
      },
      { 
        accessorKey: "name",
        header: "Name",
          Cell: ({ row }) => (
          <>
            {row.original.records.map((record, index) => (
              <div key={index}>
                <div>{record.firstname+' '+record.surname}</div>
              </div>
            ))}
          </>
        ),
      },
      {
        accessorKey: "image",
        header: "Image",
          Cell: ({ row }) => (
          <>
            {row.original.records.map((record, index) => (
              <div key={index}>
                <div><img src={userP} alt={record.firstname + ' ' + record.surname} className="rounded img-thumbnail" style={{ width: "40px", height: "40.7px" }} /></div>
              </div>
            ))}
          </>
        ),
      },
      {
        accessorKey: "matricNumber",
        header: "Matric Number"
      },
      {
        accessorKey: "email",
        header: "Email",
        Cell: ({ row }) => (
          <>
            {row.original.records.map((record, index) => (
              <div key={index}>
                <div>{record.email}</div>
              </div>
            ))}
          </>
        ),
      },
      {
        id: "Actions",
        header: "Actions",
        Cell: ({ row }) => (
          <>
           <div className="flex d-flex" style={{ display: 'flex' }}>
            <div className="text-center">
                <button onClick={() =>openEditModal(row.original.id)} style={{width:'30px', alignItems:'center', textAlign:'center', borderRadius: '3px',boxShadow: 'none',border: '1px solid transparent', background:'#0073b7', }}>
                    <i className="fa fa-pencil" style={{marginLeft:'3px', color:'#fff'}}></i>
                </button>&nbsp;
                <button onClick={() =>OpenStudentDetails(row.original.id)} style={{width:'30px', alignItems:'center', textAlign:'center', borderRadius: '3px',boxShadow: 'none',border: '1px solid transparent', background:'green'}}>
                    <i className="fa fa-eye" style={{marginLeft:'3px', color:'#fff'}}></i>
                </button>
            </div>
        </div>
            
          </>
        )
      }
    ],
    []
  );
 
  const table = useMaterialReactTable({
      data,
      columns
  });

  const HandleCreateSubmit = (e) => {
    e.preventDefault();
    // Perform your form validation here
    const errors = validateEditFormData(studentData);
    setFormErrors(errors);
  }
  
  const validateEditFormData = (data) => {
    
    let errors = {};
    var id = data.id;
    if (!data.Firstname) {
        errors.Firstname = 'Firstname is required';
    }

    if (!data.Surname) {
        errors.Surname = 'Surname is required';
    }

    if (!data.Email) {
        errors.Email = 'Email is required';
    }

    if (!data.Telephone_No) {
        errors.Telephone_No = 'Mobile Number is required';
    }

    if (!data.Date_of_Birth) {
        errors.Date_of_Birth = 'Date of birth is required';
    }

    if (!data.Gender) {
        errors.Gender = 'Gender is required';
    }

    if (!data.Relationship_sts) {
        errors.Relationship_sts = 'Relationship Status is required';
    }

    if (!data.nationalIdentificationNumber) {
        errors.nationalIdentificationNumber = 'National Identification Number is required';
    }

    if (!data.Blood_Type) {
        errors.Blood_Type = 'Blood Type is required';
    }

    if (!data.Religion) {
        errors.Religion = 'Religion is required';
    }

    if (!data.Qualification) {
        errors.Qualification = 'Qualification is required';
    }

    if (!data.Address) {
        errors.Address = 'Address is required';
    }
    return errors;
  }

  const openAddNewModal = async () => {
    setIsCreateNewProfessor(true)
    setShowEditForm(false)
    setFormErrors(""); 
    setnewUsersDetails("")
  }

  const openEditModal = async(id) => {
    try {
      setIsCreateNewProfessor(false)
      const response = await ApiServices.FetchStudentById(id);
      const data = response.data; // Assuming the API response has the student data
      setLoading(false);
      // Update the state with the fetched student data
      setStudentData({
        id: data.id,
        matricNumber: data.matricNumber,
        nationalIdentificationNumber: data.records[0].nationalIdentificationNumber,
        surname: data.records[0].surname,
        firstname: data.records[0].firstname,
        email: data.records[0].email,
        mobile: data.records[0].mobile,
        dateOfBirth: data.records[0].dateOfBirth,
        gender: data.records[0].gender,
        relationShipStatus: data.records[0].relationShipStatus
      });
    } catch (error) {
      setLoading(false);
      console.error('Error fetching student data:', error);
    }
    setShowEditForm(true)
  }

  const HandleSubmitEditForm =async (event) => {
    event.preventDefault();
    if (studentData.firstname == null || studentData.firstname =="") {
      $('.error').html("<span>Please Enter Your Firstname.</span>")
      $('.errormsgContainer').show()
      return false;
    }
    if (studentData.surname == null || studentData.surname =="") {
      $('.error').html("<span>Please Enter Your Surname.</span>")
      $('.errormsgContainer').show()
      return false;
    }
    if (studentData.surname == studentData.firstname) {
      $('.error').html("<span>Unaccepted Data.. Please Surname can't be the same with your Othername.</span>")
      $('.errormsgContainer').show()
      return false
    }
    if (studentData.email == null || studentData.email =="") {
      $('.error').html("<span>Please Enter Your Email Address.</span>")
      $('.errormsgContainer').show()
      return false;
    }else if (studentData.email != "") {
      if (!EmailRegaxValidation.test(studentData.email)) {
        $('.error').show()
        $('.errormsgContainer').html("<span>Invalid email address..! Please enter a valid email address.*</span>");
        return false;
    }
    }
    if (studentData.mobile == null || studentData.mobile =="") {
      $('.error').html("<span>Please Enter Your Mobile Number.</span>")
      $('.errormsgContainer').show()
      return false;
    }
    if (studentData.dateOfBirth == null || studentData.dateOfBirth =="") {
      $('.error').html("<span>Please Provide Your Date Of Birth.</span>")
      $('.errormsgContainer').show()
      return false;
    }
    if (studentData.gender == null || studentData.gender =="") {
      $('.error').html("<span>Please Select Your Gender.</span>")
      $('.errormsgContainer').show()
      return false;
    }
    if (studentData.relationShipStatus == null || studentData.relationShipStatus =="") {
      $('.error').html("<span>Please Select Your Relationship Status.</span>")
      $('.errormsgContainer').show()
      return false;
    }
    $('.error').empty();
    $('.errormsgContainer').hide()
    await ApiServices.UpdateStudentProfile(
      {
      "id":studentData.id,
      "StudentAuthenticationInfo": { "email": studentData.email},
      "StudentRecordInfo": {
          "firstname": studentData.firstname, "surname": studentData.surname,
          "email": studentData.email, "mobile": studentData.mobile, "dateOfBirth": studentData.dateOfBirth,
          "gender": studentData.gender, "relationShipStatus": studentData.relationShipStatus
        },
      }, 
    ).then(function (response) {
      if (response==200) {
       toast.success("Successfully Updated.");
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      } else {
        toast.error("Something went wrong.");
      }
    }).catch(function (error) {
     toast.error("Something went wrong.");
    });

  }

  const CancelEditModalForm = () => {
    setShowEditForm(false)
  }
  
  const CancelCreateModalForm = () => {
    setIsCreateNewProfessor(false)
    setFormErrors(""); 
    setnewUsersDetails("")
  }

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Updating the studentData state with the edited value
    setStudentData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const OnChangeEditInput = (e) => {
    const { name, value } = e.target;
    setnewUsersDetails({...newUsersDetails, [name] : value});
  };
    
    // OnChange Fields state
  const handleInputChangeOnApplicationType = async (e) => {
      const value = e.target.value;
      setnewUsersDetails({ ...newUsersDetails, [e.target.name]: value });
      //Fetch Faculties based on Application Selected
      const id = value;
      try {
          if (id == null || id == "") {
            $('#Faculty').empty();
            $('#Faculty').append('<option value="">--Empty--</option>')
            $('#Program').empty();
            $('#Program').append('<option value="">--Empty--</option>')
            $('#Department').empty();
            $('#Department').append('<option value="">--Empty--</option>')
            $('#Entrylevel').empty();
            $('#Entrylevel').append('<option value="">--Empty--</option>')
            return false;
          }
          const getfacultyapi = await ApiServices.FetechFacultiesBaseOnSelectedApplicationId({ id });
          if (getfacultyapi.status == 200) {
              $('#Faculty').empty();
              $('#Faculty').append('<option value="">--Select--</option>')
              $('#Department').empty();
              $('#Department').append('<option value="">--Empty--</option>')
              getfacultyapi.data.data.forEach(function(element) {
                  $('#Faculty').append('<option value="' + element.id + '">' + element.facultyName + '</option>');
              });
              const getprogramsapi = await ApiServices.FetechProgramsBaseOnSelectedApplicationId({ id })
              if (getprogramsapi.status == 200) {
                  $('#Program').empty();
                  $('#Program').append('<option value="">--Select--</option>')
                  getprogramsapi.data.data.forEach(function(element) {
                      $('#Program').append('<option value="' + element.id + '">' + element.programName + '</option>');
                  });
              } else {
                  console.error('Something went wrong in fetching programs api\'s ');
              }
              const getentrylevelapis = await ApiServices.FetechEntryLevelBaseOnSelectedApplicationId({ id })
              if (getentrylevelapis.status == 200) {
                  if (getentrylevelapis.data == "") {
                      $('.EntryDevparent').removeClass('visible');
                      $('.EntryDevparent').addClass('hidden');
                  } else {
                      $('.EntryDevparent').removeClass('hidden');
                      $('.EntryDevparent').addClass('visible');
                      $('#Entrylevel').empty();
                      $('#Entrylevel').append('<option value="">--Select--</option>')
                      getentrylevelapis.data.forEach(function(element) {
                          $('#Entrylevel').append('<option value="' + element.entryLevelName + '">' + element.entryLevelName + '</option>');
                      });
                  }
              }
          } else {
              console.warn("Something went wrong in fetch Faculty api's ");
          }
      } catch (error) {
      // Handle errors
          console.error('Error :', error);
      }
  };

  const handleInputChangeOnFacultyField = async (event) => {
    const value = event.target.value;
    setnewUsersDetails({ ...newUsersDetails, [event.target.name]: value });
    if (value == null || value == "") {
      $('#Department').empty();
      $('#Department').append('<option value="">--Empty--</option>')
      return false;
    }
      try {
          const id = value;
          const getdepartmentapi = await ApiServices.FetechDepartmentBaseOnSelectedApplicationId({ id })
          if (getdepartmentapi.status ==200) {
              $('#Department').empty();
              $('#Department').append('<option value="">--Select--</option>')
              getdepartmentapi.data.data.forEach(function(element) {
                  $('#Department').append('<option value="' + element.id + '">' + element.departmentName + '</option>');
              });
          }
      } catch (error) {
          console.console.warn("Error in fetchinh Department Api's ");
      }
  };

  const handleInputChangeOnDepartmentField = (event) => {
      const value = event.target.value;
      setnewUsersDetails({...newUsersDetails, [event.target.name] : value});
  };

  const handleInputChangeOnProgramField = (event) => {
      const value = event.target.value;
      setnewUsersDetails({...newUsersDetails, [event.target.name] : value});
  };

  const handleInputChangeOnEntryLevelField = (event) => {
      const value = event.target.value;
      setnewUsersDetails({...newUsersDetails, [event.target.name] : value});
  };

  const handleInputChangeOnGenderOptions = (event) => {
    const value = event.target.value;
    setnewUsersDetails({...newUsersDetails, [event.target.name] : value});
  };

  const handleInputChangeOnRelationShipStatus = (event) => {
    const value = event.target.value;
    setnewUsersDetails({...newUsersDetails, [event.target.name] : value});
  };
  
  
  const saveNewStudentFormData = (event) => {
    event.preventDefault()
    const errors = validateNewStudentData(newUsersDetails);
    setFormErrors(errors); 
  
  }

  const validateNewStudentData = (newUsersDetails) => {
    let errors = {};
    if (!newUsersDetails.application) {
      errors.application = 'Application is required';
    }
    if (newUsersDetails.application ==2) {
      newUsersDetails.entrylevel ='Postgraduate'
    }
    if (!newUsersDetails.faculty) {
      errors.faculty = 'Faculty is required';
    }

    if (!newUsersDetails.department) {
      errors.department = 'Department is required';
    }

    if (!newUsersDetails.program) {
      errors.program = 'Program is required';
    }

    if (!newUsersDetails.entrylevel) {
      errors.entrylevel = 'Entrylevel is required';
    }

    if (!newUsersDetails.dob) {
      errors.dob = 'Date of Birth is required';
    }

    if (!newUsersDetails.gender) {
      errors.gender = 'Gender Status is required';
    }

    if (!newUsersDetails.telephone) {
      errors.telephone = 'Telephone is required';
    }

    if (!newUsersDetails.firstname) {
      errors.firstname = 'Firstname is required';
    }

    if (!newUsersDetails.surname) {
      errors.surname = 'Surtname is required';
    }

    if (!newUsersDetails.email) {
      errors.email = 'Email is required';
    }

    if (!newUsersDetails.nationalIdentificationNumber) {
      errors.nationalIdentificationNumber = 'National Identification Number is required';
    }

    if (!newUsersDetails.relationshipstatus) {
      errors.relationshipstatus = 'Relationshipstatus is required';
    }

    if (newUsersDetails.application && newUsersDetails.faculty && newUsersDetails.department
      && newUsersDetails.program && newUsersDetails.entrylevel && newUsersDetails.dob && newUsersDetails.gender
      && newUsersDetails.telephone && newUsersDetails.firstname && newUsersDetails.surname && newUsersDetails.email
      && newUsersDetails.nationalIdentificationNumber && newUsersDetails.relationshipstatus) {
      const data = {
        "StudentAuthenticationInfo": {
          "email": newUsersDetails.email,
          "password": newUsersDetails.surname,
        },
        "StudentRecordInfo": {
          "applicationId": newUsersDetails.application,
          "facultyId": newUsersDetails.faculty,
          "departmentId": newUsersDetails.department,
          "programId": newUsersDetails.program,
          "nationalIdentificationNumber": newUsersDetails.nationalIdentificationNumber,
          "entryLevel": newUsersDetails.entrylevel,
          "firstname": newUsersDetails.firstname,
          "surname": newUsersDetails.surname,
          "dateOfBirth": newUsersDetails.dob,
          "gender": newUsersDetails.gender,
          "email": newUsersDetails.email,
          "relationShipStatus": newUsersDetails.relationshipstatus,
          "mobile": newUsersDetails.telephone,
        },
      }
      registerNewStudent({data})
    }
    return errors;
  }

  const registerNewStudent = async ({ data }) => {
    let errors = {};
    const resutlt = await ApiServices.saveRegistrationByAdmin({ data })
    if (resutlt.response !=null && resutlt.response.status != 200) {
      errors.email = resutlt.response.data.error;
      setFormErrors(errors);
    } else {
      toast.success("Successful Created.!.");
      setTimeout(() => {
        window.location.reload(true);
      }, 1000);
    }
     
  }
  var ColClass = "";
  var ColClass2 = "";
   if (showEditForm && showAdditionalFields || isCreateNewProfessor && showAdditionalFields) {
    ColClass = 'col-md-12';
    ColClass2 = 'col-md-12 m-3';
  } else if (!showEditForm && showAdditionalFields || !isCreateNewProfessor && showAdditionalFields) {
    ColClass = 'col-md-12'
    ColClass2 = 'col-md-12 mt-4';
  } else if (showEditForm && !showAdditionalFields || isCreateNewProfessor && !showAdditionalFields)  {
    ColClass = 'col-md-8 m-1'
    ColClass2 = 'col-md-4';
  } else {
    ColClass = 'col-md-12'
    ColClass2 = 'col-md-12';
  }
  return (
    <>
      <ToastContainer />
       <HeaderNav/>

      <Aside/>
      {loading ? (
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
                <li className="active">Student List</li>
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
                              <button onClick={openAddNewModal} type="button" className="btn btn-sm bg-blue btn-flat"><i className="fa fa-plus"></i> Add Data</button>
                                <div className="pull-right insiderBox" id="iz" style={{ display: "none" }}>
                                  <button id="delete__Btn" title="Delete This Student" className="mr-4 btn btn-sm btn-danger btn-flat" type="button"><i className="fa fa-trash"></i> Delete</button>
                                  <button disabled="disabled" className="btn btn-sm" style={{ backgroundColor: "#000000", borderRadius: "25px" }}><span className="pull-left" id="deletebadge" style={{ color: "#fff" }}>Selected</span></button>
                                </div>
                              </div>
                                <div className={showAdditionalFields ? "":"d-flex" }>
                                  <div className={ColClass}>
                                    <MaterialReactTable table={table} />
                                  </div>
                                  {showEditForm && (
                                    <>
                                    <div className={ColClass2}>
                                      <div className="card">
                                        <div className="card-header">
                                          <h6 style={{fontFamily:'sans-serif', textAlign:'center', fontStyle:'normal', fontWeight:'bolder'}}>Edit Student</h6> 
                                        </div>
                                        <div className="card-body">
                                          <div className="errormsgContainer error error-ico" style={{display:'none'}}></div>
                                          <form  method="post" acceptCharset="utf-8" encType="multipart/form-data" autoComplete="off" onSubmit={HandleSubmitEditForm}>
                                              <div className="row">
                                                <div className="col-sm-12 col-sm-offset-12">
                                                  <label htmlFor="firstname">First Name:<span className="text-danger">*</span></label>
                                                  <input type="text" className="form-control w-100" name="firstname" id="firstname" placeholder="Last Name:" value={studentData.firstname} onChange={handleInputChange}/>
                                                </div>
                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                  <label htmlFor="Surname">Surname:<span className="text-danger">*</span></label>
                                                  <input type="text" className="form-control w-100" name="surname" id="Surname" value={studentData.surname} placeholder="Surname" onChange={handleInputChange}/>
                                                </div>
                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                  <label htmlFor="email">Student Email:<span className="text-danger">*</span></label>
                                                  <input type="email" className="form-control w-100" name="email" value={studentData.email} id="email" placeholder="Student Email" onChange={handleInputChange}/>
                                                </div>
                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                  <label htmlFor="tel">Mobile:<span className="text-danger">*</span></label>
                                                  <input type="tel" className="form-control w-100" name="mobile" value={studentData.mobile} id="mobile" placeholder="+(234) 5435-4542-34" onChange={handleInputChange}/>
                                                </div>
                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                  <label htmlFor="DBO:">Date of Birth:<span className="text-danger">*</span></label>
                                                  <input type="date" className="form-control w-100" name="dateOfBirth" id="DOB" value={studentData.dateOfBirth} onChange={handleInputChange}/>
                                                </div>
                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                  <label htmlFor="gender">Gender</label>
                                                  <select name="gender" id="gender" className="form-control w-100 select2" onChange={handleInputChange}>
                                                    <option value="">--Empty--</option>
                                                    <option value="Male" selected={studentData.gender === 'Male'}>Male</option>
                                                    <option value="Female" selected={studentData.gender === 'Female'}>Female</option>
                                                  </select>
                                                </div>
                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                  <label htmlFor="relationShipStatus">Relationship Status </label>
                                                  <select name="relationShipStatus" id="relationShipStatus" className="form-control w-100 select2"  onChange={handleInputChange}>
                                                    <option value="Single" selected={studentData.relationShipStatus === 'Single'}>Single</option>
                                                    <option value="Divored" selected={studentData.relationShipStatus === 'Divored'}>Divored</option>
                                                    <option value="Married" selected={studentData.relationShipStatus === 'Married'}>Married</option>
                                                    <option value="Complicated" selected={studentData.relationShipStatus === 'Complicated'}>Complicated</option>
                                                    <option value="Window" selected={studentData.relationShipStatus === 'Window'}>Window</option>
                                                    <option value="In-Contract Marrige" selected={studentData.relationShipStatus === 'In-Contract Marrige'}>In-Contract Marrige</option>
                                                  </select>
                                                </div>
                                                <div className="col-md-12 col-sm-12 col-xs-12 mt-3 d-flex ">
                                                  <button type="button"  onClick={CancelEditModalForm}  className='btn btn-default pull-left'>Cancel Update</button>
                                                  <button type="submit" id="isAddProfessor" className="ml-4 btn bg-purple pull-right"> Save Edit</button>
                                                </div>
                                            </div>
                                            
                                          </form>		
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                    )}

                                    {isCreateNewProfessor && (
                                      <>
                                      <div className={ColClass2}>
                                        <div className="card">
                                          <div className="card-header">
                                            <h6 style={{fontFamily:'sans-serif', textAlign:'center', fontStyle:'normal', fontWeight:'bolder'}}>Register New Student</h6> 
                                          </div>
                                              <div className="card-body">
                                                <form id="addstudent" onSubmit={saveNewStudentFormData} method="post" acceptCharset="utf-8" encType="multipart/form-data" autoComplete="off">
                                                    <div className="box-body">
                                                      <div className="row">
                                                        <div className="col-md-12 col-sm-12 col-xs-12">
                                                          <label htmlFor="Application">Application Type:</label>
                                                          <select className={`form-control ${formErrors.application ? 'is-invalid' : ''}`} name="application" id="Application"
                                                            defaultValue={newUsersDetails.application} onChange={handleInputChangeOnApplicationType}>
                                                              <option value="">--Select--</option>
                                                              <option value="1"> Distance Learning Institute </option>
                                                              <option value="2"> Postgraduate </option>
                                                              <option value="3"> Undergraduate </option>
                                                          </select>
                                                          {formErrors.application && <div className="invalid-feedback">{formErrors.application}</div>}
                                                        </div>
                                                        <div className="col-md-12 col-sm-12 col-xs-12">
                                                            <label htmlFor="Faculty">Faculty:</label>
                                                            <select  name="faculty"  className={`form-control ${formErrors.faculty ? 'is-invalid' : ''}`}  id="Faculty"  onChange={handleInputChangeOnFacultyField}>
                                                              <option value="">--Empty--</option>
                                                            </select>
                                                            {formErrors.faculty && <div className="invalid-feedback">{formErrors.faculty}</div>}
                                                        </div>
                                                        <div className="col-md-12 col-sm-12 col-xs-12">
                                                          <label htmlFor="Department">Department:</label>
                                                          <select name="department" className={`form-control ${formErrors.department ? 'is-invalid' : ''}`} id="Department" onChange={handleInputChangeOnDepartmentField}>
                                                            <option value="">--Empty--</option>
                                                          </select>
                                                          {formErrors.department && <div className="invalid-feedback">{formErrors.department}</div>}
                                                        </div>
                                                        <div className="col-md-12 col-sm-12 col-xs-12">
                                                            <label htmlFor="Program">Program:</label>
                                                            <select name="program" className={`form-control ${formErrors.program ? 'is-invalid' : ''}`} id="Program"
                                                              defaultValue={newUsersDetails.program}  onChange={handleInputChangeOnProgramField}>
                                                                <option value="">--Empty--</option>
                                                            </select> 
                                                            {formErrors.program && <div className="invalid-feedback">{formErrors.program}</div>}
                                                        </div>
                                                        <div className="col-md-12 col-sm-12 col-xs-12">
                                                            <label htmlFor="NationalIdentificationNumber">NIN: <small>(National Identification Number)</small></label>
                                                            <input name="nationalIdentificationNumber" id="NationalIdentificationNumber" className={`form-control w-100 ${formErrors.nationalIdentificationNumber ? 'is-invalid' : ''}`} 
                                                            max="1000000000009999" step="1" type="text" placeholder="National Identification Number:" 
                                                            autoComplete="off" onChange={handleInput} value={newUsersDetails.nationalIdentificationNumber}/>
                                                          {formErrors.nationalIdentificationNumber && <div className="invalid-feedback">{formErrors.nationalIdentificationNumber}</div>}
                                                        </div>
                                                        <div className="col-md-12 col-sm-12 col-xs-12 EntryDevparent">
                                                            <div className="EntryDevchild">
                                                                <label htmlFor="Entrylevel">Entry Level:</label>
                                                                <select className={`form-control ${formErrors.entrylevel ? 'is-invalid' : ''}`} defaultValue={newUsersDetails.entrylevel}  name="entrylevel" id="Entrylevel" onChange={handleInputChangeOnEntryLevelField}>
                                                                  <option  value="">--Empty--</option>
                                                                </select>
                                                                {formErrors.entrylevel && <div className="invalid-feedback">{formErrors.entrylevel}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12 col-sm-12 col-xs-12">
                                                            <div style={{ marginTop: "20px", marginLeft: "20px", fontWeight: "bold", fontSize: "20px", textDecoration: "underline" }}><p>Personal Details</p></div>
                                                                </div>
                                                                    <div className="col-md-12 col-sm-12 col-xs-12">
                                                                        <lable htmlFor="Firstname">First Name:*</lable>
                                                                        <input type="text" className={`form-control w-100 ${formErrors.firstname ? 'is-invalid' : ''}`} name="firstname" id="Firstname" placeholder="Firstname:" 
                                                                        defaultValue={newUsersDetails.firstname}  onChange={(e)=>OnChangeEditInput(e)}/>
                                                                        {formErrors.firstname && <div className="invalid-feedback">{formErrors.firstname}</div>}
                                                                    </div>	
                                                                    <div className="col-md-12 col-sm-12 col-xs-12">
                                                                        <lable htmlFor="Surname">Surname*</lable>
                                                                        <input type="text" className={`form-control w-100 ${formErrors.surname ? 'is-invalid' : ''}`} name="surname" id="surname" placeholder="Surname" autoComplete="off" 
                                                                        defaultValue={newUsersDetails.surname}  onChange={(e)=>OnChangeEditInput(e)}/>
                                                                        {formErrors.surname && <div className="invalid-feedback">{formErrors.surname}</div>}
                                                                    </div>
                                                                    <div className="col-md-12 col-sm-12 col-xs-12">
                                                                        <lable htmlFor="Dob">Date Of Birth*</lable>
                                                                        <input type="date" className={`form-control w-100 ${formErrors.dob ? 'is-invalid' : ''}`} id="Dob" name="dob" placeholder="Date Of Birth:" 
                                                                        defaultValue={newUsersDetails.dob}  onChange={(e)=>OnChangeEditInput(e)} autoComplete="off" />
                                                                        {formErrors.dob && <div className="invalid-feedback">{formErrors.dob}</div>}
                                                                      </div>
                                                                    <div className="col-md-12 col-sm-12 col-xs-12">
                                                                        <lable htmlFor="Gender">Gender*</lable>
                                                                        <select className={`form-control w-100 ${formErrors.gender ? 'is-invalid' : ''}`} placeholder="Gender" name="gender" id="Gender"
                                                                        defaultValue={newUsersDetails.gender} onChange={handleInputChangeOnGenderOptions} autoComplete="off" >
                                                                            <option value="">--Select--</option>
                                                                            <option value="Male">Male</option>
                                                                            <option value="Female">Female</option>
                                                                        </select>
                                                                        {formErrors.gender && <div className="invalid-feedback">{formErrors.gender}</div>}
                                                                    </div>
                                                                    <div className="col-md-12 col-sm-12 col-xs-12">
                                                                        <lable htmlFor="Email">Email*</lable>
                                                                        <input type="email" className={`form-control w-100 ${formErrors.email ? 'is-invalid' : ''}`}  name="email" placeholder="Email:" id="Email"
                                                                        defaultValue={newUsersDetails.email}  onChange={(e)=>OnChangeEditInput(e)} autoComplete="off" />
                                                                      {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                                                                    </div>
                                                                    <div className="col-md-12 col-sm-12 col-xs-12">
                                                                        <lable htmlFor="Relationshipstatus">Relationship Status*</lable>
                                                                        <select name="relationshipstatus" className={`form-control w-100 ${formErrors.relationshipstatus ? 'is-invalid' : ''}`}  id="Relationshipstatus"
                                                                        defaultValue={newUsersDetails.relationshipstatus} onChange={handleInputChangeOnRelationShipStatus} autoComplete="off" >
                                                                            <option value="">--Select--</option>
                                                                            <option value="Divored">Divored</option>
                                                                            <option value="Single">Single</option>
                                                                            <option value="Married">Married</option>
                                                                            <option value="Complicated">Complicated</option>
                                                                        </select>
                                                                        {formErrors.relationshipstatus && <div className="invalid-feedback">{formErrors.relationshipstatus}</div>}
                                                                    </div>
                                                                    <div className="col-md-12">
                                                                      <lable htmlFor="Telephone">Tel*</lable>
                                                                      <input type="tel"  className={`form-control w-100 ${formErrors.telephone ? 'is-invalid' : ''}`} defaultValue={newUsersDetails.telephone}  onChange={(e)=>OnChangeEditInput(e)} id="Telephone"  name="telephone" placeholder="+(234) 8032 4552 09" autoComplete="off" maxLength="19" />
                                                                      {formErrors.telephone && <div className="invalid-feedback">{formErrors.telephone}</div>}
                                                                    </div>
                                              
                                                                    <div className="col-md-12" id="guidanceform"></div>
                                                                    <div className="col-md-12">
                                                                    <div style={{ marginTop: "20px" }}>
                                                                        <button  onClick={CancelCreateModalForm} type="reset" className="btn btn-flat btn-default pull-left">Cancel</button>
                                                                        <button type="submit" id="isAddProfessor" className="btn btn-success pull-right">
                                                                          <i className="fa fa-save"></i> Save
                                                                        </button>
                                                                      </div>
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                              </form>
                                                            </div>
                                                          </div>
                                                        </div>
                                      </>
                                    )}
                              </div>
                                
                            </div>
                        </div>  
                      </div>
                    </section> 
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

export default Students
