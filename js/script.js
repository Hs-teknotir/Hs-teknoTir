// ===== MOBILE MENU TOGGLE =====
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn?.addEventListener("click", () => {
  const expanded = menuBtn.getAttribute("aria-expanded") === "true";
  menuBtn.setAttribute("aria-expanded", !expanded);
  mobileMenu?.classList.toggle("hidden");
});

document.querySelectorAll("#mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu?.classList.add("hidden");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

// ===== FORM VALIDATION =====
document.addEventListener("DOMContentLoaded", () => {
  if (typeof emailjs === "undefined") {
    console.error("EmailJS belum dimuat!");
    return;
  }

  emailjs.init("thkd_rzA_CW3JPO3C"); // Ganti dengan public key kamu

  const form = document.getElementById("contactForm");
  const popupSuccess = document.getElementById("popupSuccess");
  const popupWarning = document.getElementById("popupWarning");
  const popupError = document.getElementById("popupError");

  const closePopup = document.getElementById("closePopup");
  const closeWarning = document.getElementById("closeWarning");
  const closeError = document.getElementById("closeError");

  if (!form) {
    console.error("Form tidak ditemukan!");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    form
      .querySelectorAll(".has-error")
      .forEach((el) => el.classList.remove("has-error"));
    form.querySelectorAll(".error-message").forEach((msg) => msg.remove());

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

    let hasError = false;

    const validateField = (field, condition, msg) => {
      if (!condition) {
        field.classList.add("has-error");
        const error = document.createElement("div");
        error.className = "error-message text-sm text-red-600 mt-2";
        error.innerText = msg;
        field.parentNode.appendChild(error);
        hasError = true;
      }
    };

    validateField(form.name, name !== "", "Nama tidak boleh kosong");
    validateField(form.email, emailPattern.test(email), "Email tidak valid");
    validateField(form.message, message !== "", "Pesan tidak boleh kosong");

    if (hasError) {
      popupWarning?.classList.remove("hidden");
      return;
    }

    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
    };

    emailjs
      .send("service_221206", "template_voccaev", templateParams)
      .then(() => {
        form.reset();
        popupSuccess?.classList.remove("hidden");
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        popupError?.classList.remove("hidden");
      });
  });

  closePopup?.addEventListener("click", () =>
    popupSuccess?.classList.add("hidden")
  );
  closeWarning?.addEventListener("click", () =>
    popupWarning?.classList.add("hidden")
  );
  closeError?.addEventListener("click", () =>
    popupError?.classList.add("hidden")
  );
});
// ===== LOAD LAYANAN (data/layanan.json) =====
fetch("data/layanan.json")
  .then((res) => res.json())
  .then((layananList) => {
    const container = document.getElementById("layanan-container");
    if (!container) return;

    if (!layananList.length) {
      container.innerHTML = `
        <div class="text-center text-gray-500 py-10 text-lg font-medium">
          Belum ada layanan tersedia saat ini.
        </div>`;
      return;
    }

    container.innerHTML = layananList
      .map(
        (layanan, i) => `
      <div class="bg-white rounded-3xl border border-indigo-100 shadow-xl p-8 flex flex-col justify-between hover:shadow-indigo-300 hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
        <div class="absolute -top-4 -right-4 bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-bl-2xl font-semibold uppercase tracking-wide shadow-sm">
          Paket ${i + 1}
        </div>
        
        <div>
          <h3 class="text-2xl font-bold text-indigo-800 mb-3 tracking-tight">
            ${layanan.nama}
          </h3>
          <p class="text-gray-600 text-sm mb-5 leading-relaxed">
            ${layanan.deskripsi}
          </p>
        </div>

        <div class="mb-4">
          <span class="text-2xl text-indigo-700 font-extrabold">
            ${layanan.hargaDiskon}
          </span>
          <span class="text-sm text-gray-400 line-through ml-2">
            ${layanan.hargaAsli}
          </span>
        </div>

        <div class="mb-5">
          <h4 class="text-sm font-semibold text-gray-800 mb-1">
            Fitur Unggulan:
          </h4>
          <ul class="list-disc pl-5 text-sm text-gray-700 space-y-1">
            ${layanan.fitur.map((f) => `<li>${f}</li>`).join("")}
          </ul>
        </div>

        <div class="bg-indigo-50 rounded-xl p-4 text-xs text-indigo-800 font-medium">
          <p class="mb-1 font-semibold">Termasuk:</p>
          <ul class="list-disc pl-4 space-y-1">
            ${layanan.revisiSupport.map((r) => `<li>${r}</li>`).join("")}
          </ul>
        </div>

        <div class="mt-6">
          <button
            onclick="window.open('https://wa.me/6285189131380?text=Halo%20Hs-teknoTir!%20Saya%20tertarik%20dengan%20layanan%20${layanan.nama}.%20Bisa%20bantu%20saya?')"
            class="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow hover:bg-indigo-700 transition-colors"
          >
            Pesan Sekarang
          </button>
        </div>
      </div>
    `
      )
      .join("");
  })
  .catch((err) => {
    console.error("Gagal memuat layanan:", err);
    const container = document.getElementById("layanan-container");
    if (container) {
      container.innerHTML = `
        <div class="text-center text-red-600 font-semibold bg-red-100 border border-red-300 p-6 rounded-xl shadow">
          ⚠️ Ups! Gagal memuat data layanan. Coba refresh halaman.
        </div>`;
    }
  });
// ===== LOAD KARYA (data/karya.json) =====
fetch("data/karya.json")
  .then((res) => res.json())
  .then((karyaList) => {
    const container = document.getElementById("karya-container");
    if (!container) return;

    if (!karyaList.length) {
      container.innerHTML = `
        <div class="text-center text-gray-500 py-10 text-lg font-medium">
          Belum ada karya yang tersedia saat ini.
        </div>`;
      return;
    }

    container.innerHTML = karyaList
      .map(
        (karya) => `
        <a href="${karya.url}" target="_blank" rel="noopener noreferrer"
          class="group block rounded-3xl overflow-hidden border border-indigo-100 shadow-lg hover:shadow-indigo-300 transition-all duration-300 hover:-translate-y-1 bg-white"
          title="${karya.nama}">
          
          <div class="relative">
            <img
              src="${karya.gambar}"
              alt="Tampilan ${karya.nama}"
              loading="lazy"
              class="w-full h-52 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
            <div class="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-sm opacity-90">
              Live
            </div>
          </div>

          <div class="p-5">
            <h3 class="text-lg font-bold text-indigo-800 mb-2 group-hover:text-indigo-900">
              ${karya.nama}
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed line-clamp-3">
              ${karya.deskripsi}
            </p>
          </div>
        </a>
      `
      )
      .join("");
  })
  .catch((err) => {
    console.error("Gagal memuat karya:", err);
    const container = document.getElementById("karya-container");
    if (container) {
      container.innerHTML = `
        <div class="text-center text-red-600 font-semibold bg-red-100 border border-red-300 p-6 rounded-xl shadow">
          ⚠️ Ups! Tidak dapat memuat portofolio. Silakan coba lagi nanti.
        </div>`;
    }
  });
