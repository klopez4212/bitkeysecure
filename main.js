document.addEventListener('DOMContentLoaded', function() {
    const testAddress = 'bc1q-xy2k-98dV-84gq-tzq2-n0yw-f249-3p83-kk8j-hx0w-1h12-LIu7-xy2k-bc4q-gdyg-jrsq';
    const charactersToVerify = ['g', 'w', '8', '4']; // expected characters for verification
    const addressGrid = document.querySelector('#addressGrid');
    const fullAddressContainer = document.getElementById('fullAddressText');

    // Show loading screen first
    const loadingOverlay = document.getElementById('loadingOverlay');
    const mainContent = document.getElementById('mainContent');

    function createCodeRow(elements) {
        const row = document.createElement('div');
        row.classList.add('code-row');
        elements.forEach(el => row.appendChild(el));
        return row;
    }
    
    function buildAddressGrid(addressStr, targets) {
        const segments = addressStr.split('-');
        const remainingTargets = [...targets.map(c => c.toLowerCase())]; // copy for tracking
        let currentRow = [];
    
        segments.forEach((segment, i) => {
            const chars = segment.split('');
            
            chars.forEach(char => {
                const lowerChar = char.toLowerCase();
                
                // Match only if still in list
                const matchIndex = remainingTargets.indexOf(lowerChar);
                if (matchIndex !== -1) {
                    // Create input
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.maxLength = 1;
                    input.className = 'character-input';
                    input.dataset.expected = lowerChar;
                    currentRow.push(input);
    
                    // Remove matched char
                    remainingTargets.splice(matchIndex, 1);
                } else {
                    // Create static span
                    const span = document.createElement('span');
                    span.className = 'code-text';
                    span.textContent = char;
                    currentRow.push(span);
                }
            });
    
            // Add separator unless it's the last segment or every 4th segment
            if (i < segments.length - 1 && (i + 1) % 4 !== 0) {
                const sep = document.createElement('span');
                sep.className = 'separator';
                sep.textContent = '-';
                currentRow.push(sep);
            }

    
            // Every 4 segments per row
            if ((i + 1) % 4 === 0 || i === segments.length - 1) {
                const row = createCodeRow(currentRow);
                addressGrid.appendChild(row);
                currentRow = [];
            }
        });
    } 
     
    function buildFullAddressDisplay(addressStr, container) {
        const segments = addressStr.split('-');
        let currentRow = [];
    
        segments.forEach((segment, i) => {
            // Create the code segment
            const codeSpan = document.createElement('span');
            codeSpan.className = 'code-text';
            codeSpan.textContent = segment;
            currentRow.push(codeSpan);
    
            // Add a separator if not the last segment
            if (i < segments.length - 1 && (i + 1) % 4 !== 0) {
                const sep = document.createElement('span');
                sep.className = 'separator';
                sep.textContent = '-';
                currentRow.push(sep);
            }
    
            // Every 4 segments becomes a row
            if ((i + 1) % 4 === 0 || i === segments.length - 1) {
                const row = document.createElement('div');
                row.className = 'code-row';
                currentRow.forEach(el => row.appendChild(el));
                container.appendChild(row);
                currentRow = [];
            }
        });
    }
    
    
    // Function to show the amount confirmation screen
    function showAmountConfirmation() {
        const amountScreen = document.getElementById('amountConfirmation');
        const verificationScreen = document.getElementById('addressVerification');
        const successScreen = document.getElementById('successScreen');
        const amountButtons = document.getElementById('amountButtons');
        const verificationButtons = document.getElementById('verificationButtons');
        
        // Show amount screen, hide others
        amountScreen.classList.add('active');
        verificationScreen.classList.remove('active');
        successScreen.classList.remove('active');
        
        amountButtons.style.display = 'flex';
        amountButtons.style.opacity = '1';
        verificationButtons.style.display = 'none';
        verificationButtons.style.opacity = '0';
        
        // Set up button handlers
        const yesButton = amountButtons.querySelector('.primary-button');
        const noButton = amountButtons.querySelector('.secondary-button');
        
        // Remove previous event listeners if any
        const newYesButton = yesButton.cloneNode(true);
        const newNoButton = noButton.cloneNode(true);
        yesButton.parentNode.replaceChild(newYesButton, yesButton);
        noButton.parentNode.replaceChild(newNoButton, noButton);
        
        // Add new event listeners
        newYesButton.addEventListener('click', function() {
            // Transition to verification screen with animation
            amountScreen.classList.remove('active');
            amountButtons.style.opacity = '0';
            
            setTimeout(function() {
                amountButtons.style.display = 'none';
                verificationButtons.style.display = 'flex';
                verificationScreen.classList.add('active');
                
                setTimeout(function() {
                    verificationButtons.style.opacity = '1';
                    
                    // Initialize the address verification screen
                    initializeAddressVerification();
                }, 50);
            }, 300);
        });
        
        newNoButton.addEventListener('click', function() {
            alert('Transaction cancelled.');
        });
    }
    
    // Main app initialization for address verification
    function initializeAddressVerification() {
        console.log('JavaScript is running!');
        
        // Expected characters for validation
        const expectedChars = ['g', 'w', '8', '4'];
        
        // Get all input fields
        const inputFields = document.querySelectorAll('.character-input');
        const verificationButtons = document.getElementById('verificationButtons');
        const checkButton = verificationButtons.querySelector('.primary-button');
        const skipButton = verificationButtons.querySelector('.secondary-button');
        
        // Focus the first input after a delay
        setTimeout(() => {
            if (inputFields.length > 0) {
                inputFields[0].focus();
            }
        }, 500);
        
        // Immediately disable the check button
        checkButton.disabled = true;
        console.log('Button disabled on load:', checkButton.disabled);
        
        // Force the disabled state with an attribute as well
        checkButton.setAttribute('disabled', 'disabled');
        
        // Add default styling to inputs
        inputFields.forEach(input => {
            input.style.transition = 'all 0.5s ease';
        });
        
        // Function to check inputs and update button state
        function checkInputs() {
            let allCorrect = true;
            let allFilled = true;
            
            inputFields.forEach((input, index) => {
                if (input.value === '') {
                    allFilled = false;
                } else if (input.value.toLowerCase() !== expectedChars[index]) {
                    allCorrect = false;
                }
            });
            
            // Update button state
            if (allFilled && allCorrect) {
                checkButton.disabled = false;
                checkButton.removeAttribute('disabled');
                console.log('All correct! Button enabled.');
            } else {
                checkButton.disabled = true;
                checkButton.setAttribute('disabled', 'disabled');
                console.log('Not all correct. Button disabled.');
            }
            
            console.log(`All filled: ${allFilled}, All correct: ${allCorrect}`);
        }    
        
        // Run check on page load
        checkInputs();
        
        // Add input event listeners to each input field
        inputFields.forEach((input, index) => {
            // Focus the first input field on page load
            if (index === 0) {
                setTimeout(() => input.focus(), 500);
            }
            
            // Handle blur event - ensure no outline if empty
            input.addEventListener('blur', function() {
                if (this.value === '') {
                    this.style.outline = 'none';
                    this.style.border = 'none';
                    this.style.backgroundColor = '#3a3d46';
                }
            });
            
            // Input event handler
            input.addEventListener('input', function() {
                const value = this.value.toLowerCase();
                const expected = expectedChars[index];
                
                console.log(`Input ${index}: Entered "${value}", Expected "${expected}"`);
                
                if (value === '') {
                    // Reset styling if empty
                    this.setAttribute('style', 'border: none !important; outline: none !important; background-color: #3a3d46 !important;');
                    checkInputs();
                    return;
                }
                
                // Check if input is correct
                if (value === expected) {
                    // Correct input - use setAttribute for maximum override
                    this.setAttribute('style', 'border: 1px solid #00cc00 !important; outline: 1px solid #00cc00 !important; background-color: rgba(0, 204, 0, 0.2) !important;');
                } else {
                    // Incorrect input - use setAttribute for maximum override
                    this.setAttribute('style', 'border: 1px solid #ff0000 !important; outline: 1px solid #ff0000 !important; background-color: rgba(255, 0, 0, 0.2) !important;');
                }
                
                // Move to next input if not the last one
                if (index < inputFields.length - 1) {
                    inputFields[index + 1].focus();
                }
                
                // Check if all inputs are filled and correct
                checkInputs();
            });
            
            // Key navigation
            input.addEventListener('keydown', function(e) {
                switch (e.key) {
                    case 'ArrowRight':
                        if (index < inputFields.length - 1) {
                            inputFields[index + 1].focus();
                        }
                        break;
                    case 'ArrowLeft':
                        if (index > 0) {
                            inputFields[index - 1].focus();
                        }
                        break;
                    case 'Backspace':
                        if (this.value === '' && index > 0) {
                            inputFields[index - 1].focus();
                        }
                        break;
                    case 'Enter':
                        // Find and click the primary button
                        const primaryButton = document.querySelector('.primary-button:not([disabled])');
                        if (primaryButton) {
                            primaryButton.click();
                        }
                        break;
                }
            });
        });
        
        // Check button click handler
        checkButton.addEventListener('click', function() {
            // Check if all inputs are correct
            let allCorrect = true;
            
            inputFields.forEach((input, index) => {
                if (input.value.toLowerCase() !== expectedChars[index]) {
                    allCorrect = false;
                }
            });
            
            if (allCorrect) {
                // Transition to success screen
                const verificationScreen = document.getElementById('addressVerification');
                const successScreen = document.getElementById('successScreen');
                const verificationButtons = document.getElementById('verificationButtons');
                
                // Fade out verification
                verificationScreen.classList.remove('active');
                verificationButtons.style.opacity = '0';
                
                setTimeout(() => {
                    verificationButtons.style.display = 'none';
                    successScreen.classList.add('active');
                    
                    // Force original styles first to allow transition to be visible
                    const separators = successScreen.querySelectorAll('.separator');
                    const codeTexts = successScreen.querySelectorAll('.code-text');
                    const codeRows = successScreen.querySelectorAll('.code-row');
                    const addressGrid = successScreen.querySelector('.address-grid');
                    
                    // Set initial styles
                    separators.forEach(sep => {
                        sep.style.margin = '0 48px';
                        sep.style.fontSize = '38px';
                    });
                    
                    codeTexts.forEach(text => {
                        text.style.fontSize = '32px';
                    });
                    
                    codeRows.forEach(row => {
                        row.style.minHeight = '70px';
                    });
                    
                    if (addressGrid) {
                        addressGrid.style.maxWidth = '600px';
                        addressGrid.style.gap = '30px';
                    }
                    
                    // Then transition all elements to their success state
                    setTimeout(() => {
                        separators.forEach(sep => {
                            sep.style.margin = window.innerWidth <= 768 ? '0 8px' : '0 16px';
                            sep.style.fontSize = window.innerWidth <= 768 ? '28px' : '32px';
                        });
                        
                        codeTexts.forEach(text => {
                            text.style.fontSize = window.innerWidth <= 768 ? '24px' : '28px';
                        });
                        
                        codeRows.forEach(row => {
                            row.style.minHeight = window.innerWidth <= 768 ? '50px' : '60px';
                        });
                        
                        if (addressGrid) {
                            addressGrid.style.maxWidth = 'none';
                            addressGrid.style.gap = '0px';
                        }
                        
                        // Hide buttons
                        const buttonContainer = document.querySelector('.button-container');
                        if (buttonContainer) {
                            buttonContainer.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
                            buttonContainer.style.transform = 'translateY(100%)';
                            buttonContainer.style.opacity = '0';
                        }
                    }, 300);
                }, 300);
            } else {
                // If not all correct, shake the incorrect inputs
                inputFields.forEach((input, index) => {
                    if (input.value.toLowerCase() !== expectedChars[index]) {
                        input.style.animation = 'shake 0.5s';
                        setTimeout(() => {
                            input.style.animation = '';
                        }, 500);
                    }
                });
            }
        });
        
        // Skip button handler
        skipButton.addEventListener('click', function() {
            alert('Skipping this verification step.');
        });
    }

    // Run this after DOM is ready
    buildAddressGrid(testAddress, charactersToVerify);        
    buildFullAddressDisplay(testAddress, fullAddressContainer);    
    
    // Hide loading screen after 3 seconds
    setTimeout(function() {
        loadingOverlay.style.opacity = '0';
        mainContent.classList.add('active');
        
        // After fade out, remove from DOM
        setTimeout(function() {
            loadingOverlay.style.display = 'none';
        }, 500);
        
        // Show amount confirmation screen first
        showAmountConfirmation();
    }, 3000);    
});
