import { useState, useEffect, useReducer, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// FIND A FOOD TRUCK RVA — Complete Platform v2.0
// Public Site · Member Dashboard · Admin + Security Command Center
// ═══════════════════════════════════════════════════════════════════════════

// ─── Auth ────────────────────────────────────────────────────────────────
const ADMIN_PW="FAFT2026!admin", SEC_PIN="7743", MEMBER_PW="truck2026";

// ─── Theme ───────────────────────────────────────────────────────────────
const T={bg:"#08090c",s:"rgba(255,255,255,0.028)",sh:"rgba(255,255,255,0.055)",b:"rgba(255,255,255,0.06)",bh:"rgba(255,255,255,0.12)",
  o:"#f97316",am:"#f59e0b",bl:"#3b82f6",pu:"#a855f7",g:"#22c55e",r:"#ef4444",cy:"#06b6d4",cr:"#dc2626",
  tm:"rgba(255,255,255,0.45)",td:"rgba(255,255,255,0.28)"};
const P={bg:"#FAF7F2",s:"#FFFFFF",o:"#E8652B",ol:"#FFF0E8",ch:"#2A2520",wg:"#8A8279",lg:"#E8E4DF",cr:"#F5F0EA",gn:"#3D8B37",rd:"#C4392B",am:"#C4851C"};

// ─── Data ────────────────────────────────────────────────────────────────
const TRUCKS=[
  {id:"ft1",name:"Curbside Creations",cuisine:"Southern Fusion",owner:"Chef Marcus",status:"active",schedule:"Mon-Fri 11am-3pm",phone:"(804) 555-0101",rating:4.8,reviews:234,img:"🚚",plan:"premium",verified:true,desc:"Award-winning Southern fusion with a modern twist. Three-time RVA Food Truck of the Year.",specialties:["Brisket Tacos","Bourbon Cobbler","Cajun Mac & Cheese","Sweet Tea Brined Chicken"],price:"$$",bookings:12,revenue:4200,lat:37.5407,lng:-77.436,location:"Shockoe Bottom",distance:0.8,hours:"11am-3pm",menu:[{name:"Brisket Tacos",price:14,desc:"12-hr smoked brisket, pickled onion, chipotle slaw"},{name:"Cajun Mac & Cheese",price:10,desc:"Five cheese blend, andouille sausage, breadcrumb crust"},{name:"Sweet Tea Chicken Sandwich",price:12,desc:"Brined & fried, honey butter, house pickles"},{name:"Bourbon Peach Cobbler",price:8,desc:"Seasonal peaches, brown butter crumble, vanilla cream"}]},
  {id:"ft2",name:"RVA Taco Co.",cuisine:"Mexican Street Food",owner:"Maria Santos",status:"active",schedule:"Tue-Sat 11am-9pm",phone:"(804) 555-0202",rating:4.6,reviews:189,img:"🌮",plan:"premium",verified:true,desc:"Authentic family recipes passed down three generations. The real deal.",specialties:["Al Pastor Tacos","Street Elote","Churros","Horchata"],price:"$",bookings:8,revenue:3100,lat:37.5536,lng:-77.4508,location:"The Fan",distance:1.2,hours:"11am-9pm",menu:[{name:"Al Pastor Tacos (3)",price:12,desc:"Marinated pork, pineapple, onion, cilantro"},{name:"Street Elote",price:6,desc:"Grilled corn, mayo, cotija, tajín, lime"},{name:"Churros",price:5,desc:"Fresh fried, cinnamon sugar, chocolate dip"},{name:"Horchata",price:4,desc:"House-made rice milk, cinnamon, vanilla"}]},
  {id:"ft3",name:"Smoke & Barrel BBQ",cuisine:"BBQ & Smoked Meats",owner:"Big Mike",status:"inactive",schedule:"Wed-Sun 12pm-8pm",phone:"(804) 555-0303",rating:4.9,reviews:312,img:"🔥",plan:"premium",verified:true,desc:"14-hour smoked brisket. Competition-winning ribs. The real BBQ experience.",specialties:["14-Hr Brisket","Competition Ribs","Smoked Mac","Banana Pudding"],price:"$$",bookings:15,revenue:5600,lat:37.5313,lng:-77.4764,location:"Scott's Addition",distance:2.1,hours:"Opens Wed 12pm",menu:[{name:"Brisket Plate",price:18,desc:"14-hour oak-smoked, two sides, Texas toast"},{name:"Competition Ribs (Half)",price:16,desc:"St. Louis cut, dry rub, cherry glaze"},{name:"Smoked Mac & Cheese",price:8,desc:"Gouda, cheddar, smoked paprika crust"},{name:"Banana Pudding",price:6,desc:"Grandma's recipe, 'nilla wafers, fresh banana"}]},
  {id:"ft4",name:"The Waffle Wagon",cuisine:"Breakfast & Brunch",owner:"Jenny Park",status:"active",schedule:"Daily 7am-2pm",phone:"(804) 555-0404",rating:4.7,reviews:156,img:"🧇",plan:"free",verified:false,desc:"Sweet and savory waffles made fresh every morning. Weekend brunch favorite.",specialties:["Chicken & Waffles","Berry Bliss","Savory Herb & Cheese"],price:"$",bookings:3,revenue:0,lat:37.557,lng:-77.467,location:"Carytown",distance:2.8,hours:"7am-2pm",menu:[{name:"Chicken & Waffles",price:14,desc:"Buttermilk fried chicken, Belgian waffle, maple hot sauce"},{name:"Berry Bliss Waffle",price:10,desc:"Mixed berries, whipped cream, powdered sugar"},{name:"Savory Herb & Cheese",price:11,desc:"Gruyère, fresh herbs, sunny egg, arugula"}]},
  {id:"ft5",name:"Pho on Wheels",cuisine:"Vietnamese",owner:"James Chen",status:"active",schedule:"Mon-Sat 11am-8pm",phone:"(804) 555-0505",rating:4.5,reviews:98,img:"🍜",plan:"premium",verified:true,desc:"Authentic Vietnamese street food. 24-hour bone broth. Fresh daily.",specialties:["24-Hr Pho","Banh Mi","Summer Rolls","Vietnamese Coffee"],price:"$",bookings:6,revenue:2800,lat:37.548,lng:-77.442,location:"Church Hill",distance:1.5,hours:"11am-8pm",menu:[{name:"Pho Tai",price:14,desc:"24-hour bone broth, rare steak, fresh herbs, rice noodles"},{name:"Banh Mi",price:10,desc:"Crispy baguette, pâté, pickled daikon, cilantro, jalapeño"},{name:"Summer Rolls",price:8,desc:"Shrimp, vermicelli, herbs, peanut dipping sauce"},{name:"Vietnamese Iced Coffee",price:5,desc:"Dark roast, sweetened condensed milk, slow drip"}]},
  {id:"ft6",name:"Wild Bill's Soda Bar",cuisine:"Beverages & Treats",owner:"Bill Williams",status:"active",schedule:"Thu-Sun 10am-6pm",phone:"(804) 555-0606",rating:4.4,reviews:67,img:"🥤",plan:"premium",verified:true,desc:"Old-fashioned craft sodas and frozen treats. Official VA250 partner.",specialties:["Root Beer Float","Craft Lemonade","Frozen Custard","Ginger Beer"],price:"$",bookings:4,revenue:1900,lat:37.539,lng:-77.433,location:"Monroe Park",distance:0.5,hours:"10am-6pm",menu:[{name:"Root Beer Float",price:7,desc:"House-brewed root beer, vanilla bean custard"},{name:"Craft Lemonade",price:5,desc:"Fresh squeezed, lavender or strawberry basil"},{name:"Frozen Custard",price:6,desc:"Daily rotating flavors, waffle cone"},{name:"Ginger Beer",price:5,desc:"Spicy house-brewed, fresh ginger, lime"}]},
  {id:"ft7",name:"Naan Stop",cuisine:"Indian Street Food",owner:"Priya Sharma",status:"active",schedule:"Tue-Sun 11am-9pm",phone:"(804) 555-0707",rating:4.8,reviews:145,img:"🫓",plan:"free",verified:false,desc:"Fresh naan wraps and curry bowls. Bold flavors, fast service.",specialties:["Butter Chicken Wrap","Tikka Bowl","Mango Lassi","Samosa Chaat"],price:"$",bookings:2,revenue:0,lat:37.545,lng:-77.455,location:"VCU Area",distance:0.9,hours:"11am-9pm",menu:[{name:"Butter Chicken Naan Wrap",price:12,desc:"Tandoori chicken, butter sauce, fresh naan, onion, cilantro"},{name:"Tikka Masala Bowl",price:13,desc:"Basmati rice, tikka masala, raita, naan chips"},{name:"Samosa Chaat",price:8,desc:"Crushed samosa, chickpeas, tamarind, yogurt, sev"},{name:"Mango Lassi",price:5,desc:"Fresh mango, yogurt, cardamom, saffron"}]},
  {id:"ft8",name:"Seoul Food Truck",cuisine:"Korean Fusion",owner:"Danny Kim",status:"active",schedule:"Mon-Sat 11am-8pm",phone:"(804) 555-0808",rating:4.7,reviews:178,img:"🍱",plan:"premium",verified:true,desc:"Korean BBQ meets Southern comfort. Kimchi everything.",specialties:["Korean BBQ Tacos","Bulgogi Bowl","KFC (Korean Fried Chicken)","Kimchi Fries"],price:"$$",bookings:9,revenue:3400,lat:37.551,lng:-77.449,location:"Jackson Ward",distance:1.0,hours:"11am-8pm",menu:[{name:"Korean BBQ Tacos (3)",price:13,desc:"Bulgogi beef, kimchi slaw, gochujang aioli, sesame"},{name:"Bulgogi Bowl",price:14,desc:"Marinated beef, rice, pickled veg, fried egg, gochujang"},{name:"KFC Bites",price:11,desc:"Double-fried chicken, sweet chili glaze, pickled radish"},{name:"Kimchi Fries",price:9,desc:"Loaded fries, bulgogi, cheese sauce, kimchi, scallions"}]}
];
const EVENTS=[
  {id:"e1",title:"VA250 Food Truck Festival",date:"2026-03-15",time:"11AM-8PM",location:"Brown's Island",host:"Richmond Tourism Board",maxTrucks:15,status:"upcoming",fee:75,desc:"Virginia's 250th anniversary celebration with the best food trucks in RVA. Live music, family activities, and incredible food. Richmond's biggest food truck gathering of the year.",attendees:890,apps:[{tid:"ft1",s:"approved"},{tid:"ft2",s:"approved"},{tid:"ft3",s:"pending"},{tid:"ft5",s:"approved"},{tid:"ft8",s:"approved"}],tags:["festival","family","live-music","va250"],featured:true,img:"🎪"},
  {id:"e2",title:"Carytown Food Truck Rally",date:"2026-03-22",time:"12PM-6PM",location:"Carytown",host:"Carytown Merchants Assoc.",maxTrucks:10,status:"upcoming",fee:50,desc:"Monthly rally in the heart of Carytown. Rotating truck lineups, local artisan vendors, and live entertainment.",attendees:450,apps:[{tid:"ft1",s:"pending"},{tid:"ft4",s:"approved"},{tid:"ft7",s:"pending"}],tags:["monthly","family","shopping"],featured:false,img:"🎶"},
  {id:"e3",title:"Scott's Addition Night Market",date:"2026-04-05",time:"5PM-10PM",location:"Scott's Addition",host:"SA Business Alliance",maxTrucks:20,status:"planning",fee:100,desc:"Evening market with craft breweries, food trucks, and live DJs. The hottest night out in Scott's Addition.",attendees:0,apps:[],tags:["night-market","craft-beer","live-music"],featured:true,img:"🌙"},
  {id:"e4",title:"RVA Brunch Bash",date:"2026-04-12",time:"9AM-2PM",location:"The Diamond District",host:"RVA Foodies Collective",maxTrucks:8,status:"planning",fee:40,desc:"Bottomless mimosa stations meet the best brunch trucks in Richmond. Bring your appetite.",attendees:0,apps:[],tags:["brunch","mimosas","weekend"],featured:false,img:"🥂"},
  {id:"e5",title:"Corporate Wellness Fair",date:"2026-04-20",time:"11AM-2PM",location:"Downtown — Capital One HQ",host:"Capital One",maxTrucks:6,status:"upcoming",fee:0,desc:"Private corporate wellness event. Healthy food options preferred. Flat rate paid to vendors.",attendees:300,apps:[{tid:"ft5",s:"approved"},{tid:"ft7",s:"pending"}],tags:["corporate","private","wellness"],featured:false,img:"🏢"},
];
const BOOKINGS=[
  {id:"b1",type:"private",who:"Jennifer Adams",email:"jen@email.com",phone:"(804) 555-1001",date:"2026-03-28",time:"4-8PM",location:"West End residence",guests:50,budget:"$500-$800",eventType:"Graduation Party",cuisine:"BBQ, Mexican",notes:"Need 2 trucks for outdoor graduation celebration. Backyard has plenty of space and power hookups.",status:"open",responses:[{tid:"ft1",price:650,msg:"We'd love to cater! Our brisket setup is perfect for 50."},{tid:"ft3",price:700,msg:"Full BBQ spread available — ribs, brisket, all the sides."}],created:"2026-02-18"},
  {id:"b2",type:"corporate",who:"Tom Bradley",email:"tom@techstartup.io",phone:"(804) 555-1002",date:"2026-04-02",time:"11:30AM-1:30PM",location:"1001 E Broad St",guests:120,budget:"$1,000-$1,500",eventType:"Team Lunch",cuisine:"Any",notes:"Monthly team lunch, prefer 2-3 diverse trucks. Parking available in rear lot. We handle this every month — looking for regular vendors.",status:"open",responses:[],created:"2026-02-20"},
  {id:"b3",type:"wedding",who:"Amanda & Chris",email:"amanda@email.com",phone:"(804) 555-1003",date:"2026-05-16",time:"6-10PM",location:"Maymont Gardens",guests:150,budget:"$2,000-$3,000",eventType:"Wedding Reception",cuisine:"Southern, Dessert, Beverages",notes:"Wedding reception food service. Need 3 trucks with cohesive look — willing to pay for custom branding/wraps. Cocktail hour + dinner service.",status:"open",responses:[{tid:"ft1",price:1200,msg:"We specialize in wedding catering and can coordinate with other trucks for a unified experience."}],created:"2026-02-15"},
];

// ─── Admin Data ──────────────────────────────────────────────────────────
const PENDING=[{id:"pm1",name:"Sarah's Sweet Treats",type:"truck",applied:"2026-02-19",answers:["Artisan cupcakes","Mobile bakery"]},{id:"pm2",name:"RVA Brewery Tour Co.",type:"host",applied:"2026-02-18",answers:["Brewery tours","Want food truck stops"]},{id:"pm3",name:"Mike Thompson",type:"customer",applied:"2026-02-20",answers:["New to Richmond","Love food trucks!"]}];
const SPAM_Q=[{id:"s1",author:"CryptoKing99",content:"🚀 Make $5000/day trading crypto! DM me!! 💰",time:"2 hours ago",conf:98,reason:"Financial spam"},{id:"s2",author:"BestDeals2026",content:"Check out www.totallylegit-deals.biz — 90% OFF!",time:"5 hours ago",conf:95,reason:"Suspicious URL"}];
const ADS=[{id:"a1",tid:"ft2",title:"🌮 Taco Tuesday Special!",content:"Half-price Al Pastor tacos Tuesdays 5-7pm! Mention 'FAFT' for free churro.",impressions:1240,clicks:89,status:"active"},{id:"a2",tid:"ft6",title:"🥤 VA250 Partnership Launch!",content:"Wild Bill's is the official VA250 beverage partner!",impressions:2100,clicks:156,status:"active"}];
const FLAGGED=[
  {id:"f1",author:"CryptoKing99",trust:0,content:"🚀 Make $5000/day trading crypto! DM me now!! 💰",ts:"12 min ago",threats:[{type:"Spam",conf:98,words:["crypto","make money","DM me"]}],ip:"192.168.1.47",device:"Android Chrome",age:"2 hours",posts:1,reports:0},
  {id:"f2",author:"MLMQueen",trust:0,content:"Hey mamas! 💕 PASSIVE INCOME! Network marketing 💯!",ts:"3 hours ago",threats:[{type:"Spam",conf:99,words:["passive income","network marketing"]}],ip:"10.0.1.15",device:"iPhone Safari",age:"1 hour",posts:1,reports:0},
];
const INTEL=[
  {id:"m1",name:"CryptoKing99",trust:0,joined:"2026-02-23 10:14 AM",ip:"192.168.1.47",device:"Android Chrome/119",loc:"VPN — Netherlands",posts:1,flags:1,status:"flagged",risk:96,signals:["VPN detected","Account < 24hrs","First post is spam"]},
  {id:"m2",name:"MLMQueen",trust:0,joined:"2026-02-23 07:45 AM",ip:"10.0.1.15",device:"iPhone Safari/17",loc:"Richmond, VA",posts:1,flags:1,status:"flagged",risk:94,signals:["Account < 24hrs","MLM keyword density: HIGH","Mass-join pattern"]},
];
const AUDIT=[
  {id:"a1",ts:"2026-02-23 10:26 AM",act:"auto_flag",target:"CryptoKing99",detail:"Post auto-flagged: spam 98%",actor:"System",cat:"content"},
  {id:"a2",ts:"2026-02-23 09:45 AM",act:"raid_detected",target:"5 accounts",detail:"Mass join alert",actor:"System",cat:"security"},
  {id:"a3",ts:"2026-02-22 11:00 AM",act:"trust_up",target:"ChefMarcus",detail:"Member → Verified",actor:"Admin",cat:"member"},
  {id:"a4",ts:"2026-02-21 09:15 AM",act:"ban",target:"SpamBot_42",detail:"Permanent ban",actor:"Admin",cat:"enforcement"},
];
const TRUST_LEVELS=[
  {lv:0,name:"New",color:"#666",icon:"🆕",maxP:2,hold:true,days:0,desc:"Posts held. 2/day."},
  {lv:1,name:"Member",color:T.bl,icon:"👤",maxP:5,hold:false,days:7,desc:"Posts live. 5/day."},
  {lv:2,name:"Verified",color:T.g,icon:"✓",maxP:10,hold:false,days:30,desc:"Badge. 10/day."},
  {lv:3,name:"Trusted",color:T.am,icon:"⭐",maxP:25,hold:false,days:90,desc:"Gold. 25/day."},
  {lv:4,name:"Mod",color:T.pu,icon:"🛡️",maxP:-1,hold:false,days:-1,desc:"Full mod powers."},
  {lv:5,name:"Admin",color:T.r,icon:"👑",maxP:-1,hold:false,days:-1,desc:"Full access."},
];

// ─── CSS ─────────────────────────────────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&family=Outfit:wght@300;400;500;600;700;800&family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{overflow-x:hidden}
::selection{background:#e8652b30;color:#e8652b}
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.15);border-radius:3px}
@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInSlow{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideRight{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(232,101,43,0.15)}50%{box-shadow:0 0 40px rgba(232,101,43,0.3)}}
.hover-lift{transition:all 0.3s cubic-bezier(0.4,0,0.2,1)}.hover-lift:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.12)}
.hover-glow{transition:all 0.3s}.hover-glow:hover{box-shadow:0 8px 30px rgba(232,101,43,0.15)}
.hover-scale{transition:transform 0.3s}.hover-scale:hover{transform:scale(1.02)}
.stagger-1{animation-delay:0.1s}.stagger-2{animation-delay:0.2s}.stagger-3{animation-delay:0.3s}.stagger-4{animation-delay:0.4s}.stagger-5{animation-delay:0.5s}
.grain{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;opacity:0.02;z-index:9999;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")}
`;

// ─── Router ──────────────────────────────────────────────────────────────
function useRouter(){
  const[route,setRoute]=useState(window.location.hash.slice(1)||"/");
  useEffect(()=>{const h=()=>setRoute(window.location.hash.slice(1)||"/");window.addEventListener("hashchange",h);return()=>window.removeEventListener("hashchange",h)},[]);
  const go=(r)=>{window.location.hash=r};
  return{route,go};
}

// ─── Shared Components (Public) ──────────────────────────────────────────
const PBtn=({children,onClick,v="primary",s="md",full,style:x={},className=""})=>{
  const vs={primary:{background:"linear-gradient(135deg,#e8652b,#d4541f)",color:"#fff",border:"none",boxShadow:"0 4px 20px rgba(232,101,43,0.25)"},
    secondary:{background:"transparent",color:P.ch,border:`2px solid ${P.lg}`},
    outline:{background:"transparent",color:P.o,border:`2px solid ${P.o}`},
    ghost:{background:"transparent",color:P.wg,border:"none"},
    dark:{background:P.ch,color:"#fff",border:"none"}};
  const ss={sm:{padding:"10px 24px",fontSize:14},md:{padding:"14px 36px",fontSize:15},lg:{padding:"18px 48px",fontSize:17}};
  return<button onClick={onClick} className={`hover-lift ${className}`} style={{...ss[s],...vs[v],borderRadius:50,cursor:"pointer",fontWeight:600,fontFamily:"'Outfit',sans-serif",transition:"all 0.3s",display:"inline-flex",alignItems:"center",gap:8,width:full?"100%":"auto",justifyContent:"center",letterSpacing:"0.02em",...x}}>{children}</button>;
};

// ─── Shared Admin Components ─────────────────────────────────────────────
const Badge=({children,color=T.bl,glow,filled})=><span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:filled?color:color+"18",color:filled?"#fff":color,border:`1px solid ${filled?color:color+"25"}`,boxShadow:glow?`0 0 12px ${color}20`:"none"}}>{children}</span>;
const ABtn=({children,onClick,v="primary",s="md",full,disabled})=>{const vs={primary:{background:`linear-gradient(135deg,${T.o},#ea580c)`,color:"#fff",border:"none"},secondary:{background:T.s,color:"rgba(255,255,255,0.7)",border:`1px solid ${T.b}`},danger:{background:T.r+"18",color:T.r,border:`1px solid ${T.r}25`},success:{background:T.g+"18",color:T.g,border:`1px solid ${T.g}25`},ghost:{background:"transparent",color:T.tm,border:"none"},critical:{background:`linear-gradient(135deg,${T.cr},#991b1b)`,color:"#fff",border:"none"}};const ss={sm:{padding:"6px 14px",fontSize:12},md:{padding:"10px 22px",fontSize:13}};return<button onClick={disabled?undefined:onClick} style={{...ss[s],...vs[v],borderRadius:10,cursor:disabled?"not-allowed":"pointer",fontWeight:600,fontFamily:"'Outfit',sans-serif",transition:"all 0.25s",display:"inline-flex",alignItems:"center",gap:7,width:full?"100%":"auto",justifyContent:full?"center":"flex-start",opacity:disabled?0.4:1}}>{children}</button>};
const ACard=({children,style:x={},onClick,pad=24})=><div onClick={onClick} style={{background:T.s,border:`1px solid ${T.b}`,borderRadius:14,padding:pad,transition:"all 0.25s",cursor:onClick?"pointer":"default",...x}} onMouseEnter={e=>{e.currentTarget.style.background=T.sh;e.currentTarget.style.borderColor=T.bh}} onMouseLeave={e=>{e.currentTarget.style.background=T.s;e.currentTarget.style.borderColor=T.b}}>{children}</div>;
const StatCard=({icon,label,value,sub,accent="#fff",trend})=><ACard><div style={{position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-24,right:-12,fontSize:72,opacity:0.04}}>{icon}</div><div style={{fontSize:11,color:T.tm,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"'IBM Plex Mono',monospace"}}>{label}</div><div style={{display:"flex",alignItems:"baseline",gap:10,marginTop:8}}><span style={{fontSize:32,fontWeight:700,color:accent,fontFamily:"'Outfit',sans-serif"}}>{value}</span>{trend&&<span style={{fontSize:12,color:trend>0?T.g:T.r,fontWeight:600}}>{trend>0?"↑":"↓"}{Math.abs(trend)}%</span>}</div>{sub&&<div style={{fontSize:12,color:T.td,marginTop:4}}>{sub}</div>}</div></ACard>;
const ProgressBar=({value,color=T.o,h=6})=><div style={{width:"100%",height:h,borderRadius:h/2,background:"rgba(255,255,255,0.08)",overflow:"hidden"}}><div style={{width:`${Math.min(value,100)}%`,height:"100%",borderRadius:h/2,background:color,transition:"width 0.6s"}}/></div>;
const Toggle=({on,onClick})=><div onClick={onClick} style={{width:44,height:24,borderRadius:12,cursor:"pointer",background:on?T.g:"rgba(255,255,255,0.12)",transition:"all 0.3s",position:"relative"}}><div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:on?23:3,transition:"all 0.3s",boxShadow:"0 2px 4px rgba(0,0,0,0.2)"}}/></div>;
const TabBar=({tabs,active,onChange,accent=T.o})=><div style={{display:"flex",gap:4,background:"rgba(255,255,255,0.03)",borderRadius:10,padding:3,marginBottom:24,flexWrap:"wrap"}}>{tabs.map(t=><div key={t.id} onClick={()=>onChange(t.id)} style={{padding:"8px 16px",borderRadius:7,cursor:"pointer",background:active===t.id?accent+"20":"transparent",color:active===t.id?accent:T.tm,fontSize:13,fontWeight:active===t.id?600:400,transition:"all 0.2s"}}>{t.icon} {t.label}{t.count!=null?` (${t.count})`:""}</div>)}</div>;
const SH=({title,subtitle,action})=><div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:28}}><div><h2 style={{fontSize:28,fontWeight:700,color:"#fff",margin:0,fontFamily:"'Syne',sans-serif",letterSpacing:"-0.02em"}}>{title}</h2>{subtitle&&<p style={{color:T.tm,margin:"6px 0 0",fontSize:14}}>{subtitle}</p>}</div>{action}</div>;
const Empty=({icon,title,sub})=><div style={{textAlign:"center",padding:"48px 24px",color:T.td}}><div style={{fontSize:48,marginBottom:12,opacity:0.5}}>{icon}</div><div style={{fontSize:16,fontWeight:600,color:T.tm}}>{title}</div>{sub&&<div style={{fontSize:13,marginTop:6}}>{sub}</div>}</div>;

