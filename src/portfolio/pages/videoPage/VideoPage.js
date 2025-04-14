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

    const videoId = '6OXfgu8uKnE'; // YouTube video ID

    const onReady = (event) => {
        const iframe = event.target.getIframe();
        // Specify the origin to match your React app's origin
        iframe.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'mute', args: [] }),
            'http://localhost:3000'
        );
    };

    return (

        // <Container>
        <Row className="video-page-content" >
            {videosData.map((elem, idx) => {
                return (
                    <Col key={idx} md={6} lg={6} sm={6}  className="details ">
                        {/* {console.log(
                            elem.videoLink.split("v=")[1]
                        )} */}
                        {/* <YouTube
                            videoId={elem.videoLink.split("v=")[1]}
                            onReady={onReady}
                        /> */}
                        <iframe width="auto" height="auto" src={`${elem.videoLink}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                    </Col>
                )
            })}

        </Row>
        // </Container>
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