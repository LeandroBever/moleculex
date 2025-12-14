
import { OlfactiveFamily, Molecule, Formula, ScentNote, WishlistItem, FunctionalRole, ScentFacet, ProductType, MoleculeOrigin, PhysicalState, PackagingCategory, FinishedProduct, MoleculeResource } from './types';

export const SCENT_FACETS = Object.values(ScentFacet);

export const MOLECULE_ROLES = ['Top Note', 'Top-Heart Note', 'Heart Note', 'Heart-Base Note', 'Base Note'];

export const CATEGORY_COLORS: Record<OlfactiveFamily, string> = {
    [OlfactiveFamily.CITRUS]: 'bg-yellow-400',
    [OlfactiveFamily.FLORAL]: 'bg-pink-400',
    [OlfactiveFamily.WOODY]: 'bg-amber-700',
    [OlfactiveFamily.SPICY]: 'bg-red-500',
    [OlfactiveFamily.GREEN]: 'bg-green-500',
    [OlfactiveFamily.FRUITY]: 'bg-purple-700',
    [OlfactiveFamily.GOURMAND]: 'bg-stone-500',
    [OlfactiveFamily.AMBER]: 'bg-yellow-600',
    [OlfactiveFamily.MUSK]: 'bg-purple-300',
    [OlfactiveFamily.AQUATIC]: 'bg-blue-400',
    [OlfactiveFamily.AROMATIC]: 'bg-teal-500',
    [OlfactiveFamily.BALSAMIC]: 'bg-amber-900',
    [OlfactiveFamily.MOSSY]: 'bg-emerald-700',
    [OlfactiveFamily.ALDEHYDIC]: 'bg-slate-400',
    [OlfactiveFamily.SOLVENT]: 'bg-gray-500',
    [OlfactiveFamily.ADDITIVE]: 'bg-slate-600',
};

export const CATEGORY_HEX_COLORS: Record<OlfactiveFamily, string> = {
    [OlfactiveFamily.CITRUS]: '#FACC15',
    [OlfactiveFamily.FLORAL]: '#F472B6',
    [OlfactiveFamily.WOODY]: '#B45309',
    [OlfactiveFamily.SPICY]: '#EF4444',
    [OlfactiveFamily.GREEN]: '#22C55E',
    [OlfactiveFamily.FRUITY]: '#7E22CE',
    [OlfactiveFamily.GOURMAND]: '#78716C',
    [OlfactiveFamily.AMBER]: '#D97706',
    [OlfactiveFamily.MUSK]: '#C4B5FD',
    [OlfactiveFamily.AQUATIC]: '#60A5FA',
    [OlfactiveFamily.AROMATIC]: '#14B8A6',
    [OlfactiveFamily.BALSAMIC]: '#78350F',
    [OlfactiveFamily.MOSSY]: '#047857',
    [OlfactiveFamily.ALDEHYDIC]: '#94A3B8',
    [OlfactiveFamily.SOLVENT]: '#6B7280',
    [OlfactiveFamily.ADDITIVE]: '#475569',
};

export const OLFACTIVE_FAMILY_PROFILES: Record<OlfactiveFamily, { mainCharacter: string; description: string }> = {
    [OlfactiveFamily.CITRUS]: { mainCharacter: 'Zesty & Sparkling', description: 'Famous for their refreshing, effervescent, and uplifting qualities.' },
    [OlfactiveFamily.FLORAL]: { mainCharacter: 'Romantic & Versatile', description: 'The heart of perfumery, ranging from fresh lily-of-the-valley to rich tuberose.' },
    [OlfactiveFamily.WOODY]: { mainCharacter: 'Elegant & Grounding', description: 'Evoking forests. Dry, smoky, and resinous notes provide structure.' },
    [OlfactiveFamily.SPICY]: { mainCharacter: 'Warm & Exotic', description: 'Spices add warmth and pungency, from hot cinnamon to cold cardamom.' },
    [OlfactiveFamily.GREEN]: { mainCharacter: 'Crisp & Natural', description: 'Captures the sharp scent of cut grass and crushed leaves.' },
    [OlfactiveFamily.FRUITY]: { mainCharacter: 'Juicy & Playful', description: 'Luscious, ripe, edible notes beyond citrus.' },
    [OlfactiveFamily.GOURMAND]: { mainCharacter: 'Edible & Comforting', description: 'Sweet, dessert-like aromas like vanilla and caramel.' },
    [OlfactiveFamily.AMBER]: { mainCharacter: 'Warm & Sensual', description: 'Rich, opulent notes like labdanum and vanilla.' },
    [OlfactiveFamily.MUSK]: { mainCharacter: 'Clean & Skin-like', description: 'Soft, powdery, and sensual foundation notes.' },
    [OlfactiveFamily.AQUATIC]: { mainCharacter: 'Fresh & Oceanic', description: 'Evokes sea spray and rain. Clean and transparent.' },
    [OlfactiveFamily.AROMATIC]: { mainCharacter: 'Herbaceous & Fresh', description: 'Fresh herbs like lavender and rosemary.' },
    [OlfactiveFamily.BALSAMIC]: { mainCharacter: 'Rich & Resinous', description: 'Sweet, warm resins like benzoin and myrrh.' },
    [OlfactiveFamily.MOSSY]: { mainCharacter: 'Deep & Mysterious', description: 'Forest floor, mosses, and damp earth.' },
    [OlfactiveFamily.ALDEHYDIC]: { mainCharacter: 'Abstract & Radiant', description: 'Synthetic materials that provide lift and sparkle.' },
    [OlfactiveFamily.SOLVENT]: { mainCharacter: 'Neutral & Functional', description: 'Carriers and diluents.' },
    [OlfactiveFamily.ADDITIVE]: { mainCharacter: 'Technical & Protective', description: 'Functional ingredients for stability.' },
};

export const MOCK_FINISHED_PRODUCTS: FinishedProduct[] = [
    {
        id: 'prod-001',
        name: 'Summer Citrus - 50ml EDP',
        formulaId: 'formula-001',
        bottleSize: 50,
        concentration: 15,
        alcoholCostPerKg: 15,
        laborCost: 2.50,
        overheadCost: 1.00,
        retailPrice: 115.00,
        packaging: {
            [PackagingCategory.BOTTLE]: { componentId: 'pkg-001', name: '50ml Glass Bottle (Standard)', cost: 1.20 },
            [PackagingCategory.PUMP]: { componentId: 'pkg-003', name: 'Gold Spray Pump (Crimpless)', cost: 0.45 },
            [PackagingCategory.CAP]: { componentId: 'pkg-005', name: 'Wooden Cap (Oak)', cost: 0.80 },
            [PackagingCategory.LABEL]: { componentId: 'pkg-009', name: 'Front Label (Foil)', cost: 0.15 },
            [PackagingCategory.BOX]: { componentId: 'pkg-007', name: 'Product Box (Cardstock)', cost: 0.50 },
            [PackagingCategory.OTHER]: null
        },
        customPackaging: [],
        customCosts: [],
        createdAt: '2023-12-01T10:00:00Z'
    },
    {
        id: 'prod-002',
        name: 'Modern Barber - 100ml EDT',
        formulaId: 'formula-002',
        bottleSize: 100,
        concentration: 12,
        alcoholCostPerKg: 15,
        laborCost: 3.00,
        overheadCost: 1.20,
        retailPrice: 85.00,
        packaging: {
            [PackagingCategory.BOTTLE]: { componentId: 'pkg-002', name: '100ml Amber Glass', cost: 1.80 },
            [PackagingCategory.PUMP]: { componentId: 'pkg-004', name: 'Silver Pump', cost: 0.40 },
            [PackagingCategory.CAP]: { componentId: 'pkg-006', name: 'Black Bakelite Cap', cost: 0.60 },
            [PackagingCategory.LABEL]: { componentId: 'pkg-010', name: 'Matte Paper Label', cost: 0.10 },
            [PackagingCategory.BOX]: null,
            [PackagingCategory.OTHER]: null
        },
        customPackaging: [],
        customCosts: [],
        createdAt: '2024-01-15T14:30:00Z'
    },
    {
        id: 'prod-003',
        name: 'Fig & Tea - Room Spray',
        formulaId: 'formula-006',
        bottleSize: 200,
        concentration: 5,
        alcoholCostPerKg: 10,
        laborCost: 1.50,
        overheadCost: 0.50,
        retailPrice: 45.00,
        packaging: {
            [PackagingCategory.BOTTLE]: { componentId: 'pkg-011', name: '200ml Plastic Trigger', cost: 0.90 },
            [PackagingCategory.PUMP]: { componentId: 'pkg-012', name: 'Trigger Sprayer', cost: 0.35 },
            [PackagingCategory.CAP]: null,
            [PackagingCategory.LABEL]: { componentId: 'pkg-013', name: 'Wrap Label', cost: 0.10 },
            [PackagingCategory.BOX]: null,
            [PackagingCategory.OTHER]: null
        },
        customPackaging: [],
        customCosts: [],
        createdAt: '2024-03-20T09:00:00Z'
    }
];

