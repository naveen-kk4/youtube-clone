let firstScript = document.getElementsByTagName("script")[0] ;
firstScript.addEventListener("load", renderVideoandComments);
// let video_Id = localStorage.getItem('videoId');
const main_video = document.getElementsByClassName("main-video")[0];
const creatorDetails = document.getElementsByClassName("creator-details")[0];
const all_comments = document.getElementsByClassName("comments")[0];
const suggestion_div = document.getElementsByClassName("suggestions")[0];
const button = document.getElementById("search-button");
const input = document.getElementById("search-input");
const baseUrl = "https://www.googleapis.com/youtube/v3";
const apiKey = "AIzaSyCkJ9DD-nkE_IHpk5ZuCRTkko44HYOVUjc";


button.addEventListener("click",() =>{
      localStorage.setItem("searchResult",input.value);
      
      
        window.location="index.html"
     
      
});


function getTotalViews(views){
    if(views>=10000000)return `${Math.floor(views/10000000)} crore `
    if(views>=1000000)return `${Math.floor(views/1000000)} million `
    if(views>=100000)return `${Math.floor(views/100000)} lakh `
    if(views>=1000)return `${Math.floor(views/1000)} k `
    return views+" ";
    
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

function getPublishedDate(date){
    const currDate = new Date(date);
    console.log(typeof currDate);
    return `${currDate.getDay() + 1}/${currDate.getMonth()}/${currDate.getFullYear()}`;
}

function getTrimmedDescription(description){
    if(description.length > 850)return description.substring(0,850) + "...";
    return description;
}

async function renderVideoandComments(){
   
   const video_Id = localStorage.getItem("videoId"); 
   const channel_Logo = localStorage.getItem("channelLogo");
   const subscribers = localStorage.getItem("subscribers");
  
    const url = `${baseUrl}/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${video_Id}&key=${apiKey} `
    var res;
    try{

        const response = await fetch(url);
        res = await response.json();
       
        
        main_video.innerHTML=`
        <div id="youtube-player"></div>
        <div class="mt-4"><h5>${res.items[0].snippet.title}</h5></div>
        <div class="d-flex justify-content-between">
            <div class="m-1 text-muted"><p>${getTotalViews(res.items[0].statistics.viewCount)}views.${getPublishedDate(res.items[0].snippet.publishedAt)}</p></div>
            <div><span class="m-1"><img class="p-1 mb-1" src="./assets/like.svg" alt="">${getTotalViews(res.items[0].statistics.likeCount)}</span>
                <span class="m-1"><img class="p-1" src="./assets/dislike.svg" alt=""></span>
                <span class="m-1"><img class="p-1 mb-1" src="./assets/share.svg" alt="">SHARE</span>
                <span><img class="p-1 mb-1" src="./assets/Save.svg" alt="">SAVE</span>
                
            
            </div>
            
        </div>
        `
        creatorDetails.innerHTML=`<div class="d-flex justify-content-between">
        <div><img id="channel-logo" class="border-0 rounded-circle" src="${channel_Logo}" alt="">
            <span>${res.items[0].snippet.channelTitle}</span>
            <span class="text-muted">${getTotalViews(subscribers)}subscribers</span>
            
        </div>
        <div><button type="button" class="btn btn-danger">SUBSCRIBE</button></div>
    </div>
    <div class="ms-4 mt-3">
        <p>${getTrimmedDescription(res.items[0].snippet.description)}</p>
    </div>`
        onLoadScript();
    }
    catch(e){
        console.log(e);
    }

    loadComments(res.items[0].statistics.commentCount);
    loadSuggestions();

   
    
}






 function onLoadScript() {
 	if (YT) {
    new YT.Player("youtube-player", {
 	height: "430px",
 		width: "680px",
 		videoId : localStorage.getItem("videoId"),
 		events: {
 			onReady: (event) => {
 				        document.title = event.target.videoTitle ;
 		       	   }
 	      }
 	   });
 	}
}




async function loadComments(commentCount){
    const video_Id = localStorage.getItem("videoId");
    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&key=${apiKey}&videoId=${video_Id}&maxResults=10`
    
     
     const response = await fetch(url);
     const res = await response.json();
     console.log(res);
     all_comments.innerHTML=`  <h6>${getTotalViews(commentCount)} Comments</h6>`
     for(let i = 0;i<10;i++){
        const obj = res.items[i].snippet.topLevelComment.snippet;
        let [likes,authorName,imgUrl,text,date] = [obj.likeCount,obj.authorDisplayName,obj.authorProfileImageUrl,obj.textOriginal,obj.publishedAt];
        
        const commentEle = document.createElement("div");
        commentEle.classList.add("d-flex");
        commentEle.classList.add("flex-column");
        commentEle.classList.add("my-4");
        commentEle.classList.add("comment-ele");
        commentEle.innerHTML=` <div><img class="border-0 rounded-circle px-1" src="${imgUrl}" alt="">
        <span class="fs-6">${authorName}</span>
        <span class="text-muted comments-dur">${getPostedTime(date)}</span>
        <p class="ms-5">${text}</p>
        
    </div>
    <div class="ms-5">
        <span><img class="p-1 mb-1" src="./assets/like.svg" alt="">${getTotalViews(likes)}likes</span>
        <span><img class="p-1 mb-1" src="./assets/dislike.svg" alt=""></span>
    </div>
    <div class="reply-box d-flex flex-column my-2" class="ms-3">
    <div class="reply-header"><img class="px-2" src="./assets/arrow-down.svg">
    <span   onclick="loadReplies(${i})">${res.items[i].snippet.totalReplyCount} REPLIES</span>
    </div>
    </div>`
    all_comments.appendChild(commentEle);

     }
     
}
async function loadReplies(idx){
    console.log(idx);
    const commentEle = document.getElementsByClassName("reply-box")[idx];
    if(commentEle.children.length > 1){
        while (commentEle.children.length > 1) {
           commentEle.removeChild(commentEle.lastChild);
          }
        return;
    }
   
     const video_Id = localStorage.getItem("videoId");
     const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&key=${apiKey}&videoId=${video_Id}&maxResults=10`
     const response = await fetch(url);
     const res = await response.json();
     if(res.items[idx].snippet.totalReplyCount==0)return;
     const arr = res.items[idx].replies.comments;
     for(let i = 0;i<Math.min(4,arr.length);i++){
        const imgUrl = arr[i].snippet.authorProfileImageUrl;
        const authorName = arr[i].snippet.authorDisplayName;
        const date = arr[i].snippet.publishedAt;
        const text = arr[i].snippet.textOriginal;

        const replyEle = document.createElement("div");
        replyEle.classList.add("my-2");
        replyEle.innerHTML=` <div class="small-replies"><img class="border-0 rounded-circle px-1" src="${imgUrl}" alt="">
        <span>${authorName}</span>
        <span class="text-muted comments-dur">${getPostedTime(date)}</span>
        <p class="ms-5">${text}</p>
        
    </div>`
    commentEle.appendChild(replyEle);

     }

}

async function loadSuggestions(){
    const url = `${baseUrl}/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=20&regionCode=IN&key=${apiKey} `

    const response = await fetch(url);
    const res = await response.json();
    for(let i = 0;i<15;i++){
        const suggestionEle = document.createElement("div");
        suggestionEle.classList.add("card")
        suggestionEle.classList.add("mb-3")
        suggestionEle.classList.add("border-0")
        suggestionEle.innerHTML=` <div class="row g-0">
        <div class="col-md-5">
          <img
            class="card-img"
            src=${res.items[i].snippet.thumbnails.standard.url}
            class="img-fluid rounded-start"
            alt="..."
          />
        </div>
        <div class="col-md-7">
          <div class="card-body">
            <h5 class="card-title">
             ${res.items[i].snippet.title}
            </h5>
            <p class="card-text text-muted"> ${res.items[i].snippet.channelTitle}</p>
            <p class="card-text-2">
              <small class="text-muted">${getTotalViews(res.items[i].statistics.viewCount)}views ${getPostedTime(res.items[i].snippet.publishedAt)}</small>
            </p>
          </div>
        </div>
      </div>`
      suggestion_div.appendChild(suggestionEle);

    }
}