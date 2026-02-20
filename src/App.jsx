import { useState, useEffect, useReducer } from "react";

// ─── Data & State ───────────────────────────────────────────────────────────
const INITIAL_TRUCKS = [
  { id: 1, name: "Curbside Creations", cuisine: "Southern Fusion", lat: 37.5407, lng: -77.4360, status: "active", schedule: "Mon-Fri 11am-3pm", phone: "(804) 555-0101", rating: 4.8, img: "🚚" },
  { id: 2, name: "RVA Taco Co.", cuisine: "Mexican Street Food", lat: 37.5536, lng: -77.4508, status: "active", schedule: "Tue-Sat 11am-9pm", phone: "(804) 555-0202", rating: 4.6, img: "🌮" },
  { id: 3, name: "Smoke & Barrel BBQ", cuisine: "BBQ & Smoked Meats", lat: 37.5313, lng: -77.4764, status: "inactive", schedule: "Wed-Sun 12pm-8pm", phone: "(804) 555-0303", rating: 4.9, img: "🔥" },
  { id: 4, name: "The Waffle Wagon", cuisine: "Breakfast & Brunch", lat: 37.5570, lng: -77.4670, status: "active", schedule: "Daily 7am-2pm", phone: "(804) 555-0404", rating: 4.7, img: "🧇" },
  { id: 5, name: "Pho on Wheels", cuisine: "Vietnamese", lat: 37.5480, lng: -77.4420, status: "active", schedule: "Mon-Sat 11am-8pm", phone: "(804) 555-0505", rating: 4.5, img: "🍜" },
  { id: 6, name: "Wild Bill's Soda Bar", cuisine: "Beverages & Treats", lat: 37.5390, lng: -77.4330, status: "active", schedule: "Thu-Sun 10am-6pm", phone: "(804) 555-0606", rating: 4.4, img: "🥤" },
];

const INITIAL_EVENTS = [
  { id: 1, title: "VA250 Food Truck Festival", date: "2026-03-15", time: "11:00 AM - 8:00 PM", location: "Brown's Island", trucks: 12, status: "upcoming", description: "Celebrating Virginia's 250th with the best food trucks in RVA!" },
  { id: 2, title: "Carytown Food Truck Rally", date: "2026-03-22", time: "12:00 PM - 6:00 PM", location: "Carytown", trucks: 8, status: "upcoming", description: "Monthly rally featuring rotating truck lineups." },
  { id: 3, title: "Scott's Addition Night Market", date: "2026-04-05", time: "5:00 PM - 10:00 PM", location: "Scott's Addition", trucks: 15, status: "planning", description: "Evening market with live music and food trucks." },
  { id: 4, title: "RVA Brunch Bash", date: "2026-04-12", time: "9:00 AM - 2:00 PM", location: "The Diamond District", trucks: 6, status: "planning", description: "Brunch-focused food truck event." },
];

const INITIAL_MEMBERS = [
  { id: 1, name: "Sarah Mitchell", joined: "2026-02-19", status: "pending", type: "food_lover", questions: ["I love trying new food trucks!", "Found you through a friend"] },
  { id: 2, name: "Marcus Johnson", joined: "2026-02-18", status: "pending", type: "truck_owner", questions: ["I own Big Mike's BBQ", "Looking to connect with the community"] },
  { id: 3, name: "Elena Rodriguez", joined: "2026-02-17", status: "approved", type: "food_lover", questions: ["New to RVA, looking for good eats"] },
  { id: 4, name: "James Chen", joined: "2026-02-15", status: "approved", type: "truck_owner", questions: ["Pho on Wheels owner", "Want to list my schedule"] },
];

const SPAM_QUEUE = [
  { id: 1, author: "CryptoKing99", content: "🚀 Make $5000/day trading crypto! DM me now!! 💰💰", timestamp: "2 hours ago", confidence: 98, reason: "Financial spam pattern" },
  { id: 2, author: "BestDeals2026", content: "Check out amazing deals at www.totallylegit-deals.biz - 90% OFF everything!", timestamp: "5 hours ago", confidence: 95, reason: "Suspicious URL + promotional language" },
  { id: 3, author: "NewUser4829", content: "Anyone know if Curbside Creations is out today? Their tacos are fire 🔥", timestamp: "1 hour ago", confidence: 12, reason: "New account, but content seems legitimate" },
];

