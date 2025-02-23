// universal_blog.js - A Fully Responsive & Cross-Browser Blog Script

// Combined and Optimized JavaScript with Cross-Browser & Mobile Support

document.addEventListener("DOMContentLoaded", () => {
    applyAdvancedTilt(".product", { max: 30, speed: 600, glare: true, "max-glare": 0.6, perspective: 1000, scale: 1.15, reset: true });
    applyAdvancedTilt("button", { max: 20, speed: 400, glare: true, "max-glare": 0.4, perspective: 800, scale: 1.1, reset: true });
    applyAdvancedTilt(".card", { max: 25, speed: 500, glare: true, "max-glare": 0.5, perspective: 1100, scale: 1.1, reset: true });
    applyAdvancedTilt(".logo", { max: 20, speed: 400, glare: true, "max-glare": 0.4, perspective: 1000, scale: 1.1, reset: true });
  
    autoRotateElement(".logo", 10, 0.5);
    applyParallaxEffect("#home", 20);
    add3DEffectOnHover(".interactive-item", 1.05, 10);
    ensureResponsiveDesign();
  });
  
  function ensureResponsiveDesign() {
    window.addEventListener("resize", () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
    });
  }
  
  function addRatingFeature(postId) {
    const post = document.getElementById(postId);
    if (!post) return;
  
    const ratingContainer = document.createElement("div");
    ratingContainer.classList.add("rating-container");
  
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.classList.add("star");
      star.innerHTML = "&#9733;";
      star.dataset.value = i;
      star.addEventListener("click", (e) => submitRating(postId, e.target.dataset.value));
      ratingContainer.appendChild(star);
    }
    post.appendChild(ratingContainer);
  }
  
  function submitRating(postId, rating) {
    fetch(`/rate_post?post_id=${postId}&rating=${rating}`, {
      method: "POST",
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert("Rating submitted!");
        }
      })
      .catch(err => console.error("Error submitting rating:", err));
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    initBlog();
    loadBlogPosts();
    fetchSocialMediaPosts();
    enableSmoothScrolling();
  });
  
  function loadBlogPosts() {
    fetch("/get_posts")
      .then(response => response.json())
      .then(posts => {
        const container = document.querySelector("#blog-posts");
        container.innerHTML = "";
        posts.forEach(post => {
          const postDiv = document.createElement("div");
          postDiv.classList.add("post");
          postDiv.id = `post-${post.id}`;
  
          let content = "";
          if (post.message) {
            content += `<p>${post.message}</p>`;
          }
          if (post.image) {
            content += `<img src="${post.image}" alt="Blog Image">`;
          }
          if (post.video) {
            content += `<video controls src="${post.video}"></video>`;
          }
          postDiv.innerHTML = content;
          container.appendChild(postDiv);
          addRatingFeature(`post-${post.id}`);
        });
      })
      .catch(err => console.error("Error loading blog posts:", err));
  }
  