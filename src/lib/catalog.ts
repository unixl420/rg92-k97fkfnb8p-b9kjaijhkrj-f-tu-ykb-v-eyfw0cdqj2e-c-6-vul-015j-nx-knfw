import { slugify } from "./utils";
import { volumeTiers, type PriceTiers } from "./pricing";

export type CategoryId =
  | "metabolic"
  | "recovery"
  | "bioregulator"
  | "longevity"
  | "growth"
  | "sexual"
  | "neuro"
  | "aesthetic"
  | "immune"
  | "fatloss"
  | "muscle"
  | "support"
  | "specialty";

export type Product = {
  id: string;
  name: string;
  pack: string;
  category: CategoryId;
  prices: PriceTiers | null;
  specialOrder?: boolean;
  isNew?: boolean;
  excludeFromVolume?: boolean;
  unitNote?: string;
  headerNote?: string;
  tags?: string[];
};

export type Category = {
  id: CategoryId;
  label: string;
  short: string;
  blurb: string;
  goal: string;
  tags: string[];
  searchTags?: string[];
  accent: string;
};

export const CATEGORIES: Category[] = [
  {
    id: "metabolic",
    label: "Weight Management & Metabolic Research",
    short: "Metabolic",
    blurb: "For research on fat, appetite, blood sugar, and how the body uses energy.",
    goal: "Weight & metabolism",
    tags: ["fat", "appetite", "blood sugar", "energy use", "body composition", "metabolic"],
    searchTags: [
      "weight loss",
      "obesity",
      "glp-1",
      "glp1",
      "gip",
      "incretin",
      "diabetes",
      "glucose",
      "insulin",
      "amylin",
    ],
    accent: "#156f7a",
  },
  {
    id: "recovery",
    label: "Recovery & Tissue Research",
    short: "Recovery",
    blurb: "For research on tissue repair — tendons, gut lining, wounds, and local inflammation.",
    goal: "Recovery & repair",
    tags: ["repair", "tissue", "inflammation"],
    searchTags: ["healing", "injury", "tissue repair"],
    accent: "#1b6b4a",
  },
  {
    id: "bioregulator",
    label: "Tissue Bioregulator Research",
    short: "Bioregulators",
    blurb: "Short peptides studied as signals for one organ at a time, such as lung, heart, or cartilage.",
    goal: "Organ-specific",
    tags: ["organ-specific", "khavinson", "cytogen"],
    searchTags: ["bioregulator", "organ peptide"],
    accent: "#3a5f8f",
  },
  {
    id: "longevity",
    label: "Longevity & Cellular Research",
    short: "Longevity",
    blurb: "For research on how cells age, handle stress, and keep mitochondria working well.",
    goal: "Longevity",
    tags: ["aging", "cell survival", "cytoprotection"],
    searchTags: ["longevity", "anti aging", "anti-aging", "senolytic"],
    accent: "#5d4e8c",
  },
  {
    id: "growth",
    label: "Growth Hormone & Secretagogue Research",
    short: "GH & Secretagogues",
    blurb: "Peptides related to the body’s own growth-hormone pulse and IGF-1 signal.",
    goal: "Growth hormone",
    tags: ["GH pulse", "secretagogue"],
    searchTags: ["growth hormone", "secretagogue"],
    accent: "#1f4e79",
  },
  {
    id: "muscle",
    label: "Muscle & Performance Research",
    short: "Muscle",
    blurb: "For research on muscle size, the myostatin pathway, and oxygen-carrying red cells.",
    goal: "Muscle & performance",
    tags: ["muscle size", "performance"],
    searchTags: ["muscle", "hypertrophy", "lean mass", "performance"],
    accent: "#8e3b4a",
  },
  {
    id: "sexual",
    label: "Sexual Health & Fertility Research",
    short: "Sexual & Fertility",
    blurb: "For research on fertility and the pituitary–gonad axis.",
    goal: "Sexual health",
    tags: ["pituitary", "gonadotropin"],
    searchTags: ["ivf", "gonadotropin"],
    accent: "#8a4568",
  },
  {
    id: "neuro",
    label: "Neuroscience & Sleep Research",
    short: "Nootropics & Sleep",
    blurb: "For research on memory, mood, sleep, and the stress axis.",
    goal: "Cognition & sleep",
    tags: ["memory", "mood", "nootropic"],
    searchTags: ["brain", "cognition", "nootropic"],
    accent: "#3d4a8a",
  },
  {
    id: "aesthetic",
    label: "Aesthetic, Hair & Skin Research",
    short: "Aesthetic",
    blurb: "For research on skin, collagen, hair follicles, and pigment.",
    goal: "Skin, hair & aesthetic",
    tags: ["skin", "aesthetic"],
    searchTags: ["cosmetic"],
    accent: "#7d5b86",
  },
  {
    id: "immune",
    label: "Immune & Thymic Research",
    short: "Immune",
    blurb: "For research on innate defense, the thymus, and antimicrobial peptides.",
    goal: "Immune",
    tags: ["immune", "thymus", "innate defense"],
    searchTags: ["immune", "thymus"],
    accent: "#2f6d4f",
  },
  {
    id: "fatloss",
    label: "Fat Loss & Body Composition Research",
    short: "Fat Loss",
    blurb: "For research on localized fat and body composition.",
    goal: "Body composition",
    tags: ["localized fat", "body composition", "fat loss"],
    searchTags: ["lipolysis", "body composition"],
    accent: "#c45c4a",
  },
  {
    id: "support",
    label: "Reconstitution & Support Materials",
    short: "Support",
    blurb: "Water and solvents used to dissolve a vial. These are not peptides.",
    goal: "Lab support",
    tags: ["sterile water", "solvent", "reconstitute", "not a peptide"],
    searchTags: ["reconstitution", "solvent", "diluent", "water for injection"],
    accent: "#4a6275",
  },
  {
    id: "specialty",
    label: "Specialty Research Compounds",
    short: "Specialty",
    blurb: "Useful tools that do not sit neatly in one organ system.",
    goal: "Specialty",
    tags: ["niche pathway", "growth-factor", "matrix"],
    searchTags: ["specialty", "custom", "research tool"],
    accent: "#3d4c5c",
  },
];

export function categoryById(id: CategoryId): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

