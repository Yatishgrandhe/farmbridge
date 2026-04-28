"""Configuration constants for the FarmBridge dataset pipeline."""

from __future__ import annotations

from pathlib import Path

RANDOM_SEED = 42
STATE_FIPS = "37"
DISASTER_NUMBER = "S6172"
DISASTER_DECLARATION_DATE = "2026-04-21"
DROUGHT_LEVELS = (
    "none",
    "abnormally_dry",
    "moderate",
    "severe",
    "extreme",
    "exceptional",
)
TOPSOIL_LEVELS = ("very_short", "short", "adequate")
OUTPUT_DIR = Path("output")
CSV_DIR = OUTPUT_DIR / "csv"
JSON_DIR = OUTPUT_DIR / "json"
SQL_DIR = OUTPUT_DIR / "sql"
LOG_FILE = OUTPUT_DIR / "generation.log"

# From US Census Gazetteer county centroid points (2023 national counties file).
NC_COUNTIES = [
    ("37001", "Alamance", 36.043954, -79.400573),
    ("37003", "Alexander", 35.920951, -81.177467),
    ("37005", "Alleghany", 36.489356, -81.132299),
    ("37007", "Anson", 34.974972, -80.109763),
    ("37009", "Ashe", 36.443469, -81.499334),
    ("37011", "Avery", 36.072090, -81.920285),
    ("37013", "Beaufort", 35.482313, -76.842014),
    ("37015", "Bertie", 36.059043, -76.962364),
    ("37017", "Bladen", 34.591938, -78.539489),
    ("37019", "Brunswick", 34.038754, -78.227765),
    ("37021", "Buncombe", 35.609371, -82.530423),
    ("37023", "Burke", 35.746182, -81.706180),
    ("37025", "Cabarrus", 35.388346, -80.552728),
    ("37027", "Caldwell", 35.966396, -81.512540),
    ("37029", "Camden", 36.342344, -76.162488),
    ("37031", "Carteret", 34.858343, -76.535860),
    ("37033", "Caswell", 36.394298, -79.339609),
    ("37035", "Catawba", 35.661883, -81.214906),
    ("37037", "Chatham", 35.704994, -79.251454),
    ("37039", "Cherokee", 35.137150, -84.061449),
    ("37041", "Chowan", 36.128979, -76.602752),
    ("37043", "Clay", 35.052997, -83.752264),
    ("37045", "Cleveland", 35.334630, -81.557114),
    ("37047", "Columbus", 34.261602, -78.639308),
    ("37049", "Craven", 35.116829, -77.081320),
    ("37051", "Cumberland", 35.050192, -78.828719),
    ("37053", "Currituck", 36.372174, -75.941224),
    ("37055", "Dare", 35.606269, -75.767536),
    ("37057", "Davidson", 35.795131, -80.207107),
    ("37059", "Davie", 35.929355, -80.542552),
    ("37061", "Duplin", 34.934403, -77.933543),
    ("37063", "Durham", 36.033828, -78.878125),
    ("37065", "Edgecombe", 35.917077, -77.602742),
    ("37067", "Forsyth", 36.132466, -80.256961),
    ("37069", "Franklin", 36.088241, -78.283090),
    ("37071", "Gaston", 35.293344, -81.177256),
    ("37073", "Gates", 36.442135, -76.702355),
    ("37075", "Graham", 35.348364, -83.830915),
    ("37077", "Granville", 36.299884, -78.657634),
    ("37079", "Greene", 35.481959, -77.681688),
    ("37081", "Guilford", 36.079065, -79.788665),
    ("37083", "Halifax", 36.251438, -77.644842),
    ("37085", "Harnett", 35.368660, -78.871665),
    ("37087", "Haywood", 35.558882, -82.981307),
    ("37089", "Henderson", 35.336427, -82.479583),
    ("37091", "Hertford", 36.363517, -76.981616),
    ("37093", "Hoke", 35.017233, -79.241964),
    ("37095", "Hyde", 35.408157, -76.153687),
    ("37097", "Iredell", 35.806251, -80.874524),
    ("37099", "Jackson", 35.285454, -83.123966),
    ("37101", "Johnston", 35.513419, -78.367348),
    ("37103", "Jones", 35.032268, -77.356195),
    ("37105", "Lee", 35.476336, -79.172117),
    ("37107", "Lenoir", 35.240066, -77.635514),
    ("37109", "Lincoln", 35.488491, -81.226893),
    ("37111", "McDowell", 35.682271, -82.048044),
    ("37113", "Macon", 35.152959, -83.421901),
    ("37115", "Madison", 35.864206, -82.712631),
    ("37117", "Martin", 35.847301, -77.119602),
    ("37119", "Mecklenburg", 35.246862, -80.833832),
    ("37121", "Mitchell", 36.013102, -82.163554),
    ("37123", "Montgomery", 35.327548, -79.910752),
    ("37125", "Moore", 35.308273, -79.492723),
    ("37127", "Nash", 35.965945, -77.987555),
    ("37129", "New Hanover", 34.183445, -77.864204),
    ("37131", "Northampton", 36.421774, -77.398352),
    ("37133", "Onslow", 34.763109, -77.499469),
    ("37135", "Orange", 36.062525, -79.120033),
    ("37137", "Pamlico", 35.147575, -76.665268),
    ("37139", "Pasquotank", 36.265199, -76.260691),
    ("37141", "Pender", 34.512556, -77.888106),
    ("37143", "Perquimans", 36.180897, -76.403244),
    ("37145", "Person", 36.386356, -78.965630),
    ("37147", "Pitt", 35.592490, -77.372739),
    ("37149", "Polk", 35.277901, -82.167621),
    ("37151", "Randolph", 35.709915, -79.806215),
    ("37153", "Richmond", 35.004636, -79.755695),
    ("37155", "Robeson", 34.639210, -79.100881),
    ("37157", "Rockingham", 36.381806, -79.782754),
    ("37159", "Rowan", 35.641355, -80.521721),
    ("37161", "Rutherford", 35.402747, -81.919582),
    ("37163", "Sampson", 34.989298, -78.371261),
    ("37165", "Scotland", 34.840023, -79.477337),
    ("37167", "Stanly", 35.310449, -80.254374),
    ("37169", "Stokes", 36.393797, -80.269921),
    ("37171", "Surry", 36.415416, -80.686463),
    ("37173", "Swain", 35.568849, -83.465614),
    ("37175", "Transylvania", 35.210103, -82.816666),
    ("37177", "Tyrrell", 35.870420, -76.165345),
    ("37179", "Union", 34.991820, -80.530426),
    ("37181", "Vance", 36.365481, -78.405434),
    ("37183", "Wake", 35.789846, -78.650624),
    ("37185", "Warren", 36.398105, -78.099899),
    ("37187", "Washington", 35.844713, -76.572291),
    ("37189", "Watauga", 36.235368, -81.709888),
    ("37191", "Wayne", 35.354190, -78.008670),
    ("37193", "Wilkes", 36.208883, -81.166095),
    ("37195", "Wilson", 35.700357, -77.921598),
    ("37197", "Yadkin", 36.158765, -80.665164),
    ("37199", "Yancey", 35.889326, -82.303954),
]

