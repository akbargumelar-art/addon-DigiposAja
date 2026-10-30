import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main(){const user=await db.user.upsert({where:{username:"demo"},update:{},create:{username:"demo"}});const account=await db.digiposAccount.upsert({where:{id:"acc-demo"},update:{},create:{id:"acc-demo",username:"demo.outlet",userCode:"DEMO001",outletId:"OUTLET-001",phoneMasked:"08******1234",status:"ACTIVE"}});await db.userAccountAccess.upsert({where:{userId_accountId:{userId:user.id,accountId:account.id}},update:{},create:{userId:user.id,accountId:account.id}});}
main().finally(()=>db.$disconnect());
