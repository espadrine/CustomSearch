// Copyright (c) Thaddee Tyl. All rights reserved.
var els = [];
var el = 0; // current element.
function setInit() {
  els = [];
  var domEls = document.getElementsByClassName("l");
  for(var i=0; i<domEls.length; i++) {
    els.push(domEls[i].href);
    domEls[i].style.position = 'relative';
    var parnt = domEls[i].parentNode.parentNode;
    parnt.setAttribute('id', i);
    parnt.addEventListener('click',function() {
        setEl(Number(this.id))},false);
  }
}
function init() {
  setInit();
  setEl(el);
  fillIfLow();
}
init();

// 1. SHORTCUTS.
function setEl(index) {
  var ls = document.getElementsByClassName('l');
  ls[el].style.backgroundColor = "#fff";
  ls[el].style.borderTop = "none";
  ls[el].style.left = "0px";
  ls[index].style.backgroundColor = "#f0f7f9";
  ls[index].style.borderTop = "1px solid #6b90da";
  ls[index].style.left = "1px";
  var parnt = ls[index].parentNode.parentNode;
  if(elTotInView(parnt) != 0)
    scrollTillView(parnt);
  el = index;
}
function elTotInView(el) {
  var t = el.offsetTop;
  var height = el.offsetHeight;
  while(el.offsetParent) {
    el = el.offsetParent;
    t += el.offsetTop;
  }
  if(t < window.pageYOffset+42) return t-window.pageYOffset-42; // up.
  else if( (t+height) > (window.pageYOffset + window.innerHeight)-42 )
    return (t+height)-(window.pageYOffset+window.innerHeight)+42; //down.
  else return 0;
}
function scrollTillView(el) {
  var inView = elTotInView(el);
  if(inView != 0) {
    window.scrollBy(0, Math.floor(inView/2)+(inView>0?1:-1));
    setTimeout(scrollTillView, 10, el);
  }
}

var lstFocused = false;
document.getElementsByClassName('lst')[0].onfocus = function(e) {
  lstFocused = true;
}
document.getElementsByClassName('lst')[0].onblur = function(e) {
  lstFocused = false;
}
onkeydown = function(e) {
  var code = e.keyCode;
  if(!lstFocused) {
    if(code==74 && el<els.length-1) {  // J
      setEl(el+1);
    } else if(code==75 && el>0) {  // K
      setEl(el-1);
    } else if(code==79 || code==13) {  // O / ENTER
      location = els[el];
    } else if(code==191) {  // /
      var lst = document.getElementsByClassName('lst')[0];
      lst.scrollIntoView(false);
      var val = lst.value;
      lst.select();
      lst.focus();
      lst.value = val;
      return false;
    }
  }
}

// 2. INFINITE SCROLLING.
document.getElementById('navcnt').insertAdjacentHTML("afterend",
    '<iframe id="bottle" style="display:none"></iframe>');
var bottle = document.getElementById('bottle');
var cur = document.getElementsByClassName('cur')[0]
function fillIfLow() {
  if(elTotInView(document.getElementsByClassName('l')[els.length-4])==0) {
    cur.removeAttribute('id');
    cur = cur.nextSibling;
    cur.setAttribute('id', 'cur');
    // fill in the bottle of searches.
    bottle.src = cur.getElementsByTagName('a')[0].getAttribute('href');
    setTimeout(fill, 1000);
  }
  setTimeout(fillIfLow, 1000);
}
function fill() {
  var nextEntries = bottle.contentDocument.getElementById('res').getElementsByTagName('ol')[0].innerHTML;
  document.getElementById('res').getElementsByTagName('ol')[0].insertAdjacentHTML("beforeend", nextEntries);
  setInit();
}
