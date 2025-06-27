<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Detail Quote Widget</title>
  <style>
    /* Widget Styles */
    #detail-quote-widget { font-family: Arial, sans-serif; }
    #detail-quote-widget .container {
      width:100%; max-width:1280px; margin:0 auto;
      background:#fff; border-radius:18px; padding:28px;
      box-shadow:0 6px 18px rgba(0,0,0,.08);
    }
    #detail-quote-widget .step { display:none; }
    #detail-quote-widget .step.active { display:block; }
    #detail-quote-widget .vehicle-grid {
      display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
      gap:20px; width:100%;
    }
    #detail-quote-widget .vehicle-btn {
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      padding:20px; border:2px solid #ddd; border-radius:14px; cursor:pointer;
      transition:.2s; background:#f3eefc;
    }
    #detail-quote-widget .vehicle-btn:hover,
    #detail-quote-widget .vehicle-btn.selected {
      border-color:var(--brand-primary); background:#e3d5f6;
    }
    #detail-quote-widget .vehicle-btn span { font-size:40px; margin-bottom:8px; }
    #detail-quote-widget h1 { text-align:center; margin-bottom:24px; color:var(--brand-dark); font-size:2.2rem; font-weight:700; }
    #detail-quote-widget h2 { font-size:2rem; font-weight:bold; text-align:center; margin:24px 0 12px; color:var(--brand-primary); }
    #detail-quote-widget .package-box { background:#f3eefc; padding:18px; border-radius:14px; margin-bottom:24px; }
    #detail-quote-widget .addons { margin-top:20px; }
    #detail-quote-widget .addon-group { margin-bottom:20px; }
    #detail-quote-widget .addon-group h4 {
      margin-bottom:10px; color:var(--brand-dark); border-bottom:1px solid #ccc; padding-bottom:5px;
    }
    #detail-quote-widget .addon {
      display:flex; align-items:center; justify-content:space-between;
      background:#f5f5f5; border-radius:10px; padding:12px 16px; margin-bottom:8px;
    }
    #detail-quote-widget .addon-name { flex:1; padding-right:10px; }
    #detail-quote-widget .addon-price { width:90px; text-align:right; margin-right:10px; }
    #detail-quote-widget .addon input { order:3; transform:scale(1.3); }
    #detail-quote-widget .total { font-weight:bold; font-size:1.2rem; text-align:center; margin-top:28px; }
    #detail-quote-widget .btn {
      display:block; width:100%; border:none; border-radius:10px; padding:14px;
      font-size:1rem; cursor:pointer;
    }
    #detail-quote-widget .btn-primary { background:var(--brand-primary); color:#fff; margin-top:20px; }
    #detail-quote-widget .notes { background:#fff5e6; margin-top:28px; padding:16px; border-radius:12px; }
    #detail-quote-widget .reset-btn { font-size:.9rem; color:#555; text-decoration:underline; margin-top:12px; display:block; text-align:center; }
    .hidden { display:none; }
  </style>
