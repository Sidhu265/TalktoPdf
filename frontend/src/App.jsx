import { useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [conversation, setConversation] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('pdfFile', file);

    try {
      const response = await axios.post('http://localhost:8083/api/v1/pdf', formData);
      console.log(response.data);
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  const handleQuestion = async () => {
    if (!question) {
      alert('Please enter a question!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8083/api/v1/chat', { question });
      setAnswer(response.data.result);
      setConversation([...conversation, { question, answer: response.data.result }]);
    } catch (error) {
      console.error('Error asking question:', error);
      alert('Error asking question');
    }
  };


  return (
    <div className="App">
    <div className="container">
      <div className="upload-section">
        <h1>TalkToPDF</h1>
        <div>Upload your pdf below</div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>UPLOAD PDF</button>
      </div>
      <div>Ask your doubts..</div>
      <div className="chat-section">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter Question"
        />
        <button onClick={handleQuestion}>Send</button>
        <div className="resultbox">
          {conversation.map((item, index) => (
            <div key={index} className="conversation-item">
              <p><strong>Question:</strong> {item.question}</p>
              <p><strong>Result:</strong> {item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  )
}

export default App
