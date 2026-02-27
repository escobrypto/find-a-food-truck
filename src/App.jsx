import { useState, useEffect, useReducer, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// FIND A FOOD TRUCK RVA — v4.0 Total Redesign
// "Richmond Street Culture" — Editorial × Street Food Energy
// ═══════════════════════════════════════════════════════════════════════════

const ADMIN_PW="FAFT2026!admin",SEC_PIN="7743",MEMBER_PW="truck2026";

// ─── Data ────────────────────────────────────────────────────────────────
const TRUCKS=[
  {id:"ft1",name:"Curbside Creations",cuisine:"Southern Fusion",owner:"Chef Marcus",status:"active",schedule:"Mon–Fri 11a–3p",phone:"(804) 555-0101",rating:4.8,reviews:234,img:"🚚",plan:"premium",verified:true,desc:"Award-winning Southern fusion with a modern twist. Three-time RVA Food Truck of the Year.",specialties:["Brisket Tacos","Bourbon Cobbler","Cajun Mac","Sweet Tea Chicken"],price:"$$",bookings:12,revenue:4200,lat:37.5407,lng:-77.436,location:"Shockoe Bottom",distance:0.8,hours:"11a–3p",menu:[{name:"Brisket Tacos",price:14,desc:"12-hr smoked brisket, pickled onion, chipotle slaw"},{name:"Cajun Mac & Cheese",price:10,desc:"Five cheese blend, andouille sausage, breadcrumb crust"},{name:"Sweet Tea Chicken",price:12,desc:"Brined & fried, honey butter, house pickles"},{name:"Bourbon Cobbler",price:8,desc:"Seasonal peaches, brown butter crumble, vanilla cream"}]},
  {id:"ft2",name:"RVA Taco Co.",cuisine:"Mexican Street Food",owner:"Maria Santos",status:"active",schedule:"Tue–Sat 11a–9p",phone:"(804) 555-0202",rating:4.6,reviews:189,img:"🌮",plan:"premium",verified:true,desc:"Authentic family recipes passed down three generations. The real deal.",specialties:["Al Pastor Tacos","Street Elote","Churros","Horchata"],price:"$",bookings:8,revenue:3100,lat:37.5536,lng:-77.4508,location:"The Fan",distance:1.2,hours:"11a–9p",menu:[{name:"Al Pastor Tacos (3)",price:12,desc:"Marinated pork, pineapple, onion, cilantro"},{name:"Street Elote",price:6,desc:"Grilled corn, mayo, cotija, tajín, lime"},{name:"Churros",price:5,desc:"Fresh fried, cinnamon sugar, chocolate dip"},{name:"Horchata",price:4,desc:"House-made rice milk, cinnamon, vanilla"}]},
  {id:"ft3",name:"Smoke & Barrel BBQ",cuisine:"BBQ & Smoked Meats",owner:"Big Mike",status:"inactive",schedule:"Wed–Sun 12p–8p",phone:"(804) 555-0303",rating:4.9,reviews:312,img:"🔥",plan:"premium",verified:true,desc:"14-hour smoked brisket. Competition-winning ribs. The real BBQ experience.",specialties:["14-Hr Brisket","Competition Ribs","Smoked Mac","Banana Pudding"],price:"$$",bookings:15,revenue:5600,lat:37.5313,lng:-77.4764,location:"Scott's Addition",distance:2.1,hours:"Opens Wed",menu:[{name:"Brisket Plate",price:18,desc:"14-hour oak-smoked, two sides, Texas toast"},{name:"Competition Ribs",price:16,desc:"St. Louis cut, dry rub, cherry glaze"},{name:"Smoked Mac",price:8,desc:"Gouda, cheddar, smoked paprika crust"},{name:"Banana Pudding",price:6,desc:"Grandma's recipe, 'nilla wafers, fresh banana"}]},
  {id:"ft4",name:"The Waffle Wagon",cuisine:"Breakfast & Brunch",owner:"Jenny Park",status:"active",schedule:"Daily 7a–2p",phone:"(804) 555-0404",rating:4.7,reviews:156,img:"🧇",plan:"free",verified:false,desc:"Sweet and savory waffles made fresh every morning. Weekend brunch favorite.",specialties:["Chicken & Waffles","Berry Bliss","Savory Herb"],price:"$",bookings:3,revenue:0,lat:37.557,lng:-77.467,location:"Carytown",distance:2.8,hours:"7a–2p",menu:[{name:"Chicken & Waffles",price:14,desc:"Buttermilk fried chicken, Belgian waffle, maple hot sauce"},{name:"Berry Bliss Waffle",price:10,desc:"Mixed berries, whipped cream, powdered sugar"},{name:"Savory Herb & Cheese",price:11,desc:"Gruyère, fresh herbs, sunny egg, arugula"}]},
  {id:"ft5",name:"Pho on Wheels",cuisine:"Vietnamese",owner:"James Chen",status:"active",schedule:"Mon–Sat 11a–8p",phone:"(804) 555-0505",rating:4.5,reviews:98,img:"🍜",plan:"premium",verified:true,desc:"Authentic Vietnamese street food. 24-hour bone broth. Fresh daily.",specialties:["24-Hr Pho","Banh Mi","Summer Rolls","Viet Coffee"],price:"$",bookings:6,revenue:2800,lat:37.548,lng:-77.442,location:"Church Hill",distance:1.5,hours:"11a–8p",menu:[{name:"Pho Tai",price:14,desc:"24-hour bone broth, rare steak, fresh herbs, rice noodles"},{name:"Banh Mi",price:10,desc:"Crispy baguette, pâté, pickled daikon, cilantro, jalapeño"},{name:"Summer Rolls",price:8,desc:"Shrimp, vermicelli, herbs, peanut dipping sauce"},{name:"Viet Iced Coffee",price:5,desc:"Dark roast, sweetened condensed milk, slow drip"}]},
  {id:"ft6",name:"Wild Bill's Soda Bar",cuisine:"Beverages & Treats",owner:"Bill Williams",status:"active",schedule:"Thu–Sun 10a–6p",phone:"(804) 555-0606",rating:4.4,reviews:67,img:"🥤",plan:"premium",verified:true,desc:"Old-fashioned craft sodas and frozen treats. Official VA250 partner.",specialties:["Root Beer Float","Craft Lemonade","Frozen Custard","Ginger Beer"],price:"$",bookings:4,revenue:1900,lat:37.539,lng:-77.433,location:"Monroe Park",distance:0.5,hours:"10a–6p",menu:[{name:"Root Beer Float",price:7,desc:"House-brewed root beer, vanilla bean custard"},{name:"Craft Lemonade",price:5,desc:"Fresh squeezed, lavender or strawberry basil"},{name:"Frozen Custard",price:6,desc:"Daily rotating flavors, waffle cone"},{name:"Ginger Beer",price:5,desc:"Spicy house-brewed, fresh ginger, lime"}]},
  {id:"ft7",name:"Naan Stop",cuisine:"Indian Street Food",owner:"Priya Sharma",status:"active",schedule:"Tue–Sun 11a–9p",phone:"(804) 555-0707",rating:4.8,reviews:145,img:"🫓",plan:"free",verified:false,desc:"Fresh naan wraps and curry bowls. Bold flavors, fast service.",specialties:["Butter Chicken Wrap","Tikka Bowl","Mango Lassi","Samosa Chaat"],price:"$",bookings:2,revenue:0,lat:37.545,lng:-77.455,location:"VCU Area",distance:0.9,hours:"11a–9p",menu:[{name:"Butter Chicken Wrap",price:12,desc:"Tandoori chicken, butter sauce, fresh naan, onion, cilantro"},{name:"Tikka Masala Bowl",price:13,desc:"Basmati rice, tikka masala, raita, naan chips"},{name:"Samosa Chaat",price:8,desc:"Crushed samosa, chickpeas, tamarind, yogurt, sev"},{name:"Mango Lassi",price:5,desc:"Fresh mango, yogurt, cardamom, saffron"}]},
  {id:"ft8",name:"Seoul Food Truck",cuisine:"Korean Fusion",owner:"Danny Kim",status:"active",schedule:"Mon–Sat 11a–8p",phone:"(804) 555-0808",rating:4.7,reviews:178,img:"🍱",plan:"premium",verified:true,desc:"Korean BBQ meets Southern comfort. Kimchi everything.",specialties:["BBQ Tacos","Bulgogi Bowl","KFC Bites","Kimchi Fries"],price:"$$",bookings:9,revenue:3400,lat:37.551,lng:-77.449,location:"Jackson Ward",distance:1.0,hours:"11a–8p",menu:[{name:"Korean BBQ Tacos",price:13,desc:"Bulgogi beef, kimchi slaw, gochujang aioli, sesame"},{name:"Bulgogi Bowl",price:14,desc:"Marinated beef, rice, pickled veg, fried egg, gochujang"},{name:"KFC Bites",price:11,desc:"Double-fried chicken, sweet chili glaze, pickled radish"},{name:"Kimchi Fries",price:9,desc:"Loaded fries, bulgogi, cheese sauce, kimchi, scallions"}]}
];
const EVENTS=[
  {id:"e1",title:"VA250 Food Truck Festival",date:"2026-03-15",time:"11AM–8PM",location:"Brown's Island",host:"Richmond Tourism Board",maxTrucks:15,status:"upcoming",fee:75,desc:"Virginia's 250th anniversary celebration with the best food trucks in RVA. Live music, family activities, and incredible food.",attendees:890,apps:[{tid:"ft1",s:"approved"},{tid:"ft2",s:"approved"},{tid:"ft3",s:"pending"},{tid:"ft5",s:"approved"},{tid:"ft8",s:"approved"}],tags:["festival","family","live-music","va250"],featured:true,img:"🎪"},
  {id:"e2",title:"Carytown Food Truck Rally",date:"2026-03-22",time:"12PM–6PM",location:"Carytown",host:"Carytown Merchants",maxTrucks:10,status:"upcoming",fee:50,desc:"Monthly rally in the heart of Carytown. Rotating lineups, artisan vendors, live entertainment.",attendees:450,apps:[{tid:"ft1",s:"pending"},{tid:"ft4",s:"approved"},{tid:"ft7",s:"pending"}],tags:["monthly","family","shopping"],featured:false,img:"🎶"},
  {id:"e3",title:"Scott's Addition Night Market",date:"2026-04-05",time:"5PM–10PM",location:"Scott's Addition",host:"SA Business Alliance",maxTrucks:20,status:"planning",fee:100,desc:"Evening market with craft breweries, food trucks, and live DJs.",attendees:0,apps:[],tags:["night-market","craft-beer","dj"],featured:true,img:"🌙"},
  {id:"e4",title:"RVA Brunch Bash",date:"2026-04-12",time:"9AM–2PM",location:"Diamond District",host:"RVA Foodies",maxTrucks:8,status:"planning",fee:40,desc:"Bottomless mimosa stations meet the best brunch trucks in Richmond.",attendees:0,apps:[],tags:["brunch","mimosas","weekend"],featured:false,img:"🥂"},
  {id:"e5",title:"Corporate Wellness Fair",date:"2026-04-20",time:"11AM–2PM",location:"Capital One HQ",host:"Capital One",maxTrucks:6,status:"upcoming",fee:0,desc:"Private corporate wellness event. Healthy food options preferred.",attendees:300,apps:[{tid:"ft5",s:"approved"},{tid:"ft7",s:"pending"}],tags:["corporate","private"],featured:false,img:"🏢"},
];
const BOOKINGS=[
  {id:"b1",type:"private",who:"Jennifer Adams",email:"jen@email.com",phone:"(804) 555-1001",date:"2026-03-28",time:"4–8PM",location:"West End residence",guests:50,budget:"$500–$800",eventType:"Graduation Party",cuisine:"BBQ, Mexican",notes:"Need 2 trucks for outdoor graduation.",status:"open",responses:[{tid:"ft1",price:650,msg:"We'd love to cater!"},{tid:"ft3",price:700,msg:"Full BBQ spread available."}],created:"2026-02-18"},
  {id:"b2",type:"corporate",who:"Tom Bradley",email:"tom@techstartup.io",phone:"(804) 555-1002",date:"2026-04-02",time:"11:30A–1:30P",location:"1001 E Broad St",guests:120,budget:"$1,000–$1,500",eventType:"Team Lunch",cuisine:"Any",notes:"Monthly team lunch, prefer 2-3 diverse trucks.",status:"open",responses:[],created:"2026-02-20"},
  {id:"b3",type:"wedding",who:"Amanda & Chris",email:"amanda@email.com",phone:"(804) 555-1003",date:"2026-05-16",time:"6–10PM",location:"Maymont Gardens",guests:150,budget:"$2,000–$3,000",eventType:"Wedding Reception",cuisine:"Southern, Dessert",notes:"Need 3 trucks with cohesive look.",status:"open",responses:[{tid:"ft1",price:1200,msg:"We specialize in wedding catering."}],created:"2026-02-15"},
];
const PENDING=[{id:"pm1",name:"Sarah's Sweet Treats",type:"truck",applied:"2026-02-19"},{id:"pm2",name:"RVA Brewery Tour Co.",type:"host",applied:"2026-02-18"},{id:"pm3",name:"Mike Thompson",type:"customer",applied:"2026-02-20"}];
const SPAM_Q=[{id:"s1",author:"CryptoKing99",content:"🚀 Make $5000/day trading crypto! DM me!! 💰",time:"2h ago",conf:98,reason:"Financial spam"},{id:"s2",author:"BestDeals2026",content:"Check out www.totallylegit-deals.biz — 90% OFF!",time:"5h ago",conf:95,reason:"Suspicious URL"}];
const FLAGGED=[
  {id:"f1",author:"CryptoKing99",trust:0,content:"🚀 Make $5000/day trading crypto! DM me now!! 💰",ts:"12 min ago",threats:[{type:"Spam",conf:98}],ip:"192.168.1.47",device:"Android",age:"2 hours",posts:1},
  {id:"f2",author:"MLMQueen",trust:0,content:"Hey mamas! 💕 PASSIVE INCOME! Network marketing 💯!",ts:"3h ago",threats:[{type:"Spam",conf:99}],ip:"10.0.1.15",device:"iPhone",age:"1 hour",posts:1},
];
const INTEL=[
  {id:"m1",name:"CryptoKing99",risk:96,loc:"VPN — Netherlands",posts:1,signals:["VPN detected","Account < 24hrs","First post is spam"]},
  {id:"m2",name:"MLMQueen",risk:94,loc:"Richmond, VA",posts:1,signals:["Account < 24hrs","MLM keywords: HIGH","Mass-join pattern"]},
];
const AUDIT=[
  {id:"a1",ts:"Feb 23, 10:26a",act:"auto_flag",target:"CryptoKing99",detail:"Post auto-flagged: spam 98%",actor:"System"},
  {id:"a2",ts:"Feb 23, 9:45a",act:"raid_detected",target:"5 accounts",detail:"Mass join alert triggered",actor:"System"},
  {id:"a3",ts:"Feb 22, 11:00a",act:"trust_up",target:"ChefMarcus",detail:"Promoted: Member → Verified",actor:"Admin"},
  {id:"a4",ts:"Feb 21, 9:15a",act:"ban",target:"SpamBot_42",detail:"Permanent ban issued",actor:"Admin"},
];
const TRUST_LEVELS=[{lv:0,name:"New",color:"#888",icon:"●"},{lv:1,name:"Member",color:"#3b82f6",icon:"◆"},{lv:2,name:"Verified",color:"#22c55e",icon:"✓"},{lv:3,name:"Trusted",color:"#f59e0b",icon:"★"},{lv:4,name:"Mod",color:"#a855f7",icon:"🛡"},{lv:5,name:"Admin",color:"#ef4444",icon:"👑"}];


// ─── Styles ──────────────────────────────────────────────────────────────
const G=`
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=General+Sans:wght@300;400;500;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');
:root{
  --bg:#FAF6F1;--card:#FFFFFF;--ink:#1A1613;--sub:#8C857C;--mute:#B5AFA7;
  --line:#E8E3DC;--tint:#F3EDE6;--warm:#FFF8F0;
  --red:#E54D2E;--redL:#FFF0ED;--redD:#C4391A;
  --grn:#2D8C3C;--blu:#2B6CB0;--amb:#C77D15;--pur:#7C3AED;
  --adm-bg:#0B0C0F;--adm-s:rgba(255,255,255,0.035);--adm-b:rgba(255,255,255,0.07);--adm-t:rgba(255,255,255,0.5);--adm-d:rgba(255,255,255,0.25);
  --sans:'General Sans',system-ui,sans-serif;
  --serif:'Instrument Serif',Georgia,serif;
  --body:'Crimson Pro',Georgia,serif;
  --mono:'Space Mono',monospace;
  --ease:cubic-bezier(.4,0,.2,1);--spring:cubic-bezier(.175,.885,.32,1.275);
}
*{box-sizing:border-box;margin:0;padding:0}
body{-webkit-font-smoothing:antialiased;overflow-x:hidden}
::selection{background:var(--redL);color:var(--red)}
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--line);border-radius:99px}
button{cursor:pointer;border:none;background:none;font-family:inherit;color:inherit}
button:active{transform:scale(.98)}
input,textarea,select{font-family:var(--sans);outline:none}
input:focus,textarea:focus{border-color:var(--red) !important}
a{text-decoration:none;color:inherit}

@keyframes up{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideR{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleUp{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes wipe{from{width:0}to{width:100%}}

.au{animation:up .7s var(--ease) both}.af{animation:fadeIn .5s ease both}
.asr{animation:slideR .6s var(--ease) both}.asc{animation:scaleUp .5s var(--spring) both}
.d1{animation-delay:.08s}.d2{animation-delay:.16s}.d3{animation-delay:.24s}
.d4{animation-delay:.32s}.d5{animation-delay:.4s}.d6{animation-delay:.48s}

.lift{transition:transform .4s var(--ease),box-shadow .4s var(--ease)}
.lift:hover{transform:translateY(-5px);box-shadow:0 24px 48px -12px rgba(0,0,0,.08)}
.pop{transition:transform .25s var(--spring)}.pop:hover{transform:scale(1.03)}

.grain{position:fixed;inset:0;pointer-events:none;opacity:.015;z-index:9999;
  background:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.ticker-wrap{overflow:hidden;position:relative}.ticker-track{display:flex;animation:ticker 35s linear infinite;white-space:nowrap}.ticker-track:hover{animation-play-state:paused}

@media(max-width:860px){
  .hero-split{grid-template-columns:1fr !important;text-align:center}
  .hero-right{display:none !important}
  .hero-stats{justify-content:center !important}
  .hero-cta{justify-content:center !important}
  .g2{grid-template-columns:1fr !important}
  .g3{grid-template-columns:1fr !important}
  .g4{grid-template-columns:1fr 1fr !important}
  .foot-grid{grid-template-columns:1fr !important;gap:32px !important;text-align:center}
  .nav-links{display:none !important}
  .detail-split{grid-template-columns:1fr !important}
  .form-2col{grid-template-columns:1fr !important}
  .side-nav{display:none !important}
}
`;

// ─── Router + Reducer ────────────────────────────────────────────────────
function useRouter(){
  const[r,setR]=useState(window.location.hash.slice(1)||"/");
  useEffect(()=>{const h=()=>{setR(window.location.hash.slice(1)||"/");window.scrollTo({top:0})};window.addEventListener("hashchange",h);return()=>window.removeEventListener("hashchange",h)},[]);
  return{route:r,go:p=>window.location.hash=p};
}
function reducer(s,a){switch(a.type){
  case"V":return{...s,view:a.p};case"AP":return{...s,pending:s.pending.filter(m=>m.id!==a.p)};
  case"RP":return{...s,pending:s.pending.filter(m=>m.id!==a.p)};case"RS":return{...s,spam:s.spam.filter(x=>x.id!==a.p)};
  case"KS":return{...s,spam:s.spam.filter(x=>x.id!==a.p)};case"RF":return{...s,flagged:s.flagged.filter(x=>x.id!==a.p)};
  default:return s;
}}


// ─── Shared UI ───────────────────────────────────────────────────────────
const Btn=({children,onClick,v="fill",sz="md",full,style:x,...p})=>{
  const styles={
    fill:{background:"var(--red)",color:"#fff",boxShadow:"0 2px 16px rgba(229,77,46,.18)"},
    outline:{background:"transparent",color:"var(--red)",border:"1.5px solid var(--red)"},
    dark:{background:"var(--ink)",color:"#fff"},
    soft:{background:"var(--tint)",color:"var(--ink)"},
    ghost:{background:"transparent",color:"var(--sub)"},
    white:{background:"#fff",color:"var(--ink)",boxShadow:"0 2px 12px rgba(0,0,0,.06)"},
  };
  const sizes={sm:{padding:"9px 20px",fontSize:13},md:{padding:"13px 30px",fontSize:14},lg:{padding:"17px 42px",fontSize:15}};
  return<button onClick={onClick} className="pop" style={{...sizes[sz],...styles[v],borderRadius:99,fontFamily:"var(--sans)",fontWeight:600,display:"inline-flex",alignItems:"center",gap:8,justifyContent:"center",width:full?"100%":"auto",letterSpacing:".01em",transition:"all .3s var(--ease)",border:styles[v].border||"none",...x}} {...p}>{children}</button>;
};

const Pill=({children,active,onClick,color})=><button onClick={onClick} style={{padding:"7px 18px",borderRadius:99,fontSize:12,fontWeight:active?600:400,fontFamily:"var(--sans)",background:active?(color||"var(--ink)"):"var(--card)",color:active?"#fff":"var(--sub)",border:`1px solid ${active?"transparent":"var(--line)"}`,transition:"all .25s var(--ease)",letterSpacing:".02em"}}>{children}</button>;

const Input=({label,value,onChange,placeholder,type="text",textarea,rows=3})=>(
  <div style={{marginBottom:20}}>
    {label&&<label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--ink)",marginBottom:7,fontFamily:"var(--sans)",letterSpacing:".04em",textTransform:"uppercase"}}>{label}</label>}
    {textarea
      ?<textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{width:"100%",padding:"13px 16px",borderRadius:12,border:"1.5px solid var(--line)",background:"var(--bg)",fontSize:15,fontFamily:"var(--body)",color:"var(--ink)",boxSizing:"border-box",resize:"vertical",transition:"border .3s",lineHeight:1.6}}/>
      :<input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{width:"100%",padding:"13px 16px",borderRadius:12,border:"1.5px solid var(--line)",background:"var(--bg)",fontSize:15,fontFamily:"var(--body)",color:"var(--ink)",boxSizing:"border-box",transition:"border .3s"}}/>
    }
  </div>
);

