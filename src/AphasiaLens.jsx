import { useState, useRef } from "react";
import { jsPDF } from "jspdf";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg:"#f1f5f9", surface:"#ffffff", card:"#ffffff", border:"#e2e8f0",
  teal:"#0369a1", tealDim:"#eff6ff", accent:"#b45309", green:"#047857",
  red:"#b91c1c", purple:"#6d28d9", blue:"#1d4ed8", pink:"#be185d",
  text:"#0f172a", muted:"#475569", white:"#ffffff",
};

// ─── Bilingual WAB Data ───────────────────────────────────────────────────────
const WAB = {
  en: {
    spontaneous: ["How are you today?","Have you been here before?","What is your name?","What is your address?","What is your occupation?","Tell me why you are here / what seems to be the trouble?","Please describe this picture:"],
    yesno: ["Is your name Kuppa Swamy?","Is your name Rama Krishna?","Is your name ___ (real name)?","Do you live in Bangalore?","Do you live in ___ (real residence)?","Do you live in Calcutta?","Are you a man/woman?","Are you a Doctor?","Am I a man/woman?","Are the lights on in this room?","Is the door closed?","Is this a hotel?","Is this ___ (real test location)?","Are you wearing a red dhothi?","Will paper burn in fire?","Does March come before June?","Do you eat a banana before you peel it?","Does it rain in July?","Is a horse larger than a dog?","Do you cut the grass with an axe?"],
    repetition: [{t:"Hand",m:2},{t:"Nose",m:2},{t:"Bed",m:2},{t:"Window",m:2},{t:"Banana",m:2},{t:"Rainbow",m:4},{t:"Forty five",m:4},{t:"Ninety five percent",m:6},{t:"Sixty two and a half",m:10},{t:"The farmer is ploughing",m:8},{t:"He is not coming back",m:10},{t:"All that glitters is not gold",m:10},{t:"First Indian field army",m:8},{t:"No ifs, ands or buts",m:10},{t:"Load my cart with five dozen bags of white wheat",m:20}],
    naming_obj: ["Paisa","Ball","Knife","Cup","Safety pin","Mirror","Toothbrush","Book","Lock","Pencil","Scissors","Key","Needle","Bangle","Comb","Watch","Spoon","Flower","Plate","Matches"],
    sentence_completion: ["The grass is ___","Sugar is ___","Roses are red, jasmines are ___","They fought like cats and ___","Indian Independence day is in the month of ___"],
    responsive: ["What do you write with?","What color is milk?","How many days are in a week?","Where do doctors work?","Where can you get stamps?"],
    commands: [{c:"Raise your hands",m:2},{c:"Shut your eyes",m:2},{c:"Point to the chair",m:2},{c:"Point to the window, then to the door",m:4},{c:"Point to the pen and the book",m:4},{c:"Point with the pen to the book",m:8},{c:"Point to the pen with the book",m:8},{c:"Point to the comb with the pen",m:8},{c:"With the book, point to the comb",m:8},{c:"Put the pen on top of the book, then give it to me",m:14},{c:"Put the comb on the other side of the pen and turn over the book",m:20}],
  },
  kn: {
    spontaneous: ["ನೀವು ಇಂದು ಹೇಗಿದ್ದೀರಿ? (Nīvu indu hēgiddīri?)","ನೀವು ಮೊದಲು ಇಲ್ಲಿಗೆ ಬಂದಿದ್ದೀರಾ? (Have you been here before?)","ನಿಮ್ಮ ಹೆಸರು ಏನು? (Nimma hesaru ēnu?)","ನಿಮ್ಮ ವಿಳಾಸ ಏನು? (Nimma viḷāsa ēnu?)","ನಿಮ್ಮ ವೃತ್ತಿ ಏನು? (Nimma vr̥tti ēnu?)","ನೀವು ಇಲ್ಲಿಗೇಕೆ ಬಂದಿದ್ದೀರಿ / ತೊಂದರೆ ಏನು? (Why are you here?)","ಈ ಚಿತ್ರವನ್ನು ವಿವರಿಸಿ: (Describe this picture:)"],
    yesno: ["ನಿಮ್ಮ ಹೆಸರು ಕುಪ್ಪಸ್ವಾಮಿ ಅಲ್ಲವೇ?","ನಿಮ್ಮ ಹೆಸರು ರಾಮಕೃಷ್ಣ ಅಲ್ಲವೇ?","ನಿಮ್ಮ ಹೆಸರು ___ ಅಲ್ಲವೇ? (ನಿಜವಾದ ಹೆಸರು)","ನೀವು ಬೆಂಗಳೂರಿನಲ್ಲಿ ವಾಸಿಸುತ್ತೀರಾ?","ನೀವು ___ ನಲ್ಲಿ ವಾಸಿಸುತ್ತೀರಾ? (ನಿಜವಾದ ವಿಳಾಸ)","ನೀವು ದೆಹಲಿಯಲ್ಲಿ ವಾಸಿಸುತ್ತೀರಾ?","ನೀವು ಪುರುಷ/ಮಹಿಳೆ ಅಲ್ಲವೇ?","ನೀವು ವೈದ್ಯರೇ?","ನಾನು ಪುರುಷ/ಮಹಿಳೆ ಅಲ್ಲವೇ?","ಈ ಕೋಣೆಯಲ್ಲಿ ದೀಪ ಉರಿಯುತ್ತಿದೆಯೇ?","ಬಾಗಿಲು ಮುಚ್ಚಿದೆಯೇ?","ಇದು ಹೊಟೇಲ್ ಅಲ್ಲವೇ?","ಇದು ___ ಅಲ್ಲವೇ? (ನಿಜವಾದ ಸ್ಥಳ)","ನೀವು ಕೆಂಪು ಲಂಗ ಹಾಕಿದ್ದೀರಾ?","ಕಾಗದ ಬೆಂಕಿಯಲ್ಲಿ ಉರಿಯುತ್ತದೆಯೇ?","ಮಾರ್ಚ್ ಜೂನ್‌ಗಿಂತ ಮೊದಲು ಬರುತ್ತದೆಯೇ?","ಬಾಳೆಹಣ್ಣನ್ನು ಸಿಪ್ಪೆ ತೆಗೆಯುವ ಮೊದಲು ತಿನ್ನುತ್ತೀರಾ?","ಜುಲೈನಲ್ಲಿ ಮಳೆ ಬರುತ್ತದೆಯೇ?","ಕುದುರೆ ನಾಯಿಗಿಂತ ದೊಡ್ಡದೇ?","ಕೊಡಲಿಯಿಂದ ಹುಲ್ಲು ಕೊಯ್ಯುತ್ತೀರಾ?"],
    repetition: [{t:"ಕೈ (Kai – Hand)",m:2},{t:"ಮೂಗು (Mūgu – Nose)",m:2},{t:"ಮಂಚ (Manca – Bed)",m:2},{t:"ಕಿಟಕಿ (Kiṭaki – Window)",m:2},{t:"ಬಾಳೆಹಣ್ಣು (Bāḷehaṇṇu – Banana)",m:2},{t:"ಕಾಮನಬಿಲ್ಲು (Rainbow)",m:4},{t:"ನಲವತ್ತೈದು (Forty five)",m:4},{t:"ತೊಂಬತ್ತೈದು ಪ್ರತಿಶತ (Ninety five percent)",m:6},{t:"ಅರವತ್ತೆರಡೂವರೆ (Sixty two and a half)",m:10},{t:"ರೈತನು ಉಳುಮೆ ಮಾಡುತ್ತಿದ್ದಾನೆ (The farmer is ploughing)",m:8},{t:"ಅವನು ವಾಪಸ್ ಬರುತ್ತಿಲ್ಲ (He is not coming back)",m:10},{t:"ಮಿನುಗುವುದೆಲ್ಲ ಚಿನ್ನವಲ್ಲ (All that glitters is not gold)",m:10},{t:"ಮೊದಲ ಭಾರತ ಕ್ಷೇತ್ರ ಸೇನೆ (First Indian field army)",m:8},{t:"ಯಾವ ಷರತ್ತೂ ಇಲ್ಲ (No ifs, ands or buts)",m:10},{t:"ನನ್ನ ಬಂಡಿಯನ್ನು ಐದು ಡಜನ್ ಚೀಲ ಗೋಧಿಯಿಂದ ತುಂಬಿಸು (Load my cart…)",m:20}],
    naming_obj: ["ನಾಣ್ಯ (Nāṇya – Coin/Paisa)","ಚೆಂಡು (Ceṇḍu – Ball)","ಚಾಕು (Cāku – Knife)","ಕಪ್ (Cup)","ಸೇಫ್ಟಿಪಿನ್ (Safety pin)","ಕನ್ನಡಿ (Kannaḍi – Mirror)","ಹಲ್ಲುಜ್ಜು ಬ್ರಷ್ (Toothbrush)","ಪುಸ್ತಕ (Pustaka – Book)","ಬೀಗ (Bīga – Lock)","ಪೆನ್ಸಿಲ್ (Pencil)","ಕತ್ತರಿ (Kattari – Scissors)","ಕೀ (Kī – Key)","ಸೂಜಿ (Sūji – Needle)","ಬಳೆ (Baḷe – Bangle)","ಬಾಚಣಿಗೆ (Bācaṇige – Comb)","ಗಡಿಯಾರ (Gaḍiyāra – Watch)","ಚಮಚ (Camaca – Spoon)","ಹೂವು (Hūvu – Flower)","ತಟ್ಟೆ (Taṭṭe – Plate)","ಬೆಂಕಿಕಡ್ಡಿ (Beṅkikaḍḍi – Matches)"],
    sentence_completion: ["ಹುಲ್ಲು ___ ಆಗಿರುತ್ತದೆ (The grass is ___)","ಸಕ್ಕರೆ ___ ಆಗಿರುತ್ತದೆ (Sugar is ___)","ಗುಲಾಬಿ ಕೆಂಪು, ಮಲ್ಲಿಗೆ ___ (Roses are red, jasmines are ___)","ಅವರು ಬೆಕ್ಕು ಮತ್ತು ___ ನಂತೆ ಜಗಳವಾಡಿದರು (They fought like cats and ___)","ಭಾರತದ ಸ್ವಾತಂತ್ರ್ಯ ದಿನ ___ ತಿಂಗಳಲ್ಲಿ ಬರುತ್ತದೆ (Independence day is in ___)"],
    responsive: ["ಬರೆಯಲು ಏನನ್ನು ಬಳಸುತ್ತೀರಿ? (What do you write with?)","ಹಾಲಿನ ಬಣ್ಣ ಏನು? (Color of milk?)","ವಾರದಲ್ಲಿ ಎಷ್ಟು ದಿನಗಳಿವೆ? (Days in a week?)","ವೈದ್ಯರು ಎಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತಾರೆ? (Where do doctors work?)","ಅಂಚೆಚೀಟಿ ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ? (Where to get stamps?)"],
    commands: [{c:"ನಿಮ್ಮ ಕೈ ಎತ್ತಿ (Raise your hands)",m:2},{c:"ಕಣ್ಣು ಮುಚ್ಚಿ (Shut your eyes)",m:2},{c:"ಕುರ್ಚಿಯನ್ನು ತೋರಿಸಿ (Point to the chair)",m:2},{c:"ಕಿಟಕಿ, ನಂತರ ಬಾಗಿಲು ತೋರಿಸಿ (Window then door)",m:4},{c:"ಲೇಖನಿ ಮತ್ತು ಪುಸ್ತಕ ತೋರಿಸಿ (Pen and book)",m:4},{c:"ಲೇಖನಿಯಿಂದ ಪುಸ್ತಕ ತೋರಿಸಿ (With pen, point to book)",m:8},{c:"ಪುಸ್ತಕದಿಂದ ಲೇಖನಿ ತೋರಿಸಿ (With book, point to pen)",m:8},{c:"ಲೇಖನಿಯಿಂದ ಬಾಚಣಿಗೆ ತೋರಿಸಿ (With pen, point to comb)",m:8},{c:"ಪುಸ್ತಕದಿಂದ ಬಾಚಣಿಗೆ ತೋರಿಸಿ (With book, point to comb)",m:8},{c:"ಲೇಖನಿಯನ್ನು ಪುಸ್ತಕದ ಮೇಲಿಡಿ, ನಂತರ ನನಗೆ ಕೊಡಿ (Pen on book, give me)",m:14},{c:"ಬಾಚಣಿಗೆಯನ್ನು ಲೇಖನಿಯ ಇನ್ನೊಂದು ಬದಿ ಇಡಿ ಮತ್ತು ಪುಸ್ತಕ ತಿರುಗಿಸಿ",m:20}],
  }
};

// ─── AQ Classification ────────────────────────────────────────────────────────
function classifyAphasia(sc) {
  const ss=sc.ss_info+sc.ss_flu, avc=sc.avc_yesno+sc.avc_wordrec+sc.avc_seqcmd,
        rep=sc.rep, nam=sc.nam_obj+sc.nam_flu+sc.nam_sc+sc.nam_rs;
  const aq = Math.round(((ss/20)+(avc/200)+(rep/100)+(nam/100))*20*10)/10;
  const fl=ss/20>=0.4, gc=avc/200>=0.6, gr=rep/100>=0.6, gn=nam/100>=0.5;
  let type="Undetermined";
  if(aq>93.8) type="Within Normal Limits";
  else if(!fl&&!gc&&!gr) type="Global";
  else if(!fl&&gc&&!gr) type="Broca's";
  else if(!fl&&gc&&gr) type="Transcortical Motor";
  else if(fl&&!gc&&!gr) type="Wernicke's";
  else if(fl&&!gc&&gr) type="Transcortical Sensory";
  else if(fl&&gc&&!gr) type="Conduction";
  else if(fl&&gc&&gr&&!gn) type="Anomic";
  else if(fl&&gc&&gr&&gn) type="Mild / Recovered";
  let sev="Severe";
  if(aq>=75) sev="Mild";
  else if(aq>=50) sev="Moderate";
  else if(aq>=25) sev="Moderate-Severe";
  return {aq, type, sev, ss, avc, rep, nam, fl, gc, gr, gn};
}

const TYPE_COLOR = {"Global":"#94a3b8","Broca's":"#3b82f6","Transcortical Motor":"#10b981","Wernicke's":"#ef4444","Transcortical Sensory":"#ec4899","Conduction":"#8b5cf6","Anomic":"#f59e0b","Mild / Recovered":"#10b981","Within Normal Limits":"#06b6d4","Undetermined":"#64748b"};

// ─── Claude Prompt ────────────────────────────────────────────────────────────
const SYS = `You are a bilingual (Kannada-English) Speech-Language Pathologist specialising in aphasia. Given WAB scores, case history, and optional speech transcript, return ONLY valid JSON (no markdown):
{
  "clinical_summary":"<3-4 sentence synthesis>",
  "paraphasias":[{"type":"<Phonemic|Semantic|Neologistic|Perseverative>","example":"<target→produced>","note":"<brief>"}],
  "agrammatism":{"present":true,"severity":"<Mild|Moderate|Severe|Absent>","features":["<>"]},
  "lexical_retrieval":"<Severe|Moderate|Mild|Intact>",
  "auditory_comprehension_profile":"<brief interpretation of AVC subtest pattern>",
  "bilingual_notes":"<Kannada-English code-switching observations or null>",
  "intervention_priorities":[
    {"priority":1,"domain":"<e.g. Word Retrieval>","strategy":"<specific evidence-based approach>","rationale":"<why first>"},
    {"priority":2,"domain":"<>","strategy":"<>","rationale":"<>"},
    {"priority":3,"domain":"<>","strategy":"<>","rationale":"<>"}
  ],
  "home_programme":"<1 practical home activity for family to implement>",
  "progress_notes":"<if pre and post scores both provided, describe changes; else null>",
  "prognosis":"<brief prognosis comment based on WAB profile and case history>"
}`;

