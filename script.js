const windowState = {}; // Object to store the state of each window
let zCounter = 20; //manages the z index of windows

document.querySelectorAll(".window").forEach((win) => {
  windowState[win.id] = {
    isMaximized: false,
    isMinimized: false,
  };

  win
    .querySelector(".title-bar")
    .addEventListener("mousedown", function (event) {
      dragWindow(event, win.id);
    });
});

function dragWindow(event, windowId) {
  const win = document.getElementById(windowId);
  let shiftX = event.clientX - win.getBoundingClientRect().left;
  let shiftY = event.clientY - win.getBoundingClientRect().top;

  win.style.zIndex = ++zCounter; //bring the window to the front
  win.style.left = event.clientX - shiftX + "px";
  win.style.top = event.clientY - shiftY + "px";

  function moveAt(pageX, pageY) {
    win.style.left = pageX - shiftX + "px";
    win.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  //move the window on mousemove
  document.addEventListener("mousemove", onMouseMove);

  //drop the window, remove unneeded handlers
  document.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    document.onmouseup = null;
  };
}

function openWindow(windowId) {
  const win = document.getElementById(windowId);
  if (win) {
    win.style.display = "block";
    win.style.zIndex = ++zCounter;
    windowState[windowId].isMinimized = false;
    addTaskbarButton(windowId);
  }
}

function closeWindow(windowId) {
  const win = document.getElementById(windowId);
  if (win) {
    win.style.display = "none";
    removeTaskbarButton(windowId);
  }
}

function removeTaskbarButton(windowId) {
  const btn = document.querySelector(`.taskbar-btn[data-window="${windowId}"`);
  if (btn) {
    btn.remove();
  }
}

function restoreWindow(windowId) {
  const win = document.getElementById(windowId);
  const state = windowState[windowId];
  win.style.display = "block";
  win.style.zIndex = ++zCounter;
  state.isMinimized = false;
}

function addTaskbarButton(windowId) {
  const existing = document.querySelector(
    `.taskbar-btn[data-window="${windowId}"]`,
  );
  if (existing) return; // if it already exists, no need to duplicate

  const icon = document.querySelector(`.d-icon[onclick*="${windowId}"] img`);
  const win = document.getElementById(windowId);
  const title = win.querySelector(".title-bar-text").textContent;

  const btn = document.createElement("button");
  btn.className = "taskbar-btn";
  btn.dataset.window = windowId;

  if (icon) {
    const img = document.createElement("img");
    img.src = icon.src;
    img.className = "taskbar-btn-icon";
    btn.appendChild(img);
  }

  const label = document.createElement("span");
  label.textContent = title;
  btn.appendChild(label);

  btn.onclick = () => {
    const state = windowState[windowId];
    if (state.isMinimized) {
      restoreWindow(windowId);
    } else {
      minimizeWindow(windowId); // clicking an open window's taskbar button minimizes it
    }
  };

  document.getElementById("taskbar-windows").appendChild(btn);
}

function maximizeWindow(windowId) {
  const win = document.getElementById(windowId);
  const state = windowState[windowId];
  if (!state.isMaximized) {
    state.prevWidth = win.style.width;
    state.prevHeight = win.style.height;
    state.prevLeft = win.style.left;
    state.prevTop = win.style.top;

    win.style.width = "100%";
    win.style.height = "100%";
    win.style.left = "0";
    win.style.top = "0";
    state.isMaximized = true;
  } else {
    //put everything back to the way it was before it was maximized
    win.style.width = state.prevWidth;
    win.style.height = state.prevHeight;
    win.style.left = state.prevLeft;
    win.style.top = state.prevTop;
    state.isMaximized = false;
  }
}

function minimizeWindow(windowId) {
  const win = document.getElementById(windowId);
  const state = windowState[windowId];
  win.style.display = "none";
  state.isMinimized = true;
}

function toggleStartMenu(e) {
  if (e) {
    e.stopPropagation();
  }

  const startButton = document.querySelector(".start-button");
  const startMenu = document.getElementById("start-menu");

  startButton.classList.toggle("is-active");

  //showing / hiding the start menu
  if (startMenu) {
    if (startButton.classList.contains("is-active")) {
      startMenu.style.display = "block";
    } else {
      startMenu.style.display = "none";
    }
  }
}

document.addEventListener("click", function (event) {
  const startButton = document.querySelector(".start-button");
  const startMenu = document.getElementById("start-menu");

  if (
    !startButton.contains(event.target) &&
    (!startMenu || !startMenu.contains(event.target))
  ) {
    startButton.classList.remove("is-active");

    if (startMenu) {
      startMenu.style.display = "none";
    }
  }
});

// Blog function scripts

async function loadBlogIndex() {
  const res = await fetch("blog/index.json");
  const posts = await res.json();

  posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  renderBlogList(posts);
}

function renderBlogList(posts) {
  const list = document.getElementById("blog-list");
  list.innerHTML = "";

  posts.forEach((post, index) => {
    const entry = document.createElement("div");
    entry.className =
      index === 0 ? "blog-entry blog-entry-featured" : "blog-entry";
    entry.innerHTML = `
      ${index === 0 ? "<h4>Most Recent Post!</h4>" : ""}
      <a href="#" class="blog-link" data-path="${post.path}">${post.header}</a>
      <p class="blog-date">${post.date}</p>
      <p class="blog-tldr">${post.tldr}</p>
    `;
    list.appendChild(entry);
  });

  document.querySelectorAll(".blog-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openBlogPost(link.dataset.path);
    });
  });
}

async function openBlogPost(path) {
  const res = await fetch(path);
  const post = await res.json();

  document.getElementById("blog-list").style.display = "none";
  const detail = document.getElementById("blog-detail");
  detail.style.display = "block";
  detail.innerHTML = `
    <button onclick="closeBlogPost()">&larr; Back</button>
    <h3>${post.header}</h3>
    <p class="blog-date">${post.date}</p>
    <p>${post.subject}</p>
  `;
}

function closeBlogPost() {
  document.getElementById("blog-detail").style.display = "none";
  document.getElementById("blog-list").style.display = "block";
}

loadBlogIndex(); //calls once when this script gets loaded
