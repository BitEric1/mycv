document.addEventListener("DOMContentLoaded", () => {
    // 1. CHỨC NĂNG TAB & CUỘN TRANG
    const tabs = document.querySelectorAll(".tab");
    const sections = document.querySelectorAll(".section");

    tabs.forEach((tab) => {
        tab.addEventListener("click", function () {
            tabs.forEach((t) => t.classList.remove("active"));
            this.classList.add("active");
            const targetId = this.getAttribute("data-target");
            const targetSection = document.getElementById(targetId);
            if (targetSection)
                targetSection.scrollIntoView({
                    behavior: "smooth",
                });
        });
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute("id");
                    tabs.forEach((tab) => {
                        tab.classList.remove("active");
                        if (tab.getAttribute("data-target") === currentId) {
                            tab.classList.add("active");
                            if (window.innerWidth <= 850) {
                                tab.scrollIntoView({
                                    behavior: "smooth",
                                    inline: "center",
                                    block: "nearest",
                                });
                            }
                        }
                    });
                }
            });
        },
        {
            root: null,
            rootMargin: "-150px 0px -50% 0px",
            threshold: 0,
        }
    );

    sections.forEach((section) => observer.observe(section));

    // 2. MƯA SAO BĂNG
    const meteorContainer = document.createElement("div");
    meteorContainer.className = "meteor-container";
    document.body.prepend(meteorContainer);

    for (let i = 0; i < 70; i++) {
        let star = document.createElement("div");
        star.className = "star";
        star.style.left = Math.random() * 100 + "vw";
        star.style.top = Math.random() * 100 + "vh";
        star.style.width = star.style.height = Math.random() * 2 + 1 + "px";
        star.style.animationDuration = Math.random() * 3 + 1 + "s";
        star.style.animationDelay = Math.random() * 2 + "s";
        meteorContainer.appendChild(star);
    }

    function spawnMeteor() {
        let meteor = document.createElement("div");
        meteor.className = "meteor";
        meteor.style.left = Math.random() * 150 + "vw";
        meteor.style.top = "-100px";
        meteor.style.height = Math.random() * 80 + 40 + "px";
        meteor.style.animationDuration = Math.random() * 1.5 + 0.8 + "s";
        meteorContainer.appendChild(meteor);
        setTimeout(() => meteor.remove(), 2500);
        setTimeout(spawnMeteor, Math.random() * 1000 + 300);
    }
    spawnMeteor();
    spawnMeteor();

    // 3. MÁY NGHE NHẠC "NƠI NÀY CÓ ANH"
    const musicBtn = document.getElementById("toggle-music");
    const audio = document.getElementById("bg-audio");
    const musicIcon = document.getElementById("music-icon");
    const equalizer = document.getElementById("equalizer");
    let isPlaying = false;

    // Hàm cập nhật giao diện khi nhạc phát
    function updateUI_Play() {
        musicIcon.classList.remove("fa-play");
        musicIcon.classList.add("fa-pause");
        equalizer.classList.add("playing");
        isPlaying = true;
    }

    // Hàm cập nhật giao diện khi nhạc dừng
    function updateUI_Pause() {
        musicIcon.classList.remove("fa-pause");
        musicIcon.classList.add("fa-play");
        equalizer.classList.remove("playing");
        isPlaying = false;
    }

    let playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise
            .then((_) => {
                // Nếu trình duyệt cho phép tự phát (hiếm khi xảy ra), cập nhật UI luôn
                updateUI_Play();
            })
            .catch((error) => {
                // Tạo một sự kiện: Người dùng cứ click vào BẤT CỨ ĐÂU trên web lần đầu tiên là nhạc lên
                const playOnFirstInteraction = () => {
                    if (!isPlaying) {
                        audio.play();
                        updateUI_Play();
                    }
                    // Sau khi lừa được trình duyệt phát nhạc rồi thì xóa cái sự kiện này đi cho nhẹ web
                    document.body.removeEventListener(
                        "click",
                        playOnFirstInteraction
                    );
                    document.body.removeEventListener(
                        "keydown",
                        playOnFirstInteraction
                    );
                };

                // Gắn sự kiện lắng nghe click hoặc gõ phím toàn trang
                document.body.addEventListener("click", playOnFirstInteraction);
                document.body.addEventListener(
                    "keydown",
                    playOnFirstInteraction
                );
            });
    }

    // Chức năng bật/tắt thủ công khi bấm vào nút máy nghe nhạc góc dưới
    musicBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Ngăn chặn sự kiện click này lan ra ngoài body (tránh xung đột)
        if (isPlaying) {
            audio.pause();
            updateUI_Pause();
        } else {
            audio
                .play()
                .catch((err) =>
                    alert(
                        "Cậu chưa tải file noi_nay_co_anh.mp3 vào cùng thư mục kìa!"
                    )
                );
            updateUI_Play();
        }
    });
});
