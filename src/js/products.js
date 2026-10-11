/**
 * SkinSpace AR · Product Data Module
 * Fictional skincare products designed for educational 3D/Web AR exploration.
 * Non-commercial, non-promotional educational schema.
 */

export const PRODUCTS = [
  {
    id: "hydrating-serum",
    name: "Hydrating Serum",
    category: "Serum",
    description: "A lightweight serum designed to help maintain skin hydration.",
    benefits: [
      "Helps maintain skin hydration",
      "Leaves skin feeling soft",
      "Supports a healthy-looking skin barrier"
    ],
    skinTypes: ["Normal", "Dry", "Combination"],
    ingredients: ["Hyaluronic Acid", "Niacinamide"],
    image: "/assets/images/product_serum.jpg",
    model: "serum-dropper",
    modelUrl: "/assets/models/hydrating-serum.glb",   
    marker: {
      id: "hydrating-serum-marker",
      name: "Hydrating Serum Marker",
      preset: "hiro",
      type: "pattern",
      patternUrl: "/assets/markers/pattern-hiro.patt",
      image: "/assets/markers/hiro-marker.png",
      svg: "/assets/markers/hiro-marker.svg",
      label: "HIRO",
      instruction: "Scan this marker with your phone to explore the Hydrating Serum in AR."
    },
    arHint: "Observe the micro-droplet pipette structure and humectant suspension in 3D AR."
  },
  {
    id: "gentle-cleanser",
    name: "Gentle Cleanser",
    category: "Cleanser",
    description: "A pH-balanced botanical gel cleanser formulated to purify pores without disrupting the stratum corneum moisture barrier.",
    benefits: [
      "Preserves the acid mantle with a skin-friendly pH 5.5 profile",
      "Uses gentle amino acid surfactants instead of harsh sulfates",
      "Calms redness and reactive flushing with Centella & Chamomile"
    ],
    skinTypes: ["Sensitive", "Normal", "Combination", "Dry"],
    ingredients: ["Centella Asiatica", "Glycerin", "Green Tea Extract", "Allantoin"],
    image: "/assets/images/product_cleanser.jpg",
    model: "cleanser-bottle",
    modelUrl: "/assets/models/gentle-cleanser.glb",   
    marker: {
      id: "gentle-cleanser-marker",
      name: "Gentle Cleanser Marker",
      preset: "hiro",
      type: "pattern",
      patternUrl: "/assets/markers/pattern-hiro.patt",
      image: "/assets/markers/hiro-marker.png",
      svg: "/assets/markers/hiro-marker.svg",
      label: "HIRO",
      instruction: "Scan this marker with your phone to explore the Gentle Cleanser in AR."
    },
    arHint: "Observe the cylindrical pump architecture and calming botanical core in 3D."
  },
  {
    id: "barrier-moisturizer",
    name: "Barrier Moisturizer",
    category: "Moisturizer",
    description: "An intensive ceramide-rich barrier repair emulsion engineered to seal in hydration and reinforce compromised skin defenses.",
    benefits: [
      "Mimics the natural 3:1:1 lipid matrix of healthy human skin",
      "Dramatically reduces transepidermal water loss (TEWL)",
      "Provides a breathable non-comedogenic velvet protective cushion"
    ],
    skinTypes: ["Dry", "Very Dry", "Compromised Barrier", "Post-Treatment"],
    ingredients: ["Ceramide NP/AP/EOP", "Phytosphingosine", "Squalane", "Cholesterol"],
    image: "/assets/images/product_moisturizer.jpg",
    model: "cream-jar",
    modelUrl: "/assets/models/moist-jar.glb",   
    marker: {
      id: "barrier-moisturizer-marker",
      name: "Barrier Moisturizer Marker",
      preset: "hiro",
      type: "pattern",
      patternUrl: "/assets/markers/pattern-hiro.patt",
      image: "/assets/markers/hiro-marker.png",
      svg: "/assets/markers/hiro-marker.svg",
      label: "HIRO",
      instruction: "Scan this marker with your phone to explore the Barrier Moisturizer in AR."
    },
    arHint: "Explore the lipid matrix bilayer representation protecting skin cells."
  }
];

export function getAllProducts() {
  return PRODUCTS;
}

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}
