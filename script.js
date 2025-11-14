// script.js
document.addEventListener("DOMContentLoaded", () => {
  const accordions = document.querySelectorAll(".accordion-header");

  accordions.forEach(header => {
    header.addEventListener("click", () => {
      const body = header.nextElementSibling;
      header.classList.toggle("active");
      body.classList.toggle("open");
    });
  });
});
