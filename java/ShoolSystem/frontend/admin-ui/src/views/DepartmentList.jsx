/* eslint-disable no-unused-vars */

/* eslint-disable react/prop-types */
import 'datatables.net-dt/css/jquery.dataTables.css'
import {  useEffect, useRef, useState } from 'react';
import ApiServices from "../services/ApiServices";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import $ from 'jquery'
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import HeaderNav from './components/Header/Nav/HeaderNav';
import Aside from './components/Header/Menu/Aside';

const DepartmentList = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const tableRef = useRef(null);
  const AddFacultyFocusEffect = useRef(null)
  const AddDepartmentFocusEffect = useRef(null)
  const EditCategoryFocusEffect = useRef(null)
  const EdirDepartmentEffect = useRef(null)
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState('');
  const [facultyData, setFacultyData] = useState([]);
  const [listFacultiesOnModal, setListFacultiesOnModal] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [showAdditionalFields, setShowAdditionalFields] = useState(true);
  const [departmentData, setDepartmentData] = useState({
    id: '',
    ftyId:'',
    deptName:'',
  });

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
    

    const handleFacultyNameChange = (event) => {
        setDepartmentData({ ...departmentData, deptName: event.target.value });
    };

    const HandleEditDepartment = async (id) => {
      const Departmentresponse = await ApiServices.getDepartmentById(id);
      
      if (Departmentresponse.status == 200) {
        const Facultyrespones = await ApiServices.getAllFaculties()
        if (Facultyrespones.status ==200) {
          const data = Departmentresponse.data;
          setSelectedFacultyId(data.facultyId); 
          setFacultyData(Facultyrespones.data);
          setShowEditForm(true);
          setApiData(data);
          setDepartmentData({id:data.id, ftyId:data.categoryId, deptName:data.departmentName})
        } else {
          toast.warning("Error in fetching Feculty data.");
        }
      } else {
        toast.warning("Error in fetching Department.");
      }
    }

    const HandleDeleteDepartment = async (id) => {
        console.log(id);
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
                const response = await ApiServices.DeleteDepartment(id)
                if (response == 204) {
                toast.success("Successfully Deleted.");
                setTimeout(() => {
                    window.location.reload(true);
                }, 1000);
                } else {
                 toast.warning("Something went wrong.");
                }
            }
            });
    }

    const handleSaveEdit = async (event) => {
      event.preventDefault()
      var id = $('#TargetDepartmentId').val();
      var DepartmentBelowToFacultyId = $('#EditFacultyList').val();
      var newDepartmentName = $('#editDepartmentName').val();
     
      if (DepartmentBelowToFacultyId == "" || DepartmentBelowToFacultyId == null) {
        $(".f-invalid").addClass('has-error');
        EditCategoryFocusEffect.current.focus();
        $('.f-help-block').show().html("The field is required.");
        return false
      } else {
        $(".f-invalid").removeClass('has-error');
        $('.f-help-block').empty();
        $('.f-help-block').hide();
      }
        if (newDepartmentName == "" || newDepartmentName == null) {
            $(".d-invalid").addClass('has-error');
            EditCategoryFocusEffect.current.focus();
            $('.d-help-block').show().html("The field is required.");
            return false
        }else {
        //save update
        const response = await ApiServices.UpdateDepartment({ 'departmentName': newDepartmentName, "facultyId":DepartmentBelowToFacultyId, "id":id, })
        if (response == 200) {
            toast.success("Update Successful.");
            setTimeout(() => {
            window.location.reload(true);
            }, 1000);
        } else {
            $(".invalid").addClass('has-error');
            AddFacultyFocusEffect.current.focus();
            $('.f-help-block').show().html("The field is required.");
            return false;
        }
        }
    }

    const handleCancelUpdate = async (event) => {
        event.preventDefault()
        setShowEditForm(false);
    }

    const HandleAddNewDepartmentSubmitData = async(event) => {
        event.preventDefault()
       
        var facultyName = $('#CreatefacultyEntity').val();
        var deparmentName = $('#deparmentEntityData').val();
        if (facultyName ==null || facultyName =="") {
            $(".faculty-invalid").addClass('has-error');
            AddFacultyFocusEffect.current.focus();
            $('.faculty-help-block').show().html("The field is required.");
            return false;
        } else {
            $(".faculty-invalid").removeClass('has-error');
            $('.faculty-help-block').hide();
            $('.faculty-help-block').empty();
        }
        if (deparmentName == null || deparmentName == "") {
            $(".department-invalid").addClass('has-error');
            AddDepartmentFocusEffect.current.focus();
            $('.department-help-block').show().html("The field is required.");
            return false;
        }else {
            $(".department-invalid").removeClass('has-error');
            $('.department-help-block').empty();
            $('.department-help-block').hide();
            const response = await ApiServices.CreateNewDepartment({ 'facultyId': facultyName, 'departmentName':deparmentName})
            if (response == 201) {
                toast.success('New Department Added');
                setTimeout(() => {
                window.location.reload(true);
                }, 1000);
            } else {
                toast.warning('Something went wrong, check your internet connection.');
                return false;
            }
        
        }
    }

    const FetchFacultyList =async () => {
        try {
          const response = await ApiServices.getAllFaculties()
          setListFacultiesOnModal(response.data);
          setShow(true)
        } catch (error) {
            //
        }
    }

    const HandleSelectDepartmentValues = (event) => {
      setSelectedFacultyId(event.target.value);
    }
    const handleCloseNewFacultyModal = () => {
        setListFacultiesOnModal([''])
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await ApiServices.getAllDepartment();
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

        
    var ColClass = "";
    var ColClass2 = "";
    if (showEditForm && showAdditionalFields) {
        ColClass = 'col-md-12';
        ColClass2 = 'col-md-12 mt-4';
    } else if (!showEditForm && showAdditionalFields) {
        ColClass = 'col-md-12'
        ColClass2 = 'col-md-12 mt-4';
    } else if (showEditForm && !showAdditionalFields)  {
        ColClass = 'col-md-8 ww-1'
        ColClass2 = 'col-md-4';
    } else {
        ColClass = 'col-md-12'
        ColClass2 = 'col-md-12';
    }

  const columns = [
    { header: 'S/N', accessorKey: 'id',Cell: ({ row }) => <div>{row.index + 1}</div> },
    { header: 'Faculty Reference', accessorKey: 'facultyId', },
    {header: "Department Name", accessorKey: "departmentName" },
    {header: 'Actions', accessorKey: 'button',
    Cell: ({ value, row }) => (
    <div className="flex d-flex" style={{ display: 'flex' }}>
      <div className="text-center">
        <button onClick={() =>HandleEditDepartment(row.original.id)} style={{width:'30px', alignItems:'center', textAlign:'center', borderRadius: '3px',boxShadow: 'none',border: '1px solid transparent', background:'#0073b7', }}>
          <i className="fa fa-pencil" style={{marginLeft:'3px', color:'#fff'}}></i>
        </button>&nbsp;
         <button onClick={() =>HandleDeleteDepartment(row.original.id)} style={{width:'30px', alignItems:'center', textAlign:'center', borderRadius: '3px',boxShadow: 'none',border: '1px solid transparent', background:'#dd4b39'}}>
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
                <section className="content  text-dark">
                    <div className="container-fluid">
                      <hr className="border-dark"/>
                        <div className="row">
                            <div className="col-12 col-sm-12 col-md-12">
                                <section className="content container-fluid">
                                    <div className="box" >
                                        <div className="box-header with-border">
                                        <h3 className="box-title">Master Administration Data</h3>
                                        <div className="box-tools pull-right">
                                            <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
                                        </div>
                                        </div>
                                        <div className="box-body">
                                            <div className="mt-2 mb-4">
                                                <button type="button" onClick={FetchFacultyList} className="btn btn-sm bg-blue btn-flat" data-toggle="modal" href="#matkulId">
                                                    <i className="fa fa-plus"></i> Add New Department 
                                                </button>
                                                <div className="pull-right insiderBox" id="iz" style={{ display: "none" }}>
                                                    <button id="delete__Btn" title="Delete This Professor" className="btn btn-sm btn-danger btn-flat" type="button"><i className="fa fa-trash"></i> Delete</button>
                                                    <button disabled="disabled" className="btn btn-sm" style={{ backgroundColor: '#000000', borderRadius: "25px" }}><span className="pull-left" id="deletebadge" style={{ color: "#fff" }}>Selected</span></button>
                                                </div>
                                            </div>
                                          {/* table */}
                                          <div className={showAdditionalFields ? "":"d-flex" }>
                                            <div className={ColClass}>
                                              <MaterialReactTable table={table} />
                                            </div>
                                            {showEditForm && (
                                              <>
                                              <div className={ColClass2}>
                                                <div className="card">
                                                  <div className="card-header">
                                                  <h6>Edit <b>{apiData && <span>{apiData.facultyName} </span>}</b> Faculty</h6> 
                                                  </div>
                                                  <div className="card-body">
                                                    <form method="post" autoComplete='off'>
                                                        <input type="number" name="TargetDepartmentId" id="TargetDepartmentId" defaultValue={departmentData.id}  className='form-control' hidden/>
                                                        <div className="form-group f-invalid">
                                                            <label htmlFor="EditFacultyList">Faculty Reference: </label>
                                                            <select ref={EditCategoryFocusEffect} name="EditFacultyList" id="EditFacultyList" className="form-control"  value={selectedFacultyId} onChange={HandleSelectDepartmentValues}>
                                                                <option value="">--Empty--</option>
                                                                  {facultyData.map((faculty) => (
                                                                    <option key={faculty.id} value={faculty.id}>
                                                                      {faculty.facultyName}
                                                                    </option>
                                                                  ))}
                                                            </select>
                                                            <small className="f-help-block" style={{color: '#dd4b39'}}></small>
                                                        </div>
                                                        <div className="form-group d-invalid">
                                                            <label htmlFor="editDepartmentName">Department Name: </label>
                                                            <input ref={EdirDepartmentEffect} type="text" name="editDepartmentName" id="editDepartmentName" className="form-control w-100" value={departmentData.deptName}  onChange={handleFacultyNameChange}/>
                                                            <small className="d-help-block" style={{color: '#dd4b39'}}></small>
                                                        </div>
                                                        <div className="mt-4">
                                                          <button type="submit" onClick={handleSaveEdit} className='btn btn-success pull-right'>Save Update</button>
                                                          <button type="button" onClick={handleCancelUpdate} className='btn btn-default'>Cancel Update</button>
                                                        </div>
                                                    </form>
                                                  </div>
                                                </div>  
                                              </div>
                                              </>
                                              )
                                            }
                                            
                                          </div>
                                        </div>
                                    </div>
                                      {/* add modal */}
                                      <Modal show={show} onHide={handleClose} animation={false}>
                                        <Modal.Header closeButton>
                                          <Modal.Title>Add New Data</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                          <form method="post" >
                                                <div className="form-group faculty-invalid">
                                                    <label htmlFor="facultyName">Faculty Reference: </label>
                                                    <select ref={AddFacultyFocusEffect} name="facultyName" id="CreatefacultyEntity" className="form-control facultyName" >
                                                        <option value="">--Select--</option>
                                                        {listFacultiesOnModal.map((item) => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.facultyName} 
                                                        </option>
                                                        ))}
                                                    </select>
                                                    <small className="faculty-help-block" style={{color: '#dd4b39'}}></small>
                                                </div>
                                                <div className="form-group department-invalid">
                                                    <label htmlFor="deparmentEntityData">Department Name: </label>
                                                    <input  ref={AddDepartmentFocusEffect} type="text" name="deparmentName"  id="deparmentEntityData" className="form-control" />
                                                    <small className="deparment-help-block" style={{color: '#dd4b39'}}></small>
                                                </div>
                                              </form>
                                        </Modal.Body>
                                        <Modal.Footer>
                                          <Button variant="primary" onClick={HandleAddNewDepartmentSubmitData}>
                                            Save Changes
                                          </Button>
                                        </Modal.Footer>
                                      </Modal>
                                  
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

export default DepartmentList
