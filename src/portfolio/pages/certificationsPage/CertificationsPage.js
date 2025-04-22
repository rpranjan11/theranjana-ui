import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import "./CertificationsPage.css"
import { useFirebase } from "../../firebase/userContext";

export default function CertificationsPage() {

    const [certificationData, setCertificationData] = useState([]);
    let firebase = useFirebase();

    useEffect(() => {
        firebase.getCertifications(data => {
            let arr = []
            for (let id in data) {
                arr.push(data[id])
            }
            setCertificationData([...arr])
        })
    }, [])


    return (
        <Row className="certification-page-content" >
            {certificationData.map((elem, idx) => {
                return (
                    <div key={idx} className="details">
                        <span id="cert-name" className=""><strong>{elem.title}</strong></span>
                        <span id="issuing-authority"
                              className=""><strong>Issuing Organization :</strong> {elem.issuingOrganization}</span>
                        <span id="links" className="">
                            <span id="issue-date" className=""><strong>Issue Date :</strong> {elem.issueDate} - </span>
                            <span id="expiry" className="">No Expiration</span>
                        </span>
                        <span id="links" className="">
                            <span id="credential" className=""><strong>Credentials :</strong> {elem.credentials} </span>
                            {elem.showCredentialsLink && <a href={elem.showCredentialsLink} target="_blank"
                                                            rel="noopener">[Show Credentials]</a>}
                        </span>
                    </div>
                )
            })}

        </Row>
    )
}