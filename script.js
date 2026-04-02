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
      console.log(sens);
      analyzer.getFloatTimeDomainData(pcm);
      let sum = 0;
      for (const n of pcm) {
        sum += n*n;
      }
      // let sum = pcm.reduce((a, b) => a + Math.pow(b, 2), 0);
      let size = Math.sqrt(sum / pcm.length) * 1000 * (sens / 50);
      let vissize = Math.min(Math.max(size, 25), 95);
      // console.log(size);
      // let vissize = size;
      if (size > 95) {
        hue += 10;
        hue %= 360;
        bg.style.backgroundColor = `hsl(${hue}, 100%, 20%)`;
        // console.log(bg.style.backgroundColor);
      }
      wm.setAttribute('width', `${vissize}%`);
      window.requestAnimationFrame(newFrame);
    }

    window.requestAnimationFrame(newFrame);
  }

  const settings = document.getElementById('settings-btn');
  const settingsRest = document.getElementById('settings-rest');
  let settingsOpen = false;
  settings.onclick = () => {
    console.log('hi');
    settingsRest.style.visibility = settingsOpen ? 'hidden' : 'visible';
    settingsOpen = !settingsOpen;
  }
};

