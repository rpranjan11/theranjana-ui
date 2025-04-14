import React from "react";
import PropTypes from 'prop-types';
import "./Footer.css"

export default function Footer({ socialLinks, copyrightText }) {
    return (
        <footer className="footer" style={{ marginTop: 'auto', textAlign: 'center' }}>
            <p>© 2023 Samviddhi</p>
        </footer>
    )
}

Footer.propTypes = {
    socialLinks: PropTypes.arrayOf(
        PropTypes.shape({
            platform: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired
        })
    ),
    copyrightText: PropTypes.string
};

Footer.defaultProps = {
    socialLinks: [],
    copyrightText: `© ${new Date().getFullYear()} Prashant. All rights reserved.`
};