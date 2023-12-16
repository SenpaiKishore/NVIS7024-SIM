let voltageData = [];
let currentData = [];
let powerData = [];
let timeData = [];
let voltageChart;
let currentVoltage = 0;
let currentAmpere = 0;
let speedPercentage  = 50;
let currentRotationSpeed = 0;
const maxRotationSpeed = 2800; // Maximum rotation speed in RPM at 100%
const acceleration = 10;
const decelerationRate = 10;
let animationFrameId = null
let toggleRotation = 0; // Start with toggle at +90 degrees
let motorToggle = true;

function drawSwitchLine(){
  var motorPositionX = document.getElementById('circuitMotor').getBoundingClientRect().left + window.scrollX + 105;
  var spdtPositionXL = document.getElementById('switchCircuit-box').getBoundingClientRect().left + window.scrollX + 20;
  var spdtPositionXR = document.getElementById('switchCircuit-box').getBoundingClientRect().right + window.scrollX - 20;
  var spdtPositionY = document.getElementById('switchCircuit-box').getBoundingClientRect().bottom + window.scrollY - 20;


  document.getElementById('switchLine').setAttribute('x1', motorPositionX);
  document.getElementById('switchLine').setAttribute('y1',spdtPositionY);
  if(toggleRotation == 0){
    document.getElementById('switchLine').setAttribute('x2', spdtPositionXL);
    document.getElementById('switchLine').setAttribute('y2', spdtPositionY);
  } else {
    document.getElementById('switchLine').setAttribute('x2', spdtPositionXR);
    document.getElementById('switchLine').setAttribute('y2', spdtPositionY);
  }
}


function drawLines() {
   // Drawing the circuit
  //SMPS to Parameter
  var smpsPositionXL = document.getElementById('powerButton').getBoundingClientRect().left + window.scrollX;
  var smpsPositionY = document.getElementById('powerButton').getBoundingClientRect().top + window.scrollY;
  var smpsPositionXR = document.getElementById('powerButton').getBoundingClientRect().right + window.scrollX;

  var spdtPositionXL = document.getElementById('switchCircuit-box').getBoundingClientRect().left + window.scrollX + 20;
  var spdtPositionXR = document.getElementById('switchCircuit-box').getBoundingClientRect().right + window.scrollX - 20;
  var spdtPositionY = document.getElementById('switchCircuit-box').getBoundingClientRect().bottom + window.scrollY - 20;

  var motorPositionX = document.getElementById('circuitMotor').getBoundingClientRect().left + window.scrollX + 105;
  var motorPositionYT = document.getElementById('circuitMotor').getBoundingClientRect().top + window.scrollY + 25;
  var motorPositionYB = document.getElementById('circuitMotor').getBoundingClientRect().bottom + window.scrollY + 16;

  var voltPositionX = document.getElementById('voltage-box').getBoundingClientRect().left + window.scrollX + 30;
  
  var lightPositionX = document.getElementById('lightImg').getBoundingClientRect().left + window.scrollX + 2;
  var lightPositionY = document.getElementById('lightImg').getBoundingClientRect().bottom + window.scrollX - 23;

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
  document.getElementById('smpsLine1').setAttribute('y2', motorPositionYB);

  document.getElementById('smpsLine2').setAttribute('x1', smpsPositionXR);
  document.getElementById('smpsLine2').setAttribute('y1', smpsPositionY);
  document.getElementById('smpsLine2').setAttribute('x2', smpsPositionXR);
  document.getElementById('smpsLine2').setAttribute('y2', motorPositionYT);

  document.getElementById('powerLine1').setAttribute('x1', smpsPositionXR);
  document.getElementById('powerLine1').setAttribute('y1',spdtPositionY);
  document.getElementById('powerLine1').setAttribute('x2', spdtPositionXL);
  document.getElementById('powerLine1').setAttribute('y2', spdtPositionY);

  document.getElementById('switchCircle1').setAttribute('cx', spdtPositionXL);
  document.getElementById('switchCircle1').setAttribute('cy', spdtPositionY);

  document.getElementById('switchCircle2').setAttribute('cx', motorPositionX);
  document.getElementById('switchCircle2').setAttribute('cy', spdtPositionY);

  document.getElementById('switchCircle3').setAttribute('cx', spdtPositionXR);
  document.getElementById('switchCircle3').setAttribute('cy', spdtPositionY);

  document.getElementById('powerLine2').setAttribute('x1', smpsPositionXL);
  document.getElementById('powerLine2').setAttribute('y1', motorPositionYB);
  document.getElementById('powerLine2').setAttribute('x2', lightPositionX + 15);
  document.getElementById('powerLine2').setAttribute('y2', motorPositionYB);

  document.getElementById('motorLine1').setAttribute('x1', motorPositionX);
  document.getElementById('motorLine1').setAttribute('y1', motorPositionYT);
  document.getElementById('motorLine1').setAttribute('x2', motorPositionX);
  document.getElementById('motorLine1').setAttribute('y2', spdtPositionY);

  document.getElementById('motorLine2').setAttribute('x1', motorPositionX);
  document.getElementById('motorLine2').setAttribute('y1', motorPositionYB + 1);
  document.getElementById('motorLine2').setAttribute('x2', motorPositionX);
  document.getElementById('motorLine2').setAttribute('y2', motorPositionYB-50);

  document.getElementById('voltLine1').setAttribute('x1', motorPositionX);
  document.getElementById('voltLine1').setAttribute('y1', motorPositionYT - 35);
  document.getElementById('voltLine1').setAttribute('x2', voltPositionX);
  document.getElementById('voltLine1').setAttribute('y2', motorPositionYT - 35);

  document.getElementById('voltLine2').setAttribute('x1', voltPositionX);
  document.getElementById('voltLine2').setAttribute('y1', motorPositionYT - 35);
  document.getElementById('voltLine2').setAttribute('x2', voltPositionX);
  document.getElementById('voltLine2').setAttribute('y2', motorPositionYB);

  document.getElementById('lightLine1').setAttribute('x1', spdtPositionXR);
  document.getElementById('lightLine1').setAttribute('y1', spdtPositionY);
  document.getElementById('lightLine1').setAttribute('x2', lightPositionX);
  document.getElementById('lightLine1').setAttribute('y2', spdtPositionY);

  document.getElementById('lightLine2').setAttribute('x1', lightPositionX);
  document.getElementById('lightLine2').setAttribute('y1', spdtPositionY);
  document.getElementById('lightLine2').setAttribute('x2', lightPositionX);
  document.getElementById('lightLine2').setAttribute('y2', lightPositionY);

  document.getElementById('lightLine3').setAttribute('x1', lightPositionX + 15);
  document.getElementById('lightLine3').setAttribute('y1', lightPositionY);
  document.getElementById('lightLine3').setAttribute('x2', lightPositionX + 15);
  document.getElementById('lightLine3').setAttribute('y2', motorPositionYB);
  drawSwitchLine();

  document.getElementById('main-smpsN').setAttribute('x', smpsPositionXL - 5);
  document.getElementById('main-smpsN').setAttribute('y', smpsPositionY - 65);

  document.getElementById('main-smpsL').setAttribute('x', smpsPositionXR - 5);
  document.getElementById('main-smpsL').setAttribute('y', smpsPositionY - 65);

  document.getElementById('switchText1').setAttribute('x', spdtPositionXL - 50);
  document.getElementById('switchText1').setAttribute('y', spdtPositionY + 35);
  
  document.getElementById('switchText2').setAttribute('x', spdtPositionXR - 10);
  document.getElementById('switchText2').setAttribute('y', spdtPositionY + 35);

}

