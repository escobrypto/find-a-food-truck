import { useState, useEffect, useReducer } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// FIND A FOOD TRUCK RVA — Unified Platform v1.0
// Public Site + Admin Dashboard + Security Command Center
// Launch: March 1, 2026
// ═══════════════════════════════════════════════════════════════════════════

// ─── AUTH CREDENTIALS (change before deploying!) ─────────────────────────
const ADMIN_PW = "FAFT2026!admin";
const SEC_PIN = "7743";

// ─── Theme ───────────────────────────────────────────────────────────────
const T={bg:"#08090c",surface:"rgba(255,255,255,0.028)",surfaceHover:"rgba(255,255,255,0.055)",border:"rgba(255,255,255,0.06)",borderHover:"rgba(255,255,255,0.12)",orange:"#f97316",amber:"#f59e0b",blue:"#3b82f6",purple:"#a855f7",green:"#22c55e",red:"#ef4444",cyan:"#06b6d4",critical:"#dc2626",textMuted:"rgba(255,255,255,0.45)",textDim:"rgba(255,255,255,0.28)"};
const C={bg:"#faf8f5",surface:"#ffffff",orange:"#e8652b",orangeLight:"#fff0e8",charcoal:"#2a2520",warmGray:"#8a8279",lightGray:"#e8e4df",cream:"#f5f0ea",green:"#3d8b37",red:"#c4392b"};

// ─── Data ────────────────────────────────────────────────────────────────
const TRUCKS=[
  {id:"ft1",name:"Curbside Creations",cuisine:"Southern Fusion",owner:"Chef Marcus",status:"active",schedule:"Mon-Fri 11am-3pm",phone:"(804) 555-0101",rating:4.8,reviews:234,img:"🚚",plan:"premium",verified:true,adUsed:false,desc:"Award-winning Southern fusion.",specialties:["Brisket Tacos","Bourbon Cobbler","Cajun Mac"],price:"$$",bookings:12,revenue:4200,lat:37.5407,lng:-77.436,location:"Shockoe Bottom",distance:0.8,hours:"11am-3pm"},
  {id:"ft2",name:"RVA Taco Co.",cuisine:"Mexican Street Food",owner:"Maria Santos",status:"active",schedule:"Tue-Sat 11am-9pm",phone:"(804) 555-0202",rating:4.6,reviews:189,img:"🌮",plan:"premium",verified:true,adUsed:true,desc:"Authentic family recipes, three generations.",specialties:["Al Pastor Tacos","Elote","Churros"],price:"$",bookings:8,revenue:3100,lat:37.5536,lng:-77.4508,location:"The Fan",distance:1.2,hours:"11am-9pm"},
  {id:"ft3",name:"Smoke & Barrel BBQ",cuisine:"BBQ & Smoked Meats",owner:"Big Mike",status:"inactive",schedule:"Wed-Sun 12pm-8pm",phone:"(804) 555-0303",rating:4.9,reviews:312,img:"🔥",plan:"premium",verified:true,adUsed:false,desc:"14-hour smoked brisket, competition ribs.",specialties:["14-Hr Brisket","Competition Ribs","Smoked Mac"],price:"$$",bookings:15,revenue:5600,lat:37.5313,lng:-77.4764,location:"Scott's Addition",distance:2.1,hours:"Opens Wed 12pm"},
  {id:"ft4",name:"The Waffle Wagon",cuisine:"Breakfast & Brunch",owner:"Jenny Park",status:"active",schedule:"Daily 7am-2pm",phone:"(804) 555-0404",rating:4.7,reviews:156,img:"🧇",plan:"free",verified:false,adUsed:false,desc:"Sweet and savory waffles made fresh.",specialties:["Chicken & Waffles","Berry Bliss","Savory Herb"],price:"$",bookings:3,revenue:0,lat:37.557,lng:-77.467,location:"Carytown",distance:2.8,hours:"7am-2pm"},
  {id:"ft5",name:"Pho on Wheels",cuisine:"Vietnamese",owner:"James Chen",status:"active",schedule:"Mon-Sat 11am-8pm",phone:"(804) 555-0505",rating:4.5,reviews:98,img:"🍜",plan:"premium",verified:true,adUsed:false,desc:"24-hour pho broth, fresh banh mi.",specialties:["24-Hr Pho","Banh Mi","Spring Rolls"],price:"$",bookings:6,revenue:2800,lat:37.548,lng:-77.442,location:"Church Hill",distance:1.5,hours:"11am-8pm"},
  {id:"ft6",name:"Wild Bill's Soda Bar",cuisine:"Beverages & Treats",owner:"Bill Williams",status:"active",schedule:"Thu-Sun 10am-6pm",phone:"(804) 555-0606",rating:4.4,reviews:67,img:"🥤",plan:"premium",verified:true,adUsed:true,desc:"Old-fashioned sodas. Official VA250 partner.",specialties:["Root Beer Float","Craft Lemonade","Frozen Custard"],price:"$",bookings:4,revenue:1900,lat:37.539,lng:-77.433,location:"Monroe Park",distance:0.5,hours:"10am-6pm"},
  {id:"ft7",name:"Naan Stop",cuisine:"Indian Street Food",owner:"Priya Sharma",status:"active",schedule:"Tue-Sun 11am-9pm",phone:"(804) 555-0707",rating:4.8,reviews:145,img:"🫓",plan:"free",verified:false,adUsed:false,desc:"Fresh naan wraps and curry bowls.",specialties:["Butter Chicken Wrap","Tikka Bowl","Mango Lassi"],price:"$",bookings:2,revenue:0,lat:37.545,lng:-77.455,location:"VCU Area",distance:0.9,hours:"11am-9pm"},
];
const EVENTS=[
  {id:"e1",title:"VA250 Food Truck Festival",date:"2026-03-15",time:"11AM-8PM",location:"Brown's Island",host:"Richmond Tourism Board",maxTrucks:15,status:"upcoming",fee:75,desc:"Celebrating Virginia's 250th!",attendees:890,apps:[{tid:"ft1",s:"approved"},{tid:"ft2",s:"approved"},{tid:"ft3",s:"pending"},{tid:"ft5",s:"approved"}],tags:["festival","family"],featured:true},
  {id:"e2",title:"Carytown Food Truck Rally",date:"2026-03-22",time:"12PM-6PM",location:"Carytown",host:"Carytown Merchants",maxTrucks:10,status:"upcoming",fee:50,desc:"Monthly rally, rotating lineups.",attendees:450,apps:[{tid:"ft1",s:"pending"},{tid:"ft4",s:"pending"}],tags:["monthly"],featured:false},
  {id:"e3",title:"Scott's Addition Night Market",date:"2026-04-05",time:"5PM-10PM",location:"Scott's Addition",host:"SA Business Alliance",maxTrucks:20,status:"planning",fee:100,desc:"Evening market with live music and craft beer.",attendees:0,apps:[],tags:["night-market","music"],featured:true},
  {id:"e4",title:"RVA Brunch Bash",date:"2026-04-12",time:"9AM-2PM",location:"The Diamond District",host:"RVA Foodies",maxTrucks:8,status:"planning",fee:40,desc:"Brunch trucks + mimosa stations.",attendees:0,apps:[],tags:["brunch"],featured:false},
  {id:"e5",title:"Corporate Wellness Fair",date:"2026-04-20",time:"11AM-2PM",location:"Downtown Richmond",host:"Capital One HQ",maxTrucks:6,status:"upcoming",fee:0,desc:"Private corporate event, flat rate paid.",attendees:300,apps:[{tid:"ft5",s:"approved"}],tags:["corporate","private"],featured:false},
];
const BOOKINGS=[
  {id:"b1",type:"private",who:"Jennifer Adams",email:"jen@email.com",date:"2026-03-28",time:"4-8PM",location:"West End residence",guests:50,budget:"$500-$800",cuisine:["BBQ","Mexican"],notes:"Graduation party, need 2 trucks.",status:"open",responses:[{tid:"ft1",price:650,msg:"We'd love to cater!"},{tid:"ft3",price:700,msg:"Full BBQ spread available."}]},
  {id:"b2",type:"corporate",who:"Tom Bradley",email:"tom@techstartup.io",date:"2026-04-02",time:"11:30AM-1:30PM",location:"1001 E Broad St",guests:120,budget:"$1000-$1500",cuisine:["Any"],notes:"Team lunch, prefer 2-3 trucks.",status:"open",responses:[]},
  {id:"b3",type:"wedding",who:"Amanda & Chris",email:"amanda@email.com",date:"2026-05-16",time:"6-10PM",location:"Maymont Gardens",guests:150,budget:"$2000-$3000",cuisine:["Southern","Dessert","Beverages"],notes:"Wedding reception, 3 trucks with cohesive look.",status:"open",responses:[{tid:"ft1",price:1200,msg:"We specialize in wedding catering!"}]},
];
const ADS=[
  {id:"a1",tid:"ft2",title:"🌮 Taco Tuesday Special!",content:"Half-price Al Pastor tacos Tuesdays 5-7pm! Mention 'FAFT' for free churro.",impressions:1240,clicks:89,status:"active"},
  {id:"a2",tid:"ft6",title:"🥤 VA250 Partnership Launch!",content:"Wild Bill's is the official VA250 beverage partner!",impressions:2100,clicks:156,status:"active"},
];
const PENDING=[
  {id:"pm1",name:"Sarah's Sweet Treats",type:"truck",applied:"2026-02-19",answers:["Artisan cupcakes and cookies","Mobile bakery truck"]},
  {id:"pm2",name:"RVA Brewery Tour Co.",type:"host",applied:"2026-02-18",answers:["We organize brewery tours","Want to add food truck stops"]},
  {id:"pm3",name:"Mike Thompson",type:"customer",applied:"2026-02-20",answers:["Just moved to Richmond","Love food trucks!"]},
];
const SPAM_Q=[
  {id:"s1",author:"CryptoKing99",content:"🚀 Make $5000/day trading crypto! DM me!! 💰",time:"2 hours ago",conf:98,reason:"Financial spam"},
  {id:"s2",author:"BestDeals2026",content:"Check out www.totallylegit-deals.biz — 90% OFF!",time:"5 hours ago",conf:95,reason:"Suspicious URL"},
];
const FLAGGED=[
  {id:"f1",author:"CryptoKing99",trust:0,content:"🚀 Make $5000/day trading crypto! DM me now!! 💰",ts:"12 min ago",threats:[{type:"Spam",conf:98,words:["crypto","make money","DM me"]}],ip:"192.168.1.47",device:"Android Chrome",age:"2 hours",posts:1,reports:0},
  {id:"f2",author:"BestDeals2026",trust:0,content:"Check out www.totallylegit-deals.biz — 90% OFF everything! 🔥",ts:"38 min ago",threats:[{type:"Spam",conf:95},{type:"Phishing",conf:72,words:["suspicious URL"]}],ip:"10.0.0.23",device:"Windows Firefox",age:"45 minutes",posts:1,reports:0},
  {id:"f3",author:"FoodTruckFan22",trust:1,content:"Anyone know if Curbside is out today? Also check out my new YouTube channel!",ts:"1 hour ago",threats:[{type:"Self-Promo",conf:65,words:["check out my"]}],ip:"172.16.0.88",device:"iPhone Safari",age:"14 days",posts:23,reports:0},
  {id:"f4",author:"AngryCustomer",trust:1,content:"That food truck gave me food poisoning. Owner is a damn scammer.",ts:"2 hours ago",threats:[{type:"Profanity",conf:60,words:["damn"]},{type:"Harassment",conf:25}],ip:"192.168.2.105",device:"Android Chrome",age:"42 days",posts:8,reports:3},
  {id:"f5",author:"MLMQueen",trust:0,content:"Hey mamas! 💕 Looking for food truck owners who want PASSIVE INCOME! Network marketing opportunity 💯!",ts:"3 hours ago",threats:[{type:"Spam",conf:99,words:["passive income","network marketing"]},{type:"Self-Promo",conf:88}],ip:"10.0.1.15",device:"iPhone Safari",age:"1 hour",posts:1,reports:0},
];
const INTEL=[
  {id:"m1",name:"CryptoKing99",trust:0,joined:"2026-02-23 10:14 AM",ip:"192.168.1.47",device:"Android Chrome/119",loc:"VPN — Netherlands",posts:1,flags:1,status:"flagged",risk:96,signals:["VPN detected","Account < 24hrs","First post is spam","No profile photo","Username: crypto spam pattern"]},
  {id:"m2",name:"BestDeals2026",trust:0,joined:"2026-02-23 09:30 AM",ip:"10.0.0.23",device:"Windows Firefox/122",loc:"Richmond, VA",posts:1,flags:1,status:"flagged",risk:92,signals:["Account < 24hrs","Suspicious URL","Username: deals/promo pattern","Joined same hour as CryptoKing99"]},
  {id:"m3",name:"MLMQueen",trust:0,joined:"2026-02-23 07:45 AM",ip:"10.0.1.15",device:"iPhone Safari/17",loc:"Richmond, VA",posts:1,flags:1,status:"flagged",risk:94,signals:["Account < 24hrs","MLM keyword density: HIGH","Emoji spam pattern","Mass-join pattern"]},
  {id:"m4",name:"FoodTruckFan22",trust:1,joined:"2026-02-09",ip:"172.16.0.88",device:"iPhone Safari/17",loc:"Richmond, VA",posts:23,flags:1,status:"active",risk:18,signals:["Legitimate posting history","Self-promotion in latest post","Otherwise clean"]},
  {id:"m5",name:"AngryCustomer",trust:1,joined:"2026-01-12",ip:"192.168.2.105",device:"Android Chrome/120",loc:"Henrico, VA",posts:8,flags:1,status:"active",risk:35,signals:["3 member reports","Profanity","Likely legitimate complaint"]},
];
const RAIDS=[
  {id:"r1",ts:"2026-02-23 09:15 AM",type:"mass_join",sev:"high",detail:"5 accounts in 12 min. 3 similar usernames. 2 VPN.",accounts:["CryptoKing99","BestDeals2026","MLMQueen","QuickCash247","EasyMoney_RVA"],status:"detected",action:"All posts held"},
  {id:"r2",ts:"2026-02-20 02:30 PM",type:"spam_wave",sev:"medium",detail:"3 promo posts in 8 min from new accounts.",accounts:["PromoBot1","DealFinder","ShopNow2026"],status:"resolved",action:"Banned, posts removed"},
];
const AUDIT=[
  {id:"a1",ts:"2026-02-23 10:26 AM",act:"auto_flag",target:"CryptoKing99",detail:"Post auto-flagged: spam 98%",actor:"System",cat:"content"},
  {id:"a2",ts:"2026-02-23 10:15 AM",act:"auto_hold",target:"CryptoKing99",detail:"New member post held (Trust 0)",actor:"System",cat:"content"},
  {id:"a3",ts:"2026-02-23 09:45 AM",act:"raid_detected",target:"5 accounts",detail:"Mass join alert: 5 accounts in 12 min",actor:"System",cat:"security"},
  {id:"a4",ts:"2026-02-23 09:32 AM",act:"auto_flag",target:"BestDeals2026",detail:"Phishing confidence 72%",actor:"System",cat:"content"},
  {id:"a5",ts:"2026-02-23 07:50 AM",act:"auto_flag",target:"MLMQueen",detail:"MLM spam confidence 99%",actor:"System",cat:"content"},
  {id:"a6",ts:"2026-02-22 04:12 PM",act:"member_report",target:"AngryCustomer",detail:"3 reports for harassment",actor:"Members",cat:"report"},
  {id:"a7",ts:"2026-02-22 11:00 AM",act:"trust_up",target:"ChefMarcus",detail:"Member → Verified",actor:"Admin",cat:"member"},
  {id:"a8",ts:"2026-02-21 09:15 AM",act:"ban",target:"SpamBot_42",detail:"Permanent ban — bot",actor:"Admin",cat:"enforcement"},
  {id:"a9",ts:"2026-02-20 03:00 PM",act:"bulk_ban",target:"3 accounts",detail:"Raid cleanup",actor:"System",cat:"enforcement"},
  {id:"a10",ts:"2026-02-20 10:30 AM",act:"kw_add",target:"Blacklist",detail:"Added 'passive income','network marketing'",actor:"Admin",cat:"config"},
];
const TRUST_LEVELS=[
  {lv:0,name:"New",color:"#666",icon:"🆕",maxP:2,hold:true,canReport:false,days:0,desc:"All posts held. 2/day max."},
  {lv:1,name:"Member",color:T.blue,icon:"👤",maxP:5,hold:false,canReport:true,days:7,desc:"Posts go live. Can report. 5/day."},
  {lv:2,name:"Verified",color:T.green,icon:"✓",maxP:10,hold:false,canReport:true,days:30,desc:"Verified. 10/day. Green badge."},
  {lv:3,name:"Trusted",color:T.amber,icon:"⭐",maxP:25,hold:false,canReport:true,days:90,desc:"Trusted. 25/day. Can vouch."},
  {lv:4,name:"Moderator",color:T.purple,icon:"🛡️",maxP:-1,hold:false,canReport:true,days:-1,desc:"Full mod powers. Unlimited."},
  {lv:5,name:"Admin",color:T.red,icon:"👑",maxP:-1,hold:false,canReport:true,days:-1,desc:"Full access. All permissions."},
];
const BL_KEYWORDS=[
  {word:"crypto",cat:"spam",by:"System",hits:47},{word:"bitcoin",cat:"spam",by:"System",hits:23},{word:"forex",cat:"spam",by:"System",hits:15},{word:"make money fast",cat:"spam",by:"System",hits:31},{word:"passive income",cat:"spam",by:"Admin",hits:8},{word:"network marketing",cat:"spam",by:"Admin",hits:5},{word:"DM for details",cat:"spam",by:"System",hits:19},{word:"bit.ly",cat:"phishing",by:"System",hits:12},{word:"tinyurl",cat:"phishing",by:"System",hits:6},{word:"verify your account",cat:"phishing",by:"System",hits:3},
];

