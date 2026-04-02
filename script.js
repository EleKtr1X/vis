window.onload = async (e) => {
  const wm = document.getElementById('wordmark');
  const bg = document.body;

  let hue = 0;
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

  if (stream) {
    const ctx = new AudioContext();
    const analyzer = ctx.createAnalyser();
    const mic = ctx.createMediaStreamSource(stream);

    mic.connect(analyzer);

    const pcm = new Float32Array(analyzer.fftSize);

    function newFrame() {
      const sens = document.getElementById('settings-sens').value;
      analyzer.getFloatTimeDomainData(pcm);
      let sum = pcm.reduce((a, b) => a + Math.pow(b, 2), 0);
      // i don't think this is actually how sensitivity works
      let size = Math.sqrt(sum / pcm.length) * 1000 * (sens / 25);
      size = Math.min(Math.max(size, 25), 95);
      let lightness = Math.round(size / 95 * 50);
      bg.style.backgroundColor = `hsl(${hue}, 100%, ${lightness}%)`;
      if (size == 95) {
        hue += 11;
        hue %= 360;
      }
      wm.setAttribute('width', `${size}%`);
      window.requestAnimationFrame(newFrame);
    }

    window.requestAnimationFrame(newFrame);
  }

  const settings = document.getElementById('settings-btn');
  const settingsRest = document.getElementById('settings-rest');
  let settingsOpen = false;
  settings.onclick = () => {
    settingsRest.style.visibility = settingsOpen ? 'hidden' : 'visible';
    settingsOpen = !settingsOpen;
  }
};