EASTERN_COUNTIES = {
    "Beaufort", "Bertie", "Bladen", "Brunswick", "Camden", "Carteret", "Chowan", "Columbus",
    "Craven", "Currituck", "Dare", "Duplin", "Edgecombe", "Gates", "Greene", "Halifax", "Hertford",
    "Hyde", "Jones", "Lenoir", "Martin", "Nash", "New Hanover", "Northampton", "Onslow", "Pamlico",
    "Pasquotank", "Pender", "Perquimans", "Pitt", "Sampson", "Tyrrell", "Washington", "Wayne", "Wilson",
}
SANDHILLS_COUNTIES = {"Harnett", "Hoke", "Lee", "Moore", "Richmond", "Robeson", "Scotland", "Cumberland", "Montgomery", "Anson"}
WESTERN_COUNTIES = {
    "Alleghany", "Ashe", "Avery", "Buncombe", "Burke", "Caldwell", "Cherokee", "Clay", "Graham", "Haywood",
    "Henderson", "Jackson", "Macon", "Madison", "McDowell", "Mitchell", "Rutherford", "Swain", "Transylvania",
    "Watauga", "Wilkes", "Yancey",
}

PRIMARY_DISASTER_FIPS = {
    # USDA FSA official notice (Apr 21, 2026) 40 primary NC counties
    "37001",  # Alamance
    "37003",  # Alexander
    "37015",  # Bertie
    "37025",  # Cabarrus
    "37039",  # Cherokee
    "37043",  # Clay
    "37045",  # Cleveland
    "37051",  # Cumberland
    "37059",  # Davie
    "37061",  # Duplin
    "37065",  # Edgecombe
    "37069",  # Franklin
    "37071",  # Gaston
    "37081",  # Guilford
    "37083",  # Halifax
    "37085",  # Harnett
    "37087",  # Haywood
    "37097",  # Iredell
    "37101",  # Johnston
    "37105",  # Lee
    "37109",  # Lincoln
    "37113",  # Macon
    "37115",  # Madison
    "37117",  # Martin
    "37119",  # Mecklenburg
    "37127",  # Nash
    "37131",  # Northampton
    "37135",  # Orange
    "37145",  # Person
    "37151",  # Randolph
    "37153",  # Richmond
    "37159",  # Rowan
    "37163",  # Sampson
    "37167",  # Stanly
    "37173",  # Swain
    "37179",  # Union
    "37185",  # Warren
    "37193",  # Wilkes
    "37195",  # Wilson
    "37197",  # Yadkin
}

