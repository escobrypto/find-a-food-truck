import { useState, useEffect, useReducer } from "react";

const T = {
  bg:"#08090c",surface:"rgba(255,255,255,0.028)",surfaceHover:"rgba(255,255,255,0.055)",
  border:"rgba(255,255,255,0.06)",borderHover:"rgba(255,255,255,0.12)",
  orange:"#f97316",orangeGlow:"rgba(249,115,22,0.15)",blue:"#3b82f6",
  purple:"#a855f7",green:"#22c55e",red:"#ef4444",amber:"#f59e0b",cyan:"#06b6d4",
  textMuted:"rgba(255,255,255,0.45)",textDim:"rgba(255,255,255,0.28)",
};

const TRUCKS = [
  {id:"ft1",name:"Curbside Creations",cuisine:"Southern Fusion",owner:"Chef Marcus",status:"active",schedule:"Mon-Fri 11am-3pm",phone:"(804) 555-0101",rating:4.8,reviews:234,img:"🚚",plan:"premium",verified:true,adUsed:false,desc:"Award-winning Southern fusion.",specialties:["Brisket Tacos","Bourbon Cobbler","Cajun Mac"],price:"$$",bookings:12,revenue:4200,lat:37.5407,lng:-77.436},
  {id:"ft2",name:"RVA Taco Co.",cuisine:"Mexican Street Food",owner:"Maria Santos",status:"active",schedule:"Tue-Sat 11am-9pm",phone:"(804) 555-0202",rating:4.6,reviews:189,img:"🌮",plan:"premium",verified:true,adUsed:true,desc:"Authentic family recipes, three generations.",specialties:["Al Pastor Tacos","Elote","Churros"],price:"$",bookings:8,revenue:3100,lat:37.5536,lng:-77.4508},
  {id:"ft3",name:"Smoke & Barrel BBQ",cuisine:"BBQ & Smoked Meats",owner:"Big Mike",status:"inactive",schedule:"Wed-Sun 12pm-8pm",phone:"(804) 555-0303",rating:4.9,reviews:312,img:"🔥",plan:"premium",verified:true,adUsed:false,desc:"14-hour smoked brisket, competition ribs.",specialties:["14-Hr Brisket","Competition Ribs","Smoked Mac"],price:"$$",bookings:15,revenue:5600,lat:37.5313,lng:-77.4764},
  {id:"ft4",name:"The Waffle Wagon",cuisine:"Breakfast & Brunch",owner:"Jenny Park",status:"active",schedule:"Daily 7am-2pm",phone:"(804) 555-0404",rating:4.7,reviews:156,img:"🧇",plan:"free",verified:false,adUsed:false,desc:"Sweet and savory waffles made fresh.",specialties:["Chicken & Waffles","Berry Bliss","Savory Herb"],price:"$",bookings:3,revenue:0,lat:37.557,lng:-77.467},
  {id:"ft5",name:"Pho on Wheels",cuisine:"Vietnamese",owner:"James Chen",status:"active",schedule:"Mon-Sat 11am-8pm",phone:"(804) 555-0505",rating:4.5,reviews:98,img:"🍜",plan:"premium",verified:true,adUsed:false,desc:"24-hour pho broth, fresh banh mi.",specialties:["24-Hr Pho","Banh Mi","Spring Rolls"],price:"$",bookings:6,revenue:2800,lat:37.548,lng:-77.442},
  {id:"ft6",name:"Wild Bill's Soda Bar",cuisine:"Beverages & Treats",owner:"Bill Williams",status:"active",schedule:"Thu-Sun 10am-6pm",phone:"(804) 555-0606",rating:4.4,reviews:67,img:"🥤",plan:"premium",verified:true,adUsed:true,desc:"Old-fashioned sodas. Official VA250 partner.",specialties:["Root Beer Float","Craft Lemonade","Frozen Custard"],price:"$",bookings:4,revenue:1900,lat:37.539,lng:-77.433},
  {id:"ft7",name:"Naan Stop",cuisine:"Indian Street Food",owner:"Priya Sharma",status:"active",schedule:"Tue-Sun 11am-9pm",phone:"(804) 555-0707",rating:4.8,reviews:145,img:"🫓",plan:"free",verified:false,adUsed:false,desc:"Fresh naan wraps and curry bowls.",specialties:["Butter Chicken Wrap","Tikka Bowl","Mango Lassi"],price:"$",bookings:2,revenue:0,lat:37.545,lng:-77.455},
];

const EVENTS = [
  {id:"e1",title:"VA250 Food Truck Festival",date:"2026-03-15",time:"11AM-8PM",location:"Brown's Island",host:"Richmond Tourism Board",maxTrucks:15,status:"upcoming",fee:75,desc:"Celebrating Virginia's 250th!",attendees:890,apps:[{tid:"ft1",s:"approved"},{tid:"ft2",s:"approved"},{tid:"ft3",s:"pending"},{tid:"ft5",s:"approved"}],tags:["festival","family"]},
  {id:"e2",title:"Carytown Food Truck Rally",date:"2026-03-22",time:"12PM-6PM",location:"Carytown",host:"Carytown Merchants",maxTrucks:10,status:"upcoming",fee:50,desc:"Monthly rally, rotating lineups.",attendees:450,apps:[{tid:"ft1",s:"pending"},{tid:"ft4",s:"pending"}],tags:["monthly"]},
  {id:"e3",title:"Scott's Addition Night Market",date:"2026-04-05",time:"5PM-10PM",location:"Scott's Addition",host:"SA Business Alliance",maxTrucks:20,status:"planning",fee:100,desc:"Evening market with live music and craft beer.",attendees:0,apps:[],tags:["night-market","music"]},
  {id:"e4",title:"RVA Brunch Bash",date:"2026-04-12",time:"9AM-2PM",location:"The Diamond District",host:"RVA Foodies Collective",maxTrucks:8,status:"planning",fee:40,desc:"Brunch trucks + mimosa stations.",attendees:0,apps:[],tags:["brunch"]},
  {id:"e5",title:"Corporate Wellness Fair",date:"2026-04-20",time:"11AM-2PM",location:"Downtown Richmond",host:"Capital One HQ",maxTrucks:6,status:"upcoming",fee:0,desc:"Private corporate event, flat rate paid.",attendees:300,apps:[{tid:"ft5",s:"approved"}],tags:["corporate","private"]},
];

const BOOKINGS = [
  {id:"b1",type:"private",who:"Jennifer Adams",email:"jen@email.com",date:"2026-03-28",time:"4-8PM",location:"West End residence",guests:50,budget:"$500-$800",cuisine:["BBQ","Mexican"],notes:"Graduation party, need 2 trucks.",status:"open",responses:[{tid:"ft1",price:650,msg:"We'd love to cater! Our grad party package includes brisket sliders and cobbler."},{tid:"ft3",price:700,msg:"Perfect event. Full BBQ spread available."}]},
  {id:"b2",type:"corporate",who:"Tom Bradley",email:"tom@techstartup.io",date:"2026-04-02",time:"11:30AM-1:30PM",location:"1001 E Broad St",guests:120,budget:"$1000-$1500",cuisine:["Any"],notes:"Team lunch, prefer 2-3 trucks.",status:"open",responses:[]},
  {id:"b3",type:"wedding",who:"Amanda & Chris",email:"amanda@email.com",date:"2026-05-16",time:"6-10PM",location:"Maymont Gardens",guests:150,budget:"$2000-$3000",cuisine:["Southern","Dessert","Beverages"],notes:"Wedding reception, 3 trucks with cohesive look.",status:"open",responses:[{tid:"ft1",price:1200,msg:"We specialize in wedding catering!"}]},
];

