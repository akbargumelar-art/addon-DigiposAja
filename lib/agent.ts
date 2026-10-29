export type AgentHealth="ONLINE"|"OFFLINE"|"NOT_CONFIGURED";
export interface WindowsAgentClient{health():Promise<AgentHealth>;digiposInquiry(input:unknown):Promise<unknown>;digiposExecute(input:unknown):Promise<unknown>;selloutExecuteOne(input:unknown):Promise<unknown>}
export class MockWindowsAgentClient implements WindowsAgentClient{async health(){return "NOT_CONFIGURED" as const}async digiposInquiry(){return {status:"MOCK",message:"Windows Agent mock boundary"}}async digiposExecute(){return {status:"MOCK",message:"Live disabled"}}async selloutExecuteOne(){return {status:"MOCK",message:"Live disabled"}}}
export class NotConfiguredWindowsAgentClient extends MockWindowsAgentClient{}
export function getWindowsAgentClient():WindowsAgentClient{return process.env.ALLOW_LIVE_TRANSACTIONS==="true"?new NotConfiguredWindowsAgentClient():new MockWindowsAgentClient()}
