import { Link } from "react-router-dom"
import logo from '../../../../assets/img/logo-extra.png'
const Aside = () => {
  return (
    <>
      <aside className="main-sidebar sidebar-dark-primary aside-gb elevation-4 sidebar-no-expand">
      <Link to={'/'} className="brand-link bg-vbody text-sm">
        <img src={logo} alt="Store Logo" className="brand-image img-circle elevation-3" style={{ width: "1.7rem", height: " 1.7rem", maxHeight: "unset" }} />
      <span className="brand-text font-weight-light">POMS-PHP</span>
      </Link>
      <div className="sidebar os-host os-theme-light os-host-overflow os-host-overflow-y os-host-resize-disabled os-host-transition os-host-scrollbar-horizontal-hidden">
        <div className="os-resize-observer-host observed">
          <div className="os-resize-observer" style={{ left: "0px", right: "auto" }}></div>
        </div>
        <div className="os-size-auto-observer observed" style={{height: "calc(100% + 1px)", float: "left"}}>
          <div className="os-resize-observer"></div>
        </div>
        <div className="os-content-glue" style={{ margin: " 0px -8px", width: "249px", height: "646px" }}></div>
        <div className="os-padding">
          <div className="os-viewport os-viewport-native-scrollbars-invisible" style={{overflowY: "scroll"}}>
            <div className="os-content" style={{height:"100%", width: "100%"}}>
              <div className="tstar">
                <div className="d-flex gap-3 ml-3 mt-1">
                <div className="btn btn-flat btn-success">
                  <i className="nav-icon fas fa-signal"></i>
                </div>
                <div className="btn btn-flat btn-primary" style={{width:"auto"}}>
                  <i className="nav-icon fas fa-clock"></i>
                </div>
                <div className="btn btn-flat btn-warning btn-xs">
                  <i className="nav-icon fas fa-user-plus" style={{color:'#fff'}}></i>
                </div>
                <div className="btn btn-flat btn-danger btn-xs">
                  <i className="nav-icon fas fa-cogs"></i>
                </div>
              </div>
              </div>
              
              <div className="clearfix"></div>
                <nav className="mt-4">
                  <ul className="sidebar-menu tree" data-widget="tree">
                    <li className="header">MAIN MENU</li>
                        <li className="active">
                          <Link to={'/'}>
                            <i className="fa fa-dashboard"></i> 
                            <span>Dashboard</span>
                          </Link>
                        </li>
                        <li className="">
                            <Link to={"/students"}>
                                <i className="fa fa-bars"></i> 
                                <span>Students</span>
                            </Link>
                        </li>
                        <li className="">
                            <Link to={"/mark_attendance"}>
                                <i className="fa fa-bars"></i>
                                <span>Mark Attendance</span>
                            </Link>
                        </li>
                        <li className="">
                            <Link to={"/attendance_records"}>
                                <i className="fa fa-bars"></i>
                                <span>Attendance Record`s</span>
                            </Link>
                        </li>
                        <li className="">
                            <Link to={"/attendance_report"}>
                                <i className="fa fa-bars"></i>
                                <span>Attendance Report</span>
                            </Link>
                        </li>
                        <li className="">
                            <Link to={"/exam_setup"}>
                                <i className="fa fa-bars"></i>
                                <span>Exam SetUp</span>
                            </Link>
                        </li>
                        <li className="header">ADMINISTRATOR</li>
                          <li className="">
                            <Link to={"/settings"} rel="noopener noreferrer">
                              <i className="fa fa-cogs"></i> <span>Settings</span>
                            </Link>
                          </li>
                    </ul>
                </nav>
            </div>
          </div>
        </div>
        <div className="os-scrollbar os-scrollbar-horizontal os-scrollbar-unusable os-scrollbar-auto-hidden">
          <div className="os-scrollbar-track">
            <div className="os-scrollbar-handle" style={{ width: "100%", transform: "translate(0px, 0px)" }}></div>
          </div>
        </div>
        <div className="os-scrollbar os-scrollbar-vertical os-scrollbar-auto-hidden">
          <div className="os-scrollbar-track">
            <div className="os-scrollbar-handle" style={{ height: "55.017%", transform: "translate(0px, 0px)" }}></div>
          </div>
        </div>
        <div className="os-scrollbar-corner"></div>
      </div>
    </aside>
    </>
  )
}

export default Aside
