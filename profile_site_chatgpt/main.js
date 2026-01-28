/* =====================================================
   Scroll Animation (Intersection Observer)
===================================================== */
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.15,
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".fade").forEach(el => {
  fadeObserver.observe(el);
});

/* =====================================================
   Smooth Scroll (Anchor Links)
===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    const targetId = anchor.getAttribute("href");
    if (targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

/* =====================================================
   Hamburger Menu (Mobile)
===================================================== */
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".mobile-nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    menuButton.classList.toggle("active");
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menuButton.classList.remove("active");
      nav.classList.remove("open");
    });
  });
}

/* =====================================================
   Cursor Follower Effect (Tech Accent)
===================================================== */
const cursor = document.createElement("div");
cursor.className = "cursor-follower";
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

window.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  currentX += (mouseX - currentX) * 0.12;
  currentY += (mouseY - currentY) * 0.12;

  cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;
  requestAnimationFrame(animateCursor);
}

animateCursor();

/* =====================================================
   Cursor Interaction (Hover)
===================================================== */
const hoverTargets = document.querySelectorAll("a, .skill-card, .work");

hoverTargets.forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.classList.add("active");
  });
  el.addEventListener("mouseleave", () => {
    cursor.classList.remove("active");
  });
});
