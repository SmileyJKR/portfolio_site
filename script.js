const windowState = {} // Object to store the state of each window  
let zCounter = 20; //manages the z index of windows

document.querySelectorAll('.window').forEach(win => {
  windowState[win.id] = {
    isMaximized: false,
    isMinimized: false,
  }

  win.querySelector('.title-bar').addEventListener('mousedown', function(event){
    dragWindow(event, win.id);
  })
});

function dragWindow(event, windowId) {
  const win = document.getElementById(windowId);
  let shiftX = event.clientX - win.getBoundingClientRect().left;
  let shiftY = event.clientY - win.getBoundingClientRect().top;

  win.style.zIndex = ++zCounter; //bring the window to the front
  win.style.left = event.clientX - shiftX + 'px';
  win.style.top = event.clientY - shiftY + 'px';

  function moveAt(pageX, pageY) {
    win.style.left = pageX - shiftX + 'px';
    win.style.top = pageY - shiftY + 'px';
  }
  
  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  //move the window on mousemove
  document.addEventListener('mousemove', onMouseMove);

  //drop the window, remove unneeded handlers
  document.onmouseup = function() {
    document.removeEventListener('mousemove', onMouseMove);
    document.onmouseup = null;
  };
}


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

function maximizeWindow(windowId){
  const win = document.getElementById(windowId);
  const state = windowState[windowId];
  if(!state.isMaximized){
    state.prevWidth = win.style.width;
    state.prevHeight = win.style.height;
    state.prevLeft = win.style.left;
    state.prevTop = win.style.top;

    win.style.width = '100%';
    win.style.height = '100%';
    win.style.left = '0';
    win.style.top = '0';
    state.isMaximized = true;
  } else { //put everything back to the way it was before it was maximized
    win.style.width = state.prevWidth;
    win.style.height = state.prevHeight;
    win.style.left = state.prevLeft;
    win.style.top = state.prevTop;
    state.isMaximized = false;
  }
}

// function minimizeWindow(windowId){
//   const win = document.getElementById(windowId);
//   //implement later once taskbar is implemented
//   break
// }

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