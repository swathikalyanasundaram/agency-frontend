const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],mk=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const pic=(src,alt)=>{const i=new Image();i.src=src;i.alt=alt||'';i.decoding='async';i.onerror=()=>{i.onerror=null;i.src='https://picsum.photos/seed/'+encodeURIComponent(alt||'x')+'/1600/1200'};return i};
const words=(el,txt)=>{el.textContent='';txt.split(' ').forEach(w=>{const s=mk('span','wd',w);el.append(s)})};

fetch('content.json?'+Date.now()).then(r=>r.json()).then(build).catch(e=>console.error('content.json failed',e));

function build(d){
  document.title=d.seoTitle||d.brand;$('#brand').textContent=d.brand;$('#ldBrand').textContent=d.brand;$('#foot').textContent='© '+new Date().getFullYear()+' '+d.brand;
  const h=d.hero;$('#hEyebrow').textContent=h.eyebrow;$('#hSub').textContent=h.sub;$('#hLoc').textContent=h.location;
  const t=$('#hTitle');t.setAttribute('aria-label',h.title);h.title.split(' ').forEach(w=>{const ws=mk('span','w');ws.setAttribute('aria-hidden','true');[...w].forEach(c=>ws.append(mk('span','c',c)));t.append(ws,' ')});
  const v=$('#vid'),media=$('.hero-media');media.style.backgroundImage='url("'+h.poster+'")';if(h.video){v.src=h.video;v.poster=h.poster;v.addEventListener('error',()=>v.remove());const p=v.play();p&&p.catch(()=>{})}else v.remove();
  words($('#introText'),d.intro);
  const tr=$('#track');tr.append(mk('div','hg-lead','Selected work, 2022 to now.'));
  d.gallery.forEach((g,i)=>{const f=mk('figure','pn '+'abc'[i%3]),fr=mk('div','fr');fr.append(pic(g.src,g.title+', '+g.place));const c=mk('figcaption');c.append(mk('b',0,g.title),mk('span',0,String(i+1).padStart(2,'0')+' · '+g.place+' · '+g.year));f.append(fr,c);tr.append(f)});
  $('#hgCount').textContent='01 / '+String(d.gallery.length).padStart(2,'0');
  d.series.forEach(s=>{const p=mk('article','sp'),dv=mk('div'),l=mk('div');l.append(mk('small',0,s.year),mk('h3',0,s.title));dv.append(l,mk('p',0,s.text));p.append(pic(s.src,s.title),dv);$('#series').append(p)});
  const a=d.about;$('#aboutImg').replaceWith(Object.assign(pic(a.image,'Portrait of the photographer'),{id:'aboutImg'}));$('#aboutTitle').textContent=a.title;$('#aboutText').textContent=a.text;
  a.stats.forEach(s=>{const x=mk('div'),b=mk('b',0,'0');b.dataset.t=s.n;b.className='cnt';x.append(b,mk('span',0,s.l));$('#stats').append(x)});
  d.services.forEach((s,i)=>{const r=mk('div','row');const n=mk('i',0,String(i+1).padStart(2,'0')),h3=mk('h3',0,s.title),p=mk('p',0,s.text),pr=mk('span',0,s.price);r.append(n,h3,p,pr);$('#svc').append(r)});
  words($('#qText'),'“'+d.quote.text+'”');$('#qWho').textContent=d.quote.name+' · '+d.quote.role;
  const c=d.contact;$('#cMail').textContent=c.email;$('#cMail').href='mailto:'+c.email;$('#cTel').textContent=c.phone;$('#cTel').href='tel:'+c.phone.replace(/\s/g,'');$('#cIg').href=c.instagram;$('#cCity').textContent=c.city;
  for(let i=0;i<6;i++)$('#mq').append(mk('span',0,d.brand.toLowerCase().replace(/\b\w/g,m=>m.toUpperCase())));
  start(d);
}

