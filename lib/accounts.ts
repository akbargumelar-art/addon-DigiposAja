export type Account = { id:string; username:string; userCode:string; outletId:string; phoneMasked:string; status:"ACTIVE"|"INACTIVE"; validUntil:string; balance:string };
const accounts: Account[] = [{id:"acc-demo",username:"demo.outlet",userCode:"DEMO001",outletId:"OUTLET-001",phoneMasked:"08******1234",status:"ACTIVE",validUntil:"31 Des 2026",balance:"Rp 1.250.000"}];
export function listAccounts(){ return accounts; }
export function canAccessAccount(accountId:string){ return accounts.some(a=>a.id===accountId && a.status==="ACTIVE"); }
