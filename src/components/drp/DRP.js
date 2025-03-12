export default {
    emits: ["closePicker", "selectedDates"],
    props: {
        componentId: {
            type: Number,
            default: 0,
        },
        isRangePicker: {
            type: Boolean,
            default: true,
        },
        openPicker: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const today = new Date();
        const startingDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
        );
        const endingDate = new Date(
            today.getFullYear() + 1,
            today.getMonth(),
            today.getDate() - 1,
        );
        return {
            weekdays,
            startingDate,
            endingDate,
            selectedDatesRange: { start: null, end: null },
            backupEndDate: null,
            currentMonthIndex: 0,
            calculateCurrentMonthIndex: true,
            isPickerOpen: false,
        };
    },
    methods: {
        openRangePicker() {
            this.isPickerOpen = true;

            let container = document.getElementById(
                "drp-container-" + this.componentId
            );
            container.innerHTML = "";
            container.classList.toggle("drp-mobile", window.innerWidth <= 768);

            if (window.innerWidth <= 768) {
                for (let i = 0; i < 13; i++) {
                    const date = new Date(
                        this.startingDate.getFullYear(),
                        this.startingDate.getMonth() + this.currentMonthIndex + i,
                        1
                    );
                    if (date < this.endingDate) {
                        this.generateCalendar(date, container);
                    }
                }

                if (this.selectedDatesRange.start) {
                    const selectedHeader = document.getElementById(
                        `drp-calendar-${this.componentId
                        }-${this.selectedDatesRange.start.getFullYear()}-${this.selectedDatesRange.start.getMonth()}`
                    );

                    if (selectedHeader) {
                        selectedHeader.scrollIntoView({
                            behavior: "auto",
                            block: "start",
                        });
                    }
                }
            } else {
                if (this.calculateCurrentMonthIndex && this.selectedDatesRange.start) {
                    const diffMonths =
                        (this.selectedDatesRange.start.getFullYear() -
                            this.startingDate.getFullYear()) *
                        12 +
                        (this.selectedDatesRange.start.getMonth() -
                            this.startingDate.getMonth());
                    this.currentMonthIndex = Math.max(0, diffMonths);
                }

                const year = this.startingDate.getFullYear();
                const firstMonth =
                    this.startingDate.getMonth() + this.currentMonthIndex;
                const secondMonth =
                    this.startingDate.getMonth() + this.currentMonthIndex + 1;
                const firstDate = new Date(year, firstMonth);
                const secondDate = new Date(year, secondMonth);

                if (secondDate < this.endingDate) {
                    this.generateCalendar(firstDate, container);
                    this.generateCalendar(secondDate, container);
                } else {
                    let firstDate = new Date(year, firstMonth - 1, 1);
                    let secondDate = new Date(year, secondMonth - 1, 1);
                    if (secondDate > this.endingDate) {
                        firstDate = new Date(year, firstMonth - 2, 1);
                        secondDate = new Date(year, secondMonth - 2, 1);
                    }
                    this.generateCalendar(firstDate, container);
                    this.generateCalendar(secondDate, container);
                }
            }

            this.highlightRange();
        },
        generateCalendar(date, container) {
            const year = date.getFullYear();
            const month = date.getMonth();

            const calendar = document.createElement("div");
            calendar.className = "drp-calendar";

            const header = document.createElement("h3");
            header.id = `drp-header-${this.componentId}-${year}-${month}`;
            header.textContent = `${date.toLocaleString("en-US", { month: "long" })} ${year}`;
            calendar.appendChild(header);

            const daysContainer = document.createElement("div");
            daysContainer.className = "drp-days";
            daysContainer.addEventListener("click", (e) => this.selectDate(e));
            daysContainer.addEventListener("mouseover", (e) => this.handleHover(e));
            daysContainer.addEventListener("mouseout", this.clearHoverRange);

            this.weekdays.forEach((day) => {
                const weekdays = document.createElement("div");
                weekdays.className = "drp-weekdays";
                weekdays.textContent = day;
                daysContainer.appendChild(weekdays);
            });

            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let i = 0; i < firstDay; i++) {
                const emptyDay = document.createElement("div");
                emptyDay.className = "drp-day empty-drp-day";
                daysContainer.appendChild(emptyDay);
            }

            for (let i = 1; i <= daysInMonth; i++) {
                const date = new Date(year, month, i);
                const dayElement = document.createElement("div");
                dayElement.className = "drp-day";
                dayElement.textContent = i;
                dayElement.dataset.year = year;
                dayElement.dataset.month = month;
                dayElement.dataset.date = i;

                if (date < this.startingDate || date > this.endingDate) {
                    dayElement.classList.add("disabled-drp-day");
                } else {
                    dayElement.classList.add(`drp-date-${this.componentId}`);
                }

                if (date.toDateString() == this.startingDate.toDateString()) {
                    dayElement.classList.add("drp-today");
                }

                daysContainer.appendChild(dayElement);
            }

            calendar.appendChild(daysContainer);
            container.appendChild(calendar);
        },
        highlightRange() {
            document
                .querySelectorAll(`.drp-date-${this.componentId}.selected`)
                .forEach((day) => {
                    day.classList.remove("selected");
                });
            const { start, end } = this.selectedDatesRange;
            if (!start && !end) return;

            document
                .querySelectorAll(`.drp-date-${this.componentId}`)
                .forEach((day) => {
                    const selectedDate = new Date(day.dataset.year, day.dataset.month, day.dataset.date);

                    if (this.selectedDatesRange.start && this.selectedDatesRange.end) {
                        if (selectedDate >= start && selectedDate <= end) {
                            day.classList.add("selected");
                        }
                    } else if (
                        this.selectedDatesRange.start &&
                        !this.selectedDatesRange.end
                    ) {
                        if (selectedDate.toDateString() == start.toDateString()) {
                            day.classList.add("selected");
                        }
                    }
                });
        },
        handleHover(event) {
            if (
                window.innerWidth >= 768 &&
                this.isRangePicker &&
                this.selectedDatesRange.start &&
                !this.selectedDatesRange.end
            ) {
                const target = event.target;
                if (target.classList.contains(`drp-date-${this.componentId}`)) {
                    const hoverDate = new Date(target.dataset.year, target.dataset.month, target.dataset.date);

                    document
                        .querySelectorAll(`.drp-date-${this.componentId}`)
                        .forEach((day) => {
                            const currentDate = new Date(day.dataset.year, day.dataset.month, day.dataset.date);
                            if (
                                (currentDate > this.selectedDatesRange.start &&
                                    currentDate <= hoverDate) ||
                                (currentDate < this.selectedDatesRange.start &&
                                    currentDate >= hoverDate)
                            ) {
                                day.classList.add("hover-range");
                            } else {
                                day.classList.remove("hover-range");
                            }
                        });
                }
            }
        },
        selectDate(event) {
            const target = event.target;
            if (target.classList.contains(`drp-date-${this.componentId}`)) {
                const selectedDate = new Date(target.dataset.year, target.dataset.month, target.dataset.date);

                if (this.isRangePicker) {
                    if (
                        !this.selectedDatesRange.start ||
                        (this.selectedDatesRange.start && this.selectedDatesRange.end)
                    ) {
                        this.selectedDatesRange.start = selectedDate;
                        this.selectedDatesRange.end = null;
                        this.backupEndDate = null;
                    } else if (
                        this.selectedDatesRange.start &&
                        !this.selectedDatesRange.end
                    ) {
                        this.selectedDatesRange.end = selectedDate;
                        if (this.selectedDatesRange.start > this.selectedDatesRange.end) {
                            const temp = this.selectedDatesRange.start;
                            this.selectedDatesRange.start = this.selectedDatesRange.end;
                            this.selectedDatesRange.end = temp;
                        }
                        if (window.innerWidth > 768) {
                            this.closeRangePicker();
                        }
                    }
                } else {
                    this.selectedDatesRange.start = selectedDate;
                    this.selectedDatesRange.end = null;
                    if (window.innerWidth > 768) {
                        this.closeRangePicker();
                    }
                }

                this.highlightRange();
                this.calculateCurrentMonthIndex = true;
                this.$emit("selectedDates", this.selectedDatesRange);
            }
        },
        nextMonths() {
            this.calculateCurrentMonthIndex = false;
            if (this.currentMonthIndex < 11) {
                this.currentMonthIndex += 2;
                this.openRangePicker();
            }
        },
        previousMonths() {
            this.calculateCurrentMonthIndex = false;
            if (this.currentMonthIndex > 0) {
                this.currentMonthIndex = Math.max(0, this.currentMonthIndex - 2);
                this.openRangePicker();
            }
        },
        closeRangePicker(isOverlay) {
            if (!isOverlay || window.innerWidth > 768) {
                this.calculateCurrentMonthIndex = true;
                this.isPickerOpen = false;
                this.$emit("closePicker");
            }
        },
    },
    watch: {
        openPicker(value) {
            this.isPickerOpen = value;
            if (value) {
                this.openRangePicker();
            }
        },
        isRangePicker(value) {
            if (value) {
                this.selectedDatesRange.end = this.backupEndDate;
                if (this.selectedDatesRange.start && this.selectedDatesRange.end) {
                    if (this.selectedDatesRange.start > this.selectedDatesRange.end) {
                        const temp = this.selectedDatesRange.start;
                        this.selectedDatesRange.start = this.selectedDatesRange.end;
                        this.selectedDatesRange.end = temp;
                    }
                }
                this.highlightRange();
                this.$emit("selectedDates", this.selectedDatesRange);
            } else {
                this.backupEndDate = this.selectedDatesRange.end;
                this.selectedDatesRange.end = null;
                this.highlightRange();
                this.$emit("selectedDates", this.selectedDatesRange);
            }
        },
    },
    mounted() {
        window.addEventListener("resize", () => {
            this.openRangePicker();
        });
    },
};