_NON_PRIMARY_FIPS = [fips for fips, _, _, _ in NC_COUNTIES if fips not in PRIMARY_DISASTER_FIPS]
CONTIGUOUS_DISASTER_FIPS = set(_NON_PRIMARY_FIPS[:42])

SOURCE_REFERENCES = [
    {
        "label": "USDA FSA NC disaster designation",
        "url": "https://www.fsa.usda.gov/news-events/news/04-21-2026/usda-designates-40-north-carolina-counties-natural-disaster-areas-seven",
        "date": "2026-04-21",
    },
    {
        "label": "Drought.gov Southeast update",
        "url": "https://www.drought.gov/drought-status-updates/drought-status-update-southeast-2026-04-16",
        "date": "2026-04-16",
    },
    {
        "label": "AFBF bankruptcies report",
        "url": "https://www.fb.org/market-intel/farm-bankruptcies-continued-to-climb-in-2025",
        "date": "2026-02-09",
    },
    {
        "label": "USDA ERS farm income forecast",
        "url": "https://www.ers.usda.gov/topics/farm-economy/farm-sector-income-finances/highlights-from-the-farm-income-forecast",
        "date": "2026-02-05",
    },
    {
        "label": "Iran/Hormuz fertilizer shock context",
        "url": "https://prospect.org/2026/04/21/aftermath-hormuz-farm-crisis-gulf-states-fertilizer-aluminum/",
        "date": "2026-04-21",
    },
]

