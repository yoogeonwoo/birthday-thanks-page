(() => {
  const $ = (s) => document.querySelector(s);

  const openModal = (m) => {
    if (!m) return;
    m.classList.add("is-open");
    m.setAttribute("aria-hidden", "false");
  };

  const closeModal = (m) => {
    if (!m) return;
    m.classList.remove("is-open");
    m.setAttribute("aria-hidden", "true");
  };

  document.addEventListener("DOMContentLoaded", () => {
    const envelope = $("#envelope");

    const modalLetter = $("#modalLetter");
    const modalName = $("#modalName");
    const modalReply = $("#modalReply");

    const btnOpenLetter = $("#btnOpenLetter");
    const btnOpenInbox = $("#btnOpenInbox");
    const btnCheckName = $("#btnCheckName");

    const nameInput = $("#nameInput");
    const replyTitle = $("#replyTitle");
    const replyBody = $("#replyBody");

    // 안전장치: 요소가 하나라도 없으면 조용히 종료(버튼 무반응 원인 방지)
    if (!envelope || !modalLetter || !modalName || !modalReply ||
        !btnOpenLetter || !btnOpenInbox || !btnCheckName ||
        !nameInput || !replyTitle || !replyBody) {
      console.error("[INIT] Missing required elements. Check IDs in HTML.");
      return;
    }

    let repliesCache = null;
    let isAnimating = false;

    document.addEventListener("click", (e) => {
      const key = e.target?.dataset?.close;
      if (!key) return;

      if (key === "modalLetter") {
        closeModal(modalLetter);
        envelope.classList.remove("is-opening");
        isAnimating = false;
      }
      if (key === "modalName") closeModal(modalName);
      if (key === "modalReply") closeModal(modalReply);
    });

    const loadReplies = async () => {
      if (repliesCache) return repliesCache;
      try {
        const res = await fetch("data/replies.json", { cache: "no-store" });
        if (!res.ok) { repliesCache = {}; return repliesCache; }
        const json = await res.json();
        repliesCache = (json && typeof json === "object") ? json : {};
        return repliesCache;
      } catch {
        repliesCache = {};
        return repliesCache;
      }
    };

    btnOpenLetter.addEventListener("click", () => {
      if (isAnimating) return;
      isAnimating = true;

      envelope.classList.add("is-opening");

      window.setTimeout(() => {
        openModal(modalLetter);
        isAnimating = false;
      }, 680);
    });

    btnOpenInbox.addEventListener("click", async () => {
      await loadReplies();
      nameInput.value = "";
      openModal(modalName);
      try { nameInput.focus({ preventScroll: true }); } catch {}
    });

    const tryOpenReply = async () => {
      const name = nameInput.value.trim();
      if (!name) return;

      const data = await loadReplies();
      const msg = data[name];
      if (!msg) return;

      closeModal(modalName);
      replyTitle.textContent = `${name}님께`;
      replyBody.textContent = String(msg);
      openModal(modalReply);
    };

    btnCheckName.addEventListener("click", () => { void tryOpenReply(); });

    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") void tryOpenReply();
    });

    // 디버그 표식(필요 없으면 삭제 가능)
    console.log("[INIT] main.js loaded and bound.");
  });
})();
