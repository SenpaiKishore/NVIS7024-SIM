let voltageData = [];
let currentData = [];
let powerData = [];
let timeData = [];
let voltageChart;
let currentVoltage = 0;
let currentAmpere = 0;
let speedPercentage  = 50;
let currentRotationSpeed = 0;
const maxRotationSpeed = 2800;
const acceleration = 7;
const decelerationRate = 7;
let animationFrameId = null
let toggleRotation = 0;
let motorToggle = true;
let directionToggle = true;
let directionMultiplier = 1;

function drawLines() {
  let powerButton = document.getElementById('powerButton').getBoundingClientRect();
  var smpsPositionXL = powerButton.left + window.scrollX;
  var smpsPositionY = powerButton.top + window.scrollY;
  var smpsPositionXR = powerButton.right + window.scrollX;

  document.getElementById('neutralCircle').setAttribute('cx', smpsPositionXL);
  document.getElementById('neutralCircle').setAttribute('cy', smpsPositionY - 50);

  document.getElementById('liveCircle').setAttribute('cx', smpsPositionXR);
  document.getElementById('liveCircle').setAttribute('cy', smpsPositionY - 50);

  document.getElementById('mainLine1').setAttribute('x1', smpsPositionXL);
  document.getElementById('mainLine1').setAttribute('y1', smpsPositionY);
  document.getElementById('mainLine1').setAttribute('x2', smpsPositionXL);
  document.getElementById('mainLine1').setAttribute('y2', smpsPositionY - 43.5);

  document.getElementById('mainLine2').setAttribute('x1', smpsPositionXR);
  document.getElementById('mainLine2').setAttribute('y1', smpsPositionY);
  document.getElementById('mainLine2').setAttribute('x2', smpsPositionXR);
  document.getElementById('mainLine2').setAttribute('y2', smpsPositionY - 43.5);
  

  document.getElementById('smpsLine1').setAttribute('x1', smpsPositionXL);
  document.getElementById('smpsLine1').setAttribute('y1', smpsPositionY);
  document.getElementById('smpsLine1').setAttribute('x2', smpsPositionXL);
  document.getElementById('smpsLine1').setAttribute('y2', smpsPositionY + 200);

  document.getElementById('smpsLine2').setAttribute('x1', smpsPositionXR);
  document.getElementById('smpsLine2').setAttribute('y1', smpsPositionY);
  document.getElementById('smpsLine2').setAttribute('x2', smpsPositionXR);
  document.getElementById('smpsLine2').setAttribute('y2', smpsPositionY + 200);

  document.getElementById('main-smpsN').setAttribute('x', smpsPositionXL - 5);
  document.getElementById('main-smpsN').setAttribute('y', smpsPositionY - 65);

  document.getElementById('main-smpsL').setAttribute('x', smpsPositionXR - 5);
  document.getElementById('main-smpsL').setAttribute('y', smpsPositionY - 65);

}

