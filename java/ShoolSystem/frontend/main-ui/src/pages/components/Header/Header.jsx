import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/structure.css";
import "../../../assets/css/responsive.css";
import '../../../assets/css/font-awesome/css/all.css';
import logo from "../../../assets/images/logo.png";

import { Link } from "react-router-dom"
const Header = () => {
  return (
    <>
      <div className='Header'>
        <div id="head">
            <div className="container-fluid">
                <div className="row">
                <div className="col-md-12">
                    <Link to={"/"}>
                        <div className="float-left">
                            <span>
                            <img src={logo} className="img-responsive center" alt="logo" />
                            </span>
                        </div>
                    </Link>
                </div>
                <br className="clear" />
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Header