PROGRAMS = [
    {
        "id": "SDRP",
        "slug": "state-drought-relief-program",
        "name": "State Drought Relief Program",
        "acronym": "SDRP",
        "agency": "USDA Farm Service Agency",
        "category": "disaster_relief",
        "summary": "Emergency support for producers with major weather-related crop losses in 2025-2026.",
        "description": "The State Drought Relief Program supports qualifying producers who experienced substantial drought-related losses and need near-term operating cash support to stabilize spring and summer production.",
        "how_to_apply": "Contact your county USDA Service Center, complete producer loss documentation, submit acreage and production evidence, then sign final payment forms before the deadline.",
        "deadline": "2026-12-10",
        "deadline_label": "December 10, 2026",
        "is_urgent": True,
        "funding_amount": "Up to $150,000 per operation",
        "payment_type": "grant",
        "apply_url": "https://www.fsa.usda.gov/programs-and-services/disaster-assistance-program/index",
        "phone_number": "1-877-508-8364",
        "active": True,
        "eligibility_json": {
            "requires_loss": True,
            "crop_types": None,
            "counties": "disaster_designated",
            "is_urgent": True,
            "beginning_farmer_priority": True,
        },
    },
    {
        "id": "FBA",
        "slug": "farm-operating-loans",
        "name": "Farm Operating Loans",
        "acronym": "FBA",
        "agency": "USDA Farm Service Agency",
        "category": "loan",
        "summary": "Direct and guaranteed operating capital for producers facing disaster-related cash-flow pressure.",
        "description": "Farm Operating Loans provide working capital for seed, fertilizer, labor, and other operational inputs when farm cash flow is disrupted by drought and market volatility.",
        "how_to_apply": "Submit a direct loan package through your USDA Service Center including farm records, cash flow projections, and production plans.",
        "deadline": "2026-11-30",
        "deadline_label": "Rolling intake through Nov 30, 2026",
        "is_urgent": False,
        "funding_amount": "Up to FSA loan limits",
        "payment_type": "loan",
        "apply_url": "https://www.fsa.usda.gov/programs-and-services/farm-loan-programs/farm-operating-loans/index",
        "phone_number": "1-877-508-8364",
        "active": True,
        "eligibility_json": {
            "requires_loss": False,
            "crop_types": None,
            "counties": "all",
            "is_urgent": False,
            "beginning_farmer_priority": True,
        },
    },
    {
        "id": "ECP",
        "slug": "emergency-conservation-program",
        "name": "Emergency Conservation Program",
        "acronym": "ECP",
        "agency": "USDA Farm Service Agency",
        "category": "conservation",
        "summary": "Cost-share for restoring farmland damaged by natural disasters and severe drought.",
        "description": "ECP helps agricultural producers restore farmland and conservation structures damaged by disaster, including emergency water conservation and erosion control work.",
        "how_to_apply": "File an ECP request at your local FSA office, document eligible damage, and complete approved conservation work to receive reimbursement.",
        "deadline": "2026-10-31",
        "deadline_label": "October 31, 2026",
        "is_urgent": True,
        "funding_amount": "Up to 75% cost-share (90% for limited-resource producers)",
        "payment_type": "cost_share",
        "apply_url": "https://www.fsa.usda.gov/programs-and-services/conservation-programs/emergency-conservation/index",
        "phone_number": "1-877-508-8364",
        "active": True,
        "eligibility_json": {
            "requires_loss": True,
            "crop_types": None,
            "counties": "disaster_designated",
            "is_urgent": True,
            "beginning_farmer_priority": False,
        },
    },
    {
        "id": "CRP",
        "slug": "conservation-reserve-program",
        "name": "Conservation Reserve Program",
        "acronym": "CRP",
        "agency": "USDA Farm Service Agency",
        "category": "conservation",
        "summary": "Annual rental payments for taking sensitive land out of production and improving resiliency.",
        "description": "CRP contracts provide annual rental payments and practice incentives for producers who enroll eligible land in conservation cover to reduce drought stress and improve soil health.",
        "how_to_apply": "Meet with FSA to review eligible acreage and submit a CRP offer during signup windows.",
        "deadline": "2026-08-15",
        "deadline_label": "General signup closes August 15, 2026",
        "is_urgent": False,
        "funding_amount": "Annual rental plus practice incentives",
        "payment_type": "annual_payment",
        "apply_url": "https://www.fsa.usda.gov/programs-and-services/conservation-programs/conservation-reserve-program/index",
        "phone_number": "1-877-508-8364",
        "active": True,
        "eligibility_json": {
            "requires_loss": False,
            "crop_types": None,
            "counties": "all",
            "is_urgent": False,
            "beginning_farmer_priority": False,
        },
    },
    {
        "id": "EQIP",
        "slug": "environmental-quality-incentives-program",
        "name": "Environmental Quality Incentives Program",
        "acronym": "EQIP",
        "agency": "USDA Natural Resources Conservation Service",
        "category": "conservation",
        "summary": "Technical and financial assistance for drought-resilient conservation practices.",
        "description": "EQIP supports on-farm conservation improvements such as irrigation upgrades, water management, grazing systems, and soil health practices that reduce drought vulnerability.",
        "how_to_apply": "Work with NRCS to complete a conservation plan and submit an EQIP application at your local service center.",
        "deadline": "2026-09-30",
        "deadline_label": "Batching date September 30, 2026",
        "is_urgent": False,
        "funding_amount": "Practice-based cost share",
        "payment_type": "cost_share",
        "apply_url": "https://www.nrcs.usda.gov/programs-initiatives/eqip-environmental-quality-incentives",
        "phone_number": "1-202-720-7246",
        "active": True,
        "eligibility_json": {
            "requires_loss": False,
            "crop_types": None,
            "counties": "all",
            "is_urgent": False,
            "beginning_farmer_priority": True,
        },
    },
    {
        "id": "FRSAN",
        "slug": "farm-and-ranch-stress-assistance-network",
        "name": "Farm and Ranch Stress Assistance Network",
        "acronym": "FRSAN",
        "agency": "USDA National Institute of Food and Agriculture",
        "category": "mental_health",
        "summary": "Confidential stress, behavioral health, and referral support for farmers and ranchers.",
        "description": "FRSAN funds regionally coordinated stress assistance services including crisis support, counseling referrals, and producer-focused mental health outreach.",
        "how_to_apply": "Call the regional hotline or connect through extension partners for confidential stress assistance and referral services.",
        "deadline": "2027-01-31",
        "deadline_label": "Ongoing support access",
        "is_urgent": True,
        "funding_amount": "No-cost support services",
        "payment_type": "service",
        "apply_url": "https://www.nifa.usda.gov/grants/programs/farm-and-ranch-stress-assistance-network-frsan",
        "phone_number": "1-800-327-6243",
        "active": True,
        "eligibility_json": {
            "requires_loss": False,
            "crop_types": None,
            "counties": "all",
            "is_urgent": True,
            "beginning_farmer_priority": False,
        },
    },
    {
        "id": "ECAP",
        "slug": "emergency-commodity-assistance-program",
        "name": "Emergency Commodity Assistance Program",
        "acronym": "ECAP",
        "agency": "USDA Farm Service Agency",
        "category": "commodity_support",
        "summary": "Direct commodity assistance for market and input-cost disruptions affecting producers.",
        "description": "Emergency Commodity Assistance Program provides temporary direct assistance to commodity producers impacted by severe market and input-cost disruptions.",
        "how_to_apply": "Submit eligible planted acreage and production records at your county FSA office during the announced signup period.",
        "deadline": "2026-10-15",
        "deadline_label": "Signup closes October 15, 2026",
        "is_urgent": True,
        "funding_amount": "Commodity-specific payment rates",
        "payment_type": "direct_payment",
        "apply_url": "https://www.fsa.usda.gov/programs-and-services/emergency-relief/index",
        "phone_number": "1-877-508-8364",
        "active": True,
        "eligibility_json": {
            "requires_loss": False,
            "crop_types": ["corn", "soybeans", "cotton", "wheat", "peanuts"],
            "counties": "all",
            "is_urgent": True,
            "beginning_farmer_priority": False,
        },
    },
    {
        "id": "CSP",
        "slug": "conservation-stewardship-program",
        "name": "Conservation Stewardship Program",
        "acronym": "CSP",
        "agency": "USDA Natural Resources Conservation Service",
        "category": "conservation",
        "summary": "Performance-based payments for advanced whole-farm conservation improvements.",
        "description": "CSP helps producers build on existing conservation by adopting advanced stewardship activities that improve drought resilience, soil function, and water-use efficiency.",
        "how_to_apply": "Complete a CSP self-screening and submit your application through NRCS before ranking deadlines.",
        "deadline": "2026-09-30",
        "deadline_label": "Ranking deadline September 30, 2026",
        "is_urgent": False,
        "funding_amount": "Annual stewardship payments",
        "payment_type": "annual_payment",
        "apply_url": "https://www.nrcs.usda.gov/programs-initiatives/csp-conservation-stewardship-program",
        "phone_number": "1-202-720-1845",
        "active": True,
        "eligibility_json": {
            "requires_loss": False,
            "crop_types": None,
            "counties": "all",
            "is_urgent": False,
            "beginning_farmer_priority": True,
        },
    },
]