const COMPOUND_SEARCH_TAGS: Record<string, string[]> = {
  Retatrutide: [
    "reta", "glp-3", "glp3", "triple agonist", "gip", "glucagon", "ly3437943",
    "weight", "appetite", "glucose", "incretin", "obesity research",
  ],
  Tirzepatide: [
    "tirz", "mounjaro", "zepbound", "dual agonist", "glp-1", "gip", "ly3298176",
    "weight", "appetite", "glucose", "incretin",
  ],
  Semaglutide: [
    "sema", "ozempic", "wegovy", "rybelsus", "glp-1", "glp1", "nn9535",
    "weight", "appetite", "glucose", "incretin",
  ],
  Mazdutide: ["glp-1", "glucagon", "dual agonist", "ibi362", "weight", "appetite", "glucose"],
  Survodutide: ["glp-1", "glucagon", "dual agonist", "bi 456906", "weight", "liver", "glucose"],
  Cagrilintide: ["cagri", "amylin", "amycretin", "satiety", "appetite"],
  "Cagrilintide + Semaglutide": ["cagri", "sema", "cagrisema", "amylin", "glp-1", "combo", "satiety", "appetite"],
  Cagrisema: ["cagri", "sema", "cagrilintide", "semaglutide", "amylin", "glp-1", "combo", "satiety"],
  Liraglutide: ["lira", "victoza", "saxenda", "glp-1", "appetite", "glucose"],
  Dulaglutide: ["trulicity", "glp-1", "dula", "glucose", "incretin"],
  AOD9604: ["aod", "hgh fragment", "fat loss fragment", "176-191", "lipolysis", "fat metabolism"],
  "Lemon Bottle": [
    "fat dissolve", "lipolysis", "ppc", "deoxycholate", "body contour", "10ml", "bottle",
    "localized fat", "phosphatidylcholine",
  ],
  "HGH Fragment 176-191": ["hgh frag", "frag 176", "176-191", "aod9604", "fragment", "lipolysis", "fat metabolism"],
  "HGH Fragment 17-23": ["hgh frag", "frag 17-23", "fragment", "lipolysis"],
  "SLU-PP-322": ["err agonist", "exercise mimetic", "slu", "energy expenditure", "mitochondria"],
  "BPC-157": [
    "bpc", "body protection compound", "bepecin", "gut", "tendon", "repair",
    "angiogenesis", "wound", "joint", "stomach", "intestine",
  ],
  "TB-500": [
    "tb500", "thymosin beta 4", "tb4", "tβ4", "wound", "actin", "mobility",
    "recovery", "soft tissue",
  ],
  "BPC 5mg + TB 5mg": ["bpc", "tb500", "wolverine", "blend", "combo", "repair", "joint", "tendon"],
  "BPC 10mg + TB 10mg": ["bpc", "tb500", "wolverine", "blend", "combo", "repair", "joint", "tendon"],
  "BPC-157 + TB-500": ["bpc", "tb500", "wolverine", "blend", "combo", "repair", "joint", "tendon"],
  GLOW70: ["glow", "bpc", "tb500", "ghk", "blend", "skin", "repair", "collagen"],
  KLOW80: ["klow", "kpv", "bpc", "tb500", "ghk", "blend", "inflammation", "skin", "gut"],
  KPV: ["alpha msh", "inflammation", "gut", "melanocortin", "intestine"],
  "B7-33": ["relaxin", "rxfp1", "fibrosis", "heart", "vascular"],
  TBF: ["thymosin", "fragment", "repair", "immune"],
  Bronchogen: ["lung", "respiratory", "khavinson", "bronchi", "airway", "pulmonary"],
  Cardiogen: ["heart", "cardiac", "khavinson", "myocardium", "cardiovascular"],
  Crystagen: ["immune", "khavinson", "lymphoid", "thymus"],
  Cortagen: ["cortex", "brain", "khavinson", "cognition", "cns"],
  Cartalax: ["cartilage", "joint", "khavinson", "connective tissue", "chondrocyte"],
  Epithalon: ["epitalon", "epithalamin", "telomere", "pineal", "circadian", "aging"],
  "NAD+": ["nad", "nicotinamide", "nadh", "niagen", "sirtuin", "cellular energy", "mitochondria"],
  "MOTS-c": ["motsc", "mitochondrial", "exercise mimetic", "metabolic", "ampk"],
  "SS-31": ["elamipretide", "bendavia", "mitochondria", "cardiolipin", "heart"],
  Aicar: ["acadesine", "ampk", "exercise mimetic", "endurance"],
  "FOXO4-DRI": ["foxo4", "senolytic", "dri", "senescent cells", "aging"],
  Humanin: ["mitochondria", "hng", "cytoprotection", "cell survival"],
  "PNC-27": ["p53", "hdm2", "membrane"],
  "CJC-1295 (No DAC)": ["cjc", "mod grf", "mod grf 1-29", "no dac", "ghrh", "gh pulse", "pituitary"],
  "CJC-1295 (With DAC)": ["cjc", "cjc dac", "with dac", "ghrh", "gh pulse", "pituitary"],
  "CJC-1295 + Ipamorelin": ["cjc", "ipa", "stack", "combo", "ghrh", "ghrp", "gh pulse"],
  Ipamorelin: ["ipa", "ghrp", "secretagogue", "gh pulse", "ghrelin", "pituitary"],
  Tesamorelin: ["egrifta", "ghrh", "visceral fat", "gh pulse", "abdominal fat"],
  "GHRP-2": ["ghrp2", "pralmorelin", "secretagogue", "ghrelin", "gh pulse"],
  "GHRP-6": ["ghrp6", "secretagogue", "ghrelin", "gh pulse", "appetite"],
  "Hexarelin Acetate": ["hexarelin", "examorelin", "ghrp", "gh pulse", "cardiac"],
  Sermorelin: ["ghrh 1-29", "ghrh", "gh pulse", "pituitary"],
  "HGH 191AA": ["hgh", "somatropin", "growth hormone", "191aa", "rhgh", "igf-1", "stature"],
  "MK-677": ["mk677", "ibutamoren", "ghrelin", "oral", "gh pulse", "appetite"],
  "Tesamorelin + Ipamorelin": ["tesa", "ipa", "stack", "combo", "visceral fat", "gh pulse"],
  "PEG-MGF": ["pegmgf", "mechano growth factor", "peginated mgf", "muscle repair", "hypertrophy"],
  "IGF-DES": ["igf des", "des 1-3", "igf1", "local igf", "muscle"],
  PT141: ["pt-141", "bremelanotide", "vyleesi", "libido", "arousal", "melanocortin"],
  "Kisspeptin-10": ["kisspeptin", "kp10", "metastin", "gnrh", "fertility", "puberty axis", "lh"],
  "Oxytocin Acetate": ["oxytocin", "pitocin", "bonding", "uterine", "lactation research"],
  HCG: ["hcg", "human chorionic gonadotropin", "pregnyl", "ovidrel", "lh", "fertility", "gonadal"],
  Gonadorelin: ["gnrh", "lhrh", "factrel", "pituitary", "fertility"],
  "Gonadorelin Acetate": ["gnrh", "lhrh", "pituitary", "fertility"],
  "Triptorelin Acetate": ["triptorelin", "gnrh agonist", "decapeptyl", "pituitary"],
  Selank: ["tuftsin", "anxiety", "anxiolytic", "stress", "immune-neuro"],
  Semax: ["acth fragment", "nootropic", "focus", "bdnf", "cognition"],
  DSIP: ["delta sleep", "sleep peptide", "insomnia", "sleep"],
  Dihexa: ["angiotensin iv", "pnb-0408", "memory", "synapse", "cognition"],
  Cerebrolysin: ["brain hydrolysate", "neurotrophic", "cognition", "stroke research"],
  "Orexin A": ["hypocretin 1", "wakefulness", "narcolepsy", "arousal", "sleep-wake"],
  "Orexin B": ["hypocretin 2", "wakefulness", "sleep-wake"],
  P21: ["cntf", "nootropic", "neurogenesis", "memory"],
  Adamax: ["semax analog", "nootropic", "focus", "cognition"],
  "PE-22-28": ["spadin", "trek1", "mood"],
  Pinealon: ["pineal", "cortexin", "cognition", "circadian"],
  Melatonin: ["sleep", "pineal", "circadian", "jet lag research"],
  "ACTH 1-39": ["acth", "corticotropin", "adrenal", "cortisol axis"],
  "GHK-Cu": ["ghk", "copper peptide", "skin", "hair", "collagen", "remodeling", "wound"],
  "Snap-8": ["snap8", "acetyl octapeptide", "wrinkle", "botox alternative", "expression lines", "snap-25"],
  "Melanotan II": ["mt2", "mt-2", "tanning", "melanotan 2", "pigment", "melanocortin", "uv"],
  "Melanotan I": ["mt1", "afamelanotide", "scenesse", "tanning", "pigment", "photoprotection"],
  Glutathione: ["gsh", "antioxidant", "skin brightening", "redox", "pigment", "liver"],
  Matrixyl: ["palmitoyl pentapeptide", "collagen", "wrinkle", "ecm", "matrikine"],
  "AHK-Cu": ["ahk", "copper peptide", "hair", "follicle"],
  "PTD-DBM": ["wnt", "hair follicle", "cxxc5", "hair"],
  "Botulinum Toxin": ["botox", "btxa", "onabotulinumtoxin", "wrinkle", "neuromuscular", "snap-25"],
  "Thymosin alpha 1": ["tα1", "ta1", "thymalfasin", "zadaxin", "t-cell", "innate", "thymus"],
  Thymalin: ["thymus", "thymogen", "immune aging", "t-cell"],
  "KK-37": ["cathelicidin", "antimicrobial", "innate defense"],
  "CBL-514": ["cbl", "fat dissolve", "injectable fat", "adipocyte", "localized fat"],
  "L-Carnitine": ["carnitine", "l carnitine", "fat metabolism", "fatty acid transport", "energy"],
  "Lipo-C": ["lipo c", "lipotropic", "micc", "carnitine", "liver", "choline"],
  "5-Amino-1MQ": ["nnmt", "1mq", "amino1mq", "nad", "energy expenditure"],
  Adipotide: ["ftpp", "prohibitin", "targeted fat", "adipose vasculature"],
  "FST 344": ["follistatin 344", "fst344", "myostatin", "muscle growth"],
  "GDF-8": ["myostatin", "gdf8", "muscle growth"],
  "IGF-1 LR3": ["igf1", "igf-1", "long r3", "lr3", "hypertrophy", "anabolic"],
  MGF: ["mechano growth factor", "igf-1ec", "muscle repair", "hypertrophy"],
  "ACE-031": ["activin", "myostatin inhibitor", "muscle growth"],
  Follistatin: ["fst", "myostatin", "muscle growth"],
  EPO: ["erythropoietin", "epoetin", "red blood cells", "oxygen", "hematopoiesis"],
  "Bacteriostatic Water": ["bac water", "bac", "bw", "benzyl alcohol", "reconstitute", "diluent"],
  "Acetic Water": ["acetic acid", "0.6%", "solvent", "reconstitute", "acidic peptides"],
  "Sterile Water": ["wfi", "water for injection", "swfi", "reconstitute"],
  "B-12": ["b12", "cobalamin", "cyanocobalamin", "methylcobalamin", "vitamin", "methylation"],
  "ARA 290": ["cibinetide", "ara290", "innate repair", "neuropathy", "epo analog"],
  VIP: ["vasoactive intestinal peptide", "aviptadil", "pulmonary", "lung", "immune"],
  Dermorphin: ["opioid peptide", "mu agonist", "analgesia research", "pain research"],
  "TGF-DES": ["tgf", "transforming growth", "matrix", "ecm"],
  HMG: ["hmg", "menotropin", "fsh", "lh", "menopur", "fertility"],
  "LL-37": ["cathelicidin", "antimicrobial", "ll37", "innate defense"],
  "Etelcalcetide Hydrochloride": ["etelcalcetide", "parsabiv", "calcimimetic", "pth", "calcium"],
};

