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

// Game state
let gameState = {
    currentText: '',
    rulesCompleted: 0,
    gameComplete: false
};

// Game rules with simplified validators
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
            // Look for specific learning technologies
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
        helpText: 'Describe sensations like: glowing screens, humming machines, the smell of clean air, the taste of focus-enhancing drinks, or the feeling of neural connections.',
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
    // Rule 12 (Narrative Structure) removed as requested
    {
        id: 13,
        description: 'Story Length: Your story must be at least 100 words long to be complete.',
        helpText: 'Your story currently has less than 100 words. Add more details about the learning experience, technologies, or emotions of the students to reach 100 words.',
        validator: (text) => {
            const count = getWordCount(text);
            return count >= 100;
        },
        satisfied: false,
        active: false
    }
];

// Function to render a rule with expandable help
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
        
        // Add help icon to header
        ruleHeader.appendChild(helpIcon);
        
        // Make the whole header clickable to toggle help
        ruleHeader.addEventListener('click', () => {
            toggleHelp(rule.id);
        });
    }
    
    // Create expandable help content section
    const helpContent = document.createElement('div');
    helpContent.className = 'help-content';
    helpContent.id = `help-${rule.id}`;
    helpContent.innerText = rule.helpText || 'Try to fulfill this rule to continue your story.';
    
    // Add all elements to the rule container
    ruleElement.appendChild(ruleHeader);
    ruleElement.appendChild(helpContent);
    
    return ruleElement;
}

// Toggle help expansion for a specific rule
function toggleHelp(ruleId) {
    const ruleElement = document.getElementById(`rule-${ruleId}`);
    if (ruleElement) {
        // Toggle expanded class
        ruleElement.classList.toggle('help-expanded');
        
        // Mark that we've shown help for this rule
        const rule = rules.find(r => r.id === ruleId);
        if (rule && ruleElement.classList.contains('help-expanded')) {
            rule.helpShown = true;
        }
    }
}

// Show help for a specific rule
function showHelp(ruleId) {
    const ruleElement = document.getElementById(`rule-${ruleId}`);
    if (ruleElement && !ruleElement.classList.contains('help-expanded')) {
        ruleElement.classList.add('help-expanded');
        
        // Mark that we've shown help for this rule
        const rule = rules.find(r => r.id === ruleId);
        if (rule) {
            rule.helpShown = true;
        }
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            ruleElement.classList.remove('help-expanded');
        }, 8000);
    }
}

// Auto-show help for rules that the user is struggling with
function monitorUserStruggle() {
    const STRUGGLE_TIME = 20000; // 20 seconds
    
    rules.forEach(rule => {
        if (rule.active && !rule.satisfied && !rule.helpShown) {
            const timeActive = Date.now() - rule.activeSince;
            
            if (timeActive > STRUGGLE_TIME) {
                rule.struggling = true;
                showHelp(rule.id);
                
                // Update the rule display
                updateRulesList();
            }
        }
    });
}

// Update the rules list in the UI - Modified to show unsatisfied rules first
function updateRulesList() {
    const rulesList = document.getElementById('rules-list');
    rulesList.innerHTML = '';
    
    // First, add active but not satisfied rules
    const unsatisfiedRules = rules.filter(rule => rule.active && !rule.satisfied);
    unsatisfiedRules.forEach(rule => {
        rulesList.appendChild(renderRule(rule));
    });
    
    // Then, add satisfied rules
    const satisfiedRules = rules.filter(rule => rule.satisfied);
    satisfiedRules.forEach(rule => {
        rulesList.appendChild(renderRule(rule));
    });
}

// Check which rules are satisfied with the current text
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
            
            if (rule.satisfied) {
                satisfiedActiveRulesCount++;
            }
        }
    });
    
    // Check if all rules are satisfied
    if (activeRulesCount > 0 && activeRulesCount === satisfiedActiveRulesCount && rules[rules.length - 1].satisfied) {
        gameState.gameComplete = true;
        document.getElementById('completion-message').classList.add('visible');
    }
    
    updateRulesList();
}

// Activate the next set of rules based on the current progress
function activateNextRules(currentRuleId) {
    // Define rule progression
    const ruleProgression = {
        1: [2], // After Getting Started -> Educational Focus
        2: [3], // After Educational Focus -> Future Educator
        3: [4], // After Future Educator -> Learning Technology
        4: [5], // After Learning Technology -> Growing Story (50 words)
        5: [6, 7], // After Growing Story -> Student Experience & Learning Environment
        7: [8, 9], // After Learning Environment -> Future Timeline & Education Challenge
        9: [10, 11], // After Education Challenge -> Sensory Detail & Educational Shift
        11: [13], // After Educational Shift -> Story Length (skipping Narrative Structure)
    };
    
    // Activate next rules if defined in the progression
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

// Function to download story as .txt file
function downloadStory() {
    const text = gameState.currentText;
    const filename = "future_education_story.txt";
    
    // Create a Blob with the story text
    const blob = new Blob([text], { type: "text/plain" });
    
    // Create a link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// Handle text input
function handleTextInput(event) {
    const text = event.target.value;
    gameState.currentText = text;
    
    // Update word count
    const wordCount = getWordCount(text);
    document.getElementById('word-count').innerText = `${wordCount} words`;
    
    // Validate rules
    validateRules(text);
}

// Restart the game
function restartGame() {
    // Reset game state
    gameState = {
        currentText: '',
        rulesCompleted: 0,
        gameComplete: false
    };
    
    // Reset rules
    rules.forEach(rule => {
        rule.satisfied = false;
        rule.active = rule.id === 1; // Only the first rule starts active
        rule.helpShown = false;
        rule.struggling = false;
        if (rule.active) {
            rule.activeSince = Date.now();
        }
    });
    
    // Clear textarea
    const storyInput = document.getElementById('story-input');
    storyInput.value = '';
    document.getElementById('word-count').innerText = '0 words';
    
    // Hide completion message
    document.getElementById('completion-message').classList.remove('visible');
    
    // Update rules list
    updateRulesList();
}

// Initialize the game
function initGame() {
    // Set up event listeners
    const storyInput = document.getElementById('story-input');
    storyInput.addEventListener('input', handleTextInput);
    
    const restartButton = document.getElementById('restart-button');
    if (restartButton) {
        restartButton.addEventListener('click', restartGame);
    }
    
    // Add download button to completion message if it doesn't exist
    const completionMessage = document.getElementById('completion-message');
    if (completionMessage) {
        let downloadButton = document.getElementById('download-button');
        
        if (!downloadButton) {
            downloadButton = document.createElement('button');
            downloadButton.className = 'button';
            downloadButton.id = 'download-button';
            downloadButton.innerText = 'Download Story';
            downloadButton.addEventListener('click', downloadStory);
            
            // Add some space between buttons
            const spacer = document.createElement('span');
            spacer.style.margin = '0 10px';
            
            // Find the restart button and insert the download button before it
            const existingRestartButton = document.getElementById('restart-button');
            if (existingRestartButton && existingRestartButton.parentNode) {
                existingRestartButton.parentNode.insertBefore(downloadButton, existingRestartButton);
                existingRestartButton.parentNode.insertBefore(spacer, existingRestartButton);
            } else {
                completionMessage.appendChild(downloadButton);
            }
        } else {
            // Make sure the event listener is attached
            downloadButton.addEventListener('click', downloadStory);
        }
    }
    
    // Set up initial rules
    updateRulesList();
    
    // Set up the monitor to check periodically for user struggle
    setInterval(monitorUserStruggle, 5000); // Check every 5 seconds
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);
