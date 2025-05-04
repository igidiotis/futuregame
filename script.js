// ------------------------------
//  FUTURE‑GAME MAIN SCRIPT
//  (updated for Netlify‑Forms flow, e‑mail block, download, restart)
// ------------------------------

// Helper function to count words
function getWordCount(text) {
    return text.split(/\s+/).filter(word => word.length > 0).length;
}

// Helper function to check if words from two different sets appear close to each other
const areConceptsNear = (text, conceptSet1, conceptSet2, maxDistance = 50) => {
    text = text.toLowerCase();

    // Find all matches for both concept sets
    const matches1 = [];
    const matches2 = [];

    conceptSet1.forEach(word => {
        let index = text.indexOf(word);
        while (index !== -1) {
            matches1.push({ word, index });
            index = text.indexOf(word, index + 1);
        }
    });

    conceptSet2.forEach(word => {
        let index = text.indexOf(word);
        while (index !== -1) {
            matches2.push({ word, index });
            index = text.indexOf(word, index + 1);
        }
    });

    // Check if any pair of matches is within maxDistance
    for (const match1 of matches1) {
        for (const match2 of matches2) {
            if (Math.abs(match1.index - match2.index) <= maxDistance) {
                return true;
            }
        }
    }

    return false;
};

// ------------------------------
//  GAME STATE
// ------------------------------
let gameState = {
    currentText: '',
    rulesCompleted: 0,
    gameComplete: false
};

