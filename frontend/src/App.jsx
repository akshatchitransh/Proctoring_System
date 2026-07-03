import React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  startCapture,
  startScreenshotLoop
} from './services/capture';

import {
  setupDetection
} from './services/detection';

export default function App() {
  const videoRef = useRef(null);

  const [started, setStarted] = useState(false);

  async function begin() {
    const stream = await startCapture();

    if (!stream) {
      alert('Entire screen sharing required');
      return;
    }

    videoRef.current.srcObject = stream;

    await videoRef.current.play();

    setupDetection();

    startScreenshotLoop(videoRef.current);

    document.documentElement.requestFullscreen();

    setStarted(true);
  }

  return (
    <div className="container">
      <h1>Secure Assessment</h1>

      {!started && (
        <button onClick={begin}>
          Start Exam
        </button>
      )}

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="hidden-video"
      />
    </div>
  );
}