// Admin shared
const ABadge=({children,color="var(--blu)"})=><span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 9px",borderRadius:99,fontSize:10,fontWeight:700,background:color+"15",color,border:`1px solid ${color}20`,fontFamily:"var(--sans)",letterSpacing:".03em"}}>{children}</span>;
const ABtn=({children,onClick,v="fill",s="sm"})=>{const st={fill:{background:"var(--red)",color:"#fff"},ok:{background:"rgba(45,140,60,.12)",color:"var(--grn)",border:"1px solid rgba(45,140,60,.15)"},bad:{background:"rgba(229,77,46,.1)",color:"var(--red)",border:"1px solid rgba(229,77,46,.12)"},crit:{background:"linear-gradient(135deg,#dc2626,#991b1b)",color:"#fff"},ghost:{color:"var(--adm-t)"}};const sz={sm:{padding:"6px 14px",fontSize:12},md:{padding:"9px 20px",fontSize:13}};return<button onClick={onClick} style={{...sz[s],...st[v],borderRadius:9,fontWeight:600,fontFamily:"var(--sans)",display:"inline-flex",alignItems:"center",gap:5,border:st[v].border||"none",transition:"all .2s"}}>{children}</button>};
const ACard=({children,style:x,onClick,p=22})=><div onClick={onClick} style={{background:"var(--adm-s)",border:"1px solid var(--adm-b)",borderRadius:14,padding:p,cursor:onClick?"pointer":"default",transition:"all .25s",...x}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.055)";e.currentTarget.style.borderColor="rgba(255,255,255,.12)"}} onMouseLeave={e=>{e.currentTarget.style.background="var(--adm-s)";e.currentTarget.style.borderColor="var(--adm-b)"}}>{children}</div>;
const StatC=({icon,label,value,accent="#fff"})=><ACard><div style={{position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-18,right:-6,fontSize:56,opacity:.04}}>{icon}</div><div style={{fontSize:10,color:"var(--adm-t)",letterSpacing:".1em",textTransform:"uppercase",fontFamily:"var(--mono)"}}>{label}</div><div style={{fontSize:30,fontWeight:700,color:accent,marginTop:7,fontFamily:"var(--sans)"}}>{value}</div></div></ACard>;
const Bar=({value,color="var(--red)",h=5})=><div style={{width:"100%",height:h,borderRadius:h,background:"rgba(255,255,255,.06)",overflow:"hidden"}}><div style={{width:`${Math.min(value,100)}%`,height:"100%",borderRadius:h,background:color,transition:"width .8s var(--ease)"}}/></div>;


// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC SITE
// ═══════════════════════════════════════════════════════════════════════════

function Nav({go,route}){
  const[sc,setSc]=useState(false);
  useEffect(()=>{const h=()=>setSc(window.scrollY>40);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
  const home=route==="/";const light=home&&!sc;
  const links=[{t:"/trucks",l:"Trucks"},{t:"/events",l:"Events"},{t:"/book",l:"Book"},{t:"/pricing",l:"Vendors"},{t:"/about",l:"About"}];
  return<nav style={{position:"fixed",top:0,left:0,right:0,zIndex:999,padding:sc?"10px 0":"16px 0",background:sc?"rgba(250,246,241,.92)":"transparent",backdropFilter:sc?"blur(24px) saturate(1.5)":"none",borderBottom:sc?"1px solid rgba(0,0,0,.04)":"none",transition:"all .5s var(--ease)"}}>
    <div style={{maxWidth:1240,margin:"0 auto",padding:"0 40px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div onClick={()=>go("/")} style={{cursor:"pointer",display:"flex",alignItems:"baseline",gap:2}}>
        <span style={{fontFamily:"var(--serif)",fontSize:24,fontWeight:400,color:light?"#fff":"var(--ink)",transition:"color .4s",fontStyle:"italic"}}>find a</span>
        <span style={{fontFamily:"var(--serif)",fontSize:24,fontWeight:400,color:"var(--red)",marginLeft:6}}>food truck</span>
      </div>
      <div className="nav-links" style={{display:"flex",alignItems:"center",gap:6}}>
        {links.map(l=><button key={l.t} onClick={()=>go(l.t)} style={{padding:"8px 16px",borderRadius:99,fontSize:13,fontWeight:route===l.t?600:400,fontFamily:"var(--sans)",color:route===l.t?"var(--red)":(light?"rgba(255,255,255,.7)":"var(--sub)"),background:route===l.t?(light?"rgba(255,255,255,.1)":"var(--redL)"):"transparent",transition:"all .3s"}}>{l.l}</button>)}
        <div style={{width:1,height:18,background:light?"rgba(255,255,255,.12)":"var(--line)",margin:"0 10px"}}/>
        <Btn sz="sm" onClick={()=>go("/member")}>Truck Login</Btn>
      </div>
    </div>
  </nav>;
}

function Hero({go}){
  return<section style={{background:"var(--ink)",minHeight:"100vh",position:"relative",overflow:"hidden",display:"flex",alignItems:"center"}}>
    {/* Ambient */}
    <div style={{position:"absolute",top:"-25%",right:"-8%",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(229,77,46,.08),transparent 60%)",filter:"blur(60px)"}}/>
    <div style={{position:"absolute",bottom:"-20%",left:"-5%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(199,125,21,.04),transparent 60%)",filter:"blur(50px)"}}/>
    <div style={{position:"absolute",inset:0,opacity:.02,backgroundImage:"repeating-linear-gradient(0deg,rgba(255,255,255,.08),rgba(255,255,255,.08) 1px,transparent 1px,transparent 80px),repeating-linear-gradient(90deg,rgba(255,255,255,.08),rgba(255,255,255,.08) 1px,transparent 1px,transparent 80px)"}}/>

    <div style={{maxWidth:1240,margin:"0 auto",padding:"160px 40px 100px",width:"100%"}}>
      <div className="hero-split" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
        {/* Left */}
        <div>
          <div className="au" style={{display:"inline-flex",alignItems:"center",gap:9,padding:"7px 18px",borderRadius:99,background:"rgba(229,77,46,.08)",border:"1px solid rgba(229,77,46,.12)",marginBottom:36}}>
            <div style={{width:6,height:6,borderRadius:99,background:"var(--red)",animation:"pulse 2.5s infinite"}}/>
            <span style={{color:"rgba(229,77,46,.85)",fontSize:11,fontWeight:600,letterSpacing:".14em",fontFamily:"var(--sans)"}}>RICHMOND, VIRGINIA</span>
          </div>
          <h1 className="au d1" style={{fontSize:76,fontWeight:400,color:"#FAFAF9",fontFamily:"var(--serif)",lineHeight:1.02,letterSpacing:"-.02em",margin:"0 0 28px"}}>
            Every great<br/>meal starts<br/><em style={{color:"var(--red)"}}>on wheels</em>
          </h1>
          <p className="au d2" style={{fontSize:19,color:"rgba(255,255,255,.35)",fontFamily:"var(--body)",lineHeight:1.85,maxWidth:440,margin:"0 0 44px",fontWeight:300}}>
            Discover Richmond's best food trucks. Browse menus, track locations, and book catering for your next event.
          </p>
          <div className="au d3 hero-cta" style={{display:"flex",gap:12}}>
            <Btn sz="lg" onClick={()=>go("/trucks")}>Explore trucks</Btn>
            <Btn v="ghost" sz="lg" onClick={()=>go("/pricing")} style={{color:"rgba(255,255,255,.4)",border:"1px solid rgba(255,255,255,.08)"}}>For vendors →</Btn>
          </div>
          <div className="au d4 hero-stats" style={{display:"flex",gap:56,marginTop:72}}>
            {[["4,100+","Members"],["50+","Trucks"],["12","Events/mo"]].map(([v,l],i)=>
              <div key={i}><div style={{fontSize:28,fontWeight:700,color:"#fff",fontFamily:"var(--sans)"}}>{v}</div><div style={{fontSize:11,color:"rgba(255,255,255,.2)",marginTop:5,fontFamily:"var(--mono)",letterSpacing:".06em"}}>{l}</div></div>
            )}
          </div>
        </div>
        {/* Right — editorial food grid */}
        <div className="hero-right au d3" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"1fr 1fr 1fr",gap:12,height:520}}>
          {[
            {t:TRUCKS[0],span:"1/2","r":"1/3",bg:"rgba(229,77,46,.06)",br:"24px 12px 12px 12px"},
            {t:TRUCKS[1],span:"2/3","r":"1/2",bg:"rgba(199,125,21,.05)",br:"12px 24px 12px 12px"},
            {t:TRUCKS[7],span:"2/3","r":"2/3",bg:"rgba(124,58,237,.04)",br:"12px 12px 24px 12px"},
            {t:TRUCKS[4],span:"1/3","r":"3/4",bg:"rgba(45,140,60,.04)",br:"12px 12px 12px 24px"},
          ].map(({t,span,r,bg,br},i)=>
            <div key={i} className="lift" onClick={()=>go("/trucks")} style={{gridColumn:span,gridRow:r,background:bg,border:"1px solid rgba(255,255,255,.04)",borderRadius:br,padding:22,cursor:"pointer",display:"flex",flexDirection:"column",justifyContent:"space-between",position:"relative",overflow:"hidden"}}>
              <div><div style={{fontSize:36,marginBottom:8}}>{t.img}</div><div style={{fontFamily:"var(--sans)",fontWeight:700,fontSize:14,color:"#fff"}}>{t.name}</div><div style={{fontFamily:"var(--sans)",fontSize:12,color:"rgba(255,255,255,.3)",marginTop:2}}>{t.cuisine}</div></div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:"#FBBF24",fontSize:12,fontWeight:700,fontFamily:"var(--sans)"}}>★ {t.rating}</span><span style={{color:"rgba(255,255,255,.15)",fontSize:11,fontFamily:"var(--mono)"}}>{t.reviews} rev</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
    <div style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:8,animation:"float 4s ease infinite"}}>
      <div style={{width:1,height:32,background:"linear-gradient(rgba(255,255,255,.2),transparent)"}}/>
    </div>
  </section>;
}

function Ticker(){
  const items=TRUCKS.map(t=>`${t.img} ${t.name}`);
  return<div className="ticker-wrap" style={{background:"var(--ink)",padding:"13px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
    <div className="ticker-track">
      {[...items,...items,...items].map((it,i)=><span key={i} style={{padding:"0 36px",color:"rgba(255,255,255,.25)",fontSize:12,fontFamily:"var(--mono)",letterSpacing:".04em",fontWeight:400}}>{it}</span>)}
    </div>
  </div>;
}


// ─── Truck Finder ────────────────────────────────────────────────────────
function TruckFinder({go}){
  const[q,setQ]=useState("");const[cuisine,setC]=useState("All");const[sort,setSort]=useState("rating");const[sel,setSel]=useState(null);const[open,setOpen]=useState(false);
  const cuisines=["All","Southern","Mexican","BBQ","Breakfast","Vietnamese","Beverages","Indian","Korean"];
  let list=TRUCKS.filter(t=>{
    if(q&&!t.name.toLowerCase().includes(q.toLowerCase())&&!t.cuisine.toLowerCase().includes(q.toLowerCase()))return false;
    if(cuisine!=="All"&&!t.cuisine.toLowerCase().includes(cuisine.toLowerCase()))return false;
    if(open&&t.status!=="active")return false;return true;
  });
  if(sort==="rating")list.sort((a,b)=>b.rating-a.rating);
  if(sort==="reviews")list.sort((a,b)=>b.reviews-a.reviews);
  if(sort==="nearest")list.sort((a,b)=>a.distance-b.distance);
  const det=TRUCKS.find(t=>t.id===sel);
  const SH=({children})=><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><div style={{width:3,height:28,borderRadius:3,background:"var(--red)"}}/>
    <h2 style={{fontSize:42,fontWeight:400,color:"var(--ink)",fontFamily:"var(--serif)"}}>{children}</h2></div>;

  return<section style={{minHeight:"100vh",background:"var(--bg)",padding:"120px 40px 80px"}}>
    <div style={{maxWidth:1240,margin:"0 auto"}}>
      <div className="au"><SH>Find a truck</SH><p style={{fontSize:16,color:"var(--sub)",fontFamily:"var(--body)",marginLeft:13,fontWeight:300}}>{TRUCKS.filter(t=>t.status==="active").length} trucks serving RVA right now</p></div>

      <div className="au d1" style={{display:"flex",gap:10,marginTop:32,marginBottom:16,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:200,position:"relative"}}>
          <span style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",fontSize:15,opacity:.3}}>⌕</span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search trucks..." style={{width:"100%",padding:"14px 14px 14px 44px",borderRadius:12,border:"1.5px solid var(--line)",background:"var(--card)",fontSize:14,fontFamily:"var(--sans)",color:"var(--ink)",boxSizing:"border-box"}}/>
        </div>
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:"14px 20px",borderRadius:12,border:"1.5px solid var(--line)",background:"var(--card)",fontSize:13,fontFamily:"var(--sans)",color:"var(--ink)",cursor:"pointer"}}>
          <option value="rating">Top rated</option><option value="reviews">Most reviewed</option><option value="nearest">Nearest</option>
        </select>
        <Pill active={open} onClick={()=>setOpen(!open)} color="var(--grn)">Open now</Pill>
      </div>

      <div className="au d2" style={{display:"flex",gap:6,marginBottom:28,flexWrap:"wrap"}}>
        {cuisines.map(c=><Pill key={c} active={cuisine===c} onClick={()=>setC(c)}>{c}</Pill>)}
      </div>

      <div className="detail-split" style={{display:"grid",gridTemplateColumns:sel?"1fr 420px":"1fr",gap:20}}>
        <div className="g2" style={{display:"grid",gridTemplateColumns:sel?"1fr":"repeat(2,1fr)",gap:12}}>
          {list.map((t,i)=><div key={t.id} className="lift" onClick={()=>setSel(t.id)}
            style={{background:"var(--card)",borderRadius:16,padding:22,cursor:"pointer",border:sel===t.id?"2px solid var(--red)":"1.5px solid var(--line)",position:"relative",overflow:"hidden"}}>
            {t.plan==="premium"&&<div style={{position:"absolute",top:12,right:12,background:"var(--warm)",color:"var(--amb)",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:99,fontFamily:"var(--sans)"}}>★ PRO</div>}
            <div style={{display:"flex",gap:16}}>
              <div style={{width:50,height:50,borderRadius:13,background:"var(--tint)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{t.img}</div>
              <div style={{fontFamily:"var(--sans)",flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontWeight:700,color:"var(--ink)",fontSize:15}}>{t.name}</span>{t.verified&&<span style={{color:"var(--red)",fontSize:12}}>✓</span>}</div>
                <div style={{color:"var(--sub)",fontSize:12,marginTop:2}}>{t.cuisine} · {t.price}</div>
                <div style={{display:"flex",gap:14,marginTop:12,alignItems:"center"}}>
                  <span style={{color:"var(--amb)",fontSize:13,fontWeight:700}}>★ {t.rating}</span>
                  <span style={{color:"var(--mute)",fontSize:12}}>{t.reviews} reviews</span>
                  <span style={{color:t.status==="active"?"var(--grn)":"var(--red)",fontSize:10,fontWeight:700,letterSpacing:".06em"}}>{t.status==="active"?"● OPEN":"● CLOSED"}</span>
                </div>
                <div style={{color:"var(--mute)",fontSize:11,marginTop:8,fontFamily:"var(--mono)"}}>{t.location} · {t.distance}mi</div>
              </div>
            </div>
          </div>)}
          {list.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:80}}><div style={{fontSize:48,opacity:.3,marginBottom:12}}>🔍</div><div style={{fontSize:18,fontWeight:600,color:"var(--ink)",fontFamily:"var(--sans)"}}>No trucks found</div></div>}
        </div>

        {sel&&det&&<div className="asr">
          <div style={{background:"var(--card)",borderRadius:20,border:"1.5px solid var(--line)",position:"sticky",top:100,overflow:"hidden",boxShadow:"0 24px 64px -16px rgba(0,0,0,.08)"}}>
            <div style={{background:"var(--ink)",padding:"36px 28px 28px",position:"relative"}}>
              <button onClick={()=>setSel(null)} style={{position:"absolute",top:14,right:16,color:"rgba(255,255,255,.3)",fontSize:16,width:30,height:30,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,.06)"}}>✕</button>
              <div style={{fontSize:44,marginBottom:12}}>{det.img}</div>
              <h3 style={{fontSize:26,color:"#fff",fontFamily:"var(--serif)",margin:"0 0 4px"}}>{det.name}</h3>
              <div style={{color:"rgba(255,255,255,.35)",fontSize:14,fontFamily:"var(--sans)"}}>{det.cuisine} · {det.owner}</div>
              <div style={{display:"flex",gap:28,marginTop:20}}>{[[det.rating,"★"],[det.reviews,"rev"],[`${det.distance}mi`,""]].map(([v,l],i)=><div key={i}><span style={{fontSize:22,fontWeight:700,color:"#fff",fontFamily:"var(--sans)"}}>{v}</span><span style={{color:"rgba(255,255,255,.25)",fontSize:11,marginLeft:5}}>{l}</span></div>)}</div>
            </div>
            <div style={{padding:28}}>
              <p style={{color:"var(--sub)",fontSize:15,lineHeight:1.75,marginBottom:24,fontFamily:"var(--body)",fontWeight:300}}>{det.desc}</p>
              <h4 style={{fontSize:10,fontWeight:700,color:"var(--ink)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:14,fontFamily:"var(--sans)"}}>MENU</h4>
              {det.menu?.map((m,i)=><div key={m.name} style={{display:"flex",justifyContent:"space-between",padding:"11px 0",borderBottom:i<det.menu.length-1?"1px solid var(--line)":"none"}}>
                <div><div style={{color:"var(--ink)",fontWeight:600,fontSize:14,fontFamily:"var(--sans)"}}>{m.name}</div><div style={{color:"var(--mute)",fontSize:12,marginTop:2,fontFamily:"var(--body)"}}>{m.desc}</div></div>
                <span style={{color:"var(--red)",fontWeight:700,fontSize:14,fontFamily:"var(--sans)",flexShrink:0,marginLeft:12}}>${m.price}</span>
              </div>)}
              <div style={{background:"var(--tint)",borderRadius:12,padding:14,marginTop:20,marginBottom:20,fontSize:13,color:"var(--sub)",fontFamily:"var(--sans)",lineHeight:2}}>📍 {det.location} · 🕐 {det.schedule} · 📞 {det.phone}</div>
              <Btn full onClick={()=>go("/book")}>Book for event</Btn>
            </div>
          </div>
        </div>}
      </div>
    </div>
  </section>;
}


// ─── Events ──────────────────────────────────────────────────────────────
function EventsPage({go}){
  const[sel,setSel]=useState(null);
  return<section style={{minHeight:"100vh",background:"var(--bg)",padding:"120px 40px 80px"}}>
    <div style={{maxWidth:1240,margin:"0 auto"}}>
      <div className="au" style={{marginBottom:44}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><div style={{width:3,height:28,borderRadius:3,background:"var(--red)"}}/>
          <h2 style={{fontSize:42,fontWeight:400,color:"var(--ink)",fontFamily:"var(--serif)"}}>Events</h2></div>
        <p style={{fontSize:16,color:"var(--sub)",fontFamily:"var(--body)",marginLeft:13,fontWeight:300}}>{EVENTS.length} upcoming food truck events</p>
      </div>
      {/* Featured */}
      <div className="au d1 g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:40}}>
        {EVENTS.filter(e=>e.featured).map(e=><div key={e.id} className="lift" onClick={()=>setSel(sel===e.id?null:e.id)} style={{cursor:"pointer",background:"var(--ink)",borderRadius:20,padding:36,color:"#fff",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:"-30%",right:"-15%",width:250,height:250,borderRadius:"50%",background:"radial-gradient(circle,rgba(229,77,46,.08),transparent)",filter:"blur(30px)"}}/>
          <div style={{position:"relative"}}>
            <span style={{background:"rgba(229,77,46,.1)",color:"var(--red)",fontSize:10,fontWeight:700,padding:"4px 12px",borderRadius:99,letterSpacing:".1em",fontFamily:"var(--sans)"}}>FEATURED</span>
            <div style={{fontSize:36,marginTop:16,marginBottom:12}}>{e.img}</div>
            <h3 style={{fontSize:24,fontFamily:"var(--serif)",margin:"0 0 10px"}}>{e.title}</h3>
            <p style={{color:"rgba(255,255,255,.35)",fontSize:14,lineHeight:1.6,fontFamily:"var(--body)",fontWeight:300,marginBottom:16}}>{e.desc}</p>
            <div style={{display:"flex",gap:18,color:"rgba(255,255,255,.3)",fontSize:12,fontFamily:"var(--sans)"}}>
              <span>📅 {new Date(e.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span><span>📍 {e.location}</span><span>🚚 {e.apps.filter(a=>a.s==="approved").length}/{e.maxTrucks}</span>
            </div>
          </div>
        </div>)}
      </div>
      {/* All */}
      <div style={{display:"grid",gap:10}}>
        {EVENTS.map(e=><div key={e.id} className="lift" onClick={()=>setSel(sel===e.id?null:e.id)} style={{background:"var(--card)",borderRadius:16,padding:22,cursor:"pointer",border:sel===e.id?"2px solid var(--red)":"1.5px solid var(--line)",fontFamily:"var(--sans)"}}>
          <div style={{display:"flex",gap:18,alignItems:"center"}}>
            <div style={{width:54,height:54,borderRadius:14,background:"var(--tint)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <div style={{color:"var(--red)",fontSize:9,fontWeight:700,letterSpacing:".08em"}}>{new Date(e.date).toLocaleDateString("en-US",{month:"short"}).toUpperCase()}</div>
              <div style={{color:"var(--ink)",fontSize:20,fontWeight:700}}>{new Date(e.date).getDate()}</div>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontWeight:700,color:"var(--ink)",fontSize:16}}>{e.title}</span>{e.featured&&<span style={{background:"var(--red)",color:"#fff",fontSize:9,padding:"2px 8px",borderRadius:99,fontWeight:700}}>HOT</span>}</div>
              <div style={{color:"var(--sub)",fontSize:13,marginTop:4}}>📍 {e.location} · {e.time} · {e.host}</div>
            </div>
            <div style={{textAlign:"right"}}><div style={{color:"var(--red)",fontWeight:700,fontSize:14}}>{e.fee>0?`$${e.fee}`:"FREE"}</div><div style={{color:"var(--mute)",fontSize:11,marginTop:3}}>🚚 {e.apps.filter(a=>a.s==="approved").length}/{e.maxTrucks}</div></div>
          </div>
          {sel===e.id&&<div style={{marginTop:18,paddingTop:18,borderTop:"1px solid var(--line)",animation:"fadeIn .3s ease"}}>
            <p style={{color:"var(--sub)",fontSize:15,lineHeight:1.7,marginBottom:14,fontFamily:"var(--body)",fontWeight:300}}>{e.desc}</p>
            <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>{e.tags.map(t=><span key={t} style={{padding:"4px 14px",borderRadius:99,background:"var(--tint)",color:"var(--sub)",fontSize:11,fontWeight:500}}>{t}</span>)}</div>
            {e.attendees>0&&<div style={{color:"var(--sub)",fontSize:13,marginBottom:12}}>👥 {e.attendees.toLocaleString()} expected</div>}
            <Btn sz="sm" onClick={ev=>{ev.stopPropagation();go("/book")}}>Apply as vendor →</Btn>
          </div>}
        </div>)}
      </div>
    </div>
  </section>;
}

// ─── Booking ─────────────────────────────────────────────────────────────
function BookingPage({go}){
  const[sent,setSent]=useState(false);const[form,setForm]=useState({name:"",email:"",phone:"",date:"",time:"",location:"",guests:"",budget:"",type:"private",cuisine:"",notes:""});
  const u=(k,v)=>setForm({...form,[k]:v});
  if(sent)return<section style={{minHeight:"100vh",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",padding:"120px 40px 80px"}}>
    <div className="asc" style={{textAlign:"center",maxWidth:440}}>
      <div style={{width:80,height:80,borderRadius:"50%",background:"var(--redL)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,margin:"0 auto 28px"}}>🎉</div>
      <h2 style={{fontSize:36,fontFamily:"var(--serif)",color:"var(--ink)",margin:"0 0 14px"}}>Request sent</h2>
      <p style={{color:"var(--sub)",fontSize:16,lineHeight:1.75,fontFamily:"var(--body)",fontWeight:300}}>Premium trucks are notified first. We'll connect you with the perfect vendors.</p>
      <Btn style={{marginTop:32}} onClick={()=>go("/trucks")}>Browse trucks</Btn>
    </div>
  </section>;

  return<section style={{minHeight:"100vh",background:"var(--bg)",padding:"120px 40px 80px"}}>
    <div style={{maxWidth:660,margin:"0 auto"}}>
      <div className="au" style={{marginBottom:36}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><div style={{width:3,height:28,borderRadius:3,background:"var(--red)"}}/>
          <h2 style={{fontSize:42,fontWeight:400,color:"var(--ink)",fontFamily:"var(--serif)"}}>Book a truck</h2></div>
        <p style={{fontSize:16,color:"var(--sub)",fontFamily:"var(--body)",marginLeft:13,fontWeight:300}}>Tell us about your event</p>
      </div>
      <div className="au d1" style={{background:"var(--card)",borderRadius:22,padding:40,border:"1.5px solid var(--line)",boxShadow:"0 8px 40px rgba(0,0,0,.02)"}}>
        <div className="form-2col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 18px"}}>
          <Input label="Name" value={form.name} onChange={e=>u("name",e.target.value)} placeholder="Full name"/>
          <Input label="Email" value={form.email} onChange={e=>u("email",e.target.value)} placeholder="you@email.com" type="email"/>
          <Input label="Phone" value={form.phone} onChange={e=>u("phone",e.target.value)} placeholder="(804) 555-0000"/>
          <Input label="Event date" value={form.date} onChange={e=>u("date",e.target.value)} type="date"/>
          <Input label="Time" value={form.time} onChange={e=>u("time",e.target.value)} placeholder="e.g. 4PM–8PM"/>
          <Input label="Guests" value={form.guests} onChange={e=>u("guests",e.target.value)} placeholder="Headcount" type="number"/>
        </div>
        <Input label="Location" value={form.location} onChange={e=>u("location",e.target.value)} placeholder="Address or venue"/>
        <Input label="Budget" value={form.budget} onChange={e=>u("budget",e.target.value)} placeholder="e.g. $500–$1,000"/>
        <div style={{marginBottom:20}}>
          <label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--ink)",marginBottom:8,fontFamily:"var(--sans)",letterSpacing:".04em",textTransform:"uppercase"}}>Event type</label>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["private","corporate","wedding","festival","other"].map(t=><Pill key={t} active={form.type===t} onClick={()=>u("type",t)}>{t}</Pill>)}</div>
        </div>
        <Input label="Cuisine preferences" value={form.cuisine} onChange={e=>u("cuisine",e.target.value)} placeholder="e.g. BBQ, Mexican, Any"/>
        <Input label="Notes" value={form.notes} onChange={e=>u("notes",e.target.value)} placeholder="Special requirements..." textarea/>
        <Btn full sz="lg" onClick={()=>setSent(true)} style={{marginTop:4}}>Submit request</Btn>
        <p style={{color:"var(--mute)",fontSize:12,textAlign:"center",marginTop:14,fontFamily:"var(--sans)"}}>Free · No commitment · Direct truck responses</p>
      </div>
    </div>
  </section>;
}


// ─── Pricing ─────────────────────────────────────────────────────────────
function PricingPage({go}){
  const Check=()=><span style={{color:"var(--grn)",fontWeight:700,fontSize:14}}>✓</span>;
  return<section style={{minHeight:"100vh",background:"var(--bg)",padding:"120px 40px 80px"}}>
    <div style={{maxWidth:920,margin:"0 auto"}}>
      <div className="au" style={{textAlign:"center",marginBottom:56}}>
        <span style={{display:"inline-block",background:"var(--redL)",color:"var(--red)",fontSize:11,fontWeight:700,padding:"6px 18px",borderRadius:99,letterSpacing:".1em",fontFamily:"var(--sans)",marginBottom:20}}>FOR VENDORS</span>
        <h2 style={{fontSize:48,fontFamily:"var(--serif)",color:"var(--ink)",margin:"0 0 14px"}}>Grow your truck business</h2>
        <p style={{fontSize:18,color:"var(--sub)",fontFamily:"var(--body)",maxWidth:480,margin:"0 auto",fontWeight:300,lineHeight:1.7}}>Join Richmond's largest food truck community.</p>
      </div>
      <div className="au d1 g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div style={{background:"var(--card)",borderRadius:22,padding:44,border:"1.5px solid var(--line)",fontFamily:"var(--sans)"}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--mute)",letterSpacing:".12em",marginBottom:10}}>FREE</div>
          <div style={{fontSize:48,fontWeight:700,color:"var(--ink)"}}>$0<span style={{fontSize:16,fontWeight:400,color:"var(--mute)"}}>/mo</span></div>
          <p style={{color:"var(--sub)",fontSize:14,margin:"10px 0 32px",fontWeight:300}}>Get listed and start connecting</p>
          {["Basic profile","Apply to events","Respond to bookings","1 post/day","Community access","Customer reviews"].map(f=><div key={f} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:"1px solid var(--line)"}}><Check/><span style={{color:"var(--ink)",fontSize:14}}>{f}</span></div>)}
          <Btn v="soft" full style={{marginTop:28}} onClick={()=>go("/member")}>Get started free</Btn>
        </div>
        <div style={{background:"var(--card)",borderRadius:22,padding:44,border:"2px solid var(--red)",position:"relative",boxShadow:"0 16px 64px rgba(229,77,46,.08)",fontFamily:"var(--sans)"}}>
          <div style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",background:"var(--red)",color:"#fff",padding:"6px 22px",borderRadius:99,fontSize:11,fontWeight:700,letterSpacing:".08em"}}>MOST POPULAR</div>
          <div style={{fontSize:11,fontWeight:700,color:"var(--red)",letterSpacing:".12em",marginBottom:10}}>PREMIUM</div>
          <div style={{fontSize:48,fontWeight:700,color:"var(--ink)"}}>$10<span style={{fontSize:16,fontWeight:400,color:"var(--mute)"}}>/mo</span></div>
          <p style={{color:"var(--sub)",fontSize:14,margin:"10px 0 32px",fontWeight:300}}>Everything to dominate RVA</p>
          {["Everything in Free, plus:","Weekly promo to 4,100+ members","Priority booking alerts","Verified ✓ badge","Analytics dashboard","Unlimited posts","Featured in search","Event priority placement","Booking responses shown first"].map((f,i)=><div key={f} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:"1px solid var(--line)"}}><span style={{color:i===0?"var(--red)":"var(--grn)",fontWeight:700,fontSize:14}}>{i===0?"★":"✓"}</span><span style={{color:"var(--ink)",fontSize:14,fontWeight:i===0?700:400}}>{f}</span></div>)}
          <Btn full sz="lg" style={{marginTop:28}} onClick={()=>go("/member")}>Get Premium</Btn>
        </div>
      </div>
      <div className="au d3" style={{textAlign:"center",marginTop:48}}>
        <p style={{color:"var(--mute)",fontSize:12,fontFamily:"var(--mono)",letterSpacing:".06em",marginBottom:16}}>TRUSTED BY RICHMOND'S BEST</p>
        <div style={{display:"flex",justifyContent:"center",gap:28,flexWrap:"wrap"}}>{TRUCKS.filter(t=>t.plan==="premium").slice(0,5).map(t=><span key={t.id} style={{color:"var(--sub)",fontSize:13,fontFamily:"var(--sans)"}}>{t.img} {t.name}</span>)}</div>
      </div>
    </div>
  </section>;
}

// ─── About ───────────────────────────────────────────────────────────────
function AboutPage({go}){
  return<section style={{minHeight:"100vh",background:"var(--bg)",padding:"120px 40px 80px"}}>
    <div style={{maxWidth:760,margin:"0 auto"}}>
      <div className="au">
        <h2 style={{fontSize:52,fontFamily:"var(--serif)",color:"var(--ink)",margin:"0 0 28px",lineHeight:1.1}}>Richmond deserves better <em style={{color:"var(--red)"}}>food truck</em> culture</h2>
        <p style={{fontSize:19,color:"var(--sub)",fontFamily:"var(--body)",lineHeight:1.85,marginBottom:28,fontWeight:300}}>FAFT RVA started with a simple question: why is it so hard to find a food truck? Trucks were scattered across social media, events had no hub, customers were guessing.</p>
        <p style={{fontSize:19,color:"var(--sub)",fontFamily:"var(--body)",lineHeight:1.85,marginBottom:44,fontWeight:300}}>We're building the operating system for Richmond's food truck scene. One platform. Every truck, every event, every hungry customer — connected.</p>
      </div>
      <div className="au d2" style={{background:"var(--ink)",borderRadius:22,padding:48,marginBottom:40,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-30%",right:"-10%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(229,77,46,.06),transparent)",filter:"blur(40px)"}}/>
        <div style={{position:"relative"}}>
          <span style={{color:"rgba(255,255,255,.25)",fontSize:10,fontWeight:600,letterSpacing:".15em",fontFamily:"var(--mono)"}}>OUR MISSION</span>
          <p style={{fontSize:22,color:"rgba(255,255,255,.5)",fontFamily:"var(--serif)",lineHeight:1.7,fontStyle:"italic",marginTop:16}}>To make Richmond the #1 food truck city in America — giving owners tools to grow, hosts access to vendors, and customers the easiest way to find great food on wheels.</p>
        </div>
      </div>
      <div className="au d3 g3" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:44}}>
        {[["🚚","For Trucks","Free tools to reach 4,100+ customers."],["📅","For Hosts","Find vetted vendors, manage events."],["🍔","For You","Real-time locations, one-click booking."]].map(([ic,t,d])=>
          <div key={t} className="lift" style={{background:"var(--card)",borderRadius:16,padding:28,border:"1.5px solid var(--line)"}}>
            <div style={{fontSize:28,marginBottom:12}}>{ic}</div>
            <h4 style={{fontSize:15,fontWeight:700,color:"var(--ink)",marginBottom:6,fontFamily:"var(--sans)"}}>{t}</h4>
            <p style={{color:"var(--sub)",fontSize:14,lineHeight:1.6,fontFamily:"var(--body)",fontWeight:300}}>{d}</p>
          </div>
        )}
      </div>
      <div style={{textAlign:"center",paddingTop:36,borderTop:"1px solid var(--line)"}}>
        <p style={{color:"var(--sub)",fontSize:15,fontFamily:"var(--body)"}}>Founded by <strong style={{color:"var(--ink)"}}>Ron Joseph</strong></p>
        <p style={{color:"var(--mute)",fontSize:14,fontFamily:"var(--body)",marginTop:4}}>Richmond, VA · Est. 2026</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:24}}><Btn onClick={()=>go("/trucks")}>Find trucks</Btn><Btn v="outline" onClick={()=>go("/pricing")}>Join as vendor</Btn></div>
      </div>
    </div>
  </section>;
}

