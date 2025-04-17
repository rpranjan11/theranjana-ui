// src/llmchatbot/Navbar/Navbar.js
import React, { useState } from "react";
import "./Navbar.css";
import { Col, Row } from "react-bootstrap";
import HelpPanel from "../help/HelpPanel";

const Navbar = () => {
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const toggleHelp = () => {
        setIsHelpOpen(!isHelpOpen);
    };

    return (
        <>
            <div className="header col-md-12">
                <div className="responsive-width px-4">
                    <Row className="responsive-md resposive-lg m-0 p-0">
                        <Col className="cursor-pointer d-flex align-items-center p-0">
                            <div className="app-icon">
                                <i className="bi bi-chat-square-text-fill"></i>
                            </div>
                            <span id="heading">LLMChatBot : General & PDF-based</span>
                        </Col>
                        <Col xs="auto" className="d-flex align-items-center">
                            <button className="help-button" onClick={toggleHelp}>
                                Help <i className="bi bi-question-circle-fill"></i>
                            </button>
                        </Col>
                    </Row>
                </div>
            </div>

            <HelpPanel isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        </>
    );
};

export default Navbar;