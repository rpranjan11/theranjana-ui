import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Row, Col } from "react-bootstrap";
import "./VideoPage.css"
import { useFirebase } from "../../firebase/userContext";

export default function VideosPage({ uid }) {
    const [videosData, setvideosData] = useState([])
    let firebase = useFirebase()

    useEffect(() => {
        firebase.getVideos(uid, (data) => {
            let arr = []
            for (let uid in data) {
                arr.push(data[uid])
            }
            setvideosData([...arr])
        })
    }, [])

    return (
        <Row className="video-page-content" >
            {videosData.map((elem, idx) => {
                return (
                    <Col key={idx} md={6} lg={6} sm={6}  className="details ">
                        <iframe width="auto" height="auto" src={`${elem.videoLink}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                    </Col>
                )
            })}
        </Row>
    )
}

VideosPage.propTypes = {
    uid: PropTypes.string.isRequired,
    videos: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string,
            thumbnail: PropTypes.string,
            url: PropTypes.string.isRequired
        })
    ),
    onVideoSelect: PropTypes.func
};