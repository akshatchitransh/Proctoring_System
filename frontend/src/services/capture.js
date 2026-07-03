async function uploadBlob(blob) {

  const formData = new FormData();

  formData.append('image', blob, 'screen.jpg');

  await fetch('http://localhost:5000/upload', {
    method: 'POST',
    body: formData
  });
}

export async function startCapture() {

  try {

    const stream =
      await navigator.mediaDevices.getDisplayMedia({

      video: {
        displaySurface: 'monitor'
      },

      audio: false
    });

    const track = stream.getVideoTracks()[0];

    const settings = track.getSettings();

    if (settings.displaySurface !== 'monitor') {

      alert('Please share entire screen');

      return null;
    }

    return stream;

  } catch (err) {

    console.error(err);

    return null;
  }
}

export function startScreenshotLoop(video) {

  const canvas = document.createElement('canvas');

  const ctx = canvas.getContext('2d');

  async function capture(quality = 0.6) {

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async blob => {

      console.log('capturing screenshot');

      await uploadBlob(blob);

    }, 'image/jpeg', quality);
  }

  async function normalLoop() {

    await capture(0.6);

    const randomDelay =
      Math.random() * 1500 + 500;

    setTimeout(normalLoop, randomDelay);
  }

  window.addEventListener('burst-capture', async () => {

    console.log('HIGH SPEED BURST');

    for (let i = 0; i < 25; i++) {

      await capture(0.9);

      await new Promise(resolve =>
        setTimeout(resolve, 100)
      );
    }
  });

  normalLoop();
}