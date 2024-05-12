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
const Faculties = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const tableRef = useRef(null);
  const AddFacultyFocusEffect = useRef(null)
  const AddCategoryFocusEffect = useRef(null)
  const EditCategoryFocusEffect = useRef(null)
  const EditFacultyFocusEffect = useRef(null)
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [showAdditionalFields, setShowAdditionalFields] = useState(true);
  const [faultyData, setFacultyData] = useState({
    id: '',
    catId:'',
    ftyName:'',
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
        setFacultyData({ ...faultyData, ftyName: event.target.value });
    };

    const HandleEditFaculty = async (id) => {
      const response = await ApiServices.getFacultyById(id);
      if (response.status == 200) {
        const data = response.data;
        setShowEditForm(true);
        setApiData(data);
        setFacultyData({id:data.id, catId:data.categoryId, ftyName:data.facultyName})
        
      }
    }

    const HandleDeleteFaculty = async (id) => {
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
                const response = await ApiServices.DeleteFaculty(id)
                if (response == 204) {
                toast.success("Successfully Deleted.");
                //Swal.fire('Deleted!', 'Successfully Deleted.', 'success')
                setTimeout(() => {
                    window.location.reload(true);
                }, 1000);
                } else {
                Swal.fire({
                    "title": "Error",
                    "text": "Something went wrong",
                    "type": "error"
                });
                }
            }
            });
    }

    const handleSaveEdit = async (event) => {
        event.preventDefault()
        var targetId = $('#TargetFacultyId').val();
        var categoryId = $('#Editcat_Id').val();
        var facultyName = $('#editfacultyName').val();
        if (targetId == null || targetId == "") {
            toast.warning('The target faculty is not found.')
            return false;
        }
        if (categoryId == "" || categoryId == null) {
            $(".c-invalid").addClass('has-error');
            EditCategoryFocusEffect.current.focus();
            $('.c-help-block').show().html("The field is required.");
            return false
        } else {
          $(".c-invalid").removeClass('has-error');
          $('.c-help-block').empty();
          $('.c-help-block').hide();
        }
        if (facultyName == "" || facultyName == null) {
            $(".m-invalid").addClass('has-error');
            EditCategoryFocusEffect.current.focus();
            $('.m-help-block').show().html("The field is required.");
            return false
        }else {
        //save update
        const response = await ApiServices.UpdateFaculty({ 'categoryId': categoryId, "facultyName":facultyName, "id":targetId, })
        if (response == 200) {
            toast.success("Update Successful.");
            setTimeout(() => {
            window.location.reload(true);
            }, 1000);
        } else {
            $(".invalid").addClass('has-error');
            AddFacultyFocusEffect.current.focus();
            $('.help-block').show().html("The field is required.");
            return false;
        }
        }
    }

    const handleCancelUpdate = async (event) => {
        event.preventDefault()
        setShowEditForm(false);
    }

    const handleAddNewFaculty = async(event) => {
        event.preventDefault()
        var categoryName = $('.categoryName').val();
        var facultyName = $('#facultyName').val();
        if (categoryName ==null || categoryName =="") {
        $(".category-invalid").addClass('has-error');
        AddCategoryFocusEffect.current.focus();
        $('.category-help-block').show().html("The field is required.");
        return false;
        } else {
            $(".category-invalid").removeClass('has-error');
            $('.category-help-block').empty();
            $('.category-help-block').hide();
        }
        if (facultyName ==null || facultyName =="") {
            $(".faculty-invalid").addClass('has-error');
            AddFacultyFocusEffect.current.focus();
            $('.faculty-help-block').show().html("The field is required.");
            return false;
        } else {
            $(".faculty-invalid").removeClass('has-error');
            $('.faculty-help-block').hide();
            $('.faculty-help-block').empty();
            const response = await ApiServices.CreateNewFaculty({'categoryId':categoryName, 'facultyName': facultyName })
            if (response == 201) {
                toast.success('New Category Added');
                setTimeout(() => {
                window.location.reload(true);
                }, 1000);
            } else {
                toast.warning('Something went wrong, check your internet connection.');
                return false;
            }
        
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
            const response = await ApiServices.getAllFaculties();
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
    { header: 'Category Reference', accessorKey: 'categoryId', },
    {header: "Faculty Name", accessorKey: "facultyName" },
    {header: 'Actions', accessorKey: 'button',
    Cell: ({ value, row }) => (
    <div className="flex d-flex" style={{ display: 'flex' }}>
      <div className="text-center">
        <button onClick={() =>HandleEditFaculty(row.original.id)} style={{width:'30px', alignItems:'center', textAlign:'center', borderRadius: '3px',boxShadow: 'none',border: '1px solid transparent', background:'#0073b7', }}>
          <i className="fa fa-pencil" style={{marginLeft:'3px', color:'#fff'}}></i>
        </button>&nbsp;
         <button onClick={() =>HandleDeleteFaculty(row.original.id)} style={{width:'30px', alignItems:'center', textAlign:'center', borderRadius: '3px',boxShadow: 'none',border: '1px solid transparent', background:'#dd4b39'}}>
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
                                            <button onClick={handleShow} type="button" className="btn btn-sm bg-blue btn-flat">
                                                <i className="fa fa-plus"></i> Add New Faculty 
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
                                                    <input type="number" name="TargetFacultyId" id="TargetFacultyId" value={faultyData.id}  className='form-control' hidden/>
                                                    <input type="number" name="facultyId" id="facultyId" value={faultyData.id}  className='form-control'  hidden/>
                                                    <div className="form-group c-invalid">
                                                        <label htmlFor="Editcat_Id">Category Reference: </label>
                                                        <select ref={EditCategoryFocusEffect} name="Editcat_Id" id="Editcat_Id" className="form-control">
                                                            <option value="">--Empty--</option>
                                                            <option value="1" selected={faultyData.catId == "1" ? "selected" : ""}> Distance Learning Institute </option>
                                                            <option value="2" selected={faultyData.catId == "2" ? "selected" : ""}> Postgraduate </option>
                                                            <option value="3" selected={faultyData.catId == "3" ? "selected" : ""}> Undergraduate </option>
                                                        </select>
                                                        <small className="c-help-block" style={{color: '#dd4b39'}}></small>
                                                    </div>
                                                    <div className="form-group m-invalid">
                                                        <label htmlFor="editfacultyName">Faculty Name: </label>
                                                        <input ref={EditFacultyFocusEffect} type="text" name="editfacultyName" id="editfacultyName" className="form-control w-100" value={faultyData.ftyName}  onChange={handleFacultyNameChange}/>
                                                        <small className="m-help-block" style={{color: '#dd4b39'}}></small>
                                                    </div>
                                                    <div className="mt-4">
                                                      <button type="submit" onClick={handleSaveEdit} className='btn btn-success pull-right'>Save Update</button>
                                                      <button type="button" onClick={handleCancelUpdate} className='btn btn-default'>Cancel Update</button>
                                                    </div>                            </form>
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
                                        <div className="form-group category-invalid">
                                            <label htmlFor="categoryName">Category Reference: </label>
                                            <select ref={AddCategoryFocusEffect} name="categoryName" className="form-control categoryName" >
                                                <option value="">--Select--</option>
                                                <option value="1">Distance Learning Institute </option>
                                                <option value="2">Postgraduate </option>
                                                <option value="3">Undergraduate </option>
                                            </select>
                                            <small className="category-help-block" style={{color: '#dd4b39'}}></small>
                                        </div>
                                        <div className="form-group faculty-invalid">
                                            <label htmlFor="facultyName">Faculty Name: </label>
                                            <input  ref={AddFacultyFocusEffect} type="text" name="facultyName" id="facultyName" className="form-control" />
                                            <small className="faculty-help-block" style={{color: '#dd4b39'}}></small>
                                        </div>
                                      </form>
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button variant="primary" onClick={handleAddNewFaculty}>
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

export default Faculties
