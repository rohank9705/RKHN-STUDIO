// This file contains all my design animation Javascript. I have used GSAP, Anime.js, and Lenis smooth scroll so far. 


// Register the GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. INITIALIZE LENIS SMOOTH SCROLLING
// ==========================================
const lenis = new Lenis({
  duration: 0.8, 
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

// Properly hook Lenis into GSAP's internal ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Disable GSAP's lag smoothing to prevent jitter
gsap.ticker.lagSmoothing(0);

// Hook Lenis into GSAP's internal ticker
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Register the GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// ==========================================
// 2. HERO SECTION ANIMATION (Typewriter Sequence)
// ==========================================
const heroTl = gsap.timeline();

// Target the elements
const heroH1 = document.querySelector(".hero-content h1");
const heroP = document.querySelector(".hero-content p");

// Clear the HTML so it starts blank
heroH1.innerText = "";
heroP.innerText = "";

// Initial state for the right-side box
gsap.set(".what-we-do", { y: 40, opacity: 0 });

// Build the timeline sequence
heroTl
  // 1. Start cursor and type first word
  .call(() => heroH1.classList.add("typing-cursor"))
  // Wait 1.5s, then type the rest of H1
  .to(heroH1, { duration: 1.2, text: "Welcome to RKHN STUDIO.", ease: "none" }, "+=0.5")
  
  // Wait 1.5s at the end of the H1, then set a master synchronization label
  .addLabel("h1Finished", "+=0.5")
  
  // Instantly swap the cursor to the paragraph at the sync label
  .call(() => {
      heroH1.classList.remove("typing-cursor");
      heroP.classList.add("typing-cursor");
  }, [], "h1Finished")
  
  // Fade in the right-side box concurrently at the sync label
  .to(".what-we-do", { y: 0, opacity: 1, duration: 1, ease: "power4.out" }, "h1Finished")
  
  .to(heroP, { duration: 1.5, text: "Custom full stack web development, ", ease: "none" }, "+=0.5")
    
  // Wait 1.5s, type the final chunk
  .to(heroP, { duration: 3, text: "Custom full stack web development, from backend architecture to high-end frontend design.", ease: "none" }, "+=0.75");


// ==========================================
// 3. HERO EXIT PARALLAX (Desktop Only)
// ==========================================

let mm = gsap.matchMedia();

// Only run the parallax on screens larger than 992px
mm.add("(min-width: 993px)", () => {
    // Move the left column up significantly faster
    gsap.to(".hero-content", {
        y: -300, 
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",      
            end: "bottom top",     
            scrub: true
        }
    });

    // Move the right column up slightly
    gsap.to(".what-we-do", {
        y: -100, 
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
});


// ==========================================
// 4. SERVICES SECTION ANIMATIONS
// ==========================================

// 1. Draw the Red Underline
ScrollTrigger.create({
    trigger: "#services",
    start: "top 80%", // Fires when the top of the section reaches 80% down your screen
    onEnter: () => {
        document.querySelector("#services .section-header h2").classList.add("draw-line");
    }
});

// 2. Staggered Card Cascade
// Instantly hide the cards on page load
gsap.set(".service-card", { y: 60, opacity: 0 });

// Animate them back to their original positions on scroll
gsap.to(".service-card", {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.2, 
    scrollTrigger: {
        trigger: ".services-grid",
        start: "top 85%"
    }
});

// ==========================================
// 5. CARD SPOTLIGHT GLOW EFFECT
// ==========================================

// Target all service cards
const cards = document.querySelectorAll('.service-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        // Get the card's exact position and size on the screen
        const rect = card.getBoundingClientRect();
        
        // Calculate the mouse's X and Y coordinates relative to the card itself
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Update the CSS variables natively
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});


// ==========================================
// 6. MAGNETIC ACTION BUTTONS
// ==========================================

const magneticButtons = document.querySelectorAll('.btn-primary, .btn-services');

magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        
        // Find the exact center of the button
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate the distance between the mouse and the center
        const x = e.clientX - rect.left - centerX;
        const y = e.clientY - rect.top - centerY;
        
        // Pull the button slightly toward the mouse
        gsap.to(btn, {
            x: x * 0.4, 
            y: y * 0.4,
            duration: 0.4,
            ease: "power3.out"
        });
    });

    // Snap it back into place when the mouse leaves
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)" // Creates a springy bounce effect
        });
    });
});