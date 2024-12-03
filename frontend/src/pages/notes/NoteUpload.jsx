import React, { useState } from "react";
import axios from "axios";
import "./noteupload.css";

const NoteUpload = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedLink, setSelectedLink] = useState(null);
  const [iframeError, setIframeError] = useState(false);

  const GOOGLE_SEARCH_API_KEY = "AIzaSyBnGMCmJIi18PZk9g4pZ3-hM_D-TvBx5G4";
  const GOOGLE_CX = "21d4c981d43aa43f5";

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await axios.get(
        `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
          searchQuery
        )}&key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_CX}`
      );
      setResults(response.data.items || []);
      setSelectedLink(null);
      setIframeError(false);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleLinkClick = (link) => {
    setIframeError(false);
    setSelectedLink(link);
  };

  return (
    <div className="note-app-container">
      <header className="note-app-header">
        <h1 className="note-header-title">Student Notes Portal</h1>
        <p className="note-header-description">Search and upload notes seamlessly.</p>
      </header>

      <div className="note-search-section">
        <h2 className="note-search-title">Search for Notes</h2>
        <div className="note-search-bar">
          <input
            className="note-search-input"
            type="text"
            placeholder="Enter a topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="note-search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="note-results">
          {results.map((item, index) => (
            <div
              key={index}
              className="note-result-item"
              onClick={() => handleLinkClick(item.link)}
            >
              <h3 className="note-result-title">{item.title}</h3>
              <p className="note-result-snippet">{item.snippet}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedLink && (
        <div className="note-iframe-section">
          <h2 className="note-iframe-title">Content Preview</h2>
          {!iframeError ? (
            <iframe
              className="note-iframe"
              src={selectedLink}
              title="Embedded Content"
              width="100%"
              height="600px"
              frameBorder="0"
              onError={() => {
                setIframeError(true);
              }}
            ></iframe>
          ) : (
            <div className="note-iframe-error">
              <p className="note-iframe-error-text">
                Content cannot be displayed here.{" "}
                <a
                  className="note-iframe-error-link"
                  href={selectedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Click here
                </a>{" "}
                to view it in a new tab.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="note-upload-section">
        <h2 className="note-upload-title">Upload Notes</h2>
        <div className="note-upload-options">
          <input className="note-upload-input" type="file" accept=".pdf,.docx,.txt" />
          <button className="note-upload-button">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default NoteUpload;
