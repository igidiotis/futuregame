document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const storyInput = document.getElementById('story-input');
    const wordCountDisplay = document.getElementById('word-count');
    const rulesList = document.getElementById('rules-list');
    const downloadButton = document.getElementById('download-button');
    const boldButton = document.getElementById('bold-button');
    const winMessage = document.getElementById('win-message');

    // --- Rule Definitions ---
    // Each rule object has:
    // - id: Unique identifier
    // - description: Text shown to the user
    // - validator: Function returning true if rule is satisfied
    // - satisfied: Boolean status
    // - active: Boolean, becomes true when the previous rule is met
    const rules = [
        {
            id: 1,
            description: 'The Launch Pad: Your scenario must be at least 100 words.',
            validator: (text) => getWordCount(text) >= 100,
            satisfied: false,
            active: true // First rule is active initially
        },
        {
            id: 2,
            description: 'Educational Focus: Include at least one of these terms: "learning", "education", "curriculum", "pedagogy", or "instruction".',
            validator: (text) => /\b(learning|education|curriculum|pedagogy|instruction)\b/i.test(text),
            satisfied: false,
            active: false
        },
        {
            id: 3,
            description: 'AI Presence: Include one of these futuristic educational guides: "AI tutor", "holographic teacher", "neuroteacher", "quantum mentor", or "robotic professor".',
            validator: (text) => /\b(AI tutor|holographic teacher|neuroteacher|quantum mentor|robotic professor)\b/i.test(text),
            satisfied: false,
            active: false
        },
        {
            id: 4,
            description: 'Future Tech: Mention at least one innovative learning technology: "neural implant", "VR headset", "quantum projector", "holodeck", "mind-link", "nano-tutor", or "memory enhancement".',
            validator: (text) => /\b(neural implant|VR headset|quantum projector|holodeck|mind-link|nano-tutor|memory enhancement)\b/i.test(text),
            satisfied: false,
            active: false
        },
        {
            id: 5,
            description: 'Student Reaction: Include at least one emotional response: "excitement", "confusion", "curiosity", "wonder", "enlightenment", "frustration", or "inspiration".',
            validator: (text) => /\b(excitement|confusion|curiosity|wonder|enlightenment|frustration|inspiration)\b/i.test(text),
            satisfied: false,
            active: false
        },
        {
            id: 6,
            description: 'Reimagined Spaces: Describe one futuristic learning environment: "floating classroom", "virtual academy", "orbital school", "underwater campus", "neural network hub", "cloud university", or "biosphere lab".',
            validator: (text) => /\b(floating classroom|virtual academy|orbital school|underwater campus|neural network hub|cloud university|biosphere lab)\b/i.test(text),
            satisfied: false,
            active: false
        },
        {
            id: 7,
            description: 'Future Timeline: Include a specific year beyond 2030 (e.g., "2035", "2157").',
            // RegEx: Matches 4-digit numbers starting 2030-2099, 2100-2999, 3000-9999
            validator: (text) => /\b(20[3-9]\d|2[1-9]\d\d|[3-9]\d{3})\b/.test(text),
            satisfied: false,
            active: false
        },
        {
            id: 8,
            description: 'Learning Hurdles: Mention one challenge: "data overload", "AI bias", "privacy concerns", "attention scarcity", "digital divide", "information authentication", or "sensory integration".',
            validator: (text) => /\b(data overload|AI bias|privacy concerns|attention scarcity|digital divide|information authentication|sensory integration)\b/i.test(text),
            satisfied: false,
            active: false
        },
        {
            id: 9,
            description: 'Multisensory Experience: Include a vivid sensory detail: "hum of quantum processors", "glow of holographic displays", "scent of digital forests", "texture of haptic interfaces", "taste of knowledge supplements", or "resonance of thought-sharing".',
            // Simplified check for keywords within potential phrases
            validator: (text) => /\b(hum of|glow of|scent of|texture of|taste of|resonance of)\b.*\b(processors|displays|forests|interfaces|supplements|thought-sharing)\b/i.test(text),
            satisfied: false,
            active: false
        },
        {
            id: 10,
            description: 'Paradigm Shift: Reference a fundamental change: "learning is gamified", "exams are obsolete", "knowledge is crowdsourced", "skills over memorization", "continuous neural updating", or "telepathic collaboration".',
            validator: (text) => /\b(learning is gamified|exams are obsolete|knowledge is crowdsourced|skills over memorization|continuous neural updating|telepathic collaboration)\b/i.test(text),
            satisfied: false,
            active: false
        },
        {
            id: 11,
            description: 'Numerical Balance: Your final word count must be a multiple of 10 (and at least 100).',
            validator: (text) => {
                const count = getWordCount(text);
                return count >= 100 && count % 10 === 0;
            },
            satisfied: false,
            active: false
        },
        {
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
        }
    ];

    // --- Helper Functions ---

    /**
     * Calculates the word count of a given text string.
     * @param {string} text - The text to count words in.
     * @returns {number} The number of words.
     */
    function getWordCount(text) {
        // Trim whitespace, split by spaces/newlines, filter empty strings
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    /**
     * Renders the current state of the rules list in the UI.
     */
    function renderRules() {
        rulesList.innerHTML = ''; // Clear existing rules
        let firstUnsatisfiedFound = false; // To apply animation only to the next rule to appear

        rules.forEach((rule, index) => {
            if (rule.active) {
                const li = document.createElement('li');
                li.classList.add('rule');
                li.classList.add(rule.satisfied ? 'satisfied' : 'unsatisfied');
                li.textContent = rule.description;

                // Add fade-in animation only to the rule that just became active
                if (!rule.satisfied && !firstUnsatisfiedFound) {
                     // Check if this is the rule *after* the last satisfied one
                     const previousRuleSatisfied = index === 0 || rules[index - 1].satisfied;
                     if (previousRuleSatisfied && !li.classList.contains('rendered')) {
                         li.style.animationDelay = `${0.1 * index}s`; // Stagger animation slightly
                         li.classList.add('rendered'); // Mark as rendered to prevent re-animating
                     }
                     firstUnsatisfiedFound = true; // Only animate the first unsatisfied rule shown
                } else if (rule.satisfied && !li.classList.contains('rendered')) {
                    // Ensure already satisfied rules that were previously hidden also animate in
                     li.style.animationDelay = `${0.1 * index}s`;
                     li.classList.add('rendered');
                }


                rulesList.appendChild(li);
            }
        });
    }

    /**
     * Validates all active rules against the current story text,
     * updates their status, activates the next rule if needed,
     * and checks for the win condition.
     */
    function validateAndUpdate() {
        const currentText = storyInput.textContent || ""; // Use textContent for validation
        const currentHtml = storyInput.innerHTML; // Potentially needed for future formatting rules
        let allSatisfied = true;
        let activateNextRule = false;

        rules.forEach((rule, index) => {
            if (rule.active) {
                const wasSatisfied = rule.satisfied;
                // Pass textContent for most rules, potentially innerHTML if needed later
                rule.satisfied = rule.validator(currentText);

                // If a rule just became satisfied, flag to activate the next one
                if (!wasSatisfied && rule.satisfied && index < rules.length - 1) {
                    activateNextRule = true;
                }

                // If any active rule is not satisfied, the game is not won
                if (!rule.satisfied) {
                    allSatisfied = false;
                }
            } else {
                // If a rule is not active, it means prerequisites aren't met
                allSatisfied = false;
            }
        });

        // Activate the next rule if the flag is set
        if (activateNextRule) {
            const nextRuleIndex = rules.findIndex(r => !r.active);
            if (nextRuleIndex !== -1) {
                rules[nextRuleIndex].active = true;
            }
        }

        // Update UI
        updateWordCount(currentText);
        renderRules();
        checkWinCondition(allSatisfied);
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
     * @param {boolean} allSatisfied - Whether all rules are currently met.
     */
    function checkWinCondition(allSatisfied) {
         // Check if *all* rules (not just active) are satisfied
        const trulyAllSatisfied = rules.every(rule => rule.satisfied);

        if (trulyAllSatisfied) {
            storyInput.style.borderColor = '#00ff00'; // Green border
            winMessage.style.display = 'block'; // Show win message
            downloadButton.disabled = false; // Enable download
        } else {
            // Determine border color: red if any active rule is unsatisfied, else default blue
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
        const storyText = storyInput.textContent; // Get plain text
        const blob = new Blob([storyText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'future_education_story.txt'; // Filename
        document.body.appendChild(link); // Required for Firefox
        link.click();

        document.body.removeChild(link); // Clean up
        URL.revokeObjectURL(url); // Free up memory
    }

    /**
     * Applies bold formatting to the selected text.
     * Note: document.execCommand is deprecated but works for this simple case.
     */
    function applyBold() {
        document.execCommand('bold', false, null);
        storyInput.focus(); // Keep focus in the editor
        // Re-validate in case bolding affects any (future) rules
        validateAndUpdate();
    }

    // --- Event Listeners ---
    storyInput.addEventListener('input', validateAndUpdate);
    downloadButton.addEventListener('click', downloadStory);
    boldButton.addEventListener('click', applyBold);

     // Add Ctrl+B shortcut for bolding
    storyInput.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'b') {
            event.preventDefault(); // Prevent default browser bold
            applyBold();
        }
    });


    // --- Initial Setup ---
    renderRules(); // Initial render of the first rule
    updateWordCount(''); // Initial word count
    checkWinCondition(false); // Set initial border/button state

});