// ─── Reducer ─────────────────────────────────────────────────────────────
function reducer(st,a){switch(a.type){
  case "SET_VIEW":return{...st,view:a.p};case "APPROVE_MEMBER":return{...st,pending:st.pending.filter(m=>m.id!==a.p)};
  case "REJECT_MEMBER":return{...st,pending:st.pending.filter(m=>m.id!==a.p)};case "REMOVE_SPAM":return{...st,spam:st.spam.filter(s=>s.id!==a.p)};
  case "KEEP_SPAM":return{...st,spam:st.spam.filter(s=>s.id!==a.p)};case "TOGGLE_TRUCK":return{...st,trucks:st.trucks.map(t=>t.id===a.p?{...t,status:t.status==="active"?"inactive":"active"}:t)};
  case "APPROVE_APP":return{...st,events:st.events.map(e=>e.id===a.p.eid?{...e,apps:e.apps.map(ap=>ap.tid===a.p.tid?{...ap,s:"approved"}:ap)}:e)};
  case "REJECT_APP":return{...st,events:st.events.map(e=>e.id===a.p.eid?{...e,apps:e.apps.map(ap=>ap.tid===a.p.tid?{...ap,s:"rejected"}:ap)}:e)};
  case "REMOVE_FLAG":return{...st,flagged:st.flagged.filter(f=>f.id!==a.p)};
  default:return st;}}

