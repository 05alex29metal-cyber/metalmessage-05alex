const reviews=window.MM_REVIEWS||[];
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function art(r,cls='art-card'){return `<div class="${cls}"><span>${esc(r.genre)}</span><div class="symbol">${esc(r.symbol)}</div><b>${esc(r.poster)}</b><small>${esc(r.artist)}</small></div>`}
function scoreRows(scores){return Object.entries(scores||{}).map(([n,v])=>`<div class="score-row"><span>${esc(n)}</span><div class="bar"><i style="width:${Number(v)*10}%"></i></div><b>${esc(v)}/10</b></div>`).join('')}
function showReview(id){const r=reviews.find(x=>x.id===id);if(!r)return;document.querySelector('main').classList.add('hidden');const view=document.getElementById('reviewView');view.innerHTML=`<span class="back" onclick="showHome()">← Zurück</span><section class="review-page-x">${art(r)}<article class="review-main"><span class="label">MetalJournal · Review #${esc(r.num)}</span><h1>${esc(r.song)}</h1><h2>${esc(r.artist)} · ${esc(r.genre)} · ${esc(r.year)}</h2><div class="review-block"><span>Stimmungskarte</span><p>${esc(r.journal)}</p></div><div class="review-block"><span>05Alex sagt</span><p>${esc(r.review)}</p></div><div class="review-block score-table"><span>MetalScore</span><h2>${esc(r.score)}/10</h2>${scoreRows(r.scores)}</div><div class="review-block"><span>Lieblingsmoment</span><p>${esc(r.moment)}</p></div><div class="review-block"><span>Wann höre ich den Song?</span><p>${esc(r.listen)}</p></div><div id="reactionMount"></div></article></section>`;view.classList.remove('hidden');renderReactions(r.id);window.scrollTo({top:0,behavior:'smooth'});}
function showHome(){document.getElementById('reviewView').classList.add('hidden');document.querySelector('main').classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
window.showHome=showHome;window.showReview=showReview;
document.querySelectorAll('[data-open]').forEach(el=>el.addEventListener('click',()=>showReview(el.dataset.open)));
document.querySelectorAll('.review-card-x').forEach(el=>el.addEventListener('click',()=>showReview(el.dataset.id)));
const input=document.getElementById('search');if(input){input.addEventListener('input',()=>{const q=input.value.toLowerCase().trim();document.querySelectorAll('.review-card-x').forEach(c=>c.style.display=c.dataset.search.includes(q)?'block':'none')});}
document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{const q=btn.dataset.filter||'';if(input){input.value=q;input.dispatchEvent(new Event('input'));}document.getElementById('reviews')?.scrollIntoView({behavior:'smooth'});}));
window.addEventListener('load',()=>setTimeout(()=>document.getElementById('loader')?.classList.add('hide'),450));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// MetalMessage XII random review
const randomButton = document.getElementById('randomReview');
if(randomButton){
  randomButton.addEventListener('click', () => {
    if(!reviews || !reviews.length) return;
    const review = reviews[Math.floor(Math.random() * reviews.length)];
    showReview(review.id);
  });
}

