const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const blogPosts = [
  {
    id: 1,
    category: "Sustainability",
    title: "The Future of Sustainable Infrastructure",
    description:
      "Exploring innovative approaches to building environmentally responsible structures that meet modern demands while preserving resources for future generations.",
    date: "March 15, 2024",
    readTime: "5 min read",
    imageUrl: asset("/images/water.jpg")
  },
  {
    id: 2,
    category: "Structural",
    title: "Advanced Structural Analysis Techniques",
    description:
      "Modern computational methods are revolutionizing how we design and analyze complex structures, enabling safer and more efficient projects.",
    date: "March 10, 2024",
    readTime: "7 min read",
    imageUrl: asset("/images/bridge.jpg")
  },
  {
    id: 3,
    category: "Technology",
    title: "Smart Cities and IoT Integration",
    description:
      "How Internet of Things technology is transforming urban infrastructure management and improving quality of life for residents worldwide.",
    date: "March 5, 2024",
    readTime: "6 min read",
    imageUrl: asset("/images/tower.jpg")
  },
  {
    id: 4,
    category: "Environmental",
    title: "Water Management in Urban Areas",
    description:
      "Innovative solutions for managing stormwater, wastewater, and drinking water systems in rapidly growing metropolitan regions.",
    date: "February 28, 2024",
    readTime: "8 min read",
    imageUrl: asset("/images/water.jpg")
  },
  {
    id: 5,
    category: "Materials",
    title: "Designing for the Whole Life of a Structure",
    description: "A practical look at durability, inspection access, repair cycles, and embodied carbon when selecting materials for long-lived assets.",
    date: "September 24, 2026",
    readTime: "6 min read",
    imageUrl: asset("/images/bridge.jpg"),
    articleUrl: asset("/articles/whole-life-structure.md")
  },
  {
    id: 6,
    category: "Resilience",
    title: "Flood-Ready Infrastructure Starts with Better Data",
    description: "How rainfall scenarios, terrain models, and maintenance records help teams prioritize drainage upgrades before a storm arrives.",
    date: "September 12, 2026",
    readTime: "4 min read",
    imageUrl: asset("/images/water.jpg"),
    articleUrl: asset("/articles/flood-ready-infrastructure.md")
  },
  {
    id: 7,
    category: "Digital Engineering",
    title: "From BIM Model to Useful Asset Information",
    description: "The handover data owners actually need: clear equipment IDs, inspection points, and revision history rather than an oversized model.",
    date: "August 28, 2026",
    readTime: "5 min read",
    imageUrl: asset("/images/tower.jpg"),
    articleUrl: asset("/articles/bim-asset-information.md")
  }
];

export const projects = [
  {
    id: 1,
    title: "Metropolitan Bridge Expansion",
    category: "infrastructure",
    description:
      "Complete structural redesign and expansion of a major urban bridge system serving 100,000+ daily commuters.",
    imageUrl: asset("/images/bridge.jpg")
  },
  {
    id: 2,
    title: "Downtown Corporate Tower",
    category: "structural",
    description:
      "45-story mixed-use development featuring innovative seismic design and sustainable building practices.",
    imageUrl: asset("/images/tower.jpg")
  },
  {
    id: 3,
    title: "Regional Water Treatment Facility",
    category: "environmental",
    description:
      "State-of-the-art facility processing 50 million gallons daily with advanced filtration technology.",
    imageUrl: asset("/images/water.jpg")
  },
  {
    id: 4,
    title: "Interstate Highway Interchange",
    category: "transportation",
    description: "Complex multi-level interchange design improving traffic flow and reducing congestion by 40%.",
    imageUrl: asset("/images/bridge.jpg")
  },
  {
    id: 5,
    title: "Sports Arena Complex",
    category: "structural",
    description: "65,000-seat stadium with retractable roof featuring cutting-edge structural engineering solutions.",
    imageUrl: asset("/images/tower.jpg")
  },
  {
    id: 6,
    title: "Solar Energy Installation",
    category: "environmental",
    description: "200-acre solar farm generating clean energy for 15,000 homes with minimal environmental impact.",
    imageUrl: asset("/images/water.jpg")
  },
  {
    id: 7,
    title: "Coastal Flood Barrier Study",
    category: "infrastructure",
    description: "Concept study comparing movable gates, habitat impact, maintenance access, and phased construction for a coastal district.",
    imageUrl: asset("/images/water.jpg")
  },
  {
    id: 8,
    title: "Low-Carbon Campus Retrofit",
    category: "environmental",
    description: "A staged retrofit plan for building envelopes, heat pumps, and on-site solar generation across an existing campus.",
    imageUrl: asset("/images/tower.jpg")
  }
];

export const downloads = [
  { id: 1, fileName: "Project Brief Checklist", description: "Questions to prepare before an engineering kickoff meeting.", fileType: "Markdown", filePath: asset("/resources/project-brief-checklist.md") },
  { id: 2, fileName: "Site Visit Field Notes", description: "A reusable field checklist for observations, constraints, and follow-up actions.", fileType: "Markdown", filePath: asset("/resources/site-visit-field-notes.md") },
  { id: 3, fileName: "Design Review Guide", description: "A compact guide to scope, safety, constructability, and handover reviews.", fileType: "Markdown", filePath: asset("/resources/design-review-guide.md") }
];
