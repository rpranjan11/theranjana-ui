import React, { useState,useEffect } from "react";
import "./Header.css"

export default function Header(props) {
    const { pageOpen, setPageOpen, mobileView } = props
    const [needMargin, setNeedMargin] = useState(false)

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


    const handleResize = debounce(() => {
        if (window.innerWidth >= 425) {
            setNeedMargin(true)
        }
        else setNeedMargin(false)
    }, 200); // Adjust the delay as needed

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    useEffect(()=>{
        if (window.innerWidth > 425) {
            setNeedMargin(true)
        }
    },[])

    return (
        <>
            <div className={mobileView ? "header-content-mobile-view" : "header-content"} style={needMargin?{display:'flex',justifyContent:'center'}:{}}>
                <div className={needMargin?"me-5":""} style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => {
                    setPageOpen("")
                }}>
                    <span style={pageOpen === "" ? { color: '#434343' } : { color: '#589cf7' }} >
                        {/* <a href="/view#papers">
                            Home
                            </a> */}
                        Home
                    </span>
                    {pageOpen === "" ? <span className="dash" /> : ""}
                </div>

                <div className={needMargin?"me-5":""} style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => {
                    setPageOpen("Experiences")
                }}>
                    <span style={pageOpen === "Experiences" ? { color: '#434343' } : { color: '#589cf7' }} >Experiences</span>
                    {pageOpen === "Experiences" ? <span className="dash" /> : ""}
                </div>

                <div className={needMargin?"me-5":""} style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => {
                    setPageOpen("Projects")
                }}>
                    <span style={pageOpen === "Projects" ? { color: '#434343' } : { color: '#589cf7' }} >Projects</span>
                    {pageOpen === "Projects" ? <span className="dash" /> : ""}
                </div>
                <div className="" style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => {
                    setPageOpen("Certifications")
                }}>
                    <span style={pageOpen === "Certifications" ? { color: '#434343' } : { color: '#589cf7' }} >Certifications</span>
                    {pageOpen === "Certifications" ? <span className="dash" /> : ""}
                </div>
            </div>
        </>
    )
}