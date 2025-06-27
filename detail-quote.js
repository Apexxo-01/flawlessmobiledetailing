// detail-quote.js
document.addEventListener('DOMContentLoaded', () => {
  // 1️⃣ Ensure widget container exists
  const root = document.getElementById('detail-quote-widget') || (() => {
    const el = document.createElement('div');
    el.id = 'detail-quote-widget';
    document.body.appendChild(el);
    return el;
  })();

  // 2️⃣ Define data
  const basePackages = {
    Car: {
      price: 149,
      desc: `<h3>🚗 Full Detail for Cars – $149</h3>
        <ul>
          <li><strong>Auto Basic Exterior:</strong> Tires and wheels hand washed. Outside glass cleaned. Towel dried.</li>
          <li><strong>Auto Basic Interior:</strong> Carpet, seats, and cupholders vacuumed. Dash & console wiped down. Interior protectant & conditioner applied. Interior glass cleaned.</li>
          <li><strong>Auto Interior Detail:</strong> Floor mats removed. Vacuumed carpet/seats/console/vents/door panels/cupholders. Sanitized dash, radio, steering wheel.</li>
          <li><strong>Auto Exterior Detail:</strong> Tires and wheel wells hand washed. Exterior waxed. Door jams cleaned. Tires dressed.</li>
        </ul>`
    },
    SUV: {
      price: 169,
      desc: `<h3>🚙 Full Detail for SUVs – $169</h3>
        <ul>
          <li><strong>Auto Basic Exterior:</strong> Tires and wheels hand washed. Outside glass cleaned. Towel dried.</li>
          <li><strong>Auto Basic Interior:</strong> Carpet, seats, and cupholders vacuumed. Dash & console wiped down. Interior protectant & conditioner applied. Interior glass cleaned.</li>
          <li><strong>Auto Interior Detail:</strong> Floor mats removed. Vacuumed all interiors. Sanitized all touchpoints.</li>
          <li><strong>Auto Exterior Detail:</strong> Tires and wheel wells hand washed. Exterior waxed. Door jams cleaned. Tires dressed.</li>
        </ul>`
    },
    Truck: {
      price: 189,
      desc: `<h3>🚚 Full Detail for Trucks – $189</h3>
        <ul>
          <li><strong>Auto Basic Exterior:</strong> Tires and wheels hand washed. Outside glass cleaned. Towel dried.</li>
          <li><strong>Auto Basic Interior:</strong> Carpets & seats vacuumed. Dash & console wiped. Interior protectant applied.</li>
          <li><strong>Auto Interior Detail:</strong> Deep vacuum & sanitize of all interior surfaces.</li>
          <li><strong>Auto Exterior Detail:</strong> Full wash, wax, door jam cleaning, tire dressing.</li>
        </ul>`
    },
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
      price: 0, // calculated per foot
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
          { name: "Steam (Kills 99% Bacteria)", price: 49 }
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
    SUV: [ /* same as Car */ ],
    Truck: [ /* same as Car */ ],
    Motorcycle: [
      {
        title: "🚌 Bike Add-Ons",
        items: [
          { name: "Chrome Buffing", price: 20 },
          { name: "Paint Sealant", price: 25 },
          { name: "Leather/Vinyl Conditioner", price: 20 }
        ]
      }
    ],
    RV: [
      {
        title: "🧽 Exterior RV Add-Ons",
        items: [
          { name: "Roof Cleaning & Coating", price: 200 },
          { name: "Awning Wash & Treatment", price: 60 }
        ]
      },
      {
        title: "🛋️ Interior RV Add-Ons",
        items: [
          { name: "Upholstery & Fabric Shampoo", price: 50 },
          { name: "Odor Treatment & Deodorizer", price: 70 }
        ]
      }
    ]
  };

  // 3️⃣ Render widget shell
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
        <iframe src="https://api.leadconnectorhq.com/widget/booking/8r2Df2ibe74EycJbAHYu"
                style="width:100%;border:none;min-height:800px" scrolling="no"></iframe>
        <a href="#" class="reset-btn">Start Over</a>
      </div>
    </div>
  `;

  // 4️⃣ Wire up interactions
  let selectedVehicle = null;
  const vehicleGrid = root.querySelector('.vehicle-grid');
  Object.keys(basePackages).forEach(type => {
    const btn = document.createElement('div');
    btn.className = 'vehicle-btn';
    btn.dataset.type = type;
    btn.innerHTML = `<span>${{
      Car:'🚗', SUV:'🚙', Truck:'🚚', Motorcycle:'🏍️', RV:'🚌'
    }[type]}</span>${type}`;
    vehicleGrid.appendChild(btn);
  });

  const step1 = root.querySelector('#step1');
  const step2 = root.querySelector('#step2');
  const step3 = root.querySelector('#step3');
  const packageBox = root.querySelector('#packageBox');
  const rvLengthBox = root.querySelector('#rvLengthBox');
  const rvLengthInput = root.querySelector('#rvLengthInput');
  const addonList = root.querySelector('#addonList');
  const totalPriceEl = root.querySelector('#totalPrice');
  const nextBtn = root.querySelector('#nextBtn');

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
  root.querySelectorAll('input[name="excludeSection"]')
      .forEach(r => r.addEventListener('change', calculateTotal));

  nextBtn.addEventListener('click', () => {
    const vehicleType = selectedVehicle;
    const packageDescription = basePackages[vehicleType].desc;
    const addons = Array.from(addonList.querySelectorAll('input:checked')).map(cb => ({
      name: cb.closest('.addon').querySelector('.addon-name').textContent,
      price: parseInt(cb.dataset.price, 10)
    }));
    const totalPrice = parseInt(totalPriceEl.textContent, 10);

    fetch('https://services.leadconnectorhq.com/hooks/weToQt7uGofAXq2d0uTh/webhook-trigger/5a308e72-7e90-4941-86cd-b4de78e08e6e', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    btn.addEventListener('click', e => {
      e.preventDefault();
      resetWidget();
    });
  });
});
