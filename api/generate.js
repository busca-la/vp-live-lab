"use strict";
const {timingSafeEqual}=require("node:crypto");
function compare(a,b){if(typeof a!=="string"||typeof b!=="string"||!a||!b)return false;const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y)}
async function handler(req,res){
  res.setHeader("Cache-Control","no-store");
  res.setHeader("X-Content-Type-Options","nosniff");
  if(req.method!=="POST")return res.status(405).json({error:"Método não permitido."});
  const key=process.env.OPENAI_API_KEY,pass=process.env.LIVE_ADMIN_CODE;
  if(!key||!pass)return res.status(503).json({error:"Configure OPENAI_API_KEY e LIVE_ADMIN_CODE na Vercel."});
  if(!compare(req.headers["x-live-code"],pass))return res.status(401).json({error:"Código de acesso incorreto."});
  const {prompt,style,size,quality}=req.body||{};
  if(typeof prompt!=="string"||prompt.trim().length<5||prompt.length>1500)return res.status(400).json({error:"Prompt inválido."});
  const styles={"Cinematográfico":"direção cinematográfica, iluminação atmosférica, composição premium","3D":"renderização 3D premium, materiais detalhados, luz volumétrica","Fotográfico":"fotografia realista e natural com qualidade profissional","Surreal":"arte surreal, original e expressiva","Ilustração":"ilustração editorial com composição refinada"};
  const desc=styles[style]||styles["Cinematográfico"];
  try{
    const upstream=await fetch("https://api.openai.com/v1/images/generations",{method:"POST",headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:process.env.OPENAI_IMAGE_MODEL||"gpt-image-1-mini",n:1,prompt:prompt.trim()+". Direção visual: "+desc+". Sem marca d'água nem interface.",size:["1024x1024","1024x1536","1536x1024"].includes(size)?size:"1024x1536",quality:["low","medium","high"].includes(quality)?quality:"medium",output_format:"webp",output_compression:78}),signal:AbortSignal.timeout(115000)});
    const data=await upstream.json().catch(()=>({}));
    if(!upstream.ok)return res.status(upstream.status===429?429:502).json({error:upstream.status===429?"Limite de uso ou créditos da API atingido.":String(data.error?.message||"A API recusou o pedido.").slice(0,300)});
    const b64=data.data?.[0]?.b64_json;
    if(typeof b64!=="string"||!b64)return res.status(502).json({error:"A API não retornou uma imagem."});
    return res.status(200).json({image:"data:image/webp;base64,"+b64,model:process.env.OPENAI_IMAGE_MODEL||"gpt-image-1-mini"});
  }catch(e){return res.status(502).json({error:e.name==="TimeoutError"?"A imagem demorou demais.":"Não foi possível conectar à API de imagens."})}
}
module.exports=handler;module.exports.compare=compare;