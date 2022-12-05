let jsonDataFetcher=async(url)=>{
  let jsonConverter="https://api.rss2json.com/v1/api.json?rss_url=";
  let res=jsonConverter.concat(url);
  let response=await fetch(res);
  let data=await response.json();
  return data;
}

let createAccordionItem=async()=>{
  document.getElementById("accordionExample").innerHTML="";
  for(let url of magazines){
    let collapsed='';
    let show='';
    magazines.indexOf(url)===0?collapsed='':collapsed="collapsed";
    magazines.indexOf(url)===0?show='show':show="";
    let data=await jsonDataFetcher(url);
    let accordianItemInnerHtml=`<div class="accordion-item">
    <h2 class="accordion-header" id="heading${magazines.indexOf(url)+1}">
      <button class="accordion-button ${collapsed} btn-text" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${magazines.indexOf(url)+1}" aria-expanded="true" aria-controls="collapse${magazines.indexOf(url)+1}">
        ${data.feed.title}
      </button>
    </h2>
    <div id="collapse${magazines.indexOf(url)+1}" class="accordion-collapse collapse ${show}" aria-labelledby="heading${magazines.indexOf(url)+1}" data-bs-parent="">
      <div class="accordion-body" id="accordionBody${magazines.indexOf(url)+1}">
      </div>
    </div>
  </div>`;
  document.getElementById("accordionExample").innerHTML+=accordianItemInnerHtml;
  } 
}

let createCarousel=async()=>{
  for(let url of magazines){
    let data=await jsonDataFetcher(url);
    let carouselElem=`<div id="carouselExampleControls${magazines.indexOf(url)+1}" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner" id="carouselInner${magazines.indexOf(url)+1}">
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls${magazines.indexOf(url)+1}" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls${magazines.indexOf(url)+1}" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>`;
  document.getElementById(`accordionBody${magazines.indexOf(url)+1}`).innerHTML=carouselElem;
  data.items.forEach(item=>{
    let active='';
    data.items.indexOf(item)===0?active="active":active="";
    let date=new Date(item.pubDate);
    date=convertDate(date);
    let carouselItem=`
    <div class="carousel-item ${active} justify-content-center">
    <a href="${item.link}">
    <div class="card">
    <img src="${item.enclosure.link}">
    <div class="card-body">
    <h3 class="title">${item.title}</h3>
    <p class="author-date">${item.author} <span class="dot"></span> ${date}</p>
    <p class="card-text description">${item.description}</p>
    </div>
    </div>
    </a>
    </div>`;
    document.getElementById(`carouselInner${magazines.indexOf(url)+1}`).innerHTML+=carouselItem;
  })
  }
}

let convertDate=(inputFormat)=>{
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat)
  return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
}

document.getElementById("theme-changer").addEventListener("click",(e)=>{
  if(e.target.innerHTML==="toggle_on"){
    e.target.innerHTML="toggle_off";
    localStorage.setItem("innerText","toggle_off");
    var r = document.querySelector(':root');
    r.style.setProperty('--color1', '#FFFFFF');
    r.style.setProperty('--color2', '#292b2e');
    localStorage.setItem('--color1', '#FFFFFF');
    localStorage.setItem('--color2', '#292b2e');
  }else{
    e.target.innerHTML="toggle_on";
    localStorage.setItem("innerText","toggle_on");
    var r = document.querySelector(':root');
    r.style.setProperty('--color1', '#292b2e');
    r.style.setProperty('--color2', '#FFFFFF');
    localStorage.setItem('--color1', '#292b2e');
    localStorage.setItem('--color2', '#FFFFFF');
  }
})

document.addEventListener("DOMContentLoaded",()=>{
  if(localStorage.getItem("innerText")){
    document.getElementById("theme-changer").innerHTML=localStorage.getItem("innerText");
  }
  var r = document.querySelector(':root');
  let colorValue1=localStorage.getItem("--color1");
  r.style.setProperty('--color1', colorValue1);
  let colorValue2=localStorage.getItem("--color2");
  r.style.setProperty('--color2', colorValue2);
})

let main=async()=>{
  await createAccordionItem();
  await createCarousel();
}
main();