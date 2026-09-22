import { getStore } from '@netlify/blobs';

const headers={
  'content-type':'application/json; charset=utf-8',
  'cache-control':'no-store',
  'x-content-type-options':'nosniff'
};
const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});

export default async req=>{
  const store=getStore({name:'wochenaufgaben',region:'eu-central-1',consistency:'strong'});
  const current=await store.get('family-state',{type:'json'});

  if(req.method==='GET')return reply(current||{revision:0,updatedAt:null,document:null});
  if(req.method!=='PUT')return reply({error:'Methode nicht erlaubt'},405);

  let body;
  try{body=await req.json()}catch{return reply({error:'Ungültige Daten'},400)}
  if(!body?.document||typeof body.baseRevision!=='number')return reply({error:'Ungültige Daten'},400);
  if(JSON.stringify(body.document).length>500000)return reply({error:'Datenbestand zu groß'},413);
  const revision=current?.revision||0;
  if(body.baseRevision!==revision)return reply({error:'Konflikt',current},409);

  const next={revision:revision+1,updatedAt:new Date().toISOString(),document:body.document};
  await store.setJSON('family-state',next);
  return reply(next);
};

export const config={path:'/api/family-state'};
