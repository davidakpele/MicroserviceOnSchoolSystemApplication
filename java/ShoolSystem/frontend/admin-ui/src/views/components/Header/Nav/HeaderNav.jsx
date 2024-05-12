
import '../../../../assets/css/font-awesome/css/font-awesome.min.css'
import { Link } from 'react-router-dom';
import  ApiServices from '../../../../services/ApiServices'
import adminImage from '../../../../assets/img/1624240500_avatar.png'
const HeaderNav = () => {

  const logout = (event) => {
    event.preventDefault()
    ApiServices.logout()
  }
  
  const getUserId=() =>{
        const userToken = localStorage.getItem('appData');
        // Parse the JSON string to an object
        const appData = JSON.parse(userToken);
        // Check if the "app" property exists in the parsed object
        if (appData && Object.prototype.hasOwnProperty.call(appData, 'user')) {
            // Access the "app" property
          const UserId= appData.user.id;
          
            return UserId; 
        } 
  }
  return (
    <>
        <nav className="main-header navbar navbar-expand navbar-light border border-light shadow  border-top-0  border-left-0 border-right-0 navbar-light text-sm">
          <ul className="navbar-nav">
            <li className="nav-item">
            <Link className="nav-link" data-widget="pushmenu" to={"/admin"} role="button"><i className="fas fa-bars"></i></Link>
            </li>
            <li className="nav-item d-none d-sm-inline-block">
              <Link to={"/"} className="nav-link">TownSend University</Link>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <div className="btn-group nav-link">
                    <button type="button" className="btn btn-rounded badge badge-light dropdown-toggle dropdown-icon" data-toggle="dropdown">
                      <span><img src={adminImage} className="img-circle elevation-2 user-img" alt="User Image"/></span>
                      <span className="ml-3">Adminstrator Admin</span>
                      <span className="sr-only">Toggle Dropdown</span>
                    </button>
                    <div className="dropdown-menu" role="menu">
                      <Link className="dropdown-item" to={"/users/"+getUserId()}><span className="fa fa-user"></span> My Account</Link>
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
