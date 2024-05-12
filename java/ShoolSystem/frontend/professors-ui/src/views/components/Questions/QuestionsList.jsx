/* eslint-disable react/prop-types */


/* eslint-disable no-unused-vars */
import HeaderNav from '../../components/Header/Nav/HeaderNav';
import Aside from '../../components/Header/Menu/Aside';
import { useEffect, useState, useRef, useMemo} from 'react';
import { Link, useNavigate, useParams} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApiServices from "../../../services/WebServices";
import JoditEditor from 'jodit-react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Pagination } from 'react-bootstrap';
import Swal from 'sweetalert2';

export const QuestionsList = () => {
    const [modalShow, setModalShow] = useState(false);
    const [editmodalShow, setEditModalShow] = useState(false);
    const { id } = useParams();
    const navigateHistory = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formErrors, setFormErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(3);
    const [data, setData] = useState({
        'questions': [],
        'settings':''
    })
    const editor = useRef(null);
	const [content, setContent] = useState('');
    const [formData, setFormData] = useState({
        question: '',
        options1: '',
        options2: '',
        options3: '',
        options4: '',
        answer: '',
        points: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const HandleSubmitForm = (e) => {
        e.preventDefault()
        const errors = validateCreateExaminationQuestion(formData);
        setFormErrors(errors);
    }

    const HandleEditSubmitForm = (e) => {
        e.preventDefault()
        const errors = validateEditExaminationQuestion(formData);
        setFormErrors(errors);
    }

    const validateCreateExaminationQuestion= (formData)=> {
        let errors = {};
        
        if (!content || content == "") {
            errors.question = 'Question field is required';
        }
        
        if (!formData.options1) {
            errors.options1 = 'Option A field is required';
        }
        if (!formData.options2) {
            errors.options2 = 'Option B field is required';
        }
        if (!formData.options3) {
            errors.options3 = 'Option C field is required';
        }
        if (!formData.options4) {
            errors.options4 = 'Option D field is required';
        }
        if (!formData.answer) {
            errors.answer = 'Answer field is required';
        }
        if (!formData.points) {
            errors.points = 'Point field is required';
        }
        if (content || content !=="" && formData.options1 && formData.options2 && formData.options3 && formData.options4 && formData.answer != "" && formData.points) {
            formData.question = removeHtmlEntities(content);
            FireQuestionSave(formData, id)
        }
        return errors;
    }

    const validateEditExaminationQuestion= (formData)=> {
        let errors = {};
        
        if (!content || content == "" || !formData.question && formData.question =='') {
            errors.question = 'Question field is required';
        }
        
        if (!formData.options1) {
            errors.options1 = 'Option A field is required';
        }
        if (!formData.options2) {
            errors.options2 = 'Option B field is required';
        }
        if (!formData.options3) {
            errors.options3 = 'Option C field is required';
        }
        if (!formData.options4) {
            errors.options4 = 'Option D field is required';
        }
        if (!formData.answer) {
            errors.answer = 'Answer field is required';
        }
        if (!formData.points) {
            errors.points = 'Point field is required';
        }
        if (content || content !=="" && formData.options1 && formData.options2 && formData.options3 && formData.options4 && formData.answer != "" && formData.points) {
            // formData.question = removeHtmlEntities(content);
            SendEditQuestionSave(formData)
            
        }
        return errors;
    }

    const removeHtmlEntities=(text) =>{
       // Regular expression to match HTML tags
        const htmlTagRegex = /<[^>]+>/g;
        // Replace HTML tags with an empty string
        return text.replace(htmlTagRegex, '');
    }

    const FireQuestionSave = async (formData,id) => {
        const saveQuestion = await ApiServices.createNewQuestion(formData, id)
        if (saveQuestion == 201) {
            toast.success("New Question Successfully Created.")
            fetchData();
            setModalShow(false)
            setFormData({question: '',
                options1: '',
                options2: '',
                options3: '',
                options4: '',
                answer: '',
                points: ''
            })
            setContent("")
        } else {
            toast.warning("Sorry. something went wrong.!");
        }
    }
    
    const SendEditQuestionSave = async (formData) => {
        const saveQuestion = await ApiServices.updateQuestion(formData)
        if (saveQuestion == 201) {
            toast.success("Question Successfully Updated.")
            fetchData();
            setModalShow(false);
            setEditModalShow(false);
            setFormData({question: '',
                options1: '',
                options2: '',
                options3: '',
                options4: '',
                answer: '',
                points: ''
            })
            setContent("")
        } else {
            toast.warning("Sorry. something went wrong.!");
        }
    }
    
    const fetchData = async () => {
        try {
            const userContainer = localStorage.getItem('OAappData');
            // Parse the JSON string to an object
            const appData = JSON.parse(userContainer);
            if ((appData && Object.prototype.hasOwnProperty.call(appData, 'OAuser'))) {
                if ((appData && Object.prototype.hasOwnProperty.call(appData.OAuser, "BaseRole"))) {
                    if (appData.OAuser.BaseRole != "" || appData.OAuser.BaseRole != null) {
                        const response = await ApiServices.getAllQuestionsCollections(id);
                        setData({
                            questions: response.data.questions,
                            settings: response.data.settings
                        });
                        setLoading(false);
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

    const editQuestion = async (id) => {
        try {
            const requestData = await ApiServices.editQuestionById(id);
            if (requestData.status == 200) {
                var ChosenOption = '';
                if (requestData.data.answers[0].answer == requestData.data.options[0].options) {
                    ChosenOption = 'a';
                } else if (requestData.data.answers[0].answer == requestData.data.options[1].options) {
                    ChosenOption = 'b';
                }else if (requestData.data.answers[0].answer == requestData.data.options[2].options) {
                    ChosenOption = 'c';
                }else if (requestData.data.answers[0].answer == requestData.data.options[3].options) {
                    ChosenOption = 'd';
                } else {
                    ChosenOption = 'a';
                }
                setFormData({
                    question: requestData.data.question.questions,
                    options1:  requestData.data.options[0].options,
                    options2: requestData.data.options[1].options,
                    options3: requestData.data.options[2].options,
                    options4: requestData.data.options[3].options,
                    answer: ChosenOption,
                    OldAnswer: requestData.data.answers[0].answer,
                    points: requestData.data.question.questionPoints,
                    questionsId: requestData.data.question.questionsId
                })
                setContent(requestData.data.question.questions)
            } else {
                toast.warning("Question not found.")
            }
        } catch (error) {
            toast.warning("Something went wrong. Please check your network connections.")
        }
        setEditModalShow(true)
        setModalShow(false)
    }

    const OpenCreateQuestion = async (id) => {
        setModalShow(true)
        setEditModalShow(false)
    }

    const CloseCreateQuestion = async (id) => {
        setModalShow(false)
        setEditModalShow(false)
    }

    const deleteQuestion = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: 'You will not be able to recover this question!',
            icon: 'warning',
            type: "question",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            background: '#fff',
            backdrop: `rgba(0,0,123,0.4)`,
            confirmButtonText: 'Yes, Delete!',
            // using theN & done promise callback
        }).then(async (result) => {
            if (result.isConfirmed) {
                const requestDelete = await ApiServices.deleteQuestionById(id);
                if (requestDelete == 200) { 
                    fetchData();
                    toast.success("Question successfully deleted.")
                } else {
                    toast.warning("Something went wrong.")
                }
            }
        })
       
    }

    const closeEditModal = () => {
        setFormData({question: '',
        options1: '',
        options2: '',
        options3: '',
        options4: '',
        answer: '',
            points: ''
        })
        setEditModalShow(false)
        setModalShow(false)
        setContent("")
        setFormErrors("");
    }
  
    const OnChangeEditInput = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name] : value});
    };
     // Calculate the index of the last item to display on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    // Calculate the index of the first item to display on the current page
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // Get the current items to display based on pagination
    const currentItems = data.questions.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
       return `${year}-${month}-${day}`;
    }; 
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
              
                  <div className="content-wrapper" >
                      <section className="content-header bd-762Qa">
                          <ol className="breadcrumb">
                              <li><a href="#"><i className="fa fa-home"></i> Home </a></li>
                              <li className="active">Examination </li>
                              <li className="active">Questions List</li>
                          </ol>
                      </section>
                        <section className="content container-fluid">
                            <div className="content py-3">
                                <div className="card card-outline card-primary rounded-0 shadow">
                                    <div className="card-header">
                                        <h5 className="card-title">Exam Course Code - {data.settings.examTitle}</h5>
                                        <div className="card-tools">
                                            <Link className="btn btn-flat btn-sm btn-default" to={"/exam_setup"} style={{background:'#f4f4f4', color:'#444',borderColor: '#ddd'}}><i className="fa fa-angle-left"></i> Back</Link>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="containder-fluid">
                                            <div className="row">
                                                <div className="col-lg-4 col-md-5 col-sm-12">
                                                    <div className="callout callout-cal_info rounded-0 shadow">
                                                        <dl>
                                                            <dt className="text-muted">Title</dt>
                                                            <dd className="pl-3"><b>{data.settings.examTitle}</b></dd>
                                                            <dt className="text-muted">Total Question</dt>
                                                            <dd className="pl-3"><b>{data.settings.totalQuestions}</b></dd>
                                                            <dt className="text-muted">Start End</dt>
                                                            <dd className="pl-3"><b>{data.settings.startTime}</b></dd>
                                                            <dt className="text-muted">End Time</dt>
                                                            <dd className="pl-3"><b>{data.settings.endTime}</b></dd>
                                                            <dt className="text-muted">Duration</dt>
                                                            <dd className="pl-3"><b>{data.settings.duration}</b></dd>
                                                            <dt className="text-muted">Date</dt>
                                                            <dd className="pl-3"><b>{formatDate(data.settings.dueDate)}</b></dd>
                                                            <dt className="text-muted">Status</dt>
                                                            {data.settings.status ? (<> 
                                                            <dd className="pl-3">
                                                                <span className="badge badge-success bg-gradient-success rounded-pill px-3">Activated</span>
                                                            </dd></>):(<>
                                                            <dd className="pl-3">
                                                                <span className="badge badge-default bg-gradient-default rounded-pill px-3">Unactivated</span>
                                                            </dd>
                                                            </>)}
                                                        
                                                        </dl>
                                                    </div>
                                                </div>
                                                <div className="col-lg-8 col-md-7 col-sm-12">
                                                    <div className="d-flex mb-2 align-items-end">
                                                        <div className="col-auto flex-shrink-1 flex-grow-1">
                                                            <h4 className="card-title">Question(s)</h4>
                                                        </div>
                                                        <div className="col-auto">
                                                            <button className="btn btn-flat btn-sm btn-default bg-navy" id="new_question" onClick={OpenCreateQuestion}><i className="fa fa-plus"></i> Add Question</button>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    {currentItems.map((question, index) => (
                                                        <div key={question.id} className="list-group mt-3" id="question-list">
                                                                <div key={question.id} className="list-group-item question-item">
                                                                    <div className="d-flex align-items-top">
                                                                        <div className="number">
                                                                            <span className="font-weight-bolder" style={{ fontWeight: "600", fontSize: "15px", marginRight: "12px" }}>
                                                                                [{index + 1}]
                                                                            </span>
                                                                        </div>
                                                                        <div className="col-auto flex-shrink-1 flex-grow-1">
                                                                            <div className="question_text">
                                                                                <p>
                                                                                    <span style={{ color: 'rgb(0, 0, 0)', fontFamily: "Open Sans, Arial, sans-serif", fontSize: '14px', textAlign: "justify" }}>
                                                                                        {question.questions}
                                                                                    </span>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        {question.options.map((option) => (
                                                                            <div key={option.id} className="col-sm-12" >
                                                                                <div className="d-flex">
                                                                                     <span className="mx-2 text-center">
                                                                                    {option.id === question.answerId ? (
                                                                                        <i className="nav-icon fa fa-check text-success"></i>
                                                                                    ) : (
                                                                                        <i className="nav-icon fa fa-times text-danger"></i>
                                                                                    )}
                                                                                </span><span className='mr-2'>&rarr;</span>
                                                                                <span style={{textAlign:'justify', alignItems:'initial'}}>{option.options}</span>
                                                                                </div>
                                                                               
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div className="pull-right d-flex gap-3">
                                                                                <div className="edit-section">
                                                                                    <button type="button" data-id={question.questionsId} onClick={()=>editQuestion(question.questionsId)} className="btn-flat mr-3 btn btn-xs btn-primary" style={{ padding: '0', margin: '0' }}>
                                                                                        <i className="fa fa-edit" style={{ padding: '0' }}></i>
                                                                                    </button>
                                                                                </div>
                                                                                <div className="delete-section">
                                                                                    <button type="button" onClick={()=>deleteQuestion(question.questionsId)} className="btn btn-xs" style={{ padding: '0.40px 5px', margin: '0', backgroundColor: '#dd4b39', borderColor: '#dd4b39', borderRadius: '0', borderWidth: '1px' }}>
                                                                                        <i className="fa fa-trash" style={{ padding: '0', color: '#fff' }}></i>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                    ))}
                                                {/* Pagination component */}
                                                    <div className="pagination-container mt-4">
                                                    <Pagination>
                                                        <Pagination.First onClick={() => paginate(1)} />
                                                        <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                                                        {[...Array(Math.ceil(data.questions.length / itemsPerPage)).keys()].map((number) => (
                                                        <Pagination.Item
                                                            key={number + 1}
                                                            active={number + 1 === currentPage}
                                                            onClick={() => paginate(number + 1)}>
                                                            {number + 1}
                                                        </Pagination.Item>
                                                        ))}
                                                        <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(data.questions.length / itemsPerPage)} />
                                                        <Pagination.Last onClick={() => paginate(Math.ceil(data.questions.length / itemsPerPage))} />
                                                    </Pagination>
                                                    </div> 
                                                {/*edit model  */}
                                                    <Modal show={editmodalShow} size="xl" animation={false}>
                                                        <Modal.Header closeButton onClick={closeEditModal}>
                                                            <Modal.Title id="contained-modal-title-vcenter" style={{fontSize:'20px'}}>Edit Question</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body> 
                                                        <form  method='Post' onSubmit={HandleEditSubmitForm}>
                                                            <div className="row">
                                                                <div className="col-md-8">
                                                                    <div className="form-group">
                                                                        <label htmlFor="Question" className='input-label'>Question:*</label>
                                                                        <textarea name="question" rows="12" className={`form-control ${formErrors.question ? 'is-invalid' : ''}`} defaultValue={formData.question}  onChange={(e)=>OnChangeEditInput(e)}></textarea>
                                                                        {formErrors.question && <div className="invalid-feedback">{formErrors.question}</div>}
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <fieldset>
                                                                        <div className="form-group">
                                                                            <label htmlFor="Option1" className='input-label'>Option A:</label>
                                                                            <textarea name="options1" rows="2" className={`form-control ${formErrors.options1 ? 'is-invalid' : ''}`} defaultValue={formData.options1}  onChange={(e)=>OnChangeEditInput(e)}></textarea>
                                                                            {formErrors.options1 && <div className="invalid-feedback">{formErrors.options1}</div>}
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="Option2" className='input-label'>Option B:</label>
                                                                            <textarea name="options2" rows="2" className={`form-control ${formErrors.options2 ? 'is-invalid' : ''}`} defaultValue={formData.options2}  onChange={(e)=>OnChangeEditInput(e)}></textarea>
                                                                            {formErrors.options2 && <div className="invalid-feedback">{formErrors.options2}</div>}
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="Option3" className='input-label'>Option C:</label>
                                                                            <textarea name="options3" rows="2" className={`form-control ${formErrors.options3 ? 'is-invalid' : ''}`} defaultValue={formData.options3}  onChange={(e)=>OnChangeEditInput(e)}></textarea>
                                                                            {formErrors.options3 && <div className="invalid-feedback">{formErrors.options3}</div>}
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="Option4" className='input-label'>Option D:</label>
                                                                            <textarea name="options4" rows="2" className={`form-control ${formErrors.options4 ? 'is-invalid' : ''}`} defaultValue={formData.options4}  onChange={(e)=>OnChangeEditInput(e)}></textarea>
                                                                            {formErrors.options4 && <div className="invalid-feedback">{formErrors.options4}</div>}
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="OldAnswer" className='input-label'>Choosed Answer:</label>
                                                                            <input type="text" name="OldAnswer" className={`form-control ${formErrors.OldAnswer ? 'is-invalid' : ''}`} defaultValue={formData.OldAnswer}  onChange={(e)=>OnChangeEditInput(e)} disabled readOnly/>
                                                                            {formErrors.OldAnswer && <div className="invalid-feedback">{formErrors.OldAnswer}</div>}
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="Answer" className='input-label'>Make a changes Ans:</label>
                                                                            <select name="answer" placeholder="Choose correct answer"  className={`form-control ${formErrors.answer ? 'is-invalid' : ''}`} defaultValue={formData.answer}  onChange={(e)=>OnChangeEditInput(e)}>
                                                                                <option value="">Select the correct answer</option>
                                                                                <option value="a">option A</option>
                                                                                <option value="b">option B</option>
                                                                                <option value="c">option C</option>
                                                                                <option value="d">option D</option> 
                                                                            </select>
                                                                            {formErrors.answer && <div className="invalid-feedback">{formErrors.answer}</div>}
                                                                        </div>
                                                                    </fieldset>
                                                                    <div className="form-group">
                                                                        <label htmlFor="Ans" className='input-label'>Question Point:</label>
                                                                        <input type="number" name="points" className={`form-control ${formErrors.points ? 'is-invalid' : ''}`} defaultValue={formData.points}  onChange={(e)=>OnChangeEditInput(e)} />
                                                                        {formErrors.points && <div className="invalid-feedback">{formErrors.points}</div>}
                                                                    </div>
                                                                </div> 
                                                            </div>
                                                        </form>
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <div className="d-flex gap-3">
                                                            <Button onClick={closeEditModal} className='btn btn-default btn-sm'>Close</Button>
                                                            <Button className='btn btn-primary' onClick={HandleEditSubmitForm}>Save Changes</Button>
                                                        </div>
                                                    </Modal.Footer>
                                                </Modal>
                                                      {/* close edit question modal */}
                                                      
                                                    {/* Create Question modal */}
                                                    <Modal show={modalShow} size="xl" animation={false}>
                                                        <Modal.Header closeButton onClick={CloseCreateQuestion}>
                                                            <Modal.Title id="contained-modal-title-vcenter">Add New Question</Modal.Title>
                                                        </Modal.Header>
                                                    <Modal.Body> 
                                                        <form  method='Post' onSubmit={HandleSubmitForm}>
                                                            <div className="row">
                                                                <div className="col-md-8">
                                                                    <div className="form-group">
                                                                        <label htmlFor="Question" className='input-label'>Main Question:*</label>
                                                                        <JoditEditor ref={editor} value={content} onChange={newContent => setContent(newContent)}/>
                                                                    </div>
                                                                <span style={{color:'#dc3545', fontSize: '.875em'}}>{formErrors.question}</span> 
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <fieldset>
                                                                        <div className="form-group">
                                                                            <label htmlFor="Option1" className='input-label'>Option A:</label>
                                                                            <textarea name="options1" rows="2" className={`form-control ${formErrors.options1 ? 'is-invalid' : ''}`} defaultValue={formData.options1}  onChange={(e)=>OnChangeEditInput(e)}></textarea>
                                                                            {formErrors.options1 && <div className="invalid-feedback">{formErrors.options1}</div>}
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="Option2" className='input-label'>Option B:</label>
                                                                            <textarea name="options2" rows="2" className={`form-control ${formErrors.options2 ? 'is-invalid' : ''}`} defaultValue={formData.options2}  onChange={(e)=>OnChangeEditInput(e)}></textarea>
                                                                            {formErrors.options2 && <div className="invalid-feedback">{formErrors.options2}</div>}
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="Option3" className='input-label'>Option C:</label>
                                                                            <textarea name="options3" rows="2" className={`form-control ${formErrors.options3 ? 'is-invalid' : ''}`} defaultValue={formData.options3}  onChange={(e)=>OnChangeEditInput(e)}></textarea>
                                                                            {formErrors.options3 && <div className="invalid-feedback">{formErrors.options3}</div>}
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="Option4" className='input-label'>Option D:</label>
                                                                            <textarea name="options4" rows="2" className={`form-control ${formErrors.options4 ? 'is-invalid' : ''}`} defaultValue={formData.options4}  onChange={(e)=>OnChangeEditInput(e)}></textarea>
                                                                            {formErrors.options4 && <div className="invalid-feedback">{formErrors.options4}</div>}
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="Answer" className='input-label'>Correct Ans:</label>
                                                                            <select name="answer" placeholder="Choose correct answer"  className={`form-control ${formErrors.answer ? 'is-invalid' : ''}`} defaultValue={formData.answer}  onChange={(e)=>OnChangeEditInput(e)}>
                                                                                <option value="">Select the correct answer</option>
                                                                                <option value="a">option A</option>
                                                                                <option value="b">option B</option>
                                                                                <option value="c">option C</option>
                                                                                <option value="d">option D</option> 
                                                                            </select>
                                                                            {formErrors.answer && <div className="invalid-feedback">{formErrors.answer}</div>}
                                                                        </div>
                                                                    </fieldset>
                                                                    <div className="form-group">
                                                                        <label htmlFor="Ans" className='input-label'>Question Point:</label>
                                                                        <input type="number" name="points" className={`form-control ${formErrors.points ? 'is-invalid' : ''}`} defaultValue={formData.points}  onChange={(e)=>OnChangeEditInput(e)} />
                                                                        {formErrors.points && <div className="invalid-feedback">{formErrors.points}</div>}
                                                                    </div>
                                                                </div> 
                                                            </div>
                                                        </form>
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <div className="d-flex gap-3">
                                                            <Button onClick={CloseCreateQuestion} className='btn btn-default btn-sm'>Close</Button>
                                                            <Button className='btn btn-primary' onClick={HandleSubmitForm}>Save Question</Button>
                                                        </div>
                                                    </Modal.Footer>
                                                    </Modal>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
              </>
          )}
    
    </>
  )
}