// ------------------------------
//  GAME RULES
// ------------------------------
const rules = [
    {
        id: 1,
        description: 'Getting Started: Write at least 10 words to reveal the next rules. Tip: try describing your story\'s context or setting.',
        helpText: 'Just start writing a few words about your future education scenario to begin.',
        validator: (text) => getWordCount(text) >= 10,
        satisfied: false,
        active: true,
        activeSince: Date.now(),
        helpShown: false,
        struggling: false
    },
    {
        id: 2,
        description: 'Educational Focus: Mention learning, education, teaching, or studying in your future world.',
        helpText: 'Include any term related to education like: learn, teach, study, school, class, course, knowledge, or skills.',
        validator: (text) => {
            const educationConcepts = ['learn', 'educat', 'teach', 'study', 'school', 'class', 'course', 'curriculum', 'knowledge', 'skill', 'instruct'];
            return educationConcepts.some(concept => text.toLowerCase().includes(concept));
        },
        satisfied: false,
        active: false
    },
    {
        id: 3,
        description: 'Future Educator: Mention a futuristic teacher, AI tutor, or digital learning guide.',
        helpText: 'Combine teaching roles (teacher, tutor, instructor, professor, mentor) with futuristic elements (AI, robot, virtual, digital, holographic).',
        validator: (text) => {
            // Simplified approach - look for common combinations
            const commonCombinations = [
                'ai teacher', 'robot teacher', 'virtual teacher', 'holographic teacher', 'digital teacher',
                'ai tutor', 'robot tutor', 'virtual tutor', 'holographic tutor', 'digital tutor', 
                'ai instructor', 'robot instructor', 'virtual instructor', 'digital instructor',
                'ai professor', 'virtual professor', 'digital professor',
                'ai mentor', 'virtual mentor', 'digital mentor',
                'teaching ai', 'teaching robot', 'teaching algorithm',
                'educational ai', 'learning ai', 'neural teach'
            ];
            const text_lower = text.toLowerCase();
            return commonCombinations.some(combo => text_lower.includes(combo));
        },
        satisfied: false,
        active: false
    },
    {
        id: 4,
        description: 'Learning Technology: Describe any futuristic technology that helps students learn.',
        helpText: 'Mention technologies like: VR/AR headsets, neural interfaces, brain implants, holographic displays, AI systems, or any digital learning tools.',
        validator: (text) => {
            const learningTech = [
                'vr', 'virtual reality', 'ar', 'augmented reality', 'neural interface', 'brain implant',
                'holographic display', 'mind link', 'ai system', 'digital learning', 'simulation',
                'neural network', 'quantum computer', 'nano', 'brain-computer', 'immersive', 
                'smart classroom', 'educational robot', 'learning algorithm', 'educational software'
            ];
            const text_lower = text.toLowerCase();
            return learningTech.some(tech => text_lower.includes(tech));
        },
        satisfied: false,
        active: false
    },
    {
        id: 5,
        description: 'Growing Story: Your story must be at least 50 words long to continue.',
        helpText: 'Keep expanding your story. Add more details about the setting, characters, or technologies.',
        validator: (text) => getWordCount(text) >= 50,
        satisfied: false,
        active: false
    },
    {
        id: 6,
        description: 'Student Experience: Describe how students feel about learning in this future world.',
        helpText: 'Use emotional terms (excited, curious, overwhelmed, inspired) when describing students or learners.',
        validator: (text) => {
            const emotionTerms = [
                'excite', 'thrill', 'enjoy', 'love', 'happy', 'engage', 'interest',
                'confus', 'overwhelm', 'frustrat', 'stress', 'anxious', 'nervous',
                'curious', 'wonder', 'fascinate', 'captivate', 'inspir', 'motivate',
                'bore', 'tired', 'exhaust', 'satisf', 'proud', 'accomplish',
                'student feel', 'learner feel', 'feel about', 'emotional', 'experience'
            ];
            const text_lower = text.toLowerCase();
            return emotionTerms.some(term => text_lower.includes(term));
        },
        satisfied: false,
        active: false
    },
    {
        id: 7,
        description: 'Learning Environment: Describe where education happens in your future world.',
        helpText: 'Mention a specific location for learning: virtual spaces, floating classrooms, underwater academies, space stations, or reimagined physical spaces.',
        validator: (text) => {
            const environmentTerms = [
                'classroom', 'school', 'academy', 'university', 'campus', 'learning center', 
                'virtual space', 'digital realm', 'simulation room', 'holodeck', 
                'floating', 'underwater', 'space station', 'orbital', 'zero gravity',
                'learning pod', 'education dome', 'smart building', 'interactive environment',
                'learning space', 'education zone', 'study area', 'immersive'
            ];
            const text_lower = text.toLowerCase();
            return environmentTerms.some(term => text_lower.includes(term));
        },
        satisfied: false,
        active: false
    },
    {
        id: 8,
        description: 'Future Timeline: When does your story take place? Include a specific year beyond 2030.',
        helpText: 'Add a future year to your story (like 2045, 2087, 3000, etc.) to establish when these events take place.',
        validator: (text) => /\b(20[3-9]\d|2[1-9]\d\d|[3-9]\d{3})\b/.test(text),
        satisfied: false,
        active: false
    },
    {
        id: 9,
        description: 'Education Challenge: Mention a problem or challenge in your future education system.',
        helpText: 'Describe issues like: technology dependence, privacy concerns, digital divide, information overload, or social isolation.',
        validator: (text) => {
            const challengeTerms = [
                'problem', 'challenge', 'issue', 'difficult', 'obstacle', 'hurdle', 'concern',
                'risk', 'threat', 'danger', 'limit', 'drawback', 'overload', 'scarcity',
                'divide', 'gap', 'inequality', 'bias', 'privacy', 'security', 'distract',
                'addiction', 'dependence', 'isolation', 'disconnect', 'burnout', 'stress',
                'cost', 'access', 'failure', 'malfunction', 'glitch', 'barrier'
            ];
            const text_lower = text.toLowerCase();
            return challengeTerms.some(term => text_lower.includes(term));
        },
        satisfied: false,
        active: false
    },
    {
        id: 10,
        description: 'Sensory Detail: Include what students see, hear, smell, taste, or feel in this environment.',
        helpText: 'Describe sensations like: glowing screens, humming machines, the smell of clean air, the taste of focus‑enhancing drinks, or the feeling of neural connections.',
        validator: (text) => {
            const sensoryTerms = [
                'see', 'saw', 'view', 'watch', 'look', 'appear', 'visual', 'display', 'screen', 'image',
                'hear', 'sound', 'noise', 'listen', 'audio', 'music', 'voice', 'whisper', 'hum', 'beep',
                'smell', 'scent', 'aroma', 'odor', 'fragrance', 'nose',
                'taste', 'flavor', 'palate', 'tongue', 'sweet', 'bitter', 'sour',
                'feel', 'touch', 'texture', 'smooth', 'rough', 'soft', 'hard', 'warm', 'cool', 'vibration',
                'glow', 'shine', 'bright', 'dark', 'light', 'color', 'flash', 'pulse'
            ];
            const text_lower = text.toLowerCase();
            return sensoryTerms.some(term => text_lower.includes(term));
        },
        satisfied: false,
        active: false
    },
    {
        id: 11,
        description: 'Educational Shift: Describe how education has changed compared to traditional methods.',
        helpText: 'Mention how things have changed: replacing memorization with neural uploads, transforming exams into experiential assessments, or evolving from passive to immersive learning.',
        validator: (text) => {
            const changeTerms = [
                'chang', 'transform', 'shift', 'revolution', 'replac', 'new', 'differ', 'obsolete',
                'abandon', 'evolv', 'reform', 'reimagin', 'redefin', 'innovat', 'disrupt',
                'unlike', 'instead of', 'rather than', 'previously', 'traditionally', 'used to',
                'no longer', 'compared to', 'whereas', 'evolved from', 'contrast', 
                'old system', 'old method', 'old way', 'traditional education',
                'before this', 'past approach'
            ];
            const text_lower = text.toLowerCase();
            return changeTerms.some(term => text_lower.includes(term));
        },
        satisfied: false,
        active: false
    },
    {
        id: 13,
        description: 'Story Length: Your story must be at least 100 words long to be complete.',
        helpText: 'Your story currently has less than 100 words. Add more details about the learning experience, technologies, or emotions of the students to reach 100 words.',
        validator: (text) => getWordCount(text) >= 100,
        satisfied: false,
        active: false
    }
];

