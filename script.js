var knob = document.querySelector("#knob1 .knob-indicator-container");
var ring = document.querySelector("#knob1 .ring-fill");
var temperatureDisplay = document.getElementById("temperature");
var waterEmoji = document.getElementById("water-emoji");

knob.onpointerdown = OnPointerDown;

var startY = 0;
var currentY = 0;
var lastRot = 140;

var maxRot = 140;
var speed = 1.5;

function OnPointerDown(event) {
    document.addEventListener('pointermove', OnPointerMove);
    document.addEventListener('pointerup', OnPointerUp);
    
    startY = event.clientY;
}

function OnPointerMove(event) {
    let delta = startY - event.clientY;
    currentY = lastRot + delta * speed;
    
    if (currentY > maxRot) currentY = maxRot;
    if (currentY < -maxRot) currentY = -maxRot;

    updateKnobAndTemperature(currentY);
}

function OnPointerUp(event) {
    lastRot = currentY;
    document.removeEventListener('pointermove', OnPointerMove);
    document.removeEventListener('pointerup', OnPointerUp);
}


function updateKnobAndTemperature(rotation) {
    knob.style.transform = "rotate(" + rotation + "deg)";

    if (rotation > 0) {
        ring.style.background = "conic-gradient(var(--accent) " + rotation + "deg, rgba(255,255,255,0.0) 0 360deg, var(--accent) 0deg)";
        let temp = Math.round(rotation / maxRot * 100); 
        temperatureDisplay.innerText = `${temp}°C`;
        updateWaterState(temp);
        document.querySelector('.knob-indicator').style.backgroundColor = rotation > 70 ? 'red' : '#16181A'; 
    } else {
        ring.style.background = "conic-gradient(var(--accent) 0deg, rgba(255,255,255,0.0) 0 " + (360 + rotation) + "deg, var(--accent) 0deg)";
        let temp = Math.round(-rotation / maxRot * 100); 
        temperatureDisplay.innerText = `${-temp}°C`;
        updateWaterState(-temp);
        document.querySelector('.knob-indicator').style.backgroundColor = '#16181A'; 
    }
}

// Atualiza o emoji e a animação
function updateWaterState(temp) {
    if (temp <= 0) {
        waterEmoji.innerText = "🧊"; 
    } else if (temp >= 100) {
        waterEmoji.innerText = "💨"; 
    } else {
        waterEmoji.innerText = "💧"; 
    }
    
    
    if (temp <= 7 || temp >= 95) {
        waterEmoji.classList.add('shake');
    } else {
        waterEmoji.classList.remove('shake');
    }
}


document.addEventListener('wheel', function(event) {
    event.preventDefault(); 
    let delta = Math.sign(event.deltaY) * -1; 
    currentY += delta * 10; 
    updateKnobAndTemperature(currentY);
});