// ─── Shared UI Components ────────────────────────────────────────────────
const Badge=({children,color=T.blue,glow,pulse,filled})=><span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:filled?color:color+"18",color:filled?"#fff":color,border:`1px solid ${filled?color:color+"25"}`,boxShadow:glow?`0 0 12px ${color}20`:"none",animation:pulse?"threatPulse 2s infinite":"none"}}>{children}</span>;
const Btn=({children,onClick,v="primary",s="md",full,disabled,style:x={}})=>{const vs={primary:{background:`linear-gradient(135deg,${T.orange},#ea580c)`,color:"#fff",border:"none",boxShadow:`0 4px 16px rgba(249,115,22,0.15)`},secondary:{background:T.surface,color:"rgba(255,255,255,0.7)",border:`1px solid ${T.border}`},danger:{background:T.red+"18",color:T.red,border:`1px solid ${T.red}25`},success:{background:T.green+"18",color:T.green,border:`1px solid ${T.green}25`},ghost:{background:"transparent",color:T.textMuted,border:"none"},critical:{background:`linear-gradient(135deg,${T.critical},#991b1b)`,color:"#fff",border:"none"},cyan:{background:T.cyan+"18",color:T.cyan,border:`1px solid ${T.cyan}25`}};const ss={sm:{padding:"6px 14px",fontSize:12},md:{padding:"10px 22px",fontSize:13}};return<button onClick={disabled?undefined:onClick} style={{...ss[s],...vs[v],borderRadius:10,cursor:disabled?"not-allowed":"pointer",fontWeight:600,fontFamily:"'Outfit',sans-serif",transition:"all 0.25s",display:"inline-flex",alignItems:"center",gap:7,width:full?"100%":"auto",justifyContent:full?"center":"flex-start",opacity:disabled?0.4:1,...x}}>{children}</button>};
const Card=({children,style:x={},onClick,pad=24})=><div onClick={onClick} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:pad,transition:"all 0.25s",cursor:onClick?"pointer":"default",...x}} onMouseEnter={e=>{e.currentTarget.style.background=T.surfaceHover;e.currentTarget.style.borderColor=T.borderHover}} onMouseLeave={e=>{e.currentTarget.style.background=T.surface;e.currentTarget.style.borderColor=T.border}}>{children}</div>;
const StatCard=({icon,label,value,sub,accent="#fff",trend})=><Card><div style={{position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-24,right:-12,fontSize:72,opacity:0.04}}>{icon}</div><div style={{fontSize:11,color:T.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"'IBM Plex Mono',monospace"}}>{label}</div><div style={{display:"flex",alignItems:"baseline",gap:10,marginTop:8}}><span style={{fontSize:32,fontWeight:700,color:accent,fontFamily:"'Outfit',sans-serif"}}>{value}</span>{trend&&<span style={{fontSize:12,color:trend>0?T.green:T.red,fontWeight:600}}>{trend>0?"↑":"↓"}{Math.abs(trend)}%</span>}</div>{sub&&<div style={{fontSize:12,color:T.textDim,marginTop:4}}>{sub}</div>}</div></Card>;
const Avatar=({name,color=T.orange,size=40})=><div style={{width:size,height:size,borderRadius:size/3,flexShrink:0,background:`linear-gradient(135deg,${color},${color}88)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:size*0.4}}>{name?.charAt(0)||"?"}</div>;
const ProgressBar=({value,color=T.orange,h=6})=><div style={{width:"100%",height:h,borderRadius:h/2,background:"rgba(255,255,255,0.08)",overflow:"hidden"}}><div style={{width:`${Math.min(value,100)}%`,height:"100%",borderRadius:h/2,background:color,transition:"width 0.6s"}}/></div>;
const Toggle=({on,onClick})=><div onClick={onClick} style={{width:44,height:24,borderRadius:12,cursor:"pointer",background:on?T.green:"rgba(255,255,255,0.12)",transition:"all 0.3s",position:"relative"}}><div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:on?23:3,transition:"all 0.3s",boxShadow:"0 2px 4px rgba(0,0,0,0.2)"}}/></div>;
const TabBar=({tabs,active,onChange,accent=T.orange})=><div style={{display:"flex",gap:4,background:"rgba(255,255,255,0.03)",borderRadius:10,padding:3,marginBottom:24,flexWrap:"wrap"}}>{tabs.map(t=><div key={t.id} onClick={()=>onChange(t.id)} style={{padding:"8px 16px",borderRadius:7,cursor:"pointer",background:active===t.id?accent+"20":"transparent",color:active===t.id?accent:T.textMuted,fontSize:13,fontWeight:active===t.id?600:400,transition:"all 0.2s"}}>{t.icon} {t.label}{t.count!=null?` (${t.count})`:""}</div>)}</div>;
const Empty=({icon,title,sub})=><div style={{textAlign:"center",padding:"48px 24px",color:T.textDim}}><div style={{fontSize:48,marginBottom:12,opacity:0.5}}>{icon}</div><div style={{fontSize:16,fontWeight:600,color:T.textMuted}}>{title}</div>{sub&&<div style={{fontSize:13,marginTop:6}}>{sub}</div>}</div>;
const SH=({title,subtitle,action})=><div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:28}}><div><h2 style={{fontSize:28,fontWeight:700,color:"#fff",margin:0,fontFamily:"'Syne',sans-serif",letterSpacing:"-0.02em"}}>{title}</h2>{subtitle&&<p style={{color:T.textMuted,margin:"6px 0 0",fontSize:14}}>{subtitle}</p>}</div>{action}</div>;

// ─── Admin Login Screen ──────────────────────────────────────────────────
function AdminLogin({onLogin}){
  const[pw,setPw]=useState("");const[err,setErr]=useState(false);const[attempts,setAttempts]=useState(0);const[locked,setLocked]=useState(false);
  useEffect(()=>{if(attempts>=5){setLocked(true);const t=setTimeout(()=>{setLocked(false);setAttempts(0)},300000);return()=>clearTimeout(t)}},[attempts]);
  const submit=()=>{if(locked)return;if(onLogin(pw)){setErr(false)}else{setErr(true);setAttempts(a=>a+1);setPw("")}};
  return<div style={{minHeight:"100vh",background:"#08090c",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif"}}>
    <div style={{width:400,padding:40,borderRadius:20,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",textAlign:"center"}}>
      <div style={{width:64,height:64,borderRadius:16,margin:"0 auto 24px",background:"linear-gradient(135deg,#f97316,#f59e0b)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,boxShadow:"0 8px 32px rgba(249,115,22,0.2)"}}>🛡️</div>
      <h2 style={{color:"#fff",fontSize:24,fontWeight:700,margin:"0 0 8px",fontFamily:"'Syne',sans-serif"}}>Admin Access</h2>
      <p style={{color:"rgba(255,255,255,0.4)",fontSize:14,margin:"0 0 32px"}}>Enter your admin password</p>
      {locked&&<div style={{padding:"12px 16px",borderRadius:10,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",marginBottom:20}}><span style={{color:"#ef4444",fontSize:13,fontWeight:500}}>🔒 Locked for 5 minutes.</span></div>}
      <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr(false)}} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Password" disabled={locked}
        style={{width:"100%",padding:"14px 18px",borderRadius:12,fontSize:15,border:`1px solid ${err?"#ef4444":"rgba(255,255,255,0.1)"}`,background:err?"rgba(239,68,68,0.05)":"rgba(255,255,255,0.04)",color:"#fff",outline:"none",boxSizing:"border-box",fontFamily:"'Outfit',sans-serif",textAlign:"center",letterSpacing:2,opacity:locked?0.4:1}}/>
      {err&&<div style={{color:"#ef4444",fontSize:12,marginTop:8}}>Invalid password. {5-attempts} attempts left.</div>}
      <button onClick={submit} disabled={locked||!pw} style={{width:"100%",marginTop:16,padding:"14px",borderRadius:12,border:"none",background:locked?"#333":"linear-gradient(135deg,#f97316,#ea580c)",color:"#fff",fontSize:15,fontWeight:600,cursor:locked?"not-allowed":"pointer",fontFamily:"'Outfit',sans-serif",opacity:locked?0.4:1}}>Enter Dashboard</button>
      <p style={{color:"rgba(255,255,255,0.2)",fontSize:11,marginTop:24,fontFamily:"'IBM Plex Mono',monospace"}}>Unauthorized attempts are logged</p>
    </div>
  </div>;
}

// ─── Security PIN Gate ───────────────────────────────────────────────────
function PinGate({onUnlock,onCancel}){
  const[pin,setPin]=useState(["","","",""]);const[err,setErr]=useState(false);const[attempts,setAttempts]=useState(0);const[locked,setLocked]=useState(false);
  useEffect(()=>{if(attempts>=3){setLocked(true);const t=setTimeout(()=>{setLocked(false);setAttempts(0)},600000);return()=>clearTimeout(t)}},[attempts]);
  const digit=(i,v)=>{if(locked)return;const np=[...pin];np[i]=v.slice(-1);setPin(np);setErr(false);
    if(v&&i<3){const nx=document.getElementById(`pin-${i+1}`);if(nx)nx.focus()}
    if(i===3&&v){const full=np.join("");if(full.length===4){if(onUnlock(full)){}else{setErr(true);setAttempts(a=>a+1);setPin(["","","",""]);const f=document.getElementById("pin-0");if(f)f.focus()}}}};
  const kd=(i,e)=>{if(e.key==="Backspace"&&!pin[i]&&i>0){const p=document.getElementById(`pin-${i-1}`);if(p)p.focus()}};
  return<div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif"}}>
    <div style={{width:380,padding:40,borderRadius:20,background:"#0c0d11",border:"1px solid rgba(220,38,38,0.15)",textAlign:"center"}}>
      <div style={{width:64,height:64,borderRadius:16,margin:"0 auto 24px",background:"linear-gradient(135deg,#dc2626,#991b1b)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,boxShadow:"0 8px 32px rgba(220,38,38,0.25)"}}>🔐</div>
      <h2 style={{color:"#fff",fontSize:22,fontWeight:700,margin:"0 0 6px",fontFamily:"'Syne',sans-serif"}}>Security Clearance</h2>
      <p style={{color:"rgba(255,255,255,0.35)",fontSize:13,margin:"0 0 6px"}}>CLASSIFIED — Owner Access Only</p>
      <p style={{color:"rgba(255,255,255,0.25)",fontSize:12,margin:"0 0 32px"}}>Enter 4-digit security PIN</p>
      {locked&&<div style={{padding:"12px",borderRadius:10,background:"rgba(220,38,38,0.1)",border:"1px solid rgba(220,38,38,0.2)",marginBottom:20}}><span style={{color:"#dc2626",fontSize:13}}>🔒 LOCKED — 10 min cooldown</span></div>}
      <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:20}}>
        {pin.map((d,i)=><input key={i} id={`pin-${i}`} type="password" inputMode="numeric" maxLength={1} value={d} onChange={e=>digit(i,e.target.value)} onKeyDown={e=>kd(i,e)} disabled={locked}
          style={{width:56,height:64,borderRadius:14,fontSize:24,border:`2px solid ${err?"#dc2626":d?"#f97316":"rgba(255,255,255,0.1)"}`,background:err?"rgba(220,38,38,0.05)":"rgba(255,255,255,0.04)",color:"#fff",textAlign:"center",outline:"none",fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,boxShadow:d?"0 0 12px rgba(249,115,22,0.15)":"none",transition:"all 0.2s",opacity:locked?0.4:1}}/>)}
      </div>
      {err&&<div style={{color:"#dc2626",fontSize:12,marginBottom:12}}>Invalid PIN. {3-attempts} left.</div>}
      <button onClick={onCancel} style={{background:"transparent",border:"none",color:T.textMuted,fontSize:13,cursor:"pointer",marginTop:12,fontFamily:"'Outfit',sans-serif"}}>← Back to Dashboard</button>
      <p style={{color:"rgba(255,255,255,0.15)",fontSize:10,fontFamily:"'IBM Plex Mono',monospace",marginTop:20}}>All access attempts logged</p>
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD VIEWS
// ═══════════════════════════════════════════════════════════════════════════
function DashView({st,d}){const prem=st.trucks.filter(t=>t.plan==="premium").length;const free=st.trucks.filter(t=>t.plan==="free").length;const pending=st.pending.length+st.spam.length+st.bookings.filter(b=>b.status==="open").length;
  return<div style={{animation:"fadeIn 0.4s"}}><SH title="Command Center" subtitle="Find a Food Truck RVA — Platform Overview"/>
    <div style={{background:`linear-gradient(135deg,rgba(249,115,22,0.12),rgba(245,158,11,0.08),rgba(168,85,247,0.06))`,border:`1px solid ${T.orange}25`,borderRadius:18,padding:"24px 32px",marginBottom:28,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><div style={{fontSize:12,color:T.amber,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'IBM Plex Mono',monospace"}}>Monthly Recurring Revenue</div><div style={{fontSize:42,fontWeight:800,color:"#fff",fontFamily:"'Outfit',sans-serif",marginTop:4}}>${prem*10}<span style={{fontSize:18,color:T.textMuted,fontWeight:400}}>/mo</span></div><div style={{fontSize:13,color:T.textMuted,marginTop:4}}>{prem} premium × $10/mo · {free} free tier</div></div>
      <div style={{display:"flex",gap:24}}><div><div style={{fontSize:24,fontWeight:700,color:T.green}}>↑ 16.7%</div><div style={{fontSize:11,color:T.textDim}}>vs last month</div></div><div><div style={{fontSize:24,fontWeight:700,color:"#fff"}}>12,400</div><div style={{fontSize:11,color:T.textDim}}>ad impressions</div></div></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
      <StatCard icon="👥" label="Total Members" value="4,100" sub="+47 this week" accent={T.blue} trend={4.6}/><StatCard icon="🚚" label="Food Trucks" value={st.trucks.length} sub={`${prem} premium · ${free} free`} accent={T.orange}/><StatCard icon="📅" label="Active Events" value={st.events.filter(e=>e.status==="upcoming").length} accent={T.purple}/><StatCard icon="📋" label="Open Bookings" value={st.bookings.filter(b=>b.status==="open").length} accent={T.cyan}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      <Card><div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}><h3 style={{margin:0,fontSize:15,fontFamily:"'Syne',sans-serif"}}>⚡ Action Queue</h3><Badge color={T.orange} glow>{pending} pending</Badge></div>
        {st.pending.slice(0,3).map(m=><div key={m.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}><div style={{display:"flex",gap:10,alignItems:"center"}}><Avatar name={m.name} color={m.type==="truck"?T.orange:m.type==="host"?T.purple:T.blue} size={32}/><div><div style={{color:"#fff",fontSize:13,fontWeight:500}}>{m.name}</div><div style={{color:T.textDim,fontSize:11}}>{m.type==="truck"?"🚚":m.type==="host"?"📅":"👤"} {m.type} · {m.applied}</div></div></div><div style={{display:"flex",gap:6}}><Btn s="sm" v="success" onClick={()=>d({type:"APPROVE_MEMBER",p:m.id})}>✓</Btn><Btn s="sm" v="danger" onClick={()=>d({type:"REJECT_MEMBER",p:m.id})}>✕</Btn></div></div>)}
      </Card>
      <Card><div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}><h3 style={{margin:0,fontSize:15,fontFamily:"'Syne',sans-serif"}}>📢 Active Ads</h3><Btn s="sm" v="secondary" onClick={()=>d({type:"SET_VIEW",p:"ads"})}>Manage</Btn></div>
        {ADS.filter(a=>a.status==="active").map(a=>{const tk=st.trucks.find(t=>t.id===a.tid);return<div key={a.id} style={{padding:16,background:"rgba(255,255,255,0.02)",borderRadius:12,marginBottom:10,border:`1px solid ${T.border}`}}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{color:"#fff",fontWeight:600,fontSize:14}}>{a.title}</div><div style={{color:T.textMuted,fontSize:12}}>by {tk?.name}</div><div style={{color:T.textDim,fontSize:12,marginTop:6}}>{a.content}</div></div><Badge color={T.green}>LIVE</Badge></div><div style={{display:"flex",gap:16,marginTop:10}}><span style={{fontSize:11,color:T.textMuted}}>👁 {a.impressions.toLocaleString()}</span><span style={{fontSize:11,color:T.textMuted}}>👆 {a.clicks}</span><span style={{fontSize:11,color:T.textMuted}}>📊 {((a.clicks/a.impressions)*100).toFixed(1)}%</span></div></div>})}
      </Card>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginTop:18}}>
      <Card><div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}><h3 style={{margin:0,fontSize:15,fontFamily:"'Syne',sans-serif"}}>📅 Next Events</h3></div>
        {st.events.filter(e=>e.status==="upcoming").slice(0,3).map(e=><div key={e.id} style={{display:"flex",gap:14,padding:"10px 0",borderBottom:`1px solid ${T.border}`}}><div style={{width:48,height:48,borderRadius:12,flexShrink:0,background:`linear-gradient(135deg,${T.orange}20,${T.amber}15)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><div style={{color:T.orange,fontSize:10,fontWeight:700}}>{new Date(e.date).toLocaleDateString("en-US",{month:"short"})}</div><div style={{color:"#fff",fontSize:18,fontWeight:700}}>{new Date(e.date).getDate()}</div></div><div><div style={{color:"#fff",fontWeight:600,fontSize:13}}>{e.title}</div><div style={{color:T.textDim,fontSize:11}}>📍 {e.location} · 🚚 {e.apps.filter(a=>a.s==="approved").length}/{e.maxTrucks}</div></div></div>)}
      </Card>
      <Card><h3 style={{margin:"0 0 18px",fontSize:15,fontFamily:"'Syne',sans-serif"}}>🔍 Trending Searches</h3>
        {["BBQ near me","taco trucks","food truck catering","brunch trucks","wedding food truck"].map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:i<4?`1px solid ${T.border}`:"none"}}><span style={{color:T.orange,fontWeight:700,fontSize:14,fontFamily:"'IBM Plex Mono',monospace",width:24}}>#{i+1}</span><span style={{color:"rgba(255,255,255,0.6)",fontSize:13}}>{s}</span></div>)}
      </Card>
    </div>
  </div>;
}

