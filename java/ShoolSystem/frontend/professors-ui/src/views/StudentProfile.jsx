/* eslint-disable no-unused-vars */
import HeaderNav from './components/Header/Nav/HeaderNav';
import Aside from './components/Header/Menu/Aside';
import { Link } from "react-router-dom"
import { useEffect, useState} from 'react';
import UseAuthContext from '../context/AuthContext';
import ApiServices from "../services/WebServices";
import StudentImg from '../assets/img/student.png'


const StudentProfile = () => {
  const { getManagementDetails } = UseAuthContext();
  const [username, setUsername] = useState('');
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true);

  const openCity=(evt, cityName)=> {
    // Implement the logic here, for example:
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";}
        
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");}

    document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active";
  }

  return (
    <>
      <HeaderNav />
      <Aside />

      <div className="content-wrapper" >
        <section className="content-header bd-762Qa">
          <ol className="breadcrumb">
            <li><a href="#"><i className="fa fa-home"></i> Home </a></li>
            <li className="active">Application </li>
            <li className="active">Student Profile</li>
          </ol>
        </section>
        <section className="content  text-dark">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-3 col-sm-12 col-xs-12 col-lg-3">
                <div className="_pcontainer" style={{ position: "relative" }}>
                  <div className="profile-container">
                    <img src={StudentImg} alt="Profile Image" className="img-responsive img-thumbnail"/>
                    <div className="upload-overlay">
                      <p>Upload image</p>
                    </div>
                  </div>
                  <div className="userNameContainer">
                    <span>Name</span>
                    </div>
                </div>
              </div>
              <div className="col-md-9 col-sm-12 col-xs-12 col-lg-9">
                <div className="d-flex gap-1">
                  <div className="pcard" style={{width:'9rem'}}>
                    <div className="pcard-header d-flex" style={{justifyContent:'space-between'}}>
                      <div className="left">
                        <input type="checkbox" id="green-checkbox" checked/>
                          <label htmlFor="green-checkbox" className="green-checkbox-label"></label>
                      </div>
                      <div className="right">
                        STAGE 1
                      </div>
                    </div>
                    <div className="card-body">
                      Inquuiry
                    </div>
                  </div>
                  <div className="gcard" style={{width:'9rem'}}>
                    <div className="gcard-header d-flex" style={{justifyContent:'space-between'}}>
                      <div className="left">
                        <input type="checkbox" id="green-checkbox" checked/>
                          <label htmlFor="green-checkbox" className="green-checkbox-label"></label>
                      </div>
                      <div className="right">
                        STAGE 2
                      </div>
                    </div>
                    <div className="card-body">
                      <span style={{fontSize:'13px'}}>Application Form</span>
                    </div>
                  </div>
                  <div className="mcard" style={{width:'9rem'}}>
                    <div className="mcard-header d-flex" style={{justifyContent:'space-between'}}>
                      <div className="left">
                        <input type="checkbox" id="green-checkbox" checked/>
                          <label htmlFor="green-checkbox" className="green-checkbox-label"></label>
                      </div>
                      <div className="right">
                        STAGE 3
                      </div>
                    </div>
                    <div className="card-body">
                      <span style={{fontSize:'13px'}}>Online Exam</span>
                    </div>
                  </div>
                  <div className="vcard" style={{width:'9rem'}}>
                    <div className="vcard-header d-flex" style={{justifyContent:'space-between'}}>
                      <div className="left">
                        <input type="checkbox" id="green-checkbox" checked/>
                          <label htmlFor="green-checkbox" className="green-checkbox-label"></label>
                      </div>
                      <div className="right">
                        STAGE 4
                      </div>
                    </div>
                    <div className="card-body">
                      <span style={{fontSize:'13px'}}>Fee received</span>
                    </div>
                  </div>
                  <div className="kcard" style={{width:'9rem'}}>
                    <div className="kcard-header d-flex" style={{justifyContent:'space-between'}}>
                      <div className="left">
                        <input type="checkbox" id="green-checkbox" checked/>
                          <label htmlFor="green-checkbox" className="green-checkbox-label"></label>
                      </div>
                      <div className="right">
                        STAGE 5
                      </div>
                    </div>
                    <div className="card-body">
                      <span style={{fontSize:'13px'}}>Clearance Form</span>
                    </div>
                  </div>
                  <div className="fcard" style={{width:'9rem'}}>
                    <div className="fcard-header d-flex" style={{justifyContent:'space-between'}}>
                      <div className="left">
                        <input type="checkbox" id="green-checkbox" checked/>
                          <label htmlFor="green-checkbox" className="green-checkbox-label"></label>
                      </div>
                      <div className="right">
                        STAGE 6
                      </div>
                    </div>
                    <div className="card-body">
                      Enrolled
                    </div>
                  </div>
                </div>
                <div className="table mt-3">
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td  className='text-table-primary'>Applied Date</td>
                        <td>23-32-2023</td>
                      </tr>
                      <tr>
                        <td  className='text-table-primary'>Location</td>
                        <td><i className="fa fa-map-marker " aria-hidden="true"></i>Nigeria, Oyo State- Ibadan</td>
                      </tr>
                      <tr>
                        <td  className='text-table-primary'>Date of birth</td>
                        <td>23-23-1218</td>
                      </tr>
                      <tr>
                        <td  className='text-table-primary'>Primary Email</td>
                        <td>user@yahoo.com</td>
                      </tr>
                      <tr>
                        <td  className='text-table-primary'>Telephone No.</td>
                        <td>+2728712921212</td>
                      </tr>
                      </tbody>
                  </table>
                </div>
              </div>

              <div className="col-md-12">
                <div className="-fluid w3-animate-opacity">
                  <div className="tab">
                    <button className="tablinks" onClick={(event) => openCity(event, 'Servers')}>Application Info</button>
                    <button className="tablinks" onClick={(event) => openCity(event, 'Fruits')}>Personal Details </button>
                    <button className="tablinks" onClick={(event) => openCity(event, 'Workers')}>Student Performance</button>
                    <button className="tablinks" onClick={(event) => openCity(event, 'Servers')}>Emergency Contants</button>
                    <button className="tablinks" onClick={(event) => openCity(event, 'Fruits')}>Fees</button>
                    <button className="tablinks" onClick={(event) => openCity(event, 'Workers')}>Student Attendance</button>
                  </div>
                    <div id="Servers" className="tabcontent">
                      <table className="w3-animate-opacity">
                      <tr>
                        <th>Servers List</th>
                        <th>Status</th>
                        <th>Time</th>
                      </tr>
                      <tr>
                        <td>Ubuntu Server 16.04.4</td>
                        <td className="actived"><a href="#">Available</a></td>
                        <td>1 year, 11 months, 23 hours, 59minutes, 59seconds</td>
                      </tr>
                      <tr>
                        <td>Virtual Machine Windows Server 2002</td>
                        <td className="actived"><a href="#">Available</a></td>
                      <td>2 year, 11 months, 23 hours, 59minutes, 59seconds</td>
                      </tr>
                      <tr>
                        <td>Windows 10 Spark server</td>
                        <td className="deactivated"><a href="#">Unavailable</a></td>
                        <td>0 year, 6 months, 2 hours, 9minutes, 40seconds</td>
                      </tr>
                      <tr>
                        <td>Windows XP Professional</td>
                        <td className="deactivated"><a href="#">Unavailable</a></td>
                      <td>0 year, 0 month, 0 hours, 0 minutes, 0 seconds</td>
                      </tr>

                    </table>
                    </div>

                    <div id="Fruits" className="tabcontent w3-animate-opacity">
                      <table>
                      <tr>
                        <th>Fruits</th>
                        <th>Ammount</th>
                        <th>Price</th>
                      </tr>
                      <tr>
                        <td>Orange</td>
                        <td>1 unit</td>
                        <td>U$ 0,10</td>
                      </tr>
                      <tr>
                        <td>Pineapple</td>
                        <td>1 unit</td>
                      <td>U$ 0,20</td>
                      </tr>
                      <tr>
                        <td>Strawberry</td>
                        <td>1 unit</td>
                        <td>U$ 0,40</td>
                      </tr>
                      <tr>
                        <td>Apple</td>
                        <td>2 units</td>
                      <td>U$ 0,40</td>
                      </tr>

                    </table>
                    </div>

                    <div id="Workers" className="tabcontent w3-animate-opacity">
                      <table>
                      <tr>
                        <th>Officers</th>
                        <th>Department</th>
                        <th>Date of birth</th>
                        <th>Status</th>
                      </tr>
                      <tr>
                        <td>Leandro Bizzinotto Ferreira</td>
                        <td>Web Designer</td>
                        <td>23/09/1994</td>
                        <td className="intraining">In training</td>
                      </tr>
                      <tr>
                        <td>Cristiano Bizzinotto Ferreira</td>
                        <td>Advertising</td>
                        <td>23/09/1994</td>
                        <td className="available">Available</td>
                      </tr>
                      <tr>
                        <td>Amanda Maria Bizzinotto Ferreira</td>
                        <td>Polyglot, Translator, Developer</td>
                        <td>17/07/1993</td>
                        <td className="vacation">Vacation</td>
                      </tr>
                      <tr>
                        <td>Luis Antonio Ferreira</td>
                        <td>Personal Manager</td>
                        <td>20/08/1966</td>
                        <td className="available">Available</td>
                      </tr>
                      <tr>
                        <td>Luis Antonio Ferreira</td>
                        <td>Personal Manager</td>
                        <td>20/08/1968</td>
                        <td className="available">Available</td>
                      </tr>
                      <tr>
                        <td>Rita Helena Bizzinotto Ferreira</td>
                        <td>Housewife</td>
                        <td>20/07/1962</td>
                        <td className="disable">Disable</td>
                      </tr>
                    </table>
                    </div>
                    </div>
              </div>
            </div>
          </div>
          </section>

      </div>
    </>
  )
}

export default StudentProfile
