// src/data/projects.js
// Hardcoded project data for the frontend-only stage.
// Once the backend is ready, replace this with an API fetch (same shape).
//
// 360° TOUR IMAGES (per project):
//   tourThumbnail → preview image shown on the page (any normal image, e.g. 16:9 / 3:2)
//   tour360Image  → true equirectangular (2:1) panorama used inside the 360° viewer
//
// MASTER PLAN TABS (per project):
//   video → short thumbnail video shown as preview on the tab & main card
//   image → full-resolution plan image opened in the lightbox on click
//
// AMENITIES (per project):
//   amenitiesEyebrow     → small uppercase label above the heading
//   amenitiesHeading     → [line 1, line 2 (highlighted in navy)]
//   amenitiesDescription → paragraph under the heading
//   amenities[].description / tags → shown in the amenity detail card
//
// BROCHURE:
//   brochureUrl → path to the PDF in /public. Set to null to hide the
//                 "Download Brochure" button for that project.

export const projects = [
  {
    slug: "gurudev",
    name: "Gurudev",
    tagline: "Thoughtfully planned homes in the heart of Guduvancheri",
    location: "Guduvancheri, Chennai",
    heroImage: "/guruhero.webp",
    heroImageMobile: "/updatedgurudevv.jpeg",
    aboutImage: "/guruuu.png",

    eyebrow: "MORE THAN JUST A HOME",
    heading: ["Designed for a", "Better Way of Life"],
    description:
      "Located in the Guduvancheri neighbourhood of the South-Eastern Suburbs of Chennai, Gurudev is a residential community consisting of 90 thoughtfully crafted apartments for a living experience that is a class apart. Gurudev offers a serene, high-quality lifestyle in perfect harmony with your preferences and expectations, with a choice of one and two bedroom homes.",
    ctaLabel: "OUR STORY",
    ctaHref: "#our-story",

    overlayWords: ["Live", "Connect", "Belong"],
    overlayAt: "Gurudev",

    salientFeatures: [
      "Elegantly crafted 90 apartments",
      "Stilt + 5 floors design structure",
      "100% vaastu compliant homes with zero dead space",
      "Surrounded by prominent IT/ITES companies, schools, colleges and hospitals",
    ],

    stats: [
      { id: "years", value: "77+", label: "YEARS OF TRUST" },
      { id: "projects", value: "90+", label: "LANDMARK PROJECTS" },
      { id: "sqft", value: "7M+", label: "SQ.FT. SPACE DELIVERED" },
      { id: "communities", value: "44+", label: "HAPPY COMMUNITIES" },
    ],

    // ---------- Amenities (Gurudev) ----------
    amenitiesEyebrow: "LIFE AT GURUDEV",
    amenitiesHeading: ["An Uncompromising", "Life at Gurudev"],
    amenitiesDescription:
      "Decked with the choicest and most enchanting of amenities, your home at Gurudev is a touch above the expected — a place where thoughtful features bring comfort and warmth to everyday living.",
    amenitiesCtaLabel: "VIEW ALL AMENITIES",
    amenitiesCtaHref: "#amenities",
    amenities: [
      {
        id: "shops",
        image: "/amenities/amenities2.webp",
        title: "Shops",
        tagline: "Everyday Convenience",
        description:
          "Convenient retail spaces bring everyday essentials closer, making daily errands easier for residents.",
        tags: ["Daily Essentials", "Walkable", "Time Saving"],
      },
      {
        id: "security",
        image: "/amenities/amenities.webp",
        title: "Security Cabin with CCTV",
        tagline: "Safe & Secure",
        description:
          "CCTV monitored security creates confidence and added peace of mind for residents, day and night.",
        tags: ["Manned Entry", "CCTV Coverage", "Peace of Mind"],
      },
      {
        id: "play",
        image: "/amenities/amenities3.webp",
        title: "Children's Play Area",
        tagline: "Play. Learn. Grow.",
        description:
          "A cheerful play space lets children explore, stay active and create happy memories together.",
        tags: ["Safe Play", "Open Air", "Kid Friendly"],
      },
      {
        id: "walking",
        image: "/amenities/amenities4.webp",
        title: "Walking Track",
        tagline: "Move. Breathe. Recharge.",
        description:
          "A dedicated walking path encourages refreshing mornings, relaxed evenings and healthier everyday routines.",
        tags: ["Daily Fitness", "Well Laid", "Open Air"],
      },
      {
        id: "park",
        image: "/amenities/amenities5.webp",
        title: "Park",
        tagline: "Green & Relaxing",
        description:
          "A peaceful green space offers fresh air, quiet moments and relaxing outdoor time close by.",
        tags: ["Green Space", "Relaxing", "Family Time"],
      },
      {
        id: "avenue",
        image: "/amenities/amenities6.webp",
        title: "Avenue Trees",
        tagline: "Shaded, Landscaped Paths",
        description:
          "Lush avenue trees provide shade, freshness and a naturally welcoming feel throughout the community.",
        tags: ["Shaded Paths", "Fresh Air", "Landscaped"],
      },
      {
        id: "elevator",
        image: "/amenities/amenities7.webp",
        title: "Elevator",
        tagline: "Effortless Access",
        description:
          "Effortless vertical access brings everyday convenience, comfort and smooth movement for every resident.",
        tags: ["6 Passenger", "Automatic", "All Floors"],
      },
      {
        id: "stp",
        image: "/amenities/amenities8.webp",
        title: "Sewage Treatment Plant (STP)",
        tagline: "Sustainable Living",
        description:
          "Responsible wastewater management supports a cleaner, greener and healthier community for everyone each day.",
        tags: ["Eco Friendly", "Centralised", "Sustainable"],
      },
      {
        id: "parking",
        image: "/amenities/amenities9.webp",
        title: "Car Parking",
        tagline: "Covered & Convenient",
        description:
          "Convenient parking spaces make arrivals and departures simple, smooth and stress free every day..",
        tags: ["Stilt Parking", "Numbered Slots", "Secure"],
      },
    ],

    floorPlansHeading: ["Homes Tailored", "to Your Needs"],
    floorPlansDescription:
      "Smartly designed 1 & 2 BHK apartments with efficient layouts, abundant natural light and optimal space utilisation.",
    floorPlansCtaLabel: "VIEW ALL PLANS",
    floorPlansCtaHref: "#floor-plans",

    // ---------- Nested Block structure (flat-number based, same as Privana) ----------
    floorPlanBlocks: [
      {
        id: "gurudev-block-a",
        label: "Gurudev",
        tag: "Ready to Move",
        tabs: ["1 BHK", "2 BHK"],
        plans: [
          // ============================
          // 1 BHK + 1T
          // ============================
          {
            id: "g-1bhk-103",
            image: "/floorplans/gurudev/1bhk1t/1bhk-1T1.jpeg",
            title: "1 BHK + 1T · Unit 103",
            type: "1 BHK",
            area: "425 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-3.pdf",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "g-1bhk-104",
            image: "/floorplans/gurudev/1bhk1t/1bhk-1T2.jpeg",
            title: "1 BHK + 1T · Unit 104",
            type: "1 BHK",
            area: "419 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-4.pdf",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "g-1bhk-105",
            image: "/floorplans/gurudev/1bhk1t/1bhk-1T3.jpeg",
            title: "1 BHK + 1T · Unit 105",
            type: "1 BHK",
            area: "491 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-5.pdf",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "g-1bhk-106",
            image: "/floorplans/gurudev/1bhk1t/1bhk-1T4.jpeg",
            title: "1 BHK + 1T · Unit 106",
            type: "1 BHK",
            area: "391 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-6.pdf",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "g-1bhk-107",
            image: "/floorplans/gurudev/1bhk1t/1bhk-1T5.jpeg",
            title: "1 BHK + 1T · Unit 107",
            type: "1 BHK",
            area: "408 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-7.pdf",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "g-1bhk-108",
            image: "/floorplans/gurudev/1bhk1t/1bhk -1T6.jpeg",
            title: "1 BHK + 1T · Unit 108",
            type: "1 BHK",
            area: "460 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-8.pdf",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "g-1bhk-109",
            image: "/floorplans/gurudev/1bhk1t/1bhk-1T7.jpeg",
            title: "1 BHK + 1T · Unit 109",
            type: "1 BHK",
            area: "440 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-9.pdf",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "g-1bhk-112",
            image: "/floorplans/gurudev/1bhk1t/1bhk-1T9.jpeg",
                                                    // /floorplans/gurudev/2bhk2t/2bhk-2T2.jpeg
            title: "1 BHK + 1T · Unit 112",
            type: "1 BHK",
            area: "425 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-10.pdf",
            facing: "East",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "g-1bhk-113",
            image: "/floorplans/gurudev/1bhk1t/1bhk-1T10.jpeg",
            title: "1 BHK + 1T · Unit 113",
            type: "1 BHK",
            area: "419 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-11.pdf",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "g-1bhk-114",
            image: "/floorplans/gurudev/1bhk1t/114.jpeg",
            
            title: "1 BHK + 1T · Unit 114",
            type: "1 BHK",
            area: "491 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-12.pdf",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "g-1bhk-115",
            image: "/floorplans/gurudev/2bhk2t/1bhk-1T4.jpeg",
                                  
            title: "1 BHK + 1T · Unit 115",
            type: "1 BHK",
            area: "391 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-13.pdf",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "g-1bhk-116",
            image: "/floorplans/gurudev/1bhk1t/1bhk-1T13.jpeg",
            title: "1 BHK + 1T · Unit 116",
            type: "1 BHK",
            area: "408 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-14.pdf",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "g-1bhk-117",
            image: "/floorplans/gurudev/1bhk1t/1bhk-1T14.jpeg",
            
            title: "1 BHK + 1T · Unit 117",
            type: "1 BHK",
            area: "460 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-15.pdf",
            facing: "West",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "g-1bhk-118",
            image: "/floorplans/gurudev/1bhk1t/1bhk-1T15.jpeg",
            title: "1 BHK + 1T · Unit 118",
            type: "1 BHK",
            area: "440 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-16.pdf",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "g-1bhk-203",
            image: "/floorplans/gurudev/1bhk1t/1bhk-1T1.jpeg",
            title: "1 BHK + 1T · Unit 203",
            type: "1 BHK",
            area: "425 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-17.pdf",
            facing: "West",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "g-1bhk-204",
            image: "/floorplans/gurudev/1bhk1t/204.jpeg",                       
             
            title: "1 BHK + 1T · Unit 204",
            type: "1 BHK",
            area: "419 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-18.pdf",
            facing: "east",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "g-1bhk-205",
            image: "/floorplans/gurudev/1bhk1t/1bhk-1T2.jpeg",
                                
            title: "1 BHK + 1T · Unit 205",
            type: "1 BHK",
            area: "491 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-19.pdf",
            facing: "West",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "g-1bhk-206",
            image: "/floorplans/gurudev/1bhk1t/1bhk-1T4.jpeg",
            title: "1 BHK + 1T · Unit 206",
            type: "1 BHK",
            area: "391 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-20.pdf",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },

          // ============================
          // 2 BHK + 2T
          // ============================
          {
            id: "g-2bhk-101",
            image: "/floorplans/gurudev/2bhk2t/2bhk-2T.jpeg",
            title: "2 BHK + 2T · Unit 101",
            type: "2 BHK",
            area: "730 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-1.pdf",
            facing: "west",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "g-2bhk-102",
            image: "/floorplans/gurudev/2bhk2t/2bhk-2T.jpeg",
                                                    
            title: "2 BHK + 2T · Unit 102",
            type: "2 BHK",
            area: "730 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-2.pdf",
            facing: "west",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "g-2bhk-110",
            image: "/floorplans/gurudev/1bhk1t/110.png",
                          // /floorplans/gurudev/1bhk1t/1bhk-1T18.jpeg
            title: "2 BHK + 2T · Unit 110",
            type: "2 BHK",
            area: "732 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-1.pdf",
            facing: "West",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "g-2bhk-111",
            image: "/floorplans/gurudev/1bhk1t/1bhk-1T17.jpeg",
                               
            title: "2 BHK + 2T · Unit 111",
            type: "2 BHK",
            area: "732 Sq.Ft.",
            href: "/floor-plans/gurudev/flat-2.pdf",
            facing: "East",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
        ],
      },
    ],

    // ---------- Plot Sizes & Pricing (Gurudev — from price list as on 20-Aug-2026) ----------
    // finalTotal      = TOTAL (Rs) from the price list → the price shown on the site (excl. Reg & GST)
    // totalWithRegGst = Final Total from the price list (TOTAL + Reg + GST), kept for reference
    plotPricingEyebrow: "INVEST WITH CONFIDENCE",
    plotPricingHeading: ["Unit Sizes", "& Pricing"],
    plotPricingDescription:
      "Complete, transparent pricing for every home at Gurudev — covering all 90 apartments across stilt + 5 floors. Prices shown are the total (flat price, I&A, EB/STP, floor rise and parking). Registration and GST are extra.",
    plotPricingCtaHeading: ["A Brighter", "Tomorrow Awaits"],
    plotPricingCtaText: "Secure your slice of a better lifestyle today.",
    plotPricingCtaImage: "/plot.png",
    plotPricingTabs: [
      { id: "all", label: "All Units" },
      { id: "1bhk", label: "1 BHK" },
      { id: "2bhk", label: "2 BHK" },
      { id: "east", label: "East Facing" },
      { id: "west", label: "West Facing" },
     
    ],
    plotPricing: [
      // ============================================================
      // Block A · 1st Floor
      // ============================================================
      { id: "101", flatNo: "101", block: "Block A", floor: "1st Floor", type: "2 BHK + 2T", facing: "East", status: "Sold", sqft: 730, uds: 359, basePrice: 3796000, otherCharges: 219000, ebStp: 200000, floorRise: 0, carParkType: "Covered", carParkPrice: 150000, twParkType: "Open", twParkPrice: 0, total: 4365000, reg: 270630, gst: 43650, finalTotal: 4365000, totalWithRegGst: 4679280, categories: ["2bhk", "east", "sold"] },
      { id: "102", flatNo: "102", block: "Block A", floor: "1st Floor", type: "2 BHK + 2T", facing: "East", status: "Sold", sqft: 730, uds: 359, basePrice: 3796000, otherCharges: 219000, ebStp: 200000, floorRise: 0, carParkType: "Covered", carParkPrice: 150000, twParkType: "Open", twParkPrice: 0, total: 4365000, reg: 270630, gst: 43650, finalTotal: 4365000, totalWithRegGst: 4679280, categories: ["2bhk", "east", "sold"] },
      { id: "103", flatNo: "103", block: "Block A", floor: "1st Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 425, uds: 209, basePrice: 2210000, otherCharges: 127500, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 0, total: 2487500, reg: 154225, gst: 24875, finalTotal: 2487500, totalWithRegGst: 2666600, categories: ["1bhk", "west", "unsold"] },
      { id: "104", flatNo: "104", block: "Block A", floor: "1st Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 419, uds: 206, basePrice: 2178800, otherCharges: 125700, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2479500, reg: 153729, gst: 24795, finalTotal: 2479500, totalWithRegGst: 2658024, categories: ["1bhk", "west", "unsold"] },
      { id: "105", flatNo: "105", block: "Block A", floor: "1st Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 491, uds: 241, basePrice: 2553200, otherCharges: 147300, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2875500, reg: 178281, gst: 28755, finalTotal: 2875500, totalWithRegGst: 3082536, categories: ["1bhk", "west", "unsold"] },
      { id: "106", flatNo: "106", block: "Block A", floor: "1st Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 391, uds: 192, basePrice: 2033200, otherCharges: 117300, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 0, total: 2300500, reg: 142631, gst: 23005, finalTotal: 2300500, totalWithRegGst: 2466136, categories: ["1bhk", "west", "unsold"] },
      { id: "107", flatNo: "107", block: "Block A", floor: "1st Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 408, uds: 200, basePrice: 2121600, otherCharges: 122400, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2419000, reg: 149978, gst: 24190, finalTotal: 2419000, totalWithRegGst: 2593168, categories: ["1bhk", "west", "unsold"] },
      { id: "108", flatNo: "108", block: "Block A", floor: "1st Floor", type: "1 BHK + 1T", facing: "East", status: "Sold", sqft: 460, uds: 226, basePrice: 2392000, otherCharges: 138000, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 0, total: 2680000, reg: 166160, gst: 26800, finalTotal: 2680000, totalWithRegGst: 2872960, categories: ["1bhk", "east", "sold"] },
      { id: "109", flatNo: "109", block: "Block A", floor: "1st Floor", type: "1 BHK + 1T", facing: "East", status: "Sold", sqft: 440, uds: 216, basePrice: 2288000, otherCharges: 132000, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 0, total: 2570000, reg: 159340, gst: 25700, finalTotal: 2570000, totalWithRegGst: 2755040, categories: ["1bhk", "east", "sold"] },
      { id: "110", flatNo: "110", block: "Block A", floor: "1st Floor", type: "2 BHK + 2T", facing: "West", status: "Sold", sqft: 732, uds: 359, basePrice: 3806400, otherCharges: 219600, ebStp: 200000, floorRise: 0, carParkType: "Covered", carParkPrice: 150000, twParkType: "Open", twParkPrice: 0, total: 4376000, reg: 271312, gst: 43760, finalTotal: 4376000, totalWithRegGst: 4691072, categories: ["2bhk", "west", "sold"] },
      { id: "111", flatNo: "111", block: "Block A", floor: "1st Floor", type: "2 BHK + 2T", facing: "West", status: "Sold", sqft: 732, uds: 359, basePrice: 3806400, otherCharges: 219600, ebStp: 200000, floorRise: 0, carParkType: "Covered", carParkPrice: 150000, twParkType: "Open", twParkPrice: 0, total: 4376000, reg: 271312, gst: 43760, finalTotal: 4376000, totalWithRegGst: 4691072, categories: ["2bhk", "west", "sold"] },
      { id: "112", flatNo: "112", block: "Block A", floor: "1st Floor", type: "1 BHK + 1T", facing: "East", status: "Sold", sqft: 425, uds: 208, basePrice: 2210000, otherCharges: 127500, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 0, total: 2487500, reg: 154225, gst: 24875, finalTotal: 2487500, totalWithRegGst: 2666600, categories: ["1bhk", "east", "sold"] },
      { id: "113", flatNo: "113", block: "Block A", floor: "1st Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 419, uds: 206, basePrice: 2178800, otherCharges: 125700, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2479500, reg: 153729, gst: 24795, finalTotal: 2479500, totalWithRegGst: 2658024, categories: ["1bhk", "east", "unsold"] },
      { id: "114", flatNo: "114", block: "Block A", floor: "1st Floor", type: "1 BHK + 1T", facing: "East", status: "Sold", sqft: 491, uds: 241, basePrice: 2553200, otherCharges: 147300, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2875500, reg: 178281, gst: 28755, finalTotal: 2875500, totalWithRegGst: 3082536, categories: ["1bhk", "east", "sold"] },
      { id: "115", flatNo: "115", block: "Block A", floor: "1st Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 391, uds: 192, basePrice: 2033200, otherCharges: 117300, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2325500, reg: 144181, gst: 23255, finalTotal: 2325500, totalWithRegGst: 2492936, categories: ["1bhk", "east", "unsold"] },
      { id: "116", flatNo: "116", block: "Block A", floor: "1st Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 408, uds: 200, basePrice: 2121600, otherCharges: 122400, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2419000, reg: 149978, gst: 24190, finalTotal: 2419000, totalWithRegGst: 2593168, categories: ["1bhk", "east", "unsold"] },
      { id: "117", flatNo: "117", block: "Block A", floor: "1st Floor", type: "1 BHK + 1T", facing: "West", status: "Sold", sqft: 460, uds: 226, basePrice: 2392000, otherCharges: 138000, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2705000, reg: 167710, gst: 27050, finalTotal: 2705000, totalWithRegGst: 2899760, categories: ["1bhk", "west", "sold"] },
      { id: "118", flatNo: "118", block: "Block A", floor: "1st Floor", type: "1 BHK + 1T", facing: "West", status: "Sold", sqft: 440, uds: 216, basePrice: 2288000, otherCharges: 132000, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2595000, reg: 160890, gst: 25950, finalTotal: 2595000, totalWithRegGst: 2781840, categories: ["1bhk", "west", "sold"] },

      // ============================================================
      // Block A · 2nd Floor
      // ============================================================
      { id: "201", flatNo: "201", block: "Block A", floor: "2nd Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 730, uds: 359, basePrice: 3796000, otherCharges: 219000, ebStp: 200000, floorRise: 0, carParkType: "Covered", carParkPrice: 150000, twParkType: "Open", twParkPrice: 0, total: 4365000, reg: 270630, gst: 43650, finalTotal: 4365000, totalWithRegGst: 4679280, categories: ["2bhk", "east", "unsold"] },
      { id: "202", flatNo: "202", block: "Block A", floor: "2nd Floor", type: "2 BHK + 2T", facing: "East", status: "Sold", sqft: 730, uds: 359, basePrice: 3796000, otherCharges: 219000, ebStp: 200000, floorRise: 0, carParkType: "Covered", carParkPrice: 150000, twParkType: "Open", twParkPrice: 0, total: 4365000, reg: 270630, gst: 43650, finalTotal: 4365000, totalWithRegGst: 4679280, categories: ["2bhk", "east", "sold"] },
      { id: "203", flatNo: "203", block: "Block A", floor: "2nd Floor", type: "1 BHK + 1T", facing: "West", status: "Sold", sqft: 425, uds: 209, basePrice: 2210000, otherCharges: 127500, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 150000, twParkType: "Covered", twParkPrice: 0, total: 2637500, reg: 163525, gst: 26375, finalTotal: 2637500, totalWithRegGst: 2827400, categories: ["1bhk", "west", "sold"] },
      { id: "204", flatNo: "204", block: "Block A", floor: "2nd Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 419, uds: 206, basePrice: 2178800, otherCharges: 125700, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2479500, reg: 153729, gst: 24795, finalTotal: 2479500, totalWithRegGst: 2658024, categories: ["1bhk", "west", "unsold"] },
      { id: "205", flatNo: "205", block: "Block A", floor: "2nd Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 491, uds: 241, basePrice: 2553200, otherCharges: 147300, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2875500, reg: 178281, gst: 28755, finalTotal: 2875500, totalWithRegGst: 3082536, categories: ["1bhk", "west", "unsold"] },
      { id: "206", flatNo: "206", block: "Block A", floor: "2nd Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 391, uds: 192, basePrice: 2033200, otherCharges: 117300, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2325500, reg: 144181, gst: 23255, finalTotal: 2325500, totalWithRegGst: 2492936, categories: ["1bhk", "west", "unsold"] },
      { id: "207", flatNo: "207", block: "Block A", floor: "2nd Floor", type: "1 BHK + 1T", facing: "West", status: "Sold", sqft: 408, uds: 200, basePrice: 2121600, otherCharges: 122400, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2419000, reg: 149978, gst: 24190, finalTotal: 2419000, totalWithRegGst: 2593168, categories: ["1bhk", "west", "sold"] },
      { id: "208", flatNo: "208", block: "Block A", floor: "2nd Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 460, uds: 226, basePrice: 2392000, otherCharges: 138000, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2705000, reg: 167710, gst: 27050, finalTotal: 2705000, totalWithRegGst: 2899760, categories: ["1bhk", "east", "unsold"] },
      { id: "209", flatNo: "209", block: "Block A", floor: "2nd Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 440, uds: 216, basePrice: 2288000, otherCharges: 132000, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2595000, reg: 160890, gst: 25950, finalTotal: 2595000, totalWithRegGst: 2781840, categories: ["1bhk", "east", "unsold"] },
      { id: "210", flatNo: "210", block: "Block A", floor: "2nd Floor", type: "2 BHK + 2T", facing: "West", status: "Sold", sqft: 732, uds: 359, basePrice: 3806400, otherCharges: 219600, ebStp: 200000, floorRise: 0, carParkType: "Covered", carParkPrice: 150000, twParkType: "Open", twParkPrice: 0, total: 4376000, reg: 271312, gst: 43760, finalTotal: 4376000, totalWithRegGst: 4691072, categories: ["2bhk", "west", "sold"] },
      { id: "211", flatNo: "211", block: "Block A", floor: "2nd Floor", type: "2 BHK + 2T", facing: "West", status: "Sold", sqft: 732, uds: 359, basePrice: 3806400, otherCharges: 219600, ebStp: 200000, floorRise: 0, carParkType: "Covered", carParkPrice: 150000, twParkType: "Open", twParkPrice: 0, total: 4376000, reg: 271312, gst: 43760, finalTotal: 4376000, totalWithRegGst: 4691072, categories: ["2bhk", "west", "sold"] },
      { id: "212", flatNo: "212", block: "Block A", floor: "2nd Floor", type: "1 BHK + 1T", facing: "East", status: "Sold", sqft: 425, uds: 208, basePrice: 2210000, otherCharges: 127500, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2512500, reg: 155775, gst: 25125, finalTotal: 2512500, totalWithRegGst: 2693400, categories: ["1bhk", "east", "sold"] },
      { id: "213", flatNo: "213", block: "Block A", floor: "2nd Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 419, uds: 206, basePrice: 2178800, otherCharges: 125700, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2479500, reg: 153729, gst: 24795, finalTotal: 2479500, totalWithRegGst: 2658024, categories: ["1bhk", "east", "unsold"] },
      { id: "214", flatNo: "214", block: "Block A", floor: "2nd Floor", type: "1 BHK + 1T", facing: "East", status: "Sold", sqft: 491, uds: 241, basePrice: 2553200, otherCharges: 147300, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2875500, reg: 178281, gst: 28755, finalTotal: 2875500, totalWithRegGst: 3082536, categories: ["1bhk", "east", "sold"] },
      { id: "215", flatNo: "215", block: "Block A", floor: "2nd Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 391, uds: 192, basePrice: 2033200, otherCharges: 117300, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2325500, reg: 144181, gst: 23255, finalTotal: 2325500, totalWithRegGst: 2492936, categories: ["1bhk", "east", "unsold"] },
      { id: "216", flatNo: "216", block: "Block A", floor: "2nd Floor", type: "1 BHK + 1T", facing: "East", status: "Sold", sqft: 408, uds: 200, basePrice: 2121600, otherCharges: 122400, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2419000, reg: 149978, gst: 24190, finalTotal: 2419000, totalWithRegGst: 2593168, categories: ["1bhk", "east", "sold"] },
      { id: "217", flatNo: "217", block: "Block A", floor: "2nd Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 460, uds: 226, basePrice: 2392000, otherCharges: 138000, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2705000, reg: 167710, gst: 27050, finalTotal: 2705000, totalWithRegGst: 2899760, categories: ["1bhk", "west", "unsold"] },
      { id: "218", flatNo: "218", block: "Block A", floor: "2nd Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 440, uds: 216, basePrice: 2288000, otherCharges: 132000, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2595000, reg: 160890, gst: 25950, finalTotal: 2595000, totalWithRegGst: 2781840, categories: ["1bhk", "west", "unsold"] },

      // ============================================================
      // Block A · 3rd Floor
      // ============================================================
      { id: "301", flatNo: "301", block: "Block A", floor: "3rd Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 730, uds: 359, basePrice: 3796000, otherCharges: 219000, ebStp: 200000, floorRise: 0, carParkType: "Covered", carParkPrice: 150000, twParkType: "Open", twParkPrice: 0, total: 4365000, reg: 270630, gst: 43650, finalTotal: 4365000, totalWithRegGst: 4679280, categories: ["2bhk", "east", "unsold"] },
      { id: "302", flatNo: "302", block: "Block A", floor: "3rd Floor", type: "2 BHK + 2T", facing: "East", status: "Sold", sqft: 730, uds: 359, basePrice: 3796000, otherCharges: 219000, ebStp: 200000, floorRise: 0, carParkType: "Covered", carParkPrice: 150000, twParkType: "Open", twParkPrice: 0, total: 4365000, reg: 270630, gst: 43650, finalTotal: 4365000, totalWithRegGst: 4679280, categories: ["2bhk", "east", "sold"] },
      { id: "303", flatNo: "303", block: "Block A", floor: "3rd Floor", type: "1 BHK + 1T", facing: "West", status: "Sold", sqft: 425, uds: 209, basePrice: 2210000, otherCharges: 127500, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 0, total: 2487500, reg: 154225, gst: 24875, finalTotal: 2487500, totalWithRegGst: 2666600, categories: ["1bhk", "west", "sold"] },
      { id: "304", flatNo: "304", block: "Block A", floor: "3rd Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 419, uds: 206, basePrice: 2178800, otherCharges: 125700, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2479500, reg: 153729, gst: 24795, finalTotal: 2479500, totalWithRegGst: 2658024, categories: ["1bhk", "west", "unsold"] },
      { id: "305", flatNo: "305", block: "Block A", floor: "3rd Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 491, uds: 241, basePrice: 2553200, otherCharges: 147300, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2875500, reg: 178281, gst: 28755, finalTotal: 2875500, totalWithRegGst: 3082536, categories: ["1bhk", "west", "unsold"] },
      { id: "306", flatNo: "306", block: "Block A", floor: "3rd Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 391, uds: 192, basePrice: 2033200, otherCharges: 117300, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2325500, reg: 144181, gst: 23255, finalTotal: 2325500, totalWithRegGst: 2492936, categories: ["1bhk", "west", "unsold"] },
      { id: "307", flatNo: "307", block: "Block A", floor: "3rd Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 408, uds: 200, basePrice: 2121600, otherCharges: 122400, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2419000, reg: 149978, gst: 24190, finalTotal: 2419000, totalWithRegGst: 2593168, categories: ["1bhk", "west", "unsold"] },
      { id: "308", flatNo: "308", block: "Block A", floor: "3rd Floor", type: "1 BHK + 1T", facing: "East", status: "Sold", sqft: 460, uds: 226, basePrice: 2392000, otherCharges: 138000, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 0, total: 2680000, reg: 166160, gst: 26800, finalTotal: 2680000, totalWithRegGst: 2872960, categories: ["1bhk", "east", "sold"] },
      { id: "309", flatNo: "309", block: "Block A", floor: "3rd Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 440, uds: 216, basePrice: 2288000, otherCharges: 132000, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2595000, reg: 160890, gst: 25950, finalTotal: 2595000, totalWithRegGst: 2781840, categories: ["1bhk", "east", "unsold"] },
      { id: "310", flatNo: "310", block: "Block A", floor: "3rd Floor", type: "2 BHK + 2T", facing: "West", status: "Unsold", sqft: 732, uds: 359, basePrice: 3806400, otherCharges: 219600, ebStp: 200000, floorRise: 0, carParkType: "Covered", carParkPrice: 150000, twParkType: "Open", twParkPrice: 0, total: 4376000, reg: 271312, gst: 43760, finalTotal: 4376000, totalWithRegGst: 4691072, categories: ["2bhk", "west", "unsold"] },
      { id: "311", flatNo: "311", block: "Block A", floor: "3rd Floor", type: "2 BHK + 2T", facing: "West", status: "Sold", sqft: 732, uds: 359, basePrice: 3806400, otherCharges: 219600, ebStp: 200000, floorRise: 0, carParkType: "Covered", carParkPrice: 150000, twParkType: "Open", twParkPrice: 0, total: 4376000, reg: 271312, gst: 43760, finalTotal: 4376000, totalWithRegGst: 4691072, categories: ["2bhk", "west", "sold"] },
      { id: "312", flatNo: "312", block: "Block A", floor: "3rd Floor", type: "1 BHK + 1T", facing: "East", status: "Sold", sqft: 425, uds: 208, basePrice: 2210000, otherCharges: 127500, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 0, total: 2487500, reg: 154225, gst: 24875, finalTotal: 2487500, totalWithRegGst: 2666600, categories: ["1bhk", "east", "sold"] },
      { id: "313", flatNo: "313", block: "Block A", floor: "3rd Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 419, uds: 206, basePrice: 2178800, otherCharges: 125700, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2479500, reg: 153729, gst: 24795, finalTotal: 2479500, totalWithRegGst: 2658024, categories: ["1bhk", "east", "unsold"] },
      { id: "314", flatNo: "314", block: "Block A", floor: "3rd Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 491, uds: 241, basePrice: 2553200, otherCharges: 147300, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2875500, reg: 178281, gst: 28755, finalTotal: 2875500, totalWithRegGst: 3082536, categories: ["1bhk", "east", "unsold"] },
      { id: "315", flatNo: "315", block: "Block A", floor: "3rd Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 391, uds: 192, basePrice: 2033200, otherCharges: 117300, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2325500, reg: 144181, gst: 23255, finalTotal: 2325500, totalWithRegGst: 2492936, categories: ["1bhk", "east", "unsold"] },
      { id: "316", flatNo: "316", block: "Block A", floor: "3rd Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 408, uds: 200, basePrice: 2121600, otherCharges: 122400, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2419000, reg: 149978, gst: 24190, finalTotal: 2419000, totalWithRegGst: 2593168, categories: ["1bhk", "east", "unsold"] },
      { id: "317", flatNo: "317", block: "Block A", floor: "3rd Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 460, uds: 226, basePrice: 2392000, otherCharges: 138000, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2705000, reg: 167710, gst: 27050, finalTotal: 2705000, totalWithRegGst: 2899760, categories: ["1bhk", "west", "unsold"] },
      { id: "318", flatNo: "318", block: "Block A", floor: "3rd Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 440, uds: 216, basePrice: 2288000, otherCharges: 132000, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2595000, reg: 160890, gst: 25950, finalTotal: 2595000, totalWithRegGst: 2781840, categories: ["1bhk", "west", "unsold"] },

      // ============================================================
      // Block A · 4th Floor
      // ============================================================
      { id: "401", flatNo: "401", block: "Block A", floor: "4th Floor", type: "2 BHK + 2T", facing: "East", status: "Sold", sqft: 730, uds: 359, basePrice: 3796000, otherCharges: 219000, ebStp: 200000, floorRise: 0, carParkType: "Covered", carParkPrice: 150000, twParkType: "Open", twParkPrice: 0, total: 4365000, reg: 270630, gst: 43650, finalTotal: 4365000, totalWithRegGst: 4679280, categories: ["2bhk", "east", "sold"] },
      { id: "402", flatNo: "402", block: "Block A", floor: "4th Floor", type: "2 BHK + 2T", facing: "East", status: "Sold", sqft: 730, uds: 359, basePrice: 3796000, otherCharges: 219000, ebStp: 200000, floorRise: 0, carParkType: "Covered", carParkPrice: 150000, twParkType: "Open", twParkPrice: 0, total: 4365000, reg: 270630, gst: 43650, finalTotal: 4365000, totalWithRegGst: 4679280, categories: ["2bhk", "east", "sold"] },
      { id: "403", flatNo: "403", block: "Block A", floor: "4th Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 425, uds: 209, basePrice: 2210000, otherCharges: 127500, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 0, total: 2487500, reg: 154225, gst: 24875, finalTotal: 2487500, totalWithRegGst: 2666600, categories: ["1bhk", "west", "unsold"] },
      { id: "404", flatNo: "404", block: "Block A", floor: "4th Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 419, uds: 206, basePrice: 2178800, otherCharges: 125700, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2479500, reg: 153729, gst: 24795, finalTotal: 2479500, totalWithRegGst: 2658024, categories: ["1bhk", "west", "unsold"] },
      { id: "405", flatNo: "405", block: "Block A", floor: "4th Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 491, uds: 241, basePrice: 2553200, otherCharges: 147300, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2875500, reg: 178281, gst: 28755, finalTotal: 2875500, totalWithRegGst: 3082536, categories: ["1bhk", "west", "unsold"] },
      { id: "406", flatNo: "406", block: "Block A", floor: "4th Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 391, uds: 192, basePrice: 2033200, otherCharges: 117300, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2325500, reg: 144181, gst: 23255, finalTotal: 2325500, totalWithRegGst: 2492936, categories: ["1bhk", "west", "unsold"] },
      { id: "407", flatNo: "407", block: "Block A", floor: "4th Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 408, uds: 200, basePrice: 2121600, otherCharges: 122400, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2419000, reg: 149978, gst: 24190, finalTotal: 2419000, totalWithRegGst: 2593168, categories: ["1bhk", "west", "unsold"] },
      { id: "408", flatNo: "408", block: "Block A", floor: "4th Floor", type: "1 BHK + 1T", facing: "East", status: "Sold", sqft: 460, uds: 226, basePrice: 2392000, otherCharges: 138000, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2705000, reg: 167710, gst: 27050, finalTotal: 2705000, totalWithRegGst: 2899760, categories: ["1bhk", "east", "sold"] },
      { id: "409", flatNo: "409", block: "Block A", floor: "4th Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 440, uds: 216, basePrice: 2288000, otherCharges: 132000, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2595000, reg: 160890, gst: 25950, finalTotal: 2595000, totalWithRegGst: 2781840, categories: ["1bhk", "east", "unsold"] },
      { id: "410", flatNo: "410", block: "Block A", floor: "4th Floor", type: "2 BHK + 2T", facing: "West", status: "Unsold", sqft: 732, uds: 359, basePrice: 3806400, otherCharges: 219600, ebStp: 200000, floorRise: 0, carParkType: "Covered", carParkPrice: 150000, twParkType: "Open", twParkPrice: 0, total: 4376000, reg: 271312, gst: 43760, finalTotal: 4376000, totalWithRegGst: 4691072, categories: ["2bhk", "west", "unsold"] },
      { id: "411", flatNo: "411", block: "Block A", floor: "4th Floor", type: "2 BHK + 2T", facing: "West", status: "Sold", sqft: 732, uds: 359, basePrice: 3806400, otherCharges: 219600, ebStp: 200000, floorRise: 0, carParkType: "Covered", carParkPrice: 150000, twParkType: "Open", twParkPrice: 0, total: 4376000, reg: 271312, gst: 43760, finalTotal: 4376000, totalWithRegGst: 4691072, categories: ["2bhk", "west", "sold"] },
      { id: "412", flatNo: "412", block: "Block A", floor: "4th Floor", type: "1 BHK + 1T", facing: "East", status: "Sold", sqft: 425, uds: 208, basePrice: 2210000, otherCharges: 127500, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2512500, reg: 155775, gst: 25125, finalTotal: 2512500, totalWithRegGst: 2693400, categories: ["1bhk", "east", "sold"] },
      { id: "413", flatNo: "413", block: "Block A", floor: "4th Floor", type: "1 BHK + 1T", facing: "East", status: "Sold", sqft: 419, uds: 206, basePrice: 2178800, otherCharges: 125700, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2479500, reg: 153729, gst: 24795, finalTotal: 2479500, totalWithRegGst: 2658024, categories: ["1bhk", "east", "sold"] },
      { id: "414", flatNo: "414", block: "Block A", floor: "4th Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 491, uds: 241, basePrice: 2553200, otherCharges: 147300, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2875500, reg: 178281, gst: 28755, finalTotal: 2875500, totalWithRegGst: 3082536, categories: ["1bhk", "east", "unsold"] },
      { id: "415", flatNo: "415", block: "Block A", floor: "4th Floor", type: "1 BHK + 1T", facing: "East", status: "Sold", sqft: 391, uds: 192, basePrice: 2033200, otherCharges: 117300, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2325500, reg: 144181, gst: 23255, finalTotal: 2325500, totalWithRegGst: 2492936, categories: ["1bhk", "east", "sold"] },
      { id: "416", flatNo: "416", block: "Block A", floor: "4th Floor", type: "1 BHK + 1T", facing: "East", status: "Sold", sqft: 408, uds: 200, basePrice: 2121600, otherCharges: 122400, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2419000, reg: 149978, gst: 24190, finalTotal: 2419000, totalWithRegGst: 2593168, categories: ["1bhk", "east", "sold"] },
      { id: "417", flatNo: "417", block: "Block A", floor: "4th Floor", type: "1 BHK + 1T", facing: "West", status: "Sold", sqft: 460, uds: 226, basePrice: 2392000, otherCharges: 138000, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2705000, reg: 167710, gst: 27050, finalTotal: 2705000, totalWithRegGst: 2899760, categories: ["1bhk", "west", "sold"] },
      { id: "418", flatNo: "418", block: "Block A", floor: "4th Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 440, uds: 216, basePrice: 2288000, otherCharges: 132000, ebStp: 150000, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2595000, reg: 160890, gst: 25950, finalTotal: 2595000, totalWithRegGst: 2781840, categories: ["1bhk", "west", "unsold"] },

      // ============================================================
      // Block A · 5th Floor
      // ============================================================
      { id: "501", flatNo: "501", block: "Block A", floor: "5th Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 730, uds: 359, basePrice: 3796000, otherCharges: 219000, ebStp: 200000, floorRise: 500000, carParkType: "Covered", carParkPrice: 150000, twParkType: "Open", twParkPrice: 0, total: 4865000, reg: 301630, gst: 48650, finalTotal: 4865000, totalWithRegGst: 5215280, categories: ["2bhk", "east", "unsold"] },
      { id: "502", flatNo: "502", block: "Block A", floor: "5th Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 730, uds: 359, basePrice: 3796000, otherCharges: 219000, ebStp: 200000, floorRise: 500000, carParkType: "Covered", carParkPrice: 150000, twParkType: "Open", twParkPrice: 0, total: 4865000, reg: 301630, gst: 48650, finalTotal: 4865000, totalWithRegGst: 5215280, categories: ["2bhk", "east", "unsold"] },
      { id: "503", flatNo: "503", block: "Block A", floor: "5th Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 425, uds: 209, basePrice: 2210000, otherCharges: 127500, ebStp: 150000, floorRise: 300000, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2812500, reg: 174375, gst: 28125, finalTotal: 2812500, totalWithRegGst: 3015000, categories: ["1bhk", "west", "unsold"] },
      { id: "504", flatNo: "504", block: "Block A", floor: "5th Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 419, uds: 206, basePrice: 2178800, otherCharges: 125700, ebStp: 150000, floorRise: 300000, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2779500, reg: 172329, gst: 27795, finalTotal: 2779500, totalWithRegGst: 2979624, categories: ["1bhk", "west", "unsold"] },
      { id: "505", flatNo: "505", block: "Block A", floor: "5th Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 491, uds: 241, basePrice: 2553200, otherCharges: 147300, ebStp: 150000, floorRise: 300000, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 3175500, reg: 196881, gst: 31755, finalTotal: 3175500, totalWithRegGst: 3404136, categories: ["1bhk", "west", "unsold"] },
      { id: "506", flatNo: "506", block: "Block A", floor: "5th Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 391, uds: 192, basePrice: 2033200, otherCharges: 117300, ebStp: 150000, floorRise: 300000, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2625500, reg: 162781, gst: 26255, finalTotal: 2625500, totalWithRegGst: 2814536, categories: ["1bhk", "west", "unsold"] },
      { id: "507", flatNo: "507", block: "Block A", floor: "5th Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 408, uds: 200, basePrice: 2121600, otherCharges: 122400, ebStp: 150000, floorRise: 300000, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2719000, reg: 168578, gst: 27190, finalTotal: 2719000, totalWithRegGst: 2914768, categories: ["1bhk", "west", "unsold"] },
      { id: "508", flatNo: "508", block: "Block A", floor: "5th Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 460, uds: 226, basePrice: 2392000, otherCharges: 138000, ebStp: 150000, floorRise: 300000, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 3005000, reg: 186310, gst: 30050, finalTotal: 3005000, totalWithRegGst: 3221360, categories: ["1bhk", "east", "unsold"] },
      { id: "509", flatNo: "509", block: "Block A", floor: "5th Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 440, uds: 216, basePrice: 2288000, otherCharges: 132000, ebStp: 150000, floorRise: 300000, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2895000, reg: 179490, gst: 28950, finalTotal: 2895000, totalWithRegGst: 3103440, categories: ["1bhk", "east", "unsold"] },
      { id: "510", flatNo: "510", block: "Block A", floor: "5th Floor", type: "2 BHK + 2T", facing: "West", status: "Unsold", sqft: 732, uds: 359, basePrice: 3806400, otherCharges: 219600, ebStp: 200000, floorRise: 500000, carParkType: "Covered", carParkPrice: 150000, twParkType: "Open", twParkPrice: 0, total: 4876000, reg: 302312, gst: 48760, finalTotal: 4876000, totalWithRegGst: 5227072, categories: ["2bhk", "west", "unsold"] },
      { id: "511", flatNo: "511", block: "Block A", floor: "5th Floor", type: "2 BHK + 2T", facing: "West", status: "Unsold", sqft: 732, uds: 359, basePrice: 3806400, otherCharges: 219600, ebStp: 200000, floorRise: 500000, carParkType: "Covered", carParkPrice: 150000, twParkType: "Open", twParkPrice: 0, total: 4876000, reg: 302312, gst: 48760, finalTotal: 4876000, totalWithRegGst: 5227072, categories: ["2bhk", "west", "unsold"] },
      { id: "512", flatNo: "512", block: "Block A", floor: "5th Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 425, uds: 208, basePrice: 2210000, otherCharges: 127500, ebStp: 150000, floorRise: 300000, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2812500, reg: 174375, gst: 28125, finalTotal: 2812500, totalWithRegGst: 3015000, categories: ["1bhk", "east", "unsold"] },
      { id: "513", flatNo: "513", block: "Block A", floor: "5th Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 419, uds: 206, basePrice: 2178800, otherCharges: 125700, ebStp: 150000, floorRise: 300000, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2779500, reg: 172329, gst: 27795, finalTotal: 2779500, totalWithRegGst: 2979624, categories: ["1bhk", "east", "unsold"] },
      { id: "514", flatNo: "514", block: "Block A", floor: "5th Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 491, uds: 241, basePrice: 2553200, otherCharges: 147300, ebStp: 150000, floorRise: 300000, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 3175500, reg: 196881, gst: 31755, finalTotal: 3175500, totalWithRegGst: 3404136, categories: ["1bhk", "east", "unsold"] },
      { id: "515", flatNo: "515", block: "Block A", floor: "5th Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 391, uds: 192, basePrice: 2033200, otherCharges: 117300, ebStp: 150000, floorRise: 300000, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2625500, reg: 162781, gst: 26255, finalTotal: 2625500, totalWithRegGst: 2814536, categories: ["1bhk", "east", "unsold"] },
      { id: "516", flatNo: "516", block: "Block A", floor: "5th Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 408, uds: 200, basePrice: 2121600, otherCharges: 122400, ebStp: 150000, floorRise: 300000, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2719000, reg: 168578, gst: 27190, finalTotal: 2719000, totalWithRegGst: 2914768, categories: ["1bhk", "east", "unsold"] },
      { id: "517", flatNo: "517", block: "Block A", floor: "5th Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 460, uds: 226, basePrice: 2392000, otherCharges: 138000, ebStp: 150000, floorRise: 300000, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 3005000, reg: 186310, gst: 30050, finalTotal: 3005000, totalWithRegGst: 3221360, categories: ["1bhk", "west", "unsold"] },
      { id: "518", flatNo: "518", block: "Block A", floor: "5th Floor", type: "1 BHK + 1T", facing: "West", status: "Unsold", sqft: 440, uds: 216, basePrice: 2288000, otherCharges: 132000, ebStp: 150000, floorRise: 300000, carParkType: "", carParkPrice: 0, twParkType: "Covered", twParkPrice: 25000, total: 2895000, reg: 179490, gst: 28950, finalTotal: 2895000, totalWithRegGst: 3103440, categories: ["1bhk", "west", "unsold"] },
    ],

    // Fallback flat tabs (used only if floorPlanBlocks is removed)
    floorPlanTabs: [],
    floorPlans: [],

    galleryHeading: ["A Glimpse", "Into Your", "Tomorrow"],
    galleryCtaHref: "#gallery",
    galleryFilters: ["All", "Exteriors", "Interiors", "Amenities", "Lifestyle"],
    galleryImages: [
      { id: "g1", image: "/gurudevangle.webp", title: "Aerial View", category: "Exteriors", size: "large" },
      { id: "g2", image: "/gurudev2.webp", title: "Elevation View — Block A", category: "Exteriors", size: "small" },
      { id: "g3", image: "/gurudev3.webp", category: "Amenities", size: "small" },
    ],

    gallery: ["/gallery.jpeg", "/gallery/gallery2.png", "/gallery/gallery3.jpeg"],
    floors: "Stilt + 5",
    totalUnits: 90,
    unitTypes: [
      { type: "1 BHK", count: 70, sizeRange: "391 - 460 sqft" },
      { type: "2 BHK", count: 20, sizeRange: "730 - 732 sqft" },
    ],
    nearbyLandmarks: [
      { name: "Guduvancheri Railway Station", distance: "" },
      { name: "GST Road", distance: "" },
      { name: "Chennai Trade Centre", distance: "" },
    ],
    possession: "TODO: add possession/completion date",
    reraId: "TODO: add RERA ID",

    // ---------- Brochure (shown after the enquiry form is submitted) ----------
    // File must exist at: public/brochures/gurudev.pdf
    brochureUrl: "/brochures/gurudev.pdf",

    // ---------- Gurudev-specific Quick Facts (6 cards) ----------
    quickFacts: [
      { label: "Type",              value: "1 & 2 BHK Apartments",         icon: "type" },
      { label: "Development Size",  value: "68 Cents",                  icon: "size" },
      { label: "No. of Units",      value: "90",                           icon: "units" },
      { label: "Price / Sq.Ft",     value: "₹ 6199 per / Sq.Ft",           icon: "price" },
      { label: "Floors",            value: "Stilt + 5",                    icon: "floors" },
      { label: "RERA Number",       value: "TN/01/Building/0041/2023 | Dtd. 20/01/2023",       icon: "rera" },
    ],

    specifications: [
      {
        title: "Structure",
        items: [
          { label: "Structural system", value: "RCC Framed Structure designed for seismic compliance (Zone 3)" },
          { label: "Masonry", value: "200 mm for external walls, 100 mm for internal walls" },
          { label: "Floor-Floor height (incl. slab)", value: "3000 mm" },
          { label: "ATT", value: "Anti-termite treatment will be done" },
        ],
      },
      {
        title: "Wall Finish",
        items: [
          { label: "Internal walls", value: "Living, Dining, Bedrooms, Kitchen, Utility & lobby finished with 2 coat putty, 1 coat primer, 2 coats emulsion paint" },
          { label: "Exterior walls", value: "1 coat primer and 2 coats emulsion paint as per architect design" },
          { label: "Bathroom", value: "Glazed ceramic tile up to false ceiling height (300 x 600 mm), above finished with primer" },
          { label: "Kitchen", value: "Ceramic wall tile 300 x 600 mm for 600 mm above counter top" },
          { label: "Toilet ceiling", value: "Grid type false ceiling" },
        ],
      },
      {
        title: "Floor Finish with Skirting",
        items: [
          { label: "Foyer, Living, Dining, Bedrooms & Kitchen", value: "Vitrified tiles 600 x 600 mm" },
          { label: "Bathroom", value: "Anti-skid ceramic tiles 300 x 300 mm" },
          { label: "Balcony", value: "Anti-skid ceramic tiles 300 x 300 mm" },
        ],
      },
      {
        title: "Kitchen & Dining",
        items: [
          { label: "Kitchen", value: "Granite slab platform, 600 mm wide, 800 mm from finished floor level" },
          { label: "Electrical point", value: "For chimney & water purifier" },
          { label: "CP Fitting", value: "Pull out tap of Indian Standard / Parryware or equivalent" },
          { label: "Sink", value: "Quartz single bowl with drain board" },
        ],
      },
      { title: "Balcony", items: [{ label: "Handrail", value: "MS handrail as per architect's design" }] },
      {
        title: "Bathrooms",
        items: [
          { label: "Sanitary Fixture", value: "Indian Standard / Parryware or equivalent" },
          { label: "CP fittings", value: "Indian Standard / Parryware or equivalent" },
          { label: "Bathrooms", value: "Floor mounted WC with cistern, health faucet, single lever diverter" },
        ],
      },
      {
        title: "Joinery",
        items: [
          { label: "Main Door", value: "3'6\" x 7'0\" teak wood frame & laminated shutters with architrave, magnetic catcher, tower bolt" },
          { label: "Bedroom doors", value: "Engineered door frame, double side laminated shutters (3'0\" x 7'0\"), Godrej/equivalent locks" },
          { label: "Bathroom door", value: "Engineered door frame with WPC shutters (2'6\" x 7'0\"), thumb turn lock with tower bolt" },
        ],
      },
      {
        title: "Windows",
        items: [
          { label: "Windows", value: "Powder coated aluminum or UPVC, sliding shutter, plain glass, MS grills on inner side" },
          { label: "French doors", value: "Powder coated aluminum frame with toughened glass, no grills" },
          { label: "Ventilators", value: "Powder coated aluminum, fixed/adjustable louvered/openable shutter" },
        ],
      },
      {
        title: "Electrical Points",
        items: [
          { label: "Power Supply", value: "3 phase power supply connection" },
          { label: "Safety Device", value: "MCB & ELCB (Earth Leakage Circuit Breaker)" },
          { label: "Switches & Sockets", value: "Anchor Roma / Schneider / ABB or equivalent" },
          { label: "Wires", value: "FRLS copper wire, KEI / Polycab or equivalent" },
          { label: "TV & Telephone", value: "Point in living room" },
          { label: "Mobile Charging Dock", value: "Provided in living room" },
          { label: "Split A/C", value: "Point provided in living & all bedrooms" },
        ],
      },
      {
        title: "Common Features",
        items: [
          { label: "Lift", value: "6-passenger automatic elevator" },
          { label: "Name board", value: "Apartment owner name provided in stilt" },
          { label: "Lift Fascia & Lobby", value: "Detailed with tiles, Granite jambs, designer tile flooring in all floors" },
          { label: "Lobby & Corridor", value: "Stilt floor granite flooring, typical floors with tiles" },
          { label: "Staircase floor", value: "Stilt floor granite, typical floors Kota / Shahbadth / Tile" },
          { label: "Staircase handrail", value: "MS handrail with enamel paint on all floors" },
          { label: "Stilt Flooring", value: "Paver block flooring with car park numbers marked in paint" },
          { label: "Terrace floor", value: "Cooling weathering tiles" },
        ],
      },
      {
        title: "Outdoor Features",
        items: [
          { label: "Water storage", value: "UG sump with WTP (as per water test report)" },
          { label: "Rain water harvest", value: "Rain water harvesting site" },
          { label: "STP", value: "Centralized Sewage Treatment plant" },
          { label: "Safety", value: "CCTV surveillance at pivotal locations in stilt" },
          { label: "Well defined driveway", value: "Interlocking paver block all-round with demarcated driveway" },
          { label: "Security", value: "Security booth at the entrance" },
          { label: "Compound wall", value: "Perimeter fenced, 1500 mm height, with entry gates" },
          { label: "Landscape", value: "Suitable landscape at appropriate places" },
          { label: "Driveway", value: "Convex mirror for safe turning in driveway" },
        ],
      },
    ],

    locationHeading: ["Well Connected", "for a Brighter You"],
    locationDescription:
      "Gurudev gives you the gift of time by offering apartments near Guduvancheri Railway Station, with superior connectivity. Living near MEPZ, Siruseri IT Park and Mahindra World City lets you strike the right work-life balance.",
    locationMapUrl: "https://maps.google.com/?q=Gurudev+Guduvancheri",
    locationMapImage: "",
    // ✅ UPDATED: New Google Maps embed URL for Gurudev
    locationMapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.429674817847!2d80.08094917585561!3d12.815487918280196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52f7ad0f45d7c3%3A0xfafdd8623a0ace37!2spkr%20estates%20GURUDEV!5e0!3m2!1sen!2sin!4v1790074260318!5m2!1sen!2sin",
    locationLandmarks: [
      { label: "Guduvancheri (GST Road)", distance: "5 mins" },
      { label: "Urapakkam", distance: "10 mins" },
      { label: "Vandalur", distance: "10 mins" },
      { label: "Perungalathur", distance: "15 mins" },
      { label: "OMR - Thiruporur", distance: "15 mins" },
      { label: "Tambaram", distance: "20 mins" },
    ],
    nearbyColleges: [
      { label: "Apollo Arts & Science College", distance: "8 mins" },
      { label: "SRM University", distance: "8 mins" },
      { label: "Shri Sathya Sai Medical College", distance: "10 mins" },
      { label: "Crescent Engineering College", distance: "12 mins" },
      { label: "Tagore Engineering College", distance: "14 mins" },
      { label: "Peri Institute of Technology", distance: "15 mins" },
      { label: "VIT University", distance: "20 mins" },
    ],
    nearbySchools: [
      { label: "Velammal Vidhyashram CBSE", distance: "2 mins" },
      { label: "Eden Kidspark", distance: "3 mins" },
      { label: "SRI MA Vidyalaya CBSE", distance: "3 mins" },
      { label: "SRM Public School CBSE", distance: "5 mins" },
      { label: "Akshra Mandir Primary School", distance: "5 mins" },
      { label: "St Johns Matric School", distance: "8 mins" },
      { label: "PSBB Millennium School CBSE", distance: "10 mins" },
    ],

    // ---------- 360 Cinematic Tour ----------
    tourEyebrow: "EXPLORE BEFORE YOU BELONG",
    tourHeading: ["Experience Gurudev", "in 360°"],
    tourDescription:
      "Take a virtual tour and explore the spaces, views and lifestyle that await you. Get a real feel of Gurudev from anywhere, anytime.",
    tourCtaLabel: "Start 360° Tour",
    tourThumbnail: "/gurudevthumb.png",
    tour360Image: "/360.png",
    tourUrl: "https://example.com/gurudev-360-tour",
    tourTagline: ["See it,", "Feel it,", "Live it."],

    corporateOffice: {
      lines: ["Flat A10, Archana Castle, 4/23 Patrick Church Road,", "St. Thomas Mount, Chennai 600016"],
      phone: "95 43 63 33 33",
      website: "www.pkrestates.com",
    },
  },

  // ============================================================
  // PRIVANA
  // ============================================================
  {
    slug: "privana",
    name: "Privana",
    tagline: "Modern living, thoughtfully designed for the way you live today",
    location: "Chennai, Tamil Nadu",
    heroImage: "/privv.webp",
    heroImageMobile: "/privmob.webp",
    aboutImage: "/2nd.png",

    eyebrow: "MORE THAN JUST A HOME",
    heading: ["Designed for a", "Better Way of Life"],
    description:
      "Privana brings together contemporary architecture, premium finishes and a thoughtfully curated set of amenities in one refined residential address. Every home is planned around natural light, cross ventilation and efficient layouts, giving you more usable space and a calmer everyday rhythm.",
    ctaLabel: "OUR STORY",
    ctaHref: "#our-story",
    overlayWords: ["Live", "Connect", "Belong"],
    overlayAt: "Privana",

    salientFeatures: [
      "Thoughtfully designed Studio, 1 & 2 BHK homes",
      "Multiple blocks with dedicated unit types",
      "Vaastu-compliant layouts with abundant natural light",
      "Close to schools, IT parks, hospitals and retail",
    ],

    stats: [
      { id: "years", value: "77+", label: "YEARS OF TRUST" },
      { id: "projects", value: "120+", label: "LANDMARK PROJECTS" },
      { id: "sqft", value: "7M+", label: "SQ.FT. SPACE DELIVERED" },
      { id: "communities", value: "44+", label: "HAPPY COMMUNITIES" },
    ],

    // ---------- Amenities (Privana) ----------
    amenitiesEyebrow: "LIFE AT PRIVANA",
    amenitiesHeading: ["Everyday Comforts,", "Exceptional Living"],
    amenitiesDescription:
      "At Privana, every amenity is designed to make daily life easier and more enjoyable — from landscaped green spaces to a full suite of community facilities for every age group.",
    amenitiesCtaLabel: "VIEW ALL AMENITIES",
    amenitiesCtaHref: "#amenities",
    amenities: [
      {
        id: "Outdoor Movie Nights",
        image: "/amenities/moorthy.png",
        title: "Outdoor Movie Nights",
        tagline: "Stories Under The Stars",
        description:
          "An open-air screening area where residents gather under the stars to enjoy movies, fostering a warm and connected community spirit.",
        tags: ["Entertainment", "Community", "Open Air"],
      },
      {
        id: "Party Hall",
        image: "/amenities/privana1.webp",
        title: "Party Hall",
        tagline: "Celebrate In Style",
        description:
          "A sophisticated and spacious venue designed to host memorable celebrations, from grand weddings to intimate gatherings, with elegance and ease.",
        tags: ["Events", "Celebrations", "Elegant"],
      },
      {
        id: "club",
        image: "/amenities/privana2.webp",
        title: "Club House",
        tagline: "Gather & Celebrate",
        description:
          "A dedicated indoor space for leisure and fun, featuring games like billiards and chess for residents to unwind and connect.",
        tags: ["Events", "Community", "Social"],
      },
      {
        id: "Gym",
        image: "/amenities/privana3.webp",
        title: "Gym",
        tagline: "Stay Fit, Stay Strong",
        description:
          "A fully-equipped space designed to help you stay active, build strength, and reach your fitness goals without leaving the community.",
        tags: ["Fitness", "Strength", "Wellness"],
      },
      {
        id: "Little Explore's",
        image: "/amenities/privana4.webp",
        title: "Little Explore's",
        tagline: "Play. Learn. Grow.",
        description:
          "A vibrant, safe, and thoughtfully designed indoor space where children can explore, imagine, and play freely.",
        tags: ["Safe Play", "Kid Friendly", "Fun"],
      },
      {
        id: "Elevators",
        image: "/amenities/privana5.webp",
        title: "Elevators",
        tagline: "Effortless Access",
        description:
          "High-speed, spacious elevators ensuring smooth and effortless access to every floor, making daily commutes comfortable for all residents.",
        tags: ["Convenience", "Safety", "Accessibility"],
      },
      {
        id: "Basketball Court",
        image: "/amenities/privana7.webp",
        title: "Basketball Court",
        tagline: "Shoot Hoops & Stay Active",
        description:
          "A well-maintained outdoor court for residents to shoot hoops, stay active, and enjoy friendly matches with neighbours.",
        tags: ["Sports", "Active Lifestyle", "Outdoor"],
      },
    ],

    floorPlansHeading: ["Homes Tailored", "to Your Needs"],
    floorPlansDescription:
      "Choose from a range of thoughtfully designed layouts across multiple blocks — from efficient studios to spacious 2 BHK homes, each crafted for comfort and functionality.",
    floorPlansCtaLabel: "VIEW ALL PLANS",
    floorPlansCtaHref: "#floor-plans",

    // ---------- Nested Block structure ----------
    floorPlanBlocks: [
      {
        id: "block-a",
        label: "Block A",
        tag: "Under construction",
        tabs: ["Studio", "1 BHK", "2 BHK", "2 BHK + 2T"],
        plans: [
          // Studio
          {
            id: "a-studio-105",
            image: "/floorplans/privana/studio/A105.png",
            title: "Studio · Unit A105",
            type: "Studio",
            area: "—",
            href: "#",
            facing: "East",
            features: [
              { icon: "bed", label: "Studio Room" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living / Kitchenette" },
            ],
          },
          {
            id: "a-studio-112",
            image: "/floorplans/privana/studio/A112.png",
            title: "Studio · Unit A112",
            type: "Studio",
            area: "—",
            href: "#",
            facing: "West",
            features: [
              { icon: "bed", label: "Studio Room" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living / Kitchenette" },
            ],
          },
          {
            id: "a-studio-209-509",
            image: "/floorplans/privana/studio/A209-A509.png",
            title: "Studio · Units A209–A509",
            type: "Studio",
            area: "—",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "Studio Room" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living / Kitchenette" },
            ],
          },
          {
            id: "a-studio-216-516",
            image: "/floorplans/privana/studio/A216-A516.png",
            title: "Studio · Units A216–A516",
            type: "Studio",
            area: "—",
            href: "#",
            facing: "West",
            features: [
              { icon: "bed", label: "Studio Room" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living / Kitchenette" },
            ],
          },

          // 1 BHK
          {
            id: "a-1bhk-106",
            image: "/floorplans/privana/A106.png",
            title: "1 BHK · Unit A106",
            type: "1 BHK",
            area: "—",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "a-1bhk-109",
            image: "/floorplans/privana/A109.png",
            title: "1 BHK · Unit A109",
            type: "1 BHK",
            area: "—",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "a-1bhk-207-507",
            image: "/floorplans/privana/A207-A507.png",
            title: "1 BHK · Units A207–A507",
            type: "1 BHK",
            area: "—",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "a-1bhk-210-510",
            image: "/floorplans/privana/A210-A510.png",
            title: "1 BHK · Units A210–A510",
            type: "1 BHK",
            area: "—",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "a-1bhk-213-513",
            image: "/floorplans/privana/A213-A513.png",
            title: "1 BHK · Units A213–A513",
            type: "1 BHK",
            area: "—",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },

          // 2 BHK
          {
            id: "a-2bhk-102",
            image: "/floorplans/privana/block-b/2bhk1t/B102.png",
            title: "2 BHK · Unit B102",
            type: "2 BHK",
            area: "—",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "a-2bhk-108",
            image: "/floorplans/privana/block-b/2bhk1t/B103.png",
            title: "2 BHK · Unit B103",
            type: "2 BHK",
            area: "—",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "a-2bhk-110",
            image: "/floorplans/privana/block-b/2bhk1t/B107-B507.png",
            title: "2 BHK · Unit B107-B507",
            type: "2 BHK",
            area: "—",
            href: "#",
            facing: "East",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "a-2bhk-206-506",
            image: "/floorplans/privana/block-b/2bhk1t/B202-B502.png",
            title: "2 BHK · Units B202-B502",
            type: "2 BHK",
            area: "—",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "a-2bhk-211-511",
            image: "/floorplans/privana/block-b/2bhk1t/B203-B503.png",
            title: "2 BHK · Units B203-B503",
            type: "2 BHK",
            area: "—",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          
          // 2 BHK + 2T
          {
            id: "a-2bhk2t-101-501",
            image: "/floorplans/privana/2bhk2t/A101-A501.png",
            title: "2 BHK + 2T · Units A101-A501",
            type: "2 BHK + 2T",
            area: "—",
            href: "#",
            facing: "East",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "a-2bhk2t-102-502",
            image: "/floorplans/privana/2bhk2t/A102-A502.png",
            title: "2 BHK + 2T · Units A102-A502",
            type: "2 BHK + 2T",
            area: "—",
            href: "#",
            facing: "East",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "a-2bhk2t-103",
            image: "/floorplans/privana/2bhk2t/A103.png",
            title: "2 BHK + 2T · Unit A103",
            type: "2 BHK + 2T",
            area: "—",
            href: "#",
            facing: "East",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          // {
          //   id: "a-2bhk2t-104-504",
          //   image: "/floorplans/privana/2bhk2t/A104-A504.png",
          //   title: "2 BHK + 2T · Units A104-A504",
          //   type: "2 BHK + 2T",
          //   area: "—",
          //   href: "#",
          //   facing: "East",
          //   features: [
          //     { icon: "bed", label: "2 Bedrooms" },
          //     { icon: "bath", label: "2 Toilets" },
          //     { icon: "living", label: "Living cum Dining" },
          //   ],
          // },
          {
            id: "a-2bhk2t-111",
            image: "/floorplans/privana/2bhk2t/A111.png",
            title: "2 BHK + 2T · Unit A111",
            type: "2 BHK + 2T",
            area: "—",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "a-2bhk2t-113",
            image: "/floorplans/privana/2bhk2t/A113.png",
            title: "2 BHK + 2T · Unit A113",
            type: "2 BHK + 2T",
            area: "—",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "a-2bhk2t-203-503",
            image: "/floorplans/privana/2bhk2t/A203-A503.png",
            title: "2 BHK + 2T · Units A203-A503",
            type: "2 BHK + 2T",
            area: "—",
            href: "#",
            facing: "East",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "a-2bhk2t-205",
            image: "/floorplans/privana/2bhk2t/A205.png",
            title: "2 BHK + 2T · Unit A205",
            type: "2 BHK + 2T",
            area: "—",
            href: "#",
            facing: "East",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "a-2bhk2t-208",
            image: "/floorplans/privana/2bhk2t/A208.png",
            title: "2 BHK + 2T · Unit B208",
            type: "2 BHK + 2T",
            area: "—",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "a-2bhk2t-215-515",
            image: "/floorplans/privana/2bhk2t/A215-A515.png",
            title: "2 BHK + 2T · Units A215-A515",
            type: "2 BHK + 2T",
            area: "—",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "a-2bhk2t-217-517",
            image: "/floorplans/privana/2bhk2t/A217-A517.png",
            title: "2 BHK + 2T · Units B217-B517",
            type: "2 BHK + 2T",
            area: "—",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "a-2bhk2t-305-505",
            image: "/floorplans/privana/2bhk2t/A305-A505.png",
            title: "2 BHK + 2T · Units A305-A505",
            type: "2 BHK + 2T",
            area: "—",
            href: "#",
            facing: "East",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          
        ],
      },
      {
        id: "block-b",
        label: "Block B",
        tag: "Under Construction",
        tabs: ["1 BHK", "2 BHK 1T", "2 BHK 2T", "3 BHK"],
        plans: [
          // 1 BHK
          {
            id: "b-1bhk-106",
            image: "/floorplans/privana/block-b/1bhk/B106-B506.png",
            title: "1 BHK · Unit B106 - B506",
            type: "1 BHK",
            area: "669 sq.ft",
            href: "#",
            facing: "East",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "b-1bhk-108",
            image: "/floorplans/privana/block-b/1bhk/B108.png",
            title: "1 BHK · Unit B108",
            type: "1 BHK",
            area: "737 sq.ft",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "b-1bhk-109-509",
            image: "/floorplans/privana/block-b/1bhk/B109-B509.png",
            title: "1 BHK · Units B109–B509",
            type: "1 BHK",
            area: "722 sq.ft",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "b-1bhk-110",
            image: "/floorplans/privana/block-b/1bhk/B110.png",
            title: "1 BHK · Unit B110",
            type: "1 BHK",
            area: "726 sq.ft",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "b-1bhk-111",
            image: "/floorplans/privana/block-b/1bhk/B111.png",
            title: "1 BHK · Unit B111",
            type: "1 BHK",
            area: "617 sq.ft",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "b-1bhk-112",
            image: "/floorplans/privana/block-b/1bhk/B112.png",
            title: "1 BHK · Unit B112",
            type: "1 BHK",
            area: "668 sq.ft",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "b-1bhk-114",
            image: "/floorplans/privana/block-b/1bhk/B114.png",
            title: "1 BHK · Unit B114",
            type: "1 BHK",
            area: "791 sq.ft",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "b-1bhk-115",
            image: "/floorplans/privana/block-b/1bhk/B115.png",
            title: "1 BHK · Unit B115",
            type: "1 BHK",
            area: "626 sq.ft",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "b-1bhk-116",
            image: "/floorplans/privana/block-b/1bhk/B116.png",
            title: "1 BHK · Unit B116",
            type: "1 BHK",
            area: "573 sq.ft",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "b-1bhk-208-508",
            image: "/floorplans/privana/block-b/1bhk/B208-B508.png",
            title: "1 BHK · Units B208–B508",
            type: "1 BHK",
            area: "737 sq.ft",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "b-1bhk-210-510",
            image: "/floorplans/privana/block-b/1bhk/B210-B510.png",
            title: "1 BHK · Units B210–B510",
            type: "1 BHK",
            area: "726 sq.ft",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "b-1bhk-211-511",
            image: "/floorplans/privana/block-b/1bhk/B211-B511.png",
            title: "1 BHK · Units B211–B511",
            type: "1 BHK",
            area: "617 sq.ft",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "b-1bhk-212-512",
            image: "/floorplans/privana/block-b/1bhk/B212-B512.png",
            title: "1 BHK · Units B212–B512",
            type: "1 BHK",
            area: "668 sq.ft",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "b-1bhk-214-514",
            image: "/floorplans/privana/block-b/1bhk/B214-b514.png",
            title: "1 BHK · Units B214–B514",
            type: "1 BHK",
            area: "791 sq.ft",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "b-1bhk-215-515",
            image: "/floorplans/privana/block-b/1bhk/B215-A515.png",
            title: "1 BHK · Units B215–B515",
            type: "1 BHK",
            area: "626 sq.ft",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },
          {
            id: "b-1bhk-216-516",
            image: "/floorplans/privana/block-b/1bhk/B216-B516.png",
            title: "1 BHK · Units B216–B516",
            type: "1 BHK",
            area: "618 sq.ft",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "1 Bedroom" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living Room / Kitchen" },
            ],
          },

          // 2 BHK 1T
          {
            id: "b-2bhk1t-102",
            image: "/floorplans/privana/block-b/2bhk1t/B102.png",
            title: "2 BHK + 1T · Unit B102",
            type: "2 BHK 1T",
            area: "984 sq.ft",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "b-2bhk1t-103",
            image: "/floorplans/privana/block-b/2bhk1t/B103.png",
            title: "2 BHK + 1T · Unit B103",
            type: "2 BHK 1T",
            area: "952 sq.ft",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "b-2bhk1t-107-507",
            image: "/floorplans/privana/block-b/2bhk1t/B107-B507.png",
            title: "2 BHK + 1T · Unit B107-B507",
            type: "2 BHK 1T",
            area: "1049 sq.ft",
            href: "#",
            facing: "East",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "b-2bhk1t-202-502",
            image: "/floorplans/privana/block-b/2bhk1t/B202-B502.png",
            title: "2 BHK + 1T · Units B202–B502",
            type: "2 BHK 1T",
            area: "984 sq.ft",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "b-2bhk1t-203-503",
            image: "/floorplans/privana/block-b/2bhk1t/B203-B503.png",
            title: "2 BHK + 1T · Units B203–B503",
            type: "2 BHK 1T",
            area: "952 sq.ft",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "1 Toilet" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },

          // 2 BHK 2T
          {
            id: "b-2bhk2t-101",
            image: "/floorplans/privana/block-b/2bhk2t/B101.png",
            title: "2 BHK + 2T · Unit B101",
            type: "2 BHK 2T",
            area: "1280 sq.ft",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "b-2bhk2t-104-504",
            image: "/floorplans/privana/block-b/2bhk2t/B104-B504.png",
            title: "2 BHK + 2T · Unit B104-B504",
            type: "2 BHK 2T",
            area: "932 sq.ft",
            href: "#",
            facing: "East",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "b-2bhk2t-105-505",
            image: "/floorplans/privana/block-b/2bhk2t/B105-B505.png",
            title: "2 BHK + 2T · Unit B105-B505",
            type: "2 BHK 2T",
            area: "932 sq.ft",
            href: "#",
            facing: "East",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "b-2bhk2t-113",
            image: "/floorplans/privana/block-b/2bhk2t/B113.png",
            title: "2 BHK + 2T · Unit B113",
            type: "2 BHK 2T",
            area: "976 sq.ft",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "b-2bhk2t-117",
            image: "/floorplans/privana/block-b/2bhk2t/B117.png",
            title: "2 BHK + 2T · Unit B117",
            type: "2 BHK 2T",
            area: "976 sq.ft",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "b-2bhk2t-118",
            image: "/floorplans/privana/block-b/2bhk2t/B118.png",
            title: "2 BHK + 2T · Unit B118",
            type: "2 BHK 2T",
            area: "976 sq.ft",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "b-2bhk2t-119",
            image: "/floorplans/privana/block-b/2bhk2t/B119.png",
            title: "2 BHK + 2T · Units B119",
            type: "2 BHK 2T",
            area: "1011 sq.ft",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "b-2bhk2t-201-501",
            image: "/floorplans/privana/block-b/2bhk2t/B201-B501.png",
            title: "2 BHK + 2T · Units B201–B501",
            type: "2 BHK 2T",
            area: "1280 sq.ft",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "b-2bhk2t-213-513",
            image: "/floorplans/privana/block-b/2bhk2t/B213-B513.png",
            title: "2 BHK + 2T · Units B213–B513",
            type: "2 BHK 2T",
            area: "879 sq.ft",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "b-2bhk2t-217-517",
            image: "/floorplans/privana/block-b/2bhk2t/B217-B517.png",
            title: "2 BHK + 2T · Units B217–B517",
            type: "2 BHK 2T",
            area: "976 sq.ft",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
          {
            id: "b-2bhk2t-218-518",
            image: "/floorplans/privana/block-b/2bhk2t/B218-B518.png",
            title: "2 BHK + 2T · Units B218–B518",
            type: "2 BHK 2T",
            area: "976 sq.ft",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },

          {
            id: "b-2bhk2t-219-519",
            image: "/floorplans/privana/block-b/2bhk2t/B219-B519.png",
            title: "2 BHK + 2T · Units B219–B519",
            type: "2 BHK 2T",
            area: "1011 sq.ft",
            href: "#",
            facing: "North",
            features: [
              { icon: "bed", label: "2 Bedrooms" },
              { icon: "bath", label: "2 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },

          // 3 BHK
          {
            id: "b-3bhk-104-504",
            image: "/floorplans/privana/block-b/3bhk/B104-B504.png",
            title: "3 BHK · Unit B104-B504",
            type: "3 BHK",
            area: "1200 sq.ft",
            href: "#",
            facing: "South",
            features: [
              { icon: "bed", label: "3 Bedrooms" },
              { icon: "bath", label: "3 Toilets" },
              { icon: "living", label: "Living cum Dining" },
            ],
          },
        ],
      },
    ],

    // ---------- Unit Sizes & Pricing (Privana — from PRIVANA PRE-LAUNCH PRICE LIST.xlsx) ----------
    // Rates as per price list:
    //   Flat price @ ₹5,200/sq.ft · I&A charges @ ₹300/sq.ft · Amenities @ ₹300/sq.ft
    //   EB, STP & other connection charges @ ₹200/sq.ft · Pvt terrace @ ₹3,000/sq.ft
    //   total          = flat price + I&A + amenities + EB/STP + pvt terrace   (regular price)
    //   prelaunchPrice = flat price @ ₹5,200 + pvt terrace @ ₹2,000            (pre-launch offer)
    //   finalTotal     = prelaunchPrice (registration, GST, car park, corpus & maintenance are extra —
    //                    see plotPricingAdditionalCharges below)
    plotPricingEyebrow: "PRE-LAUNCH OFFER",
    plotPricingHeading: ["Unit Sizes", "& Pricing"],
    plotPricingDescription:
      "Complete, transparent pre-launch pricing for every unit at Privana — all 176 homes and 10 shops across Blocks A & B, stilt + 5 floors. Flat price @ ₹5,200/sq.ft with I&A, amenities and EB/STP charges waived during pre-launch.",
    plotPricingCtaHeading: ["A Brighter", "Tomorrow Awaits"],
    plotPricingCtaText: "Lock in pre-launch pricing at Privana today.",
    plotPricingCtaImage: "/plot.png",
    plotPricingTabs: [
      { id: "all", label: "All Units" },
      { id: "studio", label: "Studio" },
      { id: "1bhk", label: "1 BHK" },
      { id: "2bhk", label: "2 BHK" },
      { id: "3bhk", label: "3 BHK" },
      { id: "shop", label: "Shops" },
      { id: "block-a", label: "Block A" },
      { id: "block-b", label: "Block B" },
    ],
    plotPricingAdditionalCharges: [
      { label: "Car Parking — Covered", value: "₹ 3,00,000" },
      { label: "Car Parking — Open", value: "₹ 2,00,000" },
      { label: "Corpus Fund", value: "₹ 50 per sq.ft (during handover)" },
      { label: "Maintenance", value: "₹ 30 per sq.ft (1st year)" },
      { label: "Registration", value: "6% up to ₹50 lakhs · 7% above ₹50 lakhs" },
      { label: "GST", value: "1% up to ₹45 lakhs · 5% above" },
    ],
// ---------- Unit Sizes & Pricing (Privana — from PRIVANA_PRE_LAUNCH_PRICE_LIST.xlsx) ----------
    // Rates as per price list:
    //   Flat price @ Rs 5,200/sq.ft (SHOPS @ Rs 7,200/sq.ft) · I&A @ Rs 300/sq.ft · Amenities @ Rs 300/sq.ft
    //   EB, STP & other connection charges @ Rs 200/sq.ft · Pvt terrace @ Rs 3,000/sq.ft
    //   total        = flat price + I&A + amenities + EB/STP + pvt terrace   (regular price, "TOTAL (Rs)" column)
    //   offerPrice   = "Pre Luanch Price" column = prelaunch flat price + pvt terrace @ Rs 2,000/sq.ft
    //   finalTotal   = offerPrice (registration, GST, car park, corpus & maintenance are extra —
    //                  see plotPricingAdditionalCharges)
    plotPricing: [
      // ============================================================
      // Block A · 1st Floor
      // ============================================================
      { id: "A101", flatNo: "A101", block: "Block A", floor: "1st Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1259, uds: 436, pvtTerrace: 0, basePrice: 6544863, iaCharges: 377588, amenitiesCharges: 377588, otherCharges: 755176, ebStp: 251725, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7551765, prelaunchOffer: 6544863, pvtTerraceOfferPrice: 0, prelaunchPrice: 6544863, offerPrice: 6544863, reg: 0, gst: 0, finalTotal: 6544863, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A102", flatNo: "A102", block: "Block A", floor: "1st Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1073, uds: 371, pvtTerrace: 0, basePrice: 5577408, iaCharges: 321774, amenitiesCharges: 321774, otherCharges: 643548, ebStp: 214516, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6435471, prelaunchOffer: 5577408, pvtTerraceOfferPrice: 0, prelaunchPrice: 5577408, offerPrice: 5577408, reg: 0, gst: 0, finalTotal: 5577408, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A103", flatNo: "A103", block: "Block A", floor: "1st Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1163, uds: 403, pvtTerrace: 31.38, basePrice: 6048445, iaCharges: 348949, amenitiesCharges: 348949, otherCharges: 697898, ebStp: 232632, pvtTerracePrice: 94131, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7073106, prelaunchOffer: 6048445, pvtTerraceOfferPrice: 62754, prelaunchPrice: 6111199, offerPrice: 6111199, reg: 0, gst: 0, finalTotal: 6111199, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A104", flatNo: "A104", block: "Block A", floor: "1st Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1105, uds: 382, pvtTerrace: 0, basePrice: 5744119, iaCharges: 331391, amenitiesCharges: 331391, otherCharges: 662782, ebStp: 220928, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6627829, prelaunchOffer: 5744119, pvtTerraceOfferPrice: 0, prelaunchPrice: 5744119, offerPrice: 5744119, reg: 0, gst: 0, finalTotal: 5744119, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A105", flatNo: "A105", block: "Block A", floor: "1st Floor", type: "Studio", facing: "East", status: "Unsold", sqft: 469, uds: 162, pvtTerrace: 0, basePrice: 2437456, iaCharges: 140622, amenitiesCharges: 140622, otherCharges: 281244, ebStp: 93748, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 2812449, prelaunchOffer: 2437456, pvtTerraceOfferPrice: 0, prelaunchPrice: 2437456, offerPrice: 2437456, reg: 0, gst: 0, finalTotal: 2437456, categories: ["studio", "east", "block-a", "unsold"] },
      { id: "A106", flatNo: "A106", block: "Block A", floor: "1st Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 764, uds: 264, pvtTerrace: 80.77, basePrice: 3970395, iaCharges: 229061, amenitiesCharges: 229061, otherCharges: 458122, ebStp: 152708, pvtTerracePrice: 242319, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4823544, prelaunchOffer: 3970395, pvtTerraceOfferPrice: 161546, prelaunchPrice: 4131941, offerPrice: 4131941, reg: 0, gst: 0, finalTotal: 4131941, categories: ["1bhk", "north", "block-a", "unsold"] },
      { id: "A107", flatNo: "A107", block: "Block A", floor: "1st Floor", type: "2 BHK + 1T", facing: "North", status: "Unsold", sqft: 836, uds: 289, pvtTerrace: 230.59, basePrice: 4347932, iaCharges: 250842, amenitiesCharges: 250842, otherCharges: 501684, ebStp: 167228, pvtTerracePrice: 691759, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5708604, prelaunchOffer: 4347932, pvtTerraceOfferPrice: 461173, prelaunchPrice: 4809105, offerPrice: 4809105, reg: 0, gst: 0, finalTotal: 4809105, categories: ["2bhk", "north", "block-a", "unsold"] },
      { id: "A108", flatNo: "A108", block: "Block A", floor: "1st Floor", type: "2 BHK + 1T", facing: "South", status: "Unsold", sqft: 936, uds: 324, pvtTerrace: 143.79, basePrice: 4865674, iaCharges: 280712, amenitiesCharges: 280712, otherCharges: 561424, ebStp: 187141, pvtTerracePrice: 431357, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6045596, prelaunchOffer: 4865674, pvtTerraceOfferPrice: 287571, prelaunchPrice: 5153245, offerPrice: 5153245, reg: 0, gst: 0, finalTotal: 5153245, categories: ["2bhk", "south", "block-a", "unsold"] },
      { id: "A109", flatNo: "A109", block: "Block A", floor: "1st Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 759, uds: 263, pvtTerrace: 45.68, basePrice: 3944754, iaCharges: 227582, amenitiesCharges: 227582, otherCharges: 455164, ebStp: 151721, pvtTerracePrice: 137047, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4688687, prelaunchOffer: 3944754, pvtTerraceOfferPrice: 91365, prelaunchPrice: 4036119, offerPrice: 4036119, reg: 0, gst: 0, finalTotal: 4036119, categories: ["1bhk", "north", "block-a", "unsold"] },
      { id: "A110", flatNo: "A110", block: "Block A", floor: "1st Floor", type: "2 BHK + 1T", facing: "North", status: "Unsold", sqft: 840, uds: 291, pvtTerrace: 174.81, basePrice: 4367530, iaCharges: 251973, amenitiesCharges: 251973, otherCharges: 503946, ebStp: 167982, pvtTerracePrice: 524422, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5563879, prelaunchOffer: 4367530, pvtTerraceOfferPrice: 349615, prelaunchPrice: 4717144, offerPrice: 4717144, reg: 0, gst: 0, finalTotal: 4717144, categories: ["2bhk", "north", "block-a", "unsold"] },
      { id: "A111", flatNo: "A111", block: "Block A", floor: "1st Floor", type: "2 BHK + 2T", facing: "South", status: "Unsold", sqft: 962, uds: 333, pvtTerrace: 170.4, basePrice: 5003981, iaCharges: 288691, amenitiesCharges: 288691, otherCharges: 577382, ebStp: 192461, pvtTerracePrice: 511215, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6285039, prelaunchOffer: 5003981, pvtTerraceOfferPrice: 340810, prelaunchPrice: 5344791, offerPrice: 5344791, reg: 0, gst: 0, finalTotal: 5344791, categories: ["2bhk", "south", "block-a", "unsold"] },
      { id: "A112", flatNo: "A112", block: "Block A", floor: "1st Floor", type: "Studio", facing: "West", status: "Unsold", sqft: 389, uds: 135, pvtTerrace: 41.96, basePrice: 2023228, iaCharges: 116725, amenitiesCharges: 116725, otherCharges: 233450, ebStp: 77816, pvtTerracePrice: 125874, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 2460368, prelaunchOffer: 2023228, pvtTerraceOfferPrice: 83916, prelaunchPrice: 2107144, offerPrice: 2107144, reg: 0, gst: 0, finalTotal: 2107144, categories: ["studio", "west", "block-a", "unsold"] },
      { id: "A113", flatNo: "A113", block: "Block A", floor: "1st Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 1195, uds: 414, pvtTerrace: 66.47, basePrice: 6213514, iaCharges: 358472, amenitiesCharges: 358472, otherCharges: 716944, ebStp: 238981, pvtTerracePrice: 199403, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7368843, prelaunchOffer: 6213514, pvtTerraceOfferPrice: 132935, prelaunchPrice: 6346450, offerPrice: 6346450, reg: 0, gst: 0, finalTotal: 6346450, categories: ["2bhk", "north", "block-a", "unsold"] },
      // ============================================================
      // Block A · 2nd Floor
      // ============================================================
      { id: "A201", flatNo: "A201", block: "Block A", floor: "2nd Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1259, uds: 436, pvtTerrace: 0, basePrice: 6544863, iaCharges: 377588, amenitiesCharges: 377588, otherCharges: 755176, ebStp: 251725, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7551765, prelaunchOffer: 6544863, pvtTerraceOfferPrice: 0, prelaunchPrice: 6544863, offerPrice: 6544863, reg: 0, gst: 0, finalTotal: 6544863, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A202", flatNo: "A202", block: "Block A", floor: "2nd Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1073, uds: 371, pvtTerrace: 0, basePrice: 5577408, iaCharges: 321774, amenitiesCharges: 321774, otherCharges: 643548, ebStp: 214516, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6435471, prelaunchOffer: 5577408, pvtTerraceOfferPrice: 0, prelaunchPrice: 5577408, offerPrice: 5577408, reg: 0, gst: 0, finalTotal: 5577408, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A203", flatNo: "A203", block: "Block A", floor: "2nd Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1163, uds: 403, pvtTerrace: 0, basePrice: 6048445, iaCharges: 348949, amenitiesCharges: 348949, otherCharges: 697898, ebStp: 232632, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6978974, prelaunchOffer: 6048445, pvtTerraceOfferPrice: 0, prelaunchPrice: 6048445, offerPrice: 6048445, reg: 0, gst: 0, finalTotal: 6048445, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A204", flatNo: "A204", block: "Block A", floor: "2nd Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1105, uds: 382, pvtTerrace: 0, basePrice: 5744119, iaCharges: 331391, amenitiesCharges: 331391, otherCharges: 662782, ebStp: 220928, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6627829, prelaunchOffer: 5744119, pvtTerraceOfferPrice: 0, prelaunchPrice: 5744119, offerPrice: 5744119, reg: 0, gst: 0, finalTotal: 5744119, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A205", flatNo: "A205", block: "Block A", floor: "2nd Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1244, uds: 431, pvtTerrace: 53.16, basePrice: 6469839, iaCharges: 373260, amenitiesCharges: 373260, otherCharges: 746520, ebStp: 248840, pvtTerracePrice: 159490, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7624689, prelaunchOffer: 6469839, pvtTerraceOfferPrice: 106327, prelaunchPrice: 6576166, offerPrice: 6576166, reg: 0, gst: 0, finalTotal: 6576166, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A206", flatNo: "A206", block: "Block A", floor: "2nd Floor", type: "2 BHK + 1T", facing: "North", status: "Unsold", sqft: 1106, uds: 383, pvtTerrace: 0, basePrice: 5750162, iaCharges: 331740, amenitiesCharges: 331740, otherCharges: 663480, ebStp: 221160, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6634802, prelaunchOffer: 5750162, pvtTerraceOfferPrice: 0, prelaunchPrice: 5750162, offerPrice: 5750162, reg: 0, gst: 0, finalTotal: 5750162, categories: ["2bhk", "north", "block-a", "unsold"] },
      { id: "A207", flatNo: "A207", block: "Block A", floor: "2nd Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 808, uds: 280, pvtTerrace: 0, basePrice: 4203410, iaCharges: 242504, amenitiesCharges: 242504, otherCharges: 485008, ebStp: 161670, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4850088, prelaunchOffer: 4203410, pvtTerraceOfferPrice: 0, prelaunchPrice: 4203410, offerPrice: 4203410, reg: 0, gst: 0, finalTotal: 4203410, categories: ["1bhk", "north", "block-a", "unsold"] },
      { id: "A208", flatNo: "A208", block: "Block A", floor: "2nd Floor", type: "2 BHK + 2T", facing: "South", status: "Unsold", sqft: 1031, uds: 357, pvtTerrace: 59.29, basePrice: 5360625, iaCharges: 309267, amenitiesCharges: 309267, otherCharges: 618534, ebStp: 206178, pvtTerracePrice: 177864, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6363201, prelaunchOffer: 5360625, pvtTerraceOfferPrice: 118576, prelaunchPrice: 5479201, offerPrice: 5479201, reg: 0, gst: 0, finalTotal: 5479201, categories: ["2bhk", "south", "block-a", "unsold"] },
      { id: "A209", flatNo: "A209", block: "Block A", floor: "2nd Floor", type: "Studio", facing: "South", status: "Unsold", sqft: 517, uds: 179, pvtTerrace: 0, basePrice: 2685924, iaCharges: 154957, amenitiesCharges: 154957, otherCharges: 309914, ebStp: 103305, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3099143, prelaunchOffer: 2685924, pvtTerraceOfferPrice: 0, prelaunchPrice: 2685924, offerPrice: 2685924, reg: 0, gst: 0, finalTotal: 2685924, categories: ["studio", "south", "block-a", "unsold"] },
      { id: "A210", flatNo: "A210", block: "Block A", floor: "2nd Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 764, uds: 264, pvtTerrace: 0, basePrice: 3970395, iaCharges: 229061, amenitiesCharges: 229061, otherCharges: 458122, ebStp: 152708, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4581225, prelaunchOffer: 3970395, pvtTerraceOfferPrice: 0, prelaunchPrice: 3970395, offerPrice: 3970395, reg: 0, gst: 0, finalTotal: 3970395, categories: ["1bhk", "north", "block-a", "unsold"] },
      { id: "A211", flatNo: "A211", block: "Block A", floor: "2nd Floor", type: "2 BHK + 1T", facing: "North", status: "Unsold", sqft: 836, uds: 289, pvtTerrace: 0, basePrice: 4347932, iaCharges: 250842, amenitiesCharges: 250842, otherCharges: 501684, ebStp: 167228, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5016845, prelaunchOffer: 4347932, pvtTerraceOfferPrice: 0, prelaunchPrice: 4347932, offerPrice: 4347932, reg: 0, gst: 0, finalTotal: 4347932, categories: ["2bhk", "north", "block-a", "unsold"] },
      { id: "A212", flatNo: "A212", block: "Block A", floor: "2nd Floor", type: "2 BHK + 1T", facing: "South", status: "Unsold", sqft: 936, uds: 324, pvtTerrace: 0, basePrice: 4865674, iaCharges: 280712, amenitiesCharges: 280712, otherCharges: 561424, ebStp: 187141, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5614240, prelaunchOffer: 4865674, pvtTerraceOfferPrice: 0, prelaunchPrice: 4865674, offerPrice: 4865674, reg: 0, gst: 0, finalTotal: 4865674, categories: ["2bhk", "south", "block-a", "unsold"] },
      { id: "A213", flatNo: "A213", block: "Block A", floor: "2nd Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 759, uds: 263, pvtTerrace: 0, basePrice: 3944754, iaCharges: 227582, amenitiesCharges: 227582, otherCharges: 455164, ebStp: 151721, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4551639, prelaunchOffer: 3944754, pvtTerraceOfferPrice: 0, prelaunchPrice: 3944754, offerPrice: 3944754, reg: 0, gst: 0, finalTotal: 3944754, categories: ["1bhk", "north", "block-a", "unsold"] },
      { id: "A214", flatNo: "A214", block: "Block A", floor: "2nd Floor", type: "2 BHK + 1T", facing: "North", status: "Unsold", sqft: 840, uds: 291, pvtTerrace: 0, basePrice: 4367530, iaCharges: 251973, amenitiesCharges: 251973, otherCharges: 503946, ebStp: 167982, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5039457, prelaunchOffer: 4367530, pvtTerraceOfferPrice: 0, prelaunchPrice: 4367530, offerPrice: 4367530, reg: 0, gst: 0, finalTotal: 4367530, categories: ["2bhk", "north", "block-a", "unsold"] },
      { id: "A215", flatNo: "A215", block: "Block A", floor: "2nd Floor", type: "2 BHK + 2T", facing: "South", status: "Unsold", sqft: 962, uds: 333, pvtTerrace: 0, basePrice: 5003981, iaCharges: 288691, amenitiesCharges: 288691, otherCharges: 577382, ebStp: 192461, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5773824, prelaunchOffer: 5003981, pvtTerraceOfferPrice: 0, prelaunchPrice: 5003981, offerPrice: 5003981, reg: 0, gst: 0, finalTotal: 5003981, categories: ["2bhk", "south", "block-a", "unsold"] },
      { id: "A216", flatNo: "A216", block: "Block A", floor: "2nd Floor", type: "Studio", facing: "West", status: "Unsold", sqft: 389, uds: 135, pvtTerrace: 0, basePrice: 2023228, iaCharges: 116725, amenitiesCharges: 116725, otherCharges: 233450, ebStp: 77816, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 2334493, prelaunchOffer: 2023228, pvtTerraceOfferPrice: 0, prelaunchPrice: 2023228, offerPrice: 2023228, reg: 0, gst: 0, finalTotal: 2023228, categories: ["studio", "west", "block-a", "unsold"] },
      { id: "A217", flatNo: "A217", block: "Block A", floor: "2nd Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 1195, uds: 414, pvtTerrace: 0, basePrice: 6213514, iaCharges: 358472, amenitiesCharges: 358472, otherCharges: 716944, ebStp: 238981, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7169440, prelaunchOffer: 6213514, pvtTerraceOfferPrice: 0, prelaunchPrice: 6213514, offerPrice: 6213514, reg: 0, gst: 0, finalTotal: 6213514, categories: ["2bhk", "north", "block-a", "unsold"] },
      // ============================================================
      // Block A · 3rd Floor
      // ============================================================
      { id: "A301", flatNo: "A301", block: "Block A", floor: "3rd Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1259, uds: 436, pvtTerrace: 0, basePrice: 6544863, iaCharges: 377588, amenitiesCharges: 377588, otherCharges: 755176, ebStp: 251725, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7551765, prelaunchOffer: 6544863, pvtTerraceOfferPrice: 0, prelaunchPrice: 6544863, offerPrice: 6544863, reg: 0, gst: 0, finalTotal: 6544863, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A302", flatNo: "A302", block: "Block A", floor: "3rd Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1073, uds: 371, pvtTerrace: 0, basePrice: 5577408, iaCharges: 321774, amenitiesCharges: 321774, otherCharges: 643548, ebStp: 214516, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6435471, prelaunchOffer: 5577408, pvtTerraceOfferPrice: 0, prelaunchPrice: 5577408, offerPrice: 5577408, reg: 0, gst: 0, finalTotal: 5577408, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A303", flatNo: "A303", block: "Block A", floor: "3rd Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1163, uds: 403, pvtTerrace: 0, basePrice: 6048445, iaCharges: 348949, amenitiesCharges: 348949, otherCharges: 697898, ebStp: 232632, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6978974, prelaunchOffer: 6048445, pvtTerraceOfferPrice: 0, prelaunchPrice: 6048445, offerPrice: 6048445, reg: 0, gst: 0, finalTotal: 6048445, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A304", flatNo: "A304", block: "Block A", floor: "3rd Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1105, uds: 382, pvtTerrace: 0, basePrice: 5744119, iaCharges: 331391, amenitiesCharges: 331391, otherCharges: 662782, ebStp: 220928, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6627829, prelaunchOffer: 5744119, pvtTerraceOfferPrice: 0, prelaunchPrice: 5744119, offerPrice: 5744119, reg: 0, gst: 0, finalTotal: 5744119, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A305", flatNo: "A305", block: "Block A", floor: "3rd Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1244, uds: 431, pvtTerrace: 0, basePrice: 6469839, iaCharges: 373260, amenitiesCharges: 373260, otherCharges: 746520, ebStp: 248840, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7465199, prelaunchOffer: 6469839, pvtTerraceOfferPrice: 0, prelaunchPrice: 6469839, offerPrice: 6469839, reg: 0, gst: 0, finalTotal: 6469839, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A306", flatNo: "A306", block: "Block A", floor: "3rd Floor", type: "2 BHK + 1T", facing: "North", status: "Unsold", sqft: 1106, uds: 383, pvtTerrace: 0, basePrice: 5750162, iaCharges: 331740, amenitiesCharges: 331740, otherCharges: 663480, ebStp: 221160, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6634802, prelaunchOffer: 5750162, pvtTerraceOfferPrice: 0, prelaunchPrice: 5750162, offerPrice: 5750162, reg: 0, gst: 0, finalTotal: 5750162, categories: ["2bhk", "north", "block-a", "unsold"] },
      { id: "A307", flatNo: "A307", block: "Block A", floor: "3rd Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 808, uds: 280, pvtTerrace: 0, basePrice: 4203410, iaCharges: 242504, amenitiesCharges: 242504, otherCharges: 485008, ebStp: 161670, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4850088, prelaunchOffer: 4203410, pvtTerraceOfferPrice: 0, prelaunchPrice: 4203410, offerPrice: 4203410, reg: 0, gst: 0, finalTotal: 4203410, categories: ["1bhk", "north", "block-a", "unsold"] },
      { id: "A308", flatNo: "A308", block: "Block A", floor: "3rd Floor", type: "2 BHK + 2T", facing: "South", status: "Unsold", sqft: 1031, uds: 357, pvtTerrace: 0, basePrice: 5360625, iaCharges: 309267, amenitiesCharges: 309267, otherCharges: 618534, ebStp: 206178, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6185336, prelaunchOffer: 5360625, pvtTerraceOfferPrice: 0, prelaunchPrice: 5360625, offerPrice: 5360625, reg: 0, gst: 0, finalTotal: 5360625, categories: ["2bhk", "south", "block-a", "unsold"] },
      { id: "A309", flatNo: "A309", block: "Block A", floor: "3rd Floor", type: "Studio", facing: "South", status: "Unsold", sqft: 517, uds: 179, pvtTerrace: 0, basePrice: 2685924, iaCharges: 154957, amenitiesCharges: 154957, otherCharges: 309914, ebStp: 103305, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3099143, prelaunchOffer: 2685924, pvtTerraceOfferPrice: 0, prelaunchPrice: 2685924, offerPrice: 2685924, reg: 0, gst: 0, finalTotal: 2685924, categories: ["studio", "south", "block-a", "unsold"] },
      { id: "A310", flatNo: "A310", block: "Block A", floor: "3rd Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 764, uds: 264, pvtTerrace: 0, basePrice: 3970395, iaCharges: 229061, amenitiesCharges: 229061, otherCharges: 458122, ebStp: 152708, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4581225, prelaunchOffer: 3970395, pvtTerraceOfferPrice: 0, prelaunchPrice: 3970395, offerPrice: 3970395, reg: 0, gst: 0, finalTotal: 3970395, categories: ["1bhk", "north", "block-a", "unsold"] },
      { id: "A311", flatNo: "A311", block: "Block A", floor: "3rd Floor", type: "2 BHK + 1T", facing: "North", status: "Unsold", sqft: 836, uds: 289, pvtTerrace: 0, basePrice: 4347932, iaCharges: 250842, amenitiesCharges: 250842, otherCharges: 501684, ebStp: 167228, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5016845, prelaunchOffer: 4347932, pvtTerraceOfferPrice: 0, prelaunchPrice: 4347932, offerPrice: 4347932, reg: 0, gst: 0, finalTotal: 4347932, categories: ["2bhk", "north", "block-a", "unsold"] },
      { id: "A312", flatNo: "A312", block: "Block A", floor: "3rd Floor", type: "2 BHK + 1T", facing: "South", status: "Unsold", sqft: 936, uds: 324, pvtTerrace: 0, basePrice: 4865674, iaCharges: 280712, amenitiesCharges: 280712, otherCharges: 561424, ebStp: 187141, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5614240, prelaunchOffer: 4865674, pvtTerraceOfferPrice: 0, prelaunchPrice: 4865674, offerPrice: 4865674, reg: 0, gst: 0, finalTotal: 4865674, categories: ["2bhk", "south", "block-a", "unsold"] },
      { id: "A313", flatNo: "A313", block: "Block A", floor: "3rd Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 759, uds: 263, pvtTerrace: 0, basePrice: 3944754, iaCharges: 227582, amenitiesCharges: 227582, otherCharges: 455164, ebStp: 151721, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4551639, prelaunchOffer: 3944754, pvtTerraceOfferPrice: 0, prelaunchPrice: 3944754, offerPrice: 3944754, reg: 0, gst: 0, finalTotal: 3944754, categories: ["1bhk", "north", "block-a", "unsold"] },
      { id: "A314", flatNo: "A314", block: "Block A", floor: "3rd Floor", type: "2 BHK + 1T", facing: "North", status: "Unsold", sqft: 840, uds: 291, pvtTerrace: 0, basePrice: 4367530, iaCharges: 251973, amenitiesCharges: 251973, otherCharges: 503946, ebStp: 167982, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5039457, prelaunchOffer: 4367530, pvtTerraceOfferPrice: 0, prelaunchPrice: 4367530, offerPrice: 4367530, reg: 0, gst: 0, finalTotal: 4367530, categories: ["2bhk", "north", "block-a", "unsold"] },
      { id: "A315", flatNo: "A315", block: "Block A", floor: "3rd Floor", type: "2 BHK + 2T", facing: "South", status: "Unsold", sqft: 962, uds: 333, pvtTerrace: 0, basePrice: 5003981, iaCharges: 288691, amenitiesCharges: 288691, otherCharges: 577382, ebStp: 192461, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5773824, prelaunchOffer: 5003981, pvtTerraceOfferPrice: 0, prelaunchPrice: 5003981, offerPrice: 5003981, reg: 0, gst: 0, finalTotal: 5003981, categories: ["2bhk", "south", "block-a", "unsold"] },
      { id: "A316", flatNo: "A316", block: "Block A", floor: "3rd Floor", type: "Studio", facing: "West", status: "Unsold", sqft: 389, uds: 135, pvtTerrace: 0, basePrice: 2023228, iaCharges: 116725, amenitiesCharges: 116725, otherCharges: 233450, ebStp: 77816, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 2334493, prelaunchOffer: 2023228, pvtTerraceOfferPrice: 0, prelaunchPrice: 2023228, offerPrice: 2023228, reg: 0, gst: 0, finalTotal: 2023228, categories: ["studio", "west", "block-a", "unsold"] },
      { id: "A317", flatNo: "A317", block: "Block A", floor: "3rd Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 1195, uds: 414, pvtTerrace: 0, basePrice: 6213514, iaCharges: 358472, amenitiesCharges: 358472, otherCharges: 716944, ebStp: 238981, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7169440, prelaunchOffer: 6213514, pvtTerraceOfferPrice: 0, prelaunchPrice: 6213514, offerPrice: 6213514, reg: 0, gst: 0, finalTotal: 6213514, categories: ["2bhk", "north", "block-a", "unsold"] },
      // ============================================================
      // Block A · 4th Floor
      // ============================================================
      { id: "A401", flatNo: "A401", block: "Block A", floor: "4th Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1259, uds: 436, pvtTerrace: 0, basePrice: 6544863, iaCharges: 377588, amenitiesCharges: 377588, otherCharges: 755176, ebStp: 251725, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7551765, prelaunchOffer: 6544863, pvtTerraceOfferPrice: 0, prelaunchPrice: 6544863, offerPrice: 6544863, reg: 0, gst: 0, finalTotal: 6544863, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A402", flatNo: "A402", block: "Block A", floor: "4th Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1073, uds: 371, pvtTerrace: 0, basePrice: 5577408, iaCharges: 321774, amenitiesCharges: 321774, otherCharges: 643548, ebStp: 214516, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6435471, prelaunchOffer: 5577408, pvtTerraceOfferPrice: 0, prelaunchPrice: 5577408, offerPrice: 5577408, reg: 0, gst: 0, finalTotal: 5577408, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A403", flatNo: "A403", block: "Block A", floor: "4th Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1163, uds: 403, pvtTerrace: 0, basePrice: 6048445, iaCharges: 348949, amenitiesCharges: 348949, otherCharges: 697898, ebStp: 232632, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6978974, prelaunchOffer: 6048445, pvtTerraceOfferPrice: 0, prelaunchPrice: 6048445, offerPrice: 6048445, reg: 0, gst: 0, finalTotal: 6048445, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A404", flatNo: "A404", block: "Block A", floor: "4th Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1105, uds: 382, pvtTerrace: 0, basePrice: 5744119, iaCharges: 331391, amenitiesCharges: 331391, otherCharges: 662782, ebStp: 220928, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6627829, prelaunchOffer: 5744119, pvtTerraceOfferPrice: 0, prelaunchPrice: 5744119, offerPrice: 5744119, reg: 0, gst: 0, finalTotal: 5744119, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A405", flatNo: "A405", block: "Block A", floor: "4th Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1244, uds: 431, pvtTerrace: 0, basePrice: 6469839, iaCharges: 373260, amenitiesCharges: 373260, otherCharges: 746520, ebStp: 248840, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7465199, prelaunchOffer: 6469839, pvtTerraceOfferPrice: 0, prelaunchPrice: 6469839, offerPrice: 6469839, reg: 0, gst: 0, finalTotal: 6469839, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A406", flatNo: "A406", block: "Block A", floor: "4th Floor", type: "2 BHK + 1T", facing: "North", status: "Unsold", sqft: 1106, uds: 383, pvtTerrace: 0, basePrice: 5750162, iaCharges: 331740, amenitiesCharges: 331740, otherCharges: 663480, ebStp: 221160, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6634802, prelaunchOffer: 5750162, pvtTerraceOfferPrice: 0, prelaunchPrice: 5750162, offerPrice: 5750162, reg: 0, gst: 0, finalTotal: 5750162, categories: ["2bhk", "north", "block-a", "unsold"] },
      { id: "A407", flatNo: "A407", block: "Block A", floor: "4th Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 808, uds: 280, pvtTerrace: 0, basePrice: 4203410, iaCharges: 242504, amenitiesCharges: 242504, otherCharges: 485008, ebStp: 161670, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4850088, prelaunchOffer: 4203410, pvtTerraceOfferPrice: 0, prelaunchPrice: 4203410, offerPrice: 4203410, reg: 0, gst: 0, finalTotal: 4203410, categories: ["1bhk", "north", "block-a", "unsold"] },
      { id: "A408", flatNo: "A408", block: "Block A", floor: "4th Floor", type: "2 BHK + 2T", facing: "South", status: "Unsold", sqft: 1031, uds: 357, pvtTerrace: 0, basePrice: 5360625, iaCharges: 309267, amenitiesCharges: 309267, otherCharges: 618534, ebStp: 206178, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6185336, prelaunchOffer: 5360625, pvtTerraceOfferPrice: 0, prelaunchPrice: 5360625, offerPrice: 5360625, reg: 0, gst: 0, finalTotal: 5360625, categories: ["2bhk", "south", "block-a", "unsold"] },
      { id: "A409", flatNo: "A409", block: "Block A", floor: "4th Floor", type: "Studio", facing: "South", status: "Unsold", sqft: 517, uds: 179, pvtTerrace: 0, basePrice: 2685924, iaCharges: 154957, amenitiesCharges: 154957, otherCharges: 309914, ebStp: 103305, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3099143, prelaunchOffer: 2685924, pvtTerraceOfferPrice: 0, prelaunchPrice: 2685924, offerPrice: 2685924, reg: 0, gst: 0, finalTotal: 2685924, categories: ["studio", "south", "block-a", "unsold"] },
      { id: "A410", flatNo: "A410", block: "Block A", floor: "4th Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 764, uds: 264, pvtTerrace: 0, basePrice: 3970395, iaCharges: 229061, amenitiesCharges: 229061, otherCharges: 458122, ebStp: 152708, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4581225, prelaunchOffer: 3970395, pvtTerraceOfferPrice: 0, prelaunchPrice: 3970395, offerPrice: 3970395, reg: 0, gst: 0, finalTotal: 3970395, categories: ["1bhk", "north", "block-a", "unsold"] },
      { id: "A411", flatNo: "A411", block: "Block A", floor: "4th Floor", type: "2 BHK + 1T", facing: "North", status: "Unsold", sqft: 836, uds: 289, pvtTerrace: 0, basePrice: 4347932, iaCharges: 250842, amenitiesCharges: 250842, otherCharges: 501684, ebStp: 167228, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5016845, prelaunchOffer: 4347932, pvtTerraceOfferPrice: 0, prelaunchPrice: 4347932, offerPrice: 4347932, reg: 0, gst: 0, finalTotal: 4347932, categories: ["2bhk", "north", "block-a", "unsold"] },
      { id: "A412", flatNo: "A412", block: "Block A", floor: "4th Floor", type: "2 BHK + 1T", facing: "South", status: "Unsold", sqft: 936, uds: 324, pvtTerrace: 0, basePrice: 4865674, iaCharges: 280712, amenitiesCharges: 280712, otherCharges: 561424, ebStp: 187141, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5614240, prelaunchOffer: 4865674, pvtTerraceOfferPrice: 0, prelaunchPrice: 4865674, offerPrice: 4865674, reg: 0, gst: 0, finalTotal: 4865674, categories: ["2bhk", "south", "block-a", "unsold"] },
      { id: "A413", flatNo: "A413", block: "Block A", floor: "4th Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 759, uds: 263, pvtTerrace: 0, basePrice: 3944754, iaCharges: 227582, amenitiesCharges: 227582, otherCharges: 455164, ebStp: 151721, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4551639, prelaunchOffer: 3944754, pvtTerraceOfferPrice: 0, prelaunchPrice: 3944754, offerPrice: 3944754, reg: 0, gst: 0, finalTotal: 3944754, categories: ["1bhk", "north", "block-a", "unsold"] },
      { id: "A414", flatNo: "A414", block: "Block A", floor: "4th Floor", type: "2 BHK + 1T", facing: "North", status: "Unsold", sqft: 840, uds: 291, pvtTerrace: 0, basePrice: 4367530, iaCharges: 251973, amenitiesCharges: 251973, otherCharges: 503946, ebStp: 167982, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5039457, prelaunchOffer: 4367530, pvtTerraceOfferPrice: 0, prelaunchPrice: 4367530, offerPrice: 4367530, reg: 0, gst: 0, finalTotal: 4367530, categories: ["2bhk", "north", "block-a", "unsold"] },
      { id: "A415", flatNo: "A415", block: "Block A", floor: "4th Floor", type: "2 BHK + 2T", facing: "South", status: "Unsold", sqft: 962, uds: 333, pvtTerrace: 0, basePrice: 5003981, iaCharges: 288691, amenitiesCharges: 288691, otherCharges: 577382, ebStp: 192461, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5773824, prelaunchOffer: 5003981, pvtTerraceOfferPrice: 0, prelaunchPrice: 5003981, offerPrice: 5003981, reg: 0, gst: 0, finalTotal: 5003981, categories: ["2bhk", "south", "block-a", "unsold"] },
      { id: "A416", flatNo: "A416", block: "Block A", floor: "4th Floor", type: "Studio", facing: "West", status: "Unsold", sqft: 389, uds: 135, pvtTerrace: 0, basePrice: 2023228, iaCharges: 116725, amenitiesCharges: 116725, otherCharges: 233450, ebStp: 77816, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 2334493, prelaunchOffer: 2023228, pvtTerraceOfferPrice: 0, prelaunchPrice: 2023228, offerPrice: 2023228, reg: 0, gst: 0, finalTotal: 2023228, categories: ["studio", "west", "block-a", "unsold"] },
      { id: "A417", flatNo: "A417", block: "Block A", floor: "4th Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 1195, uds: 414, pvtTerrace: 0, basePrice: 6213514, iaCharges: 358472, amenitiesCharges: 358472, otherCharges: 716944, ebStp: 238981, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7169440, prelaunchOffer: 6213514, pvtTerraceOfferPrice: 0, prelaunchPrice: 6213514, offerPrice: 6213514, reg: 0, gst: 0, finalTotal: 6213514, categories: ["2bhk", "north", "block-a", "unsold"] },
      // ============================================================
      // Block A · 5th Floor
      // ============================================================
      { id: "A501", flatNo: "A501", block: "Block A", floor: "5th Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1259, uds: 436, pvtTerrace: 0, basePrice: 6544863, iaCharges: 377588, amenitiesCharges: 377588, otherCharges: 755176, ebStp: 251725, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7551765, prelaunchOffer: 6544863, pvtTerraceOfferPrice: 0, prelaunchPrice: 6544863, offerPrice: 6544863, reg: 0, gst: 0, finalTotal: 6544863, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A502", flatNo: "A502", block: "Block A", floor: "5th Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1073, uds: 371, pvtTerrace: 0, basePrice: 5577408, iaCharges: 321774, amenitiesCharges: 321774, otherCharges: 643548, ebStp: 214516, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6435471, prelaunchOffer: 5577408, pvtTerraceOfferPrice: 0, prelaunchPrice: 5577408, offerPrice: 5577408, reg: 0, gst: 0, finalTotal: 5577408, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A503", flatNo: "A503", block: "Block A", floor: "5th Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1163, uds: 403, pvtTerrace: 0, basePrice: 6048445, iaCharges: 348949, amenitiesCharges: 348949, otherCharges: 697898, ebStp: 232632, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6978974, prelaunchOffer: 6048445, pvtTerraceOfferPrice: 0, prelaunchPrice: 6048445, offerPrice: 6048445, reg: 0, gst: 0, finalTotal: 6048445, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A504", flatNo: "A504", block: "Block A", floor: "5th Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1105, uds: 382, pvtTerrace: 0, basePrice: 5744119, iaCharges: 331391, amenitiesCharges: 331391, otherCharges: 662782, ebStp: 220928, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6627829, prelaunchOffer: 5744119, pvtTerraceOfferPrice: 0, prelaunchPrice: 5744119, offerPrice: 5744119, reg: 0, gst: 0, finalTotal: 5744119, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A505", flatNo: "A505", block: "Block A", floor: "5th Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 1244, uds: 431, pvtTerrace: 0, basePrice: 6469839, iaCharges: 373260, amenitiesCharges: 373260, otherCharges: 746520, ebStp: 248840, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7465199, prelaunchOffer: 6469839, pvtTerraceOfferPrice: 0, prelaunchPrice: 6469839, offerPrice: 6469839, reg: 0, gst: 0, finalTotal: 6469839, categories: ["2bhk", "east", "block-a", "unsold"] },
      { id: "A506", flatNo: "A506", block: "Block A", floor: "5th Floor", type: "2 BHK + 1T", facing: "North", status: "Unsold", sqft: 1106, uds: 383, pvtTerrace: 0, basePrice: 5750162, iaCharges: 331740, amenitiesCharges: 331740, otherCharges: 663480, ebStp: 221160, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6634802, prelaunchOffer: 5750162, pvtTerraceOfferPrice: 0, prelaunchPrice: 5750162, offerPrice: 5750162, reg: 0, gst: 0, finalTotal: 5750162, categories: ["2bhk", "north", "block-a", "unsold"] },
      { id: "A507", flatNo: "A507", block: "Block A", floor: "5th Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 808, uds: 280, pvtTerrace: 0, basePrice: 4203410, iaCharges: 242504, amenitiesCharges: 242504, otherCharges: 485008, ebStp: 161670, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4850088, prelaunchOffer: 4203410, pvtTerraceOfferPrice: 0, prelaunchPrice: 4203410, offerPrice: 4203410, reg: 0, gst: 0, finalTotal: 4203410, categories: ["1bhk", "north", "block-a", "unsold"] },
      { id: "A508", flatNo: "A508", block: "Block A", floor: "5th Floor", type: "2 BHK + 2T", facing: "South", status: "Unsold", sqft: 1031, uds: 357, pvtTerrace: 0, basePrice: 5360625, iaCharges: 309267, amenitiesCharges: 309267, otherCharges: 618534, ebStp: 206178, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6185336, prelaunchOffer: 5360625, pvtTerraceOfferPrice: 0, prelaunchPrice: 5360625, offerPrice: 5360625, reg: 0, gst: 0, finalTotal: 5360625, categories: ["2bhk", "south", "block-a", "unsold"] },
      { id: "A509", flatNo: "A509", block: "Block A", floor: "5th Floor", type: "Studio", facing: "South", status: "Unsold", sqft: 517, uds: 179, pvtTerrace: 0, basePrice: 2685924, iaCharges: 154957, amenitiesCharges: 154957, otherCharges: 309914, ebStp: 103305, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3099143, prelaunchOffer: 2685924, pvtTerraceOfferPrice: 0, prelaunchPrice: 2685924, offerPrice: 2685924, reg: 0, gst: 0, finalTotal: 2685924, categories: ["studio", "south", "block-a", "unsold"] },
      { id: "A510", flatNo: "A510", block: "Block A", floor: "5th Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 764, uds: 264, pvtTerrace: 0, basePrice: 3970395, iaCharges: 229061, amenitiesCharges: 229061, otherCharges: 458122, ebStp: 152708, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4581225, prelaunchOffer: 3970395, pvtTerraceOfferPrice: 0, prelaunchPrice: 3970395, offerPrice: 3970395, reg: 0, gst: 0, finalTotal: 3970395, categories: ["1bhk", "north", "block-a", "unsold"] },
      { id: "A511", flatNo: "A511", block: "Block A", floor: "5th Floor", type: "2 BHK + 1T", facing: "North", status: "Unsold", sqft: 836, uds: 289, pvtTerrace: 0, basePrice: 4347932, iaCharges: 250842, amenitiesCharges: 250842, otherCharges: 501684, ebStp: 167228, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5016845, prelaunchOffer: 4347932, pvtTerraceOfferPrice: 0, prelaunchPrice: 4347932, offerPrice: 4347932, reg: 0, gst: 0, finalTotal: 4347932, categories: ["2bhk", "north", "block-a", "unsold"] },
      { id: "A512", flatNo: "A512", block: "Block A", floor: "5th Floor", type: "2 BHK + 1T", facing: "South", status: "Unsold", sqft: 936, uds: 324, pvtTerrace: 0, basePrice: 4865674, iaCharges: 280712, amenitiesCharges: 280712, otherCharges: 561424, ebStp: 187141, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5614240, prelaunchOffer: 4865674, pvtTerraceOfferPrice: 0, prelaunchPrice: 4865674, offerPrice: 4865674, reg: 0, gst: 0, finalTotal: 4865674, categories: ["2bhk", "south", "block-a", "unsold"] },
      { id: "A513", flatNo: "A513", block: "Block A", floor: "5th Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 759, uds: 263, pvtTerrace: 0, basePrice: 3944754, iaCharges: 227582, amenitiesCharges: 227582, otherCharges: 455164, ebStp: 151721, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4551639, prelaunchOffer: 3944754, pvtTerraceOfferPrice: 0, prelaunchPrice: 3944754, offerPrice: 3944754, reg: 0, gst: 0, finalTotal: 3944754, categories: ["1bhk", "north", "block-a", "unsold"] },
      { id: "A514", flatNo: "A514", block: "Block A", floor: "5th Floor", type: "2 BHK + 1T", facing: "North", status: "Unsold", sqft: 840, uds: 291, pvtTerrace: 0, basePrice: 4367530, iaCharges: 251973, amenitiesCharges: 251973, otherCharges: 503946, ebStp: 167982, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5039457, prelaunchOffer: 4367530, pvtTerraceOfferPrice: 0, prelaunchPrice: 4367530, offerPrice: 4367530, reg: 0, gst: 0, finalTotal: 4367530, categories: ["2bhk", "north", "block-a", "unsold"] },
      { id: "A515", flatNo: "A515", block: "Block A", floor: "5th Floor", type: "2 BHK + 2T", facing: "South", status: "Unsold", sqft: 962, uds: 333, pvtTerrace: 0, basePrice: 5003981, iaCharges: 288691, amenitiesCharges: 288691, otherCharges: 577382, ebStp: 192461, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5773824, prelaunchOffer: 5003981, pvtTerraceOfferPrice: 0, prelaunchPrice: 5003981, offerPrice: 5003981, reg: 0, gst: 0, finalTotal: 5003981, categories: ["2bhk", "south", "block-a", "unsold"] },
      { id: "A516", flatNo: "A516", block: "Block A", floor: "5th Floor", type: "Studio", facing: "West", status: "Unsold", sqft: 389, uds: 135, pvtTerrace: 0, basePrice: 2023228, iaCharges: 116725, amenitiesCharges: 116725, otherCharges: 233450, ebStp: 77816, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 2334493, prelaunchOffer: 2023228, pvtTerraceOfferPrice: 0, prelaunchPrice: 2023228, offerPrice: 2023228, reg: 0, gst: 0, finalTotal: 2023228, categories: ["studio", "west", "block-a", "unsold"] },
      { id: "A517", flatNo: "A517", block: "Block A", floor: "5th Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 1195, uds: 414, pvtTerrace: 0, basePrice: 6213514, iaCharges: 358472, amenitiesCharges: 358472, otherCharges: 716944, ebStp: 238981, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7169440, prelaunchOffer: 6213514, pvtTerraceOfferPrice: 0, prelaunchPrice: 6213514, offerPrice: 6213514, reg: 0, gst: 0, finalTotal: 6213514, categories: ["2bhk", "north", "block-a", "unsold"] },
      // ============================================================
      // Block B · 1st Floor
      // ============================================================
      { id: "B101", flatNo: "B101", block: "Block B", floor: "1st Floor", type: "2 BHK + 2T", facing: "South", status: "Unsold", sqft: 1280, uds: 443, pvtTerrace: 50.53, basePrice: 6658219, iaCharges: 384128, amenitiesCharges: 384128, otherCharges: 768256, ebStp: 256085, pvtTerracePrice: 151579, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7834139, prelaunchOffer: 6658219, pvtTerraceOfferPrice: 101052, prelaunchPrice: 6759271, offerPrice: 6759271, reg: 0, gst: 0, finalTotal: 6759271, categories: ["2bhk", "south", "block-b", "unsold"] },
      { id: "B102", flatNo: "B102", block: "Block B", floor: "1st Floor", type: "2 BHK + 1T", facing: "South", status: "Unsold", sqft: 984, uds: 341, pvtTerrace: 63.43, basePrice: 5118373, iaCharges: 295291, amenitiesCharges: 295291, otherCharges: 590582, ebStp: 196860, pvtTerracePrice: 190297, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6096112, prelaunchOffer: 5118373, pvtTerraceOfferPrice: 126865, prelaunchPrice: 5245237, offerPrice: 5245237, reg: 0, gst: 0, finalTotal: 5245237, categories: ["2bhk", "south", "block-b", "unsold"] },
      { id: "B103", flatNo: "B103", block: "Block B", floor: "1st Floor", type: "2 BHK + 1T", facing: "South", status: "Unsold", sqft: 952, uds: 329, pvtTerrace: 28.97, basePrice: 4948900, iaCharges: 285513, amenitiesCharges: 285513, otherCharges: 571026, ebStp: 190342, pvtTerracePrice: 86898, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5797167, prelaunchOffer: 4948900, pvtTerraceOfferPrice: 57932, prelaunchPrice: 5006832, offerPrice: 5006832, reg: 0, gst: 0, finalTotal: 5006832, categories: ["2bhk", "south", "block-b", "unsold"] },
      { id: "B104", flatNo: "B104", block: "Block B", floor: "1st Floor", type: "3 BHK + 2T", facing: "South", status: "Unsold", sqft: 1200, uds: 415, pvtTerrace: 0, basePrice: 6240278, iaCharges: 360016, amenitiesCharges: 360016, otherCharges: 720032, ebStp: 240011, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7200320, prelaunchOffer: 6240278, pvtTerraceOfferPrice: 0, prelaunchPrice: 6240278, offerPrice: 6240278, reg: 0, gst: 0, finalTotal: 6240278, categories: ["3bhk", "south", "block-b", "unsold"] },
      { id: "B105", flatNo: "B105", block: "Block B", floor: "1st Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 932, uds: 323, pvtTerrace: 0, basePrice: 4848580, iaCharges: 279726, amenitiesCharges: 279726, otherCharges: 559452, ebStp: 186484, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5594516, prelaunchOffer: 4848580, pvtTerraceOfferPrice: 0, prelaunchPrice: 4848580, offerPrice: 4848580, reg: 0, gst: 0, finalTotal: 4848580, categories: ["2bhk", "east", "block-b", "unsold"] },
      { id: "B106", flatNo: "B106", block: "Block B", floor: "1st Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 670, uds: 232, pvtTerrace: 0, basePrice: 3482179, iaCharges: 200895, amenitiesCharges: 200895, otherCharges: 401790, ebStp: 133930, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4017899, prelaunchOffer: 3482179, pvtTerraceOfferPrice: 0, prelaunchPrice: 3482179, offerPrice: 3482179, reg: 0, gst: 0, finalTotal: 3482179, categories: ["1bhk", "east", "block-b", "unsold"] },
      { id: "B107", flatNo: "B107", block: "Block B", floor: "1st Floor", type: "2 BHK + 1T", facing: "East", status: "Unsold", sqft: 1049, uds: 363, pvtTerrace: 0, basePrice: 5453865, iaCharges: 314646, amenitiesCharges: 314646, otherCharges: 629292, ebStp: 209764, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6292921, prelaunchOffer: 5453865, pvtTerraceOfferPrice: 0, prelaunchPrice: 5453865, offerPrice: 5453865, reg: 0, gst: 0, finalTotal: 5453865, categories: ["2bhk", "east", "block-b", "unsold"] },
      { id: "B108", flatNo: "B108", block: "Block B", floor: "1st Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 737, uds: 255, pvtTerrace: 84.41, basePrice: 3830448, iaCharges: 220987, amenitiesCharges: 220987, otherCharges: 441974, ebStp: 147325, pvtTerracePrice: 253234, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4672982, prelaunchOffer: 3830448, pvtTerraceOfferPrice: 168823, prelaunchPrice: 3999271, offerPrice: 3999271, reg: 0, gst: 0, finalTotal: 3999271, categories: ["1bhk", "north", "block-b", "unsold"] },
      { id: "B109", flatNo: "B109", block: "Block B", floor: "1st Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 721, uds: 250, pvtTerrace: 0, basePrice: 3750331, iaCharges: 216365, amenitiesCharges: 216365, otherCharges: 432730, ebStp: 144243, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4327305, prelaunchOffer: 3750331, pvtTerraceOfferPrice: 0, prelaunchPrice: 3750331, offerPrice: 3750331, reg: 0, gst: 0, finalTotal: 3750331, categories: ["1bhk", "north", "block-b", "unsold"] },
      { id: "B110", flatNo: "B110", block: "Block B", floor: "1st Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 727, uds: 251, pvtTerrace: 189.92, basePrice: 3778044, iaCharges: 217964, amenitiesCharges: 217964, otherCharges: 435928, ebStp: 145309, pvtTerracePrice: 569760, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4929042, prelaunchOffer: 3778044, pvtTerraceOfferPrice: 379840, prelaunchPrice: 4157884, offerPrice: 4157884, reg: 0, gst: 0, finalTotal: 4157884, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B111", flatNo: "B111", block: "Block B", floor: "1st Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 616, uds: 213, pvtTerrace: 108.06, basePrice: 3205307, iaCharges: 184922, amenitiesCharges: 184922, otherCharges: 369844, ebStp: 123281, pvtTerracePrice: 324179, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4022610, prelaunchOffer: 3205307, pvtTerraceOfferPrice: 216120, prelaunchPrice: 3421427, offerPrice: 3421427, reg: 0, gst: 0, finalTotal: 3421427, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B112", flatNo: "B112", block: "Block B", floor: "1st Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 668, uds: 231, pvtTerrace: 91.61, basePrice: 3472337, iaCharges: 200327, amenitiesCharges: 200327, otherCharges: 400654, ebStp: 133551, pvtTerracePrice: 274837, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4281380, prelaunchOffer: 3472337, pvtTerraceOfferPrice: 183225, prelaunchPrice: 3655562, offerPrice: 3655562, reg: 0, gst: 0, finalTotal: 3655562, categories: ["1bhk", "north", "block-b", "unsold"] },
      { id: "B113", flatNo: "B113", block: "Block B", floor: "1st Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 879, uds: 304, pvtTerrace: 127.54, basePrice: 4568946, iaCharges: 263593, amenitiesCharges: 263593, otherCharges: 527186, ebStp: 175729, pvtTerracePrice: 382628, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5654489, prelaunchOffer: 4568946, pvtTerraceOfferPrice: 255085, prelaunchPrice: 4824031, offerPrice: 4824031, reg: 0, gst: 0, finalTotal: 4824031, categories: ["2bhk", "north", "block-b", "unsold"] },
      { id: "B114", flatNo: "B114", block: "Block B", floor: "1st Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 791, uds: 274, pvtTerrace: 267.09, basePrice: 4114659, iaCharges: 237384, amenitiesCharges: 237384, otherCharges: 474768, ebStp: 158256, pvtTerracePrice: 801261, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5548944, prelaunchOffer: 4114659, pvtTerraceOfferPrice: 534174, prelaunchPrice: 4648833, offerPrice: 4648833, reg: 0, gst: 0, finalTotal: 4648833, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B115", flatNo: "B115", block: "Block B", floor: "1st Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 626, uds: 217, pvtTerrace: 133.58, basePrice: 3253222, iaCharges: 187686, amenitiesCharges: 187686, otherCharges: 375372, ebStp: 125124, pvtTerracePrice: 400744, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4154462, prelaunchOffer: 3253222, pvtTerraceOfferPrice: 267162, prelaunchPrice: 3520385, offerPrice: 3520385, reg: 0, gst: 0, finalTotal: 3520385, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B116", flatNo: "B116", block: "Block B", floor: "1st Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 573, uds: 198, pvtTerrace: 55.65, basePrice: 2979717, iaCharges: 171907, amenitiesCharges: 171907, otherCharges: 343814, ebStp: 114605, pvtTerracePrice: 166950, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3605085, prelaunchOffer: 2979717, pvtTerraceOfferPrice: 111300, prelaunchPrice: 3091017, offerPrice: 3091017, reg: 0, gst: 0, finalTotal: 3091017, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B117", flatNo: "B117", block: "Block B", floor: "1st Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 976, uds: 338, pvtTerrace: 151.52, basePrice: 5077105, iaCharges: 292910, amenitiesCharges: 292910, otherCharges: 585820, ebStp: 195273, pvtTerracePrice: 454574, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6312773, prelaunchOffer: 5077105, pvtTerraceOfferPrice: 303050, prelaunchPrice: 5380155, offerPrice: 5380155, reg: 0, gst: 0, finalTotal: 5380155, categories: ["2bhk", "north", "block-b", "unsold"] },
      { id: "B118", flatNo: "B118", block: "Block B", floor: "1st Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 976, uds: 338, pvtTerrace: 182.23, basePrice: 5076501, iaCharges: 292875, amenitiesCharges: 292875, otherCharges: 585750, ebStp: 195250, pvtTerracePrice: 546704, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6404205, prelaunchOffer: 5076501, pvtTerraceOfferPrice: 364469, prelaunchPrice: 5440970, offerPrice: 5440970, reg: 0, gst: 0, finalTotal: 5440970, categories: ["2bhk", "north", "block-b", "unsold"] },
      { id: "B119", flatNo: "B119", block: "Block B", floor: "1st Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 1011, uds: 350, pvtTerrace: 119.59, basePrice: 5257284, iaCharges: 303305, amenitiesCharges: 303305, otherCharges: 606610, ebStp: 202203, pvtTerracePrice: 358764, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6424861, prelaunchOffer: 5257284, pvtTerraceOfferPrice: 239176, prelaunchPrice: 5496460, offerPrice: 5496460, reg: 0, gst: 0, finalTotal: 5496460, categories: ["2bhk", "north", "block-b", "unsold"] },
      // ============================================================
      // Block B · 2nd Floor
      // ============================================================
      { id: "B201", flatNo: "B201", block: "Block B", floor: "2nd Floor", type: "2 BHK + 2T", facing: "South", status: "Unsold", sqft: 1280, uds: 443, pvtTerrace: 0, basePrice: 6658219, iaCharges: 384128, amenitiesCharges: 384128, otherCharges: 768256, ebStp: 256085, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7682560, prelaunchOffer: 6658219, pvtTerraceOfferPrice: 0, prelaunchPrice: 6658219, offerPrice: 6658219, reg: 0, gst: 0, finalTotal: 6658219, categories: ["2bhk", "south", "block-b", "unsold"] },
      { id: "B202", flatNo: "B202", block: "Block B", floor: "2nd Floor", type: "2 BHK + 1T", facing: "South", status: "Unsold", sqft: 984, uds: 341, pvtTerrace: 0, basePrice: 5118373, iaCharges: 295291, amenitiesCharges: 295291, otherCharges: 590582, ebStp: 196860, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5905815, prelaunchOffer: 5118373, pvtTerraceOfferPrice: 0, prelaunchPrice: 5118373, offerPrice: 5118373, reg: 0, gst: 0, finalTotal: 5118373, categories: ["2bhk", "south", "block-b", "unsold"] },
      { id: "B203", flatNo: "B203", block: "Block B", floor: "2nd Floor", type: "2 BHK + 1T", facing: "South", status: "Unsold", sqft: 952, uds: 329, pvtTerrace: 0, basePrice: 4948900, iaCharges: 285513, amenitiesCharges: 285513, otherCharges: 571026, ebStp: 190342, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5710269, prelaunchOffer: 4948900, pvtTerraceOfferPrice: 0, prelaunchPrice: 4948900, offerPrice: 4948900, reg: 0, gst: 0, finalTotal: 4948900, categories: ["2bhk", "south", "block-b", "unsold"] },
      { id: "B204", flatNo: "B204", block: "Block B", floor: "2nd Floor", type: "3 BHK + 2T", facing: "South", status: "Unsold", sqft: 1200, uds: 415, pvtTerrace: 0, basePrice: 6240278, iaCharges: 360016, amenitiesCharges: 360016, otherCharges: 720032, ebStp: 240011, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7200320, prelaunchOffer: 6240278, pvtTerraceOfferPrice: 0, prelaunchPrice: 6240278, offerPrice: 6240278, reg: 0, gst: 0, finalTotal: 6240278, categories: ["3bhk", "south", "block-b", "unsold"] },
      { id: "B205", flatNo: "B205", block: "Block B", floor: "2nd Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 932, uds: 323, pvtTerrace: 0, basePrice: 4848580, iaCharges: 279726, amenitiesCharges: 279726, otherCharges: 559452, ebStp: 186484, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5594516, prelaunchOffer: 4848580, pvtTerraceOfferPrice: 0, prelaunchPrice: 4848580, offerPrice: 4848580, reg: 0, gst: 0, finalTotal: 4848580, categories: ["2bhk", "east", "block-b", "unsold"] },
      { id: "B206", flatNo: "B206", block: "Block B", floor: "2nd Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 670, uds: 232, pvtTerrace: 0, basePrice: 3482179, iaCharges: 200895, amenitiesCharges: 200895, otherCharges: 401790, ebStp: 133930, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4017899, prelaunchOffer: 3482179, pvtTerraceOfferPrice: 0, prelaunchPrice: 3482179, offerPrice: 3482179, reg: 0, gst: 0, finalTotal: 3482179, categories: ["1bhk", "east", "block-b", "unsold"] },
      { id: "B207", flatNo: "B207", block: "Block B", floor: "2nd Floor", type: "2 BHK + 1T", facing: "East", status: "Unsold", sqft: 1049, uds: 363, pvtTerrace: 0, basePrice: 5453865, iaCharges: 314646, amenitiesCharges: 314646, otherCharges: 629292, ebStp: 209764, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6292921, prelaunchOffer: 5453865, pvtTerraceOfferPrice: 0, prelaunchPrice: 5453865, offerPrice: 5453865, reg: 0, gst: 0, finalTotal: 5453865, categories: ["2bhk", "east", "block-b", "unsold"] },
      { id: "B208", flatNo: "B208", block: "Block B", floor: "2nd Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 737, uds: 255, pvtTerrace: 0, basePrice: 3830448, iaCharges: 220987, amenitiesCharges: 220987, otherCharges: 441974, ebStp: 147325, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4419748, prelaunchOffer: 3830448, pvtTerraceOfferPrice: 0, prelaunchPrice: 3830448, offerPrice: 3830448, reg: 0, gst: 0, finalTotal: 3830448, categories: ["1bhk", "north", "block-b", "unsold"] },
      { id: "B209", flatNo: "B209", block: "Block B", floor: "2nd Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 721, uds: 250, pvtTerrace: 0, basePrice: 3750331, iaCharges: 216365, amenitiesCharges: 216365, otherCharges: 432730, ebStp: 144243, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4327305, prelaunchOffer: 3750331, pvtTerraceOfferPrice: 0, prelaunchPrice: 3750331, offerPrice: 3750331, reg: 0, gst: 0, finalTotal: 3750331, categories: ["1bhk", "north", "block-b", "unsold"] },
      { id: "B210", flatNo: "B210", block: "Block B", floor: "2nd Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 727, uds: 251, pvtTerrace: 0, basePrice: 3778044, iaCharges: 217964, amenitiesCharges: 217964, otherCharges: 435928, ebStp: 145309, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4359281, prelaunchOffer: 3778044, pvtTerraceOfferPrice: 0, prelaunchPrice: 3778044, offerPrice: 3778044, reg: 0, gst: 0, finalTotal: 3778044, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B211", flatNo: "B211", block: "Block B", floor: "2nd Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 616, uds: 213, pvtTerrace: 0, basePrice: 3205307, iaCharges: 184922, amenitiesCharges: 184922, otherCharges: 369844, ebStp: 123281, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3698431, prelaunchOffer: 3205307, pvtTerraceOfferPrice: 0, prelaunchPrice: 3205307, offerPrice: 3205307, reg: 0, gst: 0, finalTotal: 3205307, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B212", flatNo: "B212", block: "Block B", floor: "2nd Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 668, uds: 231, pvtTerrace: 0, basePrice: 3472337, iaCharges: 200327, amenitiesCharges: 200327, otherCharges: 400654, ebStp: 133551, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4006542, prelaunchOffer: 3472337, pvtTerraceOfferPrice: 0, prelaunchPrice: 3472337, offerPrice: 3472337, reg: 0, gst: 0, finalTotal: 3472337, categories: ["1bhk", "north", "block-b", "unsold"] },
      { id: "B213", flatNo: "B213", block: "Block B", floor: "2nd Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 879, uds: 304, pvtTerrace: 0, basePrice: 4568946, iaCharges: 263593, amenitiesCharges: 263593, otherCharges: 527186, ebStp: 175729, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5271861, prelaunchOffer: 4568946, pvtTerraceOfferPrice: 0, prelaunchPrice: 4568946, offerPrice: 4568946, reg: 0, gst: 0, finalTotal: 4568946, categories: ["2bhk", "north", "block-b", "unsold"] },
      { id: "B214", flatNo: "B214", block: "Block B", floor: "2nd Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 791, uds: 274, pvtTerrace: 0, basePrice: 4114659, iaCharges: 237384, amenitiesCharges: 237384, otherCharges: 474768, ebStp: 158256, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4747683, prelaunchOffer: 4114659, pvtTerraceOfferPrice: 0, prelaunchPrice: 4114659, offerPrice: 4114659, reg: 0, gst: 0, finalTotal: 4114659, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B215", flatNo: "B215", block: "Block B", floor: "2nd Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 626, uds: 217, pvtTerrace: 0, basePrice: 3253222, iaCharges: 187686, amenitiesCharges: 187686, otherCharges: 375372, ebStp: 125124, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3753718, prelaunchOffer: 3253222, pvtTerraceOfferPrice: 0, prelaunchPrice: 3253222, offerPrice: 3253222, reg: 0, gst: 0, finalTotal: 3253222, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B216", flatNo: "B216", block: "Block B", floor: "2nd Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 618, uds: 214, pvtTerrace: 0, basePrice: 3214631, iaCharges: 185459, amenitiesCharges: 185459, otherCharges: 370918, ebStp: 123640, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3709190, prelaunchOffer: 3214631, pvtTerraceOfferPrice: 0, prelaunchPrice: 3214631, offerPrice: 3214631, reg: 0, gst: 0, finalTotal: 3214631, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B217", flatNo: "B217", block: "Block B", floor: "2nd Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 976, uds: 338, pvtTerrace: 0, basePrice: 5077105, iaCharges: 292910, amenitiesCharges: 292910, otherCharges: 585820, ebStp: 195273, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5858199, prelaunchOffer: 5077105, pvtTerraceOfferPrice: 0, prelaunchPrice: 5077105, offerPrice: 5077105, reg: 0, gst: 0, finalTotal: 5077105, categories: ["2bhk", "north", "block-b", "unsold"] },
      { id: "B218", flatNo: "B218", block: "Block B", floor: "2nd Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 976, uds: 338, pvtTerrace: 0, basePrice: 5076501, iaCharges: 292875, amenitiesCharges: 292875, otherCharges: 585750, ebStp: 195250, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5857501, prelaunchOffer: 5076501, pvtTerraceOfferPrice: 0, prelaunchPrice: 5076501, offerPrice: 5076501, reg: 0, gst: 0, finalTotal: 5076501, categories: ["2bhk", "north", "block-b", "unsold"] },
      { id: "B219", flatNo: "B219", block: "Block B", floor: "2nd Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 1011, uds: 350, pvtTerrace: 0, basePrice: 5257284, iaCharges: 303305, amenitiesCharges: 303305, otherCharges: 606610, ebStp: 202203, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6066096, prelaunchOffer: 5257284, pvtTerraceOfferPrice: 0, prelaunchPrice: 5257284, offerPrice: 5257284, reg: 0, gst: 0, finalTotal: 5257284, categories: ["2bhk", "north", "block-b", "unsold"] },
      // ============================================================
      // Block B · 3rd Floor
      // ============================================================
      { id: "B301", flatNo: "B301", block: "Block B", floor: "3rd Floor", type: "2 BHK + 2T", facing: "South", status: "Unsold", sqft: 1280, uds: 443, pvtTerrace: 0, basePrice: 6658219, iaCharges: 384128, amenitiesCharges: 384128, otherCharges: 768256, ebStp: 256085, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7682560, prelaunchOffer: 6658219, pvtTerraceOfferPrice: 0, prelaunchPrice: 6658219, offerPrice: 6658219, reg: 0, gst: 0, finalTotal: 6658219, categories: ["2bhk", "south", "block-b", "unsold"] },
      { id: "B302", flatNo: "B302", block: "Block B", floor: "3rd Floor", type: "2 BHK + 1T", facing: "South", status: "Unsold", sqft: 984, uds: 341, pvtTerrace: 0, basePrice: 5118373, iaCharges: 295291, amenitiesCharges: 295291, otherCharges: 590582, ebStp: 196860, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5905815, prelaunchOffer: 5118373, pvtTerraceOfferPrice: 0, prelaunchPrice: 5118373, offerPrice: 5118373, reg: 0, gst: 0, finalTotal: 5118373, categories: ["2bhk", "south", "block-b", "unsold"] },
      { id: "B303", flatNo: "B303", block: "Block B", floor: "3rd Floor", type: "2 BHK + 1T", facing: "South", status: "Unsold", sqft: 952, uds: 329, pvtTerrace: 0, basePrice: 4948900, iaCharges: 285513, amenitiesCharges: 285513, otherCharges: 571026, ebStp: 190342, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5710269, prelaunchOffer: 4948900, pvtTerraceOfferPrice: 0, prelaunchPrice: 4948900, offerPrice: 4948900, reg: 0, gst: 0, finalTotal: 4948900, categories: ["2bhk", "south", "block-b", "unsold"] },
      { id: "B304", flatNo: "B304", block: "Block B", floor: "3rd Floor", type: "3 BHK + 2T", facing: "South", status: "Unsold", sqft: 1200, uds: 415, pvtTerrace: 0, basePrice: 6240278, iaCharges: 360016, amenitiesCharges: 360016, otherCharges: 720032, ebStp: 240011, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7200320, prelaunchOffer: 6240278, pvtTerraceOfferPrice: 0, prelaunchPrice: 6240278, offerPrice: 6240278, reg: 0, gst: 0, finalTotal: 6240278, categories: ["3bhk", "south", "block-b", "unsold"] },
      { id: "B305", flatNo: "B305", block: "Block B", floor: "3rd Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 932, uds: 323, pvtTerrace: 0, basePrice: 4848580, iaCharges: 279726, amenitiesCharges: 279726, otherCharges: 559452, ebStp: 186484, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5594516, prelaunchOffer: 4848580, pvtTerraceOfferPrice: 0, prelaunchPrice: 4848580, offerPrice: 4848580, reg: 0, gst: 0, finalTotal: 4848580, categories: ["2bhk", "east", "block-b", "unsold"] },
      { id: "B306", flatNo: "B306", block: "Block B", floor: "3rd Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 670, uds: 232, pvtTerrace: 0, basePrice: 3482179, iaCharges: 200895, amenitiesCharges: 200895, otherCharges: 401790, ebStp: 133930, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4017899, prelaunchOffer: 3482179, pvtTerraceOfferPrice: 0, prelaunchPrice: 3482179, offerPrice: 3482179, reg: 0, gst: 0, finalTotal: 3482179, categories: ["1bhk", "east", "block-b", "unsold"] },
      { id: "B307", flatNo: "B307", block: "Block B", floor: "3rd Floor", type: "2 BHK + 1T", facing: "East", status: "Unsold", sqft: 1049, uds: 363, pvtTerrace: 0, basePrice: 5453865, iaCharges: 314646, amenitiesCharges: 314646, otherCharges: 629292, ebStp: 209764, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6292921, prelaunchOffer: 5453865, pvtTerraceOfferPrice: 0, prelaunchPrice: 5453865, offerPrice: 5453865, reg: 0, gst: 0, finalTotal: 5453865, categories: ["2bhk", "east", "block-b", "unsold"] },
      { id: "B308", flatNo: "B308", block: "Block B", floor: "3rd Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 737, uds: 255, pvtTerrace: 0, basePrice: 3830448, iaCharges: 220987, amenitiesCharges: 220987, otherCharges: 441974, ebStp: 147325, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4419748, prelaunchOffer: 3830448, pvtTerraceOfferPrice: 0, prelaunchPrice: 3830448, offerPrice: 3830448, reg: 0, gst: 0, finalTotal: 3830448, categories: ["1bhk", "north", "block-b", "unsold"] },
      { id: "B309", flatNo: "B309", block: "Block B", floor: "3rd Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 721, uds: 250, pvtTerrace: 0, basePrice: 3750331, iaCharges: 216365, amenitiesCharges: 216365, otherCharges: 432730, ebStp: 144243, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4327305, prelaunchOffer: 3750331, pvtTerraceOfferPrice: 0, prelaunchPrice: 3750331, offerPrice: 3750331, reg: 0, gst: 0, finalTotal: 3750331, categories: ["1bhk", "north", "block-b", "unsold"] },
      { id: "B310", flatNo: "B310", block: "Block B", floor: "3rd Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 727, uds: 251, pvtTerrace: 0, basePrice: 3778044, iaCharges: 217964, amenitiesCharges: 217964, otherCharges: 435928, ebStp: 145309, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4359281, prelaunchOffer: 3778044, pvtTerraceOfferPrice: 0, prelaunchPrice: 3778044, offerPrice: 3778044, reg: 0, gst: 0, finalTotal: 3778044, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B311", flatNo: "B311", block: "Block B", floor: "3rd Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 616, uds: 213, pvtTerrace: 0, basePrice: 3205307, iaCharges: 184922, amenitiesCharges: 184922, otherCharges: 369844, ebStp: 123281, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3698431, prelaunchOffer: 3205307, pvtTerraceOfferPrice: 0, prelaunchPrice: 3205307, offerPrice: 3205307, reg: 0, gst: 0, finalTotal: 3205307, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B312", flatNo: "B312", block: "Block B", floor: "3rd Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 668, uds: 231, pvtTerrace: 0, basePrice: 3472337, iaCharges: 200327, amenitiesCharges: 200327, otherCharges: 400654, ebStp: 133551, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4006542, prelaunchOffer: 3472337, pvtTerraceOfferPrice: 0, prelaunchPrice: 3472337, offerPrice: 3472337, reg: 0, gst: 0, finalTotal: 3472337, categories: ["1bhk", "north", "block-b", "unsold"] },
      { id: "B313", flatNo: "B313", block: "Block B", floor: "3rd Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 879, uds: 304, pvtTerrace: 0, basePrice: 4568946, iaCharges: 263593, amenitiesCharges: 263593, otherCharges: 527186, ebStp: 175729, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5271861, prelaunchOffer: 4568946, pvtTerraceOfferPrice: 0, prelaunchPrice: 4568946, offerPrice: 4568946, reg: 0, gst: 0, finalTotal: 4568946, categories: ["2bhk", "north", "block-b", "unsold"] },
      { id: "B314", flatNo: "B314", block: "Block B", floor: "3rd Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 791, uds: 274, pvtTerrace: 0, basePrice: 4114659, iaCharges: 237384, amenitiesCharges: 237384, otherCharges: 474768, ebStp: 158256, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4747683, prelaunchOffer: 4114659, pvtTerraceOfferPrice: 0, prelaunchPrice: 4114659, offerPrice: 4114659, reg: 0, gst: 0, finalTotal: 4114659, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B315", flatNo: "B315", block: "Block B", floor: "3rd Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 626, uds: 217, pvtTerrace: 0, basePrice: 3253222, iaCharges: 187686, amenitiesCharges: 187686, otherCharges: 375372, ebStp: 125124, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3753718, prelaunchOffer: 3253222, pvtTerraceOfferPrice: 0, prelaunchPrice: 3253222, offerPrice: 3253222, reg: 0, gst: 0, finalTotal: 3253222, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B316", flatNo: "B316", block: "Block B", floor: "3rd Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 618, uds: 214, pvtTerrace: 0, basePrice: 3214631, iaCharges: 185459, amenitiesCharges: 185459, otherCharges: 370918, ebStp: 123640, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3709190, prelaunchOffer: 3214631, pvtTerraceOfferPrice: 0, prelaunchPrice: 3214631, offerPrice: 3214631, reg: 0, gst: 0, finalTotal: 3214631, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B317", flatNo: "B317", block: "Block B", floor: "3rd Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 976, uds: 338, pvtTerrace: 0, basePrice: 5077105, iaCharges: 292910, amenitiesCharges: 292910, otherCharges: 585820, ebStp: 195273, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5858199, prelaunchOffer: 5077105, pvtTerraceOfferPrice: 0, prelaunchPrice: 5077105, offerPrice: 5077105, reg: 0, gst: 0, finalTotal: 5077105, categories: ["2bhk", "north", "block-b", "unsold"] },
      { id: "B318", flatNo: "B318", block: "Block B", floor: "3rd Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 976, uds: 338, pvtTerrace: 0, basePrice: 5076501, iaCharges: 292875, amenitiesCharges: 292875, otherCharges: 585750, ebStp: 195250, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5857501, prelaunchOffer: 5076501, pvtTerraceOfferPrice: 0, prelaunchPrice: 5076501, offerPrice: 5076501, reg: 0, gst: 0, finalTotal: 5076501, categories: ["2bhk", "north", "block-b", "unsold"] },
      { id: "B319", flatNo: "B319", block: "Block B", floor: "3rd Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 1011, uds: 350, pvtTerrace: 0, basePrice: 5257284, iaCharges: 303305, amenitiesCharges: 303305, otherCharges: 606610, ebStp: 202203, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6066096, prelaunchOffer: 5257284, pvtTerraceOfferPrice: 0, prelaunchPrice: 5257284, offerPrice: 5257284, reg: 0, gst: 0, finalTotal: 5257284, categories: ["2bhk", "north", "block-b", "unsold"] },
      // ============================================================
      // Block B · 4th Floor
      // ============================================================
      { id: "B401", flatNo: "B401", block: "Block B", floor: "4th Floor", type: "2 BHK + 2T", facing: "South", status: "Unsold", sqft: 1280, uds: 443, pvtTerrace: 0, basePrice: 6658219, iaCharges: 384128, amenitiesCharges: 384128, otherCharges: 768256, ebStp: 256085, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7682560, prelaunchOffer: 6658219, pvtTerraceOfferPrice: 0, prelaunchPrice: 6658219, offerPrice: 6658219, reg: 0, gst: 0, finalTotal: 6658219, categories: ["2bhk", "south", "block-b", "unsold"] },
      { id: "B402", flatNo: "B402", block: "Block B", floor: "4th Floor", type: "2 BHK + 1T", facing: "South", status: "Unsold", sqft: 984, uds: 341, pvtTerrace: 0, basePrice: 5118373, iaCharges: 295291, amenitiesCharges: 295291, otherCharges: 590582, ebStp: 196860, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5905815, prelaunchOffer: 5118373, pvtTerraceOfferPrice: 0, prelaunchPrice: 5118373, offerPrice: 5118373, reg: 0, gst: 0, finalTotal: 5118373, categories: ["2bhk", "south", "block-b", "unsold"] },
      { id: "B403", flatNo: "B403", block: "Block B", floor: "4th Floor", type: "2 BHK + 1T", facing: "South", status: "Unsold", sqft: 952, uds: 329, pvtTerrace: 0, basePrice: 4948900, iaCharges: 285513, amenitiesCharges: 285513, otherCharges: 571026, ebStp: 190342, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5710269, prelaunchOffer: 4948900, pvtTerraceOfferPrice: 0, prelaunchPrice: 4948900, offerPrice: 4948900, reg: 0, gst: 0, finalTotal: 4948900, categories: ["2bhk", "south", "block-b", "unsold"] },
      { id: "B404", flatNo: "B404", block: "Block B", floor: "4th Floor", type: "3 BHK + 2T", facing: "South", status: "Unsold", sqft: 1200, uds: 415, pvtTerrace: 0, basePrice: 6240278, iaCharges: 360016, amenitiesCharges: 360016, otherCharges: 720032, ebStp: 240011, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7200320, prelaunchOffer: 6240278, pvtTerraceOfferPrice: 0, prelaunchPrice: 6240278, offerPrice: 6240278, reg: 0, gst: 0, finalTotal: 6240278, categories: ["3bhk", "south", "block-b", "unsold"] },
      { id: "B405", flatNo: "B405", block: "Block B", floor: "4th Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 932, uds: 323, pvtTerrace: 0, basePrice: 4848580, iaCharges: 279726, amenitiesCharges: 279726, otherCharges: 559452, ebStp: 186484, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5594516, prelaunchOffer: 4848580, pvtTerraceOfferPrice: 0, prelaunchPrice: 4848580, offerPrice: 4848580, reg: 0, gst: 0, finalTotal: 4848580, categories: ["2bhk", "east", "block-b", "unsold"] },
      { id: "B406", flatNo: "B406", block: "Block B", floor: "4th Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 670, uds: 232, pvtTerrace: 0, basePrice: 3482179, iaCharges: 200895, amenitiesCharges: 200895, otherCharges: 401790, ebStp: 133930, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4017899, prelaunchOffer: 3482179, pvtTerraceOfferPrice: 0, prelaunchPrice: 3482179, offerPrice: 3482179, reg: 0, gst: 0, finalTotal: 3482179, categories: ["1bhk", "east", "block-b", "unsold"] },
      { id: "B407", flatNo: "B407", block: "Block B", floor: "4th Floor", type: "2 BHK + 1T", facing: "East", status: "Unsold", sqft: 1049, uds: 363, pvtTerrace: 0, basePrice: 5453865, iaCharges: 314646, amenitiesCharges: 314646, otherCharges: 629292, ebStp: 209764, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6292921, prelaunchOffer: 5453865, pvtTerraceOfferPrice: 0, prelaunchPrice: 5453865, offerPrice: 5453865, reg: 0, gst: 0, finalTotal: 5453865, categories: ["2bhk", "east", "block-b", "unsold"] },
      { id: "B408", flatNo: "B408", block: "Block B", floor: "4th Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 737, uds: 255, pvtTerrace: 0, basePrice: 3830448, iaCharges: 220987, amenitiesCharges: 220987, otherCharges: 441974, ebStp: 147325, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4419748, prelaunchOffer: 3830448, pvtTerraceOfferPrice: 0, prelaunchPrice: 3830448, offerPrice: 3830448, reg: 0, gst: 0, finalTotal: 3830448, categories: ["1bhk", "north", "block-b", "unsold"] },
      { id: "B409", flatNo: "B409", block: "Block B", floor: "4th Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 721, uds: 250, pvtTerrace: 0, basePrice: 3750331, iaCharges: 216365, amenitiesCharges: 216365, otherCharges: 432730, ebStp: 144243, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4327305, prelaunchOffer: 3750331, pvtTerraceOfferPrice: 0, prelaunchPrice: 3750331, offerPrice: 3750331, reg: 0, gst: 0, finalTotal: 3750331, categories: ["1bhk", "north", "block-b", "unsold"] },
      { id: "B410", flatNo: "B410", block: "Block B", floor: "4th Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 727, uds: 251, pvtTerrace: 0, basePrice: 3778044, iaCharges: 217964, amenitiesCharges: 217964, otherCharges: 435928, ebStp: 145309, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4359281, prelaunchOffer: 3778044, pvtTerraceOfferPrice: 0, prelaunchPrice: 3778044, offerPrice: 3778044, reg: 0, gst: 0, finalTotal: 3778044, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B411", flatNo: "B411", block: "Block B", floor: "4th Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 616, uds: 213, pvtTerrace: 0, basePrice: 3205307, iaCharges: 184922, amenitiesCharges: 184922, otherCharges: 369844, ebStp: 123281, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3698431, prelaunchOffer: 3205307, pvtTerraceOfferPrice: 0, prelaunchPrice: 3205307, offerPrice: 3205307, reg: 0, gst: 0, finalTotal: 3205307, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B412", flatNo: "B412", block: "Block B", floor: "4th Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 668, uds: 231, pvtTerrace: 0, basePrice: 3472337, iaCharges: 200327, amenitiesCharges: 200327, otherCharges: 400654, ebStp: 133551, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4006542, prelaunchOffer: 3472337, pvtTerraceOfferPrice: 0, prelaunchPrice: 3472337, offerPrice: 3472337, reg: 0, gst: 0, finalTotal: 3472337, categories: ["1bhk", "north", "block-b", "unsold"] },
      { id: "B413", flatNo: "B413", block: "Block B", floor: "4th Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 879, uds: 304, pvtTerrace: 0, basePrice: 4568946, iaCharges: 263593, amenitiesCharges: 263593, otherCharges: 527186, ebStp: 175729, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5271861, prelaunchOffer: 4568946, pvtTerraceOfferPrice: 0, prelaunchPrice: 4568946, offerPrice: 4568946, reg: 0, gst: 0, finalTotal: 4568946, categories: ["2bhk", "north", "block-b", "unsold"] },
      { id: "B414", flatNo: "B414", block: "Block B", floor: "4th Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 791, uds: 274, pvtTerrace: 0, basePrice: 4114659, iaCharges: 237384, amenitiesCharges: 237384, otherCharges: 474768, ebStp: 158256, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4747683, prelaunchOffer: 4114659, pvtTerraceOfferPrice: 0, prelaunchPrice: 4114659, offerPrice: 4114659, reg: 0, gst: 0, finalTotal: 4114659, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B415", flatNo: "B415", block: "Block B", floor: "4th Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 626, uds: 217, pvtTerrace: 0, basePrice: 3253222, iaCharges: 187686, amenitiesCharges: 187686, otherCharges: 375372, ebStp: 125124, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3753718, prelaunchOffer: 3253222, pvtTerraceOfferPrice: 0, prelaunchPrice: 3253222, offerPrice: 3253222, reg: 0, gst: 0, finalTotal: 3253222, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B416", flatNo: "B416", block: "Block B", floor: "4th Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 618, uds: 214, pvtTerrace: 0, basePrice: 3214631, iaCharges: 185459, amenitiesCharges: 185459, otherCharges: 370918, ebStp: 123640, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3709190, prelaunchOffer: 3214631, pvtTerraceOfferPrice: 0, prelaunchPrice: 3214631, offerPrice: 3214631, reg: 0, gst: 0, finalTotal: 3214631, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B417", flatNo: "B417", block: "Block B", floor: "4th Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 976, uds: 338, pvtTerrace: 0, basePrice: 5077105, iaCharges: 292910, amenitiesCharges: 292910, otherCharges: 585820, ebStp: 195273, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5858199, prelaunchOffer: 5077105, pvtTerraceOfferPrice: 0, prelaunchPrice: 5077105, offerPrice: 5077105, reg: 0, gst: 0, finalTotal: 5077105, categories: ["2bhk", "north", "block-b", "unsold"] },
      { id: "B418", flatNo: "B418", block: "Block B", floor: "4th Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 976, uds: 338, pvtTerrace: 0, basePrice: 5076501, iaCharges: 292875, amenitiesCharges: 292875, otherCharges: 585750, ebStp: 195250, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5857501, prelaunchOffer: 5076501, pvtTerraceOfferPrice: 0, prelaunchPrice: 5076501, offerPrice: 5076501, reg: 0, gst: 0, finalTotal: 5076501, categories: ["2bhk", "north", "block-b", "unsold"] },
      { id: "B419", flatNo: "B419", block: "Block B", floor: "4th Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 1011, uds: 350, pvtTerrace: 0, basePrice: 5257284, iaCharges: 303305, amenitiesCharges: 303305, otherCharges: 606610, ebStp: 202203, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6066096, prelaunchOffer: 5257284, pvtTerraceOfferPrice: 0, prelaunchPrice: 5257284, offerPrice: 5257284, reg: 0, gst: 0, finalTotal: 5257284, categories: ["2bhk", "north", "block-b", "unsold"] },
      // ============================================================
      // Block B · 5th Floor
      // ============================================================
      { id: "B501", flatNo: "B501", block: "Block B", floor: "5th Floor", type: "2 BHK + 2T", facing: "South", status: "Unsold", sqft: 1280, uds: 443, pvtTerrace: 0, basePrice: 6658219, iaCharges: 384128, amenitiesCharges: 384128, otherCharges: 768256, ebStp: 256085, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7682560, prelaunchOffer: 6658219, pvtTerraceOfferPrice: 0, prelaunchPrice: 6658219, offerPrice: 6658219, reg: 0, gst: 0, finalTotal: 6658219, categories: ["2bhk", "south", "block-b", "unsold"] },
      { id: "B502", flatNo: "B502", block: "Block B", floor: "5th Floor", type: "2 BHK + 1T", facing: "South", status: "Unsold", sqft: 984, uds: 341, pvtTerrace: 0, basePrice: 5118373, iaCharges: 295291, amenitiesCharges: 295291, otherCharges: 590582, ebStp: 196860, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5905815, prelaunchOffer: 5118373, pvtTerraceOfferPrice: 0, prelaunchPrice: 5118373, offerPrice: 5118373, reg: 0, gst: 0, finalTotal: 5118373, categories: ["2bhk", "south", "block-b", "unsold"] },
      { id: "B503", flatNo: "B503", block: "Block B", floor: "5th Floor", type: "2 BHK + 1T", facing: "South", status: "Unsold", sqft: 952, uds: 329, pvtTerrace: 0, basePrice: 4948900, iaCharges: 285513, amenitiesCharges: 285513, otherCharges: 571026, ebStp: 190342, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5710269, prelaunchOffer: 4948900, pvtTerraceOfferPrice: 0, prelaunchPrice: 4948900, offerPrice: 4948900, reg: 0, gst: 0, finalTotal: 4948900, categories: ["2bhk", "south", "block-b", "unsold"] },
      { id: "B504", flatNo: "B504", block: "Block B", floor: "5th Floor", type: "3 BHK + 2T", facing: "South", status: "Unsold", sqft: 1200, uds: 415, pvtTerrace: 0, basePrice: 6240278, iaCharges: 360016, amenitiesCharges: 360016, otherCharges: 720032, ebStp: 240011, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 7200320, prelaunchOffer: 6240278, pvtTerraceOfferPrice: 0, prelaunchPrice: 6240278, offerPrice: 6240278, reg: 0, gst: 0, finalTotal: 6240278, categories: ["3bhk", "south", "block-b", "unsold"] },
      { id: "B505", flatNo: "B505", block: "Block B", floor: "5th Floor", type: "2 BHK + 2T", facing: "East", status: "Unsold", sqft: 932, uds: 323, pvtTerrace: 0, basePrice: 4848580, iaCharges: 279726, amenitiesCharges: 279726, otherCharges: 559452, ebStp: 186484, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5594516, prelaunchOffer: 4848580, pvtTerraceOfferPrice: 0, prelaunchPrice: 4848580, offerPrice: 4848580, reg: 0, gst: 0, finalTotal: 4848580, categories: ["2bhk", "east", "block-b", "unsold"] },
      { id: "B506", flatNo: "B506", block: "Block B", floor: "5th Floor", type: "1 BHK + 1T", facing: "East", status: "Unsold", sqft: 670, uds: 232, pvtTerrace: 0, basePrice: 3482179, iaCharges: 200895, amenitiesCharges: 200895, otherCharges: 401790, ebStp: 133930, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4017899, prelaunchOffer: 3482179, pvtTerraceOfferPrice: 0, prelaunchPrice: 3482179, offerPrice: 3482179, reg: 0, gst: 0, finalTotal: 3482179, categories: ["1bhk", "east", "block-b", "unsold"] },
      { id: "B507", flatNo: "B507", block: "Block B", floor: "5th Floor", type: "2 BHK + 1T", facing: "East", status: "Unsold", sqft: 1049, uds: 363, pvtTerrace: 0, basePrice: 5453865, iaCharges: 314646, amenitiesCharges: 314646, otherCharges: 629292, ebStp: 209764, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6292921, prelaunchOffer: 5453865, pvtTerraceOfferPrice: 0, prelaunchPrice: 5453865, offerPrice: 5453865, reg: 0, gst: 0, finalTotal: 5453865, categories: ["2bhk", "east", "block-b", "unsold"] },
      { id: "B508", flatNo: "B508", block: "Block B", floor: "5th Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 737, uds: 255, pvtTerrace: 0, basePrice: 3830448, iaCharges: 220987, amenitiesCharges: 220987, otherCharges: 441974, ebStp: 147325, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4419748, prelaunchOffer: 3830448, pvtTerraceOfferPrice: 0, prelaunchPrice: 3830448, offerPrice: 3830448, reg: 0, gst: 0, finalTotal: 3830448, categories: ["1bhk", "north", "block-b", "unsold"] },
      { id: "B509", flatNo: "B509", block: "Block B", floor: "5th Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 721, uds: 250, pvtTerrace: 0, basePrice: 3750331, iaCharges: 216365, amenitiesCharges: 216365, otherCharges: 432730, ebStp: 144243, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4327305, prelaunchOffer: 3750331, pvtTerraceOfferPrice: 0, prelaunchPrice: 3750331, offerPrice: 3750331, reg: 0, gst: 0, finalTotal: 3750331, categories: ["1bhk", "north", "block-b", "unsold"] },
      { id: "B510", flatNo: "B510", block: "Block B", floor: "5th Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 727, uds: 251, pvtTerrace: 0, basePrice: 3778044, iaCharges: 217964, amenitiesCharges: 217964, otherCharges: 435928, ebStp: 145309, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4359281, prelaunchOffer: 3778044, pvtTerraceOfferPrice: 0, prelaunchPrice: 3778044, offerPrice: 3778044, reg: 0, gst: 0, finalTotal: 3778044, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B511", flatNo: "B511", block: "Block B", floor: "5th Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 616, uds: 213, pvtTerrace: 0, basePrice: 3205307, iaCharges: 184922, amenitiesCharges: 184922, otherCharges: 369844, ebStp: 123281, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3698431, prelaunchOffer: 3205307, pvtTerraceOfferPrice: 0, prelaunchPrice: 3205307, offerPrice: 3205307, reg: 0, gst: 0, finalTotal: 3205307, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B512", flatNo: "B512", block: "Block B", floor: "5th Floor", type: "1 BHK + 1T", facing: "North", status: "Unsold", sqft: 668, uds: 231, pvtTerrace: 0, basePrice: 3472337, iaCharges: 200327, amenitiesCharges: 200327, otherCharges: 400654, ebStp: 133551, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4006542, prelaunchOffer: 3472337, pvtTerraceOfferPrice: 0, prelaunchPrice: 3472337, offerPrice: 3472337, reg: 0, gst: 0, finalTotal: 3472337, categories: ["1bhk", "north", "block-b", "unsold"] },
      { id: "B513", flatNo: "B513", block: "Block B", floor: "5th Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 879, uds: 304, pvtTerrace: 0, basePrice: 4568946, iaCharges: 263593, amenitiesCharges: 263593, otherCharges: 527186, ebStp: 175729, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5271861, prelaunchOffer: 4568946, pvtTerraceOfferPrice: 0, prelaunchPrice: 4568946, offerPrice: 4568946, reg: 0, gst: 0, finalTotal: 4568946, categories: ["2bhk", "north", "block-b", "unsold"] },
      { id: "B514", flatNo: "B514", block: "Block B", floor: "5th Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 791, uds: 274, pvtTerrace: 0, basePrice: 4114659, iaCharges: 237384, amenitiesCharges: 237384, otherCharges: 474768, ebStp: 158256, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4747683, prelaunchOffer: 4114659, pvtTerraceOfferPrice: 0, prelaunchPrice: 4114659, offerPrice: 4114659, reg: 0, gst: 0, finalTotal: 4114659, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B515", flatNo: "B515", block: "Block B", floor: "5th Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 626, uds: 217, pvtTerrace: 0, basePrice: 3253222, iaCharges: 187686, amenitiesCharges: 187686, otherCharges: 375372, ebStp: 125124, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3753718, prelaunchOffer: 3253222, pvtTerraceOfferPrice: 0, prelaunchPrice: 3253222, offerPrice: 3253222, reg: 0, gst: 0, finalTotal: 3253222, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B516", flatNo: "B516", block: "Block B", floor: "5th Floor", type: "1 BHK + 1T", facing: "South", status: "Unsold", sqft: 618, uds: 214, pvtTerrace: 0, basePrice: 3214631, iaCharges: 185459, amenitiesCharges: 185459, otherCharges: 370918, ebStp: 123640, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3709190, prelaunchOffer: 3214631, pvtTerraceOfferPrice: 0, prelaunchPrice: 3214631, offerPrice: 3214631, reg: 0, gst: 0, finalTotal: 3214631, categories: ["1bhk", "south", "block-b", "unsold"] },
      { id: "B517", flatNo: "B517", block: "Block B", floor: "5th Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 976, uds: 338, pvtTerrace: 0, basePrice: 5077105, iaCharges: 292910, amenitiesCharges: 292910, otherCharges: 585820, ebStp: 195273, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5858199, prelaunchOffer: 5077105, pvtTerraceOfferPrice: 0, prelaunchPrice: 5077105, offerPrice: 5077105, reg: 0, gst: 0, finalTotal: 5077105, categories: ["2bhk", "north", "block-b", "unsold"] },
      { id: "B518", flatNo: "B518", block: "Block B", floor: "5th Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 976, uds: 338, pvtTerrace: 0, basePrice: 5076501, iaCharges: 292875, amenitiesCharges: 292875, otherCharges: 585750, ebStp: 195250, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 5857501, prelaunchOffer: 5076501, pvtTerraceOfferPrice: 0, prelaunchPrice: 5076501, offerPrice: 5076501, reg: 0, gst: 0, finalTotal: 5076501, categories: ["2bhk", "north", "block-b", "unsold"] },
      { id: "B519", flatNo: "B519", block: "Block B", floor: "5th Floor", type: "2 BHK + 2T", facing: "North", status: "Unsold", sqft: 1011, uds: 350, pvtTerrace: 0, basePrice: 5257284, iaCharges: 303305, amenitiesCharges: 303305, otherCharges: 606610, ebStp: 202203, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 6066096, prelaunchOffer: 5257284, pvtTerraceOfferPrice: 0, prelaunchPrice: 5257284, offerPrice: 5257284, reg: 0, gst: 0, finalTotal: 5257284, categories: ["2bhk", "north", "block-b", "unsold"] },
      // ============================================================
      // Shops · Block A · 1st Floor
      // ============================================================
      { id: "SHOP-1", flatNo: "SHOP-1", block: "Block A", floor: "1st Floor", type: "Shop", facing: "South", status: "Unsold", sqft: 417, uds: 144, pvtTerrace: 0, basePrice: 2999061, iaCharges: 124961, amenitiesCharges: 124961, otherCharges: 249922, ebStp: 83307, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3332290, prelaunchOffer: 2999061, pvtTerraceOfferPrice: 0, prelaunchPrice: 2999061, offerPrice: 2999061, reg: 0, gst: 0, finalTotal: 2999061, categories: ["shop", "south", "block-a", "unsold"] },
      { id: "SHOP-2", flatNo: "SHOP-2", block: "Block A", floor: "1st Floor", type: "Shop", facing: "South", status: "Unsold", sqft: 382, uds: 132, pvtTerrace: 0, basePrice: 2748986, iaCharges: 114541, amenitiesCharges: 114541, otherCharges: 229082, ebStp: 76361, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3054429, prelaunchOffer: 2748986, pvtTerraceOfferPrice: 0, prelaunchPrice: 2748986, offerPrice: 2748986, reg: 0, gst: 0, finalTotal: 2748986, categories: ["shop", "south", "block-a", "unsold"] },
      { id: "SHOP-3", flatNo: "SHOP-3", block: "Block A", floor: "1st Floor", type: "Shop", facing: "South", status: "Unsold", sqft: 391, uds: 135, pvtTerrace: 0, basePrice: 2815689, iaCharges: 117320, amenitiesCharges: 117320, otherCharges: 234640, ebStp: 78214, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3128543, prelaunchOffer: 2815689, pvtTerraceOfferPrice: 0, prelaunchPrice: 2815689, offerPrice: 2815689, reg: 0, gst: 0, finalTotal: 2815689, categories: ["shop", "south", "block-a", "unsold"] },
      { id: "SHOP-4", flatNo: "SHOP-4", block: "Block A", floor: "1st Floor", type: "Shop", facing: "South", status: "Unsold", sqft: 458, uds: 159, pvtTerrace: 0, basePrice: 3300777, iaCharges: 137532, amenitiesCharges: 137532, otherCharges: 275064, ebStp: 91688, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3667530, prelaunchOffer: 3300777, pvtTerraceOfferPrice: 0, prelaunchPrice: 3300777, offerPrice: 3300777, reg: 0, gst: 0, finalTotal: 3300777, categories: ["shop", "south", "block-a", "unsold"] },
      { id: "SHOP-5", flatNo: "SHOP-5", block: "Block A", floor: "1st Floor", type: "Shop", facing: "East", status: "Unsold", sqft: 375, uds: 130, pvtTerrace: 0, basePrice: 2702605, iaCharges: 112609, amenitiesCharges: 112609, otherCharges: 225218, ebStp: 75072, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3002895, prelaunchOffer: 2702605, pvtTerraceOfferPrice: 0, prelaunchPrice: 2702605, offerPrice: 2702605, reg: 0, gst: 0, finalTotal: 2702605, categories: ["shop", "east", "block-a", "unsold"] },
      { id: "SHOP-6", flatNo: "SHOP-6", block: "Block A", floor: "1st Floor", type: "Shop", facing: "East", status: "Unsold", sqft: 456, uds: 158, pvtTerrace: 0, basePrice: 3285118, iaCharges: 136880, amenitiesCharges: 136880, otherCharges: 273760, ebStp: 91253, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3650131, prelaunchOffer: 3285118, pvtTerraceOfferPrice: 0, prelaunchPrice: 3285118, offerPrice: 3285118, reg: 0, gst: 0, finalTotal: 3285118, categories: ["shop", "east", "block-a", "unsold"] },
      { id: "SHOP-7", flatNo: "SHOP-7", block: "Block A", floor: "1st Floor", type: "Shop", facing: "North", status: "Unsold", sqft: 379, uds: 131, pvtTerrace: 0, basePrice: 2731055, iaCharges: 113794, amenitiesCharges: 113794, otherCharges: 227588, ebStp: 75863, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 3034506, prelaunchOffer: 2731055, pvtTerraceOfferPrice: 0, prelaunchPrice: 2731055, offerPrice: 2731055, reg: 0, gst: 0, finalTotal: 2731055, categories: ["shop", "north", "block-a", "unsold"] },
      { id: "SHOP-8", flatNo: "SHOP-8", block: "Block A", floor: "1st Floor", type: "Shop", facing: "North", status: "Unsold", sqft: 296, uds: 103, pvtTerrace: 0, basePrice: 2132883, iaCharges: 88870, amenitiesCharges: 88870, otherCharges: 177740, ebStp: 59247, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 2369870, prelaunchOffer: 2132883, pvtTerraceOfferPrice: 0, prelaunchPrice: 2132883, offerPrice: 2132883, reg: 0, gst: 0, finalTotal: 2132883, categories: ["shop", "north", "block-a", "unsold"] },
      { id: "SHOP-9", flatNo: "SHOP-9", block: "Block A", floor: "1st Floor", type: "Shop", facing: "North", status: "Unsold", sqft: 619, uds: 214, pvtTerrace: 0, basePrice: 4459108, iaCharges: 185796, amenitiesCharges: 185796, otherCharges: 371592, ebStp: 123864, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4954565, prelaunchOffer: 4459108, pvtTerraceOfferPrice: 0, prelaunchPrice: 4459108, offerPrice: 4459108, reg: 0, gst: 0, finalTotal: 4459108, categories: ["shop", "north", "block-a", "unsold"] },
      { id: "SHOP-10", flatNo: "SHOP-10", block: "Block A", floor: "1st Floor", type: "Shop", facing: "North", status: "Unsold", sqft: 532, uds: 184, pvtTerrace: 0, basePrice: 3830573, iaCharges: 159607, amenitiesCharges: 159607, otherCharges: 319214, ebStp: 106405, pvtTerracePrice: 0, floorRise: 0, carParkType: "", carParkPrice: 0, twParkType: "", twParkPrice: 0, total: 4256193, prelaunchOffer: 3830573, pvtTerraceOfferPrice: 0, prelaunchPrice: 3830573, offerPrice: 3830573, reg: 0, gst: 0, finalTotal: 3830573, categories: ["shop", "north", "block-a", "unsold"] },
    ],

    // Fallback flat tabs (used only if floorPlanBlocks is removed)
    floorPlanTabs: [],
    floorPlans: [],

    // ---------- Master Plan (Site Plan + Parking Plan) ----------
    masterPlan: {
      eyebrow: "MASTER PLAN",
      heading: ["Thoughtfully Planned", "Site & Parking Layout"],
      description:
        "Every block, driveway and green pocket at Privana is planned around ease of movement, safety and open, breathable spaces. Explore the full site layout and the dedicated parking plan below.",
      // highlights: [
      //   { label: "Site Area", value: "3.2 Acres" },
      //   { label: "Open Space", value: "55%" },
      //   { label: "Blocks", value: "2 (A & B)" },
      //   { label: "Covered Parking", value: "140+ Cars" },
      // ],
      tabs: [
        {
          id: "site",
          label: "Site Plan",
          video: "/siteplan.mp4",
          image: "/siteplan.png",
        },
        {
          id: "parking",
          label: "Parking Plan",
          video: "/parkingplan.mp4",
          image: "/parkingplan.png",
        },
      ],
    },

    // ---------- Gallery ----------
    galleryHeading: ["A Glimpse", "Into Your", "Tomorrow"],
    galleryCtaHref: "#gallery",
    galleryFilters: ["All", "Exteriors", "Interiors", "Amenities", "Lifestyle"],
    galleryImages: [
      { id: "p1", image: "/spyka1.jpeg", title: "Privana — Elevation", category: "Exteriors", size: "large" },
      { id: "p2", image: "/spyka2.jpeg", title: "Privana — Entrance", category: "Exteriors", size: "small" },
      { id: "p3", image: "/spyka3.jpeg", title: "Living Spaces", category: "Interiors", size: "small" },
    ],
    gallery: ["/priv1.png", "/privanaban.jpeg", "/gurudev3.png"],

    // ---------- Project facts ----------
    floors: "Stilt + 5",
    totalUnits: 186,
    unitTypes: [
      { type: "Studio", count: 10, sizeRange: "389 - 517 sqft" },
      { type: "1 BHK", count: 59, sizeRange: "573 - 808 sqft" },
      { type: "2 BHK", count: 102, sizeRange: "836 - 1280 sqft" },
      { type: "3 BHK", count: 5, sizeRange: "1200 - 1200 sqft" },
      { type: "Shop", count: 10, sizeRange: "296 - 619 sqft" },
    ],
    nearbyLandmarks: [
      { name: "Guduvancheri Railway Station", distance: "5 mins" },
      { name: "GST Road", distance: "8 mins" },
      { name: "Chennai Trade Centre", distance: "20 mins" },
    ],
    possession: "Dec 2026",
    reraId: "TN/35/Building/0000/2025",

    // ---------- Brochure ----------
    // No brochure yet → "Download Brochure" button is hidden.
    // When ready, add the PDF to public/brochures/privana.pdf and set:
    // brochureUrl: "/brochures/privana.pdf",
    brochureUrl: null,

    // ---------- Privana-specific Quick Facts (6 cards) ----------
    quickFacts: [
      { label: "Type",              value: "Studio, 1 , 2 & 3 BHK",           icon: "type" },
      { label: "Development Size",  value: "1.41 Acres",                    icon: "size" },
      { label: "No. of Units",      value: "186",                          icon: "units" },
      { label: "Price / Sq.Ft",     value: "₹ 5,100 / Sq.Ft",          icon: "price" },
      { label: "Floors",            value: "Stilt + 5",                    icon: "floors" },
      { label: "RERA Number",       value: "TNRERA/35/BLG/0317/2026  dated 03.09.2026",     icon: "rera" },
    ],

    specifications: [],

    // ---------- Location ----------
    locationHeading: ["Well Connected", "for a Brighter You"],
    locationDescription:
      "Privana sits at the heart of a fast-growing neighbourhood, close to schools, IT parks, hospitals and retail. Excellent road and rail connectivity makes everyday commuting simple and stress-free.",
    locationMapUrl: "https://maps.google.com/?q=Guduvancheri+Chennai",
    locationMapImage: "",
    // ✅ UPDATED: New Google Maps embed URL specifically for PKR ESTATES PRIVANA
    locationMapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.4538000050293!2d80.08783897585568!3d12.81392591831403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52f700792510ff%3A0x3b167532aa06e06c!2sPKR%20ESTATES%20PRIVANA!5e0!3m2!1sen!2sin!4v1790075321648!5m2!1sen!2sin",
    locationLandmarks: [
      { label: "Guduvancheri (GST Road)", distance: "5 mins" },
      { label: "Urapakkam", distance: "10 mins" },
      { label: "Vandalur", distance: "10 mins" },
      { label: "Perungalathur", distance: "15 mins" },
      { label: "OMR - Thiruporur", distance: "15 mins" },
      { label: "Tambaram", distance: "20 mins" },
    ],
    nearbyColleges: [
      { label: "SRM University", distance: "8 mins" },
      { label: "Crescent Engineering College", distance: "12 mins" },
      { label: "VIT University", distance: "20 mins" },
    ],
    nearbySchools: [
      { label: "Velammal Vidhyashram CBSE", distance: "2 mins" },
      { label: "SRM Public School CBSE", distance: "5 mins" },
      { label: "PSBB Millennium School CBSE", distance: "10 mins" },
    ],

    // ---------- 360 Cinematic Tour ----------
    tourEyebrow: "EXPLORE BEFORE YOU BELONG",
    tourHeading: ["Experience Privana", "in 360°"],
    tourDescription:
      "Take a virtual tour and explore the spaces, views and lifestyle that await you at Privana. Get a real feel of your future home from anywhere, anytime.",
    tourCtaLabel: "Start 360° Tour",
    tourThumbnail: "/topprivana.jpeg",
    tour360Image: "/spyka360.jpeg",
    tourUrl: "https://example.com/privana-360-tour",
    tourTagline: ["See it,", "Feel it,", "Live it."],

    corporateOffice: null,
  },
];

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs() {
  return projects.map((p) => p.slug);
}