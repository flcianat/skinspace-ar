import { PRODUCTS } from './products.js';
import { getAllIngredients, getIngredientById } from './ingredients.js';


export function updateARDebug({
  status,
  product,
  markerId,
  modelStatus
} = {}) {
  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value ?? "—";
  };

  setText("ar-debug-status", status);
  setText("debug-product", product?.name);
  setText("debug-product-id", product?.id);
  setText("debug-marker", markerId);
  setText("debug-model-url", product?.modelUrl);
  setText("debug-model-status", modelStatus);

  const statusElement = document.getElementById("debug-model-status");

  if (statusElement) {
    const state =
      modelStatus === "LOADED" ? "success" :
      modelStatus === "ERROR" ? "error" :
      "pending";

    statusElement.dataset.state = state;
  }
}


export function createProduct3DModel(product = null, isSandbox = false) {
  const container = document.createElement('a-entity');
  const prodId = product?.id || 'serum';
  const modelType = product?.model || 'serum-dropper';
  const modelUrl = product?.modelUrl;


  container.setAttribute('id', `ar-product-model-${prodId}`);
  container.setAttribute('position', '0 0.5 0');
  container.setAttribute('visible', 'false');

  const orientationWrapper = document.createElement('a-entity');
  orientationWrapper.setAttribute(
    'id',
    `ar-bottle-orientation-${prodId}`
  );

  // GLB models use their own orientation.
  // Keep the old orientation only for procedural placeholders.
  orientationWrapper.setAttribute(
    'rotation',
    modelUrl ? '0 0 0' : (isSandbox ? '0 0 0' : '180 0 0')
  );

  const modelWrapper = document.createElement('a-entity');
  modelWrapper.setAttribute(`id`, `ar-bottle-model-${prodId}`);

  // No animation component: the model stays still.
  orientationWrapper.appendChild(modelWrapper);
  container.appendChild(orientationWrapper);

  console.log('[AR] Creating model:', {
  id: prodId,
  modelUrl,
  modelType
});

if (modelUrl) {
  const glbModel = document.createElement('a-entity');

  glbModel.setAttribute('id', `ar-product-glb-${prodId}`);
  glbModel.setAttribute('gltf-model', modelUrl);

  // Preserve the working model transform.
  glbModel.setAttribute('position', '0 1 0');
  glbModel.setAttribute('rotation', '0 180 0');
  glbModel.setAttribute('scale', '0.5 0.5 0.5');

  // Improve visibility without changing the GLB's geometry.
  glbModel.setAttribute(
    'material',
    'shader: standard; metalness: 0.05; roughness: 0.38'
  );

  // Add local fill lighting to make the bottle easier to see.
  const fillLight = document.createElement('a-entity');
  fillLight.setAttribute('light', {
    type: 'ambient',
    color: '#FFFFFF',
    intensity: 0.8
  });

  const keyLight = document.createElement('a-entity');
  keyLight.setAttribute('position', '1 1.5 2');
  keyLight.setAttribute('light', {
    type: 'directional',
    color: '#FFFFFF',
    intensity: 1.2
  });

  const rimLight = document.createElement('a-entity');
  rimLight.setAttribute('position', '-1 0.8 -1');
  rimLight.setAttribute('light', {
    type: 'point',
    color: '#D9F5E7',
    intensity: 0.6,
    distance: 5
  });

  glbModel.appendChild(fillLight);
  glbModel.appendChild(keyLight);
  glbModel.appendChild(rimLight);

  modelWrapper.appendChild(glbModel);

  return container;
}


  // Existing procedural fallback: Gentle Cleanser.
  if (modelType === 'cleanser-bottle') {
    const body = document.createElement('a-cylinder');
    body.setAttribute('position', '0 0 0');
    body.setAttribute('radius', '0.34');
    body.setAttribute('height', '0.9');
    body.setAttribute('color', '#E8F5EE');
    body.setAttribute('material', 'roughness: 0.25; opacity: 0.95');

    const collar = document.createElement('a-cylinder');
    collar.setAttribute('position', '0 0.5 0');
    collar.setAttribute('radius', '0.18');
    collar.setAttribute('height', '0.1');
    collar.setAttribute('color', '#C8D8CE');

    const pump = document.createElement('a-box');
    pump.setAttribute('position', '0 0.6 0');
    pump.setAttribute('width', '0.24');
    pump.setAttribute('height', '0.1');
    pump.setAttribute('depth', '0.45');
    pump.setAttribute('color', '#1E3329');

    const label = document.createElement('a-plane');
    label.setAttribute('position', '0 0 0.345');
    label.setAttribute('width', '0.42');
    label.setAttribute('height', '0.55');
    label.setAttribute('color', '#FFFFFF');

    const text = document.createElement('a-text');
    text.setAttribute('value', 'SKINSPACE\nGENTLE\nCLEANSER');
    text.setAttribute('align', 'center');
    text.setAttribute('position', '0 0 0.35');
    text.setAttribute('width', '0.85');
    text.setAttribute('color', '#1C2E24');

    modelWrapper.append(body, collar, pump, label, text);
  }

  // Existing procedural fallback: Barrier Moisturizer.
  else if (modelType === 'cream-jar') {
    const body = document.createElement('a-cylinder');
    body.setAttribute('position', '0 -0.05 0');
    body.setAttribute('radius', '0.44');
    body.setAttribute('height', '0.5');
    body.setAttribute('color', '#FAFBF9');

    const lid = document.createElement('a-cylinder');
    lid.setAttribute('position', '0 0.25 0');
    lid.setAttribute('radius', '0.46');
    lid.setAttribute('height', '0.12');
    lid.setAttribute('color', '#22382C');

    const label = document.createElement('a-plane');
    label.setAttribute('position', '0 -0.05 0.445');
    label.setAttribute('width', '0.48');
    label.setAttribute('height', '0.3');
    label.setAttribute('color', '#FFFFFF');

    const text = document.createElement('a-text');
    text.setAttribute('value', 'BARRIER\nMOISTURIZER');
    text.setAttribute('align', 'center');
    text.setAttribute('position', '0 -0.05 0.45');
    text.setAttribute('width', '0.9');
    text.setAttribute('color', '#1C2E24');

    modelWrapper.append(body, lid, label, text);
  }

  // Existing procedural fallback: Hydrating Serum.
  else {
    const glass = document.createElement('a-cylinder');
    glass.setAttribute('position', '0 0 0');
    glass.setAttribute('radius', '0.32');
    glass.setAttribute('height', '0.75');
    glass.setAttribute('color', '#E6F4EE');
    glass.setAttribute(
      'material',
      'roughness: 0.15; metalness: 0.05; opacity: 0.92; transparent: true'
    );

    const liquid = document.createElement('a-cylinder');
    liquid.setAttribute('position', '0 -0.02 0');
    liquid.setAttribute('radius', '0.28');
    liquid.setAttribute('height', '0.68');
    liquid.setAttribute('color', '#5BA892');

    const shoulder = document.createElement('a-cone');
    shoulder.setAttribute('position', '0 0.42 0');
    shoulder.setAttribute('radius-bottom', '0.32');
    shoulder.setAttribute('radius-top', '0.18');
    shoulder.setAttribute('height', '0.12');
    shoulder.setAttribute('color', '#E6F4EE');

    const collar = document.createElement('a-cylinder');
    collar.setAttribute('position', '0 0.52 0');
    collar.setAttribute('radius', '0.18');
    collar.setAttribute('height', '0.08');
    collar.setAttribute('color', '#D0DFD7');

    const cap = document.createElement('a-cylinder');
    cap.setAttribute('position', '0 0.61 0');
    cap.setAttribute('radius', '0.16');
    cap.setAttribute('height', '0.12');
    cap.setAttribute('color', '#1E3329');

    const bulb = document.createElement('a-sphere');
    bulb.setAttribute('position', '0 0.70 0');
    bulb.setAttribute('radius', '0.12');
    bulb.setAttribute('color', '#14211A');

    const label = document.createElement('a-plane');
    label.setAttribute('position', '0 0 0.325');
    label.setAttribute('width', '0.4');
    label.setAttribute('height', '0.5');
    label.setAttribute('color', '#FFFFFF');

    const brand = document.createElement('a-text');
    brand.setAttribute('value', 'SKINSPACE\nHYDRATING\nSERUM');
    brand.setAttribute('align', 'center');
    brand.setAttribute('position', '0 0.06 0.33');
    brand.setAttribute('width', '0.88');
    brand.setAttribute('color', '#182C22');

    const formula = document.createElement('a-text');
    formula.setAttribute('value', 'HA + NIACINAMIDE');
    formula.setAttribute('align', 'center');
    formula.setAttribute('position', '0 -0.1 0.33');
    formula.setAttribute('width', '0.62');
    formula.setAttribute('color', '#407B69');

    modelWrapper.append(
      glass, liquid, shoulder, collar, cap, bulb, label, brand, formula
    );
  }

  return container;
}