const COMPOUND_ABBREVS: Record<string, string[]> = {
  Retatrutide: ["rt", "reta", "rtt", "ly3437943"],
  Tirzepatide: ["tz", "tzp", "tirz", "triz", "ly3298176"],
  Semaglutide: ["sm", "sg", "sema", "sem", "smg", "nn9535"],
  Mazdutide: ["maz", "ibi362", "ibi-362"],
  Survodutide: ["survo", "sur", "bi456906", "bi-456906"],
  Cagrilintide: ["cagri", "cag", "cagril"],
  "Cagrilintide + Semaglutide": ["cagrisema", "cs", "cagri", "sema", "cagsema"],
  Cagrisema: ["cs", "cagrisema", "cagri", "sema", "cagsema"],
  Liraglutide: ["lira", "lrg", "nn2211"],
  Dulaglutide: ["dula", "dul", "ly2189265"],
  AOD9604: ["aod", "aod96", "aod-9604", "9604"],
  "Lemon Bottle": ["lb", "lemon", "ppc"],
  "HGH Fragment 176-191": ["hghfrag", "frag176", "f176", "frag", "hgh-f", "176191"],
  "HGH Fragment 17-23": ["frag1723", "f1723", "1723"],
  "SLU-PP-322": ["slu", "slupp322", "slu-pp", "slupp"],
  "BPC-157": ["bpc", "bpc157", "bpc-157", "157"],
  "TB-500": ["tb500", "tb5", "tb4", "tb-500", "tb-4", "thymosinb4"],
  "BPC 5mg + TB 5mg": ["wolverine", "bpc", "tb500", "bpc5tb5", "bpc/tb", "bpctb"],
  "BPC 10mg + TB 10mg": ["wolverine", "bpc", "tb500", "bpc10tb10", "bpc/tb", "bpctb"],
  "BPC-157 + TB-500": ["wolverine", "bpc", "tb500", "bpctb", "bpc/tb", "bpc157tb500"],
  GLOW70: ["glow", "glow70", "glow-70"],
  KLOW80: ["klow", "klow80", "klow-80"],
  KPV: ["kpv", "kpv-"],
  "B7-33": ["b733", "b7", "b7-33"],
  TBF: ["tbf"],
  Bronchogen: ["broncho", "brp"],
  Cardiogen: ["cardio", "crg"],
  Crystagen: ["crysta", "cyg"],
  Cortagen: ["corta", "ctg"],
  Cartalax: ["carta", "ctl"],
  Epithalon: ["epi", "epitalon", "epithalamin", "epithalamine"],
  "NAD+": ["nad", "nadh", "nadplus"],
  "MOTS-c": ["motsc", "mots", "mots-c"],
  "SS-31": ["ss31", "ss-31", "elamipretide"],
  Aicar: ["aicar", "aic"],
  "FOXO4-DRI": ["foxo4", "foxo", "foxo4dri"],
  Humanin: ["hng", "humanin", "hn"],
  "PNC-27": ["pnc27", "pnc", "pnc-27"],
  "CJC-1295 (No DAC)": ["cjc", "modgrf", "nodac", "cjc1295", "grf129", "mod-grf"],
  "CJC-1295 (With DAC)": ["cjcdac", "cjc", "cjc1295dac", "cjc-dac"],
  "CJC-1295 + Ipamorelin": ["cjcipa", "cjc", "ipa", "cjc/ipa", "cjcipa"],
  Ipamorelin: ["ipa", "ipam"],
  Tesamorelin: ["tesa", "tes", "tesam"],
  "GHRP-2": ["ghrp2", "ghrp-2"],
  "GHRP-6": ["ghrp6", "ghrp-6"],
  "Hexarelin Acetate": ["hexa", "hexarelin", "hex"],
  Sermorelin: ["sermo", "serm", "grf1-29"],
  "HGH 191AA": ["hgh", "gh", "rhgh", "191aa", "somatropin", "hgh191"],
  "MK-677": ["mk677", "mk", "ibutamoren", "ibuta", "mk-677"],
  "Tesamorelin + Ipamorelin": ["tesaipa", "tesa", "ipa", "tes/ipa"],
  "PEG-MGF": ["pegmgf", "mgf", "peg-mgf"],
  "IGF-DES": ["igfdes", "des", "igf-des", "des13"],
  PT141: ["pt141", "pt-141", "pt", "brem"],
  "Kisspeptin-10": ["kp10", "kp", "kisspeptin", "kiss"],
  "Oxytocin Acetate": ["oxt", "ot", "oxy"],
  HCG: ["hcg", "hcg-"],
  Gonadorelin: ["gnrh", "lhrh"],
  "Gonadorelin Acetate": ["gnrh", "lhrh"],
  "Triptorelin Acetate": ["tripto", "trp"],
  Selank: ["selank", "sel"],
  Semax: ["semax", "smx"],
  DSIP: ["dsip"],
  Dihexa: ["dihexa", "dih"],
  Cerebrolysin: ["cerebro", "cbln"],
  "Orexin A": ["orexina", "hcrt1", "orexin-a"],
  "Orexin B": ["orexinb", "hcrt2", "orexin-b"],
  P21: ["p21"],
  Adamax: ["adamax", "admx"],
  "PE-22-28": ["pe2228", "pe22", "pe-22-28"],
  Pinealon: ["pinealon", "pin"],
  Melatonin: ["mlt", "mel"],
  "ACTH 1-39": ["acth", "acth139"],
  "GHK-Cu": ["ghk", "ghkcu", "ghk-cu", "cu-ghk"],
  "Snap-8": ["snap8", "snap", "snap-8"],
  "Melanotan II": ["mt2", "mt-2", "mtii", "mt-ii", "melanotan2"],
  "Melanotan I": ["mt1", "mt-1", "mti", "mt-i", "melanotan1", "afamelanotide"],
  Glutathione: ["gsh", "glu"],
  Matrixyl: ["matrixyl", "pal-kttks"],
  "AHK-Cu": ["ahk", "ahkcu", "ahk-cu"],
  "PTD-DBM": ["ptddbm", "ptd", "ptd-dbm"],
  "Botulinum Toxin": ["botox", "btx", "btxa", "ona"],
  "Thymosin alpha 1": ["ta1", "talpha1", "tα1", "thymalfasin"],
  Thymalin: ["thymalin", "thym"],
  "KK-37": ["kk37", "kk-37"],
  "CBL-514": ["cbl", "cbl514", "cbl-514"],
  "L-Carnitine": ["carnitine", "lcarn", "l-carn"],
  "Lipo-C": ["lipoc", "lipo-c", "micc"],
  "5-Amino-1MQ": ["1mq", "amino1mq", "5amino1mq", "5-amino-1mq"],
  Adipotide: ["adipotide", "ftpp"],
  "FST 344": ["fst344", "fst", "fst-344"],
  "GDF-8": ["gdf8", "gdf-8"],
  "IGF-1 LR3": ["igf1", "lr3", "igflr3", "igf-1", "longr3"],
  MGF: ["mgf"],
  "ACE-031": ["ace031", "ace", "ace-031"],
  Follistatin: ["fst", "follistatin"],
  EPO: ["epo", "epoetin"],
  "Bacteriostatic Water": ["bac", "bw", "bac-h2o", "bach2o"],
  "Acetic Water": ["aa", "acetic", "0.6aa"],
  "Sterile Water": ["swfi", "wfi", "sw"],
  "B-12": ["b12", "b-12"],
  "ARA 290": ["ara290", "ara", "ara-290"],
  VIP: ["vip"],
  Dermorphin: ["derm", "drm"],
  "TGF-DES": ["tgfdes", "tgf", "tgf-des"],
  HMG: ["hmg", "hmg-"],
  "LL-37": ["ll37", "ll-37"],
  "Etelcalcetide Hydrochloride": ["etel", "etelcalcetide"],
};

