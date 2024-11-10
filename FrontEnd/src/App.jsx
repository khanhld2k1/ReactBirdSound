import { useState } from 'react'
import axios from 'axios'
import './App.css'
import upload from './assets/icon/upload.svg'
import birdIntro from './assets/text/birdIntro.json'
import birdWiki from './assets/text/birdWiki.json'
import getImage from './assets/images.js'

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [birdName, setBirdName] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [error, setError] = useState(null);
  const handleFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    axios.post('http://127.0.0.1:5000/predict', formData)
      .then((response) => {
        console.log(response.data);
        setPrediction(response.data.predicted_class);
        setBirdName(response.data.predicted_class.replace('_sound', ''));
        setConfidence(response.data.confidence);
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        setError('An error occurred during file upload.');
      });
  };

  return (
    <>
    <div className='appContainer'>
      <div className='title'>Bird Sound Classification</div>

      <div className='uploadNote'>Upload a audio file(mp3 or wav) to analyze</div>

      <div className='uploadContainer'>
        <input type='file' accept=".mp3, .wav" onChange={handleFileUpload}/>
        <button className='uploadButton' onClick={handleUpload}>
          <img src={upload}/>
        </button>
      </div>

      {prediction && (
        <div className='resultContainer'>
          <div className='resultTitle'>Result: {prediction}</div>
          <div className='resultInfo'>
            <div className='resultImageWrapper'>
              <div className='resultImageContainer'>
                <img src={getImage(`${prediction}.jpg`)} className='resultImage'/>
              </div>
              <div className='resultImageConfidence'>Match: {confidence}</div>
            </div>
            <div className='resultDescription'>
              <div className='resultDescriptionTitle'>{birdName}</div>
              <div className='resultDescriptionDetail'>{birdIntro[birdName]}</div>
              <div className='resultLink'>See more detail: <a href={birdWiki[birdName]} target="_blank">HERE</a></div>
            </div>
          </div>
        </div>
      )}
      {error && <div className='errorMessage'>{error}</div>}
    </div>
    </>
  )
}

export default App
