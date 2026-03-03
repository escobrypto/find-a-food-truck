import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDswWtfAtWMm6NWjY1d7gckTX9c4FSjED0",
  authDomain: "faftrva.firebaseapp.com",
  projectId: "faftrva",
  storageBucket: "faftrva.firebasestorage.app",
  messagingSenderId: "1072657509195",
  appId: "1:1072657509195:web:48be516231d56d305156ce"
};
const fbApp = initializeApp(firebaseConfig);
const auth = getAuth(fbApp);
const db = getFirestore(fbApp);

const _h=async s=>{const e=new TextEncoder().encode(s);const h=await crypto.subtle.digest("SHA-256",e);return Array.from(new Uint8Array(h)).map(b=>b.toString(16).padStart(2,"0")).join("")};
const _check=async(input,hash)=>((await _h(input))===hash);
const AH="044f1bc08f0852260ce6e10da97fe285a160c0ad228a42c1b7f981f4b1fe6fef";
const SH="b858460b54cc28b3e4e9c5f50b36baf44ccec41b1051d4a9f9ff662e194e6257";
const API_URL="https://script.google.com/macros/s/AKfycbxycggwmA7JnSOkcLsk7zBAV1TT_y8lekdYBNODIE6YLQ5Lb_wtSKCsK5vaSctcu1Nj/exec";

function _san(s){if(typeof s!=="string")return s;return s.replace(/[<>{}]/g,"").replace(/javascript:/gi,"").trim().slice(0,500)}
function _validEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}

const _rl={};
async function submitToSheet(data){
  const now=Date.now();const key=data.type||"x";
  if(_rl[key]&&now-_rl[key]<10000)return false;
  _rl[key]=now;
  try{await fetch(API_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain"},body:JSON.stringify(data)});return true}
  catch(e){return false}
}

const G=`
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
:root{--bg:#FAFAF8;--card:#FFFFFF;--ink:#1A1613;--sub:#6B6560;--mute:#9C9690;--line:#E8E4DF;--tint:#F4F1ED;--accent:#D4482C;--accentL:#FFF0ED;--sans:'Inter',system-ui,sans-serif;--serif:'Fraunces',Georgia,serif;--mono:'JetBrains Mono',monospace;--green:#2D8C3C}
body{font-family:var(--sans);color:var(--ink);background:var(--bg);-webkit-font-smoothing:antialiased;overflow-x:hidden}
::selection{background:var(--accentL);color:var(--accent)}
button{cursor:pointer;border:none;background:none;font-family:inherit;color:inherit}
input,textarea,select{font-family:var(--sans);outline:none}
input:focus,textarea:focus{border-color:var(--accent)!important}
a{text-decoration:none;color:inherit}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes scroll{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}
@keyframes spin{to{transform:rotate(360deg)}}
.ani{animation:fadeUp .5s ease both}
.d1{animation-delay:.06s}.d2{animation-delay:.12s}.d3{animation-delay:.18s}
button:focus-visible,input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.mobtn{display:none}
@media(max-width:768px){.dsk{display:none!important}.mobtn{display:block!important}}
`;

function useRouter(){
  const[r,setR]=useState(window.location.hash.slice(1)||"/");
  useEffect(()=>{const h=()=>{setR(window.location.hash.slice(1)||"/");window.scrollTo(0,0)};window.addEventListener("hashchange",h);return()=>window.removeEventListener("hashchange",h)},[]);
  useEffect(()=>{const t={"/":" | Richmond's Food Truck Booking Network","/submit":" | Submit an Event","/join":" | Join as a Vendor","/access":" | Verified Vendor Access","/login":" | Vendor Login","/dashboard":" | Vendor Dashboard","/admin":" | Admin"};document.title="Find A Food Truck RVA"+(t[r]||"")},[r]);
  return{route:r,go:p=>{window.location.hash=p}}
}

const W=({children,style={},...p})=><div style={{maxWidth:1080,margin:"0 auto",padding:"0 20px",...style}} {...p}>{children}</div>;

function Btn({children,onClick,variant="primary",full,size="md",disabled}){
  const s={display:"inline-flex",alignItems:"center",justifyContent:"center",borderRadius:8,fontWeight:500,fontFamily:"var(--sans)",transition:"all .15s",letterSpacing:"-.01em",width:full?"100%":undefined,opacity:disabled?.5:1,pointerEvents:disabled?"none":"auto"};
  const sz={sm:{fontSize:13,padding:"9px 18px"},md:{fontSize:14,padding:"11px 22px"},lg:{fontSize:15,padding:"13px 28px"}}[size];
  const v={primary:{...s,...sz,background:"var(--ink)",color:"#fff"},accent:{...s,...sz,background:"var(--accent)",color:"#fff"},outline:{...s,...sz,background:"var(--card)",color:"var(--ink)",border:"1px solid var(--mute)"},ghost:{...s,...sz,color:"var(--sub)",border:"1px solid var(--line)"},danger:{...s,...sz,background:"#DC2626",color:"#fff"},success:{...s,...sz,background:"var(--green)",color:"#fff"}}[variant];
  return<button onClick={onClick} style={v} disabled={disabled}>{children}</button>
}

function Input({label,value,onChange,placeholder,type="text",textarea,rows=3}){
  const s={width:"100%",padding:"11px 14px",borderRadius:8,border:"1px solid var(--line)",fontSize:14,color:"var(--ink)",background:"var(--card)",marginBottom:14};
  return<div>{label&&<label style={{display:"block",fontSize:12,fontWeight:500,color:"var(--sub)",marginBottom:5,letterSpacing:".02em"}}>{label}</label>}{textarea?<textarea value={value} onChange={onChange} placeholder={placeholder} style={{...s,resize:"vertical",fontFamily:"var(--sans)"}} rows={rows}/>:<input value={value} onChange={onChange} placeholder={placeholder} type={type} style={{...s,fontFamily:"var(--sans)"}}/>}</div>
}

function Chip({children,active,onClick}){return<button onClick={onClick} style={{padding:"7px 13px",borderRadius:8,fontSize:12,fontWeight:500,border:"1px solid",borderColor:active?"var(--accent)":"var(--line)",background:active?"var(--accent)":"var(--card)",color:active?"#fff":"var(--sub)",transition:"all .15s"}}>{children}</button>}

function Badge({text,color="green"}){const c={green:{bg:"#E8F5E9",t:"#2D8C3C"},orange:{bg:"#FFF3E0",t:"#E65100"},red:{bg:"#FFEBEE",t:"#C62828"},gray:{bg:"var(--tint)",t:"var(--mute)"},accent:{bg:"var(--accentL)",t:"var(--accent)"}}[color]||{bg:"var(--tint)",t:"var(--mute)"};return<span style={{fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:4,background:c.bg,color:c.t,fontFamily:"var(--mono)"}}>{text}</span>}

function StatusBadge({status}){const m={pending:["Pending","orange"],approved:["Approved","green"],rejected:["Rejected","red"],new:["New","accent"],matched:["Matched","green"],closed:["Closed","gray"]};const[t,c]=m[status]||["Unknown","gray"];return<Badge text={t} color={c}/>}

function Loader(){return<div style={{display:"flex",justifyContent:"center",padding:40}}><div style={{width:24,height:24,border:"2px solid var(--line)",borderTopColor:"var(--accent)",borderRadius:"50%",animation:"spin .6s linear infinite"}}/></div>}

function EmptyState({text}){return<div style={{textAlign:"center",padding:"48px 20px",color:"var(--mute)"}}><p style={{fontSize:14}}>{text}</p></div>}

function Nav({go,route,user,vendorData}){
  const[open,setOpen]=useState(false);
  return<><nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(250,250,248,.95)",backdropFilter:"blur(12px)",borderBottom:"1px solid var(--line)"}}>
    <W style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:54,padding:"0 20px"}}>
      <div onClick={()=>{go("/");setOpen(false)}} style={{cursor:"pointer",display:"flex",alignItems:"baseline",gap:5}}>
        <span style={{fontFamily:"var(--serif)",fontSize:16,fontWeight:400,fontStyle:"italic"}}>find a</span>
        <span style={{fontFamily:"var(--serif)",fontSize:16,fontWeight:500,color:"var(--accent)"}}>food truck</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:28}} className="dsk">
        {[["Submit Event","/submit"],["Join as Vendor","/join"],["Verified Access","/access"]].map(([l,p])=>
          <span key={p} onClick={()=>go(p)} style={{fontSize:13,fontWeight:500,color:route===p?"var(--ink)":"var(--mute)",cursor:"pointer",transition:"color .15s"}}>{l}</span>
        )}
      </div>
      <div style={{display:"flex",gap:8}} className="dsk">
        {user?<><Btn variant="ghost" size="sm" onClick={()=>go("/dashboard")}>{vendorData?.truck||"Dashboard"}</Btn><Btn variant="outline" size="sm" onClick={async()=>{await signOut(auth);go("/")}}>Logout</Btn></>
        :<><Btn variant="ghost" size="sm" onClick={()=>go("/login")}>Vendor Login</Btn><Btn variant="accent" size="sm" onClick={()=>go("/submit")}>Submit Event</Btn></>}
      </div>
      <button className="mobtn" onClick={()=>setOpen(!open)} style={{fontSize:20,padding:4}}>{open?"\u2715":"\u2630"}</button>
    </W>
  </nav>
  {open&&<div style={{position:"fixed",inset:0,top:54,background:"var(--bg)",zIndex:99,padding:"16px 20px"}}>
    {[["Submit an Event","/submit"],["Join as Vendor","/join"],["Verified Access","/access"],
      ...(user?[["My Dashboard","/dashboard"],["Logout","/logout"]]:[["Vendor Login","/login"]])
    ].map(([l,p])=>
      <button key={p} onClick={async()=>{setOpen(false);if(p==="/logout"){await signOut(auth);go("/")}else go(p)}} style={{display:"block",width:"100%",padding:"16px 0",fontSize:16,fontWeight:500,color:route===p?"var(--accent)":"var(--ink)",textAlign:"left",borderBottom:"1px solid var(--line)"}}>{l}</button>
    )}
  </div>}</>
}