function doseFromPack(pack: string): string | null {
  const match = pack.match(/(\d+(?:\.\d+)?)/);
  return match ? match[1] : null;
}

function compoundCodes(name: string, pack: string): string[] {
  const abbrevs = COMPOUND_ABBREVS[name] ?? [];
  const dose = doseFromPack(pack);
  const out: string[] = [...abbrevs];
  if (dose) {
    for (const abbrev of abbrevs) {
      out.push(
        `${abbrev}${dose}`,
        `${abbrev}-${dose}`,
        `${abbrev} ${dose}`,
        `${abbrev}${dose}mg`,
        `${abbrev}-${dose}mg`,
      );
    }
  }
  return out;
}

function tokenMatchesBlob(token: string, blobLower: string): boolean {
  const compact = normalizeSearch(token);
  if (!compact) return true;
  const compactWords = blobLower
    .split(/[^a-z0-9]+/)
    .map((word) => normalizeSearch(word))
    .filter(Boolean);
  if (compactWords.includes(compact)) return true;
  const doseLike = /\d/.test(compact);
  if (!doseLike && compact.length >= 3 && compactWords.some((word) => word.startsWith(compact))) {
    return true;
  }
  return false;
}

function packSearchTags(pack: string): string[] {
  const tags: string[] = [];
  const lower = pack.toLowerCase();
  const re = /(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug|iu|ml|g)\b/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(pack))) {
    const n = match[1];
    const u = match[2].toLowerCase().replace("µg", "mcg").replace("ug", "mcg");
    tags.push(`${n}${u}`, `${n} ${u}`);
    if (u === "mg") tags.push("milligram", "milligrams");
    if (u === "ml") tags.push("milliliter", "milliliters", "liquid");
    if (u === "iu") tags.push("iu", "units", "international units");
    if (u === "g") tags.push("gram", "grams");
    if (u === "mcg") tags.push("microgram", "micrograms", "mcg", "ug");
  }
  if (lower.includes("vial")) tags.push("vial", "single vial");
  if (lower.includes("bottle")) tags.push("bottle", "single bottle");
  if (lower.includes("kit")) tags.push("kit");
  if (lower.includes("single")) tags.push("single");
  return tags;
}

