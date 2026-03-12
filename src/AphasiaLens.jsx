import { useState, useRef } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg:"#06101f", surface:"#0c1829", card:"#101e30", border:"#1a3356",
  teal:"#06b6d4", tealDim:"#0a2e3e", accent:"#f59e0b", green:"#10b981",
  red:"#ef4444", purple:"#8b5cf6", blue:"#3b82f6", pink:"#ec4899",
  text:"#e2e8f0", muted:"#64748b", white:"#f1f5f9",
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
const fnt = { fontFamily:"'Segoe UI', system-ui, sans-serif" };

function Card({title, icon, accent=C.teal, children, noPad}) {
  return (
    <div style={{background:C.card,border:`1px solid ${accent}33`,borderRadius:12,marginBottom:16,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"12px 18px",borderBottom:`1px solid ${accent}22`,background:`${accent}08`}}>
        <span style={{color:accent,fontSize:14}}>{icon}</span>
        <h3 style={{margin:0,fontSize:11,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",color:accent,...fnt}}>{title}</h3>
      </div>
      <div style={noPad?{}:{padding:"16px 18px"}}>{children}</div>
    </div>
  );
}

function Row({label, value, color}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${C.border}33`}}>
      <span style={{fontSize:12,color:C.muted,...fnt}}>{label}</span>
      <span style={{fontSize:12,color:color||C.text,fontWeight:700,...fnt}}>{value}</span>
    </div>
  );
}

function FInput({label, value, onChange, placeholder, type="text", full}) {
  return (
    <div style={{marginBottom:10,flex:full?"1":""}}>
      {label && <div style={{fontSize:11,color:C.muted,marginBottom:4,...fnt,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</div>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||""} style={{
        width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,
        color:C.text,fontSize:12,padding:"7px 10px",boxSizing:"border-box",outline:"none",...fnt
      }}/>
    </div>
  );
}

function FTextarea({label, value, onChange, rows=3, placeholder}) {
  return (
    <div style={{marginBottom:10}}>
      {label && <div style={{fontSize:11,color:C.muted,marginBottom:4,...fnt,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</div>}
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||""} rows={rows} style={{
        width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,
        color:C.text,fontSize:12,padding:"7px 10px",boxSizing:"border-box",outline:"none",resize:"vertical",...fnt
      }}/>
    </div>
  );
}

function FSelect({label, value, onChange, options}) {
  return (
    <div style={{marginBottom:10}}>
      {label && <div style={{fontSize:11,color:C.muted,marginBottom:4,...fnt,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</div>}
      <select value={value} onChange={e=>onChange(e.target.value)} style={{
        width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,
        color:C.text,fontSize:12,padding:"7px 10px",outline:"none",...fnt
      }}>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function RadioGroup({label, options, value, onChange}) {
  return (
    <div style={{marginBottom:10}}>
      {label && <div style={{fontSize:11,color:C.muted,marginBottom:6,...fnt,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</div>}
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        {options.map(o=>(
          <label key={o} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",...fnt,fontSize:12,color:value===o?C.teal:C.muted}}>
            <input type="radio" checked={value===o} onChange={()=>onChange(o)} style={{accentColor:C.teal}}/>
            {o}
          </label>
        ))}
      </div>
    </div>
  );
}

function BehRow({label, rep, obs, onRep, onObs}) {
  return (
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:8,alignItems:"center",marginBottom:6}}>
      <span style={{fontSize:12,color:C.text,...fnt}}>{label}</span>
      <select value={rep} onChange={e=>onRep(e.target.value)} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:5,color:C.text,fontSize:11,padding:"4px 6px",...fnt}}>
        {["—","Normal","Mildly impaired","Moderately impaired","Severely impaired","Absent","Present"].map(o=><option key={o}>{o}</option>)}
      </select>
      <select value={obs} onChange={e=>onObs(e.target.value)} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:5,color:C.text,fontSize:11,padding:"4px 6px",...fnt}}>
        {["—","Normal","Mildly impaired","Moderately impaired","Severely impaired","Absent","Present"].map(o=><option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SliderScore({label, value, max, onChange}) {
  const pct = max>0 ? value/max : 0;
  const col = pct>=0.7?C.green:pct>=0.4?C.accent:C.red;
  return (
    <div style={{marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
        <span style={{fontSize:12,color:C.muted,...fnt}}>{label}</span>
        <span style={{fontSize:12,color:col,fontWeight:700,...fnt}}>{value}/{max} <span style={{fontSize:10,color:C.muted}}>({Math.round(pct*100)}%)</span></span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <input type="range" min={0} max={max} value={value} onChange={e=>onChange(Number(e.target.value))} style={{flex:1,accentColor:col}}/>
        <input type="number" min={0} max={max} value={value} onChange={e=>onChange(Math.min(max,Math.max(0,Number(e.target.value))))} style={{width:44,background:C.surface,border:`1px solid ${C.border}`,borderRadius:5,color:C.text,fontSize:11,padding:"3px 5px",textAlign:"center",...fnt,outline:"none"}}/>
      </div>
      <div style={{height:4,borderRadius:2,background:C.border,marginTop:4}}>
        <div style={{height:"100%",width:`${pct*100}%`,background:col,borderRadius:2,transition:"width 0.3s"}}/>
      </div>
    </div>
  );
}

function AQGauge({aq}) {
  const pct=aq/100, r=52, circ=2*Math.PI*r;
  const col=aq>=75?C.green:aq>=50?C.accent:C.red;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <svg width={124} height={124}>
        <circle cx={62} cy={62} r={r} fill="none" stroke={C.border} strokeWidth={9}/>
        <circle cx={62} cy={62} r={r} fill="none" stroke={col} strokeWidth={9}
          strokeDasharray={`${pct*circ} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 62 62)" style={{transition:"stroke-dasharray 0.8s"}}/>
        <text x={62} y={57} textAnchor="middle" fill={C.white} fontSize={22} fontWeight="800" fontFamily="sans-serif">{aq}</text>
        <text x={62} y={73} textAnchor="middle" fill={C.muted} fontSize={10} fontFamily="sans-serif">/ 100 AQ</text>
      </svg>
    </div>
  );
}

