
import '../../../../assets/css/ui.css'
import '../../../../assets/css/styles.css'
import '../../../../assets/css/font-awesome/css/font-awesome.min.css'
import { Link } from 'react-router-dom';
import  ApiServices from '../../../../services/WebServices'
import adminImage from '../../../../assets/img/1624240500_avatar.png'
import useAuthContext from '../../../../context/AuthContext';

const HeaderNav = () => {
  const { getManagementDetails } = useAuthContext();
  const logout = (event) => {
    event.preventDefault()
    const token = getManagementDetails().jwt;
    ApiServices.logoutManagement(token)
  }
  
  const getUserId=() =>{
    const userToken = localStorage.getItem('OAappData');
    // Parse the JSON string to an object
    const appData = JSON.parse(userToken);
    // Check if the "app" property exists in the parsed object
    if (appData && Object.prototype.hasOwnProperty.call(appData, 'OAuser')) {
      // Access the "app" property
      const UserId= appData.OAuser.id;
      const Username = appData.OAuser.authUser;
      if (UserId !=null && Username !=null || UserId !="" && Username !="") {
        return [UserId, Username];
      }else{
        return [null,null];
      }
    } 
  }
  return (
    <>
        <nav className="main-header navbar navbar-expand navbar-light border border-light shadow  border-top-0  border-left-0 border-right-0 navbar-light text-sm">
          <ul className="navbar-nav">
            <li className="nav-item">
            <Link className="nav-link" data-widget="pushmenu" to={"/"} role="button"><i className="fas fa-bars"></i></Link>
            </li>
            <li className="nav-item d-none d-sm-inline-block">
              <Link to={"/"} className="nav-link ml-color">TownSend University</Link>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <div className="btn-group nav-link">
                <button type="button" className="btn btn-rounded badge badge-light dropdown-toggle dropdown-icon" data-toggle="dropdown">
                  <span><img src={adminImage} className="img-circle elevation-2 user-img" alt="User Image"/></span>
                  <span className="ml-3 ml-color">Hello,  {getUserId() ? getUserId()[1] : "Guest"}</span>
                  <span className="sr-only ml-color">Toggle Dropdown</span>
                </button>
                <div className="dropdown-menu" role="menu">
                  <Link className="dropdown-item" to={getUserId() ? "/user/account/id/" + getUserId()[0] : "/"}><span className="fa fa-user"></span> My Account</Link>
                  <div className="dropdown-divider"></div>
                  <span className="dropdown-item" onClick={logout}><span className="fas fa-sign-out-alt"></span> Logout</span>
                </div>
            </div>
            </li>
            <li className="nav-item">
              
            </li>
            
          </ul>
        </nav>
    </>
  )
}

export default HeaderNav
