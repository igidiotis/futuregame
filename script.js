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

// Game rules
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
        description: 'Educational Focus: Describe some aspect of learning or education in your future world.',
        helpText: 'Try mentioning something about how people learn, what they study, or how education works in your future scenario.',
        validator: (text) => {
            const educationConcepts = ['learn', 'educat', 'teach', 'study', 'school', 'class', 'course', 'curriculum', 'knowledge', 'skill', 'instruct'];
            return educationConcepts.some(concept => text.toLowerCase().includes(concept));
        },
        satisfied: false,
        active: false
    },
    {
        id: 3,
        description: 'Future Educator: Describe who or what facilitates learning in your future world.',
        helpText: 'Consider adding a teacher, tutor, or mentor figure with futuristic or technological elements to your story.',
        validator: (text) => {
            const educatorConcepts = ['teach', 'tutor', 'instructor', 'professor', 'mentor', 'guide', 'coach'];
            const futureConcepts = ['ai', 'robot', 'digital', 'holo', 'virtual', 'quantum', 'neural', 'auto', 'cyber', 'tech'];
            return areConceptsNear(text, educatorConcepts, futureConcepts);
        },
        satisfied: false,
        active: false
    },
    {
        id: 4,
        description: 'Learning Technology: Describe a technology that helps people learn in your future world.',
        helpText: 'Add a futuristic device, system, or technology that students use for learning in your scenario.',
        validator: (text) => {
            const techConcepts = ['device', 'system', 'technology', 'tech', 'machine', 'tool', 'equipment', 'interface', 'headset', 'implant', 'computer', 'program', 'software'];
            const futureConcepts = ['neural', 'vr', 'ar', 'hologram', 'quantum', 'nano', 'digital', 'virtual', 'simul', 'ai', 'brain', 'mind'];
            return areConceptsNear(text, techConcepts, futureConcepts);
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
        description: 'Student Experience: How do learners feel about education in your future world?',
        helpText: 'Include how students emotionally respond to learning in this future - are they excited, confused, curious, inspired?',
        validator: (text) => {
            const emotionConcepts = ['feel', 'emotion', 'excite', 'thrill', 'confus', 'curious', 'wonder', 'awe', 'frustrat', 'inspir', 'joy', 'fear', 'anxiety', 'hope', 'content', 'satisf', 'overwhelm', 'calm', 'stress'];
            const learnerConcepts = ['student', 'learner', 'child', 'people', 'person', 'participant', 'user', 'mind', 'brain', 'pupil'];
            return areConceptsNear(text, emotionConcepts, learnerConcepts);
        },
        satisfied: false,
        active: false
    },
    {
        id: 7,
        description: 'Learning Environment: Where does education take place in your future world?',
        helpText: 'Describe the physical or virtual space where learning happens - is it floating in the sky, underwater, in virtual reality, or somewhere else futuristic?',
        validator: (text) => {
            const spaceConcepts = ['classroom', 'school', 'academy', 'university', 'campus', 'lab', 'center', 'space', 'environment', 'room', 'hall', 'hub', 'dome'];
            const futureConcepts = ['float', 'fly', 'orbit', 'space', 'virtual', 'digital', 'holo', 'cloud', 'underwater', 'bio', 'eco', 'network', 'connect'];
            return areConceptsNear(text, spaceConcepts, futureConcepts);
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
        description: 'Education Challenge: What problem or challenge exists in your future education system?',
        helpText: 'No system is perfect - what difficulties or problems might students or teachers face with this future educational approach?',
        validator: (text) => {
            const challengeConcepts = ['problem', 'challenge', 'issue', 'difficulty', 'obstacle', 'hurdle', 'concern', 'risk', 'threat', 'danger', 'limit', 'drawback', 'overload', 'scarcity', 'divide', 'bias', 'privacy', 'security', 'distract'];
            const educationConcepts = ['learn', 'educat', 'teach', 'study', 'school', 'class', 'course', 'curriculum', 'knowledge', 'skill', 'instruct', 'student', 'ai', 'data', 'tech', 'system'];
            return areConceptsNear(text, challengeConcepts, educationConcepts);
        },
        satisfied: false,
        active: false
    },
    {
        id: 10,
        description: 'Sensory Detail: Include a sensory experience (sight, sound, smell, taste, touch) in your future learning environment.',
        helpText: 'Make your world come alive by describing what students might see, hear, smell, taste, or feel in this environment.',
        validator: (text) => {
            const sensoryConcepts = ['hear', 'sound', 'noise', 'see', 'light', 'color', 'smell', 'scent', 'aroma', 'taste', 'flavor', 'feel', 'touch', 'texture', 'vibration', 'hum', 'glow', 'shine', 'soft', 'hard', 'warm', 'cool'];
            return sensoryConcepts.some(sense => text.toLowerCase().includes(sense));
        },
        satisfied: false,
        active: false
    },
    {
        id: 11,
        description: 'Educational Shift: How has the approach to education fundamentally changed in your future world?',
        helpText: 'Describe how education philosophies or methods have evolved - what old approaches have been replaced or transformed?',
        validator: (text) => {
            const changeConcepts = ['chang', 'transform', 'shift', 'revolut', 'replac', 'new', 'differ', 'obsolete', 'abandon', 'evolv', 'reform', 'reimagin', 'redefin', 'innovat'];
            const educationConcepts = ['learn', 'educat', 'teach', 'study', 'curriculum', 'exam', 'test', 'memoriz', 'knowledge', 'skill', 'grade', 'assessment', 'class', 'course'];
            return areConceptsNear(text, changeConcepts, educationConcepts);
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

// Function to render a rule with help icon
function renderRule(rule) {
    const ruleElement = document.createElement('div');
    ruleElement.className = `rule-container ${rule.satisfied ? 'satisfied' : ''} ${!rule.active ? 'inactive' : ''} ${rule.struggling ? 'struggling' : ''}`;
    ruleElement.id = `rule-${rule.id}`;
    
    const ruleText = document.createElement('div');
    ruleText.className = 'rule-text';
    ruleText.innerText = rule.description;
    
    ruleElement.appendChild(ruleText);
    
    // Only add help icon for active, unsatisfied rules
    if (rule.active && !rule.satisfied) {
        const helpIcon = document.createElement('div');
        helpIcon.className = 'help-icon';
        helpIcon.innerText = '?';
        helpIcon.addEventListener('click', () => toggleHelpTooltip(rule.id));
        
        const helpTooltip = document.createElement('div');
        helpTooltip.className = 'help-tooltip';
        helpTooltip.id = `help-${rule.id}`;
        helpTooltip.innerText = rule.helpText || 'Try to fulfill this rule to continue your story.';
        
        ruleElement.appendChild(helpIcon);
        ruleElement.appendChild(helpTooltip);
    }
    
    return ruleElement;
}

// Toggle help tooltip visibility
function toggleHelpTooltip(ruleId) {
    const tooltip = document.getElementById(`help-${ruleId}`);
    if (tooltip) {
        tooltip.classList.toggle('visible');
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
                showHelpTooltip(rule.id);
                rule.helpShown = true;
                
                // Update the rule display
                updateRulesList();
            }
        }
    });
}

// Show help tooltip
function showHelpTooltip(ruleId) {
    const tooltip = document.getElementById(`help-${ruleId}`);
    if (tooltip) {
        tooltip.classList.add('visible');
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            tooltip.classList.remove('visible');
        }, 8000);
    }
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
    
    // Add download button to completion message
    const completionMessage = document.getElementById('completion-message');
    if (completionMessage) {
        const downloadButton = document.createElement('button');
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
    }
    
    // Set up initial rules
    updateRulesList();
    
    // Set up the monitor to check periodically for user struggle
    setInterval(monitorUserStruggle, 5000); // Check every 5 seconds
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);
