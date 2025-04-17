// src/llmchatbot/Navbar/Navbar.js
import React from "react";
import "./Navbar.css";
import { Col, Row } from "react-bootstrap";

const Navbar = () => {
    return (
        <div className="header col-md-12">
            <div className="responsive-width px-4">
                <Row className="responsive-md resposive-lg m-0 p-0">
                    <Col className="cursor-pointer d-flex align-items-center p-0">
                        <div className="app-icon">
                            <i className="bi bi-chat-square-text-fill"></i>
                        </div>
                        <span id="heading">ChatBot & PDF Summary</span>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Navbar;