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
});
