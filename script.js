document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Fix initial navbar state
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-anim').forEach(el => {
        observer.observe(el);
    });

    // Booking Form Logic
    const addPersonBtn = document.getElementById('add-person-btn');
    const extraPersonContainer = document.getElementById('extra-person-container');
    const customLocationToggle = document.getElementById('custom-location-toggle');
    const customLocationContainer = document.getElementById('custom-location-container');
    const customLocationInput = document.getElementById('custom-location');

    let friendCount = 0;
    // Photo Reference Upload Logic
    const photoInput = document.getElementById('photo-reference-input');
    const photoPreviewContainer = document.getElementById('photo-preview-container');

    if (photoInput) {
        photoInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            
            files.forEach(file => {
                if (!file.type.startsWith('image/')) return;

                const reader = new FileReader();
                reader.onload = function(event) {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'preview-remove';
                    removeBtn.innerHTML = '&times;';
                    removeBtn.onclick = function(e) {
                        e.stopPropagation();
                        previewItem.remove();
                        // Note: In a real app, you'd manage a file list array here
                    };

                    previewItem.appendChild(img);
                    previewItem.appendChild(removeBtn);
                    photoPreviewContainer.appendChild(previewItem);
                };
                reader.readAsDataURL(file);
            });
        });
    }

    if (addPersonBtn) {
        addPersonBtn.addEventListener('click', () => {
            friendCount++;
            const isZh = document.documentElement.lang === 'zh-CN';
            const nameLabel = isZh ? `朋友 ${friendCount} 的名字` : `Friend ${friendCount}'s Name`;
            const phoneLabel = isZh ? `朋友 ${friendCount} 的电话 (选填)` : `Friend ${friendCount}'s Phone (Optional)`;
            const namePlaceholder = isZh ? "李四" : "Jane Doe";
            const phonePlaceholder = "(123) 456-7890";
            
            const friendRow = document.createElement('div');
            friendRow.className = 'form-group animate-in';
            friendRow.style.marginTop = '1rem';
            friendRow.style.paddingTop = '1rem';
            friendRow.style.borderTop = '1px dashed #ccc';
            
            friendRow.innerHTML = `
                <div style="margin-bottom: 0.5rem;">
                    <label>${nameLabel}</label>
                    <input type="text" name="extra-name[]" placeholder="${namePlaceholder}" required>
                </div>
                <div>
                    <label>${phoneLabel}</label>
                    <input type="tel" name="extra-phone[]" placeholder="${phonePlaceholder}">
                </div>
            `;
            
            const friendsList = document.getElementById('friends-list');
            if (friendsList) {
                friendsList.appendChild(friendRow);
            }
        });
    }

    if (customLocationToggle) {
        customLocationToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                customLocationContainer.classList.remove('hidden');
                customLocationInput.required = true;
            } else {
                customLocationContainer.classList.add('hidden');
                customLocationInput.required = false;
            }
        });
    }

    // Custom Toast Notification
    window.showToast = function(message) {
        let toast = document.getElementById('custom-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'custom-toast';
            toast.className = 'custom-toast';
            document.body.appendChild(toast);
        }
        
        // Remove existing timeout if any
        if (toast.timeoutId) {
            clearTimeout(toast.timeoutId);
            toast.classList.remove('show');
            // small delay to let it animate out before popping back in
            setTimeout(() => {
                toast.textContent = message;
                toast.classList.add('show');
                toast.timeoutId = setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);
            }, 50);
            return;
        }

        toast.textContent = message;
        
        // Trigger reflow
        void toast.offsetWidth;
        
        toast.classList.add('show');
        toast.timeoutId = setTimeout(() => {
            toast.classList.remove('show');
            toast.timeoutId = null;
        }, 3000);
    };

    const wizardTop    = document.querySelector('.wizard-top-section');
    const wizardBottom = document.querySelector('.wizard-bottom-sheet');

    // Hide sheet instantly (no animation) — used on page load
    function hideSheetInstant() {
        if (!wizardBottom) return;
        wizardBottom.classList.add('sheet-hidden', 'no-transition');
        void wizardBottom.offsetWidth; // force reflow
        wizardBottom.classList.remove('no-transition');
    }

    // Show sheet with CSS transition
    function showSheet() {
        if (!wizardBottom) return;
        wizardBottom.classList.remove('sheet-hidden');
        if (wizardTop) wizardTop.classList.add('sheet-open');
    }

    // Hide sheet with CSS transition
    function hideSheet() {
        if (!wizardBottom) return;
        wizardBottom.classList.add('sheet-hidden');
        if (wizardTop) wizardTop.classList.remove('sheet-open');
    }

    window.resetCalendarView = function(instant = false) {
        instant ? hideSheetInstant() : hideSheet();

        // Hide the Change Date button
        const changeDateBtnEl = document.getElementById('change-date-btn');
        if (changeDateBtnEl) changeDateBtnEl.style.display = 'none';

        if (typeof calendarGrid !== 'undefined' && calendarGrid) {
            // Restore the month header and day-of-week labels
            const calendarHeader = calendarGrid.closest('.calendar-card')?.querySelector('.calendar-header');
            const daysHeader = calendarGrid.closest('.calendar-card')?.querySelector('.calendar-days-header');

            if (instant) {
                if (calendarHeader) {
                    calendarHeader.style.transition = 'none';
                    calendarHeader.style.opacity = '';
                    calendarHeader.style.maxHeight = '';
                    calendarHeader.style.overflow = '';
                    void calendarHeader.offsetWidth;
                    calendarHeader.style.transition = '';
                }
                if (daysHeader) {
                    daysHeader.style.transition = 'none';
                    daysHeader.style.opacity = '';
                    daysHeader.style.maxHeight = '';
                    void daysHeader.offsetWidth;
                    daysHeader.style.transition = '';
                }
            } else {
                if (calendarHeader) {
                    calendarHeader.style.transition = 'opacity 0.4s cubic-bezier(0.32, 0.72, 0, 1) 100ms, max-height 0.45s cubic-bezier(0.32, 0.72, 0, 1) 100ms';
                    calendarHeader.style.opacity = '';
                    calendarHeader.style.maxHeight = '';
                    calendarHeader.style.overflow = '';
                    setTimeout(() => { calendarHeader.style.transition = ''; }, 600);
                }
                if (daysHeader) {
                    daysHeader.style.transition = 'opacity 0.4s cubic-bezier(0.32, 0.72, 0, 1) 80ms, max-height 0.45s cubic-bezier(0.32, 0.72, 0, 1) 80ms';
                    daysHeader.style.opacity = '';
                    daysHeader.style.maxHeight = '';
                    setTimeout(() => { daysHeader.style.transition = ''; }, 600);
                }
            }

            const cells = Array.from(calendarGrid.children);
            cells.forEach((cell, i) => {
                if (instant) {
                    cell.style.transition = 'none';
                    cell.style.opacity = '';
                    cell.style.maxHeight = '';
                    cell.style.transform = '';
                    cell.style.margin = '';
                    cell.style.padding = '';
                    cell.style.overflow = '';
                    void cell.offsetWidth;
                    cell.style.transition = '';
                } else {
                    // Stagger the reveal from top to bottom
                    const row = Math.floor(i / 7);
                    const delay = row * 30; // 30ms stagger per row
                    cell.style.transition = `opacity 0.4s cubic-bezier(0.32, 0.72, 0, 1) ${delay}ms,
                                             max-height 0.45s cubic-bezier(0.32, 0.72, 0, 1) ${delay}ms,
                                             transform 0.4s cubic-bezier(0.32, 0.72, 0, 1) ${delay}ms,
                                             margin 0.45s cubic-bezier(0.32, 0.72, 0, 1) ${delay}ms,
                                             padding 0.45s cubic-bezier(0.32, 0.72, 0, 1) ${delay}ms`;
                    cell.style.opacity = '';
                    cell.style.maxHeight = '';
                    cell.style.transform = '';
                    cell.style.margin = '';
                    cell.style.padding = '';
                    cell.style.overflow = '';

                    // Clean up transition after animation
                    setTimeout(() => { cell.style.transition = ''; }, 500 + delay);
                }
            });
        }
    };

    // Change Date button
    const changeDateBtn = document.getElementById('change-date-btn');
    if (changeDateBtn) {
        changeDateBtn.addEventListener('click', function() {
            // Deselect current date
            if (typeof calendarGrid !== 'undefined' && calendarGrid) {
                const selected = calendarGrid.querySelector('.calendar-day.selected');
                if (selected) selected.classList.remove('selected');
            }
            window.selectedDate = null;
            const datetimeVal = document.getElementById('datetime-val');
            if (datetimeVal) datetimeVal.value = '';

            // Show the card title again
            const cardTitle = document.querySelector('.calendar-card-title');
            if (cardTitle) {
                cardTitle.style.transition = 'opacity 0.4s cubic-bezier(0.32, 0.72, 0, 1), max-height 0.45s cubic-bezier(0.32, 0.72, 0, 1)';
                cardTitle.style.opacity = '';
                cardTitle.style.maxHeight = '';
                cardTitle.style.overflow = '';
                setTimeout(() => { cardTitle.style.transition = ''; }, 600);
            }

            // Hide the button itself
            changeDateBtn.style.display = 'none';

            // Expand the full calendar
            resetCalendarView();
        });
    }

    window.collapseCalendarToSelectedRow = function(selectedCell) {
        showSheet();
        if (window.innerWidth >= 1024) return; // Don't collapse calendar on desktop

        if (typeof calendarGrid !== 'undefined' && calendarGrid && selectedCell) {
            const cells = Array.from(calendarGrid.children);
            const index = cells.indexOf(selectedCell);
            if (index === -1) return;

            const selectedRow = Math.floor(index / 7);
            const startIdx = selectedRow * 7;
            const endIdx   = startIdx + 6;

            // Fade out the month header, day-of-week labels, and card title
            const calendarHeader = calendarGrid.closest('.calendar-card')?.querySelector('.calendar-header');
            const daysHeader = calendarGrid.closest('.calendar-card')?.querySelector('.calendar-days-header');
            const cardTitle = calendarGrid.closest('.calendar-card')?.querySelector('.calendar-card-title');
            if (calendarHeader) {
                calendarHeader.style.transition = 'opacity 0.35s cubic-bezier(0.32, 0.72, 0, 1), max-height 0.4s cubic-bezier(0.32, 0.72, 0, 1)';
                calendarHeader.style.opacity = '0';
                calendarHeader.style.maxHeight = '0px';
                calendarHeader.style.overflow = 'hidden';
            }
            if (daysHeader) {
                daysHeader.style.opacity = '0';
                daysHeader.style.maxHeight = '0px';
            }
            if (cardTitle) {
                cardTitle.style.transition = 'opacity 0.3s cubic-bezier(0.32, 0.72, 0, 1), max-height 0.35s cubic-bezier(0.32, 0.72, 0, 1)';
                cardTitle.style.opacity = '0';
                cardTitle.style.maxHeight = '0px';
                cardTitle.style.overflow = 'hidden';
            }

            // Show the Change Date button
            if (changeDateBtn) {
                changeDateBtn.style.display = 'block';
            }

            cells.forEach((cell, i) => {
                if (i < startIdx || i > endIdx) {
                    // Calculate distance from selected row for stagger
                    const cellRow = Math.floor(i / 7);
                    const distance = Math.abs(cellRow - selectedRow);
                    const delay = distance * 40; // 40ms stagger per row distance

                    cell.style.transition = `opacity 0.35s cubic-bezier(0.32, 0.72, 0, 1) ${delay}ms,
                                             max-height 0.4s cubic-bezier(0.32, 0.72, 0, 1) ${delay}ms,
                                             transform 0.35s cubic-bezier(0.32, 0.72, 0, 1) ${delay}ms,
                                             margin 0.4s cubic-bezier(0.32, 0.72, 0, 1) ${delay}ms,
                                             padding 0.4s cubic-bezier(0.32, 0.72, 0, 1) ${delay}ms`;
                    cell.style.overflow = 'hidden';
                    cell.style.opacity = '0';
                    cell.style.maxHeight = '0px';
                    cell.style.transform = 'scale(0.8)';
                    cell.style.margin = '0';
                    cell.style.padding = '0';
                } else {
                    // Keep selected row cells visible and reset any previous hiding
                    cell.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    cell.style.opacity = '1';
                    cell.style.maxHeight = '';
                    cell.style.transform = '';
                    cell.style.margin = '';
                    cell.style.padding = '';
                    cell.style.overflow = '';
                }
            });
        }
    };



    // Wizard Navigation Logic
    window.goToStep = function(stepNum, stepTitle) {
        // Validation for step 1
        if (stepNum === 2) {
            const dateVal = document.getElementById('datetime-val');
            if (!dateVal || !dateVal.value) {
                showToast(document.documentElement.lang === 'zh-CN' ? "请先选择一个日期和时间！" : "Please select a date and time first!");
                return;
            }
        }

        if (stepNum > 1) {
            if (wizardTop) wizardTop.classList.remove('calendar-full-screen');
            if (wizardBottom) wizardBottom.classList.remove('sheet-hidden');
        } else {
            if (!window.selectedDate) {
                resetCalendarView();
            } else {
                if (typeof calendarGrid !== 'undefined' && calendarGrid) {
                    const selectedEl = calendarGrid.querySelector('.calendar-day.selected');
                    if (selectedEl) collapseCalendarToSelectedRow(selectedEl);
                }
            }
        }

        let currentActive = document.querySelector('.wizard-step.active');
        let currentStepNum = currentActive ? parseInt(currentActive.id.split('-')[1]) : 1;
        let direction = stepNum > currentStepNum ? 'forward' : 'backward';
        const exitClass = direction === 'forward' ? 'exit-left' : 'exit-right';
        const enterClass = direction === 'forward' ? 'enter-right' : 'enter-left';

        // Clean up any lingering animation classes on all steps
        document.querySelectorAll('.wizard-step').forEach(step => {
            if (step !== currentActive) {
                step.classList.remove('active', 'exit-left', 'exit-right', 'enter-left', 'enter-right');
                step.style.transform = '';
                step.style.opacity = '';
            }
        });

        const targetStep = document.getElementById(`step-${stepNum}`);

        // Animate the outgoing step
        if (currentActive && currentActive !== targetStep) {
            currentActive.classList.remove('active');
            currentActive.classList.add(exitClass);

            // Clean up the exiting step after animation completes
            currentActive.addEventListener('animationend', function handler() {
                currentActive.removeEventListener('animationend', handler);
                currentActive.classList.remove(exitClass);
                currentActive.style.transform = '';
                currentActive.style.opacity = '';
            });
        }

        // Animate the incoming step
        if (targetStep) {
            targetStep.classList.add('active', enterClass);
            targetStep.scrollTop = 0; // Reset scroll position

            targetStep.addEventListener('animationend', function handler() {
                targetStep.removeEventListener('animationend', handler);
                targetStep.classList.remove(enterClass);
            });
        }

        // Toggle Header
        const step1Header = document.getElementById('step1-header');
        const otherStepsHeader = document.getElementById('other-steps-header');
        const headerTitle = document.getElementById('wizard-step-title');
        const backBtn = document.getElementById('wizard-back-btn');

        if(stepNum === 1) {
            step1Header.style.display = 'block';
            otherStepsHeader.style.display = 'none';
            if (wizardTop) wizardTop.classList.remove('is-sub-step');
            if (wizardBottom) wizardBottom.classList.remove('is-sub-step');
        } else {
            step1Header.style.display = 'none';
            otherStepsHeader.style.display = 'flex';
            if (wizardTop) wizardTop.classList.add('is-sub-step');
            if (wizardBottom) wizardBottom.classList.add('is-sub-step');
            if(headerTitle && stepTitle) {
                headerTitle.textContent = stepTitle;
            }
            
            // Setup back button
            if(backBtn) {
                backBtn.onclick = function() {
                    let prevTitle = "";
                    switch(stepNum - 1) {
                        case 1: prevTitle = ""; break;
                        case 2: prevTitle = document.documentElement.lang === 'zh-CN' ? "你的信息" : "Your Details"; break;
                        case 3: prevTitle = document.documentElement.lang === 'zh-CN' ? "摄影风格偏好" : "Style Preference"; break;
                        case 4: prevTitle = document.documentElement.lang === 'zh-CN' ? "首选地点" : "Preferred Locations"; break;
                    }
                    goToStep(stepNum - 1, prevTitle);
                };
            }
        }
        // Update Desktop Continue Buttons
        const desktopOtherContinue = document.getElementById('desktop-other-continue');
        if (desktopOtherContinue) {
            const isLastStep = stepNum === 5;
            const isZh = document.documentElement.lang === 'zh-CN';
            desktopOtherContinue.textContent = isLastStep ? (isZh ? "保存日期" : "Save Date") : (isZh ? "继续 >" : "Continue >");
        }
    };

    // Desktop Header Continue Buttons Logic
    const desktopStep1Continue = document.getElementById('desktop-step1-continue');
    const desktopOtherContinue = document.getElementById('desktop-other-continue');
    const bookingForm = document.getElementById('booking-form');

    if (desktopStep1Continue) {
        desktopStep1Continue.addEventListener('click', () => {
            const isZh = document.documentElement.lang === 'zh-CN';
            goToStep(2, isZh ? "你的信息" : "Your Details");
        });
    }

    if (desktopOtherContinue) {
        desktopOtherContinue.addEventListener('click', () => {
            let currentActive = document.querySelector('.wizard-step.active');
            let currentStepNum = currentActive ? parseInt(currentActive.id.split('-')[1]) : 1;
            const isZh = document.documentElement.lang === 'zh-CN';

            if (currentStepNum === 5) {
                if (bookingForm) {
                    // Use a standard submit button click to trigger validation
                    const hiddenSubmit = document.createElement('button');
                    hiddenSubmit.type = 'submit';
                    hiddenSubmit.style.display = 'none';
                    bookingForm.appendChild(hiddenSubmit);
                    hiddenSubmit.click();
                    hiddenSubmit.remove();
                }
            } else {
                let nextStepNum = currentStepNum + 1;
                let nextTitle = "";
                switch(nextStepNum) {
                    case 3: nextTitle = isZh ? "摄影风格偏好" : "Style Preference"; break;
                    case 4: nextTitle = isZh ? "首选地点" : "Preferred Locations"; break;
                    case 5: nextTitle = isZh ? "最后细节" : "Final Details"; break;
                }
                goToStep(nextStepNum, nextTitle);
            }
        });
    }

    // Custom Calendar & Time UI Logic for Wizard Step 1
    const datetimeVal = document.getElementById('datetime-val');
    let currentDate = new Date();
    let selectedDate = null;
    let selectedTime = null;
    let selectedDuration = null;

    const timeStartInput = document.getElementById('time-start-input');
    const timeEndInput = document.getElementById('time-end-input');
    const dualSliderTrack = document.getElementById('dual-slider-track');
    const dualSliderFill = document.getElementById('dual-slider-fill');
    const thumbStart = document.getElementById('thumb-start');
    const thumbEnd = document.getElementById('thumb-end');
    
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const monthYearDisplay = document.getElementById('month-year-display');
    const calendarGrid = document.getElementById('calendar-grid');

    if (dualSliderTrack && thumbStart && thumbEnd) {
        let startVal = 0; // 0%
        let endVal = 16.666; // 10:00 AM initial (2 hours)
        const maxSteps = 24; // 12 hours (8am-8pm) * 2 half-hours

        function getStepFromPercent(percent) {
            let step = Math.round((percent / 100) * maxSteps);
            return Math.max(0, Math.min(maxSteps, step));
        }

        function getPercentFromStep(step) {
            return (step / maxSteps) * 100;
        }

        function formatTimeFromStep(step) {
            let totalMins = (8 * 60) + (step * 30);
            let h = Math.floor(totalMins / 60);
            let m = totalMins % 60;
            let ampm = h >= 12 && h < 24 ? 'PM' : 'AM';
            let displayH = h % 12;
            displayH = displayH === 0 ? 12 : displayH;
            let displayM = m === 0 ? '00' : '30';
            return `${displayH}:${displayM} ${ampm}`;
        }

        function updateSliderUI() {
            thumbStart.style.left = `${startVal}%`;
            thumbEnd.style.left = `${endVal}%`;
            dualSliderFill.style.left = `${startVal}%`;
            dualSliderFill.style.width = `${endVal - startVal}%`;
        }

        function handleThumbDrag(thumb, isStart) {
            let active = false;

            const dragStart = (e) => {
                active = true;
            };

            const dragEnd = () => {
                active = false;
            };

            const drag = (e) => {
                if (active) {
                    e.preventDefault(); 
                    let clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                    const trackRect = dualSliderTrack.getBoundingClientRect();
                    let newPercent = ((clientX - trackRect.left) / trackRect.width) * 100;
                    
                    let step = getStepFromPercent(newPercent);
                    let currentStartStep = getStepFromPercent(startVal);
                    let currentEndStep = getStepFromPercent(endVal);
                    
                    if (isStart) {
                        if (step >= currentEndStep) step = currentEndStep - 1;
                        startVal = getPercentFromStep(step);
                        selectedTime = formatTimeFromStep(step);
                        if(timeStartInput) timeStartInput.value = selectedTime;
                    } else {
                        if (step <= currentStartStep) step = currentStartStep + 1;
                        endVal = getPercentFromStep(step);
                        let endT = formatTimeFromStep(step);
                        if(timeEndInput) timeEndInput.value = endT;
                    }

                    let durationHrs = (getStepFromPercent(endVal) - getStepFromPercent(startVal)) / 2;
                    selectedDuration = `${durationHrs} Hour${durationHrs !== 1 ? 's' : ''}`;
                    
                    updateSliderUI();
                    checkSelection();
                }
            };

            thumb.addEventListener("touchstart", dragStart, {passive: false});
            thumb.addEventListener("mousedown", dragStart);
            document.addEventListener("touchend", dragEnd);
            document.addEventListener("mouseup", dragEnd);
            document.addEventListener("touchmove", drag, {passive: false});
            document.addEventListener("mousemove", drag);
        }

        handleThumbDrag(thumbStart, true);
        handleThumbDrag(thumbEnd, false);
        
        // Initial UI state setup
        selectedTime = formatTimeFromStep(0);
        selectedDuration = "2 Hours";
        updateSliderUI();
    }

    function renderCalendar() {
        if(!calendarGrid) return;
        calendarGrid.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        let monthName = monthNames[month];
        if (document.documentElement.lang === 'zh-CN') {
            monthName = (month + 1) + "月";
        }
        
        if(monthYearDisplay) monthYearDisplay.textContent = `${monthName} ${year}`;

        const today = new Date();
        today.setHours(0,0,0,0);

        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'calendar-day empty';
            calendarGrid.appendChild(empty);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement('div');
            day.classList.add('calendar-day');
            
            day.innerHTML = `<span class="day-number">${i}</span>`;

            const cellDate = new Date(year, month, i);
            if (cellDate < today) {
                day.classList.add('disabled');
            } else {
                day.addEventListener('click', () => {
                    document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
                    day.classList.add('selected');
                    selectedDate = cellDate;
                    checkSelection();
                    collapseCalendarToSelectedRow(day);
                });
            }

            if (selectedDate && cellDate.getTime() === selectedDate.getTime()) {
                day.classList.add('selected');
            }

            calendarGrid.appendChild(day);
        }
    }

    function checkSelection() {
        if (selectedDate && selectedTime && selectedDuration) {
            const formattedDate = selectedDate.toLocaleDateString(document.documentElement.lang === 'zh-CN' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            datetimeVal.value = `${formattedDate} at ${selectedTime} (${selectedDuration})`;
        } else {
            datetimeVal.value = "";
        }
    }

    if(prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            selectedDate = null;
            checkSelection();
            renderCalendar();
            resetCalendarView();
        });
    }

    if(nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            selectedDate = null;
            checkSelection();
            renderCalendar();
            resetCalendarView();
        });
    }

    // Initialize calendar on load
    renderCalendar();
    if (!selectedDate) {
        resetCalendarView(true); // instant hide on page load, no animation
    } else {
        const selectedEl = calendarGrid.querySelector('.calendar-day.selected');
        if (selectedEl) collapseCalendarToSelectedRow(selectedEl);
    }
    const dropdownHeader = document.getElementById('location-dropdown-header');
    const dropdownList = document.getElementById('location-dropdown-list');
    const customDropdownContainer = document.querySelector('.custom-dropdown');
    const dropdownCheckboxes = document.querySelectorAll('.dropdown-checkbox');

    if (dropdownHeader) {
        // Toggle dropdown open/close
        dropdownHeader.addEventListener('click', () => {
            dropdownList.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!customDropdownContainer.contains(e.target)) {
                dropdownList.classList.add('hidden');
            }
        });

        const updateDropdownHeader = () => {
            const allCheckboxes = document.querySelectorAll('.dropdown-checkbox');
            const selected = Array.from(allCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            
            if (selected.length === 0) {
                dropdownHeader.textContent = dropdownHeader.dataset.default || 'Select Locations...';
            } else if (selected.length === 1) {
                dropdownHeader.textContent = selected[0];
            } else {
                dropdownHeader.textContent = `${selected.length} Locations Selected`;
            }
        };

        // Update header text on selection
        dropdownCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateDropdownHeader);
        });

        // College Input Logic
        const collegeInputs = document.querySelectorAll('.college-input');
        collegeInputs.forEach(input => {
            input.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent closing dropdown
            });
            input.addEventListener('input', (e) => {
                const parent = e.target.closest('.college-item');
                const checkbox = parent.querySelector('.college-checkbox');
                if(e.target.value.trim() !== '') {
                    checkbox.checked = true;
                    checkbox.value = "College Building: " + e.target.value.trim();
                } else {
                    checkbox.checked = false;
                    checkbox.value = "College Building";
                }
                updateDropdownHeader();
            });
        });

        // Add Custom Location Logic
        const addCustomBtn = document.getElementById('add-custom-location-btn');
        const customInputField = document.getElementById('custom-location-input-field');

        if (addCustomBtn && customInputField) {
            addCustomBtn.addEventListener('click', (e) => {
                e.preventDefault(); // prevent form submit
                const val = customInputField.value.trim();
                if (val) {
                    const newLabel = document.createElement('label');
                    newLabel.className = 'dropdown-item';
                    
                    const newImg = document.createElement('img');
                    newImg.src = 'assets/grad_cap.png'; // use grad cap for custom
                    newImg.alt = val;
                    
                    const newSpan = document.createElement('span');
                    newSpan.textContent = val;
                    
                    const newCheckbox = document.createElement('input');
                    newCheckbox.type = 'checkbox';
                    newCheckbox.name = 'locations[]';
                    newCheckbox.value = val;
                    newCheckbox.className = 'dropdown-checkbox';
                    newCheckbox.checked = true;
                    
                    newCheckbox.addEventListener('change', updateDropdownHeader);

                    newLabel.appendChild(newImg);
                    newLabel.appendChild(newSpan);
                    newLabel.appendChild(newCheckbox);

                    const adder = document.querySelector('.custom-location-adder');
                    dropdownList.insertBefore(newLabel, adder);
                    
                    customInputField.value = '';
                    updateDropdownHeader();
                }
            });
        }
    }
});
