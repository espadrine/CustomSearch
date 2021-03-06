// Copyright (c) Thaddee Tyl. All rights reserved.
var els = []; // list of entry items' hrefs.
var el = 0; // current element.
function setInit() {
  els = []; // emptying the crowded list of entries' links.
  var domEls = document.getElementsByClassName("l"); // list of entries.
  for(var i=0; i<domEls.length; i++) {
    els.push(domEls[i].href);
    domEls[i].style.position = 'relative'; // to shift them by 1px.
    var parnt = domEls[i].parentNode.parentNode;
    parnt.setAttribute('id', i);
    parnt.addEventListener('click',function() {
        setEl(Number(this.id))},false);
    // show number.
    if(i%10==0&&i!=0) {
      if(parnt.previousSibling && parnt.previousSibling.className != 'num')
        parnt.insertAdjacentHTML('beforebegin',
       '<div class="num" style="font-size:small;font-weight:bold;height:32px;line-height:32px;">Page '+(Math.floor(i/10)+1)+'</div>');
    }
  }
}
var cur = null;  // one 'o' out of Gooooooooogle (bottom of page).
var initTries = function() {
  var times = 0;
  (function init() {
    if(document.getElementsByClassName('l').length>0
       && document.location.pathname!='/images') {
      setInit();
      setEl(el);
      cur = document.getElementsByClassName('cur')[0];
      fillIfLow();
    } else if(times++<100) setTimeout(500,init);
  })();
};
initTries();
document.body.onhashchange = initTries;

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

var lstFocus = (function(){  // is the query input focused?
  var lstFocused = document.getElementsByClassName('lst')[0].autofocus;
  document.getElementsByClassName('lst')[0].onfocus =
      function(){lstFocused = true};
  document.getElementsByClassName('lst')[0].onblur =
      function(){lstFocused = false};
  return function(f){
    if(f!==undefined) lstFocused = f;
    else return lstFocused;
  }
})();
onkeydown = function(e) {
  var code = e.keyCode;
  if(!lstFocus()) {
    if(code==74 && el<els.length-1) {  // J
      setEl(el+1);
    } else if(code==75 && el>0) {  // K
      setEl(el-1);
    } else if(code==79 || code==13) {  // O / ENTER
      if(els[el]!==undefined) location = els[el];
    } else if(code==76) {  // L
      chrome.extension.sendRequest({newtab:els[el]},function(r){});
    } else if(code==191) {  // /
      var lst = document.getElementsByClassName('lst')[0];
      lst.scrollIntoView(false);
      var val = lst.value;
      lst.select();
      lst.focus();
      lst.value = val;
      return false;
    }
  } else if(code==27){ // lst is focused; ESC pressed
    var ls = document.getElementsByClassName('l');
    ls[el].focus();
    ls[el].blur();
  }
}

// 2. INFINITE SCROLLING.
document.body.insertAdjacentHTML("beforeend",
    '<iframe id="bottle" style="display:none"></iframe>');
var bottle = document.getElementById('bottle');
function fillIfLow() {
  if(!cur) return null; // if very few results...
  if(bottle && elTotInView(document.getElementsByClassName('l')[els.length-4])==0) {
    // fill in the bottle of searches.
    bottle.src = cur.nextSibling.getElementsByTagName('a')[0].getAttribute('href');
    setTimeout(fill, 1000); // enough time to load.
  }
  setTimeout(fillIfLow, 1000);
}
function fill() {
  //var bottle = document.getElementById('bottle');
  var nextEntries = bottle.contentDocument.getElementById('res').getElementsByTagName('ol')[0].innerHTML;
  document.getElementById('res').getElementsByTagName('ol')[0].insertAdjacentHTML("beforeend", nextEntries);
  setInit();
  // update current bottleful of searches.
  cur = bottle.contentDocument.getElementsByClassName('cur')[0]
  // don't show it.
  bottle.contentDocument.getElementsByTagName('body')[0].setAttribute('style', 'display:none');
}
