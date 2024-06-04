import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div className="left">
                <p>&copy; 2024 PlayBook</p>
                <p>placeholder</p>
                <p>placeholder</p>
            </div>
            <div className="right">
                <form>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" />

                    <label htmlFor="message">Message:</label>
                    <textarea id="message" name="message" rows="4" />

                    <button type="submit">Submit</button>
                </form>
            </div>

        </footer>
    );
};

export default Footer;