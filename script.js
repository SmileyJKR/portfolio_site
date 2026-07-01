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
