// main.js
document.addEventListener('DOMContentLoaded', function() {
  // Get the container for social media updates.
  const socialFeed = document.getElementById('social-posts');

  // If there are no social media posts loaded, create dummy posts.
  if (socialFeed.children.length === 0) {
    for (let i = 1; i <= 3; i++) {
      const post = document.createElement('div');
      post.classList.add('social-post');
      // Add dummy content for demonstration.
      post.innerHTML = `
        <p>Social media update ${i}: Stay tuned for more exciting updates!</p>
        <img src="/static/images/social/dummy${i}.jpg" alt="Social update ${i}">
      `;
      socialFeed.appendChild(post);
    }
  }

  // Use Intersection Observer to add a 3D fade-in animation when posts enter the viewport.
  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fadeIn3D');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply observer to all social media posts.
  const socialPosts = document.querySelectorAll('.social-post');
  socialPosts.forEach(post => {
    observer.observe(post);
  });
});
