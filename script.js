document.addEventListener("DOMContentLoaded", () => {
  const dataFilePath = "./data.json";
  let timeData = [];
  const timeFrameButtons = document.querySelectorAll(".time-frame-btn");
  const activityCards = document.querySelectorAll(".activity-card");

  async function fetchData() {
    try {
      const response = await fetch(dataFilePath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (
        !Array.isArray(data) ||
        !data.every((item) => item.title && item.timeframes)
      ) {
        throw new Error("Invalid data structure in data.json");
      }
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  function updateDashboard(selectedTimeFrame) {
    activityCards.forEach((cardElement) => {
      const category = cardElement.dataset.category;
      const dataEntry = timeData.find((entry) => entry.title === category);
      const currentElement = cardElement.querySelector(
        ".activity-card__current-time"
      );
      const previousElement = cardElement.querySelector(
        ".activity-card__previous-time"
      );

      if (dataEntry && dataEntry.timeframes[selectedTimeFrame]) {
        const { current, previous } = dataEntry.timeframes[selectedTimeFrame];
        if (currentElement) {
          currentElement.textContent = `${current}hrs`;
        }
        if (previousElement) {
          const previousPeriodText =
            {
              daily: "Yesterday",
              weekly: "Last Week",
              monthly: "Last Month",
            }[selectedTimeFrame] || "Previous";
          previousElement.textContent = `${previousPeriodText} - ${previous}hrs`;
        }
      } else {
        console.warn(`Data for ${category} - ${selectedTimeFrame} not found.`);
      }
    });
  }

  function handleTimeFrameClick(event) {
    timeFrameButtons.forEach((btn) => btn.classList.remove("active"));
    event.currentTarget.classList.add("active");
    const selectedTimeFrame = event.currentTarget.dataset.timeFrame;
    updateDashboard(selectedTimeFrame);
  }

  async function initializeDashboard() {
    timeData = await fetchData();
    timeFrameButtons.forEach((btn) =>
      btn.addEventListener("click", handleTimeFrameClick)
    );
    const initializeActiveButton = document.querySelector(
      ".time-frame-btn.active"
    );
    updateDashboard(initializeActiveButton?.dataset.timeFrame || "weekly");
  }

  initializeDashboard();
});
