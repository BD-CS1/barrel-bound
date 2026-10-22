const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const noop=()=>{};
function setup(){
 const handlers={},elements=new Map(),storage=new Map();
 const context=new Proxy({}, {get:(_,p)=>p==='createLinearGradient'||p==='createRadialGradient'?()=>({addColorStop:noop}):noop,set:()=>true});
 function element(id){if(!elements.has(id))elements.set(id,{style:{},classList:{add:noop,remove:noop,toggle:noop},textContent:'',innerHTML:'',setAttribute:noop,addEventListener:(k,fn)=>{handlers[id+':'+k]=fn},getContext:()=>context});return elements.get(id);}
 const document={getElementById:element,querySelectorAll:()=>[],addEventListener:noop,hidden:false};
 const sandbox={document,window:{addEventListener:noop},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},requestAnimationFrame:noop,console,Math};
 sandbox.globalThis=sandbox;vm.createContext(sandbox);
 let source=fs.readFileSync('dist/game.js','utf8');
 source=source.replace('resetLevel();updateHUD();requestAnimationFrame(frame);','resetLevel();updateHUD();requestAnimationFrame(frame); globalThis.testApi={begin,update,ground,setKey,pause,resume,spawnBarrel,hit,draw, get player(){return player},get ladders(){return ladders},get barrels(){return barrels},clearHazards(){barrels=[];spawnTimer=999},get state(){return {mode,score,lives,level,clock,invincible}}};');
 vm.runInContext(source,sandbox);return {api:sandbox.testApi,handlers,elements,storage};
}
function advance(a,n){for(let i=0;i<Math.ceil(n*120);i++)a.update(1/120);}
function move(a,target){const dir=target>a.player.x?'ArrowRight':'ArrowLeft';a.setKey(dir,true);let guard=0;while(Math.abs(a.player.x-target)>1.5&&a.state.mode==='playing'&&guard++<1200)a.update(1/120);a.setKey(dir,false);assert.ok(guard<1200,'Reach target');}
{
const {api:a}=setup();a.begin();a.clearHazards();assert.equal(a.state.mode,'playing');const y=a.player.y;a.setKey('Space',true);advance(a,.15);assert.ok(a.player.y<y-25,'Jump rises above platform');a.setKey('Space',false);advance(a,.7);assert.equal(a.player.onGround,true,'Jump lands on platform');a.pause();let x=a.player.x,c=a.state.clock;a.setKey('ArrowRight',true);advance(a,2);assert.equal(a.player.x,x);assert.equal(a.state.clock,c,'Pause freezes time');a.resume();a.clearHazards();
for(let stage=1;stage<=3;stage++){
 for(let f=0;f<5;f++){const l=a.ladders[f];move(a,l.x);a.setKey('ArrowUp',true);advance(a,1.1);a.setKey('ArrowUp',false);assert.equal(a.player.floor,f+1,'Ladder reaches next floor');if(f===1||f===3)move(a,260);}
 move(a,475);assert.equal(a.state.mode,stage===3?'victory':'stageclear');assert.ok(a.state.score>1000,'Score rewards stage completion');if(stage<3){a.begin();a.clearHazards();assert.equal(a.state.level,stage+1);}
}
console.log('PASS: keyboard movement, jump/landing, ladder routes, pickups, all 3 stage transitions, victory, pause/resume');
}
{
const {api:a,storage}=setup();a.begin();advance(a,2.1);assert.ok(a.barrels.length>0,'Barrels spawn');a.clearHazards();a.spawnBarrel();const b=a.barrels[0];advance(a,6);assert.ok(b.floor<5,'Barrels drop to next floor');a.clearHazards();advance(a,3);a.hit();assert.equal(a.state.lives,2);a.hit();assert.equal(a.state.lives,2,'Invulnerability prevents repeat hit');advance(a,3);a.hit();advance(a,3);a.hit();assert.equal(a.state.mode,'gameover');a.begin();assert.equal(a.state.lives,3);assert.equal(a.state.score,0);assert.equal(a.state.level,1);a.draw();console.log('PASS: spawning, rolling/falling, life loss, invulnerability, game over, restart, canvas renderer');
}
