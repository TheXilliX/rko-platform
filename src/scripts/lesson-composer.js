import { Editor, Node, Mark, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { TableKit } from '@tiptap/extension-table';
import { TextStyleKit } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Details, DetailsContent, DetailsSummary } from '@tiptap/extension-details';

const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const colors = [['Графит','#292929'],['Зелёный','#2F7D57'],['Янтарный','#C77B18'],['Синий','#5C7EA6'],['Серый','#71869B'],['Красный','#B45D59']];
const highlights = ['#dcebdd','#fce5bd','#dce7f1','#e6e6e6','#f1d8d7'];
const svg = path => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const icons = {
  undo: svg('<path d="M8 4 3 9l5 5M3 9h11a6 6 0 0 1 0 12h-3"/>'),
  redo: svg('<path d="m16 4 5 5-5 5M21 9H10a6 6 0 0 0 0 12h3"/>'),
  text: '<span>Aa</span>', format:'<b>B</b>',
  list: svg('<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="3" cy="6" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="18" r="1"/>'),
  table: svg('<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M3 15h18M10 3v18"/>'),
  link: svg('<path d="m10 14 4-4m-6 6-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 2 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0"/>'),
  media: svg('<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1"/><path d="m3 17 5-5 4 4 4-5 5 6"/>'),
  align: svg('<path d="M3 5h18M3 10h12M3 15h18M3 20h12"/>'),
};

const Callout = Node.create({
  name: 'callout', group:'block', content:'block+', defining:true,
  addAttributes() { return {
    icon: {default:'!', parseHTML:e=>e.dataset.icon, renderHTML:a=>({'data-icon':a.icon})},
    color: {default:'#2F7D57', parseHTML:e=>e.dataset.color, renderHTML:a=>({'data-color':a.color,style:`--callout-color:${/^#[0-9a-f]{6}$/i.test(a.color)?a.color:'#2F7D57'}`})},
  }; },
  parseHTML() { return [{tag:'aside[data-callout]'}]; },
  renderHTML({HTMLAttributes}) { return ['aside',mergeAttributes(HTMLAttributes,{'data-callout':'',class:'document-callout'}),0]; },
});
const Spoiler = Mark.create({name:'spoiler',parseHTML(){return [{tag:'span[data-spoiler]'}];},renderHTML(){return ['span',{'data-spoiler':'',class:'document-spoiler'},0];}});

export function legacyLessonHTML(blocks) {
  return (blocks || []).map(b=> {
    if (b.type==='text') return b.html || '<p></p>';
    if (b.type==='heading') {
      const tag=/^h[1-6]$/.test(b.level)?b.level:'h2';
      return `<${tag} style="text-align:${['left','center','right'].includes(b.align)?b.align:'left'}"><span style="color:${escape(b.color || '#292929')}">${escape(b.text)}</span></${tag}>`;
    }
    if (b.type==='callout') return `<aside data-callout data-icon="${escape(b.icon||'!')}" data-color="${escape(b.color||'#2F7D57')}"><p><strong>${escape(b.label)}</strong></p>${b.html||'<p></p>'}</aside>`;
    if (b.type==='accordion') return `<details open><summary>${escape(b.title||'Подробнее')}</summary><div data-type="detailsContent">${b.html||'<p></p>'}</div></details>`;
    if (b.type==='divider') return '<hr>';
    return `<figure data-asset="${escape(b.id)}" data-kind="${escape(b.type)}" data-filename="${escape(b.fileName)}"></figure>`;
  }).join('') || '<p></p>';
}

export async function hydrateDocumentAssets(root, getAsset, downloadsAllowed=true) {
  const urls=[];
  await Promise.all([...root.querySelectorAll('figure[data-asset]')].map(async figure=> {
    const asset=await getAsset(figure.dataset.asset);
    figure.replaceChildren();
    if (!asset?.blob) { figure.textContent=`Файл недоступен в этом браузере: ${figure.dataset.filename||'вложение'}`; return; }
    const url=URL.createObjectURL(asset.blob); urls.push(url);
    const kind=figure.dataset.kind;
    if (['image','video','audio'].includes(kind)) {
      const media=document.createElement(kind==='image'?'img':kind);
      media.src=url;
      if (kind==='image') media.alt=figure.dataset.filename||'';
      else {media.controls=true; media.preload='metadata'; media.setAttribute('playsinline','');}
      figure.append(media);
    }
    if (downloadsAllowed) {
      const link=document.createElement('a'); link.href=url; link.download=figure.dataset.filename||'file'; link.textContent=figure.dataset.filename||'Скачать файл'; figure.append(link);
    } else if (kind==='file') figure.textContent=figure.dataset.filename||'Вложение';
  }));
  return urls;
}

