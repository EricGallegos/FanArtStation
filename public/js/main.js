let splashXClicked = false;
let viewerActive = false;
const splashes = Array.from(document.querySelectorAll('.imageSplash'));
const expandSplashButtons = Array.from(document.querySelectorAll('.imageSplash .splashHeader div > button'))
const exitSplashButtons = Array.from(document.querySelectorAll('.imageSplash .splashHeader div button + button'));
const viewer = document.querySelector('.viewer')
const viewerWindow = document.querySelector('.viewerImageContainer > img');
const viewerImageDetails = document.querySelector('.viewerImageDetails');
const exitViewerButton = document.querySelector('#exitViewer')

splashes.forEach( splash => {
  splash.addEventListener('click', toggleActiveSplash);
  let gallery = Array.from(document.querySelectorAll('.imgContainer'));
  gallery.forEach( artwork => {
    artwork.addEventListener('click', toggleViewer);
  })
})

exitSplashButtons.forEach( button => {
  button.addEventListener('click', setSplashInactive);
});

expandSplashButtons.forEach( button => {
  button.addEventListener('click', expandSplash);
});

exitViewerButton.addEventListener('click', closeViewer);

function toggleActiveSplash(){
  for( let i in splashes ){
    let title = document.querySelector(`#${this.getAttribute('name')}`);
    let expandButton = document.querySelector(`#${this.getAttribute('name')} + div > button`)
    let exitButton = document.querySelector(`#${this.getAttribute('name')} + div button + button`)

    // If this was the splash clicked
    if( !splashXClicked && this.getAttribute('name') === splashes[i].getAttribute('name') ) {
      this.setAttribute("style", "border-color: purple; overflow: scroll;");
      title.setAttribute("style", "color: transparent; background-color: transparent")
      expandButton.setAttribute("style", "opacity: .7;")
      exitButton.setAttribute("style", "opacity: .7;")
    }

    // For all splashes that werent clicked
    if( splashXClicked || this.getAttribute('name') != splashes[i].getAttribute('name') ){
      title = document.querySelector(`#${splashes[i].getAttribute('name')}`);
      expandButton = document.querySelector(`#${splashes[i].getAttribute('name')} + div > button`)
      exitButton = document.querySelector(`#${splashes[i].getAttribute('name')} + div > button + button`)

      splashes[i].setAttribute("style", "border-color: silver; overflow: hidden;");
      title.setAttribute("style", "color: silver;")
      expandButton.setAttribute("style", "opacity: 0;")
      exitButton.setAttribute("style", "opacity: 0;")
    }
  }
  splashXClicked = false;
}

function setSplashInactive(){
  splashXClicked = true;
}

let initialWidth;
function expandSplash(){
  let thisSplash = this.parentElement.parentElement.parentElement;
  console.log(thisSplash);
  for(let i in splashes){
    if(!splashXClicked && thisSplash === splashes[i]){
      thisSplash.parentElement.setAttribute("style", "width: 98%")
      console.log(thisSplash.style)
      thisSplash.setAttribute("style", "height: 90vh")
    }
    if( splashXClicked && thisSplash === splashes[i]){
      thisSplash.parentElement.setAttribute("style", "width: 48%")
    }
  }
}

function toggleViewer(){
  let img = this.firstChild.nextElementSibling;
  let name = img.nextElementSibling.firstElementChild.innerHTML;
  let creator = img.nextElementSibling.firstElementChild.nextElementSibling.innerHTML;
  let url = img.src;

  viewerWindow.setAttribute('src', url);
  console.log(this.firstChild.nextElementSibling)
  viewerImageDetails.firstElementChild.innerHTML = name + ' ';
  viewerImageDetails.firstElementChild.nextElementSibling.innerHTML = creator;
  viewer.setAttribute('style', "transform: translateY(0);");
  console.log('target:', this.firstChild.nextElementSibling);
  //viewerActive = true;
}

function closeViewer(){
  //viewerActive = false;
  viewer.setAttribute('style', "transform: translateY(150%);")
}
