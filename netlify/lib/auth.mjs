import { createHmac, pbkdf2Sync, timingSafeEqual } from 'node:crypto';

const COOKIE='mm_session';
const MAX_AGE=60*60*24*180;
const safeEqual=(a,b)=>{
  const left=Buffer.from(String(a)),right=Buffer.from(String(b));
  return left.length===right.length&&timingSafeEqual(left,right);
};
const b64=value=>Buffer.from(value).toString('base64url');

export function verifyPassword(password){
  const [rounds,salt,expected]=(process.env.APP_PASSWORD_HASH||'').split('$');
  const iterations=Number(rounds);
  if(!iterations||!salt||!expected)return false;
  const actual=pbkdf2Sync(password,salt,iterations,32,'sha256').toString('hex');
  return safeEqual(actual,expected);
}
export function verifyUsername(username){return safeEqual(username,process.env.APP_USERNAME||'')}
export function createSession(){
  const payload=b64(JSON.stringify({exp:Math.floor(Date.now()/1000)+MAX_AGE}));
  const signature=createHmac('sha256',process.env.SESSION_SECRET||'').update(payload).digest('base64url');
  return `${payload}.${signature}`;
}
export function verifySession(req){
  const secret=process.env.SESSION_SECRET||'';
  if(secret.length<32)return false;
  const cookies=req.headers.get('cookie')||'';
  const token=cookies.split(';').map(v=>v.trim()).find(v=>v.startsWith(`${COOKIE}=`))?.slice(COOKIE.length+1);
  if(!token)return false;
  const [payload,signature]=token.split('.');
  if(!payload||!signature)return false;
  const expected=createHmac('sha256',secret).update(payload).digest('base64url');
  if(!safeEqual(signature,expected))return false;
  try{return JSON.parse(Buffer.from(payload,'base64url').toString()).exp>Math.floor(Date.now()/1000)}catch{return false}
}
export const sessionCookie=()=>`${COOKIE}=${createSession()}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`;
export const clearCookie=()=>`${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
