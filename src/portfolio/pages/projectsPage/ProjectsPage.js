import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import "./ProjectsPage.css"
import { useFirebase } from "../../firebase/userContext";
export default function ProjectsPage(props) {
    const { uid } = props

    const [projectsData, setprojectsData] = useState([])
    let firebase = useFirebase()

    useEffect(() => {
        firebase.getProjects(uid, (data) => {
            let arr = []
            for (let uid in data) {
                arr.push(data[uid])
            }
            setprojectsData([...arr])
        })
    }, [])

    return (
        <Row className="projects-page-content" >
            {projectsData.map((elem, idx) => {
                return (
                    <div key={idx} className="details">
                        <span id="topic-name">{elem.title}</span>
                        <span id="description">{elem.description}</span>
                        <span id="techs">Technology : {elem.techs}</span>
                        <span id="publish">
                            <span id="develop-date">Developed on : {elem.publishedOn} </span>
                            {elem.projectLink &&
                                <a className="mb-3" href={elem.projectLink} target="_blank"
                                   rel="noopener">[LLMChatBot]</a>}
                        </span>
                        <span id="links">
                            {elem.backendSourceCodeLink &&
                                <a className="mb-3" href={elem.backendSourceCodeLink} target="_blank"
                                   rel="noopener">[Backend Source Code]</a>}
                            {elem.frontendSourceCodeLink &&
                                <a className="mb-3" href={elem.frontendSourceCodeLink} target="_blank"
                                   rel="noopener">[Frontend Source Code]</a>}
                        </span>
                    </div>
            )
            })}
        </Row>
    )
}