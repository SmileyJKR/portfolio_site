function openWindow(windowId){
  const win = document.getElementById(windowId);
  if(win) {
    win.style.display = 'block';
  }
}

function closeWindow(windowId){
  const win = document.getElementById(windowId);
  if(win) {
    win.style.display = 'none';
  }
}

function toggleStartMenu() {
  if(event){
    event.stopPropagation();
  }
  
  const startButton = document.querySelector('.start-button');
  const startMenu = document.getElementById('start-menu');

  startButton.classList.toggle('is-active');

  //showing / hiding the start menu
  if(startMenu){
    if(startButton.classList.contains('is-active')){
      startMenu.style.display = 'block';
    } else {
      startMenu.style.display = 'none';
    }
  }
}

document.addEventListener('click', function(event) {
  const startButton = document.querySelector('.start-button');
  const startMenu = document.getElementById('start-menu');

  if(!startButton.contains(event.target) && (!startMenu || !startMenu.contains(event.target))) {
    startButton.classList.remove('is-active');
  
    if(startMenu){
      startMenu.style.display = 'none';
    }
  }
});