// ─── Footer ──────────────────────────────────────────────────────────────
function Footer({go}){
  return<footer style={{background:"var(--ink)",padding:"60px 40px 36px"}}>
    <div className="foot-grid" style={{maxWidth:1240,margin:"0 auto",display:"grid",gridTemplateColumns:"2.5fr 1fr 1fr 1fr",gap:44}}>
      <div>
        <div style={{fontFamily:"var(--serif)",fontSize:20,color:"#fff",marginBottom:14}}><em>find a</em> <span style={{color:"var(--red)"}}>food truck</span></div>
        <p style={{color:"rgba(255,255,255,.25)",fontSize:14,lineHeight:1.75,maxWidth:280,fontFamily:"var(--body)",fontWeight:300}}>Richmond's food truck community. Connecting trucks, events, and hungry customers since 2026.</p>
      </div>
      {[["DISCOVER",[["Find Trucks","/trucks"],["Events","/events"],["Book a Truck","/book"]]],["VENDORS",[["Pricing","/pricing"],["Login","/member"],["About","/about"]]],["CONNECT",[["Facebook","#"],["Instagram","#"],["info@faftrva.com","#"]]]].map(([t,items])=>
        <div key={t}><h4 style={{color:"rgba(255,255,255,.3)",fontSize:10,fontWeight:600,letterSpacing:".15em",marginBottom:18,fontFamily:"var(--mono)"}}>{t}</h4>
          {items.map(([l,to])=><div key={l} onClick={()=>to.startsWith("/")?go(to):null} style={{color:"rgba(255,255,255,.22)",fontSize:13,cursor:to.startsWith("/")?"pointer":"default",padding:"4px 0",fontFamily:"var(--sans)",transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,.5)"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.22)"}>{l}</div>)}</div>
      )}
    </div>
    <div style={{maxWidth:1240,margin:"40px auto 0",paddingTop:20,borderTop:"1px solid rgba(255,255,255,.04)",display:"flex",justifyContent:"space-between"}}>
      <span style={{color:"rgba(255,255,255,.12)",fontSize:11,fontFamily:"var(--mono)"}}>© 2026 FAFT RVA</span>
      <span onClick={()=>go("/admin")} style={{color:"rgba(255,255,255,.06)",fontSize:10,cursor:"pointer",fontFamily:"var(--mono)"}}>admin</span>
    </div>
  </footer>;
}


