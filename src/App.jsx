import { useState, useEffect, useRef, useCallback } from "react";
import { RECIPES } from "../recipes-data.js";

const C = {
  navy:"#2c3e50",navyDeep:"#0f1923",navyMid:"#1e2f3d",slate:"#5b7a99",slateLight:"#8aadc4",slatePale:"#dce8f0",
  sage:"#6b8f71",sageDark:"#4a6b50",sagePale:"#d4e6d6",sageLight:"#a8c9ab",
  cream:"#f5f2ec",creamDeep:"#ece7dd",stone:"#c8bfb0",text:"#2a2a2a",textMid:"#5a5a5a",textLight:"#8a8a8a",white:"#ffffff",
  warn:"#c4763a",warnPale:"#f5e6d4",gold:"#c8b89a",goldLight:"#e2d9cc",
};
const FD="'Inter','Segoe UI',system-ui,-apple-system,sans-serif";
const FB="'Inter','Segoe UI',system-ui,-apple-system,sans-serif";


const CATS=[...new Set(RECIPES.map(r=>r.category))];
const API="/api";
const aGet=async p=>{try{const r=await fetch(API+p);return r.ok?r.json():null}catch{return null}};
const aPost=async(p,b)=>{try{const r=await fetch(API+p,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)});return r.ok?r.json():null}catch{return null}};
const aDel=async p=>{try{const r=await fetch(API+p,{method:"DELETE"});return r.ok}catch{return false}};

const SHELF={
  "flounder":"1–2 days","cod":"1–2 days","turbot":"1–2 days","fish fillets":"1–2 days",
  "lump crabmeat":"1–2 days","shrimp":"1–2 days","clams":"2–3 days","mussels":"1–2 days",
  "imitation crabmeat":"3–5 days","chicken breast":"1–2 days","chicken thighs":"1–2 days",
  "ground beef":"1–2 days","beef chuck":"3–5 days","beef pot roast":"3–5 days",
  "pork chops":"3–5 days","lamb chops":"3–5 days","veal":"1–2 days",
  "spinach":"3–5 days","parsley":"3–5 days","chives":"5–7 days","green onion":"5–7 days",
  "green onions":"5–7 days","scallion":"5–7 days","scallions":"5–7 days",
  "mushrooms":"5–7 days","asparagus":"3–4 days","broccoli":"3–5 days",
  "zucchini":"4–5 days","eggplant":"5–7 days","tomato":"5–7 days",
  "celery":"1–2 weeks","green pepper":"1–2 weeks","red pepper":"1–2 weeks",
  "red cabbage":"1–2 weeks","cauliflower":"1–2 weeks","cabbage":"1–2 weeks",
  "carrot":"3–4 weeks","onion":"3–4 weeks","heavy cream":"7–10 days","cream":"7–10 days",
  "vegetable juice":"7–10 days (once opened)",
};
const shelfLife=ing=>{
  const key=Object.keys(SHELF).find(k=>ing.toLowerCase().includes(k.toLowerCase()));
  return key?SHELF[key]:null;
};
const ingKey=s=>s.toLowerCase().replace(/^[\d\s½¾⅓⅔¼⅛⅜⅝⅞\/\-.,()]+/,"").replace(/\b(lbs?|ozs?|cups?|tbsps?|tsps?|tablespoons?|teaspoons?|cloves?|cans?|jars?|bunches?|heads?|pieces?|quarts?|pints?|bottles?|large|medium|small|whole|fresh|dried|ground|grated|minced|chopped|sliced|diced|cubed|trimmed|peeled|g|kg|ml|l)\b\s*/gi,"").replace(/,.*$/,"").trim();

const S={
  page:{minHeight:"100vh",background:C.cream,fontFamily:FB,color:C.text},
  hdr:{background:C.navyDeep,padding:"32px 32px 28px",borderBottom:`1px solid rgba(200,184,154,.12)`},
  nav:{background:C.navyDeep,position:"sticky",top:0,zIndex:50,borderBottom:`1px solid rgba(255,255,255,.06)`},
  wrap:{maxWidth:760,margin:"0 auto",padding:"28px 16px 80px"},
  card:{background:C.white,border:`1px solid ${C.slatePale}`,borderRadius:14,overflow:"hidden",boxShadow:"0 2px 12px rgba(44,62,80,.08)",cursor:"pointer",transition:"transform .18s,box-shadow .18s"},
  btn:(v="primary")=>({padding:"10px 20px",borderRadius:8,fontSize:14,fontFamily:FB,cursor:"pointer",border:"none",transition:"all .15s",fontWeight:500,...(v==="primary"?{background:C.slate,color:C.white}:v==="sage"?{background:C.sage,color:C.white}:v==="ghost"?{background:"transparent",border:`1px solid ${C.slateLight}`,color:C.slate}:v==="danger"?{background:"#e05a4a",color:C.white}:{})}),
  inp:{padding:"10px 14px",borderRadius:8,border:`1px solid ${C.slatePale}`,fontSize:15,fontFamily:FB,color:C.text,background:C.white,outline:"none",width:"100%",boxSizing:"border-box"},
  lbl:{fontSize:12,textTransform:"uppercase",letterSpacing:1.5,color:C.slateLight,display:"block",marginBottom:6},
  tag:(c="slate")=>({display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:12,background:c==="sage"?C.sagePale:c==="warn"?C.warnPale:C.slatePale,color:c==="sage"?C.sageDark:c==="warn"?C.warn:C.slate}),
};

function RecipeCard({recipe,onClick}){
  const tc=recipe.cookTime<=30?C.sageDark:recipe.cookTime<=60?C.warn:C.slate;
  return(
    <div onClick={()=>onClick(recipe)} style={S.card}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(44,62,80,.15)"}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 2px 12px rgba(44,62,80,.08)"}}>
      {recipe.image&&<div style={{height:160,overflow:"hidden",background:C.slatePale}}><img src={recipe.image} alt={recipe.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.currentTarget.style.display="none"}/></div>}
      <div style={{padding:"16px 18px"}}>
        <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:2,color:C.slateLight,marginBottom:5}}>{recipe.category}</div>
        <div style={{fontFamily:FD,fontSize:19,fontWeight:600,color:C.navyDeep,lineHeight:1.25,marginBottom:10}}>{recipe.name}</div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:13,color:tc,fontWeight:600}}>⏰ {recipe.cookTime} min</span>
          <span style={{fontSize:13,color:C.textMid}}>🔥 {recipe.calories} cal</span>
          <span style={{fontSize:13,color:C.textMid}}>💪 {recipe.protein}g protein</span>
          {recipe.planAhead&&<span style={{...S.tag("warn"),fontSize:11}}>Plan ahead</span>}
          {recipe.isCustom&&<span style={{...S.tag("sage"),fontSize:11}}>Custom</span>}
        </div>
      </div>
    </div>
  );
}