function HomePage({go}){
  return<div style={{paddingTop:54}}>
    <section style={{padding:"clamp(60px,14vw,120px) 20px clamp(48px,10vw,70px)",textAlign:"center"}}>
      <W style={{maxWidth:640,padding:0}}>
        <p className="ani" style={{fontSize:12,fontWeight:500,color:"var(--accent)",letterSpacing:".08em",marginBottom:16}}>RICHMOND, VIRGINIA</p>
        <h1 className="ani d1" style={{fontSize:"clamp(28px,6vw,50px)",fontWeight:300,fontFamily:"var(--serif)",lineHeight:1.2,letterSpacing:"-.02em",margin:"0 0 20px"}}>The food truck booking network for <em style={{fontWeight:400,color:"var(--accent)"}}>Richmond</em>.</h1>
        <p className="ani d2" style={{fontSize:"clamp(14px,2.5vw,16px)",color:"var(--sub)",lineHeight:1.7,maxWidth:420,margin:"0 auto 32px",fontWeight:300}}>Submit event requests. Get matched with verified vendors. Book directly. No middlemen, no spam.</p>
        <div className="ani d3" style={{display:"flex",flexDirection:"column",gap:10,maxWidth:340,margin:"0 auto"}}>
          <Btn variant="accent" size="lg" full onClick={()=>go("/submit")}>Submit an Event</Btn>
          <Btn variant="outline" size="lg" full onClick={()=>go("/join")}>Join as a Vendor</Btn>
        </div>
        <p className="ani d3" style={{fontSize:12,color:"var(--mute)",marginTop:18,fontStyle:"italic",fontFamily:"var(--serif)"}}>Serving corporate events, weddings, festivals, and everything in between.</p>
      </W>
    </section>
    <div style={{borderTop:"1px solid var(--line)",borderBottom:"1px solid var(--line)",padding:"10px 0",overflow:"hidden"}}>
      <div style={{display:"flex",animation:"scroll 35s linear infinite",whiteSpace:"nowrap"}}>
        {[0,1,2].map(j=><div key={j} style={{display:"flex"}}>{["BBQ & Smoked Meats","Mexican / Latin","Southern / Soul Food","Asian Fusion","Breakfast & Brunch","Beverages & Dessert","Catering","Weddings","Corporate Events","Festivals"].map((t,i)=><span key={i} style={{padding:"0 24px",fontSize:11,color:"var(--mute)",fontFamily:"var(--mono)"}}>{t}</span>)}</div>)}
      </div>
    </div>
    <section style={{padding:"clamp(56px,10vw,96px) 20px"}}><W style={{padding:0}}>
      <p className="ani" style={{fontSize:12,fontWeight:500,color:"var(--mute)",letterSpacing:".08em",marginBottom:10}}>HOW IT WORKS</p>
      <h2 className="ani d1" style={{fontSize:"clamp(24px,4vw,32px)",fontWeight:300,fontFamily:"var(--serif)",marginBottom:"clamp(32px,5vw,52px)"}}>Simple for hosts.<br/>Valuable for vendors.</h2>
      <div className="ani d2" style={{display:"flex",flexDirection:"column",gap:1,background:"var(--line)",borderRadius:12,overflow:"hidden"}}>
        {[["For Event Hosts","Tell us your date, location, headcount, and requirements. We match you with verified vendors.","Submit an Event \u2192","/submit"],
          ["For Vendors","Get listed for free. Receive booking opportunities from hosts across Richmond.","Join the Network \u2192","/join"],
          ["Direct Booking","No platform fees. No middlemen. Hosts and vendors connect directly.","Learn More \u2192","/access"]
        ].map(([t,d,c,l])=><div key={t} style={{background:"var(--card)",padding:"clamp(24px,3.5vw,36px)"}}><h3 style={{fontSize:14,fontWeight:600,marginBottom:8}}>{t}</h3><p style={{fontSize:13,color:"var(--sub)",lineHeight:1.7,marginBottom:14,fontWeight:300}}>{d}</p><span onClick={()=>go(l)} style={{fontSize:13,fontWeight:500,color:"var(--accent)",cursor:"pointer"}}>{c}</span></div>)}
      </div>
    </W></section>
    <section style={{padding:"clamp(48px,8vw,68px) 20px",borderTop:"1px solid var(--line)",background:"var(--tint)"}}><W style={{padding:0}}>
      <p style={{fontSize:12,fontWeight:500,color:"var(--mute)",letterSpacing:".08em",marginBottom:10}}>CURRENT STATUS</p>
      <h2 style={{fontSize:"clamp(22px,3.5vw,26px)",fontWeight:300,fontFamily:"var(--serif)",marginBottom:24}}>Now accepting</h2>
      <div style={{display:"flex",gap:"clamp(16px,3vw,36px) clamp(24px,5vw,44px)",flexWrap:"wrap"}}>
        {[["Event submissions","Active"],["Vendor applications","Active"],["Verified Vendor waitlist","Open"]].map(([l,s])=>
          <div key={l} style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:6,height:6,borderRadius:99,background:s==="Active"?"var(--green)":"var(--accent)",flexShrink:0}}/><div><span style={{fontSize:11,fontWeight:500,color:s==="Active"?"var(--green)":"var(--accent)",fontFamily:"var(--mono)"}}>{s}</span><span style={{fontSize:12,color:"var(--sub)",marginLeft:6}}>{l}</span></div></div>
        )}
      </div>
    </W></section>
    <section style={{padding:"clamp(60px,10vw,100px) 20px",background:"var(--ink)",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"-20%",right:"-10%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(212,72,44,.07),transparent 60%)",filter:"blur(40px)"}}/>
      <W style={{maxWidth:560,textAlign:"center",position:"relative",padding:0}}>
        <p className="ani" style={{fontSize:11,fontWeight:500,color:"rgba(255,255,255,.3)",letterSpacing:".08em",marginBottom:12}}>VERIFIED VENDOR ACCESS</p>
        <h2 className="ani d1" style={{fontSize:"clamp(22px,4vw,28px)",fontWeight:300,fontFamily:"var(--serif)",color:"#fff",margin:"0 0 14px"}}>Priority placement. Direct lead access. Category protection.</h2>
        <p className="ani d2" style={{fontSize:14,color:"rgba(255,255,255,.5)",lineHeight:1.7,marginBottom:12,fontWeight:300}}>First access to booking requests, protected category placement, and featured visibility across the network.</p>
        <p className="ani d2" style={{fontSize:13,color:"rgba(255,255,255,.35)",lineHeight:1.7,marginBottom:28,fontStyle:"italic",fontFamily:"var(--serif)"}}>Limited to 1-2 vendors per cuisine. When your slot is full, your competition is capped.</p>
        <div className="ani d3" style={{marginTop:4}}><Btn variant="accent" size="lg" onClick={()=>go("/access")}>Join the Waitlist</Btn></div>
      </W>
    </section>
    <section style={{padding:"clamp(56px,10vw,88px) 20px",textAlign:"center",borderTop:"1px solid var(--line)"}}><W style={{maxWidth:460,padding:0}}>
      <h2 className="ani" style={{fontSize:"clamp(22px,4vw,26px)",fontWeight:300,fontFamily:"var(--serif)",margin:"0 0 12px"}}>Richmond's food truck scene deserves better infrastructure.</h2>
      <p className="ani d1" style={{fontSize:14,color:"var(--sub)",lineHeight:1.7,fontWeight:300,marginBottom:24}}>We're building it. Get in early.</p>
      <div className="ani d2" style={{display:"flex",flexDirection:"column",gap:10,maxWidth:320,margin:"0 auto"}}><Btn variant="accent" full onClick={()=>go("/submit")}>Submit an Event</Btn><Btn variant="outline" full onClick={()=>go("/join")}>Join as a Vendor</Btn></div>
    </W></section>
    <section style={{padding:"clamp(48px,8vw,64px) 20px",borderTop:"1px solid var(--line)"}}><W style={{display:"flex",justifyContent:"center",gap:"clamp(28px,6vw,64px)",padding:0,flexWrap:"wrap"}}>
      {[["4,100+","Network members"],["$800-2,500","Avg. booking"],["10","Verified vendor slots"]].map(([v,l])=>
        <div key={l} style={{textAlign:"center"}}><div style={{fontSize:"clamp(22px,4vw,30px)",fontWeight:300,fontFamily:"var(--serif)",letterSpacing:"-.02em"}}>{v}</div><div style={{fontSize:10,color:"var(--mute)",marginTop:4,fontFamily:"var(--mono)"}}>{l}</div></div>
      )}
    </W></section>
  </div>
}