// ─── Reusable UI ──────────────────────────────────────────────────────────────
const fnt = { fontFamily:"'Inter', 'Segoe UI', system-ui, sans-serif" };

function Card({title, icon, accent=C.teal, children, noPad}) {
  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,marginBottom:20,overflow:"hidden",boxShadow:"0 1px 3px rgba(15,23,42,0.06), 0 4px 20px rgba(15,23,42,0.05)",borderTop:`3px solid ${accent}`}}>
      <div style={{display:"flex",alignItems:"center",gap:9,padding:"14px 20px",borderBottom:`1px solid ${C.border}`,background:"#f8faff"}}>
        <span style={{color:accent,fontSize:15}}>{icon}</span>
        <h3 style={{margin:0,fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:accent,...fnt}}>{title}</h3>
      </div>
      <div style={noPad?{}:{padding:"18px 20px"}}>{children}</div>
    </div>
  );
}

function Row({label, value, color}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid #eef2f7`}}>
      <span style={{fontSize:13,color:C.muted,...fnt}}>{label}</span>
      <span style={{fontSize:13,color:color||C.text,fontWeight:600,...fnt}}>{value}</span>
    </div>
  );
}

const fieldLabel = {fontSize:11.5,color:C.muted,marginBottom:5,fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"};
const fieldBase = {width:"100%",background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,padding:"9px 12px",boxSizing:"border-box",outline:"none"};

function FInput({label, value, onChange, placeholder, type="text", full}) {
  return (
    <div style={{marginBottom:12,flex:full?"1":""}}>
      {label && <div style={{...fieldLabel,...fnt}}>{label}</div>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||""} style={{...fieldBase,...fnt}}/>
    </div>
  );
}

function FTextarea({label, value, onChange, rows=3, placeholder}) {
  return (
    <div style={{marginBottom:12}}>
      {label && <div style={{...fieldLabel,...fnt}}>{label}</div>}
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||""} rows={rows} style={{...fieldBase,resize:"vertical",lineHeight:1.6,...fnt}}/>
    </div>
  );
}

