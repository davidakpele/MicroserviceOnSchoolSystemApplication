import Header from "./components/Header/Header"
import { useEffect } from "react";
import { Link } from "react-router-dom";
const Default = () => {
  useEffect(() => {
    document.title = 'University of Madras | Application Portal';
  }, []);
  return (
    <>
      <Header />
      <div className="body">
        <div className="container">
          <div className="row mt-5">
              <div className="col-md-4 app-btn-cta">
                <Link  to={'/auth/register'} id="link">
                  <div className="col-12 text-center" style={{border:'1px solid #ddd', borderRadius:'3px'}}>
                    <span><i className="fa fa-compress fa-3x" style={{ color:'#2383ad'}}></i></span>
                    <h2 style={{marginBottom:'60px'}}>Start a Fresh Application</h2>
                  </div>
                </Link>
              </div> 
              <div className="col-md-4 app-btn-cta">
                <Link to={'/auth/login'} className="link">
                  <div className="col-12 text-center" style={{border:'1px solid #ddd', borderRadius:'3px'}}>
                    <span><i className="fa fa-recycle fa-3x" style={{ paddingBottom:'1px', color:'#2383ad'}}></i></span>
                    <h2>Student Login Portal</h2>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 app-btn-cta">
                <Link to={'/initialPayment'} id="link">
                  <div className="col-12 text-center" style={{border:'1px solid #ddd', borderRadius:'3px'}}>
                    <span><i className="fa fa-credit-card fa-3x" style={{ paddingBottom:'1px', color:'#2383ad'}}></i></span>
                      <h2>Pay Application Fee Online</h2>
                  </div>
                </Link>
              </div>
            </div>
            <div className="container-fluid" style={{ marginTop: '70px', marginBottom: '90px' }}>
              <div className="row text-center">
                <div className="col-12 cta-btn">
                  <Link to={'/programmeEntryRequirements'}><button className="btn btn-danger btn-sm" type="button">Click To View Programmes&#39; Entry Requirements</button></Link>
                  <br className="clear" />
                </div>
              </div>
            </div>
          </div>    
      </div>
    </>
  )
}

export default Default