function FormPage({go,title,subtitle,children}){
  return<div style={{paddingTop:54}}><section style={{padding:"clamp(32px,5vw,56px) 20px clamp(48px,8vw,80px)"}}><W style={{maxWidth:540,padding:0}}>
    <div className="ani" style={{marginBottom:24}}>
      <span onClick={()=>go("/")} style={{fontSize:13,color:"var(--mute)",cursor:"pointer",display:"inline-block",marginBottom:10}}>{"\u2190"} Back</span>
      <h1 style={{fontSize:"clamp(22px,4vw,28px)",fontWeight:300,fontFamily:"var(--serif)",margin:"0 0 4px"}}>{title}</h1>
      {subtitle&&<p style={{fontSize:13,color:"var(--sub)"}}>{subtitle}</p>}
    </div>{children}
  </W></section></div>
}

function SubmitEvent({go}){
  const[step,setStep]=useState(1);const[loading,setLoading]=useState(false);
  const[f,sF]=useState({type:"",date:"",time:"",location:"",attendance:"",cuisine:"",budget:"",name:"",email:"",phone:"",org:"",notes:""});
  const u=(k,v)=>sF({...f,[k]:v});
  const types=["Corporate","Wedding","Private Party","Festival","Community","School / Nonprofit","Other"];
  const submit=async()=>{if(!_validEmail(f.email)){alert("Enter a valid email.");return}setLoading(true);try{await addDoc(collection(db,"events"),{eventType:f.type,date:f.date,time:f.time,location:f.location,attendance:f.attendance,cuisine:f.cuisine,budget:f.budget,notes:f.notes,name:f.name,email:f.email,phone:f.phone,org:f.org,status:"new",createdAt:serverTimestamp()});submitToSheet({type:"event",eventType:_san(f.type),date:_san(f.date),time:_san(f.time),location:_san(f.location),attendance:_san(f.attendance),cuisine:_san(f.cuisine),budget:_san(f.budget),notes:_san(f.notes),name:_san(f.name),email:_san(f.email),phone:_san(f.phone),org:_san(f.org)});setStep(4)}catch(e){alert("Something went wrong.")}setLoading(false)};
  if(step===4)return<div style={{paddingTop:54,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div className="ani" style={{textAlign:"center",maxWidth:380}}><div style={{width:44,height:44,borderRadius:99,background:"var(--accent)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,margin:"0 auto 20px"}}>{"✓"}</div><h2 style={{fontSize:24,fontWeight:300,fontFamily:"var(--serif)",margin:"0 0 10px"}}>Request submitted.</h2><p style={{fontSize:14,color:"var(--sub)",lineHeight:1.7,fontWeight:300}}>Verified vendors get notified first. Expect responses within 24 hours.</p><div style={{marginTop:28}}><Btn variant="outline" onClick={()=>go("/")}>Back to home</Btn></div></div></div>;
  return<FormPage go={go} title="Submit an Event" subtitle={\}><div style={{display:"flex",gap:3,marginBottom:24}}>{[1,2,3].map(s=><div key={s} style={{flex:1,height:2,borderRadius:2,background:s<=step?"var(--accent)":"var(--line)"}}/>)}</div><div className="ani d1" style={{background:"var(--card)",borderRadius:10,border:"1px solid var(--line)",padding:"clamp(20px,3.5vw,32px)"}}>
    {step===1&&<><h3 style={{fontSize:15,fontWeight:600,marginBottom:18}}>Event Details</h3><div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:500,color:"var(--sub)",marginBottom:6}}>Event Type</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{types.map(t=><Chip key={t} active={f.type===t} onClick={()=>u("type",t)}>{t}</Chip>)}</div></div><Input label="Date" value={f.date} onChange={e=>u("date",e.target.value)} type="date"/><Input label="Time" value={f.time} onChange={e=>u("time",e.target.value)} placeholder="e.g. 4-8 PM"/><Input label="Location" value={f.location} onChange={e=>u("location",e.target.value)} placeholder="Venue or address"/><Input label="Guests" value={f.attendance} onChange={e=>u("attendance",e.target.value)} placeholder="Expected attendance" type="number"/><div style={{display:"flex",justifyContent:"flex-end",marginTop:6}}><Btn variant="accent" onClick={()=>setStep(2)}>Continue</Btn></div></>}
    {step===2&&<><h3 style={{fontSize:15,fontWeight:600,marginBottom:18}}>Requirements</h3><Input label="Cuisine" value={f.cuisine} onChange={e=>u("cuisine",e.target.value)} placeholder="e.g. BBQ, Mexican, Any"/><Input label="Budget" value={f.budget} onChange={e=>u("budget",e.target.value)} placeholder="e.g.  -\,000"/><Input label="Details" value={f.notes} onChange={e=>u("notes",e.target.value)} placeholder="Dietary needs, setup, # of trucks..." textarea rows={4}/><div style={{display:"flex",justifyContent:"space-between",marginTop:6}}><Btn variant="ghost" onClick={()=>setStep(1)}>Back</Btn><Btn variant="accent" onClick={()=>setStep(3)}>Continue</Btn></div></>}
    {step===3&&<><h3 style={{fontSize:15,fontWeight:600,marginBottom:18}}>Contact</h3><Input label="Name" value={f.name} onChange={e=>u("name",e.target.value)} placeholder="Full name"/><Input label="Organization" value={f.org} onChange={e=>u("org",e.target.value)} placeholder="Optional"/><Input label="Email" value={f.email} onChange={e=>u("email",e.target.value)} placeholder="you@email.com" type="email"/><Input label="Phone" value={f.phone} onChange={e=>u("phone",e.target.value)} placeholder="(804) 555-0000"/><div style={{display:"flex",justifyContent:"space-between",marginTop:6}}><Btn variant="ghost" onClick={()=>setStep(2)}>Back</Btn><Btn variant="accent" onClick={submit} disabled={loading}>{loading?"Submitting...":"Submit Request"}</Btn></div></>}
  </div></FormPage>}

function JoinVendor({go}){
  const[step,setStep]=useState(1);const[loading,setLoading]=useState(false);const[err,setErr]=useState("");
  const[f,sF]=useState({truck:"",cuisine:"",owner:"",phone:"",email:"",password:"",schedule:"",description:"",waitlist:false});
  const u=(k,v)=>sF({...f,[k]:v});const cuisines=["BBQ & Smoked","Mexican / Latin","Southern / Soul","Asian Fusion","Breakfast / Brunch","Beverages / Dessert","Other"];
  const submit=async()=>{if(!_validEmail(f.email)){alert("Enter a valid email.");return}if(!f.password||f.password.length<6){alert("Password needs 6+ characters.");return}setLoading(true);setErr("");try{const cred=await createUserWithEmailAndPassword(auth,f.email,f.password);await setDoc(doc(db,"vendors",cred.user.uid),{email:f.email,truck:_san(f.truck),cuisine:_san(f.cuisine),schedule:_san(f.schedule),description:_san(f.description),owner:_san(f.owner),phone:_san(f.phone),menu:[],status:"pending",tier:"free",waitlist:f.waitlist,createdAt:serverTimestamp()});submitToSheet({type:"vendor",truck:_san(f.truck),cuisine:_san(f.cuisine),schedule:_san(f.schedule),description:_san(f.description),owner:_san(f.owner),email:_san(f.email),phone:_san(f.phone),waitlist:f.waitlist});if(f.waitlist){await addDoc(collection(db,"waitlist"),{name:_san(f.owner),truck:_san(f.truck),cuisine:_san(f.cuisine),email:_san(f.email),why:"Applied during signup",status:"new",createdAt:serverTimestamp()});submitToSheet({type:"waitlist",name:_san(f.owner),truck:_san(f.truck),cuisine:_san(f.cuisine),email:_san(f.email),why:"Applied during signup"})}setStep(4)}catch(e){if(e.code==="auth/email-already-in-use")setErr("Email already registered. Try logging in.");else setErr(e.message||"Something went wrong.")}setLoading(false)};
  if(step===4)return<div style={{paddingTop:54,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div className="ani" style={{textAlign:"center",maxWidth:380}}><div style={{width:44,height:44,borderRadius:99,background:"var(--accent)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,margin:"0 auto 20px"}}>{"\u2713"}</div><h2 style={{fontSize:24,fontWeight:300,fontFamily:"var(--serif)",margin:"0 0 10px"}}>Application submitted!</h2><p style={{fontSize:14,color:"var(--sub)",lineHeight:1.7,fontWeight:300}}>Pending approval. We review fast. Log in to check status.</p>{f.waitlist&&<p style={{fontSize:12,fontWeight:500,background:"var(--accentL)",color:"var(--accent)",padding:"8px 14px",borderRadius:8,display:"inline-block",marginTop:10}}>Verified waitlist applied</p>}<div style={{marginTop:28,display:"flex",gap:8,justifyContent:"center"}}><Btn variant="accent" onClick={()=>go("/dashboard")}>Dashboard</Btn><Btn variant="outline" onClick={()=>go("/")}>Home</Btn></div></div></div>;
  return<FormPage go={go} title="Join as a Vendor" subtitle={`Step ${step} of 3`}><div style={{display:"flex",gap:3,marginBottom:24}}>{[1,2,3].map(s=><div key={s} style={{flex:1,height:2,borderRadius:2,background:s<=step?"var(--accent)":"var(--line)"}}/>)}</div>{err&&<div style={{background:"#FFEBEE",color:"#C62828",padding:"10px 14px",borderRadius:8,fontSize:13,marginBottom:16}}>{err}</div>}<div className="ani d1" style={{background:"var(--card)",borderRadius:10,border:"1px solid var(--line)",padding:"clamp(20px,3.5vw,32px)"}}>
    {step===1&&<><h3 style={{fontSize:15,fontWeight:600,marginBottom:18}}>Business Info</h3><Input label="Truck Name" value={f.truck} onChange={e=>u("truck",e.target.value)} placeholder="Your food truck name"/><div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:500,color:"var(--sub)",marginBottom:6}}>Cuisine</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{cuisines.map(c=><Chip key={c} active={f.cuisine===c} onClick={()=>u("cuisine",c)}>{c}</Chip>)}</div></div><Input label="Schedule" value={f.schedule} onChange={e=>u("schedule",e.target.value)} placeholder="e.g. Tue-Sat 11am-8pm"/><Input label="Description" value={f.description} onChange={e=>u("description",e.target.value)} placeholder="What you serve..." textarea rows={3}/><div style={{display:"flex",justifyContent:"flex-end",marginTop:6}}><Btn variant="accent" onClick={()=>setStep(2)}>Continue</Btn></div></>}
    {step===2&&<><h3 style={{fontSize:15,fontWeight:600,marginBottom:18}}>Your Account</h3><Input label="Owner Name" value={f.owner} onChange={e=>u("owner",e.target.value)} placeholder="Full name"/><Input label="Email" value={f.email} onChange={e=>u("email",e.target.value)} placeholder="you@email.com" type="email"/><Input label="Create Password" value={f.password} onChange={e=>u("password",e.target.value)} placeholder="At least 6 characters" type="password"/><Input label="Phone" value={f.phone} onChange={e=>u("phone",e.target.value)} placeholder="(804) 555-0000"/><div style={{display:"flex",justifyContent:"space-between",marginTop:6}}><Btn variant="ghost" onClick={()=>setStep(1)}>Back</Btn><Btn variant="accent" onClick={()=>setStep(3)}>Continue</Btn></div></>}
    {step===3&&<><h3 style={{fontSize:15,fontWeight:600,marginBottom:18}}>Verified Access</h3><div style={{background:"var(--tint)",borderRadius:8,padding:16,marginBottom:18,border:"1px solid var(--line)"}}><h4 style={{fontSize:13,fontWeight:600,marginBottom:4}}>Verified Vendor tier. Launching soon.</h4><p style={{fontSize:12,color:"var(--sub)",lineHeight:1.6,fontWeight:300,marginBottom:10}}>Priority placement, direct leads, category protection.</p><label style={{display:"flex",alignItems:"flex-start",gap:8,cursor:"pointer"}}><input type="checkbox" checked={f.waitlist} onChange={e=>u("waitlist",e.target.checked)} style={{marginTop:2,accentColor:"var(--accent)"}}/><span style={{fontSize:13,lineHeight:1.5}}>Add me to the waitlist.</span></label></div><div style={{display:"flex",justifyContent:"space-between"}}><Btn variant="ghost" onClick={()=>setStep(2)}>Back</Btn><Btn variant="accent" onClick={submit} disabled={loading}>{loading?"Creating...":"Join Network"}</Btn></div></>}
  </div></FormPage>}

function VendorLogin({go}){
  const[email,setEmail]=useState("");const[pw,setPw]=useState("");const[err,setErr]=useState("");const[loading,setLoading]=useState(false);
  const login=async()=>{setErr("");setLoading(true);try{await signInWithEmailAndPassword(auth,email,pw);go("/dashboard")}catch(e){if(e.code==="auth/invalid-credential"||e.code==="auth/wrong-password")setErr("Wrong email or password.");else if(e.code==="auth/user-not-found")setErr("No account. Join as a vendor first.");else setErr("Something went wrong.")}setLoading(false)};
  return<div style={{paddingTop:54,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div className="ani" style={{width:"100%",maxWidth:380,padding:"clamp(20px,3vw,32px)",borderRadius:10,background:"var(--card)",border:"1px solid var(--line)"}}><h2 style={{fontSize:22,fontWeight:300,fontFamily:"var(--serif)",margin:"0 0 4px",textAlign:"center"}}>Vendor Login</h2><p style={{fontSize:12,color:"var(--sub)",marginBottom:20,textAlign:"center"}}>Sign in to manage your profile and see events.</p>{err&&<div style={{background:"#FFEBEE",color:"#C62828",padding:"10px 14px",borderRadius:8,fontSize:12,marginBottom:14}}>{err}</div>}<Input label="Email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" type="email"/><Input label="Password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Your password" type="password"/><Btn variant="accent" full onClick={login} disabled={loading}>{loading?"Signing in...":"Sign In"}</Btn><p style={{fontSize:12,color:"var(--mute)",textAlign:"center",marginTop:14}}>No account? <span onClick={()=>go("/join")} style={{color:"var(--accent)",cursor:"pointer",fontWeight:500}}>Join as a Vendor</span></p></div></div>}

function VendorDashboard({go,user}){
  const[tab,setTab]=useState("events");const[vendor,setVendor]=useState(null);const[events,setEvents]=useState([]);const[loading,setLoading]=useState(true);const[saving,setSaving]=useState(false);const[profile,setProfile]=useState({});const[menu,setMenu]=useState([]);const[ni,sNi]=useState({name:"",price:"",desc:""});
  useEffect(()=>{if(!user)return;const unsub=onSnapshot(doc(db,"vendors",user.uid),(snap)=>{if(snap.exists()){const d=snap.data();setVendor(d);setProfile(d);setMenu(d.menu||[])}setLoading(false)});return unsub},[user]);
  useEffect(()=>{if(!vendor||vendor.status!=="approved")return;const unsub=onSnapshot(query(collection(db,"events"),orderBy("createdAt","desc")),(snap)=>{const now=Date.now();const evts=snap.docs.map(d=>({id:d.id,...d.data()})).filter(e=>{if(vendor.tier==="verified")return true;if(!e.createdAt)return false;const created=e.createdAt.toDate?e.createdAt.toDate().getTime():0;return(now-created)>24*60*60*1000});setEvents(evts)});return unsub},[vendor]);
  const saveProfile=async()=>{setSaving(true);try{await updateDoc(doc(db,"vendors",user.uid),{truck:_san(profile.truck),cuisine:_san(profile.cuisine),schedule:_san(profile.schedule),description:_san(profile.description),owner:_san(profile.owner),phone:_san(profile.phone),menu})}catch(e){alert("Error saving.")}setSaving(false)};
  if(loading)return<div style={{paddingTop:54}}><Loader/></div>;
  if(!vendor)return<div style={{paddingTop:54,padding:40,textAlign:"center"}}><p>No vendor profile found.</p><Btn variant="outline" onClick={()=>go("/join")}>Join as a Vendor</Btn></div>;
  if(vendor.status==="pending")return<div style={{paddingTop:54,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div className="ani" style={{textAlign:"center",maxWidth:400}}><Badge text="PENDING APPROVAL" color="orange"/><h2 style={{fontSize:24,fontWeight:300,fontFamily:"var(--serif)",margin:"16px 0 10px"}}>Application under review.</h2><p style={{fontSize:14,color:"var(--sub)",lineHeight:1.7,fontWeight:300}}>Reviewing <strong>{vendor.truck}</strong>. Full dashboard and events unlock once approved.</p><p style={{fontSize:12,color:"var(--mute)",marginTop:16}}>Usually less than 24 hours.</p><div style={{marginTop:28}}><Btn variant="outline" onClick={async()=>{await signOut(auth);go("/")}}>Back to Home</Btn></div></div></div>;
  if(vendor.status==="rejected")return<div style={{paddingTop:54,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div className="ani" style={{textAlign:"center",maxWidth:400}}><Badge text="NOT APPROVED" color="red"/><h2 style={{fontSize:24,fontWeight:300,fontFamily:"var(--serif)",margin:"16px 0 10px"}}>Not approved.</h2><p style={{fontSize:14,color:"var(--sub)"}}>Contact us if you think this was a mistake.</p><div style={{marginTop:28}}><Btn variant="outline" onClick={async()=>{await signOut(auth);go("/")}}>Home</Btn></div></div></div>;
  const up=(k,v)=>setProfile({...profile,[k]:v});
  return<div style={{paddingTop:54}}><section style={{padding:"24px 20px 40px"}}><W style={{padding:0,maxWidth:920}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}><div style={{display:"flex",alignItems:"center",gap:10}}><h1 style={{fontSize:20,fontWeight:400,fontFamily:"var(--serif)"}}>{vendor.truck||"Dashboard"}</h1><Badge text={vendor.tier==="verified"?"VERIFIED":"FREE"} color={vendor.tier==="verified"?"accent":"gray"}/></div><Btn variant="ghost" size="sm" onClick={async()=>{await signOut(auth);go("/")}}>Logout</Btn></div>
    <div style={{display:"flex",gap:2,marginBottom:24,borderBottom:"1px solid var(--line)",overflowX:"auto"}}>{["events","profile","menu"].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"10px 14px",fontSize:13,fontWeight:500,color:tab===t?"var(--ink)":"var(--mute)",borderBottom:tab===t?"2px solid var(--accent)":"2px solid transparent",textTransform:"capitalize",whiteSpace:"nowrap"}}>{t==="events"?`Events (${events.length})`:t}</button>)}</div>
    {tab==="events"&&<div>{vendor.tier!=="verified"&&<div style={{background:"var(--accentL)",borderRadius:8,padding:"12px 16px",marginBottom:20,fontSize:12,color:"var(--accent)"}}><strong>Free tier:</strong> Events show 24hrs after posting. <span onClick={()=>go("/access")} style={{textDecoration:"underline",cursor:"pointer"}}>Upgrade to Verified</span> for instant access.</div>}{events.length===0?<EmptyState text="No events yet. Check back soon."/>:events.map(e=><div key={e.id} style={{background:"var(--card)",borderRadius:10,border:"1px solid var(--line)",padding:"clamp(16px,2.5vw,24px)",marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,flexWrap:"wrap",gap:8}}><div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:14,fontWeight:600}}>{e.eventType||"Event"}</span><StatusBadge status={e.status}/></div><span style={{fontSize:12,color:"var(--mute)"}}>{e.date}{e.time?" at "+e.time:""}</span></div>{e.budget&&<span style={{fontSize:13,fontWeight:600,fontFamily:"var(--mono)",color:"var(--green)"}}>{e.budget}</span>}</div><div style={{display:"flex",flexWrap:"wrap",gap:"6px 16px",fontSize:12,color:"var(--sub)"}}>{e.location&&<span>{"\ud83d\udccd"} {e.location}</span>}{e.attendance&&<span>{"\ud83d\udc65"} {e.attendance} guests</span>}{e.cuisine&&<span>{"\ud83c\udf7d"} {e.cuisine}</span>}</div>{e.notes&&<p style={{fontSize:12,color:"var(--sub)",marginTop:8,lineHeight:1.6}}>{e.notes}</p>}</div>)}</div>}
    {tab==="profile"&&<div style={{background:"var(--card)",borderRadius:10,border:"1px solid var(--line)",padding:"clamp(16px,3vw,28px)",maxWidth:520}}><h3 style={{fontSize:15,fontWeight:600,marginBottom:18}}>Truck Profile</h3><Input label="Truck Name" value={profile.truck||""} onChange={e=>up("truck",e.target.value)} placeholder="Your truck name"/><Input label="Cuisine" value={profile.cuisine||""} onChange={e=>up("cuisine",e.target.value)} placeholder="e.g. BBQ"/><Input label="Owner" value={profile.owner||""} onChange={e=>up("owner",e.target.value)} placeholder="Your name"/><Input label="Phone" value={profile.phone||""} onChange={e=>up("phone",e.target.value)} placeholder="(804) 555-0000"/><Input label="Schedule" value={profile.schedule||""} onChange={e=>up("schedule",e.target.value)} placeholder="e.g. Tue-Sat"/><Input label="Description" value={profile.description||""} onChange={e=>up("description",e.target.value)} placeholder="About your truck..." textarea rows={3}/><Btn variant="accent" full onClick={saveProfile} disabled={saving}>{saving?"Saving...":"Save Profile"}</Btn></div>}
    {tab==="menu"&&<div style={{maxWidth:580}}><h3 style={{fontSize:15,fontWeight:600,marginBottom:16}}>Menu ({menu.length})</h3>{menu.map((m,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid var(--line)"}}><div><div style={{fontSize:13,fontWeight:500}}>{m.name}</div></div><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:13,fontWeight:600,fontFamily:"var(--mono)"}}>${m.price}</span><button onClick={()=>{const nm=[...menu];nm.splice(i,1);setMenu(nm)}} style={{fontSize:11,color:"var(--mute)",padding:"3px 6px",borderRadius:4,border:"1px solid var(--line)"}}>x</button></div></div>)}<div style={{background:"var(--tint)",borderRadius:8,padding:14,marginTop:16}}><p style={{fontSize:11,fontWeight:500,color:"var(--sub)",marginBottom:8}}>ADD ITEM</p><div style={{display:"flex",gap:6,marginBottom:6}}><input value={ni.name} onChange={e=>sNi({...ni,name:e.target.value})} placeholder="Item" style={{flex:1,padding:"9px 10px",borderRadius:6,border:"1px solid var(--line)",fontSize:13}}/><input value={ni.price} onChange={e=>sNi({...ni,price:e.target.value})} placeholder="$" style={{width:60,padding:"9px 10px",borderRadius:6,border:"1px solid var(--line)",fontSize:13}}/></div><Btn variant="accent" full size="sm" onClick={()=>{if(ni.name&&ni.price){setMenu([...menu,{name:ni.name,price:Number(ni.price),desc:ni.desc}]);sNi({name:"",price:"",desc:""})}}}>Add</Btn></div><div style={{marginTop:16}}><Btn variant="accent" full onClick={saveProfile} disabled={saving}>{saving?"Saving...":"Save Menu"}</Btn></div></div>}
  </W></section></div>}

function AccessPage({go}){
  const[done,setDone]=useState(false);const[loading,setLoading]=useState(false);
  const[f,sF]=useState({name:"",truck:"",cuisine:"",email:"",why:""});const u=(k,v)=>sF({...f,[k]:v});
  const cs=["BBQ & Smoked","Mexican / Latin","Southern / Soul","Asian Fusion","Breakfast / Brunch","Beverages / Dessert"];
  const submit=async()=>{if(!f.name||!f.truck||!f.email||!f.cuisine){alert("Fill in all fields.");return}if(!_validEmail(f.email)){alert("Valid email required.");return}setLoading(true);try{await addDoc(collection(db,"waitlist"),{name:_san(f.name),truck:_san(f.truck),cuisine:_san(f.cuisine),email:_san(f.email),why:_san(f.why),status:"new",createdAt:serverTimestamp()});submitToSheet({type:"waitlist",name:_san(f.name),truck:_san(f.truck),cuisine:_san(f.cuisine),email:_san(f.email),why:_san(f.why)});setDone(true)}catch(e){alert("Something went wrong.")}setLoading(false)};
  return<FormPage go={go} title="Verified Vendor Access" subtitle="Priority access to booking requests and protected category placement.">
    <div className="ani d1" style={{display:"flex",flexDirection:"column",gap:1,background:"var(--line)",borderRadius:10,overflow:"hidden",marginBottom:32}}>{[["Priority Placement","Appear first to event hosts."],["Direct Lead Routing","Requests matched to your cuisine."],["Category Protection","Limited slots. Competition capped."],["Featured Visibility","Prominent in directory and matching."]].map(([t,d])=><div key={t} style={{background:"var(--card)",padding:"clamp(18px,3vw,28px)"}}><h3 style={{fontSize:13,fontWeight:600,marginBottom:3}}>{t}</h3><p style={{fontSize:12,color:"var(--sub)",lineHeight:1.6,fontWeight:300}}>{d}</p></div>)}</div>
    {!done?<div className="ani d2" style={{background:"var(--card)",borderRadius:10,border:"1px solid var(--line)",padding:"clamp(20px,3.5vw,32px)"}}><h3 style={{fontSize:17,fontWeight:300,fontFamily:"var(--serif)",marginBottom:4}}>Join the waitlist</h3><p style={{fontSize:12,color:"var(--sub)",lineHeight:1.6,marginBottom:20}}>Limited per cuisine category.</p><Input label="Your Name" value={f.name} onChange={e=>u("name",e.target.value)} placeholder="Full name"/><Input label="Truck Name" value={f.truck} onChange={e=>u("truck",e.target.value)} placeholder="Your food truck"/><Input label="Email" value={f.email} onChange={e=>u("email",e.target.value)} placeholder="you@email.com" type="email"/><div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:500,color:"var(--sub)",marginBottom:6}}>Cuisine</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{cs.map(c=><Chip key={c} active={f.cuisine===c} onClick={()=>u("cuisine",c)}>{c}</Chip>)}</div></div><Input label="Why interested?" value={f.why} onChange={e=>u("why",e.target.value)} placeholder="About your truck..." textarea rows={3}/><Btn variant="accent" full onClick={submit} disabled={loading}>{loading?"Submitting...":"Submit Application"}</Btn></div>
    :<div className="ani" style={{textAlign:"center",padding:"40px 0"}}><div style={{width:44,height:44,borderRadius:99,background:"var(--accent)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,margin:"0 auto 20px"}}>{"\u2713"}</div><h3 style={{fontSize:22,fontWeight:300,fontFamily:"var(--serif)",margin:"0 0 10px"}}>Application received.</h3><p style={{fontSize:14,color:"var(--sub)",lineHeight:1.7,fontWeight:300}}>We'll reach out when verified tier launches.</p></div>}
  </FormPage>}

function AdminLogin({onLogin}){const[pw,setPw]=useState("");const[e,sE]=useState(false);const[l,sL]=useState(false);return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0A0A0A",padding:20}}><div className="ani" style={{width:"100%",maxWidth:320,padding:28,borderRadius:10,background:"#141414",border:"1px solid #222",textAlign:"center"}}><h2 style={{fontSize:18,fontWeight:500,color:"#fff",marginBottom:20}}>Admin Access</h2>{e&&<div style={{color:"#EF4444",fontSize:12,marginBottom:10}}>Invalid.</div>}<input value={pw} onChange={ev=>setPw(ev.target.value)} onKeyDown={async ev=>{if(ev.key==="Enter"){sL(true);const ok=await onLogin(pw);if(!ok){sE(true);setPw("")}sL(false)}}} type="password" placeholder="Password" style={{width:"100%",padding:"11px 14px",borderRadius:8,border:"1px solid #333",fontSize:14,background:"#0A0A0A",color:"#fff",marginBottom:10,textAlign:"center"}}/><button onClick={async()=>{sL(true);const ok=await onLogin(pw);if(!ok){sE(true);setPw("")}sL(false)}} style={{width:"100%",padding:11,borderRadius:8,background:"#fff",color:"#000",fontSize:14,fontWeight:500}}>{l?"...":"Enter"}</button></div></div>}

function PinGate({onUnlock,onCancel}){const[pin,setPin]=useState("");const[e,sE]=useState(false);return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0A0A0A",padding:20}}><div style={{width:"100%",maxWidth:280,textAlign:"center"}}><h2 style={{fontSize:16,fontWeight:500,color:"#fff",marginBottom:20}}>Security PIN</h2>{e&&<div style={{color:"#EF4444",fontSize:12,marginBottom:10}}>Wrong PIN.</div>}<input value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={async e=>{if(e.key==="Enter"){if(await _check(pin,SH))onUnlock();else{sE(true);setPin("")}}}} type="password" maxLength={4} placeholder={"\u2022\u2022\u2022\u2022"} style={{width:"100%",padding:12,borderRadius:8,border:"1px solid #333",fontSize:22,letterSpacing:10,background:"#0A0A0A",color:"#fff",textAlign:"center",marginBottom:14}}/><div style={{display:"flex",gap:8}}><button onClick={onCancel} style={{flex:1,padding:10,borderRadius:8,border:"1px solid #333",color:"#666",fontSize:13}}>Cancel</button><button onClick={async()=>{if(await _check(pin,SH))onUnlock();else{sE(true);setPin("")}}} style={{flex:1,padding:10,borderRadius:8,background:"#fff",color:"#000",fontSize:13,fontWeight:500}}>Unlock</button></div></div></div>}

function AdminDash({go}){
  const[tab,setTab]=useState("vendors");const[vendors,setVendors]=useState([]);const[events,setEvents]=useState([]);const[waitlist,setWaitlist]=useState([]);const[loading,setLoading]=useState(true);
  useEffect(()=>{const u1=onSnapshot(query(collection(db,"vendors"),orderBy("createdAt","desc")),(s)=>{setVendors(s.docs.map(d=>({id:d.id,...d.data()})));setLoading(false)});const u2=onSnapshot(query(collection(db,"events"),orderBy("createdAt","desc")),(s)=>{setEvents(s.docs.map(d=>({id:d.id,...d.data()})))});const u3=onSnapshot(query(collection(db,"waitlist"),orderBy("createdAt","desc")),(s)=>{setWaitlist(s.docs.map(d=>({id:d.id,...d.data()})))});return()=>{u1();u2();u3()}},[]);
  const updV=async(id,status)=>{await updateDoc(doc(db,"vendors",id),{status})};
  const updT=async(id,tier)=>{await updateDoc(doc(db,"vendors",id),{tier})};
  const updE=async(id,status)=>{await updateDoc(doc(db,"events",id),{status})};
  const pending=vendors.filter(v=>v.status==="pending");
  return<div style={{minHeight:"100vh",background:"#0A0A0A",padding:"40px 20px",color:"#fff"}}><W style={{maxWidth:1000,padding:0}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><h1 style={{fontSize:18,fontWeight:500}}>FAFTRVA Admin</h1><button onClick={()=>go("/")} style={{color:"#666",fontSize:12,border:"1px solid #333",padding:"7px 14px",borderRadius:8}}>{"\u2190"} Site</button></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:28}}>{[["Pending",pending.length],["Approved",vendors.filter(v=>v.status==="approved").length],["Events",events.length],["Waitlist",waitlist.length]].map(([t,v])=><div key={t} style={{background:"#141414",borderRadius:8,padding:14,border:"1px solid #222"}}><div style={{fontSize:10,color:"#666",fontFamily:"var(--mono)"}}>{t}</div><div style={{fontSize:24,fontWeight:300,marginTop:4}}>{v}</div></div>)}</div>
    <div style={{display:"flex",gap:2,marginBottom:20,borderBottom:"1px solid #333",overflowX:"auto"}}>{["vendors","events","waitlist"].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"10px 14px",fontSize:13,fontWeight:500,color:tab===t?"#fff":"#666",borderBottom:tab===t?"2px solid var(--accent)":"2px solid transparent",textTransform:"capitalize",whiteSpace:"nowrap"}}>{t}</button>)}</div>
    {loading?<Loader/>:<>
      {tab==="vendors"&&<div>{vendors.map(v=><div key={v.id} style={{background:"#141414",borderRadius:8,padding:16,border:"1px solid #222",marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}><div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:14,fontWeight:600}}>{v.truck||"Unnamed"}</span><StatusBadge status={v.status}/><Badge text={v.tier==="verified"?"VERIFIED":"FREE"} color={v.tier==="verified"?"accent":"gray"}/></div><div style={{fontSize:12,color:"#888"}}>{v.cuisine} {"\u00b7"} {v.owner} {"\u00b7"} {v.email}</div></div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{v.status==="pending"&&<><Btn variant="success" size="sm" onClick={()=>updV(v.id,"approved")}>Approve</Btn><Btn variant="danger" size="sm" onClick={()=>updV(v.id,"rejected")}>Reject</Btn></>}{v.status==="approved"&&<>{v.tier==="free"?<Btn variant="accent" size="sm" onClick={()=>updT(v.id,"verified")}>Make Verified</Btn>:<Btn variant="ghost" size="sm" onClick={()=>updT(v.id,"free")}>Remove Verified</Btn>}<Btn variant="danger" size="sm" onClick={()=>updV(v.id,"rejected")}>Suspend</Btn></>}{v.status==="rejected"&&<Btn variant="success" size="sm" onClick={()=>updV(v.id,"approved")}>Reinstate</Btn>}</div></div></div>)}</div>}
      {tab==="events"&&<div>{events.map(e=><div key={e.id} style={{background:"#141414",borderRadius:8,padding:16,border:"1px solid #222",marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}><div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:14,fontWeight:600}}>{e.eventType||"Event"}</span><StatusBadge status={e.status}/></div><div style={{fontSize:12,color:"#888"}}>{e.date} {e.time&&"at "+e.time} {"\u00b7"} {e.location} {"\u00b7"} {e.attendance} guests</div><div style={{fontSize:12,color:"#888",marginTop:2}}>{e.name} {"\u00b7"} {e.email} {"\u00b7"} {e.phone}</div>{e.notes&&<div style={{fontSize:11,color:"#555",marginTop:4}}>{e.notes}</div>}</div><div style={{display:"flex",gap:6}}>{e.status==="new"&&<Btn variant="success" size="sm" onClick={()=>updE(e.id,"matched")}>Matched</Btn>}{e.status==="matched"&&<Btn variant="ghost" size="sm" onClick={()=>updE(e.id,"closed")}>Close</Btn>}</div></div></div>)}</div>}
      {tab==="waitlist"&&<div>{waitlist.map(w=><div key={w.id} style={{background:"#141414",borderRadius:8,padding:16,border:"1px solid #222",marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:14,fontWeight:600}}>{w.truck||"Unknown"}</span><Badge text={w.cuisine} color="accent"/></div><div style={{fontSize:12,color:"#888"}}>{w.name} {"\u00b7"} {w.email}</div>{w.why&&<div style={{fontSize:11,color:"#666",marginTop:4}}>"{w.why}"</div>}</div>)}</div>}
    </>}
  </W></div>}

function Footer({go}){return<footer style={{borderTop:"1px solid var(--line)",padding:"32px 20px 24px"}}><W style={{padding:0}}><div style={{display:"flex",flexWrap:"wrap",gap:"clamp(20px,4vw,40px)",marginBottom:24}}><div style={{minWidth:200,flex:"2 1 200px"}}><div style={{display:"flex",alignItems:"baseline",gap:5}}><span style={{fontFamily:"var(--serif)",fontSize:15,fontStyle:"italic"}}>find a</span><span style={{fontFamily:"var(--serif)",fontSize:15,fontWeight:500,color:"var(--accent)"}}>food truck</span></div><p style={{fontSize:11,color:"var(--sub)",marginTop:6,lineHeight:1.6,fontWeight:300}}>Richmond's booking network for food trucks and events.</p><p style={{fontSize:10,color:"var(--mute)",marginTop:4}}>findafoodtruckrva.com</p><p style={{fontSize:10,color:"var(--sub)",marginTop:8,fontFamily:"var(--mono)"}}>Laurence Ash LLC</p></div>{[["Network",[["Submit Event","/submit"],["Join as Vendor","/join"],["Verified Access","/access"]]],["Account",[["Vendor Login","/login"],["Admin","/admin"]]]].map(([t,items])=><div key={t} style={{minWidth:120}}><h4 style={{fontSize:10,fontWeight:500,color:"var(--mute)",letterSpacing:".06em",marginBottom:10}}>{t.toUpperCase()}</h4>{items.map(([l,to])=><div key={l} onClick={()=>go(to)} style={{color:"var(--sub)",fontSize:12,cursor:"pointer",padding:"3px 0",fontWeight:300}}>{l}</div>)}</div>)}</div><div style={{paddingTop:12,borderTop:"1px solid var(--line)",display:"flex",justifyContent:"space-between"}}><span style={{color:"var(--mute)",fontSize:10,fontFamily:"var(--mono)"}}>{"\u00a9"} 2026 FAFTRVA</span><span style={{color:"var(--mute)",fontSize:10}}>Richmond, VA</span></div></W></footer>}

export default function App(){
  const{route,go}=useRouter();const[user,setUser]=useState(null);const[vendorData,setVendorData]=useState(null);const[authLoading,setAuthLoading]=useState(true);const[adminAuth,setAdminAuth]=useState(false);const[adminPin,setAdminPin]=useState(false);
  useEffect(()=>{const unsub=onAuthStateChanged(auth,async(u)=>{setUser(u);if(u){try{const snap=await getDoc(doc(db,"vendors",u.uid));if(snap.exists())setVendorData(snap.data())}catch(e){}}else{setVendorData(null)}setAuthLoading(false)});return unsub},[]);
  if(authLoading)return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)"}}><style>{G}</style><Loader/></div>;
  if(route==="/admin"){if(!adminAuth)return<><style>{G}</style><AdminLogin onLogin={async pw=>{if(await _check(pw,AH)){setAdminAuth(true);return true}return false}}/></>;if(!adminPin)return<><style>{G}</style><PinGate onUnlock={()=>setAdminPin(true)} onCancel={()=>{setAdminAuth(false);go("/")}}/></>;return<><style>{G}</style><AdminDash go={go}/></>}
  return<div style={{background:"var(--bg)",minHeight:"100vh"}}><style>{G}</style><Nav go={go} route={route} user={user} vendorData={vendorData}/>
    {route==="/"&&<><HomePage go={go}/><Footer go={go}/></>}
    {(route==="/submit"||route==="/book")&&<><SubmitEvent go={go}/><Footer go={go}/></>}
    {(route==="/join"||route==="/vendors")&&<><JoinVendor go={go}/><Footer go={go}/></>}
    {(route==="/access"||route==="/pricing"||route==="/waitlist"||route==="/verified")&&<><AccessPage go={go}/><Footer go={go}/></>}
    {route==="/login"&&<><VendorLogin go={go}/><Footer go={go}/></>}
    {route==="/dashboard"&&<>{user?<VendorDashboard go={go} user={user}/>:<VendorLogin go={go}/>}<Footer go={go}/></>}
  </div>}
