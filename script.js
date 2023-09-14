const baseUrl = "https://www.googleapis.com/youtube/v3";
const apiKey = "AIzaSyCkJ9DD-nkE_IHpk5ZuCRTkko44HYOVUjc";
const button = document.getElementById("search-button");
const input = document.getElementById("search-input");
const cardsDiv = document.getElementsByClassName("all-contents")[0];

fetchResults(localStorage.getItem("searchResult")==null?"":localStorage.getItem("searchResult"));
button.addEventListener("click",()=>{ 
     cardsDiv.innerHTML="";
     localStorage.setItem("searchResult",input.value)
      fetchResults(input.value);
})



async function getChannelLogo(channelId){
    const endpoint = `${baseUrl}/channels?key=${apiKey}&id=${channelId}&part=snippet%2CcontentDetails%2Cstatistics`;
    try{
        const response = await fetch(endpoint);
        const res = await response.json();
       
        return [res.items[0].snippet.thumbnails.high.url,res.items[0].statistics.subscriberCount];
    }
    catch(error){
        alert("Failed to load channelLogo");
    }

}
async function getVideoStatistics(videoId) {
    // https://www.googleapis.com/youtube/v3/videos?key=AIzaSyDvo2p4xMEI3GC-PWH02_0OAIN1h88k4rE&part=statistics
    const endpoint = `${baseUrl}/videos?key=${apiKey}&part=statistics&id=${videoId}`;
    try {
      const response = await fetch(endpoint);
      const result = await response.json();
      return result.items[0].statistics;
    } catch (error) {
      alert("Failed to fetch Statistics for ", videoId);
    }
  }

async function fetchResults(searchVal){
    const url = `${baseUrl}/search?key=${apiKey}&q=${searchVal}&maxResults=15&part=snippet`;

    try{
        let response = await fetch(url);
        let result = await response.json();
        console.log(result.items);
        for (let i = 0; i < result.items.length; i++) {
            let videoId = result.items[i].id.videoId;
            let channelId = result.items[i].snippet.channelId;
            if(videoId==undefined)continue;
            let statistics = await getVideoStatistics(videoId);
            let channelLogoAndSubscribers = await getChannelLogo(channelId);
      
            result.items[i].statistics = statistics;
            result.items[i].channelLogo = channelLogoAndSubscribers[0];
            result.items[i].subscribers = channelLogoAndSubscribers[1];
          }
        renderVideosOnUI(result.items);
    }
    catch(e){
          console.log(e);
         alert("Some error occured.Try again later!")
    }
    
}

function getPostedTime(time){
    const pubDate = new Date(time);
    const currDate = new Date();
    const secGap = (currDate - pubDate) / 1000;
    const secInAHour = 3600;
    const secInADay = 24 * 60 * 60 ;
    const secInAWeek = secInADay * 7;
    const secInAMonth = secInADay * 30;
    const secInAYear = secInAMonth * 12;
    if(secGap>=secInAYear){
        return `${Math.floor(secGap/secInAYear)} years ago`
    }
    if(secGap>=secInAMonth){
        return `${Math.floor(secGap/secInAMonth)} months ago`
    }
    if(secGap>=secInAWeek){
        return `${Math.floor(secGap/secInAWeek)} weeks ago`
    }
    if(secGap>=secInADay){
        return `${Math.floor(secGap/secInADay)} days ago`
    }
    if(secGap>=secInAHour){
        return `${Math.floor(secGap/secInAHour)} hours ago`
    }
    return `${Math.floor(secGap/60)} minutes ago`

}
function getTotalViews(views){
    if(views>=10000000)return `${Math.floor(views/10000000)} crore views`
    if(views>=1000000)return `${Math.floor(views/1000000)} million views`
    if(views>=100000)return `${Math.floor(views/100000)} lakh views`
    if(views>=1000)return `${Math.floor(views/1000)} k views`
    return views+" views";
    
}
async function renderVideosOnUI(videos){
    
    videos.forEach((video)=>{
        if(video.channelLogo!=null || video.statistics!=null){
        const time = getPostedTime(video.snippet.publishTime);
        const card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("border-0");

       
        card.innerHTML=` <img src=${video.snippet.thumbnails.high.url} class="card-img-top" alt="...">
        <div class="card-body d-flex justify-content-around">
          <div><img  class="border-0 rounded-circle mx-2" src="${video.channelLogo}" alt=""></div>  
        <div class="details-div" >
            <p class="card-title">${video.snippet.title}.</p>
          <p class="text-muted ">${video.snippet.channelTitle}</p>
          <p class="card-text "><small class="text-muted">${ getTotalViews(video.statistics.viewCount)}.${time}</small></p>
        </div>  
        </div>`
        cardsDiv.appendChild(card);
       
        card.addEventListener("click", function(){ 
            
            localStorage.setItem("channelLogo",video.channelLogo);
            localStorage.setItem("videoId",video.id.videoId);
            localStorage.setItem("subscribers",video.subscribers);
             window.location = 'videoPage.html';
            // console.log(video.id.videoId,typeof(video.id.videoId));
             
         });
        }
        

    })
}