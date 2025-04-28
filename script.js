document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const storyInput = document.getElementById('story-input');
    const wordCountDisplay = document.getElementById('word-count');
    const rulesList = document.getElementById('rules-list');
    const downloadButton = document.getElementById('download-button');
    // Bold button removed
    // const boldButton = document.getElementById('bold-button');
    const winMessage = document.getElementById('win-message');

    // --- Rule Definitions ---
    // Each rule object has:
    // - id: Unique identifier (sequential for activation logic)
    // - description: Text shown to the user
    // - validator: Function returning true if rule is satisfied
    // - satisfied: Boolean status
    // - active: Boolean, becomes true when the previous rule is met
    const rules = [
        {
            id: 1,
            description: 'Getting Started: Write at least 10 words to reveal the next rules.',
            validator: (text) => getWordCount(text) >= 10, // Changed from 100 to 10
            satisfied: false,
            active: true // First rule is active initially
        },
        { // New Rule: Minimum length of 50 words
            id: 2,
            description: 'Minimum Length: Your story must be at least 50 words long.',
            validator: (text) => getWordCount(text) >= 50,
            satisfied: false,
            active: false
        },
        { // Original Rule 2 is now Rule 3
            id: 3,
            description: 'Educational Focus: Include "learning", "education", "curriculum", "pedagogy", or "instruction".',
            validator: (text) => /\b(learning|education|curriculum|pedagogy|instruction)\b/i.test(text),
            satisfied: false,
            active: false
        },
        { // Original Rule 3 is now Rule 4
            id: 4,
            description: 'AI Presence: Include "AI tutor", "holographic teacher", "neuroteacher", "quantum mentor", or "robotic professor".',
            validator: (text) => /\b(AI tutor|holographic teacher|neuroteacher|quantum mentor|robotic professor)\b/i.test(text),
            satisfied: false,
            active: false
        },
        { // Original Rule 4 is now Rule 5
            id: 5,
            description: 'Future Tech: Mention "neural implant", "VR headset", "quantum projector", "holodeck", "mind-link", "nano-tutor", or "memory enhancement".',
            validator: (text) => /\b(neural implant|VR headset|quantum projector|holodeck|mind-link|nano-tutor|memory enhancement)\b/i.test(text),
            satisfied: false,
            active: false
        },
        { // Original Rule 5 is now Rule 6
            id: 6,
            description: 'Student Reaction: Include "excitement", "confusion", "curiosity", "wonder", "enlightenment", "frustration", or "inspiration".',
            validator: (text) => /\b(excitement|confusion|curiosity|wonder|enlightenment|frustration|inspiration)\b/i.test(text),
            satisfied: false,
            active: false
        },
        { // Original Rule 6 is now Rule 7
            id: 7,
            description: 'Reimagined Spaces: Describe "floating classroom", "virtual academy", "orbital school", "underwater campus", "neural network hub", "cloud university", or "biosphere lab".',
            validator: (text) => /\b(floating classroom|virtual academy|orbital school|underwater campus|neural network hub|cloud university|biosphere lab)\b/i.test(text),
            satisfied: false,
            active: false
        },
        { // Original Rule 7 is now Rule 8
            id: 8,
            description: 'Future Timeline: Include a specific year beyond 2030 (e.g., "2035", "2157").',
            validator: (text) => /\b(20[3-9]\d|2[1-9]\d\d|[3-9]\d{3})\b/.test(text),
            satisfied: false,
            active: false
        },
        { // Original Rule 8 is now Rule 9
            id: 9,
            description: 'Learning Hurdles: Mention "data overload", "AI bias", "privacy concerns", "attention scarcity", "digital divide", "information authentication", or "sensory integration".',
            validator: (text) => /\b(data overload|AI bias|privacy concerns|attention scarcity|digital divide|information authentication|sensory integration)\b/i.test(text),
            satisfied: false,
            active: false
        },
        { // Original Rule 9 is now Rule 10
            id: 10,
            description: 'Multisensory Experience: Include a vivid sensory detail like "hum of...", "glow of...", "scent of...", "texture of...", "taste of...", or "resonance of...".',
            // Simplified check for keywords within potential phrases
            validator: (text) => /\b(hum of|glow of|scent of|texture of|taste of|resonance of)\b/i.test(text), // Simplified check
            satisfied: false,
            active: false
        },
        { // Original Rule 10 is now Rule 11
            id: 11,
            description: 'Paradigm Shift: Reference "learning is gamified", "exams are obsolete", "knowledge is crowdsourced", "skills over memorization", "continuous neural updating", or "telepathic collaboration".',
            validator: (text) => /\b(learning is gamified|exams are obsolete|knowledge is crowdsourced|skills over memorization|continuous neural updating|telepathic collaboration)\b/i.test(text),
            satisfied: false,
            active: false
        },
         { // Original Rule 12 is now Rule 12
            id: 12,
            description: 'Narrative Structure Markers: Include "in this future", "however", and "ultimately".',
            validator: (text) => {
                const lowerText = text.toLowerCase();
                return lowerText.includes("in this future") &&
                       lowerText.includes("however") &&
                       lowerText.includes("ultimately");
            },
            satisfied: false,
            active: false
        },
        { // Original Rule 11 is now Rule 13
            id: 13,
            description: 'Numerical Balance: Your final word count must be a multiple of 10 (and at least 50).',
            validator: (text) => {
                const count = getWordCount(text);
                // Changed minimum from 100 to 50
                return count >= 50 && count % 10 === 0;
            },
            satisfied: false,
            active: false
        }
    ];

    // --- Helper Functions ---

    /**
     * Calculates the word count of a given text string.
     * @param {string} text - The text to count words in.
     * @returns {number} The number of words.
     */
    function getWordCount(text) {
        if (!text) return 0;
        // Trim whitespace, split by one or more whitespace characters, filter empty strings
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    /**
     * Renders the current state of the rules list in the UI.
     * Attempts to minimize flickering by only adding new elements.
     */
    function renderRules() {
        // Instead of clearing all, selectively add/update.
        // This requires keeping track of rendered rules.
        // For simplicity and given the small number of rules,
        // we'll stick to the rebuild approach but ensure the animation
        // CSS targets appropriately. The CSS handles the fade-in.
        rulesList.innerHTML = ''; // Clear existing rules for simplicity
        let ruleAdded = false; // Flag to check if any rule was added in this render cycle

        rules.forEach((rule) => {
            if (rule.active) {
                const li = document.createElement('li');
                li.className = `rule ${rule.satisfied ? 'satisfied' : 'unsatisfied'}`;
                li.textContent = rule.description;
                // Add a data attribute to potentially identify rules later if needed
                li.dataset.ruleId = rule.id;
                rulesList.appendChild(li);
                ruleAdded = true;
            }
        });

        // If no rules were added (e.g., initial state before 10 words),
        // ensure the list isn't visually empty if it wasn't meant to be.
        // This check might not be strictly necessary with the current logic.
        // if (!ruleAdded && rules[0].active) {
        //     const li = document.createElement('li');
        //     li.className = `rule unsatisfied`;
        //     li.textContent = rules[0].description;
        //     li.dataset.ruleId = rules[0].id;
        //     rulesList.appendChild(li);
        // }
    }


    /**
     * Validates all active rules against the current story text,
     * updates their status, activates the next rule if needed,
     * and checks for the win condition.
     */
    function validateAndUpdate() {
        const currentText = storyInput.textContent || "";
        let needsRender = false; // Flag to check if UI update is needed
        let lastSatisfiedRuleId = 0; // Track the highest ID of a satisfied rule

        rules.forEach((rule) => {
            if (rule.active) {
                const previousStatus = rule.satisfied;
                // Validate rule
                rule.satisfied = rule.validator(currentText);

                // If status changed, we need to re-render
                if (rule.satisfied !== previousStatus) {
                    needsRender = true;
                }

                if(rule.satisfied) {
                    lastSatisfiedRuleId = Math.max(lastSatisfiedRuleId, rule.id);
                }
            }
        });

        // Activate the next rule if the last active rule is now satisfied
        const nextRuleIndex = rules.findIndex(r => r.id === lastSatisfiedRuleId + 1);
        if (nextRuleIndex !== -1 && !rules[nextRuleIndex].active) {
             rules[nextRuleIndex].active = true;
             needsRender = true; // Need to render the newly activated rule
        }


        // Update UI only if something changed or a new rule was activated
        updateWordCount(currentText); // Update word count regardless
        if (needsRender) {
            renderRules();
        }
        checkWinCondition(); // Check win condition after potential updates
    }

    /**
     * Updates the word count display.
     * @param {string} text - The text to count words from.
     */
    function updateWordCount(text) {
        const count = getWordCount(text);
        wordCountDisplay.textContent = `Word count: ${count}`;
    }

    /**
     * Checks if all rules are satisfied and updates the UI accordingly
     * (border color, win message, download button).
     */
    function checkWinCondition() {
         // Check if *all* rules are satisfied
        const trulyAllSatisfied = rules.every(rule => rule.satisfied);

        if (trulyAllSatisfied) {
            storyInput.style.borderColor = '#00ff00'; // Green border
            winMessage.style.display = 'block'; // Show win message
            downloadButton.disabled = false; // Enable download
        } else {
            // Determine border color: red if any *active* rule is unsatisfied, else default blue
            const anyActiveUnsatisfied = rules.some(rule => rule.active && !rule.satisfied);
            storyInput.style.borderColor = anyActiveUnsatisfied ? '#ff3333' : '#00ccff'; // Red or default blue
            winMessage.style.display = 'none'; // Hide win message
            downloadButton.disabled = true; // Disable download
        }
    }

    /**
     * Handles the download story button click.
     */
    function downloadStory() {
        const storyText = storyInput.textContent || ""; // Get plain text
        // Basic cleanup: Replace multiple spaces/newlines with single ones for readability
        const cleanedText = storyText.replace(/\s+/g, ' ').trim();

        const blob = new Blob([cleanedText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'future_education_story.txt'; // Filename
        document.body.appendChild(link); // Required for Firefox
        link.click();

        document.body.removeChild(link); // Clean up
        URL.revokeObjectURL(url); // Free up memory
    }

    // ApplyBold function and related listeners removed

    // --- Event Listeners ---
    storyInput.addEventListener('input', validateAndUpdate);
    downloadButton.addEventListener('click', downloadStory);
    // Bold button listener removed
    // boldButton.addEventListener('click', applyBold);

    // Ctrl+B listener removed
    // storyInput.addEventListener('keydown', (event) => {
    //     if (event.ctrlKey && event.key === 'b') {
    //         event.preventDefault();
    //         applyBold();
    //     }
    // });


    // --- Initial Setup ---
    renderRules(); // Initial render of the first rule(s)
    updateWordCount(''); // Initial word count
    checkWinCondition(); // Set initial border/button state

});
