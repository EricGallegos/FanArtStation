let splashXClicked = false;
const splashes = Array.from(document.querySelectorAll('.imageSplash'));
const exitSplashButtons = Array.from(document.querySelectorAll('.imageSplash .splashHeader button'));

splashes.forEach( splash => {
  splash.addEventListener('click', toggleActiveSplash);
})
exitSplashButtons.forEach( button => {
  button.addEventListener('click', setSplashInactive);
});


function toggleActiveSplash(){
  for( let i in splashes ){
    // If this was the splash clicked
    if( !splashXClicked && this.getAttribute('name') === splashes[i].getAttribute('name') ) {
      this.setAttribute("style", "border-color: purple; overflow: scroll;");

      let title = document.querySelector(`#${this.getAttribute('name')}`);
      title.setAttribute("style", "color: white;")

      let button = document.querySelector(`#${this.getAttribute('name')} + button`)
      button.setAttribute("style", "opacity: .7;")
    }

    // For all splashes that werent clicked
    if( splashXClicked || this.getAttribute('name') != splashes[i].getAttribute('name') ){
      splashes[i].setAttribute("style", "border-color: silver; overflow: hidden;");

      let title = document.querySelector(`#${splashes[i].getAttribute('name')}`);
      title.setAttribute("style", "color: silver;")

      let button = document.querySelector(`#${splashes[i].getAttribute('name')} + button`)
      button.setAttribute("style", "opacity: 0;")
    }
  }
  splashXClicked = false;
}

function setSplashInactive(){
  splashXClicked = true;
}
