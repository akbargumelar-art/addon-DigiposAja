import { POST as action } from "../route";
export async function POST(request:Request, context:{params:{id:string}}){return action(new Request(request.url,{method:"POST",body:JSON.stringify({action:"cancel"}),headers:{"content-type":"application/json"}}),context);}
