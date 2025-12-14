
export enum ScentFacet {
    ALDEHYDIC = 'Aldehydic',
    AMBER = 'Amber',
    ANIMALIC = 'Animalic',
    AQUATIC = 'Aquatic',
    BALSAMIC = 'Balsamic',
    BUTTERY = 'Buttery',
    CAMPHOROUS = 'Camphorous',
    CARAMELIC = 'Caramelic',
    CITRUS = 'Citrus',
    CLEAN = 'Clean',
    CREAMY = 'Creamy',
    DRY = 'Dry',
    DUSTY = 'Dusty',
    EARTHY = 'Earthy',
    FLORAL = 'Floral',
    FRESH = 'Fresh',
    FRUITY = 'Fruity',
    GREEN = 'Green',
    HAY = 'Hay',
    HERBAL = 'Herbal',
    ICY = 'Icy',
    JAMMY = 'Jammy',
    JUICY = 'Juicy',
    LEAFY = 'Leafy',
    LEATHERY = 'Leathery',
    MARINE = 'Marine',
    METALLIC = 'Metallic',
    MINERAL = 'Mineral',
    MINTY = 'Minty',
    MOSSY = 'Mossy',
    MUSHROOM = 'Mushroom',
    MUSKY = 'Musky',
    OZONIC = 'Ozonic',
    PEAR = 'Pear',
    PINEAPPLE = 'Pineapple',
    POWDERY = 'Powdery',
    RADIANT = 'Radiant',
    RESINOUS = 'Resinous',
    ROSY = 'Rosy',
    SHARP = 'Sharp',
    SMOKY = 'Smoky',
    SOAPY = 'Soapy',
    SPICY = 'Spicy',
    SWEET = 'Sweet',
    TEA = 'Tea',
    TERPENIC = 'Terpenic',
    TRANSPARENT = 'Transparent',
    TROPICAL = 'Tropical',
    VANILLA = 'Vanilla',
    VELVETY = 'Velvety',
    WARM = 'Warm',
    WAXY = 'Waxy',
    WOODY = 'Woody',
    ZESTY = 'Zesty',
}

export enum FunctionalRole {
    DIFFUSER = 'Diffuser',
    FIXATIVE = 'Fixative',
    BOOSTER = 'Booster',
    BLENDER = 'Blender',
    MODIFIER = 'Modifier',
    SHEER = 'Sheer',
    TEXTURIZER = 'Texturizer',
    STABILIZER = 'Stabilizer',
    SOLVENT = 'Solvent',
    FILTER = 'Filter',
    RADIANT = 'Radiant',
    SWEETENER = 'Sweetener',
    FRESHENER = 'Freshener',
    ANTIOXIDANT = 'Antioxidant',
}

export enum OlfactiveFamily {
    CITRUS = 'Citrus',
    FLORAL = 'Floral',
    WOODY = 'Woody',
    SPICY = 'Spicy',
    GREEN = 'Green',
    FRUITY = 'Fruity',
    GOURMAND = 'Gourmand',
    AMBER = 'Amber',
    MUSK = 'Musk',
    AQUATIC = 'Aquatic',
    AROMATIC = 'Aromatic',
    BALSAMIC = 'Balsamic',
    MOSSY = 'Mossy',
    ALDEHYDIC = 'Aldehydic',
    SOLVENT = 'Solvent',
    ADDITIVE = 'Additive', 
}

export enum MoleculeOrigin {
    NATURAL = 'Natural',
    SYNTHETIC = 'Synthetic',
    NATURAL_ISOLATE = 'Natural Isolate',
    BASE = 'Base',
    ESSENTIAL_OIL = 'Essential Oil',
    ABSOLUTE = 'Absolute',
    RESINOID = 'Resinoid',
    RESIN = 'Resin',
    CO2_EXTRACT = 'CO₂ Extract',
}

export enum PhysicalState {
    LIQUID = 'Liquid',
    POWDER_CRYSTAL = 'Powder / Crystal',
    SOLID = 'Solid',
    PASTE = 'Paste / Resin',
}

export enum ProductType {
    FINE_FRAGRANCE = 'Fine Fragrance',
    CANDLE = 'Candle',
    CREAM = 'Cream',
    DIFFUSER = 'Diffuser',
    SOAP = 'Soap',
    BODY_LOTION = 'Body Lotion',
    SHAMPOO = 'Shampoo',
    AIR_FRESHENER = 'Air Freshener',
    OTHER = 'Other',
}

export enum PackagingCategory {
    BOTTLE = 'Bottle',
    PUMP = 'Pump',
    CAP = 'Cap',
    LABEL = 'Label',
    BOX = 'Box',
    OTHER = 'Other'
}

export interface PackagingComponent {
    id: string;
    name: string;
    category: PackagingCategory;
    cost: number;
    supplier?: string;
}

export interface InventoryBatch {
    id: string;
    batchNumber: string;
    lab: string;      
    supplier: string; 
    purchaseDate: string; 
    stockAmount: number; 
    costPerGram: number;
}

export interface Molecule {
    id: string;
    name: string;
    olfactiveFamily: OlfactiveFamily;
    origin?: MoleculeOrigin;
    physicalState?: PhysicalState; 
    functionalRole?: FunctionalRole[];
    roles: string[]; 
    casNumber?: string;
    iupacName?: string;
    odorStrength: number; 
    impact: number; 
    scentDNA: Record<string, number>; 
    evaporationCurve: number[]; 
    synergies: string[]; 
    IFRA_MAX_CONCENTRATION: number; 
    sdsFilename?: string;
    sdsFileContent?: string;
    sdsUrl?: string;
    inventoryBatches: InventoryBatch[];
    createdAt: string; 
    totalStock?: number;
    avgCostPerGram?: number;
}

export interface FormulaIngredient {
    moleculeId: string;
    myDilution: number; 
    amount: number; 
    solventId?: string; 
}

export interface FormulaEvaluation {
    id: string;
    date: string;
    status: 'Fresh' | '1 Day' | '1 Week' | '2 Weeks' | '1 Month+';
    notes: string;
    score: number; 
}

export interface Formula {
    id: string;
    name: string;
    unit: 'weight' | 'drops';
    finalDilution: number; 
    productType?: ProductType;
    customProductType?: string;
    ingredients: FormulaIngredient[];
    notes?: string;
    evaluations?: FormulaEvaluation[];
    createdAt: string; 
    mood?: OlfactiveFamily | 'default';
}

export interface ScentNote {
    id: string;
    moleculeId: string;
    text: string;
    createdAt: string; 
}

export interface MoleculeResource {
    id: string;
    moleculeId: string;
    title: string;
    type: 'pdf' | 'link' | 'image' | 'text';
    url?: string;
    fileName?: string;
    date: string;
}

export interface WishlistItem {
    id: string;
    name: string;
    note: string;
}

export type ActivityEvent = {
    type: 'molecule' | 'formula' | 'note';
    data: Molecule | Formula | ScentNote;
    date: Date;
}

export interface OlfactiveFamilyProfile {
    mainCharacter: string;
    description: string;
}

export interface PackagingSelection {
    componentId: string;
    name: string; 
    cost: number; 
}

export interface FinishedProduct {
    id: string;
    name: string;
    formulaId: string;
    bottleSize: number; 
    concentration: number; 
    alcoholCostPerKg: number;
    laborCost: number;
    overheadCost: number;
    retailPrice: number;
    packaging: Record<PackagingCategory, PackagingSelection | null>;
    customPackaging: PackagingSelection[]; 
    customCosts: { id: string; name: string; cost: number }[]; 
    createdAt: string;
}
