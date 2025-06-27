// detail-quote.js
(function(){
  // ── 1) Grab or create the widget root ──────────────────────────────────────
  let root = document.getElementById('detail-quote-widget');
  if (!root) {
    root = document.createElement('div');
    root.id = 'detail-quote-widget';
    document.body.appendChild(root);
  }

  // ── 2) Data definitions ───────────────────────────────────────────────────
  const basePackages = {
    Car: {
      price: 149,
      desc: `<h3>🚗 Full Detail for Cars – $149</h3>
<ul>
  <li><strong>Auto Basic Exterior:</strong> Tires and wheels hand washed. Outside glass cleaned. Towel dried.</li>
  <li><strong>Auto Basic Interior:</strong> Carpet, seats, and cupholders vacuumed. Dash, console and doors wiped. Interior protectant & conditioner applied. Interior glass cleaned.</li>
  <li><strong>Auto Interior Detail:</strong> Floor mats removed. Vacuumed carpet/seats/console/vents/door panels/cupholders. Dash, radio, steering wheel sanitized.</li>
  <li><strong>Auto Exterior Detail:</strong> Tires and wheel wells hand washed. Exterior waxed. Door jams cleaned. Tires dressed.</li>
</ul>`
    },
    SUV: { price: 169, desc: null },
    Truck: { price: 189, desc: null },
    Motorcycle: {
      price: 120,
      desc: `<h3>🏍️ Full Detail for Motorcycles – $120</h3>
<ul>
  <li><strong>Exterior Cleaning:</strong> Thorough hand wash and dry of all bodywork.</li>
  <li><strong>Engine Degrease:</strong> Cleaning and degreasing of engine components.</li>
  <li><strong>Lubrication:</strong> Lube of all moving parts.</li>
  <li><strong>Chrome Polish:</strong> Basic polishing of chrome surfaces.</li>
</ul>`
    },
    RV: {
      price: 0, // per foot
      desc: `<h3>🚌 RV Detailing – $10 per foot</h3>
<ul>
  <li><strong>Exterior Wash:</strong> Hand wash & dry of entire RV.</li>
  <li><strong>Interior Vacuum:</strong> Full vacuum of living & driver areas.</li>
  <li><strong>Surface Clean:</strong> Wipe & condition all surfaces.</li>
  <li><strong>Finish Coat:</strong> Protective wax or sealant.</li>
</ul>`
    }
  };
  // copy Car description into SUV & Truck
  basePackages.SUV.desc   = basePackages.Car.desc;
  basePackages.Truck.desc = basePackages.Car.desc;

  const addonGroupsByVehicle = {
    Car: [
      {
        title: "🧽 Exterior Add-Ons",
        items: [
          { name: "6 Month Ceramic Wax", price: 75 },
          { name: "Clay Bar Treatment", price: 25 },
          { name: "Engine Bay Detail", price: 49 },
          { name: "Headlight Restoration", price: 49 }
        ]
      },
      {
        title: "🪑 Interior Add-Ons",
        items: [
          { name: "Shampoo Seats (Per Row)", price: 40 },
          { name: "Shampoo Floors (Per Row)", price: 40 },
          { name: "Steam (Kills 99% Bacteria)", price: 49 },
          { name: "Headliner Shampoo", price: 75 },
          { name: "Seat Belt Cleaning", price: 30 }
        ]
      },
      {
        title: "🧼 Other Extras",
        items: [
          { name: "Pet Hair Removal", price: 40 },
          { name: "Paint Transfer Removal", price: 75 },
          { name: "Mold Removal", price: 69 }
        ]
      }
    ],
    SUV: [], Truck: [], // will clone Car below
    Motorcycle: [
      {
        title: "🛵 Motorcycle Add-Ons",
        items: [
          { name: "Chrome Buffing", price: 20 },
          { name: "Protective Sealant", price: 25 },
          { name: "Leather/Vinyl Conditioner", price: 20 }
        ]
      }
    ],
    RV: [
      {
        title: "🧽 Exterior RV Add-Ons",
        items: [
          { name: "Roof Cleaning & Coating", price: 200 },
          { name: "Awning Wash & Treatment", price: 60 },
          { name: "Undercarriage Rinse & Rust Inhibitor", price: 80 }
        ]
      },
      {
        title: "🛋️ Interior RV Add-Ons",
        items: [
          { name: "Upholstery & Fabric Shampoo", price: 50 },
          { name: "Odor Treatment & Deodorizer", price: 70 },
          { name: "Carpet & Floor Mat Steam Clean", price: 65 }
        ]
      }
    ]
  };
  // clone Car add-ons into SUV & Truck
  addonGroupsByVehicle.SUV   = JSON.parse(JSON.stringify(addonGroupsByVehicle.Car));
  addonGroupsByVehicle.Truck = JSON.parse(JSON.stringify(addonGroupsByVehicle.Car));

  // ── 3) Render the 3-step widget shell ─────────────────────────────────
  root.innerHTML = `
    <div class="container">
      <!-- STEP 1 -->
      <div id="step1" class="step active">
        <h1>Get An Instant Quote<br>Book Online In Just A Few Steps</h1>
        <h2>1️⃣ Select Your Vehicle Type</h2>
        <div class="vehicle-grid"></div>
      </div>
      <!-- STEP 2 -->
      <div id="step2" class="step">
        <h2>2️⃣ Customize Your Package</h2>
        <div id="packageBox" class="package-box"></div>
        <div class="notes">
          <strong>⚠️ Additional Charges:</strong> Vehicles needing extra cleanup may incur $25–$50.
        </div>
        <div id="addonList" class="addons"></div>
        <div class="total">Total: $<span id="totalPrice">0</span></div>
        <button id="nextBtn" class="btn btn-primary">Next: Book Now</button>
        <a href="#" class="reset-btn">Start Over</a>
      </div>
      <!-- STEP 3 -->
      <div id="step3" class="step">
        <h2>🗓 Book Your Appointment</h2>
        <iframe 
          src="https://api.leadconnectorhq.com/widget/booking/8r2Df2ibe74EycJbAHYu"
          style="width:100%;border:none;min-height:400px"
          scrolling="no"
        ></iframe>
        <a href="#" class="reset-btn">Start Over</a>
      </div>
    </div>
  `;

  // ── 4) Wire up interactions ───────────────────────────────────────────────
  let selectedVehicle = null;
  const icons = { Car:'🚗', SUV:'🚙', Truck:'🚚', Motorcycle:'🏍️', RV:'🚌' };
  const vehicleGrid  = root.querySelector('.vehicle-grid');
  const step1        = root.querySelector('#step1');
  const step2        = root.querySelector('#step2');
  const step3        = root.querySelector('#step3');
  const packageBox   = root.querySelector('#packageBox');
  const addonList    = root.querySelector('#addonList');
  const totalPriceEl = root.querySelector('#totalPrice');
  const nextBtn      = root.querySelector('#nextBtn');

  // a) generate vehicle buttons
  Object.keys(basePackages).forEach(type => {
    const btn = document.createElement('div');
    btn.className       = 'vehicle-btn';
    btn.dataset.type    = type;
    btn.innerHTML       = `<span>${icons[type]}</span>${type}`;
    vehicleGrid.appendChild(btn);
    btn.addEventListener('click', () => {
      selectedVehicle = type;
      step1.classList.remove('active');
      step2.classList.add('active');
      packageBox.innerHTML = basePackages[type].desc;
      renderAddons(type);
      calculateTotal();
    });
  });

  // b) renderAddons
  function renderAddons(type) {
    addonList.innerHTML = '';
    (addonGroupsByVehicle[type] || []).forEach(group => {
      const g = document.createElement('div');
      g.className = 'addon-group';
      g.innerHTML = `<h4>${group.title}</h4>`;
      group.items.forEach(item => {
        const a = document.createElement('div');
        a.className = 'addon';
        a.innerHTML = `
          <span class="addon-name">${item.name}</span>
          <span class="addon-price">$${item.price}</span>
          <input type="checkbox" data-price="${item.price}">
        `;
        g.appendChild(a);
      });
      addonList.appendChild(g);
    });
  }

  // c) calculateTotal
  function calculateTotal() {
    if (!selectedVehicle) return;
    let total = basePackages[selectedVehicle].price;
    addonList.querySelectorAll('input:checked').forEach(cb => {
      total += Number(cb.dataset.price);
    });
    totalPriceEl.textContent = total;
  }

  // d) listen for addon & recalc
  addonList.addEventListener('change', calculateTotal);

  // e) nextBtn → post data & show step3
  nextBtn.addEventListener('click', () => {
    // collect payload
    const addons = Array.from(addonList.querySelectorAll('input:checked')).map(cb => ({
      name: cb.closest('.addon').querySelector('.addon-name').textContent,
      price: Number(cb.dataset.price)
    }));
    const payload = {
      vehicleType: selectedVehicle,
      packageDescription: basePackages[selectedVehicle].desc,
      addons,
      totalPrice: Number(totalPriceEl.textContent)
    };
    // fire webhook
    fetch(
      'https://services.leadconnectorhq.com/hooks/weToQt7uGofAXq2d0uTh/webhook-trigger/5a308e72-7e90-4941-86cd-b4de78e08e6e',
      { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }
    ).catch(console.error);

    // show booking
    step2.classList.remove('active');
    step3.classList.add('active');
    sendHeight();
  });

  // f) reset widget
  root.querySelectorAll('.reset-btn').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      selectedVehicle = null;
      // reset steps
      step3.classList.remove('active');
      step2.classList.remove('active');
      step1.classList.add('active');
      // clear dynamic content
      packageBox.innerHTML = '';
      addonList.innerHTML  = '';
      totalPriceEl.textContent = '0';
      sendHeight();
    });
  });

  // ── 5) Auto-resize helper ────────────────────────────────────────────────
  function sendHeight() {
    parent.postMessage(
      { type:'dq-height', height: document.body.scrollHeight },
      '*'
    );
  }
  // initial resize
  sendHeight();
  // on any resize
  window.addEventListener('resize', sendHeight);

})();
