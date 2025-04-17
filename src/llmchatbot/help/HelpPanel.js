// src/llmchatbot/help/HelpPanel.js
import React, { useState, useEffect } from 'react';
import './HelpPanel.css';

const HelpPanel = ({ isOpen, onClose }) => {
    const [language, setLanguage] = useState('en'); // 'en' for English, 'ko' for Korean

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    // Close panel when clicking outside (on the left 50% of screen)
    useEffect(() => {
        const handleOutsideClick = (e) => {
            // Only run this on desktop and only if panel is open
            if (isOpen && window.innerWidth > 768) {
                // Check if click is on the left side of the screen (outside the panel)
                if (e.clientX < window.innerWidth * 0.5) {
                    onClose();
                }
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, onClose]);

    return (
        <div className={`help-panel ${isOpen ? 'open' : ''}`}>
            <div className="help-header">
                <button className="home-button" onClick={onClose}>
                    <i className="bi-arrow-return-left"></i> Home
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
                    // Korean Instructions - Complete translation
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

                        <h3>중요 PDF 참고사항</h3>
                        <ul>
                            <li>PDF 파일만 허용됩니다 (.pdf 확장자)</li>
                            <li>최대 파일 크기는 2MB입니다</li>
                            <li>다른 PDF를 업로드해야 하는 경우, 파일 이름 옆의 "X" 버튼을 클릭하여 현재 파일을 제거하세요</li>
                        </ul>

                        <h2>AI 모델과 채팅하기</h2>
                        <h3>ChatGPT 사용하기</h3>
                        <ol>
                            <li>왼쪽 패널에서 ChatGPT 인터페이스를 볼 수 있습니다</li>
                            <li>기본 모델은 GPT-3.5 Turbo입니다</li>
                            <li>하단의 입력 필드에 질문을 입력하세요</li>
                            <li>Enter 키를 누르거나 전송 버튼을 클릭하여 질문을 제출하세요</li>
                            <li>ChatGPT가 응답을 생성할 때까지 기다리세요</li>
                            <li>대화 기록이 입력 필드 위에 표시됩니다</li>
                        </ol>

                        <h3>Ollama 사용하기</h3>
                        <ol>
                            <li>오른쪽 패널에서 Ollama 인터페이스를 볼 수 있습니다</li>
                            <li>드롭다운에서 다른 모델을 선택할 수 있습니다 (Llama 3.2, Orca Mini 등)</li>
                            <li>하단의 입력 필드에 질문을 입력하세요</li>
                            <li>Enter 키를 누르거나 전송 버튼을 클릭하여 질문을 제출하세요</li>
                            <li>Ollama가 응답을 생성할 때까지 기다리세요</li>
                            <li>대화 기록이 입력 필드 위에 표시됩니다</li>
                        </ol>

                        <h2>쿼리 유형</h2>
                        <h3>일반 모드</h3>
                        <p>기본적으로 두 채팅 패널 모두 "일반" 모드입니다. 이는 다음을 의미합니다:</p>
                        <ul>
                            <li>일반 지식 질문을 할 수 있습니다</li>
                            <li>AI는 업로드된 PDF에 대한 지식이 없습니다</li>
                            <li>이 모드는 일반 정보, 코딩 도움, 창의적 글쓰기 등에 이상적입니다</li>
                        </ul>

                        <h3>PDF 모드</h3>
                        <p>PDF를 업로드한 후 "PDF" 모드로 전환할 수 있습니다:</p>
                        <ol>
                            <li>입력 필드 옆의 드롭다운에서 "PDF"를 선택하세요</li>
                            <li>입력 필드 위에 "PDF" 표시기가 나타납니다</li>
                            <li>이 모드에서는 업로드된 PDF의 내용에 대해 특정 질문을 할 수 있습니다</li>
                        </ol>

                        <h3>최상의 결과를 위한 팁</h3>
                        <ul>
                            <li>질문을 구체적으로 하세요</li>
                            <li>복잡한 주제의 경우, 질문을 더 작은 부분으로 나누세요</li>
                            <li>필요한 경우 명확히 하는 후속 질문을 하세요</li>
                            <li>다른 모델은 서로 다른 강점을 가질 수 있으므로 둘 다 시도해 보세요</li>
                            <li>PDF에 대해 질문할 때는 페이지 번호나 섹션을 참조하세요</li>
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

export default HelpPanel;