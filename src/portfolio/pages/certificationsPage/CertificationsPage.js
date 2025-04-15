import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import "./CertificationsPage.css"
import { useFirebase } from "../../firebase/userContext";

export default function CertificationsPage(props) {

    const { uid } = props

    const [certificationData, setCertificationData] = useState([]);

    let firebase = useFirebase();

    useEffect(() => {
        firebase.getCertifications(uid, (data) => {
            let arr = []
            for (let uid in data) {
                arr.push(data[uid])
            }
            setCertificationData([...arr])
        })
    }, [])


    return (
        <Row className="certification-page-content" >
            {certificationData.map((elem, idx) => {
                return (
                    <div key={idx} className="details">
                        <span id="topic-name" className="">{elem.title}</span>
                        <span id="issuing-authority"
                              className="">Issuing Organization : {elem.issuingOrganization}</span>
                        <span id="links" className="">
                            <span id="place" className="">Issue Date : {elem.issueDate} </span>
                            <span id="place" className="">[No Expiration]</span>
                        </span>
                        <span id="links" className="">
                            <span id="place" className="">Credentials : {elem.credentials} </span>
                            {elem.showCredentialsLink && <a href={elem.showCredentialsLink} target="_blank"
                                                            rel="noopener">[Show Credentials]</a>}
                        </span>
                    </div>
                )
            })}

        </Row>
    )
}