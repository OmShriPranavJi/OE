document.addEventListener('DOMContentLoaded', () => {
    // Initialize all prompt toggles
    const promptToggles = document.querySelectorAll('.prompt-toggle');
    
    promptToggles.forEach(toggle => {
        // Create the content container if it doesn't exist
        const contentId = toggle.getAttribute('aria-controls');
        let content = document.getElementById(contentId);
        
        if (!content) {
            content = document.createElement('div');
            content.id = contentId;
            content.className = 'prompt-content';
            content.style.display = 'none';
            toggle.parentNode.insertBefore(content, toggle.nextSibling);
        }

        // Set initial state
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        content.style.display = isExpanded ? 'block' : 'none';
        toggle.textContent = isExpanded ? 'Hide Prompt' : 'Show Prompt';

        // Add click handler
        toggle.addEventListener('click', () => {
            const isCurrentlyExpanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !isCurrentlyExpanded);
            content.style.display = isCurrentlyExpanded ? 'none' : 'block';
            toggle.textContent = isCurrentlyExpanded ? 'Show Prompt' : 'Hide Prompt';
        });
        });

    // Initialize copy to clipboard buttons
    const copyButtons = document.querySelectorAll('.copy-prompt-button');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const promptCodeBlock = button.closest('.prompt-code');
            if (promptCodeBlock) {
                const preElement = promptCodeBlock.querySelector('pre');
                if (preElement) {
                    navigator.clipboard.writeText(preElement.textContent)
                        .then(() => {
                            const originalContent = button.innerHTML;
                            button.textContent = 'Copied!';
                            button.disabled = true;
                            setTimeout(() => {
                                button.innerHTML = originalContent;
                                button.disabled = false;
                            }, 2000); // Revert after 2 seconds
                        })
                        .catch(err => {
                            console.error('Failed to copy text: ', err);
                            // Optional: Provide an error message to the user
                            alert('Failed to copy text. Please try manually.');
                        });
                }
            }
        });
    });

    // --- Text Resizer ---
    const bodyElement = document.body;
    const defaultBodyFontSize = 1; // 1em
    const fontSizeStepAmount = 0.1; // 0.1em
    const minBodyFontSize = 0.7; // 0.7em
    const maxBodyFontSize = 1.5; // 1.5em

    function getCurrentBodyFontSizeEm() {
        const currentStyle = window.getComputedStyle(bodyElement).fontSize;
        // Attempt to get current 'em' value relative to parent, or from direct style
        let currentEm = defaultBodyFontSize;
        if (bodyElement.style.fontSize && bodyElement.style.fontSize.endsWith('em')) {
            const directEm = parseFloat(bodyElement.style.fontSize);
            if (!isNaN(directEm)) {
                currentEm = directEm;
            } 
        } else if (bodyElement.parentElement) {
             const parentFontSize = parseFloat(window.getComputedStyle(bodyElement.parentElement).fontSize);
             if (parentFontSize > 0) {
                currentEm = parseFloat(currentStyle) / parentFontSize;
             }
        }
        return isNaN(currentEm) ? defaultBodyFontSize : currentEm;
    }

    function applyBodyFontSize(sizeInEm) {
        const newSize = Math.max(minBodyFontSize, Math.min(sizeInEm, maxBodyFontSize));
        bodyElement.style.fontSize = newSize + 'em';
        localStorage.setItem('preferredBodyFontSize', newSize + 'em');
    }

    function changeBodyFontSize(increase) {
        let currentSizeEm = getCurrentBodyFontSizeEm();
        if (increase) {
            applyBodyFontSize(currentSizeEm + fontSizeStepAmount);
        } else {
            applyBodyFontSize(currentSizeEm - fontSizeStepAmount);
        }
    }

    function resetBodyFontSize() {
        applyBodyFontSize(defaultBodyFontSize);
    }

    function loadPreferredBodyFontSize() {
        const preferredSize = localStorage.getItem('preferredBodyFontSize');
        if (preferredSize) {
            if (preferredSize.endsWith('em') && parseFloat(preferredSize) >= minBodyFontSize && parseFloat(preferredSize) <= maxBodyFontSize) {
                bodyElement.style.fontSize = preferredSize;
            } else {
                localStorage.removeItem('preferredBodyFontSize');
            }
        }
    }

    loadPreferredBodyFontSize();

    const decreaseFontButton = document.getElementById('font-decrease-button');
    const resetFontButton = document.getElementById('font-reset-button');
    const increaseFontButton = document.getElementById('font-increase-button');

    if (decreaseFontButton && resetFontButton && increaseFontButton) {
        decreaseFontButton.addEventListener('click', () => changeBodyFontSize(false));
        resetFontButton.addEventListener('click', resetBodyFontSize);
        increaseFontButton.addEventListener('click', () => changeBodyFontSize(true));
    }
    // --- End Text Resizer ---
});