function Chip({text, color}) {
  return <span style={{display:"inline-block",background:(color||C.teal)+"18",border:`1px solid ${(color||C.teal)}33`,color:color||C.teal,borderRadius:4,padding:"2px 8px",fontSize:11,marginRight:4,marginBottom:4,...fnt}}>{text}</span>;
}

function NavBtn({label, active, onClick}) {
  return (
    <button onClick={onClick} style={{
      padding:"9px 14px",border:"1px solid",borderRadius:7,cursor:"pointer",
      borderColor:active?C.teal:C.border,
      background:active?C.tealDim:C.surface,
      color:active?C.teal:C.muted,
      fontSize:11,fontWeight:700,...fnt,whiteSpace:"nowrap",transition:"all 0.15s"
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
    name:"",caseNo:"",age:"",sex:"Male",clinician:"",supervisor:"",
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
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:SYS,messages:[{role:"user",content:prompt}]})
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text||"";
      setAiResult(JSON.parse(raw.replace(/```json|```/g,"").trim()));
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
          model:"claude-sonnet-4-20250514", max_tokens:1000,
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
      setLingoResult(JSON.parse(raw.replace(/```json|```/g,"").trim()));
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
      <div style={{background:`linear-gradient(135deg,#081526 0%,#06101f 100%)`,borderBottom:`1px solid ${C.border}`,padding:"20px 28px 16px"}}>
        <div style={{maxWidth:960,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:38,height:38,borderRadius:9,background:C.tealDim,border:`1.5px solid ${C.teal}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⬡</div>
              <div>
                <h1 style={{margin:0,fontSize:20,fontWeight:800,color:C.white,letterSpacing:"-0.02em"}}>Aphasia<span style={{color:C.teal}}>Lens</span></h1>
                <div style={{fontSize:10,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase"}}>Bilingual Clinical Assessment Tool · Kannada–English</div>
              </div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              {/* Language Toggle */}
              <div style={{display:"flex",border:`1px solid ${C.border}`,borderRadius:7,overflow:"hidden"}}>
                {[["en","English"],["kn","ಕನ್ನಡ"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setLang(v)} style={{padding:"5px 12px",border:"none",background:lang===v?C.tealDim:"transparent",color:lang===v?C.teal:C.muted,fontSize:11,fontWeight:700,cursor:"pointer",...fnt}}>{l}</button>
                ))}
              </div>
              {/* Session Toggle */}
              <div style={{display:"flex",border:`1px solid ${C.border}`,borderRadius:7,overflow:"hidden"}}>
                {[["pre","Pre-Rx"],["post","Post-Rx"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setSession(v)} style={{padding:"5px 12px",border:"none",background:session===v?(v==="pre"?C.tealDim:C.green+"22"):"transparent",color:session===v?(v==="pre"?C.teal:C.green):C.muted,fontSize:11,fontWeight:700,cursor:"pointer",...fnt}}>{l}</button>
                ))}
              </div>
            </div>
          </div>
          {/* Nav */}
          <div style={{display:"flex",gap:6,marginTop:14,overflowX:"auto",paddingBottom:2}}>
            {pages.map(p=><NavBtn key={p.id} label={p.label} active={page===p.id} onClick={()=>setPage(p.id)}/>)}
          </div>
        </div>
      </div>

      <div style={{maxWidth:960,margin:"0 auto",padding:"24px 28px 0"}}>

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

            <button onClick={()=>setPage("behaviour")} style={{width:"100%",padding:"12px",background:`linear-gradient(135deg,#0284c7,#06b6d4)`,border:"none",borderRadius:8,color:C.white,fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 20px #06b6d433",...fnt}}>
              Next: Behaviour & General Assessment →
            </button>
          </div>
        )}

        {/* ── PAGE 2: Behaviour ── */}
        {page==="behaviour" && (
          <div>
            <Card title="General Behaviour" icon="🧩" accent={C.accent}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:8,marginBottom:10}}>
                <span style={{fontSize:11,color:C.muted,...fnt,fontWeight:700}}>Behaviour</span>
                <span style={{fontSize:11,color:C.teal,...fnt,fontWeight:700,textAlign:"center"}}>Reported</span>
                <span style={{fontSize:11,color:C.green,...fnt,fontWeight:700,textAlign:"center"}}>Observed</span>
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
              <button onClick={()=>setPage("casehistory")} style={{flex:1,padding:"11px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,fontSize:12,fontWeight:700,cursor:"pointer",...fnt}}>← Back</button>
              <button onClick={()=>setPage("specfn")} style={{flex:3,padding:"11px",background:`linear-gradient(135deg,#0284c7,#06b6d4)`,border:"none",borderRadius:8,color:C.white,fontSize:13,fontWeight:700,cursor:"pointer",...fnt}}>Next: Specific Functions →</button>
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
              <button onClick={()=>setPage("behaviour")} style={{flex:1,padding:"11px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,fontSize:12,fontWeight:700,cursor:"pointer",...fnt}}>← Back</button>
              <button onClick={()=>setPage("wab")} style={{flex:3,padding:"11px",background:`linear-gradient(135deg,#0284c7,#06b6d4)`,border:"none",borderRadius:8,color:C.white,fontSize:13,fontWeight:700,cursor:"pointer",...fnt}}>Next: WAB Administration ({lang==="en"?"English":"Kannada"}) →</button>
            </div>
          </div>
        )}

        {/* ── PAGE 4: WAB ── */}
        {page==="wab" && (
          <div>
            <div style={{background:C.card,border:`1px solid ${C.teal}44`,borderRadius:10,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontSize:13,color:C.text,fontWeight:700,...fnt}}>
                Administering WAB in: <span style={{color:C.teal}}>{lang==="en"?"English":"Kannada–English Bilingual"}</span>
              </div>
              <div style={{fontSize:11,color:C.muted,...fnt}}>Session: <span style={{color:session==="pre"?C.teal:C.green,fontWeight:700}}>{session==="pre"?"Pre-Intervention":"Post-Intervention"}</span></div>
            </div>

            {/* I. Spontaneous Speech */}
            <Card title="I. Spontaneous Speech (Max: 20)" icon="💬" accent={C.teal}>
              <div style={{background:C.surface,borderRadius:8,padding:12,marginBottom:14,maxHeight:220,overflowY:"auto"}}>
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
              <div style={{fontSize:12,color:C.accent,fontWeight:700,...fnt,marginTop:4}}>SS Total: {wab.ss_info+wab.ss_flu} / 20</div>
            </Card>

            {/* II. AVC */}
            <Card title="II. Auditory Verbal Comprehension (Max: 200)" icon="👂" accent={C.purple}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
                <div>
                  <div style={{fontSize:11,color:C.purple,fontWeight:700,...fnt,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>A. Yes/No Questions (Max 60)</div>
                  <div style={{background:C.surface,borderRadius:7,padding:10,maxHeight:180,overflowY:"auto",marginBottom:8}}>
                    {WAB[lang].yesno.map((q,i)=><div key={i} style={{fontSize:11,color:C.muted,padding:"3px 0",borderBottom:`1px solid ${C.border}22`,...fnt}}>{i+1}. {q}</div>)}
                  </div>
                  <SliderScore label="Score" value={wab.avc_yesno} max={60} onChange={v=>updateWab("avc_yesno",v)}/>
                </div>
                <div>
                  <div style={{fontSize:11,color:C.purple,fontWeight:700,...fnt,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>B. Word Recognition (Max 60)</div>
                  <div style={{background:C.surface,borderRadius:7,padding:10,marginBottom:8,fontSize:11,color:C.muted,...fnt,lineHeight:1.9}}>
                    Real objects · Drawn objects · Forms · Letters · Numbers · Colors · Furniture · Body parts · Fingers · Right-Left
                    <div style={{marginTop:6,color:C.text,fontStyle:"italic"}}>Score 1 pt per correct identification</div>
                  </div>
                  <SliderScore label="Score" value={wab.avc_wordrec} max={60} onChange={v=>updateWab("avc_wordrec",v)}/>
                </div>
                <div>
                  <div style={{fontSize:11,color:C.purple,fontWeight:700,...fnt,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>C. Sequential Commands (Max 80)</div>
                  <div style={{background:C.surface,borderRadius:7,padding:10,maxHeight:180,overflowY:"auto",marginBottom:8}}>
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
              <div style={{fontSize:12,color:C.accent,fontWeight:700,...fnt,marginTop:4}}>AVC Total: {wab.avc_yesno+wab.avc_wordrec+wab.avc_seqcmd} / 200</div>
            </Card>

            {/* III. Repetition */}
            <Card title="III. Repetition (Max: 100)" icon="🔁" accent={C.blue}>
              <div style={{background:C.surface,borderRadius:8,padding:12,marginBottom:14}}>
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
                  <div style={{fontSize:11,color:C.accent,fontWeight:700,...fnt,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>A. Object Naming (Max 60)</div>
                  <div style={{background:C.surface,borderRadius:7,padding:10,maxHeight:160,overflowY:"auto",marginBottom:8}}>
                    {WAB[lang].naming_obj.map((o,i)=><div key={i} style={{fontSize:11,color:C.muted,padding:"3px 0",borderBottom:`1px solid ${C.border}22`,...fnt}}>{i+1}. {o}</div>)}
                  </div>
                  <SliderScore label="Object Naming" value={wab.nam_obj} max={60} onChange={v=>updateWab("nam_obj",v)}/>
                </div>
                <div>
                  <div style={{fontSize:11,color:C.accent,fontWeight:700,...fnt,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>B. Word Fluency (Max 20)</div>
                  <div style={{background:C.surface,borderRadius:7,padding:10,marginBottom:8,fontSize:11,color:C.muted,...fnt}}>Name as many animals as possible in 1 minute. 1 pt per unique animal (max 20)</div>
                  <SliderScore label="Word Fluency" value={wab.nam_flu} max={20} onChange={v=>updateWab("nam_flu",v)}/>
                  <div style={{fontSize:11,color:C.accent,fontWeight:700,...fnt,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6,marginTop:10}}>C. Sentence Completion (Max 10)</div>
                  {WAB[lang].sentence_completion.map((s,i)=><div key={i} style={{fontSize:11,color:C.muted,...fnt,padding:"2px 0"}}>{i+1}. {s}</div>)}
                  <SliderScore label="Sentence Completion" value={wab.nam_sc} max={10} onChange={v=>updateWab("nam_sc",v)}/>
                  <div style={{fontSize:11,color:C.accent,fontWeight:700,...fnt,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6,marginTop:10}}>D. Responsive Speech (Max 10)</div>
                  {WAB[lang].responsive.map((s,i)=><div key={i} style={{fontSize:11,color:C.muted,...fnt,padding:"2px 0"}}>{i+1}. {s}</div>)}
                  <SliderScore label="Responsive Speech" value={wab.nam_rs} max={10} onChange={v=>updateWab("nam_rs",v)}/>
                </div>
              </div>
              <div style={{fontSize:12,color:C.accent,fontWeight:700,...fnt,marginTop:4}}>Naming Total: {wab.nam_obj+wab.nam_flu+wab.nam_sc+wab.nam_rs} / 100</div>
            </Card>

            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setPage("specfn")} style={{flex:1,padding:"11px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,fontSize:12,fontWeight:700,cursor:"pointer",...fnt}}>← Back</button>
              <button onClick={()=>setPage("results")} style={{flex:3,padding:"11px",background:`linear-gradient(135deg,#0284c7,#06b6d4)`,border:"none",borderRadius:8,color:C.white,fontSize:13,fontWeight:700,cursor:"pointer",...fnt}}>Calculate AQ & Results →</button>
            </div>
          </div>
        )}

        {/* ── PAGE 5: Results ── */}
        {page==="results" && (
          <div>
            {/* AQ Banner */}
            <div style={{background:`linear-gradient(135deg,${typeCol}14,${typeCol}06)`,border:`1px solid ${typeCol}44`,borderRadius:14,padding:"20px 24px",marginBottom:18,display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
              <AQGauge aq={curResult.aq}/>
              <div style={{flex:1,minWidth:200}}>
                <div style={{fontSize:11,color:C.muted,...fnt,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>
                  {session==="pre"?"Pre-Intervention":"Post-Intervention"} Classification
                </div>
                <div style={{fontSize:26,fontWeight:800,color:typeCol,letterSpacing:"-0.02em",...fnt}}>{curResult.type} Aphasia</div>
                <div style={{fontSize:13,color:C.muted,marginTop:4,...fnt}}>Severity: <span style={{color:curResult.aq>=75?C.green:curResult.aq>=50?C.accent:C.red,fontWeight:700}}>{curResult.sev}</span></div>
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

            {aiError && <div style={{padding:"10px 14px",background:C.red+"18",border:`1px solid ${C.red}44`,borderRadius:7,fontSize:12,color:C.red,...fnt,marginBottom:12}}>{aiError}</div>}

            <button onClick={runAnalysis} disabled={aiLoading} style={{
              width:"100%",padding:"14px",border:"none",borderRadius:9,color:C.white,fontSize:14,fontWeight:800,cursor:aiLoading?"not-allowed":"pointer",...fnt,
              background:aiLoading?C.tealDim:`linear-gradient(135deg,#7c3aed,#06b6d4)`,
              boxShadow:aiLoading?"none":"0 4px 24px #7c3aed44",transition:"all 0.2s"
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
                  <p style={{margin:0,fontSize:13,lineHeight:1.8,color:C.text,...fnt}}>{aiResult.clinical_summary}</p>
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
                      <div style={{marginTop:10,padding:"8px 10px",background:C.surface,borderRadius:6,fontSize:11,color:C.muted,...fnt,fontStyle:"italic"}}>AVC pattern: {aiResult.auditory_comprehension_profile}</div>
                    )}
                  </Card>

                  {/* Paraphasias */}
                  <Card title="Paraphasia Inventory" icon="◉" accent={C.red}>
                    {(!aiResult.paraphasias||aiResult.paraphasias.length===0)?
                      <p style={{color:C.muted,fontSize:12,...fnt}}>No significant paraphasias identified in this profile.</p>:
                      aiResult.paraphasias.map((p,i)=>(
                        <div key={i} style={{background:C.surface,borderRadius:7,padding:"10px 12px",marginBottom:8,border:`1px solid ${C.red}22`}}>
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
                    <p style={{margin:0,fontSize:13,lineHeight:1.8,color:C.text,...fnt}}>{aiResult.bilingual_notes}</p>
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
                      <p style={{margin:0,fontSize:12,color:C.text,...fnt,lineHeight:1.7}}>{aiResult.home_programme}</p>
                    </div>
                  )}
                </Card>

                {/* Progress & Prognosis */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  {aiResult.progress_notes && (
                    <Card title="Progress Notes (Pre → Post)" icon="📈" accent={C.blue}>
                      <p style={{margin:0,fontSize:13,lineHeight:1.8,color:C.text,...fnt}}>{aiResult.progress_notes}</p>
                    </Card>
                  )}
                  <Card title="Prognosis" icon="🔮" accent={C.purple}>
                    <p style={{margin:0,fontSize:13,lineHeight:1.8,color:C.text,...fnt}}>{aiResult.prognosis}</p>
                    <div style={{marginTop:10,padding:"8px 10px",background:C.surface,borderRadius:6,fontSize:11,color:C.muted,...fnt,fontStyle:"italic"}}>
                      ⚠ AI-generated. For clinical use only under supervision of a qualified SLP.
                    </div>
                  </Card>
                </div>

                <button onClick={runAnalysis} disabled={aiLoading} style={{
                  width:"100%",marginTop:4,padding:"11px",border:`1px solid ${C.tealDim}`,borderRadius:8,color:C.teal,fontSize:12,fontWeight:700,cursor:"pointer",...fnt,
                  background:C.tealDim,transition:"all 0.2s"
                }}>
                  ↺ Re-run Analysis
                </button>
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

      {/* ── Contributor Footer ── */}
      <div style={{marginTop:48,borderTop:`1px solid ${C.border}`,background:C.surface}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"20px 28px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:20}}>
          <div>
            <div style={{fontSize:10,color:C.muted,...fnt,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Clinical Contributor</div>
            <div style={{fontSize:13,color:C.white,fontWeight:700,...fnt}}>Mr. Hemaraja Nayaka S.</div>
            <div style={{fontSize:11,color:C.muted,...fnt,marginTop:2}}>MSc (SLP) · Dip. in HA & ET – AIISH</div>
            <div style={{fontSize:11,color:C.muted,...fnt}}>Associate Professor · Dept. of Audiology & Speech-Language Pathology</div>
            <div style={{fontSize:11,color:C.muted,...fnt}}>Yenepoya Medical College Hospital, Mangaluru</div>
          </div>
          <div>
            <div style={{fontSize:10,color:C.muted,...fnt,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Contact</div>
            <div style={{fontSize:11,color:C.muted,...fnt}}>📞 0824-2204667 Ext. 2229 &nbsp;|&nbsp; 📱 9449499659</div>
            <div style={{fontSize:11,color:C.muted,...fnt,marginTop:2}}>RCI: A30294 &nbsp;|&nbsp; ISHA: L-13072161</div>
            <div style={{display:"flex",gap:10,marginTop:8,flexWrap:"wrap"}}>
              {[["Scholar","https://scholar.google.com"],["ORCID","https://orcid.org"],["GitHub","https://github.com"],["LinkedIn","https://linkedin.com"]].map(([l,h])=>(
                <a key={l} href={h} target="_blank" rel="noreferrer"
                  style={{fontSize:11,color:C.teal,background:`${C.teal}14`,border:`1px solid ${C.teal}33`,borderRadius:5,padding:"2px 9px",textDecoration:"none",...fnt,fontWeight:600}}>
                  {l}
                </a>
              ))}
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:C.muted,...fnt,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Tool</div>
            <div style={{fontSize:13,color:C.teal,fontWeight:800,...fnt}}>AphasiaLens v2.0</div>
            <div style={{fontSize:10,color:C.muted,...fnt,marginTop:2}}>Powered by Sarvam AI · Claude (Anthropic)</div>
            <div style={{fontSize:10,color:C.muted,...fnt,marginTop:1}}>For clinical use under qualified SLP supervision</div>
          </div>
        </div>
      </div>
    </div>
  );
}
