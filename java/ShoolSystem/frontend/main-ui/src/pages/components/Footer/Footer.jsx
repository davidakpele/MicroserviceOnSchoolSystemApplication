import { useEffect, useState } from "react";
import Style from './Footer.module.css'

const Footer = () => {
    const [showAdditionalFields, setShowAdditionalFields] = useState(true);
    const textRight = showAdditionalFields ? 'text-right' : '';
    useEffect(() => {
        const handleResize = () => {
        setShowAdditionalFields(window.innerWidth > 1165);
        };

        // Initial check on mount
        handleResize();

        // Attach the event listener
        window.addEventListener('resize', handleResize);

        // Clean up the event listener on unmount
        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }, []);
  return (
    <>
        <div className={`${Style.footerContent} container-fluid`}>
            <div className="container-fluid" >
                <div className="row">
                    <div className="col-sm-6 footer-left pull-left">
                        <p style={{ color: '#b9b9b9', fontSize:'13px' }}>&copy; All Right Reserved</p>
                    </div>
                    <div className={`col-sm-6 footer-right pull-right  ${textRight}`}>
                        <p style={{ color: '#b9b9b9', fontSize:'13px' }}>Powered by <a href="https://www.MidTech.digital/" style={{ textDecoration: 'none' }}>MidTech Pvt Ltd</a></p>
                    </div>
                </div>
            </div>
        </div>  
    </>
  )
}

export default Footer
