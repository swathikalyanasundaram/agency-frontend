const $=id=>document.getElementById(id),mk=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
fetch('content.json?'+Date.now()).then(r=>r.json()).then(init).catch(e=>console.error('content.json failed',e));

function init(d){
  document.title=d.seoTitle||d.brand;$('brand').textContent=d.brand;$('foot').textContent='© '+new Date().getFullYear()+' '+d.brand+'. All images protected by copyright.';
  const a=d.about;$('aboutImg').src=a.image;$('aboutTitle').textContent=a.title;$('aboutText').textContent=a.text;
  a.stats.forEach(s=>{const x=mk('div','stat'),b=mk('b');b.innerHTML='<span class="cnt" data-t="'+s.n+'">0</span>'+s.suffix;x.append(b,mk('span',0,s.l));$('stats').append(x)});
  d.series.forEach(s=>{const x=mk('div','spread'),im=mk('div','sp-img reveal'),i=new Image();i.src=s.src;i.alt=s.title;i.loading='lazy';im.append(i);
    const t=mk('div');t.setAttribute('data-aos','fade-up');t.append(mk('h3',0,s.title),mk('p','yr',s.year),mk('p',0,s.text));const l=mk('a',0,'View series →');l.href='#work';t.append(l);x.append(im,t);$('seriesList').append(x)});
  d.services.forEach(s=>{const c=mk('div','card');c.setAttribute('data-aos','fade-up');c.append(mk('h3',0,s.title),mk('p',0,s.text),mk('p','pr',s.price));$('servicesList').append(c)});
  $('procImg').src=d.process.image;$('procTitle').textContent=d.process.title;
  d.process.steps.forEach(s=>{const li=mk('li');const w=mk('div');w.append(mk('b',0,s.title),mk('span',0,s.text));li.append(w);$('steps').append(li)});
  d.prints.forEach(p=>{const s=mk('div','swiper-slide'),c=mk('div','print'),i=new Image();i.src=p.src;i.alt=p.title;i.loading='lazy';const t=mk('div');t.append(mk('b',0,p.title),mk('span',0,p.edition+' · '+p.paper));c.append(i,t);s.append(c);$('printsList').append(s)});
  $('ctaTitle').textContent=d.cta.title;document.querySelector('.cta-bg').style.backgroundImage='url("'+d.cta.image+'")';
  d.testimonials.forEach(t=>{const s=mk('div','swiper-slide slide-q'),q=mk('q',0,t.quote),w=mk('div','who'),i=new Image();i.src=t.avatar;i.alt=t.name;const m=mk('div');m.append(mk('b',0,t.name),mk('small',0,t.role));w.append(i,m);s.append(q,w);$('quotesList').append(s)});
  d.press.forEach(p=>$('pressList').append(mk('span',0,p)));
  const c=d.contact;$('contactInfo').textContent=[c.email,c.phone,c.city].filter(Boolean).join(' · ');
  hero(d.hero);gallery(d.gallery);ui(c);motion();
}

