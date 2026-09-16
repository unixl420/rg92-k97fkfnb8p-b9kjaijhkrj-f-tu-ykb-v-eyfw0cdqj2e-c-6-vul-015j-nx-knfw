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
};

export type Category = {
  id: CategoryId;
  label: string;
  short: string;
  blurb: string;
  goal: string;
  tags: string[];
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
    accent: "#156f7a",
  },
  {
    id: "recovery",
    label: "Recovery & Tissue Research",
    short: "Recovery",
    blurb: "For research on tissue repair — tendons, gut lining, wounds, and local inflammation.",
    goal: "Recovery & repair",
    tags: ["repair", "tendon", "gut lining", "wound", "inflammation", "relaxin pathway"],
    accent: "#1b6b4a",
  },
  {
    id: "bioregulator",
    label: "Tissue Bioregulator Research",
    short: "Bioregulators",
    blurb: "Short peptides studied as signals for one organ at a time, such as lung, heart, or cartilage.",
    goal: "Organ-specific",
    tags: ["organ-specific", "lung", "heart", "immune", "cortex", "cartilage"],
    accent: "#3a5f8f",
  },
  {
    id: "longevity",
    label: "Longevity & Cellular Research",
    short: "Longevity",
    blurb: "For research on how cells age, handle stress, and keep mitochondria working well.",
    goal: "Longevity",
    tags: ["aging", "mitochondria", "cell survival", "cytoprotection"],
    accent: "#5d4e8c",
  },
  {
    id: "growth",
    label: "Growth Hormone & Secretagogue Research",
    short: "GH & Secretagogues",
    blurb: "Peptides related to the body’s own growth-hormone pulse and IGF-1 signal.",
    goal: "Growth hormone",
    tags: ["GH pulse", "GHRH", "IGF-1", "secretagogue", "MGF"],
    accent: "#1f4e79",
  },
  {
    id: "muscle",
    label: "Muscle & Performance Research",
    short: "Muscle",
    blurb: "For research on muscle size, the myostatin pathway, and oxygen-carrying red cells.",
    goal: "Muscle & performance",
    tags: ["muscle size", "myostatin", "oxygen carry", "erythropoiesis"],
    accent: "#8e3b4a",
  },
  {
    id: "sexual",
    label: "Sexual Health & Fertility Research",
    short: "Sexual & Fertility",
    blurb: "For research on fertility and the pituitary–gonad axis.",
    goal: "Sexual health",
    tags: ["fertility", "GnRH", "pituitary", "gonadotropin"],
    accent: "#8a4568",
  },
  {
    id: "neuro",
    label: "Neuroscience & Sleep Research",
    short: "Nootropics & Sleep",
    blurb: "For research on memory, mood, sleep, and the stress axis.",
    goal: "Cognition & sleep",
    tags: ["memory", "mood", "sleep", "stress axis", "pineal", "nootropic"],
    accent: "#3d4a8a",
  },
  {
    id: "aesthetic",
    label: "Aesthetic, Hair & Skin Research",
    short: "Aesthetic",
    blurb: "For research on skin, collagen, hair follicles, and pigment.",
    goal: "Skin, hair & aesthetic",
    tags: ["skin", "collagen", "hair follicle", "copper peptide", "pigment"],
    accent: "#7d5b86",
  },
  {
    id: "immune",
    label: "Immune & Thymic Research",
    short: "Immune",
    blurb: "For research on innate defense, the thymus, and antimicrobial peptides.",
    goal: "Immune",
    tags: ["innate defense", "thymus", "antimicrobial", "cathelicidin"],
    accent: "#2f6d4f",
  },
  {
    id: "fatloss",
    label: "Fat Loss & Body Composition Research",
    short: "Fat Loss",
    blurb: "For research on localized fat and body composition.",
    goal: "Body composition",
    tags: ["localized fat", "carnitine", "body composition", "fat loss"],
    accent: "#c45c4a",
  },
  {
    id: "support",
    label: "Reconstitution & Support Materials",
    short: "Support",
    blurb: "Water and solvents used to dissolve a vial. These are not peptides and do not count toward volume pricing.",
    goal: "Lab support",
    tags: ["sterile water", "solvent", "reconstitute", "BAC water", "not a peptide"],
    accent: "#4a6275",
  },
  {
    id: "specialty",
    label: "Specialty Research Compounds",
    short: "Specialty",
    blurb: "Useful tools that do not sit neatly in one organ system.",
    goal: "Specialty",
    tags: ["niche pathway", "growth-factor", "matrix"],
    accent: "#3d4c5c",
  },
];

export function categoryById(id: CategoryId): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
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
  item("Lemon Bottle", "10ml", "metabolic", [73, 63, 54, 45, 36], { unitNote: "Single 10ml bottle" }),
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
  item("L-Carnitine", "600mg", "fatloss", [48, 42, 36, 31, 24], { unitNote: "10ml vials" }),
  item("L-Carnitine", "1200mg", "fatloss", [58, 51, 44, 36, 30], { unitNote: "10ml vials" }),
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
  item("Bacteriostatic Water", "10ml", "support", [22, 20, 16, 14, 11], {
    excludeFromVolume: true,
    unitNote: "Single 10ml vial",
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
  const cat = categoryById(product.category);
  const extra = product.specialOrder ? "quote moq special order make-to-order" : "";
  const blob = [
    product.name,
    product.pack,
    product.unitNote ?? "",
    cat?.label ?? "",
    cat?.short ?? "",
    cat?.goal ?? "",
    cat?.blurb ?? "",
    ...(cat?.tags ?? []),
    extra,
  ].join(" ");
  if (blob.toLowerCase().includes(raw)) return true;
  const compact = normalizeSearch(raw);
  return compact.length > 0 && normalizeSearch(blob).includes(compact);
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
    "If a shipment is lost, damaged, incomplete, or delayed by a covered customs issue, we will provide a full refund or a replacement shipment. Share the tracking number so we can open the case promptly. Contact us to file a claim.",
  volumeNote:
    "Volume prices apply to each individual SKU. Only kits of the same product and the same strength count toward a better price. Different products are not added together.",
  testing:
    "Every lot is released only after in-house QC. Selected commercial lots are also submitted to independent laboratories, including Janoshik, Freedom Diagnostics, and other accredited facilities. Customers are encouraged to commission their own assay. Should verified results fall below specification, we will refund the order or replace the batch. Public certificates of analysis are available on request — please contact us.",
  research:
    "For laboratory research use only. Not for human or veterinary use, not for diagnostic procedures, and not a drug, food, or cosmetic.",
};
