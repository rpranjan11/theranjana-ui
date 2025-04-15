import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import "./ExperiencesPage.css"
import { useFirebase } from "../../firebase/userContext";
export default function ExperiencesPage(props) {
    const { uid } = props

    const [experiencesData, setexperiencesData] = useState([])
    let firebase = useFirebase()

    useEffect(() => {
        firebase.getExperiences(uid, (data) => {
            let arr = []
            for (let uid in data) {
                arr.push(data[uid])
            }
            setexperiencesData([...arr])
        })
    }, [])

    return (
        <Row className="experiences-page-content">
            {experiencesData.map((elem, idx) => {
                return (
                    <div key={idx} className="details">
                        <span id="line1">
                            <span id="designation">{elem.designation}</span>
                            <span id="employer">@ {elem.employer} </span>
                        </span>
                        <span id="line2">
                            <span id="location">At <strong>{elem.location}</strong></span>
                            <span id="period"> working between <strong>{elem.period}</strong></span>
                    </span>
                        <span id="description">{elem.description}</span>
                        <span id="techs">Technology : {elem.techs}</span>
                    </div>
                )
            })}
        </Row>
    )
}