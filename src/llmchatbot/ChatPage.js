import React, { useState , useRef, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import "./ChatPage.css"
import Navbar from "./Navbar/Navbar";
import Footer from "./footer/Footer";
import pdfToText from 'react-pdftotext'
import axios from "axios";

export const ChatPage = () => {
    const llmchatbotServiceDomain = process.env.REACT_APP_LLMCHATBOT_API_URL;
    const [file, setFile] = useState("")
    const [fileName, setFileName] = useState("")
    const [selectedChatGptModel, setSelectedChatGptModel] = useState("gpt-3.5-turbo");
    const [selectedOllamaModel, setSelectedOllamaModel] = useState("llama3.2");
    const [chatGptQueryType, setChatGptQueryType] = useState("pdf_based");
    const [ollamaQueryType, setOllamaQueryType] = useState("pdf_based");

    const textRef = useRef(null);
    const formRef = useRef(null);

    // State to store raw text from PDF for future use
    const [fileText, setFileText] = useState("")

    const [chatGptQuery, setChatGptQuery] = useState("")
    const [ollamaQuery, setOllamaQuery] = useState("")

    const [chatGptQueryArray, setChatGptQueryArray] = useState([])
    const [chatGptAnswerArray, setChatGptAnswerArray] = useState([])
    const [text1, setText1] = useState("")

    const [ollamaQueryArray, setOllamaQueryArray] = useState([])
    const [ollamaAnswerArray, setOllamaAnswerArray] = useState([])
    const [text2, setText2] = useState("")

    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState({
        chatGpt: false,
        ollama: false
    });

    // Add these state variables to track ongoing requests
    const [chatGptController, setChatGptController] = useState(null);
    const [ollamaController, setOllamaController] = useState(null);

    // Add cleanup effect
    useEffect(() => {
        const cleanup = () => {
            if (chatGptController) {
                chatGptController.abort();
            }
            if (ollamaController) {
                ollamaController.abort();
            }
            // Clear any timeouts/intervals if you add them
            // clearTimeout(timeoutId);
        };
        return cleanup;
    }, [chatGptController, ollamaController]);

    // Update the click handlers for both chat systems
    const handleChatGptClick = () => {
        // Abort previous request if exists
        if (chatGptController) {
            chatGptController.abort();
        }

        // Create new controller for this request
        const controller = new AbortController();
        setChatGptController(controller);

        // Call the query handler
        handleChatGptQueries(chatGptQuery, chatGptQueryType);
    };

    const handleOllamaClick = () => {
        // Abort previous request if exists
        if (ollamaController) {
            ollamaController.abort();
        }

        // Create new controller for this request
        const controller = new AbortController();
        setOllamaController(controller);

        // Call the query handler
        handleOllamaQueries(ollamaQuery, ollamaQueryType);
    };

    const scrollToBottom = () => {
        if (textRef.current) {
            textRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }
    useEffect(() => {
        scrollToBottom(); // Scroll to bottom on initial render
    }, [chatGptAnswerArray, ollamaAnswerArray, textRef]);  // Add dependencies to trigger scroll on new messages


    const handleFormSubmit = (e) => {
        e.preventDefault();
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Validate file type
        if (selectedFile.type !== 'application/pdf') {
            alert('Please upload a PDF file');
            return;
        }

        const fileName = selectedFile.name;
        setFileName(fileName);
        setFile(selectedFile);

        // Clear previous chat history
        setChatGptQueryArray([]);
        setChatGptAnswerArray([]);
        setOllamaQueryArray([]);
        setOllamaAnswerArray([]);

        pdfToText(selectedFile)
            .then(text => {
                setFileText(text);
            })
            .catch(error => {
                console.error("Failed to extract text from pdf:", error);
                alert('Failed to process PDF. Please try again with a different file.');
            });
    };

    const handleUploadPdf = () => {
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('chatgpt_model', selectedChatGptModel);
        formData.append('ollama_model', selectedOllamaModel);

        setIsUploading(true);  // Set loading state before request

        axios.post(`${llmchatbotServiceDomain}/uploadpdf`, formData)
            .then(response => {
                console.log(response.data);
                setText1("Uploaded PDF Summary ::\n" + response.data.chatgptResponse);
                setText2("Uploaded PDF Summary ::\n" + response.data.ollamaResponse);
                setIsUploading(false); // Clear loading state on success
            })
            .catch(error => {
                console.error('Error:', error);
                setIsUploading(false); // Clear loading state on error
            });
    };

    // For ChatGPT queries:
    const handleChatGptQueries = (text, queryType) => {
        if (!text.trim()) return;

        // Set loading state for ChatGPT
        setIsLoading(prev => ({ ...prev, chatGpt: true }));

        setChatGptQueryArray((prev) => [...prev, text]);

        let url = "";
        if(queryType === "pdf_based") {
            url = `${llmchatbotServiceDomain}/chatgptcustomresponse/${selectedChatGptModel}/${text}`;
        } else {
            url = `${llmchatbotServiceDomain}/chatgptgenericresponse/${selectedChatGptModel}/${text}`;
        }

        setChatGptAnswerArray((prev) => [...prev, "Generating Response ...."]);
        scrollToBottom();

        const controller = new AbortController();

        axios.get(url, { signal: controller.signal })
            .then(response => {
                console.log('Response: ', response.data);
                setChatGptAnswerArray((prev) => [...prev.slice(0, -1), response.data.chatgptResponse]);
                scrollToBottom();
            })
            .catch(error => {
                if (axios.isCancel(error)) {
                    console.log('Request canceled');
                } else {
                    setChatGptAnswerArray((prev) => [...prev.slice(0, -1),
                        <span key="error" style={{color: 'red'}}>Error: Failed to generate response</span>]);
                    console.error('Error:', error);
                }
            })
            .finally(() => {
                // Reset loading state for ChatGPT
                setIsLoading(prev => ({ ...prev, chatGpt: false }));
            });

        setChatGptQuery("");

        // Return cleanup function
        return () => {
            controller.abort(); // Abort the API request if component unmounts or new request is made
        };
    };

    // For Ollama Queries
    const handleOllamaQueries = (text, queryType) => {
        if (!text.trim()) return;

        // Set loading state for Ollama
        setIsLoading(prev => ({ ...prev, ollama: true }));

        setOllamaQueryArray((prev) => [...prev, text]);

        let url = "";
        if(queryType === "pdf_based") {
            url = `${llmchatbotServiceDomain}/ollamacustomresponse/${selectedOllamaModel}/${text}`;
        } else {
            url = `${llmchatbotServiceDomain}/ollamagenericresponse/${selectedOllamaModel}/${text}`;
        }

        setOllamaAnswerArray((prev) => [...prev, "Generating Response ...."]);
        scrollToBottom();

        const controller = new AbortController();

        axios.get(url, { signal: controller.signal })
            .then(response => {
                console.log('Response: ', response.data);
                setOllamaAnswerArray((prev) => [...prev.slice(0, -1), response.data.ollamaResponse]);
                scrollToBottom();
            })
            .catch(error => {
                if (axios.isCancel(error)) {
                    console.log('Request canceled');
                } else {
                    setOllamaAnswerArray((prev) => [...prev.slice(0, -1),
                        <span key="error" style={{color: 'red'}}>Error: Failed to generate response</span>]);
                    console.error('Error:', error);
                }
            })
            .finally(() => {
                // Reset loading state for Ollama
                setIsLoading(prev => ({ ...prev, ollama: false }));
            });

        setOllamaQuery("");

        // Return cleanup function
        return () => {
            controller.abort(); // Abort the API request if component unmounts or new request is made
        };
    };

    const onClickCross = () => {
        setFile("")
        setFileName("")
        setText1("")
        setText2("")
        formRef.current.reset();

    }


      
    return (
        <div className="home_container">
            <Navbar handleUploadPdf={handleUploadPdf} />
            <div className="home_content">
                {isUploading && (
                    <div className="spinner-container">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="ms-2">Uploading PDF</span>
                    </div>
                )}
                <div className="body_content">
                    <div style={{ display: 'flex', padding: '20px', justifyContent: 'center' }}>
                        <div>
                            <form ref={formRef} onSubmit={handleFormSubmit}>
                                <input type="file" accept="application/pdf" id="file_input"
                                    onChange={handleFileChange}
                                />
                            </form>
                            {fileName && <span style={{ maxWidth: '500px' }}>{fileName}</span>}
                        </div>

                        <div style={{display:'flex',flexDirection:'column'}}>
                            <button onClick={handleUploadPdf} id="contact-btn" aria-label="Upload PDF file">Upload PDF</button>
                            {file && <button id="close-btn" onClick={onClickCross}><i className="bi bi-x-lg"></i></button>}
                        </div>
                    </div>
                    <div style={{flexGrow:'1',display:'flex'}}>
                        <Row style={{width:'100%'}}>
                            <Col md={6} lg={6} className="px-3 pb-4" style={{border:'1px solid #ccc'}}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <label htmlFor="chatgpt-model" style={{marginRight: '10px'}}>Select ChatGpt
                                        Model:</label>
                                    <select id="chatgpt-model" style={{flex: 1}} value={selectedChatGptModel}
                                            onChange={(e) => setSelectedChatGptModel(e.target.value)}>
                                        <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                                    </select>
                                </div>
                                <div className="card-content">
                                    <div className="text" id="text-area" ref={textRef}>
                                    {text1 && <span>{text1}</span>}
                                        {
                                            chatGptQueryArray.map((item, idx) => {
                                                return (
                                                    chatGptAnswerArray[idx] &&
                                                    <div key={idx} style={{display: 'flex', flexDirection: 'column'}}>
                                                        <span id="questions">-{item} </span>
                                                        <span
                                                            id={idx !== chatGptAnswerArray.length - 1 ? "answers" : 'latest'}>{chatGptAnswerArray[idx]}</span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    {/* For ChatGPT section */}
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <input
                                            className="input_text"
                                            type="text"
                                            value={chatGptQuery}
                                            onChange={(e) => setChatGptQuery(e.target.value)}
                                            disabled={isLoading.chatGpt}
                                            placeholder={isLoading.chatGpt ? "Generating response..." : "Type your message..."}
                                            aria-label="Chat input field"
                                        />
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <select
                                                id="chatgpt-query-type"
                                                value={chatGptQueryType}
                                                onChange={(e) => setChatGptQueryType(e.target.value)}
                                                disabled={isLoading.chatGpt}
                                            >
                                                <option value="pdf_based">From Pdf</option>
                                                <option value="general">General</option>
                                            </select>
                                            <i
                                                style={{
                                                    fontSize: '25px',
                                                    cursor: isLoading.chatGpt ? 'not-allowed' : 'pointer',
                                                    opacity: isLoading.chatGpt ? 0.5 : 1
                                                }}
                                                onClick={() => !isLoading.chatGpt && handleChatGptClick()}
                                                className="bi bi-box-arrow-in-up px-3"
                                            />
                                            {/* Add the ChatGPT loading spinner here */}
                                            {isLoading.chatGpt && (
                                                <div
                                                    className="loading-spinner"
                                                    role="status"
                                                    aria-live="polite"
                                                >
                                                    <span className="sr-only">Generating ChatGPT response...</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6} lg={6} className="px-3 pb-4" style={{border: '1px solid #ccc'}}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <label htmlFor="ollama-model" style={{marginRight: '10px'}}>Select Ollama
                                        Model:</label>
                                    <select id="ollama-model" style={{flex: 1}} value={selectedOllamaModel}
                                            onChange={(e) => setSelectedOllamaModel(e.target.value)}>
                                        <option value="llama3.2">Llama 3.2</option>
                                        <option value="orca-mini">Orca Mini</option>
                                    </select>
                                </div>
                                <div className="card-content">
                                    <div className="text">
                                        {text2 && <span>{text2}</span>}
                                        {
                                            ollamaQueryArray.map((item, idx) => {
                                                return (
                                                    ollamaAnswerArray[idx] &&
                                                    <div key={idx} style={{display: 'flex', flexDirection: 'column'}}>
                                                        <span id="questions">{item} </span>
                                                        <span id="answers">{ollamaAnswerArray[idx]} </span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    {/* For Ollama section */}
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <input
                                            className="input_text"
                                            type="text"
                                            value={ollamaQuery}
                                            onChange={(e) => setOllamaQuery(e.target.value)}
                                            disabled={isLoading.ollama}
                                            placeholder={isLoading.ollama ? "Generating response..." : "Type your message..."}
                                        />
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <select
                                                id="ollama-query-type"
                                                value={ollamaQueryType}
                                                onChange={(e) => setOllamaQueryType(e.target.value)}
                                                disabled={isLoading.ollama}
                                            >
                                                <option value="pdf_based">From Pdf</option>
                                                <option value="general">General</option>
                                            </select>
                                            <i
                                                style={{
                                                    fontSize: '25px',
                                                    cursor: isLoading.ollama ? 'not-allowed' : 'pointer',
                                                    opacity: isLoading.ollama ? 0.5 : 1
                                                }}
                                                onClick={() => !isLoading.ollama && handleOllamaClick()}
                                                className="bi bi-box-arrow-in-up px-3"
                                            />
                                            {/* Add the Ollama loading spinner here */}
                                            {isLoading.ollama && (
                                                <div
                                                    className="loading-spinner"
                                                    role="status"
                                                    aria-live="polite"
                                                >
                                                    <span className="sr-only">Generating Ollama response...</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};