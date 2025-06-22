/* ===============================
   TourGuide Pro – Front-End Logic
   =============================== */

/* ----------  DUMMY DATA ---------- */
const guides = [
  {
    id: 1,
    name: "Ravi Mehra",
    city: "delhi",
    services: ["city-tour", "cultural", "food"],
    price: 40,
    rating: 4.6,
    phone: "+91-98989-12345",
    email: "ravi.delhi@example.in"
  },
  {
    id: 2,
    name: "Simran Kaur",
    city: "agra",
    services: ["city-tour", "photography"],
    price: 35,
    rating: 4.5,
    phone: "+91-98765-11223",
    email: "simran.agra@example.in"
  },
  {
    id: 3,
    name: "Arjun Rathore",
    city: "jaipur",
    services: ["cultural", "city-tour", "adventure"],
    price: 42,
    rating: 4.7,
    phone: "+91-97654-22110",
    email: "arjun.jaipur@example.in"
  },
  {
    id: 4,
    name: "Priya Shah",
    city: "mumbai",
    services: ["city-tour", "food", "adventure"],
    price: 35,
    rating: 4.4,
    phone: "+91-98765-43210",
    email: "priya.mumbai@example.in"
  },
  {
    id: 5,
    name: "Daniel Fernandes",
    city: "goa",
    services: ["adventure", "photography", "city-tour"],
    price: 50,
    rating: 4.8,
    phone: "+91-94444-55667",
    email: "daniel.goa@example.in"
  },
  {
    id: 6,
    name: "Ankita Tripathi",
    city: "varanasi",
    services: ["cultural", "photography"],
    price: 30,
    rating: 4.5,
    phone: "+91-95555-77889",
    email: "ankita.varanasi@example.in"
  },
  {
    id: 7,
    name: "Hari Nair",
    city: "kerala",
    services: ["city-tour", "food", "adventure"],
    price: 45,
    rating: 4.6,
    phone: "+91-99887-12345",
    email: "hari.kerala@example.in"
  },
  {
    id: 8,
    name: "Nisha Rawat",
    city: "rishikesh",
    services: ["adventure", "yoga", "cultural"],
    price: 38,
    rating: 4.4,
    phone: "+91-98989-33445",
    email: "nisha.rishikesh@example.in"
  },
  {
    id: 9,
    name: "Tenzing Lama",
    city: "ladakh",
    services: ["adventure", "cultural", "photography"],
    price: 55,
    rating: 4.9,
    phone: "+91-91234-55667",
    email: "tenzing.ladakh@example.in"
  }
];

/* ----------  TAB / PAGE SWITCHING ---------- */
function showPage(target) {
  document.querySelectorAll(".nav-tab").forEach(btn =>
    btn.classList.toggle("active", btn.textContent.includes(target.charAt(0).toUpperCase()))
  );
  document.querySelectorAll(".page").forEach(p =>
    p.classList.toggle("active", p.id === target + "Page")
  );
}

/* ----------  SEARCH & FILTER LOGIC ---------- */
function searchGuides() {
  const query = document.getElementById("locationSearch").value.trim().toLowerCase();
  const filtered = guides.filter(g => g.city.includes(query));
  renderResults(filtered);
}

function applyFilters() {
  const service  = document.getElementById("serviceFilter").value;
  const priceOpt = document.getElementById("priceFilter").value;
  const rating   = Number(document.getElementById("ratingFilter").value);

  let results = [...guides];

  if (service) results = results.filter(g => g.services.includes(service));
  if (rating)  results = results.filter(g => g.rating >= rating);

  if (priceOpt) {
    if (priceOpt === "budget")   results = results.filter(g => g.price <= 1000);
    if (priceOpt === "mid")      results = results.filter(g => g.price > 1000 && g.price <= 1500);
    if (priceOpt === "premium")  results = results.filter(g => g.price > 1500);
  }
  renderResults(results);
}

