
export const INGREDIENTS = [
  {
    id: "hyaluronic-acid",
    name: "Hyaluronic Acid",
    category: "Humectant",
    shortDescription: "A hydration-focused ingredient that attracts and retains moisture to help skin feel plump and supple.",
    benefits: [
      "Helps attract and retain moisture",
      "Supports soft, supple-looking skin",
      "Helps soften the appearance of dehydration lines",
      "Supports the skin's surface moisture balance"
    ],
    skinTypes: ["All Skin Types", "Dry", "Dehydrated", "Sensitive", "Combination", "Oily"],
    keyFacts: [
      "Naturally occurring: Hyaluronic acid is found naturally in the body, including the skin.",
      "Moisture binding: It helps bind water rather than adding oil.",
      "Formulation matters: Different molecular weights can affect where the ingredient primarily acts.",
      "Application tip: Applying a humectant-containing product to slightly damp skin may help support hydration."
    ],
    whatIsIt: "Hyaluronic acid is a water-binding molecule found naturally in human skin that helps maintain hydration and skin volume.",
    quickFact: "Hyaluronic acid can bind substantial amounts of water relative to its molecular weight.",
    commonProducts: ["Hydrating serums", "Gel moisturizers", "Hydrating toners", "Eye creams"],
    model: "molecule-hyaluronic",
    marker: {
      id: "hyaluronic-acid-marker",
      name: "Hiro Marker",
      preset: "hiro",
      type: "pattern",
      patternUrl: "/assets/markers/pattern-hiro.patt",
      image: "/assets/markers/hiro-marker.png",
      svg: "/assets/markers/hiro-marker.svg",
      label: "HIRO",
      instruction: "Scan this marker with your phone to explore Hyaluronic Acid in augmented reality."
    },
    arHint: "Inspect the 3D molecular structure and explore how this humectant relates to skin hydration."
  },
  {
    id: "niacinamide",
    name: "Niacinamide",
    category: "Vitamin B3",
    shortDescription: "A versatile form of vitamin B3 used in skincare to support the skin barrier and improve the appearance of uneven skin tone.",
    benefits: [
      "Supports the skin's natural barrier function",
      "Helps improve the appearance of uneven skin tone",
      "Helps reduce the appearance of excess oil",
      "Supports smoother-looking skin"
    ],
    skinTypes: ["Normal", "Dry", "Combination", "Oily", "Sensitive"],
    keyFacts: [
      "Vitamin connection: Niacinamide is a form of vitamin B3.",
      "Barrier support: It is associated with supporting ceramide production in the skin.",
      "Routine compatibility: It is used in many different types of skincare formulations.",
      "Concentration matters: Higher concentrations are not necessarily better for every skin type."
    ],
    whatIsIt: "Niacinamide is a water-soluble form of vitamin B3 commonly used in skincare formulations.",
    quickFact: "Niacinamide is found in products ranging from lightweight serums to moisturizers and cleansers.",
    commonProducts: ["Serums", "Moisturizers", "Toners", "Cleansers"],
    model: "molecule-niacinamide",
    marker: {
      id: "niacinamide-marker",
      name: "Hiro Marker",
      preset: "hiro",
      type: "pattern",
      patternUrl: "/assets/markers/pattern-hiro.patt",
      image: "/assets/markers/hiro-marker.png",
      svg: "/assets/markers/hiro-marker.svg",
      label: "HIRO",
      instruction: "Scan this marker with your phone to explore Niacinamide in augmented reality."
    },
    arHint: "Explore the molecular model and learn about niacinamide's role in skincare."
  },
  {
    id: "centella-asiatica",
    name: "Centella Asiatica",
    category: "Botanical Extract",
    shortDescription: "A botanical ingredient commonly used in skincare designed for sensitive or easily irritated skin.",
    benefits: [
      "Helps soothe the appearance of irritated skin",
      "Supports a comfortable-feeling skin barrier",
      "Helps reduce the appearance of visible redness",
      "Provides a botanical component in skincare formulations"
    ],
    skinTypes: ["Sensitive", "Normal", "Combination", "Dry"],
    keyFacts: [
      "Botanical origin: Centella asiatica is a plant used in traditional skincare practices.",
      "Related compounds: The plant contains triterpenoids, including madecassoside and asiaticoside.",
      "Formulation matters: Extract composition varies between products.",
      "Patch testing: Botanical ingredients can still cause reactions in some individuals."
    ],
    whatIsIt: "Centella asiatica is a plant whose extracts are used in skincare formulations, particularly products intended to soothe the skin.",
    quickFact: "Centella asiatica is also commonly called cica in skincare product descriptions.",
    commonProducts: ["Soothing creams", "Serums", "Gel moisturizers", "Cleansers"],
    model: "molecule-centella",
    marker: {
      id: "centella-asiatica-marker",
      name: "Hiro Marker",
      preset: "hiro",
      type: "pattern",
      patternUrl: "/assets/markers/pattern-hiro.patt",
      image: "/assets/markers/hiro-marker.png",
      svg: "/assets/markers/hiro-marker.svg",
      label: "HIRO",
      instruction: "Scan this marker with your phone to explore Centella Asiatica in augmented reality."
    },
    arHint: "Explore the ingredient model and learn about this botanical extract."
  },
  {
    id: "glycerin",
    name: "Glycerin",
    category: "Humectant",
    shortDescription: "A widely used humectant that helps draw water into the outer layers of skin.",
    benefits: [
      "Helps maintain skin hydration",
      "Supports soft and supple-feeling skin",
      "Helps reduce moisture loss when used in a suitable formulation",
      "Supports the skin's moisture barrier"
    ],
    skinTypes: ["All Skin Types", "Dry", "Dehydrated", "Sensitive", "Combination", "Oily"],
    keyFacts: [
      "Water attracting: Glycerin is a humectant that binds water.",
      "Common ingredient: It appears in many cleanser and moisturizer formulations.",
      "Barrier support: Adequate hydration helps maintain normal skin barrier function.",
      "Formulation matters: Its effects depend on the overall product formula."
    ],
    whatIsIt: "Glycerin, also called glycerol, is a humectant used to help the skin retain moisture.",
    quickFact: "Glycerin is one of the most widely used moisturizing ingredients in skincare.",
    commonProducts: ["Cleansers", "Moisturizers", "Serums", "Lotions"],
    model: "molecule-glycerin",
    marker: {
      id: "glycerin-marker",
      name: "Hiro Marker",
      preset: "hiro",
      type: "pattern",
      patternUrl: "/assets/markers/pattern-hiro.patt",
      image: "/assets/markers/hiro-marker.png",
      svg: "/assets/markers/hiro-marker.svg",
      label: "HIRO",
      instruction: "Scan this marker with your phone to explore Glycerin in augmented reality."
    },
    arHint: "Explore the molecular model of glycerin and its role in moisture retention."
  },
  {
    id: "green-tea-extract",
    name: "Green Tea Extract",
    category: "Antioxidant Botanical",
    shortDescription: "A botanical extract containing polyphenols that are studied for their antioxidant properties.",
    benefits: [
      "Provides antioxidant compounds",
      "Helps support skin against environmental stressors",
      "Can complement formulations designed for oily skin",
      "Adds a botanical component to skincare formulations"
    ],
    skinTypes: ["Normal", "Combination", "Oily", "Sensitive"],
    keyFacts: [
      "Plant source: Green tea extract comes from Camellia sinensis.",
      "Polyphenols: It contains compounds such as catechins.",
      "Extract variation: The concentration and composition vary by formulation.",
      "Product context: Benefits depend on the complete formula and how the product is used."
    ],
    whatIsIt: "Green tea extract is derived from the leaves of Camellia sinensis and is used in skincare for its plant-derived compounds.",
    quickFact: "Epigallocatechin gallate, commonly called EGCG, is one of the best-known green tea catechins.",
    commonProducts: ["Serums", "Cleansers", "Moisturizers", "Toners"],
    model: "molecule-green-tea",
    marker: {
      id: "green-tea-extract-marker",
      name: "Hiro Marker",
      preset: "hiro",
      type: "pattern",
      patternUrl: "/assets/markers/pattern-hiro.patt",
      image: "/assets/markers/hiro-marker.png",
      svg: "/assets/markers/hiro-marker.svg",
      label: "HIRO",
      instruction: "Scan this marker with your phone to explore Green Tea Extract in augmented reality."
    },
    arHint: "Explore the ingredient model and learn about green tea's antioxidant compounds."
  },
  {
    id: "allantoin",
    name: "Allantoin",
    category: "Skin Protectant",
    shortDescription: "A skincare ingredient commonly used to condition skin and support a smooth, comfortable feel.",
    benefits: [
      "Helps condition the skin",
      "Supports a soft and smooth skin feel",
      "Can complement soothing skincare formulations",
      "Helps improve the feel of dry or rough skin"
    ],
    skinTypes: ["All Skin Types", "Dry", "Sensitive", "Combination"],
    keyFacts: [
      "Formulation role: Allantoin is used as a skin-conditioning ingredient.",
      "Product variety: It can be included in cleansers, creams, and lotions.",
      "Ingredient tolerance: Individual responses can vary.",
      "Routine role: It is often paired with moisturizing ingredients."
    ],
    whatIsIt: "Allantoin is a compound used in skincare formulations to condition and protect the skin.",
    quickFact: "Allantoin is frequently included in products designed for a gentle, comfortable skin feel.",
    commonProducts: ["Cleansers", "Moisturizers", "Creams", "Lotions"],
    model: "molecule-allantoin",
    marker: {
      id: "allantoin-marker",
      name: "Hiro Marker",
      preset: "hiro",
      type: "pattern",
      patternUrl: "/assets/markers/pattern-hiro.patt",
      image: "/assets/markers/hiro-marker.png",
      svg: "/assets/markers/hiro-marker.svg",
      label: "HIRO",
      instruction: "Scan this marker with your phone to explore Allantoin in augmented reality."
    },
    arHint: "Explore the ingredient model and learn about its skin-conditioning role."
  },
  {
    id: "ceramide-np-ap-eop",
    name: "Ceramide NP/AP/EOP",
    category: "Skin Barrier Lipids",
    shortDescription: "A group of ceramides used in skincare to help replenish lipids that support the skin's protective barrier.",
    benefits: [
      "Helps support the skin's moisture barrier",
      "Helps reduce moisture loss",
      "Supports smoother, more comfortable-feeling skin",
      "Complements other barrier-supporting lipids"
    ],
    skinTypes: ["Dry", "Very Dry", "Sensitive", "Compromised Barrier"],
    keyFacts: [
      "Naturally present: Ceramides are lipids found in the outermost layer of skin.",
      "Barrier structure: They help organize the lipid matrix between skin cells.",
      "Multiple types: NP, AP, and EOP identify different ceramide structures.",
      "Combination approach: Ceramides are often formulated alongside cholesterol and fatty acids."
    ],
    whatIsIt: "Ceramides are lipids that help form the protective barrier of the outer skin. NP, AP, and EOP refer to different ceramide types used in skincare.",
    quickFact: "Ceramides are important components of the lipid barrier that helps limit water loss from skin.",
    commonProducts: ["Barrier creams", "Moisturizers", "Repair balms", "Lotions"],
    model: "molecule-ceramide",
    marker: {
      id: "ceramide-np-ap-eop-marker",
      name: "Hiro Marker",
      preset: "hiro",
      type: "pattern",
      patternUrl: "/assets/markers/pattern-hiro.patt",
      image: "/assets/markers/hiro-marker.png",
      svg: "/assets/markers/hiro-marker.svg",
      label: "HIRO",
      instruction: "Scan this marker with your phone to explore Ceramides in augmented reality."
    },
    arHint: "Explore the role of ceramides in the skin's protective lipid barrier."
  },
  {
    id: "phytosphingosine",
    name: "Phytosphingosine",
    category: "Skin Barrier Lipid",
    shortDescription: "A lipid-related ingredient used in skincare formulations to support skin conditioning and barrier care.",
    benefits: [
      "Supports skin-conditioning formulations",
      "Complements ceramide-focused barrier care",
      "Helps support a comfortable skin feel",
      "Can be used in products designed for dry skin"
    ],
    skinTypes: ["Dry", "Very Dry", "Normal", "Sensitive"],
    keyFacts: [
      "Lipid-related: Phytosphingosine is related to the sphingoid bases found in skin lipids.",
      "Barrier context: It is used in formulations focused on skin barrier care.",
      "Combination: It may be paired with ceramides and other lipids.",
      "Formula dependent: Its performance depends on concentration and the complete formulation."
    ],
    whatIsIt: "Phytosphingosine is a lipid-related compound used in skincare formulations, including products focused on skin barrier support.",
    quickFact: "Phytosphingosine is associated with the family of lipid components relevant to the skin barrier.",
    commonProducts: ["Barrier moisturizers", "Repair creams", "Serums", "Lotions"],
    model: "molecule-phytosphingosine",
    marker: {
      id: "phytosphingosine-marker",
      name: "Hiro Marker",
      preset: "hiro",
      type: "pattern",
      patternUrl: "/assets/markers/pattern-hiro.patt",
      image: "/assets/markers/hiro-marker.png",
      svg: "/assets/markers/hiro-marker.svg",
      label: "HIRO",
      instruction: "Scan this marker with your phone to explore Phytosphingosine in augmented reality."
    },
    arHint: "Explore the ingredient model and its relationship to barrier-supporting lipids."
  },
  {
    id: "squalane",
    name: "Squalane",
    category: "Emollient",
    shortDescription: "A lightweight emollient that helps soften skin and reduce the feeling of dryness.",
    benefits: [
      "Helps soften and smooth skin",
      "Supports a comfortable skin feel",
      "Helps reduce the feeling of dryness",
      "Complements moisturizing and barrier-focused products"
    ],
    skinTypes: ["Dry", "Normal", "Combination", "Sensitive"],
    keyFacts: [
      "Emollient role: Squalane helps soften the skin rather than acting primarily as a humectant.",
      "Stable ingredient: Squalane is the stable saturated form related to squalene.",
      "Texture: It is often used to provide a lightweight, silky feel.",
      "Formulation matters: Suitability depends on the product and individual skin response."
    ],
    whatIsIt: "Squalane is an emollient used in skincare to soften skin and help reduce the feeling of dryness.",
    quickFact: "Squalane is commonly used as a lightweight alternative to heavier-feeling oils.",
    commonProducts: ["Moisturizers", "Facial oils", "Serums", "Barrier creams"],
    model: "molecule-squalane",
    marker: {
      id: "squalane-marker",
      name: "Hiro Marker",
      preset: "hiro",
      type: "pattern",
      patternUrl: "/assets/markers/pattern-hiro.patt",
      image: "/assets/markers/hiro-marker.png",
      svg: "/assets/markers/hiro-marker.svg",
      label: "HIRO",
      instruction: "Scan this marker with your phone to explore Squalane in augmented reality."
    },
    arHint: "Explore how an emollient such as squalane fits into a moisturizing formula."
  },
  {
    id: "cholesterol",
    name: "Cholesterol",
    category: "Skin Barrier Lipid",
    shortDescription: "A lipid naturally present in skin that is also used in formulations designed to support the moisture barrier.",
    benefits: [
      "Helps support the skin's protective barrier",
      "Complements ceramides and other skin lipids",
      "Helps support moisture retention",
      "Contributes to barrier-focused moisturizing formulations"
    ],
    skinTypes: ["Dry", "Very Dry", "Sensitive", "Compromised Barrier"],
    keyFacts: [
      "Naturally present: Cholesterol is a component of the skin's outer lipid barrier.",
      "Lipid balance: It works alongside ceramides and fatty acids in barrier structure.",
      "Formulation role: Cosmetic cholesterol is used in selected moisturizing products.",
      "Product context: Barrier benefits depend on the complete formulation."
    ],
    whatIsIt: "Cholesterol is a lipid found naturally in the skin barrier and used in some skincare products to complement other barrier lipids.",
    quickFact: "Cholesterol is one of the key lipid components commonly discussed in relation to the skin barrier.",
    commonProducts: ["Barrier moisturizers", "Repair creams", "Rich moisturizers", "Balms"],
    model: "molecule-cholesterol",
    marker: {
      id: "cholesterol-marker",
      name: "Hiro Marker",
      preset: "hiro",
      type: "pattern",
      patternUrl: "/assets/markers/pattern-hiro.patt",
      image: "/assets/markers/hiro-marker.png",
      svg: "/assets/markers/hiro-marker.svg",
      label: "HIRO",
      instruction: "Scan this marker with your phone to explore Cholesterol in augmented reality."
    },
    arHint: "Explore cholesterol's role in the lipid structure of the skin barrier."
  }
];

export function getAllIngredients() {
  return INGREDIENTS;
}

export function getIngredientById(id) {
  return INGREDIENTS.find(item => item.id === id) || null;
}
