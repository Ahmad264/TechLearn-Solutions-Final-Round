document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const exerciseId = urlParams.get('id');
    const titleElement = document.getElementById('exercise-title');
    const descriptionElement = document.getElementById('exercise-description');
    const starterCodeElement = document.getElementById('starter-code');
    const codeInput = document.getElementById('code-input');
    const previewFrame = document.getElementById('preview-frame');
    const saveButton = document.getElementById('save-progress');
    const BASE_URL = 'https://auth-system-123.onrender.com';

    if (!exerciseId) {
        titleElement.textContent = 'Error';
        descriptionElement.textContent = 'No exercise ID provided in URL.';
        return;
    }

    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
        titleElement.textContent = 'Error';
        descriptionElement.textContent = 'Please sign in to access this exercise.';
        return;
    }

    // Fetch exercise data
    try {
        const response = await fetch(`${BASE_URL}/exercises/${exerciseId}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }
        const exercise = await response.json();
        
        titleElement.textContent = exercise.title;
        descriptionElement.textContent = exercise.description;
        starterCodeElement.textContent = exercise.starterCode;
        codeInput.value = exercise.starterCode;
        
        // Load user progress
        try {
            const progressResponse = await fetch(`${BASE_URL}/progress/${exerciseId}`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (progressResponse.ok) {
                const progress = await progressResponse.json();
                codeInput.value = progress.code || exercise.starterCode;
            }
        } catch (progressError) {
            console.error('Error loading progress:', progressError);
            // Continue without progress if loading fails
        }
    } catch (error) {
        console.error('Error loading exercise:', error);
        titleElement.textContent = 'Error';
        descriptionElement.textContent = `Failed to load exercise: ${error.message}. Please try again or contact support.`;
        return;
    }

    // Live preview
    codeInput.addEventListener('input', () => {
        const code = codeInput.value;
        previewFrame.contentDocument.open();
        previewFrame.contentDocument.write(code);
        previewFrame.contentDocument.close();
    });

    // Save progress
    saveButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`${BASE_URL}/progress/${exerciseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ code: codeInput.value })
            });
            if (response.ok) {
                alert('Progress saved successfully!');
            } else {
                throw new Error('Failed to save progress.');
            }
        } catch (error) {
            console.error('Error saving progress:', error);
            alert('Failed to save progress. Please try again or continue without saving.');
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