/* ---------- HERO: scroll-scrubbed canvas ---------- */
function hero(h){
  const cv=$('hero-canvas'),ctx=cv.getContext('2d'),runway=$('hero-runway'),dpr=Math.min(devicePixelRatio||1,2);
  $('loc').textContent=h.location;
  h.stages.forEach((s,i)=>{const e=mk('div','stage'+(i?'':' active'));e.append(mk('p','eyebrow',s.eyebrow),mk('h1',0,s.title),mk('p','d',s.desc));const b=mk('div','btns'),b1=mk('button','pill',s.b1),b2=mk('button','ghost',s.b2);
    b1.onclick=()=>i===2?openM('booking'):go(i?'#series':'#work');b2.onclick=()=>i===0?openM('booking'):go(i===1?'#services':'#contact');b.append(b1,b2);e.append(b);$('stages').append(e)});
  const useFrames=h.frameCount>0,N=useFrames?h.frameCount:h.images.length,imgs=[];
  const src=i=>useFrames?h.frameFolder+'frame_'+String(i).padStart(3,'0')+'.jpg':h.images[i];
  const load=i=>{if(imgs[i])return;const im=new Image();im.decoding='async';im.src=src(i);imgs[i]=im};
  if(useFrames){for(let i=0;i<Math.min(30,N);i++)load(i);for(let i=0;i<N;i+=8)load(i);let k=0;const idle=()=>{for(let n=0;n<6&&k<N;n++)load(k++);if(k<N)(window.requestIdleCallback||setTimeout)(idle)};idle()}else for(let i=0;i<N;i++)load(i);
  const ok=im=>im&&im.complete&&im.naturalWidth;
  const cover=(im,zoom,alpha)=>{const s=Math.max(cv.width/im.naturalWidth,cv.height/im.naturalHeight)*zoom,w=im.naturalWidth*s,hh=im.naturalHeight*s;ctx.globalAlpha=alpha;ctx.drawImage(im,(cv.width-w)/2,(cv.height-hh)/2,w,hh)};
  const draw=pos=>{ctx.fillStyle='#0B0B0C';ctx.fillRect(0,0,cv.width,cv.height);
    if(useFrames){let i=Math.round(pos);while(i>0&&!ok(imgs[i]))i--;if(ok(imgs[i]))cover(imgs[i],1,1)}
    else{const i=Math.min(Math.floor(pos),N-1),t=pos-i,z=1+.07*(pos/Math.max(N-1,1));if(ok(imgs[i]))cover(imgs[i],z,1);if(i+1<N&&ok(imgs[i+1]))cover(imgs[i+1],z*1.01,t)}ctx.globalAlpha=1};
  const size=()=>{cv.width=innerWidth*dpr;cv.height=innerHeight*dpr;draw(cur)};
  let cur=0,target=0,stage=0;
  const prog=()=>{const r=runway.getBoundingClientRect();return Math.min(Math.max(-r.top/(r.height-innerHeight),0),1)};
  const setStage=p=>{const s=p<.33?0:p<.67?1:2;if(s!==stage||!reduce){document.querySelectorAll('.stage').forEach((e,i)=>e.classList.toggle('active',i===s));document.querySelectorAll('.hero-hud span').forEach((e,i)=>e.classList.toggle('on',i===s));stage=s}$('bar').style.width=(15+85*p)+'%'};
  const onScroll=()=>{const p=prog();target=p*(N-1);setStage(p);$('main-header').classList.toggle('scrolled',scrollY>60)};
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',size,{passive:true});
  size();onScroll();
  if(reduce){cur=0;draw(0);return}
  const tick=()=>{if(Math.abs(target-cur)>.002||!ok(imgs[Math.round(cur)])){cur+=(target-cur)*.085;draw(cur)}requestAnimationFrame(tick)};tick();
  imgs[0]&&(imgs[0].onload=()=>draw(cur));
}
const go=h=>document.querySelector(h).scrollIntoView({behavior:reduce?'auto':'smooth'});

/* ---------- GALLERY: filter + lightbox ---------- */
function gallery(items){
  const cats=['All',...new Set(items.map(i=>i.cat))],f=$('filters'),g=$('gallery');let cur=items,idx=0,first=true;
  function draw(){g.innerHTML='';cur.forEach((it,i)=>{const fg=mk('figure');fg.tabIndex=0;fg.dataset.cursor='view';const im=new Image();im.src=it.src;im.alt=it.title+', '+it.location+' '+it.year;im.loading='lazy';im.decoding='async';
    fg.append(im,mk('figcaption',0,it.title+' · '+it.location+' · '+it.year));fg.onclick=()=>show(i);fg.onkeydown=e=>e.key==='Enter'&&show(i);g.append(fg)});
    if(first&&window.gsap&&!reduce){first=false;gsap.set('.masonry figure',{clipPath:'inset(100% 0 0 0)'});ScrollTrigger.batch('.masonry figure',{once:true,start:'top 92%',onEnter:b=>gsap.to(b,{clipPath:'inset(0% 0 0 0)',duration:.9,stagger:.08,ease:'power3.out'})})}
    cursorBind()}
  cats.forEach((c,i)=>{const b=mk('button',i?'':'on',c);b.setAttribute('role','tab');b.onclick=()=>{[...f.children].forEach(x=>x.classList.remove('on'));b.classList.add('on');
    g.querySelectorAll('figure').forEach(x=>x.classList.add('out'));setTimeout(()=>{cur=c==='All'?items:items.filter(x=>x.cat===c);draw();g.querySelectorAll('figure').forEach(x=>{x.classList.add('out');requestAnimationFrame(()=>requestAnimationFrame(()=>x.classList.remove('out')))});window.ScrollTrigger&&ScrollTrigger.refresh()},300)};f.append(b)});
  const lb=$('lb');function show(i){idx=(i+cur.length)%cur.length;const it=cur[idx];$('lbImg').src=it.src;$('lbImg').alt=it.title;$('lbCap').textContent=it.title+' · '+it.location+' · '+it.year+(it.exif?' · '+it.exif:'');openM('lb')}
  $('lbPrev').onclick=()=>show(idx-1);$('lbNext').onclick=()=>show(idx+1);
  addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1)});
  let sx=0;lb.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});lb.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)show(idx+(dx<0?1:-1))},{passive:true});
  draw();
}

