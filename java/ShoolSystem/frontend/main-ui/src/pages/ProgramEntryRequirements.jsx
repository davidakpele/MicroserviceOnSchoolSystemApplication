import "../assets/css/login.css";
import Footer from "./components/Footer/Footer";
import Header from './components/Header/Header';
import { useEffect, useState } from "react";

const ProgramEntryRequirements = () => {
    const [showAdditionalFields, setShowAdditionalFields] = useState(true);
    const additionalFieldsClassName = showAdditionalFields ? 'd-flex justify-content-center' : '';
    const textRight = showAdditionalFields ? 'text-right' : '';
    const handleChange = (event) => {
        event.preventDefault();
        
    };

    const handleProgramChange = (event) => {
        event.preventDefault();
       
    };
    useEffect(() => {
        document.title = 'Program Entry Requirements';
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
        <Header />
          <div className="single">
            <div className="panel" style = {{maxWidth: '960px',width: '100%',margin: '0 auto',border: '1px solid #DDDDDD'}} >
                <h2 className="hStyle">Check Any Programme Requirements</h2>
                <div className = "panel-in ">
                    <form method="POST" className="form-group ">
                        <div className="form-ui-panel">
                            <div className={`pane form-group  ${additionalFieldsClassName}`}>
                                <label id="apptypelabel" className="col-sm-12 col-md-3 col-lg-3 make-full">ApplicationType:</label>
                                <div className="col-sm-12 col-md-9 col-lg-9 select-drop-down">
                                    <select onChange={handleChange} className="form-control" name="Application__Type" id="Application__Type" style={{ width: '75%' }}>
                                        <option value="">--Select--</option>
                                        <option id="1" value="1">Distance Learning Institute </option>
                                        <option id="2" value="2">Postgraduate </option>
                                        <option id="3" value="3">Undergraduate </option>
                                    </select>
                                </div>
                            </div>
                            <div className={`pane mt-3 form-group  ${additionalFieldsClassName}`}>
                                <label className="col-sm-12 col-md-3 col-lg-3 make-full">Programme :</label>
                                <div className="col-sm-12 col-md-9 col-lg-9 select-drop-down">
                                    <select onChange={handleProgramChange} name="Program__Type" id="Program__Type" className="form-control" style={{ width: '75%' }}>
                                        <option value="" >--select--</option>
                                    </select>
                                </div>
                            </div>
                            <div id="generaldiv">
                                <div id="RequirementDiv"></div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
            {/* footer div starts here */}
        <Footer textRight={textRight}/>    
        </>
        )
}

export default ProgramEntryRequirements
