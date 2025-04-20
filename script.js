import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // Import OrbitControls

let scene, camera, renderer, skySphere, controls;
let currentTime = new Date();
let timeRate = 1; // 1 second simulation per real second
let timeSimulationInterval = null; // To hold the interval for time simulation

const latitudeInput = document.getElementById('latitude');
const longitudeInput = document.getElementById('longitude');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const applyButton = document.getElementById('apply-changes');
const timeRateInput = document.getElementById('time-rate');
const startTimeButton = document.getElementById('start-time');
const stopTimeButton = document.getElementById('stop-time');
const infoPanel = document.getElementById('info-panel');
const controlsPanel = document.getElementById('controls-panel');
const toggleInfoButton = document.getElementById('toggle-info');
const toggleControlsButton = document.getElementById('toggle-controls');
const objectNameElement = document.getElementById('object-name');
const objectTypeElement = document.getElementById('object-type');
const objectMagnitudeElement = document.getElementById('object-magnitude');


function init() {
    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1); // Start inside the sphere

    // Renderer setup
    const canvas = document.getElementById('sky-canvas');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1); // Black background

    // Add sky sphere
    const geometry = new THREE.SphereGeometry(500, 60, 40); // Large sphere
    // Invert the sphere normals so the texture is on the inside
    geometry.scale(-1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00081F }); // A very dark blueish tint
    skySphere = new THREE.Mesh(geometry, material);
    scene.add(skySphere);

    // Add OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = false; // Typically don't pan in a sky sphere
    controls.enableDamping = true; // Smooth controls
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;

    // Initial UI setup
    const now = new Date();
    dateInput.valueAsDate = now;
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    timeInput.value = `${hours}:${minutes}`;
    applyLocationTime(); // Apply initial values

    // Event Listeners
    window.addEventListener('resize', onWindowResize, false);
    applyButton.addEventListener('click', applyLocationTime);
    startTimeButton.addEventListener('click', startTimeSimulation);
    stopTimeButton.addEventListener('click', stopTimeSimulation);
    toggleControlsButton.addEventListener('click', () => togglePanel(controlsPanel));
    toggleInfoButton.addEventListener('click', () => togglePanel(infoPanel));

    // Start the animation loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Update controls if they have damping enabled
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function applyLocationTime() {
    const latitude = parseFloat(latitudeInput.value);
    const longitude = parseFloat(longitudeInput.value);
    const date = dateInput.value;
    const time = timeInput.value;

    if (isNaN(latitude) || isNaN(longitude) || !date || !time) {
        console.error("Invalid location or time input.");
        return;
    }

    // Combine date and time input into a single Date object
    const dateTimeString = `${date}T${time}:00`; // Assuming time input is HH:MM
    currentTime = new Date(dateTimeString);

    console.log(`Applying location: Lat ${latitude}, Lon ${longitude}`);
    console.log(`Applying time: ${currentTime}`);

    // TODO: Call functions here to update celestial object positions based on the new location and time
    // This is where you'll integrate your astronomical calculations library
    updateCelestialObjects(latitude, longitude, currentTime);
}

function startTimeSimulation() {
    const rate = parseFloat(timeRateInput.value);
    if (isNaN(rate) || rate <= 0) {
        console.error("Invalid time rate input.");
        return;
    }

    // Clear any existing interval
    stopTimeSimulation();

    // Simulate time passing
    timeSimulationInterval = setInterval(() => {
        // Add 'rate' seconds to the current time for each real second
        currentTime.setSeconds(currentTime.getSeconds() + rate);
        console.log(`Current simulated time: ${currentTime}`);

        // TODO: Update celestial object positions for the new time
        updateCelestialObjects(parseFloat(latitudeInput.value), parseFloat(longitudeInput.value), currentTime);

        // Optionally, update the date/time inputs on the UI (can be performance intensive)
        // updateDateTimeInputs(currentTime);

    }, 1000); // Update every 1000ms (1 real second)
}

function stopTimeSimulation() {
    if (timeSimulationInterval !== null) {
        clearInterval(timeSimulationInterval);
        timeSimulationInterval = null;
        console.log("Time simulation stopped.");
    }
}

// Function to update the date/time inputs on the UI (Optional)
function updateDateTimeInputs(dateObj) {
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');

    dateInput.value = `${year}-${month}-${day}`;
    timeInput.value = `${hours}:${minutes}`;
}


function togglePanel(panelElement) {
    if (panelElement.style.display === 'none' || panelElement.style.display === '') {
        panelElement.style.display = 'block';
    } else {
        panelElement.style.display = 'none';
    }
}

// TODO: Placeholder function for updating celestial objects
function updateCelestialObjects(latitude, longitude, time) {
    // This is where you will perform astronomical calculations
    // and update the positions of stars, planets, etc. in the Three.js scene.
    console.log(`Updating celestial objects for Lat: ${latitude}, Lon: ${longitude}, Time: ${time}`);

    // Example: You would call your astronomical library here:
    // const starPositions = astronomicalLibrary.getStarPositions(latitude, longitude, time);
    // const planetPositions = astronomicalLibrary.getPlanetPositions(latitude, longitude, time);

    // Then update the positions of your Three.js objects based on these calculations.
}

// TODO: Placeholder function for displaying object info
function displayObjectInfo(object) {
    if (object) {
        objectNameElement.textContent = `Name: ${object.name || 'Unknown'}`;
        objectTypeElement.textContent = `Type: ${object.type || 'Unknown'}`;
        objectMagnitudeElement.textContent = `Magnitude: ${object.magnitude !== undefined ? object.magnitude.toFixed(2) : 'N/A'}`;
        // Update other info lines as needed
        infoPanel.style.display = 'block'; // Show info panel when an object is selected
    } else {
        objectNameElement.textContent = 'Select an object...';
        objectTypeElement.textContent = '';
        objectMagnitudeElement.textContent = '';
       // infoPanel.style.display = 'none'; // Optionally hide when nothing is selected
    }
}

// Initialize the application
init();

// Example of how you might call displayObjectInfo later:
// displayObjectInfo({ name: 'Sirius', type: 'Star', magnitude: -1.46 });
// displayObjectInfo(null); // To clear info

