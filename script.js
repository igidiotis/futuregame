document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const storyInput = document.getElementById('story-input');
    const wordCountDisplay = document.getElementById('word-count');
    const rulesList = document.getElementById('rules-list');
    const downloadButton = document.getElementById('download-button');
    const winMessage = document.getElementById('win-message');

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

// Example usage in rules:
const rules = [
    {
        id: 1,
        description: 'Getting Started: Write at least 10 words to reveal the next rules. Tip: try describing your story\'s context or setting.',
        helpText: 'Just start writing a few words about your future education scenario to begin.',
        validator: (text) => getWordCount(text) >= 10,
        satisfied: false,
        active: true
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
    {
        id: 12,
        description: 'Narrative Structure: Make sure your story has a clear beginning, middle with a challenge, and conclusion.',
        helpText: 'Structure your story with multiple paragraphs. Start with the setting, introduce a challenge or conflict in the middle, and provide some resolution at the end.',
        validator: (text) => {
            // Check for adequate length and some paragraph separation
            return getWordCount(text) >= 100 && text.split(/\n\s*\n/).length >= 2;
        },
        satisfied: false,
        active: false
    },
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