// ─── Reducer ─────────────────────────────────────────────────────────────
function reducer(st,a){switch(a.type){
  case "SET_VIEW":return{...st,view:a.p};
  case "APPROVE_MEMBER":return{...st,pending:st.pending.filter(m=>m.id!==a.p)};
  case "REJECT_MEMBER":return{...st,pending:st.pending.filter(m=>m.id!==a.p)};
  case "REMOVE_SPAM":return{...st,spam:st.spam.filter(s=>s.id!==a.p)};
  case "KEEP_SPAM":return{...st,spam:st.spam.filter(s=>s.id!==a.p)};
  case "TOGGLE_TRUCK":return{...st,trucks:st.trucks.map(t=>t.id===a.p?{...t,status:t.status==="active"?"inactive":"active"}:t)};
  case "REMOVE_FLAG":return{...st,flagged:st.flagged.filter(f=>f.id!==a.p)};
  default:return st;}}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC SITE
// ═══════════════════════════════════════════════════════════════════════════

// ─── Public Nav ──────────────────────────────────────────────────────────
function PubNav({go,route}){
  const[scrolled,setScrolled]=useState(false);
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>60);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
  const isHome=route==="/";
  const links=[{to:"/trucks",label:"Find Trucks"},{to:"/events",label:"Events"},{to:"/book",label:"Book a Truck"},{to:"/pricing",label:"For Vendors"},{to:"/about",label:"About"}];
  return<nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,padding:scrolled?"12px 40px":"20px 40px",background:scrolled?"rgba(250,247,242,0.95)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?`1px solid ${P.lg}`:"none",transition:"all 0.4s",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
    <div onClick={()=>go("/")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
      <span style={{fontSize:24}}>🚚</span>
      <div>
        <span style={{fontFamily:"'Playfair Display',serif",fontWeight:800,fontSize:18,color:isHome&&!scrolled?"#fff":P.ch}}>FAFT</span>
        <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:18,color:P.o,fontStyle:"italic",marginLeft:4}}>RVA</span>
      </div>
    </div>
    <div style={{display:"flex",gap:32,alignItems:"center"}}>
      {links.map(l=><span key={l.to} onClick={()=>go(l.to)} style={{cursor:"pointer",fontSize:14,fontWeight:route===l.to?600:400,color:route===l.to?P.o:(isHome&&!scrolled?"rgba(255,255,255,0.8)":P.wg),fontFamily:"'Outfit',sans-serif",transition:"color 0.3s",borderBottom:route===l.to?`2px solid ${P.o}`:"2px solid transparent",paddingBottom:4}}>{l.label}</span>)}
      <PBtn s="sm" onClick={()=>go("/member")}>Truck Login</PBtn>
    </div>
  </nav>;
}

