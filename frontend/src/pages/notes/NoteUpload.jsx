import React, { useState, useEffect } from "react";
import axios from "axios";
import "./noteupload.css";
import { server } from "../../main"; // Ensure `server` is correctly defined
import { MdDeleteForever } from "react-icons/md";
import AOS from "aos"; // Import AOS library
import "aos/dist/aos.css"; // Import AOS styles

const NoteUpload = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedLink, setSelectedLink] = useState(null);
  const [iframeError, setIframeError] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [notes, setNotes] = useState([]);
  const [originalName, setOriginalName] = useState("");

  const GOOGLE_SEARCH_API_KEY = "AIzaSyBnGMCmJIi18PZk9g4pZ3-hM_D-TvBx5G4";
  const GOOGLE_CX = "21d4c981d43aa43f5";

  useEffect(() => {
    fetchNotes();
    AOS.init(); // Initialize AOS
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${server}/api/notes`, {
        params: { userId: user._id },
      });
      setNotes(response.data.notes || []);
    } catch (error) {
      console.error("Error fetching notes:", error.response?.data || error);
    }
  };

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
      console.error("Error searching notes:", error.response?.data || error);
    }
  };

  const handleLinkClick = (link) => {
    setIframeError(false);
    setSelectedLink(link);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setUploadStatus("");
  };

  const handleFileUpload = async () => {
    if (!file) {
      setUploadStatus("No file selected.");
      return;
    }

    if (!originalName.trim()) {
      setUploadStatus("Please provide a name for the file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("originalname", originalName);
    formData.append("userId", user._id);

    try {
      setUploadStatus("Uploading...");
      await axios.post(`${server}/api/notesupload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus("File uploaded successfully!");
      fetchNotes(); // Refresh the notes list
      setFile(null);
      setOriginalName(""); // Reset input
    } catch (error) {
      console.error("Error uploading file:", error.response?.data || error);
      setUploadStatus("Error uploading file.");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`${server}/api/delete/${noteId}`, {
        data: { userId: user._id },
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error.response?.data || error);
    }
  };

  return (
    <div className="note-app-container">
      {/* Header */}
      <header className="note-app-header" data-aos="fade-in">
        <h1 className="note-header-title">Student Notes Portal</h1>
        <p className="note-header-description">Search and upload notes seamlessly.</p>
      </header>

      {/* Search Section */}
      <div className="note-search-section" data-aos="fade-up">
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
              data-aos="fade-right"
              onClick={() => handleLinkClick(item.link)}
            >
              <h3 className="note-result-title">{item.title}</h3>
              <p className="note-result-snippet">{item.snippet}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Iframe Section */}
      {selectedLink && (
        <div className="note-iframe-section" data-aos="zoom-in">
          <h2 className="note-iframe-title">Content Preview</h2>
          {!iframeError ? (
            <iframe
              className="note-iframe"
              src={selectedLink}
              title="Embedded Content"
              width="100%"
              height="600px"
              frameBorder="0"
              onError={() => setIframeError(true)}
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

      {/* Upload Section */}
      <div className="note-upload-section" data-aos="fade-left">
        <h2 className="note-upload-title">Upload Notes</h2>
        <div className="note-upload-options">
          <input
            type="text"
            className="note-upload-input"
            placeholder="Enter a name for your file"
            value={originalName}
            onChange={(e) => setOriginalName(e.target.value)}
          />
          <input
            className="note-upload-file"
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
          />
          <button className="note-upload-button" onClick={handleFileUpload}>
            Submit
          </button>
        </div>
        {uploadStatus && <p className="note-upload-status">{uploadStatus}</p>}
      </div>

      {/* Uploaded Notes Section */}
      <div className="uploaded-notes-section" data-aos="fade-up">
        <h2>Uploaded Notes</h2>
        <div className="uploaded-notes">
          {notes.map((note) => {
            const fileId = new URL(note.path).searchParams.get("id");
            const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}`;
            const fullViewUrl = `https://drive.google.com/file/d/${fileId}/view`;

            return (
              <div key={note._id} className="note-card" data-aos="flip-up">
                <div className="note-thumbnail">
                  <img
                    src={thumbnailUrl}
                    alt={note.name}
                    className="thumbnail-image"
                  />
                </div>
                <div className="note-details">
                  <a
                    href={fullViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="note-link"
                  >
                    {note.name}
                  </a>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="note-delete-button"
                  >
                    <MdDeleteForever />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NoteUpload;
