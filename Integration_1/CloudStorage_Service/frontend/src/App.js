import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'http://localhost:8000';

function App() {
  const [userId, setUserId] = useState('');
  const [files, setFiles] = useState([]); 
  const [uploadFiles, setUploadFiles] = useState([]); 
  const [folderFiles, setFolderFiles] = useState([]);
  const [usage, setUsage] = useState(null);
  const [message, setMessage] = useState('');
  const [isUsernameEntered, setIsUsernameEntered] = useState(false);

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${API_BASE}/files/${userId}`);
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error("Failed to fetch files:", err);
    }
  };

  const fetchUsage = async () => {
    try {
      const res = await fetch(`${API_BASE}/quota/${userId}`);
      const data = await res.json();
      setUsage(data);

      if (data.alert) {
        setMessage('⚠️ You have used over 75% of your quota! Consider managing your storage.');
      } else {
        setMessage('');
      }
    } catch (err) {
      console.error("Failed to fetch usage:", err);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFiles || uploadFiles.length === 0) {
      alert("No files selected.");
      return;
    }
  
    for (let f of uploadFiles) {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("file", f);
  
      try {
        const res = await fetch(`${API_BASE}/upload/`, {
          method: 'POST',
          body: formData,
        });
  
        const result = await res.json();
        if (!res.ok || result.status !== 'success') {
          console.error("Upload failed for", f.name, result.message);
        }
      } catch (err) {
        console.error("Upload error for", f.name, err);
      }
    }
  
    //refresh after upload
    fetchFiles();
    fetchUsage();
  };
  

  const handleFolderUpload = async () => {
    if (!folderFiles || folderFiles.length === 0) {
      alert("No folder selected.");
      return;
    }

    //Loop through each selected folder file
    for (let f of folderFiles) {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("file", f);

      const relativePath = f.webkitRelativePath || f.name; // Use relative path for files inside folders
      formData.append("path", relativePath);

      try {
        const res = await fetch(`${API_BASE}/upload/`, {
          method: 'POST',
          body: formData,
        });

        const result = await res.json();
        if (!res.ok || result.status !== 'success') {
          console.error("Upload failed for", f.name, result.message);
        }
      } catch (err) {
        console.error("Upload error for", f.name, err);
      }
    }

    fetchFiles();  // Refresh the list of files
    fetchUsage();  // Refresh the storage usage
  };

  const handleDelete = async (filename) => {
    try {
      await fetch(`${API_BASE}/delete/?user_id=${userId}&filename=${filename}`, {
        method: 'DELETE'
      });
      fetchFiles();
      fetchUsage();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Could not delete the file.");
    }
  };

  const handleDownload = async (filename) => {
    try {
      const res = await fetch(`${API_BASE}/download/?user_id=${userId}&filename=${filename}`);
      const data = await res.json();

      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        alert("Download failed.");
      }
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      alert("Please enter a valid username.");
      return;
    }
    setIsUsernameEntered(true);
    fetchFiles();
    fetchUsage();
  };

  useEffect(() => {
    if (userId && isUsernameEntered) {
      fetchFiles();
      fetchUsage();
    }
  }, [userId, isUsernameEntered]);

  return (
    <div className="App">
      <h1>Cloud Storage Dashboard</h1>

      {!isUsernameEntered ? (
        <form onSubmit={handleUsernameSubmit}>
          <input
            type="text"
            placeholder="Enter Username"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <div>
          {/* File upload button */}
          <div>
          <input
            type="file"
            onChange={(e) => setUploadFiles(Array.from(e.target.files))}
            multiple
          />
            <button onClick={handleFileUpload}>Upload File(s)</button>
          </div>

          {/* Folder upload button */}
          <div>
            <input
              type="file"
              onChange={(e) => setFolderFiles(e.target.files)}
              multiple
              webkitdirectory="true"   
              directory="true"         
            />
            <button onClick={handleFolderUpload}>Upload Folder</button>
          </div>

          {usage && (
            <div>
              <p>Usage: {usage.used_MB}MB / {usage.max_MB}MB ({usage.usage_percent}%)</p>
              <progress value={usage.usage_percent} max="100"></progress>
            </div>
          )}

          {message && <p style={{ color: 'red' }}>{message}</p>}

          <h3>Your Files</h3>
          <ul>
            {files.map((filename) => (
              <li key={filename}>
                {filename}
                <button onClick={() => handleDownload(filename)}>Download</button>
                <button onClick={() => handleDelete(filename)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;