// ═══════════════════════════════════════════════════════════════════════════
// MEMBER DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
function MemberLogin({onLogin}){
  const[pw,setPw]=useState("");const[err,setErr]=useState(false);
  const go=()=>{if(onLogin(pw))setErr(false);else{setErr(true);setPw("")}};
  return<div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div className="asc" style={{width:400,padding:48,borderRadius:24,background:"var(--card)",border:"1.5px solid var(--line)",textAlign:"center",boxShadow:"0 24px 72px rgba(0,0,0,.04)"}}>
      <div style={{fontSize:36,marginBottom:24}}>🚚</div>
      <h2 style={{fontFamily:"var(--serif)",fontSize:24,color:"var(--ink)",margin:"0 0 6px"}}>Truck Owner Portal</h2>
      <p style={{color:"var(--sub)",fontSize:14,fontFamily:"var(--body)",margin:"0 0 32px",fontWeight:300}}>Manage your profile, menu & bookings</p>
      <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr(false)}} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="Password" style={{width:"100%",padding:14,borderRadius:12,border:`1.5px solid ${err?"var(--red)":"var(--line)"}`,background:"var(--bg)",color:"var(--ink)",fontSize:15,textAlign:"center",letterSpacing:3,boxSizing:"border-box",fontFamily:"var(--mono)"}}/>
      {err&&<div style={{color:"var(--red)",fontSize:12,marginTop:10,fontFamily:"var(--sans)"}}>Invalid password</div>}
      <Btn full style={{marginTop:16}} onClick={go}>Enter Dashboard</Btn>
    </div>
  </div>;
}

