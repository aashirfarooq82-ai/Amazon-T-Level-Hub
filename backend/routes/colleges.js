/**
 * Colleges API — serving T Level provider search data
 *
 * GET /api/colleges?location=...&subject=...
 *   Returns filtered list of colleges offering T Levels with Amazon placements.
 *   If no query params supplied, returns the full list.
 */

const express = require('express');
const router = express.Router();

// ── MOCK COLLEGE DATA ──────────────────────────────────────────────────────────
// In production this would query a database or external API.
const colleges = [
  {
    id: 1,
    name: "Birmingham Metropolitan College",
    town: "Birmingham",
    postcode: "B4 7PS",
    region: "West Midlands",
    subjects: ["Digital & IT", "Business & Finance", "Engineering"],
    amazonPartner: true,
    placementHours: 350,
    ofsted: "Good",
    studentSatisfaction: 87,
    website: "https://www.bmetc.ac.uk",
    description: "One of the largest FE colleges in the region with strong industry connections and dedicated T Level support."
  },
  {
    id: 2,
    name: "South & City College Birmingham",
    town: "Birmingham",
    postcode: "B5 5LU",
    region: "West Midlands",
    subjects: ["Health & Science", "Digital & IT", "Construction"],
    amazonPartner: true,
    placementHours: 330,
    ofsted: "Good",
    studentSatisfaction: 84,
    website: "https://www.sccb.ac.uk",
    description: "Offers a wide range of T Levels with a purpose-built digital campus and established employer partnerships."
  },
  {
    id: 3,
    name: "Solihull College & University Centre",
    town: "Solihull",
    postcode: "B91 1SB",
    region: "West Midlands",
    subjects: ["Digital & IT", "Engineering", "Business & Finance"],
    amazonPartner: true,
    placementHours: 340,
    ofsted: "Good",
    studentSatisfaction: 90,
    website: "https://www.solihull.ac.uk",
    description: "Award-winning college with modern facilities and a strong track record of T Level student progression."
  },
  {
    id: 4,
    name: "City of Wolverhampton College",
    town: "Wolverhampton",
    postcode: "WV1 1SE",
    region: "West Midlands",
    subjects: ["Digital & IT", "Health & Science", "Engineering"],
    amazonPartner: true,
    placementHours: 315,
    ofsted: "Good",
    studentSatisfaction: 82,
    website: "https://www.wolvcoll.ac.uk",
    description: "Committed to technical education with tailored Amazon placement pathways for T Level students."
  },
  {
    id: 5,
    name: "Coventry College",
    town: "Coventry",
    postcode: "CV1 2GD",
    region: "West Midlands",
    subjects: ["Digital & IT", "Business & Finance", "Construction"],
    amazonPartner: false,
    placementHours: 320,
    ofsted: "Requires Improvement",
    studentSatisfaction: 75,
    website: "https://www.coventrycollege.ac.uk",
    description: "Offers T Levels across several routes with ongoing development of employer placement opportunities."
  },
  {
    id: 6,
    name: "Leeds City College",
    town: "Leeds",
    postcode: "LS2 7BL",
    region: "Yorkshire",
    subjects: ["Digital & IT", "Business & Finance", "Health & Science", "Engineering"],
    amazonPartner: true,
    placementHours: 345,
    ofsted: "Good",
    studentSatisfaction: 86,
    website: "https://www.leedscitycollege.ac.uk",
    description: "A major FE provider in Yorkshire with an extensive T Level curriculum and strong Amazon partnership."
  },
  {
    id: 7,
    name: "Bradford College",
    town: "Bradford",
    postcode: "BD7 1AY",
    region: "Yorkshire",
    subjects: ["Digital & IT", "Business & Finance", "Health & Science"],
    amazonPartner: true,
    placementHours: 325,
    ofsted: "Good",
    studentSatisfaction: 80,
    website: "https://www.bradfordcollege.ac.uk",
    description: "A diverse college community offering T Levels with dedicated placement support and mentoring."
  },
  {
    id: 8,
    name: "Sheffield College",
    town: "Sheffield",
    postcode: "S1 2GT",
    region: "Yorkshire",
    subjects: ["Digital & IT", "Engineering", "Construction"],
    amazonPartner: false,
    placementHours: 315,
    ofsted: "Requires Improvement",
    studentSatisfaction: 73,
    website: "https://www.sheffcol.ac.uk",
    description: "Offers a growing range of T Levels with ongoing investment in employer placement infrastructure."
  },
  {
    id: 9,
    name: "Greater Manchester College (Trafford)",
    town: "Manchester",
    postcode: "M33 3JX",
    region: "North West",
    subjects: ["Digital & IT", "Business & Finance", "Engineering"],
    amazonPartner: true,
    placementHours: 340,
    ofsted: "Outstanding",
    studentSatisfaction: 92,
    website: "https://www.trafford.ac.uk",
    description: "An Ofsted Outstanding college with state-of-the-art T Level facilities and premium employer partnerships."
  },
  {
    id: 10,
    name: "The Manchester College",
    town: "Manchester",
    postcode: "M1 3HB",
    region: "North West",
    subjects: ["Digital & IT", "Health & Science", "Business & Finance", "Construction"],
    amazonPartner: true,
    placementHours: 350,
    ofsted: "Good",
    studentSatisfaction: 85,
    website: "https://www.tmc.ac.uk",
    description: "The largest FE college in the UK with an unrivalled breadth of T Level subjects and placement options."
  },
  {
    id: 11,
    name: "Liverpool City College",
    town: "Liverpool",
    postcode: "L1 6AJ",
    region: "North West",
    subjects: ["Digital & IT", "Health & Science", "Business & Finance"],
    amazonPartner: true,
    placementHours: 335,
    ofsted: "Good",
    studentSatisfaction: 83,
    website: "https://www.liv-coll.ac.uk",
    description: "A vibrant college with strong digital and science pathways and an established Amazon placement programme."
  },
  {
    id: 12,
    name: "University College of Football Business (UCFB)",
    town: "Manchester",
    postcode: "M3 4JA",
    region: "North West",
    subjects: ["Business & Finance", "Digital & IT"],
    amazonPartner: false,
    placementHours: 315,
    ofsted: "Good",
    studentSatisfaction: 88,
    website: "https://www.ucfb.ac.uk",
    description: "Specialist institution offering business and digital T Levels with unique industry placement opportunities."
  },
  {
    id: 13,
    name: "City of Glasgow College",
    town: "Glasgow",
    postcode: "G1 1TX",
    region: "Scotland",
    subjects: ["Digital & IT", "Engineering", "Business & Finance", "Health & Science"],
    amazonPartner: true,
    placementHours: 340,
    ofsted: "Outstanding",
    studentSatisfaction: 91,
    website: "https://www.cityofglasgowcollege.ac.uk",
    description: "Scotland's largest college with world-class facilities and a thriving Amazon placement partnership."
  },
  {
    id: 14,
    name: "Edinburgh College",
    town: "Edinburgh",
    postcode: "EH11 4BN",
    region: "Scotland",
    subjects: ["Digital & IT", "Engineering", "Health & Science"],
    amazonPartner: true,
    placementHours: 330,
    ofsted: "Good",
    studentSatisfaction: 86,
    website: "https://www.edinburghcollege.ac.uk",
    description: "A leading Scottish college offering T Levels with personalised placement matching and strong employer links."
  },
  {
    id: 15,
    name: "Cardiff and Vale College",
    town: "Cardiff",
    postcode: "CF24 0AB",
    region: "Wales",
    subjects: ["Digital & IT", "Business & Finance", "Engineering"],
    amazonPartner: true,
    placementHours: 345,
    ofsted: "Good",
    studentSatisfaction: 87,
    website: "https://www.cavc.ac.uk",
    description: "Wales' largest FE college with a dedicated T Level academy and Amazon placement opportunities across multiple sectors."
  },
  {
    id: 16,
    name: "Bridgend College",
    town: "Bridgend",
    postcode: "CF31 3DF",
    region: "Wales",
    subjects: ["Digital & IT", "Health & Science", "Construction"],
    amazonPartner: false,
    placementHours: 315,
    ofsted: "Good",
    studentSatisfaction: 80,
    website: "https://www.bridgend.ac.uk",
    description: "A supportive college environment offering T Levels with growing employer partnership networks."
  },
  {
    id: 17,
    name: "Newham College (London East)",
    town: "London",
    postcode: "E13 8SD",
    region: "London",
    subjects: ["Digital & IT", "Business & Finance", "Engineering", "Construction"],
    amazonPartner: true,
    placementHours: 350,
    ofsted: "Good",
    studentSatisfaction: 84,
    website: "https://www.newham.ac.uk",
    description: "East London's premier college for technical education with Amazon placement opportunities and outstanding digital facilities."
  },
  {
    id: 18,
    name: "Capital City College Group (Westminster)",
    town: "London",
    postcode: "W1D 1EG",
    region: "London",
    subjects: ["Digital & IT", "Business & Finance", "Creative & Design"],
    amazonPartner: true,
    placementHours: 335,
    ofsted: "Good",
    studentSatisfaction: 82,
    website: "https://www.capitalcitycollege.ac.uk",
    description: "Central London college with strong creative and digital T Level routes and Amazon placement partnerships."
  },
  {
    id: 19,
    name: "North East London College (Tower Hamlets)",
    town: "London",
    postcode: "E14 7FA",
    region: "London",
    subjects: ["Digital & IT", "Health & Science", "Business & Finance"],
    amazonPartner: false,
    placementHours: 320,
    ofsted: "Requires Improvement",
    studentSatisfaction: 71,
    website: "https://www.nelc.ac.uk",
    description: "Offering T Levels with a focus on digital and health pathways and expanding employer placement network."
  },
  {
    id: 20,
    name: "Bristol City College",
    town: "Bristol",
    postcode: "BS1 5UA",
    region: "South West",
    subjects: ["Digital & IT", "Engineering", "Business & Finance", "Health & Science"],
    amazonPartner: true,
    placementHours: 345,
    ofsted: "Good",
    studentSatisfaction: 88,
    website: "https://www.bristolcollege.ac.uk",
    description: "Leading South West college with comprehensive T Level offerings and an award-winning Amazon placement programme."
  },
  {
    id: 21,
    name: "Plymouth College of Art",
    town: "Plymouth",
    postcode: "PL4 8AT",
    region: "South West",
    subjects: ["Creative & Design", "Digital & IT"],
    amazonPartner: false,
    placementHours: 315,
    ofsted: "Good",
    studentSatisfaction: 89,
    website: "https://www.pca.ac.uk",
    description: "Specialist creative college offering design and digital T Levels with unique industry placement experiences."
  },
  {
    id: 22,
    name: "Nottingham College",
    town: "Nottingham",
    postcode: "NG1 4BU",
    region: "East Midlands",
    subjects: ["Digital & IT", "Engineering", "Business & Finance", "Health & Science"],
    amazonPartner: true,
    placementHours: 340,
    ofsted: "Good",
    studentSatisfaction: 83,
    website: "https://www.nottinghamcollege.ac.uk",
    description: "A major FE college in the East Midlands with broad T Level curriculum and strong Amazon partnership."
  },
  {
    id: 23,
    name: "Leicester College",
    town: "Leicester",
    postcode: "LE1 3SA",
    region: "East Midlands",
    subjects: ["Digital & IT", "Business & Finance", "Construction", "Health & Science"],
    amazonPartner: true,
    placementHours: 330,
    ofsted: "Good",
    studentSatisfaction: 81,
    website: "https://www.leicestercollege.ac.uk",
    description: "Diverse college community offering T Levels with dedicated industry placement coordination and student support services."
  },
  {
    id: 24,
    name: "Cambridge Regional College",
    town: "Cambridge",
    postcode: "CB1 2AJ",
    region: "East of England",
    subjects: ["Digital & IT", "Engineering", "Health & Science"],
    amazonPartner: true,
    placementHours: 335,
    ofsted: "Outstanding",
    studentSatisfaction: 93,
    website: "https://www.camre.ac.uk",
    description: "Outstanding college in the tech hub of Cambridge with cutting-edge T Level facilities and premium employer links."
  },
  {
    id: 25,
    name: "Norwich City College (East Norfolk)",
    town: "Norwich",
    postcode: "NR2 2LJ",
    region: "East of England",
    subjects: ["Digital & IT", "Engineering", "Construction"],
    amazonPartner: false,
    placementHours: 315,
    ofsted: "Good",
    studentSatisfaction: 78,
    website: "https://www.eastnorfolk.ac.uk",
    description: "Offering practical T Levels with a focus on technical and construction skills and developing employer relationships."
  },
  {
    id: 26,
    name: "University of Suffolk (Lowestoft Campus)",
    town: "Lowestoft",
    postcode: "NR32 2ED",
    region: "East of England",
    subjects: ["Health & Science", "Digital & IT"],
    amazonPartner: false,
    placementHours: 315,
    ofsted: "Good",
    studentSatisfaction: 76,
    website: "https://www.uos.ac.uk",
    description: "Smaller provider offering health and digital T Levels with close-knit learning and placement support."
  },
  {
    id: 27,
    name: "Portsmouth College",
    town: "Portsmouth",
    postcode: "PO2 9QA",
    region: "South East",
    subjects: ["Digital & IT", "Business & Finance", "Health & Science"],
    amazonPartner: true,
    placementHours: 325,
    ofsted: "Good",
    studentSatisfaction: 85,
    website: "https://www.portsmouth-college.ac.uk",
    description: "A friendly and ambitious college offering T Levels with strong Amazon placement pathways and excellent student support."
  },
  {
    id: 28,
    name: "Guildford College (Activate Learning)",
    town: "Guildford",
    postcode: "GU1 1EZ",
    region: "South East",
    subjects: ["Digital & IT", "Engineering", "Creative & Design"],
    amazonPartner: true,
    placementHours: 340,
    ofsted: "Good",
    studentSatisfaction: 82,
    website: "https://www.activatelearning.ac.uk",
    description: "Part of the Activate Learning group with modern T Level classrooms and established employer partnerships including Amazon."
  },
  {
    id: 29,
    name: "Fareham College",
    town: "Fareham",
    postcode: "PO14 1AH",
    region: "South East",
    subjects: ["Digital & IT", "Engineering", "Construction"],
    amazonPartner: false,
    placementHours: 315,
    ofsted: "Outstanding",
    studentSatisfaction: 90,
    website: "https://www.fareham.ac.uk",
    description: "An Outstanding college offering technical T Levels with industry-standard workshops and strong local employer links."
  },
  {
    id: 30,
    name: "Newcastle College (NCG)",
    town: "Newcastle upon Tyne",
    postcode: "NE4 7SA",
    region: "North East",
    subjects: ["Digital & IT", "Engineering", "Business & Finance", "Health & Science"],
    amazonPartner: true,
    placementHours: 345,
    ofsted: "Good",
    studentSatisfaction: 85,
    website: "https://www.ncl-coll.ac.uk",
    description: "A leading North East college with extensive T Level curriculum and an established Amazon placement programme."
  },
  {
    id: 31,
    name: "Sunderland College",
    town: "Sunderland",
    postcode: "SR1 3NA",
    region: "North East",
    subjects: ["Digital & IT", "Business & Finance", "Health & Science"],
    amazonPartner: true,
    placementHours: 325,
    ofsted: "Good",
    studentSatisfaction: 80,
    website: "https://www.sunderlandcollege.ac.uk",
    description: "Offering T Levels with strong digital and business pathways and growing Amazon placement opportunities."
  },
  {
    id: 32,
    name: "University Centre (Hull College)",
    town: "Hull",
    postcode: "HU1 3DG",
    region: "Yorkshire",
    subjects: ["Digital & IT", "Engineering", "Health & Science"],
    amazonPartner: false,
    placementHours: 315,
    ofsted: "Requires Improvement",
    studentSatisfaction: 70,
    website: "https://www.hull-college.ac.uk",
    description: "Offering T Levels across key subject areas with ongoing development of employer partnerships."
  },
  {
    id: 33,
    name: "Swindon College (New College Swindon)",
    town: "Swindon",
    postcode: "SN2 1AH",
    region: "South West",
    subjects: ["Digital & IT", "Business & Finance", "Engineering"],
    amazonPartner: true,
    placementHours: 330,
    ofsted: "Outstanding",
    studentSatisfaction: 89,
    website: "https://www.newcollege.ac.uk",
    description: "An Outstanding college offering T Levels with excellent employer partnerships and Amazon placement opportunities."
  },
  {
    id: 34,
    name: "Middlesbrough College",
    town: "Middlesbrough",
    postcode: "TS1 2RQ",
    region: "North East",
    subjects: ["Digital & IT", "Engineering", "Construction", "Health & Science"],
    amazonPartner: true,
    placementHours: 340,
    ofsted: "Outstanding",
    studentSatisfaction: 91,
    website: "https://www.mbro.ac.uk",
    description: "An Outstanding college with modern technical facilities and a strong Amazon placement programme for T Level students."
  },
  {
    id: 35,
    name: "Derby College Group",
    town: "Derby",
    postcode: "DE1 1NQ",
    region: "East Midlands",
    subjects: ["Digital & IT", "Engineering", "Construction"],
    amazonPartner: true,
    placementHours: 335,
    ofsted: "Good",
    studentSatisfaction: 84,
    website: "https://www.derby-college.ac.uk",
    description: "A major college group offering T Levels with strong engineering and digital pathways and Amazon placement links."
  }
];

router.get('/', (req, res) => {
  try {
    const { location, subject } = req.query;
    let results = [...colleges];

    // Filter by location (search on town or postcode, case-insensitive)
    if (location && location.trim()) {
      const loc = location.trim().toLowerCase();
      results = results.filter(c =>
        c.town.toLowerCase().includes(loc) ||
        c.postcode.toLowerCase().includes(loc) ||
        c.region.toLowerCase().includes(loc) ||
        c.name.toLowerCase().includes(loc)
      );
    }

    // Filter by subject (case-insensitive partial match)
    if (subject && subject !== 'all') {
      const sub = subject.toLowerCase();
      results = results.filter(c =>
        c.subjects.some(s => s.toLowerCase().includes(sub))
      );
    }

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (err) {
    console.error('Colleges API error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch colleges' });
  }
});

module.exports = router;