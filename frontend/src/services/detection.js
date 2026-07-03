async function sendEvent(type) {

  await fetch('http://localhost:5000/event', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      type,
      timestamp: Date.now()
    })
  });
}

function burstCapture() {

  console.log('BURST CAPTURE STARTED');

  window.dispatchEvent(
    new CustomEvent('burst-capture')
  );
}

export function setupDetection() {

  document.addEventListener('visibilitychange', () => {

    if (document.hidden) {

      sendEvent('TAB_SWITCH');

      burstCapture();
    }
  });

  window.addEventListener('blur', () => {

    sendEvent('WINDOW_BLUR');

    burstCapture();
  });

  document.addEventListener('fullscreenchange', () => {

    if (!document.fullscreenElement) {

      sendEvent('FULLSCREEN_EXIT');

      burstCapture();
    }
  });

  window.addEventListener('resize', () => {

    sendEvent('WINDOW_RESIZE');
  });

  setInterval(() => {

    const devtoolsOpen =
      window.outerWidth - window.innerWidth > 160;

    if (devtoolsOpen) {

      sendEvent('DEVTOOLS_SUSPECTED');

      burstCapture();
    }

  }, 1000);
}