const ADS = [
  {id:"a1",tid:"ft2",title:"🌮 Taco Tuesday Special!",content:"Half-price Al Pastor tacos Tuesdays 5-7pm! Mention 'FAFT' for a free churro.",impressions:1240,clicks:89,status:"active"},
  {id:"a2",tid:"ft6",title:"🥤 VA250 Partnership Launch!",content:"Wild Bill's is the official VA250 beverage partner! Try our limited-edition Virginia Cream Soda.",impressions:2100,clicks:156,status:"active"},
];

const PENDING = [
  {id:"pm1",name:"Sarah's Sweet Treats",type:"truck",applied:"2026-02-19",answers:["Artisan cupcakes and cookies","Mobile bakery truck"]},
  {id:"pm2",name:"RVA Brewery Tour Co.",type:"host",applied:"2026-02-18",answers:["We organize brewery tours","Want to add food truck stops","6 events planned for spring"]},
  {id:"pm3",name:"Mike Thompson",type:"customer",applied:"2026-02-20",answers:["Just moved to Richmond","Love food trucks!"]},
];

const SPAM = [
  {id:"s1",author:"CryptoKing99",content:"🚀 Make $5000/day trading crypto! DM me!! 💰💰",time:"2 hours ago",conf:98,reason:"Financial spam"},
  {id:"s2",author:"BestDeals2026",content:"Check out www.totallylegit-deals.biz — 90% OFF!",time:"5 hours ago",conf:95,reason:"Suspicious URL"},
];

function reducer(st, a) {
  switch(a.type) {
    case "SET_VIEW": return {...st, view:a.p};
    case "APPROVE_MEMBER": return {...st, pending:st.pending.filter(m=>m.id!==a.p)};
    case "REJECT_MEMBER": return {...st, pending:st.pending.filter(m=>m.id!==a.p)};
    case "REMOVE_SPAM": return {...st, spam:st.spam.filter(s=>s.id!==a.p)};
    case "KEEP_SPAM": return {...st, spam:st.spam.filter(s=>s.id!==a.p)};
    case "TOGGLE_TRUCK": return {...st, trucks:st.trucks.map(t=>t.id===a.p?{...t,status:t.status==="active"?"inactive":"active"}:t)};
    case "APPROVE_APP": return {...st, events:st.events.map(e=>e.id===a.p.eid?{...e,apps:e.apps.map(ap=>ap.tid===a.p.tid?{...ap,s:"approved"}:ap)}:e)};
    case "REJECT_APP": return {...st, events:st.events.map(e=>e.id===a.p.eid?{...e,apps:e.apps.map(ap=>ap.tid===a.p.tid?{...ap,s:"rejected"}:ap)}:e)};
    default: return st;
  }
}

