document.addEventListener('DOMContentLoaded', async () => {
    const exerciseGrid = document.querySelector('.exercise-grid');
    const BASE_URL = 'https://auth-system-123.onrender.com';

    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
        exerciseGrid.innerHTML = '<p>Please sign in to view exercises.</p>';
        return;
    }

    // Fetch exercises from backend API
    try {
        const response = await fetch(`${BASE_URL}/exercises`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }
        const exercises = await response.json();
        
        if (exercises.length === 0) {
            exerciseGrid.innerHTML = '<p>No exercises available.</p>';
            return;
        }

        exercises.forEach((exercise, index) => {
            const card = document.createElement('div');
            card.className = 'exercise-card';
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <h3>${exercise.title}</h3>
                <p>${exercise.description}</p>
                <a href="compiler.html?id=${exercise.id}" class="cta-button">Start</a>
            `;
            exerciseGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading exercises:', error);
        exerciseGrid.innerHTML = `<p>Error loading exercises: ${error.message}. Please try again or contact support.</p>`;
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav ul');
    
    mobileMenuBtn.addEventListener('click', () => {
        nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                if (window.innerWidth <= 768) {
                    nav.style.display = 'none';
                }
            }
        });
    });
});