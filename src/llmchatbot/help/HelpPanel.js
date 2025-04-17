// src/llmchatbot/help/HelpPanel.js
import React, { useState } from 'react';
import './HelpPanel.css';

const HelpPanel = ({ isOpen, onClose }) => {
    const [language, setLanguage] = useState('en'); // 'en' for English, 'ko' for Korean

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    return (
        <div className={`help-panel ${isOpen ? 'open' : ''}`}>
            <div className="help-header">
                <button className="home-button" onClick={onClose}>
                    <i className="bi bi-arrow-left"></i> Home
                </button>
                <select
                    className="language-selector"
                    value={language}
                    onChange={handleLanguageChange}
                >
                    <option value="en">English</option>
                    <option value="ko">한국어</option>
                </select>
            </div>

            <div className="help-content">
                {language === 'en' ? (
                    // English Instructions
                    <>
                        <h1>LLM Chatbot: User Guide</h1>

                        <h2>Introduction</h2>
                        <p>Welcome to LLM Chatbot, a powerful tool that gives you access to multiple AI language models in one sleek interface. This application allows you to:</p>
                        <ul>
                            <li>Chat with two different AI models simultaneously (ChatGPT and Ollama)</li>
                            <li>Upload and analyze PDF documents</li>
                            <li>Ask general knowledge questions</li>
                            <li>Query specific information from your uploaded PDFs</li>
                        </ul>

                        <h2>PDF Processing Features</h2>
                        <h3>Uploading a PDF</h3>
                        <ol>
                            <li>In the "PDF Processing Tool" section at the top, click the "Choose PDF File" button</li>
                            <li>Select a PDF file from your device (maximum size: 2MB)</li>
                            <li>Once selected, the filename will appear in the selection area</li>
                            <li>Click the "Upload & Process" button</li>
                            <li>Wait while the system processes your PDF (you'll see a loading indicator)</li>
                            <li>When processing is complete, both AI models will provide a summary of the PDF content</li>
                        </ol>

                        <h3>Important PDF Notes</h3>
                        <ul>
                            <li>Only PDF files are accepted (.pdf extension)</li>
                            <li>Maximum file size is 2MB</li>
                            <li>If you need to upload a different PDF, click the "X" button next to the filename to remove the current file</li>
                        </ul>

                        <h2>Chatting with AI Models</h2>
                        <h3>Using ChatGPT</h3>
                        <ol>
                            <li>In the left panel, you'll see the ChatGPT interface</li>
                            <li>The default model is GPT-3.5 Turbo</li>
                            <li>Type your question in the input field at the bottom</li>
                            <li>Press Enter or click the send button to submit your question</li>
                            <li>Wait for ChatGPT to generate a response</li>
                            <li>The conversation history will appear above the input field</li>
                        </ol>

                        <h3>Using Ollama</h3>
                        <ol>
                            <li>In the right panel, you'll see the Ollama interface</li>
                            <li>You can select different models from the dropdown (Llama 3.2, Orca Mini, etc.)</li>
                            <li>Type your question in the input field at the bottom</li>
                            <li>Press Enter or click the send button to submit your question</li>
                            <li>Wait for Ollama to generate a response</li>
                            <li>The conversation history will appear above the input field</li>
                        </ol>

                        <h2>Query Types</h2>
                        <h3>General Mode</h3>
                        <p>By default, both chat panels are in "General" mode, which means:</p>
                        <ul>
                            <li>You can ask general knowledge questions</li>
                            <li>The AI has no knowledge of your uploaded PDF</li>
                            <li>This mode is ideal for general information, coding help, creative writing, etc.</li>
                        </ul>

                        <h3>PDF Mode</h3>
                        <p>After uploading a PDF, you can switch to "PDF" mode:</p>
                        <ol>
                            <li>Select "PDF" from the dropdown next to the input field</li>
                            <li>You'll see a "PDF" indicator appear above the input field</li>
                            <li>In this mode, you can ask specific questions about the content of your uploaded PDF</li>
                        </ol>

                        <h3>Tips for Best Results</h3>
                        <ul>
                            <li>Be specific with your questions</li>
                            <li>For complex topics, break down your questions into smaller parts</li>
                            <li>Follow up with clarifying questions if needed</li>
                            <li>Different models may have different strengths, so try both</li>
                            <li>Reference page numbers or sections when asking about PDFs</li>
                        </ul>
                    </>
                ) : (
                    // Korean Instructions - You can translate the English content to Korean
                    <>
                        <h1>LLM 챗봇: 사용자 가이드</h1>

                        <h2>소개</h2>
                        <p>LLM 챗봇에 오신 것을 환영합니다. 이 애플리케이션은 하나의 세련된 인터페이스에서 여러 AI 언어 모델에 접근할 수 있는 강력한 도구입니다. 이 애플리케이션을 사용하면 다음과 같은 작업을 수행할 수 있습니다:</p>
                        <ul>
                            <li>두 가지 다른 AI 모델(ChatGPT 및 Ollama)과 동시에 채팅</li>
                            <li>PDF 문서 업로드 및 분석</li>
                            <li>일반 지식 질문하기</li>
                            <li>업로드된 PDF에서 특정 정보 쿼리하기</li>
                        </ul>

                        {/* Add the rest of the Korean translation here */}
                        <h2>PDF 처리 기능</h2>
                        <h3>PDF 업로드하기</h3>
                        <ol>
                            <li>상단의 "PDF 처리 도구" 섹션에서 "PDF 파일 선택" 버튼을 클릭하세요</li>
                            <li>장치에서 PDF 파일을 선택하세요 (최대 크기: 2MB)</li>
                            <li>선택하면 선택 영역에 파일 이름이 나타납니다</li>
                            <li>"업로드 및 처리" 버튼을 클릭하세요</li>
                            <li>시스템이 PDF를 처리하는 동안 기다리세요 (로딩 표시기가 보입니다)</li>
                            <li>처리가 완료되면 두 AI 모델 모두 PDF 내용의 요약을 제공합니다</li>
                        </ol>

                        {/* Continue with the Korean translation of all sections */}
                    </>
                )}
            </div>
        </div>
    );
};

export default HelpPanel;