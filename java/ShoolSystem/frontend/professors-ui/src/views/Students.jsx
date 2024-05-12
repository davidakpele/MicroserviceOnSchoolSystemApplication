/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Link } from "react-router-dom"
import DataTable from 'datatables.net-dt';
import 'datatables.net-dt/css/jquery.dataTables.css'
import $ from 'jquery';
import 'react-toastify/dist/ReactToastify.css';
import 'select2';
import HeaderNav from './components/Header/Nav/HeaderNav';
import Aside from './components/Header/Menu/Aside';
import Form from 'react-bootstrap/Form';
import {useMemo, useEffect, useRef, useState } from 'react';
import UseAuthContext from '../context/AuthContext';
import ApiServices from "../services/WebServices";
import { useNavigate } from 'react-router-dom';
import StudentImg from '../assets/img/student.png'

const Students = () => {
  const { getManagementDetails } = UseAuthContext();
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Dashboard Controller';
    const id  =getManagementDetails().id;
    const token  =getManagementDetails().jwt;
    const activeDepartment = getManagementDetails().isActiveDashboard;
    
      const appointedDepartments = async (id) => {
        try {
          const response = await ApiServices.getStudentInByDepartment(token, activeDepartment)
          setData(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false);
        }
      }
      appointedDepartments(id)
      setLoading(false);
    
    // Initialize DataTable when the component mounts
    $(tableRef.current).DataTable();
    // Cleanup when the component unmounts
    return () => {
      // Destroy DataTable to avoid memory leaks
      $(tableRef.current).DataTable().destroy(true);
    };
  }, [getManagementDetails]);

  const columns = useMemo(
    () => [
        {
        id: "rowNumber",
        header: "S/N",
        Cell: ({ row }) => <div>{row.index + 1}</div>
      },
      {
        accessorKey: "image",
        header: "Image",
          Cell: ({ row }) => (
          <>
            {row.original.records.map((record, index) => (
              <div key={index}>
                <div><img src={StudentImg} alt={record.firstname + ' ' + record.surname} className="rounded img-thumbnail" style={{ width: "40px", height: "40.7px" }} /></div>
              </div>
            ))}
          </>
        ),
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
        accessorKey: "mobile",
        header: "Telephone",
        Cell: ({ row }) => (
          <>
            {row.original.records.map((record, index) => (
              <div key={index}>
                <div>{record.mobile}</div>
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
                <Link className="btn btn-xs btn-primary" to={'/student_profile/'+row.original.id} style={{width:'45px', alignItems:'center', textAlign:'center'}}>
                  <i className="fa fa-eye" style={{marginLeft:'3px', color:'#fff'}}></i>
                </Link>&nbsp;
                <Link className="btn btn-xs btn-danger" to={'/student_attendance_records/' + row.original.id} style={{ width: '45px', alignItems: 'center', textAlign: 'center', }}>
                    <i className="fa fa-venus-mars" style={{marginLeft:'3px', color:'#fff'}}></i>
                </Link>
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
  return (
    <>
      <HeaderNav />
      <Aside /> 
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
                <section className="content-header bd-762Qa">
                  <ol className="breadcrumb">
                      <li><a href="#"><i className="fa fa-home"></i> Home </a></li>
                      <li className="active">Application </li>
                      <li className="active">List of Students</li>
                  </ol>
              </section>
              <section className="content  text-dark">
                <div className="container-fluid">
                  <hr className="border-dark"/>
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-12">
                      <section className="content container-fluid">
                        <div className="box">
                          <div className="box-header with-border bg-blue">
                            <h3 className="box-title" ><span style={{color:'#fff', fontWeight:'bolder'}}>STUDENT TABLE</span> </h3>
                            <div className="box-body">
                              <div className="mb-4">
                                <MaterialReactTable table={table} />
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
