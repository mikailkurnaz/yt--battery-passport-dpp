(function () {
  var app = document.getElementById("app");
  if (!app) {
    document.body.innerHTML = "<h2>#app bulunamadı</h2>";
    return;
  }

  // Basit HTML escape
  function esc(x) {
    var s = (x === null || x === undefined) ? "" : String(x);
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function icon(name) {
    return '<i data-lucide="' + name + '" style="width:18px;height:18px;"></i>';
  }

  var state = {
    tab: "overview",
    showQR: false,
    data: null,
    error: null
  };

  var TABS = [
    { id: "overview", label: "Genel Bakış", icon: "battery" },
    { id: "carbon", label: "Karbon Ayak İzi", icon: "leaf" },
    { id: "materials", label: "Malzeme", icon: "package" },
    { id: "performance", label: "Performans", icon: "zap" },
    { id: "circularity", label: "Döngüsellik", icon: "recycle" },
    { id: "compliance", label: "Uyumluluk", icon: "shield" }
  ];

  function createIconsSafe() {
    try {
      if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    } catch (e) { /* boş */ }
  }

  function headerHTML(d) {
    var id = (d && d.passport && d.passport.id) ? d.passport.id : "—";
    var batteryType = (d && d.battery && d.battery.batteryType) ? d.battery.batteryType : "—";
    var chem = "—";
    if (d && d.battery && d.battery.chemistry) {
      chem = d.battery.chemistry.code || d.battery.chemistry.label || "—";
    }
    var country = (d && d.battery && d.battery.manufacturing && d.battery.manufacturing.country)
      ? d.battery.manufacturing.country
      : "—";

    return (
      '<div class="card">' +
        '<div class="header">' +
          '<div class="brand">' +
            '<div class="logo">' + icon("battery") + "</div>" +
            '<div>' +
              '<h1 class="title">Dijital Batarya Pasaportu</h1>' +
              '<p class="subtitle">Tez Prototipi • EU Battery Regulation 2023/1542 & ESPR</p>' +
            '</div>' +
          '</div>' +
          '<button class="btn" data-action="toggleQR">' +
            icon("globe") + " QR Kod" +
          "</button>" +
        "</div>" +

        (state.showQR
          ? (
            '<div class="qrBox">' +
              '<div class="qrInner">' +
                '<div class="qrFake">QR CODE<br/>' + esc(id) + "</div>" +
              "</div>" +
              '<div class="small" style="margin-top:8px;">Demo QR gösterimi</div>' +
            "</div>"
          )
          : ""
        ) +

        '<div class="grid4">' +
          '<div class="mini">' +
            '<div class="k">Pasaport ID</div>' +
            '<div class="v" style="font-family:ui-monospace, monospace;">' + esc(id) + "</div>" +
          "</div>" +
          '<div class="mini green">' +
            '<div class="k">Batarya Türü</div>' +
            '<div class="v">' + esc(batteryType) + "</div>" +
          "</div>" +
          '<div class="mini purple">' +
            '<div class="k">Kimya</div>' +
            '<div class="v">' + esc(chem) + "</div>" +
          "</div>" +
          '<div class="mini amber">' +
            '<div class="k">Üretim Ülkesi</div>' +
            '<div class="v">' + esc(country) + "</div>" +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  function tabsHTML() {
    var out = '<div class="tabs">';
    for (var i = 0; i < TABS.length; i++) {
      var t = TABS[i];
      out +=
        '<button class="tab ' + (state.tab === t.id ? "active" : "") + '" data-tab="' + t.id + '">' +
          icon(t.icon) + " " + esc(t.label) +
        "</button>";
    }
    out += "</div>";
    return out;
  }

  function overviewHTML(d) {
    var manufacturer = (d && d.battery && d.battery.manufacturer) ? d.battery.manufacturer : "Veri mevcut değil";
    var model = (d && d.battery && d.battery.model) ? d.battery.model : "—";
    var chemistry = (d && d.battery && d.battery.chemistry && d.battery.chemistry.label) ? d.battery.chemistry.label : "—";
    var year = (d && d.battery && d.battery.manufacturing && d.battery.manufacturing.year) ? d.battery.manufacturing.year : "—";
    var country = (d && d.battery && d.battery.manufacturing && d.battery.manufacturing.country) ? d.battery.manufacturing.country : "—";
    var capacity = (d && d.battery && d.battery.capacity) ? d.battery.capacity : "—";

    return (
      "<h2>Genel Bilgiler</h2>" +
      '<div class="row">' +
        '<div class="box">' +
          '<div class="kv"><div class="k">Üretici</div><div class="v">' + esc(manufacturer) + "</div></div>" +
          '<div class="kv green"><div class="k">Model</div><div class="v">' + esc(model) + "</div></div>" +
          '<div class="kv purple"><div class="k">Kimya</div><div class="v">' + esc(chemistry) + "</div></div>" +
          '<div class="kv amber"><div class="k">Üretim</div><div class="v">' + esc(year) + " • " + esc(country) + "</div></div>" +
          '<div class="kv" style="border-left-color:#ec4899;"><div class="k">Nominal Kapasite</div><div class="v">' + esc(capacity) + "</div></div>" +
        "</div>" +

        '<div class="box" style="background:linear-gradient(135deg,#ecfdf5,#eff6ff); border-color:#dbeafe;">' +
          '<div style="font-weight:1000; display:flex; gap:8px; align-items:center;">' +
            icon("check-circle") + " Uyumluluk Durumu" +
          "</div>" +
          '<div class="muted" style="margin-top:8px;">Bu sayfa tez kapsamında hazırlanmış bir <b>demo</b> arayüzüdür.</div>' +
          '<div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">' +
            '<span class="pill green">' + icon("check-circle") + " Uyumlu (Demo)</span>" +
            '<span class="pill blue">' + icon("shield") + " Düzenleyici çerçeve</span>" +
          "</div>" +
          '<div class="small" style="margin-top:12px;">JSON dosyası: <a href="./passport.json" target="_blank" rel="noopener">passport.json</a></div>' +
        "</div>" +
      "</div>"
    );
  }

  function carbonHTML(d) {
    var cf = (d && d.carbonFootprint) ? d.carbonFootprint : null;
    if (!cf) return "<h2>Karbon Ayak İzi</h2><div class='muted'>Veri mevcut değil</div>";

    var total = (cf.total !== undefined && cf.total !== null) ? cf.total : "—";
    var unit = cf.unit || "kgCO₂e/kWh";
    var ref = cf.reference || "—";
    var stages = cf.stages || {};

    function stageRow(label, val) {
      var pct = 0;
      var t = Number(total);
      var v = Number(val);
      if (t > 0 && v >= 0) pct = (v / t) * 100;

      return (
        '<div style="margin-bottom:12px;">' +
          '<div style="display:flex; justify-content:space-between; gap:10px;">' +
            "<div style='font-weight:900;'>" + esc(label) + "</div>" +
            "<div style='font-weight:900;'>" + esc(val) + " " + esc(unit) + " (" + pct.toFixed(1) + "%)</div>" +
          "</div>" +
          '<div class="barwrap"><div class="bar" style="width:' + pct + '%;"></div></div>' +
        "</div>"
      );
    }

    return (
      "<h2>Karbon Ayak İzi</h2>" +
      '<div class="box" style="background:#eff6ff; border-color:#bfdbfe;">' +
        '<div style="display:flex; justify-content:space-between; gap:14px; align-items:flex-start;">' +
          '<div><div class="pill blue">' + icon("alert-circle") + " Özet</div>" +
          '<div class="muted" style="margin-top:8px;">' + esc(cf.note || "") + "</div></div>" +
          "<div style='text-align:right;'>" +
            "<div style='font-size:30px; font-weight:1000; color:#16a34a;'>" + esc(total) + " " + esc(unit) + "</div>" +
            "<div class='small'>Kaynak: " + esc(ref) + "</div>" +
          "</div>" +
        "</div>" +
      "</div>" +

      '<div class="box" style="margin-top:14px;">' +
        "<div style='font-weight:1000; margin-bottom:10px;'>Dağılım (Demo)</div>" +
        stageRow("Hammadde Çıkarımı", stages.rawMaterial || 0) +
        stageRow("Üretim", stages.manufacturing || 0) +
        stageRow("Taşıma", stages.transport || 0) +
        stageRow("Ömür Sonu", stages.endOfLife || 0) +
      "</div>"
    );
  }

  function materialsHTML(d) {
    var mats = (d && d.materials) ? d.materials : [];
    var out =
      "<h2>Malzeme Kompozisyonu</h2>" +
      '<div class="box" style="background:#fffbeb; border-color:#fde68a;">' +
        '<div class="pill amber">' + icon("alert-circle") + " Not</div>" +
        '<div class="muted" style="margin-top:8px;">Yüzdeler NMC 811 için tipik demo dağılımdır.</div>' +
      "</div>" +
      '<div class="box" style="margin-top:14px;">';

    if (!mats.length) {
      out += "<div class='muted'>Veri mevcut değil</div>";
    } else {
      for (var i = 0; i < mats.length; i++) {
        var m = mats[i];
        var pct = Number(m.percentage) || 0;
        out +=
          '<div class="box" style="margin:0 0 10px; border-radius:14px;">' +
            '<div class="mat">' +
              '<div class="matL">' +
                '<div class="badgePct">' + esc(m.percentage) + "%</div>" +
                "<div>" +
                  "<div style='font-weight:1000;'>" + esc(m.name) + "</div>" +
                  "<div class='small'>Kaynak: " + esc(m.source || "Veri mevcut değil") + "</div>" +
                  "<div class='small'>Geri dönüştürülmüş içerik: " + esc(m.recycledContent || "Veri mevcut değil") + "</div>" +
                "</div>" +
              "</div>" +
              (m.recyclable
                ? '<span class="pill green">' + icon("recycle") + " Geri dönüştürülebilir</span>"
                : '<span class="pill">' + icon("alert-circle") + " Sınırlı</span>"
              ) +
            "</div>" +
            '<div class="barwrap" style="margin-top:10px;">' +
              '<div class="bar" style="width:' + pct + '%; background:linear-gradient(90deg,#60a5fa,#a855f7);"></div>' +
            "</div>" +
          "</div>";
      }
    }

    out += "</div>";
    return out;
  }

  function performanceHTML(d) {
    var p = (d && d.performance) ? d.performance : {};
    function val(k) {
      return (p && p[k]) ? p[k] : "Veri mevcut değil";
    }

    return (
      "<h2>Performans</h2>" +
      '<div class="row">' +
        '<div class="box">' +
          '<div style="display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:12px;">' +
            boxMini("Enerji Yoğunluğu", val("energyDensity")) +
            boxMini("Güç Yoğunluğu", val("powerDensity")) +
            boxMini("Çevrim Ömrü", val("cycleLife")) +
            boxMini("Şarj Süresi", val("chargingTime")) +
            boxMini("Çalışma Sıcaklığı", val("operatingTemp")) +
            boxMini("SoH", val("stateOfHealth")) +
          "</div>" +
        "</div>" +
        '<div class="box" style="background:#ecfdf5; border-color:#bbf7d0;">' +
          "<div style='font-weight:1000; margin-bottom:10px;'>Testler (Demo)</div>" +
          "<div class='small' style='line-height:1.8;'>✓ UN 38.3<br/>✓ IEC 62133<br/>✓ Thermal Runaway (Demo)</div>" +
        "</div>" +
      "</div>"
    );

    function boxMini(title, value) {
      return (
        '<div class="box" style="margin:0; background:linear-gradient(135deg,#f8fafc,#eff6ff);">' +
          '<div class="small">' + esc(title) + "</div>" +
          "<div style='font-size:18px; font-weight:1000; margin-top:6px;'>" + esc(value) + "</div>" +
        "</div>"
      );
    }
  }

  function circularityHTML(d) {
    var c = (d && d.circularity) ? d.circularity : {};
    function v(k) { return (c && c[k]) ? c[k] : "Veri mevcut değil"; }

    return (
      "<h2>Döngüsellik</h2>" +
      '<div class="row">' +
        '<div class="box">' +
          '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">' +
            cirCard("Onarılabilirlik", v("repairability"), false) +
            cirCard("Geri Dönüşüm", v("recyclability"), true) +
            cirCard("Geri Dönüştürülmüş İçerik", v("recycledContent"), false) +
            cirCard("İkinci Ömür", v("secondLife"), false) +
          "</div>" +
        "</div>" +
        '<div class="box" style="background:#eff6ff; border-color:#bfdbfe;">' +
          "<div style='font-weight:1000; display:flex; gap:8px; align-items:center;'>" +
            icon("file-text") + " Dokümanlar (Demo)" +
          "</div>" +
          '<div style="margin-top:12px; display:flex; flex-direction:column; gap:10px;">' +
            '<div class="pill green">' + icon("check-circle") + " Söküm Talimatları</div>" +
            '<div class="pill green">' + icon("check-circle") + " SDS</div>" +
          "</div>" +
        "</div>" +
      "</div>"
    );

    function cirCard(title, value, ok) {
      return (
        '<div class="box" style="border-width:2px; border-color:' + (ok ? "#bbf7d0" : "#fde68a") + '; background:' + (ok ? "#ecfdf5" : "#fffbeb") + ';">' +
          "<div style='display:flex; justify-content:space-between; align-items:center; gap:10px; font-weight:1000;'>" +
            "<div>" + esc(title) + "</div>" +
            (ok ? icon("check-circle") : icon("alert-circle")) +
          "</div>" +
          "<div style='margin-top:10px; font-weight:900;'>" + esc(value) + "</div>" +
        "</div>"
      );
    }
  }

  function complianceHTML(d) {
    // İstenen sade uyumluluk: alt madde yok, sadece “Uyumlu (Demo)”
    var regs = (d && d.compliance && d.compliance.regulations) ? d.compliance.regulations : [
      { title: "EU Battery Regulation", subtitle: "2023/1542", icon: "shield", color: "#22c55e" },
      { title: "ESPR", subtitle: "Ecodesign (DPP yaklaşımı)", icon: "leaf", color: "#3b82f6" }
    ];

    function regCard(r) {
      return (
        '<div class="box" style="border:1px solid #bbf7d0; background:#ecfdf5;">' +
          "<div style='display:flex; gap:10px; align-items:center; font-weight:1000;'>" +
            "<div style='background:" + esc(r.color || "#22c55e") + "; width:38px; height:38px; border-radius:12px; display:flex; align-items:center; justify-content:center; color:white;'>" +
              '<i data-lucide="' + esc(r.icon || "shield") + '"></i>' +
            "</div>" +
            "<div>" +
              "<div style='font-weight:1000;'>" + esc(r.title || "—") + "</div>" +
              "<div class='small'>" + esc(r.subtitle || "") + "</div>" +
            "</div>" +
          "</div>" +
          "<div style='margin-top:12px;'>" +
            '<span class="pill green">' + icon("check-circle") + " Uyumlu (Demo)</span>" +
          "</div>" +
          "<div class='small' style='margin-top:10px;'>Detaylar tez/prototip kapsamı gereği özetlenmiştir.</div>" +
        "</div>"
      );
    }

    var left = regs[0] ? regCard(regs[0]) : "";
    var right = regs[1] ? regCard(regs[1]) : "";

    return (
      "<h2>Uyumluluk</h2>" +
      '<div class="row">' +
        '<div class="box">' + left + "</div>" +
        '<div class="box">' + right + "</div>" +
      "</div>"
    );
  }

  function contentHTML(d) {
    if (state.tab === "overview") return overviewHTML(d);
    if (state.tab === "carbon") return carbonHTML(d);
    if (state.tab === "materials") return materialsHTML(d);
    if (state.tab === "performance") return performanceHTML(d);
    if (state.tab === "circularity") return circularityHTML(d);
    if (state.tab === "compliance") return complianceHTML(d);
    return "<div class='muted'>Sekme bulunamadı</div>";
  }

  function render() {
    // Her zaman bir şey bas (beyaz kalmasın)
    if (!state.data && !state.error) {
      app.innerHTML =
        '<div class="card" style="padding:18px;">' +
          '<div class="pill blue">' + icon("loader") + " Yükleniyor...</div>" +
          '<div class="small" style="margin-top:10px;">passport.json okunuyor.</div>' +
        "</div>";
      createIconsSafe();
      return;
    }

    if (state.error) {
      app.innerHTML =
        '<div class="card" style="padding:18px;">' +
          '<div class="pill amber">' + icon("alert-circle") + " Hata</div>" +
          "<div style='margin-top:10px; font-weight:1000;'>" + esc(state.error) + "</div>" +
          "<div class='small' style='margin-top:8px;'>Kontrol: docs/passport.json var mı ve adı doğru mu?</div>" +
        "</div>";
      createIconsSafe();
      return;
    }

    var d = state.data;

    app.innerHTML =
      headerHTML(d) +
      tabsHTML() +
      '<div class="card content">' +
        contentHTML(d) +
      "</div>" +
      '<div class="footer">' +
        "<div>Tez prototipi • JSON: <a href='./passport.json' target='_blank' rel='noopener'>passport.json</a></div>" +
      "</div>";

    createIconsSafe();
  }

  function loadJSON() {
    state.error = null;
    fetch("./passport.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("passport.json okunamadı (HTTP " + res.status + ")");
        return res.json();
      })
      .then(function (json) {
        state.data = json;
        render();
      })
      .catch(function (err) {
        state.error = (err && err.message) ? err.message : "Bilinmeyen hata";
        render();
      });
  }

  // Click events
  document.addEventListener("click", function (e) {
    var tabBtn = e.target.closest ? e.target.closest("[data-tab]") : null;
    if (tabBtn) {
      state.tab = tabBtn.getAttribute("data-tab");
      render();
      return;
    }

    var actBtn = e.target.closest ? e.target.closest("[data-action]") : null;
    if (actBtn) {
      var act = actBtn.getAttribute("data-action");
      if (act === "toggleQR") {
        state.showQR = !state.showQR;
        render();
      }
    }
  });

  // Start
  render();
  loadJSON();
})();
