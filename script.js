document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const storyInput = document.getElementById('story-input');
    const wordCountDisplay = document.getElementById('word-count');
    const rulesList = document.getElementById('rules-list');
    const downloadButton = document.getElementById('download-button');
    const winMessage = document.getElementById('win-message');

    // --- Rule Definitions ---
    const rules = [
        {
            id: 1,
            description: 'Getting Started: Write at least 10 words to reveal the next rules. Tip: try describing your story\'s context or setting.',
            validator: (text) => getWordCount(text) >= 10,
            satisfied: false,
            active: true
        },
        {
            id: 2,
            description: 'Educational Focus: Include "learning", "education", "curriculum", "pedagogy", or "instruction".',
            validator: (text) => /\b(learning|education|curriculum|pedagogy|instruction)\b/i.test(text),
            satisfied: false,
            active: false
        },
          {
            id: 3,
            description: 'AI Presence: Include "AI tutor", "holographic teacher", "neuroteacher", "quantum mentor", or "robotic professor".',
            validator: (text) => /\b(AI tutor|holographic teacher|neuroteacher|quantum mentor|robotic professor)\b/i.test(text),
            satisfied: false,
            active: false
        },
         {
            id: 4,
            description: 'Future Tech: Mention "neural implant", "VR headset", "quantum projector", "holodeck", "mind-link", "nano-tutor", or "memory enhancement".',
            validator: (text) => /\b(neural implant|VR headset|quantum projector|holodeck|mind-link|nano-tutor|memory enhancement)\b/i.test(text),
            satisfied: false,
            active: false
        },
        {
            id: 5,
            description: 'Minimum Length: Your story must be at least 50 words long.',
            validator: (text) => getWordCount(text) >= 50,
            satisfied: false,
            active: false
        },
        {
            id: 6,
            description: 'Student Reaction: Include "excitement", "confusion", "curiosity", "wonder", "enlightenment", "frustration", or "inspiration".',
            validator: (text) => /\b(excitement|excited|confused|confusion|curious|curiosity|wonder|enlightenment|frustration|frustrated|inspiration|inspired)\b/i.test(text),
            satisfied: false,
            active: false
        },
        {
            id: 7,
            description: 'Reimagined Spaces: Describe "floating classroom", "virtual academy", "orbital school", "underwater campus", "neural network hub", "cloud university", or "biosphere lab".',
            validator: (text) => /\b(floating classroom|virtual academy|orbital school|underwater campus|neural network hub|cloud university|biosphere lab)\b/i.test(text),
            satisfied: false,
            active: false
        },
        {
            id: 8,
            description: 'Future Timeline: Include a specific year beyond 2030 (e.g., "2035", "2157").',
            validator: (text) => /\b(20[3-9]\d|2[1-9]\d\d|[3-9]\d{3})\b/.test(text),
            satisfied: false,
            active: false
        },
        {
            id: 9,
            description: 'Learning Hurdles: Mention "data overload", "AI bias", "privacy concerns", "attention scarcity", "digital divide", "information authentication", or "sensory integration".',
            validator: (text) => /\b(data overload|AI bias|privacy concerns|attention scarcity|digital divide|information authentication|sensory integration)\b/i.test(text),
            satisfied: false,
            active: false
        },
        {
            id: 10,
            description: 'Multisensory Experience: Include a vivid sensory detail like "hum of...", "glow of...", "scent of...", "texture of...", "taste of...", or "resonance of...".',
            validator: (text) => /\b(hum of|glow of|scent of|texture of|taste of|resonance of)\b/i.test(text),
            satisfied: false,
            active: false
        },
        {
            id: 11,
            description: 'Paradigm Shift: Reference "learning is gamified", "exams are obsolete", "knowledge is crowdsourced", "skills over memorisation", "continuous neural updating", or "telepathic collaboration".',
            validator: (text) => /\b(learning is gamified|exams are obsolete|knowledge is crowdsourced|skills over memorisation|continuous neural updating|telepathic collaboration)\b/i.test(text),
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
        },
        {
            id: 13,
            description: 'Numerical Balance: Your final word count must be a multiple of 10 (and at least 50).',
            validator: (text) => {
                const count = getWordCount(text);
                return count >= 50 && count % 10 === 0;
            },
            satisfied: false,
            active: false
        }
    ];

    // --- Helper Functions ---
    function getWordCount(text) {
        if (!text) return 0;
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    function updateWordCount(text) {
        const count = getWordCount(text);
        wordCountDisplay.textContent = `Word count: ${count}`;
    }

    function renderRules() {
        rules.forEach((rule) => {
            if (rule.active) {
                let ruleElement = rulesList.querySelector(`[data-rule-id="${rule.id}"]`);
                if (!ruleElement) {
                    ruleElement = document.createElement('li');
                    ruleElement.classList.add('rule');
                    ruleElement.dataset.ruleId = rule.id;
                    ruleElement.textContent = rule.description;
                    ruleElement.classList.add(rule.satisfied ? 'satisfied' : 'unsatisfied');
                    rulesList.appendChild(ruleElement);
                    ruleElement.style.animation = 'fadeInRule 0.5s ease forwards';
                } else {
                    const isSatisfied = rule.satisfied;
                    const hasSatisfiedClass = ruleElement.classList.contains('satisfied');
                    if (isSatisfied && !hasSatisfiedClass) {
                        ruleElement.classList.remove('unsatisfied');
                        ruleElement.classList.add('satisfied');
                    } else if (!isSatisfied && hasSatisfiedClass) {
                        ruleElement.classList.remove('satisfied');
                        ruleElement.classList.add('unsatisfied');
                    }
                }
            }
        });
    }

    function checkWinCondition() {
        const trulyAllSatisfied = rules.every(rule => rule.satisfied);
        if (trulyAllSatisfied) {
            storyInput.style.borderColor = '#28a745';
            winMessage.style.display = 'block';
            downloadButton.disabled = false;
        } else {
            const anyActiveUnsatisfied = rules.some(rule => rule.active && !rule.satisfied);
            storyInput.style.borderColor = anyActiveUnsatisfied ? '#dc3545' : '#ccc';
            winMessage.style.display = 'none';
            downloadButton.disabled = true;
        }
    }

    function validateAndUpdate() {
        // Use innerText to get the visible text from the contenteditable element
        const currentText = storyInput.innerText || "";
        console.log("Current Text:", currentText); // Debug message
        let needsRender = false;
        let lastSatisfiedRuleId = 0;

        rules.forEach((rule) => {
            if (rule.active) {
                const previousStatus = rule.satisfied;
                rule.satisfied = rule.validator(currentText);
                if (rule.satisfied !== previousStatus) {
                    needsRender = true;
                    console.log(`Rule ${rule.id} status changed to ${rule.satisfied}`); // Debug detail
                }
                if (rule.satisfied) {
                    lastSatisfiedRuleId = Math.max(lastSatisfiedRuleId, rule.id);
                }
            }
        });

        const nextRuleIndex = rules.findIndex(r => r.id === lastSatisfiedRuleId + 1);
        if (nextRuleIndex !== -1 && !rules[nextRuleIndex].active) {
             rules[nextRuleIndex].active = true;
             needsRender = true;
             console.log(`Activating rule ${rules[nextRuleIndex].id}`); // Debug detail
        }

        updateWordCount(currentText);
        if (needsRender) {
            renderRules();
        }
        checkWinCondition();
    }

    function downloadStory() {
        const storyText = storyInput.innerText || "";
        const cleanedText = storyText.replace(/\s+/g, ' ').trim();
        const blob = new Blob([cleanedText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'future_education_story.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // --- Event Listeners ---
    storyInput.addEventListener('input', validateAndUpdate);
    downloadButton.addEventListener('click', downloadStory);

    // --- Initial Setup ---
    renderRules();
    updateWordCount('');
    checkWinCondition();
});