document.addEventListener('DOMContentLoaded', () => {
  const powerButton = document.getElementById('powerButton');

  let isPowerOn = false;
  const knob = document.getElementById('knob');
  let isDragging = false;
  let startY = 0;
  let tireRotation = 0;
  let currentRotation = 0;
  const tire = document.getElementById('tire');
  const toggle = document.getElementById('toggle');
  const dirToggle = document.getElementById('toggle1');
  let pendingDirectionChange = false;


  function getRotationDegrees(yMove) {
    const degreesPerPixel = 180 / 100;
    return yMove * degreesPerPixel;
  }

  function calculateRPM(knobPercentage) {
    return knobPercentage * maxRotationSpeed / 100;
  }

  function animateTire(timestamp) {
    let shouldAnimate = isPowerOn && motorToggle;
    const degreesPerRPM = 6;
  
    if (shouldAnimate) {
      let targetRotationSpeed = calculateRPM(speedPercentage);
  
      if (currentRotationSpeed < targetRotationSpeed) {
        currentRotationSpeed += acceleration;
      } else if (currentRotationSpeed > targetRotationSpeed) {
        currentRotationSpeed -= decelerationRate;
      }
    } else {
      if (currentRotationSpeed !== 0) {
        currentRotationSpeed -= decelerationRate * Math.sign(currentRotationSpeed);
      }
    }
    const degreesPerFrame = currentRotationSpeed * degreesPerRPM / 60;
    tireRotation += degreesPerFrame;
    tire.style.transform = `rotate(${tireRotation}deg)`;

    if (currentRotationSpeed !== 0 || shouldAnimate) {
      animationFrameId = requestAnimationFrame(animateTire);
    } else {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  
    updateStats();
    updateVoltageLabel();
    updateCurrentLabel();
  }
  

  
  function updateVoltageLabel() {
    const maxVoltage = 24.2; 
    if (isPowerOn && motorToggle) {
      currentVoltage = (speedPercentage / 100) * maxVoltage;
    } else if (!motorToggle){
      currentVoltage = (currentRotationSpeed / maxRotationSpeed) * maxVoltage;
    } else {
      currentVoltage = 0;
    }
  
    document.getElementById('voltageLabel').innerText = `${currentVoltage.toFixed(2)}V`;
  }
  function updateCurrentLabel() {
    const maxCurrent = 1.5;
    if (isPowerOn && motorToggle) {
      currentAmpere = (speedPercentage / 100) * maxCurrent;
    } else if (!motorToggle){
      currentAmpere = (currentRotationSpeed / maxRotationSpeed) * maxCurrent;
    } else {
      currentAmpere = 0;
    }
    document.getElementById('currentLabel').innerText = `${currentAmpere.toFixed(2)}A`;
  }

  function updateKnob(value) {
    value = Math.max(-90, Math.min(90, value));
    knob.style.transform = `rotate(${value}deg)`;
    speedPercentage = (value + 90) / 180 * 100 * directionMultiplier;
    console.log(`Knob value: ${speedPercentage.toFixed(2)}%`);
    updateStats();
    updateVoltageLabel();
    
  }

  function updateStats(){
    document.getElementById('knobPercentage').innerHTML = `${speedPercentage.toFixed(2)}%`;
    document.getElementById('rpm').innerHTML = `${currentRotationSpeed}RPM`;
  }

  function togglePower() {
    isPowerOn = !isPowerOn;
    powerButton.style.backgroundColor = isPowerOn ? 'red' : 'white';
    powerButton.style.color = isPowerOn ? 'white' : 'black';
  
    if (isPowerOn) {
      const knobValue = (currentRotation + 90) / 180;
      speedPercentage = knobValue * 100;
  
      animateTire();
    } else {
      speedPercentage = 0;
    }
    updateStats();
    updateVoltageLabel();
    updateCurrentLabel();
  }

  toggle.addEventListener('click', () => {
    toggleRotation = toggleRotation === 0 ? -180 : 0;
    motorToggle = toggleRotation === 0;
  
    toggle.style.transform = `rotate(${toggleRotation}deg)`;
    console.log(motorToggle);
    if (motorToggle && isPowerOn) {
      const knobValue = (currentRotation + 90) / 180;
      speedPercentage = knobValue * 100;
      animateTire();
    } else {
      speedPercentage = 0;
    }
  });

  dirToggle.addEventListener('click', () => {
    pendingDirectionChange = true;
    directionToggle = !directionToggle;
    toggleRotation = directionToggle ? 0 : -180;
    dirToggle.style.transform = `rotate(${toggleRotation}deg)`;
    directionMultiplier *= -1;
    speedPercentage *= -1;
  });
  
  
  
  

  knob.addEventListener('mousedown', event => {
    isDragging = true;
    startY = event.clientY;
    document.body.style.userSelect = 'none';
    event.preventDefault();
  });

  document.addEventListener('mousemove', event => {
    if (isDragging) {
      const deltaY = event.clientY - startY;
      const newRotation = currentRotation - getRotationDegrees(deltaY);
      updateKnob(newRotation);
    }
  });

  document.addEventListener('mouseup', event => {
    if (isDragging) {
      const deltaY = event.clientY - startY;
      currentRotation -= getRotationDegrees(deltaY);
      currentRotation = Math.max(-90, Math.min(90, currentRotation));
      updateKnob(currentRotation);
      isDragging = false;
      document.body.style.userSelect = '';
    }
  });


  const voltageCtx = document.getElementById('voltageChart').getContext('2d');
  voltageChart = new Chart(voltageCtx, {
    type: 'line',
    data: {
      labels: timeData,
      datasets: [{
        label: 'Voltage',
        data: voltageData,
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        xAxes: [{
          type: 'realtime',
          realtime: {
            duration: 20000,
            refresh: 1000,
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      maintainAspectRatio: false
    }
  });

  const currentCtx = document.getElementById('currentChart').getContext('2d');
  currentChart = new Chart(currentCtx, {
    type: 'line',
    data: {
      labels: timeData,
      datasets: [{
        label: 'Current',
        data: currentData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        xAxes: [{
          type: 'realtime',
          realtime: {
            duration: 20000,
            refresh: 1000,
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      maintainAspectRatio: false
    }
  });

  const powerCtx = document.getElementById('powerChart').getContext('2d');
  powerChart = new Chart(powerCtx, {
    type: 'line',
    data: {
      labels: timeData,
      datasets: [{
        label: 'Power',
        data: powerData,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        xAxes: [{
          type: 'realtime',
          realtime: {
            duration: 20000,
            refresh: 1000,
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      maintainAspectRatio: false
    }
  });

  setInterval(() => {
    const now = new Date().toLocaleTimeString();

    if (timeData.length > 30) {
      timeData.shift();
      voltageData.shift();
      currentData.shift();
      powerData.shift();
    }

    timeData.push(now);
    voltageData.push(currentVoltage);
    currentData.push(currentAmpere);
    powerData.push(currentAmpere * currentVoltage);

    voltageChart.update();
    currentChart.update();
    powerChart.update();
  }, 500);

  powerButton.addEventListener('click', togglePower);
  window.addEventListener('load', () => {
    currentRotation = 0; 
    speedPercentage = 50; 
    updateKnob(currentRotation);
  });
  drawLines();
  updateStats();
  updateVoltageLabel();
});

window.addEventListener('resize', drawLines);
