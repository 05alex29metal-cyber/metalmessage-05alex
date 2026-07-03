const reviews=window.MM_REVIEWS||[];
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function art(r,cls='art-card'){return `<div class="${cls}"><span>${esc(r.genre)}</span><div class="symbol">${esc(r.symbol)}</div><b>${esc(r.poster)}</b><small>${esc(r.artist)}</small></div>`}
function scoreRows(scores){return Object.entries(scores||{}).map(([n,v])=>`<div class="score-row"><span>${esc(n)}</span><div class="bar"><i style="width:${Number(v)*10}%"></i></div><b>${esc(v)}/10</b></div>`).join('')}
function showReview(id){const r=reviews.find(x=>x.id===id);if(!r)return;document.querySelector('main').classList.add('hidden');const view=document.getElementById('reviewView');view.innerHTML=`<span class="back" onclick="showHome()">← Zurück</span><section class="review-page-x">${art(r)}<article class="review-main"><span class="label">MetalJournal · Review #${esc(r.num)}</span><h1>${esc(r.song)}</h1><h2>${esc(r.artist)} · ${esc(r.genre)} · ${esc(r.year)}</h2><div class="review-block"><span>Stimmungskarte</span><p>${esc(r.journal)}</p></div><div class="review-block"><span>05Alex sagt</span><p>${esc(r.review)}</p></div><div class="review-block score-table"><span>MetalScore</span><h2>${esc(r.score)}/10</h2>${scoreRows(r.scores)}</div><div class="review-block"><span>Lieblingsmoment</span><p>${esc(r.moment)}</p></div><div class="review-block"><span>Wann höre ich den Song?</span><p>${esc(r.listen)}</p></div></article></section>`;view.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
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