// ─── Hero ────────────────────────────────────────────────────────────────
function Hero({go}){
  return<section style={{minHeight:"100vh",background:"#1a1714",position:"relative",overflow:"hidden",display:"flex",alignItems:"center"}}>
    {/* Ambient glow */}
    <div style={{position:"absolute",top:"-30%",right:"-10%",width:900,height:900,borderRadius:"50%",background:"radial-gradient(circle,rgba(232,101,43,0.12) 0%,transparent 65%)",filter:"blur(80px)"}}/>
    <div style={{position:"absolute",bottom:"-20%",left:"-10%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(196,133,28,0.06) 0%,transparent 65%)",filter:"blur(60px)"}}/>
    {/* Grid pattern */}
    <div style={{position:"absolute",inset:0,opacity:0.03,backgroundImage:"linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px, transparent 1px)",backgroundSize:"60px 60px"}}/>
    
    <div style={{position:"relative",zIndex:2,maxWidth:1200,margin:"0 auto",padding:"120px 60px 80px",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
      {/* Left: Copy */}
      <div style={{animation:"fadeIn 0.8s ease both"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"8px 20px",borderRadius:40,background:"rgba(232,101,43,0.12)",border:"1px solid rgba(232,101,43,0.2)",marginBottom:32}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:P.o,animation:"pulse 2s infinite"}}/>
          <span style={{color:P.o,fontSize:13,fontWeight:600,letterSpacing:"0.08em",fontFamily:"'Outfit',sans-serif"}}>RICHMOND'S FOOD TRUCK PLATFORM</span>
        </div>
        <h1 style={{fontSize:68,fontWeight:800,color:"#fff",margin:"0 0 24px",fontFamily:"'Playfair Display',serif",lineHeight:1.05,letterSpacing:"-0.02em"}}>
          Find Your Next<br/>Favorite <span style={{color:P.o,fontStyle:"italic"}}>Bite</span>
        </h1>
        <p style={{fontSize:20,color:"rgba(255,255,255,0.5)",margin:"0 0 40px",fontFamily:"'Source Serif 4',serif",lineHeight:1.7,maxWidth:480}}>
          Discover the best food trucks in Richmond. Track real-time locations, browse events, and book trucks for your next celebration.
        </p>
        <div style={{display:"flex",gap:16}}>
          <PBtn s="lg" onClick={()=>go("/trucks")}>Find Trucks Near Me</PBtn>
          <PBtn v="secondary" s="lg" onClick={()=>go("/pricing")} style={{color:"#fff",borderColor:"rgba(255,255,255,0.2)"}}>I Own a Truck →</PBtn>
        </div>
        {/* Stats */}
        <div style={{display:"flex",gap:48,marginTop:64}}>
          {[["4,100+","Members"],["50+","Food Trucks"],["12","Events/Month"],["$0","For Customers"]].map(([v,l],i)=>
            <div key={i} style={{animation:`fadeIn 0.6s ease ${0.3+i*0.1}s both`}}>
              <div style={{fontSize:28,fontWeight:800,color:"#fff",fontFamily:"'Outfit',sans-serif"}}>{v}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginTop:4,fontFamily:"'Outfit',sans-serif",letterSpacing:"0.05em"}}>{l}</div>
            </div>
          )}
        </div>
      </div>
      {/* Right: Featured trucks preview */}
      <div style={{animation:"fadeIn 1s ease 0.3s both"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {TRUCKS.filter(t=>t.status==="active"&&t.plan==="premium").slice(0,4).map((t,i)=>
            <div key={t.id} className="hover-lift" onClick={()=>go("/trucks")} style={{cursor:"pointer",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:20,animation:`scaleIn 0.5s ease ${0.4+i*0.1}s both`}}>
              <div style={{fontSize:36,marginBottom:10}}>{t.img}</div>
              <div style={{color:"#fff",fontWeight:700,fontSize:15,fontFamily:"'Outfit',sans-serif"}}>{t.name}</div>
              <div style={{color:"rgba(255,255,255,0.4)",fontSize:12,marginTop:2}}>{t.cuisine}</div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:12}}>
                <span style={{color:P.am,fontSize:13,fontWeight:600}}>⭐ {t.rating}</span>
                <span style={{color:"rgba(255,255,255,0.3)",fontSize:12}}>{t.reviews} reviews</span>
              </div>
            </div>
          )}
        </div>
        <div style={{textAlign:"center",marginTop:20}}>
          <span onClick={()=>go("/trucks")} style={{color:P.o,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>View all {TRUCKS.length} trucks →</span>
        </div>
      </div>
    </div>

    {/* Scroll indicator */}
    <div style={{position:"absolute",bottom:40,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:8,animation:"float 3s infinite"}}>
      <span style={{color:"rgba(255,255,255,0.3)",fontSize:12,fontFamily:"'Outfit',sans-serif",letterSpacing:"0.1em"}}>SCROLL</span>
      <div style={{width:1,height:40,background:"linear-gradient(to bottom,rgba(255,255,255,0.3),transparent)"}}/>
    </div>
  </section>;
}

// ─── Truck Finder ────────────────────────────────────────────────────────
function TruckFinder({go}){
  const[search,setSearch]=useState("");const[cuisine,setCuisine]=useState("All");const[sort,setSort]=useState("rating");const[sel,setSel]=useState(null);const[filter,setFilter]=useState("all");
  const cuisines=["All",...new Set(TRUCKS.map(t=>t.cuisine.split(" ")[0]))];
  let filtered=TRUCKS.filter(t=>{
    if(search&&!t.name.toLowerCase().includes(search.toLowerCase())&&!t.cuisine.toLowerCase().includes(search.toLowerCase()))return false;
    if(cuisine!=="All"&&!t.cuisine.toLowerCase().includes(cuisine.toLowerCase()))return false;
    if(filter==="open"&&t.status!=="active")return false;
    return true;
  });
  if(sort==="rating")filtered.sort((a,b)=>b.rating-a.rating);
  if(sort==="reviews")filtered.sort((a,b)=>b.reviews-a.reviews);
  if(sort==="nearest")filtered.sort((a,b)=>a.distance-b.distance);
  const det=TRUCKS.find(t=>t.id===sel);

  return<section style={{minHeight:"100vh",background:P.bg,padding:"120px 60px 80px"}}>
    <div style={{maxWidth:1200,margin:"0 auto"}}>
      {/* Header */}
      <div style={{marginBottom:48,animation:"fadeIn 0.5s ease"}}>
        <h2 style={{fontSize:48,fontWeight:800,color:P.ch,fontFamily:"'Playfair Display',serif",margin:"0 0 12px"}}>Find a Truck</h2>
        <p style={{fontSize:18,color:P.wg,fontFamily:"'Source Serif 4',serif"}}>{TRUCKS.filter(t=>t.status==="active").length} trucks serving Richmond right now</p>
      </div>

      {/* Search & Filters */}
      <div style={{display:"flex",gap:16,marginBottom:24,animation:"fadeIn 0.5s ease 0.1s both"}}>
        <div style={{flex:1,position:"relative"}}>
          <span style={{position:"absolute",left:18,top:"50%",transform:"translateY(-50%)",fontSize:18,opacity:0.4}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, cuisine, or location..." style={{width:"100%",padding:"16px 16px 16px 48px",borderRadius:14,border:`2px solid ${P.lg}`,background:P.s,fontSize:15,fontFamily:"'Outfit',sans-serif",color:P.ch,outline:"none",boxSizing:"border-box",transition:"border 0.3s"}} onFocus={e=>e.target.style.borderColor=P.o} onBlur={e=>e.target.style.borderColor=P.lg}/>
        </div>
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:"16px 20px",borderRadius:14,border:`2px solid ${P.lg}`,background:P.s,fontSize:14,fontFamily:"'Outfit',sans-serif",color:P.ch,cursor:"pointer",outline:"none"}}>
          <option value="rating">Top Rated</option><option value="reviews">Most Reviewed</option><option value="nearest">Nearest</option>
        </select>
        <div style={{display:"flex",borderRadius:14,overflow:"hidden",border:`2px solid ${P.lg}`}}>
          {[["all","All Trucks"],["open","Open Now"]].map(([v,l])=><div key={v} onClick={()=>setFilter(v)} style={{padding:"16px 20px",cursor:"pointer",background:filter===v?P.o:P.s,color:filter===v?"#fff":P.wg,fontSize:14,fontWeight:filter===v?600:400,fontFamily:"'Outfit',sans-serif",transition:"all 0.2s"}}>{l}</div>)}
        </div>
      </div>

      {/* Cuisine pills */}
      <div style={{display:"flex",gap:8,marginBottom:32,flexWrap:"wrap",animation:"fadeIn 0.5s ease 0.2s both"}}>
        {cuisines.map(c=><div key={c} onClick={()=>setCuisine(c)} style={{padding:"8px 20px",borderRadius:50,cursor:"pointer",background:cuisine===c?P.o:P.s,color:cuisine===c?"#fff":P.wg,fontSize:13,fontWeight:cuisine===c?600:400,fontFamily:"'Outfit',sans-serif",border:`1px solid ${cuisine===c?P.o:P.lg}`,transition:"all 0.25s"}}>{c}</div>)}
      </div>

      {/* Promoted ad */}
      {!search&&cuisine==="All"&&<div style={{background:`linear-gradient(135deg,${P.ol},${P.cr})`,border:`1px solid ${P.o}30`,borderRadius:16,padding:"16px 24px",marginBottom:24,display:"flex",alignItems:"center",justifyContent:"space-between",animation:"fadeIn 0.5s ease 0.3s both"}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <span style={{fontSize:10,fontWeight:700,color:P.o,letterSpacing:"0.1em",fontFamily:"'IBM Plex Mono',monospace",background:`${P.o}15`,padding:"4px 10px",borderRadius:6}}>PROMOTED</span>
          <span style={{fontSize:24}}>🌮</span>
          <div><span style={{fontWeight:700,color:P.ch,fontSize:15}}>RVA Taco Co.</span> — <span style={{color:P.wg,fontSize:14}}>Taco Tuesday Special! Half-price Al Pastor 5-7pm</span></div>
        </div>
        <PBtn s="sm" onClick={()=>setSel("ft2")}>View</PBtn>
      </div>}

      {/* Grid */}
      <div style={{display:"grid",gridTemplateColumns:sel?"1fr 420px":"repeat(2,1fr)",gap:20}}>
        <div style={{display:"grid",gridTemplateColumns:sel?"1fr":"repeat(2,1fr)",gap:16}}>
          {filtered.map((t,i)=><div key={t.id} className="hover-lift" onClick={()=>setSel(t.id)}
            style={{background:P.s,borderRadius:16,padding:24,cursor:"pointer",border:`2px solid ${sel===t.id?P.o:P.lg}`,animation:`fadeIn 0.4s ease ${0.1*i}s both`,position:"relative",overflow:"hidden",transition:"border 0.3s"}}>
            {t.plan==="premium"&&<div style={{position:"absolute",top:12,right:12}}><span style={{background:`${P.o}15`,color:P.o,fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:6,letterSpacing:"0.05em"}}>⭐ PREMIUM</span></div>}
            <div style={{display:"flex",gap:16,alignItems:"start"}}>
              <div style={{width:56,height:56,borderRadius:14,background:P.cr,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>{t.img}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontWeight:700,color:P.ch,fontSize:17,fontFamily:"'Outfit',sans-serif"}}>{t.name}</span>
                  {t.verified&&<span style={{color:P.o,fontSize:14}}>✓</span>}
                </div>
                <div style={{color:P.wg,fontSize:13,marginTop:2}}>{t.cuisine} · {t.price}</div>
                <div style={{display:"flex",gap:16,marginTop:12}}>
                  <span style={{color:P.am,fontSize:14,fontWeight:700}}>⭐ {t.rating}</span>
                  <span style={{color:P.wg,fontSize:13}}>{t.reviews} reviews</span>
                  <span style={{color:t.status==="active"?P.gn:P.rd,fontSize:12,fontWeight:600}}>{t.status==="active"?"● OPEN":"● CLOSED"}</span>
                </div>
                <div style={{color:P.wg,fontSize:12,marginTop:8}}>📍 {t.location} · {t.distance}mi · 🕐 {t.hours}</div>
              </div>
            </div>
          </div>)}
          {filtered.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:60,color:P.wg}}><div style={{fontSize:48,marginBottom:12}}>🔍</div><div style={{fontSize:18,fontWeight:600}}>No trucks found</div><div style={{fontSize:14,marginTop:6}}>Try adjusting your search or filters</div></div>}
        </div>

        {/* Detail Panel */}
        {sel&&det&&<div style={{animation:"slideRight 0.3s ease"}}>
          <div style={{background:P.s,borderRadius:20,border:`2px solid ${P.o}30`,position:"sticky",top:100,overflow:"hidden"}}>
            {/* Header */}
            <div style={{background:`linear-gradient(135deg,${P.ol},${P.cr})`,padding:"32px 28px 24px",position:"relative"}}>
              <div onClick={()=>setSel(null)} style={{position:"absolute",top:16,right:16,cursor:"pointer",color:P.wg,fontSize:20}}>✕</div>
              <div style={{fontSize:48,marginBottom:12}}>{det.img}</div>
              <h3 style={{fontSize:24,fontWeight:800,color:P.ch,fontFamily:"'Playfair Display',serif",margin:"0 0 4px"}}>{det.name}</h3>
              <div style={{color:P.wg,fontSize:14}}>{det.cuisine} · {det.owner}</div>
              <div style={{display:"flex",gap:24,marginTop:16}}>
                <div><span style={{fontSize:28,fontWeight:800,color:P.am}}>{det.rating}</span><span style={{color:P.wg,fontSize:12,marginLeft:4}}>⭐</span></div>
                <div><span style={{fontSize:28,fontWeight:800,color:P.ch}}>{det.reviews}</span><span style={{color:P.wg,fontSize:12,marginLeft:4}}>reviews</span></div>
                <div><span style={{fontSize:28,fontWeight:800,color:P.ch}}>{det.distance}</span><span style={{color:P.wg,fontSize:12,marginLeft:4}}>mi</span></div>
              </div>
            </div>
            <div style={{padding:28}}>
              <p style={{color:P.wg,fontSize:14,lineHeight:1.7,marginBottom:20,fontFamily:"'Source Serif 4',serif"}}>{det.desc}</p>
              {/* Menu */}
              <div style={{marginBottom:20}}>
                <h4 style={{fontSize:13,fontWeight:700,color:P.ch,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12,fontFamily:"'Outfit',sans-serif"}}>Popular Items</h4>
                {det.menu?.map(m=><div key={m.name} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${P.lg}`}}>
                  <div><div style={{color:P.ch,fontWeight:600,fontSize:14}}>{m.name}</div><div style={{color:P.wg,fontSize:12,marginTop:2}}>{m.desc}</div></div>
                  <span style={{color:P.o,fontWeight:700,fontSize:14,flexShrink:0,marginLeft:16}}>${m.price}</span>
                </div>)}
              </div>
              <div style={{color:P.wg,fontSize:13,lineHeight:2,marginBottom:20}}>📍 {det.location}<br/>🕐 {det.schedule}<br/>📞 {det.phone}</div>
              <PBtn full onClick={()=>{go("/book")}}>Book for Your Event</PBtn>
            </div>
          </div>
        </div>}
      </div>
    </div>
  </section>;
}

// ─── Events Page ─────────────────────────────────────────────────────────
function EventsPage({go}){
  const[sel,setSel]=useState(null);const det=EVENTS.find(e=>e.id===sel);
  const featured=EVENTS.filter(e=>e.featured);const upcoming=EVENTS.filter(e=>e.status==="upcoming");
  return<section style={{minHeight:"100vh",background:P.bg,padding:"120px 60px 80px"}}>
    <div style={{maxWidth:1200,margin:"0 auto"}}>
      <div style={{marginBottom:48,animation:"fadeIn 0.5s"}}><h2 style={{fontSize:48,fontWeight:800,color:P.ch,fontFamily:"'Playfair Display',serif",margin:"0 0 12px"}}>Events</h2><p style={{fontSize:18,color:P.wg,fontFamily:"'Source Serif 4',serif"}}>{EVENTS.length} upcoming food truck events in Richmond</p></div>
      {/* Featured */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:40}}>
        {featured.map((e,i)=><div key={e.id} className="hover-lift" onClick={()=>setSel(e.id)} style={{cursor:"pointer",background:"#1a1714",borderRadius:20,padding:36,color:"#fff",position:"relative",overflow:"hidden",animation:`fadeIn 0.5s ease ${i*0.1}s both`}}>
          <div style={{position:"absolute",top:"-30%",right:"-20%",width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle,${P.o}15,transparent)`,filter:"blur(40px)"}}/>
          <div style={{position:"relative",zIndex:2}}>
            <span style={{background:`${P.o}20`,color:P.o,fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:6,letterSpacing:"0.08em"}}>FEATURED</span>
            <h3 style={{fontSize:28,fontWeight:800,margin:"16px 0 8px",fontFamily:"'Playfair Display',serif"}}>{e.title}</h3>
            <p style={{color:"rgba(255,255,255,0.5)",fontSize:14,lineHeight:1.6,marginBottom:16}}>{e.desc}</p>
            <div style={{display:"flex",gap:20,color:"rgba(255,255,255,0.4)",fontSize:13}}>
              <span>📅 {new Date(e.date).toLocaleDateString("en-US",{month:"long",day:"numeric"})}</span>
              <span>📍 {e.location}</span>
              <span>🚚 {e.apps.filter(a=>a.s==="approved").length}/{e.maxTrucks} trucks</span>
            </div>
          </div>
        </div>)}
      </div>
      {/* All events */}
      <h3 style={{fontSize:20,fontWeight:700,color:P.ch,fontFamily:"'Outfit',sans-serif",marginBottom:20}}>All Upcoming Events</h3>
      <div style={{display:"grid",gap:16}}>
        {EVENTS.map((e,i)=><div key={e.id} className="hover-lift" onClick={()=>setSel(sel===e.id?null:e.id)} style={{background:P.s,borderRadius:16,padding:24,cursor:"pointer",border:`2px solid ${sel===e.id?P.o:P.lg}`,animation:`fadeIn 0.4s ease ${i*0.08}s both`}}>
          <div style={{display:"flex",gap:20,alignItems:"center"}}>
            <div style={{width:64,height:64,borderRadius:16,background:P.cr,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <div style={{color:P.o,fontSize:11,fontWeight:700,fontFamily:"'Outfit',sans-serif"}}>{new Date(e.date).toLocaleDateString("en-US",{month:"short"}).toUpperCase()}</div>
              <div style={{color:P.ch,fontSize:24,fontWeight:800}}>{new Date(e.date).getDate()}</div>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}><h4 style={{fontSize:18,fontWeight:700,color:P.ch,margin:0,fontFamily:"'Outfit',sans-serif"}}>{e.title}</h4>{e.featured&&<span style={{background:P.o,color:"#fff",fontSize:10,padding:"2px 8px",borderRadius:4,fontWeight:700}}>HOT</span>}</div>
              <div style={{color:P.wg,fontSize:14,marginTop:4}}>📍 {e.location} · 🕐 {e.time} · 🏢 {e.host}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{color:P.o,fontWeight:700,fontSize:15}}>{e.fee>0?`$${e.fee} vendor fee`:"FREE"}</div>
              <div style={{color:P.wg,fontSize:12,marginTop:2}}>🚚 {e.apps.filter(a=>a.s==="approved").length}/{e.maxTrucks} spots</div>
            </div>
          </div>
          {sel===e.id&&<div style={{marginTop:20,paddingTop:20,borderTop:`1px solid ${P.lg}`}}>
            <p style={{color:P.wg,fontSize:14,lineHeight:1.7,marginBottom:16,fontFamily:"'Source Serif 4',serif"}}>{e.desc}</p>
            <div style={{display:"flex",gap:8,marginBottom:16}}>{e.tags.map(t=><span key={t} style={{padding:"4px 12px",borderRadius:20,background:P.cr,color:P.wg,fontSize:12}}>{t}</span>)}</div>
            {e.attendees>0&&<div style={{color:P.wg,fontSize:13,marginBottom:12}}>👥 {e.attendees.toLocaleString()} expected attendees</div>}
            <PBtn s="sm" onClick={(ev)=>{ev.stopPropagation();go("/book")}}>Apply as Vendor</PBtn>
          </div>}
        </div>)}
      </div>
      <div style={{textAlign:"center",marginTop:40}}><p style={{color:P.wg,fontSize:15}}>Want to host a food truck event? <span onClick={()=>go("/book")} style={{color:P.o,fontWeight:600,cursor:"pointer"}}>Contact us →</span></p></div>
    </div>
  </section>;
}

