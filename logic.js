// --- CONFIGURATION VARIABLE ---
// Adjust this variable to control the speed (in milliseconds per ROW/Line)
// 0ms makes it instant, 20ms is fast but noticeable.
const TYPE_SPEED_MS = 20; 


// Placeholder JavaScript functions for interactivity (game logic would go here)
function handleChoice(choice) {
    if (choice == 1) {
      animation = 'gun.txt';
      loadAsciiAnimation(true); 
    }
}

document.getElementById('inputForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const inputText = document.getElementById('gameInput').value;
    alert("You entered: " + inputText + ". (Game logic not implemented)");
    document.getElementById('gameInput').value = ''; 
});

const asciiOutput = document.getElementById('ascii-output');
let frames = [];
let currentFrameIndex = 0;
let animationInterval;
let animation = `title.txt`;
let isAnimatingFast = false; 

// Function to simulate a typewriter effect one row at a time
function typewriterEffectRowByRow(element, fullText) {
    clearInterval(animationInterval); 
    
    // Split the single text block into an array of lines based on newline characters
    const lines = fullText.split('\n');
    let lineIndex = 0;
    element.textContent = ''; // Clear existing text immediately

    function typeLine() {
        if (lineIndex < lines.length) {
            // Append the current line plus a newline character to maintain structure
            element.textContent += lines[lineIndex] + '\n';
            lineIndex++;
            
            // Set timeout for the next line
            if (TYPE_SPEED_MS > 0) {
                setTimeout(typeLine, TYPE_SPEED_MS);
            } else {
                requestAnimationFrame(typeLine); // Instant rendering if speed is 0
            }
        } else {
            // Once typing is done, if we just loaded a multi-frame animation, start the rapid looping
            if (frames.length > 1 && isAnimatingFast) {
                startRapidAnimation(150); // Start the animation loop after the initial type-in is done
            }
        }
    }
    typeLine(); // Start the process
}

async function loadAsciiAnimation(useTypewriterForFirstFrame = true) {
    clearInterval(animationInterval);
    isAnimatingFast = false; 

    try {
        const response = await fetch(animation);
        const text = await response.text();
        frames = text.split('---FRAME---').map(frame => frame.trim()).filter(frame => frame.length > 0);
        
        if (frames.length > 0) {
            if (frames.length > 1) {
                isAnimatingFast = true; 
            }
            
            if (useTypewriterForFirstFrame) {
                // Use the new row-by-row effect for the first frame
                // We pass frames[0] here as the text to type out
                typewriterEffectRowByRow(asciiOutput, frames[0]); 
            } else {
                displayFrame(0);
                if (isAnimatingFast) {
                    startRapidAnimation(150); 
                }
            }
        } else {
            asciiOutput.textContent = "No animation frames found.";
        }
    } catch (error) {
        console.error("Error loading ASCII animation:", error);
        asciiOutput.textContent = "Error loading animation.";
    }
}

function displayFrame(index) {
    // This runs fast within the interval, so no typewriter effect here
    asciiOutput.textContent = frames[index]; 
}

function startRapidAnimation(delay) {
    clearInterval(animationInterval); 
    animationInterval = setInterval(() => {
        currentFrameIndex = (currentFrameIndex + 1) % frames.length;
        displayFrame(currentFrameIndex); 
    }, delay);
}

// Load the initial animation when the page loads, using the configurable typewriter effect
window.onload = () => loadAsciiAnimation(true);
