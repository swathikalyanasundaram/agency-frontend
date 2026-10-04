const $=id=>document.getElementById(id),el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
fetch('content.json?'+Date.now()).then(r=>r.json()).then(init).catch(e=>console.error('content.json failed',e));
function init(d){
  document.title=d.seoTitle||d.brand;$('brand').textContent=d.brand;$('foot').textContent='© '+new Date().getFullYear()+' '+d.brand;
  const h=d.hero;$('greeting').textContent=h.greeting;$('title').textContent=h.title;$('subtitle').textContent=h.subtitle;$('desc').textContent=h.description;$('exif').textContent=h.exif||'';
  const a=d.availability;$('avStatus').textContent=a.status;$('avLine').textContent=a.line;$('avNote').textContent=a.note;
  const st=$('stats');d.stats.forEach((s,i)=>{if(i)st.append(el('span','stat-line'));const b=el('div','stat');b.append(el('b',0,s.n),el('span',0,s.l));st.append(b)});
  const c=d.contact;[['instagram',c.instagram,'ph-instagram-logo'],['email','mailto:'+c.email,'ph-envelope-simple']].forEach(([n,u,i])=>{if(!u||u==='mailto:')return;const l=el('a');l.href=u;l.setAttribute('aria-label',n);l.innerHTML='<i class="ph '+i+'"></i>';$('socials').append(l)});
  $('contactInfo').textContent=[c.email,c.phone,c.city].filter(Boolean).join(' · ');
  $('aboutImg').src=d.about.image;$('aboutTitle').textContent=d.about.title;$('aboutText').textContent=d.about.text;
  d.services.forEach(s=>{const x=el('div');x.append(el('h3',0,s.title),el('p','muted',s.text),el('p','price',s.price));$('services').append(x)});
  d.testimonials.forEach(t=>{const x=el('div');x.append(el('q',0,t.quote),el('small',0,t.name+' — '+t.role));$('quotes').append(x)});
  hero(h);gallery(d.gallery);form(c);
}
function hero(h){
  const v=$('heroVideo'),box=$('slides'),reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const imgs=(h.images||[]).map((s,i)=>{const im=new Image();im.src=s;im.alt='';if(!i)im.className='on';box.append(im);return im});
  if(h.video&&!reduce){v.src=h.video;v.poster=h.images[0]||'';v.currentTime=0;
    v.play().then(()=>{box.style.display='none'}).catch(()=>{});
    v.addEventListener('ended',()=>{$('flash').classList.add('go');$('exif').classList.add('on');console.log('Hero video ended')})}
  else{$('exif').classList.add('on');if(imgs.length>1&&!reduce){let i=0;setInterval(()=>{imgs[i].classList.remove('on');i=(i+1)%imgs.length;imgs[i].classList.add('on')},6000)}}
  imgs[0]&&imgs[0].classList.add('on');
}
function gallery(items){
  const cats=['All',...new Set(items.map(i=>i.cat))];let cur=items,idx=0;
  const f=$('filters'),g=$('gallery');
  function draw(){g.innerHTML='';cur.forEach((it,i)=>{const fg=el('figure');fg.tabIndex=0;const im=new Image();im.src=it.src;im.alt=it.title+', '+it.location;im.loading='lazy';
    const cp=el('figcaption',0,it.title+' · '+it.location+' · '+it.cat);fg.append(im,cp);const open=()=>show(i);fg.onclick=open;fg.onkeydown=e=>e.key==='Enter'&&open();g.append(fg)})}
  cats.forEach((c,i)=>{const b=el('button',i?'':'on',c);b.onclick=()=>{[...f.children].forEach(x=>x.classList.remove('on'));b.classList.add('on');cur=c==='All'?items:items.filter(x=>x.cat===c);draw()};f.append(b)});
  const lb=$('lb');let last;
  function show(i){idx=(i+cur.length)%cur.length;last=document.activeElement;lb.hidden=false;$('lbImg').src=cur[idx].src;$('lbImg').alt=cur[idx].title;$('lbCap').textContent=cur[idx].title+' · '+cur[idx].location;$('lbClose').focus()}
  const close=()=>{lb.hidden=true;last&&last.focus()};
  $('lbClose').onclick=close;$('lbPrev').onclick=()=>show(idx-1);$('lbNext').onclick=()=>show(idx+1);
  document.addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1)});
  draw();
}
function form(c){
  $('form').addEventListener('submit',async e=>{e.preventDefault();const f=e.target,m=$('formMsg'),o=Object.fromEntries(new FormData(f));if(o.website)return;
    if(c.formEndpoint){try{const r=await fetch(c.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(o)});if(!r.ok)throw 0;f.reset();m.textContent='Thank you. I will reply within 24 hours.'}catch{m.textContent='Could not send. Please email '+c.email}}
    else location.href='mailto:'+c.email+'?subject='+encodeURIComponent(o.type+' inquiry from '+o.name)+'&body='+encodeURIComponent(o.message+'\n\n'+o.date+'\n'+o.email)});
  const d=$('drawer');$('menuBtn').onclick=()=>d.classList.add('open');$('closeBtn').onclick=()=>d.classList.remove('open');d.querySelectorAll('a').forEach(a=>a.onclick=()=>d.classList.remove('open'));
}
