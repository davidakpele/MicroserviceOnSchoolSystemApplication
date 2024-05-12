
import Header from "./components/Header/Header"
import { Link } from "react-router-dom";
import style from './initiateOnlinePayment.module.css'
import Footer from "./components/Footer/Footer";
import { useEffect } from 'react';

const initialPayment = () => {

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    document.title = 'Student Payment Portal';
  }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
    }
      // set header title

  return (
    <>
      <div className={style.bg}>
        <Header/>
        <div className={style.container}>
            <h2>Pay Online</h2>
        </div>
          <div id="payment__validate" className={style.payment__validate}>
            <div className="loading">
                <div className={[style.loader, style.loadingStyle].join(' ')}>Loading...</div>
            </div>
          </div>
          <div className="auth-container ui-auth-widget">
            <div id="errorMessage" className={[style.error, style.error_ico].join(' ')} style={{ display: 'none' }}></div>
            <div id="success" className={style.SuccessMessage}></div>
            <form method="POST" id="InitiateOnlinePayment" autoComplete="off" onSubmit={handleSubmit}>
                <div className="element">
                    <label className={style.label}>Reference No </label>
                    <input name="RefNo" type="text" id="RefNo" defaultValue=""/>
                </div>
                <div className="element" >
                    <input name="submit" type="submit" id="submit" value="Continue" style={{background: 'rgb(35, 131, 173)', height:'40px'}} />
                </div>
            </form>
          </div>
           <div className={style.Option_Contact}  style={{marginTop: '20px', width: '100%'}}><p>Contact the administrator <Link to={ '#' }>Support</Link></p></div>
            <br className="clear" />
            <br className="clear" />
        <Footer/>
    </div>
    </>
  )
}

export default initialPayment
