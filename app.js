(function(){
  var burger=document.getElementById('burger'),nav=document.getElementById('nav');
  function zamknij(){nav.classList.remove('otw');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Otwórz menu');document.body.style.overflow=''}
  burger.addEventListener('click',function(){
    var o=nav.classList.toggle('otw');
    burger.setAttribute('aria-expanded',o?'true':'false');
    burger.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');
    document.body.style.overflow=o?'hidden':'';
  });
  nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',zamknij)});

  // dolny pasek na telefonie dopiero po przewinieciu za przyciski z pierwszego ekranu
  var mob=document.getElementById('mob'),cta=document.getElementById('heroCta'),zam=document.getElementById('zamowienie');
  var zaCta=false,naForm=false;
  function pasek(){var w=zaCta&&!naForm;mob.classList.toggle('widac',w);mob.setAttribute('aria-hidden',w?'false':'true');mob.querySelectorAll('a').forEach(function(a){a.tabIndex=w?0:-1})}
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(e){zaCta=!e[0].isIntersecting&&e[0].boundingClientRect.top<0;pasek()}).observe(cta);
    new IntersectionObserver(function(e){naForm=e[0].isIntersecting;pasek()},{rootMargin:'-30% 0px -30% 0px'}).observe(zam);
  }

  // przyciski przy ofercie zaznaczaja rodzaj w formularzu
  document.querySelectorAll('[data-rodzaj]').forEach(function(a){
    a.addEventListener('click',function(){
      var r=document.querySelector('input[name=rodzaj][value="'+a.dataset.rodzaj+'"]');
      if(r){r.checked=true}
    });
  });

  var plik=document.getElementById('plik'),plikTxt=document.getElementById('plikTxt');
  plik.addEventListener('change',function(){
    var n=[].map.call(plik.files,function(f){return f.name});
    plikTxt.textContent=n.length?('Dodano: '+n.join(', ')):'Dodaj zdjęcie z telefonu albo plik PDF';
  });

  var form=document.getElementById('form'),blad=document.getElementById('blad'),wys=document.getElementById('wyslane');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var rodzaj=form.querySelector('input[name=rodzaj]:checked');
    var tel=form.telefon.value.replace(/\D/g,'');
    var b=[];
    document.getElementById('rodzaje').parentNode.classList.toggle('zle',!rodzaj);
    form.telefon.parentNode.classList.toggle('zle',tel.length<9);
    if(!rodzaj)b.push('wybierz, co trzeba wykonać');
    if(tel.length<9)b.push('podaj numer telefonu, żebym mógł oddzwonić');
    if(b.length){blad.textContent='Uzupełnij: '+b.join(' i ')+'.';blad.hidden=false;return}
    blad.hidden=true;
    var opis=form.opis.value.trim();
    if(form.bezwym.checked)opis=(opis?opis+'. ':'')+'Brak wymiarów, prześle zdjęcie lub projekt.';
    var dane=[
      ['Wyrób',rodzaj.value],
      ['Opis',opis||'-'],
      ['Załączniki',plik.files.length?[].map.call(plik.files,function(f){return f.name}).join(', '):'brak'],
      ['Drewno',form.gatunek.value],
      ['Termin',form.termin.value],
      ['Miejscowość',form.miejsce.value.trim()||'-'],
      ['Odbiór',form.dostawa.value],
      ['Klient',(form.imie.value.trim()||'-')],
      ['Telefon',form.telefon.value.trim()],
      ['E-mail',form.email.value.trim()||'-']
    ];
    var dl=document.getElementById('mailDane');dl.innerHTML='';
    dane.forEach(function(d){var t=document.createElement('dt'),v=document.createElement('dd');t.textContent=d[0];v.textContent=d[1];dl.appendChild(t);dl.appendChild(v)});
    form.hidden=true;wys.hidden=false;
    wys.scrollIntoView({behavior:'smooth',block:'start'});wys.focus({preventScroll:true});
  });
  document.getElementById('znowu').addEventListener('click',function(){wys.hidden=true;form.hidden=false;form.scrollIntoView({behavior:'smooth',block:'start'})});
})();