function MemberDash({go}){
  const[tab,setTab]=useState("profile");const truck=TRUCKS[0];
  const[profile,setP]=useState({name:truck.name,cuisine:truck.cuisine,owner:truck.owner,phone:truck.phone,desc:truck.desc,price:truck.price,schedule:truck.schedule});
  const[menu,setMenu]=useState(truck.menu||[]);const[ni,setNi]=useState({name:"",price:"",desc:""});
  const[saved,setSaved]=useState(false);const[loc,setLoc]=useState({address:"",hours:"",special:""});
  const save=()=>{setSaved(true);setTimeout(()=>setSaved(false),2500)};
  const tabs=[{id:"profile",l:"🚚 Profile"},{id:"location",l:"📍 Location"},{id:"bookings",l:"📋 Bookings"},{id:"analytics",l:"📊 Analytics"}];

  return<div style={{minHeight:"100vh",background:"var(--bg)",fontFamily:"var(--sans)"}}>
    <div style={{background:"var(--card)",borderBottom:"1px solid var(--line)",padding:"12px 36px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"baseline",gap:6}}>
        <span style={{fontFamily:"var(--serif)",fontSize:18,fontStyle:"italic"}}>find a</span>
        <span style={{fontFamily:"var(--serif)",fontSize:18,color:"var(--red)"}}>food truck</span>
        <span style={{color:"var(--mute)",fontSize:13,marginLeft:8}}>| Dashboard</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <span style={{fontSize:13,color:"var(--sub)"}}>👋 {truck.owner}</span>
        <span style={{background:"var(--warm)",color:"var(--amb)",padding:"4px 12px",borderRadius:99,fontSize:10,fontWeight:700}}>★ PREMIUM</span>
        <button onClick={()=>go("/")} style={{color:"var(--sub)",fontSize:13}}>← Site</button>
      </div>
    </div>
    <div style={{maxWidth:960,margin:"0 auto",padding:"32px 24px"}}>
      <div style={{display:"flex",gap:3,marginBottom:28,background:"var(--tint)",borderRadius:12,padding:3}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"11px 22px",borderRadius:9,fontSize:13,fontWeight:tab===t.id?600:400,background:tab===t.id?"var(--card)":"transparent",color:tab===t.id?"var(--ink)":"var(--sub)",boxShadow:tab===t.id?"0 2px 8px rgba(0,0,0,.04)":"none",transition:"all .25s"}}>{t.l}</button>)}
      </div>
      {saved&&<div className="af" style={{background:"rgba(45,140,60,.06)",border:"1px solid rgba(45,140,60,.1)",borderRadius:12,padding:"12px 18px",marginBottom:16,color:"var(--grn)",fontSize:14,fontWeight:600}}>✓ Saved</div>}

      {tab==="profile"&&<div className="au g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div style={{background:"var(--card)",borderRadius:18,padding:30,border:"1.5px solid var(--line)"}}>
          <h3 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--ink)",marginBottom:22}}>Profile</h3>
          {[["Truck Name","name"],["Cuisine","cuisine"],["Owner","owner"],["Phone","phone"],["Schedule","schedule"],["Price","price"]].map(([l,k])=><Input key={k} label={l} value={profile[k]} onChange={e=>setP({...profile,[k]:e.target.value})}/>)}
          <Input label="Description" value={profile.desc} onChange={e=>setP({...profile,desc:e.target.value})} textarea/>
          <Btn full onClick={save}>Save profile</Btn>
        </div>
        <div style={{background:"var(--card)",borderRadius:18,padding:30,border:"1.5px solid var(--line)"}}>
          <h3 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--ink)",marginBottom:22}}>Menu ({menu.length})</h3>
          {menu.map((m,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--line)"}}>
            <div><div style={{fontWeight:600,fontSize:14,color:"var(--ink)"}}>{m.name}</div><div style={{color:"var(--mute)",fontSize:12,marginTop:2}}>{m.desc}</div></div>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{color:"var(--red)",fontWeight:700}}>${m.price}</span><button onClick={()=>setMenu(menu.filter((_,j)=>j!==i))} style={{color:"var(--red)",opacity:.5,fontSize:14}}>✕</button></div>
          </div>)}
          <div style={{marginTop:18,padding:16,background:"var(--tint)",borderRadius:12}}>
            <div style={{fontSize:11,fontWeight:600,marginBottom:8,letterSpacing:".06em",textTransform:"uppercase",color:"var(--ink)"}}>ADD ITEM</div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:8,marginBottom:8}}>
              <input value={ni.name} onChange={e=>setNi({...ni,name:e.target.value})} placeholder="Name" style={{padding:"9px 12px",borderRadius:8,border:"1px solid var(--line)",fontSize:13,background:"var(--card)"}}/>
              <input value={ni.price} onChange={e=>setNi({...ni,price:e.target.value})} placeholder="$" type="number" style={{padding:"9px 12px",borderRadius:8,border:"1px solid var(--line)",fontSize:13,background:"var(--card)"}}/>
            </div>
            <input value={ni.desc} onChange={e=>setNi({...ni,desc:e.target.value})} placeholder="Description" style={{width:"100%",padding:"9px 12px",borderRadius:8,border:"1px solid var(--line)",fontSize:13,boxSizing:"border-box",marginBottom:8,background:"var(--card)"}}/>
            <Btn sz="sm" full onClick={()=>{if(ni.name&&ni.price){setMenu([...menu,{...ni,price:+ni.price}]);setNi({name:"",price:"",desc:""})}}}>+ Add</Btn>
          </div>
        </div>
      </div>}

      {tab==="location"&&<div className="au" style={{maxWidth:520}}>
        <div style={{background:"var(--card)",borderRadius:18,padding:32,border:"1.5px solid var(--line)"}}>
          <h3 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--ink)",marginBottom:6}}>📍 Post today's location</h3>
          <p style={{color:"var(--sub)",fontSize:14,marginBottom:24,fontWeight:300}}>Let 4,100+ customers find you</p>
          <Input label="Address" value={loc.address} onChange={e=>setLoc({...loc,address:e.target.value})} placeholder="e.g. Shockoe Bottom"/>
          <Input label="Hours" value={loc.hours} onChange={e=>setLoc({...loc,hours:e.target.value})} placeholder="11a–3p"/>
          <Input label="Today's special" value={loc.special} onChange={e=>setLoc({...loc,special:e.target.value})} placeholder="🔥 Half-price brisket tacos!"/>
          <Btn full sz="lg" onClick={save}>Post location</Btn>
        </div>
      </div>}

      {tab==="bookings"&&<div className="au">
        {BOOKINGS.map(b=><div key={b.id} className="lift" style={{background:"var(--card)",borderRadius:16,padding:26,border:"1.5px solid var(--line)",marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div><div style={{fontWeight:700,fontSize:16,color:"var(--ink)"}}>{b.who} — {b.eventType}</div>
              <div style={{color:"var(--sub)",fontSize:13,marginTop:5}}>📅 {b.date} · 📍 {b.location} · 👥 {b.guests} · 💰 {b.budget}</div>
              {b.notes&&<div style={{color:"var(--sub)",fontSize:13,marginTop:8,fontStyle:"italic",background:"var(--tint)",padding:"8px 12px",borderRadius:8}}>"{b.notes}"</div>}
            </div>
            <span style={{background:"rgba(45,140,60,.08)",color:"var(--grn)",padding:"4px 14px",borderRadius:99,fontSize:11,fontWeight:700,height:"fit-content"}}>OPEN</span>
          </div>
          <div style={{marginTop:16,display:"flex",gap:8}}><Btn sz="sm">Send quote</Btn><Btn v="soft" sz="sm">Pass</Btn></div>
        </div>)}
      </div>}

      {tab==="analytics"&&<div className="au g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[["👁","Views","1,240","↑12%"],["★","Rating",String(truck.rating),"234 rev"],["📋","Bookings",String(truck.bookings),"this mo"],["💰","Revenue",`$${truck.revenue.toLocaleString()}`,"this mo"]].map(([ic,lb,vl,sb])=>
          <div key={lb} className="lift" style={{background:"var(--card)",borderRadius:16,padding:28,border:"1.5px solid var(--line)",textAlign:"center"}}>
            <div style={{fontSize:24,marginBottom:8}}>{ic}</div>
            <div style={{fontSize:28,fontWeight:700,color:"var(--ink)"}}>{vl}</div>
            <div style={{fontSize:11,color:"var(--mute)",marginTop:5,fontFamily:"var(--mono)"}}>{sb}</div>
            <div style={{fontSize:10,color:"var(--sub)",marginTop:8,textTransform:"uppercase",letterSpacing:".1em",fontWeight:600}}>{lb}</div>
          </div>)}
      </div>}
    </div>
  </div>;
}