type Draft = {
  name: string;
  pack: string;
  category: CategoryId;
  prices: PriceTiers | null;
  specialOrder?: boolean;
  isNew?: boolean;
  excludeFromVolume?: boolean;
  unitNote?: string;
  headerNote?: string;
  tags?: string[];
};

function item(
  name: string,
  pack: string,
  category: CategoryId,
  prices: PriceTiers | null,
  extra: Partial<Draft> = {},
): Draft {
  return { name, pack, category, prices, ...extra };
}

const DRAFTS: Draft[] = [
  item("Retatrutide", "10mg", "metabolic", [113, 99, 85, 70, 57]),
  item("Retatrutide", "20mg", "metabolic", [150, 131, 112, 94, 75]),
  item("Retatrutide", "30mg", "metabolic", [202, 177, 152, 127, 101]),
  item("Retatrutide", "40mg", "metabolic", [246, 216, 185, 154, 123]),
  item("Retatrutide", "50mg", "metabolic", [282, 246, 211, 176, 141]),
  item("Retatrutide", "60mg", "metabolic", [317, 277, 238, 198, 158]),
  item("Tirzepatide", "10mg", "metabolic", [69, 61, 52, 43, 35]),
  item("Tirzepatide", "20mg", "metabolic", [96, 84, 72, 59, 48]),
  item("Tirzepatide", "30mg", "metabolic", [122, 107, 91, 76, 62]),
  item("Tirzepatide", "40mg", "metabolic", [150, 131, 112, 94, 75]),
  item("Tirzepatide", "50mg", "metabolic", [196, 172, 147, 123, 98]),
  item("Tirzepatide", "60mg", "metabolic", [220, 193, 165, 138, 110]),
  item("Semaglutide", "5mg", "metabolic", volumeTiers(68), { isNew: true }),
  item("Semaglutide", "10mg", "metabolic", volumeTiers(101), { isNew: true }),
  item("Semaglutide", "15mg", "metabolic", volumeTiers(121), { isNew: true }),
  item("Semaglutide", "20mg", "metabolic", volumeTiers(175), { isNew: true }),
  item("Semaglutide", "30mg", "metabolic", volumeTiers(222), { isNew: true }),
  item("Semaglutide", "40mg", "metabolic", volumeTiers(255), { isNew: true }),
  item("Semaglutide", "50mg", "metabolic", volumeTiers(302), { isNew: true }),
  item("Mazdutide", "5mg", "metabolic", volumeTiers(336), { isNew: true }),
  item("Mazdutide", "10mg", "metabolic", [263, 230, 197, 165, 132]),
  item("Survodutide", "10mg", "metabolic", [359, 314, 268, 224, 179]),
  item("Cagrilintide", "2mg", "metabolic", volumeTiers(135), { isNew: true }),
  item("Cagrilintide", "5mg", "metabolic", [144, 125, 108, 90, 73]),
  item("Cagrilintide", "10mg", "metabolic", volumeTiers(383), { isNew: true }),
  item("Cagrilintide + Semaglutide", "10mg", "metabolic", [187, 164, 140, 117, 94]),
  item("Cagrisema", "5mg", "metabolic", volumeTiers(168), { isNew: true }),
  item("Cagrisema", "10mg", "metabolic", volumeTiers(255), { isNew: true }),
  item("Cagrisema", "20mg", "metabolic", volumeTiers(416), { isNew: true }),
  item("Liraglutide", "5mg", "metabolic", volumeTiers(222), { isNew: true }),
  item("Liraglutide", "10mg", "metabolic", volumeTiers(336), { isNew: true }),
  item("Liraglutide", "30mg", "metabolic", volumeTiers(671), { isNew: true }),
  item("Dulaglutide", "5mg", "metabolic", volumeTiers(349), { isNew: true }),
  item("Dulaglutide", "10mg", "metabolic", volumeTiers(537), { isNew: true }),
  item("AOD9604", "5mg", "metabolic", [116, 101, 87, 73, 58]),
  item("AOD9604", "10mg", "metabolic", [244, 213, 183, 153, 122]),
  item("Lemon Bottle", "Single 10ml bottle", "metabolic", [73, 63, 54, 45, 36]),
  item("HGH Fragment 176-191", "1mg", "metabolic", [24, 21, 19, 15, 12]),
  item("HGH Fragment 176-191", "2mg", "metabolic", [34, 30, 25, 21, 18]),
  item("HGH Fragment 176-191", "5mg", "metabolic", [139, 122, 105, 87, 69]),
  item("HGH Fragment 176-191", "10mg", "metabolic", [246, 216, 185, 154, 123]),
  item("HGH Fragment 176-191", "12mg", "metabolic", [267, 234, 201, 167, 134]),
  item("HGH Fragment 176-191", "15mg", "metabolic", [253, 222, 190, 158, 127]),
  item("HGH Fragment 17-23", "10mg", "metabolic", [144, 125, 108, 90, 73]),
  item("SLU-PP-322", "5mg", "metabolic", [267, 234, 201, 167, 134]),

  item("BPC-157", "2mg", "recovery", [24, 21, 19, 15, 12]),
  item("BPC-157", "5mg", "recovery", [34, 30, 25, 21, 18]),
  item("BPC-157", "10mg", "recovery", [53, 46, 40, 33, 26]),
  item("TB-500", "2mg", "recovery", [58, 51, 44, 36, 30]),
  item("TB-500", "5mg", "recovery", [110, 97, 82, 69, 55]),
  item("TB-500", "10mg", "recovery", [114, 100, 87, 87, 87]),
  item("BPC 5mg + TB 5mg", "10mg", "recovery", [124, 109, 94, 78, 63]),
  item("BPC 10mg + TB 10mg", "20mg", "recovery", [267, 234, 201, 167, 134]),
  item("GLOW70", "70mg", "recovery", [282, 246, 211, 176, 141]),
  item("KLOW80", "80mg", "recovery", [167, 146, 127, 127, 127]),
  item("KPV", "5mg", "recovery", [30, 25, 22, 19, 15]),
  item("KPV", "10mg", "recovery", [48, 43, 36, 31, 24]),
  item("BPC-157 + TB-500", "30mg", "recovery", [267, 234, 201, 167, 134]),
  item("B7-33", "2mg", "recovery", [101, 88, 76, 63, 51]),
  item("B7-33", "10mg", "recovery", [153, 134, 116, 96, 77]),
  item("TBF", "2mg", "recovery", [30, 25, 22, 19, 15]),

  item("Bronchogen", "20mg", "bioregulator", [150, 131, 112, 94, 75]),
  item("Cardiogen", "10mg", "bioregulator", [110, 97, 82, 69, 55]),
  item("Cardiogen", "20mg", "bioregulator", [244, 213, 183, 153, 122]),
  item("Crystagen", "10mg", "bioregulator", [66, 58, 50, 42, 33]),
  item("Crystagen", "20mg", "bioregulator", [153, 134, 116, 96, 77]),
  item("Cortagen", "10mg", "bioregulator", [63, 55, 47, 40, 32]),
  item("Cortagen", "20mg", "bioregulator", [244, 213, 183, 153, 122]),
  item("Cartalax", "20mg", "bioregulator", [96, 84, 73, 61, 48]),

  item("Epithalon", "10mg", "longevity", [48, 43, 36, 31, 24]),
  item("Epithalon", "50mg", "longevity", [253, 222, 190, 158, 127]),
  item("NAD+", "100mg", "longevity", [24, 21, 19, 15, 12]),
  item("NAD+", "500mg", "longevity", [62, 54, 46, 38, 31]),
  item("NAD+", "1000mg", "longevity", [97, 85, 73, 61, 48]),
  item("MOTS-c", "10mg", "longevity", [62, 54, 46, 38, 31]),
  item("MOTS-c", "20mg", "longevity", [158, 139, 119, 99, 79]),
  item("MOTS-c", "40mg", "longevity", [176, 154, 132, 121, 121]),
  item("SS-31", "10mg", "longevity", [88, 77, 66, 55, 46]),
  item("SS-31", "50mg", "longevity", [396, 346, 297, 248, 198]),
  item("Aicar", "50mg", "longevity", [77, 67, 58, 48, 38]),
  item("FOXO4-DRI", "10mg", "longevity", [44, 38, 33, 28, 22]),
  item("Humanin", "10mg", "longevity", [396, 346, 297, 248, 198]),
  item("PNC-27", "5mg", "longevity", [202, 177, 152, 127, 101]),

  item("CJC-1295 (No DAC)", "2mg", "growth", [38, 34, 30, 24, 20]),
  item("CJC-1295 (No DAC)", "5mg", "growth", [58, 51, 44, 36, 30]),
  item("CJC-1295 (No DAC)", "10mg", "growth", [136, 120, 102, 86, 68]),
  item("CJC-1295 (With DAC)", "10mg", "growth", [267, 234, 201, 167, 134]),
  item("CJC-1295 + Ipamorelin", "10mg", "growth", [106, 92, 79, 66, 53]),
  item("Ipamorelin", "2mg", "growth", [30, 25, 22, 19, 15]),
  item("Ipamorelin", "5mg", "growth", [44, 38, 33, 28, 22]),
  item("Ipamorelin", "10mg", "growth", [66, 58, 50, 42, 33]),
  item("Tesamorelin", "2mg", "growth", [63, 55, 47, 40, 32]),
  item("Tesamorelin", "5mg", "growth", [144, 125, 108, 90, 73]),
  item("Tesamorelin", "10mg", "growth", [140, 122, 108, 108, 108]),
  item("GHRP-2", "10mg", "growth", [38, 34, 30, 24, 20]),
  item("GHRP-6", "5mg", "growth", [24, 21, 19, 15, 12]),
  item("GHRP-6", "10mg", "growth", [38, 34, 30, 24, 20]),
  item("Hexarelin Acetate", "2mg", "growth", volumeTiers(41), { isNew: true }),
  item("Hexarelin Acetate", "5mg", "growth", [87, 76, 65, 54, 44]),
  item("Sermorelin", "5mg", "growth", [73, 63, 54, 45, 36]),
  item("Sermorelin", "10mg", "growth", [177, 155, 133, 111, 89]),
  item("HGH 191AA", "10iu", "growth", [77, 67, 58, 48, 38]),
  item("HGH 191AA", "12iu", "growth", [91, 80, 68, 57, 46]),
  item("HGH 191AA", "24iu", "growth", [191, 167, 144, 120, 96]),
  item("HGH 191AA", "36iu", "growth", [282, 246, 211, 176, 141]),
  item("MK-677", "5mg", "growth", [11, 10, 9, 7, 6]),
  item("Tesamorelin + Ipamorelin", "10mg", "growth", [110, 97, 82, 69, 55]),
  item("PEG-MGF", "2mg", "growth", [63, 55, 47, 40, 32]),
  item("IGF-DES", "2mg", "growth", [48, 42, 36, 31, 24]),

  item("PT141", "10mg", "sexual", [67, 59, 51, 42, 34]),
  item("Kisspeptin-10", "5mg", "sexual", [48, 42, 36, 31, 24]),
  item("Kisspeptin-10", "10mg", "sexual", [96, 84, 73, 61, 48]),
  item("Oxytocin Acetate", "2mg", "sexual", [20, 18, 15, 12, 10]),
  item("Oxytocin Acetate", "5mg", "sexual", [38, 34, 30, 24, 20]),
  item("HCG", "1000iu", "sexual", [48, 42, 36, 31, 24]),
  item("HCG", "2000iu", "sexual", [67, 59, 51, 42, 34]),
  item("HCG", "5000iu", "sexual", [144, 125, 108, 90, 73]),
  item("HCG", "10000iu", "sexual", [296, 260, 222, 186, 148]),
  item("Gonadorelin", "2mg", "sexual", [20, 18, 15, 12, 10]),
  item("Gonadorelin Acetate", "5mg", "sexual", [20, 18, 15, 12, 10]),
  item("Triptorelin Acetate", "2mg", "sexual", [58, 51, 44, 36, 30]),

  item("Selank", "5mg", "neuro", [24, 21, 19, 15, 12]),
  item("Selank", "10mg", "neuro", [48, 43, 36, 31, 24]),
  item("Semax", "5mg", "neuro", [24, 21, 19, 15, 12]),
  item("Semax", "10mg", "neuro", [48, 43, 36, 31, 24]),
  item("DSIP", "2mg", "neuro", [34, 30, 25, 21, 18]),
  item("DSIP", "5mg", "neuro", [58, 51, 44, 36, 30]),
  item("Dihexa", "5mg", "neuro", volumeTiers(46), { isNew: true }),
  item("Dihexa", "10mg", "neuro", volumeTiers(73), { isNew: true }),
  item("Cerebrolysin", "60mg", "neuro", volumeTiers(72), { isNew: true }),
  item("Orexin A", "10mg", "neuro", volumeTiers(196), { isNew: true }),
  item("Orexin B", "5mg", "neuro", volumeTiers(97), { isNew: true }),
  item("Orexin B", "10mg", "neuro", volumeTiers(196), { isNew: true }),
  item("P21", "5mg", "neuro", [396, 346, 297, 248, 198]),
  item("Adamax", "5mg", "neuro", [150, 131, 112, 94, 75]),
  item("Adamax", "10mg", "neuro", [267, 234, 201, 167, 134]),
  item("PE-22-28", "5mg", "neuro", [44, 38, 33, 28, 22]),
  item("PE-22-28", "10mg", "neuro", [116, 101, 87, 73, 58]),
  item("Pinealon", "5mg", "neuro", [24, 21, 19, 15, 12]),
  item("Pinealon", "10mg", "neuro", [58, 51, 44, 36, 30]),
  item("Melatonin", "10mg", "neuro", [53, 46, 40, 33, 26]),
  item("ACTH 1-39", "5mg", "neuro", [110, 97, 82, 69, 55]),

  item("GHK-Cu", "50mg", "aesthetic", [43, 37, 32, 26, 22]),
  item("GHK-Cu", "100mg", "aesthetic", [69, 61, 52, 43, 35]),
  item("Snap-8", "10mg", "aesthetic", [48, 42, 36, 31, 24]),
  item("Melanotan II", "10mg", "aesthetic", [67, 59, 51, 42, 34]),
  item("Melanotan I", "10mg", "aesthetic", [53, 46, 40, 33, 26]),
  item("Glutathione", "600mg", "aesthetic", [50, 42, 40, 30, 24]),
  item("Glutathione", "1500mg", "aesthetic", [70, 60, 50, 42, 32]),
  item("Matrixyl", "10mg", "aesthetic", volumeTiers(49), { isNew: true }),
  item("AHK-Cu", "20mg", "aesthetic", [96, 84, 72, 59, 48]),
  item("AHK-Cu", "50mg", "aesthetic", [48, 42, 36, 31, 24]),
  item("AHK-Cu", "100mg", "aesthetic", [144, 125, 108, 90, 73]),
  item("PTD-DBM", "1mg", "aesthetic", [73, 63, 54, 45, 36]),
  item("Botulinum Toxin", "100iu", "aesthetic", [317, 277, 238, 198, 158]),

  item("Thymosin alpha 1", "5mg", "immune", [139, 122, 105, 87, 69]),
  item("Thymosin alpha 1", "10mg", "immune", [267, 234, 201, 167, 134]),
  item("Thymalin", "10mg", "immune", [67, 59, 51, 42, 34]),
  item("KK-37", "5mg", "immune", [150, 131, 112, 94, 75]),

  item("CBL-514", "5mg", "fatloss", volumeTiers(119), { isNew: true }),
  item("CBL-514", "10mg", "fatloss", volumeTiers(215), { isNew: true }),
  item("CBL-514", "20mg", "fatloss", volumeTiers(309), { isNew: true }),
  item("L-Carnitine", "200mg", "fatloss", volumeTiers(27), { isNew: true }),
  item("L-Carnitine", "400mg", "fatloss", volumeTiers(35), { isNew: true }),
  item("L-Carnitine", "600mg", "fatloss", [48, 42, 36, 31, 24]),
  item("L-Carnitine", "1200mg", "fatloss", [58, 51, 44, 36, 30]),
  item("Lipo-C", "10mg", "fatloss", [277, 243, 208, 174, 139]),
  item("5-Amino-1MQ", "5mg", "fatloss", [38, 34, 30, 24, 20]),
  item("Adipotide", "2mg", "fatloss", [63, 55, 47, 40, 32]),
  item("Adipotide", "5mg", "fatloss", [153, 134, 116, 96, 77]),

  item("FST 344", "1mg", "muscle", volumeTiers(180), { isNew: true }),
  item("GDF-8", "1mg", "muscle", volumeTiers(175), { isNew: true }),
  item("IGF-1 LR3", "0.1mg", "muscle", [34, 30, 25, 21, 18]),
  item("IGF-1 LR3", "1mg", "muscle", volumeTiers(30), { isNew: true }),
  item("MGF", "2mg", "muscle", [101, 88, 76, 63, 51]),
  item("ACE-031", "1mg", "muscle", [97, 85, 73, 61, 48]),
  item("Follistatin", "1mg", "muscle", [267, 234, 201, 167, 134]),
  item("EPO", "3000iu", "muscle", [53, 46, 40, 33, 26]),

  item("Bacteriostatic Water", "3ml", "support", [9, 8, 7, 6, 4], { excludeFromVolume: true }),
  item("Bacteriostatic Water", "Single 10ml Vial", "support", [22, 20, 16, 14, 11], {
    excludeFromVolume: true,
  }),
  item("Acetic Water", "3ml", "support", [7, 6, 4, 4, 3], { excludeFromVolume: true }),
  item("Sterile Water", "3ml", "support", [9, 8, 7, 6, 4], { excludeFromVolume: true }),
  item("Sterile Water", "5ml", "support", [7, 6, 4, 4, 3], { excludeFromVolume: true }),
  item("Sterile Water", "10ml", "support", [22, 20, 16, 14, 11], { excludeFromVolume: true }),
  item("B-12", "10mg", "support", [73, 63, 54, 45, 36]),

  item("ARA 290", "10mg", "specialty", [91, 80, 68, 57, 46]),
  item("VIP", "10mg", "specialty", [163, 143, 122, 102, 81]),
  item("Dermorphin", "5mg", "specialty", [58, 51, 44, 36, 30]),
  item("TGF-DES", "2mg", "specialty", [150, 131, 112, 94, 75]),

  item("Retatrutide", "5mg", "metabolic", null, { specialOrder: true }),
  item("Retatrutide", "15mg", "metabolic", null, { specialOrder: true }),
  item("Retatrutide", "100mg", "metabolic", null, { specialOrder: true }),
  item("Tirzepatide", "5mg", "metabolic", null, { specialOrder: true }),
  item("Tirzepatide", "15mg", "metabolic", null, { specialOrder: true }),
  item("Tirzepatide", "100mg", "metabolic", null, { specialOrder: true }),
  item("Tirzepatide", "120mg", "metabolic", null, { specialOrder: true }),
  item("HMG", "75iu", "sexual", null, { specialOrder: true }),
  item("LL-37", "10mg", "specialty", null, { specialOrder: true }),
  item("Etelcalcetide Hydrochloride", "1g / 2g", "specialty", null, { specialOrder: true }),
];