document.addEventListener('DOMContentLoaded', () => {
  const powerButton = document.getElementById('powerButton');
  const lightImg = document.getElementById("lightImg").getBoundingClientRect()
  document.getElementById("lightImgOn").style.top = lightImg.top - 17 + 'px';
  document.getElementById("lightImgOn").style.left = lightImg.left + 25 + 'px';

  let isPowerOn = false;
  const knob = document.getElementById('knob');
  let isDragging = false;
  let startY = 0;
  let tireRotation = 0;
  let currentRotation = 0;
  const tire = document.getElementById('tire');
  const toggle = document.getElementById('toggle');

  function getRotationDegrees(yMove) {
    // Calculate rotation, with 1 pixel movement corresponding to 1 degree of rotation
    const degreesPerPixel = 180 / 100; // assuming 100 pixels movement for full range
    return yMove * degreesPerPixel;
  }

  function calculateRPM(knobPercentage) {
    return knobPercentage * maxRotationSpeed / 100;
  }

  function animateTire(timestamp) {
  let shouldAnimate = isPowerOn && motorToggle;
  const degreesPerRPM = 6;

  if (shouldAnimate) {
    const targetRotationSpeed = calculateRPM(speedPercentage);
     // Each RPM is 6 degrees per second (360 degrees per minute)

    // Accelerate or decelerate to the target speed
    if (currentRotationSpeed < targetRotationSpeed) {
      currentRotationSpeed += acceleration;
    } else if (currentRotationSpeed > targetRotationSpeed) {
      currentRotationSpeed -= decelerationRate;
    }
  } else {
    // Gradually stop the tire
    if (currentRotationSpeed > 0) {
      currentRotationSpeed -= decelerationRate;
    }
  }

  // Ensure speed doesn't go below 0
  currentRotationSpeed = Math.max(currentRotationSpeed, 0);

  // Update rotation based on current speed
  const degreesPerFrame = currentRotationSpeed * degreesPerRPM / 60; // Assuming 60 fps
  tireRotation += degreesPerFrame;
  tireRotation = tireRotation % 360;
  tire.style.transform = `rotate(${tireRotation}deg)`;

  // Continue animation if there is still rotation speed
  if (currentRotationSpeed > 0) {
    animationFrameId = requestAnimationFrame(animateTire);
  } else {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  updateStats();
  updateVoltageLabel();
  updateCurrentLabel();
  updateLightImage();
}

  
  function updateVoltageLabel() {
    const maxVoltage = 24.2; // Max voltage at 100%
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
    const maxCurrent = 1.5; // Maximum current at 2800 RPM
    if (isPowerOn && motorToggle) {
      currentAmpere = (speedPercentage / 100) * maxCurrent;
    } else if (!motorToggle){
      currentAmpere = (currentRotationSpeed / maxRotationSpeed) * maxCurrent;
    } else {
      currentAmpere = 0;
    }
    document.getElementById('currentLabel').innerText = `${currentAmpere.toFixed(2)}A`;
  }

  function updateLightImage() {
    const lightImg = document.getElementById('lightImgOn');
    
    if (motorToggle) {
 // Path to your light on image
      lightImg.style.opacity = 0;
    } else {
      const opacity = currentRotationSpeed / maxRotationSpeed;
      lightImg.style.opacity = opacity;
    }
  }
  
  
  

  function updateKnob(value) {
    // Clamp the value to the range -90 to 90
    value = Math.max(-90, Math.min(90, value));
    // Apply rotation to the knob
    knob.style.transform = `rotate(${value}deg)`;
    // Convert the angle to a percentage and log it
    speedPercentage = (value + 90) / 180 * 100;
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
      // Recalculate the speedPercentage based on the current knob position
      const knobValue = (currentRotation + 90) / 180; // Convert knob rotation to percentage
      speedPercentage = knobValue * 100; // Convert to percentage
  
      animateTire(); // Start or resume the animation
    } else {
      // Set target speed to 0 for smooth deceleration
      speedPercentage = 0;
    }
    updateStats();
    updateVoltageLabel();
    updateCurrentLabel();
    updateLightImage();
  }

  toggle.addEventListener('click', () => {
    toggleRotation = toggleRotation === 0 ? -180 : 0;
    motorToggle = toggleRotation === 0;
  
    toggle.style.transform = `rotate(${toggleRotation}deg)`;
    drawSwitchLine();
    console.log(motorToggle);
    if (motorToggle && isPowerOn) {
      const knobValue = (currentRotation + 90) / 180; // Convert knob rotation to percentage
      speedPercentage = knobValue * 100;
      animateTire();
    } else {
      // Set target speed to 0 for smooth deceleration
      speedPercentage = 0;
    }
  });
  

  knob.addEventListener('mousedown', event => {
    isDragging = true;
    startY = event.clientY;
    // Cancel any text selection
    document.body.style.userSelect = 'none';
    event.preventDefault(); // Prevent default drag behavior
  });

  document.addEventListener('mousemove', event => {
    if (isDragging) {
      const deltaY = event.clientY - startY;
      // Calculate the new rotation based on deltaY
      const newRotation = currentRotation - getRotationDegrees(deltaY);
      // Update the knob with the new rotation
      updateKnob(newRotation);
    }
  });

  document.addEventListener('mouseup', event => {
    if (isDragging) {
      // Finalize the rotation value
      const deltaY = event.clientY - startY;
      currentRotation -= getRotationDegrees(deltaY);
      currentRotation = Math.max(-90, Math.min(90, currentRotation)); // Clamp final rotation
      updateKnob(currentRotation); // Update for the last time
      isDragging = false;
      // Restore text selection
      document.body.style.userSelect = '';
    }
  });


  // Initialize the voltmeter with a value of 0 because the power is off
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
      timeData.shift(); // Remove the oldest time data
      voltageData.shift(); // Remove the oldest voltage data
      currentData.shift();
      powerData.shift(); // Remove the oldest current data
    }

    timeData.push(now);
    voltageData.push(currentVoltage);
    currentData.push(currentAmpere);
    powerData.push(currentAmpere * currentVoltage);

    voltageChart.update();
    currentChart.update();
    powerChart.update();
  }, 500);
  

  // Event listener for the power button
  powerButton.addEventListener('click', togglePower);
  window.addEventListener('load', () => {
    currentRotation = 0; // This is the default knob rotation angle
    speedPercentage = 50; // Default speed percentage when the app loads
    updateKnob(currentRotation);
  });
  drawLines();
  updateStats();
  updateVoltageLabel();
});

window.addEventListener('resize', drawLines);
