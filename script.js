const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const sampleTabButtons = document.querySelectorAll(".sample-tab-button");
const sampleTabPanels = document.querySelectorAll(".sample-tab-panel");

tabButtons.forEach((button) => {
  if (button.classList.contains("sample-tab-button")) {
    return;
  }
  button.addEventListener("click", () => {
    const target = button.dataset.tab;

    tabButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    tabPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === target);
    });
  });
});

sampleTabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.sampleTab;

    sampleTabButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    sampleTabPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.samplePanel === target);
    });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const monthSelect = document.querySelector("#monthSelect");

if (monthSelect) {
  const estimatedCost = document.querySelector("#estimatedCost");
  const costBreakdown = document.querySelector("#costBreakdown");
  const estimatedBookings = document.querySelector("#estimatedBookings");
  const estimatedAgents = document.querySelector("#estimatedAgents");
  const estimatedB2C = document.querySelector("#estimatedB2C");
  const estimatorNote = document.querySelector("#estimatorNote");

  const baseMetrics = {
    monthlyCost: 1500000,
    bookings: 2000,
    agents: 20000,
    b2c: 200000,
    scaleUp: 1.1,
  };

  const formatNumber = (value) => value.toLocaleString("en-IN");
  const formatCurrency = (value) => `INR ${formatNumber(value)}`;

  const getProjection = (months) => {
    let totalCost = 0;
    let totalBookings = 0;
    let totalAgents = 0;
    let totalB2C = 0;
    let currentMultiplier = 1;

    for (let month = 1; month <= months; month += 1) {
      totalCost += Math.round(baseMetrics.monthlyCost * currentMultiplier);
      totalBookings += Math.round(baseMetrics.bookings * currentMultiplier);
      totalAgents += Math.round(baseMetrics.agents * currentMultiplier);
      totalB2C += Math.round(baseMetrics.b2c * currentMultiplier);
      currentMultiplier *= baseMetrics.scaleUp;
    }

    return {
      totalCost,
      totalBookings,
      totalAgents,
      totalB2C,
    };
  };

  const getBreakdownText = (months) => {
    if (months === 1) {
      return "Month 1 at INR 15,00,000 with an estimated 2,000 bookings and reach to 20,000 agents.";
    }

    if (months === 2) {
      return "Month 2 scales up by 10%, taking the combined 2-month investment to INR 31,50,000.";
    }

    return "Month 1 starts at INR 15,00,000, with a 10% scale-up in each additional month for stronger campaign momentum.";
  };

  const getRecommendation = (months) => {
    if (months === 1) {
      return "1 month creates an initial push, but a longer run is better for sustained recall and stronger conversion.";
    }

    if (months === 2) {
      return "2 months improves continuity, while 3 months is the stronger setup for better campaign success.";
    }

    return "A 3-month run gives the campaign stronger repetition, better learning, and higher conversion potential.";
  };

  const renderEstimator = () => {
    const months = Number(monthSelect.value);
    const projection = getProjection(months);

    estimatedCost.textContent = formatCurrency(projection.totalCost);
    costBreakdown.textContent = getBreakdownText(months);
    estimatedBookings.textContent = formatNumber(projection.totalBookings);
    estimatedAgents.textContent = formatNumber(projection.totalAgents);
    estimatedB2C.textContent = formatNumber(projection.totalB2C);
    estimatorNote.textContent = getRecommendation(months);
  };

  monthSelect.addEventListener("change", renderEstimator);
  renderEstimator();
}
