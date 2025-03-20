import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>PR Smart PDF AI</h3>
          <p>An intelligent PDF analysis and question generation system powered by AI.</p>
        </div>

        <div className="footer-section">
          <h3>Links</h3>
          <ul className="footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/todos">Todos</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Technologies</h3>
          <ul className="footer-links">
            <li>
              <a
                href="https://huggingface.co/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hugging Face
              </a>
            </li>
            <li>
              <a
                href="https://www.langchain.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LangChain
              </a>
            </li>
            <li>
              <a
                href="https://fastapi.tiangolo.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                FastAPI
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} PR Smart PDF AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