function FSelect({label, value, onChange, options}) {
  return (
    <div style={{marginBottom:12}}>
      {label && <div style={{...fieldLabel,...fnt}}>{label}</div>}
      <select value={value} onChange={e=>onChange(e.target.value)} style={{...fieldBase,...fnt}}>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function RadioGroup({label, options, value, onChange}) {
  return (
    <div style={{marginBottom:12}}>
      {label && <div style={{...fieldLabel,...fnt}}>{label}</div>}
      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        {options.map(o=>(
          <label key={o} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",...fnt,fontSize:13,fontWeight:value===o?600:400,color:value===o?C.teal:C.muted}}>
            <input type="radio" checked={value===o} onChange={()=>onChange(o)} style={{accentColor:C.teal,width:14,height:14}}/>
            {o}
          </label>
        ))}
      </div>
    </div>
  );
}

function BehRow({label, rep, obs, onRep, onObs}) {
  const sel = {background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:7,color:C.text,fontSize:12,padding:"5px 8px",...fnt};
  return (
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:10,alignItems:"center",marginBottom:8,padding:"4px 0",borderBottom:`1px solid #f0f4f8`}}>
      <span style={{fontSize:13,color:C.text,fontWeight:500,...fnt}}>{label}</span>
      <select value={rep} onChange={e=>onRep(e.target.value)} style={sel}>
        {["—","Normal","Mildly impaired","Moderately impaired","Severely impaired","Absent","Present"].map(o=><option key={o}>{o}</option>)}
      </select>
      <select value={obs} onChange={e=>onObs(e.target.value)} style={sel}>
        {["—","Normal","Mildly impaired","Moderately impaired","Severely impaired","Absent","Present"].map(o=><option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SliderScore({label, value, max, onChange}) {
  const pct = max>0 ? value/max : 0;
  const col = pct>=0.7?C.green:pct>=0.4?C.accent:C.red;
  return (
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span style={{fontSize:13,color:C.muted,fontWeight:500,...fnt}}>{label}</span>
        <span style={{fontSize:13,color:col,fontWeight:700,...fnt}}>{value}/{max} <span style={{fontSize:11,color:C.muted,fontWeight:400}}>({Math.round(pct*100)}%)</span></span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <input type="range" min={0} max={max} value={value} onChange={e=>onChange(Number(e.target.value))} style={{flex:1,accentColor:col,height:4}}/>
        <input type="number" min={0} max={max} value={value} onChange={e=>onChange(Math.min(max,Math.max(0,Number(e.target.value))))} style={{width:48,background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:7,color:C.text,fontSize:12,fontWeight:600,padding:"4px 6px",textAlign:"center",...fnt,outline:"none"}}/>
      </div>
      <div style={{height:5,borderRadius:3,background:"#e9eef5",marginTop:6}}>
        <div style={{height:"100%",width:`${pct*100}%`,background:col,borderRadius:3,transition:"width 0.3s"}}/>
      </div>
    </div>
  );
}

function AQGauge({aq}) {
  const pct=aq/100, r=54, circ=2*Math.PI*r;
  const col=aq>=75?C.green:aq>=50?C.accent:C.red;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <svg width={132} height={132}>
        <circle cx={66} cy={66} r={r} fill="none" stroke="#e9eef5" strokeWidth={10}/>
        <circle cx={66} cy={66} r={r} fill="none" stroke={col} strokeWidth={10}
          strokeDasharray={`${pct*circ} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 66 66)" style={{transition:"stroke-dasharray 0.8s",filter:`drop-shadow(0 2px 6px ${col}55)`}}/>
        <text x={66} y={61} textAnchor="middle" fill={C.text} fontSize={26} fontWeight="800" fontFamily="Inter, sans-serif">{aq}</text>
        <text x={66} y={78} textAnchor="middle" fill={C.muted} fontSize={11} fontFamily="Inter, sans-serif">/ 100 AQ</text>
      </svg>
    </div>
  );
}

function Chip({text, color}) {
  return <span style={{display:"inline-block",background:(color||C.teal)+"18",border:`1px solid ${(color||C.teal)}44`,color:color||C.teal,borderRadius:5,padding:"3px 10px",fontSize:12,fontWeight:600,marginRight:5,marginBottom:5,...fnt}}>{text}</span>;
}

function NavBtn({label, active, onClick}) {
  return (
    <button onClick={onClick} style={{
      padding:"10px 18px",border:"1.5px solid",borderRadius:8,cursor:"pointer",
      borderColor:active?C.teal:"#dde4ef",
      background:active?C.teal:"#ffffff",
      color:active?"#ffffff":"#64748b",
      fontSize:12,fontWeight:600,...fnt,whiteSpace:"nowrap",transition:"all 0.15s",letterSpacing:"0.01em",
      boxShadow:active?"0 2px 10px rgba(3,105,161,0.28)":"0 1px 2px rgba(0,0,0,0.05)"
    }}>{label}</button>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function AphasiaLens() {
  const [page, setPage] = useState("casehistory");
  const [lang, setLang] = useState("en");
  const [session, setSession] = useState("pre");

  // Case History State
  const [ch, setCh] = useState({
    name:"",caseNo:"",age:"",sex:"Male",clinician:"",supervisor:"",clinicAddress:"",
    strokeHistory:"",medicalRecords:"",dominantHand:"Right",education:"",
    languagesSpoken:"Kannada, English",occupationPreStroke:"",
    timePostOnset:"",lesionSite:"",
  });
  const [beh, setBeh] = useState({
    aggressiveness:["—","—"],temperTantrums:["—","—"],depression:["—","—"],
    motivation:["—","—"],attention:["—","—"],interest:["—","—"],
    socialPosition:"",needForComm:["—","—"],earlyBehaviourReported:"",earlyBehaviourObserved:"",
    familyResponseReported:"",familyResponseObserved:""
  });
  const [specFn, setSpecFn] = useState({
    hearingLoss:"No",vocabCompReduced:"No",confusesAuditoryWords:"No",audRetentionSpan:"Normal",
    visualAcuity:"Normal",matchingAbility:"",readingVocab:"",
    lips:"Normal",tongue:"Normal",hardPalate:"Normal",softPalate:"Normal",uvula:"Normal",facial:"Normal",
    mastication:"Normal",sucking:"Normal",swallowing:"Normal",blowing:"Normal",
    vowels:"",consonants:"",blends:"",diphthongs:"",semiVowels:"",
    pitch:"Normal",loudness:"Normal",voiceQuality:"Normal",phonationDuration:"",breathControl:"",
    intonation:"",stress:"",phrasing:"",rateOfSpeech:"",imitationSkills:"",
    reactivesSpeech:"",overlearnedSerial:"",
    writingHand:"Right",copyForms:"",writingVocab:"",
    arithmeticSimple:"",transcript:"",additionalNotes:"",
  });

  // WAB Scores — stored per session
  const [wabPre, setWabPre] = useState({ss_info:0,ss_flu:0,avc_yesno:0,avc_wordrec:0,avc_seqcmd:0,rep:0,nam_obj:0,nam_flu:0,nam_sc:0,nam_rs:0});
  const [wabPost, setWabPost] = useState({ss_info:0,ss_flu:0,avc_yesno:0,avc_wordrec:0,avc_seqcmd:0,rep:0,nam_obj:0,nam_flu:0,nam_sc:0,nam_rs:0});

  const wab = session==="pre" ? wabPre : wabPost;
  const setWab = session==="pre" ? setWabPre : setWabPost;
  const updateWab = (k,v) => setWab(prev=>({...prev,[k]:v}));

  // AI Analysis
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const aiRef = useRef(null);

  // Editable AI notes state
  const [editedNotes, setEditedNotes] = useState({});
  const [savedNotes, setSavedNotes] = useState({});
  const [noteSaved, setNoteSaved] = useState({});

  function handleNoteChange(key, val) {
    setEditedNotes(prev => ({ ...prev, [key]: val }));
    setNoteSaved(prev => ({ ...prev, [key]: false }));
  }
  function handleNoteSave(key) {
    setSavedNotes(prev => ({ ...prev, [key]: editedNotes[key] ?? getDefaultNote(key) }));
    setNoteSaved(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setNoteSaved(prev => ({ ...prev, [key]: false })), 2000);
  }
  function getDefaultNote(key) {
    if (!aiResult) return "";
    if (key === "clinical_summary") return aiResult.clinical_summary || "";
    if (key === "bilingual_notes") return aiResult.bilingual_notes || "";
    if (key === "home_programme") return aiResult.home_programme || "";
    if (key === "progress_notes") return aiResult.progress_notes || "";
    if (key === "prognosis") return aiResult.prognosis || "";
    return "";
  }
  function getNoteValue(key) {
    return key in editedNotes ? editedNotes[key] : getDefaultNote(key);
  }
  function getDisplayNote(key) {
    return key in savedNotes ? savedNotes[key] : getDefaultNote(key);
  }

  // jsPDF download
  async function downloadPDF() {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const ML = 15, MR = 195, PW = MR - ML;
    let y = 0;
    const NAVY=[15,40,80], TEAL=[0,128,128], SLATE=[71,85,105], DARK=[30,41,59],
          GREEN=[22,163,74], RED=[220,38,38], AMBER=[180,120,0], LGREY=[248,249,250],
          MGREY=[226,232,240], DGREY=[100,116,139], WHITE=[255,255,255];

    const pr = preResult, po = postResult;
    const hasPost = wabPost.ss_info + wabPost.avc_yesno > 0;
    const typeCol = TYPE_COLOR[pr.type]||"#0ea5e9";
    const tcRGB = [parseInt(typeCol.slice(1,3),16),parseInt(typeCol.slice(3,5),16),parseInt(typeCol.slice(5,7),16)];
    let secNum = 1;

    // ── HELPERS ──
    function newPage() { doc.addPage(); y = 28; }
    function guard(need) { if (y + need > 274) newPage(); }

    function sectionHeader(title) {
      guard(14);
      doc.setFillColor(...NAVY);
      doc.rect(ML, y, PW, 9, "F");
      doc.setFontSize(10); doc.setTextColor(...WHITE); doc.setFont("helvetica","bold");
      doc.text(`${secNum++}.  ${title.toUpperCase()}`, ML+4, y+6.2);
      y += 13;
    }
    function subSection(title) {
      guard(10);
      doc.setDrawColor(...TEAL); doc.setLineWidth(0.4);
      doc.line(ML, y, ML+3, y);
      doc.setFontSize(9); doc.setTextColor(...TEAL); doc.setFont("helvetica","bold");
      doc.text(title, ML+5, y+0.3);
      const tw = doc.getTextWidth(title);
      doc.setDrawColor(...MGREY); doc.setLineWidth(0.3);
      doc.line(ML+6+tw, y, MR, y);
      doc.setLineWidth(0.2);
      y += 7;
    }
    function paraText(text, indent=0, size=9.5, color=DARK) {
      guard(6);
      doc.setFontSize(size); doc.setTextColor(...color); doc.setFont("helvetica","normal");
      const lines = doc.splitTextToSize(String(text||"—"), PW - indent - 2);
      lines.forEach(l => { guard(5); doc.text(l, ML+indent, y); y += size*0.42+1.3; });
    }
    function twoCol(label, value, valColor=DARK) {
      guard(6);
      doc.setFontSize(9); doc.setFont("helvetica","bold"); doc.setTextColor(...DGREY);
      doc.text(label, ML+2, y);
      doc.setFont("helvetica","normal"); doc.setTextColor(...valColor);
      doc.text(String(value||"—"), ML+58, y);
      y += 5.8;
    }
    function hrule(color=MGREY, weight=0.25) {
      guard(5);
      doc.setDrawColor(...color); doc.setLineWidth(weight);
      doc.line(ML, y, MR, y); y += 4;
    }

    // ── TABLE: score row with bar ──
    function scoreTableRow(label, val, max, isTotal=false, indent=0) {
      guard(7);
      const pct = max>0?val/max:0;
      const col = pct>=0.7?GREEN:pct>=0.4?AMBER:RED;
      const rowH = 6.5;
      // alternating row bg
      if (isTotal) {
        doc.setFillColor(235,245,255); doc.rect(ML, y-4.5, PW, rowH, "F");
      }
      doc.setFontSize(9);
      doc.setFont("helvetica", isTotal?"bold":"normal");
      doc.setTextColor(...(isTotal?NAVY:SLATE));
      doc.text(label, ML+2+indent, y);
      // Score
      doc.setFont("helvetica","bold"); doc.setTextColor(...col);
      doc.text(`${val} / ${max}`, 145, y);
      // Percent
      doc.setFont("helvetica","normal"); doc.setTextColor(...DGREY);
      doc.text(`${Math.round(pct*100)}%`, 168, y);
      // Bar track
      const barX=130, barW=13, barY=y-3.2, barH=2.2;
      doc.setFillColor(...MGREY); doc.rect(barX, barY, barW, barH, "F");
      doc.setFillColor(...col); doc.rect(barX, barY, barW*pct, barH, "F");
      y += rowH;
    }

    function tableHeader() {
      guard(8);
      doc.setFillColor(...MGREY);
      doc.rect(ML, y-4, PW, 6, "F");
      doc.setFontSize(8); doc.setFont("helvetica","bold"); doc.setTextColor(...NAVY);
      doc.text("Subtest", ML+2, y);
      doc.text("Score", 145, y);
      doc.text("%", 168, y);
      doc.text("Profile", 130, y);
      y += 4;
      doc.setDrawColor(...NAVY); doc.setLineWidth(0.3);
      doc.line(ML, y, MR, y); y += 3;
    }

    // ── LETTERHEAD ──
    // Top colour bar
    doc.setFillColor(...NAVY); doc.rect(0, 0, 210, 3, "F");
    doc.setFillColor(...TEAL); doc.rect(0, 3, 210, 1.5, "F");

    // Brand block (left)
    y = 10;
    // "Aphasia" in teal, "Lens" in navy — measure each part carefully
    doc.setFontSize(20); doc.setFont("helvetica","bold");
    doc.setTextColor(...TEAL);
    doc.text("Aphasia", ML, y);
    const w1 = doc.getTextWidth("Aphasia");
    doc.setTextColor(...NAVY);
    doc.text("Lens", ML + w1, y);
    const w2 = doc.getTextWidth("Lens");
    // v2.0 superscript — separate line, smaller, after the brand name
    doc.setFontSize(7.5); doc.setTextColor(...DGREY); doc.setFont("helvetica","normal");
    doc.text("v2.0", ML + w1 + w2 + 1.5, y - 5);
    // Subtitle lines
    doc.setFontSize(8.5); doc.setTextColor(...NAVY); doc.setFont("helvetica","bold");
    doc.text("WAB CLINICAL ASSESSMENT REPORT", ML, y + 6);
    doc.setFontSize(7.5); doc.setTextColor(...DGREY); doc.setFont("helvetica","normal");
    doc.text("Bilingual Administration  ·  Kannada – English  ·  WAB (Kertesz, 1982)", ML, y + 11);

    // Report meta (right)
    const reportDate = new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"});
    doc.setFontSize(8); doc.setTextColor(...DGREY); doc.setFont("helvetica","normal");
    doc.text(`Date of Report:`, 130, y, {align:"left"});
    doc.setFont("helvetica","bold"); doc.setTextColor(...DARK);
    doc.text(reportDate, 160, y);
    doc.setFont("helvetica","normal"); doc.setTextColor(...DGREY);
    doc.text(`Case No.:`, 130, y+5.5);
    doc.setFont("helvetica","bold"); doc.setTextColor(...DARK);
    doc.text(ch.caseNo||"___________", 160, y+5.5);
    doc.setFont("helvetica","normal"); doc.setTextColor(...DGREY);
    doc.text(`Session:`, 130, y+11);
    doc.setFont("helvetica","bold"); doc.setTextColor(...DARK);
    doc.text("Pre-Intervention", 160, y+11);

    // Divider under letterhead
    y = 26;
    doc.setDrawColor(...NAVY); doc.setLineWidth(0.6);
    doc.line(ML, y, MR, y);
    doc.setDrawColor(...TEAL); doc.setLineWidth(0.3);
    doc.line(ML, y+1, MR, y+1);
    y = 32;

    // ── SECTION 1: PATIENT DEMOGRAPHICS ──
    sectionHeader("Patient Demographics");
    // Two-column grid
    const col1x=ML+2, col2x=ML+95;
    const fields = [
      ["Full Name", ch.name||"Not recorded"],
      ["Age / Sex", `${ch.age||"—"} years  /  ${ch.sex}`],
      ["Languages Spoken", ch.languagesSpoken||"—"],
      ["Dominant Hand", ch.dominantHand||"—"],
      ["Education", ch.education||"—"],
      ["Pre-stroke Occupation", ch.occupationPreStroke||"—"],
      ["Time Post Onset", ch.timePostOnset ? `${ch.timePostOnset} months` : "—"],
      ["Lesion Site / Aetiology", ch.lesionSite||"—"],
      ["WAB Language", lang==="en"?"English":"Kannada-English"],
      ["Assessed by", ch.clinician||"—"],
    ];
    for (let i=0; i<fields.length; i+=2) {
      guard(7);
      const rowY = y;
      if (i%4===0) { doc.setFillColor(...LGREY); doc.rect(ML, rowY-4, PW, 6.5, "F"); }
      doc.setFontSize(8.5);
      // col 1
      doc.setFont("helvetica","bold"); doc.setTextColor(...DGREY);
      doc.text(fields[i][0]+":", col1x, rowY);
      doc.setFont("helvetica","normal"); doc.setTextColor(...DARK);
      const v1 = doc.splitTextToSize(String(fields[i][1]), 80);
      doc.text(v1, col1x+42, rowY);
      // col 2
      if (fields[i+1]) {
        doc.setFont("helvetica","bold"); doc.setTextColor(...DGREY);
        doc.text(fields[i+1][0]+":", col2x, rowY);
        doc.setFont("helvetica","normal"); doc.setTextColor(...DARK);
        const v2 = doc.splitTextToSize(String(fields[i+1][1]), 75);
        doc.text(v2, col2x+42, rowY);
      }
      y += 7;
    }
    if (ch.clinicAddress) {
      guard(7);
      doc.setFontSize(8.5); doc.setFont("helvetica","bold"); doc.setTextColor(...DGREY);
      doc.text("Institution:", col1x, y);
      doc.setFont("helvetica","normal"); doc.setTextColor(...DARK);
      doc.text(doc.splitTextToSize(ch.clinicAddress, 140), col1x+42, y);
      y += 7;
    }
    if (ch.strokeHistory) {
      guard(14);
      doc.setFontSize(8.5); doc.setFont("helvetica","bold"); doc.setTextColor(...DGREY);
      doc.text("Stroke History:", col1x, y); y+=5;
      paraText(ch.strokeHistory, 4, 9, SLATE);
    }
    y += 3;

    // ── SECTION 2: APHASIA CLASSIFICATION ──
    sectionHeader("Aphasia Classification & AQ Summary");
    guard(30);

    // Large classification box
    doc.setFillColor(...tcRGB.map(v=>Math.min(255,v+195)));
    doc.setDrawColor(...tcRGB); doc.setLineWidth(0.8);
    doc.roundedRect(ML, y, PW, 26, 3, 3, "FD");
    // AQ circle placeholder
    doc.setFillColor(...WHITE);
    doc.ellipse(ML+16, y+13, 11, 11, "FD");
    doc.setFontSize(14); doc.setFont("helvetica","bold"); doc.setTextColor(...tcRGB);
    doc.text(String(pr.aq), ML+16, y+11, {align:"center"});
    doc.setFontSize(6.5); doc.setTextColor(...DGREY); doc.setFont("helvetica","normal");
    doc.text("/ 100 AQ", ML+16, y+16, {align:"center"});
    // Type label
    doc.setFontSize(16); doc.setFont("helvetica","bold"); doc.setTextColor(...tcRGB);
    doc.text(`${pr.type} Aphasia`, ML+32, y+10);
    // Severity + session
    doc.setFontSize(9.5); doc.setFont("helvetica","normal"); doc.setTextColor(...SLATE);
    doc.text(`Severity: `, ML+32, y+17);
    doc.setFont("helvetica","bold");
    const sevCol = pr.aq>=75?GREEN:pr.aq>=50?AMBER:RED;
    doc.setTextColor(...sevCol);
    doc.text(pr.sev, ML+32+doc.getTextWidth("Severity: "), y+17);
    doc.setFont("helvetica","normal"); doc.setTextColor(...SLATE);
    doc.text(`  ·  Pre-Intervention Assessment  ·  WAB (Kertesz, 1982)`, ML+32+doc.getTextWidth("Severity: "+pr.sev), y+17);
    y += 30;

    // Profile badges
    guard(14);
    const badges=[
      ["Fluency", pr.fl?"Fluent":"Non-Fluent", pr.fl?GREEN:RED],
      ["Comprehension", pr.gc?"Good":"Poor", pr.gc?GREEN:RED],
      ["Repetition", pr.gr?"Intact":"Impaired", pr.gr?GREEN:RED],
      ["Naming", pr.gn?"Intact":"Impaired", pr.gn?GREEN:RED],
    ];
    let bx=ML;
    badges.forEach(([l,v,c])=>{
      const bw=43;
      doc.setFillColor(...c.map(n=>Math.min(255,n+195)));
      doc.setDrawColor(...c); doc.setLineWidth(0.4);
      doc.roundedRect(bx, y, bw, 10, 2, 2, "FD");
      doc.setFontSize(7); doc.setFont("helvetica","bold"); doc.setTextColor(...c);
      doc.text(l.toUpperCase(), bx+bw/2, y+4, {align:"center"});
      doc.setFontSize(8.5); doc.setTextColor(...DARK);
      doc.text(v, bx+bw/2, y+8.5, {align:"center"});
      bx += bw+1.5;
    });
    y += 14;

    hrule(MGREY);

    // ── SECTION 3: WAB SUBTEST SCORES ──
    sectionHeader("WAB Subtest Scores — Pre-Intervention");
    tableHeader();

    subSection("I.  Spontaneous Speech  (Maximum: 20)");
    scoreTableRow("Information Content", wabPre.ss_info, 10, false, 4);
    scoreTableRow("Fluency / Phrase Length", wabPre.ss_flu, 10, false, 4);
    scoreTableRow("SPONTANEOUS SPEECH TOTAL", pr.ss, 20, true);
    y += 2;

    subSection("II.  Auditory Verbal Comprehension  (Maximum: 200)");
    scoreTableRow("Yes / No Questions", wabPre.avc_yesno, 60, false, 4);
    scoreTableRow("Word Recognition", wabPre.avc_wordrec, 60, false, 4);
    scoreTableRow("Sequential Commands", wabPre.avc_seqcmd, 80, false, 4);
    scoreTableRow("AVC TOTAL", pr.avc, 200, true);
    y += 2;

    subSection("III.  Repetition  (Maximum: 100)");
    scoreTableRow("REPETITION TOTAL", pr.rep, 100, true);
    y += 2;

    guard(55);
    subSection("IV.  Naming  (Maximum: 100)");
    scoreTableRow("Object Naming", wabPre.nam_obj, 60, false, 4);
    scoreTableRow("Word Fluency", wabPre.nam_flu, 20, false, 4);
    scoreTableRow("Sentence Completion", wabPre.nam_sc, 10, false, 4);
    scoreTableRow("Responsive Speech", wabPre.nam_rs, 10, false, 4);
    scoreTableRow("NAMING TOTAL", pr.nam, 100, true);
    y += 4;

    // AQ Summary bar
    guard(14);
    doc.setFillColor(...NAVY); doc.rect(ML, y, PW, 11, "F");
    doc.setFontSize(11); doc.setFont("helvetica","bold"); doc.setTextColor(...WHITE);
    doc.text("APHASIA QUOTIENT (AQ):", ML+4, y+7.5);
    doc.setTextColor(...tcRGB);
    doc.text(`${pr.aq} / 100`, ML+68, y+7.5);
    doc.setTextColor(200,200,200);
    doc.text("—", ML+84, y+7.5);
    doc.setTextColor(...WHITE);
    doc.text(`${pr.type} Aphasia  (${pr.sev})`, ML+89, y+7.5);
    y += 15;
    hrule(NAVY, 0.4);

    // ── SECTION 4: POST-INTERVENTION (if available) ──
    if (hasPost) {
      sectionHeader("WAB Subtest Scores — Post-Intervention");
      tableHeader();
      scoreTableRow("Spontaneous Speech", po.ss, 20, true);
      scoreTableRow("Auditory Verbal Comprehension", po.avc, 200, true);
      scoreTableRow("Repetition", po.rep, 100, true);
      scoreTableRow("Naming", po.nam, 100, true);
      y += 4;
      const diff = Math.round((po.aq-pr.aq)*10)/10;
      const dcol = diff>0?GREEN:diff<0?RED:DGREY;
      guard(12);
      doc.setFillColor(240,255,245); doc.setDrawColor(...GREEN); doc.setLineWidth(0.4);
      doc.roundedRect(ML, y, PW, 10, 2, 2, "FD");
      doc.setFontSize(10); doc.setFont("helvetica","bold"); doc.setTextColor(...NAVY);
      doc.text(`POST AQ: ${po.aq} / 100  ·  ${po.type} Aphasia  (${po.sev})`, ML+4, y+4.5);
      doc.setTextColor(...dcol);
      doc.text(`  ·  Change: ${diff>0?"+":""}${diff} points`, ML+4+doc.getTextWidth(`POST AQ: ${po.aq} / 100  ·  ${po.type} Aphasia  (${po.sev})`), y+4.5);
      y += 14; hrule(MGREY);
    }

    // ── SECTION 5: CLINICAL INTERPRETATION ──
    sectionHeader("Clinical Interpretation");
    const interp = {
      "Global":"Global Aphasia is characterised by severe impairment across all language modalities — fluency, comprehension, repetition, and naming are all significantly reduced. The patient is largely dependent on non-verbal communication strategies such as gesture, pointing, and facial expression. Intensive, multimodal therapy approaches are indicated.",
      "Broca's":"Broca's Aphasia presents with non-fluent, effortful, telegraphic speech output with relatively better preserved auditory comprehension. Repetition is typically impaired. The patient is often aware of their errors, which may cause frustration. Agrammatism and anomia are common features. Treatment focuses on functional communication and sentence production.",
      "Wernicke's":"Wernicke's Aphasia is characterised by fluent, paraphasic speech with significantly impaired auditory comprehension. The patient may produce jargon and is typically unaware of errors (anosognosia). Repetition and naming are impaired. Therapy prioritises auditory comprehension training and reducing paraphasic output.",
      "Conduction":"Conduction Aphasia presents with fluent speech and relatively preserved comprehension, but with disproportionately impaired repetition. The hallmark feature is conduite d'approche — repeated attempts to self-correct phonemic errors. Therapy focuses on repetition tasks and phonological cueing hierarchies.",
      "Transcortical Motor":"Transcortical Motor Aphasia is distinguished from Broca's Aphasia by its preserved repetition ability. Spontaneous speech is non-fluent and initiating utterances is effortful, while comprehension remains relatively intact. Therapy targets initiation and spontaneous speech generation.",
      "Transcortical Sensory":"Transcortical Sensory Aphasia is characterised by fluent speech with significantly impaired comprehension, but with notably preserved repetition — the hallmark feature. The patient may demonstrate echolalia. Therapy focuses on building semantic associations and improving comprehension.",
      "Anomic":"Anomic Aphasia presents with fluent speech, good comprehension, and intact repetition, but with pronounced word-finding difficulty across all contexts. This is often seen as a residual pattern following recovery from other aphasia types. Treatment focuses on lexical retrieval strategies and cueing hierarchies.",
      "Mild / Recovered":"The WAB profile is consistent with mild or recovered aphasia. Language functions are substantially preserved with residual word-finding difficulty or mild comprehension breakdown in linguistically complex contexts. Therapy and compensatory strategy training remain beneficial.",
      "Within Normal Limits":"WAB scores fall within normal limits. No significant acquired language impairment is detected at this assessment. Clinical correlation with the presenting complaint and case history is recommended.",
    };
    guard(20);
    doc.setFillColor(...LGREY); doc.setDrawColor(...MGREY); doc.setLineWidth(0.3);
    const interpText = interp[pr.type]||"Refer to WAB standardisation manual for interpretation of this aphasia profile.";
    const interpLines = doc.splitTextToSize(interpText, PW-8);
    const interpH = interpLines.length * 5 + 8;
    doc.roundedRect(ML, y, PW, interpH, 2, 2, "FD");
    doc.setFontSize(9.5); doc.setFont("helvetica","normal"); doc.setTextColor(...DARK);
    interpLines.forEach((l,idx)=>{ doc.text(l, ML+4, y+6+idx*5); });
    y += interpH + 6;

    // ── SECTION 6: AI CLINICAL ANALYSIS ──
    if (aiResult) {
      sectionHeader("AI-Assisted Clinical Analysis  (Anthropic Claude)");
      doc.setFontSize(7.5); doc.setTextColor(...DGREY); doc.setFont("helvetica","italic");
      doc.text("AI-generated content. For clinical decision support only. Verify all recommendations with qualified SLP judgement.", ML+2, y-6);

      subSection("Clinical Summary");
      paraText(getDisplayNote("clinical_summary"), 2);
      y += 2;

      subSection("Linguistic Profile");
      guard(20);
      // Two mini boxes side by side
      doc.setFillColor(...LGREY); doc.roundedRect(ML, y, 85, 18, 2, 2, "F");
      doc.setFillColor(...LGREY); doc.roundedRect(ML+90, y, 85, 18, 2, 2, "F");
      doc.setFontSize(7.5); doc.setFont("helvetica","bold"); doc.setTextColor(...NAVY);
      doc.text("LEXICAL RETRIEVAL", ML+4, y+5);
      doc.setFont("helvetica","normal"); doc.setTextColor(...DARK); doc.setFontSize(10);
      doc.text(aiResult.lexical_retrieval||"—", ML+4, y+13);
      doc.setFontSize(7.5); doc.setFont("helvetica","bold"); doc.setTextColor(...NAVY);
      doc.text("AGRAMMATISM", ML+94, y+5);
      doc.setFont("helvetica","normal"); doc.setTextColor(...DARK); doc.setFontSize(10);
      const agrText = `${aiResult.agrammatism?.present?"Present":"Absent"}  ·  ${aiResult.agrammatism?.severity||"—"}`;
      doc.text(agrText, ML+94, y+13);
      y += 22;
      if (aiResult.agrammatism?.features?.length) {
        paraText(`Features: ${aiResult.agrammatism.features.join("  ·  ")}`, 2, 9, SLATE);
      }
      if (aiResult.auditory_comprehension_profile) {
        paraText(`AVC Pattern: ${aiResult.auditory_comprehension_profile}`, 2, 9, SLATE);
      }
      y += 2;

      if (aiResult.paraphasias?.length) {
        subSection("Paraphasia Inventory");
        aiResult.paraphasias.forEach(p=>{
          guard(8);
          doc.setFillColor(255,245,245); doc.roundedRect(ML+2, y-3.5, PW-4, 7, 1, 1, "F");
          doc.setFontSize(8.5); doc.setFont("helvetica","bold"); doc.setTextColor(...RED);
          doc.text(`[${p.type}]`, ML+5, y);
          doc.setFont("helvetica","normal"); doc.setTextColor(...DARK);
          doc.text(`${p.example}`, ML+25, y);
          doc.setTextColor(...DGREY);
          const noteLines = doc.splitTextToSize(p.note||"", PW-70);
          doc.text(noteLines, ML+80, y);
          y += 7;
        });
        y += 2;
      }

      if (getDisplayNote("bilingual_notes")) {
        subSection("Bilingual & Code-Switching Observations");
        paraText(getDisplayNote("bilingual_notes"), 2);
        y += 2;
      }

      if (aiResult.intervention_priorities?.length) {
        subSection("Evidence-Based Intervention Priorities");
        aiResult.intervention_priorities.forEach((item,idx)=>{
          guard(18);
          const icolors=[[0,128,128],[59,130,246],[139,92,246]];
          const ic=icolors[idx]||NAVY;
          doc.setFillColor(...ic.map(v=>Math.min(255,v+205)));
          doc.setDrawColor(...ic); doc.setLineWidth(0.3);
          doc.roundedRect(ML+2, y, PW-4, 14, 2, 2, "FD");
          doc.setFillColor(...ic); doc.ellipse(ML+8, y+7, 4, 4, "F");
          doc.setFontSize(9); doc.setFont("helvetica","bold"); doc.setTextColor(...WHITE);
          doc.text(String(item.priority), ML+8, y+8.2, {align:"center"});
          doc.setFontSize(8.5); doc.setFont("helvetica","bold"); doc.setTextColor(...ic);
          doc.text(item.domain, ML+15, y+5);
          doc.setFont("helvetica","normal"); doc.setTextColor(...DARK);
          const stratLines = doc.splitTextToSize(item.strategy||"", PW-25);
          doc.text(stratLines, ML+15, y+10);
          y += 16;
          if (item.rationale) { paraText(`Rationale: ${item.rationale}`, 6, 8.5, DGREY); }
          y += 2;
        });
      }

      if (getDisplayNote("home_programme")) {
        subSection("Home Programme for Family / Caregivers");
        guard(16);
        doc.setFillColor(240,255,245); doc.setDrawColor(...GREEN); doc.setLineWidth(0.3);
        const hpLines = doc.splitTextToSize(getDisplayNote("home_programme"), PW-8);
        doc.roundedRect(ML, y, PW, hpLines.length*5+8, 2, 2, "FD");
        doc.setFontSize(9.5); doc.setFont("helvetica","normal"); doc.setTextColor(...DARK);
        hpLines.forEach((l,i)=>doc.text(l, ML+4, y+6+i*5));
        y += hpLines.length*5+12;
      }

      if (getDisplayNote("prognosis")) {
        subSection("Prognosis");
        paraText(getDisplayNote("prognosis"), 2);
        y += 2;
      }
    }

    // ── SIGNATURE BLOCK ──
    guard(35);
    hrule(NAVY, 0.4);
    y += 2;
    doc.setFontSize(8.5); doc.setFont("helvetica","bold"); doc.setTextColor(...NAVY);
    doc.text("ASSESSED BY", ML, y);
    doc.text("SIGNATURE", ML+95, y);
    y += 5;
    doc.setFont("helvetica","normal"); doc.setTextColor(...DARK);
    doc.text(ch.clinician||"________________________________", ML, y);
    doc.text("________________________________", ML+95, y);
    y += 5;
    if (ch.supervisor) {
      doc.setTextColor(...DGREY); doc.setFontSize(8);
      doc.text(`Supervisor: ${ch.supervisor}`, ML, y);
      y += 5;
    }
    if (ch.clinicAddress) {
      doc.setTextColor(...DGREY); doc.setFontSize(8);
      const addrLines = doc.splitTextToSize(ch.clinicAddress, 140);
      doc.text(addrLines, ML, y);
      y += addrLines.length * 4.5 + 2;
    }
    y += 4;
    doc.setFontSize(7.5); doc.setTextColor(...DGREY); doc.setFont("helvetica","italic");
    doc.text("This report is generated using AphasiaLens v2.0, a bilingual clinical tool based on the Western Aphasia Battery (Kertesz, 1982).", ML, y);
    doc.text("AI clinical analysis is provided by Anthropic Claude and is intended as a decision-support aid only. Clinical judgement of a qualified SLP takes precedence.", ML, y+4.5);

    // ── PAGE FOOTER (all pages) ──
    const pageCount = doc.getNumberOfPages();
    for (let i=1; i<=pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(...NAVY); doc.rect(0, 288, 210, 9, "F");
      doc.setFillColor(...TEAL); doc.rect(0, 297, 210, 0.8, "F");
      doc.setFontSize(7); doc.setFont("helvetica","normal"); doc.setTextColor(180,200,220);
      doc.text("AphasiaLens v2.0  ·  Western Aphasia Battery Clinical Report  ·  For qualified SLP use only", ML, 293.5);
      doc.setTextColor(100,160,200);
      doc.text(`Page ${i} of ${pageCount}`, MR, 293.5, {align:"right"});
    }

    const name = ch.name ? ch.name.replace(/\s+/g,"_") : "Patient";
    doc.save(`WAB_Report_${name}_${new Date().toISOString().slice(0,10)}.pdf`);
  }

  // ── Sarvam STT State ──
  const [sarvamKey, setSarvamKey] = useState("");
  const [sarvamLang, setSarvamLang] = useState("kn-IN");
  const [sarvamTranscript, setSarvamTranscript] = useState("");
  const [sarvamStatus, setSarvamStatus] = useState("idle"); // idle | recording | processing | done | error
  const [sarvamError, setSarvamError] = useState("");
  const [lingoResult, setLingoResult] = useState(null);
  const [lingoLoading, setLingoLoading] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);
  const fileInputRef = useRef(null);

  const preResult = classifyAphasia(wabPre);
  const postResult = classifyAphasia(wabPost);
  const curResult = session==="pre" ? preResult : postResult;
  const typeCol = TYPE_COLOR[curResult.type]||C.teal;

  async function runAnalysis() {
    setAiLoading(true); setAiError(null); setAiResult(null);
    const preR = classifyAphasia(wabPre), postR = classifyAphasia(wabPost);
    const hasPost = wabPost.ss_info+wabPost.ss_flu+wabPost.avc_yesno > 0;
    const prompt = `Patient: ${ch.name||"Unknown"}, Age: ${ch.age||"?"}, Sex: ${ch.sex}, Languages: ${ch.languagesSpoken}, Time post onset: ${ch.timePostOnset||"?"}, Lesion site: ${ch.lesionSite||"?"}
Dominant hand: ${ch.dominantHand}, Education: ${ch.education}, Pre-stroke occupation: ${ch.occupationPreStroke}
Stroke history: ${ch.strokeHistory||"Not provided"}
WAB Language of administration: ${lang==="en"?"English":"Kannada-English bilingual"}

PRE-INTERVENTION WAB SCORES:
  Spontaneous Speech: ${preR.ss}/20 (Info: ${wabPre.ss_info}/10, Fluency: ${wabPre.ss_flu}/10)
  AVC: ${preR.avc}/200 (Yes/No: ${wabPre.avc_yesno}/60, Word Rec: ${wabPre.avc_wordrec}/60, Commands: ${wabPre.avc_seqcmd}/80)
  Repetition: ${preR.rep}/100
  Naming: ${preR.nam}/100 (Objects: ${wabPre.nam_obj}/60, Fluency: ${wabPre.nam_flu}/20, Sentence completion: ${wabPre.nam_sc}/10, Responsive: ${wabPre.nam_rs}/10)
  APHASIA QUOTIENT (Pre): ${preR.aq}/100 — ${preR.type} Aphasia, ${preR.sev}

${hasPost?`POST-INTERVENTION WAB SCORES:
  Spontaneous Speech: ${postR.ss}/20
  AVC: ${postR.avc}/200
  Repetition: ${postR.rep}/100
  Naming: ${postR.nam}/100
  APHASIA QUOTIENT (Post): ${postR.aq}/100 — ${postR.type} Aphasia, ${postR.sev}`:"Post-intervention scores not yet available."}

Behaviour observations: Depression: ${beh.depression[1]}, Motivation: ${beh.motivation[1]}, Attention: ${beh.attention[1]}
Additional clinical notes: ${specFn.additionalNotes||"None"}
${specFn.transcript?`Speech sample transcript:\n${specFn.transcript}`:""}`;

    try {
      const res = await fetch("/.netlify/functions/claude-proxy",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2500,system:SYS,messages:[{role:"user",content:prompt}]})
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text||"";
      // Robust JSON extraction — find outermost { } block
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      setAiResult(JSON.parse(jsonMatch[0]));
      setPage("analysis");
      setTimeout(()=>aiRef.current?.scrollIntoView({behavior:"smooth"}),100);
    } catch(e) { setAiError("Analysis failed: "+e.message); }
    setAiLoading(false);
  }

  // ── Sarvam Recording Functions ──
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start(200);
      mediaRecRef.current = mr;
      setSarvamStatus("recording");
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } catch(e) { setSarvamError("Microphone access denied: " + e.message); setSarvamStatus("error"); }
  }

  function stopRecording() {
    if (mediaRecRef.current && mediaRecRef.current.state !== "inactive") {
      mediaRecRef.current.stop();
    }
    clearInterval(timerRef.current);
    setSarvamStatus("idle");
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAudioBlob(file);
    setAudioURL(URL.createObjectURL(file));
    setSarvamStatus("idle");
    setSarvamTranscript("");
    setLingoResult(null);
  }

  async function transcribeWithSarvam() {
    if (!audioBlob) { setSarvamError("No audio to transcribe."); return; }
    if (!sarvamKey.trim()) { setSarvamError("Please enter your Sarvam AI API key."); return; }
    setSarvamStatus("processing"); setSarvamError(""); setSarvamTranscript("");
    try {
      const fd = new FormData();
      fd.append("file", audioBlob, "recording.webm");
      fd.append("language_code", sarvamLang);
      fd.append("model", "saaras:v2");
      fd.append("with_timestamps", "false");
      const res = await fetch("https://api.sarvam.ai/speech-to-text", {
        method: "POST",
        headers: { "api-subscription-key": sarvamKey.trim() },
        body: fd,
      });
      const data = await res.json();
      if (data.transcript) {
        setSarvamTranscript(data.transcript);
        setSarvamStatus("done");
      } else {
        throw new Error(data.message || JSON.stringify(data));
      }
    } catch(e) { setSarvamError("Transcription failed: " + e.message); setSarvamStatus("error"); }
  }

  const LINGO_SYS = `You are a bilingual (Kannada-English) Speech-Language Pathologist specialising in aphasia and acquired neurogenic communication disorders. Analyse the given speech transcript and return ONLY valid JSON:
{
  "mlu": "<Mean Length of Utterance estimate e.g. 2.3 morphemes>",
  "ttr": "<Type-Token Ratio estimate e.g. 0.62>",
  "utterance_count": <number>,
  "semantic_analysis": {
    "summary": "<overall semantic coherence assessment>",
    "semantic_paraphasias": [{"target":"<>","produced":"<>","category":"<coordinate|associate|unrelated>"}],
    "empty_speech": <true|false>,
    "circumlocution_instances": ["<example if present>"],
    "jargon": <true|false>,
    "neologisms": [{"produced":"<>","probable_target":"<>"}]
  },
  "syntactic_analysis": {
    "summary": "<overall syntactic assessment>",
    "dominant_structure": "<e.g. Single-word utterances | Simple SVO | Telegraphic | Agrammatic>",
    "sentence_types_used": ["<e.g. Simple declarative, Incomplete, Fragment>"],
    "agrammatism": {"present": true, "features": ["<e.g. Omission of auxiliary verbs>"]},
    "paragrammatism": {"present": false, "features": []}
  },
  "morphosyntactic_analysis": {
    "summary": "<>",
    "verb_morphology": "<e.g. Verb inflections omitted | Present tense only | Mixed>",
    "noun_morphology": "<e.g. Plurals omitted | Case markers absent (Kannada)>",
    "function_words": "<e.g. Prepositions omitted | Articles missing>",
    "kannada_specific": "<Kannada case/verb suffix errors if Kannada present, else null>",
    "code_switching_pattern": "<description of language switching if bilingual, else null>"
  },
  "phonological_analysis": {
    "summary": "<>",
    "phonemic_paraphasias": [{"target":"<>","produced":"<>","error_type":"<substitution|omission|addition|transposition>"}],
    "sound_system_errors": ["<patterns observed>"],
    "consistency": "<Consistent | Variable | Not assessable>"
  },
  "prosody_fluency": {
    "fluency_rating": "<Fluent|Non-fluent|Mixed>",
    "dysfluencies": ["<types e.g. Revisions, Interjections, Prolongations>"],
    "prosodic_features": "<e.g. Monotone, Dysrhythmic, Relatively preserved>"
  },
  "functional_communication_from_transcript": {
    "communicative_effectiveness": "<1-5 scale with label>",
    "preserved_abilities": ["<what is working>"],
    "main_barriers": ["<what is impeding communication>"]
  },
  "clinical_impression": "<3-4 sentence overall clinical impression integrating all levels>",
  "targeted_recommendations": ["<specific recommendation 1>","<specific recommendation 2>","<specific recommendation 3>"]
}`;

  async function runLinguisticAnalysis() {
    if (!sarvamTranscript.trim()) { setSarvamError("Transcribe audio first before running analysis."); return; }
    setLingoLoading(true); setSarvamError("");
    try {
      const res = await fetch("/.netlify/functions/claude-proxy", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:2500,
          system: LINGO_SYS,
          messages:[{ role:"user", content:
            `Patient: ${ch.name||"Unknown"}, Age: ${ch.age||"?"}, Languages: ${ch.languagesSpoken||"Kannada, English"}, Aphasia type (WAB): ${curResult.type}
Transcript language selected for STT: ${sarvamLang}

TRANSCRIPT:
"""
${sarvamTranscript}
"""
Perform complete multi-level linguistic analysis.`
          }]
        })
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "";
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      setLingoResult(JSON.parse(jsonMatch[0]));
    } catch(e) { setSarvamError("Linguistic analysis failed: " + e.message); }
    setLingoLoading(false);
  }

  function fmtTime(s) { return `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`; }

  const pages = [
    {id:"casehistory",label:"① Case History"},
    {id:"behaviour",label:"② Behaviour"},
    {id:"specfn",label:"③ Specific Functions"},
    {id:"wab",label:"④ WAB"},
    {id:"results",label:"⑤ AQ & Results"},
    {id:"analysis",label:"⑥ AI Analysis"},
    {id:"sarvam",label:"⑦ Speech Transcript Analysis"},
  ];

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,...fnt,paddingBottom:60}}>
      {/* Header */}
      <div style={{background:"#ffffff",borderBottom:`1px solid ${C.border}`,padding:"18px 32px 0",boxShadow:"0 1px 0 #e2e8f0, 0 2px 12px rgba(15,23,42,0.06)",borderTop:`4px solid ${C.teal}`}}>
        <div style={{maxWidth:980,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14,paddingBottom:14,borderBottom:`1px solid #f0f4f8`}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:44,height:44,borderRadius:12,background:`linear-gradient(135deg,${C.teal} 0%,#0ea5e9 100%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:`0 4px 14px rgba(3,105,161,0.35)`}}>⬡</div>
              <div>
                <h1 style={{margin:0,fontSize:24,fontWeight:900,color:C.text,letterSpacing:"-0.03em",...fnt}}>Aphasia<span style={{color:C.teal}}>Lens</span></h1>
                <div style={{fontSize:11,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginTop:2,fontWeight:500,...fnt}}>Bilingual Clinical Assessment · Kannada–English</div>
              </div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              {/* Language Toggle */}
              <div style={{display:"flex",border:`1.5px solid ${C.border}`,borderRadius:8,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
                {[["en","English"],["kn","ಕನ್ನಡ"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setLang(v)} style={{padding:"7px 16px",border:"none",background:lang===v?C.teal:"transparent",color:lang===v?"#ffffff":C.muted,fontSize:12,fontWeight:600,cursor:"pointer",...fnt,transition:"all 0.15s"}}>{l}</button>
                ))}
              </div>
              {/* Session Toggle */}
              <div style={{display:"flex",border:`1.5px solid ${C.border}`,borderRadius:8,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
                {[["pre","Pre-Rx"],["post","Post-Rx"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setSession(v)} style={{padding:"7px 16px",border:"none",background:session===v?(v==="pre"?C.teal:C.green):"transparent",color:session===v?"#ffffff":C.muted,fontSize:12,fontWeight:600,cursor:"pointer",...fnt,transition:"all 0.15s"}}>{l}</button>
                ))}
              </div>
            </div>
          </div>
          {/* Nav */}
          <div style={{display:"flex",gap:6,paddingTop:12,paddingBottom:0,overflowX:"auto"}}>
            {pages.map(p=><NavBtn key={p.id} label={p.label} active={page===p.id} onClick={()=>setPage(p.id)}/>)}
          </div>
        </div>
      </div>

      <div style={{maxWidth:980,margin:"0 auto",padding:"28px 32px 0"}}>

        {/* ── PAGE 1: Case History ── */}
        {page==="casehistory" && (
          <div>
            <Card title="Patient Details" icon="👤" accent={C.teal}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                <FInput label="Patient Name" value={ch.name} onChange={v=>setCh(p=>({...p,name:v}))} placeholder="Full name"/>
                <FInput label="Case No." value={ch.caseNo} onChange={v=>setCh(p=>({...p,caseNo:v}))} placeholder="Case ID"/>
                <FInput label="Age" value={ch.age} onChange={v=>setCh(p=>({...p,age:v}))} placeholder="e.g. 58 years"/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                <FSelect label="Sex" value={ch.sex} onChange={v=>setCh(p=>({...p,sex:v}))} options={["Male","Female","Other"]}/>
                <FInput label="Clinician" value={ch.clinician} onChange={v=>setCh(p=>({...p,clinician:v}))} placeholder="Clinician name"/>
                <FInput label="Supervisor" value={ch.supervisor} onChange={v=>setCh(p=>({...p,supervisor:v}))} placeholder="Supervisor name"/>
                <FInput label="Clinic / Hospital Address" value={ch.clinicAddress} onChange={v=>setCh(p=>({...p,clinicAddress:v}))} placeholder="e.g. Dept. of SLP, XYZ Hospital, City" full/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                <FSelect label="Dominant Hand" value={ch.dominantHand} onChange={v=>setCh(p=>({...p,dominantHand:v}))} options={["Right","Left","Ambidextrous"]}/>
                <FInput label="Education" value={ch.education} onChange={v=>setCh(p=>({...p,education:v}))} placeholder="e.g. SSLC, Graduate"/>
                <FInput label="Pre-stroke Occupation" value={ch.occupationPreStroke} onChange={v=>setCh(p=>({...p,occupationPreStroke:v}))} placeholder="Occupation"/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
                <FInput label="Languages Spoken" value={ch.languagesSpoken} onChange={v=>setCh(p=>({...p,languagesSpoken:v}))} placeholder="e.g. Kannada, English, Hindi"/>
                <FInput label="Time Post Onset" value={ch.timePostOnset} onChange={v=>setCh(p=>({...p,timePostOnset:v}))} placeholder="e.g. 3 months"/>
              </div>
              <FInput label="Lesion Site / Neuroimaging" value={ch.lesionSite} onChange={v=>setCh(p=>({...p,lesionSite:v}))} placeholder="e.g. Left MCA territory infarct"/>
            </Card>

            <Card title="History of Stroke" icon="🧠" accent={C.red}>
              <FTextarea label="Stroke History (onset, type, hospital, treatment)" value={ch.strokeHistory} onChange={v=>setCh(p=>({...p,strokeHistory:v}))} rows={4} placeholder="Date of onset, type (ischaemic/haemorrhagic), hospital admission, initial presentation, treatment received..."/>
            </Card>

            <Card title="Medical Records" icon="📋" accent={C.purple}>
              <FTextarea label="Investigations, Reports, Rx & Advice" value={ch.medicalRecords} onChange={v=>setCh(p=>({...p,medicalRecords:v}))} rows={4} placeholder="CT/MRI findings, medications, physician advice, referrals..."/>
            </Card>

            <button onClick={()=>setPage("behaviour")} style={{width:"100%",padding:"14px",background:`linear-gradient(135deg,#0369a1,#0284c7)`,border:"none",borderRadius:10,color:"#ffffff",fontSize:14,fontWeight:700,cursor:"pointer",letterSpacing:"0.01em",boxShadow:"0 4px 16px rgba(3,105,161,0.35)",...fnt}}>
              Next: Behaviour & General Assessment →
            </button>
          </div>
        )}

        {/* ── PAGE 2: Behaviour ── */}
        {page==="behaviour" && (
          <div>
            <Card title="General Behaviour" icon="🧩" accent={C.accent}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:10,marginBottom:10,padding:"8px 0",borderBottom:`2px solid ${C.border}`}}>
                <span style={{fontSize:12,color:C.muted,...fnt,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase"}}>Behaviour</span>
                <span style={{fontSize:12,color:C.teal,...fnt,fontWeight:700,textAlign:"center",letterSpacing:"0.05em",textTransform:"uppercase"}}>Reported</span>
                <span style={{fontSize:12,color:C.green,...fnt,fontWeight:700,textAlign:"center",letterSpacing:"0.05em",textTransform:"uppercase"}}>Observed</span>
              </div>
              {[["aggressiveness","Aggressiveness"],["temperTantrums","Temper Tantrums"],["depression","Depression"],["motivation","Motivation"],["attention","Attention & Concentration"],["interest","Interest in Activities"],["needForComm","Need for Communication"]].map(([k,l])=>(
                <BehRow key={k} label={l}
                  rep={beh[k][0]} obs={beh[k][1]}
                  onRep={v=>setBeh(p=>({...p,[k]:[v,p[k][1]]}))}
                  onObs={v=>setBeh(p=>({...p,[k]:[p[k][0],v]}))}/>
              ))}
              <FInput label="Present Social Position" value={beh.socialPosition} onChange={v=>setBeh(p=>({...p,socialPosition:v}))} placeholder="e.g. Retired, supported by family"/>
            </Card>

            <Card title="Earlier vs Present Behaviour" icon="🔄" accent={C.purple}>
              <FTextarea label="Earlier Behaviour Pattern — Reported" value={beh.earlyBehaviourReported} onChange={v=>setBeh(p=>({...p,earlyBehaviourReported:v}))} rows={2}/>
              <FTextarea label="Earlier Behaviour Pattern — Observed" value={beh.earlyBehaviourObserved} onChange={v=>setBeh(p=>({...p,earlyBehaviourObserved:v}))} rows={2}/>
            </Card>

            <Card title="Family Response" icon="👨‍👩‍👧" accent={C.green}>
              <FTextarea label="Family Response — Reported" value={beh.familyResponseReported} onChange={v=>setBeh(p=>({...p,familyResponseReported:v}))} rows={2} placeholder="What family reports about their response to patient's communication difficulties"/>
              <FTextarea label="Family Response — Observed" value={beh.familyResponseObserved} onChange={v=>setBeh(p=>({...p,familyResponseObserved:v}))} rows={2} placeholder="Clinician's observation of family interaction during session"/>
            </Card>

            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setPage("casehistory")} style={{flex:1,padding:"11px",background:"#ffffff",border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,fontSize:12,fontWeight:700,cursor:"pointer",...fnt,boxShadow:"0 1px 2px rgba(0,0,0,0.05)"}}>← Back</button>
              <button onClick={()=>setPage("specfn")} style={{flex:3,padding:"13px",background:`linear-gradient(135deg,#0369a1,#0284c7)`,border:"none",borderRadius:9,color:"#ffffff",fontSize:14,fontWeight:700,cursor:"pointer",letterSpacing:"0.01em",boxShadow:"0 2px 12px rgba(3,105,161,0.3)",...fnt}}>Next: Specific Functions →</button>
            </div>
          </div>
        )}

        {/* ── PAGE 3: Specific Functions ── */}
        {page==="specfn" && (
          <div>
            <Card title="Auditory Comprehension" icon="👂" accent={C.teal}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <RadioGroup label="Hearing Loss Present?" options={["No","Yes","Suspected"]} value={specFn.hearingLoss} onChange={v=>setSpecFn(p=>({...p,hearingLoss:v}))}/>
                <RadioGroup label="Vocabulary Comprehension Reduced?" options={["No","Yes"]} value={specFn.vocabCompReduced} onChange={v=>setSpecFn(p=>({...p,vocabCompReduced:v}))}/>
                <RadioGroup label="Confuses Auditory Similar Words?" options={["No","Yes","Occasionally"]} value={specFn.confusesAuditoryWords} onChange={v=>setSpecFn(p=>({...p,confusesAuditoryWords:v}))}/>
                <FSelect label="Auditory Retention Span" value={specFn.audRetentionSpan} onChange={v=>setSpecFn(p=>({...p,audRetentionSpan:v}))} options={["Normal","Mildly reduced","Moderately reduced","Severely reduced"]}/>
              </div>
            </Card>

            <Card title="Reading / Visual Comprehension" icon="👁" accent={C.purple}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <FSelect label="Visual Acuity" value={specFn.visualAcuity} onChange={v=>setSpecFn(p=>({...p,visualAcuity:v}))} options={["Normal","Mildly impaired","Field defect","Severely impaired"]}/>
                <FInput label="Matching Ability (forms/letters/pictures/words)" value={specFn.matchingAbility} onChange={v=>setSpecFn(p=>({...p,matchingAbility:v}))} placeholder="e.g. Intact for objects, impaired for words"/>
              </div>
              <FInput label="Reading Vocabulary" value={specFn.readingVocab} onChange={v=>setSpecFn(p=>({...p,readingVocab:v}))} placeholder="e.g. Severely reduced, single word recognition only"/>
            </Card>

            <Card title="Speech Mechanism — Structure & Function" icon="🦷" accent={C.accent}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {[["lips","Lips"],["tongue","Tongue"],["hardPalate","Hard Palate"],["softPalate","Soft Palate"],["uvula","Uvula"],["facial","Facial Musculature"]].map(([k,l])=>(
                  <FSelect key={k} label={l} value={specFn[k]} onChange={v=>setSpecFn(p=>({...p,[k]:v}))} options={["Normal","Mildly impaired","Moderately impaired","Severely impaired","Absent"]}/>
                ))}
              </div>
              <div style={{fontSize:11,color:C.muted,marginTop:4,marginBottom:8,...fnt,textTransform:"uppercase",letterSpacing:"0.06em"}}>Vegetative Functions</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
                {[["mastication","Mastication"],["sucking","Sucking"],["swallowing","Swallowing"],["blowing","Blowing"]].map(([k,l])=>(
                  <FSelect key={k} label={l} value={specFn[k]} onChange={v=>setSpecFn(p=>({...p,[k]:v}))} options={["Normal","Mildly impaired","Moderately impaired","Severely impaired"]}/>
                ))}
              </div>
            </Card>

            <Card title="Articulation" icon="🗣" accent={C.blue}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
                {[["vowels","Vowels"],["consonants","Consonants"],["blends","Blends"],["diphthongs","Diphthongs"],["semiVowels","Semi-vowels"]].map(([k,l])=>(
                  <FSelect key={k} label={l} value={specFn[k]||"Normal"} onChange={v=>setSpecFn(p=>({...p,[k]:v}))} options={["Normal","Mildly impaired","Moderately impaired","Severely impaired"]}/>
                ))}
              </div>
            </Card>

            <Card title="Voice & Suprasegmentals" icon="🎙" accent={C.pink}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                <FSelect label="Pitch" value={specFn.pitch} onChange={v=>setSpecFn(p=>({...p,pitch:v}))} options={["Normal","High","Low","Monotone"]}/>
                <FSelect label="Loudness" value={specFn.loudness} onChange={v=>setSpecFn(p=>({...p,loudness:v}))} options={["Normal","Reduced","Excessive"]}/>
                <FSelect label="Voice Quality" value={specFn.voiceQuality} onChange={v=>setSpecFn(p=>({...p,voiceQuality:v}))} options={["Normal","Hoarse","Harsh","Breathy","Strained"]}/>
                <FInput label="Phonation Duration (/a/ /i/ /u/)" value={specFn.phonationDuration} onChange={v=>setSpecFn(p=>({...p,phonationDuration:v}))} placeholder="e.g. 8s, 6s, 5s"/>
                <FInput label="Breath Control" value={specFn.breathControl} onChange={v=>setSpecFn(p=>({...p,breathControl:v}))} placeholder="Adequate / Reduced"/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginTop:4}}>
                {[["intonation","Intonation"],["stress","Stress"],["phrasing","Phrasing"],["rateOfSpeech","Rate of Speech"]].map(([k,l])=>(
                  <FSelect key={k} label={l} value={specFn[k]||"Normal"} onChange={v=>setSpecFn(p=>({...p,[k]:v}))} options={["Normal","Mildly impaired","Moderately impaired","Severely impaired","Monotone","Dysrhythmic"]}/>
                ))}
              </div>
              <FInput label="Imitation Skills (gross body / speech)" value={specFn.imitationSkills} onChange={v=>setSpecFn(p=>({...p,imitationSkills:v}))} placeholder="e.g. Gross body intact, speech imitation impaired"/>
            </Card>

            <Card title="Expression & Writing" icon="✍️" accent={C.green}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <FTextarea label="Reactive Speech Present?" value={specFn.reactivesSpeech} onChange={v=>setSpecFn(p=>({...p,reactivesSpeech:v}))} rows={2} placeholder="e.g. Greetings intact, automatic yes/no preserved"/>
                <FTextarea label="Overlearned / Serial Responses" value={specFn.overlearnedSerial} onChange={v=>setSpecFn(p=>({...p,overlearnedSerial:v}))} rows={2} placeholder="e.g. Can count 1–10, recite days of week"/>
                <FSelect label="Writing Hand" value={specFn.writingHand} onChange={v=>setSpecFn(p=>({...p,writingHand:v}))} options={["Right","Left","Non-preferred (due to hemiplegia)"]}/>
                <FInput label="Copy Forms / Letters" value={specFn.copyForms} onChange={v=>setSpecFn(p=>({...p,copyForms:v}))} placeholder="e.g. Can copy simple forms, not letters"/>
                <FInput label="Writing Vocabulary" value={specFn.writingVocab} onChange={v=>setSpecFn(p=>({...p,writingVocab:v}))} placeholder="e.g. Can write own name only"/>
                <FInput label="Arithmetic (simple +/−/×/÷)" value={specFn.arithmeticSimple} onChange={v=>setSpecFn(p=>({...p,arithmeticSimple:v}))} placeholder="e.g. Addition intact, others impaired"/>
              </div>
            </Card>

            <Card title="Speech Transcript (Optional but Recommended)" icon="📝" accent={C.teal}>
              <FTextarea label="Paste naturalistic speech sample for AI analysis" value={specFn.transcript} onChange={v=>setSpecFn(p=>({...p,transcript:v}))} rows={5} placeholder="Paste any transcribed speech sample here — conversational, picture description, or narrative. Include speaker labels if available. AI will integrate this with WAB scores."/>
              <FTextarea label="Additional Clinical Notes" value={specFn.additionalNotes} onChange={v=>setSpecFn(p=>({...p,additionalNotes:v}))} rows={3} placeholder="Any other observations, test results, or clinical impressions..."/>
            </Card>

            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setPage("behaviour")} style={{flex:1,padding:"11px",background:"#ffffff",border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,fontSize:12,fontWeight:700,cursor:"pointer",...fnt,boxShadow:"0 1px 2px rgba(0,0,0,0.05)"}}>← Back</button>
              <button onClick={()=>setPage("wab")} style={{flex:3,padding:"13px",background:`linear-gradient(135deg,#0369a1,#0284c7)`,border:"none",borderRadius:9,color:"#ffffff",fontSize:14,fontWeight:700,cursor:"pointer",letterSpacing:"0.01em",boxShadow:"0 2px 12px rgba(3,105,161,0.3)",...fnt}}>Next: WAB Administration ({lang==="en"?"English":"Kannada"}) →</button>
            </div>
          </div>
        )}

        {/* ── PAGE 4: WAB ── */}
        {page==="wab" && (
          <div>
            <div style={{background:"#ffffff",border:`1px solid ${C.border}`,borderLeft:`4px solid ${C.teal}`,borderRadius:10,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:12,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
              <div style={{fontSize:14,color:C.text,fontWeight:600,...fnt}}>
                Administering WAB in: <span style={{color:C.teal,fontWeight:700}}>{lang==="en"?"English":"Kannada–English Bilingual"}</span>
              </div>
              <div style={{fontSize:12,color:C.muted,...fnt}}>Session: <span style={{color:session==="pre"?C.teal:C.green,fontWeight:700}}>{session==="pre"?"Pre-Intervention":"Post-Intervention"}</span></div>
            </div>

            {/* I. Spontaneous Speech */}
            <Card title="I. Spontaneous Speech (Max: 20)" icon="💬" accent={C.teal}>
              <div style={{background:"#f8fafc",borderRadius:8,padding:12,marginBottom:14,maxHeight:220,overflowY:"auto",border:`1px solid ${C.border}`}}>
                {WAB[lang].spontaneous.map((q,i)=>(
                  <div key={i} style={{padding:"7px 0",borderBottom:i<WAB[lang].spontaneous.length-1?`1px solid ${C.border}33`:"none"}}>
                    <div style={{fontSize:12,color:C.text,...fnt}}><b>{i+1}.</b> {q}</div>
                    <div style={{fontSize:11,color:C.muted,...fnt,fontStyle:"italic",marginTop:2}}>Response: ___________________________</div>
                  </div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <SliderScore label="Information Content" value={wab.ss_info} max={10} onChange={v=>updateWab("ss_info",v)}/>
                <SliderScore label="Fluency / Phrase Length / Melodic Line" value={wab.ss_flu} max={10} onChange={v=>updateWab("ss_flu",v)}/>
              </div>
              <div style={{fontSize:14,color:C.accent,fontWeight:700,...fnt,marginTop:8,padding:"6px 0"}}>SS Total: {wab.ss_info+wab.ss_flu} / 20</div>
            </Card>

            {/* II. AVC */}
            <Card title="II. Auditory Verbal Comprehension (Max: 200)" icon="👂" accent={C.purple}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
                <div>
                  <div style={{fontSize:12,color:C.purple,fontWeight:700,...fnt,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>A. Yes/No Questions (Max 60)</div>
                  <div style={{background:"#f8fafc",borderRadius:7,border:`1px solid ${C.border}`,padding:10,maxHeight:180,overflowY:"auto",marginBottom:8}}>
                    {WAB[lang].yesno.map((q,i)=><div key={i} style={{fontSize:12.5,color:C.muted,padding:"4px 0",borderBottom:`1px solid #f0f4f8`,...fnt}}>{i+1}. {q}</div>)}
                  </div>
                  <SliderScore label="Score" value={wab.avc_yesno} max={60} onChange={v=>updateWab("avc_yesno",v)}/>
                </div>
                <div>
                  <div style={{fontSize:12,color:C.purple,fontWeight:700,...fnt,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>B. Word Recognition (Max 60)</div>
                  <div style={{background:"#f8fafc",borderRadius:7,border:`1px solid ${C.border}`,padding:10,marginBottom:8,fontSize:11,color:C.muted,...fnt,lineHeight:1.9}}>
                    Real objects · Drawn objects · Forms · Letters · Numbers · Colors · Furniture · Body parts · Fingers · Right-Left
                    <div style={{marginTop:6,color:C.text,fontStyle:"italic"}}>Score 1 pt per correct identification</div>
                  </div>
                  <SliderScore label="Score" value={wab.avc_wordrec} max={60} onChange={v=>updateWab("avc_wordrec",v)}/>
                </div>
                <div>
                  <div style={{fontSize:12,color:C.purple,fontWeight:700,...fnt,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>C. Sequential Commands (Max 80)</div>
                  <div style={{background:"#f8fafc",borderRadius:7,border:`1px solid ${C.border}`,padding:10,maxHeight:180,overflowY:"auto",marginBottom:8}}>
                    {WAB[lang].commands.map((c,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${C.border}22`}}>
                        <span style={{fontSize:11,color:C.muted,...fnt,flex:1}}>{i+1}. {c.c}</span>
                        <span style={{fontSize:11,color:C.purple,fontWeight:700,...fnt,marginLeft:8}}>{c.m}</span>
                      </div>
                    ))}
                  </div>
                  <SliderScore label="Score" value={wab.avc_seqcmd} max={80} onChange={v=>updateWab("avc_seqcmd",v)}/>
                </div>
              </div>
              <div style={{fontSize:14,color:C.accent,fontWeight:700,...fnt,marginTop:8,padding:"6px 0"}}>AVC Total: {wab.avc_yesno+wab.avc_wordrec+wab.avc_seqcmd} / 200</div>
            </Card>

            {/* III. Repetition */}
            <Card title="III. Repetition (Max: 100)" icon="🔁" accent={C.blue}>
              <div style={{background:"#f8fafc",border:`1px solid ${C.border}`,borderRadius:8,padding:12,marginBottom:14}}>
                {WAB[lang].repetition.map((item,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:i<WAB[lang].repetition.length-1?`1px solid ${C.border}33`:"none"}}>
                    <span style={{fontSize:12,color:C.text,...fnt}}>{i+1}. {item.t}</span>
                    <span style={{fontSize:11,color:C.blue,...fnt,fontWeight:700}}>Max: {item.m}</span>
                  </div>
                ))}
              </div>
              <SliderScore label="Repetition Total Score" value={wab.rep} max={100} onChange={v=>updateWab("rep",v)}/>
            </Card>

            {/* IV. Naming */}
            <Card title="IV. Naming (Max: 100)" icon="🏷" accent={C.accent}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div>
                  <div style={{fontSize:12,color:C.accent,fontWeight:700,...fnt,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>A. Object Naming (Max 60)</div>
                  <div style={{background:"#f8fafc",borderRadius:7,border:`1px solid ${C.border}`,padding:10,maxHeight:160,overflowY:"auto",marginBottom:8}}>
                    {WAB[lang].naming_obj.map((o,i)=><div key={i} style={{fontSize:12.5,color:C.muted,padding:"4px 0",borderBottom:`1px solid #f0f4f8`,...fnt}}>{i+1}. {o}</div>)}
                  </div>
                  <SliderScore label="Object Naming" value={wab.nam_obj} max={60} onChange={v=>updateWab("nam_obj",v)}/>
                </div>
                <div>
                  <div style={{fontSize:12,color:C.accent,fontWeight:700,...fnt,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>B. Word Fluency (Max 20)</div>
                  <div style={{background:"#f8fafc",borderRadius:7,border:`1px solid ${C.border}`,padding:10,marginBottom:8,fontSize:11,color:C.muted,...fnt}}>Name as many animals as possible in 1 minute. 1 pt per unique animal (max 20)</div>
                  <SliderScore label="Word Fluency" value={wab.nam_flu} max={20} onChange={v=>updateWab("nam_flu",v)}/>
                  <div style={{fontSize:12,color:C.accent,fontWeight:700,...fnt,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6,marginTop:10}}>C. Sentence Completion (Max 10)</div>
                  {WAB[lang].sentence_completion.map((s,i)=><div key={i} style={{fontSize:11,color:C.muted,...fnt,padding:"2px 0"}}>{i+1}. {s}</div>)}
                  <SliderScore label="Sentence Completion" value={wab.nam_sc} max={10} onChange={v=>updateWab("nam_sc",v)}/>
                  <div style={{fontSize:12,color:C.accent,fontWeight:700,...fnt,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6,marginTop:10}}>D. Responsive Speech (Max 10)</div>
                  {WAB[lang].responsive.map((s,i)=><div key={i} style={{fontSize:11,color:C.muted,...fnt,padding:"2px 0"}}>{i+1}. {s}</div>)}
                  <SliderScore label="Responsive Speech" value={wab.nam_rs} max={10} onChange={v=>updateWab("nam_rs",v)}/>
                </div>
              </div>
              <div style={{fontSize:14,color:C.accent,fontWeight:700,...fnt,marginTop:8,padding:"6px 0"}}>Naming Total: {wab.nam_obj+wab.nam_flu+wab.nam_sc+wab.nam_rs} / 100</div>
            </Card>

            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setPage("specfn")} style={{flex:1,padding:"11px",background:"#ffffff",border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,fontSize:12,fontWeight:700,cursor:"pointer",...fnt,boxShadow:"0 1px 2px rgba(0,0,0,0.05)"}}>← Back</button>
              <button onClick={()=>setPage("results")} style={{flex:3,padding:"13px",background:`linear-gradient(135deg,#0369a1,#0284c7)`,border:"none",borderRadius:9,color:"#ffffff",fontSize:14,fontWeight:700,cursor:"pointer",letterSpacing:"0.01em",boxShadow:"0 2px 12px rgba(3,105,161,0.3)",...fnt}}>Calculate AQ & Results →</button>
            </div>
          </div>
        )}

        {/* ── PAGE 5: Results ── */}
        {page==="results" && (
          <div>
            {/* AQ Banner */}
            <div style={{background:"#ffffff",border:`1px solid ${C.border}`,borderLeft:`5px solid ${typeCol}`,borderRadius:14,padding:"20px 24px",marginBottom:18,display:"flex",alignItems:"center",gap:24,flexWrap:"wrap",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <AQGauge aq={curResult.aq}/>
              <div style={{flex:1,minWidth:200}}>
                <div style={{fontSize:11,color:C.muted,...fnt,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,fontWeight:600}}>
                  {session==="pre"?"Pre-Intervention":"Post-Intervention"} Classification
                </div>
                <div style={{fontSize:28,fontWeight:800,color:typeCol,letterSpacing:"-0.02em",...fnt,lineHeight:1.1}}>{curResult.type} Aphasia</div>
                <div style={{fontSize:14,color:C.muted,marginTop:6,...fnt}}>Severity: <span style={{color:curResult.aq>=75?C.green:curResult.aq>=50?C.accent:C.red,fontWeight:700}}>{curResult.sev}</span></div>
                <div style={{display:"flex",gap:10,marginTop:10,flexWrap:"wrap"}}>
                  {[["Fluency",curResult.fl?"Fluent":"Non-Fluent",curResult.fl?C.green:C.red],["Comprehension",curResult.gc?"Good":"Poor",curResult.gc?C.green:C.red],["Repetition",curResult.gr?"Intact":"Impaired",curResult.gr?C.green:C.red],["Naming",curResult.gn?"Intact":"Impaired",curResult.gn?C.green:C.red]].map(([l,v,c])=>(
                    <div key={l} style={{background:`${c}18`,border:`1px solid ${c}44`,borderRadius:6,padding:"4px 10px",fontSize:11,...fnt}}>
                      <span style={{color:C.muted}}>{l}: </span><span style={{color:c,fontWeight:700}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subtest breakdown */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
              <Card title="Subtest Scores" icon="📊" accent={C.teal}>
                <Row label="Spontaneous Speech" value={`${curResult.ss}/20`} color={curResult.ss/20>=0.7?C.green:curResult.ss/20>=0.4?C.accent:C.red}/>
                <Row label="↳ Information Content" value={`${wab.ss_info}/10`}/>
                <Row label="↳ Fluency/Phrase Length" value={`${wab.ss_flu}/10`}/>
                <Row label="Auditory Verbal Comprehension" value={`${curResult.avc}/200`} color={curResult.avc/200>=0.7?C.green:curResult.avc/200>=0.4?C.accent:C.red}/>
                <Row label="↳ Yes/No Questions" value={`${wab.avc_yesno}/60`}/>
                <Row label="↳ Word Recognition" value={`${wab.avc_wordrec}/60`}/>
                <Row label="↳ Sequential Commands" value={`${wab.avc_seqcmd}/80`}/>
                <Row label="Repetition" value={`${curResult.rep}/100`} color={curResult.rep/100>=0.7?C.green:curResult.rep/100>=0.4?C.accent:C.red}/>
                <Row label="Naming" value={`${curResult.nam}/100`} color={curResult.nam/100>=0.7?C.green:curResult.nam/100>=0.4?C.accent:C.red}/>
                <Row label="↳ Object Naming" value={`${wab.nam_obj}/60`}/>
                <Row label="↳ Word Fluency" value={`${wab.nam_flu}/20`}/>
                <Row label="↳ Sentence Completion" value={`${wab.nam_sc}/10`}/>
                <Row label="↳ Responsive Speech" value={`${wab.nam_rs}/10`}/>
              </Card>

              <div>
                {/* Pre vs Post if both filled */}
                {wabPost.ss_info+wabPost.ss_flu+wabPost.avc_yesno > 0 && (
                  <Card title="Pre vs Post Comparison" icon="📈" accent={C.green}>
                    {[["AQ",preResult.aq,postResult.aq,100],["SS",preResult.ss,postResult.ss,20],["AVC",preResult.avc,postResult.avc,200],["Repetition",preResult.rep,postResult.rep,100],["Naming",preResult.nam,postResult.nam,100]].map(([l,pre,post,max])=>{
                      const diff = post-pre, pct = max>0?Math.round(diff/max*100):0;
                      return (
                        <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${C.border}33`}}>
                          <span style={{fontSize:12,color:C.muted,...fnt}}>{l}</span>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontSize:11,color:C.muted,...fnt}}>{pre}/{max}</span>
                            <span style={{color:C.border}}>→</span>
                            <span style={{fontSize:11,color:C.text,...fnt,fontWeight:700}}>{post}/{max}</span>
                            <span style={{fontSize:11,fontWeight:700,...fnt,color:diff>0?C.green:diff<0?C.red:C.muted}}>{diff>0?"+":""}{diff} ({pct>0?"+":""}{pct}%)</span>
                          </div>
                        </div>
                      );
                    })}
                    <div style={{marginTop:8,fontSize:12,color:C.muted,...fnt,fontStyle:"italic"}}>
                      Classification change: <span style={{color:C.blue}}>{preResult.type}</span> → <span style={{color:TYPE_COLOR[postResult.type]||C.teal}}>{postResult.type}</span>
                    </div>
                  </Card>
                )}

                <Card title="Patient Summary" icon="👤" accent={C.purple}>
                  <Row label="Name" value={ch.name||"—"}/>
                  <Row label="Age / Sex" value={`${ch.age||"—"} / ${ch.sex}`}/>
                  <Row label="Languages" value={ch.languagesSpoken||"—"}/>
                  <Row label="Time Post Onset" value={ch.timePostOnset||"—"}/>
                  <Row label="Lesion Site" value={ch.lesionSite||"—"}/>
                  <Row label="WAB Language" value={lang==="en"?"English":"Kannada-English"}/>
                </Card>
              </div>
            </div>

            {/* Download WAB PDF — works without AI */}
            <button onClick={downloadPDF} style={{
              width:"100%",padding:"14px",border:"none",borderRadius:10,color:"#ffffff",fontSize:14,fontWeight:700,cursor:"pointer",...fnt,
              background:`linear-gradient(135deg,#0f766e,#059669)`,
              boxShadow:"0 4px 16px rgba(5,150,105,0.3)",marginBottom:12,transition:"all 0.2s",letterSpacing:"0.01em"
            }}>
              ⬇ Download WAB Assessment PDF Report
            </button>

            {aiError && <div style={{padding:"12px 16px",background:"#fef2f2",border:`1px solid #fca5a5`,borderRadius:8,fontSize:13,color:C.red,...fnt,marginBottom:14,fontWeight:500}}>{aiError}</div>}

            <button onClick={runAnalysis} disabled={aiLoading} style={{
              width:"100%",padding:"16px",border:"none",borderRadius:10,color:"#ffffff",fontSize:15,fontWeight:800,cursor:aiLoading?"not-allowed":"pointer",...fnt,
              background:aiLoading?"#cbd5e1":`linear-gradient(135deg,#6d28d9,#0369a1)`,
              boxShadow:aiLoading?"none":"0 4px 24px rgba(109,40,217,0.35)",transition:"all 0.2s",letterSpacing:"0.01em"
            }}>
              {aiLoading?"⏳  Generating AI Clinical Analysis…":"⬡  Generate AI Clinical Analysis & Intervention Plan"}
            </button>
          </div>
        )}

        {/* ── PAGE 6: AI Analysis ── */}
        {page==="analysis" && (
          <div ref={aiRef}>
            {!aiResult && !aiLoading && (
              <div style={{textAlign:"center",padding:"60px 24px",color:C.muted}}>
                <div style={{fontSize:40,marginBottom:12,opacity:0.3}}>⬡</div>
                <div style={{fontSize:13,...fnt}}>Go to AQ & Results tab and click "Generate AI Clinical Analysis"</div>
              </div>
            )}
            {aiLoading && (
              <div style={{textAlign:"center",padding:"60px 24px",color:C.teal,...fnt}}>
                <div style={{fontSize:32,marginBottom:16,animation:"spin 2s linear infinite"}}>⬡</div>
                <div style={{fontSize:14,fontWeight:700}}>Analysing WAB profile + case history…</div>
              </div>
            )}
            {aiResult && (
              <div>
                {/* Summary Banner */}
                <Card title="Clinical Summary" icon="⬡" accent={C.teal}>
                  <textarea value={getNoteValue("clinical_summary")} onChange={e=>handleNoteChange("clinical_summary",e.target.value)} rows={4} style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,fontSize:13,padding:"8px 10px",boxSizing:"border-box",outline:"none",resize:"vertical",lineHeight:1.8,...fnt}}/>
                  <button onClick={()=>handleNoteSave("clinical_summary")} style={{marginTop:6,padding:"5px 18px",background:noteSaved["clinical_summary"]?C.green:C.teal,border:"none",borderRadius:6,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",...fnt}}>{noteSaved["clinical_summary"]?"✓ Saved":"💾 Save"}</button>
                </Card>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  {/* Linguistic Profile */}
                  <Card title="Linguistic Profile" icon="◈" accent={C.purple}>
                    <Row label="Lexical Retrieval" value={aiResult.lexical_retrieval} color={aiResult.lexical_retrieval==="Intact"?C.green:aiResult.lexical_retrieval==="Mild"?C.accent:C.red}/>
                    <Row label="Agrammatism" value={aiResult.agrammatism?.present?"Present":"Absent"} color={aiResult.agrammatism?.present?C.red:C.green}/>
                    <Row label="Severity" value={aiResult.agrammatism?.severity}/>
                    <div style={{marginTop:10}}>
                      {aiResult.agrammatism?.features?.map((f,i)=><Chip key={i} text={f} color={C.purple}/>)}
                    </div>
                    {aiResult.auditory_comprehension_profile && (
                      <div style={{marginTop:10,padding:"8px 10px",background:"#f0f7ff",borderRadius:6,fontSize:11,color:C.muted,...fnt,fontStyle:"italic"}}>AVC pattern: {aiResult.auditory_comprehension_profile}</div>
                    )}
                  </Card>

                  {/* Paraphasias */}
                  <Card title="Paraphasia Inventory" icon="◉" accent={C.red}>
                    {(!aiResult.paraphasias||aiResult.paraphasias.length===0)?
                      <p style={{color:C.muted,fontSize:12,...fnt}}>No significant paraphasias identified in this profile.</p>:
                      aiResult.paraphasias.map((p,i)=>(
                        <div key={i} style={{background:"#f8fafc",borderRadius:7,border:`1px solid ${C.border}`,padding:"10px 12px",marginBottom:8,border:`1px solid ${C.red}22`}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                            <Chip text={p.type} color={C.red}/>
                          </div>
                          <div style={{fontSize:12,color:C.muted,...fnt}}>{p.example}</div>
                          <div style={{fontSize:11,color:C.muted,...fnt,fontStyle:"italic",marginTop:3}}>{p.note}</div>
                        </div>
                      ))
                    }
                  </Card>
                </div>

                {/* Bilingual Notes */}
                {aiResult.bilingual_notes && (
                  <Card title="Bilingual / Code-Switching Notes" icon="🔤" accent={C.accent}>
                    <textarea value={getNoteValue("bilingual_notes")} onChange={e=>handleNoteChange("bilingual_notes",e.target.value)} rows={3} style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,fontSize:13,padding:"8px 10px",boxSizing:"border-box",outline:"none",resize:"vertical",lineHeight:1.8,...fnt}}/>
                    <button onClick={()=>handleNoteSave("bilingual_notes")} style={{marginTop:6,padding:"5px 18px",background:noteSaved["bilingual_notes"]?C.green:C.accent,border:"none",borderRadius:6,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",...fnt}}>{noteSaved["bilingual_notes"]?"✓ Saved":"💾 Save"}</button>
                  </Card>
                )}

                {/* Intervention Priorities */}
                <Card title="Evidence-Based Intervention Priorities" icon="▼" accent={C.green}>
                  {aiResult.intervention_priorities?.map((item,i)=>{
                    const cols=["#f59e0b","#06b6d4","#10b981"];
                    const c=cols[i]||C.teal;
                    return (
                      <div key={i} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:`1px solid ${C.border}33`}}>
                        <div style={{width:28,height:28,borderRadius:"50%",background:`${c}22`,border:`1.5px solid ${c}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12,fontWeight:800,color:c,...fnt}}>{item.priority}</div>
                        <div>
                          <div style={{fontSize:11,color:c,fontWeight:700,marginBottom:2,textTransform:"uppercase",letterSpacing:"0.06em",...fnt}}>{item.domain}</div>
                          <div style={{fontSize:13,color:C.text,fontWeight:600,marginBottom:3,...fnt}}>{item.strategy}</div>
                          <div style={{fontSize:11,color:C.muted,...fnt}}>{item.rationale}</div>
                        </div>
                      </div>
                    );
                  })}
                  {aiResult.home_programme && (
                    <div style={{marginTop:12,padding:"10px 14px",background:`${C.green}10`,border:`1px solid ${C.green}33`,borderRadius:7}}>
                      <div style={{fontSize:11,color:C.green,fontWeight:700,...fnt,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Home Programme</div>
                      <textarea value={getNoteValue("home_programme")} onChange={e=>handleNoteChange("home_programme",e.target.value)} rows={3} style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,fontSize:12,padding:"7px 10px",boxSizing:"border-box",outline:"none",resize:"vertical",lineHeight:1.7,...fnt}}/>
                      <button onClick={()=>handleNoteSave("home_programme")} style={{marginTop:6,padding:"5px 18px",background:noteSaved["home_programme"]?C.green:"#059669",border:"none",borderRadius:6,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",...fnt}}>{noteSaved["home_programme"]?"✓ Saved":"💾 Save"}</button>
                    </div>
                  )}
                </Card>

                {/* Progress & Prognosis */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  {aiResult.progress_notes && (
                    <Card title="Progress Notes (Pre → Post)" icon="📈" accent={C.blue}>
                      <textarea value={getNoteValue("progress_notes")} onChange={e=>handleNoteChange("progress_notes",e.target.value)} rows={4} style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,fontSize:13,padding:"8px 10px",boxSizing:"border-box",outline:"none",resize:"vertical",lineHeight:1.8,...fnt}}/>
                      <button onClick={()=>handleNoteSave("progress_notes")} style={{marginTop:6,padding:"5px 18px",background:noteSaved["progress_notes"]?C.green:C.blue,border:"none",borderRadius:6,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",...fnt}}>{noteSaved["progress_notes"]?"✓ Saved":"💾 Save"}</button>
                    </Card>
                  )}
                  <Card title="Prognosis" icon="🔮" accent={C.purple}>
                    <textarea value={getNoteValue("prognosis")} onChange={e=>handleNoteChange("prognosis",e.target.value)} rows={4} style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,fontSize:13,padding:"8px 10px",boxSizing:"border-box",outline:"none",resize:"vertical",lineHeight:1.8,...fnt}}/>
                    <button onClick={()=>handleNoteSave("prognosis")} style={{marginTop:6,padding:"5px 18px",background:noteSaved["prognosis"]?C.green:C.purple,border:"none",borderRadius:6,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",...fnt}}>{noteSaved["prognosis"]?"✓ Saved":"💾 Save"}</button>
                    <div style={{marginTop:8,padding:"8px 10px",background:"#f0f7ff",borderRadius:6,fontSize:11,color:C.muted,...fnt,fontStyle:"italic"}}>
                      ⚠ AI-generated. For clinical use only under supervision of a qualified SLP.
                    </div>
                  </Card>
                </div>

                <div style={{display:"flex",gap:10,marginTop:4}}>
                  <button onClick={runAnalysis} disabled={aiLoading} style={{
                    flex:1,padding:"11px",border:`1px solid ${C.teal}`,borderRadius:8,color:C.teal,fontSize:12,fontWeight:700,cursor:"pointer",...fnt,
                    background:"#ffffff",transition:"all 0.2s",boxShadow:"0 1px 3px rgba(2,132,199,0.12)"
                  }}>
                    ↺ Re-run Analysis
                  </button>
                  <button onClick={downloadPDF} style={{
                    flex:1,padding:"11px",border:"none",borderRadius:8,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",...fnt,
                    background:`linear-gradient(135deg,#7c3aed,#ec4899)`,
                    boxShadow:"0 4px 18px #7c3aed33",transition:"all 0.2s"
                  }}>
                    ⬇ Download PDF Report
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PAGE 7: Sarvam STT + Linguistic Analysis ── */}
        {page==="sarvam" && (
          <div>
            {/* API Key + Language Config */}
            <Card title="Sarvam AI Configuration" icon="🔑" accent={C.accent}>
              <div style={{background:`${C.accent}10`,border:`1px solid ${C.accent}33`,borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:12,color:C.muted,...fnt,lineHeight:1.7}}>
                This module uses <b style={{color:C.accent}}>Sarvam AI</b> (saaras:v2) for multilingual Indian speech-to-text transcription, then <b style={{color:C.teal}}>Claude</b> for deep linguistic analysis. Get your free API key at <span style={{color:C.teal}}>cloud.sarvam.ai</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"flex-end"}}>
                <div>
                  <div style={{fontSize:11,color:C.muted,marginBottom:4,...fnt,textTransform:"uppercase",letterSpacing:"0.06em"}}>Sarvam API Key</div>
                  <input type="password" value={sarvamKey} onChange={e=>setSarvamKey(e.target.value)}
                    placeholder="Enter your Sarvam API subscription key..."
                    style={{width:"100%",background:C.surface,border:`1px solid ${sarvamKey?C.green:C.border}`,borderRadius:6,color:C.text,fontSize:12,padding:"8px 12px",boxSizing:"border-box",outline:"none",...fnt}}/>
                </div>
                <div>
                  <div style={{fontSize:11,color:C.muted,marginBottom:4,...fnt,textTransform:"uppercase",letterSpacing:"0.06em"}}>Language</div>
                  <select value={sarvamLang} onChange={e=>setSarvamLang(e.target.value)}
                    style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,fontSize:12,padding:"8px 12px",outline:"none",...fnt}}>
                    <option value="kn-IN">Kannada (ಕನ್ನಡ)</option>
                    <option value="en-IN">English (Indian)</option>
                    <option value="kn-IN">Kannada–English (bilingual)</option>
                    <option value="te-IN">Telugu (తెలుగు)</option>
                    <option value="hi-IN">Hindi (हिंदी)</option>
                    <option value="ta-IN">Tamil (தமிழ்)</option>
                    <option value="ml-IN">Malayalam (മലയാളം)</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Record or Upload */}
            <Card title="Audio Input — Record or Upload" icon="🎙" accent={C.teal}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                {/* Recording Panel */}
                <div style={{background:C.surface,borderRadius:10,padding:16,border:`1px solid ${sarvamStatus==="recording"?C.red:C.border}`}}>
                  <div style={{fontSize:11,color:C.teal,fontWeight:700,...fnt,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Live Recording</div>
                  {sarvamStatus==="recording" && (
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:C.red,animation:"pulse 1s infinite"}}/>
                      <span style={{color:C.red,fontSize:13,fontWeight:700,...fnt}}>Recording {fmtTime(recordingTime)}</span>
                    </div>
                  )}
                  <div style={{display:"flex",gap:10}}>
                    <button onClick={startRecording} disabled={sarvamStatus==="recording"}
                      style={{flex:1,padding:"10px",border:"none",borderRadius:7,background:sarvamStatus==="recording"?C.border:`${C.red}22`,border:`1px solid ${sarvamStatus==="recording"?C.border:C.red}`,color:sarvamStatus==="recording"?C.muted:C.red,fontSize:12,fontWeight:700,cursor:sarvamStatus==="recording"?"not-allowed":"pointer",...fnt}}>
                      ● Record
                    </button>
                    <button onClick={stopRecording} disabled={sarvamStatus!=="recording"}
                      style={{flex:1,padding:"10px",border:"none",borderRadius:7,background:sarvamStatus==="recording"?`${C.accent}22`:C.border,border:`1px solid ${sarvamStatus==="recording"?C.accent:C.border}`,color:sarvamStatus==="recording"?C.accent:C.muted,fontSize:12,fontWeight:700,cursor:sarvamStatus!=="recording"?"not-allowed":"pointer",...fnt}}>
                      ■ Stop
                    </button>
                  </div>
                  <div style={{marginTop:8,fontSize:11,color:C.muted,...fnt}}>Ensure microphone permission is granted in your browser.</div>
                </div>

                {/* Upload Panel */}
                <div style={{background:C.surface,borderRadius:10,padding:16,border:`1px solid ${C.border}`}}>
                  <div style={{fontSize:11,color:C.teal,fontWeight:700,...fnt,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Upload Audio File</div>
                  <input type="file" ref={fileInputRef} accept="audio/*,.wav,.mp3,.m4a,.webm,.ogg" onChange={handleFileUpload} style={{display:"none"}}/>
                  <button onClick={()=>fileInputRef.current?.click()}
                    style={{width:"100%",padding:"10px",background:`${C.teal}18`,border:`1px dashed ${C.teal}55`,borderRadius:7,color:C.teal,fontSize:12,fontWeight:700,cursor:"pointer",...fnt,marginBottom:8}}>
                    ⬆ Choose Audio File
                  </button>
                  <div style={{fontSize:11,color:C.muted,...fnt}}>Supports .wav, .mp3, .m4a, .webm, .ogg</div>
                </div>
              </div>

              {/* Audio Preview */}
              {audioURL && (
                <div style={{marginTop:14,background:C.surface,borderRadius:8,padding:12,border:`1px solid ${C.green}44`}}>
                  <div style={{fontSize:11,color:C.green,fontWeight:700,...fnt,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>✓ Audio Ready</div>
                  <audio controls src={audioURL} style={{width:"100%",borderRadius:4}}/>
                  <button onClick={transcribeWithSarvam} disabled={sarvamStatus==="processing"||!sarvamKey}
                    style={{marginTop:10,width:"100%",padding:"11px",border:"none",borderRadius:7,
                      background:sarvamStatus==="processing"||!sarvamKey?C.tealDim:`linear-gradient(135deg,#0e7490,#06b6d4)`,
                      color:C.white,fontSize:13,fontWeight:700,cursor:sarvamStatus==="processing"||!sarvamKey?"not-allowed":"pointer",...fnt,
                      boxShadow:sarvamStatus==="processing"||!sarvamKey?"none":"0 4px 16px #06b6d433"}}>
                    {sarvamStatus==="processing"?"⏳  Transcribing via Sarvam AI…":"🎙  Transcribe with Sarvam AI"}
                  </button>
                  {!sarvamKey && <div style={{fontSize:11,color:C.accent,marginTop:6,...fnt}}>⚠ Enter your Sarvam API key above first</div>}
                </div>
              )}
            </Card>

            {/* Transcript Output */}
            <Card title="Transcription Output" icon="📄" accent={C.purple}>
              {sarvamStatus==="processing" && (
                <div style={{textAlign:"center",padding:"20px",color:C.teal,...fnt}}>⏳ Sending to Sarvam AI… please wait</div>
              )}
              {sarvamError && (
                <div style={{padding:"10px 14px",background:`${C.red}18`,border:`1px solid ${C.red}44`,borderRadius:7,fontSize:12,color:C.red,...fnt,marginBottom:10}}>{sarvamError}</div>
              )}
              <div style={{marginBottom:8,fontSize:11,color:C.muted,...fnt,textTransform:"uppercase",letterSpacing:"0.06em"}}>
                Transcript {sarvamStatus==="done"&&<span style={{color:C.green,fontWeight:700}}>✓ Received from Sarvam</span>}
                <span style={{float:"right",color:C.muted,fontStyle:"italic",textTransform:"none",letterSpacing:0}}>Edit as needed before analysis</span>
              </div>
              <textarea value={sarvamTranscript} onChange={e=>setSarvamTranscript(e.target.value)} rows={7}
                placeholder="Transcript will appear here after Sarvam AI processing. You can also paste a transcript manually."
                style={{width:"100%",background:C.surface,border:`1px solid ${sarvamTranscript?C.purple:C.border}`,borderRadius:7,color:C.text,fontSize:13,padding:"10px 12px",boxSizing:"border-box",outline:"none",resize:"vertical",lineHeight:1.8,...fnt}}/>
              {sarvamTranscript && (
                <div style={{marginTop:6,fontSize:11,color:C.muted,...fnt}}>
                  Words: <b style={{color:C.text}}>{sarvamTranscript.trim().split(/\s+/).filter(Boolean).length}</b> &nbsp;|&nbsp;
                  Characters: <b style={{color:C.text}}>{sarvamTranscript.length}</b>
                </div>
              )}
            </Card>

            {/* Linguistic Analysis Trigger */}
            {sarvamTranscript && (
              <button onClick={runLinguisticAnalysis} disabled={lingoLoading}
                style={{width:"100%",padding:"14px",border:"none",borderRadius:9,color:C.white,fontSize:14,fontWeight:800,cursor:lingoLoading?"not-allowed":"pointer",...fnt,
                  background:lingoLoading?C.tealDim:`linear-gradient(135deg,#7c3aed,#06b6d4)`,
                  boxShadow:lingoLoading?"none":"0 4px 24px #7c3aed44",marginBottom:16}}>
                {lingoLoading?"⏳  Analysing linguistic structure…":"⬡  Run Deep Linguistic Analysis (Semantics · Syntax · Morphosyntax · Phonology)"}
              </button>
            )}

            {/* Linguistic Analysis Results */}
            {lingoResult && (
              <div>
                {/* Metrics Bar */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
                  {[["MLU",lingoResult.mlu,C.teal],["TTR",lingoResult.ttr,C.green],["Utterances",lingoResult.utterance_count,C.purple],["Fluency",lingoResult.prosody_fluency?.fluency_rating,C.accent]].map(([l,v,c])=>(
                    <div key={l} style={{background:C.card,border:`1px solid ${c}33`,borderRadius:9,padding:"12px 14px",textAlign:"center"}}>
                      <div style={{fontSize:11,color:C.muted,...fnt,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{l}</div>
                      <div style={{fontSize:18,fontWeight:800,color:c,...fnt}}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* Clinical Impression */}
                <Card title="Clinical Impression" icon="⬡" accent={C.teal}>
                  <p style={{margin:0,fontSize:13,lineHeight:1.8,color:C.text,...fnt}}>{lingoResult.clinical_impression}</p>
                </Card>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  {/* Semantic Analysis */}
                  <Card title="Semantic Analysis" icon="◈" accent={C.accent}>
                    <p style={{margin:"0 0 10px",fontSize:12,color:C.muted,...fnt,lineHeight:1.6}}>{lingoResult.semantic_analysis?.summary}</p>
                    {lingoResult.semantic_analysis?.semantic_paraphasias?.length>0 && (
                      <div style={{marginBottom:10}}>
                        <div style={{fontSize:11,color:C.accent,fontWeight:700,...fnt,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Semantic Paraphasias</div>
                        {lingoResult.semantic_analysis.semantic_paraphasias.map((p,i)=>(
                          <div key={i} style={{background:C.surface,borderRadius:6,padding:"7px 10px",marginBottom:5,fontSize:12,...fnt}}>
                            <span style={{color:C.green}}>"{p.target}"</span> → <span style={{color:C.red}}>"{p.produced}"</span>
                            <span style={{color:C.muted,marginLeft:8,fontSize:11}}>[{p.category}]</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {lingoResult.semantic_analysis?.neologisms?.length>0 && (
                      <div>
                        <div style={{fontSize:11,color:C.red,fontWeight:700,...fnt,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Neologisms</div>
                        {lingoResult.semantic_analysis.neologisms.map((n,i)=>(
                          <div key={i} style={{background:C.surface,borderRadius:6,padding:"6px 10px",marginBottom:4,fontSize:12,...fnt}}>
                            <span style={{color:C.red}}>"{n.produced}"</span> <span style={{color:C.muted,fontSize:11}}>← probable: "{n.probable_target}"</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8}}>
                      {lingoResult.semantic_analysis?.empty_speech && <Chip text="Empty Speech" color={C.red}/>}
                      {lingoResult.semantic_analysis?.jargon && <Chip text="Jargon" color={C.red}/>}
                      {lingoResult.semantic_analysis?.circumlocution_instances?.length>0 && <Chip text="Circumlocution" color={C.accent}/>}
                    </div>
                  </Card>

                  {/* Syntactic Analysis */}
                  <Card title="Syntactic Analysis" icon="◉" accent={C.blue}>
                    <p style={{margin:"0 0 10px",fontSize:12,color:C.muted,...fnt,lineHeight:1.6}}>{lingoResult.syntactic_analysis?.summary}</p>
                    <Row label="Dominant Structure" value={lingoResult.syntactic_analysis?.dominant_structure}/>
                    <Row label="Agrammatism" value={lingoResult.syntactic_analysis?.agrammatism?.present?"Present":"Absent"} color={lingoResult.syntactic_analysis?.agrammatism?.present?C.red:C.green}/>
                    <Row label="Paragrammatism" value={lingoResult.syntactic_analysis?.paragrammatism?.present?"Present":"Absent"} color={lingoResult.syntactic_analysis?.paragrammatism?.present?C.red:C.green}/>
                    <div style={{marginTop:10}}>
                      {lingoResult.syntactic_analysis?.sentence_types_used?.map((s,i)=><Chip key={i} text={s} color={C.blue}/>)}
                    </div>
                    {lingoResult.syntactic_analysis?.agrammatism?.features?.length>0 && (
                      <div style={{marginTop:8}}>
                        <div style={{fontSize:11,color:C.red,fontWeight:700,...fnt,marginBottom:4}}>Agrammatic Features</div>
                        {lingoResult.syntactic_analysis.agrammatism.features.map((f,i)=><Chip key={i} text={f} color={C.red}/>)}
                      </div>
                    )}
                  </Card>

                  {/* Morphosyntax */}
                  <Card title="Morphosyntactic Analysis" icon="▲" accent={C.purple}>
                    <p style={{margin:"0 0 10px",fontSize:12,color:C.muted,...fnt,lineHeight:1.6}}>{lingoResult.morphosyntactic_analysis?.summary}</p>
                    <Row label="Verb Morphology" value={lingoResult.morphosyntactic_analysis?.verb_morphology}/>
                    <Row label="Noun Morphology" value={lingoResult.morphosyntactic_analysis?.noun_morphology}/>
                    <Row label="Function Words" value={lingoResult.morphosyntactic_analysis?.function_words}/>
                    {lingoResult.morphosyntactic_analysis?.kannada_specific && (
                      <div style={{marginTop:8,padding:"8px 10px",background:`${C.purple}10`,borderRadius:6,border:`1px solid ${C.purple}33`}}>
                        <div style={{fontSize:11,color:C.purple,fontWeight:700,...fnt,marginBottom:3}}>Kannada-Specific Errors</div>
                        <div style={{fontSize:12,color:C.muted,...fnt}}>{lingoResult.morphosyntactic_analysis.kannada_specific}</div>
                      </div>
                    )}
                    {lingoResult.morphosyntactic_analysis?.code_switching_pattern && (
                      <div style={{marginTop:8,padding:"8px 10px",background:`${C.accent}10`,borderRadius:6,border:`1px solid ${C.accent}33`}}>
                        <div style={{fontSize:11,color:C.accent,fontWeight:700,...fnt,marginBottom:3}}>Code-Switching Pattern</div>
                        <div style={{fontSize:12,color:C.muted,...fnt}}>{lingoResult.morphosyntactic_analysis.code_switching_pattern}</div>
                      </div>
                    )}
                  </Card>

                  {/* Phonological */}
                  <Card title="Phonological Analysis" icon="◇" accent={C.pink}>
                    <p style={{margin:"0 0 10px",fontSize:12,color:C.muted,...fnt,lineHeight:1.6}}>{lingoResult.phonological_analysis?.summary}</p>
                    <Row label="Consistency" value={lingoResult.phonological_analysis?.consistency}/>
                    {lingoResult.phonological_analysis?.phonemic_paraphasias?.length>0 && (
                      <div style={{marginBottom:8}}>
                        <div style={{fontSize:11,color:C.pink,fontWeight:700,...fnt,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Phonemic Paraphasias</div>
                        {lingoResult.phonological_analysis.phonemic_paraphasias.map((p,i)=>(
                          <div key={i} style={{background:C.surface,borderRadius:6,padding:"6px 10px",marginBottom:4,fontSize:12,...fnt}}>
                            <span style={{color:C.green}}>/{p.target}/</span> → <span style={{color:C.pink}}>/{p.produced}/</span>
                            <span style={{color:C.muted,marginLeft:8,fontSize:11}}>[{p.error_type}]</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{display:"flex",flexWrap:"wrap"}}>
                      {lingoResult.phonological_analysis?.sound_system_errors?.map((e,i)=><Chip key={i} text={e} color={C.pink}/>)}
                    </div>
                  </Card>
                </div>

                {/* Prosody & Functional */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  <Card title="Prosody & Fluency" icon="🎵" accent={C.teal}>
                    <Row label="Fluency Rating" value={lingoResult.prosody_fluency?.fluency_rating} color={lingoResult.prosody_fluency?.fluency_rating==="Fluent"?C.green:C.red}/>
                    <Row label="Prosodic Features" value={lingoResult.prosody_fluency?.prosodic_features}/>
                    <div style={{marginTop:8}}>
                      {lingoResult.prosody_fluency?.dysfluencies?.map((d,i)=><Chip key={i} text={d} color={C.teal}/>)}
                    </div>
                  </Card>
                  <Card title="Functional Communication" icon="💬" accent={C.green}>
                    <Row label="Effectiveness" value={lingoResult.functional_communication_from_transcript?.communicative_effectiveness} color={C.green}/>
                    <div style={{marginTop:8}}>
                      <div style={{fontSize:11,color:C.green,fontWeight:700,...fnt,marginBottom:4}}>Preserved Abilities</div>
                      {lingoResult.functional_communication_from_transcript?.preserved_abilities?.map((a,i)=><Chip key={i} text={a} color={C.green}/>)}
                    </div>
                    <div style={{marginTop:8}}>
                      <div style={{fontSize:11,color:C.red,fontWeight:700,...fnt,marginBottom:4}}>Main Barriers</div>
                      {lingoResult.functional_communication_from_transcript?.main_barriers?.map((b,i)=><Chip key={i} text={b} color={C.red}/>)}
                    </div>
                  </Card>
                </div>

                {/* Recommendations */}
                <Card title="Targeted Recommendations from Transcript" icon="✅" accent={C.green}>
                  {lingoResult.targeted_recommendations?.map((r,i)=>(
                    <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.border}33`,...fnt}}>
                      <span style={{color:C.green,fontWeight:700,fontSize:13}}>→</span>
                      <span style={{fontSize:13,color:C.text}}>{r}</span>
                    </div>
                  ))}
                </Card>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── Footer ── */}
      <div style={{marginTop:48,borderTop:`1px solid ${C.border}`,background:"#ffffff",boxShadow:"0 -1px 4px rgba(0,0,0,0.04)"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"20px 28px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:20}}>
          <div>
            <div style={{fontSize:10,color:C.muted,...fnt,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>About This Tool</div>
            <div style={{fontSize:12,color:C.white,fontWeight:700,...fnt}}>AphasiaLens v2.0</div>
            <div style={{fontSize:11,color:C.muted,...fnt,marginTop:3,maxWidth:320,lineHeight:1.6}}>
              A free bilingual (Kannada-English) WAB-based aphasia assessment and AI-assisted clinical analysis tool for Speech-Language Pathologists.
            </div>
          </div>
          <div>
            <div style={{fontSize:10,color:C.muted,...fnt,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Powered By</div>
            <div style={{fontSize:11,color:C.muted,...fnt}}>🤖 Claude (Anthropic) — AI Clinical Analysis</div>
            <div style={{fontSize:11,color:C.muted,...fnt,marginTop:3}}>🎙 Sarvam AI — Multilingual Speech Transcription</div>
            <div style={{fontSize:11,color:C.muted,...fnt,marginTop:3}}>⚖️ Western Aphasia Battery (WAB) — Kertesz, 1982</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:C.muted,...fnt,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Disclaimer</div>
            <div style={{fontSize:10,color:C.muted,...fnt,marginTop:2,maxWidth:220,lineHeight:1.6,textAlign:"right"}}>
              For clinical use under qualified SLP supervision only. AI outputs are decision-support aids and do not replace clinical judgement.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
