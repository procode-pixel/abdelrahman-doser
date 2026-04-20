// Get the menu icon and the navigation bar elements
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

// Add click event listener to the menu icon
menuIcon.onclick = () => {
    // Toggle the 'bx-x' icon class for animation (optional)
    // For simplicity, we just toggle the active class for the navbar
    menuIcon.classList.toggle('bx-x'); 
    
    // Toggle the 'active' class on the navbar to show/hide it
    navbar.classList.toggle('active');
};