const WELCOME_TEMPLATES = [
  { id: 1, name: "Food Lover Welcome", active: true, message: "Welcome to Find a Food Truck RVA, {name}! 🎉🚚\n\nWe're thrilled to have you join our 4.1K+ community of food truck enthusiasts in the Richmond area!\n\nHere's how to get started:\n📍 Check our pinned post for this week's truck locations\n📅 Browse upcoming events in the Events tab\n💬 Share your favorite food truck finds!\n\nEnjoy exploring RVA's amazing food truck scene!" },
  { id: 2, name: "Truck Owner Welcome", active: true, message: "Welcome to Find a Food Truck RVA, {name}! 🎉\n\nWe're excited to have another food truck owner in our community!\n\nAs a truck owner, you can:\n📍 Post your daily location & hours\n📅 Get listed in our upcoming events\n🤝 Connect with other vendors\n📢 Share specials and menu updates\n\nPlease review our posting guidelines in the pinned post. Let's grow together!" },
];

const ANALYTICS = {
  members: { total: 4100, thisWeek: 47, thisMonth: 182, growth: 4.6 },
  posts: { total: 156, thisWeek: 23, avgEngagement: 34, topPost: "Wild Bill's VA250 Partnership" },
  events: { upcoming: 4, attendees: 890, avgRating: 4.7 },
  moderation: { flagged: 3, removed: 12, avgResponseTime: "14 min" },
};

// ─── Reducer ────────────────────────────────────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {
    case "SET_VIEW": return { ...state, view: action.payload };
    case "APPROVE_MEMBER": return { ...state, members: state.members.map(m => m.id === action.payload ? { ...m, status: "approved" } : m) };
    case "REJECT_MEMBER": return { ...state, members: state.members.filter(m => m.id !== action.payload) };
    case "REMOVE_SPAM": return { ...state, spam: state.spam.filter(s => s.id !== action.payload) };
    case "APPROVE_POST": return { ...state, spam: state.spam.filter(s => s.id !== action.payload) };
    case "TOGGLE_TRUCK": return { ...state, trucks: state.trucks.map(t => t.id === action.payload ? { ...t, status: t.status === "active" ? "inactive" : "active" } : t) };
    case "ADD_EVENT": return { ...state, events: [...state.events, { ...action.payload, id: state.events.length + 1 }] };
    case "UPDATE_WELCOME": return { ...state, welcomeTemplates: state.welcomeTemplates.map(w => w.id === action.payload.id ? action.payload : w) };
    case "SET_MODAL": return { ...state, modal: action.payload };
    default: return state;
  }
}

// ─── Components ─────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 16,
      padding: "24px 28px",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.3s ease",
    }}
    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ position: "absolute", top: -20, right: -10, fontSize: 80, opacity: 0.04 }}>{icon}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: 700, color: accent || "#fff", marginTop: 6, fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
      {sub && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Badge({ children, color = "#3b82f6" }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.03em",
      background: color + "22",
      color: color,
      border: `1px solid ${color}33`,
    }}>{children}</span>
  );
}

