import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/fontawesome-free-regular';
import '../assets/css/ui.css'
import logo from '../assets/img/logo.png'
import Banner1 from '../assets/img/s.jpg'
import Banner2 from '../assets/img/cia.jpg'
import Banner3 from '../assets/img//b3.jpg'
import Banner4 from '../assets/img/b.jpg'
import Banner5 from '../assets/img/r.jpg'
import Services from "../services/ApiServices";
import Style from './Login.module.css'
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleTogglePassword  = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }
  const handleSubmit = async (e) => {
  e.preventDefault();
    // Simple validation
    if (!email) {
      emailRef.current.focus();
      setError('Please enter your email/username.');
      return false;
    }
    if (!password) {
      passwordRef.current.focus();
      setError('Please enter your password.');
      return false;
    }
    // Simulating a POST request (replace with actual API endpoint)
    try {
      const response = await Services.authenticate_({ "email":email, "password":password })
      if (!response.ok) {
        setError('Invalid credentials. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  useEffect(() => {
      const scriptUrls = [
      '/src/assets/js/jquery-3.6.0.js',
      '/src/assets/js/bootstrap.min.js',
    ];
    scriptUrls.forEach((url) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      document.head.appendChild(script);
    });
    return () => {
      scriptUrls.forEach((url) => {
        const script = document.querySelector(`script[src="${url}"]`);
        if (script) {
          document.head.removeChild(script);
        }
      });
    };
  }, []);
  useEffect(() => {
    // Add scripts to the bottom of the component
    const scriptUrls = [
      '/src/assets/js/jquery2.js',
    ];

    scriptUrls.forEach((url) => {
      const script = document.createElement('script');
      script.src = url;
      document.body.appendChild(script); // Add script to the body
    });

    return () => {
      scriptUrls.forEach((url) => {
        const script = document.querySelector(`script[src="${url}"]`);
        if (script) {
          document.body.removeChild(script);
        }
      });
    };
    }, []);
  return (
    <>
     <div className="s-background animated fadeIn">
        <div className="gradients">
          <div className="blue"></div>
        </div>
            <img className="slider img-responsive" src={Banner1}/>
            <img className="slider img-responsive" src={Banner2}/>
            <img className="slider img-responsive" src={Banner3}/>
            <img className="slider img-responsive" src={Banner4}/>
            <img className="slider img-responsive" src={Banner5}/>
        </div>
        <div className="mt-5 text-center" style={{marginTop:'40em'}}>
          <img src={logo} className="img-responsive mb-3" />
          <h1 className={`${Style._3jk23fSAW}`}>Mercy College University Of Nigeria</h1>
          <h1 className={`${Style._23kQAkj}`}>Administration Login</h1>
        </div>
        <div className="items">
          <div className="mini-container login-widget"> 
            <div className="container__login">
              {error && <div id="AdminLoginerrorMessage" className="error error-ico">{error}</div>}
                <form method="POST" onSubmit={handleSubmit} id="__AdminBoxText" className="form-group" autoComplete="off" >
                  <div className="row p-0">
                    <div className="col-md-12 col-sm-12 col-xs-12 col-md-offset-0">
                      <div className="col-12 p-0 px-4"> 
                        <span className={`${Style._m3nK872}`}>Email Address:</span> 
                      </div>
                      <div className="col-12 p-0 px-4"> 
                        <input ref={emailRef} type="email" value={email} onChange={(e) => setEmail(e.target.value)}  name="username" className="form-control" placeholder="Email" />
                      </div>
                      <div className="col-12 p-0 px-4"> 
                        <span className={`${Style._m3nK872}`}>Password:</span> 
                      </div>
                      <div className="col-12 p-0 px-4"> 
                      <div className="form-input-group ">
                        <input ref={passwordRef}  autoComplete='off' type={isPasswordVisible ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}  name="password" className="form-control"  placeholder="Password" />
                       <FontAwesomeIcon
                          icon={isPasswordVisible ? faEye : faEyeSlash}
                          className={`${Style._78k81n} fa fa-eye-slash`}
                          onClick={handleTogglePassword}
                        />
                      
                      </div>
                        <button className={`${Style._primary_btn} btn w-100`} value="Login" type="submit" style={{width:'20%'}}>
                            <i className="fa fa-sign-in"></i>Login
                        </button> 
                      </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
  </div>
  <div className="_container footer-wrap" >
    <div className="row d-flex" style={{display:'flex'}}>
        <div className="col-md-6 col-sm-6 text-left footer-left pull-left">
            <p style={{color:'black'}}>&copy; All Right Reserved</p> 
        </div>
        <div className="col-md-6 col-sm-6 text-right footer-right pull-right">
            <p style={{color:'#f03c02'}}>Powered by 
                <a href="#" style={{ color: '#2383ad', textDecoration: 'underline' }}> MidTech</a>
            </p>     
        </div>
    </div>
</div>
    </>
  )
}

export default Login