function TrucksView({st,d}){const[filter,setFilter]=useState("all");const[sel,setSel]=useState(null);const filtered=filter==="all"?st.trucks:filter==="premium"?st.trucks.filter(t=>t.plan==="premium"):filter==="free"?st.trucks.filter(t=>t.plan==="free"):st.trucks.filter(t=>t.status===filter);const det=st.trucks.find(t=>t.id===sel);
  return<div style={{animation:"fadeIn 0.4s"}}><SH title="Food Trucks" subtitle={`${st.trucks.length} registered · ${st.trucks.filter(t=>t.plan==="premium").length} premium`} action={<div style={{display:"flex",gap:8}}>{["all","premium","free","active","inactive"].map(f=><Btn key={f} s="sm" v={filter===f?"primary":"secondary"} onClick={()=>setFilter(f)}>{f==="all"?"All":f==="premium"?"⭐ Premium":f==="free"?"Free":f==="active"?"🟢 Live":"⚫ Off"}</Btn>)}</div>}/>
    <div style={{display:"grid",gridTemplateColumns:sel?"1fr 380px":"1fr",gap:18}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>{filtered.map(t=><Card key={t.id} onClick={()=>setSel(t.id)} style={{cursor:"pointer",borderColor:sel===t.id?T.orange+"50":T.border}}>
        <div style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:14}}><div style={{width:52,height:52,borderRadius:14,fontSize:28,background:t.plan==="premium"?`linear-gradient(135deg,${T.orange}20,${T.amber}15)`:"rgba(255,255,255,0.04)",display:"flex",alignItems:"center",justifyContent:"center"}}>{t.img}</div><div><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{color:"#fff",fontWeight:700,fontSize:15}}>{t.name}</span>{t.verified&&<span style={{color:T.blue,fontSize:14}}>✓</span>}</div><div style={{color:T.textMuted,fontSize:12}}>{t.cuisine} · {t.owner}</div><div style={{display:"flex",gap:6,marginTop:8}}><Badge color={t.plan==="premium"?T.amber:T.textMuted}>{t.plan==="premium"?"⭐ PREMIUM":"FREE"}</Badge><Badge color={t.status==="active"?T.green:"#666"}>{t.status==="active"?"● LIVE":"● OFF"}</Badge></div></div></div><div style={{textAlign:"right"}}><div style={{color:T.amber,fontSize:14,fontWeight:600}}>⭐ {t.rating}</div><div style={{color:T.textDim,fontSize:11}}>{t.reviews} reviews</div></div></div>
        {t.plan==="premium"&&<div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:T.textMuted}}>📋 {t.bookings} bookings</span><span style={{fontSize:12,color:T.green,fontWeight:600}}>${t.revenue.toLocaleString()}/mo</span></div>}
      </Card>)}</div>
      {sel&&det&&<div style={{animation:"slideRight 0.3s"}}><Card style={{position:"sticky",top:24}}><div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:48,marginBottom:8}}>{det.img}</div><div style={{fontSize:20,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{det.name}</div><div style={{color:T.textMuted,fontSize:13}}>{det.cuisine}</div><div style={{display:"flex",gap:6,justifyContent:"center",marginTop:10}}><Badge color={det.plan==="premium"?T.amber:T.textMuted}>{det.plan==="premium"?"⭐ $10/mo":"Free"}</Badge>{det.verified&&<Badge color={T.blue}>✓</Badge>}</div></div><div style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.6,marginBottom:18}}>{det.desc}</div><div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>{det.specialties.map(s=><Badge key={s} color={T.orange}>{s}</Badge>)}</div><div style={{fontSize:13,color:T.textMuted,lineHeight:2}}>📞 {det.phone}<br/>🕐 {det.schedule}<br/>💰 {det.price}</div><div style={{marginTop:20}}><Btn s="sm" v={det.status==="active"?"danger":"success"} full onClick={()=>d({type:"TOGGLE_TRUCK",p:det.id})}>{det.status==="active"?"Set Offline":"Set Active"}</Btn></div></Card></div>}
    </div>
  </div>;
}

