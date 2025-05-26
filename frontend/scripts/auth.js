document.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = document.querySelectorAll('.auth-toggle button');
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const BASE_URL = 'https://auth-system-123.onrender.com';

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            signinForm.classList.toggle('active', button.dataset.form === 'signin');
            signupForm.classList.toggle('active', button.dataset.form === 'signup');
        });
    });

    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
        
        try {
            const response = await fetch(`${BASE_URL}/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token); // Store JWT
                window.location.href = 'dashboard.html';
            } else {
                alert(data.message || 'Sign In failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Sign In error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        try {
            const response = await fetch(`${BASE_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token); // Store JWT
                window.location.href = 'dashboard.html';
            } else {
                alert(data.message || 'Sign Up failed. Please try again.');
            }
        } catch (error) {
            console.error('Sign Up error:', error);
            alert('An error occurred. Please try again.');
        }
    });

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