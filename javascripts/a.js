var site_prefix = "";
var page_array;

var page, target;
var last_page, last_target;

var training_content;

function appendMenuItem(menuDiv, text, target) {
  var linkA = document.createElement('a');
  linkA.href = target;
  var linkLi = document.createElement('li');
  linkLi.innerHTML = text;
  linkA.appendChild(linkLi);
  menuDiv.appendChild(linkA);
}

function main() {
  var topContainer = document.createElement('div');
  topContainer.id = 'topcontainer';

  // Title and subtitle
  var siteHeader = document.createElement('div');
  siteHeader.id = 'siteheader';
  var homeDest = document.createElement('a');
  homeDest.href = "?dest=home";
  var topTitle = document.createElement('div');
  topTitle.id = 'toptitle';
  topTitle.innerHTML = "Clam's Chip Commentary";
  var topSubtitle = document.createElement('div');
  topSubtitle.innerHTML = "Digging deep into tech...";
  topSubtitle.id = 'topsubtitle';
  homeDest.appendChild(topTitle);
  homeDest.appendChild(topSubtitle);
  siteHeader.appendChild(homeDest);
  topContainer.appendChild(siteHeader);

  // Menu
  var topMenu = document.createElement('div');
  topMenu.id = 'topmenu';
  var menu = document.createElement('ul');
  menu.className = 'menu';
  appendMenuItem(menu, "Home", "?dest=home");
  appendMenuItem(menu, "Tests", "?dest=tests");
  appendMenuItem(menu, "About", "?dest=about");
  topMenu.appendChild(menu);
  topContainer.appendChild(topMenu);

  var contentDiv = document.createElement('div');
  contentDiv.id = 'content';
  topContainer.appendChild(contentDiv);
  
  training_content = document.body.innerHTML;
  document.body.innerHTML = "";
  document.body.appendChild(topContainer);
  
  // GET ...?dest=<key>&page=<n>
  target = "home";
  page = 0;
  var dest_param = null, page_param = null;
  if (typeof(URLSearchParams) !== "undefined") {
      const get_params = new URLSearchParams(window.location.search);
      dest_param = get_params.get('dest');
      page_param = get_params.get('page');
  } else {
      // basic ie11 compat
      search_path = window.location.search; // query string
      if (search_path.length > 1) {
          search_path = search_path.substring(1);
          param_list = search_path.split("&");
          for (var param_idx = 0; param_idx < param_list.length; param_idx++) {
              param_split = param_list[param_idx].split("=")
              if (param_split.length > 1) {
                  if (param_split[0] == "dest") {
                      dest_param = param_split[1];
                  } else if(param_split[0] == "page") {
                      page_param = param_split[1];
                  }
              }
          }
      }
  }
  if (dest_param !== null) target = dest_param;
  if (page_param !== null) page = page_param;
  load_content(target, page, false);
}

// an internal link
function link(targetid) { load_content(targetid, 0, true); }

function load_content(targetid, page, save_history) {
  var content_path = site_prefix + "/" + targetid + "/";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", content_path, false);
  xhr.send(null);
  if (xhr.status != 200) {
    response_text = "oh noes";
  } else response_text = xhr.responseText;

  page_array = response_text.split("===");
  set_page(page, save_history);
}

function set_page(page, save_history) {
  var content_container = document.getElementById('content');
  if (content_container === null) return;

  page = Number(page);
  if (page >= page_array.length) page = page_array.length - 1;
  content_container.innerHTML = page_array[page];

  var topcontainer = document.getElementById('topcontainer');
  var pageDiv = document.createElement('div');
  pageDiv.id = "pageselector";
  var pageSelection = "Pages: ";
  for (pageIdx = 0; pageIdx < page_array.length; pageIdx++) {
    if (pageIdx === page) pageSelection += "<span class='selectedpage'>";
    pageSelection += "<a href='?dest=" + target + "&page=" + pageIdx + "'>" + (pageIdx + 1) + "</a>"; 
    if (pageIdx === page) pageSelection += "</span>";
  }

  if (page < page_array.length - 1) 
    pageSelection += "<a href='?dest=" + target + "&page=" + (page + 1) + "'>Next &gt;&gt;</a>";
  pageDiv.innerHTML = pageSelection;
  if (page_array.length > 1) topcontainer.appendChild(pageDiv);

  if (save_history) history.pushState({}, "", "?dest=" + target + "&page=" + page);

  if (document.getElementById('picslider') !== null) handlePicSlider();
}

function setTrainingMode() {
  var content_container = document.getElementById('content');
  content_container.innerHTML = "<div id='article'>" + training_content + "</div>";
}

// Page specific features
var picSlider = [];
function handlePicSlider() {
  var sliderDefs = document.getElementById('picslider').innerText;
  var sliderDefSplit = sliderDefs.split("\n");

  var currentSection = null;
  for (var lineIdx = 0; lineIdx < sliderDefSplit.length; lineIdx++) {
    var currentLine = sliderDefSplit[lineIdx];
    if (currentLine.charAt(currentLine.length - 1) === "#") {
      currentSection = currentLine.substring(0, currentLine.length - 1);
      picSlider[currentSection] = [];
      console.log(currentSection)
      continue;
    }

    if (currentSection !== null) {
      var fileLineSplit = currentLine.split("|");
      if (fileLineSplit.length < 2) continue;
      picSlider[currentSection].push(fileLineSplit);
    }
  }

  for (var key in picSlider) {
    var container = document.getElementById(key);
    if (container == null) continue;

    var sliderImg = document.createElement('img');
    sliderImg.id = key + "_img";
    sliderImg.src = picSlider[key][0][0];
    container.appendChild(sliderImg);

    var sliderCaption = document.createElement('div');
    sliderCaption.id = key + "_caption";
    sliderCaption.className = 'caption';
    sliderCaption.innerHTML = formatPicSliderCaption(picSlider[key][0][1]);
    container.appendChild(sliderCaption);

    var slider = document.createElement('input');
    slider.type = "range";
    slider.min = 0;
    slider.max = picSlider[key].length - 1;
    slider.value = 0;
    slider.id = key + "_slider";
    slider.oninput = "handlePicSliderInput('" + key + "');";
    slider.addEventListener('input', handlePicSliderInput);
    var sliderContainer = document.createElement('div');
    sliderContainer.className = 'slidercontrol';
    sliderContainer.innerHTML = "Quality:";
    sliderContainer.appendChild(slider);
    container.appendChild(sliderContainer);
  }
}

function formatPicSliderCaption(caption) { return caption.replace("\\n", "<br />"); }

function handlePicSliderInput(evt) {
  var targetId = evt.target.id;
  var targetIdSplit = targetId.split("_");
  var baseId = targetIdSplit[0];
  
  var slider = evt.target;
  var pic = document.getElementById(baseId + "_img");
  var txt = document.getElementById(baseId + "_caption");
  var dat = picSlider[baseId][parseInt(slider.value)];
  pic.src = dat[0];
  txt.innerHTML = formatPicSliderCaption(dat[1]);
}
handlePicSlider();
