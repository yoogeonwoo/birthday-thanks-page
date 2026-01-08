const envelope = document.getElementById("envelope");

const btnOpenLetter = document.getElementById("btnOpenLetter");
const btnOpenInbox  = document.getElementById("btnOpenInbox");
const btnCheckName  = document.getElementById("btnCheckName");

const modalLetter = document.getElementById("modalLetter");
const modalName   = document.getElementById("modalName");
const modalReply  = document.getElementById("modalReply");

const nameInput  = document.getElementById("nameInput");
const replyTitle = document.getElementById("replyTitle");
const replyBody  = document.getElementById("replyBody");

btnOpenLetter.onclick = () => {
  envelope.classList.add("open");
  setTimeout(() => modalLetter.classList.add("show"), 900);
};

btnOpenInbox.onclick = () => {
  modalName.classList.add("show");
};

btnCheckName.onclick = async () => {
  const name = nameInput.value;
  if(!name) return;

  const res = await fetch("./data/replies.json");
  const data = await res.json();
  if(!data[name]) return;

  modalName.classList.remove("show");
  replyTitle.textContent = `${name}님께`;
  replyBody.textContent  = data[name];
  modalReply.classList.add("show");
};

document.querySelectorAll("[data-close]").forEach(btn=>{
  btn.onclick = e=>{
    document.getElementById(e.target.dataset.close).classList.remove("show");
    envelope.classList.remove("open");
  };
});
