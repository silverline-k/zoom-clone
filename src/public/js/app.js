const socket = io();

const profile = document.getElementById("profile");
const welcome = document.getElementById("welcome");
const room = document.getElementById("room");

const profileForm = profile.querySelector("form");
const welcomeForm = welcome.querySelector("form");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");

  li.innerText = message;
  ul.appendChild(li);
}

// handle
function handleMessageSubmit(event) {
  event.preventDefault();

  const input = room.querySelector("#msg input");
  const value = input.value;

  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });

  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();

  const input = profile.querySelector("input");
  console.log(input.value);
  socket.emit("nickname", input.value);
  
  const saveBtn = profile.querySelector("#saveBtn");
  saveBtn.hidden = true;
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;

  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubit(event) {
  event.preventDefault();

  const input = welcomeForm.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  
  roomName = input.value;
  input.value = "";
}

profileForm.addEventListener("submit", handleNicknameSubmit);
welcomeForm.addEventListener("submit", handleRoomSubit);

// socket event
socket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;

  addMessage(`${user} arrived!`);
});

socket.on("bye", (left, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;

  addMessage(`${left} left ㅠㅠ`);
})

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";

  if(rooms.length === 0) {
    return;
  }

  rooms.forEach(room => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.appendChild(li);
  })
});