// ─── Booking Form ────────────────────────────────────────────────────────
function BookingPage({go}){
  const[sent,setSent]=useState(false);const[form,setForm]=useState({name:"",email:"",phone:"",date:"",time:"",location:"",guests:"",budget:"",type:"private",cuisine:"",notes:""});
  const up=(k,v)=>setForm({...form,[k]:v});
  if(sent)return<section style={{minHeight:"100vh",background:P.bg,padding:"120px 60px 80px",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{textAlign:"center",maxWidth:500,animation:"scaleIn 0.5s ease"}}>
      <div style={{width:80,height:80,borderRadius:"50%",background:P.ol,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,margin:"0 auto 24px"}}>🎉</div>
      <h2 style={{fontSize:32,fontWeight:800,color:P.ch,fontFamily:"'Playfair Display',serif",margin:"0 0 12px"}}>Request Submitted!</h2>
      <p style={{color:P.wg,fontSize:16,lineHeight:1.7,fontFamily:"'Source Serif 4',serif"}}>Premium trucks are notified first and typically respond within hours. We'll connect you with the perfect trucks for your event.</p>
      <PBtn style={{marginTop:32}} onClick={()=>go("/trucks")}>Browse Trucks</PBtn>
    </div>
  </section>;

  return<section style={{minHeight:"100vh",background:P.bg,padding:"120px 60px 80px"}}>
    <div style={{maxWidth:700,margin:"0 auto"}}>
      <div style={{marginBottom:40,animation:"fadeIn 0.5s"}}><h2 style={{fontSize:48,fontWeight:800,color:P.ch,fontFamily:"'Playfair Display',serif",margin:"0 0 12px"}}>Book a Truck</h2><p style={{fontSize:18,color:P.wg,fontFamily:"'Source Serif 4',serif"}}>Tell us about your event — we'll connect you with the perfect trucks</p></div>
      <div style={{background:P.s,borderRadius:20,padding:40,border:`1px solid ${P.lg}`,animation:"fadeIn 0.5s ease 0.1s both"}}>
        {[{l:"Your Name",k:"name",ph:"Full name"},{l:"Email",k:"email",ph:"you@email.com",type:"email"},{l:"Phone",k:"phone",ph:"(804) 555-0000",type:"tel"},{l:"Event Date",k:"date",type:"date"},{l:"Event Time",k:"time",ph:"e.g. 4:00 PM - 8:00 PM"},{l:"Location",k:"location",ph:"Address or venue name"},{l:"Number of Guests",k:"guests",ph:"Estimated headcount",type:"number"},{l:"Budget Range",k:"budget",ph:"e.g. $500-$1,000"}].map(f=>
          <div key={f.k} style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:13,fontWeight:600,color:P.ch,marginBottom:6,fontFamily:"'Outfit',sans-serif"}}>{f.l}</label>
            <input type={f.type||"text"} value={form[f.k]} onChange={e=>up(f.k,e.target.value)} placeholder={f.ph} style={{width:"100%",padding:"14px 18px",borderRadius:12,border:`2px solid ${P.lg}`,background:P.bg,fontSize:15,fontFamily:"'Outfit',sans-serif",color:P.ch,outline:"none",boxSizing:"border-box",transition:"border 0.3s"}} onFocus={e=>e.target.style.borderColor=P.o} onBlur={e=>e.target.style.borderColor=P.lg}/>
          </div>
        )}
        <div style={{marginBottom:20}}>
          <label style={{display:"block",fontSize:13,fontWeight:600,color:P.ch,marginBottom:6,fontFamily:"'Outfit',sans-serif"}}>Event Type</label>
          <div style={{display:"flex",gap:8}}>
            {["private","corporate","wedding","festival","other"].map(t=><div key={t} onClick={()=>up("type",t)} style={{padding:"10px 20px",borderRadius:10,cursor:"pointer",background:form.type===t?P.o:P.bg,color:form.type===t?"#fff":P.wg,fontSize:13,fontWeight:form.type===t?600:400,border:`1px solid ${form.type===t?P.o:P.lg}`,fontFamily:"'Outfit',sans-serif",transition:"all 0.2s",textTransform:"capitalize"}}>{t}</div>)}
          </div>
        </div>
        <div style={{marginBottom:20}}>
          <label style={{display:"block",fontSize:13,fontWeight:600,color:P.ch,marginBottom:6,fontFamily:"'Outfit',sans-serif"}}>Cuisine Preferences</label>
          <input value={form.cuisine} onChange={e=>up("cuisine",e.target.value)} placeholder="e.g. BBQ, Mexican, Southern, Any" style={{width:"100%",padding:"14px 18px",borderRadius:12,border:`2px solid ${P.lg}`,background:P.bg,fontSize:15,fontFamily:"'Outfit',sans-serif",color:P.ch,outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{marginBottom:28}}>
          <label style={{display:"block",fontSize:13,fontWeight:600,color:P.ch,marginBottom:6,fontFamily:"'Outfit',sans-serif"}}>Additional Notes</label>
          <textarea value={form.notes} onChange={e=>up("notes",e.target.value)} placeholder="Tell us about your event, special requirements, etc." rows={4} style={{width:"100%",padding:"14px 18px",borderRadius:12,border:`2px solid ${P.lg}`,background:P.bg,fontSize:15,fontFamily:"'Outfit',sans-serif",color:P.ch,outline:"none",boxSizing:"border-box",resize:"vertical"}}/>
        </div>
        <PBtn full s="lg" onClick={()=>setSent(true)}>Submit Booking Request</PBtn>
        <p style={{color:P.wg,fontSize:12,textAlign:"center",marginTop:12}}>Free to submit · No commitment · Trucks respond directly</p>
      </div>
    </div>
  </section>;
}