// MetalMessage XIII – Community Reactions
const reactionTypes=[{key:'legendary',emoji:'🤘',label:'Legendär'},{key:'banger',emoji:'🔥',label:'Banger'},{key:'brutal',emoji:'☠️',label:'Brutal'},{key:'atmosphere',emoji:'🌑',label:'Atmosphäre'},{key:'riff',emoji:'🎸',label:'Riff des Todes'},{key:'goosebumps',emoji:'🖤',label:'Gänsehaut'}];
function reactionSeed(reviewId,key){let seed=0;(reviewId+key).split('').forEach(ch=>seed+=ch.charCodeAt(0));return 11+(seed%48)}
function getReactions(){try{return JSON.parse(localStorage.getItem('mm_reactions')||'{}')}catch(e){return {}}}
function setReactions(data){localStorage.setItem('mm_reactions',JSON.stringify(data))}
function getUserReactions(){try{return JSON.parse(localStorage.getItem('mm_user_reactions')||'{}')}catch(e){return {}}}
function setUserReactions(data){localStorage.setItem('mm_user_reactions',JSON.stringify(data))}
function reactionCount(reviewId,key){const data=getReactions();return reactionSeed(reviewId,key)+Number(data?.[reviewId]?.[key]||0)}
function renderReactions(reviewId){
  const mount=document.getElementById('reactionMount');if(!mount)return;
  const user=getUserReactions();const selected=user[reviewId]||'';
  mount.innerHTML=`<div class="reaction-panel"><h3>Wie fühlst du diesen Song?</h3><p>Deine Reaktion wird lokal in deinem Browser gespeichert. Später wird daraus echte Community.</p><div class="reaction-grid">${reactionTypes.map(r=>`<button class="reaction-btn ${selected===r.key?'active':''}" data-reaction="${r.key}" data-review="${reviewId}"><span><span class="emoji">${r.emoji}</span> ${r.label}</span><span class="count">${reactionCount(reviewId,r.key)}</span></button>`).join('')}</div><p class="reaction-note">${selected?'Du hast reagiert: '+reactionTypes.find(r=>r.key===selected).emoji:''}</p></div>`;
  mount.querySelectorAll('.reaction-btn').forEach(btn=>btn.addEventListener('click',handleReaction));
}
function handleReaction(e){
  const btn=e.currentTarget, reviewId=btn.dataset.review, key=btn.dataset.reaction;
  const data=getReactions(), user=getUserReactions();
  if(user[reviewId]===key){pulseEmoji(btn);return}
  user[reviewId]=key; data[reviewId]=data[reviewId]||{}; data[reviewId][key]=Number(data[reviewId][key]||0)+1;
  setUserReactions(user); setReactions(data); renderReactions(reviewId);
  const fresh=document.querySelector(`[data-review="${reviewId}"][data-reaction="${key}"]`);
  if(fresh){pulseEmoji(fresh);spawnParticles(fresh)} updateCommunityFavorite();
}
function pulseEmoji(btn){
  const emoji=btn.querySelector('.emoji')?.textContent||'🤘';
  const pop=document.createElement('span');pop.className='pop-emoji';pop.textContent=emoji;pop.style.left='16px';pop.style.top='-10px';btn.appendChild(pop);setTimeout(()=>pop.remove(),700);
}
function spawnParticles(btn){
  const rect=btn.getBoundingClientRect();
  for(let i=0;i<7;i++){const p=document.createElement('span');p.className='pop-particle';p.style.left=(rect.left+rect.width/2)+'px';p.style.top=(rect.top+rect.height/2)+'px';p.style.setProperty('--x',((Math.random()*80)-40)+'px');p.style.setProperty('--y',((Math.random()*-70)-12)+'px');document.body.appendChild(p);setTimeout(()=>p.remove(),800)}
}
function totalReactionsFor(review){return reactionTypes.reduce((sum,r)=>sum+reactionCount(review.id,r.key),0)}
function updateCommunityFavorite(){
  const section=document.getElementById('communityFavorite');if(!section||!reviews?.length)return;
  const winner=[...reviews].sort((a,b)=>totalReactionsFor(b)-totalReactionsFor(a))[0];
  const top=reactionTypes.map(r=>({...r,count:reactionCount(winner.id,r.key)})).sort((a,b)=>b.count-a.count)[0];
  section.innerHTML=`<div><span>Community feiert gerade</span><h2>${winner.song}</h2><p>${winner.artist} · ${winner.genre} · ${totalReactionsFor(winner)} Reaktionen</p></div><strong>${top.emoji}</strong>`;
  section.style.cursor='pointer';section.onclick=()=>showReview(winner.id);
}
const randomButton=document.getElementById('randomReview');
if(randomButton){randomButton.addEventListener('click',()=>{if(!reviews?.length)return;showReview(reviews[Math.floor(Math.random()*reviews.length)].id)})}
updateCommunityFavorite();