/* ---------- Modals, form, nav, cursor ---------- */
let lastFocus=null;
function openM(id){const m=$(id);lastFocus=document.activeElement;m.hidden=false;document.body.style.overflow='hidden';(m.querySelector('input,button.x')||m).focus()}
function closeM(){document.querySelectorAll('.modal').forEach(m=>m.hidden=true);document.body.style.overflow='';lastFocus&&lastFocus.focus()}
function ui(c){
  document.querySelectorAll('[data-book]').forEach(b=>b.onclick=()=>openM('booking'));
  document.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeM);
  document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeM()}));
  addEventListener('keydown',e=>{const m=[...document.querySelectorAll('.modal')].find(x=>!x.hidden);if(!m)return;
    if(e.key==='Escape')closeM();if(e.key==='Tab'){const f=[...m.querySelectorAll('button,input,select,textarea,a')].filter(x=>!x.disabled&&x.offsetParent&&!x.classList.contains('hp'));if(!f.length)return;const a=f[0],z=f[f.length-1];
      if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
  const nav=$('nav'),bg=$('burger');bg.onclick=()=>{const o=nav.classList.toggle('open');bg.setAttribute('aria-expanded',o)};nav.querySelectorAll('a').forEach(a=>a.onclick=()=>nav.classList.remove('open'));
  $('form').addEventListener('submit',async e=>{e.preventDefault();const f=e.target,m=$('formMsg'),o=Object.fromEntries(new FormData(f));if(o.website)return;
    if(c.formEndpoint){try{const r=await fetch(c.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(o)});if(!r.ok)throw 0;f.reset();m.textContent='Thank you. I will reply within 24 hours.'}catch{m.textContent='Could not send. Please email '+c.email}}
    else location.href='mailto:'+c.email+'?subject='+encodeURIComponent(o.type+' inquiry from '+o.name)+'&body='+encodeURIComponent(o.message+'\n\nDates: '+o.date+'\nLocation: '+o.location+'\nBudget: '+o.budget+'\n'+o.email)});
  if(matchMedia('(pointer:fine)').matches){
    const dot=$('cursor-dot'),ring=$('cursor-ring');let mx=0,my=0,rx=0,ry=0;
    addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.opacity=ring.style.opacity=1;dot.style.left=mx+'px';dot.style.top=my+'px'},{passive:true});
    (function l(){rx+=(mx-rx)*.15;ry+=(my-ry)*.15;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(l)})();cursorBind();
  }
}
function cursorBind(){const ring=$('cursor-ring');document.querySelectorAll('a,button,.card,.print,figure').forEach(el=>{if(el._c)return;el._c=1;
  el.addEventListener('mouseenter',()=>ring.classList.add(el.dataset.cursor==='view'?'view':'hov'));el.addEventListener('mouseleave',()=>ring.classList.remove('hov','view'))})}

/* ---------- Motion: counters, parallax, sliders, AOS ---------- */
function motion(){
  AOS.init({duration:800,easing:'ease-out-cubic',once:true,disable:reduce});
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);
    if(e.target.classList.contains('reveal'))e.target.classList.add('in');
    if(e.target.classList.contains('cnt')){const t=+e.target.dataset.t,s=performance.now();const st=n=>{const p=Math.min((n-s)/1800,1);e.target.textContent=Math.round(t*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(st)};reduce?e.target.textContent=t:requestAnimationFrame(st)}}),{threshold:.25});
  document.querySelectorAll('.cnt,.reveal').forEach(x=>io.observe(x));
  if(window.gsap&&!reduce){gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.sp-img img').forEach(im=>gsap.fromTo(im,{y:-40},{y:40,ease:'none',scrollTrigger:{trigger:im.parentNode,start:'top bottom',end:'bottom top',scrub:true}}));
    gsap.fromTo('.cta-bg',{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{trigger:'.cta',start:'top bottom',end:'bottom top',scrub:true}})}
  new Swiper('#prints-slider',{speed:800,slidesPerView:1.08,spaceBetween:16,navigation:{prevEl:'.pr-prev',nextEl:'.pr-next'},breakpoints:{481:{slidesPerView:1.25,spaceBetween:20},993:{slidesPerView:2.2,spaceBetween:24},1280:{slidesPerView:2.8,spaceBetween:32}}});
  new Swiper('#quotes-slider',{speed:800,loop:$('quotesList').children.length>1,autoplay:{delay:6000,disableOnInteraction:false},pagination:{el:'.swiper-pagination',clickable:true},a11y:{enabled:true}});
}