/* ----------  RENDER CARDS ---------- */
function renderResults(arr) {
  const section = document.getElementById("resultsSection");
  const loader  = document.getElementById("loadingIndicator");
  const empty   = document.getElementById("noResults");

  loader.style.display = "block";
  section.innerHTML = "";
  empty.style.display = "none";

  setTimeout(() => {
    loader.style.display = "none";

    if (!arr.length) {
      empty.style.display = "block";
      return;
    }

    arr.forEach(g => {
      const card = document.createElement("div");
      card.className = "guide-card";
      card.innerHTML = `
        <div class="guide-image">${g.city.substring(0,2).toUpperCase()}</div>
        <div class="guide-info">
          <div class="guide-name">${g.name}</div>
          <div class="guide-location">📍 ${g.city.charAt(0).toUpperCase() + g.city.slice(1)}</div>
          <div class="rating"><span class="stars">⭐</span> ${g.rating}</div>
          <div class="price-info">
            <div class="price-item"><span>Day Rate:</span><span>₹${g.price}</span></div>
          </div>
          <div class="services">
            ${g.services.map(s => `<span class="service-tag">${s.replace(/-/g,' ')}</span>`).join("")}
          </div>
          <div class="action-buttons">
            <button class="contact-btn" onclick="openContact('${g.name}','${g.email}','${g.phone}')">Contact</button>
            <button class="book-btn" onclick="openBooking('${g.name}')">Book</button>
          </div>
        </div>`;
      section.appendChild(card);
    });
  }, 500);
}

/* ----------  MODALS ---------- */
function openContact(guideName,email,phone) {
  document.getElementById("contactModal").style.display = "block";
  document.getElementById("contactMessage").value =
    `Hi ${guideName}, I’m interested in booking a tour with you.`;
}
function openBooking(guideName) {
  document.getElementById("bookingModal").style.display = "block";
  document.getElementById("bookingName").value = "";
  document.getElementById("bookingTourType").selectedIndex = 0;
}
function closeModal(id) { document.getElementById(id).style.display = "none"; }

/* ----------  TRIP CALCULATOR ---------- */
function calculateExpenses() {
  const days  = +document.getElementById("calcDays").value;
  const pep   = +document.getElementById("calcPeople").value;
  const tour  = document.getElementById("calcTourType").value;
  const trans = document.getElementById("calcTransport").value;
  const accom = document.getElementById("calcAccommodation").value;
  const meals = document.getElementById("calcMeals").value;

  const guideRate = {half:700, full:1300, mixed:1000};     // INR per day
  const transportRate = {included:0, separate:500, public:200};
  const accomRate = {budget:2000, mid:4500, luxury:9000};   // per night/room
  const mealRate = {budget:600, mid:1200, fine:2500};       // per day/person

  const guideCost   = guideRate[tour] * days;
  const transport   = transportRate[trans] * days;
  const accommodation = accomRate[accom] * (days - 1);
  const food        = mealRate[meals] * days * pep;

  const total = guideCost + transport + accommodation + food;

  const result = document.getElementById("calcResult");
  result.innerHTML = `
    <h3>Estimated Trip Cost</h3>
    <p><strong>₹${total.toLocaleString()}</strong> for ${pep} traveler(s) over ${days} day(s).</p>
    <ul style="margin-left:18px">
      <li>Guide & Tours: ₹${guideCost}</li>
      <li>Transport: ₹${transport}</li>
      <li>Accommodation: ₹${accommodation}</li>
      <li>Meals: ₹${food}</li>
    </ul>`;
  result.style.display = "block";
}

/* ----------  DESTINATION SHORTCUT ---------- */
function searchDestination(city) {
  document.getElementById("locationSearch").value = city;
  showPage('search');
  searchGuides();
}

/* ----------  SERVICE WORKER & OFFLINE ---------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () =>
    navigator.serviceWorker.register("service-worker.js")
      .catch(err => console.log("SW registration failed:", err))
  );
}
window.addEventListener("online",  () => document.getElementById("statusBar").style.display="none");
window.addEventListener("offline", () => document.getElementById("statusBar").style.display="block");

/* ----------  INITIAL RENDER ---------- */
document.addEventListener("DOMContentLoaded", () => renderResults(guides));
