
import HeaderNav from './components/Header/Nav/HeaderNav';
import Aside from './components/Header/Menu/Aside';
import { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, } from 'reactstrap';
import { Row, Col, Pagination  } from 'react-bootstrap';
import ApiServices from "../services/WebServices";
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export const ExamSetUp = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData]= useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(3);
    
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userContainer = localStorage.getItem('OAappData');
            // Parse the JSON string to an object
            const appData = JSON.parse(userContainer);
            if ((appData && Object.prototype.hasOwnProperty.call(appData, 'OAuser'))) {
                if ((appData && Object.prototype.hasOwnProperty.call(appData.OAuser, "BaseRole"))) {
                    if (appData.OAuser.BaseRole != "" || appData.OAuser.BaseRole != null) {
                        const role = appData.OAuser.BaseRole;
                        const response = await ApiServices.getAllExamListByDepartmentId(role);
                        setData(response.data);
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
    
    const ActiveExamination = async (id) => {
      const response = await ApiServices.setAccessToExamStatusDisAbled(id);
        if (response == 200) {
            toast.success("Successfully Disactivated.");
            fetchData()
        } else {
            toast.error("Something went wrong.");
        }
    }
    
    const deActiveExamination = async (id) => {
        const response = await ApiServices.setAccessToExamStatusEnabled(id);
        if (response == 200) {
            toast.success("Successfully Activated.");
            fetchData()
        } else {
            toast.error("Something went wrong.");
        }
        
    }

    const deleteExamination = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete?",
            type: "question",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d73925",
            confirmButtonText: "Yes, process!",
            cancelButtonText: "No, cancel please!",
            closeOnConfirm: false,
            closeOnCancel: false
            }).then(async(result) => {
            if (result.isConfirmed) {
                const result = await ApiServices.deleteExamination(id)
                if (result !=null && result==200) {
                    toast.success("Successully delete")
                    fetchData();
                } else {
                    toast.warning("Sorry Something went wrong.")
                }
            }
        });
    }
    // Calculate the index of the last item to display on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    // Calculate the index of the first item to display on the current page
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // Get the current items to display based on pagination
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                      <section className="content-header bd-762Qa">
                          <ol className="breadcrumb">
                              <li><a href="#"><i className="fa fa-home"></i> Home </a></li>
                              <li className="active">Examination </li>
                              <li className="active">View Examination Settings Logs</li>
                          </ol>
                      </section>
                      <section className="content  mb-5 text-dark">
                          <section className="content  text-dark mt-2" id="table_clone">
                              <div className="container-fluid">
                                  <div className="defaultCard">
                                      <div className="defaultCardHeader">
                                          <div className="pull-left">
                                              <i className="fa fa-users bg-r" aria-hidden="true"></i>
                                              <span className="bolder-3 bg-r">Manage Exams Data</span>
                                          </div>
                                      </div>
                                      <div className="card-body">
                                            <div className="pull-left">
                                                  <Link to={"/exam/create_exam"}>
                                                      <button type="button" className="btn btn-sm btn-flat btn-success">
                                                          <i className="fa fa-plus"></i> Add Data
                                                      </button>
                                                  </Link>
                                            </div> 
                                            <div className="container-fluid mt-5">
                                               {/*  */}
                                               <Row>
                                                {currentItems.map((items, index) => (
                                                    <Col key={index} md={4} xs={12} sm={12}>
                                                        <Card>
                                                            <CardHeader>
                                                                <span className='text-center'>Examination info</span>
                                                            </CardHeader>
                                                            <CardBody>
                                                                <Table striped bordered hover>
                                                                    <thead>
                                                                    <tr>
                                                                        <th id="" colSpan={5}><small>{items[3].courseTitle}</small></th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    <tr>
                                                                        <td colSpan={2}>Start time</td>
                                                                        <td colSpan={2}>{items[0].startTime}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colSpan={2}>End Time</td>
                                                                        <td colSpan={2}>{items[0].endTime}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colSpan={2}>Duration</td>
                                                                        <td colSpan={2}>{items[0].duration}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colSpan={2}>Department</td>
                                                                        <td colSpan={2}>{items[1].departmentName}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colSpan={2}>Class</td>
                                                                        <td colSpan={2}>{items[2].title}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colSpan={2}>Semester</td>
                                                                        <td colSpan={2}>{items[4].title}</td>
                                                                    </tr>
                                                                    </tbody>
                                                                </Table>
                                                            </CardBody>
                                                            <CardFooter className="d-flex justify-content-between align-items-center">
                                                              <Dropdown  style={{margin:'10px', backgroundColor:'#fff'}}>
                                                                <Dropdown.Toggle variant="success" style={{ border:'1', marginTop:'-17px', color:'#fff'}} id="dropdown-basic"></Dropdown.Toggle>
                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item href={'/exam/edit/id/'+items[0].id}>Edit</Dropdown.Item>
                                                                        <Dropdown.Item href={'/exam/questions/view/id/'+items[0].id}>View question</Dropdown.Item>
                                                                        {items[0].status ? (<>
                                                                            <Dropdown.Item onClick={()=>ActiveExamination(items[0].id)}>Disactive Access</Dropdown.Item>
                                                                        </>) : (<>
                                                                                <Dropdown.Item onClick={()=>deActiveExamination(items[0].id)}>Active Access</Dropdown.Item>
                                                                        </>)}
                                                                        <Dropdown.Item onClick={()=>deleteExamination(items[0].id)}>Delete</Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </CardFooter>
                                                        </Card>
                                                    </Col>
                                                ))}
                                               </Row>
                                            </div>
                                             {/* Pagination */}
                                                <div className="pagination-container">
                                                    <Pagination>
                                                    <Pagination.First onClick={() => paginate(1)} />
                                                    <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                                                    {[...Array(Math.ceil(data.length / itemsPerPage)).keys()].map((number) => (
                                                        <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                                                        {number + 1}
                                                        </Pagination.Item>
                                                    ))}
                                                    <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(data.length / itemsPerPage)} />
                                                    <Pagination.Last onClick={() => paginate(Math.ceil(data.length / itemsPerPage))} />
                                                    </Pagination>
                                                </div>
                                      </div>
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
