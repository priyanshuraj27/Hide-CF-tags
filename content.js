(function(){
  const STORAGE_KEY = 'hideTags';
  const TOGGLE_ID = 'cf-tag-hider-toggle';
  const HIDDEN_CLASS = 'cfth-hidden';

  function injectStyles(){
    if(document.getElementById('cfth-styles'))return;
    const s=document.createElement('style');
    s.id='cfth-styles';
    s.textContent=`.${HIDDEN_CLASS}{opacity:0!important;transition:opacity 220ms ease;pointer-events:none!important}.cfth-tag{opacity:1;transition:opacity 220ms ease}#${TOGGLE_ID}{display:inline-flex;align-items:center;gap:6px;margin-left:8px;font-size:12px}#${TOGGLE_ID} input[type=checkbox]{transform:scale(1.05)}`;
    document.head.appendChild(s);
  }

  function findTagElements(){
    const selectors=['.tag-box','.problem-tags','.tags','.problem-statement .tags'];
    const nodes=[];selectors.forEach(sel=>document.querySelectorAll(sel).forEach(n=>nodes.push(n)));
    return Array.from(new Set(nodes));
  }

  function setTagsHidden(hide){
    const tagEls=findTagElements();if(!tagEls||tagEls.length===0)return;
    tagEls.forEach(el=>{
      if(el.classList&&(el.classList.contains('problem-tags')||el.classList.contains('tags')||el.classList.contains('problem-statement'))){
        const children=el.querySelectorAll('.tag-box,a,span');
        children.forEach(child=>{child.classList.add('cfth-tag');if(hide)child.classList.add(HIDDEN_CLASS);else child.classList.remove(HIDDEN_CLASS);});
      }else{el.classList.add('cfth-tag');if(hide)el.classList.add(HIDDEN_CLASS);else el.classList.remove(HIDDEN_CLASS);} 
    });
  }

  function findTagContainer(){
    const explicit=['.problem-tags','.tags','.problem-statement .tags'];
    for(const sel of explicit){const el=document.querySelector(sel);if(el)return el}
    const candidates=document.querySelectorAll('.problem-statement,.problem,.problem-index');
    for(const c of candidates){if(c.querySelector&&c.querySelector('.tag-box'))return c.querySelector('.tag-box').parentNode}
    return null;
  }

  function findProblemTagsCaption(){
    const captions=document.querySelectorAll('div.caption.titled');
    for(const c of captions){try{if(/problem\s*tags/i.test(c.textContent))return c}catch(e){continue}}
    return null;
  }

  function createOrUpdateToggle(hide){
    let toggleWrap=document.getElementById(TOGGLE_ID);
    if(toggleWrap){const checkbox=toggleWrap.querySelector('input[type="checkbox"]');const label=toggleWrap.querySelector('label');if(checkbox)checkbox.checked=hide;if(label)label.textContent=hide?'Hide tags':'Show tags';return toggleWrap}
    const container=findTagContainer();const caption=findProblemTagsCaption();toggleWrap=document.createElement('div');toggleWrap.id=TOGGLE_ID;const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=hide;checkbox.title='Toggle problem tags visibility';const label=document.createElement('label');label.textContent=hide?'Hide tags':'Show tags';label.style.cursor='pointer';toggleWrap.appendChild(checkbox);toggleWrap.appendChild(label);
    checkbox.addEventListener('change',()=>{const shouldHide=checkbox.checked;try{chrome.storage.sync.set({[STORAGE_KEY]:shouldHide})}catch(e){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(shouldHide))}catch(er){}}label.textContent=shouldHide?'Hide tags':'Show tags';setTagsHidden(shouldHide)});
    if(caption&&caption.parentNode){caption.parentNode.insertBefore(toggleWrap,caption.nextSibling)}else if(container&&container.parentNode){container.parentNode.insertBefore(toggleWrap,container)}else{const fallback=document.querySelector('.problem-statement')||document.body;fallback.insertBefore(toggleWrap,fallback.firstChild)}
    return toggleWrap;
  }

  function initOnce(){injectStyles();function applyHide(hide){createOrUpdateToggle(hide);setTagsHidden(hide)}if(typeof chrome!=='undefined'&&chrome.storage&&chrome.storage.sync){chrome.storage.sync.get(STORAGE_KEY,(res)=>{const hide=(res&&typeof res[STORAGE_KEY]!=='undefined')?res[STORAGE_KEY]:true;applyHide(hide)});if(chrome.storage&&chrome.storage.onChanged){chrome.storage.onChanged.addListener((changes)=>{if(STORAGE_KEY in changes)applyHide(changes[STORAGE_KEY].newValue)})}}else{let hide=true;try{const v=localStorage.getItem(STORAGE_KEY);if(v!==null)hide=JSON.parse(v)}catch(e){}applyHide(hide)}}

  function watchForTagArea(){
    const observer=new MutationObserver((mutations)=>{for(const m of mutations){if(m.addedNodes&&m.addedNodes.length){for(const n of m.addedNodes){if(n.nodeType!==1)continue;if(n.querySelector&&(n.querySelector('.tag-box')||n.querySelector('.problem-tags')||n.classList.contains('problem-tags'))){initOnce();return}}}}});observer.observe(document.body,{childList:true,subtree:true});
  }

  try{initOnce();watchForTagArea()}catch(e){console.error('CF Tag Hider error',e)}
})();