// ------------------------------
//  UI RENDERING HELPERS
// ------------------------------
function renderRule(rule) {
    const ruleElement = document.createElement('div');
    ruleElement.className = `rule-container ${rule.satisfied ? 'satisfied' : ''} ${!rule.active ? 'inactive' : ''} ${rule.struggling ? 'struggling' : ''}`;
    ruleElement.id = `rule-${rule.id}`;

    // Create rule header (contains the rule text and help icon)
    const ruleHeader = document.createElement('div');
    ruleHeader.className = 'rule-header';

    // Rule text
    const ruleText = document.createElement('div');
    ruleText.className = 'rule-text';
    ruleText.innerText = rule.description;

    // Add elements to header
    ruleHeader.appendChild(ruleText);

    // Only add help icon for active, unsatisfied rules
    if (rule.active && !rule.satisfied) {
        const helpIcon = document.createElement('div');
        helpIcon.className = 'help-icon';
        helpIcon.innerText = '?';
        ruleHeader.appendChild(helpIcon);
        ruleHeader.addEventListener('click', () => toggleHelp(rule.id));
    }

    // Expandable help content
    const helpContent = document.createElement('div');
    helpContent.className = 'help-content';
    helpContent.id = `help-${rule.id}`;
    helpContent.innerText = rule.helpText || 'Try to fulfill this rule to continue your story.';

    ruleElement.appendChild(ruleHeader);
    ruleElement.appendChild(helpContent);

    return ruleElement;
}

function toggleHelp(ruleId) {
    const ruleElement = document.getElementById(`rule-${ruleId}`);
    if (ruleElement) {
        ruleElement.classList.toggle('help-expanded');
        const rule = rules.find(r => r.id === ruleId);
        if (rule && ruleElement.classList.contains('help-expanded')) rule.helpShown = true;
    }
}

function showHelp(ruleId) {
    const ruleElement = document.getElementById(`rule-${ruleId}`);
    if (ruleElement && !ruleElement.classList.contains('help-expanded')) {
        ruleElement.classList.add('help-expanded');
        const rule = rules.find(r => r.id === ruleId);
        if (rule) rule.helpShown = true;
        setTimeout(() => ruleElement.classList.remove('help-expanded'), 8000);
    }
}

function monitorUserStruggle() {
    const STRUGGLE_TIME = 20000; // 20 seconds
    rules.forEach(rule => {
        if (rule.active && !rule.satisfied && !rule.helpShown) {
            const timeActive = Date.now() - rule.activeSince;
            if (timeActive > STRUGGLE_TIME) {
                rule.struggling = true;
                showHelp(rule.id);
                updateRulesList();
            }
        }
    });
}

function updateRulesList() {
    const rulesList = document.getElementById('rules-list');
    if (!rulesList) return;
    rulesList.innerHTML = '';

    // Unsatisfied active rules first
    rules.filter(r => r.active && !r.satisfied).forEach(rule => rulesList.appendChild(renderRule(rule)));
    // Then satisfied ones
    rules.filter(r => r.satisfied).forEach(rule => rulesList.appendChild(renderRule(rule)));
}

