/* Shared behavior for recipe pages: stopwatch + cook-log button. */
(function () {
  var display = document.getElementById('timer-display');
  if (!display) return;

  var startBtn = document.getElementById('timer-start');
  var pauseBtn = document.getElementById('timer-pause');
  var resetBtn = document.getElementById('timer-reset');
  var elapsed = 0;
  var intervalId = null;
  var running = false;

  function format(totalSeconds) {
    var m = Math.floor(totalSeconds / 60);
    var s = totalSeconds % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function tick() {
    elapsed += 1;
    display.textContent = format(elapsed);
  }

  startBtn.addEventListener('click', function () {
    if (running) return;
    running = true;
    intervalId = setInterval(tick, 1000);
    startBtn.disabled = true;
    pauseBtn.disabled = false;
  });

  pauseBtn.addEventListener('click', function () {
    running = false;
    clearInterval(intervalId);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  });

  resetBtn.addEventListener('click', function () {
    running = false;
    clearInterval(intervalId);
    elapsed = 0;
    display.textContent = format(0);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  });
})();
