/* BAC-HUMANITIES — محرك الموقع. لا تعدّل هذا الملف لإضافة المحتوى. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const view = $('#view');
  const all = () => [
    ...lessons.map(x=>({...x,type:'lesson'})),
    ...articles.map(x=>({...x,type:'article'})),
    ...summaries.map(x=>({...x,type:'summary'})),
    ...concepts.map(x=>({...x,type:'concept'})),
    ...people.map(x=>({...x,type:'person'})),
    ...events.map(x=>({...x,type:'event'}))
  ];
  const typeNames = {lesson:'درس',article:'مقال',summary:'ملخص',concept:'مفهوم',person:'شخصية',event:'حدث'};
  const icons = {lesson:'📖',article:'✦',summary:'⚡',concept:'◇',person:'♙',event:'◷'};
  const subject = id => subjects.find(s=>s.id===id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const getFav = () => JSON.parse(localStorage.getItem('bac-favorites') || '[]');
  const setFav = a => localStorage.setItem('bac-favorites', JSON.stringify(a));
  let favorites = getFav();
  let notes = JSON.parse(localStorage.getItem('bac-notes') || 'null') || [
    {id:'n1',title:'فكرة حول الإدراك',text:'قارن بين دور الحواس ودور العقل في بناء الإدراك.',pinned:true,favorite:true},
    {id:'n2',title:'مراجعة التاريخ',text:'راجع سياق مؤتمر يالطا والحرب الباردة والنتائج الأساسية.',pinned:false,favorite:false}
  ];
  const saveNotes = () => localStorage.setItem('bac-notes', JSON.stringify(notes));
  const toast = msg => { const t=document.createElement('div'); t.className='toast'; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),2200); };
  const go = path => { history.pushState({},'',`#/${path}`); render(path); window.scrollTo({top:0,behavior:'smooth'}); };
  const currentPath = () => location.hash.replace(/^#\/?/,'') || 'home';

  function card(x){
    const key=`${x.type}:${x.id}`;
    return `<article class="card content-card-mini" data-search-text="${esc(`${x.title} ${x.desc||x.definition||x.bio||x.context||''} ${x.category||''} ${(x.tags||[]).join(' ')}`)}">
      <button class="card-click" data-open="${x.type}/${x.id}"><span class="subject-icon">${icons[x.type]}</span><span class="card-type">${typeNames[x.type]}</span><h3>${esc(x.title)}</h3><p>${esc(x.desc||x.definition||x.bio||x.context||'')}</p><div class="meta"><span class="tag">${esc(subject(x.subject)?.name||'عام')}</span>${(x.tags||[]).slice(0,2).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div></button>
      <button class="mini fav-btn" data-fav="${key}">${favorites.includes(key)?'★ محفوظ':'☆ حفظ'}</button>
    </article>`;
  }
  function pageHead(title,desc='',crumb='الرئيسية'){ return `<div class="page-title"><div class="breadcrumbs"><button data-go="home">${crumb}</button><span>›</span><span>${esc(title)}</span></div><h1>${esc(title)}</h1>${desc?`<p>${esc(desc)}</p>`:''}</div>`; }
  function stats(){ return `<div class="stats">${[['المواد',subjects.length],['الدروس',lessons.length],['المقالات',articles.length],['الملخصات',summaries.length],['المفاهيم',concepts.length],['الشخصيات',people.length],['الأحداث',events.length]].map(([n,v])=>`<div class="stat"><b>${v}</b><span>${n}</span></div>`).join('')}</div>`; }
  function home(){
    const recent=all().slice(0,8); const last=JSON.parse(localStorage.getItem('bac-last')||'null');
    return `<section class="hero home-hero"><span class="eyebrow">BAC • HUMANITIES</span><h1>كراستي الرقمية</h1><p>مساحتك الشخصية للدراسة: اجمع فيها الدروس والمقالات والملخصات والمفاهيم والتاريخ والملاحظات، وابنِ مكتبتك طوال السنة.</p><div class="actions"><button class="btn primary" data-go="subjects">استكشف المواد</button><button class="btn" data-go="lessons">ابدأ المراجعة</button></div></section>${stats()}<section class="section"><div class="section-head"><div><h2>موادك الدراسية</h2><p>ادخل إلى مساحة كل مادة.</p></div><button class="text-btn" data-go="subjects">عرض الكل ←</button></div><div class="grid four">${subjects.map(s=>`<article class="subject-card card"><button class="card-click" data-go="subject/${s.id}"><span class="subject-icon big">${s.icon}</span><h3>${s.name}</h3><p>${s.desc}</p><div class="subject-count">${lessons.filter(x=>x.subject===s.id).length} درس · ${articles.filter(x=>x.subject===s.id).length} مقال</div></button></article>`).join('')}</div></section>${last?`<section class="section"><div class="section-head"><div><h2>تابع من حيث توقفت</h2><p>آخر محتوى فتحته.</p></div></div><div class="continue-card card"><div><span class="eyebrow">${esc(typeNames[last.type]||'محتوى')}</span><h3>${esc(last.title)}</h3><p>${esc(last.desc||'')}</p></div><button class="btn primary" data-open="${last.type}/${last.id}">متابعة القراءة</button></div></section>`:''}<section class="section"><div class="section-head"><div><h2>من المكتبة</h2><p>محتوى جاهز لتبدأ منه.</p></div></div><div class="grid">${recent.map(card).join('')}</div></section>`;
  }
  function subjectsPage(){ return pageHead('المواد','سبع مساحات دراسية، لكل مادة هويتها ومحتواها.')+`<div class="grid">${subjects.map(s=>`<article class="subject-card card"><button class="card-click" data-go="subject/${s.id}"><span class="subject-icon big">${s.icon}</span><h2>${s.name}</h2><p>${s.desc}</p><div class="meta"><span class="tag">${lessons.filter(x=>x.subject===s.id).length} دروس</span><span class="tag">${articles.filter(x=>x.subject===s.id).length} مقالات</span><span class="tag">${summaries.filter(x=>x.subject===s.id).length} ملخصات</span></div></button></article>`).join('')}</div>`; }
  function subjectPage(id,tab='all'){
    const s=subject(id); if(!s)return notFound();
    const groups={all:all(),lessons:lessons.map(x=>({...x,type:'lesson'})),articles:articles.map(x=>({...x,type:'article'})),summaries:summaries.map(x=>({...x,type:'summary'})),concepts:concepts.map(x=>({...x,type:'concept'})),people:people.map(x=>({...x,type:'person'})),events:events.map(x=>({...x,type:'event'}))};
    const list=(groups[tab]||groups.all).filter(x=>x.subject===id);
    const labels={all:'الكل',lessons:'الدروس',articles:'المقالات',summaries:'الملخصات',concepts:'المفاهيم',people:'الشخصيات',events:'الأحداث'};
    return `<section class="subject-hero hero"><span class="eyebrow">${s.icon} مادة دراسية</span><h1>${esc(s.name)}</h1><p>${esc(s.desc)}</p><div class="subject-motto">${esc(s.motto)}</div></section><div class="tabs">${Object.keys(labels).map(t=>`<button class="${tab===t?'active':''}" data-go="subject/${id}/${t}">${labels[t]}</button>`).join('')}</div><div class="section-head"><div><h2>${labels[tab]}</h2><p>${list.length} عناصر</p></div></div><div class="grid">${list.length?list.map(card).join(''):`<div class="empty">لا يوجد محتوى في هذا القسم بعد.</div>`}</div>`;
  }
  function reading(x,type){
    localStorage.setItem('bac-last',JSON.stringify({id:x.id,type,title:x.title,desc:x.desc}));
    const sections = type==='article' ? x.sections.map((s,i)=>`<section class="article-section"><span class="section-number">0${i+1}</span><h2>${esc(s[0])}</h2><p>${esc(s[1])}</p>${i===1?`<div class="quote">الفكرة لا تصبح قوية بمجرد إعلانها؛ قوتها تظهر في الحجة والمناقشة.</div>`:''}</section>`).join('') : x.content;
    return `<div class="reading-head"><div class="breadcrumbs"><button data-go="subject/${x.subject}">${esc(subject(x.subject)?.name||'المادة')}</button><span>›</span><span>${typeNames[type]}</span></div><span class="eyebrow">${type==='article'?'مقال فلسفي':'درس'}</span><h1>${esc(x.title)}</h1><p>${esc(x.desc)}</p><div class="reading-meta"><span>📚 ${esc(subject(x.subject)?.name||'')}</span>${x.duration?`<span>◷ ${esc(x.duration)}</span>`:''}<span>🏷 ${(x.tags||[]).slice(0,3).map(esc).join(' · ')}</span></div><div class="actions"><button class="btn primary fav-btn" data-fav="${type}:${x.id}">${favorites.includes(type+':'+x.id)?'★ في المفضلة':'☆ أضف للمفضلة'}</button><button class="btn" id="printBtn">🖨 طباعة</button><button class="btn" data-go="subject/${x.subject}">← رجوع للمادة</button></div></div><div class="reading-shell"><aside class="toc"><b>داخل الصفحة</b><a href="#reading-content">المحتوى</a><a href="#study-note">ملاحظة سريعة</a><a href="#related">محتوى مرتبط</a></aside><article class="reading-page" id="reading-content">${type==='lesson'?`<div class="reading-intro"><span>✦</span><p>هذا الدرس من مكتبتك الرقمية. اقرأ الفكرة، ثم ارجع إلى الخلاصة وحاول صياغتها بأسلوبك.</p></div>`:''}${sections}<div id="study-note" class="study-box"><strong>📝 اكتب ملاحظة عن هذا المحتوى</strong><p>حوّل الفكرة التي قرأتها إلى ملاحظة شخصية حتى تبقى في كراستك.</p><button class="btn" data-new-note="${esc(x.title)}">+ إضافة ملاحظة</button></div><div id="related" class="related"><h2>محتوى مرتبط</h2><div class="grid two">${all().filter(y=>y.id!==x.id&&y.subject===x.subject).slice(0,3).map(card).join('')}</div></div></article></div>`;
  }
  function summaryPage(x){return pageHead(x.title,`ملخص سريع للمراجعة · ${subject(x.subject)?.name||''}`)+`<article class="summary-page content-card"><div class="summary-banner"><span>⚡</span><div><small>الموضوع</small><h2>${esc(x.topic)}</h2></div></div><section><h2>النقاط الأساسية</h2><div class="key-grid">${x.points.map((p,i)=>`<div class="key-point"><b>0${i+1}</b><span>${esc(p)}</span></div>`).join('')}</div></section><section><h2>التعريفات</h2>${x.definitions.map(d=>`<div class="definition"><strong>${esc(d[0])}</strong><p>${esc(d[1])}</p></div>`).join('')}</section><section><h2>مراجعة خاطفة</h2><ul class="check-list">${x.points.map(p=>`<li>✓ ${esc(p)}</li>`).join('')}</ul></section><section><h2>الكلمات المفتاحية</h2><div class="meta">${x.keywords.map(k=>`<span class="tag">${esc(k)}</span>`).join('')}</div></section></article>`;}
  function conceptPage(x){return pageHead(x.title,`صفحة معرفة · ${subject(x.subject)?.name||''}`)+`<article class="concept-page content-card"><div class="concept-definition"><span>◇</span><div><small>التعريف</small><p>${esc(x.definition)}</p></div></div><div class="knowledge-columns"><section><h2>السياق</h2><p>${esc(x.context)}</p></section><section><h2>الأفكار الرئيسية</h2><ul>${x.ideas.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></section></div><section><h2>مرتبط بـ</h2><div class="meta">${x.related.map(i=>`<span class="tag">${esc(i)}</span>`).join('')}</div></section><section><h2>وسوم</h2><div class="meta">${(x.tags||[]).map(i=>`<span class="tag">${esc(i)}</span>`).join('')}</div></section></article>`;}
  function personPage(x){return pageHead(x.title,`${x.role} · ${x.period}`)+`<article class="person-page content-card"><div class="person-banner"><div class="avatar">${esc(x.title.charAt(0))}</div><div><span class="eyebrow">شخصية</span><h2>${esc(x.title)}</h2><p>${esc(x.role)}</p></div></div><div class="timeline-fact"><span>الفترة</span><strong>${esc(x.period)}</strong></div><section><h2>نبذة</h2><p>${esc(x.bio)}</p></section><section><h2>الأفكار والمواقف</h2><ul>${x.ideas.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></section><section><h2>أهم الأعمال / المجالات</h2><div class="meta">${(x.works||[]).map(i=>`<span class="tag">${esc(i)}</span>`).join('')}</div></section><section><h2>مرتبط بـ</h2><div class="meta">${x.related.map(i=>`<span class="tag">${esc(i)}</span>`).join('')}</div></section></article>`;}
  function eventPage(x){return pageHead(x.title,`حدث تاريخي · ${x.date}`)+`<article class="event-page content-card"><div class="event-facts"><div><small>التاريخ</small><strong>${esc(x.date)}</strong></div><div><small>المكان</small><strong>${esc(x.place)}</strong></div></div><section><h2>الأطراف</h2><div class="party-list">${x.parties.map(p=>`<span>${esc(p)}</span>`).join('')}</div></section><section><h2>السياق</h2><p>${esc(x.context)}</p></section><section><h2>النتائج</h2><div class="key-grid">${x.outcomes.map((o,i)=>`<div class="key-point"><b>0${i+1}</b><span>${esc(o)}</span></div>`).join('')}</div></section><section class="importance"><h2>الأهمية التاريخية</h2><p>${esc(x.importance)}</p></section><section><h2>شخصيات مرتبطة</h2><div class="meta">${x.related.map(i=>`<span class="tag">${esc(i)}</span>`).join('')}</div></section></article>`;}
  function listing(title,arr,type){return pageHead(title,'استعرض المحتوى وابحث داخله بسرعة.')+`<div class="filterbar"><input id="listSearch" type="search" placeholder="ابحث في هذا القسم..."><select id="subjectFilter"><option value="all">كل المواد</option>${subjects.map(s=>`<option value="${s.id}">${s.name}</option>`).join('')}</select></div><div id="listGrid" class="grid">${arr.map(x=>card({...x,type})).join('')}</div>`;}
  function notesPage(){return pageHead('ملاحظاتي','ملاحظاتك محفوظة محليًا في هذا المتصفح.')+`<div class="note-toolbar"><button class="btn primary" id="newNote">+ ملاحظة جديدة</button><span>${notes.length} ملاحظات</span></div><div class="notes-grid">${notes.length?notes.sort((a,b)=>Number(b.pinned)-Number(a.pinned)).map(n=>`<article class="note-card card"><div class="note-top"><span class="tag">${n.pinned?'📌 مثبتة':'ملاحظة'}</span><button class="mini" data-pin="${n.id}">${n.pinned?'إلغاء التثبيت':'تثبيت'}</button></div><h3>${esc(n.title)}</h3><p>${esc(n.text)}</p><div class="note-actions"><button class="mini" data-edit="${n.id}">تعديل</button><button class="mini" data-note-fav="${n.id}">${n.favorite?'★ مفضلة':'☆ مفضلة'}</button><button class="mini danger" data-del="${n.id}">حذف</button></div></article>`).join(''):`<div class="empty"><strong>لا توجد ملاحظات بعد.</strong><br>فكرتك القادمة مكانها هنا.</div>`}</div>`;}
  function favoritesPage(){const a=all().filter(x=>favorites.includes(`${x.type}:${x.id}`));return pageHead('المفضلة','كل ما قررت الاحتفاظ به للعودة إليه لاحقًا.')+`<div class="grid">${a.length?a.map(card).join(''):`<div class="empty"><strong>المفضلة فارغة.</strong><br>اضغط ☆ حفظ على أي محتوى لإضافته هنا.</div>`}</div>`;}
  function linksPage(){return pageHead('الروابط والمراجع','روابط مختارة للوصول السريع إلى المصادر.')+`<div class="grid">${links.map(l=>`<article class="link-card card"><span class="subject-icon">↗</span><span class="card-type">${esc(l.type)}</span><h3>${esc(l.title)}</h3><p>${esc(l.desc)}</p><a class="btn primary" href="${esc(l.url)}" target="_blank" rel="noopener">فتح المصدر ↗</a></article>`).join('')}</div>`;}
  function searchPage(q){const needle=q.trim().toLowerCase();const a=all().filter(x=>`${x.title} ${x.desc||''} ${x.category||''} ${(x.tags||[]).join(' ')}`.toLowerCase().includes(needle));return pageHead(`نتائج البحث`,`نتائج البحث عن «${q}»`)+`<div class="grid">${a.length?a.map(card).join(''):`<div class="empty">لم نجد نتائج. جرّب كلمة أخرى.</div>`}</div>`;}
  function notFound(){return pageHead('الصفحة غير موجودة')+`<div class="empty"><strong>هذه الصفحة غير موجودة.</strong><br><button class="btn primary" data-go="home">العودة للرئيسية</button></div>`;}

  function render(path=currentPath()){
    const p=path.split('/').filter(Boolean); const r=p[0]||'home'; let html='';
    if(r==='home')html=home();
    else if(r==='subjects')html=subjectsPage();
    else if(r==='subject')html=subjectPage(p[1],p[2]||'all');
    else if(r==='lessons')html=listing('كل الدروس',lessons,'lesson');
    else if(r==='articles')html=listing('كل المقالات',articles,'article');
    else if(r==='summaries')html=listing('كل الملخصات',summaries,'summary');
    else if(r==='concepts')html=listing('كل المفاهيم',concepts,'concept');
    else if(r==='people')html=listing('الشخصيات',people,'person');
    else if(r==='events')html=listing('الأحداث التاريخية',events,'event');
    else if(r==='links')html=linksPage();
    else if(r==='notes')html=notesPage();
    else if(r==='favorites')html=favoritesPage();
    else if(r==='search')html=searchPage(decodeURIComponent(p.slice(1).join('/')));
    else if(['lesson','article','summary','concept','person','event'].includes(r)){
      const source={lesson:lessons,article:articles,summary:summaries,concept:concepts,person:people,event:events}[r]; const x=source.find(i=>i.id===p[1]);
      if(!x)html=notFound(); else if(r==='lesson'||r==='article')html=reading(x,r); else if(r==='summary')html=summaryPage(x); else if(r==='concept')html=conceptPage(x); else if(r==='person')html=personPage(x); else html=eventPage(x);
    } else html=notFound();
    view.innerHTML=html; bind(); updateActive(); view.focus({preventScroll:true});
  }
  function bind(){
    document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
    document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>go(b.dataset.open));
    document.querySelectorAll('[data-fav]').forEach(b=>b.onclick=e=>{e.stopPropagation();const k=b.dataset.fav;favorites=favorites.includes(k)?favorites.filter(x=>x!==k):[...favorites,k];setFav(favorites);toast(favorites.includes(k)?'★ تمت الإضافة إلى المفضلة':'أزيل من المفضلة');render(currentPath());});
    $('#printBtn')?.addEventListener('click',()=>window.print());
    $('#newNote')?.addEventListener('click',()=>noteEditor());
    document.querySelectorAll('[data-new-note]').forEach(b=>b.onclick=()=>noteEditor(null,b.dataset.newNote));
    document.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{if(confirm('حذف هذه الملاحظة؟')){notes=notes.filter(n=>n.id!==b.dataset.del);saveNotes();render('notes');toast('تم حذف الملاحظة');}});
    document.querySelectorAll('[data-pin]').forEach(b=>b.onclick=()=>{const n=notes.find(n=>n.id===b.dataset.pin);n.pinned=!n.pinned;saveNotes();render('notes');});
    document.querySelectorAll('[data-note-fav]').forEach(b=>b.onclick=()=>{const n=notes.find(n=>n.id===b.dataset.noteFav);n.favorite=!n.favorite;saveNotes();render('notes');});
    document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>noteEditor(notes.find(n=>n.id===b.dataset.edit)));
    $('#listSearch')?.addEventListener('input',applyFilter); $('#subjectFilter')?.addEventListener('change',applyFilter);
    $('#globalSearch')?.addEventListener('input',liveSearch);
    document.querySelectorAll('.search-result-btn').forEach(b=>b.onclick=()=>{hideSearch();go(b.dataset.open);});
  }
  function applyFilter(){const q=($('#listSearch')?.value||'').toLowerCase();const s=$('#subjectFilter')?.value||'all';document.querySelectorAll('#listGrid .card').forEach(c=>{const txt=(c.dataset.searchText||'').toLowerCase();const subjectText=c.innerText; c.style.display=(!q||txt.includes(q))&&(s==='all'||subjectText.includes(subject(s)?.name))?'':'none';});}
  function liveSearch(){const q=$('#globalSearch').value.trim().toLowerCase();const box=$('#searchResults');if(!q){hideSearch();return;}const results=all().filter(x=>`${x.title} ${x.desc||''} ${x.category||''} ${(x.tags||[]).join(' ')}`.toLowerCase().includes(q)).slice(0,7);box.innerHTML=results.length?results.map(x=>`<button class="result search-result-btn" data-open="${x.type}/${x.id}">${icons[x.type]} ${esc(x.title)}<small>${typeNames[x.type]} · ${esc(subject(x.subject)?.name||'')}</small></button>`).join(''):`<div class="empty small">لا توجد نتائج</div>`;box.hidden=false;bind();}
  function hideSearch(){const box=$('#searchResults');if(box)box.hidden=true;}
  function noteEditor(note=null,prefill=''){const root=$('#modalRoot');root.innerHTML=`<div class="modal"><div class="modal-box"><div class="modal-head"><div><span class="eyebrow">كراستي</span><h2>${note?'تعديل الملاحظة':'ملاحظة جديدة'}</h2></div><button class="close" id="closeModal">×</button></div><label>العنوان</label><input id="noteTitle" value="${esc(note?.title||prefill)}" placeholder="مثلاً: فكرة مهمة في الإدراك"><label>الملاحظة</label><textarea id="noteText" placeholder="اكتب فكرتك هنا...">${esc(note?.text||'')}</textarea><div class="actions"><button class="btn primary" id="saveNote">حفظ الملاحظة</button><button class="btn" id="cancelNote">إلغاء</button></div></div></div>`;$('#closeModal').onclick=closeModal;$('#cancelNote').onclick=closeModal;$('#saveNote').onclick=()=>{const title=$('#noteTitle').value.trim(),text=$('#noteText').value.trim();if(!title||!text){toast('اكتب العنوان والملاحظة أولًا');return;}if(note){note.title=title;note.text=text;}else notes.unshift({id:'n'+Date.now(),title,text,pinned:false,favorite:false});saveNotes();closeModal();render('notes');toast('✓ تم حفظ الملاحظة');};setTimeout(()=>$('#noteTitle')?.focus(),50);}
  function closeModal(){$('#modalRoot').innerHTML='';}
  function updateActive(){const route=currentPath().split('/')[0];document.querySelectorAll('.nav button[data-route]').forEach(b=>b.classList.toggle('active',b.dataset.route===route));}
  $('#themeToggle')?.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;localStorage.setItem('bac-theme',next);});
  $('#mobileMenu')?.addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
  document.addEventListener('click',e=>{if(!e.target.closest('.search-wrap'))hideSearch();if(e.target.closest('#sidebar .nav button'))$('#sidebar').classList.remove('open');});
  window.addEventListener('popstate',()=>render());
  window.addEventListener('hashchange',()=>render());
  render();
})();