export function createIngredient3DModel(ingredient = null, isSandbox = false) {
  const container = document.createElement('a-entity');
  const ingId = ingredient?.id || 'hyaluronic-acid';
  container.setAttribute('id', `ar-ingredient-model-${ingId}`);
  container.setAttribute('position', '0 0.5 0');
  container.setAttribute('visible', 'false'); // Initially hidden until marker is detected

  // Local orientation wrapper (compensates for AR.js matrix inversion in webcam mode)
  const orientationWrapper = document.createElement('a-entity');
  orientationWrapper.setAttribute('id', `ar-molecule-orientation-${ingId}`);
  orientationWrapper.setAttribute('rotation', isSandbox ? '0 0 0' : '180 0 0');

  // Smooth rotation animation wrapper around upright axis
  const spinWrapper = document.createElement('a-entity');
  spinWrapper.setAttribute('id', `ar-molecule-spin-${ingId}`);
  spinWrapper.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 14000; easing: linear');

  orientationWrapper.appendChild(spinWrapper);
  container.appendChild(orientationWrapper);

  // Helper to create an atom sphere
  const createAtom = (x, y, z, radius, color, roughness = 0.2, opacity = 1.0) => {
    const sphere = document.createElement('a-sphere');
    sphere.setAttribute('position', `${x} ${y} ${z}`);
    sphere.setAttribute('radius', radius.toString());
    sphere.setAttribute('color', color);
    if (opacity < 1.0) {
      sphere.setAttribute('material', `roughness: ${roughness}; metalness: 0.1; opacity: ${opacity}; transparent: true`);
    } else {
      sphere.setAttribute('material', `roughness: ${roughness}; metalness: 0.15`);
    }
    return sphere;
  };

  // Helper to create a chemical bond cylinder between two 3D positions
  const createBond = (from, to, radius = 0.024, color = '#CBD5E1') => {
    const [x1, y1, z1] = from;
    const [x2, y2, z2] = to;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const midZ = (z1 + z2) / 2;

    const cylinder = document.createElement('a-cylinder');
    cylinder.setAttribute('position', `${midX.toFixed(3)} ${midY.toFixed(3)} ${midZ.toFixed(3)}`);
    cylinder.setAttribute('radius', radius.toString());
    cylinder.setAttribute('height', length.toFixed(3));
    cylinder.setAttribute('color', color);
    cylinder.setAttribute('material', 'roughness: 0.4; metalness: 0.2');

    // Calculate rotation to orient cylinder from (0, 1, 0) to vector (dx, dy, dz)
    const pitch = Math.atan2(Math.sqrt(dx * dx + dz * dz), dy) * (180 / Math.PI);
    const yaw = Math.atan2(dx, dz) * (180 / Math.PI);
    cylinder.setAttribute('rotation', `${pitch.toFixed(1)} ${yaw.toFixed(1)} 0`);

    return cylinder;
  };

  // Atoms definition for Hyaluronic Acid disaccharide repeat unit:
  // Colors:
  // Carbon backbone: #2D3748
  // Ring/Carbonyl Oxygen: #E53E3E
  // Hydroxyl -OH groups (Water-binding sites): #00A389
  // Nitrogen group: #4F46E5
  // Hydration water shell (bound moisture): #0EA5E9 (translucent)
  const atoms = [
    // 0: Central Carbon Ring 1
    { pos: [0, 0.05, 0], r: 0.13, color: '#2D3748' },
    // 1: Ring Oxygen
    { pos: [0.28, 0.2, 0.05], r: 0.12, color: '#E53E3E' },
    // 2: Carbon 2
    { pos: [0.42, -0.05, -0.05], r: 0.12, color: '#2D3748' },
    // 3: Carbon 3
    { pos: [0.25, -0.28, -0.1], r: 0.12, color: '#2D3748' },
    // 4: Carbon 4
    { pos: [-0.05, -0.22, 0], r: 0.12, color: '#2D3748' },
    // 5: Carbon 5
    { pos: [-0.18, 0.0, 0.08], r: 0.12, color: '#2D3748' },

    // Functional Groups attached to ring:
    // 6: Carboxyl Carbon (-COOH)
    { pos: [-0.42, 0.15, 0.12], r: 0.11, color: '#2D3748' },
    // 7: Carbonyl Oxygen (=O)
    { pos: [-0.55, 0.35, 0.18], r: 0.11, color: '#E53E3E' },
    // 8: Carboxyl -OH (Key Moisture Binder)
    { pos: [-0.52, -0.02, 0.05], r: 0.11, color: '#00A389' },

    // 9: Hydroxyl -OH on Carbon 4
    { pos: [-0.15, -0.42, 0.05], r: 0.11, color: '#00A389' },
    // 10: Hydroxyl -OH on Carbon 3
    { pos: [0.35, -0.48, -0.15], r: 0.11, color: '#00A389' },

    // 11: Nitrogen group (-NH-) on Carbon 2
    { pos: [0.65, 0.08, -0.1], r: 0.11, color: '#4F46E5' },
    // 12: Acetyl Carbon (-CO-CH3)
    { pos: [0.82, -0.08, -0.05], r: 0.1, color: '#2D3748' },
    // 13: Acetyl Oxygen (=O)
    { pos: [0.95, 0.08, -0.08], r: 0.1, color: '#E53E3E' },

    // Hydration Shell: Bound water molecules clustered around humectant sites
    { pos: [-0.68, 0.08, 0.3], r: 0.09, color: '#0EA5E9', op: 0.82 },
    { pos: [-0.25, -0.62, 0.15], r: 0.08, color: '#0EA5E9', op: 0.82 },
    { pos: [0.45, -0.68, -0.25], r: 0.08, color: '#0EA5E9', op: 0.82 }
  ];

  // Bonds connecting adjacent atoms:
  const bonds = [
    // Ring bonds: 0-1-2-3-4-5-0
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
    // Carboxyl attachments: 5-6, 6-7, 6-8
    [5, 6], [6, 7], [6, 8],
    // Hydroxyl attachments: 4-9, 3-10
    [4, 9], [3, 10],
    // Nitrogen / Acetyl attachments: 2-11, 11-12, 12-13
    [2, 11], [11, 12], [12, 13],
    // Hydrogen bonding to hydration shell:
    [8, 14], [9, 15], [10, 16]
  ];

  // Append bonds first so atoms sit on top
  bonds.forEach(([i, j]) => {
    const from = atoms[i].pos;
    const to = atoms[j].pos;
    const isWaterBond = i >= 14 || j >= 14;
    const bondColor = isWaterBond ? '#7DD3FC' : '#CBD5E1';
    const bondRadius = isWaterBond ? 0.016 : 0.024;
    const bond = createBond(from, to, bondRadius, bondColor);
    spinWrapper.appendChild(bond);
  });

  // Append atoms
  atoms.forEach(atom => {
    const sphere = createAtom(atom.pos[0], atom.pos[1], atom.pos[2], atom.r, atom.color, 0.2, atom.op || 1.0);
    spinWrapper.appendChild(sphere);
  });

  // Floating educational identification plate
  const labelCard = document.createElement('a-plane');
  labelCard.setAttribute('position', '0 -0.55 0');
  labelCard.setAttribute('width', '1.1');
  labelCard.setAttribute('height', '0.28');
  labelCard.setAttribute('color', '#FFFFFF');
  labelCard.setAttribute('material', 'roughness: 0.9; opacity: 0.95');

  const labelText = document.createElement('a-text');
  labelText.setAttribute('value', 'HYALURONIC ACID\n(C14H21NO11)n MOLECULE');
  labelText.setAttribute('align', 'center');
  labelText.setAttribute('position', '0 0 0.01');
  labelText.setAttribute('width', '1.2');
  labelText.setAttribute('color', '#0F172A');

  labelCard.appendChild(labelText);
  spinWrapper.appendChild(labelCard);

  return container;
}

