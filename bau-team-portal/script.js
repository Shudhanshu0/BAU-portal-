
const state={tools:[],contacts:[],category:'All',search:'',favorites:new Set(JSON.parse(localStorage.getItem('bauFavorites')||'[]'))};
const $=s=>document.querySelector(s);
const categoryMeta={Monitoring:['fa-chart-line','#ef4444'],VMware:['fa-server','#0ea5e9'],Cloud:['fa-cloud','#6366f1'],Security:['fa-shield-halved','#10b981'],Documentation:['fa-book-open','#f59e0b']};
async function loadPortal(){
  try{
    const response=await fetch('links.json',{cache:'no-store'}); if(!response.ok) throw new Error('Unable to read links.json');
    const data=await response.json(); state.tools=data.tools||[]; state.contacts=data.contacts||[];
    $('#portalTitle').textContent=data.branding?.title||'BAU Team Portal'; $('#portalSubtitle').textContent=data.branding?.subtitle||'Daily operations, one click away';
    $('#companyLogo').src=data.branding?.logo||'assets/company-logo.svg';
    const configured=data.lastUpdated; $('#lastUpdated').textContent=configured||new Date().toLocaleDateString(undefined,{day:'2-digit',month:'short',year:'numeric'});
    buildFilters(); render(); renderContacts();
  }catch(error){
    $('#toolsGrid').innerHTML=`<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><h3>Portal data could not load</h3><p>Start a local web server instead of opening index.html directly. See README.md.</p></div>`;
    showToast(error.message);
  }
}
function buildFilters(){const categories=['All',...new Set(state.tools.map(t=>t.category))];$('#categoryFilters').innerHTML=categories.map(c=>`<button class="filter-btn ${c==='All'?'active':''}" data-category="${c}">${c}</button>`).join('');}
function filteredTools(){return state.tools.filter(t=>(state.category==='All'||t.category===state.category)&&(`${t.name} ${t.description} ${t.category}`.toLowerCase().includes(state.search)));}
function toolCard(t){const m=categoryMeta[t.category]||['fa-link','#64748b'];const fav=state.favorites.has(t.id);return `<article class="tool-card"><button class="favorite-btn ${fav?'active':''}" data-favorite="${t.id}" aria-label="${fav?'Remove from':'Add to'} favourites"><i class="${fav?'fa-solid':'fa-regular'} fa-star"></i></button><a class="tool-link" href="${escapeAttr(t.url)}" target="_blank" rel="noopener noreferrer"><span class="tool-icon" style="background:${m[1]}"><i class="fa-solid ${t.icon||m[0]}"></i></span><h4>${escapeHtml(t.name)}</h4><p>${escapeHtml(t.description||'Open this BAU resource')}</p><span class="category-tag">${escapeHtml(t.category)}</span></a></article>`;}
function render(){const items=filteredTools();$('#toolsGrid').innerHTML=items.map(toolCard).join('');$('#resultCount').textContent=`${items.length} tool${items.length===1?'':'s'}`;$('#emptyState').classList.toggle('hidden',items.length>0);const favs=state.tools.filter(t=>state.favorites.has(t.id));$('#favoritesGrid').innerHTML=favs.map(toolCard).join('');$('#favoriteCount').textContent=favs.length;$('#favoritesSection').classList.toggle('hidden',favs.length===0);}
function renderContacts(){ $('#contactsGrid').innerHTML=state.contacts.map(c=>{const initials=c.name.split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase();return `<article class="contact-card"><div class="avatar">${initials}</div><div><h4>${escapeHtml(c.name)}</h4><p>${escapeHtml(c.role)}</p><div class="contact-actions"><a href="mailto:${escapeAttr(c.email)}"><i class="fa-regular fa-envelope"></i> Email</a>${c.teamsUrl?`<a href="${escapeAttr(c.teamsUrl)}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-microsoft"></i> Teams</a>`:''}</div></div></article>`}).join('');}
function escapeHtml(v=''){const d=document.createElement('div');d.textContent=v;return d.innerHTML} function escapeAttr(v=''){return escapeHtml(v).replace(/`/g,'&#96;')}
function showToast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1800)}
$('#searchBox').addEventListener('input',e=>{state.search=e.target.value.trim().toLowerCase();render()});
$('#categoryFilters').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;state.category=b.dataset.category;document.querySelectorAll('.filter-btn').forEach(x=>x.classList.toggle('active',x===b));render()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-favorite]');if(!b)return;e.preventDefault();const id=b.dataset.favorite;state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);localStorage.setItem('bauFavorites',JSON.stringify([...state.favorites]));render();showToast('Favourites updated')});
$('#themeToggle').addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;localStorage.setItem('bauTheme',next);$('#themeToggle i').className=`fa-solid ${next==='dark'?'fa-sun':'fa-moon'}`});
const savedTheme=localStorage.getItem('bauTheme')||'dark';document.documentElement.dataset.theme=savedTheme;$('#themeToggle i').className=`fa-solid ${savedTheme==='dark'?'fa-sun':'fa-moon'}`;
loadPortal();