function Button({ children, onClick, variant = "primary", size = "md", style: extraStyle = {} }) {
  const base = {
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  };
  const sizes = {
    sm: { padding: "6px 14px", fontSize: 12 },
    md: { padding: "10px 20px", fontSize: 13 },
    lg: { padding: "14px 28px", fontSize: 15 },
  };
  const variants = {
    primary: { background: "#f97316", color: "#fff" },
    secondary: { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.1)" },
    danger: { background: "#ef444422", color: "#ef4444", border: "1px solid #ef444433" },
    success: { background: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e33" },
    ghost: { background: "transparent", color: "rgba(255,255,255,0.6)" },
  };
  return (
    <button
      onClick={onClick}
      style={{ ...base, ...sizes[size], ...variants[variant], ...extraStyle }}
      onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "scale(1.02)"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
    >{children}</button>
  );
}

// ─── Dashboard View ─────────────────────────────────────────────────────────
function DashboardView({ state, dispatch }) {
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: 0, fontFamily: "'Syne', sans-serif" }}>Command Center</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", margin: "6px 0 0", fontSize: 14 }}>Find a Food Truck RVA — 4.1K members strong</p>
      </div>

      {/* Alert Banner */}
      <div style={{
        background: "linear-gradient(135deg, #f9731620, #f59e0b15)",
        border: "1px solid #f9731633",
        borderRadius: 14,
        padding: "16px 24px",
        marginBottom: 28,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}>
        <span style={{ fontSize: 24 }}>⚠️</span>
        <div>
          <div style={{ color: "#f97316", fontWeight: 600, fontSize: 14 }}>Group Paused — Resumes March 2, 2026</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 2 }}>Use this downtime to set up automations and plan your relaunch strategy</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard icon="👥" label="Members" value={ANALYTICS.members.total.toLocaleString()} sub={`+${ANALYTICS.members.thisWeek} this week`} accent="#3b82f6" />
        <StatCard icon="📝" label="Posts This Week" value={ANALYTICS.posts.thisWeek} sub={`${ANALYTICS.posts.avgEngagement} avg engagement`} accent="#8b5cf6" />
        <StatCard icon="📅" label="Upcoming Events" value={ANALYTICS.events.upcoming} sub={`${ANALYTICS.events.attendees} expected attendees`} accent="#f97316" />
        <StatCard icon="🛡️" label="Spam Caught" value={state.spam.length} sub={`${ANALYTICS.moderation.avgResponseTime} avg response`} accent="#ef4444" />
      </div>

      {/* Two Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Pending Actions */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 16, color: "#fff", fontFamily: "'Syne', sans-serif" }}>⚡ Pending Actions</h3>
            <Badge color="#f97316">{state.members.filter(m => m.status === "pending").length + state.spam.length} items</Badge>
          </div>

          {state.members.filter(m => m.status === "pending").map(m => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div>
                <div style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>{m.name}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Membership request · {m.type === "truck_owner" ? "🚚 Truck Owner" : "🍽️ Food Lover"}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button size="sm" variant="success" onClick={() => dispatch({ type: "APPROVE_MEMBER", payload: m.id })}>✓</Button>
                <Button size="sm" variant="danger" onClick={() => dispatch({ type: "REJECT_MEMBER", payload: m.id })}>✕</Button>
              </div>
            </div>
          ))}

          {state.spam.filter(s => s.confidence > 50).map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div>
                <div style={{ color: "#ef4444", fontSize: 14, fontWeight: 500 }}>🛡️ Spam: {s.author}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{s.confidence}% confidence · {s.reason}</div>
              </div>
              <Button size="sm" variant="danger" onClick={() => dispatch({ type: "REMOVE_SPAM", payload: s.id })}>Remove</Button>
            </div>
          ))}

          {state.members.filter(m => m.status === "pending").length === 0 && state.spam.filter(s => s.confidence > 50).length === 0 && (
            <div style={{ textAlign: "center", padding: 32, color: "rgba(255,255,255,0.3)" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              All caught up!
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 16, color: "#fff", fontFamily: "'Syne', sans-serif" }}>📅 Upcoming Events</h3>
            <Button size="sm" variant="secondary" onClick={() => dispatch({ type: "SET_VIEW", payload: "events" })}>View All</Button>
          </div>

          {state.events.filter(e => e.status === "upcoming").map(e => (
            <div key={e.id} style={{ padding: "14px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 12, marginBottom: 10, border: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{e.title}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 4 }}>
                    📍 {e.location} · 🚚 {e.trucks} trucks
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#f97316", fontSize: 13, fontWeight: 600 }}>{new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{e.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Trucks Strip */}
      <div style={{ marginTop: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, color: "#fff", fontFamily: "'Syne', sans-serif" }}>🚚 Active Trucks Today</h3>
          <Button size="sm" variant="secondary" onClick={() => dispatch({ type: "SET_VIEW", payload: "trucks" })}>Manage Trucks</Button>
        </div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
          {state.trucks.filter(t => t.status === "active").map(t => (
            <div key={t.id} style={{
              minWidth: 180,
              padding: "16px 20px",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.06)",
              flexShrink: 0,
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{t.img}</div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{t.name}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>{t.cuisine}</div>
              <div style={{ color: "#22c55e", fontSize: 11, marginTop: 6, fontWeight: 500 }}>● Active · ⭐ {t.rating}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Truck Map View ─────────────────────────────────────────────────────────
function TruckMapView({ state, dispatch }) {
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? state.trucks : state.trucks.filter(t => t.status === filter);

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: 0, fontFamily: "'Syne', sans-serif" }}>Truck Tracker</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", margin: "6px 0 0", fontSize: 14 }}>Real-time food truck locations across RVA</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "active", "inactive"].map(f => (
            <Button key={f} size="sm" variant={filter === f ? "primary" : "secondary"} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : f === "active" ? "🟢 Active" : "⚫ Inactive"}
            </Button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 20 }}>
        {/* Truck List */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 16, maxHeight: 560, overflowY: "auto" }}>
          {filtered.map(t => (
            <div
              key={t.id}
              onClick={() => setSelectedTruck(t)}
              style={{
                padding: "16px",
                borderRadius: 12,
                marginBottom: 8,
                cursor: "pointer",
                background: selectedTruck?.id === t.id ? "rgba(249,115,22,0.12)" : "rgba(255,255,255,0.02)",
                border: selectedTruck?.id === t.id ? "1px solid rgba(249,115,22,0.3)" : "1px solid transparent",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { if (selectedTruck?.id !== t.id) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { if (selectedTruck?.id !== t.id) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ fontSize: 32 }}>{t.img}</div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{t.cuisine}</div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 4 }}>🕐 {t.schedule}</div>
                  </div>
                </div>
                <Badge color={t.status === "active" ? "#22c55e" : "#6b7280"}>
                  {t.status === "active" ? "LIVE" : "OFF"}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Map Area */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
          minHeight: 560,
        }}>
          {/* Simulated Map */}
          <div style={{
            width: "100%",
            height: "100%",
            background: `
              radial-gradient(circle at 30% 40%, rgba(249,115,22,0.08) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(59,130,246,0.06) 0%, transparent 50%),
              linear-gradient(180deg, #1a1d23 0%, #12141a 100%)
            `,
            position: "relative",
            padding: 32,
          }}>
            {/* Grid lines */}
            <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, opacity: 0.06 }}>
              {[...Array(20)].map((_, i) => (
                <line key={`h${i}`} x1="0" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke="white" strokeWidth="0.5" />
              ))}
              {[...Array(20)].map((_, i) => (
                <line key={`v${i}`} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke="white" strokeWidth="0.5" />
              ))}
            </svg>

            {/* RVA Label */}
            <div style={{ position: "absolute", top: 20, left: 24, zIndex: 2 }}>
              <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.15em" }}>RICHMOND, VIRGINIA</div>
              <div style={{ color: "rgba(255,255,255,0.1)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>37.5407° N, 77.4360° W</div>
            </div>

            {/* Truck Pins */}
            {filtered.map((t, i) => {
              const x = 15 + ((t.lng + 77.5) * 800) % 70;
              const y = 15 + ((t.lat - 37.5) * 600) % 60;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTruck(t)}
                  style={{
                    position: "absolute",
                    left: `${x}%`,
                    top: `${y + 10}%`,
                    transform: "translate(-50%, -50%)",
                    cursor: "pointer",
                    zIndex: selectedTruck?.id === t.id ? 10 : 1,
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Pulse ring for active */}
                  {t.status === "active" && (
                    <div style={{
                      position: "absolute",
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      border: "2px solid #f97316",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      opacity: 0.3,
                      animation: "pulse 2s infinite",
                    }} />
                  )}
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: selectedTruck?.id === t.id ? "#f97316" : t.status === "active" ? "rgba(249,115,22,0.8)" : "rgba(107,114,128,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    boxShadow: selectedTruck?.id === t.id ? "0 0 24px rgba(249,115,22,0.5)" : "0 4px 12px rgba(0,0,0,0.4)",
                    border: selectedTruck?.id === t.id ? "2px solid #fff" : "2px solid rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease",
                  }}>
                    {t.img}
                  </div>
                  {selectedTruck?.id === t.id && (
                    <div style={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      marginTop: 8,
                      background: "#1e2028",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                      padding: "14px 18px",
                      minWidth: 200,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                      zIndex: 20,
                    }}>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                      <div style={{ color: "#f97316", fontSize: 12, marginTop: 2 }}>{t.cuisine}</div>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 6 }}>🕐 {t.schedule}</div>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>📞 {t.phone}</div>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>⭐ {t.rating} rating</div>
                      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                        <Button size="sm" variant={t.status === "active" ? "danger" : "success"} onClick={(e) => { e.stopPropagation(); dispatch({ type: "TOGGLE_TRUCK", payload: t.id }); }}>
                          {t.status === "active" ? "Set Offline" : "Set Active"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Legend */}
            <div style={{ position: "absolute", bottom: 20, right: 24, display: "flex", gap: 16, zIndex: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f97316" }} />
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Active</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#6b7280" }} />
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Offline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Events View ────────────────────────────────────────────────────────────
function EventsView({ state, dispatch }) {
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "", location: "", trucks: "", description: "", status: "planning" });

  const handleAdd = () => {
    if (newEvent.title && newEvent.date) {
      dispatch({ type: "ADD_EVENT", payload: { ...newEvent, trucks: parseInt(newEvent.trucks) || 0 } });
      setNewEvent({ title: "", date: "", time: "", location: "", trucks: "", description: "", status: "planning" });
      setShowForm(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: 0, fontFamily: "'Syne', sans-serif" }}>Events</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", margin: "6px 0 0", fontSize: 14 }}>Schedule and manage food truck events</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "➕ New Event"}</Button>
      </div>

      {showForm && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 16, padding: 28, marginBottom: 24 }}>
          <h3 style={{ margin: "0 0 20px", color: "#fff", fontSize: 16, fontFamily: "'Syne', sans-serif" }}>Create New Event</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, display: "block", marginBottom: 4 }}>Event Name</label>
              <input style={inputStyle} placeholder="e.g., Food Truck Friday" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
            </div>
            <div>
              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, display: "block", marginBottom: 4 }}>Location</label>
              <input style={inputStyle} placeholder="e.g., Brown's Island" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} />
            </div>
            <div>
              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, display: "block", marginBottom: 4 }}>Date</label>
              <input style={inputStyle} type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
            </div>
            <div>
              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, display: "block", marginBottom: 4 }}>Time</label>
              <input style={inputStyle} placeholder="e.g., 11:00 AM - 8:00 PM" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} />
            </div>
            <div>
              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, display: "block", marginBottom: 4 }}># of Trucks</label>
              <input style={inputStyle} type="number" placeholder="e.g., 12" value={newEvent.trucks} onChange={e => setNewEvent({ ...newEvent, trucks: e.target.value })} />
            </div>
            <div>
              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, display: "block", marginBottom: 4 }}>Status</label>
              <select style={inputStyle} value={newEvent.status} onChange={e => setNewEvent({ ...newEvent, status: e.target.value })}>
                <option value="planning">Planning</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, display: "block", marginBottom: 4 }}>Description</label>
            <textarea style={{ ...inputStyle, height: 80, resize: "vertical" }} placeholder="Describe the event..." value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} />
          </div>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Create Event</Button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gap: 14 }}>
        {state.events.map(e => (
          <div key={e.id} style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            padding: "20px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={ev => { ev.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
          onMouseLeave={ev => { ev.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
          >
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: e.status === "upcoming" ? "rgba(249,115,22,0.15)" : "rgba(139,92,246,0.15)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <div style={{ color: e.status === "upcoming" ? "#f97316" : "#8b5cf6", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                  {new Date(e.date).toLocaleDateString("en-US", { month: "short" })}
                </div>
                <div style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>
                  {new Date(e.date).getDate()}
                </div>
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{e.title}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 2 }}>📍 {e.location} · 🕐 {e.time} · 🚚 {e.trucks} trucks</div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 4 }}>{e.description}</div>
              </div>
            </div>
            <Badge color={e.status === "upcoming" ? "#f97316" : "#8b5cf6"}>
              {e.status.toUpperCase()}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Members View ───────────────────────────────────────────────────────────
function MembersView({ state, dispatch }) {
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: 0, fontFamily: "'Syne', sans-serif" }}>Members</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", margin: "6px 0 0", fontSize: 14 }}>Manage membership requests and auto-welcome settings</p>
      </div>

      {/* Pending Members */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, color: "#fff", fontFamily: "'Syne', sans-serif" }}>
          Pending Requests <Badge color="#f97316">{state.members.filter(m => m.status === "pending").length}</Badge>
        </h3>
        {state.members.filter(m => m.status === "pending").map(m => (
          <div key={m.id} style={{
            padding: 20,
            background: "rgba(255,255,255,0.02)",
            borderRadius: 12,
            marginBottom: 10,
            border: "1px solid rgba(255,255,255,0.04)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${m.type === "truck_owner" ? "#f97316" : "#3b82f6"}, ${m.type === "truck_owner" ? "#f59e0b" : "#8b5cf6"})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 16,
                  }}>
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{m.name}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 2 }}>
                      <Badge color={m.type === "truck_owner" ? "#f97316" : "#3b82f6"}>
                        {m.type === "truck_owner" ? "🚚 Truck Owner" : "🍽️ Food Lover"}
                      </Badge>
                      <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>Joined {m.joined}</span>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 12, paddingLeft: 50 }}>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Responses</div>
                  {m.questions.map((q, i) => (
                    <div key={i} style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, padding: "4px 0" }}>"{q}"</div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button variant="success" size="sm" onClick={() => dispatch({ type: "APPROVE_MEMBER", payload: m.id })}>✓ Approve</Button>
                <Button variant="danger" size="sm" onClick={() => dispatch({ type: "REJECT_MEMBER", payload: m.id })}>✕ Decline</Button>
              </div>
            </div>
          </div>
        ))}
        {state.members.filter(m => m.status === "pending").length === 0 && (
          <div style={{ textAlign: "center", padding: 32, color: "rgba(255,255,255,0.3)" }}>No pending requests</div>
        )}
      </div>

      {/* Welcome Message Templates */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, color: "#fff", fontFamily: "'Syne', sans-serif" }}>🤖 Auto-Welcome Templates</h3>
        {state.welcomeTemplates.map(w => (
          <div key={w.id} style={{
            padding: 20,
            background: "rgba(255,255,255,0.02)",
            borderRadius: 12,
            marginBottom: 10,
            border: "1px solid rgba(255,255,255,0.04)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ color: "#fff", fontWeight: 600 }}>{w.name}</div>
                <Badge color={w.active ? "#22c55e" : "#6b7280"}>{w.active ? "ACTIVE" : "OFF"}</Badge>
              </div>
              <Button size="sm" variant="secondary" onClick={() => dispatch({ type: "UPDATE_WELCOME", payload: { ...w, active: !w.active } })}>
                {w.active ? "Disable" : "Enable"}
              </Button>
            </div>
            <pre style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace",
              background: "rgba(0,0,0,0.2)",
              padding: 16,
              borderRadius: 10,
              whiteSpace: "pre-wrap",
              margin: 0,
              lineHeight: 1.6,
            }}>{w.message}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Moderation View ────────────────────────────────────────────────────────
function ModerationView({ state, dispatch }) {
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: 0, fontFamily: "'Syne', sans-serif" }}>Moderation</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", margin: "6px 0 0", fontSize: 14 }}>AI-powered spam detection and content moderation</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard icon="🛡️" label="Flagged Items" value={state.spam.length} accent="#ef4444" />
        <StatCard icon="🗑️" label="Removed This Month" value={ANALYTICS.moderation.removed} accent="#f97316" />
        <StatCard icon="⚡" label="Avg Response Time" value={ANALYTICS.moderation.avgResponseTime} accent="#22c55e" />
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 16, color: "#fff", fontFamily: "'Syne', sans-serif" }}>Flagged Content</h3>
        {state.spam.map(s => (
          <div key={s.id} style={{
            padding: 20,
            background: s.confidence > 50 ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.02)",
            borderRadius: 12,
            marginBottom: 12,
            border: `1px solid ${s.confidence > 50 ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)"}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{s.author}</span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{s.timestamp}</span>
                </div>
                <div style={{
                  padding: "12px 16px",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: 10,
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 13,
                  lineHeight: 1.5,
                  marginBottom: 10,
                }}>{s.content}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{
                      width: 80,
                      height: 6,
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.1)",
                      overflow: "hidden",
                    }}>
                      <div style={{
                        width: `${s.confidence}%`,
                        height: "100%",
                        borderRadius: 3,
                        background: s.confidence > 70 ? "#ef4444" : s.confidence > 40 ? "#f59e0b" : "#22c55e",
                        transition: "width 0.5s ease",
                      }} />
                    </div>
                    <span style={{ color: s.confidence > 70 ? "#ef4444" : s.confidence > 40 ? "#f59e0b" : "#22c55e", fontSize: 12, fontWeight: 600 }}>
                      {s.confidence}%
                    </span>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{s.reason}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
                <Button size="sm" variant="success" onClick={() => dispatch({ type: "APPROVE_POST", payload: s.id })}>✓ Keep</Button>
                <Button size="sm" variant="danger" onClick={() => dispatch({ type: "REMOVE_SPAM", payload: s.id })}>🗑️ Remove</Button>
              </div>
            </div>
          </div>
        ))}
        {state.spam.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🛡️</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>All clear!</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>No flagged content to review</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Settings View ──────────────────────────────────────────────────────────
function SettingsView() {
  const [autoMod, setAutoMod] = useState(true);
  const [autoWelcome, setAutoWelcome] = useState(true);
  const [postApproval, setPostApproval] = useState(false);
  const [truckVerification, setTruckVerification] = useState(true);

  const Toggle = ({ on, onClick }) => (
    <div
      onClick={onClick}
      style={{
        width: 48,
        height: 26,
        borderRadius: 13,
        background: on ? "#f97316" : "rgba(255,255,255,0.15)",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.3s ease",
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "#fff",
        position: "absolute",
        top: 3,
        left: on ? 25 : 3,
        transition: "all 0.3s ease",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      }} />
    </div>
  );

  const SettingRow = ({ icon, title, desc, on, onClick }) => (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "18px 0",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
    }}>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 500, fontSize: 14 }}>{title}</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>{desc}</div>
        </div>
      </div>
      <Toggle on={on} onClick={onClick} />
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: 0, fontFamily: "'Syne', sans-serif" }}>Settings</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", margin: "6px 0 0", fontSize: 14 }}>Configure your group's automation and rules</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "8px 28px 20px" }}>
        <h3 style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace" }}>Automation</h3>
        <SettingRow icon="🛡️" title="AI Spam Detection" desc="Automatically flag suspicious posts using AI pattern matching" on={autoMod} onClick={() => setAutoMod(!autoMod)} />
        <SettingRow icon="👋" title="Auto-Welcome Messages" desc="Send personalized welcome messages to new approved members" on={autoWelcome} onClick={() => setAutoWelcome(!autoWelcome)} />
        <SettingRow icon="✅" title="Post Pre-Approval" desc="Require admin approval before posts go live" on={postApproval} onClick={() => setPostApproval(!postApproval)} />
        <SettingRow icon="🚚" title="Truck Verification" desc="Verify food truck owners before granting vendor badges" on={truckVerification} onClick={() => setTruckVerification(!truckVerification)} />
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "8px 28px 20px", marginTop: 20 }}>
        <h3 style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace" }}>Group Rules</h3>
        {[
          "No spam, self-promotion, or off-topic posts without admin approval",
          "Food truck owners must verify their business before posting schedules",
          "Be respectful — constructive reviews only, no personal attacks",
          "No soliciting or MLM posts",
          "Tag your posts: [LOCATION], [EVENT], [REVIEW], [QUESTION]",
        ].map((rule, i) => (
          <div key={i} style={{
            display: "flex",
            gap: 12,
            alignItems: "start",
            padding: "12px 0",
            borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none",
          }}>
            <span style={{ color: "#f97316", fontWeight: 700, fontSize: 14, minWidth: 24 }}>#{i + 1}</span>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.5 }}>{rule}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(appReducer, {
    view: "dashboard",
    trucks: INITIAL_TRUCKS,
    events: INITIAL_EVENTS,
    members: INITIAL_MEMBERS,
    spam: SPAM_QUEUE,
    welcomeTemplates: WELCOME_TEMPLATES,
    modal: null,
  });

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const NAV = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "trucks", icon: "🚚", label: "Truck Tracker" },
    { id: "events", icon: "📅", label: "Events" },
    { id: "members", icon: "👥", label: "Members" },
    { id: "moderation", icon: "🛡️", label: "Moderation" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  const pendingCount = state.members.filter(m => m.status === "pending").length + state.spam.filter(s => s.confidence > 50).length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0c0d11",
      color: "#fff",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }

        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

        select option { background: #1a1d23; color: #fff; }
      `}</style>

      {/* Sidebar */}
      <div style={{
        width: 260,
        background: "rgba(255,255,255,0.02)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: "0 8px", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "linear-gradient(135deg, #f97316, #f59e0b)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              boxShadow: "0 4px 16px rgba(249,115,22,0.3)",
            }}>🚚</div>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: "#fff", lineHeight: 1.1 }}>FAFT</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace" }}>RVA ADMIN</div>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1 }}>
          {NAV.map((item, i) => (
            <div
              key={item.id}
              onClick={() => dispatch({ type: "SET_VIEW", payload: item.id })}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 12,
                marginBottom: 4,
                cursor: "pointer",
                background: state.view === item.id ? "rgba(249,115,22,0.12)" : "transparent",
                color: state.view === item.id ? "#f97316" : "rgba(255,255,255,0.5)",
                transition: "all 0.2s ease",
                position: "relative",
                animation: `slideIn 0.3s ease ${i * 0.05}s both`,
              }}
              onMouseEnter={e => { if (state.view !== item.id) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { if (state.view !== item.id) e.currentTarget.style.background = "transparent"; }}
            >
              {state.view === item.id && (
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 3,
                  height: 20,
                  borderRadius: 2,
                  background: "#f97316",
                }} />
              )}
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 14, fontWeight: state.view === item.id ? 600 : 400 }}>{item.label}</span>
              {item.id === "moderation" && state.spam.length > 0 && (
                <span style={{
                  marginLeft: "auto",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#ef4444",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>{state.spam.length}</span>
              )}
              {item.id === "members" && state.members.filter(m => m.status === "pending").length > 0 && (
                <span style={{
                  marginLeft: "auto",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#f97316",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>{state.members.filter(m => m.status === "pending").length}</span>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Status */}
        <div style={{
          padding: "16px 14px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          marginTop: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#f59e0b",
              boxShadow: "0 0 8px rgba(245,158,11,0.5)",
            }} />
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Group Paused</span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}>
            {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "32px 40px", overflowY: "auto", maxHeight: "100vh" }}>
        {state.view === "dashboard" && <DashboardView state={state} dispatch={dispatch} />}
        {state.view === "trucks" && <TruckMapView state={state} dispatch={dispatch} />}
        {state.view === "events" && <EventsView state={state} dispatch={dispatch} />}
        {state.view === "members" && <MembersView state={state} dispatch={dispatch} />}
        {state.view === "moderation" && <ModerationView state={state} dispatch={dispatch} />}
        {state.view === "settings" && <SettingsView />}
      </div>
    </div>
  );
}