function RecipeDetail({recipe,onBack,onDelete}){
  const tc=recipe.cookTime<=30?C.sageDark:recipe.cookTime<=60?C.warn:C.slate;
  return(
    <div>
      <button onClick={onBack} style={{...S.btn("ghost"),marginBottom:20,display:"flex",alignItems:"center",gap:6}}>← Back</button>
      <div style={{background:C.white,borderRadius:18,overflow:"hidden",boxShadow:"0 4px 24px rgba(44,62,80,.10)",border:`1px solid ${C.slatePale}`}}>
        {recipe.image&&<div style={{height:280,overflow:"hidden",background:C.slatePale}} className="recipe-hero"><img src={recipe.image} alt={recipe.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.currentTarget.parentElement.style.display="none"}/></div>}
        <div style={{padding:"28px 28px 32px"}} className="recipe-card-body">
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:2,color:C.slateLight,marginBottom:8}}>{recipe.category}</div>
            <div style={{fontFamily:FD,fontSize:32,fontWeight:600,color:C.navyDeep,lineHeight:1.15,marginBottom:12}} className="recipe-name">{recipe.name}</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {recipe.serves&&<span style={S.tag("slate")}>Serves {recipe.serves}</span>}
              {recipe.planAhead&&<span style={S.tag("warn")}>📌 Plan ahead</span>}
              {recipe.isCustom&&<span style={S.tag("sage")}>Custom recipe</span>}
            </div>
          </div>
          <div style={{background:`linear-gradient(135deg,${C.navyDeep},${C.navy})`,borderRadius:12,padding:"18px 20px",marginBottom:24,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(90px,1fr))",gap:12}}>
            {[["⏰",recipe.cookTime+" min","Cook time"],["🔥",recipe.calories,"Calories"],["💪",recipe.protein+"g","Protein"],["🐄",recipe.fat+"g","Fat"],["🌾",recipe.carbs+"g","Carbs"]].map(([icon,val,lbl])=>(
              <div key={lbl} style={{textAlign:"center"}}>
                <div style={{fontSize:20,marginBottom:2}}>{icon}</div>
                <div style={{fontSize:20,fontWeight:700,color:C.slateLight,fontFamily:FD}}>{val}</div>
                <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:1,color:"rgba(255,255,255,.45)",marginTop:2}}>{lbl}</div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28}} className="recipe-2col">
            <div>
              <div style={{fontFamily:FD,fontSize:20,fontWeight:600,color:C.navyDeep,marginBottom:14,borderBottom:`2px solid ${C.slatePale}`,paddingBottom:8}}>Ingredients</div>
              <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:8}}>
                {(recipe.ingredients||[]).map((ing,i)=>(
                  <li key={i} style={{display:"flex",alignItems:"flex-start",gap:8,fontSize:15}}>
                    <span style={{width:7,height:7,borderRadius:"50%",background:(recipe.perishable||[]).some(p=>ing.toLowerCase().includes(p.toLowerCase()))?C.warn:C.sageLight,flexShrink:0,marginTop:7}}/>
                    <span>{ing}</span>
                    {(recipe.perishable||[]).some(p=>ing.toLowerCase().includes(p.toLowerCase()))&&<span style={{fontSize:10,color:C.warn,alignSelf:"center"}}>{shelfLife(ing)?`use within ${shelfLife(ing)}`:"use soon"}</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{fontFamily:FD,fontSize:20,fontWeight:600,color:C.navyDeep,marginBottom:14,borderBottom:`2px solid ${C.slatePale}`,paddingBottom:8}}>Directions</div>
              <ol style={{padding:0,margin:0,listStyle:"none",display:"flex",flexDirection:"column",gap:12}}>
                {(recipe.directions||[]).map((step,i)=>(
                  <li key={i} style={{display:"flex",gap:12,fontSize:14,lineHeight:1.6}}>
                    <span style={{width:26,height:26,borderRadius:"50%",background:C.navy,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0,marginTop:2}}>{i+1}</span>
                    <span style={{color:C.textMid}}>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          {recipe.note&&<div style={{marginTop:24,background:C.slatePale,borderRadius:10,padding:"14px 18px",borderLeft:`3px solid ${C.slate}`}}><div style={{fontSize:11,textTransform:"uppercase",letterSpacing:1.5,color:C.slate,marginBottom:4}}>Notes</div><div style={{fontSize:14,color:C.textMid,lineHeight:1.6}}>{recipe.note}</div></div>}
          {recipe.isCustom&&<div style={{marginTop:24,paddingTop:20,borderTop:`1px solid ${C.slatePale}`,display:"flex",justifyContent:"flex-end"}}><button onClick={()=>onDelete(recipe.id)} style={S.btn("danger")}>Delete Recipe</button></div>}
        </div>
      </div>
    </div>
  );
}

function ImportRecipeModal({onSave,onCancel}){
  const[mode,setMode]=useState("choice");
  const[url,setUrl]=useState("");
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState("");
  const[preview,setPreview]=useState(null);
  const fileRef=useRef(null);

  const importUrl=async()=>{
    if(!url.trim())return;
    setErr("");setLoading(true);
    try{
      const r=await fetch("/api/import/url",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:url.trim()})});
      const data=await r.json();
      if(!r.ok)throw new Error(data.error||"Import failed");
      setPreview(data);setMode("preview");
    }catch(e){setErr(e.message);}
    setLoading(false);
  };

  const importPhoto=async(file)=>{
    setErr("");setLoading(true);
    try{
      const b64=await new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.onerror=rej;fr.readAsDataURL(file);});
      const r=await fetch("/api/import/photo",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:b64})});
      const data=await r.json();
      if(!r.ok)throw new Error(data.error||"Import failed");
      setPreview(data);setMode("preview");
    }catch(e){setErr(e.message);}
    setLoading(false);
  };

  const save=async()=>{
    setLoading(true);
    const r=await fetch("/api/recipes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(preview)});
    const saved=await r.json();
    setLoading(false);
    if(r.ok)onSave(saved);
    else setErr(saved.error||"Save failed");
  };

  const overlay={position:"fixed",inset:0,background:"rgba(26,38,52,.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20};
  const modal={background:C.cream,borderRadius:16,padding:"28px 32px",maxWidth:540,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.3)"};

  return(
    <div style={overlay} onClick={e=>{if(e.target===e.currentTarget)onCancel();}}>
      <div style={modal}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontFamily:FD,fontSize:22,fontWeight:700,color:C.navyDeep}}>Import a Recipe</div>
          <button onClick={onCancel} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.textMid,lineHeight:1}}>✕</button>
        </div>

        {mode==="choice"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{fontSize:14,color:C.textMid,marginBottom:4}}>Paste a link to any recipe website, or upload a photo of a printed recipe.</div>
            <div>
              <label style={S.lbl}>Recipe URL</label>
              <div style={{display:"flex",gap:8}}>
                <input style={{...S.inp,flex:1}} value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&importUrl()} placeholder="https://www.allrecipes.com/recipe/..."/>
                <button onClick={importUrl} disabled={loading||!url.trim()} style={{...S.btn("sage"),whiteSpace:"nowrap",opacity:loading||!url.trim()?.5:1}}>{loading?"Reading…":"Import"}</button>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{flex:1,height:1,background:C.slatePale}}/>
              <span style={{fontSize:13,color:C.textLight}}>or</span>
              <div style={{flex:1,height:1,background:C.slatePale}}/>
            </div>
            <div>
              <label style={S.lbl}>Upload a photo of a recipe</label>
              <div onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${C.slatePale}`,borderRadius:12,padding:"24px 16px",textAlign:"center",cursor:"pointer",background:C.white,transition:"border-color .15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.slate} onMouseLeave={e=>e.currentTarget.style.borderColor=C.slatePale}>
                {loading?<div style={{color:C.textMid,fontSize:14}}>Analyzing photo…</div>:<><div style={{fontSize:28,marginBottom:6}}>📷</div><div style={{fontSize:14,color:C.textMid}}>Click to upload a photo</div><div style={{fontSize:12,color:C.textLight,marginTop:4}}>JPG, PNG, HEIC — any recipe photo or scan</div></>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>e.target.files[0]&&importPhoto(e.target.files[0])}/>
            </div>
            {err&&<div style={{color:"#c0392b",fontSize:13,background:"#fdecea",borderRadius:8,padding:"10px 14px"}}>{err}</div>}
          </div>
        )}

        {mode==="preview"&&preview&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{background:C.slatePale,borderRadius:12,padding:"16px 20px"}}>
              <div style={{fontWeight:700,fontSize:18,color:C.navyDeep,marginBottom:4}}>{preview.name}</div>
              <div style={{fontSize:13,color:C.textMid,marginBottom:10}}>{preview.category} · {preview.serves} servings · {preview.cookTime} min</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
                {[["🔥","cal",preview.calories],["💪","pro",preview.protein+"g"],["🐄","fat",preview.fat+"g"],["🌾","carbs",preview.carbs+"g"]].map(([ic,lb,vl])=>(
                  <div key={lb} style={{textAlign:"center",background:C.white,borderRadius:8,padding:"8px 4px"}}>
                    <div style={{fontSize:16}}>{ic}</div>
                    <div style={{fontSize:13,fontWeight:600,color:C.navyDeep}}>{vl}</div>
                    <div style={{fontSize:11,color:C.textLight}}>{lb}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:13,color:C.textMid,marginBottom:4}}><strong>Ingredients:</strong> {(preview.ingredients||[]).slice(0,5).join(", ")}{(preview.ingredients||[]).length>5?`, +${preview.ingredients.length-5} more`:""}</div>
              <div style={{fontSize:13,color:C.textMid}}><strong>Steps:</strong> {preview.directions?.length||0} steps</div>
            </div>
            {err&&<div style={{color:"#c0392b",fontSize:13,background:"#fdecea",borderRadius:8,padding:"10px 14px"}}>{err}</div>}
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button onClick={()=>{setMode("choice");setPreview(null);setErr("");}} style={S.btn("ghost")}>← Try again</button>
              <button onClick={save} disabled={loading} style={{...S.btn("sage"),opacity:loading?.6:1}}>{loading?"Saving…":"Save to Kitchen"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AddRecipeForm({onSave,onCancel}){
  const[form,setForm]=useState({name:"",category:"",cookTime:"",calories:"",fat:"",protein:"",carbs:"",serves:"2",planAhead:false,ingredients:"",directions:"",note:"",image:""});
  const[saving,setSaving]=useState(false);
  const[err,setErr]=useState("");
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const save=async()=>{
    if(!form.name.trim()){setErr("Recipe name is required.");return;}
    setSaving(true);
    const r={...form,cookTime:parseInt(form.cookTime)||30,calories:parseInt(form.calories)||0,fat:parseInt(form.fat)||0,protein:parseInt(form.protein)||0,carbs:parseInt(form.carbs)||0,ingredients:form.ingredients.split("\n").map(s=>s.trim()).filter(Boolean),directions:form.directions.split("\n").map(s=>s.trim()).filter(Boolean),perishable:[]};
    const saved=await aPost("/recipes",r);
    setSaving(false);
    if(saved)onSave(saved);
    else setErr("Could not save — is the server running?");
  };
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <div style={{fontFamily:FD,fontSize:26,fontWeight:600,color:C.navyDeep}}>Add New Recipe</div>
        <button onClick={onCancel} style={S.btn("ghost")}>Cancel</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div style={{gridColumn:"1/-1"}}><label style={S.lbl}>Recipe Name *</label><input style={S.inp} value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Lemon Herb Salmon"/></div>
          <div><label style={S.lbl}>Category</label><select style={S.inp} value={form.category} onChange={e=>set("category",e.target.value)}><option value="">Select…</option>{CATS.map(c=><option key={c} value={c}>{c}</option>)}<option value="Other">Other</option></select></div>
          <div><label style={S.lbl}>Serves</label><input style={S.inp} value={form.serves} onChange={e=>set("serves",e.target.value)} placeholder="2"/></div>
        </div>
        <div><label style={S.lbl}>Photo URL (optional)</label><input style={S.inp} value={form.image} onChange={e=>set("image",e.target.value)} placeholder="Paste an image URL from Google Photos, Imgur, etc."/>{form.image&&<img src={form.image} alt="preview" style={{marginTop:8,height:120,borderRadius:8,objectFit:"cover",border:`1px solid ${C.slatePale}`}} onError={e=>e.currentTarget.style.display="none"}/>}</div>
        <div><label style={S.lbl}>Cook Time &amp; Nutrition</label><div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>{[["cookTime","⏰ Min"],["calories","🔥 Cal"],["protein","💪 Pro"],["fat","🐄 Fat"],["carbs","🌾 Carb"]].map(([k,l])=><div key={k}><div style={{fontSize:11,color:C.textLight,marginBottom:4}}>{l}</div><input style={{...S.inp,textAlign:"center"}} type="number" value={form[k]} onChange={e=>set(k,e.target.value)} placeholder="0"/></div>)}</div></div>
        <div><label style={S.lbl}>Ingredients (one per line)</label><textarea style={{...S.inp,minHeight:120,resize:"vertical"}} value={form.ingredients} onChange={e=>set("ingredients",e.target.value)} placeholder={"1 lb salmon fillets\n2 tbsp olive oil\n1 lemon, sliced"}/></div>
        <div><label style={S.lbl}>Directions (one step per line)</label><textarea style={{...S.inp,minHeight:150,resize:"vertical"}} value={form.directions} onChange={e=>set("directions",e.target.value)} placeholder={"Preheat oven to 400°F.\nPlace salmon in baking dish.\nDrizzle with olive oil and season."}/></div>
        <div><label style={S.lbl}>Notes / Tips (optional)</label><input style={S.inp} value={form.note} onChange={e=>set("note",e.target.value)} placeholder="e.g. Can be made ahead, pairs well with asparagus."/></div>
        <div style={{display:"flex",alignItems:"center",gap:10}}><input type="checkbox" id="pa" checked={form.planAhead} onChange={e=>set("planAhead",e.target.checked)} style={{accentColor:C.slate}}/><label htmlFor="pa" style={{fontSize:14,color:C.textMid,cursor:"pointer"}}>Requires planning ahead (marinating, chilling, etc.)</label></div>
        {err&&<div style={{color:"#c0392b",fontSize:14,background:"#fdecea",borderRadius:8,padding:"10px 14px"}}>{err}</div>}
        <div style={{display:"flex",gap:12,justifyContent:"flex-end"}}><button onClick={onCancel} style={S.btn("ghost")}>Cancel</button><button onClick={save} disabled={saving} style={{...S.btn("sage"),opacity:saving?.6:1}}>{saving?"Saving…":"Save Recipe"}</button></div>
      </div>
    </div>
  );
}


function ChatView({recipes,onView}){
  const GREET="Hey! Tell me what sounds good tonight — how much time you have, what you're in the mood for, ingredients on hand, anything. I'll find the right recipe.";
  const[msgs,setMsgs]=useState([{role:"chef",text:GREET,results:null}]);
  const[input,setInput]=useState("");
  const[thinking,setThinking]=useState(false);
  const[ctx,setCtx]=useState({});
  const endRef=useRef(null);
  const inputRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"})},[msgs,thinking]);

  const parse=(text,prevCtx)=>{
    const lo=text.toLowerCase();
    const next={...prevCtx};

    if(/\b(reset|start over|forget it|never mind|clear|again)\b/.test(lo)) return {reset:true};

    if(/\bunder 30|real(ly)? quick|super fast|asap|30 min|half hour|no time|\b15 min/.test(lo)) next.maxTime=30;
    else if(/\ban? hour|60 min|hour(ish)?|moderate time/.test(lo)) next.maxTime=60;
    else if(/couple (of )?hours?|1[–-]?2 hours?|slow cook|all (the )?time/.test(lo)) next.maxTime=120;
    else if(/\bquick(er|ly)?\b/.test(lo)&&!next.maxTime) next.maxTime=45;

    if(/\bfish\b|seafood|shrimp|crab|flounder|cod|salmon|turbot|shellfish|tuna/.test(lo)) next.cats=["Fish & Seafood"];
    else if(/\bchicken\b|poultry|turkey/.test(lo)) next.cats=["Poultry"];
    else if(/\bbeef\b|\bpork\b|\blamb\b|\bveal\b|\bmeat\b|goulash|meatball|roast/.test(lo)) next.cats=["Meat"];
    else if(/\bveg(gie|etable)?s?\b|broccoli|zucchini|potato|asparagus|casserole|side dish/.test(lo)) next.cats=["Vegetables & Sides"];
    else if(/\bsoup\b|broth|stew/.test(lo)) next.cats=["Soups"];
    else if(/\begg\b|\bcheese\b|quiche/.test(lo)) next.cats=["Eggs & Cheese"];

    if(/\blight\b|low.?cal|under 250|healthy|diet|slim|not (too )?heavy/.test(lo)) next.maxCal=250;
    else if(/\bmoderate\b|medium cal|250.?400|not too (much|indulgent)/.test(lo)) next.maxCal=400;
    else if(/hungry|indulg|comfort|rich|hearty|no limit/.test(lo)) { delete next.maxCal; }

    if(/\bprotein\b|high protein|gains|gym/.test(lo)) next.minProt=25;

    if(/\blight\b|fresh|low cal/.test(lo)) next.sort="cal_asc";
    else if(/comfort|warm|hearty|filling|hungry/.test(lo)) next.sort="cal_desc";
    else if(/protein/.test(lo)) next.sort="prot_desc";
    else if(/quick(er)?|fast(er)?/.test(lo)) next.sort="time_asc";

    const ingWords=lo.split(/\s+/).filter(w=>w.length>3);
    const ingHits=recipes.filter(r=>(r.ingredients||[]).some(ing=>ingWords.some(w=>ing.toLowerCase().includes(w)))||(r.name.toLowerCase().split(" ").some(nw=>nw.length>3&&ingWords.includes(nw))));
    if(ingHits.length>0&&ingHits.length<recipes.length*0.7) next.ingBoost=ingHits.map(r=>r.id);

    return {next,reset:false};
  };

  const filter=(ctx)=>{
    let f=[...recipes];
    if(ctx.maxTime) f=f.filter(r=>r.cookTime<=ctx.maxTime);
    if(ctx.cats) f=f.filter(r=>ctx.cats.includes(r.category));
    if(ctx.maxCal) f=f.filter(r=>r.calories<=ctx.maxCal);
    if(ctx.minProt) f=f.filter(r=>r.protein>=ctx.minProt);
    if(ctx.sort==="cal_asc") f.sort((a,b)=>a.calories-b.calories);
    else if(ctx.sort==="cal_desc") f.sort((a,b)=>b.calories-a.calories);
    else if(ctx.sort==="prot_desc") f.sort((a,b)=>b.protein-a.protein);
    else if(ctx.sort==="time_asc") f.sort((a,b)=>a.cookTime-b.cookTime);
    if(ctx.ingBoost){const s=new Set(ctx.ingBoost);f.sort((a,b)=>(s.has(b.id)?1:0)-(s.has(a.id)?1:0));}
    return f.slice(0,6);
  };

  const reply=(newCtx,results,userText)=>{
    const lo=userText.toLowerCase();
    if(results.length===0) return "Nothing matched that exactly — want to loosen something? Try removing a filter or widening the time.";
    const parts=[];
    if(newCtx.maxTime&&newCtx.maxTime<999) parts.push(`under ${newCtx.maxTime} min`);
    if(newCtx.cats) parts.push(newCtx.cats.join(" or ").toLowerCase());
    if(newCtx.maxCal) parts.push(`under ${newCtx.maxCal} cal`);
    const desc=parts.length?` (${parts.join(", ")})`:"";
    if(results.length<=2) return `Just ${results.length}${desc} — pretty specific! Here${results.length===1?" it is":":"}`;
    const openers=["Here's what I've got","These look good to me","Nice choices tonight","You've got options"];
    return `${openers[Math.floor(Math.random()*openers.length)]}${desc}:`;
  };

  const send=()=>{
    const text=input.trim();
    if(!text||thinking) return;
    setInput("");
    setMsgs(prev=>[...prev,{role:"user",text,results:null}]);
    setThinking(true);
    setTimeout(()=>{
      const {next,reset}=parse(text,ctx);
      if(reset){
        setCtx({});
        setMsgs(prev=>[...prev,{role:"chef",text:"Starting fresh! "+GREET,results:null}]);
        setThinking(false);
        return;
      }
      const results=filter(next);
      const responseText=reply(next,results,text);
      setCtx(next);
      setMsgs(prev=>[...prev,{role:"chef",text:responseText,results:results.length>0?results:null}]);
      setThinking(false);
    },650);
  };

  const handleKey=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}};
  const avatarStyle={width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${C.slate},${C.navyMid})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0};
  const bubbleChef={background:`linear-gradient(135deg,${C.white},${C.slatePale})`,border:`1px solid ${C.slatePale}`,borderRadius:"4px 14px 14px 14px",padding:"12px 16px",maxWidth:"82%",boxShadow:"0 2px 8px rgba(44,62,80,.07)"};
  const bubbleUser={background:`linear-gradient(135deg,${C.slate},${C.navyMid})`,borderRadius:"14px 4px 14px 14px",padding:"10px 16px",maxWidth:"72%",color:C.white,fontSize:14};
  const CHIPS=["Something quick","Fish tonight","Comfort food","High protein","Under 300 cal","Surprise me"];

  return(
    <div style={{maxWidth:600,margin:"0 auto",display:"flex",flexDirection:"column",height:"calc(100vh - 210px)",minHeight:440}}>
      <div style={{fontFamily:FD,fontSize:26,fontWeight:700,color:C.navyDeep,marginBottom:2}}>Chat</div>
      <div style={{fontSize:13,color:C.textMid,marginBottom:14}}>Describe what you're after and I'll find the right recipe — you can keep refining.</div>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:14,paddingBottom:8}}>
        {msgs.map((msg,i)=>(
          <div key={i}>
            {msg.role==="chef"?(
              <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={avatarStyle}>🍳</div>
                <div style={bubbleChef}><div style={{fontSize:15,color:C.navyDeep,lineHeight:1.5}}>{msg.text}</div></div>
              </div>
            ):(
              <div style={{display:"flex",justifyContent:"flex-end"}}>
                <div style={bubbleUser}>{msg.text}</div>
              </div>
            )}
            {msg.results&&(
              <div style={{marginTop:10,paddingLeft:44,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
                {msg.results.map(r=><RecipeCard key={r.id} recipe={r} onClick={onView}/>)}
              </div>
            )}
          </div>
        ))}
        {thinking&&(
          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <div style={avatarStyle}>🍳</div>
            <div style={{...bubbleChef,padding:"14px 18px"}}><span style={{color:C.slateLight,letterSpacing:4,fontSize:18}}>· · ·</span></div>
          </div>
        )}
        <div ref={endRef}/>
      </div>
      {msgs.length<=1&&(
        <div style={{display:"flex",flexWrap:"wrap",gap:8,paddingBottom:10}}>
          {CHIPS.map(c=><button key={c} onClick={()=>{setInput(c);setTimeout(()=>inputRef.current?.focus(),0);}} style={{background:C.white,border:`1px solid ${C.slatePale}`,borderRadius:20,padding:"7px 14px",fontSize:13,color:C.navy,cursor:"pointer",fontFamily:FB}}>{c}</button>)}
        </div>
      )}
      <div style={{display:"flex",gap:10,paddingTop:10,borderTop:`1px solid ${C.slatePale}`}}>
        <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} placeholder="e.g. quick fish dish, under 300 calories…" style={{flex:1,padding:"12px 16px",borderRadius:12,border:`1px solid ${C.slatePale}`,fontSize:14,fontFamily:FB,color:C.text,outline:"none",background:C.white}}/>
        <button onClick={send} disabled={thinking||!input.trim()} style={{...S.btn("sage"),padding:"12px 20px",borderRadius:12,flexShrink:0,opacity:thinking||!input.trim()?0.5:1}}>Send ↑</button>
      </div>
    </div>
  );
}

function SearchView({recipes,onView}){
  const[q,setQ]=useState("");const[mt,setMt]=useState(999);const[mc,setMc]=useState(999);const[cat,setCat]=useState("All");
  const f=recipes.filter(r=>{const lq=q.toLowerCase();const mq=!lq||r.name.toLowerCase().includes(lq)||(r.ingredients||[]).some(i=>i.toLowerCase().includes(lq))||r.category.toLowerCase().includes(lq);return mq&&r.cookTime<=mt&&r.calories<=mc&&(cat==="All"||r.category===cat);});
  return(
    <div>
      <div style={{fontFamily:FD,fontSize:26,fontWeight:600,color:C.navyDeep,marginBottom:20}}>Search Recipes</div>
      <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:24,background:C.white,borderRadius:14,padding:20,border:`1px solid ${C.slatePale}`,boxShadow:"0 2px 12px rgba(44,62,80,.06)"}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name, ingredient, or category…" style={S.inp}/>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["All",...CATS].map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:"5px 14px",borderRadius:20,fontSize:13,cursor:"pointer",fontFamily:FB,transition:"all .15s",background:cat===c?C.navy:C.white,color:cat===c?C.white:C.slate,border:`1px solid ${cat===c?C.navy:C.slatePale}`}}>{c}</button>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div><label style={S.lbl}>Max cook time: {mt===999?"Any":mt+" min"}</label><input type="range" min={15} max={195} step={15} value={mt===999?195:mt} onChange={e=>setMt(+e.target.value>=195?999:+e.target.value)} style={{width:"100%",accentColor:C.slate}}/></div>
          <div><label style={S.lbl}>Max calories: {mc===999?"Any":mc}</label><input type="range" min={50} max={650} step={25} value={mc===999?650:mc} onChange={e=>setMc(+e.target.value>=650?999:+e.target.value)} style={{width:"100%",accentColor:C.slate}}/></div>
        </div>
      </div>
      <div style={{fontSize:13,color:C.textLight,marginBottom:14}}>{f.length} recipe{f.length!==1?"s":""} found</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>{f.map(r=><RecipeCard key={r.id} recipe={r} onClick={onView}/>)}</div>
    </div>
  );
}

function FridgeView({recipes,onView}){
  const all=[...new Set(recipes.flatMap(r=>r.ingredients||[]))].sort();
  const[sel,setSel]=useState(new Set());
  const[srch,setSrch]=useState("");
  const tog=i=>setSel(p=>{const n=new Set(p);n.has(i)?n.delete(i):n.add(i);return n});
  const matches=recipes.map(r=>{const have=(r.ingredients||[]).filter(i=>sel.has(i));const missing=(r.ingredients||[]).filter(i=>!sel.has(i));const pct=r.ingredients?.length?have.length/r.ingredients.length:0;return{...r,have,missing,pct};}).filter(r=>r.pct>0).sort((a,b)=>b.pct-a.pct);
  const vis=all.filter(i=>!srch||i.toLowerCase().includes(srch.toLowerCase()));
  return(
    <div>
      <div style={{fontFamily:FD,fontSize:26,fontWeight:600,color:C.navyDeep,marginBottom:6}}>What's in Your Fridge?</div>
      <div style={{fontSize:14,color:C.textMid,marginBottom:20}}>Check off what you have. We'll show you what you can make.</div>
      <div style={{background:C.white,borderRadius:14,padding:20,border:`1px solid ${C.slatePale}`,marginBottom:24,boxShadow:"0 2px 12px rgba(44,62,80,.06)"}}>
        <input value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Filter ingredients…" style={{...S.inp,marginBottom:14}}/>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,maxHeight:220,overflowY:"auto",paddingBottom:4}}>{vis.map(ing=><button key={ing} onClick={()=>tog(ing)} style={{padding:"5px 14px",borderRadius:20,fontSize:13,cursor:"pointer",fontFamily:FB,transition:"all .15s",background:sel.has(ing)?C.sage:C.white,color:sel.has(ing)?C.white:C.slate,border:`1px solid ${sel.has(ing)?C.sage:C.slatePale}`}}>{sel.has(ing)?"✓ ":""}{ing}</button>)}</div>
        {sel.size>0&&<button onClick={()=>setSel(new Set())} style={{marginTop:12,fontSize:13,color:C.slateLight,background:"none",border:"none",cursor:"pointer",textDecoration:"underline",fontFamily:FB}}>Clear all ({sel.size} selected)</button>}
      </div>
      {matches.length>0&&<div><div style={{fontFamily:FD,fontSize:22,fontWeight:600,color:C.navyDeep,marginBottom:14}}>You Can Make These</div><div style={{display:"flex",flexDirection:"column",gap:12}}>{matches.map(r=><div key={r.id} onClick={()=>onView(r)} style={{...S.card,display:"flex",alignItems:"stretch"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(44,62,80,.14)"}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 2px 12px rgba(44,62,80,.08)"}}><div style={{width:6,background:r.pct>.7?C.sage:r.pct>.4?C.warn:C.slateLight,flexShrink:0,borderRadius:"14px 0 0 14px"}}/><div style={{padding:"14px 18px",flex:1}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}><div style={{fontFamily:FD,fontSize:16,fontWeight:600,color:C.navyDeep}}>{r.name}</div><div style={{fontSize:13,fontWeight:700,color:r.pct>.7?C.sageDark:r.pct>.4?C.warn:C.slate,marginLeft:10,flexShrink:0}}>{Math.round(r.pct*100)}% match</div></div><div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:6}}>{r.have.map(i=><span key={i} style={S.tag("sage")}>✓ {i}</span>)}</div>{r.missing.length>0&&<div style={{fontSize:13,color:C.textLight,fontStyle:"italic"}}>Still need: {r.missing.slice(0,4).join(", ")}{r.missing.length>4?` +${r.missing.length-4} more`:""}</div>}</div></div>)}</div></div>}
      {sel.size>0&&matches.length===0&&<div style={{textAlign:"center",color:C.textLight,fontStyle:"italic",padding:48}}>No matches yet — try adding a few more ingredients.</div>}
    </div>
  );
}

function PairingsView({recipes,onView}){
  const mains=recipes.filter(r=>["Fish & Seafood","Poultry","Meat","Eggs & Cheese"].includes(r.category));
  const sides=recipes.filter(r=>r.category==="Vegetables & Sides");
  const[mid,setMid]=useState(mains[0]?.id);
  const main=mains.find(r=>String(r.id)===String(mid))||mains[0];
  const ranked=sides.map(s=>{const mainKeys=(main?.ingredients||[]).map(ingKey);const shared=(s.ingredients||[]).filter(i=>mainKeys.includes(ingKey(i)));const nc=!(main?.cookTime<45&&s.cookTime<30);return{...s,shared,nc};}).sort((a,b)=>{if(a.nc!==b.nc)return a.nc?-1:1;return b.shared.length-a.shared.length});
  const best=ranked[0];
  const totalCal=(main?.calories||0)+(best?.calories||0);
  const totalTime=Math.max(main?.cookTime||0,best?.cookTime||0);
  return(
    <div>
      <div style={{fontFamily:FD,fontSize:26,fontWeight:600,color:C.navyDeep,marginBottom:6}}>Dinner Pairings</div>
      <div style={{fontSize:14,color:C.textMid,marginBottom:24}}>Pick your main — we'll suggest sides that won't compete for stovetop space at the same time.</div>
      <div style={{marginBottom:20}}><div style={S.lbl}>Choose your main dish</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{mains.map(m=><button key={m.id} onClick={()=>setMid(m.id)} style={{padding:"6px 16px",borderRadius:20,fontSize:14,cursor:"pointer",fontFamily:FB,transition:"all .15s",background:String(mid)===String(m.id)?C.navy:C.white,color:String(mid)===String(m.id)?C.white:C.slate,border:`1px solid ${String(mid)===String(m.id)?C.navy:C.slatePale}`}}>{m.name}</button>)}</div></div>
      {main&&best&&<div style={{background:`linear-gradient(135deg,${C.navyDeep},${C.navy})`,borderRadius:16,padding:"22px 24px",marginBottom:24,boxShadow:"0 6px 24px rgba(26,38,52,.2)"}}>
        <div style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:C.slateLight,marginBottom:12}}>Best pairing</div>
        <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap",marginBottom:16}}>
          <div><div style={{fontSize:11,color:C.slateLight,marginBottom:2}}>Main</div><div style={{fontFamily:FD,fontSize:20,fontWeight:600,color:C.white}}>{main.name}</div></div>
          <div style={{fontSize:24,color:C.slateLight}}>+</div>
          <div><div style={{fontSize:11,color:C.slateLight,marginBottom:2}}>Side</div><div style={{fontFamily:FD,fontSize:20,fontWeight:600,color:C.white}}>{best.name}</div></div>
        </div>
        <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
          <span style={{fontSize:14,color:C.sageLight,fontWeight:600}}>⏰ ~{totalTime} min total</span>
          <span style={{fontSize:14,color:C.slateLight}}>🔥 ~{totalCal} cal combined</span>
          {best.shared.length>0&&<span style={{fontSize:14,color:C.slateLight}}>Shares: {best.shared.slice(0,3).join(", ")}</span>}
        </div>
      </div>}
      <div style={S.lbl}>Other good sides</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>{ranked.slice(1,6).map(s=><div key={s.id} onClick={()=>onView(s)} style={S.card} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(44,62,80,.15)"}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 2px 12px rgba(44,62,80,.08)"}}><div style={{padding:"14px 16px"}}><div style={{fontFamily:FD,fontSize:16,fontWeight:600,color:C.navyDeep,marginBottom:6}}>{s.name}</div><div style={{fontSize:13,color:C.textMid,marginBottom:6}}>⏰ {s.cookTime} min · {s.calories} cal</div>{s.shared.length>0&&<div style={{fontSize:12,color:C.textLight,marginBottom:6,fontStyle:"italic"}}>Shares: {s.shared.slice(0,2).join(", ")}</div>}{!s.nc&&<div style={{fontSize:12,color:C.warn}}>⚠ Both need stovetop at same time</div>}</div></div>)}</div>
    </div>
  );
}

function MealPicker({recipes,exclude,onPick,onClose,title="Pick a meal"}){
  const[q,setQ]=useState("");
  const f=recipes.filter(r=>!exclude.includes(String(r.id))&&(!q||r.name.toLowerCase().includes(q.toLowerCase())||r.category.toLowerCase().includes(q.toLowerCase())));
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(26,38,52,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20}}>
      <div style={{background:C.cream,borderRadius:20,padding:24,maxWidth:480,width:"100%",maxHeight:"82vh",display:"flex",flexDirection:"column",boxShadow:"0 24px 64px rgba(26,38,52,.35)"}}>
        <div style={{fontFamily:FD,fontSize:20,fontWeight:600,color:C.navyDeep,marginBottom:14}}>{title}</div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search recipes…" style={{...S.inp,marginBottom:12}} autoFocus/>
        <div style={{overflowY:"auto",display:"flex",flexDirection:"column",gap:6,flex:1}}>{f.map(r=><button key={r.id} onClick={()=>{onPick(r.id);onClose();}} style={{padding:"10px 14px",borderRadius:10,border:`1px solid ${C.slatePale}`,background:C.white,textAlign:"left",cursor:"pointer",fontSize:14,color:C.navyDeep,fontFamily:FB,transition:"all .15s"}} onMouseEnter={e=>{e.currentTarget.style.background=C.slatePale}} onMouseLeave={e=>{e.currentTarget.style.background=C.white}}><span style={{fontWeight:600}}>{r.name}</span><span style={{fontSize:12,color:C.textLight,marginLeft:8}}>{r.category}</span></button>)}</div>
        <button onClick={onClose} style={{...S.btn("ghost"),marginTop:14}}>Cancel</button>
      </div>
    </div>
  );
}

const catIngredient=ing=>{
  const lo=ing.toLowerCase();
  if(/spinach|mushroom|tomato|celery|parsley|onion|garlic|pepper|zucchini|broccoli|cauliflower|asparagus|eggplant|carrot|cabbage|lettuce|leek|chiv|scallion|herb|lemon|lime|apple|artichoke|avocado|kale|potato|turnip|kohlrabi|pea|corn|bean|raisin|red onion|green onion/.test(lo))return"produce";
  if(/chicken|beef|pork|lamb|veal|turkey|duck|shrimp|fish|salmon|tuna|cod|flounder|turbot|crab|lobster|clam|mussel|scallop|anchov|bacon|sausage|ground/.test(lo))return"meat";
  if(/butter|cream|egg|cheese|milk|yogurt|sour cream|ricotta|mozzarella|parmesan|cheddar|roquefort|half and half|half-and-half|jack|gruy|mascarpone/.test(lo))return"dairy";
  return"pantry";
};

function WeeklyPlanView({recipes,weekPlan,onSetPlan,onView}){
  const[picker,setPicker]=useState(null);
  const[copied,setCopied]=useState(false);
  const[groceryList,setGroceryList]=useState(null);
  const[groceryLoading,setGroceryLoading]=useState(false);
  const[groceryErr,setGroceryErr]=useState("");
  const DAYS=["Monday","Tuesday","Wednesday","Thursday","(Optional 5th)"];

  const getMeal=id=>id?recipes.find(r=>String(r.id)===String(id)):null;
  const getDay=slot=>weekPlan[slot]||[];
  const getMain=slot=>getMeal(getDay(slot)[0]);
  const getDaySides=slot=>getDay(slot).slice(1).map(getMeal).filter(Boolean);

  const filledCount=weekPlan.filter(d=>(d||[]).length>0).length;
  const show5=weekPlan.length>=5||filledCount>=4;
  const slots=[0,1,2,3,...(show5?[4]:[])];
  const meals=weekPlan.flatMap(d=>(d||[]).map(getMeal).filter(Boolean));
  const star=getMain(0);
  const exclude=weekPlan.flatMap(d=>(d||[]).filter(Boolean).map(String));

  const planKey=weekPlan.flatMap(d=>d||[]).sort().join(",");
  const[aiList,setAiList]=useState(false);
  useEffect(()=>{setGroceryList(null);setGroceryErr("");setAiList(false);},[planKey]);

  const suggestions=star?recipes
    .filter(r=>!exclude.includes(String(r.id)))
    .map(r=>{const starKeys=(star.ingredients||[]).map(ingKey);const shared=(r.ingredients||[]).filter(i=>starKeys.includes(ingKey(i)));return{...r,shared};})
    .filter(r=>r.shared.length>1)
    .sort((a,b)=>b.shared.length-a.shared.length)
    .slice(0,6):[];

  const setMain=(slot,id)=>{
    const p=weekPlan.map(d=>[...(d||[])]);
    while(p.length<=slot)p.push([]);
    p[slot]=[id,...(p[slot]||[]).slice(1)];
    onSetPlan(p);setPicker(null);
  };
  const removeDay=slot=>{
    const p=weekPlan.map(d=>[...(d||[])]);
    p[slot]=[];
    while(p.length&&(p[p.length-1]||[]).length===0)p.pop();
    onSetPlan(p);
  };
  const addSide=(slot,id)=>{
    const p=weekPlan.map(d=>[...(d||[])]);
    while(p.length<=slot)p.push([]);
    p[slot]=[...(p[slot]||[]),id];
    onSetPlan(p);setPicker(null);
  };
  const removeSide=(slot,sideIdx)=>{
    const p=weekPlan.map(d=>[...(d||[])]);
    p[slot]=p[slot].filter((_,i)=>i!==sideIdx+1);
    onSetPlan(p);
  };
  const addSuggestion=id=>{
    const idx=weekPlan.findIndex(d=>(d||[]).length===0);
    if(idx>=0)setMain(idx,id);
    else if(weekPlan.length<5)setMain(weekPlan.length,id);
  };

  const generateList=async()=>{
    setGroceryLoading(true);setGroceryErr("");
    try{
      const r=await fetch("/api/grocery-list",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({recipes:meals})});
      if(!r.ok)throw new Error("api");
      setGroceryList(await r.json());setAiList(true);
    }catch{
      const all=[...new Set(meals.flatMap(r=>r.ingredients||[]).map(i=>i.toLowerCase().trim()))];
      const fb={produce:[],meat:[],dairy:[],pantry:[]};
      all.forEach(ing=>fb[catIngredient(ing)].push(ing));
      setGroceryList(fb);setAiList(false);
    }
    setGroceryLoading(false);
  };

  const listData=groceryList||{};
  const copyList=()=>{
    const sections=[["PRODUCE",listData.produce],["MEAT & SEAFOOD",listData.meat],["DAIRY & EGGS",listData.dairy],["PANTRY",listData.pantry]]
      .filter(([,items])=>items?.length>0).map(([title,items])=>`${title}\n${items.join("\n")}`).join("\n\n");
    navigator.clipboard.writeText(sections);
    setCopied(true);setTimeout(()=>setCopied(false),2500);
  };

  return(
    <div>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:FD,fontSize:26,fontWeight:600,color:C.navyDeep,marginBottom:4}}>This Week</div>
        <div style={{fontSize:14,color:C.textMid}}>Mon – Thu dinners. Add a main dish and sides per day — all roll up into your grocery list.</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12,marginBottom:28}}>
        {slots.map(slot=>{
          const main=getMain(slot);
          const sides=getDaySides(slot);
          const isStar=slot===0;
          return(
            <div key={slot} style={{borderRadius:12,border:`1.5px solid ${main?C.slatePale:"#e5e5e5"}`,background:main?C.white:"#fafafa",padding:"14px 16px",minHeight:120,display:"flex",flexDirection:"column",gap:0}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                <span style={{fontSize:11,fontWeight:600,letterSpacing:1.5,textTransform:"uppercase",color:C.slateLight}}>{DAYS[slot]}</span>
                {isStar&&<span style={{fontSize:10,background:"rgba(200,184,154,.18)",color:C.gold,border:`1px solid rgba(200,184,154,.4)`,borderRadius:10,padding:"1px 7px",fontWeight:600,letterSpacing:.5}}>star</span>}
              </div>

              {main?(
                <>
                  <div style={{marginBottom:6}}>
                    <div onClick={()=>onView(main)} style={{fontSize:13,fontWeight:600,color:C.navyDeep,lineHeight:1.35,marginBottom:2,cursor:"pointer"}}>{main.name}</div>
                    <div style={{fontSize:11,color:C.textLight}}>{main.category} · ⏰ {main.cookTime} min</div>
                  </div>

                  {sides.length>0&&(
                    <div style={{borderTop:`1px solid ${C.slatePale}`,marginTop:6,paddingTop:6,display:"flex",flexDirection:"column",gap:4}}>
                      {sides.map((side,si)=>(
                        <div key={side.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:4}}>
                          <div onClick={()=>onView(side)} style={{fontSize:12,color:C.navyDeep,cursor:"pointer",lineHeight:1.3,flex:1}}>+ {side.name}</div>
                          <button onClick={()=>removeSide(slot,si)} style={{fontSize:10,padding:"1px 5px",borderRadius:4,border:`1px solid #e5e5e5`,background:"transparent",cursor:"pointer",color:C.textLight,flexShrink:0}}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{display:"flex",gap:6,marginTop:"auto",paddingTop:10}}>
                    <button onClick={()=>setPicker({slot,mode:"main"})} style={{...S.btn("ghost"),fontSize:11,padding:"4px 10px"}}>Change</button>
                    <button onClick={()=>setPicker({slot,mode:"side"})} style={{...S.btn("ghost"),fontSize:11,padding:"4px 10px"}}>+ Side</button>
                    <button onClick={()=>removeDay(slot)} style={{fontSize:11,padding:"4px 8px",borderRadius:6,border:`1px solid #e5e5e5`,background:"transparent",cursor:"pointer",color:C.textLight,marginLeft:"auto"}}>✕</button>
                  </div>
                </>
              ):(
                <button onClick={()=>setPicker({slot,mode:"main"})} style={{width:"100%",padding:"10px 0",borderRadius:8,border:`1.5px dashed ${C.slatePale}`,background:"transparent",cursor:"pointer",fontSize:13,color:C.slateLight,marginTop:"auto"}}>+ Pick a meal</button>
              )}
            </div>
          );
        })}
        {!show5&&filledCount>0&&(
          <div style={{borderRadius:12,border:`1.5px dashed #e5e5e5`,background:"transparent",padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <button onClick={()=>{const p=weekPlan.map(d=>[...(d||[])]);while(p.length<5)p.push([]);onSetPlan(p);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:C.slateLight}}>+ 5th meal</button>
          </div>
        )}
      </div>

      {star&&meals.length<5&&suggestions.length>0&&(
        <div style={{marginBottom:28}}>
          <div style={{fontSize:12,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:C.slateLight,marginBottom:10}}>Pairs well with your star — shares ingredients</div>
          <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8}}>
            {suggestions.map(r=>(
              <div key={r.id} style={{background:C.white,border:`1px solid ${C.slatePale}`,borderRadius:10,padding:"12px 14px",minWidth:190,flexShrink:0,display:"flex",flexDirection:"column",gap:4}}>
                <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:1.5,color:C.slateLight}}>{r.category}</div>
                <div style={{fontSize:13,fontWeight:600,color:C.navyDeep,lineHeight:1.3}}>{r.name}</div>
                <div style={{fontSize:11,color:C.textMid,marginBottom:6}}>{r.shared.length} shared ingredient{r.shared.length>1?"s":""}</div>
                <button onClick={()=>addSuggestion(r.id)} style={{...S.btn("sage"),fontSize:11,padding:"5px 12px",alignSelf:"flex-start"}}>+ Add to week</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {meals.length>0&&(
        <div style={{background:C.white,border:`1px solid ${C.slatePale}`,borderRadius:14,padding:"20px 24px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,gap:12,flexWrap:"wrap"}}>
            <div>
              <div style={{fontFamily:FD,fontSize:20,fontWeight:600,color:C.navyDeep}}>Grocery List</div>
              {!groceryList&&!groceryLoading&&<div style={{fontSize:12,color:C.textLight,marginTop:2}}>Sorted by category, quantities when AI is available</div>}
              {groceryList&&!aiList&&<div style={{fontSize:12,color:C.textLight,marginTop:2}}>Categorized list — add credits to your OpenAI key for quantities</div>}
              {groceryList&&aiList&&<div style={{fontSize:12,color:C.textLight,marginTop:2}}>AI-generated with quantities</div>}
            </div>
            <div style={{display:"flex",gap:8}}>
              {groceryList&&<button onClick={copyList} style={{...S.btn(copied?"sage":"ghost"),fontSize:13,padding:"7px 16px"}}>{copied?"✓ Copied!":"Copy list"}</button>}
              <button onClick={generateList} disabled={groceryLoading} style={{...S.btn("sage"),fontSize:13,padding:"7px 16px",opacity:groceryLoading?.7:1}}>
                {groceryLoading?"Building list…":groceryList?"Regenerate":"Build list"}
              </button>
            </div>
          </div>
          {groceryErr&&<div style={{color:C.warn,fontSize:13,marginBottom:12}}>{groceryErr}</div>}
          {groceryLoading&&<div style={{textAlign:"center",padding:"32px 0",color:C.textLight,fontSize:14,fontStyle:"italic"}}>Calculating quantities for {meals.length} meal{meals.length>1?"s":""}…</div>}
          {groceryList&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:20}}>
              {[["Produce",listData.produce,C.sage],["Meat & Seafood",listData.meat,C.warn],["Dairy & Eggs",listData.dairy,C.slate],["Pantry",listData.pantry,C.stone]].filter(([,items])=>items?.length>0).map(([title,items,color])=>(
                <div key={title}>
                  <div style={{fontSize:11,fontWeight:600,letterSpacing:1.5,textTransform:"uppercase",color,marginBottom:8,borderBottom:`1px solid ${C.slatePale}`,paddingBottom:6}}>{title}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:5}}>
                    {items.map((line,i)=>{
                      const [ing,...rest]=line.split("—");
                      const qty=rest.join("—").trim();
                      return(
                        <div key={i} style={{fontSize:13,color:C.text,display:"flex",justifyContent:"space-between",gap:8,alignItems:"baseline"}}>
                          <span>{ing.trim()}</span>
                          {qty&&<span style={{fontSize:12,color:C.textLight,flexShrink:0}}>{qty}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          {!groceryList&&!groceryLoading&&(
            <div style={{textAlign:"center",padding:"28px 0",color:C.textLight,fontSize:14}}>
              Hit "Build list" to get your consolidated grocery list.
            </div>
          )}
        </div>
      )}

      {picker!==null&&<MealPicker
        recipes={picker.mode==="side"?recipes.filter(r=>r.category==="Vegetables & Sides"):recipes}
        exclude={exclude}
        title={picker.mode==="side"?"Pick a side dish":"Pick a meal"}
        onPick={id=>picker.mode==="side"?addSide(picker.slot,id):setMain(picker.slot,id)}
        onClose={()=>setPicker(null)}/>}
    </div>
  );
}

function CookView({recipes,weekPlan,onView}){
  const DAYS=["Monday","Tuesday","Wednesday","Thursday","(5th)"];
  const lookup=id=>recipes.find(r=>String(r.id)===String(id));

  const planned=weekPlan
    .map((day,slot)=>({slot,day:DAYS[slot],ids:day||[]}))
    .filter(({ids})=>ids.length>0);

  if(planned.length===0){
    return(
      <div style={{textAlign:"center",padding:"72px 24px"}}>
        <div style={{fontSize:56,marginBottom:16}}>👨‍🍳</div>
        <div style={{fontFamily:FD,fontSize:22,fontWeight:600,color:C.navyDeep,marginBottom:8}}>Nothing planned yet</div>
        <div style={{fontSize:15,color:C.textMid}}>Add meals on the This Week tab first, then come back here to cook.</div>
      </div>
    );
  }

  return(
    <div>
      <div style={{marginBottom:28}}>
        <div style={{fontFamily:FD,fontSize:26,fontWeight:600,color:C.navyDeep,marginBottom:4}}>Cook</div>
        <div style={{fontSize:14,color:C.textMid}}>Tap any dish to pull up the full recipe.</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:28}}>
        {planned.map(({slot,day,ids})=>{
          const mainR=lookup(ids[0]);
          const sideRs=ids.slice(1).map(lookup).filter(Boolean);
          return(
            <div key={slot}>
              <div style={{fontSize:12,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:C.slateLight,marginBottom:12}}>{day}</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {mainR&&(
                  <div onClick={()=>onView(mainR)} style={{...S.card,cursor:"pointer",display:"flex",alignItems:"stretch"}}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(44,62,80,.14)"}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 2px 12px rgba(44,62,80,.08)"}}>
                    <div style={{width:5,background:C.sage,flexShrink:0,borderRadius:"14px 0 0 14px"}}/>
                    <div style={{padding:"16px 20px",flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                        <div>
                          <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:1.5,color:C.slateLight,marginBottom:4}}>{mainR.category}</div>
                          <div style={{fontFamily:FD,fontSize:20,fontWeight:600,color:C.navyDeep,lineHeight:1.2,marginBottom:8}}>{mainR.name}</div>
                          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                            <span style={{fontSize:13,color:mainR.cookTime<=30?C.sageDark:mainR.cookTime<=60?C.warn:C.slate,fontWeight:600}}>⏰ {mainR.cookTime} min</span>
                            <span style={{fontSize:13,color:C.textMid}}>🔥 {mainR.calories} cal</span>
                            {mainR.planAhead&&<span style={S.tag("warn")}>📌 Plan ahead</span>}
                          </div>
                        </div>
                        <span style={{fontSize:13,color:C.slate,fontWeight:500,whiteSpace:"nowrap",marginTop:2}}>View recipe →</span>
                      </div>
                    </div>
                  </div>
                )}
                {sideRs.map(side=>(
                  <div key={side.id} onClick={()=>onView(side)} style={{...S.card,cursor:"pointer",display:"flex",alignItems:"stretch",marginLeft:24}}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(44,62,80,.14)"}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 2px 12px rgba(44,62,80,.08)"}}>
                    <div style={{width:5,background:C.sageLight,flexShrink:0,borderRadius:"14px 0 0 14px"}}/>
                    <div style={{padding:"12px 18px",flex:1,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                      <div>
                        <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:1.5,color:C.slateLight,marginBottom:3}}>Side · {side.category}</div>
                        <div style={{fontFamily:FD,fontSize:16,fontWeight:600,color:C.navyDeep}}>{side.name}</div>
                        <div style={{fontSize:12,color:C.textMid,marginTop:3}}>⏰ {side.cookTime} min · {side.calories} cal</div>
                      </div>
                      <span style={{fontSize:12,color:C.slate,fontWeight:500,whiteSpace:"nowrap"}}>View →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App(){
  const[recipes,setRecipes]=useState(RECIPES);
  const[tab,setTab]=useState("star");
  const migrateWeekPlan=raw=>{
    if(!Array.isArray(raw))return[[String(RECIPES[9].id)]];
    return raw.map(item=>Array.isArray(item)?item:(item?[item]:[]));
  };
  const[weekPlan,setWeekPlanRaw]=useState(()=>{try{return migrateWeekPlan(JSON.parse(localStorage.getItem("weekPlan")));}catch{return[[String(RECIPES[9].id)]];}}); 
  const setWeekPlan=p=>{setWeekPlanRaw(p);try{localStorage.setItem("weekPlan",JSON.stringify(p));}catch{}};
  const[view,setView]=useState(null);
  const[loading,setLoading]=useState(true);
  const[importing,setImporting]=useState(false);

  useEffect(()=>{
    (async()=>{
      const remote=await aGet("/recipes");
      if(remote&&remote.length>0)setRecipes(remote);
      else if(remote!==null)await aPost("/seed",{recipes:RECIPES});
      setLoading(false);
    })();
  },[]);

  const onView=useCallback(r=>setView({type:"detail",recipe:r}),[]);
  const onSave=useCallback(s=>{setRecipes(p=>[...p,s]);setView(null);},[]);
  const onDel=useCallback(async id=>{
    if(!window.confirm("Delete this recipe?"))return;
    const ok=await aDel(`/recipes/${id}`);
    if(ok){setRecipes(p=>p.filter(r=>String(r.id)!==String(id)));setView(null);}
    else alert("Could not delete — is the server running?");
  },[]);

  const TABS=[{id:"star",label:"📅  This Week"},{id:"cook",label:"👨‍🍳  Cook"},{id:"quiz",label:"💬  Chat"},{id:"search",label:"🔍  Search"},{id:"fridge",label:"🧊  Fridge"},{id:"pairs",label:"🍽  Pairings"}];

  return(
    <div style={S.page}>
      <div style={S.hdr} className="hdr-pad">
        <div style={{maxWidth:800,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}} className="hdr-inner">
          <div style={{display:"flex",alignItems:"baseline",gap:12}}>
            <div style={{fontFamily:FD,fontSize:26,fontWeight:700,color:C.white,letterSpacing:.5,lineHeight:1}}>Karmiol Kitchen</div>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.gold,marginBottom:2,flexShrink:0}}/>
          </div>
          <div style={{display:"flex",gap:10}} className="hdr-buttons">
            <button onClick={()=>setImporting(true)} style={{padding:"9px 18px",borderRadius:6,fontSize:13,fontFamily:FB,cursor:"pointer",fontWeight:500,background:"transparent",border:`1px solid rgba(200,184,154,.35)`,color:C.goldLight,transition:"all .2s",letterSpacing:.3}}>+ Import Recipe</button>
            <button onClick={()=>setView({type:"add"})} style={{padding:"9px 18px",borderRadius:6,fontSize:13,fontFamily:FB,cursor:"pointer",fontWeight:500,background:C.gold,border:"none",color:C.navyDeep,transition:"all .2s",letterSpacing:.3}}>+ Add Recipe</button>
          </div>
        </div>
      </div>
      <div style={S.nav}>
        <div style={{maxWidth:800,margin:"0 auto",display:"flex",overflowX:"auto"}} className="tab-nav">
          {TABS.map(t=><button key={t.id} onClick={()=>{setTab(t.id);setView(null);}} style={{padding:"14px 18px",background:"transparent",border:"none",cursor:"pointer",fontSize:13,fontFamily:FB,fontWeight:500,letterSpacing:.3,color:tab===t.id?C.white:"rgba(255,255,255,.4)",borderBottom:tab===t.id?`2px solid ${C.gold}`:"2px solid transparent",transition:"all .2s",whiteSpace:"nowrap"}}>{t.label}</button>)}
        </div>
      </div>
      {importing&&<ImportRecipeModal onSave={s=>{setRecipes(p=>[...p,s]);setImporting(false);}} onCancel={()=>setImporting(false)}/>}
      <div style={S.wrap} className="page-wrap">
        {loading?<div style={{textAlign:"center",padding:60,color:C.textLight,fontStyle:"italic",fontSize:15}}>Loading recipes…</div>:
         view?.type==="detail"?<RecipeDetail recipe={view.recipe} onBack={()=>setView(null)} onDelete={onDel}/>:
         view?.type==="add"?<AddRecipeForm onSave={onSave} onCancel={()=>setView(null)}/>:
         <>
           {tab==="star"&&<WeeklyPlanView recipes={recipes} weekPlan={weekPlan} onSetPlan={setWeekPlan} onView={onView}/>}
           {tab==="cook"&&<CookView recipes={recipes} weekPlan={weekPlan} onView={onView}/>}
           {tab==="quiz"&&<ChatView recipes={recipes} onView={onView}/>}
           {tab==="search"&&<SearchView recipes={recipes} onView={onView}/>}
           {tab==="fridge"&&<FridgeView recipes={recipes} onView={onView}/>}
           {tab==="pairs"&&<PairingsView recipes={recipes} onView={onView}/>}
         </>}
      </div>
    </div>
  );
}
