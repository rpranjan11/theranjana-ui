import React, { useEffect, useState, useCallback } from "react";
import PropTypes from 'prop-types';
import { Container, Row, Col } from "react-bootstrap";
import "./HomePage.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import ExperiencesPage from "../experiencesPage/ExperiencesPage";
import ProjectsPage from "../projectsPage/ProjectsPage";
import CertificationsPage from "../certificationsPage/CertificationsPage";
import { useFirebase } from "../../firebase/userContext"

export default function HomePage({ initialUserData = {}, isLoading = false }) {
    const [pageOpen, setPageOpen] = useState("");
    const [userData, setuserData] = useState({})
    const [mobileView, setMobileView] = useState(false)
    let firebase = useFirebase()

    function debounce(func, delay) {
        let timeoutId;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }

    const handleResize = useCallback(
        debounce(() => {
            if (window.innerHeight > window.innerWidth) {
                setMobileView(true);
            } else setMobileView(false);
        }, 200),
        []
    );

    const handleScrollApps = () => {
        window.location.href = "/";
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    useEffect(() => {
        firebase.getUsersBio(data => {
            if (data) {
                setuserData(data)
            }
        })
        if (window.innerHeight > window.innerWidth) {
            setMobileView(true)
        }
    }, [])

    return (
        <div className={mobileView ? "home-page-content-mobile-view" : "home-page-content"}>
            <Container className="page-content">
                <Header setPageOpen={setPageOpen} pageOpen={pageOpen} mobileView={mobileView}/>
                <div className={mobileView ? "wrapper-mobile-view" : "wrapper"}>
                    {!pageOpen ? (
                        <Row className="card-content">
                            <Col md={mobileView ? 12 : 6} lg={mobileView ? 12 : 6} sm={12}
                                 className={mobileView ? "profile-image" : "profile-image after"}>
                                <img className="card_Avatar profile-image-no-border"
                                     src={userData.profile_picture ? userData.profile_picture : ''}></img>
                                <span className={mobileView ? "partition-dash" : 'partition-dash-hide'}></span>
                            </Col>
                            <Col md={mobileView ? 12 : 6} lg={mobileView ? 12 : 6} sm={12}
                                 className="personal-content">
                                <div id="personal-info">
                                    <div className="user-details">
                                        <span className="user-name text-truncate" id="college-name">
                                            {userData.name}
                                        </span>
                                        <span className="user-position text-truncate" id="post-name">
                                            {userData.position}
                                        </span>
                                        <span className="user-location text-truncate" id="location">
                                            <i className="location-icon bi bi-geo-alt-fill me-2"></i>
                                            {userData.location}
                                        </span>
                                    </div>

                                    <div className="user-description">
                                        <span id="designation" className="description-text">
                                            {userData.description}
                                        </span>
                                    </div>

                                    <div className="social-app-icons">
                                        <div className="icon mail">
                                            <div className="tooltip">
                                                Mail
                                            </div>
                                            {userData.email && <span>
                                                <a href={`mailto:${userData.email}`} target="_blank"
                                                   rel="noopener noreferrer">
                                                    <i className="bi bi-envelope-fill"></i>
                                                </a>
                                            </span>}
                                        </div>

                                        <div className="icon linkedIn">
                                            <div className="tooltip">
                                                LinkedIn
                                            </div>

                                            {userData.linkedIn && <span>
                                                <a href={userData.linkedIn} target="_blank" rel="noopener">
                                                    <i className="fab fa-linkedin-in"></i>
                                                </a>
                                            </span>}
                                        </div>

                                        <div className="icon github">
                                            <div className="tooltip">
                                                Github
                                            </div>
                                            {userData.github && <span>
                                                <a href={userData.github} target="_blank" rel="noopener">
                                                    <i className="fab fa-github"></i>
                                                </a>
                                            </span>}
                                        </div>

                                        <div className="icon twitter">
                                            <div className="tooltip">
                                                Twitter
                                            </div>
                                            {userData.twitter && <span>
                                                <a href={userData.twitter} target="_blank" rel="noopener">
                                                    <i className="fab fa-x-twitter"></i>
                                                </a>
                                            </span>}
                                        </div>
                                    </div>

                                    <div className="scroll-apps-container">
                                        <button
                                            className="scroll-apps-button"
                                            onClick={handleScrollApps}
                                            aria-label="Scroll My Apps"
                                        >
                                            <i className="bi bi-app-indicator me-2"></i>
                                            Scroll My Apps
                                        </button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    ) : pageOpen === "Experiences" ? (
                        <ExperiencesPage/>
                    ) : pageOpen === "Projects" ? (
                        <ProjectsPage/>
                    ) : (
                        <CertificationsPage/>
                    )}
                </div>
            </Container>

            {/*<div style={{ marginTop: 'auto', padding: '25px' }}>*/}
            {/*    <img className="" style={{ height: '55px', border: 'none', boxShadow: 'none' }} src={userData.profile_logo ? userData.profile_logo : ''}></img>*/}
            {/*</div>*/}

            <div className="footer-wrapper">
                <Footer className={mobileView ? "footer-mobile-view" : "footer"}/>
            </div>
        </div>
    );
}

HomePage.propTypes = {
    initialUserData: PropTypes.shape({
        name: PropTypes.string,
        position: PropTypes.string,
        location: PropTypes.string,
        description: PropTypes.string,
        email: PropTypes.string,
        linkedIn: PropTypes.string,
        github: PropTypes.string,
        twitter: PropTypes.string,
        profile_picture: PropTypes.string,
    }),
    isLoading: PropTypes.bool
};