// ------------------------------
//  RULE VALIDATION & PROGRESSION
// ------------------------------
function validateRules(text) {
    let activeRulesCount = 0;
    let satisfiedActiveRulesCount = 0;

    rules.forEach(rule => {
        if (rule.active) {
            activeRulesCount++;
            const isSatisfied = rule.validator(text);

            if (isSatisfied && !rule.satisfied) {
                rule.satisfied = true;
                activateNextRules(rule.id);
            } else if (!isSatisfied && rule.satisfied) {
                rule.satisfied = false;
            }
            if (rule.satisfied) satisfiedActiveRulesCount++;
        }
    });

    const allSatisfied = activeRulesCount > 0 && activeRulesCount === satisfiedActiveRulesCount && rules[rules.length - 1].satisfied;

    if (allSatisfied) {
        gameState.gameComplete = true;
        const completionMessageEl = document.getElementById('completion-message');
        if (completionMessageEl) {
            completionMessageEl.classList.add('visible');
            completionMessageEl.style.display = 'block';
        }
        const emailContainerEl = document.getElementById('email-container');
        if (emailContainerEl) emailContainerEl.style.display = 'block';
    }

    updateRulesList();
}

function activateNextRules(currentRuleId) {
    const ruleProgression = {
        1: [2],
        2: [3],
        3: [4],
        4: [5],
        5: [6, 7],
        7: [8, 9],
        9: [10, 11],
        11: [13]
    };
    if (ruleProgression[currentRuleId]) {
        ruleProgression[currentRuleId].forEach(nextRuleId => {
            const nextRule = rules.find(r => r.id === nextRuleId);
            if (nextRule && !nextRule.active) {
                nextRule.active = true;
                nextRule.activeSince = Date.now();
                nextRule.helpShown = false;
                nextRule.struggling = false;
            }
        });
    }
}

// ------------------------------
//  DOWNLOAD, RESTART, INPUT HANDLING
// ------------------------------
function downloadStory() {
    const text = gameState.currentText;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_future_story.txt';
    a.click();
    URL.revokeObjectURL(url);
}

function handleTextInput(event) {
    const text = event.target.value;
    gameState.currentText = text;
    const wordCount = getWordCount(text);
    const wordCountEl = document.getElementById('word-count');
    if (wordCountEl) wordCountEl.innerText = `${wordCount} word${wordCount === 1 ? '' : 's'}`;
    validateRules(text);
}

function restartGame() {
    gameState = { currentText: '', rulesCompleted: 0, gameComplete: false };
    rules.forEach(rule => {
        rule.satisfied = false;
        rule.active = rule.id === 1;
        rule.helpShown = false;
        rule.struggling = false;
        if (rule.active) rule.activeSince = Date.now();
    });

    const storyInput = document.getElementById('story-input');
    if (storyInput) storyInput.value = '';
    const wordCountEl = document.getElementById('word-count');
    if (wordCountEl) wordCountEl.innerText = '0 words';

    const completionMessageEl = document.getElementById('completion-message');
    if (completionMessageEl) {
        completionMessageEl.classList.remove('visible');
        completionMessageEl.style.display = 'none';
    }
    const emailContainerEl = document.getElementById('email-container');
    if (emailContainerEl) emailContainerEl.style.display = 'none';

    updateRulesList();
}

// ------------------------------
//  INITIALISATION
// ------------------------------
function initGame() {
    // Input listener
    const storyInput = document.getElementById('story-input');
    if (storyInput) storyInput.addEventListener('input', handleTextInput);

    // Restart button listener
    const restartButton = document.getElementById('restart-button');
    if (restartButton) restartButton.addEventListener('click', restartGame);

    // Download button listener
    const downloadButton = document.getElementById('download-button');
    if (downloadButton) downloadButton.addEventListener('click', downloadStory);

    // FORM submit → optional survey tab
    const formElement = document.getElementById('storyForm');
    if (formElement) {
        formElement.addEventListener('submit', () => {
            const emailInput = document.getElementById('email-input');
            if (emailInput && emailInput.value.trim()) {
                setTimeout(() => {
                    // TODO: replace with actual survey URL when you have it
                    window.open('https://yoursurveyprovider.com/followup', '_blank', 'noopener');
                }, 400);
            }
        });
    }

    // Initial rules render
    updateRulesList();

    // Periodic struggle monitor
    setInterval(monitorUserStruggle, 5000);
}

document.addEventListener('DOMContentLoaded', initGame);
