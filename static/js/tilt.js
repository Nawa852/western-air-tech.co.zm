// tilt.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize VanillaTilt on elements that have the data-tilt attribute.
    const tiltElements = document.querySelectorAll('[data-tilt]');
    VanillaTilt.init(tiltElements, {
      max: 25,
      speed: 400,
      glare: true,
      "max-glare": 0.5,
    });
  });
  