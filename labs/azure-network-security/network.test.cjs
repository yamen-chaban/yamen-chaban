// Offline unit checks only; not an Azure NSG simulator.
const assert = require('node:assert/strict');
const test = require('node:test');
const template = require('./main.json');
const nsg = template.resources.find(r => r.type === 'Microsoft.Network/networkSecurityGroups');
const vnet = template.resources.find(r => r.type === 'Microsoft.Network/virtualNetworks');
const rules = nsg.properties.securityRules.map(r => r.properties).sort((a,b) => a.priority-b.priority);
function ip(s) {
  const parts=s.split('.').map(Number);
  assert.equal(parts.length,4);
  assert(parts.every(n=>Number.isInteger(n)&&n>=0&&n<=255));
  return parts.reduce((n,p)=>n*256+p,0);
}
function match(prefix, address) {
  if(prefix==='*') return true;
  const [base,len]=prefix.split('/');
  const bits=Number(len);
  assert(Number.isInteger(bits)&&bits>=0&&bits<=32);
  const size=2**(32-bits);
  return Math.floor(ip(base)/size)===Math.floor(ip(address)/size);
}
function decision(src,dst,port,protocol) {
  const rule=rules.find(r=>r.direction==='Inbound'&&
    (r.protocol==='*'||r.protocol===protocol)&&
    match(r.sourceAddressPrefix,src)&&match(r.destinationAddressPrefix,dst)&&
    (r.destinationPortRange==='*'||Number(r.destinationPortRange)===port));
  assert(rule,'Expected custom catch-all rule');
  return rule.access;
}
test('app subnet references the NSG',()=>{
  const app=vnet.properties.subnets.find(s=>s.name==='snet-app');
  assert.equal(app.properties.networkSecurityGroup.id,"[resourceId('Microsoft.Network/networkSecurityGroups','nsg-app-lab')]");
  assert(vnet.dependsOn.includes(app.properties.networkSecurityGroup.id));
});
test('subnets are distinct /24 ranges within the VNet',()=>{
  const nets=vnet.properties.subnets.map(s=>s.properties.addressPrefix);
  assert.deepEqual(nets,['10.42.1.0/24','10.42.2.0/24']);
  assert(nets.every(n=>match('10.42.0.0/16',n.split('/')[0])));
  assert(!match(nets[0],nets[1].split('/')[0]));
});
test('custom priorities are unique and ordered',()=>{
  assert.equal(new Set(rules.map(r=>r.priority)).size,rules.length);
  assert(rules.every(r=>r.priority>=100&&r.priority<=4096));
  assert.equal(rules.at(-1).access,'Deny');
});
for (const [name,src,port,proto,expected] of [
  ['management HTTPS','10.42.1.10',443,'Tcp','Allow'],
  ['management SSH','10.42.1.10',22,'Tcp','Deny'],
  ['management RDP','10.42.1.10',3389,'Tcp','Deny'],
  ['other subnet HTTPS','10.42.3.10',443,'Tcp','Deny'],
  ['external HTTPS','203.0.113.8',443,'Tcp','Deny'],
  ['management UDP 443','10.42.1.10',443,'Udp','Deny']
]) test(name,()=>assert.equal(decision(src,'10.42.2.10',port,proto),expected));
test('template contains no VMs or public IP resources',()=>{
  assert.deepEqual(template.resources.map(r=>r.type).sort(),
    ['Microsoft.Network/networkSecurityGroups','Microsoft.Network/virtualNetworks']);
});
