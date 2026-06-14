// Global Toast System
function showToast(message, type = "success") {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "fixed bottom-5 right-5 z-50 flex flex-col gap-2";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  const bgClass = type === "success" ? "border-cyan-500 text-cyan-400" : "border-red-500 text-red-400";
  toast.className = `glass-card border-l-4 ${bgClass} p-4 rounded-r shadow-lg transform translate-y-2 transition-all duration-300 min-w-[250px]`;
  toast.innerHTML = `<p class="font-medium text-sm">${message}</p>`;
  
  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.remove("translate-y-2"), 10);
  
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Global UI Rendering Helpers
function createCardSkeleton() {
  return `
    <div class="glass-card p-4 rounded-xl border border-gray-800">
      <div class="skeleton h-48 w-full rounded-lg mb-4"></div>
      <div class="skeleton h-6 w-3/4 rounded mb-2"></div>
      <div class="skeleton h-4 w-1/2 rounded"></div>
    </div>
  `;
}

// Countdown Engine
function initCountdown(targetDate, elementId) {
  const el = document.getElementById(elementId);
  if(!el) return;

  function update() {
    const now = new Date().getTime();
    const distance = new Date(targetDate).getTime() - now;
    
    if (distance < 0) {
      el.innerHTML = "<span class='text-red-500 font-bold'>PROMO BERAKHIR</span>";
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    
    el.innerHTML = `${days}hari ${hours}j ${minutes}m`;
  }
  update();
  setInterval(update, 60000);
}