(()=>{"use strict";function e(e,t,n,r){const o=["VERTEX_SHADER","FRAGMENT_SHADER"],i=t.map(((t,n)=>function(e,t,n){const r=document.getElementById(t);return function(e,t,n){const r=e.createShader(n);return e.shaderSource(r,t),e.compileShader(r),r}(e,r.text,n||("x-shader/x-vertex"===r.type?e.VERTEX_SHADER:e.FRAGMENT_SHADER))}(e,t,e[o[n]]))),a=e.createProgram();return i.forEach((t=>e.attachShader(a,t))),n&&n.forEach(((t,n)=>e.bindAttribLocation(a,r?r[n]:n,t))),e.linkProgram(a),a}let t=Float32Array;function n(e,n,i,a){a=a||new t(16);var s=o(function(e,n,r){return r=r||new t(3),r[0]=e[0]-n[0],r[1]=e[1]-n[1],r[2]=e[2]-n[2],r}(e,n)),c=o(r(i,s)),l=o(r(s,c));return a[0]=c[0],a[1]=c[1],a[2]=c[2],a[3]=0,a[4]=l[0],a[5]=l[1],a[6]=l[2],a[7]=0,a[8]=s[0],a[9]=s[1],a[10]=s[2],a[11]=0,a[12]=e[0],a[13]=e[1],a[14]=e[2],a[15]=1,a}function r(e,n,r){return(r=r||new t(3))[0]=e[1]*n[2]-e[2]*n[1],r[1]=e[2]*n[0]-e[0]*n[2],r[2]=e[0]*n[1]-e[1]*n[0],r}function o(e,n){n=n||new t(3);var r=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);return r>1e-5&&(n[0]=e[0]/r,n[1]=e[1]/r,n[2]=e[2]/r),n}let i=!1;function a(r){const o=[0,0,.25,0,0,1,0,1,.25,0,.25,1],a=[.25,0,.5,0,.25,1,.25,1,.5,0,.5,1],s=[.5,0,.75,0,.5,1,.5,1,.75,0,.75,1],c=[.75,0,1,0,.75,1,.75,1,1,0,1,1],l=[0,0,.25,0,0,1,.25,0,.25,1,0,1],d=[.25,0,.5,0,.25,1,.5,0,.5,1,.25,1],u=[.5,0,.75,0,.5,1,.75,0,.75,1,.5,1],h=[.75,0,1,0,.75,1,1,0,1,1,.75,1],m=function(e){const t=[];for(let n=0;n<e;n++)t.push(Math.floor(3*Math.random()));return t}(6);function f(e){var t=new Float32Array([-.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,-.5,-.5,.5,.5,-.5,.5,-.5,.5,.5,-.5,.5,.5,.5,-.5,.5,.5,.5,.5,-.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,-.5,.5,.5,.5,.5,.5,.5,.5,-.5,-.5,-.5,-.5,.5,-.5,-.5,-.5,-.5,.5,-.5,-.5,.5,.5,-.5,-.5,.5,-.5,.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,-.5,.5,-.5,-.5,.5,.5,-.5,.5,-.5,.5,.5,-.5,.5,.5,.5,-.5,.5,.5,.5]);e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW)}function g(e,t){e.bufferData(e.ARRAY_BUFFER,new Float32Array([...y(t[0],!0),...y(t[1]),...y(t[2],!0),...y(t[3]),...y(t[4],!0),...y(t[5])]),e.STATIC_DRAW)}function y(e,t=!1){return 0===e?t?l:o:1===e?t?d:a:2===e?t?u:s:3===e?t?h:c:(console.warn("Invalid texture index:",e),null)}!function(){var o=document.querySelector("#game-canvas-3d"),a=o.getContext("webgl");if(!a)return;let s=-1,c=-1,l=-1,d=!1,u=0,h=m;var y=$(60),v=$(0),E=$(0);function w(e){const t=o.getBoundingClientRect();return e.touches?{x:e.touches[0].clientX-t.left,y:e.touches[0].clientY-t.top}:{x:e.clientX-t.left,y:e.clientY-t.top}}const A=e=>{if(u>10)return;u=0;const t=e=>{e.forEach((e=>{h[e]=(h[e]+1)%3}))};switch(l){case 1:t([0,4,2,5,3]);break;case 2:t([1,4,2,5,3]);break;case 3:t([2,4,5,0,1]);break;case 4:t([3,4,5,0,1]);break;case 5:t([4,2,3,0,1]);break;case 6:t([5,2,3,0,1]);break;case-1:break;default:console.log("Unknown color",l)}!async function(){console.log("Changing texture...",h);try{g(a,h),console.log("Texture changed successfully!")}catch(e){console.error("Error updating texture:",e)}}(),setTimeout(k,100)};function b(e){e.preventDefault();const{x:t,y:n}=w(e);if(s=t,c=n,d){let t=e.touches?e.touches[0].clientX-p:e.movementX,n=e.touches?e.touches[0].clientY-R:e.movementY;u+=Math.abs(t)+Math.abs(n),E+=t/100,v+=n/100,e.touches&&(p=e.touches[0].clientX,R=e.touches[0].clientY)}}a.canvas.addEventListener("mousemove",b),a.canvas.addEventListener("mousedown",(e=>{d=!0,u=0})),a.canvas.addEventListener("mouseup",(e=>{d=!1}));let p=0,R=0;a.canvas.addEventListener("touchstart",(e=>{d=!0,u=0;const{x:t,y:n}=w(e);p=e.touches[0].clientX,R=e.touches[0].clientY})),a.canvas.addEventListener("touchmove",b),a.canvas.addEventListener("touchend",(e=>{d=!1})),a.canvas.addEventListener("click",A),a.canvas.addEventListener("touchend",(e=>{A(),e.preventDefault()}));const B=document.getElementById("canvas-img"),x=B.getContext("2d"),T=2048;["blue","green","red","yellow"].forEach(((e,t)=>{x.fillStyle=e,x.fillRect(t*T,0,T,T),x.strokeStyle="black",x.lineWidth=10,x.strokeRect(t*T,0,T,T)}));const I=2;function k(){let e=!0;for(let t=0;t<h.length;t++)if(h[t]!==I){e=!1;break}e&&alert("you win!")}!async function(){const e=Array.from(r).map(((e,t)=>async function(e,t,n){return new Promise(((r,o)=>{const i=(new XMLSerializer).serializeToString(e),a=new Image;a.onload=function(){try{const e=T/48*16,o=T/48*20,i=Math.round(t+T/2-e/2),s=Math.round(n+T/2-o/2);x.drawImage(a,i,s,e,o),r()}catch(e){o(e)}},a.onerror=function(e){o(e)};const s=new Blob([i],{type:"image/svg+xml;charset=utf-8"}),c=URL.createObjectURL(s);a.src=c}))}(e,t*T,0)));try{await Promise.all(e),console.log("All SVGs drawn to canvas successfully!")}catch(e){console.error("Error drawing SVGs to canvas:",e)}const t=await new Promise(((e,t)=>{const n=new Image;n.onload=function(){try{e(n)}catch(e){t(e)}},n.onerror=function(e){t(e)},n.src=B.toDataURL("image/png")}));a.bindTexture(a.TEXTURE_2D,X),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,a.RGBA,a.UNSIGNED_BYTE,t),a.generateMipmap(a.TEXTURE_2D)}();const F=e(a,["pick-vertex-shader","pick-fragment-shader"]);var M=a.getAttribLocation(F,"a_position"),L=a.getAttribLocation(F,"a_picking_color"),_=a.getUniformLocation(F,"u_matrix"),S=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,S),function(e){var t=[1,2,3,4,5,6].map((e=>e/255)),n=[];t.forEach((e=>{for(var t=0;t<6;t++)n.push(e)})),e.bufferData(e.ARRAY_BUFFER,new Float32Array(n),e.STATIC_DRAW)}(a);var U=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,U),f(a);var D=e(a,["vertex-shader-3d","fragment-shader-3d"]),C=a.getAttribLocation(D,"a_position"),P=a.getAttribLocation(D,"a_texcoord"),Y=a.getUniformLocation(D,"u_matrix"),H=a.getUniformLocation(D,"u_texture"),q=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,q),f(a);var G=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,G),g(a,m);var X=a.createTexture();function $(e){return e*Math.PI/180}a.bindTexture(a.TEXTURE_2D,X),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,1,1,0,a.RGBA,a.UNSIGNED_BYTE,new Uint8Array([0,0,255,0,255,0,255,0,0,255,255,0])),requestAnimationFrame((function e(){if(function(e,t=1){const n=e.clientWidth*t|0,r=e.clientHeight*t|0;(e.width!==n||e.height!==r)&&(e.width=n,e.height=r)}(a.canvas),a.viewport(0,0,a.canvas.width,a.canvas.height),a.enable(a.CULL_FACE),a.enable(a.DEPTH_TEST),a.clear(a.COLOR_BUFFER_BIT|a.DEPTH_BUFFER_BIT),i){const e=$(1);y=Math.min(Math.PI,y+e),console.log(y);const t=$(10),n=$(10);v+=t,E+=n}let r=a.canvas.clientWidth/a.canvas.clientHeight,o=function(e,n,r,o,i){i=i||new t(16);var a=Math.tan(.5*Math.PI-.5*e),s=1/(r-o);return i[0]=a/n,i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[5]=a,i[6]=0,i[7]=0,i[8]=0,i[9]=0,i[10]=(r+o)*s,i[11]=-1,i[12]=0,i[13]=0,i[14]=r*o*s*2,i[15]=0,i}(y,r,1,2e3),d=function(e,n){n=n||new t(16);var r=e[0],o=e[1],i=e[2],a=e[3],s=e[4],c=e[5],l=e[6],d=e[7],u=e[8],h=e[9],m=e[10],f=e[11],g=e[12],y=e[13],v=e[14],E=e[15],w=m*E,A=v*f,b=l*E,p=v*d,R=l*f,B=m*d,x=i*E,T=v*a,I=i*f,k=m*a,F=i*d,M=l*a,L=u*y,_=g*h,S=s*y,U=g*c,D=s*h,C=u*c,P=r*y,Y=g*o,H=r*h,q=u*o,G=r*c,X=s*o,$=w*c+p*h+R*y-(A*c+b*h+B*y),N=A*o+x*h+k*y-(w*o+T*h+I*y),O=b*o+T*c+F*y-(p*o+x*c+M*y),W=B*o+I*c+M*h-(R*o+k*c+F*h),V=1/(r*$+s*N+u*O+g*W);return n[0]=V*$,n[1]=V*N,n[2]=V*O,n[3]=V*W,n[4]=V*(A*s+b*u+B*g-(w*s+p*u+R*g)),n[5]=V*(w*r+T*u+I*g-(A*r+x*u+k*g)),n[6]=V*(p*r+x*s+M*g-(b*r+T*s+F*g)),n[7]=V*(R*r+k*s+F*u-(B*r+I*s+M*u)),n[8]=V*(L*d+U*f+D*E-(_*d+S*f+C*E)),n[9]=V*(_*a+P*f+q*E-(L*a+Y*f+H*E)),n[10]=V*(S*a+Y*d+G*E-(U*a+P*d+X*E)),n[11]=V*(C*a+H*d+X*f-(D*a+q*d+G*f)),n[12]=V*(S*m+C*v+_*l-(D*v+L*l+U*m)),n[13]=V*(H*v+L*i+Y*m-(P*m+q*v+_*i)),n[14]=V*(P*l+X*v+U*i-(G*v+S*i+Y*l)),n[15]=V*(G*m+D*i+q*l-(H*l+X*m+C*i)),n}(n([0,0,2],[0,0,0],[0,1,0])),u=function(e,n,r){r=r||new t(16);var o=e[4],i=e[5],a=e[6],s=e[7],c=e[8],l=e[9],d=e[10],u=e[11],h=Math.cos(n),m=Math.sin(n);return r[4]=h*o+m*c,r[5]=h*i+m*l,r[6]=h*a+m*d,r[7]=h*s+m*u,r[8]=h*c-m*o,r[9]=h*l-m*i,r[10]=h*d-m*a,r[11]=h*u-m*s,e!==r&&(r[0]=e[0],r[1]=e[1],r[2]=e[2],r[3]=e[3],r[12]=e[12],r[13]=e[13],r[14]=e[14],r[15]=e[15]),r}(function(e,n,r){r=r||new t(16);var o=n[0],i=n[1],a=n[2],s=n[3],c=n[4],l=n[5],d=n[6],u=n[7],h=n[8],m=n[9],f=n[10],g=n[11],y=n[12],v=n[13],E=n[14],w=n[15],A=e[0],b=e[1],p=e[2],R=e[3],B=e[4],x=e[5],T=e[6],I=e[7],k=e[8],F=e[9],M=e[10],L=e[11],_=e[12],S=e[13],U=e[14],D=e[15];return r[0]=o*A+i*B+a*k+s*_,r[1]=o*b+i*x+a*F+s*S,r[2]=o*p+i*T+a*M+s*U,r[3]=o*R+i*I+a*L+s*D,r[4]=c*A+l*B+d*k+u*_,r[5]=c*b+l*x+d*F+u*S,r[6]=c*p+l*T+d*M+u*U,r[7]=c*R+l*I+d*L+u*D,r[8]=h*A+m*B+f*k+g*_,r[9]=h*b+m*x+f*F+g*S,r[10]=h*p+m*T+f*M+g*U,r[11]=h*R+m*I+f*L+g*D,r[12]=y*A+v*B+E*k+w*_,r[13]=y*b+v*x+E*F+w*S,r[14]=y*p+v*T+E*M+w*U,r[15]=y*R+v*I+E*L+w*D,r}(o,d),v);u=function(e,n,r){r=r||new t(16);var o=e[0],i=e[1],a=e[2],s=e[3],c=e[8],l=e[9],d=e[10],u=e[11],h=Math.cos(n),m=Math.sin(n);return r[0]=h*o-m*c,r[1]=h*i-m*l,r[2]=h*a-m*d,r[3]=h*s-m*u,r[8]=h*c+m*o,r[9]=h*l+m*i,r[10]=h*d+m*a,r[11]=h*u+m*s,e!==r&&(r[4]=e[4],r[5]=e[5],r[6]=e[6],r[7]=e[7],r[12]=e[12],r[13]=e[13],r[14]=e[14],r[15]=e[15]),r}(u,E),a.useProgram(F),a.enableVertexAttribArray(M),a.enableVertexAttribArray(L),a.bindBuffer(a.ARRAY_BUFFER,U),a.vertexAttribPointer(M,3,a.FLOAT,!1,0,0),a.bindBuffer(a.ARRAY_BUFFER,S),a.vertexAttribPointer(L,1,a.FLOAT,!1,0,0),a.uniformMatrix4fv(_,!1,u),a.drawArrays(a.TRIANGLES,0,36);const h=s*a.canvas.width/a.canvas.clientWidth,m=a.canvas.height-c*a.canvas.height/a.canvas.clientHeight-1,f=new Uint8Array(4);a.readPixels(h,m,1,1,a.RGBA,a.UNSIGNED_BYTE,f);const g=f[0];l=g,a.clear(a.COLOR_BUFFER_BIT|a.DEPTH_BUFFER_BIT),a.useProgram(D),a.enableVertexAttribArray(C),a.bindBuffer(a.ARRAY_BUFFER,q),a.vertexAttribPointer(C,3,a.FLOAT,!1,0,0),a.enableVertexAttribArray(P),a.bindBuffer(a.ARRAY_BUFFER,G),a.vertexAttribPointer(P,2,a.FLOAT,!1,0,0),a.uniformMatrix4fv(Y,!1,u),a.uniform1i(H,0),a.drawArrays(a.TRIANGLES,0,36),requestAnimationFrame(e)}))}()}const s={0:"red",1:"blue",2:"green"},c=(e,t,n)=>{const r=t*n*2,o=l(e).substring(0,r);if(o.length!==r)throw new Error("Decoded binary string does not match the expected length.");const i=[];for(let e=0;e<o.length;e+=2){const t=parseInt(o.substring(e,e+2),2);i.push(s[t])}return i},l=e=>{switch((e=e.replace(/-/g,"+").replace(/_/g,"/")).length%4){case 2:e+="==";break;case 3:e+="="}const t=atob(e);let n="";for(let e=0;e<t.length;e++)n+=t.charCodeAt(e).toString(2).padStart(8,"0");return n};function d(e,t,n,r,o){const i=document.getElementById("game-container-2d");e=`<div class="svg">${e}</div>`,t=`<div class="svg">${t}</div>`,n=`<div class="svg">${n}</div>`;const a=["red","blue","green"];let s=!1,l=r.width,d=r.height,u=((e,t)=>{const n=document.getElementById("game-container-wrapper-2d"),r=n.offsetWidth,o=n.offsetHeight;return Math.min(Math.floor(r/e),Math.floor(o/t))})(l,d),h=((e,t,n)=>{try{return c(e,n,t)}catch(r){return console.warn("Error decoding",e,t,n,"using random colors instead.",r),null}})(r.colors,d,l);console.log("Init 2d level",l,d,h);const m=r=>{let o=(a.indexOf(r.style.backgroundColor)+1)%a.length;switch(r.style.backgroundColor=a[o],a[o]){case"red":r.innerHTML=e;break;case"blue":r.innerHTML=t;break;case"green":r.innerHTML=n;break;default:r.innerHTML=""}};i.style.width=l*u+"px",i.addEventListener("click",(e=>{let t=e.target.closest(".square");if(s||!t)return;let n=Array.from(t.parentNode.children).indexOf(t),r=Math.floor(n/l),a=n%l;for(let e=-1;e<=1;e++)for(let n=-1;n<=1;n++)if(0===e&&0===n)m(t);else{let t=r+e,o=a+n;if(t>=0&&t<d&&o>=0&&o<l){let e=t*l+o,n=i.children[e];m(n)}}(()=>{let e=i.querySelectorAll(".square");return Array.from(e).every((e=>"red"===e.style.backgroundColor))})()&&(s=!0,setTimeout((()=>{o()}),500))})),((e,t,n,r,o,i,a,s,c)=>{console.log("INIT GRID",t);const l=n*r;e.style.gridTemplateColumns=`repeat(${n}, ${o}px)`;for(let n=0;n<l;n++){let r=document.createElement("div");r.classList.add("square"),r.style.width=`${o}px`,r.style.height=`${o}px`;let l=null===t?i[Math.floor(Math.random()*i.length)]:t[n];r.style.backgroundColor=l,"red"===l?r.innerHTML=a:"blue"===l?r.innerHTML=s:"green"===l&&(r.innerHTML=c),e.appendChild(r)}})(i,h,l,d,u,a,e,t,n)}class u{constructor(e,t,n){this.x=e,this.y=t,this.color=n,this.radius=2*Math.random()+1,this.angle=2*Math.random()*Math.PI,this.speed=5*Math.random()+1,this.friction=.98,this.gravity=.05,this.opacity=1,this.decay=.01*Math.random()+.005}update(){this.speed*=this.friction,this.x+=Math.cos(this.angle)*this.speed,this.y+=Math.sin(this.angle)*this.speed+this.gravity,this.opacity-=this.decay}draw(e){e.save(),e.globalAlpha=this.opacity,e.beginPath(),e.arc(this.x,this.y,this.radius,0,2*Math.PI),e.fillStyle=this.color,e.fill(),e.restore()}}let h=document.querySelectorAll("svg"),m=Array.from(h).map((e=>e.outerHTML));const f=document.getElementById("background-canvas");function g(){f.width=window.innerWidth,f.height=window.innerHeight}g(),window.addEventListener("resize",g);const y=new class{constructor(e,t){this.canvas=t,this.rate=e,this.ctx=t.getContext("2d"),console.log("Canvas",this.canvas,this.ctx),this.fireworks=[],this.animationId=null,this.isRunning=!1,this.fireworksTimeout=null}createFirework(e,t,n){const r=["#ff4949","#ffcc00","#4caf50","#2196f3","#9c27b0"],o=r[Math.floor(Math.random()*r.length)];if(n)for(let n of r)for(let r=0;r<500;r++)this.fireworks.push(new u(e,t,n));else for(let n=0;n<100;n++)this.fireworks.push(new u(e,t,o))}animate(){this.ctx.fillStyle="rgba(0, 0, 0, 0.1)",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.fireworks=this.fireworks.filter((e=>e.opacity>0)),this.fireworks.forEach((e=>{e.update(),e.draw(this.ctx)})),this.animationId=requestAnimationFrame(this.animate.bind(this))}sample_poisson(e){return-Math.log(Math.random())/e}createPoissonFirework(){if(!this.isRunning)return;this.createFirework(window.screen.width*Math.random(),window.screen.height*Math.random());const e=this.sample_poisson(10);this.fireworksTimeout=setTimeout(this.createPoissonFirework.bind(this),1e3*e)}startFireworks(){this.isRunning||(this.isRunning=!0,this.createPoissonFirework(),this.animate())}stopFireworks(){this.isRunning=!1,clearTimeout(this.fireworksTimeout),cancelAnimationFrame(this.animationId),this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)}}(10,f),v=[{mode:"2d",colors:"QA",width:1,height:1},{mode:"3d"}];let E=0;function w(e,t){return Math.random()*(t-e)+e}let A=!1;function b(){const e=document.querySelectorAll(".square");A=!0,e.forEach((e=>{const t=w(-500,500),n=w(-500,500);e.style.transform=`translate(${t}px, ${n}px)`,e.style.transition="transform 1s ease, opacity 1s ease",e.style.opacity="0.3"})),setTimeout((()=>function(){if(!1===A)return;const e=document.querySelectorAll(".square");e.forEach((e=>{e.style.transform="scale(5)",e.style.opacity="0"})),console.log("Explode squares")}()),1e3)}const p=document.getElementById("win-message"),R=()=>{document.getElementById("win-modal").style.display="none",document.getElementById("next-level").style.display="none"};document.getElementById("replay").addEventListener("click",(()=>{R(),B(E)})),document.getElementById("next-level").addEventListener("click",(()=>{R(),E++,B(E)}));document.getElementById("hint").addEventListener("click",(function(){b(),y.startFireworks();const e=document.getElementById("game-canvas-3d").getBoundingClientRect(),t=e.left+e.width/2,n=e.top+e.height/2;setTimeout((()=>y.createFirework(t,n,!0)),2e3),i=!0;const r=document.getElementById("title");r.textContent="You win!",r.style.color="white",document.getElementById("controls").style.visibility="hidden"}));const B=e=>{const t=document.getElementById("game-container-2d");t.innerHTML="",y.stopFireworks(),A=!1,t.style.boxShadow="0 4px 15px rgba(128,128,128,.5)";document.getElementById("title").style.filter="";document.getElementById("controls").style.visibility="";const n=v[e];console.log("Init level",e,n),document.getElementById("title").textContent=0===e?`Level ${e+1} - Make it 13!`:`Level ${e+1} - Make it all 13!`,"2d"===n.mode?(document.getElementById("game-container-wrapper-2d").style.visibility="",document.getElementById("game-canvas-3d").style.visibility="hidden",d(m[2],m[0],m[1],n,(()=>{y.startFireworks(),b(),((e,t)=>{document.getElementById("game-container-2d").style.boxShadow="unset",document.getElementById("title").style.filter="invert(1)",p.textContent=e?"Congratulations! You beat the game!":`Congratulations! You beat level ${t+1} of ${v.length}!`,document.getElementById("next-level").style.display="unset",document.getElementById("win-modal").style.display="block",document.getElementById("controls").style.visibility="hidden"})(!1,E)}))):(document.getElementById("title").textContent=`Level ${e+1} - Make it all 13! Try dragging`,document.getElementById("game-container-wrapper-2d").style.visibility="hidden",document.getElementById("game-canvas-3d").style.visibility="",a(h))};document.getElementById("close-intro").addEventListener("click",(function(){document.getElementById("intro-modal").style.display="none"})),document.getElementById("curmudgeon").addEventListener("click",(function(){window.location.href="https://dev.js13kgames.com/2024/games"})),B(E)})();