/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import ApiServices from '../services/ApiServices';
import HeaderNav from './components/Header/Nav/HeaderNav';
import Aside from './components/Header/Menu/Aside';
import $ from 'jquery';
import DataTable from 'datatables.net-dt';
import 'datatables.net-dt/css/jquery.dataTables.css'
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
    const [loading, setLoading] = useState(true);
    const [showAdditionalFields, setShowAdditionalFields] = useState(true);
    const [isCreateNewRole, setIsCreateNewRole] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [roleList, setRoleList] = useState([]);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [showEditForm, setShowEditForm] = useState(false);
    const [userInfo, setUserInfo] = useState({
        id: '',
        email:'',
        role: '',
        records: [{
            firstname: '',
            surname: '',
            gender: '',
            mobile: '',
            dateOfBirth:'',
            photoUrl:''
        }]
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rolesResponse = await ApiServices.getSupserUserList();
                setData(rolesResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
        return () => {};
    }, []);

    const HandleDeleteUser = (id) => {
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
            const processDelete = await ApiServices.DeleteUsers({ "id": [id] });
            if (processDelete ==200) {
            toast.success("Successful Deleted.");
            setTimeout(() => {
                window.location.reload(true);
            }, 1000);
            } else {
            toast.error("Somethin went wrong in process User delete.");
            }
        }
        }); 
    };

    const openEditModal = async(id) => {
          setShowEditForm(false)
        try {
            navigate("/users/"+id)
        } catch (error) {
            setShowEditForm(false)
            setLoading(false);
            console.error('Error fetching student data:', error);
        }
        
      
    }
    
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
                    const processDelete = await ApiServices.DeleteUsers({ "id": boolx });
                    if (processDelete ==200) {
                    toast.success("Successful Deleted.");
                    setTimeout(() => {
                        window.location.reload(true);
                    }, 1000);
                    } else {
                    toast.error("Somethin went wrong in process User delete.");
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
            text: 'You will not be able to recover record!',
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
                const processDelete = await ApiServices.DeleteUsers({ "id": StringData });
                if (processDelete ==200) {
                toast.success("Successful Deleted.");
                setTimeout(() => {
                    window.location.reload(true);
                }, 1000);
                } else {
                toast.error("Somethin went wrong in process User delete.");
                }
            }
            }); 
        });
    }

    const SaveFormData =(event) => {
        event.preventDefault()
        const errors = validateFormData(userInfo);
        setFormErrors(errors);
    }

    const handleRecordInputChange = (e, index) => {
        const { name, value } = e.target;

         setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            records: [{
                ...prevUserInfo.records[0],
                [name]: value
            }]
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setUserInfo({
        ...userInfo,
        [name]: value,
        });
    };

    const validateFormData = (userInfo) => {
        let errors = {};
        
        if (!userInfo.records[0].firstname) {
            errors.firstname = 'FirstName is required';
        }
        if (!userInfo.records[0].surname) {
            errors.surname = 'Surname is required';
        }
        if (!userInfo.records[0].gender) {
            errors.gender = 'Gender is required';
        }
        if (!userInfo.records[0].mobile) {
            errors.mobile = 'Mobile number is required';
        }
        if (!userInfo.records[0].dateOfBirth) {
            errors.dateOfBirth = 'Date Of Birth is required';
        }
        if (!userInfo.email) {
            errors.email = 'Email is required';
        }
        if (!userInfo.role) {
            errors.role = 'Role is required';
        }
        if (userInfo.records[0].firstname && userInfo.records[0].surname && userInfo.records[0].gender && userInfo.records[0].mobile && userInfo.records[0].dateOfBirth && userInfo.email && userInfo.role) {
            const data = {
                "UserAuthenticationInfo":{
                    "email":userInfo.email,
                    "id": userInfo.id,
                    "role":userInfo.role
                },
                "UserRecordInfo": {
                    "firstname": userInfo.records[0].firstname,
                    "surname": userInfo.records[0].surname,
                    "gender": userInfo.records[0].gender,
                    "mobile": userInfo.records[0].mobile,
                    "dateOfBirth":userInfo.records[0].dateOfBirth,
                    "photoUrl":''
                }
            }
           saveData({ data });
        }

        return errors;
    }

    const saveData = async ({data}) => {
        let errors = {};
        const result = await ApiServices.createNewUser({ data })
        if (result.response != null && result.response.status != 200) {
            if ( result.response.status ==409) {
                errors.role = result.response.data.error;
                setFormErrors(errors);
            } else {
                errors.email = result.response.data.error;
                setFormErrors(errors);
            }
            
         } else {
            toast.success("Successful Updated.!");
            setTimeout(() => {
                window.location.reload(true);
            }, 1000);
        }
    }

    const openAddNewModal = async () => {
        try {
            const rolesResponse = await ApiServices.getAllRoleList();
            setRoleList(rolesResponse.data);
            setIsCreateNewRole(true)
            setShowEditForm(false)
            setFormErrors("");
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
       
        // setnewUsersDetails("")
    }

    const columns = [
        { header: 'S/N', accessorKey: 'id', Cell: ({ row }) => <div>{row.index + 1}</div> },
        {
            accessorKey: "deleteAll",
            header:<label className="mcui-checkbox"><input type="checkbox"  id="chk_all" onChange={handleCheckboxChange} /> <div><svg className="mcui-check" viewBox="-2 -2 35 35" aria-hidden="true"><title>checkmark-circle</title><polyline points="7.57 15.87 12.62 21.07 23.43 9.93" /></svg></div></label>,
            Cell: ({ row }) => {
                return (
                    <label className="checkbox-container">
                        <input type="checkbox" className="checkboxid" name="checkuser[]" value={row.original.id} onChange={handleCheckBoxChangleSingle} />
                        <span className="checkmark"></span>
                    </label>
                );
            }
        },
        { 
            accessorKey: "name",
            header: "FullName",
            Cell: ({ row }) => (
            <>
                {row.original.records.map((record, index) => (
                <div key={index}>
                    <div>{record.firstname +' '+record.surname}</div>
                </div>
                ))}
            </>
            ),
        },
        {
            accessorKey: "email",
            header: "Username"
        },
        {
        accessorKey: "role",
        header: "Level",
        Cell: ({ row }) => {
            const role = row.original.role;
            let userLevel = "";
            switch (role) {
                case 1:
                    userLevel = "Administrator";
                    break;
                case 4:
                    userLevel = "Super Admininstrator";
                    break;
                default:
                    userLevel = "Unknown";
            }
            return <div><span style={{ display: "inlineBlock", minWidth: "10px", padding: "3px 7px", fontSize: "12px", fontWeight: "700", lineHeight: "1", color: "#fff", textAlign: "center", whiteSpace: "nowrap", verticalAlign: "middle", backgroundColor: "#777", borderRadius: "10px" }}>{userLevel}</span></div>;
        }
        },
        {
            accessorKey: "status",
            header: "Status",
            Cell: ({ row }) => {
                return <div><span style={{ display: "inlineBlock", minWidth: "10px", padding: "3px 7px", fontSize: "12px", fontWeight: "700", lineHeight: "1", color: "#fff", textAlign: "center", whiteSpace: "nowrap", verticalAlign: "middle", backgroundColor: "#00a65a ", borderRadius: "10px" }}>Active</span></div>;
            }
        },
       {
        header: 'Actions', 
        accessorKey: 'checkbox',
        Cell: ({ row }) => {
            return (
                <div className="flex d-flex" style={{ display: 'flex' }}>
                    <div className="text-center">
                        <button onClick={() => openEditModal(row.original.id)} style={{ width: '30px', alignItems: 'center', textAlign: 'center', borderRadius: '3px', boxShadow: 'none', border: '1px solid transparent', background: '#0073b7', }}>
                            <i className="fa fa-pencil" style={{ marginLeft: '3px', color: '#fff' }}></i>
                        </button>&nbsp;
                        <button onClick={() => HandleDeleteUser(row.original.id)} style={{ width: '30px', alignItems: 'center', textAlign: 'center', borderRadius: '3px', boxShadow: 'none', border: '1px solid transparent', background: '#dd4b39' }}>
                            <i className="fa fa-trash" style={{ marginLeft: '3px', color: '#fff' }}></i>
                        </button>
                    </div>
                </div>
            );
        },
    },

    ];

   const table = useMaterialReactTable({
      data,
      columns
   });
    
    const CancelCreateNewUser = () => {
        setIsCreateNewRole(false);
        setUserInfo({
            id: '',
            email: '',
            role: '',
            records: [{
                firstname: '',
                surname: '',
                gender: '',
                mobile: '',
                dateOfBirth: '',
                photoUrl: ''
            }]
        })
    }
        
   
    
    var ColClass = "";
    var ColClass2 = "";
    if (showEditForm && showAdditionalFields || isCreateNewRole && showAdditionalFields) {
    ColClass = 'col-md-12';
    ColClass2 = 'col-md-12 m-3';
    } else if (!showEditForm && showAdditionalFields || !isCreateNewRole && showAdditionalFields) {
        ColClass = 'col-md-12'
        ColClass2 = 'col-md-12 mt-4';
    } else if (showEditForm && !showAdditionalFields || isCreateNewRole && !showAdditionalFields)  {
        ColClass = 'col-md-8 m-1'
        ColClass2 = 'col-md-4';
    } else {
    ColClass = 'col-md-12'
    ColClass2 = 'col-md-12';
    }
    
  return (
    <>
      
    <HeaderNav />
    <Aside />
    <ToastContainer />
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
                                

                                  {isCreateNewRole && (
                                    <>
                                    <div className={ColClass2}>
                                        <div className="card">
                                          <div className="card-header">
                                            <h6 style={{fontFamily:'sans-serif', textAlign:'center', fontStyle:'normal', fontWeight:''}}>Form | Add New Users </h6> 
                                          </div>
                                            <div className="card-body">
                                            <form onSubmit={SaveFormData} method="post">
                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                    <Form.Label htmlFor="Firstname" style={{fontSize:'14px', color:'#333',fontWeight: '200'}}>Firstname:*</Form.Label>
                                                    <Form.Control type="text" name="firstname" className={`form-control w-100 ${formErrors.firstname ? 'is-invalid' : ''}`} defaultValue={userInfo.records[0].firstname} id="firstname" onChange={handleRecordInputChange}/>
                                                    {formErrors.firstname && <div className="invalid-feedback">{formErrors.firstname}</div>}            
                                                </div>
                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                    <Form.Label htmlFor="Surname" style={{fontSize:'14px', color:'#333',fontWeight: '200'}}>Surname:*</Form.Label>
                                                    <Form.Control type="text" name="surname" className={`form-control w-100 ${formErrors.surname ? 'is-invalid' : ''}`} defaultValue={userInfo.records[0].surname} id="surname" onChange={handleRecordInputChange}/>
                                                    {formErrors.surname && <div className="invalid-feedback">{formErrors.surname}</div>}            
                                                </div>
                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                    <Form.Label htmlFor="Email" style={{fontSize:'14px', color:'#333',fontWeight: '200'}}>Email:*</Form.Label>
                                                    <Form.Control type="email" name="email" className={`form-control w-100 ${formErrors.email ? 'is-invalid' : ''}`} defaultValue={userInfo.email} id="email" onChange={handleInputChange}/>
                                                    {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}            
                                                </div>
                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                    <Form.Label htmlFor="Mobile" style={{fontSize:'14px', color:'#333',fontWeight: '200'}}>Mobile:*</Form.Label>
                                                    <Form.Control type="tel" name="mobile" className={`form-control w-100 ${formErrors.mobile ? 'is-invalid' : ''}`} defaultValue={userInfo.records[0].mobile} id="mobile" onChange={handleRecordInputChange}/>
                                                    {formErrors.mobile && <div className="invalid-feedback">{formErrors.mobile}</div>}            
                                                </div>
                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                    <Form.Label htmlFor="DateOfBirth" style={{fontSize:'14px', color:'#333',fontWeight: '200'}}>Date of Birth:*</Form.Label>
                                                    <Form.Control type="date" name="dateOfBirth" className={`form-control w-100 ${formErrors.dateOfBirth ? 'is-invalid' : ''}`} defaultValue={userInfo.records[0].dateOfBirth} id="dateOfBirth" onChange={handleRecordInputChange}/>
                                                    {formErrors.dateOfBirth && <div className="invalid-feedback">{formErrors.dateOfBirth}</div>}            
                                                </div>
                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                    <Form.Label htmlFor="Gender"  style={{fontSize:'14px', color:'#333',fontWeight: '200'}}>Gender:*</Form.Label>
                                                    <Form.Select aria-label="gender" name="gender" className={`form-control w-100 ${formErrors.gender ? 'is-invalid' : ''}`}  defaultValue={userInfo.records[0].gender} id="gender" onChange={(e)=>handleRecordInputChange(e)}>
                                                        <option value="">--Select--</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                    </Form.Select>
                                                    {formErrors.gender && <div className="invalid-feedback">{formErrors.gender}</div>}            
                                                </div>
                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                    <Form.Label htmlFor="Role"  style={{fontSize:'14px', color:'#333',fontWeight: '200'}}>Assign Role:*</Form.Label>
                                                    <Form.Select aria-label="role" name="role" className={`form-control w-100 ${formErrors.role ? 'is-invalid' : ''}`}  defaultValue={userInfo.role} id="Classname2" onChange={(e)=>handleInputChange(e)}>
                                                        <option value="">--Select--</option>
                                                        {roleList.map(role => (
                                                            <option key={role.id} value={role.id} selected={userInfo.role === role.id}>{role.clearance}</option>
                                                        ))}
                                                    </Form.Select>
                                                    {formErrors.role && <div className="invalid-feedback">{formErrors.role}</div>}            
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6 col-sm-12 col-xs-12">
                                                        <Button type="button" variant="secondary" className='mt-4 btn-secondary' onClick={CancelCreateNewUser}>Cancel</Button>
                                                    </div>
                                                    <div className="col-md-6 col-sm-12 col-xs-12">
                                                        <Button variant="primary" type="submit" className='mt-4' onClick={SaveFormData}>Save</Button>
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
          )
        }
    </>
  )
}

export default UserList