export const MOCK_CORE_MOLECULES: Molecule[] = [
    // CITRUS (7)
    { id: 'core-cit-01', name: 'Bergamot Oil (Reggio)', olfactiveFamily: OlfactiveFamily.CITRUS, origin: MoleculeOrigin.ESSENTIAL_OIL, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '8007-75-8', odorStrength: 7, impact: 4, scentDNA: { [ScentFacet.ZESTY]: 5, [ScentFacet.FLORAL]: 2, [ScentFacet.GREEN]: 2 }, evaporationCurve: [100, 60, 20, 5, 0, 0], synergies: ['Hedione', 'Linalool'], IFRA_MAX_CONCENTRATION: 0.4, inventoryBatches: [
        { id: 'b-cit-01', batchNumber: 'BER-23-001', lab: 'Simone Gatto', supplier: 'Direct', purchaseDate: '2023-01-15', stockAmount: 100, costPerGram: 0.25 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 100, avgCostPerGram: 0.25 },
    { id: 'core-cit-02', name: 'Lemon Oil (Sicily)', olfactiveFamily: OlfactiveFamily.CITRUS, origin: MoleculeOrigin.ESSENTIAL_OIL, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.BOOSTER], casNumber: '8008-56-8', odorStrength: 8, impact: 2, scentDNA: { [ScentFacet.ZESTY]: 5, [ScentFacet.SWEET]: 1 }, evaporationCurve: [100, 40, 10, 0, 0, 0], synergies: ['Citral'], IFRA_MAX_CONCENTRATION: 2.0, inventoryBatches: [
        { id: 'b-cit-02', batchNumber: 'LEM-SIC-23', lab: 'Capua', supplier: 'Vigon', purchaseDate: '2023-02-10', stockAmount: 250, costPerGram: 0.15 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 250, avgCostPerGram: 0.15 },
    { id: 'core-cit-03', name: 'Sweet Orange Oil', olfactiveFamily: OlfactiveFamily.CITRUS, origin: MoleculeOrigin.ESSENTIAL_OIL, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.SWEETENER], casNumber: '8008-57-9', odorStrength: 6, impact: 3, scentDNA: { [ScentFacet.SWEET]: 4, [ScentFacet.ZESTY]: 3, [ScentFacet.FRUITY]: 3 }, evaporationCurve: [100, 50, 15, 0, 0, 0], synergies: ['Aldehydes'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-cit-03', batchNumber: 'ORG-FL-5X', lab: 'Florida Chemical', supplier: 'Perfumers Apprentice', purchaseDate: '2023-03-05', stockAmount: 500, costPerGram: 0.08 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 500, avgCostPerGram: 0.08 },
    { id: 'core-cit-04', name: 'Mandarin Oil (Red)', olfactiveFamily: OlfactiveFamily.CITRUS, origin: MoleculeOrigin.ESSENTIAL_OIL, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '8008-31-9', odorStrength: 7, impact: 4, scentDNA: { [ScentFacet.SWEET]: 3, [ScentFacet.ZESTY]: 3, [ScentFacet.FLORAL]: 2 }, evaporationCurve: [100, 55, 20, 5, 0, 0], synergies: ['Neroli'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2023-01-01T00:00:00Z', totalStock: 80, avgCostPerGram: 0.35 },
    { id: 'core-cit-05', name: 'Grapefruit Oil (White)', olfactiveFamily: OlfactiveFamily.CITRUS, origin: MoleculeOrigin.ESSENTIAL_OIL, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.BOOSTER], casNumber: '8016-20-4', odorStrength: 8, impact: 3, scentDNA: { [ScentFacet.ZESTY]: 5, [ScentFacet.GREEN]: 2, [ScentFacet.SWEET]: 1 }, evaporationCurve: [100, 45, 10, 0, 0, 0], synergies: ['Vetiver'], IFRA_MAX_CONCENTRATION: 4.0, inventoryBatches: [
        { id: 'b-cit-05', batchNumber: 'GRP-23-A', lab: 'Treatt', supplier: 'Creating Perfume', purchaseDate: '2023-04-12', stockAmount: 120, costPerGram: 0.40 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 120, avgCostPerGram: 0.40 },
    { id: 'core-cit-06', name: 'Limonene', olfactiveFamily: OlfactiveFamily.CITRUS, origin: MoleculeOrigin.NATURAL_ISOLATE, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.TEXTURIZER], casNumber: '5989-27-5', odorStrength: 6, impact: 2, scentDNA: { [ScentFacet.ZESTY]: 4, [ScentFacet.CLEAN]: 3 }, evaporationCurve: [100, 30, 5, 0, 0, 0], synergies: ['Citrus Oils'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-cit-06', batchNumber: 'D-LIM-99', lab: 'Sigma', supplier: 'Vigon', purchaseDate: '2023-01-10', stockAmount: 1000, costPerGram: 0.05 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 1000, avgCostPerGram: 0.05 },
    { id: 'core-cit-07', name: 'Citral', olfactiveFamily: OlfactiveFamily.CITRUS, origin: MoleculeOrigin.NATURAL_ISOLATE, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.BOOSTER], casNumber: '5392-40-5', odorStrength: 9, impact: 2, scentDNA: { [ScentFacet.ZESTY]: 5, [ScentFacet.GREEN]: 2, [ScentFacet.SHARP]: 4 }, evaporationCurve: [100, 35, 5, 0, 0, 0], synergies: ['Lemon'], IFRA_MAX_CONCENTRATION: 0.6, inventoryBatches: [
        { id: 'b-cit-07', batchNumber: 'CIT-NAT-23', lab: 'BASF', supplier: 'Perfumers Apprentice', purchaseDate: '2023-05-20', stockAmount: 50, costPerGram: 0.12 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 50, avgCostPerGram: 0.12 },

    // FLORAL (8)
    { id: 'core-flo-01', name: 'Hedione', olfactiveFamily: OlfactiveFamily.FLORAL, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Top-Heart Note', 'Heart Note'], functionalRole: [FunctionalRole.RADIANT, FunctionalRole.BLENDER], casNumber: '24851-98-7', odorStrength: 3, impact: 48, scentDNA: { [ScentFacet.FLORAL]: 3, [ScentFacet.TRANSPARENT]: 5, [ScentFacet.CITRUS]: 1 }, evaporationCurve: [40, 60, 80, 70, 40, 10], synergies: ['Jasmine', 'Citrus'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-flo-01', batchNumber: 'HED-HC-23', lab: 'Firmenich', supplier: 'Vigon', purchaseDate: '2023-02-15', stockAmount: 500, costPerGram: 0.09 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 500, avgCostPerGram: 0.09 },
    { id: 'core-flo-02', name: 'Linalool', olfactiveFamily: OlfactiveFamily.FLORAL, origin: MoleculeOrigin.NATURAL_ISOLATE, physicalState: PhysicalState.LIQUID, roles: ['Top-Heart Note'], functionalRole: [FunctionalRole.BLENDER], casNumber: '78-70-6', odorStrength: 5, impact: 4, scentDNA: { [ScentFacet.FLORAL]: 4, [ScentFacet.WOODY]: 1, [ScentFacet.ZESTY]: 2 }, evaporationCurve: [90, 70, 30, 5, 0, 0], synergies: ['Lavender', 'Bergamot'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-flo-02', batchNumber: 'LIN-SYN-23', lab: 'BASF', supplier: 'Creating Perfume', purchaseDate: '2023-03-01', stockAmount: 300, costPerGram: 0.07 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 300, avgCostPerGram: 0.07 },
    { id: 'core-flo-03', name: 'Geraniol', olfactiveFamily: OlfactiveFamily.FLORAL, origin: MoleculeOrigin.NATURAL_ISOLATE, physicalState: PhysicalState.LIQUID, roles: ['Heart Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '106-24-1', odorStrength: 6, impact: 8, scentDNA: { [ScentFacet.FLORAL]: 5, [ScentFacet.FRUITY]: 2, [ScentFacet.ROSY]: 4 }, evaporationCurve: [60, 80, 50, 10, 0, 0], synergies: ['Rose', 'Citronellol'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2023-01-01T00:00:00Z', totalStock: 200, avgCostPerGram: 0.10 },
    { id: 'core-flo-04', name: 'Citronellol', olfactiveFamily: OlfactiveFamily.FLORAL, origin: MoleculeOrigin.NATURAL_ISOLATE, physicalState: PhysicalState.LIQUID, roles: ['Heart Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '106-22-9', odorStrength: 6, impact: 8, scentDNA: { [ScentFacet.FLORAL]: 4, [ScentFacet.ROSY]: 5, [ScentFacet.WAXY]: 2 }, evaporationCurve: [60, 80, 50, 10, 0, 0], synergies: ['Geraniol', 'Rose'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-flo-04', batchNumber: 'CIT-950', lab: 'IFF', supplier: 'Perfumers Apprentice', purchaseDate: '2023-04-10', stockAmount: 220, costPerGram: 0.11 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 220, avgCostPerGram: 0.11 },
    { id: 'core-flo-05', name: 'Phenyl Ethyl Alcohol (PEA)', olfactiveFamily: OlfactiveFamily.FLORAL, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Heart Note'], functionalRole: [FunctionalRole.BLENDER], casNumber: '60-12-8', odorStrength: 4, impact: 16, scentDNA: { [ScentFacet.FLORAL]: 4, [ScentFacet.ROSY]: 3, [ScentFacet.GREEN]: 1 }, evaporationCurve: [50, 70, 60, 20, 0, 0], synergies: ['Rose', 'Green Notes'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-flo-05', batchNumber: 'PEA-23-01', lab: 'Symrise', supplier: 'Vigon', purchaseDate: '2023-01-20', stockAmount: 600, costPerGram: 0.04 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 600, avgCostPerGram: 0.04 },
    { id: 'core-flo-06', name: 'Benzyl Acetate', olfactiveFamily: OlfactiveFamily.FLORAL, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.BOOSTER], casNumber: '140-11-4', odorStrength: 7, impact: 4, scentDNA: { [ScentFacet.FLORAL]: 4, [ScentFacet.FRUITY]: 3, [ScentFacet.SWEET]: 2 }, evaporationCurve: [90, 50, 10, 0, 0, 0], synergies: ['Jasmine', 'Ylang'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2023-01-01T00:00:00Z', totalStock: 150, avgCostPerGram: 0.05 },
    { id: 'core-flo-07', name: 'Hydroxycitronellal', olfactiveFamily: OlfactiveFamily.FLORAL, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Heart Note'], functionalRole: [FunctionalRole.FIXATIVE], casNumber: '107-75-5', odorStrength: 5, impact: 24, scentDNA: { [ScentFacet.FLORAL]: 5, [ScentFacet.GREEN]: 2, [ScentFacet.CLEAN]: 3 }, evaporationCurve: [20, 60, 80, 50, 20, 0], synergies: ['Muguet'], IFRA_MAX_CONCENTRATION: 1.0, inventoryBatches: [
        { id: 'b-flo-07', batchNumber: 'HYD-CIT-23', lab: 'Takasago', supplier: 'Creating Perfume', purchaseDate: '2023-06-15', stockAmount: 100, costPerGram: 0.15 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 100, avgCostPerGram: 0.15 },
    { id: 'core-flo-08', name: 'Ylang Ylang Oil (Extra)', olfactiveFamily: OlfactiveFamily.FLORAL, origin: MoleculeOrigin.ESSENTIAL_OIL, physicalState: PhysicalState.LIQUID, roles: ['Top-Heart Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '8006-81-3', odorStrength: 9, impact: 12, scentDNA: { [ScentFacet.FLORAL]: 5, [ScentFacet.SWEET]: 4, [ScentFacet.SPICY]: 2 }, evaporationCurve: [80, 90, 40, 10, 0, 0], synergies: ['Jasmine', 'Vanilla'], IFRA_MAX_CONCENTRATION: 0.8, inventoryBatches: [
        { id: 'b-flo-08', batchNumber: 'YLG-EXT-COM', lab: 'Biolandes', supplier: 'Perfumers Apprentice', purchaseDate: '2023-07-01', stockAmount: 40, costPerGram: 0.90 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 40, avgCostPerGram: 0.90 },

    // WOODY (8)
    { id: 'core-woo-01', name: 'Iso E Super', olfactiveFamily: OlfactiveFamily.WOODY, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Base Note'], functionalRole: [FunctionalRole.FIXATIVE, FunctionalRole.RADIANT], casNumber: '54464-57-2', odorStrength: 4, impact: 168, scentDNA: { [ScentFacet.WOODY]: 5, [ScentFacet.AMBER]: 3, [ScentFacet.VELVETY]: 4 }, evaporationCurve: [20, 30, 60, 80, 70, 50], synergies: ['Musks', 'Hedione'], IFRA_MAX_CONCENTRATION: 21.4, inventoryBatches: [
        { id: 'b-woo-01', batchNumber: 'IES-552', lab: 'IFF', supplier: 'Creating Perfume', purchaseDate: '2023-03-10', stockAmount: 500, costPerGram: 0.06 },
        { id: 'b-woo-01-b', batchNumber: 'IES-553', lab: 'IFF', supplier: 'Creating Perfume', purchaseDate: '2023-09-10', stockAmount: 300, costPerGram: 0.06 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 800, avgCostPerGram: 0.06 },
    { id: 'core-woo-02', name: 'Cedramber', olfactiveFamily: OlfactiveFamily.WOODY, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Base Note'], functionalRole: [FunctionalRole.FIXATIVE], casNumber: '19870-74-7', odorStrength: 5, impact: 120, scentDNA: { [ScentFacet.WOODY]: 4, [ScentFacet.AMBER]: 4, [ScentFacet.DRY]: 3 }, evaporationCurve: [10, 30, 60, 80, 70, 60], synergies: ['Cedarwood'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-woo-02', batchNumber: 'CED-AMB-23', lab: 'IFF', supplier: 'Vigon', purchaseDate: '2023-04-05', stockAmount: 150, costPerGram: 0.12 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 150, avgCostPerGram: 0.12 },
    { id: 'core-woo-03', name: 'Vertofix Coeur', olfactiveFamily: OlfactiveFamily.WOODY, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Base Note'], functionalRole: [FunctionalRole.FIXATIVE], casNumber: '32388-55-9', odorStrength: 4, impact: 200, scentDNA: { [ScentFacet.WOODY]: 5, [ScentFacet.LEATHERY]: 2 }, evaporationCurve: [5, 20, 50, 80, 80, 70], synergies: ['Vetiver'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2023-01-01T00:00:00Z', totalStock: 200, avgCostPerGram: 0.08 },
    { id: 'core-woo-04', name: 'Sandalore', olfactiveFamily: OlfactiveFamily.WOODY, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Base Note'], functionalRole: [FunctionalRole.FIXATIVE], casNumber: '65113-99-7', odorStrength: 6, impact: 300, scentDNA: { [ScentFacet.WOODY]: 5, [ScentFacet.CREAMY]: 4 }, evaporationCurve: [5, 15, 40, 70, 90, 85], synergies: ['Sandalwood'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-woo-04', batchNumber: 'SAN-LORE-23', lab: 'Givaudan', supplier: 'Perfumers Apprentice', purchaseDate: '2023-05-15', stockAmount: 100, costPerGram: 0.20 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 100, avgCostPerGram: 0.20 },
    { id: 'core-woo-05', name: 'Javanol', olfactiveFamily: OlfactiveFamily.WOODY, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Base Note'], functionalRole: [FunctionalRole.BOOSTER], casNumber: '198404-98-7', odorStrength: 9, impact: 400, scentDNA: { [ScentFacet.WOODY]: 5, [ScentFacet.CREAMY]: 3, [ScentFacet.METALLIC]: 1 }, evaporationCurve: [10, 30, 60, 90, 95, 90], synergies: ['Sandalwood'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-woo-05', batchNumber: 'JAV-23-01', lab: 'Givaudan', supplier: 'Creating Perfume', purchaseDate: '2023-08-01', stockAmount: 20, costPerGram: 1.50 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 20, avgCostPerGram: 1.50 },
    { id: 'core-woo-06', name: 'Patchouli Oil (Light)', olfactiveFamily: OlfactiveFamily.WOODY, origin: MoleculeOrigin.ESSENTIAL_OIL, physicalState: PhysicalState.LIQUID, roles: ['Base Note'], functionalRole: [FunctionalRole.FIXATIVE], casNumber: '8014-09-3', odorStrength: 8, impact: 350, scentDNA: { [ScentFacet.EARTHY]: 5, [ScentFacet.WOODY]: 4, [ScentFacet.CAMPHOROUS]: 2 }, evaporationCurve: [10, 30, 60, 80, 90, 85], synergies: ['Rose', 'Vanilla'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-woo-06', batchNumber: 'PAT-INDO-L', lab: 'Van Aroma', supplier: 'Vigon', purchaseDate: '2023-02-28', stockAmount: 150, costPerGram: 0.45 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 150, avgCostPerGram: 0.45 },
    { id: 'core-woo-07', name: 'Vetiver Oil (Haiti)', olfactiveFamily: OlfactiveFamily.WOODY, origin: MoleculeOrigin.ESSENTIAL_OIL, physicalState: PhysicalState.LIQUID, roles: ['Base Note'], functionalRole: [FunctionalRole.FIXATIVE], casNumber: '8016-96-4', odorStrength: 7, impact: 300, scentDNA: { [ScentFacet.EARTHY]: 5, [ScentFacet.WOODY]: 4, [ScentFacet.SMOKY]: 3 }, evaporationCurve: [10, 25, 50, 80, 85, 80], synergies: ['Grapefruit'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-woo-07', batchNumber: 'VET-HAI-23', lab: 'Robertet', supplier: 'Perfumers Apprentice', purchaseDate: '2023-06-10', stockAmount: 80, costPerGram: 0.60 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 80, avgCostPerGram: 0.60 },
    { id: 'core-woo-08', name: 'Cedarwood Oil (Virginia)', olfactiveFamily: OlfactiveFamily.WOODY, origin: MoleculeOrigin.ESSENTIAL_OIL, physicalState: PhysicalState.LIQUID, roles: ['Heart-Base Note'], functionalRole: [FunctionalRole.FIXATIVE], casNumber: '8000-27-9', odorStrength: 6, impact: 150, scentDNA: { [ScentFacet.WOODY]: 5, [ScentFacet.DRY]: 4 }, evaporationCurve: [20, 40, 70, 80, 60, 40], synergies: ['Iso E Super'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-woo-08', batchNumber: 'CED-VA-23', lab: 'Berjé', supplier: 'Creating Perfume', purchaseDate: '2023-01-05', stockAmount: 300, costPerGram: 0.18 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 300, avgCostPerGram: 0.18 },

    // MUSK (7)
    { id: 'core-msk-01', name: 'Galaxolide 50%', olfactiveFamily: OlfactiveFamily.MUSK, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Base Note'], functionalRole: [FunctionalRole.FIXATIVE, FunctionalRole.BLENDER], casNumber: '1222-05-5', odorStrength: 3, impact: 400, scentDNA: { [ScentFacet.MUSKY]: 5, [ScentFacet.CLEAN]: 4, [ScentFacet.SWEET]: 2 }, evaporationCurve: [5, 10, 30, 60, 90, 100], synergies: ['Floral'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-msk-01', batchNumber: 'GAL-50-23', lab: 'IFF', supplier: 'Vigon', purchaseDate: '2023-01-10', stockAmount: 1000, costPerGram: 0.04 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 1000, avgCostPerGram: 0.04 },
    { id: 'core-msk-02', name: 'Habanolide', olfactiveFamily: OlfactiveFamily.MUSK, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Base Note'], functionalRole: [FunctionalRole.FIXATIVE], casNumber: '111879-80-2', odorStrength: 5, impact: 350, scentDNA: { [ScentFacet.MUSKY]: 5, [ScentFacet.METALLIC]: 3, [ScentFacet.WAXY]: 2 }, evaporationCurve: [10, 20, 40, 70, 90, 95], synergies: ['Clean Notes'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-msk-02', batchNumber: 'HAB-GLB-23', lab: 'Firmenich', supplier: 'Perfumers Apprentice', purchaseDate: '2023-04-22', stockAmount: 100, costPerGram: 0.15 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 100, avgCostPerGram: 0.15 },
    { id: 'core-msk-03', name: 'Ethylene Brassylate', olfactiveFamily: OlfactiveFamily.MUSK, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Base Note'], functionalRole: [FunctionalRole.FIXATIVE], casNumber: '105-95-3', odorStrength: 4, impact: 300, scentDNA: { [ScentFacet.MUSKY]: 5, [ScentFacet.SWEET]: 3, [ScentFacet.POWDERY]: 2 }, evaporationCurve: [10, 25, 50, 80, 85, 80], synergies: ['Vanilla'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-msk-03', batchNumber: 'ETH-BRA-23', lab: 'Takasago', supplier: 'Creating Perfume', purchaseDate: '2023-05-30', stockAmount: 200, costPerGram: 0.08 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 200, avgCostPerGram: 0.08 },
    { id: 'core-msk-04', name: 'Ambrettolide', olfactiveFamily: OlfactiveFamily.MUSK, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Base Note'], functionalRole: [FunctionalRole.RADIANT], casNumber: '28645-51-4', odorStrength: 5, impact: 250, scentDNA: { [ScentFacet.MUSKY]: 5, [ScentFacet.FRUITY]: 2, [ScentFacet.RADIANT]: 4 }, evaporationCurve: [15, 30, 60, 80, 70, 60], synergies: ['Fruits', 'Florals'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-msk-04', batchNumber: 'AMB-RET-23', lab: 'Givaudan', supplier: 'Vigon', purchaseDate: '2023-07-15', stockAmount: 50, costPerGram: 0.45 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 50, avgCostPerGram: 0.45 },
    { id: 'core-msk-05', name: 'Helvetolide', olfactiveFamily: OlfactiveFamily.MUSK, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Heart-Base Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '141773-73-1', odorStrength: 6, impact: 200, scentDNA: { [ScentFacet.MUSKY]: 5, [ScentFacet.FRUITY]: 3, [ScentFacet.PEAR]: 2 }, evaporationCurve: [20, 40, 70, 80, 60, 40], synergies: ['Pear', 'Fruity'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2023-01-01T00:00:00Z', totalStock: 60, avgCostPerGram: 0.35 },
    { id: 'core-msk-06', name: 'Muscenone', olfactiveFamily: OlfactiveFamily.MUSK, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Base Note'], functionalRole: [FunctionalRole.BOOSTER], casNumber: '82356-51-2', odorStrength: 8, impact: 400, scentDNA: { [ScentFacet.MUSKY]: 5, [ScentFacet.ANIMALIC]: 2, [ScentFacet.POWDERY]: 3 }, evaporationCurve: [5, 15, 40, 70, 95, 100], synergies: ['Woody'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 10, avgCostPerGram: 2.50 },
    { id: 'core-msk-07', name: 'Exaltolide', olfactiveFamily: OlfactiveFamily.MUSK, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.POWDER_CRYSTAL, roles: ['Base Note'], functionalRole: [FunctionalRole.FIXATIVE], casNumber: '106-02-5', odorStrength: 5, impact: 350, scentDNA: { [ScentFacet.MUSKY]: 5, [ScentFacet.SWEET]: 3, [ScentFacet.ANIMALIC]: 1 }, evaporationCurve: [10, 30, 50, 80, 90, 85], synergies: ['Floral'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 100, avgCostPerGram: 0.60 },

    // AMBER (4)
    { id: 'core-amb-04', name: 'Labdanum Resinoid', olfactiveFamily: OlfactiveFamily.AMBER, origin: MoleculeOrigin.RESINOID, physicalState: PhysicalState.PASTE, roles: ['Base Note'], functionalRole: [FunctionalRole.FIXATIVE], casNumber: '8016-26-0', odorStrength: 8, impact: 500, scentDNA: { [ScentFacet.AMBER]: 5, [ScentFacet.LEATHERY]: 3, [ScentFacet.SWEET]: 3 }, evaporationCurve: [5, 10, 30, 60, 90, 100], synergies: ['Vanillin', 'Patchouli'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-amb-04', batchNumber: 'LAB-RES-23', lab: 'Biolandes', supplier: 'Perfumers Apprentice', purchaseDate: '2023-02-20', stockAmount: 50, costPerGram: 0.50 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 50, avgCostPerGram: 0.50 },
    { id: 'core-amb-06', name: 'Ambroxan', olfactiveFamily: OlfactiveFamily.AMBER, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.POWDER_CRYSTAL, roles: ['Base Note'], functionalRole: [FunctionalRole.FIXATIVE, FunctionalRole.RADIANT], casNumber: '6790-58-5', odorStrength: 7, impact: 450, scentDNA: { [ScentFacet.AMBER]: 5, [ScentFacet.WOODY]: 3, [ScentFacet.MINERAL]: 2 }, evaporationCurve: [10, 25, 55, 85, 95, 95], synergies: ['Iso E Super'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-amb-06', batchNumber: 'AMB-ROX-23', lab: 'Kao', supplier: 'Creating Perfume', purchaseDate: '2023-03-25', stockAmount: 50, costPerGram: 0.80 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 50, avgCostPerGram: 0.80 },
    { id: 'core-amb-07', name: 'Cetalox', olfactiveFamily: OlfactiveFamily.AMBER, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.POWDER_CRYSTAL, roles: ['Base Note'], functionalRole: [FunctionalRole.RADIANT], casNumber: '3738-00-9', odorStrength: 8, impact: 400, scentDNA: { [ScentFacet.AMBER]: 5, [ScentFacet.WOODY]: 2, [ScentFacet.CLEAN]: 3 }, evaporationCurve: [15, 35, 65, 85, 95, 90], synergies: ['Musk'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 25, avgCostPerGram: 1.10 },
    { id: 'core-amb-08', name: 'Ambermax', olfactiveFamily: OlfactiveFamily.AMBER, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Base Note'], functionalRole: [FunctionalRole.BOOSTER], casNumber: '113889-23-9', odorStrength: 10, impact: 480, scentDNA: { [ScentFacet.AMBER]: 5, [ScentFacet.DRY]: 4, [ScentFacet.WOODY]: 3 }, evaporationCurve: [10, 30, 60, 90, 100, 100], synergies: ['Woods'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 10, avgCostPerGram: 2.00 },

    // BALSAMIC (4)
    { id: 'core-amb-03', name: 'Coumarin', olfactiveFamily: OlfactiveFamily.BALSAMIC, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.POWDER_CRYSTAL, roles: ['Base Note'], functionalRole: [FunctionalRole.FIXATIVE], casNumber: '91-64-5', odorStrength: 7, impact: 300, scentDNA: { [ScentFacet.SWEET]: 4, [ScentFacet.HAY]: 3, [ScentFacet.POWDERY]: 3 }, evaporationCurve: [10, 30, 60, 80, 85, 80], synergies: ['Lavender', 'Vanillin'], IFRA_MAX_CONCENTRATION: 1.6, inventoryBatches: [
        { id: 'b-bal-01', batchNumber: 'COU-MAR-23', lab: 'Symrise', supplier: 'Vigon', purchaseDate: '2023-01-15', stockAmount: 200, costPerGram: 0.04 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 200, avgCostPerGram: 0.04 },
    { id: 'core-amb-05', name: 'Benzoin Resinoid (Siam)', olfactiveFamily: OlfactiveFamily.BALSAMIC, origin: MoleculeOrigin.RESINOID, physicalState: PhysicalState.PASTE, roles: ['Base Note'], functionalRole: [FunctionalRole.FIXATIVE], casNumber: '9000-72-0', odorStrength: 6, impact: 400, scentDNA: { [ScentFacet.SWEET]: 5, [ScentFacet.BALSAMIC]: 4, [ScentFacet.VANILLA]: 3 }, evaporationCurve: [10, 20, 40, 70, 90, 95], synergies: ['Labdanum'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-bal-02', batchNumber: 'BEN-SIA-23', lab: 'Biolandes', supplier: 'Perfumers Apprentice', purchaseDate: '2023-03-10', stockAmount: 60, costPerGram: 0.25 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 60, avgCostPerGram: 0.25 },
    { id: 'core-bal-01', name: 'Myrrh Oil', olfactiveFamily: OlfactiveFamily.BALSAMIC, origin: MoleculeOrigin.ESSENTIAL_OIL, physicalState: PhysicalState.LIQUID, roles: ['Base Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '8016-37-3', odorStrength: 7, impact: 350, scentDNA: { [ScentFacet.BALSAMIC]: 5, [ScentFacet.SPICY]: 3, [ScentFacet.MUSHROOM]: 2 }, evaporationCurve: [15, 35, 65, 85, 90, 85], synergies: ['Frankincense'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 30, avgCostPerGram: 0.90 },
    { id: 'core-bal-02', name: 'Peru Balsam', olfactiveFamily: OlfactiveFamily.BALSAMIC, origin: MoleculeOrigin.RESIN, physicalState: PhysicalState.PASTE, roles: ['Base Note'], functionalRole: [FunctionalRole.FIXATIVE], casNumber: '8007-00-9', odorStrength: 8, impact: 450, scentDNA: { [ScentFacet.BALSAMIC]: 5, [ScentFacet.VANILLA]: 3, [ScentFacet.SMOKY]: 2 }, evaporationCurve: [5, 15, 45, 75, 95, 100], synergies: ['Vanilla'], IFRA_MAX_CONCENTRATION: 0.4, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 50, avgCostPerGram: 0.40 },

    // GOURMAND (5)
    { id: 'core-amb-01', name: 'Vanillin', olfactiveFamily: OlfactiveFamily.GOURMAND, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.POWDER_CRYSTAL, roles: ['Base Note'], functionalRole: [FunctionalRole.SWEETENER], casNumber: '121-33-5', odorStrength: 8, impact: 400, scentDNA: { [ScentFacet.SWEET]: 5, [ScentFacet.CREAMY]: 4, [ScentFacet.VANILLA]: 5 }, evaporationCurve: [10, 20, 50, 80, 95, 100], synergies: ['Coumarin'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-gou-01', batchNumber: 'VAN-SYN-23', lab: 'Solvay', supplier: 'Vigon', purchaseDate: '2023-01-25', stockAmount: 500, costPerGram: 0.03 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 500, avgCostPerGram: 0.03 },
    { id: 'core-amb-02', name: 'Ethyl Vanillin', olfactiveFamily: OlfactiveFamily.GOURMAND, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.POWDER_CRYSTAL, roles: ['Base Note'], functionalRole: [FunctionalRole.SWEETENER], casNumber: '121-32-4', odorStrength: 10, impact: 400, scentDNA: { [ScentFacet.SWEET]: 5, [ScentFacet.CREAMY]: 4, [ScentFacet.VANILLA]: 5 }, evaporationCurve: [10, 20, 50, 80, 95, 100], synergies: ['Vanillin'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-gou-02', batchNumber: 'ETH-VAN-23', lab: 'Solvay', supplier: 'Perfumers Apprentice', purchaseDate: '2023-04-12', stockAmount: 100, costPerGram: 0.05 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 100, avgCostPerGram: 0.05 },
    { id: 'core-gou-01', name: 'Ethyl Maltol', olfactiveFamily: OlfactiveFamily.GOURMAND, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.POWDER_CRYSTAL, roles: ['Heart-Base Note'], functionalRole: [FunctionalRole.SWEETENER], casNumber: '4940-11-8', odorStrength: 10, impact: 300, scentDNA: { [ScentFacet.SWEET]: 5, [ScentFacet.CARAMELIC]: 5, [ScentFacet.FRUITY]: 3 }, evaporationCurve: [20, 40, 70, 90, 80, 70], synergies: ['Fruits'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 100, avgCostPerGram: 0.06 },
    { id: 'core-gou-02', name: 'Cocoa Extract', olfactiveFamily: OlfactiveFamily.GOURMAND, origin: MoleculeOrigin.ABSOLUTE, physicalState: PhysicalState.PASTE, roles: ['Heart-Base Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '84649-99-0', odorStrength: 7, impact: 250, scentDNA: { [ScentFacet.SWEET]: 4, [ScentFacet.EARTHY]: 3, [ScentFacet.DUSTY]: 2 }, evaporationCurve: [15, 35, 65, 80, 70, 60], synergies: ['Vanilla'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 20, avgCostPerGram: 1.50 },
    { id: 'core-gou-03', name: 'Acetyl Pyrazine', olfactiveFamily: OlfactiveFamily.GOURMAND, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.POWDER_CRYSTAL, roles: ['Heart Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '22047-25-2', odorStrength: 10, impact: 100, scentDNA: { [ScentFacet.SWEET]: 3, [ScentFacet.DRY]: 4, [ScentFacet.EARTHY]: 2 }, evaporationCurve: [40, 70, 80, 50, 20, 0], synergies: ['Coffee'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 10, avgCostPerGram: 2.00 },

    // GREEN (5)
    { id: 'core-grn-01', name: 'Cis-3-Hexenol', olfactiveFamily: OlfactiveFamily.GREEN, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '928-96-1', odorStrength: 9, impact: 1, scentDNA: { [ScentFacet.GREEN]: 5, [ScentFacet.FRESH]: 4, [ScentFacet.LEAFY]: 4 }, evaporationCurve: [100, 10, 0, 0, 0, 0], synergies: ['Triplal'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-grn-01', batchNumber: 'C3H-23-01', lab: 'Zeon', supplier: 'Creating Perfume', purchaseDate: '2023-05-01', stockAmount: 50, costPerGram: 0.30 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 50, avgCostPerGram: 0.30 },
    { id: 'core-grn-02', name: 'Galbanum Oil', olfactiveFamily: OlfactiveFamily.GREEN, origin: MoleculeOrigin.ESSENTIAL_OIL, physicalState: PhysicalState.LIQUID, roles: ['Top-Heart Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '8023-91-4', odorStrength: 9, impact: 6, scentDNA: { [ScentFacet.GREEN]: 5, [ScentFacet.EARTHY]: 3, [ScentFacet.SHARP]: 4 }, evaporationCurve: [100, 70, 30, 5, 0, 0], synergies: ['Hyacinth'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-grn-02', batchNumber: 'GAL-OIL-23', lab: 'Biolandes', supplier: 'Vigon', purchaseDate: '2023-06-20', stockAmount: 20, costPerGram: 1.20 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 20, avgCostPerGram: 1.20 },
    { id: 'core-grn-03', name: 'Triplal', olfactiveFamily: OlfactiveFamily.GREEN, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.BOOSTER], casNumber: '68039-49-6', odorStrength: 8, impact: 2, scentDNA: { [ScentFacet.GREEN]: 5, [ScentFacet.ZESTY]: 3, [ScentFacet.SHARP]: 3 }, evaporationCurve: [100, 40, 10, 0, 0, 0], synergies: ['Citrus'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 50, avgCostPerGram: 0.15 },
    { id: 'core-grn-04', name: 'Stemone', olfactiveFamily: OlfactiveFamily.GREEN, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Top-Heart Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '22457-23-4', odorStrength: 7, impact: 8, scentDNA: { [ScentFacet.GREEN]: 5, [ScentFacet.LEAFY]: 4, [ScentFacet.FRUITY]: 2 }, evaporationCurve: [80, 60, 20, 5, 0, 0], synergies: ['Fig'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 40, avgCostPerGram: 0.20 },
    { id: 'core-grn-05', name: 'Violet Leaf Absolute', olfactiveFamily: OlfactiveFamily.GREEN, origin: MoleculeOrigin.ABSOLUTE, physicalState: PhysicalState.PASTE, roles: ['Heart Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '8024-08-6', odorStrength: 9, impact: 24, scentDNA: { [ScentFacet.GREEN]: 5, [ScentFacet.EARTHY]: 3, [ScentFacet.AQUATIC]: 2 }, evaporationCurve: [40, 70, 50, 20, 5, 0], synergies: ['Ionones'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 10, avgCostPerGram: 3.50 },

    // AQUATIC (4)
    { id: 'core-mar-01', name: 'Calone 1951', olfactiveFamily: OlfactiveFamily.AQUATIC, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.POWDER_CRYSTAL, roles: ['Heart Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '28940-11-6', odorStrength: 9, impact: 24, scentDNA: { [ScentFacet.MARINE]: 5, [ScentFacet.OZONIC]: 4, [ScentFacet.FRESH]: 3 }, evaporationCurve: [30, 70, 80, 40, 10, 0], synergies: ['Citrus'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-aqu-01', batchNumber: 'CAL-1951-23', lab: 'Symrise', supplier: 'Perfumers Apprentice', purchaseDate: '2023-04-01', stockAmount: 30, costPerGram: 0.40 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 30, avgCostPerGram: 0.40 },
    { id: 'core-mar-02', name: 'Melonal', olfactiveFamily: OlfactiveFamily.AQUATIC, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '106-72-9', odorStrength: 8, impact: 6, scentDNA: { [ScentFacet.MARINE]: 4, [ScentFacet.FRUITY]: 4, [ScentFacet.FRESH]: 3 }, evaporationCurve: [90, 50, 10, 0, 0, 0], synergies: ['Melon'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 40, avgCostPerGram: 0.25 },
    { id: 'core-mar-03', name: 'Ultrazur', olfactiveFamily: OlfactiveFamily.AQUATIC, origin: MoleculeOrigin.BASE, physicalState: PhysicalState.LIQUID, roles: ['Heart-Base Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '', odorStrength: 7, impact: 48, scentDNA: { [ScentFacet.MARINE]: 5, [ScentFacet.OZONIC]: 3, [ScentFacet.CLEAN]: 3 }, evaporationCurve: [20, 50, 70, 60, 40, 20], synergies: ['Floral'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 50, avgCostPerGram: 0.35 },
    { id: 'core-mar-04', name: 'Helional', olfactiveFamily: OlfactiveFamily.AQUATIC, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Heart Note'], functionalRole: [FunctionalRole.BLENDER], casNumber: '1205-17-0', odorStrength: 5, impact: 20, scentDNA: { [ScentFacet.MARINE]: 3, [ScentFacet.FLORAL]: 3, [ScentFacet.GREEN]: 2 }, evaporationCurve: [40, 60, 70, 30, 5, 0], synergies: ['Floral'], IFRA_MAX_CONCENTRATION: 5.3, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 80, avgCostPerGram: 0.12 },

    // SPICY (6)
    { id: 'core-spi-01', name: 'Eugenol', olfactiveFamily: OlfactiveFamily.SPICY, origin: MoleculeOrigin.NATURAL_ISOLATE, physicalState: PhysicalState.LIQUID, roles: ['Heart Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '97-53-0', odorStrength: 7, impact: 8, scentDNA: { [ScentFacet.SPICY]: 5, [ScentFacet.WARM]: 4, [ScentFacet.SWEET]: 1 }, evaporationCurve: [40, 70, 50, 10, 0, 0], synergies: ['Rose', 'Carnation'], IFRA_MAX_CONCENTRATION: 0.5, inventoryBatches: [
        { id: 'b-spi-01', batchNumber: 'EUG-NAT-23', lab: 'Berjé', supplier: 'Vigon', purchaseDate: '2023-01-15', stockAmount: 100, costPerGram: 0.06 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 100, avgCostPerGram: 0.06 },
    { id: 'core-spi-02', name: 'Cardamom Oil', olfactiveFamily: OlfactiveFamily.SPICY, origin: MoleculeOrigin.ESSENTIAL_OIL, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '8000-66-6', odorStrength: 8, impact: 3, scentDNA: { [ScentFacet.SPICY]: 5, [ScentFacet.FRESH]: 4, [ScentFacet.CITRUS]: 2 }, evaporationCurve: [100, 60, 20, 5, 0, 0], synergies: ['Citrus', 'Woody'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-spi-02', batchNumber: 'CAR-OIL-23', lab: 'Laboratoire Monique Remy', supplier: 'Perfumers Apprentice', purchaseDate: '2023-05-10', stockAmount: 30, costPerGram: 1.80 }
    ], createdAt: '2023-01-01T00:00:00Z', totalStock: 30, avgCostPerGram: 1.80 },
    { id: 'core-spi-03', name: 'Pink Pepper Oil', olfactiveFamily: OlfactiveFamily.SPICY, origin: MoleculeOrigin.ESSENTIAL_OIL, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.BOOSTER], casNumber: '949495-68-5', odorStrength: 7, impact: 3, scentDNA: { [ScentFacet.SPICY]: 5, [ScentFacet.ZESTY]: 3, [ScentFacet.WOODY]: 1 }, evaporationCurve: [100, 50, 10, 0, 0, 0], synergies: ['Rose', 'Incense'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2023-01-01T00:00:00Z', totalStock: 40, avgCostPerGram: 1.50 },
    { id: 'core-spi-04', name: 'Cinnamal', olfactiveFamily: OlfactiveFamily.SPICY, origin: MoleculeOrigin.NATURAL_ISOLATE, physicalState: PhysicalState.LIQUID, roles: ['Heart Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '104-55-2', odorStrength: 9, impact: 12, scentDNA: { [ScentFacet.SPICY]: 5, [ScentFacet.WARM]: 4, [ScentFacet.SWEET]: 3 }, evaporationCurve: [30, 60, 50, 20, 5, 0], synergies: ['Gourmand'], IFRA_MAX_CONCENTRATION: 0.05, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 50, avgCostPerGram: 0.08 },
    { id: 'core-spi-05', name: 'Nutmeg Oil', olfactiveFamily: OlfactiveFamily.SPICY, origin: MoleculeOrigin.ESSENTIAL_OIL, physicalState: PhysicalState.LIQUID, roles: ['Top-Heart Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '8008-45-5', odorStrength: 6, impact: 6, scentDNA: { [ScentFacet.SPICY]: 5, [ScentFacet.WOODY]: 3, [ScentFacet.DRY]: 2 }, evaporationCurve: [80, 50, 20, 5, 0, 0], synergies: ['Woods'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 40, avgCostPerGram: 0.70 },
    { id: 'core-spi-06', name: 'Black Pepper Oil', olfactiveFamily: OlfactiveFamily.SPICY, origin: MoleculeOrigin.ESSENTIAL_OIL, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.BOOSTER], casNumber: '8006-82-4', odorStrength: 8, impact: 4, scentDNA: { [ScentFacet.SPICY]: 5, [ScentFacet.FRESH]: 3, [ScentFacet.WOODY]: 2 }, evaporationCurve: [90, 40, 10, 0, 0, 0], synergies: ['Citrus'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 50, avgCostPerGram: 0.80 },

    // ALDEHYDIC (4)
    { id: 'core-ald-01', name: 'Aldehyde C-10 (Decanal)', olfactiveFamily: OlfactiveFamily.ALDEHYDIC, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.BOOSTER], casNumber: '112-31-2', odorStrength: 9, impact: 4, scentDNA: { [ScentFacet.ALDEHYDIC]: 5, [ScentFacet.CITRUS]: 3, [ScentFacet.WAXY]: 3 }, evaporationCurve: [100, 60, 20, 5, 0, 0], synergies: ['Orange'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2023-01-01T00:00:00Z', totalStock: 50, avgCostPerGram: 0.10 },
    { id: 'core-ald-02', name: 'Aldehyde C-11 (Undecylenic)', olfactiveFamily: OlfactiveFamily.ALDEHYDIC, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.BOOSTER], casNumber: '112-45-8', odorStrength: 9, impact: 5, scentDNA: { [ScentFacet.ALDEHYDIC]: 5, [ScentFacet.FRESH]: 3, [ScentFacet.ROSY]: 2 }, evaporationCurve: [95, 65, 25, 5, 0, 0], synergies: ['Rose'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2023-01-01T00:00:00Z', totalStock: 50, avgCostPerGram: 0.12 },
    { id: 'core-ald-03', name: 'Aldehyde C-12 MNA', olfactiveFamily: OlfactiveFamily.ALDEHYDIC, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Top-Heart Note'], functionalRole: [FunctionalRole.BOOSTER], casNumber: '110-41-8', odorStrength: 10, impact: 12, scentDNA: { [ScentFacet.ALDEHYDIC]: 5, [ScentFacet.AMBER]: 2, [ScentFacet.METALLIC]: 3 }, evaporationCurve: [80, 80, 40, 10, 0, 0], synergies: ['Pine', 'Incense'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2023-01-01T00:00:00Z', totalStock: 50, avgCostPerGram: 0.15 },
    { id: 'core-ald-04', name: 'Aldehyde C-12 Lauric', olfactiveFamily: OlfactiveFamily.ALDEHYDIC, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.BOOSTER], casNumber: '112-54-9', odorStrength: 8, impact: 8, scentDNA: { [ScentFacet.ALDEHYDIC]: 5, [ScentFacet.SOAPY]: 4, [ScentFacet.WAXY]: 3 }, evaporationCurve: [80, 60, 30, 5, 0, 0], synergies: ['Floral'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 60, avgCostPerGram: 0.11 },

    // FRUITY (5)
    { id: 'core-fru-01', name: 'Allyl Amyl Glycolate', olfactiveFamily: OlfactiveFamily.FRUITY, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '67634-00-8', odorStrength: 8, impact: 3, scentDNA: { [ScentFacet.PINEAPPLE]: 5, [ScentFacet.GREEN]: 3, [ScentFacet.METALLIC]: 2 }, evaporationCurve: [100, 50, 10, 0, 0, 0], synergies: ['Galbanum'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 50, avgCostPerGram: 0.18 },
    { id: 'core-fru-02', name: 'Verdox', olfactiveFamily: OlfactiveFamily.FRUITY, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Top-Heart Note'], functionalRole: [FunctionalRole.BLENDER], casNumber: '88-41-5', odorStrength: 6, impact: 6, scentDNA: { [ScentFacet.FRUITY]: 5, [ScentFacet.GREEN]: 3, [ScentFacet.WOODY]: 2 }, evaporationCurve: [90, 60, 20, 5, 0, 0], synergies: ['Apple'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 100, avgCostPerGram: 0.09 },
    { id: 'core-fru-03', name: 'Raspberry Ketone', olfactiveFamily: OlfactiveFamily.FRUITY, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.POWDER_CRYSTAL, roles: ['Base Note'], functionalRole: [FunctionalRole.SWEETENER], casNumber: '5471-51-2', odorStrength: 7, impact: 200, scentDNA: { [ScentFacet.FRUITY]: 5, [ScentFacet.SWEET]: 4, [ScentFacet.JAMMY]: 3 }, evaporationCurve: [10, 30, 60, 80, 80, 70], synergies: ['Floral'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 50, avgCostPerGram: 0.40 },
    { id: 'core-fru-04', name: 'Gamma Undecalactone', olfactiveFamily: OlfactiveFamily.FRUITY, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Heart Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '104-67-6', odorStrength: 7, impact: 12, scentDNA: { [ScentFacet.FRUITY]: 5, [ScentFacet.CREAMY]: 3, [ScentFacet.WAXY]: 2 }, evaporationCurve: [30, 60, 50, 10, 0, 0], synergies: ['Peach'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 80, avgCostPerGram: 0.12 },
    { id: 'core-fru-05', name: 'Damascone Beta', olfactiveFamily: OlfactiveFamily.FRUITY, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Heart Note'], functionalRole: [FunctionalRole.BOOSTER], casNumber: '23726-91-2', odorStrength: 9, impact: 24, scentDNA: { [ScentFacet.FRUITY]: 5, [ScentFacet.ROSY]: 4, [ScentFacet.JAMMY]: 3 }, evaporationCurve: [40, 70, 60, 20, 5, 0], synergies: ['Rose'], IFRA_MAX_CONCENTRATION: 0.02, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 20, avgCostPerGram: 0.80 },

    // AROMATIC (5)
    { id: 'core-aro-01', name: 'Lavender Oil (France)', olfactiveFamily: OlfactiveFamily.AROMATIC, origin: MoleculeOrigin.ESSENTIAL_OIL, physicalState: PhysicalState.LIQUID, roles: ['Top-Heart Note'], functionalRole: [FunctionalRole.BLENDER], casNumber: '8000-28-0', odorStrength: 6, impact: 6, scentDNA: { [ScentFacet.HERBAL]: 5, [ScentFacet.FRESH]: 4, [ScentFacet.FLORAL]: 3 }, evaporationCurve: [90, 70, 30, 5, 0, 0], synergies: ['Coumarin'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-aro-01', batchNumber: 'LAV-FR-23', lab: 'Biolandes', supplier: 'Creating Perfume', purchaseDate: '2023-06-01', stockAmount: 100, costPerGram: 0.30 }
    ], createdAt: '2024-01-01T00:00:00Z', totalStock: 100, avgCostPerGram: 0.30 },
    { id: 'core-aro-02', name: 'Dihydromyrcenol', olfactiveFamily: OlfactiveFamily.AROMATIC, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.FRESHENER], casNumber: '18479-58-8', odorStrength: 7, impact: 4, scentDNA: { [ScentFacet.FRESH]: 5, [ScentFacet.CITRUS]: 3, [ScentFacet.CLEAN]: 3 }, evaporationCurve: [100, 50, 10, 0, 0, 0], synergies: ['Lavender'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-aro-02', batchNumber: 'DHM-SYN-23', lab: 'IFF', supplier: 'Vigon', purchaseDate: '2023-01-20', stockAmount: 200, costPerGram: 0.05 }
    ], createdAt: '2024-01-01T00:00:00Z', totalStock: 200, avgCostPerGram: 0.05 },
    { id: 'core-aro-03', name: 'Rosemary Oil', olfactiveFamily: OlfactiveFamily.AROMATIC, origin: MoleculeOrigin.ESSENTIAL_OIL, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '8000-25-7', odorStrength: 7, impact: 3, scentDNA: { [ScentFacet.HERBAL]: 5, [ScentFacet.CAMPHOROUS]: 4, [ScentFacet.FRESH]: 3 }, evaporationCurve: [100, 40, 10, 0, 0, 0], synergies: ['Citrus'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-aro-03', batchNumber: 'ROS-OIL-23', lab: 'Berjé', supplier: 'Perfumers Apprentice', purchaseDate: '2023-03-12', stockAmount: 50, costPerGram: 0.40 }
    ], createdAt: '2024-01-01T00:00:00Z', totalStock: 50, avgCostPerGram: 0.40 },
    { id: 'core-aro-04', name: 'Menthol', olfactiveFamily: OlfactiveFamily.AROMATIC, origin: MoleculeOrigin.NATURAL_ISOLATE, physicalState: PhysicalState.POWDER_CRYSTAL, roles: ['Top Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '89-78-1', odorStrength: 8, impact: 2, scentDNA: { [ScentFacet.MINTY]: 5, [ScentFacet.ICY]: 5, [ScentFacet.FRESH]: 4 }, evaporationCurve: [100, 30, 0, 0, 0, 0], synergies: ['Mint'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 50, avgCostPerGram: 0.10 },
    { id: 'core-aro-05', name: 'Eucalyptol', olfactiveFamily: OlfactiveFamily.AROMATIC, origin: MoleculeOrigin.NATURAL_ISOLATE, physicalState: PhysicalState.LIQUID, roles: ['Top Note'], functionalRole: [FunctionalRole.FRESHENER], casNumber: '470-82-6', odorStrength: 8, impact: 3, scentDNA: { [ScentFacet.CAMPHOROUS]: 5, [ScentFacet.FRESH]: 4, [ScentFacet.MINTY]: 2 }, evaporationCurve: [100, 45, 10, 0, 0, 0], synergies: ['Lavender'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-03-01T00:00:00Z', totalStock: 45, avgCostPerGram: 0.12 },

    // MOSSY (4)
    { id: 'core-mos-01', name: 'Oakmoss Absolute (Low Atranol)', olfactiveFamily: OlfactiveFamily.MOSSY, origin: MoleculeOrigin.ABSOLUTE, physicalState: PhysicalState.PASTE, roles: ['Base Note'], functionalRole: [FunctionalRole.FIXATIVE], casNumber: '9000-50-4', odorStrength: 8, impact: 350, scentDNA: { [ScentFacet.MOSSY]: 5, [ScentFacet.EARTHY]: 4, [ScentFacet.MARINE]: 2 }, evaporationCurve: [5, 20, 50, 80, 90, 95], synergies: ['Chypre'], IFRA_MAX_CONCENTRATION: 0.1, inventoryBatches: [
        { id: 'b-mos-01', batchNumber: 'OAK-LOW-23', lab: 'Biolandes', supplier: 'Creating Perfume', purchaseDate: '2023-02-14', stockAmount: 30, costPerGram: 1.20 }
    ], createdAt: '2024-01-01T00:00:00Z', totalStock: 30, avgCostPerGram: 1.20 },
    { id: 'core-mos-02', name: 'Evernyl (Veramoss)', olfactiveFamily: OlfactiveFamily.MOSSY, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.POWDER_CRYSTAL, roles: ['Base Note'], functionalRole: [FunctionalRole.FIXATIVE], casNumber: '4707-47-5', odorStrength: 6, impact: 300, scentDNA: { [ScentFacet.MOSSY]: 5, [ScentFacet.SWEET]: 3, [ScentFacet.DRY]: 2 }, evaporationCurve: [10, 30, 60, 80, 85, 80], synergies: ['Woods'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [
        { id: 'b-mos-02', batchNumber: 'VER-MOS-23', lab: 'IFF', supplier: 'Vigon', purchaseDate: '2023-04-30', stockAmount: 100, costPerGram: 0.10 }
    ], createdAt: '2024-01-01T00:00:00Z', totalStock: 100, avgCostPerGram: 0.10 },
    { id: 'core-mos-03', name: 'Tree Moss Absolute', olfactiveFamily: OlfactiveFamily.MOSSY, origin: MoleculeOrigin.ABSOLUTE, physicalState: PhysicalState.PASTE, roles: ['Base Note'], functionalRole: [FunctionalRole.FIXATIVE], casNumber: '90028-67-4', odorStrength: 7, impact: 320, scentDNA: { [ScentFacet.MOSSY]: 5, [ScentFacet.WOODY]: 4, [ScentFacet.RESINOUS]: 2 }, evaporationCurve: [10, 25, 55, 85, 90, 85], synergies: ['Fougère'], IFRA_MAX_CONCENTRATION: 0.1, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 20, avgCostPerGram: 1.00 },
    { id: 'core-mos-04', name: 'Terranol', olfactiveFamily: OlfactiveFamily.MOSSY, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: ['Heart-Base Note'], functionalRole: [FunctionalRole.MODIFIER], casNumber: '119205-39-9', odorStrength: 9, impact: 150, scentDNA: { [ScentFacet.MOSSY]: 5, [ScentFacet.EARTHY]: 4, [ScentFacet.GREEN]: 3 }, evaporationCurve: [20, 50, 80, 60, 30, 10], synergies: ['Patchouli'], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-03-01T00:00:00Z', totalStock: 15, avgCostPerGram: 0.90 },

    // SOLVENTS (4)
    { id: 'solv-001', name: 'Ethanol (SDA 40B)', olfactiveFamily: OlfactiveFamily.SOLVENT, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: [], functionalRole: [FunctionalRole.SOLVENT], casNumber: '64-17-5', odorStrength: 1, impact: 1, scentDNA: {}, evaporationCurve: [], synergies: [], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2023-01-01T00:00:00Z', totalStock: 5000, avgCostPerGram: 0.01 },
    { id: 'solv-002', name: 'Dipropylene Glycol (DPG)', olfactiveFamily: OlfactiveFamily.SOLVENT, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: [], functionalRole: [FunctionalRole.SOLVENT], casNumber: '25265-71-8', odorStrength: 0, impact: 0, scentDNA: {}, evaporationCurve: [], synergies: [], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2023-01-01T00:00:00Z', totalStock: 2000, avgCostPerGram: 0.02 },
    { id: 'solv-003', name: 'Isopropyl Myristate (IPM)', olfactiveFamily: OlfactiveFamily.SOLVENT, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: [], functionalRole: [FunctionalRole.SOLVENT], casNumber: '110-27-0', odorStrength: 0, impact: 0, scentDNA: {}, evaporationCurve: [], synergies: [], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2023-01-01T00:00:00Z', totalStock: 1000, avgCostPerGram: 0.02 },
    { id: 'solv-004', name: 'Diethyl Phthalate (DEP)', olfactiveFamily: OlfactiveFamily.SOLVENT, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.LIQUID, roles: [], functionalRole: [FunctionalRole.SOLVENT], casNumber: '84-66-2', odorStrength: 0, impact: 0, scentDNA: {}, evaporationCurve: [], synergies: [], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 500, avgCostPerGram: 0.02 },

    // ADDITIVES (4)
    { id: 'add-001', name: 'BHT (Antioxidant)', olfactiveFamily: OlfactiveFamily.ADDITIVE, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.POWDER_CRYSTAL, roles: [], functionalRole: [FunctionalRole.ANTIOXIDANT], casNumber: '128-37-0', odorStrength: 0, impact: 0, scentDNA: {}, evaporationCurve: [], synergies: [], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 100, avgCostPerGram: 0.05 },
    { id: 'add-002', name: 'UV Filter (Avobenzone)', olfactiveFamily: OlfactiveFamily.ADDITIVE, origin: MoleculeOrigin.SYNTHETIC, physicalState: PhysicalState.POWDER_CRYSTAL, roles: [], functionalRole: [FunctionalRole.STABILIZER], casNumber: '70356-09-1', odorStrength: 0, impact: 0, scentDNA: {}, evaporationCurve: [], synergies: [], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 50, avgCostPerGram: 0.15 },
    { id: 'add-003', name: 'Vitamin E (Tocopherol)', olfactiveFamily: OlfactiveFamily.ADDITIVE, origin: MoleculeOrigin.NATURAL, physicalState: PhysicalState.LIQUID, roles: [], functionalRole: [FunctionalRole.ANTIOXIDANT], casNumber: '10191-41-0', odorStrength: 0, impact: 0, scentDNA: {}, evaporationCurve: [], synergies: [], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-01-01T00:00:00Z', totalStock: 50, avgCostPerGram: 0.20 },
    { id: 'add-004', name: 'Ascorbic Acid (Vitamin C)', olfactiveFamily: OlfactiveFamily.ADDITIVE, origin: MoleculeOrigin.NATURAL_ISOLATE, physicalState: PhysicalState.POWDER_CRYSTAL, roles: [], functionalRole: [FunctionalRole.ANTIOXIDANT], casNumber: '50-81-7', odorStrength: 0, impact: 0, scentDNA: {}, evaporationCurve: [], synergies: [], IFRA_MAX_CONCENTRATION: 100, inventoryBatches: [], createdAt: '2024-03-01T00:00:00Z', totalStock: 25, avgCostPerGram: 0.10 },
];

export const MOCK_USER_MOLECULES: Molecule[] = [];

export const MOCK_USER_FORMULAS: Formula[] = [
    {
        id: 'formula-001',
        name: 'Summer Citrus',
        unit: 'weight',
        finalDilution: 15,
        productType: ProductType.FINE_FRAGRANCE,
        ingredients: [
            { moleculeId: 'core-cit-01', myDilution: 100, amount: 30 }, // Bergamot
            { moleculeId: 'core-cit-02', myDilution: 100, amount: 20 }, // Lemon
            { moleculeId: 'core-flo-01', myDilution: 100, amount: 15 }, // Hedione
            { moleculeId: 'core-woo-01', myDilution: 100, amount: 25 }, // Iso E Super
            { moleculeId: 'core-msk-01', myDilution: 100, amount: 10 }  // Galaxolide
        ],
        createdAt: '2023-11-15T10:00:00Z',
        mood: OlfactiveFamily.CITRUS,
        notes: 'A fresh, radiant citrus blend with a woody backbone.'
    },
    {
        id: 'formula-002',
        name: 'Modern Barber',
        unit: 'weight',
        finalDilution: 12,
        productType: ProductType.FINE_FRAGRANCE,
        ingredients: [
            { moleculeId: 'core-flo-02', myDilution: 100, amount: 15 }, // Linalool (Lavender facet)
            { moleculeId: 'core-amb-03', myDilution: 100, amount: 5 },  // Coumarin
            { moleculeId: 'core-woo-07', myDilution: 100, amount: 10 }, // Vetiver
            { moleculeId: 'core-cit-01', myDilution: 100, amount: 20 }, // Bergamot
            { moleculeId: 'core-woo-02', myDilution: 100, amount: 40 }, // Cedramber
            { moleculeId: 'core-amb-06', myDilution: 100, amount: 10 }  // Ambroxan
        ],
        createdAt: '2023-12-05T14:20:00Z',
        mood: OlfactiveFamily.AROMATIC,
        notes: 'A contemporary twist on the classic Fougère.'
    },
    {
        id: 'formula-003',
        name: 'Velvet Rose',
        unit: 'weight',
        finalDilution: 18,
        productType: ProductType.FINE_FRAGRANCE,
        ingredients: [
            { moleculeId: 'core-flo-04', myDilution: 100, amount: 30 }, // Citronellol
            { moleculeId: 'core-flo-03', myDilution: 100, amount: 15 }, // Geraniol
            { moleculeId: 'core-flo-05', myDilution: 100, amount: 25 }, // PEA
            { moleculeId: 'core-woo-06', myDilution: 100, amount: 10 }, // Patchouli
            { moleculeId: 'core-amb-04', myDilution: 100, amount: 5 },  // Labdanum
            { moleculeId: 'core-amb-01', myDilution: 100, amount: 15 }  // Vanillin
        ],
        createdAt: '2024-01-20T09:15:00Z',
        mood: OlfactiveFamily.FLORAL,
        notes: 'Deep, jammy rose with an oriental base.'
    },
    {
        id: 'formula-004',
        name: 'Marine Breeze',
        unit: 'weight',
        finalDilution: 10,
        productType: ProductType.FINE_FRAGRANCE,
        ingredients: [
            { moleculeId: 'core-mar-01', myDilution: 10, amount: 5 },   // Calone
            { moleculeId: 'core-cit-02', myDilution: 100, amount: 20 }, // Lemon
            { moleculeId: 'core-flo-01', myDilution: 100, amount: 30 }, // Hedione
            { moleculeId: 'core-msk-02', myDilution: 100, amount: 25 }, // Habanolide
            { moleculeId: 'core-amb-06', myDilution: 100, amount: 20 }  // Ambroxan
        ],
        createdAt: '2024-02-10T11:00:00Z',
        mood: OlfactiveFamily.AQUATIC,
        notes: 'Simple, fresh aquatic cologne.'
    },
    {
        id: 'formula-005',
        name: 'Spiced Wood',
        unit: 'weight',
        finalDilution: 20,
        productType: ProductType.CANDLE,
        ingredients: [
            { moleculeId: 'core-woo-08', myDilution: 100, amount: 40 }, // Cedarwood
            { moleculeId: 'core-spi-01', myDilution: 100, amount: 10 }, // Eugenol
            { moleculeId: 'core-spi-02', myDilution: 100, amount: 5 },  // Cardamom
            { moleculeId: 'core-amb-01', myDilution: 100, amount: 10 }, // Vanillin
            { moleculeId: 'core-woo-03', myDilution: 100, amount: 35 }  // Vertofix
        ],
        createdAt: '2024-03-01T15:00:00Z',
        mood: OlfactiveFamily.WOODY,
        notes: 'Warm, cozy woody spice for candles.'
    },
    {
        id: 'formula-006',
        name: 'Fig & Tea',
        unit: 'weight',
        finalDilution: 12,
        productType: ProductType.AIR_FRESHENER,
        ingredients: [
            { moleculeId: 'core-grn-04', myDilution: 100, amount: 15 }, // Stemone (Fig)
            { moleculeId: 'core-flo-01', myDilution: 100, amount: 30 }, // Hedione (Tea/Jasmine)
            { moleculeId: 'core-woo-01', myDilution: 100, amount: 35 }, // Iso E Super
            { moleculeId: 'core-msk-01', myDilution: 100, amount: 15 }, // Galaxolide
            { moleculeId: 'core-grn-01', myDilution: 100, amount: 5 }   // Cis-3-Hexenol
        ],
        createdAt: '2024-03-20T08:00:00Z',
        mood: OlfactiveFamily.GREEN,
        notes: 'Fresh, green fig leaf accord with a transparent tea background.'
    }
];

export const MOCK_USER_NOTES: ScentNote[] = [
    { id: 'note-001', moleculeId: 'core-cit-01', text: 'Classic Earl Grey tea nuance. Very elegant top note.', createdAt: '2023-11-10T10:00:00Z' },
    { id: 'note-002', moleculeId: 'core-woo-01', text: 'Transparent woody velvet. Magical effect on diffusion.', createdAt: '2023-11-12T14:30:00Z' },
    { id: 'note-003', moleculeId: 'core-grn-01', text: 'Smells exactly like fresh cut grass. Powerful!', createdAt: '2024-01-05T09:15:00Z' }
];

export const MOCK_WISHLIST: WishlistItem[] = [
    { id: 'wish-001', name: 'Suederal LT', note: 'For leather accords' },
    { id: 'wish-002', name: 'Cashmeran', note: 'Musky woody spicy note' },
    { id: 'wish-003', name: 'Methyl Pamplemousse', note: 'Modern grapefruit' }
];

export const MOCK_MOLECULE_RESOURCES: MoleculeResource[] = [];