</head>
<body>
  <div id="detail-quote-widget">
    <div class="container">
      <!-- STEP 1 -->
      <div id="step1" class="step active">
        <h1>Get An Instant Quote<br>Book Online In Just A Few Steps</h1>
        <h2>1️⃣ Select Your Vehicle Type</h2>
        <div class="vehicle-grid">
          <div class="vehicle-btn" data-type="Car"><span>🚗</span>Car</div>
          <div class="vehicle-btn" data-type="SUV"><span>🚙</span>SUV</div>
          <div class="vehicle-btn" data-type="Truck"><span>🚚</span>Truck</div>
          <div class="vehicle-btn" data-type="Motorcycle"><span>🏍️</span>Motorcycle</div>
          <div class="vehicle-btn" data-type="RV"><span>🚌</span>RV</div>
        </div>
      </div>
      <!-- STEP 2 -->
      <div id="step2" class="step">
        <h2>2️⃣ Customize Your Package</h2>
        <div id="rvLengthBox" class="hidden">
          <label for="rvLengthInput">Enter RV Length (in feet):</label>
          <input type="number" id="rvLengthInput" min="10" max="60" placeholder="e.g., 30">
        </div>
        <div id="packageBox" class="package-box"></div>
        <div class="notes">
          <p><strong>⚠️ Additional Charges:</strong> In rare cases, vehicles requiring extra time or cleanup may incur a fee of $25–$50. We'll always let you know before starting.</p>
        </div>
        <form id="addonsForm">
          <div class="addons" id="addonList"></div>
          <div class="exclude-options">
            <label><input type="radio" name="excludeSection" value="none" checked> Full Detail (Recommended)</label>
            <label><input type="radio" name="excludeSection" value="interior"> Exterior Only (-$50)</label>
            <label><input type="radio" name="excludeSection" value="exterior"> Interior Only (-$50)</label>
          </div>
        </form>
        <div class="total">Total: $<span id="totalPrice">0</span></div>
        <button id="nextBtn" class="btn btn-primary">Next: Book Now</button>
        <a href="#" class="reset-btn">Start Over</a>
      </div>
      <!-- STEP 3 -->
      <div id="step3" class="step">
        <h2>🗓 Book Your Appointment</h2>
        <iframe src="https://api.leadconnectorhq.com/widget/booking/8r2Df2ibe74EycJbAHYu" style="width:100%;border:none;overflow:hidden;min-height:800px" scrolling="no"></iframe>
        <a href="#" class="reset-btn">Start Over</a>
      </div>
    </div>
  </div>
  ```js
// detail-quote.js
(function() {
  // 1️⃣ Ensure widget container exists (in GHL popup)
  const root = document.getElementById('detail-quote-widget') || (() => {
    const el = document.createElement('div');
    el.id = 'detail-quote-widget';
    document.body.appendChild(el);
    return el;
  })();

  // 2️⃣ Data definitions
  const basePackages = {
    Car: {
      price: 149,
      desc: `<h3>🚗 Full Detail for Cars – $149</h3>
        <ul>
          <li><strong>Auto Basic Exterior:</strong> Tires and wheels hand washed. Outside glass cleaned. Towel dried.</li>
          <li><strong>Auto Basic Interior:</strong> Carpet, seats, and cupholders vacuumed. Dash & console wiped. Interior protectant & conditioner applied. Interior glass cleaned.</li>
          <li><strong>Auto Interior Detail:</strong> Floor mats removed. Vacuumed interior surfaces. Sanitized dash and steering wheel.</li>
          <li><strong>Auto Exterior Detail:</strong> Tires and wheel wells hand washed. Exterior waxed. Door jams cleaned. Tires dressed.</li>
        </ul>`
    },
    SUV: { price: 169, desc: basePackages?.Car.desc },
    Truck: { price: 189, desc: basePackages?.Car.desc },
    Motorcycle: {
      price: 120,
      desc: `<h3>🏍️ Full Detail for Motorcycles – $120</h3>
        <ul>
          <li><strong>Exterior Cleaning:</strong> Thorough hand wash and dry of all bodywork.</li>
          <li><strong>Engine Degrease:</strong> Cleaning and degreasing of engine components.</li>
          <li><strong>Lubrication:</strong> Lube of all necessary moving parts.</li>
          <li><strong>Chrome Polish:</strong> Basic polishing of chrome surfaces.</li>
        </ul>`
    },
    RV: {
      price: 0, // per foot calculation
      desc: `<h3>🚌 RV Detailing – $10 per foot</h3>
        <ul>
          <li><strong>Exterior Wash:</strong> Hand wash & dry of entire RV.</li>
          <li><strong>Interior Vacuum:</strong> Full vacuum of living & driver areas.</li>
          <li><strong>Surface Clean:</strong> Wipe & condition all surfaces.</li>
          <li><strong>Finish Coat:</strong> Protective wax or sealant.</li>
        </ul>`
    }
  };

  const addonGroupsByVehicle = {
    Car: [
      { title: "🧽 Exterior Add-Ons", items: [
          { name: "6 Month Ceramic Wax", price: 75 },
          { name: "Clay Bar Treatment", price: 25 },
          { name: "Engine Bay Detail", price: 49 },
          { name: "Headlight Restoration", price: 49 }
      ]},
      { title: "🪑 Interior Add-Ons", items: [
          { name: "Shampoo Seats (Per Row)", price: 40 },
          { name: "Shampoo Floors (Per Row)", price: 40 },
          { name: "Steam (Kills 99% Bacteria)", price: 49 }
      ]},
      { title: "🧼 Other Extras", items: [
          { name: "Pet Hair Removal", price: 40 },
          { name: "Paint Transfer Removal", price: 75 },
          { name: "Mold Removal", price: 69 }
      ]}
    ],
    SUV: [], // clone Car groups
    Truck: [],
    Motorcycle: [
      { title: "🚌 Bike Add-Ons", items: [
          { name: "Chrome Buffing", price: 20 },
          { name: "Paint Sealant", price: 25 },
          { name: "Leather/Vinyl Conditioner", price: 20 }
      ]}
    ],
    RV: [
      { title: "🧽 Exterior RV Add-Ons", items: [
          { name: "Roof Cleaning & Coating", price: 200 },
          { name: "Awning Wash & Treatment", price: 60 }
      ]},
      { title: "🛋️ Interior RV Add-Ons", items: [
          { name: "Upholstery & Fabric Shampoo", price: 50 },
          { name: "Odor Treatment & Deodorizer", price: 70 }
      ]}
    ]
  };
  // clone Car addons into SUV and Truck
  addonGroupsByVehicle.SUV = JSON.parse(JSON.stringify(addonGroupsByVehicle.Car));
  addonGroupsByVehicle.Truck = JSON.parse(JSON.stringify(addonGroupsByVehicle.Car));

  // 3️⃣ Render initial structure
  root.innerHTML = `
    <div class="container">
      <div id="step1" class="step active">
        <h1>Get An Instant Quote<br>Book Online In Just A Few Steps</h1>
        <h2>1️⃣ Select Your Vehicle Type</h2>
        <div class="vehicle-grid"></div>
      </div>
      <div id="step2" class="step">
        <h2>2️⃣ Customize Your Package</h2>
        <div id="rvLengthBox" class="hidden">
          <label for="rvLengthInput">Enter RV Length (in feet):</label>
          <input type="number" id="rvLengthInput" min="10" max="60" placeholder="e.g., 30">
        </div>
        <div id="packageBox" class="package-box"></div>
        <div class="notes">
          <p><strong>⚠️ Additional Charges:</strong> Extra cleanup may incur $25–$50.</p>
        </div>
        <form id="addonsForm">
          <div class="addons" id="addonList"></div>
          <div class="exclude-options">
            <label><input type="radio" name="excludeSection" value="none" checked> Full Detail</label>
            <label><input type="radio" name="excludeSection" value="interior"> Exterior Only (-$50)</label>
            <label><input type="radio" name="excludeSection" value="exterior"> Interior Only (-$50)</label>
          </div>
        </form>
        <div class="total">Total: $<span id="totalPrice">0</span></div>
        <button id="nextBtn" class="btn btn-primary">Next: Book Now</button>
        <a href="#" class="reset-btn">Start Over</a>
      </div>
      <div id="step3" class="step">
        <h2>🗓 Book Your Appointment</h2>
        <iframe src="https://api.leadconnectorhq.com/widget/booking/8r2Df2ibe74EycJbAHYu" style="width:100%;border:none;min-height:800px" scrolling="no"></iframe>
        <a href="#" class="reset-btn">Start Over</a>
      </div>
    </div>
  `;

  // 4️⃣ Setup variables
  let selectedVehicle = null;
  const vehicleGrid = root.querySelector('.vehicle-grid');
  const step1 = root.querySelector('#step1');
  const step2 = root.querySelector('#step2');
  const step3 = root.querySelector('#step3');
  const packageBox = root.querySelector('#packageBox');
  const rvLengthBox = root.querySelector('#rvLengthBox');
  const rvLengthInput = root.querySelector('#rvLengthInput');
  const addonList = root.querySelector('#addonList');
  const totalPriceEl = root.querySelector('#totalPrice');
  const nextBtn = root.querySelector('#nextBtn');

  // 5️⃣ Generate vehicle buttons
  const icons = { Car: '🚗', SUV: '🚙', Truck: '🚚', Motorcycle: '🏍️', RV: '🚌' };
  Object.keys(basePackages).forEach(type => {
    const btn = document.createElement('div');
    btn.className = 'vehicle-btn';
    btn.dataset.type = type;
    btn.innerHTML = `<span>${icons[type]}</span>${type}`;
    vehicleGrid.appendChild(btn);
  });

  // 6️⃣ Functions
  function renderAddons(type) {
    addonList.innerHTML = '';
    (addonGroupsByVehicle[type] || []).forEach(group => {
      const g = document.createElement('div'); g.className = 'addon-group';
      g.innerHTML = `<h4>${group.title}</h4>`;
      group.items.forEach(item => {
        const a = document.createElement('div'); a.className = 'addon';
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

  function calculateTotal() {
    if (!selectedVehicle) return;
    let base = selectedVehicle === 'RV'
      ? (parseInt(rvLengthInput.value || 0) * 10)
      : basePackages[selectedVehicle].price;
    const excl = root.querySelector('input[name="excludeSection"]:checked');
    if (excl && excl.value !== 'none') base -= 50;
    addonList.querySelectorAll('input:checked').forEach(cb => {
      base += parseInt(cb.dataset.price, 10);
    });
    totalPriceEl.textContent = base;
  }

  // 7️⃣ Event listeners
  root.querySelectorAll('.vehicle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedVehicle = btn.dataset.type;
      step1.classList.remove('active');
      step2.classList.add('active');
      step3.classList.remove('active');
      root.querySelectorAll('.vehicle-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      packageBox.innerHTML = basePackages[selectedVehicle].desc;
      renderAddons(selectedVehicle);
      rvLengthBox.classList.toggle('hidden', selectedVehicle !== 'RV');
      calculateTotal();
    });
  });

  addonList.addEventListener('change', calculateTotal);
  rvLengthInput.addEventListener('input', calculateTotal);
  root.querySelectorAll('input[name="excludeSection"]').forEach(r => r.addEventListener('change', calculateTotal));

  nextBtn.addEventListener('click', () => {
    const vehicleType = selectedVehicle;
    const packageDescription = basePackages[vehicleType].desc;
    const addons = Array.from(addonList.querySelectorAll('input:checked')).map(cb => ({
      name: cb.closest('.addon').querySelector('.addon-name').textContent,
      price: parseInt(cb.dataset.price, 10)
    }));
    const totalPrice = parseInt(totalPriceEl.textContent, 10);

    fetch('https://services.leadconnectorhq.com/hooks/weToQt7uGofAXq2d0uTh/webhook-trigger/5a308e72-7e90-4941-86cd-b4de78e08e6e', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicleType, packageDescription, addons, totalPrice })
    }).catch(err => console.error('Webhook error:', err));

    step2.classList.remove('active');
    step3.classList.add('active');
  });

  function resetWidget() {
    selectedVehicle = null;
    root.querySelectorAll('.vehicle-btn').forEach(b => b.classList.remove('selected'));
    packageBox.innerHTML = '';
    addonList.innerHTML = '';
    rvLengthInput.value = '';
    totalPriceEl.textContent = '0';
    step1.classList.add('active');
    step2.classList.remove('active');
    step3.classList.remove('active');
    root.scrollIntoView({ behavior: 'smooth' });
  }

  root.querySelectorAll('.reset-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); resetWidget(); });
  });

})();
```
    document.addEventListener('DOMContentLoaded', () => {
      // full JS from your widget goes here (basePackages, addon logic, event listeners, etc.)
      // ...
    });
  </script>
</body>
</html>

