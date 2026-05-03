const inputMessage = document.getElementById("inputMessage");
const sendBtn = document.getElementById("sendBtn");
const chatbox = document.getElementById("chatbox");

function appendMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);

  const textBubble = document.createElement("span");
  textBubble.classList.add("text-bubble");
  textBubble.textContent = text;
  if (sender === "bot") {
    const iconImg = document.createElement("img");
    iconImg.classList.add("bot-chat-logo");
    iconImg.src = "logo.jpg";
    iconImg.alt = "bot logo";
    msgDiv.appendChild(iconImg);
  }
  msgDiv.appendChild(textBubble);
  chatbox.appendChild(msgDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// event
async function sendMessage() {
  const message = inputMessage.value.trim();
  if (!message) return;
  appendMessage(message, "user");
  inputMessage.value = "";
  sendBtn.disabled = true;

  try {
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) throw new Error("Network response was not okay");
    const data = await response.json();
    // data reply
    appendMessage(data.reply, "bot");
  } catch (error) {
    appendMessage("Error: Could not reach the server.", "bot");
    console.log(error);
  } finally {
    sendBtn.disabled = false;
    inputMessage.focus();
  }
}
sendBtn.addEventListener("click", sendMessage);
inputMessage.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});