export class SkinSpaceAR {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('ar-scene-container');
    this.onStatusChange = options.onStatusChange || (() => {});
    this.onMarkerFoundCallback = options.onMarkerFound || (() => {});
    this.onMarkerLostCallback = options.onMarkerLost || (() => {});

    this.sceneElement = null;
    this.markerElements = [];
    this.productElements = new Map();
    this.productElement = null;
    this.currentTarget = null;
    this.mode = 'webcam'; // 'webcam' or 'sandbox3d'
    this.status = 'idle'; // 'idle' | 'initializing' | 'scanning' | 'detected' | 'lost' | 'error'
    this.videoPoller = null;
    this.resizeHandler = this.handleResize.bind(this);
  }

  /**
   * Start AR experience using product or ingredient configuration
   * @param {Object} target Target item (e.g. Hydrating Serum or Hyaluronic Acid)
   */
  async start(target = null, mode = 'webcam', type = null) {
    this.targetType = type || (target?.whatIsIt || target?.keyFacts || target?.id === 'hyaluronic-acid' ? 'ingredient' : 'product');
    const isIng = this.targetType === 'ingredient';
    this.currentTarget = target || (isIng ? (getIngredientById('hyaluronic-acid') || getAllIngredients()[0]) : PRODUCTS[0]);
    this.mode = mode;
    this.updateStatus('initializing', 'Move closer and keep the full marker inside the camera frame.');

    // Clean up any existing AR scene or video elements to ensure exactly one camera session
    this.stop();

    if (this.mode === 'sandbox3d') {
      this.init3DSandboxScene();
      return;
    }

    try {
      // Verify Camera API availability
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam API is not supported in this browser.');
      }

      // Configure AR.js baseURL to serve pattern files locally without network dependency
      if (typeof window !== 'undefined' && window.THREEx && window.THREEx.ArToolkitContext) {
        window.THREEx.ArToolkitContext.baseURL = window.location.origin + '/';
      }

      // Initialize the single A-Frame scene
      this.initARScene();
      window.addEventListener('resize', this.resizeHandler);
      this.handleResize();
    } catch (err) {
      console.error('[SkinSpace AR] AR.js initialization/error:', err);
      let errorMsg = 'Camera access is required to use SkinSpace AR.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Camera access was denied. Please allow camera permissions in your browser address bar.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No camera hardware found on this device.';
      }
      this.updateStatus('error', errorMsg);
    }
  }

  /**
   * Initialize A-Frame Scene with AR.js marker tracking
   * Scalable product -> marker configuration for all products
   */
  initARScene() {
    this.container.innerHTML = '';

    // Create single A-Frame scene with responsive camera viewport settings and transparent renderer
    const scene = document.createElement('a-scene');
    scene.setAttribute('embedded', '');
    scene.setAttribute('arjs', 'sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;');
    scene.setAttribute('vr-mode-ui', 'enabled: false');
    scene.setAttribute('renderer', 'antialias: true; alpha: true; precision: medium;');
    scene.style.position = 'absolute';
    scene.style.top = '0';
    scene.style.left = '0';
    scene.style.width = '100%';
    scene.style.height = '100%';
    scene.style.background = 'transparent';

    console.log('[SkinSpace AR] AR scene initialized');

    // Camera Init and Error listeners from AR.js
    scene.addEventListener('camera-init', () => {
      console.log('[SkinSpace AR] camera initialized');
      this.updateStatus('scanning', 'Move closer and keep the full marker inside the camera frame.');
      this.ensureVideoVisible();
    });

    const handleCameraError = (err) => {
      console.error('[SkinSpace AR] camera/AR source errors:', err);
      this.updateStatus('error', 'Camera access was denied or could not be started.');
    };

    scene.addEventListener('camera-error', handleCameraError);
    window.addEventListener('camera-error', handleCameraError, { once: true });

    // Handle AR.js video element loading and ensure visibility over transparent background
    const handleVideoLoaded = () => {
      this.ensureVideoVisible();
    };

    window.addEventListener('arjs-video-loaded', handleVideoLoaded, { once: true });

    // Poll to catch video element immediately upon DOM insertion
    let attempts = 0;
    this.videoPoller = setInterval(() => {
      attempts++;
      const video = document.getElementById('arjs-video') || document.querySelector('video');
      if (video) {
        this.ensureVideoVisible(video);
        if (video.videoWidth > 0 || attempts > 30) {
          clearInterval(this.videoPoller);
          this.videoPoller = null;
        }
      } else if (attempts > 30) {
        clearInterval(this.videoPoller);
        this.videoPoller = null;
      }
    }, 100);

    // Active target configuration (Product or Ingredient)
    const isIngredient = this.targetType === 'ingredient' || (this.targetType !== 'product' && (this.currentTarget?.keyFacts || this.currentTarget?.id === 'hyaluronic-acid'));
    const activeTarget = this.currentTarget || (isIngredient ? (getIngredientById('hyaluronic-acid') || getAllIngredients()[0]) : PRODUCTS[0]);

    // Create single Hiro marker for the active AR session
    const marker = document.createElement('a-marker');
    marker.setAttribute('id', `marker-${activeTarget.id}`);
    marker.setAttribute('preset', 'hiro');
    marker.setAttribute('type', 'pattern');
    marker.setAttribute('url', activeTarget.marker?.patternUrl || '/assets/markers/pattern-hiro.patt');
    marker.setAttribute('smooth', 'true');
    marker.setAttribute('smoothCount', '5');
    marker.setAttribute('smoothTolerance', '0.01');
    marker.setAttribute('smoothThreshold', '2');
    marker.setAttribute('minConfidence', '0.4');

    console.log(`[SkinSpace AR] Hiro marker initialized for ${activeTarget.name} (${activeTarget.id}) [${isIngredient ? 'ingredient' : 'product'}]`);

    // Create 3D Skincare product model or ingredient molecular model attached to this marker
    const model3D = isIngredient ? createIngredient3DModel(activeTarget, false) : createProduct3DModel(activeTarget, false);
    marker.appendChild(model3D);
    this.productElement = model3D;
    this.markerElement = marker;

    // Marker lifecycle event listeners:
    // When marker detected: show 3D model, update status, notify application
    marker.addEventListener('markerFound', (e) => {
      console.log(`[SkinSpace AR] MARKER FOUND for ${activeTarget.name} (${activeTarget.id})`, e);
      if (this.productElement) {
        this.productElement.setAttribute('visible', 'true');
      }
      this.updateStatus('detected', `Tracking ${activeTarget.name}`);
      this.onMarkerFoundCallback(activeTarget);
    });

    // When marker lost: hide 3D model, update status to scanning
    marker.addEventListener('markerLost', (e) => {
      console.log(`[SkinSpace AR] MARKER LOST for ${activeTarget.name} (${activeTarget.id})`, e);
      if (this.productElement) {
        this.productElement.setAttribute('visible', 'false');
      }
      this.updateStatus('lost', 'Point camera at Hiro marker');
      this.onMarkerLostCallback(activeTarget);
    });

    scene.appendChild(marker);

    // Default Camera
    const camera = document.createElement('a-entity');
    camera.setAttribute('camera', '');

    // Ambient Lighting
    const light = document.createElement('a-entity');
    light.setAttribute('light', 'type: ambient; color: #FFFFFF; intensity: 1.2;');

    const dirLight = document.createElement('a-entity');
    dirLight.setAttribute('light', 'type: directional; color: #FFFBF0; intensity: 1.4; position: 1 4 2;');

    scene.appendChild(light);
    scene.appendChild(dirLight);
    scene.appendChild(camera);

    this.container.appendChild(scene);
    this.sceneElement = scene;

    // Initial status
    this.updateStatus('scanning', 'Move closer and keep the full marker inside the camera frame.');
  }

  /**
   * Guarantees camera video feed is layered properly and visible on Android Chrome
   */
  ensureVideoVisible(videoElement = null) {
    const video = videoElement || document.getElementById('arjs-video') || document.querySelector('video');
    if (!video) return;

    // Ensure mobile inline playback attributes
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('autoplay', '');
    video.muted = true;

    // Attempt play to avoid mobile pause state
    video.play().catch(() => {});

    // Ensure video is styled to fill screen behind A-Frame canvas
    video.style.position = 'absolute';
    video.style.top = '0px';
    video.style.left = '0px';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.zIndex = '1';
    video.style.display = 'block';
    video.style.visibility = 'visible';
    video.style.opacity = '1';

    // Reparent video inside our container so it lives within the AR viewport
    if (this.container && video.parentElement !== this.container) {
      this.container.insertBefore(video, this.container.firstChild);
    }

    // Ensure A-Frame canvas sits on top of video at z-index: 2
    const canvas = this.container.querySelector('.a-canvas');
    if (canvas) {
      canvas.style.position = 'absolute';
      canvas.style.top = '0px';
      canvas.style.left = '0px';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.zIndex = '2';
      canvas.style.background = 'transparent';
    }
  }

  /**
   * Interactive 3D Sandbox fallback mode (ideal for desktop testing or camera-restricted devices)
   */
  init3DSandboxScene() {
    this.container.innerHTML = '';

    const scene = document.createElement('a-scene');
    scene.setAttribute('embedded', '');
    scene.setAttribute('vr-mode-ui', 'enabled: false');
    scene.setAttribute('renderer', 'antialias: true; alpha: false; precision: medium;');
    scene.style.position = 'absolute';
    scene.style.top = '0';
    scene.style.left = '0';
    scene.style.width = '100%';
    scene.style.height = '100%';
    scene.style.background = '#0F1512';

    // Sky/ambient studio gradient background
    const sky = document.createElement('a-sky');
    sky.setAttribute('color', '#121A15');
    scene.appendChild(sky);

    // Stage ground pedestal
    const pedestal = document.createElement('a-cylinder');
    pedestal.setAttribute('position', '0 -1.1 0');
    pedestal.setAttribute('radius', '1.8');
    pedestal.setAttribute('height', '0.1');
    pedestal.setAttribute('color', '#1A241F');
    pedestal.setAttribute('metalness', '0.2');
    pedestal.setAttribute('roughness', '0.8');
    scene.appendChild(pedestal);

    // Grid ring for perspective
    const gridRing = document.createElement('a-ring');
    gridRing.setAttribute('position', '0 -1.04 0');
    gridRing.setAttribute('rotation', '-90 0 0');
    gridRing.setAttribute('radius-inner', '1.7');
    gridRing.setAttribute('radius-outer', '1.75');
    gridRing.setAttribute('color', '#2D5A46');
    scene.appendChild(gridRing);

    // Centered 3D model for inspection (Product bottle/jar or Ingredient molecule)
    const isIngredient = this.targetType === 'ingredient' || (this.targetType !== 'product' && (this.currentTarget?.keyFacts || this.currentTarget?.id === 'hyaluronic-acid'));
    const activeTarget = this.currentTarget || (isIngredient ? (getIngredientById('hyaluronic-acid') || getAllIngredients()[0]) : PRODUCTS[0]);
    const model3D = isIngredient ? createIngredient3DModel(activeTarget, true) : createProduct3DModel(activeTarget, true);
    model3D.setAttribute('visible', 'true');
    model3D.setAttribute('position', '0 0 0');
    scene.appendChild(model3D);
    this.productElement = model3D;

    // Lights
    const ambientLight = document.createElement('a-entity');
    ambientLight.setAttribute('light', 'type: ambient; color: #FFFFFF; intensity: 1.0;');

    const keyLight = document.createElement('a-entity');
    keyLight.setAttribute('light', 'type: directional; color: #FFF9E6; intensity: 1.6; position: 2 4 3;');

    // Camera with orbit controls
    const cameraRig = document.createElement('a-entity');
    cameraRig.setAttribute('position', '0 0.3 3.0');
    const camera = document.createElement('a-camera');
    camera.setAttribute('look-controls', 'enabled: true');
    cameraRig.appendChild(camera);

    scene.appendChild(ambientLight);
    scene.appendChild(keyLight);
    scene.appendChild(cameraRig);

    this.container.appendChild(scene);
    this.sceneElement = scene;

    this.updateStatus('detected', 'Move closer and keep the full marker inside the camera frame.');
    this.onMarkerFoundCallback(this.currentTarget);
  }

  /**
   * Handle responsive camera viewport calculations to prevent stretching or black screens
   */
  handleResize() {
    if (this.sceneElement) {
      window.dispatchEvent(new Event('resize-arjs'));
    }
    this.ensureVideoVisible();
  }

  /**
   * Broadcast status update to HUD and callbacks
   */
  updateStatus(status, message) {
    this.status = status;
    this.onStatusChange({
      status,
      message,
      target: this.currentTarget,
      mode: this.mode
    });
  }

  /**
   * Stop AR session, release camera stream, and clean up elements
   */
  stop() {
    window.removeEventListener('resize', this.resizeHandler);
    if (this.videoPoller) {
      clearInterval(this.videoPoller);
      this.videoPoller = null;
    }

    // 1. Stop all media stream tracks across the entire page and remove video elements
    const videos = document.querySelectorAll('video, #arjs-video');
    videos.forEach(v => {
      try {
        if (v.srcObject && typeof v.srcObject.getTracks === 'function') {
          v.srcObject.getTracks().forEach(t => {
            try { t.stop(); } catch (e) {}
          });
        }
        v.pause();
        v.srcObject = null;
        if (v.parentNode) {
          v.parentNode.removeChild(v);
        }
      } catch (e) {
        // Ignore
      }
    });

    // 2. Remove all A-Frame / AR.js injected DOM elements
    const injectedElements = document.querySelectorAll(
      '.a-canvas, .a-enter-vr, .a-orientation-modal, .a-loader-title, .a-dialog, .a-enter-vr-button, #arjs-video-canvas'
    );
    injectedElements.forEach(el => {
      if (el && el.parentNode) {
        try {
          el.parentNode.removeChild(el);
        } catch (e) {}
      }
    });

    // 3. Clean up the A-Frame scene element
    if (this.sceneElement) {
      try {
        if (typeof this.sceneElement.pause === 'function') {
          this.sceneElement.pause();
        }
        if (this.sceneElement.parentNode) {
          this.sceneElement.parentNode.removeChild(this.sceneElement);
        }
      } catch (e) {
        // Ignore
      }
      this.sceneElement = null;
      this.markerElement = null;
      this.productElement = null;
    }

    // 4. Reset container
    if (this.container) {
      this.container.innerHTML = '';
      this.container.removeAttribute('style');
    }

    // 5. Remove A-Frame & AR.js injected classes from <html> and <body>
    document.documentElement.classList.remove('a-fullscreen', 'a-html', 'ar-active');
    document.body.classList.remove('a-fullscreen', 'a-body', 'ar-active', 'drawer-open');

    // 6. Reset all inline styles injected by A-Frame / AR.js onto <html> and <body>
    document.documentElement.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('overflow-x');
    document.documentElement.style.removeProperty('overflow-y');
    document.documentElement.style.removeProperty('height');
    document.documentElement.style.removeProperty('width');
    document.documentElement.style.removeProperty('margin');
    document.documentElement.style.removeProperty('padding');
    document.documentElement.style.removeProperty('position');

    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow-x');
    document.body.style.removeProperty('overflow-y');
    document.body.style.removeProperty('height');
    document.body.style.removeProperty('min-height');
    document.body.style.removeProperty('width');
    document.body.style.removeProperty('margin');
    document.body.style.removeProperty('padding');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('left');

    this.status = 'idle';
  }
}
