// Typewriter effect for hero terminal prompt
export default function typewriterEffect() {
    const el = document.getElementById('cyber-typewriter');
    if (!el) return;

    const phrases = [
        'Analyzing threat vectors...',
        'Scanning IOC databases...',
        'Monitoring geopolitical signals...',
        'Correlating intelligence feeds...',
        'Mapping attack surfaces...',
        'Processing OSINT data...',
        'Decrypting threat reports...',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    function type() {
        const current = phrases[phraseIndex];
        
        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 30 : 60;

        if (!isDeleting && charIndex === current.length) {
            delay = 2000; // Pause at complete phrase
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 500; // Pause before next phrase
        }

        timeout = setTimeout(type, delay);
    }

    // Start after a brief delay
    setTimeout(type, 1000);

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.textContent = phrases[0];
        return;
    }
}
