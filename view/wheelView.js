// This file contains the main view logic for the movie wheel application,
// and is responsible for rendering the wheel, handling animations,
// and displaying results in a visually engaging way.
// Written by Sander Rønning.

let currentRotation = 0;

// Sound objects for ticking and winning
const tickSound = new Audio('sounds/tick.mp3'); 
const winSound = new Audio('sounds/win.mp3');

// Renders the wheel with alternating colors and movie titles
export function renderWheel(items) {
    const wheel = document.getElementById("wheel");
  if (!wheel) return;
    wheel.innerHTML = "";

  // If no items are found, show a default background and exit 
  if (!items || items.length === 0) {
      wheel.style.background = "#1a1a1a"; 
  return;
  }

  // Define required variables for drawing segments
  const segmentAngle = 360 / items.length;
  const gradientParts = [];

  
  const styles = getComputedStyle(document.documentElement);
  
  // Define a color palette for the wheel segments using CSS variables
  const colors = [
    styles.getPropertyValue('--wheel-gold').trim(),
    styles.getPropertyValue('--wheel-black').trim(),
    styles.getPropertyValue('--wheel-dark-gold').trim(),
    styles.getPropertyValue('--wheel-pure-black').trim()
  ];

  // Loop through items to create gradient segments
  for(let i = 0; i < items.length; i++) {
    const start = i * segmentAngle;
    const end = (i + 1) * segmentAngle;
    const color = colors[i % colors.length];
    gradientParts.push(`${color} ${start}deg ${end}deg`);
  }
    // Apply the conic gradient to the wheel
    wheel.style.background = `conic-gradient(${gradientParts.join(", ")})`; 
  } 

 // Animates the wheel rotation and handles the ticking sound logic
export function spinWheelAnimation(selectedIndex, totalItems) {
  const wheel = document.getElementById("wheel");
  const segmentAngle = 360 / totalItems;
  
  // Reset sounds in case they are already playing from a previous spin
  tickSound.pause();
  winSound.pause();
  tickSound.currentTime = 0;
  winSound.currentTime = 0;

  // Calculate the total rotation needed to land on the selected index
  const targetAngle = (selectedIndex * segmentAngle + segmentAngle / 2);
  const extraSpins = 360 * 5; 
  const addedRotation = extraSpins + (360 - (currentRotation % 360)) - targetAngle;
  
  currentRotation += addedRotation;

  const duration = 5000;

  wheel.style.transition = `transform ${duration}ms cubic-bezier(0.15, 0, 0.15, 1)`;
  wheel.style.transform = `rotate(${currentRotation}deg)`;
 

  // SOUND LOGIC 
  const startTime = performance.now();
  let lastTickIndex = -1;
  let stopTicks = false; // Flag to kill the sound loop

  const checkTick = (currentTime) => {
    if (stopTicks) return; 

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing calculation to match the wheel's deceleration
    const easedProgress = 1 - Math.pow(1 - progress, 3); 
    const currentDegreesMoved = addedRotation * easedProgress;
    const currentTickIndex = Math.floor(currentDegreesMoved / segmentAngle);

    if (currentTickIndex !== lastTickIndex) {
      tickSound.currentTime = 0; 
      tickSound.play().catch(() => {}); 
      lastTickIndex = currentTickIndex;
    }

    // Continue checking until the animation is complete
    if (progress < 1) {
      requestAnimationFrame(checkTick);
    } else {
      stopTicks = true; 
    }
  };

  requestAnimationFrame(checkTick);

  // Return a promise that resolves when the spin is complete, allowing for chaining actions like showing results
  return new Promise((resolve) => {
    setTimeout(() => {
      stopTicks = true; 

      tickSound.pause();
      tickSound.currentTime = 0;

      winSound.play().catch(() => {}); 
      resolve();
    }, duration);
  });
}

/**
 * Opens or closes the visual curtains.
 */
export function toggleCurtains(open) {
  const left = document.querySelector('.curtain-left');
  const right = document.querySelector('.curtain-right');
  if (left && right) {
    open ? left.classList.add('open') : left.classList.remove('open');
    open ? right.classList.add('open') : right.classList.remove('open');
  }
}

/** 
 * Updates the result and triggers the popcorn pop-up modal.
 * @param {string} movie - The title of the selected movie.
 * @param {string} posterUrl - Full TMDb poster URL. 
 */
export function showResult(movie, posterUrl = null) {
  const modal = document.getElementById("movieModal");
  const modalResult = document.getElementById("modalResult");
  const modalPoster = document.getElementById("modalPoster"); 

  // Prevent placeholder text from triggering the pop-up
    if (!movie || movie.includes("Your movie"))
      return;

  // Set the movie title in the modal
    modalResult.textContent = movie;
    modalPoster.innerHTML = ""; 
    modal.style.display = "block";

    // Image element for the poster
    if (posterUrl) {
      const img = document.createElement("img");
      img.src = posterUrl;
      img.alt = `Poster for ${movie}`; 
      modalPoster.appendChild(img);
    } else {
      modalPoster.innerHTML = "<p>No poster available</p>";
    }
}


// Triggers a fun popcorn rain animation across the screen
export function triggerPopcornRain() {
  const amount = 50; // Total pieces of popcorn
  
// Create and animate each popcorn piece  
  for (let i = 0; i < amount; i++) {
    const popcorn = document.createElement('div');
    popcorn.className = 'popcorn-fall';
    popcorn.innerText = '🍿';
    
    // Randomize horizontal start position
    popcorn.style.left = Math.random() * 100 + 'vw';
    
    // Delay and duration for each popcorn to create a natural rain effect
    const duration = 2 + Math.random() * 3; 
    const delay = Math.random() * 2; 
    
    popcorn.style.animationDuration = duration + 's';
    popcorn.style.animationDelay = delay + 's';
    
    document.body.appendChild(popcorn);
    
    // Remove from DOM after animation finishes to keep site fast
    setTimeout(() => {
        popcorn.remove();
    }, (duration + delay) * 1000);
  }
}