export function createLessonComposer({element,toolbar,blocks,onChange,getAsset,putAsset,onError}) {
  let disposed=false, openMenu=null;
  const cleanups=[];
  const Asset=Node.create({
    name:'lessonAsset',group:'block',atom:true,draggable:true,
    addAttributes(){return {
      asset:{default:'',parseHTML:e=>e.dataset.asset,renderHTML:a=>({'data-asset':a.asset})},
      kind:{default:'file',parseHTML:e=>e.dataset.kind,renderHTML:a=>({'data-kind':a.kind})},
      filename:{default:'',parseHTML:e=>e.dataset.filename,renderHTML:a=>({'data-filename':a.filename})},
    };},
    parseHTML(){return [{tag:'figure[data-asset]'}];},
    renderHTML({HTMLAttributes}){return ['figure',mergeAttributes(HTMLAttributes,{class:'document-asset'})];},
    addNodeView(){return ({node})=>{
      const dom=document.createElement('figure'); dom.className='document-asset'; dom.contentEditable='false';
      Object.assign(dom.dataset,{asset:node.attrs.asset,kind:node.attrs.kind,filename:node.attrs.filename});
      dom.textContent='Загрузка вложения…';
      let dead=false, urls=[];
      const wrapper=document.createElement('div'); wrapper.append(dom);
      hydrateDocumentAssets(wrapper,getAsset).then(result=>{urls=result;if(dead) urls.forEach(URL.revokeObjectURL);});
      return {dom,destroy(){dead=true;urls.forEach(URL.revokeObjectURL);}};
    };},
  });
  const editor=new Editor({
    element,
    extensions:[StarterKit.configure({link:{openOnClick:false,autolink:true,HTMLAttributes:{rel:'noopener noreferrer',target:null}}}),TableKit.configure({table:{resizable:false}}),TextStyleKit,Highlight.configure({multicolor:true}),TextAlign.configure({types:['heading','paragraph']}),TaskList,TaskItem.configure({nested:true}),Image,Subscript,Superscript,Details.configure({persist:true}),DetailsContent,DetailsSummary,Callout,Spoiler,Asset],
    content:legacyLessonHTML(blocks),
    parseOptions:{preserveWhitespace:'full'},
    editorProps:{attributes:{class:'lesson-document',role:'textbox','aria-label':'Содержимое урока','aria-multiline':'true',spellcheck:'true'},handleKeyDown:(_view,event)=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();showMenu('link');return true;}return false;}},
    onUpdate:({editor})=>{onChange(editor.getHTML());sync();},onSelectionUpdate:()=>sync(),
  });
  const command=(name,value)=>{
    const chain=editor.chain().focus();
    if(name==='heading') chain.toggleHeading({level:value}).run();
    else if(name==='color') chain.setColor(value).run();
    else if(name==='highlight') chain.toggleHighlight({color:value}).run();
    else if(name==='align') chain.setTextAlign(value).run();
    else if(name==='small') chain.setFontSize('14px').run();
    else if(name==='spoiler') chain.toggleMark('spoiler').run();
    else if(name==='callout') {
      if(editor.isActive('callout')) chain.updateAttributes('callout',value).run();
      else chain.insertContent({type:'callout',attrs:value,content:[{type:'paragraph',content:[{type:'text',text:'Ваш заголовок',marks:[{type:'bold'}]}]},{type:'paragraph',content:[{type:'text',text:'Напишите важное здесь.'}]}]}).run();
    }
    else if(name==='details') chain.insertContent({type:'details',attrs:{open:true},content:[{type:'detailsSummary',content:[{type:'text',text:'Раскрывающийся заголовок'}]},{type:'detailsContent',content:[{type:'paragraph',content:[{type:'text',text:'Содержимое'}]}]}]}).run();
    else if(name==='reset') chain.unsetAllMarks().clearNodes().run();
    else if(typeof chain[name]==='function') chain[name]().run();
    closeMenu(); sync();
  };
  toolbar.className='composer-toolbar'; toolbar.setAttribute('role','toolbar');
  toolbar.innerHTML=`<div class="composer-tools history-tools"><button type="button" data-action="undo" aria-label="Отменить" title="Отменить (Ctrl+Z)">${icons.undo}</button><button type="button" data-action="redo" aria-label="Повторить" title="Повторить (Ctrl+Shift+Z)">${icons.redo}</button></div><div class="composer-tools main-tools">${[['text','Вид текста'],['format','Форматирование'],['list','Списки'],['table','Таблица'],['link','Ссылка'],['media','Медиафайл'],['align','Выравнивание']].map(([key,label])=>`<button type="button" data-menu="${key}" aria-label="${label}" title="${label}" aria-expanded="false">${icons[key]}</button>`).join('')}</div><div class="composer-menu" hidden></div>`;
  const menu=toolbar.querySelector('.composer-menu');
  function sync(){
    if(disposed) return;
    toolbar.querySelector('[data-action="undo"]').disabled=!editor.can().undo();
    toolbar.querySelector('[data-action="redo"]').disabled=!editor.can().redo();
    toolbar.querySelector('[data-menu="format"]').classList.toggle('is-active',editor.isActive('bold'));
    toolbar.querySelector('[data-menu="list"]').classList.toggle('is-active',editor.isActive('bulletList')||editor.isActive('orderedList')||editor.isActive('taskList'));
    toolbar.querySelector('[data-menu="table"]').classList.toggle('is-active',editor.isActive('table'));
  }
  function closeMenu(){menu.hidden=true;openMenu=null;toolbar.querySelectorAll('[data-menu]').forEach(b=>b.setAttribute('aria-expanded','false'));}
  function row(label,action,value,icon='',hint='') {
    const b=document.createElement('button');b.type='button';b.className='composer-menu-item';b.innerHTML=`<span class="menu-icon">${icon}</span><span>${label}</span>${hint?`<kbd>${hint}</kbd>`:''}`;
    b.addEventListener('click',()=>command(action,value));menu.append(b);return b;
  }
  function caption(text){const p=document.createElement('p');p.className='composer-menu-caption';p.textContent=text;menu.append(p);}
  function palette(label,values,action){caption(label);const group=document.createElement('div');group.className='composer-palette';values.forEach(([name,color])=>{const b=document.createElement('button');b.type='button';b.style.backgroundColor=color;b.title=name;b.setAttribute('aria-label',`${label}: ${name}`);b.addEventListener('click',()=>command(action,color));group.append(b);});menu.append(group);}
  function showMenu(key) {
    if(openMenu===key){closeMenu();return;}
    closeMenu(); openMenu=key; menu.replaceChildren();menu.hidden=false;
    toolbar.querySelector(`[data-menu="${key}"]`)?.setAttribute('aria-expanded','true');
    if(key==='text') {
      const heading=document.createElement('details');heading.className='composer-submenu';heading.innerHTML='<summary><span class="menu-icon">H</span>Заголовок <span>›</span></summary><div></div>';
      menu.append(heading);
      for(let i=1;i<=6;i++){const b=document.createElement('button');b.type='button';b.className='composer-menu-item';b.innerHTML=`<span class="menu-icon">H${i}</span>Заголовок ${i}`;b.onclick=()=>command('heading',i);heading.lastElementChild.append(b);}
      row('Текст','setParagraph',null,'T');row('Цитата','toggleBlockquote',null,'❝');row('Код','toggleCodeBlock',null,'‹/›');row('Мелкий шрифт','small',null,'≡');row('Разделитель','setHorizontalRule',null,'—');
      caption('Акцентная заметка');
      ['!','?','✓'].forEach(icon=>row(icon==='!'?'Важное':icon==='?'?'Подсказка':'Результат','callout',{icon,color:editor.getAttributes('callout').color||'#2F7D57'},icon));
      if(editor.isActive('callout')) {caption('Цвет заметки');colors.slice(1).forEach(([label,color])=>row(label,'callout',{color},'●'));}
    } else if(key==='format') {
      [['Жирный','toggleBold','<b>B</b>','Ctrl+B'],['Курсив','toggleItalic','<i>I</i>','Ctrl+I'],['Подчёркнутый','toggleUnderline','<u>U</u>','Ctrl+U'],['Зачёркнутый','toggleStrike','<s>S</s>',''],['Скрытый','spoiler','▧',''],['Подстрочный','toggleSubscript','X₂',''],['Надстрочный','toggleSuperscript','X²','']].forEach(([l,c,i,h])=>row(l,c,null,i,h));
      palette('Цвет текста',colors,'color');palette('Маркер',highlights.map((c,i)=>['Оттенок '+(i+1),c]),'highlight');row('Сбросить форматирование','reset',null,'×');
    } else if(key==='list') {
      row('Нумерованный список','toggleOrderedList',null,'1.');row('Маркированный список','toggleBulletList',null,'•');row('Чек-лист','toggleTaskList',null,'✓');row('Сворачиваемый блок','details',null,'⌄');
    } else if(key==='align') {
      row('По левому краю','align','left','≡');row('По центру','align','center','≡');row('По правому краю','align','right','≡');
    } else if(key==='table') {
      caption('Создать таблицу');
      const grid=document.createElement('div');grid.className='composer-table-grid';
      for(let r=1;r<=6;r++)for(let c=1;c<=6;c++){const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`Таблица ${r} × ${c}`);b.title=`${r} строки × ${c} столбца`;b.onpointerenter=()=>{[...grid.children].forEach((cell,i)=>cell.classList.toggle('is-active',Math.floor(i/6)<r&&i%6<c));};b.onclick=()=>{editor.chain().focus().insertTable({rows:r,cols:c,withHeaderRow:true}).run();closeMenu();};grid.append(b);}menu.append(grid);
      if(editor.isActive('table')){caption('Текущая таблица');[['Строка сверху','addRowBefore'],['Строка снизу','addRowAfter'],['Столбец слева','addColumnBefore'],['Столбец справа','addColumnAfter'],['Удалить строку','deleteRow'],['Удалить столбец','deleteColumn'],['Удалить таблицу','deleteTable']].forEach(([l,c])=>row(l,c));}
    } else if(key==='link') {
      const selected=editor.state.doc.textBetween(editor.state.selection.from,editor.state.selection.to,' ');
      const form=document.createElement('form'); form.className='composer-link-form';
      form.innerHTML='<label>Текст ссылки<input name="label" placeholder="Название ссылки"></label><label>Адрес<input name="url" type="text" placeholder="https://… или /lesson/…" required></label><button type="submit">Вставить ссылку</button><p class="composer-form-error" role="status"></p>';
      form.elements.label.value=selected;form.elements.url.value=editor.getAttributes('link').href||'';
      form.onsubmit=e=>{e.preventDefault();const url=form.elements.url.value.trim();if(!/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url)||/^\/\//.test(url)){form.querySelector('[role="status"]').textContent='Укажите полный адрес https://… или адрес урока /lesson/…';return;}
        const label=form.elements.label.value||selected||url;
        editor.chain().focus().extendMarkRange('link').insertContent({type:'text',text:label,marks:[{type:'link',attrs:{href:url}}]}).command(({tr})=>{tr.removeStoredMark(editor.schema.marks.link);return true;}).run();closeMenu();};menu.append(form);
      row('Убрать ссылку','unsetLink',null,'×');
      requestAnimationFrame(()=>form.elements.url.focus());
    } else if(key==='media') {
      [['Фото или видео','image/*,video/*'],['Аудиофайл','audio/*'],['Файл','']].forEach(([label,accept])=>{
        const b=document.createElement('button');b.type='button';b.className='composer-menu-item';b.textContent=label;b.onclick=()=>{
          const input=document.createElement('input');input.type='file';input.accept=accept;
          input.onchange=async()=>{const file=input.files?.[0];if(!file||disposed)return;try{const id='asset-'+crypto.randomUUID();await putAsset(id,file);if(disposed)return;const kind=file.type.startsWith('image/')?'image':file.type.startsWith('video/')?'video':file.type.startsWith('audio/')?'audio':'file';editor.chain().focus().insertContent([{type:'lessonAsset',attrs:{asset:id,kind,filename:file.name}},{type:'paragraph'}]).run();}catch{onError('Не удалось добавить файл. Проверьте свободное место.');}};input.click();closeMenu();};menu.append(b);
      });
    }
    const trigger=toolbar.querySelector(`[data-menu="${key}"]`);const rect=toolbar.getBoundingClientRect();
    menu.style.left=Math.max(0,Math.min(trigger.offsetLeft,rect.width-Math.min(340,rect.width)))+'px';
    menu.style.maxHeight=Math.max(150,window.innerHeight-rect.bottom-12)+'px';
  }
  toolbar.onmousedown=e=>{if(e.target.closest('button,summary'))e.preventDefault();};
  toolbar.onclick=e=>{const menuButton=e.target.closest('[data-menu]');if(menuButton)showMenu(menuButton.dataset.menu);const action=e.target.closest('[data-action]');if(action)command(action.dataset.action);};
  const outside=e=>{if(!toolbar.contains(e.target))closeMenu();};
  const escapeMenu=e=>{if(e.key==='Escape'&&!menu.hidden){closeMenu();editor.commands.focus();e.stopPropagation();}};
  document.addEventListener('pointerdown',outside);toolbar.addEventListener('keydown',escapeMenu);
  cleanups.push(()=>document.removeEventListener('pointerdown',outside));
  window.addEventListener('resize',closeMenu);cleanups.push(()=>window.removeEventListener('resize',closeMenu));
  sync();
  return {getHTML:()=>editor.getHTML(),destroy(){disposed=true;cleanups.forEach(f=>f());editor.destroy();toolbar.replaceChildren();toolbar.onmousedown=null;toolbar.onclick=null;toolbar.removeEventListener('keydown',escapeMenu);}};
}
