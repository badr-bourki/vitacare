// app.js
document.addEventListener('DOMContentLoaded', () => {
  const cartButtons = document.querySelectorAll('button');
  cartButtons.forEach(button => {
    button.addEventListener('click', () => {
      alert('Product added to cart!');
    });
  });
});

