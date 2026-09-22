import { clearCookie, sessionCookie, verifyPassword, verifySession, verifyUsername } from '../lib/auth.mjs';

const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'};
const reply=(data,status=200,extra={})=>new Response(JSON.stringify(data),{status,headers:{...headers,...extra}});

export default async req=>{
  if(req.method==='GET')return verifySession(req)?reply({authenticated:true}):reply({authenticated:false},401);
  if(req.method==='DELETE')return reply({authenticated:false},200,{'set-cookie':clearCookie()});
  if(req.method!=='POST')return reply({error:'Methode nicht erlaubt'},405);
  let body;
  try{body=await req.json()}catch{return reply({error:'Ungültige Anmeldung'},400)}
  if(!verifyUsername(body?.username||'')||!verifyPassword(body?.password||''))return reply({error:'Benutzername oder Passwort ist falsch'},401);
  return reply({authenticated:true},200,{'set-cookie':sessionCookie()});
};

export const config={path:'/api/auth'};
