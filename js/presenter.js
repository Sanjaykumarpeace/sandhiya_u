/* Advanced one-shot presenter activation with white-background keying */
(function () {
  'use strict';

  var presenter = document.getElementById('aiPresenter');
  var canvas = document.getElementById('aiPresenterCanvas');
  var button = document.getElementById('unmuteBtn');
  var icon = document.getElementById('btnIcon');
  var text = document.getElementById('btnText');
  var activated = false;
  var completed = false;
  var renderStarted = false;
  var ctx;
  var keyVisited;
  var keyQueue;
  var keyTotal = 0;

  if (!presenter) return;
  if (canvas) ctx = canvas.getContext('2d', { willReadFrequently: true });

  function fitCanvasToVideo () {
    if (!canvas || !presenter.videoWidth || !presenter.videoHeight) return false;

    var maxRenderHeight = 720;
    var scale = Math.min(1, maxRenderHeight / presenter.videoHeight);
    var targetWidth = Math.round(presenter.videoWidth * scale);
    var targetHeight = Math.round(presenter.videoHeight * scale);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    return true;
  }

  function isBackgroundCandidate (data, index) {
    var r = data[index];
    var g = data[index + 1];
    var b = data[index + 2];
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var chroma = max - min;
    var brightness = (r + g + b) / 3;
    var distanceFromWhite = Math.sqrt(
      Math.pow(255 - r, 2) + Math.pow(255 - g, 2) + Math.pow(255 - b, 2)
    );

    // More selective background detection to preserve white clothing/teeth/jewelry
    // Only remove very pure white with low color variation
    return (distanceFromWhite < 45) || 
           (brightness > 248 && chroma < 12) ||
           (brightness > 245 && chroma < 18 && distanceFromWhite < 60);
  }

  function removeWhiteBackground (frame) {
    var data = frame.data;
    var width = frame.width;
    var height = frame.height;
    var total = width * height;
    if (keyTotal !== total) {
      keyVisited = new Uint8Array(total);
      keyQueue = new Int32Array(total);
      keyTotal = total;
    } else {
      keyVisited.fill(0);
    }

    var visited = keyVisited;
    var queue = keyQueue;
    var head = 0;
    var tail = 0;

    function enqueueIfBackground (pixelIndex) {
      if (pixelIndex < 0 || pixelIndex >= total || visited[pixelIndex]) return;

      var dataIndex = pixelIndex * 4;
      if (!isBackgroundCandidate(data, dataIndex)) return;

      visited[pixelIndex] = 1;
      queue[tail++] = pixelIndex;
    }

    for (var x = 0; x < width; x++) {
      enqueueIfBackground(x);
      enqueueIfBackground((height - 1) * width + x);
    }

    for (var y = 0; y < height; y++) {
      enqueueIfBackground(y * width);
      enqueueIfBackground(y * width + width - 1);
    }

    while (head < tail) {
      var current = queue[head++];
      var cx = current % width;
      var cy = Math.floor(current / width);
      var currentDataIndex = current * 4;
      data[currentDataIndex + 3] = 0;

      if (cx > 0) enqueueIfBackground(current - 1);
      if (cx < width - 1) enqueueIfBackground(current + 1);
      if (cy > 0) enqueueIfBackground(current - width);
      if (cy < height - 1) enqueueIfBackground(current + width);
    }

    // Improved edge softening with gradient transition
    for (var i = 0; i < total; i++) {
      if (!visited[i]) continue;

      var px = i % width;
      var py = Math.floor(i / width);
      
      // Check neighbors for edge detection with larger radius
      var edgeRadius = 3;
      var nonBackgroundNeighbors = 0;
      
      for (var oy = -edgeRadius; oy <= edgeRadius; oy++) {
        for (var ox = -edgeRadius; ox <= edgeRadius; ox++) {
          var nx = px + ox;
          var ny = py + oy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;

          var neighbor = ny * width + nx;
          if (!visited[neighbor]) {
            nonBackgroundNeighbors++;
          }
        }
      }

      // Apply soft edge gradient based on proximity to non-background pixels
      if (nonBackgroundNeighbors > 0) {
        var distance = Math.min(nonBackgroundNeighbors, edgeRadius * 2);
        var softAlpha = Math.max(0, 255 - (distance * 35));
        
        for (var oy = -1; oy <= 1; oy++) {
          for (var ox = -1; ox <= 1; ox++) {
            var nx = px + ox;
            var ny = py + oy;
            if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;

            var neighbor = ny * width + nx;
            if (!visited[neighbor]) {
              var currentAlpha = data[neighbor * 4 + 3];
              data[neighbor * 4 + 3] = Math.min(currentAlpha, softAlpha);
            }
          }
        }
      }
    }
  }

  function renderPresenterFrame () {
    if (!ctx || !fitCanvasToVideo()) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(presenter, 0, 0, canvas.width, canvas.height);

    try {
      var frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      removeWhiteBackground(frame);
      ctx.putImageData(frame, 0, 0);
      canvas.classList.add('presenter-stage__canvas--keyed');
    } catch (err) {
      canvas.classList.add('presenter-stage__canvas--fallback');
    }
  }

  function startCanvasRenderer () {
    if (!ctx || renderStarted) return;
    renderStarted = true;

    function loop () {
      renderPresenterFrame();

      if (presenter.requestVideoFrameCallback) {
        presenter.requestVideoFrameCallback(loop);
      } else if (!completed) {
        requestAnimationFrame(loop);
      }
    }

    loop();
  }

  function setStatus (state) {
    if (!button) return;

    button.classList.toggle('is-active', state === 'active');
    button.classList.toggle('is-waiting', state === 'waiting');
    button.classList.toggle('is-ended', state === 'ended');
    button.disabled = state === 'ended';

    if (state === 'active') {
      if (icon) icon.textContent = '🔊';
      if (text) text.textContent = 'Introduction Playing';
      button.setAttribute('aria-label', 'Presenter introduction is playing');
    } else if (state === 'ended') {
      if (icon) icon.textContent = '✓';
      if (text) text.textContent = 'Intro Complete';
      button.setAttribute('aria-label', 'Presenter introduction complete');
    } else {
      if (icon) icon.textContent = '▶';
      if (text) text.textContent = 'Play Introduction';
      button.setAttribute('aria-label', 'Play presenter introduction');
    }
  }

  function initializePresenterOnInteraction () {
    if (activated || completed) return;

    activated = true;
    presenter.loop = false;
    presenter.currentTime = 0;
    presenter.muted = false;

    presenter.play()
      .then(function () {
        setStatus('active');
        document.removeEventListener('click', initializePresenterOnInteraction);
        document.removeEventListener('keydown', initializePresenterOnInteraction);
        console.log('Presenter successfully activated by site interaction.');
      })
      .catch(function (err) {
        activated = false;
        presenter.muted = true;
        setStatus('waiting');
        console.log('Browser blocked audio engine initialization. Waiting for a more explicit click context.', err);
      });
  }

  presenter.loop = false;
  presenter.muted = true;
  presenter.pause();

  presenter.addEventListener('loadedmetadata', function () {
    startCanvasRenderer();
    renderPresenterFrame();
  });
  presenter.addEventListener('loadeddata', renderPresenterFrame);
  presenter.addEventListener('canplay', renderPresenterFrame);
  presenter.addEventListener('play', startCanvasRenderer);
  presenter.addEventListener('ended', function () {
    completed = true;
    presenter.muted = true;
    renderPresenterFrame();
    setStatus('ended');
  });

  if (presenter.readyState >= 1) startCanvasRenderer();

  document.addEventListener('click', initializePresenterOnInteraction);
  document.addEventListener('keydown', initializePresenterOnInteraction);

  if (button) {
    button.addEventListener('click', function (event) {
      event.stopPropagation();
      initializePresenterOnInteraction();
    });
  }

  setStatus('waiting');
})();
