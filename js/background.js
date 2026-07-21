const canvas=document.getElementById("background");
const ctx=canvas.getContext("2d");

canvas.width=innerWidth;
canvas.height=innerHeight;

let particles=[];

for(let i=0;i<120;i++){

particles.push({

x:Math.random()*canvas.width,
y:Math.random()*canvas.height,

vx:(Math.random()-.5)*0.4,
vy:(Math.random()-.5)*0.4,

r:Math.random()*2+1

});

}

function animate(){

ctx.fillStyle="#0f0f10";
ctx.fillRect(0,0,canvas.width,canvas.height);

particles.forEach(p=>{

p.x+=p.vx;
p.y+=p.vy;

if(p.x<0||p.x>canvas.width)p.vx*=-1;
if(p.y<0||p.y>canvas.height)p.vy*=-1;

ctx.beginPath();

ctx.fillStyle="rgba(212,176,106,.6)";

ctx.arc(p.x,p.y,p.r,0,Math.PI*2);

ctx.fill();

});

requestAnimationFrame(animate);

}

animate();

window.onresize=()=>{

canvas.width=innerWidth;
canvas.height=innerHeight;

};