function start(d){
  gsap.registerPlugin(ScrollTrigger);let lenis=null;if(!reduce)gsap.set('.c',{yPercent:110});
  if(!reduce){lenis=new Lenis({duration:1.5,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),smoothWheel:true,wheelMultiplier:.9});
    lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
    let last=0;lenis.on('scroll',({scroll})=>{$('#hdr').classList.toggle('hide',scroll>last&&scroll>260);last=scroll})}
  $$('[data-go]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const t=document.querySelector(a.getAttribute('href'));lenis?lenis.scrollTo(t,{duration:2.2}):t.scrollIntoView()}));

  /* loader -> hero entrance */
  const num=$('#ldNum'),bar=$('#ldBar'),o={v:0};
  const intro=()=>{gsap.timeline().to('#loader',{yPercent:-100,duration:1.3,ease:'expo.inOut'}).set('#loader',{display:'none'})
    .from('.hero-media video',{scale:1.25,duration:2.4,ease:'expo.out'},0.3).to('.c',{yPercent:0,duration:1.5,stagger:.035,ease:'expo.out'},.7)
    .from('.hero-text .eyebrow,.sub,.hero-foot span',{opacity:0,y:20,duration:1.2,stagger:.15,ease:'power3.out'},1.2)};
  if(reduce){$('#loader').remove();$$('.c').forEach(c=>c.style.transform='none');return}
  gsap.to(o,{v:100,duration:1.8,ease:'power2.inOut',onUpdate:()=>{num.textContent=Math.round(o.v);bar.style.width=o.v+'%'},onComplete:intro});

  /* hero scroll */
  gsap.to('.hero-media',{yPercent:14,scale:1.12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.hero-shade',{backgroundColor:'rgba(10,10,10,.55)',ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.hero-text',{y:-120,opacity:0,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'70% top',scrub:true}});
  gsap.to('.hero-foot',{opacity:0,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'30% top',scrub:true}});

  /* word-by-word reveals */
  [['.intro p','.intro'],['blockquote','.quote']].forEach(([s,tr])=>gsap.to(s+' .wd',{opacity:1,stagger:.12,ease:'none',scrollTrigger:{trigger:tr,start:'top 70%',end:'bottom 75%',scrub:true}}));

  /* horizontal gallery */
  const track=$('#track'),n=d.gallery.length;
  const tween=gsap.to(track,{x:()=>-(track.scrollWidth-innerWidth),ease:'none',scrollTrigger:{trigger:'#work',start:'top top',end:()=>'+='+(track.scrollWidth-innerWidth),pin:true,scrub:1.1,invalidateOnRefresh:true,anticipatePin:1,
    onUpdate:s=>{$('#hgBar').style.width=s.progress*100+'%';$('#hgCount').textContent=String(Math.min(n,Math.floor(s.progress*n)+1)).padStart(2,'0')+' / '+String(n).padStart(2,'0')}}});
  $$('.pn').forEach(p=>gsap.fromTo(p.querySelector('img'),{xPercent:0},{xPercent:-16,ease:'none',scrollTrigger:{trigger:p,containerAnimation:tween,start:'left right',end:'right left',scrub:true}}));
  gsap.from('.hg-lead',{opacity:0,x:60,duration:1.4,ease:'expo.out',scrollTrigger:{trigger:'#work',start:'top 60%'}});

  /* series: sticky panels with inner parallax */
  $$('.sp').forEach((p,i)=>{gsap.fromTo(p.querySelector('img'),{yPercent:-6,scale:1.08},{yPercent:6,scale:1,ease:'none',scrollTrigger:{trigger:p,start:'top bottom',end:'bottom top',scrub:true}});
    gsap.from(p.querySelectorAll('h3,small,p'),{y:70,opacity:0,duration:1.4,stagger:.12,ease:'expo.out',scrollTrigger:{trigger:p,start:'top 55%'}})});

  /* about */
  gsap.fromTo('#aboutImg',{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{trigger:'.about-img',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.from('.about-txt > *',{y:60,opacity:0,duration:1.3,stagger:.12,ease:'expo.out',scrollTrigger:{trigger:'.about-txt',start:'top 75%'}});
  $$('.cnt').forEach(c=>{const t=+c.dataset.t,q={v:0};ScrollTrigger.create({trigger:c,start:'top 90%',once:true,onEnter:()=>gsap.to(q,{v:t,duration:2.4,ease:'expo.out',onUpdate:()=>c.textContent=Math.round(q.v)+(t>=100?'+':'')})})});

  /* services, contact */
  gsap.from('.row',{y:50,opacity:0,duration:1.2,stagger:.15,ease:'expo.out',scrollTrigger:{trigger:'#svc',start:'top 80%'}});
  gsap.from('.contact h2,.big,.c-row',{y:60,opacity:0,duration:1.3,stagger:.15,ease:'expo.out',scrollTrigger:{trigger:'.contact',start:'top 65%'}});
  gsap.to('#mq',{xPercent:-33,ease:'none',scrollTrigger:{trigger:'.marquee',start:'top bottom',end:'bottom top',scrub:true}});

  /* cursor */
  if(matchMedia('(pointer:fine)').matches){const c=$('#cur');let mx=0,my=0,x=0,y=0;addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;c.style.opacity=1},{passive:true});
    gsap.ticker.add(()=>{x+=(mx-x)*.18;y+=(my-y)*.18;c.style.left=x+'px';c.style.top=y+'px'});
    document.addEventListener('mouseover',e=>c.classList.toggle('big',!!e.target.closest('.pn')));}
  addEventListener('load',()=>ScrollTrigger.refresh());
}
