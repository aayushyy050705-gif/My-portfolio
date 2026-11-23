// Ayushi portfolio interactions — playful cursor + subtle 3D movement
const dot = document.querySelector('.cursor-dot');
const halo = document.querySelector('.cursor-halo');
let mouseX=-100, mouseY=-100, haloX=-100, haloY=-100;
const finePointer=window.matchMedia('(pointer:fine)').matches;
if(finePointer && dot && halo){
  document.addEventListener('mousemove',e=>{
    mouseX=e.clientX; mouseY=e.clientY;
    dot.style.opacity='1'; halo.style.opacity='1';
    dot.style.left=mouseX+'px'; dot.style.top=mouseY+'px';
  });
  const follow=()=>{
    haloX+=(mouseX-haloX)*.17; haloY+=(mouseY-haloY)*.17;
    halo.style.left=haloX+'px'; halo.style.top=haloY+'px';
    requestAnimationFrame(follow);
  }; follow();

  const hoverables=document.querySelectorAll('a,button,.project-card,.project-feature,.photo-frame,.experience-card,.education-card,.skill-group,[data-cursor]');
  hoverables.forEach((el,index)=>{
    el.addEventListener('mouseenter',()=>{
      halo.classList.add('hovering');
      const custom=el.dataset.cursor;
      const defaults=['Take a peek ✦','Explore this ♡','A little wonder ✿','Come closer ↗','Discover more ✧'];
      halo.querySelector('span').textContent=custom || defaults[index%defaults.length];
    });
    el.addEventListener('mouseleave',()=>halo.classList.remove('hovering'));
  });
}

// Gentle 3D tilt follows the pointer on larger screens.
if(finePointer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.querySelectorAll('.project-card,.project-feature,.experience-card,.education-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width;
      const y=(e.clientY-r.top)/r.height;
      const ry=(x-.5)*9;
      const rx=(.5-y)*7;
      card.style.transform=`perspective(950px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transform='';
    });
  });
}

// Reveal elements as they enter the viewport.
const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

// Mobile navigation.
const menuToggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
if(menuToggle&&nav){
  menuToggle.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded',String(open));
    menuToggle.textContent=open?'×':'☰';
  });
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.textContent='☰';
  }));
}

// Tiny sparkles that fade behind the cursor.
if(finePointer&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  let lastSpark=0;
  document.addEventListener('mousemove',e=>{
    const now=Date.now();if(now-lastSpark<160||Math.random()>.28)return;lastSpark=now;
    const s=document.createElement('span');s.textContent=Math.random()>.5?'✦':'✧';s.className='pointer-sparkle';
    s.style.cssText=`position:fixed;left:${e.clientX+7}px;top:${e.clientY-8}px;pointer-events:none;z-index:999;color:#d97898;font-size:${11+Math.random()*10}px;animation:sparkleOut .7s ease forwards`;
    document.body.appendChild(s);setTimeout(()=>s.remove(),720);
  });
  const st=document.createElement('style');st.textContent='@keyframes sparkleOut{0%{opacity:1;transform:scale(.4) rotate(0)}100%{opacity:0;transform:translate(13px,-20px) scale(1.5) rotate(55deg)}}';document.head.appendChild(st);
}

// Quest-garden cursor polish: a soft delayed bloom and a restrained sparkle trail.
if(finePointer&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const haloLabel=halo?.querySelector('span');
  document.querySelectorAll('.questlab-card').forEach(card=>{card.addEventListener('mouseenter',()=>{if(haloLabel)haloLabel.textContent='Enter the arena ✦';halo?.classList.add('quest-hover')})});
}


// Role Skills & Proof of Work explorer: keyboard-friendly tabs with one visible panel.
(()=>{
  const tabs=[...document.querySelectorAll('.role-tab')];
  const panels=[...document.querySelectorAll('.role-panel')];
  if(!tabs.length||!panels.length)return;
  const activate=(key,focus=false)=>{
    tabs.forEach(tab=>{
      const selected=tab.dataset.role===key;
      tab.classList.toggle('active',selected);
      tab.setAttribute('aria-selected',String(selected));
      tab.tabIndex=selected?0:-1;
      if(selected&&focus)tab.focus();
    });
    panels.forEach(panel=>{
      const selected=panel.dataset.panel===key;
      panel.hidden=!selected;
      panel.classList.toggle('active',selected);
    });
  };
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>activate(tab.dataset.role));
    tab.addEventListener('keydown',event=>{
      let next=index;
      if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(index+1)%tabs.length;
      else if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;
      else if(event.key==='Home')next=0;
      else if(event.key==='End')next=tabs.length-1;
      else return;
      event.preventDefault();activate(tabs[next].dataset.role,true);
    });
  });
  tabs.forEach((tab,index)=>tab.tabIndex=index===0?0:-1);
})();