export const PRODUCTS: Product[] = DRAFTS.map((d) => ({
  ...d,
  id: slugify(`${d.name}-${d.pack}`),
}));

export const STANDARD_PRODUCTS = PRODUCTS.filter((p) => !p.specialOrder);
export const SPECIAL_ORDER_PRODUCTS = PRODUCTS.filter((p) => p.specialOrder);
export const NEW_PRODUCTS = PRODUCTS.filter((p) => p.isNew);

export function groupByName(products: Product[]): { name: string; items: Product[] }[] {
  const order: string[] = [];
  const map = new Map<string, Product[]>();
  for (const p of products) {
    if (!map.has(p.name)) {
      order.push(p.name);
      map.set(p.name, []);
    }
    map.get(p.name)!.push(p);
  }
  return order.map((name) => ({ name, items: map.get(name)! }));
}

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function productsInCategory(id: CategoryId): Product[] {
  return PRODUCTS.filter((p) => p.category === id);
}

export function compoundNames(): string[] {
  return [...new Set(PRODUCTS.map((p) => p.name))].sort((a, b) => a.localeCompare(b));
}

export function productsByName(name: string): Product[] {
  return PRODUCTS.filter((p) => p.name === name);
}

export function normalizeSearch(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function productMatches(product: Product, query: string): boolean {
  const raw = query.trim().toLowerCase();
  if (!raw) return true;
  const tokens = raw.split(/\s+/).filter(Boolean);
  const cat = categoryById(product.category);
  const extra = product.specialOrder ? "quote moq special order make-to-order" : "";
  const blob = [
    product.name,
    product.pack,
    product.unitNote ?? "",
    product.headerNote ?? "",
    ...(product.tags ?? []),
    ...(COMPOUND_SEARCH_TAGS[product.name] ?? []),
    ...compoundCodes(product.name, product.pack),
    ...packSearchTags(product.pack),
    ...(cat?.tags ?? []),
    ...(cat?.searchTags ?? []),
    extra,
    product.isNew ? "new" : "",
  ].join(" ");
  const blobLower = blob.toLowerCase();
  return tokens.every((token) => tokenMatchesBlob(token, blobLower));
}

export function searchProducts(query: string): Product[] {
  if (!query.trim()) return PRODUCTS;
  return PRODUCTS.filter((p) => productMatches(p, query));
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter(
    (p) => p.id !== product.id && (p.name === product.name || p.category === product.category) && !p.specialOrder,
  ).slice(0, limit);
}

export function currentListPeriod(now = new Date()) {
  const month = now.toLocaleString("en-US", { month: "long" });
  const year = now.getFullYear();
  return {
    month,
    year,
    label: `${month} ${year}`,
    title: `${month} Peptide Price List`,
  };
}

export const LIST_META = {
  get title() {
    return currentListPeriod().title;
  },
  get monthName() {
    return currentListPeriod().month;
  },
  company: "Shenzhen Peptide Biotechnology Co., Ltd.",
  companyUrl: "https://www.shenzhenpeptide.com",
  group: "China Biotech Group",
  sister: "Guangzhou Peptide Biotechnology Co., Ltd.",
  sisterUrl: "https://www.guangzhoupeptide.com",
  get month() {
    return currentListPeriod().label;
  },
  kitLegend: "1 Kit = 10 Vials",
  intro:
    'Shenzhen Peptide Biotechnology Co., Ltd. (“SPB”) and Guangzhou Peptide Biotechnology Co., Ltd. (“GPB” or “G”) are the official storefront of China Biotech Group. We have been producing peptides continuously since 2010. We supply B2B partners around the world, and our storefront also serves individual research customers at factory-direct prices with a low minimum order. Every batch is tested in our own laboratory before release, and every order is protected by our written Quality Guarantee and Shipping Guarantee.',
  quality:
    "We encourage you to test your received batch at any reputable laboratory. Should independent results fall below specification, we will provide a full refund or a replacement batch. Further detail is below; contact us for a public COA.",
  shipping:
    "If a shipment is lost, damaged, incomplete, or delayed by a covered customs issue, we will provide a full refund or a replacement shipment. Share the tracking number so we can open the case promptly, or contact us to file a claim.",
  volumeNote:
    "Volume prices apply to each individual SKU. Only kits of the same product and the same strength count toward a better price. Different products are not added together.",
  testing:
    "Every lot is released only after in-house QC. Selected commercial lots are also submitted to independent laboratories, including Janoshik, Freedom Diagnostics, and other accredited facilities. Customers are encouraged to commission their own assay. Should verified results fall below specification, we will refund the order or replace the batch. Public certificates of analysis are available on request.",
  oem:
    "We produce private-label packaging in-house for B2B and bulk orders. Your logo can be printed on vial and box labels and stickers, and caps can be made in your color or branding.",
  research:
    "For laboratory research use only. Not for human or veterinary use, not for diagnostic procedures, and not a drug, food, or cosmetic.",
  contactEmail: "shenzhenpeptide@protonmail.com",
  telegram: "shenzhen_peptide",
  telegramUrl: "https://t.me/shenzhen_peptide",
  contactPage: "https://www.shenzhenpeptide.com/contact",
  address:
    "6 Kefa Road, Science and Technology Park, Nanshan District, Shenzhen, Guangdong 518057",
  addressZh: "广东省深圳市南山区科技园科发路6号 邮政编码：518057",
};