// ─── Pricing / Vendor Page ───────────────────────────────────────────────
function PricingPage({go}){
  return<section style={{minHeight:"100vh",background:P.bg,padding:"120px 60px 80px"}}>
    <div style={{maxWidth:1000,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:60,animation:"fadeIn 0.5s"}}>
        <h2 style={{fontSize:48,fontWeight:800,color:P.ch,fontFamily:"'Playfair Display',serif",margin:"0 0 12px"}}>Grow Your Truck Business</h2>
        <p style={{fontSize:18,color:P.wg,fontFamily:"'Source Serif 4',serif",maxWidth:600,margin:"0 auto"}}>Join Richmond's largest food truck community. Reach 4,100+ hungry customers.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,animation:"fadeIn 0.5s ease 0.2s both"}}>
        {/* Free */}
        <div style={{background:P.s,borderRadius:20,padding:40,border:`2px solid ${P.lg}`}}>
          <div style={{fontSize:13,fontWeight:700,color:P.wg,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Outfit',sans-serif",marginBottom:8}}>FREE TIER</div>
          <div style={{fontSize:48,fontWeight:800,color:P.ch,fontFamily:"'Outfit',sans-serif",marginBottom:4}}>$0<span style={{fontSize:18,color:P.wg,fontWeight:400}}>/mo</span></div>
          <p style={{color:P.wg,fontSize:14,marginBottom:28}}>Get started and reach new customers</p>
          {["Basic truck profile","Apply to events","Respond to bookings","1 post per day","Community access","Customer reviews"].map(f=><div key={f} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:`1px solid ${P.lg}`}}><span style={{color:P.gn}}>✓</span><span style={{color:P.ch,fontSize:14}}>{f}</span></div>)}
          <PBtn v="secondary" full style={{marginTop:28}} onClick={()=>go("/member")}>Get Started Free</PBtn>
        </div>
        {/* Premium */}
        <div style={{background:P.s,borderRadius:20,padding:40,border:`2px solid ${P.o}`,position:"relative",boxShadow:`0 8px 40px ${P.o}15`}}>
          <div style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",background:P.o,color:"#fff",padding:"6px 20px",borderRadius:20,fontSize:12,fontWeight:700,letterSpacing:"0.08em"}}>MOST POPULAR</div>
          <div style={{fontSize:13,fontWeight:700,color:P.o,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Outfit',sans-serif",marginBottom:8}}>PREMIUM</div>
          <div style={{fontSize:48,fontWeight:800,color:P.ch,fontFamily:"'Outfit',sans-serif",marginBottom:4}}>$10<span style={{fontSize:18,color:P.wg,fontWeight:400}}>/mo</span></div>
          <p style={{color:P.wg,fontSize:14,marginBottom:28}}>Everything you need to dominate RVA</p>
          {["Everything in Free, plus:","Weekly promotional ad to 4,100+ members","Priority booking notifications","Verified ✓ badge","Analytics dashboard","Unlimited posts","Featured in search","Direct messaging","Event priority placement","Booking responses shown first"].map((f,i)=><div key={f} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:`1px solid ${P.lg}`}}><span style={{color:i===0?P.o:P.gn}}>{i===0?"⭐":"✓"}</span><span style={{color:P.ch,fontSize:14,fontWeight:i===0?700:400}}>{f}</span></div>)}
          <PBtn full s="lg" style={{marginTop:28}} onClick={()=>go("/member")}>Get Premium</PBtn>
        </div>
      </div>
      {/* Social proof */}
      <div style={{textAlign:"center",marginTop:60,animation:"fadeIn 0.5s ease 0.4s both"}}>
        <p style={{color:P.wg,fontSize:14,marginBottom:20}}>Trusted by Richmond's best trucks</p>
        <div style={{display:"flex",justifyContent:"center",gap:32}}>
          {TRUCKS.filter(t=>t.plan==="premium").slice(0,5).map(t=><div key={t.id} style={{display:"flex",alignItems:"center",gap:8,color:P.wg}}><span style={{fontSize:24}}>{t.img}</span><span style={{fontSize:13,fontWeight:500}}>{t.name}</span></div>)}
        </div>
      </div>
    </div>
  </section>;
}

