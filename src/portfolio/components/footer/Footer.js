import React from "react";
import PropTypes from 'prop-types';
import "./Footer.css"

export default function Footer({
                                   socialLinks = [],
                                   copyrightText = `© ${new Date().getFullYear()} TheRanjana. All rights reserved.`
                               }) {
    return (
        <footer className="footer" style={{ marginTop: 'auto', textAlign: 'center' }}>
            <p>Copyright© 2025 TheRanjana. All rights reserved.</p>
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