// ═══════════════════════════════════════════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════════════════════════════════════════
function AdminLogin({onLogin}){
  const[pw,setPw]=useState("");const[err,setErr]=useState(false);
  const go=()=>{if(onLogin(pw))setErr(false);else{setErr(true);setPw("")}};
  return<div style={{minHeight:"100vh",background:"var(--adm-bg)",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div className="asc" style={{width:380,padding:40,borderRadius:20,background:"var(--adm-s)",border:"1px solid var(--adm-b)",textAlign:"center"}}>
      <div style={{fontSize:32,marginBottom:24}}>🛡️</div>
      <h2 style={{color:"#fff",fontSize:22,fontWeight:700,margin:"0 0 28px",fontFamily:"var(--sans)"}}>Admin Access</h2>
      <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr(false)}} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="Password" style={{width:"100%",padding:13,borderRadius:12,border:`1.5px solid ${err?"#ef4444":"var(--adm-b)"}`,background:"rgba(255,255,255,.03)",color:"#fff",fontSize:15,textAlign:"center",letterSpacing:3,boxSizing:"border-box",fontFamily:"var(--mono)"}}/>
      {err&&<div style={{color:"#ef4444",fontSize:12,marginTop:10}}>Invalid</div>}
      <button onClick={go} style={{width:"100%",marginTop:16,padding:13,borderRadius:12,background:"linear-gradient(135deg,var(--red),var(--redD))",color:"#fff",fontSize:14,fontWeight:600,fontFamily:"var(--sans)"}}>Enter</button>
    </div>
  </div>;
}

function PinGate({onUnlock,onCancel}){
  const[pin,setPin]=useState(["","","",""]);const[err,setErr]=useState(false);
  const digit=(i,v)=>{const np=[...pin];np[i]=v.slice(-1);setPin(np);setErr(false);if(v&&i<3)document.getElementById(`pin${i+1}`)?.focus();
    if(i===3&&v){const f=np.join("");if(!onUnlock(f)){setErr(true);setPin(["","","",""]);document.getElementById("pin0")?.focus()}}};
  return<div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,.88)",backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div className="asc" style={{width:360,padding:40,borderRadius:20,background:"#0c0d11",border:"1px solid rgba(220,38,38,.1)",textAlign:"center"}}>
      <div style={{fontSize:28,marginBottom:24}}>🔐</div>
      <h2 style={{color:"#fff",fontSize:20,fontWeight:700,margin:"0 0 28px",fontFamily:"var(--sans)"}}>Security PIN</h2>
      <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:18}}>{pin.map((d,i)=><input key={i} id={`pin${i}`} type="password" inputMode="numeric" maxLength={1} value={d} onChange={e=>digit(i,e.target.value)} style={{width:52,height:60,borderRadius:12,fontSize:22,border:`2px solid ${err?"#dc2626":d?"var(--red)":"var(--adm-b)"}`,background:"rgba(255,255,255,.03)",color:"#fff",textAlign:"center",outline:"none",fontFamily:"var(--mono)",fontWeight:700}}/>)}</div>
      {err&&<div style={{color:"#dc2626",fontSize:12,marginBottom:8}}>Invalid</div>}
      <button onClick={onCancel} style={{color:"var(--adm-d)",fontSize:13,marginTop:8}}>← Back</button>
    </div>
  </div>;
}