function EventsView({st,d}){const[tab,setTab]=useState("upcoming");const[exp,setExp]=useState(null);const filtered=tab==="all"?st.events:st.events.filter(e=>e.status===tab);
  return<div style={{animation:"fadeIn 0.4s"}}><SH title="Events" subtitle="Food truck events, festivals, and bookings"/>
    <TabBar active={tab} onChange={setTab} tabs={[{id:"upcoming",label:"Upcoming",icon:"📅",count:st.events.filter(e=>e.status==="upcoming").length},{id:"planning",label:"Planning",icon:"📝",count:st.events.filter(e=>e.status==="planning").length},{id:"all",label:"All",icon:"📋"}]}/>
    <div style={{display:"grid",gap:14}}>{filtered.map(e=>{const isExp=exp===e.id;const pa=e.apps.filter(a=>a.s==="pending");return<Card key={e.id} onClick={()=>setExp(isExp?null:e.id)} style={{cursor:"pointer"}}>
      <div style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:18}}><div style={{width:56,height:56,borderRadius:14,flexShrink:0,background:`linear-gradient(135deg,${T.orange}20,${T.amber}15)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><div style={{color:T.orange,fontSize:10,fontWeight:700}}>{new Date(e.date).toLocaleDateString("en-US",{month:"short"})}</div><div style={{color:"#fff",fontSize:20,fontWeight:700}}>{new Date(e.date).getDate()}</div></div><div><div style={{color:"#fff",fontWeight:700,fontSize:16}}>{e.title}</div><div style={{color:T.textMuted,fontSize:13}}>📍 {e.location} · 🕐 {e.time} · 🏢 {e.host}</div><div style={{display:"flex",gap:6,marginTop:8}}><Badge color={e.status==="upcoming"?T.orange:T.purple}>{e.status.toUpperCase()}</Badge>{pa.length>0&&<Badge color={T.amber}>{pa.length} pending</Badge>}</div></div></div><div style={{color:T.textDim,transform:isExp?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s"}}>▼</div></div>
      {isExp&&<div style={{marginTop:18,paddingTop:18,borderTop:`1px solid ${T.border}`}} onClick={ev=>ev.stopPropagation()}><p style={{color:"rgba(255,255,255,0.55)",fontSize:13,lineHeight:1.6,margin:"0 0 16px"}}>{e.desc}</p>
        {e.apps.length>0&&<div>{e.apps.map(app=>{const tk=st.trucks.find(t=>t.id===app.tid);return tk?<div key={app.tid} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:22}}>{tk.img}</span><span style={{color:"#fff",fontSize:13}}>{tk.name}</span></div><div style={{display:"flex",gap:6,alignItems:"center"}}>{tk.plan==="premium"&&<Badge color={T.amber}>⭐ PRIORITY</Badge>}{app.s==="pending"?<><Btn s="sm" v="success" onClick={()=>d({type:"APPROVE_APP",p:{eid:e.id,tid:app.tid}})}>Approve</Btn><Btn s="sm" v="danger" onClick={()=>d({type:"REJECT_APP",p:{eid:e.id,tid:app.tid}})}>Decline</Btn></>:<Badge color={app.s==="approved"?T.green:T.red}>{app.s.toUpperCase()}</Badge>}</div></div>:null})}</div>}
      </div>}
    </Card>})}</div>
  </div>;
}

function BookingsView({st}){const[sel,setSel]=useState(null);const det=st.bookings.find(b=>b.id===sel);const tc={private:T.blue,corporate:T.purple,wedding:T.amber};const ti={private:"🏠",corporate:"🏢",wedding:"💒"};
  return<div style={{animation:"fadeIn 0.4s"}}><SH title="Booking Requests" subtitle="Private events, corporate, weddings"/>
    <div style={{display:"grid",gridTemplateColumns:sel?"1fr 420px":"1fr",gap:18}}>
      <div style={{display:"grid",gap:14}}>{st.bookings.map(b=><Card key={b.id} onClick={()=>setSel(b.id)} style={{cursor:"pointer",borderColor:sel===b.id?T.orange+"40":T.border}}>
        <div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}><span style={{fontSize:22}}>{ti[b.type]}</span><div><div style={{color:"#fff",fontWeight:600,fontSize:15}}>{b.who}</div><Badge color={tc[b.type]}>{b.type.toUpperCase()}</Badge></div></div><div style={{color:T.textMuted,fontSize:13,lineHeight:1.7}}>📅 {b.date} · 👥 {b.guests} · 💰 {b.budget}</div></div><div style={{textAlign:"right"}}><Badge color={T.green}>OPEN</Badge><div style={{color:T.textDim,fontSize:11,marginTop:6}}>{b.responses.length} responses</div></div></div>
      </Card>)}</div>
      {sel&&det&&<div style={{animation:"slideRight 0.3s"}}><Card style={{position:"sticky",top:24}}>
        <div style={{fontSize:18,fontWeight:700,fontFamily:"'Syne',sans-serif",marginBottom:16}}>{det.who}</div>
        <div style={{color:"rgba(255,255,255,0.5)",fontSize:13,lineHeight:1.8,marginBottom:16}}>📅 {det.date} · 🕐 {det.time}<br/>📍 {det.location}<br/>👥 {det.guests} guests · 💰 {det.budget}</div>
        {det.notes&&<div style={{color:"rgba(255,255,255,0.4)",fontSize:13,padding:14,background:"rgba(255,255,255,0.03)",borderRadius:10,marginBottom:16,fontStyle:"italic"}}>"{det.notes}"</div>}
        <div style={{borderTop:`1px solid ${T.border}`,paddingTop:16}}>
          <div style={{fontSize:12,color:T.textDim,fontWeight:600,marginBottom:12,textTransform:"uppercase"}}>Responses ({det.responses.length})</div>
          {det.responses.map((r,i)=>{const tk=st.trucks.find(t=>t.id===r.tid);return tk?<div key={i} style={{padding:14,background:"rgba(255,255,255,0.03)",borderRadius:10,marginBottom:8,border:`1px solid ${T.border}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{display:"flex",gap:8,alignItems:"center"}}><span>{tk.img}</span><span style={{color:"#fff",fontWeight:600,fontSize:13}}>{tk.name}</span></div><span style={{color:T.green,fontWeight:700}}>${r.price}</span></div><div style={{color:"rgba(255,255,255,0.4)",fontSize:12}}>{r.msg}</div></div>:null})}
        </div>
      </Card></div>}
    </div>
  </div>;
}

function MembersView({st,d}){const[tab,setTab]=useState("pending");const ti={truck:{icon:"🚚",color:T.orange},host:{icon:"📅",color:T.purple},customer:{icon:"👤",color:T.blue}};
  return<div style={{animation:"fadeIn 0.4s"}}><SH title="Members" subtitle="Food Trucks, Event Hosts, Customers"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}><StatCard icon="👥" label="Total" value="4,100" accent="#fff"/><StatCard icon="🚚" label="Trucks" value="7" accent={T.orange}/><StatCard icon="📅" label="Hosts" value="4" accent={T.purple}/><StatCard icon="👤" label="Customers" value="4,089" accent={T.blue}/></div>
    <TabBar active={tab} onChange={setTab} tabs={[{id:"pending",label:"Pending",icon:"⏳",count:st.pending.length},{id:"roles",label:"Roles",icon:"🏷️"}]}/>
    {tab==="pending"&&<div style={{display:"grid",gap:12}}>{st.pending.map(m=><Card key={m.id}><div style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:14}}><Avatar name={m.name} color={ti[m.type]?.color}/><div><div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{color:"#fff",fontWeight:600,fontSize:15}}>{m.name}</span><Badge color={ti[m.type]?.color}>{ti[m.type]?.icon} {m.type}</Badge></div><div style={{marginTop:10}}>{m.answers.map((a,i)=><div key={i} style={{color:"rgba(255,255,255,0.5)",fontSize:13}}>"{a}"</div>)}</div></div></div><div style={{display:"flex",gap:8}}><Btn v="success" s="sm" onClick={()=>d({type:"APPROVE_MEMBER",p:m.id})}>✓</Btn><Btn v="danger" s="sm" onClick={()=>d({type:"REJECT_MEMBER",p:m.id})}>✕</Btn></div></div></Card>)}{st.pending.length===0&&<Empty icon="✅" title="No pending"/>}</div>}
    {tab==="roles"&&<div style={{display:"grid",gap:14}}>{[{role:"Truck (Free)",color:T.textMuted,icon:"🚚",perks:["Basic listing","Apply to events","1 post/day"]},{role:"Truck Premium $10/mo",color:T.amber,icon:"⭐",perks:["Weekly ad","Priority bookings","Verified badge","Analytics","Unlimited posts","Featured search"]},{role:"Event Host",color:T.purple,icon:"📅",perks:["Create events","Browse trucks","Manage apps"]},{role:"Customer",color:T.blue,icon:"👤",perks:["Browse trucks","Event discovery","Book trucks","Save favorites"]}].map(r=><Card key={r.role}><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}><span style={{fontSize:24}}>{r.icon}</span><span style={{color:r.color,fontWeight:700,fontSize:16,fontFamily:"'Syne',sans-serif"}}>{r.role}</span></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>{r.perks.map(p=><div key={p} style={{display:"flex",gap:8,fontSize:13,color:"rgba(255,255,255,0.55)"}}><span style={{color:r.color}}>●</span>{p}</div>)}</div></Card>)}</div>}
  </div>;
}