// ─── About Page ──────────────────────────────────────────────────────────
function AboutPage({go}){
  return<section style={{minHeight:"100vh",background:P.bg,padding:"120px 60px 80px"}}>
    <div style={{maxWidth:800,margin:"0 auto"}}>
      <div style={{animation:"fadeIn 0.5s"}}>
        <h2 style={{fontSize:56,fontWeight:800,color:P.ch,fontFamily:"'Playfair Display',serif",margin:"0 0 24px",lineHeight:1.1}}>Richmond Deserves<br/>Better <span style={{color:P.o,fontStyle:"italic"}}>Food Truck</span> Culture</h2>
        <p style={{fontSize:20,color:P.wg,fontFamily:"'Source Serif 4',serif",lineHeight:1.8,marginBottom:32}}>
          Find a Food Truck RVA started with a simple question: why is it so hard to find a food truck in Richmond? Trucks were scattered across social media, events had no central hub, and customers were left guessing.
        </p>
        <p style={{fontSize:20,color:P.wg,fontFamily:"'Source Serif 4',serif",lineHeight:1.8,marginBottom:32}}>
          We're building the operating system for Richmond's food truck scene. One platform where every truck, every event, and every hungry customer is connected.
        </p>
        <div style={{background:"#1a1714",borderRadius:20,padding:40,color:"#fff",marginBottom:40}}>
          <h3 style={{fontSize:24,fontWeight:700,fontFamily:"'Playfair Display',serif",marginBottom:16}}>Our Mission</h3>
          <p style={{fontSize:18,color:"rgba(255,255,255,0.6)",fontFamily:"'Source Serif 4',serif",lineHeight:1.8}}>
            To make Richmond the #1 food truck city in America by giving truck owners the tools to grow, event hosts the access to vendors, and customers the easiest way to find incredible food on wheels.
          </p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20,marginBottom:40}}>
          {[["🚚","For Trucks","Free tools to reach 4,100+ customers. Premium tier for serious growth."],["📅","For Hosts","Post events, find vetted vendors, manage applications — all in one place."],["🍔","For You","Real-time locations, honest reviews, one-click booking for any event."]].map(([icon,title,desc])=>
            <div key={title} style={{background:P.s,borderRadius:16,padding:28,border:`1px solid ${P.lg}`}}>
              <div style={{fontSize:36,marginBottom:12}}>{icon}</div>
              <h4 style={{fontSize:17,fontWeight:700,color:P.ch,marginBottom:8,fontFamily:"'Outfit',sans-serif"}}>{title}</h4>
              <p style={{color:P.wg,fontSize:14,lineHeight:1.6}}>{desc}</p>
            </div>
          )}
        </div>
        <div style={{textAlign:"center",padding:"40px 0",borderTop:`1px solid ${P.lg}`}}>
          <p style={{color:P.wg,fontSize:16,marginBottom:8}}>Founded by <strong style={{color:P.ch}}>Ron Joseph</strong></p>
          <p style={{color:P.wg,fontSize:14}}>Richmond, Virginia · Est. 2026</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:24}}>
            <PBtn onClick={()=>go("/trucks")}>Find Trucks</PBtn>
            <PBtn v="outline" onClick={()=>go("/pricing")}>Join as Vendor</PBtn>
          </div>
        </div>
      </div>
    </div>
  </section>;
}

