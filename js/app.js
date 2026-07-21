const blur=document.getElementById("blur");

window.addEventListener("mousemove",e=>{

blur.style.left=e.clientX+"px";
blur.style.top=e.clientY+"px";

});