// Components
const Badge = ({children,color=T.blue,glow}) => (
  <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:color+"18",color,border:`1px solid ${color}25`,boxShadow:glow?`0 0 12px ${color}20`:"none"}}>{children}</span>
);
const Btn = ({children,onClick,v="primary",s="md",full,disabled,style:x={}}) => {
  const vs={primary:{background:`linear-gradient(135deg,${T.orange},#ea580c)`,color:"#fff",border:"none",boxShadow:`0 4px 16px ${T.orangeGlow}`},secondary:{background:T.surface,color:"rgba(255,255,255,0.7)",border:`1px solid ${T.border}`},danger:{background:T.red+"18",color:T.red,border:`1px solid ${T.red}25`},success:{background:T.green+"18",color:T.green,border:`1px solid ${T.green}25`},ghost:{background:"transparent",color:T.textMuted,border:"none"},cyan:{background:T.cyan+"18",color:T.cyan,border:`1px solid ${T.cyan}25`},premium:{background:`linear-gradient(135deg,${T.amber},${T.orange})`,color:"#fff",border:"none"}};
  const ss={sm:{padding:"6px 14px",fontSize:12},md:{padding:"10px 22px",fontSize:13},lg:{padding:"14px 32px",fontSize:15}};
  return <button onClick={disabled?undefined:onClick} style={{...ss[s],...vs[v],borderRadius:10,cursor:disabled?"not-allowed":"pointer",fontWeight:600,fontFamily:"'Outfit',sans-serif",transition:"all 0.25s",display:"inline-flex",alignItems:"center",gap:7,width:full?"100%":"auto",justifyContent:full?"center":"flex-start",opacity:disabled?0.4:1,...x}}>{children}</button>;
};
const Card = ({children,style:x={},onClick,pad=24}) => (
  <div onClick={onClick} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:pad,transition:"all 0.25s",cursor:onClick?"pointer":"default",...x}} onMouseEnter={e=>{e.currentTarget.style.background=T.surfaceHover;e.currentTarget.style.borderColor=T.borderHover}} onMouseLeave={e=>{e.currentTarget.style.background=T.surface;e.currentTarget.style.borderColor=T.border}}>{children}</div>
);
const StatCard = ({icon,label,value,sub,accent="#fff",trend}) => (
  <Card><div style={{position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:-24,right:-12,fontSize:72,opacity:0.04}}>{icon}</div>
    <div style={{fontSize:11,color:T.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"'IBM Plex Mono',monospace"}}>{label}</div>
    <div style={{display:"flex",alignItems:"baseline",gap:10,marginTop:8}}>
      <span style={{fontSize:34,fontWeight:700,color:accent,fontFamily:"'Outfit',sans-serif"}}>{value}</span>
      {trend&&<span style={{fontSize:12,color:trend>0?T.green:T.red,fontWeight:600}}>{trend>0?"↑":"↓"}{Math.abs(trend)}%</span>}
    </div>
    {sub&&<div style={{fontSize:12,color:T.textDim,marginTop:4}}>{sub}</div>}
  </div></Card>
);
const Avatar = ({name,color=T.orange,size=40}) => (
  <div style={{width:size,height:size,borderRadius:size/3,flexShrink:0,background:`linear-gradient(135deg,${color},${color}88)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:size*0.4}}>{name?.charAt(0)||"?"}</div>
);
const ProgressBar = ({value,color=T.orange}) => (
  <div style={{width:"100%",height:6,borderRadius:3,background:"rgba(255,255,255,0.08)",overflow:"hidden"}}><div style={{width:`${value}%`,height:"100%",borderRadius:3,background:color,transition:"width 0.6s"}}/></div>
);
const Toggle = ({on,onClick}) => (
  <div onClick={onClick} style={{width:44,height:24,borderRadius:12,cursor:"pointer",background:on?T.orange:"rgba(255,255,255,0.12)",transition:"all 0.3s",position:"relative"}}>
    <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:on?23:3,transition:"all 0.3s",boxShadow:"0 2px 4px rgba(0,0,0,0.2)"}}/>
  </div>
);
const TabBar = ({tabs,active,onChange}) => (
  <div style={{display:"flex",gap:4,background:"rgba(255,255,255,0.03)",borderRadius:10,padding:3,marginBottom:24}}>
    {tabs.map(t=><div key={t.id} onClick={()=>onChange(t.id)} style={{padding:"8px 18px",borderRadius:7,cursor:"pointer",background:active===t.id?T.orange+"20":"transparent",color:active===t.id?T.orange:T.textMuted,fontSize:13,fontWeight:active===t.id?600:400,transition:"all 0.2s"}}>{t.icon} {t.label}{t.count!=null?` (${t.count})`:""}</div>)}
  </div>
);
const Empty = ({icon,title,sub}) => <div style={{textAlign:"center",padding:"48px 24px",color:T.textDim}}><div style={{fontSize:48,marginBottom:12,opacity:0.5}}>{icon}</div><div style={{fontSize:16,fontWeight:600,color:T.textMuted}}>{title}</div>{sub&&<div style={{fontSize:13,marginTop:6}}>{sub}</div>}</div>;
const SH = ({title,subtitle,action}) => <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:28}}><div><h2 style={{fontSize:28,fontWeight:700,color:"#fff",margin:0,fontFamily:"'Syne',sans-serif",letterSpacing:"-0.02em"}}>{title}</h2>{subtitle&&<p style={{color:T.textMuted,margin:"6px 0 0",fontSize:14}}>{subtitle}</p>}</div>{action}</div>;

// ═══ DASHBOARD ═══
function DashboardView({st,d}) {
  const prem=st.trucks.filter(t=>t.plan==="premium").length;
  const free=st.trucks.filter(t=>t.plan==="free").length;
  const pending=st.pending.length+st.spam.length+st.bookings.filter(b=>b.status==="open").length;
  return <div style={{animation:"fadeIn 0.4s ease"}}>
    <SH title="Command Center" subtitle="Find a Food Truck RVA — Platform Overview"/>
    {/* Revenue Banner */}
    <div style={{background:`linear-gradient(135deg,rgba(249,115,22,0.12),rgba(245,158,11,0.08),rgba(168,85,247,0.06))`,border:`1px solid ${T.orange}25`,borderRadius:18,padding:"24px 32px",marginBottom:28,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div>
        <div style={{fontSize:12,color:T.amber,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'IBM Plex Mono',monospace"}}>Monthly Recurring Revenue</div>
        <div style={{fontSize:42,fontWeight:800,color:"#fff",fontFamily:"'Outfit',sans-serif",marginTop:4}}>${prem*10}<span style={{fontSize:18,color:T.textMuted,fontWeight:400}}>/mo</span></div>
        <div style={{fontSize:13,color:T.textMuted,marginTop:4}}>{prem} premium × $10/mo · {free} free tier</div>
      </div>
      <div style={{textAlign:"right",display:"flex",gap:24}}>
        <div><div style={{fontSize:24,fontWeight:700,color:T.green}}>↑ 16.7%</div><div style={{fontSize:11,color:T.textDim}}>vs last month</div></div>
        <div><div style={{fontSize:24,fontWeight:700,color:"#fff"}}>12,400</div><div style={{fontSize:11,color:T.textDim}}>ad impressions</div></div>
      </div>
    </div>
    {/* Stats */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
      <StatCard icon="👥" label="Total Members" value="4,100" sub="+47 this week" accent={T.blue} trend={4.6}/>
      <StatCard icon="🚚" label="Food Trucks" value={st.trucks.length} sub={`${prem} premium · ${free} free`} accent={T.orange}/>
      <StatCard icon="📅" label="Active Events" value={st.events.filter(e=>e.status==="upcoming").length} sub={`${st.events.filter(e=>e.status==="planning").length} in planning`} accent={T.purple}/>
      <StatCard icon="📋" label="Open Bookings" value={st.bookings.filter(b=>b.status==="open").length} sub="8 this month" accent={T.cyan}/>
    </div>
    {/* Two Column */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      <Card style={{background:"rgba(255,255,255,0.02)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><h3 style={{margin:0,fontSize:15,color:"#fff",fontFamily:"'Syne',sans-serif"}}>⚡ Action Queue</h3><Badge color={T.orange} glow>{pending} pending</Badge></div>
        {st.pending.slice(0,3).map(m=><div key={m.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}><Avatar name={m.name} color={m.type==="truck"?T.orange:m.type==="host"?T.purple:T.blue} size={32}/>
            <div><div style={{color:"#fff",fontSize:13,fontWeight:500}}>{m.name}</div><div style={{color:T.textDim,fontSize:11}}>{m.type==="truck"?"🚚 Truck":m.type==="host"?"📅 Host":"👤 Customer"} · {m.applied}</div></div>
          </div>
          <div style={{display:"flex",gap:6}}><Btn s="sm" v="success" onClick={()=>d({type:"APPROVE_MEMBER",p:m.id})}>✓</Btn><Btn s="sm" v="danger" onClick={()=>d({type:"REJECT_MEMBER",p:m.id})}>✕</Btn></div>
        </div>)}
        {st.bookings.filter(b=>b.status==="open").slice(0,2).map(b=><div key={b.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
          <div><div style={{color:T.cyan,fontSize:13,fontWeight:500}}>📋 {b.type.charAt(0).toUpperCase()+b.type.slice(1)} Booking</div><div style={{color:T.textDim,fontSize:11}}>{b.who} · {b.guests} guests · {b.budget}</div></div>
          <Btn s="sm" v="cyan" onClick={()=>d({type:"SET_VIEW",p:"bookings"})}>View</Btn>
        </div>)}
        {pending===0&&<Empty icon="✅" title="All caught up!"/>}
      </Card>
      <Card style={{background:"rgba(255,255,255,0.02)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><h3 style={{margin:0,fontSize:15,color:"#fff",fontFamily:"'Syne',sans-serif"}}>📢 Active Ads</h3><Btn s="sm" v="secondary" onClick={()=>d({type:"SET_VIEW",p:"ads"})}>Manage</Btn></div>
        {ADS.filter(a=>a.status==="active").map(a=>{const tk=st.trucks.find(t=>t.id===a.tid);return <div key={a.id} style={{padding:16,background:"rgba(255,255,255,0.02)",borderRadius:12,marginBottom:10,border:`1px solid ${T.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}><div><div style={{color:"#fff",fontWeight:600,fontSize:14}}>{a.title}</div><div style={{color:T.textMuted,fontSize:12}}>by {tk?.name}</div><div style={{color:T.textDim,fontSize:12,marginTop:6}}>{a.content}</div></div><Badge color={T.green}>LIVE</Badge></div>
          <div style={{display:"flex",gap:16,marginTop:10}}><span style={{fontSize:11,color:T.textMuted}}>👁 {a.impressions.toLocaleString()}</span><span style={{fontSize:11,color:T.textMuted}}>👆 {a.clicks}</span><span style={{fontSize:11,color:T.textMuted}}>📊 {((a.clicks/a.impressions)*100).toFixed(1)}%</span></div>
        </div>})}
      </Card>
    </div>
    {/* Events + Searches */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginTop:18}}>
      <Card style={{background:"rgba(255,255,255,0.02)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><h3 style={{margin:0,fontSize:15,color:"#fff",fontFamily:"'Syne',sans-serif"}}>📅 Next Events</h3><Btn s="sm" v="secondary" onClick={()=>d({type:"SET_VIEW",p:"events"})}>View All</Btn></div>
        {st.events.filter(e=>e.status==="upcoming").slice(0,3).map(e=><div key={e.id} style={{display:"flex",gap:14,padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
          <div style={{width:48,height:48,borderRadius:12,flexShrink:0,background:`linear-gradient(135deg,${T.orange}20,${T.amber}15)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><div style={{color:T.orange,fontSize:10,fontWeight:700}}>{new Date(e.date).toLocaleDateString("en-US",{month:"short"})}</div><div style={{color:"#fff",fontSize:18,fontWeight:700}}>{new Date(e.date).getDate()}</div></div>
          <div><div style={{color:"#fff",fontWeight:600,fontSize:13}}>{e.title}</div><div style={{color:T.textDim,fontSize:11}}>📍 {e.location} · 🚚 {e.apps.filter(a=>a.s==="approved").length}/{e.maxTrucks} · {e.attendees} expected</div></div>
        </div>)}
      </Card>
      <Card style={{background:"rgba(255,255,255,0.02)"}}>
        <h3 style={{margin:"0 0 18px",fontSize:15,color:"#fff",fontFamily:"'Syne',sans-serif"}}>🔍 Trending Searches</h3>
        {["BBQ near me","taco trucks","food truck catering","brunch trucks","wedding food truck"].map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:i<4?`1px solid ${T.border}`:"none"}}><span style={{color:T.orange,fontWeight:700,fontSize:14,fontFamily:"'IBM Plex Mono',monospace",width:24}}>#{i+1}</span><span style={{color:"rgba(255,255,255,0.6)",fontSize:13}}>{s}</span></div>)}
      </Card>
    </div>
  </div>;
}

// ═══ TRUCKS ═══
function TrucksView({st,d}) {
  const [filter,setFilter]=useState("all");
  const [sel,setSel]=useState(null);
  const filtered=filter==="all"?st.trucks:filter==="premium"?st.trucks.filter(t=>t.plan==="premium"):filter==="free"?st.trucks.filter(t=>t.plan==="free"):st.trucks.filter(t=>t.status===filter);
  const det=st.trucks.find(t=>t.id===sel);
  return <div style={{animation:"fadeIn 0.4s ease"}}>
    <SH title="Food Trucks" subtitle={`${st.trucks.length} registered · ${st.trucks.filter(t=>t.plan==="premium").length} premium subscribers`}
      action={<div style={{display:"flex",gap:8}}>{["all","premium","free","active","inactive"].map(f=><Btn key={f} s="sm" v={filter===f?"primary":"secondary"} onClick={()=>setFilter(f)}>{f==="all"?"All":f==="premium"?"⭐ Premium":f==="free"?"Free":f==="active"?"🟢 Live":"⚫ Off"}</Btn>)}</div>}/>
    <div style={{display:"grid",gridTemplateColumns:sel?"1fr 380px":"1fr",gap:18}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
        {filtered.map(t=><Card key={t.id} onClick={()=>setSel(t.id)} style={{cursor:"pointer",borderColor:sel===t.id?T.orange+"50":T.border}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
            <div style={{display:"flex",gap:14}}>
              <div style={{width:52,height:52,borderRadius:14,fontSize:28,background:t.plan==="premium"?`linear-gradient(135deg,${T.orange}20,${T.amber}15)`:"rgba(255,255,255,0.04)",display:"flex",alignItems:"center",justifyContent:"center",border:t.plan==="premium"?`1px solid ${T.orange}30`:"none"}}>{t.img}</div>
              <div><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{color:"#fff",fontWeight:700,fontSize:15}}>{t.name}</span>{t.verified&&<span style={{fontSize:14,color:T.blue}}>✓</span>}</div>
                <div style={{color:T.textMuted,fontSize:12}}>{t.cuisine} · {t.owner}</div>
                <div style={{display:"flex",gap:6,marginTop:8}}><Badge color={t.plan==="premium"?T.amber:T.textMuted}>{t.plan==="premium"?"⭐ PREMIUM":"FREE"}</Badge><Badge color={t.status==="active"?T.green:"#666"}>{t.status==="active"?"● LIVE":"● OFF"}</Badge></div>
              </div>
            </div>
            <div style={{textAlign:"right"}}><div style={{color:T.amber,fontSize:14,fontWeight:600}}>⭐ {t.rating}</div><div style={{color:T.textDim,fontSize:11}}>{t.reviews} reviews</div></div>
          </div>
          {t.plan==="premium"&&<div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between"}}><div style={{fontSize:12,color:T.textMuted}}>📋 {t.bookings} bookings · {t.adUsed?"📢 Ad used":"📢 Ad available"}</div><span style={{fontSize:12,color:T.green,fontWeight:600}}>${t.revenue.toLocaleString()} /mo</span></div>}
        </Card>)}
      </div>
      {sel&&det&&<div style={{animation:"slideRight 0.3s ease"}}><Card style={{position:"sticky",top:24}}>
        <div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:48,marginBottom:8}}>{det.img}</div><div style={{fontSize:20,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{det.name}</div><div style={{color:T.textMuted,fontSize:13,marginTop:2}}>{det.cuisine}</div>
          <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:10}}><Badge color={det.plan==="premium"?T.amber:T.textMuted}>{det.plan==="premium"?"⭐ Premium $10/mo":"Free Tier"}</Badge>{det.verified&&<Badge color={T.blue}>✓ Verified</Badge>}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
          <div style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:12,textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:T.amber}}>⭐ {det.rating}</div><div style={{fontSize:11,color:T.textDim}}>{det.reviews} reviews</div></div>
          <div style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:12,textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:T.green}}>{det.bookings}</div><div style={{fontSize:11,color:T.textDim}}>bookings</div></div>
        </div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.6,marginBottom:18}}>{det.desc}</div>
        <div style={{marginBottom:14}}><div style={{fontSize:11,color:T.textDim,fontWeight:600,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.08em"}}>Specialties</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{det.specialties.map(s=><Badge key={s} color={T.orange}>{s}</Badge>)}</div></div>
        <div style={{fontSize:13,color:T.textMuted,lineHeight:2}}>📞 {det.phone}<br/>🕐 {det.schedule}<br/>💰 {det.price}<br/>📸 {det.social.instagram}</div>
        {det.plan==="premium"&&<div style={{marginTop:18,paddingTop:18,borderTop:`1px solid ${T.border}`}}><div style={{fontSize:11,color:T.textDim,fontWeight:600,marginBottom:10,textTransform:"uppercase"}}>Revenue</div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,color:T.textMuted}}>This month</span><span style={{fontSize:13,color:T.green,fontWeight:600}}>${det.revenue.toLocaleString()}</span></div></div>}
        <div style={{marginTop:20}}><Btn s="sm" v={det.status==="active"?"danger":"success"} full onClick={()=>d({type:"TOGGLE_TRUCK",p:det.id})}>{det.status==="active"?"Set Offline":"Set Active"}</Btn></div>
      </Card></div>}
    </div>
  </div>;
}

// ═══ LIVE TRACKER ═══
function TrackerView({st,d}) {
  const [sel,setSel]=useState(null);
  const [filter,setFilter]=useState("active");
  const filtered=filter==="all"?st.trucks:st.trucks.filter(t=>t.status===filter);
  const det=st.trucks.find(t=>t.id===sel);
  return <div style={{animation:"fadeIn 0.4s ease"}}>
    <SH title="Live Tracker" subtitle="Real-time food truck locations across Richmond" action={<div style={{display:"flex",gap:6}}>{["active","all"].map(f=><Btn key={f} s="sm" v={filter===f?"primary":"secondary"} onClick={()=>setFilter(f)}>{f==="active"?"🟢 Live Only":"All"}</Btn>)}</div>}/>
    <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:18}}>
      <div style={{maxHeight:600,overflowY:"auto"}}>{filtered.map(t=><Card key={t.id} pad={14} onClick={()=>setSel(t.id)} style={{marginBottom:8,cursor:"pointer",borderColor:sel===t.id?T.orange+"50":T.border}}>
        <div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:28}}>{t.img}</span><div style={{flex:1}}><div style={{color:"#fff",fontWeight:600,fontSize:13}}>{t.name}</div><div style={{color:T.textDim,fontSize:11}}>{t.cuisine}</div><div style={{display:"flex",gap:4,marginTop:4}}><Badge color={t.status==="active"?T.green:"#666"}>{t.status==="active"?"LIVE":"OFF"}</Badge>{t.plan==="premium"&&<Badge color={T.amber}>⭐</Badge>}</div></div><span style={{color:T.amber,fontSize:12,fontWeight:600}}>⭐{t.rating}</span></div>
      </Card>)}</div>
      <Card style={{minHeight:600,position:"relative",overflow:"hidden"}}>
        <div style={{width:"100%",height:"100%",position:"relative",background:`radial-gradient(ellipse at 35% 40%,${T.orange}08 0%,transparent 50%),radial-gradient(ellipse at 65% 60%,${T.blue}06 0%,transparent 50%),linear-gradient(180deg,#0f1117,#0a0b0f)`}}>
          <svg width="100%" height="100%" style={{position:"absolute",inset:0,opacity:0.04}}>{[...Array(25)].map((_,i)=><line key={`h${i}`} x1="0" y1={`${i*4}%`} x2="100%" y2={`${i*4}%`} stroke="white" strokeWidth="0.5"/>)}{[...Array(25)].map((_,i)=><line key={`v${i}`} x1={`${i*4}%`} y1="0" x2={`${i*4}%`} y2="100%" stroke="white" strokeWidth="0.5"/>)}</svg>
          <div style={{position:"absolute",top:16,left:20,zIndex:2}}><div style={{color:"rgba(255,255,255,0.15)",fontSize:10,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.15em"}}>RICHMOND, VIRGINIA</div></div>
          {filtered.map(t=>{const x=12+((t.lng+77.5)*900)%72;const y=12+((t.lat-37.5)*700)%65;return <div key={t.id} onClick={()=>setSel(t.id)} style={{position:"absolute",left:`${x}%`,top:`${y+8}%`,transform:"translate(-50%,-50%)",cursor:"pointer",zIndex:sel===t.id?10:1}}>
            {t.status==="active"&&<div style={{position:"absolute",width:44,height:44,borderRadius:"50%",border:`2px solid ${T.orange}`,top:"50%",left:"50%",transform:"translate(-50%,-50%)",opacity:0.25,animation:"pulse 2.5s infinite"}}/>}
            <div style={{width:40,height:40,borderRadius:"50%",fontSize:20,background:sel===t.id?T.orange:t.status==="active"?T.orange+"cc":"#555",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:sel===t.id?`0 0 24px ${T.orange}50`:"0 4px 12px rgba(0,0,0,0.4)",border:sel===t.id?"2px solid #fff":"2px solid rgba(255,255,255,0.1)",transition:"all 0.3s"}}>{t.img}</div>
            {sel===t.id&&det&&<div style={{position:"absolute",top:"110%",left:"50%",transform:"translateX(-50%)",background:"#181a22",border:`1px solid ${T.border}`,borderRadius:12,padding:16,minWidth:220,boxShadow:"0 12px 40px rgba(0,0,0,0.6)",zIndex:20}}>
              <div style={{color:"#fff",fontWeight:700,fontSize:14}}>{det.name}</div><div style={{color:T.orange,fontSize:12}}>{det.cuisine}</div>
              <div style={{color:T.textDim,fontSize:11,marginTop:6,lineHeight:1.6}}>🕐 {det.schedule}<br/>⭐ {det.rating} ({det.reviews} reviews)<br/>💰 {det.price}</div>
              <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>{det.specialties.slice(0,2).map(s=><Badge key={s} color={T.orange}>{s}</Badge>)}</div>
            </div>}
          </div>})}
        </div>
      </Card>
    </div>
  </div>;
}

// ═══ EVENTS ═══
function EventsView({st,d}) {
  const [tab,setTab]=useState("upcoming");
  const [exp,setExp]=useState(null);
  const filtered=tab==="all"?st.events:st.events.filter(e=>e.status===tab);
  return <div style={{animation:"fadeIn 0.4s ease"}}>
    <SH title="Events" subtitle="Food truck events, festivals, and private bookings"/>
    <TabBar active={tab} onChange={setTab} tabs={[{id:"upcoming",label:"Upcoming",icon:"📅",count:st.events.filter(e=>e.status==="upcoming").length},{id:"planning",label:"Planning",icon:"📝",count:st.events.filter(e=>e.status==="planning").length},{id:"all",label:"All",icon:"📋"}]}/>
    <div style={{display:"grid",gap:14}}>{filtered.map(e=>{const isExp=exp===e.id;const pendApps=e.apps.filter(a=>a.s==="pending");return <Card key={e.id} onClick={()=>setExp(isExp?null:e.id)} style={{cursor:"pointer"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
        <div style={{display:"flex",gap:18,alignItems:"start"}}>
          <div style={{width:56,height:56,borderRadius:14,flexShrink:0,background:e.status==="upcoming"?`linear-gradient(135deg,${T.orange}20,${T.amber}15)`:`linear-gradient(135deg,${T.purple}20,${T.blue}15)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><div style={{color:e.status==="upcoming"?T.orange:T.purple,fontSize:10,fontWeight:700}}>{new Date(e.date).toLocaleDateString("en-US",{month:"short"})}</div><div style={{color:"#fff",fontSize:20,fontWeight:700}}>{new Date(e.date).getDate()}</div></div>
          <div><div style={{color:"#fff",fontWeight:700,fontSize:16}}>{e.title}</div><div style={{color:T.textMuted,fontSize:13,marginTop:3}}>📍 {e.location} · 🕐 {e.time}</div><div style={{color:T.textMuted,fontSize:13}}>🏢 {e.host} · 🚚 {e.apps.filter(a=>a.s==="approved").length}/{e.maxTrucks} · {e.fee>0?`$${e.fee} fee`:"No fee"}</div>
            <div style={{display:"flex",gap:6,marginTop:8}}><Badge color={e.status==="upcoming"?T.orange:T.purple}>{e.status.toUpperCase()}</Badge>{pendApps.length>0&&<Badge color={T.amber}>{pendApps.length} pending</Badge>}{e.tags.map(tag=><Badge key={tag} color={T.textMuted}>{tag}</Badge>)}</div>
          </div>
        </div>
        <div style={{color:T.textDim,fontSize:18,transform:isExp?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s"}}>▼</div>
      </div>
      {isExp&&<div style={{marginTop:18,paddingTop:18,borderTop:`1px solid ${T.border}`}} onClick={ev=>ev.stopPropagation()}>
        <p style={{color:"rgba(255,255,255,0.55)",fontSize:13,lineHeight:1.6,margin:"0 0 16px"}}>{e.desc}</p>
        {e.apps.length>0&&<div><div style={{fontSize:12,color:T.textDim,fontWeight:600,marginBottom:10,textTransform:"uppercase"}}>Truck Applications</div>
          {e.apps.map(app=>{const tk=st.trucks.find(t=>t.id===app.tid);return tk?<div key={app.tid} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:22}}>{tk.img}</span><div><span style={{color:"#fff",fontSize:13,fontWeight:500}}>{tk.name}</span><span style={{color:T.textDim,fontSize:11,marginLeft:8}}>{tk.cuisine}</span></div></div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>{tk.plan==="premium"&&<Badge color={T.amber}>⭐ PRIORITY</Badge>}
              {app.s==="pending"?<><Btn s="sm" v="success" onClick={()=>d({type:"APPROVE_APP",p:{eid:e.id,tid:app.tid}})}>Approve</Btn><Btn s="sm" v="danger" onClick={()=>d({type:"REJECT_APP",p:{eid:e.id,tid:app.tid}})}>Decline</Btn></>:<Badge color={app.s==="approved"?T.green:T.red}>{app.s.toUpperCase()}</Badge>}
            </div>
          </div>:null})}
        </div>}
        {e.attendees>0&&<div style={{marginTop:14,display:"flex",gap:20}}><span style={{fontSize:13,color:T.textMuted}}>👥 {e.attendees} expected</span><span style={{fontSize:13,color:T.textMuted}}>📊 Fill: {Math.round((e.apps.filter(a=>a.s==="approved").length/e.maxTrucks)*100)}%</span></div>}
      </div>}
    </Card>})}</div>
  </div>;
}

// ═══ BOOKINGS ═══
function BookingsView({st,d}) {
  const [sel,setSel]=useState(null);
  const det=st.bookings.find(b=>b.id===sel);
  const tc={private:T.blue,corporate:T.purple,wedding:T.amber};
  const ti={private:"🏠",corporate:"🏢",wedding:"💒"};
  return <div style={{animation:"fadeIn 0.4s ease"}}>
    <SH title="Booking Requests" subtitle="Private events, corporate catering, and weddings"/>
    <div style={{display:"grid",gridTemplateColumns:sel?"1fr 420px":"1fr",gap:18}}>
      <div style={{display:"grid",gap:14}}>{st.bookings.map(b=><Card key={b.id} onClick={()=>setSel(b.id)} style={{cursor:"pointer",borderColor:sel===b.id?T.orange+"40":T.border}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
          <div><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}><span style={{fontSize:22}}>{ti[b.type]}</span><div><div style={{color:"#fff",fontWeight:600,fontSize:15}}>{b.who}</div><Badge color={tc[b.type]}>{b.type.toUpperCase()}</Badge></div></div>
            <div style={{color:T.textMuted,fontSize:13,lineHeight:1.7,marginTop:4}}>📅 {b.date} · 🕐 {b.time}<br/>📍 {b.location}<br/>👥 {b.guests} guests · 💰 {b.budget}</div>
            {b.cuisine.length>0&&<div style={{display:"flex",gap:6,marginTop:8}}>{b.cuisine.map(c=><Badge key={c} color={T.orange}>{c}</Badge>)}</div>}
          </div>
          <div style={{textAlign:"right"}}><Badge color={b.status==="open"?T.green:T.textMuted}>{b.status.toUpperCase()}</Badge><div style={{color:T.textDim,fontSize:11,marginTop:6}}>{b.responses.length} response{b.responses.length!==1?"s":""}</div></div>
        </div>
      </Card>)}</div>
      {sel&&det&&<div style={{animation:"slideRight 0.3s ease"}}><Card style={{position:"sticky",top:24}}>
        <div style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{fontSize:28}}>{ti[det.type]}</span><div><div style={{fontSize:18,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{det.who}</div><Badge color={tc[det.type]}>{det.type}</Badge></div></div>
          <div style={{color:"rgba(255,255,255,0.5)",fontSize:13,lineHeight:1.8,marginTop:12}}>📅 {det.date}<br/>🕐 {det.time}<br/>📍 {det.location}<br/>👥 {det.guests} guests<br/>💰 {det.budget}<br/>📧 {det.email}</div>
          {det.notes&&<div style={{color:"rgba(255,255,255,0.45)",fontSize:13,marginTop:12,padding:14,background:"rgba(255,255,255,0.03)",borderRadius:10,lineHeight:1.6,fontStyle:"italic"}}>"{det.notes}"</div>}
        </div>
        <div style={{borderTop:`1px solid ${T.border}`,paddingTop:18}}>
          <div style={{fontSize:12,color:T.textDim,fontWeight:600,marginBottom:12,textTransform:"uppercase"}}>Responses ({det.responses.length})</div>
          {det.responses.length===0&&<div style={{color:T.textDim,fontSize:13,padding:"12px 0"}}>No responses yet. Premium trucks notified first.</div>}
          {det.responses.map((r,i)=>{const tk=st.trucks.find(t=>t.id===r.tid);return tk?<div key={i} style={{padding:14,background:"rgba(255,255,255,0.03)",borderRadius:10,marginBottom:8,border:`1px solid ${T.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:8}}><span>{tk.img}</span><span style={{color:"#fff",fontWeight:600,fontSize:13}}>{tk.name}</span>{tk.plan==="premium"&&<Badge color={T.amber}>⭐</Badge>}</div><span style={{color:T.green,fontWeight:700,fontSize:15}}>${r.price}</span></div>
            <div style={{color:"rgba(255,255,255,0.45)",fontSize:12,lineHeight:1.5}}>{r.msg}</div>
          </div>:null})}
        </div>
      </Card></div>}
    </div>
  </div>;
}

// ═══ MEMBERS ═══
function MembersView({st,d}) {
  const [tab,setTab]=useState("pending");
  const ti={truck:{icon:"🚚",color:T.orange,label:"Food Truck"},host:{icon:"📅",color:T.purple,label:"Event Host"},customer:{icon:"👤",color:T.blue,label:"Customer"}};
  return <div style={{animation:"fadeIn 0.4s ease"}}>
    <SH title="Members" subtitle="Food Trucks, Event Hosts, and Customers"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
      <StatCard icon="👥" label="Total" value="4,100" accent="#fff"/><StatCard icon="🚚" label="Food Trucks" value="7" sub={`${st.trucks.filter(t=>t.plan==="premium").length} premium`} accent={T.orange}/><StatCard icon="📅" label="Event Hosts" value="4" accent={T.purple}/><StatCard icon="👤" label="Customers" value="4,089" accent={T.blue}/>
    </div>
    <TabBar active={tab} onChange={setTab} tabs={[{id:"pending",label:"Pending",icon:"⏳",count:st.pending.length},{id:"welcome",label:"Auto-Welcome",icon:"👋"},{id:"roles",label:"Member Roles",icon:"🏷️"}]}/>
    {tab==="pending"&&<div style={{display:"grid",gap:12}}>
      {st.pending.map(m=><Card key={m.id}><div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
        <div style={{display:"flex",gap:14,alignItems:"start"}}><Avatar name={m.name} color={ti[m.type].color}/>
          <div><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{color:"#fff",fontWeight:600,fontSize:15}}>{m.name}</span><Badge color={ti[m.type].color}>{ti[m.type].icon} {ti[m.type].label}</Badge></div>
            <div style={{color:T.textDim,fontSize:12,marginTop:2}}>Applied {m.applied}</div>
            <div style={{marginTop:10}}>{m.answers.map((a,i)=><div key={i} style={{color:"rgba(255,255,255,0.5)",fontSize:13,padding:"3px 0"}}>"{a}"</div>)}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}><Btn v="success" s="sm" onClick={()=>d({type:"APPROVE_MEMBER",p:m.id})}>✓ Approve</Btn><Btn v="danger" s="sm" onClick={()=>d({type:"REJECT_MEMBER",p:m.id})}>✕ Decline</Btn></div>
      </div></Card>)}
      {st.pending.length===0&&<Empty icon="✅" title="No pending requests"/>}
    </div>}
    {tab==="welcome"&&<div style={{display:"grid",gap:14}}>
      {[{type:"truck",title:"Food Truck Welcome",msg:"Welcome to FAFT RVA, {name}! 🚚\n\nAs a vendor you can:\n📍 Post daily location & hours\n📅 Apply to events\n📋 Respond to bookings\n📢 Premium ($10/mo): weekly ads + priority!\n\nComplete your truck profile to get started."},{type:"host",title:"Event Host Welcome",msg:"Welcome to FAFT RVA, {name}! 📅\n\nAs an event host you can:\n📋 Post events trucks can apply to\n🚚 Browse verified truck directory\n📊 Manage vendor applications\n💬 Direct message truck owners\n\nCreate your first event!"},{type:"customer",title:"Customer Welcome",msg:"Welcome to FAFT RVA, {name}! 🎉\n\nHere's how to find great food:\n📍 Check Live Tracker for locations\n📅 Browse upcoming events\n⭐ Save favorite trucks\n📋 Submit booking requests\n\nEnjoy RVA's food truck scene!"}].map(w=><Card key={w.type}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{color:"#fff",fontWeight:600,fontSize:15}}>{w.title}</span><Badge color={T.green}>ACTIVE</Badge></div><Toggle on={true} onClick={()=>{}}/></div>
        <pre style={{color:"rgba(255,255,255,0.45)",fontSize:12,fontFamily:"'IBM Plex Mono',monospace",background:"rgba(0,0,0,0.2)",padding:16,borderRadius:10,whiteSpace:"pre-wrap",margin:0,lineHeight:1.7}}>{w.msg}</pre>
      </Card>)}
    </div>}
    {tab==="roles"&&<div style={{display:"grid",gap:14}}>
      {[{role:"Food Truck (Free)",color:T.textMuted,icon:"🚚",perks:["Basic profile listing","Apply to events","Respond to bookings","1 location post/day"]},{role:"Food Truck Premium — $10/mo",color:T.amber,icon:"⭐",perks:["Everything in Free","Weekly promotional ad","Priority booking access","Verified badge","Analytics dashboard","Unlimited posts","Featured in search","Direct messaging"]},{role:"Event Host",color:T.purple,icon:"📅",perks:["Create & manage events","Browse truck directory","Vendor app management","Attendee RSVP tracking"]},{role:"Customer",color:T.blue,icon:"👤",perks:["Browse trucks & locations","Event discovery","Submit booking requests","Save favorites & reviews"]}].map(r=><Card key={r.role}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}><span style={{fontSize:24}}>{r.icon}</span><span style={{color:r.color,fontWeight:700,fontSize:16,fontFamily:"'Syne',sans-serif"}}>{r.role}</span></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>{r.perks.map(p=><div key={p} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"rgba(255,255,255,0.55)"}}><span style={{color:r.color,fontSize:10}}>●</span>{p}</div>)}</div>
      </Card>)}
    </div>}
  </div>;
}

// ═══ ADS ═══
function AdsView({st}) {
  return <div style={{animation:"fadeIn 0.4s ease"}}>
    <SH title="Ad Manager" subtitle="Weekly promotional ads for premium trucks ($10/mo = 1 ad/week)"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:28}}>
      <StatCard icon="📢" label="Active Ads" value={ADS.filter(a=>a.status==="active").length} accent={T.green}/><StatCard icon="👁" label="Total Impressions" value={ADS.reduce((s,a)=>s+a.impressions,0).toLocaleString()} accent={T.blue}/><StatCard icon="👆" label="Avg CTR" value={`${(ADS.reduce((s,a)=>s+(a.clicks/a.impressions),0)/ADS.length*100).toFixed(1)}%`} accent={T.amber}/>
    </div>
    <Card style={{marginBottom:18}}><h3 style={{margin:"0 0 18px",fontSize:15,fontFamily:"'Syne',sans-serif"}}>📢 Active Ads</h3>
      {ADS.map(a=>{const tk=st.trucks.find(t=>t.id===a.tid);return <div key={a.id} style={{padding:20,background:"rgba(255,255,255,0.02)",borderRadius:12,marginBottom:12,border:`1px solid ${T.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:12}}><div style={{display:"flex",gap:12,alignItems:"center"}}><span style={{fontSize:28}}>{tk?.img}</span><div><div style={{color:"#fff",fontWeight:700,fontSize:16}}>{a.title}</div><div style={{color:T.textMuted,fontSize:12}}>by {tk?.name}</div></div></div><Badge color={T.green} glow>LIVE</Badge></div>
        <div style={{color:"rgba(255,255,255,0.5)",fontSize:13,lineHeight:1.6,padding:"12px 16px",background:"rgba(0,0,0,0.15)",borderRadius:10,marginBottom:14}}>{a.content}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}><div style={{textAlign:"center",padding:10,background:"rgba(255,255,255,0.03)",borderRadius:8}}><div style={{fontSize:20,fontWeight:700,color:T.blue}}>{a.impressions.toLocaleString()}</div><div style={{fontSize:11,color:T.textDim}}>Impressions</div></div><div style={{textAlign:"center",padding:10,background:"rgba(255,255,255,0.03)",borderRadius:8}}><div style={{fontSize:20,fontWeight:700,color:T.green}}>{a.clicks}</div><div style={{fontSize:11,color:T.textDim}}>Clicks</div></div><div style={{textAlign:"center",padding:10,background:"rgba(255,255,255,0.03)",borderRadius:8}}><div style={{fontSize:20,fontWeight:700,color:T.amber}}>{((a.clicks/a.impressions)*100).toFixed(1)}%</div><div style={{fontSize:11,color:T.textDim}}>CTR</div></div></div>
      </div>})}
    </Card>
    <Card><h3 style={{margin:"0 0 18px",fontSize:15,fontFamily:"'Syne',sans-serif"}}>🚚 Truck Ad Status</h3>
      {st.trucks.map(t=><div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:22}}>{t.img}</span><div><span style={{color:"#fff",fontWeight:500,fontSize:13}}>{t.name}</span><div style={{marginTop:2}}><Badge color={t.plan==="premium"?T.amber:T.textMuted}>{t.plan==="premium"?"⭐ PREMIUM":"FREE"}</Badge></div></div></div>
        <div>{t.plan!=="premium"?<span style={{color:T.textDim,fontSize:12}}>Upgrade for ads</span>:t.adUsed?<Badge color={T.textMuted}>Used this week</Badge>:<Badge color={T.green}>📢 Available</Badge>}</div>
      </div>)}
    </Card>
  </div>;
}

// ═══ MODERATION ═══
function ModView({st,d}) {
  return <div style={{animation:"fadeIn 0.4s ease"}}>
    <SH title="Moderation" subtitle="AI-powered spam detection"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:28}}>
      <StatCard icon="🛡️" label="Flagged" value={st.spam.length} accent={T.red}/><StatCard icon="🗑️" label="Removed (Month)" value="12" accent={T.orange}/><StatCard icon="⚡" label="Avg Response" value="14 min" accent={T.green}/>
    </div>
    <Card><h3 style={{margin:"0 0 18px",fontSize:15,fontFamily:"'Syne',sans-serif"}}>Flagged Content</h3>
      {st.spam.map(s=><div key={s.id} style={{padding:18,background:s.conf>50?"rgba(239,68,68,0.04)":"rgba(255,255,255,0.02)",borderRadius:12,marginBottom:10,border:`1px solid ${s.conf>50?T.red+"20":T.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}><div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{color:"#fff",fontWeight:600,fontSize:14}}>{s.author}</span><span style={{color:T.textDim,fontSize:12}}>{s.time}</span></div>
          <div style={{padding:"10px 14px",background:"rgba(0,0,0,0.2)",borderRadius:8,color:"rgba(255,255,255,0.6)",fontSize:13,marginBottom:10}}>{s.content}</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}><ProgressBar value={s.conf} color={s.conf>70?T.red:T.amber}/><span style={{color:s.conf>70?T.red:T.amber,fontSize:12,fontWeight:600,minWidth:36}}>{s.conf}%</span><span style={{color:T.textDim,fontSize:11}}>{s.reason}</span></div>
        </div><div style={{display:"flex",gap:6,marginLeft:14}}><Btn s="sm" v="success" onClick={()=>d({type:"KEEP_SPAM",p:s.id})}>✓</Btn><Btn s="sm" v="danger" onClick={()=>d({type:"REMOVE_SPAM",p:s.id})}>🗑️</Btn></div></div>
      </div>)}
      {st.spam.length===0&&<Empty icon="🛡️" title="All clear!"/>}
    </Card>
  </div>;
}

// ═══ SETTINGS ═══
function SettingsView() {
  const [s,setS]=useState({aiSpam:true,autoWelcome:true,postApproval:false,truckVerify:true,bookingNotify:true,eventAutoApprove:false});
  const tog=k=>setS(p=>({...p,[k]:!p[k]}));
  const Row=({icon,title,desc,right})=><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:`1px solid ${T.border}`}}><div style={{display:"flex",gap:12,alignItems:"center"}}><span style={{fontSize:20}}>{icon}</span><div><div style={{color:"#fff",fontWeight:500,fontSize:14}}>{title}</div><div style={{color:T.textDim,fontSize:12,marginTop:1}}>{desc}</div></div></div>{right}</div>;
  return <div style={{animation:"fadeIn 0.4s ease"}}>
    <SH title="Settings" subtitle="Platform configuration and business rules"/>
    <Card style={{marginBottom:18}}><h3 style={{margin:"0 0 18px",fontSize:12,color:T.textDim,textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"'IBM Plex Mono',monospace"}}>Monetization</h3>
      <Row icon="💰" title="Premium Price" desc="Monthly fee for food truck premium tier" right={<span style={{color:T.amber,fontWeight:700,fontSize:18}}>$10/mo</span>}/>
      <Row icon="📢" title="Ad Frequency" desc="How often premium trucks can post ads" right={<Badge color={T.amber}>1x per week</Badge>}/>
      <Row icon="📋" title="Booking Commission" desc="Platform fee on completed bookings" right={<Badge color={T.green}>0% (free)</Badge>}/>
    </Card>
    <Card style={{marginBottom:18}}><h3 style={{margin:"0 0 18px",fontSize:12,color:T.textDim,textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"'IBM Plex Mono',monospace"}}>Automation</h3>
      <Row icon="🛡️" title="AI Spam Detection" desc="Auto-flag suspicious posts" right={<Toggle on={s.aiSpam} onClick={()=>tog("aiSpam")}/>}/>
      <Row icon="👋" title="Auto-Welcome" desc="Role-based welcome messages" right={<Toggle on={s.autoWelcome} onClick={()=>tog("autoWelcome")}/>}/>
      <Row icon="✅" title="Post Pre-Approval" desc="Require admin approval" right={<Toggle on={s.postApproval} onClick={()=>tog("postApproval")}/>}/>
      <Row icon="🚚" title="Truck Verification" desc="Verify owners before badges" right={<Toggle on={s.truckVerify} onClick={()=>tog("truckVerify")}/>}/>
      <Row icon="🔔" title="Priority Booking Alerts" desc="Notify premium trucks first" right={<Toggle on={s.bookingNotify} onClick={()=>tog("bookingNotify")}/>}/>
      <Row icon="📅" title="Event Auto-Approve" desc="Auto-approve premium truck apps" right={<Toggle on={s.eventAutoApprove} onClick={()=>tog("eventAutoApprove")}/>}/>
    </Card>
    <Card><h3 style={{margin:"0 0 18px",fontSize:12,color:T.textDim,textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"'IBM Plex Mono',monospace"}}>Platform Rules</h3>
      {["Food trucks must verify before posting schedules","Premium trucks ($10/mo) get 1 weekly ad + priority bookings","Event hosts need verified organization profiles","No spam, MLM, or off-topic posts","Constructive reviews only — no personal attacks","Tag posts: [LOCATION] [EVENT] [REVIEW] [BOOKING]","Premium truck responses shown first in bookings"].map((r,i)=><div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:i<6?`1px solid ${T.border}`:"none"}}><span style={{color:T.orange,fontWeight:700,fontSize:13,fontFamily:"'IBM Plex Mono',monospace",minWidth:24}}>#{i+1}</span><span style={{color:"rgba(255,255,255,0.55)",fontSize:13,lineHeight:1.5}}>{r}</span></div>)}
    </Card>
  </div>;
}

// ═══ MAIN APP ═══
export default function App() {
  const [st,d]=useReducer(reducer,{view:"dashboard",trucks:TRUCKS,events:EVENTS,bookings:BOOKINGS,pending:PENDING,spam:SPAM});
  const [time,setTime]=useState(new Date());
  const [collapsed,setCollapsed]=useState(false);
  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t)},[]);

  const NAV=[{id:"dashboard",icon:"📊",label:"Dashboard"},{id:"trucks",icon:"🚚",label:"Food Trucks"},{id:"tracker",icon:"📍",label:"Live Tracker"},{id:"events",icon:"📅",label:"Events"},{id:"bookings",icon:"📋",label:"Bookings"},{id:"members",icon:"👥",label:"Members"},{id:"ads",icon:"📢",label:"Ad Manager"},{id:"moderation",icon:"🛡️",label:"Moderation"},{id:"settings",icon:"⚙️",label:"Settings"}];
  const bc={members:st.pending.length,moderation:st.spam.length,bookings:st.bookings.filter(b=>b.status==="open").length};

  return <div style={{minHeight:"100vh",background:T.bg,color:"#fff",fontFamily:"'Outfit',sans-serif",display:"flex"}}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
      @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
      @keyframes pulse{0%{transform:translate(-50%,-50%) scale(1);opacity:0.25}50%{transform:translate(-50%,-50%) scale(1.6);opacity:0}100%{transform:translate(-50%,-50%) scale(1);opacity:0}}
      @keyframes slideRight{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}
      *{box-sizing:border-box}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px}
      select option{background:#1a1d23;color:#fff}
    `}</style>
    {/* Sidebar */}
    <div style={{width:collapsed?68:240,background:"rgba(255,255,255,0.015)",borderRight:`1px solid ${T.border}`,padding:collapsed?"20px 10px":"20px 14px",display:"flex",flexDirection:"column",flexShrink:0,transition:"width 0.3s"}}>
      <div style={{padding:collapsed?"0 0 20px":"0 6px 24px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setCollapsed(!collapsed)}>
        <div style={{width:38,height:38,borderRadius:10,flexShrink:0,background:`linear-gradient(135deg,${T.orange},${T.amber})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:`0 4px 16px ${T.orangeGlow}`}}>🚚</div>
        {!collapsed&&<div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:"#fff",lineHeight:1}}>FAFT·RVA</div><div style={{fontSize:9,color:T.textDim,letterSpacing:"0.12em",fontFamily:"'IBM Plex Mono',monospace"}}>PLATFORM ADMIN</div></div>}
      </div>
      <nav style={{flex:1}}>{NAV.map(item=><div key={item.id} onClick={()=>d({type:"SET_VIEW",p:item.id})} style={{display:"flex",alignItems:"center",gap:10,padding:collapsed?"10px":"10px 12px",borderRadius:10,marginBottom:2,cursor:"pointer",background:st.view===item.id?T.orange+"15":"transparent",color:st.view===item.id?T.orange:T.textMuted,transition:"all 0.2s",position:"relative",justifyContent:collapsed?"center":"flex-start"}} onMouseEnter={e=>{if(st.view!==item.id)e.currentTarget.style.background="rgba(255,255,255,0.03)"}} onMouseLeave={e=>{if(st.view!==item.id)e.currentTarget.style.background="transparent"}}>
        {st.view===item.id&&<div style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",width:3,height:18,borderRadius:2,background:T.orange}}/>}
        <span style={{fontSize:16}}>{item.icon}</span>
        {!collapsed&&<span style={{fontSize:13,fontWeight:st.view===item.id?600:400,flex:1}}>{item.label}</span>}
        {!collapsed&&bc[item.id]>0&&<span style={{minWidth:18,height:18,borderRadius:9,padding:"0 5px",background:item.id==="moderation"?T.red:T.orange,color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{bc[item.id]}</span>}
        {collapsed&&bc[item.id]>0&&<div style={{position:"absolute",top:4,right:4,width:8,height:8,borderRadius:"50%",background:T.red}}/>}
      </div>)}</nav>
      <div style={{paddingTop:14,borderTop:`1px solid ${T.border}`}}>
        {!collapsed&&<><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{width:7,height:7,borderRadius:"50%",background:T.green,boxShadow:`0 0 8px ${T.green}60`}}/><span style={{color:T.textDim,fontSize:11}}>Platform Active</span></div><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:7,height:7,borderRadius:"50%",background:T.amber,boxShadow:`0 0 8px ${T.amber}60`}}/><span style={{color:T.textDim,fontSize:11}}>$50/mo MRR</span></div></>}
        <div style={{color:T.textDim,fontSize:10,fontFamily:"'IBM Plex Mono',monospace",marginTop:10,textAlign:collapsed?"center":"left"}}>{time.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</div>
      </div>
    </div>
    {/* Main */}
    <div style={{flex:1,padding:"28px 36px",overflowY:"auto",maxHeight:"100vh"}}>
      {st.view==="dashboard"&&<DashboardView st={st} d={d}/>}
      {st.view==="trucks"&&<TrucksView st={st} d={d}/>}
      {st.view==="tracker"&&<TrackerView st={st} d={d}/>}
      {st.view==="events"&&<EventsView st={st} d={d}/>}
      {st.view==="bookings"&&<BookingsView st={st} d={d}/>}
      {st.view==="members"&&<MembersView st={st} d={d}/>}
      {st.view==="ads"&&<AdsView st={st}/>}
      {st.view==="moderation"&&<ModView st={st} d={d}/>}
      {st.view==="settings"&&<SettingsView/>}
    </div>
  </div>;
}
