/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import HeaderNav from '../../components/Header/Nav/HeaderNav';
import Aside from '../../components/Header/Menu/Aside';
import { Link, useParams } from 'react-router-dom';
import ApiServices from '../../../services/WebServices';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate } from 'react-router-dom';

const CreateQuestionBySerialNumber = () => {
  const { examinationId, serialNumber } = useParams();
  const [inputCount, setInputCount] = useState(serialNumber);
  const [errors, setErrors] = useState(Array.from({ length: inputCount }, () => ({}))); // Track errors for each input field
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
      const fetchData = async () => {
        try {
            const userContainer = localStorage.getItem('OAappData');
            // Parse the JSON string to an object
            const appData = JSON.parse(userContainer);
            if ((appData && Object.prototype.hasOwnProperty.call(appData, 'OAuser'))) {
                if ((appData && Object.prototype.hasOwnProperty.call(appData.OAuser, "BaseRole"))) {
                    if (appData.OAuser.BaseRole != "" || appData.OAuser.BaseRole != null) {
                        const response = await ApiServices.VerifyExamExistence(examinationId);
                      if (response.status !=null && response.status ==200) {
                        if (response.data.totalQuestions == serialNumber) {
                            setLoading(false);
                        } else {
                          toast.warning('Sorry, Invalid Serial Number.')
                          setLoading(true);
                        }
                      } else {
                        toast.warning('Sorry, This examination ID is invalid to our system.')
                        setLoading(true);
                      } 
                    } else {
                       setLoading(true); 
                    }
                }else {
                    setLoading(true); 
                }
            }else {
                setLoading(true); 
            }
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false);
        }
      };
        fetchData();
  }, [examinationId, serialNumber]);
  
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all input fields
    const newErrors = [];

    for (let i = 0; i < inputCount; i++) {
      const questionField = document.querySelector(`#question${i + 1}`);
      const optionAField = document.querySelector(`#option${i + 1}A`);
      const optionBField = document.querySelector(`#option${i + 1}B`);
      const optionCField = document.querySelector(`#option${i + 1}C`);
      const optionDField = document.querySelector(`#option${i + 1}D`);
      const answerField = document.querySelector(`#answer${i + 1}`);

      const questionValue = questionField.value.trim();
      const optionAValue = optionAField.value.trim();
      const optionBValue = optionBField.value.trim();
      const optionCValue = optionCField.value.trim();
      const optionDValue = optionDField.value.trim();
      const answerValue = answerField.value.trim();

      // Check if any field is empty
      if (!questionValue || !optionAValue || !optionBValue || !optionCValue || !optionDValue || !answerValue) {
        newErrors[i] = { message: 'All fields are required' };
      } else {
        newErrors[i] = {}; // No error for this input
      }
    }

    setErrors(newErrors);

    // If there are no errors, you can proceed with form submission
    const hasError = newErrors.some((error) => Object.keys(error).length > 0);
    if (!hasError) {
        // Collect form data
        const formData = [];
        for (let i = 0; i < inputCount; i++) {
            const questionField = document.querySelector(`#question${i + 1}`);
            const optionAField = document.querySelector(`#option${i + 1}A`);
            const optionBField = document.querySelector(`#option${i + 1}B`);
            const optionCField = document.querySelector(`#option${i + 1}C`);
            const optionDField = document.querySelector(`#option${i + 1}D`);
            const answerField = document.querySelector(`#answer${i + 1}`);

            const questionValue = questionField.value.trim();
            const optionAValue = optionAField.value.trim();
            const optionBValue = optionBField.value.trim();
            const optionCValue = optionCField.value.trim();
            const optionDValue = optionDField.value.trim();
            const answerValue = answerField.value.trim();

            // Add current question data to formData array
            formData.push({
                question: questionValue,
                options: [optionAValue, optionBValue, optionCValue, optionDValue],
                correctAnswer: answerValue,
            });
        }
        //save to db
        saveForm(formData, examinationId, serialNumber)
    }
  };
  
    const saveForm = async (data, examinationId, qn) => {
      const PostRequest = await ApiServices.saveExaminationSettings(data, examinationId, qn)
     
      if (PostRequest.status == 200 || PostRequest.status==201) {
        //redirect or refresh
        toast.success("Examination questions have been created succesfully.")
        setInterval(() => {
          window.location.href="/exam_setup"
        }, 300);
      } else {
        //log error
        toast.warning("Sorry something went wrong.")
      }
    }

  return (
    <>
      <HeaderNav />
      <Aside />
      <ToastContainer />
      {loading ? (
        <>
          <div className="spin" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <div className="custom-loader"></div>
          </div>
        </>
              
      ) : (
          <>
            <div className="content-wrapper">
        <section className="content-header bd-762Qa">
          <ol className="breadcrumb">
            <li><a href="#"><i className="fa fa-home"></i> Home</a></li>
            <li className="active">Application</li>
            <li className="active">Student Profile</li>
          </ol>
          <div className="pull-left mt-5">
            <Link to="/exam_setup">
              <button type="button" className="btn btn-sm btn-flat btn-secondary">
                <i className="fa fa-arrow-left"></i> Go Back
              </button>
            </Link>
          </div>
        </section>
        <section className="content mt-5 mb-5 text-dark">
          <section className="content text-dark mt-2">
            <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
              <div className="defaultCard mb-5 pb-5">
                <div className="defaultCardHeader">
                  <div className="pull-left">
                    <i className="fa fa-users bg-r" aria-hidden="true"></i>
                    <span className="bolder-3 bg-r">Manage Exams Data</span>
                  </div>
                </div>
                <div className="field_wrapper">
                  <form onSubmit={handleSubmit}>
                    {Array.from({ length: inputCount }, (_, index) => (
                      <div key={index} className="container mt-3">
                        <div className="col-md-12">
                          <label className='input-label' htmlFor={`question${index + 1}`}>Question {index + 1}:</label>
                          <textarea id={`question${index + 1}`} className="form-control" placeholder={`Write question number ${index + 1} here...`} />
                          {errors[index] && errors[index].message && <p className="error">{errors[index].message}</p>}
                        </div>
                        {/* Option list */}
                        <div className="col-md-12">
                          <label className='input-label' htmlFor={`option${index + 1}A`}>Option {index + 1}A:</label>
                          <input id={`option${index + 1}A`} className="form-control input-md" type="text" />
                        </div>
                        <div className="col-md-12">
                          <label className='input-label' htmlFor={`option${index + 1}B`}>Option {index + 1}B:</label>
                          <input id={`option${index + 1}B`} className="form-control input-md" type="text" />
                        </div>
                        <div className="col-md-12">
                          <label className='input-label' htmlFor={`option${index + 1}C`}>Option {index + 1}C:</label>
                          <input id={`option${index + 1}C`} className="form-control input-md" type="text" />
                        </div>
                        <div className="col-md-12">
                          <label className='input-label' htmlFor={`option${index + 1}D`}>Option {index + 1}D:</label>
                          <input id={`option${index + 1}D`} className="form-control input-md" type="text" />
                        </div>
                        <div className="col-md-12 mb-4">
                          <label className='input-label' htmlFor={`answer${index + 1}`}>Choose Correct Answer {index + 1}:</label>
                          <select id={`answer${index + 1}`} className="form-control input-md">
                            <option value="">Select answer for question {index + 1}</option>
                            <option value="a">option a</option>
                            <option value="b">option b</option>
                            <option value="c">option c</option>
                            <option value="d">option d</option>
                          </select>
                        </div>
                      </div>
                    ))}
                    <div className="ml-3 mr-3">
                      <button type="submit" className='btn btn-primary pull-left w-100'>Save Question</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
        </>
      )}
      
    </>
  );
};

export default CreateQuestionBySerialNumber;
