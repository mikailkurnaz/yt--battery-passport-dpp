(() => {
  const state = {
    tab: "overview",
    showQR: false,
    data: null,
    error: null
  };

  const tabs = [
    { id: "overview", label: "Genel Bakış", icon: "battery" },
    { id: "carbon", label: "Karbon Ayak İzi", icon: "leaf" },
    { id: "materials", label: "Malzeme", icon: "package" },
    { id: "performance", label: "Performans", icon: "zap" },
    { id: "circularity", label: "Döngüsellik", icon: "recycle" },
    { id: "compliance", label: "Uyumluluk", icon: "shield" }
  ];

  const el = document.getElementById("app");

  function escapeHtml(x) {
    return String(x ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function icon(name) {
    return `<i data-lucide="${name}" style="width:18px;height:18px;"></i>`;
  }

  async function load() {
    state.error = null;
    try {
      const res = await fetch("./passport.json", { cache: "no-store" });
      if (!res.ok) throw new Error("passport.json okunamadı");
      state.data = await res.json();
    } catch (e) {
      state.error = e?.message || "Bilinmeyen hata";
      state.data = null;
    }
    render();
  }

  function headerHTML(d) {
    const id = d?.passport?.id || "—";
    const batteryType = d?.battery?.batteryType || "—";
    const chem = d?.battery?.chemistry?.code || d?.battery?.chemistry?.label || "—";
    const country = d?.battery?.manufacturing?.country || "—";

    return `
      <div class="card">
        <div class="header">
          <div class="brand">
            <div class="logo">${icon("battery")}</div>
            <div>
              <h1 class="title">Dijital Batarya Pasaportu</h1>
              <p class="subtitle">Tez Prototipi • EU Battery Regulation 2023/1542 & ESPR ile uyumlu tasarım</p>
            </div>
          </div>

          <button class="btn" data-action="toggleQR">
            ${icon("globe")} QR Kod
          </button>
        </div>

        ${state.showQR ? `
          <div class="qrBox">
            <div class="qrInner">
              <div class="qrFake">
                QR CODE<br/>
                ${escapeHtml(id)}
              </div>
            </div>
            <div class="small" style="margin-top:8px;">Bu QR kodu tarayarak pasaport sayfasına erişim (demo)</div>
          </div>
        ` : ""}

        <div class="grid4">
          <div class="mini">
            <div class="k">Pasaport ID</div>
            <div class="v" style="font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">
              ${escapeHtml(id)}
            </div>
          </div>
          <div class="mini green">
            <div class="k">Batarya Türü</div>
            <div class="v">${escapeHtml(batteryType)}</div>
          </div>
          <div class="mini purple">
            <div class="k">Kimya</div>
            <div class="v">${escapeHtml(chem)}</div>
          </div>
          <div class="mini amber">
            <div class="k">Üretim Ülkesi</div>
            <div class="v">${escapeHtml(country)}</div>
          </div>
        </div>
      </div>
    `;
  }

  function tabsHTML() {
    return `
      <div class="tabs">
        ${tabs.map(t => `
          <button class="tab ${state.tab === t.id ? "active" : ""}" data-tab="${t.id}">
            ${icon(t.icon)} ${escapeHtml(t.label)}
          </button>
        `).join("")}
      </div>
    `;
  }

  function overviewHTML(d) {
    const b = d?.battery || {};
    const chem = b?.chemistry?.label || "—";
    const year = b?.manufacturing?.year || "—";
    const country = b?.manufacturing?.country || "—";
    const capacity = b?.capacity || "—";
    const manufacturer = b?.manufacturer || "—";
    const model = b?.model || "—";

    const cf = d?.carbonFootprint;
    const cfStatus = cf?.dataAvailable ? "Mevcut" : "Mevcut değil";

    return `
      <h2>Genel Bilgiler</h2>

      <div class="row">
        <div class="box">
          <div class="kv">
            <div class="k">Üretici</div>
            <div class="v">${escapeHtml(manufacturer)}</div>
          </div>
          <div class="kv green">
            <div class="k">Model</div>
            <div class="v">${escapeHtml(model)}</div>
          </div>
          <div class="kv purple">
            <div class="k">Kimya Yapısı</div>
            <div class="v">${escapeHtml(chem)}</div>
          </div>
          <div class="kv amber">
            <div class="k">Üretim</div>
            <div class="v">${escapeHtml(year)} • ${escapeHtml(country)}</div>
          </div>
          <div class="kv" style="border-left-color:#ec4899;">
            <div class="k">Nominal Kapasite</div>
            <div class="v">${escapeHtml(capacity)}</div>
          </div>
        </div>

        <div class="box" style="background:linear-gradient(135deg,#ecfdf5,#eff6ff); border-color:#dbeafe;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
            <div>
              <div style="font-weight:1000; display:flex; gap:8px; align-items:center;">
                ${icon("check-circle")} Uyumluluk Durumu
              </div>
              <div class="muted" style="margin-top:6px;">
                Bu sayfa tez kapsamında hazırlanmış bir <b>demo</b> arayüzüdür.
              </div>
              <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
                <span class="pill green">${icon("check-circle")} Uyumlu (Demo)</span>
                <span class="pill blue">${icon("shield")} Düzenleyici çerçeve</span>
              </div>
            </div>

            <div style="text-align:right;">
              <div class="small">Karbon ayak izi</div>
              <div style="font-weight:1000;">${escapeHtml(cfStatus)}</div>
              <div class="small" style="margin-top:6px;">
                <a href="./passport.json" target="_blank" rel="noopener">passport.json</a>
              </div>
            </div>
          </div>

          <div class="small" style="margin-top:14px;">
            Not: Eksik alanlar “Veri mevcut değil” olarak bırakılmıştır.
          </div>
        </div>
      </div>
    `;
  }

  function carbonHTML(d) {
    const cf = d?.carbonFootprint || {};
    const total = cf?.total ?? "—";
    const unit = cf?.unit || "kgCO₂e/kWh";
    const ref = cf?.reference || "—";
    const note = cf?.note || "";

    const stages = cf?.stages || {};
    const stageNames = {
      rawMaterial: "Hammadde Çıkarımı",
      manufacturing: "Üretim",
      transport: "Taşıma",
      endOfLife: "Ömür Sonu"
    };

    const totalNum = Number(total);
    const stageRows = Object.entries(stages).map(([k, v]) => {
      const pct = (totalNum && Number(v) && totalNum > 0) ? (Number(v) / totalNum * 100) : 0;
      return `
        <div style="margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; gap:12px;">
            <div style="font-weight:900;">${escapeHtml(stageNames[k] || k)}</div>
            <div style="font-weight:900;">${escapeHtml(v)} ${escapeHtml(unit)} (${pct.toFixed(1)}%)</div>
          </div>
          <div class="barwrap"><div class="bar" style="width:${pct}%;"></div></div>
        </div>
      `;
    }).join("");

    return `
      <h2>Karbon Ayak İzi</h2>

      <div class="box" style="background:#eff6ff; border-color:#bfdbfe;">
        <div style="display:flex; justify-content:space-between; gap:14px; align-items:flex-start;">
          <div>
            <div class="pill blue">${icon("alert-circle")} Önemli Not</div>
            <div class="muted" style="margin-top:8px;">
              ${escapeHtml(note)}
            </div>
          </div>

          <div style="text-align:right;">
            <div style="font-size:30px; font-weight:1000; color:#16a34a;">
              ${escapeHtml(total)} ${escapeHtml(unit)}
            </div>
            <div class="small">Kaynak: ${escapeHtml(ref)}</div>
          </div>
        </div>
      </div>

      <div class="row" style="margin-top:14px;">
        <div class="box">
          <div style="font-weight:1000; margin-bottom:10px;">Tahmini Yaşam Döngüsü Dağılımı</div>
          ${stageRows || `<div class="muted">Veri mevcut değil</div>`}
        </div>

        <div class="box" style="background:#ecfdf5; border-color:#bbf7d0;">
          <div style="font-weight:1000; margin-bottom:10px;">Metodoloji (Özet)</div>
          <div class="list">
            <div class="pill green">${icon("file-text")} ISO 14067:2018</div>
            <div class="pill green">${icon("leaf")} Beşikten kapıya (Cradle-to-gate)</div>
            <div class="pill green">${icon("trending-up")} Literatür bazlı demo</div>
          </div>
          <div class="small" style="margin-top:12px;">
            Not: Seri üretim verisi geldiğinde gerçek değerler güncellenmelidir.
          </div>
        </div>
      </div>
    `;
  }

  function materialsHTML(d) {
    const mats = d?.materials || [];
    return `
      <h2>Malzeme Kompozisyonu</h2>

      <div class="box" style="background:#fffbeb; border-color:#fde68a;">
        <div class="pill amber">${icon("alert-circle")} Veri Durumu</div>
        <div class="muted" style="margin-top:8px;">
          Tedarik kaynağı ve geri dönüştürülmüş içerik verileri demo kapsamındadır.
        </div>
      </div>

      <div class="box" style="margin-top:14px;">
        <div class="list">
          ${mats.map(m => `
            <div class="box" style="margin:0; border-radius:14px;">
              <div class="mat">
                <div class="matL">
                  <div class="badgePct">${escapeHtml(m.percentage)}%</div>
                  <div>
                    <div style="font-weight:1000;">${escapeHtml(m.name)}</div>
                    <div class="small">Kaynak: ${escapeHtml(m.source || "Veri mevcut değil")}</div>
                    <div class="small">Geri dönüştürülmüş içerik: ${escapeHtml(m.recycledContent || "Veri mevcut değil")}</div>
                  </div>
                </div>

                ${m.recyclable
                  ? `<span class="pill green">${icon("recycle")} Geri dönüştürülebilir</span>`
                  : `<span class="pill">${icon("alert-circle")} Sınırlı</span>`
                }
              </div>

              <div class="barwrap" style="margin-top:10px;">
                <div class="bar" style="width:${Number(m.percentage) || 0}%; background:linear-gradient(90deg,#60a5fa,#a855f7);"></div>
              </div>
            </div>
          `).join("") || `<div class="muted">Veri mevcut değil</div>`}
        </div>
      </div>

      <div class="box" style="margin-top:14px; background:#eff6ff; border-color:#bfdbfe;">
        <div style="font-weight:1000; display:flex; gap:8px; align-items:center;">
          ${icon("shield")} Due Diligence & Sorumlu Tedarik (Demo)
        </div>
        <div class="row" style="margin-top:10px;">
          <div class="box">
            <div style="font-weight:900;">Tedarik Zinciri Şeffaflığı</div>
            <div class="small">Veri toplama aşamasında</div>
          </div>
          <div class="box">
            <div style="font-weight:900;">Conflict Minerals</div>
            <div class="small">Değerlendirme / demo</div>
          </div>
        </div>
      </div>
    `;
  }

  function performanceHTML(d) {
    const p = d?.performance || {};
    const labels = [
      ["energyDensity", "Enerji Yoğunluğu"],
      ["powerDensity", "Güç Yoğunluğu"],
      ["cycleLife", "Çevrim Ömrü"],
      ["chargingTime", "Şarj Süresi"],
      ["operatingTemp", "Çalışma Sıcaklığı"],
      ["stateOfHealth", "Sağlık Durumu (SoH)"]
    ];

    return `
      <h2>Teknik Performans</h2>

      <div class="row">
        <div class="box">
          <div style="display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:12px;">
            ${labels.map(([k, label]) => `
              <div class="box" style="margin:0; background:linear-gradient(135deg,#f8fafc,#eff6ff);">
                <div class="small">${escapeHtml(label)}</div>
                <div style="font-size:18px; font-weight:1000; margin-top:6px;">
                  ${escapeHtml(p[k] || "Veri mevcut değil")}
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="box" style="background:#ecfdf5; border-color:#bbf7d0;">
          <div style="font-weight:1000; margin-bottom:10px;">Test Sonuçları (Demo)</div>
          <div class="small" style="line-height:1.8;">
            ✓ UN 38.3<br/>
            ✓ IEC 62133<br/>
            ✓ Thermal Runaway (Demo)<br/>
            ✓ Vibration & Shock (Demo)<br/>
          </div>
          <div class="small" style="margin-top:10px;">
            Not: Bu kısım prototip arayüz örneğidir.
          </div>
        </div>
      </div>
    `;
  }

  function circularityHTML(d) {
    const c = d?.circularity || {};
    function card(title, value, status) {
      const ok = status === "ok";
      return `
        <div class="box" style="border-width:2px; border-color:${ok ? "#bbf7d0" : "#fde68a"}; background:${ok ? "#ecfdf5" : "#fffbeb"};">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
            <div style="font-weight:1000;">${escapeHtml(title)}</div>
            ${ok ? icon("check-circle") : icon("alert-circle")}
          </div>
          <div style="margin-top:10px; font-weight:900;">${escapeHtml(value || "Veri mevcut değil")}</div>
        </div>
      `;
    }

    return `
      <h2>Döngüsel Ekonomi & Sürdürülebilirlik</h2>

      <div class="row">
        <div class="box">
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            ${card("Onarılabilirlik", c.repairability, "warn")}
            ${card("Geri Dönüşüm", c.recyclability, c.recyclability ? "ok" : "warn")}
            ${card("Geri Dönüştürülmüş İçerik", c.recycledContent, "warn")}
            ${card("İkinci Ömür", c.secondLife, "warn")}
          </div>
        </div>

        <div class="box" style="background:#eff6ff; border-color:#bfdbfe;">
          <div style="font-weight:1000; display:flex; gap:8px; align-items:center;">
            ${icon("file-text")} Mevcut Dokümanlar (Demo)
          </div>
          <div style="margin-top:12px; display:flex; flex-direction:column; gap:10px;">
            <div class="pill green">${icon("check-circle")} Söküm Talimatları</div>
            <div class="pill green">${icon("check-circle")} SDS (Safety Data Sheet)</div>
          </div>

          <div class="small" style="margin-top:12px;">
            Not: Seri üretim aşamasında tüm veri alanları güncellenecektir.
          </div>
        </div>
      </div>
    `;
  }

  function regulationCard(r) {
    // İSTEDİĞİN DÜZENLEME: alt maddeleri kaldırdık → sadece “Uyumlu (Demo)”
    return `
      <div class="box" style="border:1px solid #bbf7d0; background:#ecfdf5;">
        <div style="display:flex; gap:10px; align-items:center; font-weight:1000;">
          <div style="background:${r.color || "#22c55e"}; width:38px; height:38px; border-radius:12px; display:flex; align-items:center; justify-content:center; color:white;">
            <i data-lucide="${r.icon || "shield"}"></i>
          </div>
          <div>
            <div style="font-weight:1000;">${escapeHtml(r.title || "—")}</div>
            <div class="small">${escapeHtml(r.subtitle || "")}</div>
          </div>
        </div>

        <div style="margin-top:12px;">
          <span class="pill green">
            <i data-lucide="check-circle"></i>
            Uyumlu (Demo)
          </span>
        </div>

        <div class="small" style="margin-top:10px;">
          Detaylar tez/prototip kapsamı gereği özetlenmiştir.
        </div>
      </div>
    `;
  }

  function complianceHTML(d) {
    const regs = d?.compliance?.regulations || [
      { title: "EU Battery Regulation", subtitle: "2023/1542", icon: "shield", color: "#22c55e" },
      { title: "ESPR", subtitle: "Ecodesign (DPP yaklaşımı)", icon: "leaf", color: "#3b82f6" }
    ];

    const other = d?.compliance?.other || { rohs: "Uyumlu (Demo)", reach: "Uyumlu (Demo)", ce: "Uyumlu (Demo)" };

    return `
      <h2>Düzenleyici Uyumluluk</h2>

      <div class="row">
        <div class="box">
          ${regs.slice(0,1).map(regulationCard).join("")}
        </div>
        <div class="box">
          ${regs.slice(1,2).map(regulationCard).join("")}
        </div>
      </div>

      <div class="box" style="margin-top:14px;">
        <div style="display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:12px;">
          <div class="box" style="margin:0; background:#f8fafc;">
            <div style="font-weight:1000;">RoHS</div>
            <div class="small">Tehlikeli madde kısıtları</div>
            <div style="margin-top:10px;" class="pill green">${icon("check-circle")} ${escapeHtml(other.rohs)}</div>
          </div>
          <div class="box" style="margin:0; background:#f8fafc;">
            <div style="font-weight:1000;">REACH</div>
            <div class="small">Kimyasal mevzuat</div>
            <div style="margin-top:10px;" class="pill green">${icon("check-circle")} ${escapeHtml(other.reach)}</div>
          </div>
          <div class="box" style="margin:0; background:#f8fafc;">
            <div style="font-weight:1000;">CE</div>
            <div class="small">Uygunluk işareti</div>
            <div style="margin-top:10px;" class="pill green">${icon("check-circle")} ${escapeHtml(other.ce)}</div>
          </div>
        </div>

        <div class="small" style="margin-top:12px;">
          Not: Bu uyumluluk gösterimi tezde kullanılacak demo arayüz örneğidir.
        </div>
      </div>
    `;
  }

  function contentHTML(d) {
    if (state.tab === "overview") return overviewHTML(d);
    if (state.tab === "carbon") return carbonHTML(d);
    if (state.tab === "materials") return materialsHTML(d);
    if (state.tab === "performance") return performanceHTML(d);
    if (state.tab === "circularity") return circularityHTML(d);
    if (state.tab === "compliance") return complianceHTML(d);
    return `<div class="muted">Sekme bulunamadı</div>`;
  }

  function render() {
    if (state.error) {
      el.innerHTML = `
        <div class="card" style="padding:18px;">
          <div class="pill amber">${icon("alert-circle")} Hata</div>
          <div style="margin-top:10px; font-weight:1000;">${escapeHtml(state.error)}</div>
          <div class="small" style="margin-top:8px;">
            Kontrol: <b>docs/passport.json</b> dosyası var mı, adı doğru mu?
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    const d = state.data;

    el.innerHTML = `
      ${headerHTML(d)}
      ${tabsHTML()}

      <div class="card content">
        ${contentHTML(d)}
      </div>

      <div class="footer">
        <div>Bu sayfa GitHub Pages üzerinde çalışan tez prototipidir.</div>
        <div style="margin-top:6px;">
          JSON: <a href="./passport.json" target="_blank" rel="noopener">passport.json</a>
        </div>
      </div>
    `;

    // ikonları çiz
    if (window.lucide) window.lucide.createIcons();
  }

  // Tıklamalar (sekme değişimi + QR aç/kapa)
  document.addEventListener("click", (e) => {
    const tabBtn = e.target.closest("[data-tab]");
    if (tabBtn) {
      state.tab = tabBtn.getAttribute("data-tab");
      render();
      return;
    }

    const actBtn = e.target.closest("[data-action]");
    if (actBtn) {
      const act = actBtn.getAttribute("data-action");
      if (act === "toggleQR") {
        state.showQR = !state.showQR;
        render();
      }
    }
  });

  // başlat
  load();
})();
