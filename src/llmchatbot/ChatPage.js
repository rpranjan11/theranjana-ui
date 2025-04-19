// src/llmchatbot/ChatPage.js
import React, { useState, useRef, useEffect } from "react";
import "./ChatPage.css";
import Navbar from "./Navbar/Navbar";
import Footer from "./footer/Footer";
import pdfToText from 'react-pdftotext';
import axios from "axios";

const isMobile = window.innerWidth <= 576;

export const ChatPage = () => {
    const llmchatbotServiceDomain = process.env.REACT_APP_LLMCHATBOT_API_URL;
    const [file, setFile] = useState("");
    const [fileName, setFileName] = useState("");
    const [selectedChatGptModel, setSelectedChatGptModel] = useState("gpt-3.5-turbo");
    const [selectedOllamaModel, setSelectedOllamaModel] = useState("llama3.2");
    const [chatGptQueryType, setChatGptQueryType] = useState("general");
    const [ollamaQueryType, setOllamaQueryType] = useState("general");

    const messagesEndRef = useRef(null);
    const formRef = useRef(null);

    // State to store raw text from PDF for future use
    const [fileText, setFileText] = useState("");

    const [chatGptQuery, setChatGptQuery] = useState("");
    const [ollamaQuery, setOllamaQuery] = useState("");

    const [chatGptQueryArray, setChatGptQueryArray] = useState([]);
    const [chatGptAnswerArray, setChatGptAnswerArray] = useState([]);
    const [text1, setText1] = useState("");

    const [ollamaQueryArray, setOllamaQueryArray] = useState([]);
    const [ollamaAnswerArray, setOllamaAnswerArray] = useState([]);
    const [text2, setText2] = useState("");

    const [isUploading, setIsUploading] = useState(false);
    const [isPdfUploaded, setIsPdfUploaded] = useState(false);
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
        };
        return cleanup;
    }, [chatGptController, ollamaController]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatGptAnswerArray, ollamaAnswerArray]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Validate file type
        if (selectedFile.type !== 'application/pdf') {
            alert('Please upload a PDF file');
            formRef.current.reset();
            return;
        }

        // Validate file size (2MB = 2 * 1024 * 1024 bytes)
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (selectedFile.size > maxSize) {
            alert('File size exceeds 2MB limit. Please upload a smaller file.');
            formRef.current.reset();
            setFile("");
            setFileName("");
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

        setIsUploading(true);

        axios.post(`${llmchatbotServiceDomain}/uploadpdf`, formData)
            .then(response => {
                console.log(response.data);
                setText1("Uploaded PDF summary:\n" + response.data.chatgptResponse);
                setText2(response.data.ollamaResponse);
                setIsPdfUploaded(true);
                setIsUploading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setIsUploading(false);
                setIsPdfUploaded(false);
            });
    };

    // For ChatGPT queries:
    const handleChatGptQueries = () => {
        if (!chatGptQuery.trim()) return;

        setIsLoading(prev => ({ ...prev, chatGpt: true }));
        setChatGptQueryArray((prev) => [...prev, chatGptQuery]);

        let url = "";
        if (chatGptQueryType === "pdf_based") {
            url = `${llmchatbotServiceDomain}/chatgptcustomresponse/${selectedChatGptModel}/${chatGptQuery}`;
        } else {
            url = `${llmchatbotServiceDomain}/chatgptgenericresponse/${selectedChatGptModel}/${chatGptQuery}`;
        }

        setChatGptAnswerArray((prev) => [...prev, "Generating response..."]);
        scrollToBottom();

        const controller = new AbortController();
        setChatGptController(controller);

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
                        <span key="error" style={{ color: 'var(--danger)' }}>Error: Failed to generate response</span>]);
                    console.error('Error:', error);
                }
            })
            .finally(() => {
                setIsLoading(prev => ({ ...prev, chatGpt: false }));
            });

        setChatGptQuery("");
    };

    // For Ollama Queries
    const handleOllamaQueries = () => {
        if (!ollamaQuery.trim()) return;

        setIsLoading(prev => ({ ...prev, ollama: true }));
        setOllamaQueryArray((prev) => [...prev, ollamaQuery]);

        let url = "";
        if (ollamaQueryType === "pdf_based") {
            url = `${llmchatbotServiceDomain}/ollamacustomresponse/${selectedOllamaModel}/${ollamaQuery}`;
        } else {
            url = `${llmchatbotServiceDomain}/ollamagenericresponse/${selectedOllamaModel}/${ollamaQuery}`;
        }

        setOllamaAnswerArray((prev) => [...prev, "Generating response..."]);
        scrollToBottom();

        const controller = new AbortController();
        setOllamaController(controller);

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
                        <span key="error" style={{ color: 'var(--danger)' }}>Error: Failed to generate response</span>]);
                    console.error('Error:', error);
                }
            })
            .finally(() => {
                setIsLoading(prev => ({ ...prev, ollama: false }));
            });

        setOllamaQuery("");
    };

    const handleKeyPress = (e, chatType) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (isLoading.chatGpt || isLoading.ollama) return;
            if (chatType === 'chatgpt') {
                handleChatGptQueries();
            } else {
                handleOllamaQueries();
            }
        }
    };

    const onClickCross = () => {
        setFile("");
        setFileName("");
        setText1("");
        setText2("");
        setIsPdfUploaded(false);
        if (chatGptQueryType === "pdf_based") {
            setChatGptQueryType("general");
        }
        if (ollamaQueryType === "pdf_based") {
            setOllamaQueryType("general");
        }
        formRef.current.reset();
    };

    return (
        <div className="home_container">
            <Navbar />
            <div className="home_content">
                {isUploading && (
                    <div className="overlay">
                        <div className="spinner-container">
                            <div className="loading-spinner"></div>
                            <span>Uploading and Processing PDF...</span>
                        </div>
                    </div>
                )}

                <div className="body_content">
                    <div className="upload-section">
                        <h4 className="text-center mb-4">PDF Processing Tool</h4>
                        <p className="text-center text-muted mb-4">
                            Upload a PDF file (max 2MB) to generate a summary or ask specific questions about its content.
                        </p>

                        <div className="file-selection">
                            <div className="file-input-container">
                                <form ref={formRef} onSubmit={handleFormSubmit} className="file-input-wrapper">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        id="file_input"
                                        className="file-input"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="file_input" className="file-input-button">
                                        <i className="bi bi-file-earmark-pdf"></i>
                                        {fileName ? fileName : "Choose PDF File"}
                                    </label>
                                </form>

                                <button
                                    onClick={handleUploadPdf}
                                    className="upload-btn"
                                    disabled={!file}
                                    aria-label="Upload PDF file"
                                >
                                    <i className="bi bi-cloud-upload me-2"></i>
                                    Upload & Process
                                </button>
                            </div>

                            {fileName && (
                                <div className="file-info">
                                    <span className="file-name">{fileName}</span>
                                    <button className="close-btn" onClick={onClickCross}>
                                        <i className="bi bi-x"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="chat-container">
                        {/* ChatGPT Column */}
                        <div className="chat-column">
                            <div className="chat-card">
                                <div className="chat-header chatgpt-header">
                                    <div className="model-icon">
                                        <i className="bi bi-robot"></i>
                                    </div>
                                    <div className="model-select-container">
                                        <label htmlFor="chatgpt-model" className="model-label">ChatGPT Model</label>
                                        <select
                                            id="chatgpt-model"
                                            className="model-select"
                                            value={selectedChatGptModel}
                                            onChange={(e) => setSelectedChatGptModel(e.target.value)}
                                        >
                                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="chat-messages">
                                    {text1 && <div className="message-summary">{text1}</div>}

                                    {chatGptQueryArray.map((query, idx) => (
                                        <React.Fragment key={`chat-${idx}`}>
                                            <div className="message user-message">
                                                <div className="message-bubble">{query}</div>
                                                <div className="message-meta">You</div>
                                            </div>

                                            {chatGptAnswerArray[idx] && (
                                                <div className="message ai-message">
                                                    <div className="message-bubble">{chatGptAnswerArray[idx]}</div>
                                                    <div className="message-meta">ChatGPT</div>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="chat-input-container">
                                    <div
                                        className={`chat-input-wrapper ${chatGptQueryType === "pdf_based" ? "pdf-mode" : ""} ${(isLoading.chatGpt || isLoading.ollama) ? "disabled" : ""}`}>
                                        <input
                                            type="text"
                                            className="chat-input"
                                            value={chatGptQuery}
                                            onChange={(e) => setChatGptQuery(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, 'chatgpt')}
                                            disabled={isLoading.chatGpt || isLoading.ollama}
                                            placeholder={isLoading.chatGpt
                                                ? (isMobile ? "Generating..." : "Generating response...")
                                                : (isMobile ? "Ask ChatGPT" : "Ask ChatGPT a question...")}
                                        />
                                        <div className="input-actions">
                                            <select
                                                className="query-type-select"
                                                value={chatGptQueryType}
                                                onChange={(e) => setChatGptQueryType(e.target.value)}
                                                disabled={isLoading.chatGpt}
                                            >
                                                <option value="general">General</option>
                                                <option value="pdf_based" disabled={!isPdfUploaded}>
                                                    PDF
                                                </option>
                                            </select>

                                            <button
                                                className="send-button"
                                                onClick={handleChatGptQueries}
                                                disabled={isLoading.chatGpt || isLoading.ollama || !chatGptQuery.trim()}
                                            >
                                                {isLoading.chatGpt ? (
                                                    <div className="spinner"></div>
                                                ) : (
                                                    <i className="bi bi-send-fill"></i>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ollama Column */}
                        <div className="chat-column">
                            <div className="chat-card">
                                <div className="chat-header ollama-header">
                                <div className="model-icon">
                                        <i className="bi bi-cpu"></i>
                                    </div>
                                    <div className="model-select-container">
                                        <label htmlFor="ollama-model" className="model-label">Ollama Model</label>
                                        <select
                                            id="ollama-model"
                                            className="model-select"
                                            value={selectedOllamaModel}
                                            onChange={(e) => setSelectedOllamaModel(e.target.value)}
                                        >
                                            <option value="llama3.2">Llama 3.2</option>
                                            <option value="orca-mini">Orca Mini</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="chat-messages">
                                    {text2 && <div className="message-summary">{text2}</div>}

                                    {ollamaQueryArray.map((query, idx) => (
                                        <React.Fragment key={`ollama-${idx}`}>
                                            <div className="message user-message">
                                                <div className="message-bubble">{query}</div>
                                                <div className="message-meta">You</div>
                                            </div>

                                            {ollamaAnswerArray[idx] && (
                                                <div className="message ai-message">
                                                    <div className="message-bubble">{ollamaAnswerArray[idx]}</div>
                                                    <div className="message-meta">Ollama</div>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>

                                <div className="chat-input-container">
                                    <div
                                        className={`chat-input-wrapper ${ollamaQueryType === "pdf_based" ? "pdf-mode" : ""} ${(isLoading.chatGpt || isLoading.ollama) ? "disabled" : ""}`}>
                                        <input
                                            type="text"
                                            className="chat-input"
                                            value={ollamaQuery}
                                            onChange={(e) => setOllamaQuery(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, 'ollama')}
                                            disabled={isLoading.ollama || isLoading.chatGpt}
                                            placeholder={isLoading.ollama
                                                ? (isMobile ? "Generating..." : "Generating response...")
                                                : (isMobile ? "Ask Ollama" : "Ask Ollama a question...")}
                                        />
                                        <div className="input-actions">
                                            <select
                                                className="query-type-select"
                                                value={ollamaQueryType}
                                                onChange={(e) => setOllamaQueryType(e.target.value)}
                                                disabled={isLoading.ollama}
                                            >
                                                <option value="general">General</option>
                                                <option value="pdf_based" disabled={!isPdfUploaded}>
                                                    PDF
                                                </option>
                                            </select>

                                            <button
                                                className="send-button"
                                                onClick={handleOllamaQueries}
                                                disabled={isLoading.ollama || isLoading.chatGpt || !ollamaQuery.trim()}
                                            >
                                                {isLoading.ollama ? (
                                                    <div className="spinner"></div>
                                                ) : (
                                                    <i className="bi bi-send-fill"></i>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};