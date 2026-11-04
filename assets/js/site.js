(()=>{
document.querySelectorAll('[data-d]').forEach(el=>el.style.setProperty('--d',el.dataset.d));
const WA='5583999354112';
document.querySelectorAll('[data-wa]').forEach(a=>{a.href='https://wa.me/'+WA+'?text='+encodeURIComponent(a.dataset.wa);a.target='_blank';a.rel='noopener noreferrer'});
document.getElementById('yr').textContent=new Date().getFullYear();

/* split de palavras para títulos */
document.querySelectorAll('.split').forEach(el=>{
  let i=0;
  const walk=n=>{[...n.childNodes].forEach(c=>{
    if(c.nodeType===3){
      const f=document.createDocumentFragment();
      c.textContent.split(/([ \t\n\r]+)/).forEach(t=>{
        if(!t)return;
        if(/^[ \t\n\r]+$/.test(t)){f.appendChild(document.createTextNode(' '));return}
        const w=document.createElement('span');w.className='w';
        const s=document.createElement('span');s.textContent=t;s.style.setProperty('--i',i++);
        w.appendChild(s);f.appendChild(w);
      });
      c.replaceWith(f);
    }else if(c.nodeType===1)walk(c);
  })};
  walk(el);
});

/* revelar ao rolar */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.14,rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.rv,.split,.img-rv,.cota,.steps,.g5').forEach(el=>{if(!el.closest('.hero'))io.observe(el)});
/* hero imediato */
const heroIn=()=>document.querySelectorAll('.hero .rv,.hero .split,.hero .img-rv').forEach(el=>el.classList.add('in'));
const intro=document.getElementById('intro');
let introDone=false;
const endIntro=()=>{if(introDone)return;introDone=true;intro.classList.add('out');document.documentElement.classList.remove('intro-on');setTimeout(heroIn,250);setTimeout(()=>intro.remove(),1000)};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
setTimeout(endIntro,reduce?1200:4500);
intro.addEventListener('click',endIntro);

/* header, progresso, menu ativo, botão flutuante */
const hdr=document.getElementById('hdr'),bar=document.querySelector('.progress'),wpp=document.querySelector('.wpp');
const links=[...document.querySelectorAll('.nav a')];
const secs=links.map(a=>document.querySelector(a.getAttribute('href')));
let tick=false;
const onScroll=()=>{
  const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  hdr.classList.toggle('solid',y>40);
  bar.style.transform='scaleX('+(h>0?y/h:0)+')';
  wpp.classList.toggle('show',y>innerHeight*.6);
  let cur=-1;secs.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<innerHeight*.4)cur=i});
  links.forEach((a,i)=>a.classList.toggle('on',i===cur));
  tick=false;
};
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();

/* menu mobile */
const burger=document.querySelector('.burger');
const toggle=o=>{document.body.classList.toggle('menu-open',o);burger.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''};
burger.addEventListener('click',()=>toggle(!document.body.classList.contains('menu-open')));
document.querySelectorAll('.mnav a').forEach(a=>a.addEventListener('click',()=>toggle(false)));

/* vídeos soltos: tocam só quando visíveis (sempre sem som) */
const vio=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;v.muted=true;if(e.isIntersecting){v.play().catch(()=>{})}else v.pause()}),{threshold:.25});
document.querySelectorAll('video[data-auto], .hero video').forEach(v=>vio.observe(v));

/* lightbox do portfólio */
const shots=[...document.querySelectorAll('.port button')],lbx=document.getElementById('lbx'),limg=lbx.querySelector('img');let li=0,lastF=null;
const show=i=>{li=(i+shots.length)%shots.length;const im=shots[li].querySelector('img');limg.src=im.src;limg.alt=im.alt};
shots.forEach((b,i)=>b.addEventListener('click',()=>{lastF=b;show(i);lbx.classList.add('open');document.body.style.overflow='hidden';lbx.querySelector('.x').focus()}));
const close=()=>{lbx.classList.remove('open');document.body.style.overflow='';lastF&&lastF.focus()};
lbx.querySelector('.x').onclick=close;lbx.querySelector('.pv').onclick=()=>show(li-1);lbx.querySelector('.nx').onclick=()=>show(li+1);
lbx.addEventListener('click',e=>{if(e.target===lbx)close()});
addEventListener('keydown',e=>{if(!lbx.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(li-1);if(e.key==='ArrowRight')show(li+1)});

/* carrossel de vídeos — destaque no centro, sem som, autoplay */
const vc=document.getElementById('vc'),items=[...vc.querySelectorAll('.it')],N=items.length,dots=document.getElementById('vdots');
let act=0,vis=false,timer=null;
items.forEach((_,i)=>{const d=document.createElement('button');d.setAttribute('aria-label','Vídeo '+(i+1));d.onclick=()=>go(i);dots.appendChild(d)});
const render=()=>{
  items.forEach((it,i)=>{
    let o=i-act;if(o>N/2)o-=N;if(o<-N/2)o+=N;
    const a=Math.abs(o);
    it.style.setProperty('--o',o);
    it.style.setProperty('--s',a===0?1:a===1?.82:.66);
    it.style.setProperty('--op',a===0?1:a===1?.55:a===2?.25:0);
    it.style.setProperty('--sat',a===0?1:.5);
    it.style.setProperty('--br',a===0?1:.75);
    it.style.setProperty('--z',10-a);
    it.classList.toggle('act',a===0);
    it.setAttribute('aria-hidden',a!==0);
    const v=it.querySelector('video');v.muted=true;
    if(vis&&a<=1){if(v.preload==='none')v.preload='auto';v.play().catch(()=>{})}else v.pause();
  });
  [...dots.children].forEach((d,i)=>d.classList.toggle('on',i===act));
};
const go=i=>{act=(i+N)%N;render();restart()};
const restart=()=>{clearInterval(timer);if(vis&&!matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setInterval(()=>go(act+1),7000)};
items.forEach((it,i)=>it.addEventListener('click',()=>{if(i!==act)go(i)}));
document.getElementById('vprev').onclick=()=>go(act-1);
document.getElementById('vnext').onclick=()=>go(act+1);
vc.addEventListener('mouseenter',()=>clearInterval(timer));vc.addEventListener('mouseleave',restart);
let sx=null;
vc.addEventListener('pointerdown',e=>{sx=e.clientX});
vc.addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx;if(Math.abs(dx)>40)go(act+(dx<0?1:-1));sx=null});
new IntersectionObserver(es=>{vis=es[0].isIntersecting;render();restart()},{threshold:.2}).observe(vc);
render();
})();