function AdminDash({go}){
  const[st,d]=useReducer(reducer,{view:"dashboard",trucks:TRUCKS,events:EVENTS,bookings:BOOKINGS,pending:PENDING,spam:SPAM_Q,flagged:FLAGGED});
  const[secAuth,setSecAuth]=useState(false);const[showPin,setShowPin]=useState(false);const[time,setTime]=useState(new Date());
  useEffect(()=>{const iv=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(iv)},[]);
  const NAV=[{id:"dashboard",i:"📊",l:"Dashboard"},{id:"trucks",i:"🚚",l:"Trucks"},{id:"events",i:"📅",l:"Events"},{id:"bookings",i:"📋",l:"Bookings"},{id:"members",i:"👥",l:"Members"},{id:"ads",i:"📢",l:"Ads"},{id:"moderation",i:"🛡️",l:"Moderation"},{id:"settings",i:"⚙️",l:"Settings"},{id:"security",i:"🔐",l:"SECURITY"}];
  const bc={members:st.pending.length,moderation:st.spam.length,security:st.flagged.length};
  const nav=id=>{if(id==="security"){if(!secAuth)setShowPin(true);else d({type:"V",p:"security"})}else d({type:"V",p:id})};
  const prem=st.trucks.filter(t=>t.plan==="premium").length;

  return<div style={{minHeight:"100vh",background:"var(--adm-bg)",color:"#fff",fontFamily:"var(--sans)",display:"flex"}}>
    <style>{G}</style>
    {showPin&&<PinGate onUnlock={p=>{if(p===SEC_PIN){setSecAuth(true);setShowPin(false);d({type:"V",p:"security"});return true}return false}} onCancel={()=>setShowPin(false)}/>}

    <div className="side-nav" style={{width:210,background:"rgba(255,255,255,.01)",borderRight:"1px solid var(--adm-b)",padding:"18px 10px",display:"flex",flexDirection:"column",flexShrink:0}}>
      <div style={{padding:"0 6px 22px",display:"flex",alignItems:"baseline",gap:6}}>
        <span style={{fontFamily:"var(--serif)",fontSize:16,fontStyle:"italic",color:"#fff"}}>faft</span>
        <span style={{fontFamily:"var(--serif)",fontSize:16,color:"var(--red)"}}>rva</span>
        <span style={{fontSize:9,color:"var(--adm-d)",fontFamily:"var(--mono)",marginLeft:4}}>ADMIN</span>
      </div>
      <nav style={{flex:1}}>{NAV.map(n=>{const sec=n.id==="security";return<button key={n.id} onClick={()=>nav(n.id)} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 12px",borderRadius:9,marginTop:sec?10:1,width:"100%",background:st.view===n.id?(sec?"rgba(229,77,46,.1)":"rgba(229,77,46,.08)"):"transparent",color:st.view===n.id?(sec?"var(--red)":"var(--red)"):sec?"rgba(229,77,46,.3)":"var(--adm-t)",fontSize:13,fontWeight:st.view===n.id?600:400,borderTop:sec?"1px solid var(--adm-b)":"none",paddingTop:sec?12:9,position:"relative",textAlign:"left",transition:"all .15s"}}>
        {st.view===n.id&&<div style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",width:3,height:16,borderRadius:2,background:sec?"var(--red)":"var(--red)"}}/>}
        <span>{n.i}</span><span style={{flex:1}}>{n.l}</span>
        {bc[n.id]>0&&<span style={{minWidth:16,height:16,borderRadius:8,padding:"0 5px",background:sec?"var(--red)":"var(--red)",color:"#fff",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{bc[n.id]}</span>}
      </button>})}</nav>
      <div style={{paddingTop:12,borderTop:"1px solid var(--adm-b)",fontSize:10,color:"var(--adm-d)"}}>
        <div style={{marginBottom:6}}>{secAuth?"🔓 Unlocked":"🔒 Locked"}</div>
        <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:"var(--mono)"}}>{time.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</span><button onClick={()=>go("/")} style={{color:"var(--adm-d)",fontSize:10}}>← Site</button></div>
      </div>
    </div>

    <div style={{flex:1,padding:"24px 32px",overflowY:"auto",maxHeight:"100vh"}}>
      {st.view==="dashboard"&&<div className="au">
        <h2 style={{fontSize:24,fontWeight:700,margin:"0 0 24px"}}>Command Center</h2>
        <div style={{background:"linear-gradient(135deg,rgba(229,77,46,.08),rgba(199,125,21,.03))",border:"1px solid rgba(229,77,46,.12)",borderRadius:16,padding:"22px 28px",marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:10,color:"var(--amb)",fontWeight:600,letterSpacing:".12em",fontFamily:"var(--mono)"}}>MRR</div><div style={{fontSize:38,fontWeight:700,marginTop:4}}>${prem*10}<span style={{fontSize:16,color:"var(--adm-t)"}}>/mo</span></div></div>
          <span style={{color:"var(--grn)",fontSize:18,fontWeight:700}}>↑16.7%</span>
        </div>
        <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
          <StatC icon="👥" label="Members" value="4,100" accent="var(--blu)"/><StatC icon="🚚" label="Trucks" value={st.trucks.length} accent="var(--red)"/><StatC icon="📅" label="Events" value={st.events.filter(e=>e.status==="upcoming").length} accent="var(--pur)"/><StatC icon="📋" label="Open" value={st.bookings.filter(b=>b.status==="open").length} accent="#06b6d4"/>
        </div>
        <h3 style={{fontSize:15,fontWeight:600,marginBottom:12}}>⚡ Pending</h3>
        {st.pending.length===0?<div style={{textAlign:"center",padding:32,color:"var(--adm-d)"}}>✓ All caught up</div>:
        st.pending.map(m=><div key={m.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid var(--adm-b)"}}>
          <div><span style={{fontWeight:600}}>{m.name}</span><span style={{color:"var(--adm-d)",fontSize:12,marginLeft:10}}>{m.type} · {m.applied}</span></div>
          <div style={{display:"flex",gap:5}}><ABtn v="ok" onClick={()=>d({type:"AP",p:m.id})}>✓</ABtn><ABtn v="bad" onClick={()=>d({type:"RP",p:m.id})}>✕</ABtn></div>
        </div>)}
      </div>}

      {st.view==="trucks"&&<div className="au">
        <h2 style={{fontSize:24,fontWeight:700,margin:"0 0 24px"}}>Trucks ({st.trucks.length})</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>{st.trucks.map(t=><ACard key={t.id}>
          <div style={{display:"flex",gap:12}}><div style={{width:44,height:44,borderRadius:11,fontSize:22,background:"var(--adm-s)",display:"flex",alignItems:"center",justifyContent:"center"}}>{t.img}</div>
          <div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700,fontSize:14}}>{t.name}</span><ABadge color={t.plan==="premium"?"var(--amb)":"var(--adm-t)"}>{t.plan==="premium"?"★ $10":"FREE"}</ABadge></div>
          <div style={{color:"var(--adm-t)",fontSize:12,marginTop:2}}>{t.cuisine} · ★{t.rating}</div>
          <div style={{display:"flex",gap:5,marginTop:8}}><ABadge color={t.status==="active"?"var(--grn)":"#666"}>● {t.status}</ABadge>{t.verified&&<ABadge color="var(--blu)">✓</ABadge>}</div></div></div>
        </ACard>)}</div>
      </div>}

      {st.view==="moderation"&&<div className="au">
        <h2 style={{fontSize:24,fontWeight:700,margin:"0 0 24px"}}>Moderation</h2>
        {st.spam.length===0?<div style={{textAlign:"center",padding:48,color:"var(--adm-d)"}}><div style={{fontSize:40,opacity:.4,marginBottom:10}}>🛡️</div>All clear</div>:
        st.spam.map(s=><ACard key={s.id} style={{marginBottom:10,borderLeft:"3px solid var(--red)"}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><div style={{flex:1}}>
            <div style={{fontWeight:600,marginBottom:6}}>{s.author} <span style={{color:"var(--adm-d)",fontWeight:400,fontSize:12}}>{s.time}</span></div>
            <div style={{padding:"8px 12px",background:"rgba(0,0,0,.2)",borderRadius:8,color:"rgba(255,255,255,.5)",fontSize:13,fontFamily:"var(--mono)",marginBottom:8}}>{s.content}</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1}}><Bar value={s.conf} color="var(--red)"/></div><span style={{color:"var(--red)",fontSize:12,fontWeight:700}}>{s.conf}%</span><span style={{color:"var(--adm-d)",fontSize:11}}>{s.reason}</span></div>
          </div><div style={{display:"flex",gap:5,marginLeft:14}}><ABtn v="ok" onClick={()=>d({type:"KS",p:s.id})}>✓</ABtn><ABtn v="bad" onClick={()=>d({type:"RS",p:s.id})}>🗑</ABtn></div></div>
        </ACard>)}
      </div>}

      {st.view==="security"&&secAuth&&<div className="au">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <h2 style={{fontSize:24,fontWeight:700}}>🛡️ Security Center</h2>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:8,background:"rgba(199,125,21,.08)",border:"1px solid rgba(199,125,21,.15)"}}><div style={{width:6,height:6,borderRadius:99,background:"var(--amb)",animation:"pulse 2s infinite"}}/><span style={{color:"var(--amb)",fontSize:11,fontWeight:700,fontFamily:"var(--mono)"}}>ELEVATED</span></div>
        </div>
        <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
          <StatC icon="🚨" label="Flagged" value={st.flagged.length} accent="var(--red)"/><StatC icon="🗑" label="Blocked" value="87%" accent="var(--grn)"/><StatC icon="⚡" label="Response" value="8m" accent="#06b6d4"/><StatC icon="⚔️" label="Raids" value="4" accent="var(--pur)"/>
        </div>
        {st.flagged.length===0?<div style={{textAlign:"center",padding:40,color:"var(--adm-d)"}}><div style={{fontSize:40,opacity:.4,marginBottom:8}}>🛡️</div>All clear</div>:
        st.flagged.map(f=><ACard key={f.id} style={{marginBottom:10,borderLeft:"4px solid var(--red)"}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><div style={{flex:1}}>
            <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:8}}><span style={{fontWeight:700}}>{f.author}</span><ABadge color={TRUST_LEVELS[f.trust].color}>{TRUST_LEVELS[f.trust].icon} L{f.trust}</ABadge><span style={{color:"var(--adm-d)",fontSize:11}}>{f.ts}</span></div>
            <div style={{padding:"10px 14px",background:"rgba(0,0,0,.2)",borderRadius:8,color:"rgba(255,255,255,.5)",fontSize:13,fontFamily:"var(--mono)",marginBottom:10,borderLeft:"3px solid var(--red)"}}>{f.content}</div>
            <div style={{display:"flex",gap:5}}>{f.threats.map((t,i)=><ABadge key={i} color={t.conf>=80?"var(--red)":"var(--amb)"}>{t.type} {t.conf}%</ABadge>)}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginTop:10}}>{[["IP",f.ip],["Device",f.device],["Age",f.age],["Posts",f.posts]].map(([l,v])=><div key={l} style={{background:"rgba(255,255,255,.02)",borderRadius:6,padding:8}}><div style={{fontSize:9,color:"var(--adm-d)",textTransform:"uppercase",letterSpacing:".06em"}}>{l}</div><div style={{color:"#fff",fontSize:11,fontFamily:l==="IP"?"var(--mono)":"inherit",marginTop:2}}>{v}</div></div>)}</div>
          </div><div style={{display:"flex",flexDirection:"column",gap:4,marginLeft:14}}><ABtn v="ok" onClick={()=>d({type:"RF",p:f.id})}>✓</ABtn><ABtn v="bad" onClick={()=>d({type:"RF",p:f.id})}>🗑</ABtn><ABtn v="crit" onClick={()=>d({type:"RF",p:f.id})}>Ban</ABtn></div></div>
        </ACard>)}
        <h3 style={{fontSize:15,fontWeight:600,marginTop:28,marginBottom:12}}>📜 Audit</h3>
        {AUDIT.map(a=><div key={a.id} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:"1px solid var(--adm-b)"}}><span>{{auto_flag:"🚨",raid_detected:"⚔️",trust_up:"⬆️",ban:"🔨"}[a.act]||"📋"}</span><div style={{flex:1}}><span style={{fontSize:13}}>{a.detail}</span><div style={{color:"var(--adm-d)",fontSize:11,marginTop:2}}>{a.target} · {a.actor} · {a.ts}</div></div></div>)}
        <h3 style={{fontSize:15,fontWeight:600,marginTop:28,marginBottom:12}}>🔍 Intel</h3>
        {INTEL.map(m=><ACard key={m.id} style={{marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}><div style={{width:36,height:36,borderRadius:9,background:m.risk>=80?"rgba(229,77,46,.1)":"rgba(199,125,21,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{m.risk>=80?"🚨":"⚠️"}</div>
              <div><span style={{fontWeight:700}}>{m.name}</span><div style={{color:"var(--adm-d)",fontSize:11,marginTop:1}}>{m.loc}</div></div></div>
            <div style={{display:"flex",alignItems:"center",gap:8,minWidth:100}}><div style={{flex:1}}><Bar value={m.risk} color={m.risk>=80?"var(--red)":"var(--amb)"} h={6}/></div><ABadge color={m.risk>=80?"var(--red)":"var(--amb)"}>{m.risk}</ABadge></div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>{m.signals.map((s,i)=><span key={i} style={{color:s.includes("VPN")||s.includes("spam")?"var(--red)":"var(--amb)",fontSize:11,fontFamily:"var(--mono)"}}>● {s}</span>)}</div>
        </ACard>)}
      </div>}

      {["events","bookings","members","ads","settings"].includes(st.view)&&<div className="au">
        <h2 style={{fontSize:24,fontWeight:700,margin:"0 0 24px"}}>{NAV.find(n=>n.id===st.view)?.l}</h2>
        <ACard><div style={{textAlign:"center",padding:40,color:"var(--adm-d)"}}><div style={{fontSize:40,opacity:.3,marginBottom:10}}>{NAV.find(n=>n.id===st.view)?.i}</div>{NAV.find(n=>n.id===st.view)?.l} management</div></ACard>
      </div>}
    </div>
  </div>;
}


// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function App(){
  const{route,go}=useRouter();
  const[admin,setAdmin]=useState(false);
  const[member,setMember]=useState(false);

  const pub=["/","/trucks","/events","/book","/pricing","/about"].includes(route);
  if(pub)return<div style={{fontFamily:"var(--sans)"}}>
    <style>{G}</style><div className="grain"/>
    <Nav go={go} route={route}/>
    {route==="/"&&<><Hero go={go}/><Ticker/><Footer go={go}/></>}
    {route==="/trucks"&&<><TruckFinder go={go}/><Footer go={go}/></>}
    {route==="/events"&&<><EventsPage go={go}/><Footer go={go}/></>}
    {route==="/book"&&<><BookingPage go={go}/><Footer go={go}/></>}
    {route==="/pricing"&&<><PricingPage go={go}/><Footer go={go}/></>}
    {route==="/about"&&<><AboutPage go={go}/><Footer go={go}/></>}
  </div>;

  if(route==="/member"){
    if(!member)return<><style>{G}</style><MemberLogin onLogin={p=>{if(p===MEMBER_PW){setMember(true);return true}return false}}/></>;
    return<><style>{G}</style><MemberDash go={go}/></>;
  }
  if(route==="/admin"){
    if(!admin)return<><style>{G}</style><AdminLogin onLogin={p=>{if(p===ADMIN_PW){setAdmin(true);return true}return false}}/></>;
    return<AdminDash go={go}/>;
  }
  go("/");return null;
}