function AdsView({st}){return<div style={{animation:"fadeIn 0.4s"}}><SH title="Ad Manager" subtitle="Weekly ads for premium trucks"/>
  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:28}}><StatCard icon="📢" label="Active" value={ADS.filter(a=>a.status==="active").length} accent={T.green}/><StatCard icon="👁" label="Impressions" value={ADS.reduce((s,a)=>s+a.impressions,0).toLocaleString()} accent={T.blue}/><StatCard icon="👆" label="Avg CTR" value={`${(ADS.reduce((s,a)=>s+(a.clicks/a.impressions),0)/ADS.length*100).toFixed(1)}%`} accent={T.amber}/></div>
  <Card>{ADS.map(a=>{const tk=st.trucks.find(t=>t.id===a.tid);return<div key={a.id} style={{padding:20,background:"rgba(255,255,255,0.02)",borderRadius:12,marginBottom:12,border:`1px solid ${T.border}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div style={{display:"flex",gap:12,alignItems:"center"}}><span style={{fontSize:28}}>{tk?.img}</span><div><div style={{color:"#fff",fontWeight:700,fontSize:16}}>{a.title}</div><div style={{color:T.textMuted,fontSize:12}}>by {tk?.name}</div></div></div><Badge color={T.green} glow>LIVE</Badge></div><div style={{color:"rgba(255,255,255,0.5)",fontSize:13,padding:"12px 16px",background:"rgba(0,0,0,0.15)",borderRadius:10,marginBottom:14}}>{a.content}</div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}><div style={{textAlign:"center",padding:10,background:"rgba(255,255,255,0.03)",borderRadius:8}}><div style={{fontSize:20,fontWeight:700,color:T.blue}}>{a.impressions.toLocaleString()}</div><div style={{fontSize:11,color:T.textDim}}>Impressions</div></div><div style={{textAlign:"center",padding:10,background:"rgba(255,255,255,0.03)",borderRadius:8}}><div style={{fontSize:20,fontWeight:700,color:T.green}}>{a.clicks}</div><div style={{fontSize:11,color:T.textDim}}>Clicks</div></div><div style={{textAlign:"center",padding:10,background:"rgba(255,255,255,0.03)",borderRadius:8}}><div style={{fontSize:20,fontWeight:700,color:T.amber}}>{((a.clicks/a.impressions)*100).toFixed(1)}%</div><div style={{fontSize:11,color:T.textDim}}>CTR</div></div></div></div>})}</Card>
</div>;}

function ModView({st,d}){return<div style={{animation:"fadeIn 0.4s"}}><SH title="Moderation" subtitle="Content moderation"/>
  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:28}}><StatCard icon="🛡️" label="Flagged" value={st.spam.length} accent={T.red}/><StatCard icon="🗑️" label="Removed" value="12" accent={T.orange}/><StatCard icon="⚡" label="Avg Response" value="14 min" accent={T.green}/></div>
  <Card>{st.spam.map(s=><div key={s.id} style={{padding:18,background:"rgba(239,68,68,0.04)",borderRadius:12,marginBottom:10,border:`1px solid ${T.red}20`}}><div style={{display:"flex",justifyContent:"space-between"}}><div style={{flex:1}}><div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}><span style={{color:"#fff",fontWeight:600}}>{s.author}</span><span style={{color:T.textDim,fontSize:11}}>{s.time}</span></div><div style={{padding:"10px 14px",background:"rgba(0,0,0,0.2)",borderRadius:8,color:"rgba(255,255,255,0.6)",fontSize:13,marginBottom:10}}>{s.content}</div><div style={{display:"flex",alignItems:"center",gap:10}}><ProgressBar value={s.conf} color={s.conf>70?T.red:T.amber}/><span style={{color:T.red,fontSize:12,fontWeight:600}}>{s.conf}%</span><span style={{color:T.textDim,fontSize:11}}>{s.reason}</span></div></div><div style={{display:"flex",gap:6,marginLeft:14}}><Btn s="sm" v="success" onClick={()=>d({type:"KEEP_SPAM",p:s.id})}>✓</Btn><Btn s="sm" v="danger" onClick={()=>d({type:"REMOVE_SPAM",p:s.id})}>🗑️</Btn></div></div></div>)}{st.spam.length===0&&<Empty icon="🛡️" title="All clear!"/>}</Card>
</div>;}

function SettingsView(){const[s,setS]=useState({aiSpam:true,autoWelcome:true,postApproval:false,truckVerify:true,bookingNotify:true,eventAutoApprove:false});const tog=k=>setS(p=>({...p,[k]:!p[k]}));
  const Row=({icon,title,desc,right})=><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:`1px solid ${T.border}`}}><div style={{display:"flex",gap:12,alignItems:"center"}}><span style={{fontSize:20}}>{icon}</span><div><div style={{color:"#fff",fontWeight:500,fontSize:14}}>{title}</div><div style={{color:T.textDim,fontSize:12}}>{desc}</div></div></div>{right}</div>;
  return<div style={{animation:"fadeIn 0.4s"}}><SH title="Settings" subtitle="Platform configuration"/>
    <Card style={{marginBottom:18}}><h3 style={{margin:"0 0 18px",fontSize:12,color:T.textDim,textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"'IBM Plex Mono',monospace"}}>Monetization</h3><Row icon="💰" title="Premium Price" desc="Monthly food truck fee" right={<span style={{color:T.amber,fontWeight:700,fontSize:18}}>$10/mo</span>}/><Row icon="📢" title="Ad Frequency" desc="Premium truck ad schedule" right={<Badge color={T.amber}>1x/week</Badge>}/></Card>
    <Card><h3 style={{margin:"0 0 18px",fontSize:12,color:T.textDim,textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"'IBM Plex Mono',monospace"}}>Automation</h3><Row icon="🛡️" title="AI Spam Detection" desc="Auto-flag suspicious posts" right={<Toggle on={s.aiSpam} onClick={()=>tog("aiSpam")}/>}/><Row icon="👋" title="Auto-Welcome" desc="Role-based welcome messages" right={<Toggle on={s.autoWelcome} onClick={()=>tog("autoWelcome")}/>}/><Row icon="✅" title="Post Pre-Approval" desc="Require approval" right={<Toggle on={s.postApproval} onClick={()=>tog("postApproval")}/>}/><Row icon="🔔" title="Priority Booking" desc="Notify premium trucks first" right={<Toggle on={s.bookingNotify} onClick={()=>tog("bookingNotify")}/>}/></Card>
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECURITY COMMAND CENTER — OWNER ONLY (PIN PROTECTED)
// ═══════════════════════════════════════════════════════════════════════════
function SecurityCenter({st,d}){
  const[tab,setTab]=useState("overview");const[expT,setExpT]=useState(null);const[expM,setExpM]=useState(null);const[newKw,setNewKw]=useState("");const[kws,setKws]=useState(BL_KEYWORDS);
  const[cfg,setCfg]=useState({autoHold:true,profanity:true,linkScan:true,vpn:true,raid:true,autoban90:true});

  return<div style={{animation:"fadeIn 0.4s"}}>
    <SH title="🛡️ Security Command Center" subtitle="Threat detection, intel, moderation — OWNER ONLY"
      action={<div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",borderRadius:10,background:T.amber+"15",border:`1px solid ${T.amber}30`}}><div style={{width:8,height:8,borderRadius:"50%",background:T.amber,boxShadow:`0 0 8px ${T.amber}`,animation:"threatPulse 2s infinite"}}/><span style={{color:T.amber,fontSize:13,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace"}}>THREAT: ELEVATED</span></div>}/>

    <TabBar active={tab} onChange={setTab} accent={T.red} tabs={[{id:"overview",label:"Overview",icon:"📊"},{id:"threats",label:"Threats",icon:"🚨",count:st.flagged.length},{id:"intel",label:"Intel",icon:"🔍"},{id:"raids",label:"Raids",icon:"⚔️"},{id:"trust",label:"Trust",icon:"🏅"},{id:"blacklist",label:"Blacklist",icon:"🚫"},{id:"audit",label:"Audit Log",icon:"📜"},{id:"config",label:"Config",icon:"⚙️"}]}/>

    {tab==="overview"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}><StatCard icon="🚨" label="Flagged Today" value="5" accent={T.red}/><StatCard icon="🗑️" label="Auto-Blocked" value="87%" accent={T.green}/><StatCard icon="⚡" label="Avg Response" value="8 min" accent={T.cyan}/><StatCard icon="⚔️" label="Raids Blocked" value="4" accent={T.purple}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <Card><h3 style={{margin:"0 0 16px",fontSize:15,fontFamily:"'Syne',sans-serif"}}>🎯 Threat Distribution</h3>{[{l:"Spam/Scam",c:31,color:T.red},{l:"Phishing",c:12,color:T.critical},{l:"Self-Promo",c:9,color:T.amber},{l:"Profanity",c:8,color:T.orange},{l:"Harassment",c:4,color:T.purple},{l:"Off-Topic",c:3,color:T.blue}].map(t=><div key={t.l} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}><span style={{color:t.color,fontSize:12,fontWeight:600,minWidth:100}}>{t.l}</span><div style={{flex:1}}><ProgressBar value={(t.c/67)*100} color={t.color}/></div><span style={{color:T.textMuted,fontSize:12,fontWeight:600,minWidth:24,textAlign:"right"}}>{t.c}</span></div>)}</Card>
        <Card><h3 style={{margin:"0 0 16px",fontSize:15,fontFamily:"'Syne',sans-serif"}}>📊 Security Scorecard</h3>{[{l:"Content Safety",s:94,c:T.green},{l:"Bot Prevention",s:89,c:T.green},{l:"Spam Blocking",s:96,c:T.green},{l:"Verification",s:72,c:T.amber},{l:"Response Time",s:85,c:T.green},{l:"False Positive",s:91,c:T.green}].map(x=><div key={x.l} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}><span style={{color:T.textMuted,fontSize:12,minWidth:120}}>{x.l}</span><div style={{flex:1}}><ProgressBar value={x.s} color={x.c}/></div><span style={{color:x.c,fontSize:13,fontWeight:700,minWidth:36,textAlign:"right"}}>{x.s}%</span></div>)}<div style={{marginTop:14,padding:12,background:T.green+"10",borderRadius:10,border:`1px solid ${T.green}20`}}><div style={{color:T.green,fontSize:14,fontWeight:700}}>Overall: A</div><div style={{color:T.textDim,fontSize:12,marginTop:2}}>Platform well-protected.</div></div></Card>
      </div>
      <Card style={{marginTop:18}}><h3 style={{margin:"0 0 16px",fontSize:15,fontFamily:"'Syne',sans-serif"}}>⏱️ Live Feed</h3>{AUDIT.slice(0,6).map(a=>{const ic={auto_flag:"🚨",auto_hold:"⏸️",raid_detected:"⚔️",member_report:"🚩",trust_up:"⬆️",ban:"🔨",bulk_ban:"💀",kw_add:"📝"};const ac={auto_flag:T.red,auto_hold:T.amber,raid_detected:T.critical,member_report:T.purple,trust_up:T.green,ban:T.red,bulk_ban:T.critical,kw_add:T.blue};return<div key={a.id} style={{display:"flex",gap:14,padding:"10px 0",borderBottom:`1px solid ${T.border}`}}><div style={{width:36,height:36,borderRadius:10,background:(ac[a.act]||T.blue)+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{ic[a.act]||"📋"}</div><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#fff",fontSize:13}}>{a.detail}</span><span style={{color:T.textDim,fontSize:11,fontFamily:"'IBM Plex Mono',monospace"}}>{a.ts}</span></div><div style={{color:T.textDim,fontSize:11,marginTop:2}}>Target: {a.target} · By: {a.actor}</div></div></div>})}</Card>
    </div>}

    {tab==="threats"&&<div style={{display:"grid",gap:14}}>
      {st.flagged.map(f=>{const isExp=expT===f.id;const mx=Math.max(...f.threats.map(t=>t.conf));const sc=mx>=90?T.critical:mx>=70?T.red:T.amber;
        return<Card key={f.id} style={{borderColor:isExp?sc+"40":T.border}}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div style={{flex:1,cursor:"pointer"}} onClick={()=>setExpT(isExp?null:f.id)}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{color:"#fff",fontWeight:700,fontSize:15}}>{f.author}</span><Badge color={TRUST_LEVELS[f.trust].color}>{TRUST_LEVELS[f.trust].icon} L{f.trust}</Badge><span style={{color:T.textDim,fontSize:11}}>{f.ts}</span></div>
              <div style={{padding:"12px 16px",background:"rgba(0,0,0,0.2)",borderRadius:10,color:"rgba(255,255,255,0.7)",fontSize:13,marginBottom:12,borderLeft:`3px solid ${sc}`}}>{f.content}</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{f.threats.map((t,i)=><Badge key={i} color={t.conf>=80?T.red:T.amber} glow={t.conf>=90}>{t.type}: {t.conf}%</Badge>)}{f.reports>0&&<Badge color={T.purple}>🚩 {f.reports} reports</Badge>}</div>
            </div>
            <div style={{display:"flex",gap:6,marginLeft:16,flexShrink:0}}><Btn s="sm" v="success" onClick={()=>d({type:"REMOVE_FLAG",p:f.id})}>✓ Keep</Btn><Btn s="sm" v="danger" onClick={()=>d({type:"REMOVE_FLAG",p:f.id})}>🗑️</Btn><Btn s="sm" v="critical" onClick={()=>d({type:"REMOVE_FLAG",p:f.id})}>🔨 Ban</Btn></div>
          </div>
          {isExp&&<div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${T.border}`}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:14}}>{[{l:"IP",v:f.ip},{l:"Device",v:f.device},{l:"Account Age",v:f.age,warn:f.age.includes("hour")||f.age.includes("minute")},{l:"Total Posts",v:f.posts}].map(x=><div key={x.l} style={{background:"rgba(255,255,255,0.03)",borderRadius:8,padding:10}}><div style={{fontSize:10,color:T.textDim,textTransform:"uppercase"}}>{x.l}</div><div style={{color:x.warn?T.red:"#fff",fontSize:13,fontFamily:x.l==="IP"?"'IBM Plex Mono',monospace":"inherit",marginTop:4}}>{x.v}</div></div>)}</div>
            {f.threats.filter(t=>t.words?.length>0).map((t,i)=><div key={i} style={{fontSize:12,color:T.textDim}}>Matched ({t.type}): {t.words.map(w=><span key={w} style={{color:T.red,fontFamily:"'IBM Plex Mono',monospace",background:T.red+"15",padding:"1px 6px",borderRadius:4,marginLeft:4}}>{w}</span>)}</div>)}
          </div>}
        </Card>})}
      {st.flagged.length===0&&<Empty icon="🛡️" title="All Clear" sub="The fortress holds."/>}
    </div>}

    {tab==="intel"&&<div style={{display:"grid",gap:14}}>
      {INTEL.sort((a,b)=>b.risk-a.risk).map(m=>{const isExp=expM===m.id;return<Card key={m.id} onClick={()=>setExpM(isExp?null:m.id)} style={{cursor:"pointer"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",gap:14,alignItems:"center"}}>
            <div style={{width:44,height:44,borderRadius:12,background:`${m.risk>=60?T.red:m.risk>=30?T.amber:T.green}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,border:`1px solid ${m.risk>=60?T.red:m.risk>=30?T.amber:T.green}30`}}>{m.risk>=80?"🚨":m.risk>=60?"⚠️":m.risk>=30?"👀":"✅"}</div>
            <div><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{color:"#fff",fontWeight:700,fontSize:15}}>{m.name}</span><Badge color={TRUST_LEVELS[m.trust].color}>{TRUST_LEVELS[m.trust].icon} L{m.trust}</Badge><Badge color={m.status==="flagged"?T.red:T.green}>{m.status.toUpperCase()}</Badge></div><div style={{color:T.textDim,fontSize:12,marginTop:3}}>Joined {m.joined} · {m.posts} posts · {m.loc}</div></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:120}}><ProgressBar value={m.risk} color={m.risk>=80?T.critical:m.risk>=60?T.red:m.risk>=30?T.amber:T.green} h={8}/></div><Badge color={m.risk>=80?T.critical:m.risk>=60?T.red:m.risk>=30?T.amber:T.green} glow={m.risk>=80}>{m.risk}</Badge></div>
        </div>
        {isExp&&<div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${T.border}`}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}><div style={{background:"rgba(255,255,255,0.03)",borderRadius:8,padding:10}}><div style={{fontSize:10,color:T.textDim,textTransform:"uppercase"}}>IP</div><div style={{color:"#fff",fontSize:12,fontFamily:"'IBM Plex Mono',monospace",marginTop:4}}>{m.ip}</div></div><div style={{background:"rgba(255,255,255,0.03)",borderRadius:8,padding:10}}><div style={{fontSize:10,color:T.textDim,textTransform:"uppercase"}}>Device</div><div style={{color:"#fff",fontSize:12,marginTop:4}}>{m.device}</div></div><div style={{background:"rgba(255,255,255,0.03)",borderRadius:8,padding:10}}><div style={{fontSize:10,color:T.textDim,textTransform:"uppercase"}}>Location</div><div style={{color:m.loc.includes("VPN")?T.red:"#fff",fontSize:12,marginTop:4}}>{m.loc}</div></div></div>
          <div style={{fontSize:11,color:T.textDim,fontWeight:600,textTransform:"uppercase",marginBottom:8}}>🔍 Intel Signals</div>
          {m.signals.map((s,i)=><div key={i} style={{display:"flex",gap:8,padding:"4px 0"}}><span style={{color:s.includes("VPN")||s.includes("spam")||s.includes("< 24hrs")||s.includes("Mass")?T.red:s.includes("Legitimate")||s.includes("clean")?T.green:T.amber,fontSize:12}}>●</span><span style={{color:"rgba(255,255,255,0.6)",fontSize:13}}>{s}</span></div>)}
          <div style={{display:"flex",gap:8,marginTop:14}}><Btn s="sm" v="success">✓ Clear</Btn><Btn s="sm" v="secondary">⚠️ Warn</Btn><Btn s="sm" v="danger">🔇 Mute</Btn><Btn s="sm" v="critical">🔨 Ban</Btn></div>
        </div>}
      </Card>})}
    </div>}

    {tab==="raids"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24}}><StatCard icon="⚔️" label="Raids" value={RAIDS.length} accent={T.red}/><StatCard icon="🤖" label="Bots Blocked" value="14" accent={T.purple}/><StatCard icon="🛡️" label="Protection" value="ACTIVE" accent={T.green}/></div>
      <Card>{RAIDS.map(r=>{const sc=r.sev==="high"?T.red:T.amber;return<div key={r.id} style={{padding:18,background:"rgba(255,255,255,0.02)",borderRadius:12,marginBottom:12,border:`1px solid ${sc}20`,borderLeft:`4px solid ${sc}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div><div style={{display:"flex",gap:8}}><Badge color={sc}>{r.sev.toUpperCase()}</Badge><Badge color={r.status==="detected"?T.amber:T.green}>{r.status.toUpperCase()}</Badge></div><div style={{color:"#fff",fontWeight:600,fontSize:14,marginTop:8}}>{r.type==="mass_join"?"🚨 Mass Join":"📧 Spam Wave"}</div><div style={{color:T.textMuted,fontSize:13,marginTop:4}}>{r.detail}</div></div><span style={{color:T.textDim,fontSize:11,fontFamily:"'IBM Plex Mono',monospace"}}>{r.ts}</span></div><div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>{r.accounts.map(a=><Badge key={a} color={T.red}>{a}</Badge>)}</div><div style={{fontSize:12,color:T.green}}>✓ {r.action}</div></div>})}</Card>
    </div>}

    {tab==="trust"&&<div style={{display:"grid",gap:14}}>{TRUST_LEVELS.map(tl=><Card key={tl.lv} style={{borderLeft:`4px solid ${tl.color}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",gap:14,alignItems:"center"}}><div style={{width:48,height:48,borderRadius:14,background:tl.color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{tl.icon}</div><div><span style={{color:tl.color,fontWeight:700,fontSize:17,fontFamily:"'Syne',sans-serif"}}>L{tl.lv}: {tl.name}</span><div style={{color:T.textMuted,fontSize:13,marginTop:2}}>{tl.desc}</div><div style={{display:"flex",gap:12,marginTop:8}}><span style={{fontSize:12,color:T.textDim}}>📝 {tl.maxP===-1?"∞":tl.maxP}/day</span><span style={{fontSize:12,color:T.textDim}}>{tl.hold?"⏸️ Held":"✅ Live"}</span><span style={{fontSize:12,color:T.textDim}}>{tl.canReport?"🚩 Report":"🚫"}</span></div></div></div></div></Card>)}</div>}

    {tab==="blacklist"&&<div>
      <Card style={{marginBottom:18}}><div style={{display:"flex",gap:12,alignItems:"end"}}><div style={{flex:1}}><label style={{display:"block",fontSize:12,color:T.textMuted,marginBottom:5}}>Add Keyword</label><input value={newKw} onChange={e=>setNewKw(e.target.value)} placeholder="Enter keyword..." style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1px solid ${T.border}`,background:"rgba(255,255,255,0.04)",color:"#fff",fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"'Outfit',sans-serif"}}/></div><Btn onClick={()=>{if(newKw.trim()){setKws([...kws,{word:newKw.trim(),cat:"custom",by:"Admin",hits:0}]);setNewKw("")}}}>+ Add</Btn></div></Card>
      <Card><h3 style={{margin:"0 0 16px",fontSize:15,fontFamily:"'Syne',sans-serif"}}>🚫 Blacklist ({kws.length})</h3>
        {kws.map((k,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}><span style={{color:"#fff",fontSize:13,fontFamily:"'IBM Plex Mono',monospace",flex:2}}>{k.word}</span><Badge color={k.cat==="spam"?T.red:k.cat==="phishing"?T.critical:T.amber}>{k.cat}</Badge><span style={{color:T.textDim,fontSize:12,flex:1,textAlign:"center"}}>{k.by}</span><span style={{color:T.textMuted,fontSize:13,fontWeight:600,width:30,textAlign:"right"}}>{k.hits}</span><Btn s="sm" v="ghost" onClick={()=>setKws(kws.filter((_,j)=>j!==i))} style={{marginLeft:8}}>✕</Btn></div>)}
      </Card>
    </div>}

    {tab==="audit"&&<Card><h3 style={{margin:"0 0 16px",fontSize:15,fontFamily:"'Syne',sans-serif"}}>📜 Audit Trail</h3>
      {AUDIT.map(a=>{const ic={auto_flag:"🚨",auto_hold:"⏸️",raid_detected:"⚔️",member_report:"🚩",trust_up:"⬆️",ban:"🔨",bulk_ban:"💀",kw_add:"📝"};const ac={auto_flag:T.red,auto_hold:T.amber,raid_detected:T.critical,member_report:T.purple,trust_up:T.green,ban:T.red,bulk_ban:T.critical,kw_add:T.blue};const cc={content:T.amber,security:T.red,report:T.purple,member:T.blue,enforcement:T.critical,config:T.cyan};
        return<div key={a.id} style={{display:"flex",gap:14,padding:"12px 0",borderBottom:`1px solid ${T.border}`}}><div style={{width:36,height:36,borderRadius:10,background:(ac[a.act]||T.blue)+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{ic[a.act]||"📋"}</div><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#fff",fontSize:13}}>{a.detail}</span><span style={{color:T.textDim,fontSize:11,fontFamily:"'IBM Plex Mono',monospace"}}>{a.ts}</span></div><div style={{display:"flex",gap:6,marginTop:4}}><Badge color={cc[a.cat]||T.blue}>{a.cat}</Badge><span style={{color:T.textDim,fontSize:11}}>{a.target} · {a.actor}</span></div></div></div>})}
    </Card>}

    {tab==="config"&&<div>
      {[["🛡️ Auto-Moderation",[{l:"Hold New Member Posts",d:"Trust 0 posts need approval",k:"autoHold"},{l:"Profanity Filter",d:"Auto-flag profanity",k:"profanity"},{l:"Link Scanning",d:"Check URLs vs phishing DBs",k:"linkScan"},{l:"VPN Detection",d:"Flag VPN/proxy users",k:"vpn"},{l:"Raid Protection",d:"Detect mass joins/spam",k:"raid"},{l:"Auto-Ban 90%+",d:"Ban 90%+ risk scores",k:"autoban90"}]]].map(([title,rows])=><Card key={title} style={{marginBottom:18}}><h3 style={{margin:"0 0 18px",fontSize:12,color:T.textDim,textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"'IBM Plex Mono',monospace"}}>{title}</h3>{rows.map(r=><div key={r.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:`1px solid ${T.border}`}}><div><div style={{color:"#fff",fontWeight:500,fontSize:14}}>{r.l}</div><div style={{color:T.textDim,fontSize:12}}>{r.d}</div></div><Toggle on={cfg[r.k]} onClick={()=>setCfg({...cfg,[r.k]:!cfg[r.k]})}/></div>)}</Card>)}
    </div>}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP — ROUTING + AUTH
// ═══════════════════════════════════════════════════════════════════════════
export default function App(){
  const[page,setPage]=useState(window.location.hash==="#admin"?"admin":"public");
  const[adminAuth,setAdminAuth]=useState(false);
  const[secAuth,setSecAuth]=useState(false);
  const[showPin,setShowPin]=useState(false);
  const[st,d]=useReducer(reducer,{view:"dashboard",trucks:TRUCKS,events:EVENTS,bookings:BOOKINGS,pending:PENDING,spam:SPAM_Q,flagged:FLAGGED});
  const[time,setTime]=useState(new Date());
  const[collapsed,setCollapsed]=useState(false);

  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t)},[]);
  useEffect(()=>{const h=()=>setPage(window.location.hash==="#admin"?"admin":"public");window.addEventListener("hashchange",h);return()=>window.removeEventListener("hashchange",h)},[]);

  const loginAdmin=(pw)=>{if(pw===ADMIN_PW){setAdminAuth(true);return true}return false};
  const loginSec=(pin)=>{if(pin===SEC_PIN){setSecAuth(true);setShowPin(false);return true}return false};

  // ─── PUBLIC SITE (simplified landing) ──────────────────────────────────
  if(page==="public"){
    return<div style={{minHeight:"100vh",background:"#1a1714",color:"#fff",fontFamily:"'Outfit',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"60px 24px"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600;700;800&family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{position:"absolute",top:"-20%",left:"50%",transform:"translateX(-50%)",width:800,height:800,borderRadius:"50%",background:"radial-gradient(circle,rgba(232,101,43,0.12) 0%,transparent 70%)",filter:"blur(60px)"}}/>
      <div style={{position:"relative",zIndex:2,maxWidth:800}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 20px",borderRadius:40,background:"rgba(232,101,43,0.12)",border:"1px solid rgba(232,101,43,0.2)",marginBottom:32}}><span style={{fontSize:16}}>🚚</span><span style={{color:"#e8652b",fontSize:13,fontWeight:600,letterSpacing:"0.05em"}}>RICHMOND'S #1 FOOD TRUCK PLATFORM</span></div>
        <h1 style={{fontSize:72,fontWeight:800,color:"#fff",margin:"0 0 20px",fontFamily:"'Playfair Display',serif",lineHeight:1.05}}>Find a Food<br/>Truck <span style={{color:"#e8652b",fontStyle:"italic"}}>RVA</span></h1>
        <p style={{fontSize:20,color:"rgba(255,255,255,0.55)",margin:"0 0 48px",fontFamily:"'Outfit',sans-serif",lineHeight:1.6,maxWidth:560,marginLeft:"auto",marginRight:"auto"}}>Discover the best food trucks in Richmond. Track locations, browse events, book trucks for your next event.</p>
        <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
          <button style={{padding:"16px 40px",borderRadius:50,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#e8652b,#d4541f)",color:"#fff",fontSize:16,fontWeight:700,fontFamily:"'Outfit',sans-serif",boxShadow:"0 8px 32px rgba(232,101,43,0.35)"}}>Find Trucks Near Me</button>
          <button onClick={()=>{window.location.hash="#admin";setPage("admin")}} style={{padding:"16px 40px",borderRadius:50,cursor:"pointer",background:"transparent",color:"#fff",border:"1px solid rgba(255,255,255,0.2)",fontSize:16,fontWeight:600,fontFamily:"'Outfit',sans-serif"}}>Admin Panel →</button>
        </div>
        <div style={{display:"flex",gap:48,justifyContent:"center",marginTop:64}}>
          {[["4,100+","Members"],["50+","Trucks"],["12","Events/Mo"],["$0","For Customers"]].map(([v,l],i)=><div key={i}><div style={{fontSize:28,fontWeight:800}}>{v}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:2}}>{l}</div></div>)}
        </div>
      </div>
    </div>;
  }

  // ─── ADMIN LOGIN ───────────────────────────────────────────────────────
  if(!adminAuth) return<><style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}`}</style><AdminLogin onLogin={loginAdmin}/></>;

  // ─── ADMIN DASHBOARD ───────────────────────────────────────────────────
  const NAV=[{id:"dashboard",icon:"📊",label:"Dashboard"},{id:"trucks",icon:"🚚",label:"Food Trucks"},{id:"events",icon:"📅",label:"Events"},{id:"bookings",icon:"📋",label:"Bookings"},{id:"members",icon:"👥",label:"Members"},{id:"ads",icon:"📢",label:"Ad Manager"},{id:"moderation",icon:"🛡️",label:"Moderation"},{id:"settings",icon:"⚙️",label:"Settings"},{id:"security",icon:"🔐",label:"SECURITY",color:T.red}];
  const bc={members:st.pending.length,moderation:st.spam.length,bookings:st.bookings.filter(b=>b.status==="open").length,security:st.flagged.length};

  const handleNavClick=(id)=>{
    if(id==="security"){if(!secAuth){setShowPin(true)}else{d({type:"SET_VIEW",p:"security"})}}
    else{d({type:"SET_VIEW",p:id})}
  };

  return<div style={{minHeight:"100vh",background:T.bg,color:"#fff",fontFamily:"'Outfit',sans-serif",display:"flex"}}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
      @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
      @keyframes slideRight{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}
      @keyframes threatPulse{0%,100%{opacity:1}50%{opacity:0.4}}
      *{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px}
    `}</style>

    {showPin&&<PinGate onUnlock={(pin)=>{if(loginSec(pin)){d({type:"SET_VIEW",p:"security"});return true}return false}} onCancel={()=>setShowPin(false)}/>}

    {/* Sidebar */}
    <div style={{width:collapsed?68:240,background:"rgba(255,255,255,0.015)",borderRight:`1px solid ${T.border}`,padding:collapsed?"20px 10px":"20px 14px",display:"flex",flexDirection:"column",flexShrink:0,transition:"width 0.3s"}}>
      <div style={{padding:collapsed?"0 0 20px":"0 6px 24px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setCollapsed(!collapsed)}>
        <div style={{width:38,height:38,borderRadius:10,flexShrink:0,background:`linear-gradient(135deg,${T.orange},${T.amber})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:`0 4px 16px rgba(249,115,22,0.15)`}}>🚚</div>
        {!collapsed&&<div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,lineHeight:1}}>FAFT·RVA</div><div style={{fontSize:9,color:T.textDim,letterSpacing:"0.12em",fontFamily:"'IBM Plex Mono',monospace"}}>PLATFORM ADMIN</div></div>}
      </div>
      <nav style={{flex:1}}>{NAV.map(item=>{const isSec=item.id==="security";return<div key={item.id} onClick={()=>handleNavClick(item.id)} style={{display:"flex",alignItems:"center",gap:10,padding:collapsed?"10px":"10px 12px",borderRadius:10,marginBottom:isSec?0:2,marginTop:isSec?14:0,cursor:"pointer",background:st.view===item.id?(isSec?T.red:T.orange)+"15":"transparent",color:st.view===item.id?(isSec?T.red:T.orange):isSec?"rgba(220,38,38,0.5)":T.textMuted,transition:"all 0.2s",position:"relative",justifyContent:collapsed?"center":"flex-start",borderTop:isSec?`1px solid ${T.border}`:"none",paddingTop:isSec?14:10}} onMouseEnter={e=>{if(st.view!==item.id)e.currentTarget.style.background="rgba(255,255,255,0.03)"}} onMouseLeave={e=>{if(st.view!==item.id)e.currentTarget.style.background="transparent"}}>
        {st.view===item.id&&<div style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",width:3,height:18,borderRadius:2,background:isSec?T.red:T.orange}}/>}
        <span style={{fontSize:16}}>{item.icon}</span>
        {!collapsed&&<span style={{fontSize:13,fontWeight:st.view===item.id?600:isSec?600:400,flex:1}}>{item.label}</span>}
        {!collapsed&&bc[item.id]>0&&<span style={{minWidth:18,height:18,borderRadius:9,padding:"0 5px",background:isSec?T.critical:item.id==="moderation"?T.red:T.orange,color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{bc[item.id]}</span>}
      </div>})}</nav>
      <div style={{paddingTop:14,borderTop:`1px solid ${T.border}`}}>
        {!collapsed&&<><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{width:7,height:7,borderRadius:"50%",background:T.green,boxShadow:`0 0 8px ${T.green}60`}}/><span style={{color:T.textDim,fontSize:11}}>Platform Active</span></div><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:7,height:7,borderRadius:"50%",background:secAuth?T.red:T.textDim,boxShadow:secAuth?`0 0 8px ${T.red}60`:"none"}}/><span style={{color:T.textDim,fontSize:11}}>{secAuth?"🔓 Security Unlocked":"🔒 Security Locked"}</span></div></>}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
          <span style={{color:T.textDim,fontSize:10,fontFamily:"'IBM Plex Mono',monospace"}}>{time.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</span>
          {!collapsed&&<span onClick={()=>{setAdminAuth(false);setSecAuth(false);window.location.hash=""}} style={{color:T.textDim,fontSize:10,cursor:"pointer"}}>Logout</span>}
        </div>
      </div>
    </div>

    {/* Main */}
    <div style={{flex:1,padding:"28px 36px",overflowY:"auto",maxHeight:"100vh"}}>
      {st.view==="dashboard"&&<DashView st={st} d={d}/>}
      {st.view==="trucks"&&<TrucksView st={st} d={d}/>}
      {st.view==="events"&&<EventsView st={st} d={d}/>}
      {st.view==="bookings"&&<BookingsView st={st} d={d}/>}
      {st.view==="members"&&<MembersView st={st} d={d}/>}
      {st.view==="ads"&&<AdsView st={st}/>}
      {st.view==="moderation"&&<ModView st={st} d={d}/>}
      {st.view==="settings"&&<SettingsView/>}
      {st.view==="security"&&secAuth&&<SecurityCenter st={st} d={d}/>}
    </div>
  </div>;
}