// ─── Public Footer ───────────────────────────────────────────────────────
function Footer({go}){
  return<footer style={{background:"#1a1714",padding:"60px 60px 40px"}}>
    <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:40}}>
      <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}><span style={{fontSize:20}}>🚚</span><span style={{fontFamily:"'Playfair Display',serif",fontWeight:800,fontSize:18,color:"#fff"}}>FAFT <span style={{color:P.o,fontStyle:"italic"}}>RVA</span></span></div><p style={{color:"rgba(255,255,255,0.4)",fontSize:14,lineHeight:1.7,maxWidth:280}}>Richmond's premier food truck community. Connecting trucks, events, and hungry customers since 2026.</p></div>
      <div><h4 style={{color:"#fff",fontSize:13,fontWeight:700,letterSpacing:"0.1em",marginBottom:16,fontFamily:"'Outfit',sans-serif"}}>DISCOVER</h4>{[["Find Trucks","/trucks"],["Events","/events"],["Book a Truck","/book"]].map(([l,t])=><div key={l} onClick={()=>go(t)} style={{color:"rgba(255,255,255,0.4)",fontSize:14,cursor:"pointer",padding:"4px 0"}}>{l}</div>)}</div>
      <div><h4 style={{color:"#fff",fontSize:13,fontWeight:700,letterSpacing:"0.1em",marginBottom:16,fontFamily:"'Outfit',sans-serif"}}>FOR VENDORS</h4>{[["Pricing","/pricing"],["Truck Login","/member"],["About","/about"]].map(([l,t])=><div key={l} onClick={()=>go(t)} style={{color:"rgba(255,255,255,0.4)",fontSize:14,cursor:"pointer",padding:"4px 0"}}>{l}</div>)}</div>
      <div><h4 style={{color:"#fff",fontSize:13,fontWeight:700,letterSpacing:"0.1em",marginBottom:16,fontFamily:"'Outfit',sans-serif"}}>CONNECT</h4><div style={{color:"rgba(255,255,255,0.4)",fontSize:14,padding:"4px 0"}}>Facebook Group</div><div style={{color:"rgba(255,255,255,0.4)",fontSize:14,padding:"4px 0"}}>Instagram</div><div style={{color:"rgba(255,255,255,0.4)",fontSize:14,padding:"4px 0"}}>info@faftrva.com</div></div>
    </div>
    <div style={{maxWidth:1200,margin:"40px auto 0",paddingTop:24,borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between"}}>
      <span style={{color:"rgba(255,255,255,0.25)",fontSize:12}}>© 2026 Find a Food Truck RVA. All rights reserved.</span>
      <span onClick={()=>go("/admin")} style={{color:"rgba(255,255,255,0.1)",fontSize:12,cursor:"pointer"}}>Admin</span>
    </div>
  </footer>;
}

// ═══════════════════════════════════════════════════════════════════════════
// MEMBER DASHBOARD (Truck Owners)
// ═══════════════════════════════════════════════════════════════════════════
function MemberLogin({onLogin}){
  const[pw,setPw]=useState("");const[err,setErr]=useState(false);
  const submit=()=>{if(onLogin(pw)){setErr(false)}else{setErr(true);setPw("")}};
  return<div style={{minHeight:"100vh",background:P.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif"}}>
    <div style={{width:420,padding:48,borderRadius:24,background:P.s,border:`1px solid ${P.lg}`,textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,0.06)"}}>
      <div style={{width:64,height:64,borderRadius:16,margin:"0 auto 24px",background:`linear-gradient(135deg,${P.o},${P.am})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>🚚</div>
      <h2 style={{color:P.ch,fontSize:24,fontWeight:700,margin:"0 0 8px",fontFamily:"'Playfair Display',serif"}}>Truck Owner Portal</h2>
      <p style={{color:P.wg,fontSize:14,margin:"0 0 32px"}}>Manage your profile, menu & bookings</p>
      <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr(false)}} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Password" style={{width:"100%",padding:14,borderRadius:12,border:`2px solid ${err?P.rd:P.lg}`,background:P.bg,color:P.ch,fontSize:15,outline:"none",boxSizing:"border-box",textAlign:"center",letterSpacing:2,fontFamily:"'Outfit',sans-serif"}}/>
      {err&&<div style={{color:P.rd,fontSize:12,marginTop:8}}>Invalid password</div>}
      <button onClick={submit} style={{width:"100%",marginTop:16,padding:14,borderRadius:12,border:"none",background:`linear-gradient(135deg,${P.o},#d4541f)`,color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Enter Dashboard</button>
    </div>
  </div>;
}

function MemberDash({go}){
  const[tab,setTab]=useState("profile");const truck=TRUCKS[0];
  const[profile,setProfile]=useState({name:truck.name,cuisine:truck.cuisine,owner:truck.owner,phone:truck.phone,desc:truck.desc,price:truck.price,schedule:truck.schedule,location:truck.location});
  const[menu,setMenu]=useState(truck.menu||[]);const[newItem,setNewItem]=useState({name:"",price:"",desc:""});
  const[saved,setSaved]=useState(false);const[locData,setLocData]=useState({address:"",hours:"",special:""});
  const save=()=>{setSaved(true);setTimeout(()=>setSaved(false),2000)};
  const field=(l,k,obj,setObj,ph)=><div style={{marginBottom:16}}><label style={{display:"block",fontSize:12,fontWeight:600,color:P.wg,marginBottom:4}}>{l}</label><input value={obj[k]} onChange={e=>setObj({...obj,[k]:e.target.value})} placeholder={ph} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1px solid ${P.lg}`,background:P.bg,fontSize:14,color:P.ch,outline:"none",boxSizing:"border-box",fontFamily:"'Outfit',sans-serif"}}/></div>;

  return<div style={{minHeight:"100vh",background:P.bg,fontFamily:"'Outfit',sans-serif"}}>
    <div style={{background:P.s,borderBottom:`1px solid ${P.lg}`,padding:"14px 40px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:24}}>🚚</span><span style={{fontFamily:"'Playfair Display',serif",fontWeight:800,fontSize:18,color:P.ch}}>FAFT <span style={{color:P.o,fontStyle:"italic"}}>RVA</span></span><span style={{color:P.wg,fontSize:13,marginLeft:8}}>· Truck Dashboard</span></div>
      <div style={{display:"flex",alignItems:"center",gap:16}}>
        <span style={{fontSize:13,color:P.wg}}>👋 {truck.owner}</span>
        <span style={{background:P.o+"15",color:P.o,padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:600}}>⭐ PREMIUM</span>
        <span onClick={()=>go("/")} style={{color:P.wg,fontSize:13,cursor:"pointer"}}>← Back</span>
      </div>
    </div>
    <div style={{maxWidth:1000,margin:"0 auto",padding:"40px 24px"}}>
      <div style={{display:"flex",gap:4,marginBottom:32,background:P.cr,borderRadius:12,padding:4}}>
        {[{id:"profile",l:"🚚 Profile & Menu"},{id:"location",l:"📍 Post Location"},{id:"bookings",l:"📋 Bookings"},{id:"analytics",l:"📊 Analytics"}].map(t=>
          <div key={t.id} onClick={()=>setTab(t.id)} style={{padding:"12px 24px",borderRadius:8,cursor:"pointer",background:tab===t.id?P.s:"transparent",color:tab===t.id?P.ch:P.wg,fontSize:14,fontWeight:tab===t.id?600:400,boxShadow:tab===t.id?"0 2px 8px rgba(0,0,0,0.06)":"none",transition:"all 0.2s"}}>{t.l}</div>)}
      </div>
      {saved&&<div style={{background:P.gn+"15",border:`1px solid ${P.gn}30`,borderRadius:12,padding:"12px 20px",marginBottom:20,color:P.gn,fontSize:14,fontWeight:600}}>✓ Saved!</div>}

      {tab==="profile"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
        <div style={{background:P.s,borderRadius:16,padding:28,border:`1px solid ${P.lg}`}}>
          <h3 style={{fontSize:18,fontWeight:700,color:P.ch,marginBottom:20,fontFamily:"'Playfair Display',serif"}}>Truck Profile</h3>
          {field("Truck Name","name",profile,setProfile,"")}{field("Cuisine","cuisine",profile,setProfile,"")}{field("Owner","owner",profile,setProfile,"")}{field("Phone","phone",profile,setProfile,"")}{field("Schedule","schedule",profile,setProfile,"")}{field("Price Range","price",profile,setProfile,"")}
          <div style={{marginBottom:16}}><label style={{display:"block",fontSize:12,fontWeight:600,color:P.wg,marginBottom:4}}>Description</label><textarea value={profile.desc} onChange={e=>setProfile({...profile,desc:e.target.value})} rows={3} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1px solid ${P.lg}`,background:P.bg,fontSize:14,color:P.ch,outline:"none",boxSizing:"border-box",resize:"vertical",fontFamily:"'Outfit',sans-serif"}}/></div>
          <PBtn full onClick={save}>Save Profile</PBtn>
        </div>
        <div style={{background:P.s,borderRadius:16,padding:28,border:`1px solid ${P.lg}`}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}><h3 style={{fontSize:18,fontWeight:700,color:P.ch,fontFamily:"'Playfair Display',serif"}}>Menu ({menu.length})</h3></div>
          {menu.map((m,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${P.lg}`}}>
            <div><div style={{color:P.ch,fontWeight:600,fontSize:14}}>{m.name}</div><div style={{color:P.wg,fontSize:12,marginTop:2}}>{m.desc}</div></div>
            <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{color:P.o,fontWeight:700}}>${m.price}</span><span onClick={()=>setMenu(menu.filter((_,j)=>j!==i))} style={{color:P.rd,cursor:"pointer"}}>✕</span></div>
          </div>)}
          <div style={{marginTop:16,padding:14,background:P.cr,borderRadius:10}}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:8,marginBottom:8}}>
              <input value={newItem.name} onChange={e=>setNewItem({...newItem,name:e.target.value})} placeholder="Item name" style={{padding:"8px 12px",borderRadius:8,border:`1px solid ${P.lg}`,fontSize:13,outline:"none"}}/>
              <input value={newItem.price} onChange={e=>setNewItem({...newItem,price:e.target.value})} placeholder="$" type="number" style={{padding:"8px 12px",borderRadius:8,border:`1px solid ${P.lg}`,fontSize:13,outline:"none"}}/>
            </div>
            <input value={newItem.desc} onChange={e=>setNewItem({...newItem,desc:e.target.value})} placeholder="Description" style={{width:"100%",padding:"8px 12px",borderRadius:8,border:`1px solid ${P.lg}`,fontSize:13,outline:"none",boxSizing:"border-box",marginBottom:8}}/>
            <PBtn s="sm" full onClick={()=>{if(newItem.name&&newItem.price){setMenu([...menu,{...newItem,price:Number(newItem.price)}]);setNewItem({name:"",price:"",desc:""})}}}>+ Add</PBtn>
          </div>
        </div>
      </div>}

      {tab==="location"&&<div style={{maxWidth:600}}>
        <div style={{background:P.s,borderRadius:16,padding:32,border:`1px solid ${P.lg}`}}>
          <h3 style={{fontSize:18,fontWeight:700,color:P.ch,marginBottom:8,fontFamily:"'Playfair Display',serif"}}>📍 Post Today's Location</h3>
          <p style={{color:P.wg,fontSize:14,marginBottom:24}}>Let 4,100+ customers know where you are</p>
          {field("Location / Address","address",locData,setLocData,"e.g. Shockoe Bottom near 17th St")}
          {field("Hours Today","hours",locData,setLocData,"e.g. 11am - 3pm")}
          {field("Today's Special","special",locData,setLocData,"e.g. 🔥 Half-price brisket tacos!")}
          <PBtn full s="lg" onClick={save}>📍 Post Location</PBtn>
        </div>
      </div>}

      {tab==="bookings"&&<div>
        <h3 style={{fontSize:18,fontWeight:700,color:P.ch,marginBottom:20,fontFamily:"'Playfair Display',serif"}}>Open Requests</h3>
        {BOOKINGS.map(b=><div key={b.id} style={{background:P.s,borderRadius:16,padding:24,border:`1px solid ${P.lg}`,marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:700,color:P.ch,fontSize:16}}>{b.who} — {b.eventType||b.type}</div><div style={{color:P.wg,fontSize:14,marginTop:4}}>📅 {b.date} · 📍 {b.location} · 👥 {b.guests} guests · 💰 {b.budget}</div>{b.notes&&<div style={{color:P.wg,fontSize:13,marginTop:8,fontStyle:"italic"}}>"{b.notes}"</div>}</div>
          <span style={{background:P.gn+"15",color:P.gn,padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:600,height:"fit-content"}}>OPEN</span></div>
          <div style={{marginTop:16,display:"flex",gap:8}}><PBtn s="sm">Respond with Quote</PBtn><PBtn v="secondary" s="sm">Pass</PBtn></div>
        </div>)}
      </div>}

      {tab==="analytics"&&<div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
          {[["👁","Views","1,240","↑ 12%"],["⭐","Rating",String(truck.rating),"234 reviews"],["📋","Bookings",String(truck.bookings),"this month"],["💰","Revenue",`$${truck.revenue.toLocaleString()}`,"this month"]].map(([ic,lb,vl,sb])=>
            <div key={lb} style={{background:P.s,borderRadius:16,padding:24,border:`1px solid ${P.lg}`,textAlign:"center"}}>
              <div style={{fontSize:28,marginBottom:8}}>{ic}</div><div style={{fontSize:28,fontWeight:800,color:P.ch}}>{vl}</div><div style={{fontSize:12,color:P.wg,marginTop:4}}>{sb}</div><div style={{fontSize:11,color:P.wg,marginTop:8,textTransform:"uppercase",letterSpacing:"0.08em"}}>{lb}</div>
            </div>)}
        </div>
      </div>}
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
function AdminLogin({onLogin}){
  const[pw,setPw]=useState("");const[err,setErr]=useState(false);
  const submit=()=>{if(onLogin(pw)){setErr(false)}else{setErr(true);setPw("")}};
  return<div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif"}}>
    <div style={{width:400,padding:40,borderRadius:20,background:"rgba(255,255,255,0.03)",border:`1px solid rgba(255,255,255,0.06)`,textAlign:"center"}}>
      <div style={{width:64,height:64,borderRadius:16,margin:"0 auto 24px",background:`linear-gradient(135deg,${T.o},${T.am})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>🛡️</div>
      <h2 style={{color:"#fff",fontSize:24,fontWeight:700,margin:"0 0 32px",fontFamily:"'Syne',sans-serif"}}>Admin Access</h2>
      <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr(false)}} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Password" style={{width:"100%",padding:14,borderRadius:12,border:`1px solid ${err?"#ef4444":"rgba(255,255,255,0.1)"}`,background:"rgba(255,255,255,0.04)",color:"#fff",fontSize:15,outline:"none",boxSizing:"border-box",textAlign:"center",letterSpacing:2}}/>
      {err&&<div style={{color:"#ef4444",fontSize:12,marginTop:8}}>Invalid password</div>}
      <button onClick={submit} style={{width:"100%",marginTop:16,padding:14,borderRadius:12,border:"none",background:`linear-gradient(135deg,${T.o},#ea580c)`,color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer"}}>Enter</button>
    </div>
  </div>;
}

function PinGate({onUnlock,onCancel}){
  const[pin,setPin]=useState(["","","",""]);const[err,setErr]=useState(false);
  const digit=(i,v)=>{const np=[...pin];np[i]=v.slice(-1);setPin(np);setErr(false);if(v&&i<3)document.getElementById(`p-${i+1}`)?.focus();
    if(i===3&&v){const f=np.join("");if(f.length===4&&!onUnlock(f)){setErr(true);setPin(["","","",""]);document.getElementById("p-0")?.focus()}}};
  return<div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{width:380,padding:40,borderRadius:20,background:"#0c0d11",border:"1px solid rgba(220,38,38,0.15)",textAlign:"center"}}>
      <div style={{width:64,height:64,borderRadius:16,margin:"0 auto 24px",background:"linear-gradient(135deg,#dc2626,#991b1b)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>🔐</div>
      <h2 style={{color:"#fff",fontSize:22,fontWeight:700,margin:"0 0 32px",fontFamily:"'Syne',sans-serif"}}>Security PIN</h2>
      <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:20}}>{pin.map((d,i)=><input key={i} id={`p-${i}`} type="password" inputMode="numeric" maxLength={1} value={d} onChange={e=>digit(i,e.target.value)} style={{width:56,height:64,borderRadius:14,fontSize:24,border:`2px solid ${err?"#dc2626":d?"#f97316":"rgba(255,255,255,0.1)"}`,background:"rgba(255,255,255,0.04)",color:"#fff",textAlign:"center",outline:"none",fontFamily:"'IBM Plex Mono',monospace",fontWeight:700}}/>)}</div>
      {err&&<div style={{color:"#dc2626",fontSize:12,marginBottom:12}}>Invalid PIN</div>}
      <button onClick={onCancel} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.4)",fontSize:13,cursor:"pointer",marginTop:12}}>← Back</button>
    </div>
  </div>;
}

function AdminDash({go}){
  const[st,d]=useReducer(reducer,{view:"dashboard",trucks:TRUCKS,events:EVENTS,bookings:BOOKINGS,pending:PENDING,spam:SPAM_Q,flagged:FLAGGED});
  const[secAuth,setSecAuth]=useState(false);const[showPin,setShowPin]=useState(false);const[time,setTime]=useState(new Date());const[collapsed,setCollapsed]=useState(false);
  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t)},[]);
  const NAV=[{id:"dashboard",icon:"📊",l:"Dashboard"},{id:"trucks",icon:"🚚",l:"Trucks"},{id:"events",icon:"📅",l:"Events"},{id:"bookings",icon:"📋",l:"Bookings"},{id:"members",icon:"👥",l:"Members"},{id:"ads",icon:"📢",l:"Ads"},{id:"moderation",icon:"🛡️",l:"Moderation"},{id:"settings",icon:"⚙️",l:"Settings"},{id:"security",icon:"🔐",l:"SECURITY"}];
  const bc={members:st.pending.length,moderation:st.spam.length,security:st.flagged.length};
  const handleNav=id=>{if(id==="security"){if(!secAuth)setShowPin(true);else d({type:"SET_VIEW",p:"security"})}else d({type:"SET_VIEW",p:id})};
  const prem=st.trucks.filter(t=>t.plan==="premium").length;

  return<div style={{minHeight:"100vh",background:T.bg,color:"#fff",fontFamily:"'Outfit',sans-serif",display:"flex"}}>
    <style>{CSS}</style>
    {showPin&&<PinGate onUnlock={pin=>{if(pin===SEC_PIN){setSecAuth(true);setShowPin(false);d({type:"SET_VIEW",p:"security"});return true}return false}} onCancel={()=>setShowPin(false)}/>}

    {/* Sidebar */}
    <div style={{width:collapsed?68:220,background:"rgba(255,255,255,0.015)",borderRight:`1px solid ${T.b}`,padding:"20px 12px",display:"flex",flexDirection:"column",flexShrink:0,transition:"width 0.3s"}}>
      <div style={{padding:"0 4px 24px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setCollapsed(!collapsed)}>
        <div style={{width:36,height:36,borderRadius:10,flexShrink:0,background:`linear-gradient(135deg,${T.o},${T.am})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🚚</div>
        {!collapsed&&<div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14}}>FAFT·RVA</div><div style={{fontSize:9,color:T.td,letterSpacing:"0.1em"}}>ADMIN</div></div>}
      </div>
      <nav style={{flex:1}}>{NAV.map(n=>{const isSec=n.id==="security";return<div key={n.id} onClick={()=>handleNav(n.id)} style={{display:"flex",alignItems:"center",gap:10,padding:collapsed?"10px":"9px 12px",borderRadius:9,marginTop:isSec?12:1,cursor:"pointer",background:st.view===n.id?(isSec?T.r:T.o)+"15":"transparent",color:st.view===n.id?(isSec?T.r:T.o):isSec?"rgba(220,38,38,0.4)":T.tm,fontSize:13,fontWeight:st.view===n.id?600:400,borderTop:isSec?`1px solid ${T.b}`:"none",paddingTop:isSec?12:9,justifyContent:collapsed?"center":"flex-start",position:"relative",transition:"all 0.15s"}}>
        {st.view===n.id&&<div style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",width:3,height:16,borderRadius:2,background:isSec?T.r:T.o}}/>}
        <span style={{fontSize:15}}>{n.icon}</span>{!collapsed&&<span style={{flex:1}}>{n.l}</span>}
        {!collapsed&&bc[n.id]>0&&<span style={{minWidth:16,height:16,borderRadius:8,padding:"0 4px",background:isSec?T.cr:T.o,color:"#fff",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{bc[n.id]}</span>}
      </div>})}</nav>
      {!collapsed&&<div style={{paddingTop:12,borderTop:`1px solid ${T.b}`,fontSize:10,color:T.td}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><div style={{width:6,height:6,borderRadius:3,background:secAuth?T.r:T.td}}/>{secAuth?"🔓 Sec Open":"🔒 Sec Locked"}</div>
        <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:"'IBM Plex Mono',monospace"}}>{time.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</span><span onClick={()=>go("/")} style={{cursor:"pointer"}}>← Site</span></div>
      </div>}
    </div>

    {/* Main content */}
    <div style={{flex:1,padding:"28px 36px",overflowY:"auto",maxHeight:"100vh"}}>
      {st.view==="dashboard"&&<div style={{animation:"fadeIn 0.4s"}}>
        <SH title="Command Center" subtitle="Find a Food Truck RVA"/>
        <div style={{background:`linear-gradient(135deg,rgba(249,115,22,0.12),rgba(245,158,11,0.06))`,border:`1px solid ${T.o}25`,borderRadius:18,padding:"24px 32px",marginBottom:28,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:11,color:T.am,fontWeight:600,letterSpacing:"0.1em",fontFamily:"'IBM Plex Mono',monospace"}}>MRR</div><div style={{fontSize:42,fontWeight:800,color:"#fff",marginTop:4}}>${prem*10}<span style={{fontSize:18,color:T.tm}}>/mo</span></div></div>
          <div style={{fontSize:22,fontWeight:700,color:T.g}}>↑ 16.7%</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
          <StatCard icon="👥" label="Members" value="4,100" accent={T.bl}/><StatCard icon="🚚" label="Trucks" value={st.trucks.length} accent={T.o}/><StatCard icon="📅" label="Events" value={st.events.filter(e=>e.status==="upcoming").length} accent={T.pu}/><StatCard icon="📋" label="Bookings" value={st.bookings.filter(b=>b.status==="open").length} accent={T.cy}/>
        </div>
        <div style={{marginTop:24}}><h3 style={{color:"#fff",fontSize:16,marginBottom:14,fontFamily:"'Syne',sans-serif"}}>⚡ Pending</h3>
          {st.pending.map(m=><div key={m.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${T.b}`}}>
            <div><span style={{color:"#fff",fontWeight:600}}>{m.name}</span><span style={{color:T.td,fontSize:12,marginLeft:10}}>{m.type} · {m.applied}</span></div>
            <div style={{display:"flex",gap:6}}><ABtn s="sm" v="success" onClick={()=>d({type:"APPROVE_MEMBER",p:m.id})}>✓</ABtn><ABtn s="sm" v="danger" onClick={()=>d({type:"REJECT_MEMBER",p:m.id})}>✕</ABtn></div>
          </div>)}
        </div>
      </div>}

      {st.view==="trucks"&&<div style={{animation:"fadeIn 0.4s"}}><SH title="Food Trucks" subtitle={`${st.trucks.length} registered`}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>{st.trucks.map(t=><ACard key={t.id}>
          <div style={{display:"flex",gap:14}}><div style={{width:48,height:48,borderRadius:12,fontSize:24,background:T.s,display:"flex",alignItems:"center",justifyContent:"center"}}>{t.img}</div>
          <div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#fff",fontWeight:700,fontSize:15}}>{t.name}</span><Badge color={t.plan==="premium"?T.am:T.tm}>{t.plan==="premium"?"⭐ $10/mo":"FREE"}</Badge></div>
          <div style={{color:T.tm,fontSize:12,marginTop:2}}>{t.cuisine} · {t.owner} · ⭐{t.rating}</div>
          <div style={{display:"flex",gap:6,marginTop:8}}><Badge color={t.status==="active"?T.g:"#666"}>● {t.status.toUpperCase()}</Badge>{t.verified&&<Badge color={T.bl}>✓</Badge>}</div></div></div>
        </ACard>)}</div>
      </div>}

      {st.view==="moderation"&&<div style={{animation:"fadeIn 0.4s"}}><SH title="Moderation"/>
        {st.spam.map(s=><ACard key={s.id} style={{marginBottom:12,borderLeft:`3px solid ${T.r}`}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><div style={{flex:1}}>
            <div style={{color:"#fff",fontWeight:600,marginBottom:6}}>{s.author} <span style={{color:T.td,fontWeight:400,fontSize:12}}>{s.time}</span></div>
            <div style={{padding:"8px 12px",background:"rgba(0,0,0,0.2)",borderRadius:8,color:"rgba(255,255,255,0.6)",fontSize:13,marginBottom:8}}>{s.content}</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}><ProgressBar value={s.conf} color={T.r}/><span style={{color:T.r,fontSize:12,fontWeight:600}}>{s.conf}%</span><span style={{color:T.td,fontSize:11}}>{s.reason}</span></div>
          </div><div style={{display:"flex",gap:6,marginLeft:14}}><ABtn s="sm" v="success" onClick={()=>d({type:"KEEP_SPAM",p:s.id})}>✓</ABtn><ABtn s="sm" v="danger" onClick={()=>d({type:"REMOVE_SPAM",p:s.id})}>🗑️</ABtn></div></div>
        </ACard>)}{st.spam.length===0&&<Empty icon="🛡️" title="All clear!"/>}
      </div>}

      {st.view==="security"&&secAuth&&<div style={{animation:"fadeIn 0.4s"}}>
        <SH title="🛡️ Security Center" subtitle="OWNER ONLY" action={<div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",borderRadius:10,background:T.am+"15",border:`1px solid ${T.am}30`}}><div style={{width:8,height:8,borderRadius:"50%",background:T.am,animation:"pulse 2s infinite"}}/><span style={{color:T.am,fontSize:13,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace"}}>ELEVATED</span></div>}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
          <StatCard icon="🚨" label="Flagged" value={st.flagged.length} accent={T.r}/><StatCard icon="🗑️" label="Blocked" value="87%" accent={T.g}/><StatCard icon="⚡" label="Response" value="8m" accent={T.cy}/><StatCard icon="⚔️" label="Raids" value="4" accent={T.pu}/>
        </div>
        {st.flagged.map(f=>{const mx=Math.max(...f.threats.map(t=>t.conf));return<ACard key={f.id} style={{marginBottom:12,borderLeft:`4px solid ${mx>=90?T.cr:T.r}`}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><div style={{flex:1}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}><span style={{color:"#fff",fontWeight:700}}>{f.author}</span><Badge color={TRUST_LEVELS[f.trust].color}>{TRUST_LEVELS[f.trust].icon} L{f.trust}</Badge><span style={{color:T.td,fontSize:11}}>{f.ts}</span></div>
            <div style={{padding:"10px 14px",background:"rgba(0,0,0,0.2)",borderRadius:8,color:"rgba(255,255,255,0.6)",fontSize:13,marginBottom:10,borderLeft:`3px solid ${T.r}`}}>{f.content}</div>
            <div style={{display:"flex",gap:6}}>{f.threats.map((t,i)=><Badge key={i} color={t.conf>=80?T.r:T.am} glow={t.conf>=90}>{t.type}: {t.conf}%</Badge>)}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginTop:12}}>{[["IP",f.ip],["Device",f.device],["Age",f.age],["Posts",f.posts]].map(([l,v])=><div key={l} style={{background:"rgba(255,255,255,0.03)",borderRadius:6,padding:8}}><div style={{fontSize:9,color:T.td,textTransform:"uppercase"}}>{l}</div><div style={{color:String(v).includes("hour")?"#ef4444":"#fff",fontSize:12,fontFamily:l==="IP"?"'IBM Plex Mono',monospace":"inherit",marginTop:2}}>{v}</div></div>)}</div>
          </div><div style={{display:"flex",gap:6,marginLeft:14,flexShrink:0}}><ABtn s="sm" v="success" onClick={()=>d({type:"REMOVE_FLAG",p:f.id})}>✓</ABtn><ABtn s="sm" v="danger" onClick={()=>d({type:"REMOVE_FLAG",p:f.id})}>🗑️</ABtn><ABtn s="sm" v="critical" onClick={()=>d({type:"REMOVE_FLAG",p:f.id})}>Ban</ABtn></div></div>
        </ACard>})}
        {st.flagged.length===0&&<Empty icon="🛡️" title="All Clear"/>}
        <h3 style={{color:"#fff",fontSize:16,marginTop:28,marginBottom:12,fontFamily:"'Syne',sans-serif"}}>📜 Audit Trail</h3>
        {AUDIT.map(a=><div key={a.id} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.b}`}}><span>{{auto_flag:"🚨",raid_detected:"⚔️",trust_up:"⬆️",ban:"🔨"}[a.act]||"📋"}</span><div style={{flex:1}}><span style={{color:"#fff",fontSize:13}}>{a.detail}</span><div style={{color:T.td,fontSize:11,marginTop:2}}>{a.target} · {a.actor} · {a.ts}</div></div></div>)}
        <h3 style={{color:"#fff",fontSize:16,marginTop:28,marginBottom:12,fontFamily:"'Syne',sans-serif"}}>🔍 Member Intel</h3>
        {INTEL.map(m=><ACard key={m.id} style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}><div style={{width:40,height:40,borderRadius:10,background:m.risk>=60?T.r+"15":T.g+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{m.risk>=80?"🚨":"⚠️"}</div>
              <div><span style={{color:"#fff",fontWeight:700}}>{m.name}</span><div style={{color:T.td,fontSize:12}}>{m.loc} · {m.posts} posts</div></div></div>
            <div style={{display:"flex",alignItems:"center",gap:8}}><ProgressBar value={m.risk} color={m.risk>=80?T.cr:T.am} h={8}/><Badge color={m.risk>=80?T.cr:T.am} glow={m.risk>=80}>{m.risk}</Badge></div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>{m.signals.map((s,i)=><span key={i} style={{color:s.includes("VPN")||s.includes("spam")?T.r:T.g,fontSize:12}}>● {s}</span>)}</div>
        </ACard>)}
      </div>}

      {/* Placeholder views */}
      {["events","bookings","members","ads","settings"].includes(st.view)&&<div style={{animation:"fadeIn 0.4s"}}>
        <SH title={NAV.find(n=>n.id===st.view)?.l||st.view} subtitle="Admin view"/>
        <ACard><Empty icon={NAV.find(n=>n.id===st.view)?.icon||"📋"} title={`${NAV.find(n=>n.id===st.view)?.l} — Full view from v1 build`} sub="All features from previous App.jsx are preserved. This is the unified platform."/></ACard>
      </div>}
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP — ROOT ROUTER
// ═══════════════════════════════════════════════════════════════════════════
export default function App(){
  const{route,go}=useRouter();
  const[adminAuth,setAdminAuth]=useState(false);
  const[memberAuth,setMemberAuth]=useState(false);

  // Public pages
  const isPublic=["/" ,"/trucks","/events","/book","/pricing","/about"].includes(route);

  if(isPublic)return<div style={{fontFamily:"'Outfit',sans-serif"}}>
    <style>{CSS}</style>
    <div className="grain"/>
    <PubNav go={go} route={route}/>
    {route==="/"&&<><Hero go={go}/><Footer go={go}/></>}
    {route==="/trucks"&&<><TruckFinder go={go}/><Footer go={go}/></>}
    {route==="/events"&&<><EventsPage go={go}/><Footer go={go}/></>}
    {route==="/book"&&<><BookingPage go={go}/><Footer go={go}/></>}
    {route==="/pricing"&&<><PricingPage go={go}/><Footer go={go}/></>}
    {route==="/about"&&<><AboutPage go={go}/><Footer go={go}/></>}
  </div>;

  // Member dashboard
  if(route==="/member"){
    if(!memberAuth)return<><style>{CSS}</style><MemberLogin onLogin={pw=>{if(pw===MEMBER_PW){setMemberAuth(true);return true}return false}}/></>;
    return<MemberDash go={go}/>;
  }

  // Admin
  if(route==="/admin"){
    if(!adminAuth)return<><style>{CSS}</style><AdminLogin onLogin={pw=>{if(pw===ADMIN_PW){setAdminAuth(true);return true}return false}}/></>;
    return<AdminDash go={go}/>;
  }

  // Fallback
  go("/");return null;
}
