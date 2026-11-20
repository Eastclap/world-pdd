import * as T from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
const cache=new Map();let renderer;
function render(kind){
 if(cache.has(kind))return cache.get(kind);
 renderer ||= new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
 renderer.setSize(800,600,false);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.setClearColor(0xe9efe4);
 const s=new T.Scene(),camera=new T.OrthographicCamera(-12,12,9,-9,.1,100);camera.position.set(17,21,24);camera.lookAt(0,0,0);
 s.add(new T.HemisphereLight(0xfffaf0,0x87968b,2.1));const sun=new T.DirectionalLight(0xfff2dc,3);sun.position.set(-9,16,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-15,right:15,top:15,bottom:-15,near:.5,far:50});sun.shadow.bias=-.0004;s.add(sun);
 function mesh(g,c,x,y,z,parent=s){const m=new T.Mesh(g,new T.MeshStandardMaterial({color:c,roughness:.85}));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 const box=(w,h,d,c,x,y,z,p)=>mesh(new T.BoxGeometry(w,h,d),c,x,y,z,p);
 const line=(x,z,w,d,c=0xfbf4e6)=>box(w,.025,d,c,x,.145,z);
 box(19,.6,19,0xaabda0,0,-.42,0);box(19,.18,19,0xc7dab8,0,-.03,0);
 const straight=kind==='bus'||kind==='guide';
 box(straight?8:6,.1,19,0x56636a,0,.085,0);
 if(!straight)box(19,.1,6,0x56636a,0,.085,0);
 for(let z=-8.5;z<9;z+=1.5)if(straight||Math.abs(z)>3.5)line(0,z,.11,.72);
 if(!straight)for(let x=-8.5;x<9;x+=1.5)if(Math.abs(x)>3.5)line(x,0,.72,.11);
 if(!straight){line(1.5,3.6,2.8,.14);for(let i=0;i<7;i++)line(-2.65+i*.88,2.9,.49,.65);}
 function car(x,z,angle,color,bus=false){const g=new T.Group();g.position.set(x,.15,z);g.rotation.y=angle;s.add(g);const len=bus?3.5:2.35;box(1.18,.49,len,color,0,.42,0,g);box(.94,.43,bus?2.9:1.13,0x96b3bc,0,.84,-.15,g);box(.99,.12,bus?3:1.25,color,0,1.08,-.15,g);for(const a of [-.61,.61])for(const b of [-len*.31,len*.31]){const wheel=mesh(new T.CylinderGeometry(.25,.25,.16,16),0x30383d,a,.25,b,g);wheel.rotation.z=Math.PI/2;}for(const a of [-.38,.38])box(.24,.14,.05,0xfff0bf,a,.49,-len/2-.02,g);return g}
 car(kind==='bus'?-1:1.5,6,0,0x3185dc);
 if(kind==='left')car(-1.5,-6,Math.PI,0xe16a59);
 if(kind==='bus'){car(2.9,-2,0,0xe9b64d,true);line(1.8,0,.16,19,0x319ce9);}
 if(kind==='guide'){line(1.45,0,.17,19,0x6cdd96);line(-1.45,0,.17,19,0xe989bc);}
 if(kind==='uturn'){for(let i=0;i<6;i++)line(0,4+i*.8,.15,.48,0xf6db77);}
 function signal(x,z,green,arrow=false){mesh(new T.CylinderGeometry(.07,.09,2.8,12),0x69777c,x,1.5,z);box(.52,1.26,.36,0x333d43,x,2.85,z);for(let i=0;i<3;i++)mesh(new T.SphereGeometry(.145,14,10),i===0&&!green?0xff473d:i===2&&green?0x48e087:0x59605b,x,3.23-i*.38,z+.2);if(arrow){box(.5,.5,.36,0x333d43,x+.65,2.5,z);mesh(new T.SphereGeometry(.15,14,10),0xff473d,x+.65,2.5,z+.2)}}
 if(['right','signal','left'].includes(kind))signal(3.6,3.7,kind==='left',kind==='signal');
 function sign(x,z,label){mesh(new T.CylinderGeometry(.06,.07,2.3,10),0x899499,x,1.3,z);const cvs=document.createElement('canvas');cvs.width=256;cvs.height=128;const ctx=cvs.getContext('2d');ctx.fillStyle='#357db3';ctx.fillRect(0,0,256,128);ctx.fillStyle='white';ctx.font='bold 53px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,128,64);const mat=new T.MeshBasicMaterial({map:new T.CanvasTexture(cvs),side:T.DoubleSide});const m=new T.Mesh(new T.PlaneGeometry(1.8,.9),mat);m.position.set(x,2.5,z);s.add(m)}
 if(kind==='left')sign(-3.8,3.9,'비보호');if(kind==='uturn')sign(3.8,-4,'U ↶');
 for(const [x,z] of [[-7,-7],[-5,-7],[7,-7],[7,7],[-7,7],[-7,5]]){mesh(new T.CylinderGeometry(.15,.2,1.1,9),0x91755d,x,.65,z);mesh(new T.IcosahedronGeometry(.93,2),0x83ad76,x,1.65,z);}
 for(const [x,z,w,h,d] of [[-6,-4.9,2.4,1.5,2.2],[6,-5,2.8,2.6,2.2]]){box(w,h,d,0xe9d9bb,x,h/2+.15,z);box(w+.16,.17,d+.16,0xd1bba2,x,h+.2,z);}
 renderer.render(s,camera);const url=renderer.domElement.toDataURL('image/png');cache.set(kind,url);s.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){o.material.map?.dispose();o.material.dispose()}});return url;
}
function hydrate(){for(const el of document.querySelectorAll('[data-road3d]:not([data-rendered])')){el.dataset.rendered='yes';try{const img=new Image();img.alt='Трёхмерная учебная дорожная сцена';img.src=render(el.dataset.road3d);img.style.cssText='display:block;width:100%;height:auto;aspect-ratio:4/3;object-fit:cover';el.replaceChildren(img)}catch(e){console.warn('3D unavailable',e)}}}
new MutationObserver(hydrate).observe(document.body,{childList:true,subtree:true});hydrate();
