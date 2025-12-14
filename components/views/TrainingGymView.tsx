
import React, { useState, useMemo, useEffect } from 'react';
import { Molecule, OlfactiveFamily, ScentFacet } from '../../types';
import ScentDNARadarChart from '../charts/ScentDNARadarChart';
import { CATEGORY_HEX_COLORS } from '../../constants';

interface TrainingGymViewProps {
    molecules: Molecule[];
}

type Difficulty = 'Student' | 'Pro' | 'Nose';
type Mode = 'flashcard' | 'quiz';

interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: Difficulty;
}

interface ConceptCard {
    type: 'concept';
    id: string;
    title: string;
    category: 'Synonym' | 'Comparison' | 'Synergy' | 'History' | 'Theory' | 'Accord';
    frontText: string;
    backContent: {
        title: string;
        items: string[];
        footer?: string;
        insight?: string;
    };
}

const CONCEPT_CARDS: ConceptCard[] = [
    {
        type: 'concept',
        id: 'concept-pyramid',
        title: 'The Olfactory Pyramid',
        category: 'Theory',
        frontText: 'Why do perfumes change smell over time?',
        backContent: {
            title: 'Physics of Volatility',
            items: [
                'Top Notes (0-30m): Small molecules, high vapor pressure (Citrus, Herbs).',
                'Heart Notes (30m-4h): Medium molecules, the "theme" (Florals, Spices).',
                'Base Notes (4h+): Large, heavy molecules, fixatives (Woods, Musks, Resins).'
            ],
            insight: "A perfume is not a static smell; it is a movie. The 'Pyramid' is just a metaphor for evaporation rates. A good perfumer ensures the transition between these phases is seamless, avoiding 'holes' in the evaporation curve."
        }
    },
    {
        type: 'concept',
        id: 'concept-iso',
        title: 'The "Iso" Super Family',
        category: 'Synonym',
        frontText: 'What are the variations of Iso E Super?',
        backContent: {
            title: 'Velvet Woods',
            items: [
                'Iso E Super (IFF): The standard. Transparent, woody, ambergris-like.',
                'Timbersilk (IFF): Higher gamma-isomer (~15%). Stronger, sharper amber note.',
                'Sylvamber (DRT): Highest gamma-isomer (~22%). More cedar-wood character.',
                'Orbitone (Takasago): A generic, very clean equivalent.'
            ],
            insight: "The magic lies in the 'Gamma' isomer. It triggers a velvety receptor response. Timbersilk and Sylvamber are essentially 'High Definition' versions of standard Iso E Super, offering more radiance and power."
        }
    },
    {
        type: 'concept',
        id: 'concept-musk-cocktail',
        title: 'The Musk Cocktail',
        category: 'Theory',
        frontText: 'Why do perfumers rarely use just one Musk?',
        backContent: {
            title: 'Combating Anosmia',
            items: [
                'Large Molecules: Musks are heavy (>200 molecular weight).',
                'Genetic Blindness: ~50% of people are anosmic to specific musks.',
                'The Solution: Blend different classes (Macrocyclic + Polycyclic + Alicyclic).'
            ],
            insight: "A classic 'Laundry' cocktail might be: Galaxolide (Volume) + Habanolide (Hot Iron/Clean) + Ambrettolide (Radiant). If a user can't smell one, the others fill the gap, ensuring the scent has texture for everyone."
        }
    },
    {
        type: 'concept',
        id: 'concept-rose-base',
        title: 'The Rose Skeleton',
        category: 'Synergy',
        frontText: 'Construct a basic Rose from chemicals.',
        backContent: {
            title: 'The Rose Trinity',
            items: [
                'Phenyl Ethyl Alcohol (PEA): The water-soluble, sweet, hyacinth-like petal.',
                'Citronellol: The fresh, waxy, lemony body.',
                'Geraniol: The fruity, leafy, complex heart.'
            ],
            insight: "PEA gives volume but is dull. Citronellol gives freshness. Geraniol gives complexity. To make it 'modern', add Rose Oxide (Metallic/Green) or Damascone (Plum/Jam)."
        }
    },
    {
        type: 'concept',
        id: 'concept-citrus-nuance',
        title: 'Citrus Nuances',
        category: 'Comparison',
        frontText: 'Differentiate Limonene, Citral, and Sinensal.',
        backContent: {
            title: 'Zest vs. Candy vs. Juice',
            items: [
                'Limonene: Generic orange/lemon peel. Dry, zesty, fleeting.',
                'Citral: Lemon drops, lemongrass, harsh, sharp.',
                'Sinensal: The "Juice". Deep, sweet, orange juice character.'
            ],
            insight: "Limonene is the 'texture' of the peel. Citral is the 'sourness'. Aldehydes (C8/C10) are the 'sparkle'. You need all three for a realistic citrus."
        }
    },
    {
        type: 'concept',
        id: 'concept-woody-textures',
        title: 'Woody Textures',
        category: 'Comparison',
        frontText: 'How do Sandalwood, Cedar, and Vetiver differ?',
        backContent: {
            title: 'Cream vs. Pencil vs. Root',
            items: [
                'Sandalwood: Creamy, milky, smooth, buttery.',
                'Cedarwood: Dry, pencil shavings, sharp, architectural.',
                'Vetiver: Earthy, rooty, smoky, damp, green.'
            ],
            insight: "Sandalwood is a 'Base-Heart' note that acts as a blender (smooths edges). Cedar is a 'Structure' note (gives verticality). Vetiver adds 'Texture' and grit to the base."
        }
    },
    {
        type: 'concept',
        id: 'concept-balsamic-sweet',
        title: 'Balsamic Profiles',
        category: 'Comparison',
        frontText: 'Vanilla vs. Benzoin vs. Labdanum vs. Tonka.',
        backContent: {
            title: 'Shades of Sweet',
            items: [
                'Vanillin: Pure, edible, baking sugar.',
                'Benzoin: Warm, resinous vanilla with a cinnamon edge.',
                'Labdanum: Dark, leathery, amber, animalic sweet.',
                'Tonka (Coumarin): Hay-like, almond, powdery sweet.'
            ],
            insight: "Don't just use Vanillin. Use Benzoin for warmth, Labdanum for depth, and Tonka for a dry/powdery finish. This creates a '3D' sweetness rather than a flat 'candy' smell."
        }
    },
    {
        type: 'concept',
        id: 'concept-chypre',
        title: 'The Chypre Structure',
        category: 'Accord',
        frontText: 'What defines the contrast in a Chypre?',
        backContent: {
            title: 'Light vs. Shadow',
            items: [
                'Top: Bergamot (The Light).',
                'Heart: Labdanum (The Bridge).',
                'Base: Oakmoss (The Shadow).',
                'Modern: Often uses Patchouli instead of restricted Oakmoss.'
            ],
            insight: "A Chypre is defined by tension. It is not just 'smelling nice'; it is the clash between the sparkling, sour top and the dark, damp, inky base. Without this contrast, it is just a woody-floral."
        }
    },
    {
        type: 'concept',
        id: 'concept-fougere',
        title: 'The Fougère Structure',
        category: 'Accord',
        frontText: 'What does "Fern" smell like in perfumery?',
        backContent: {
            title: 'The Barbershop Skeleton',
            items: [
                'Top: Lavender (Aromatic/Clean).',
                'Base: Coumarin (Hay/Almond).',
                'Base: Oakmoss (Forest).',
                'Bridge: Geranium (Rose/Mint).'
            ],
            insight: "Fougère means 'Fern', but ferns have no smell. It is an abstract concept of grooming and cleanliness. The Lavender/Coumarin interplay creates a 'shaving foam' effect that defines masculine perfumery."
        }
    },
    {
        type: 'concept',
        id: 'concept-white-floral',
        title: 'White Floral Indoles',
        category: 'Theory',
        frontText: 'Why do white flowers smell "dirty"?',
        backContent: {
            title: 'The Indole Factor',
            items: [
                'Indole: Found in Jasmine, Tuberose, Orange Blossom.',
                'Scent: Mothballs/Fecal in isolation.',
                'Effect: In dilution, creates a deep, narcotic, erotic warmth.'
            ],
            insight: "Clean white florals (like Lily of the Valley) lack Indole. 'Narcotic' or 'Dirty' white florals (Jasmine) are heavy in it. To make a flower sexy, you often need to add a touch of the 'dirty'."
        }
    },
    {
        type: 'concept',
        id: 'concept-hedione-lift',
        title: 'The "Lift" Effect',
        category: 'Theory',
        frontText: 'What does "Lift" or "Diffusion" mean?',
        backContent: {
            title: 'Anti-Gravity for Scent',
            items: [
                'Lift: The ability of a heavy note to be carried into the air.',
                'Key Agents: Hedione, Iso E Super, Salicylates.',
                'Result: The perfume doesn\'t sit flat on skin; it radiates.'
            ],
            insight: "If your formula smells heavy and flat, it likely lacks 'transparent' materials. Hedione acts like wind in the sails of the fragrance, making even heavy woods feel airy."
        }
    },
    {
        type: 'concept',
        id: 'concept-green-notes',
        title: 'Green Notes',
        category: 'Comparison',
        frontText: 'Galbanum vs. Cis-3-Hexenol vs. Stemone.',
        backContent: {
            title: 'Shades of Green',
            items: [
                'Cis-3-Hexenol: Fresh cut grass. Wet and volatile.',
                'Galbanum: Bitter, sharp, bell pepper, snapping a stem.',
                'Stemone/Triplal: Leafy, fig-like, modern freshness.'
            ],
            insight: "Green notes are incredibly powerful. Cis-3-Hexenol adds a 'natural' wetness to fruity accords. Galbanum adds a chic, bitter sophistication to florals (like Chanel No. 19)."
        }
    }
];

const STATIC_QUESTIONS: Question[] = [
    // STUDENT LEVEL
    { id: 's-1', text: "Which of these is the backbone of the 'Fougère' accord?", options: ['Vanilla', 'Lavender', 'Rose', 'Jasmine'], correctAnswer: 'Lavender', explanation: "The Fougère (Fern) accord is built on Lavender + Coumarin + Oakmoss.", difficulty: 'Student' },
    { id: 's-2', text: "Which Olfactive Family features Lemon, Bergamot, and Grapefruit?", options: ['Chypre', 'Citrus', 'Oriental', 'Woody'], correctAnswer: 'Citrus', explanation: "Citrus notes are volatile oils from fruit peels.", difficulty: 'Student' },
    { id: 's-3', text: "Which notes evaporate the fastest?", options: ['Base', 'Heart', 'Top', 'Fixatives'], correctAnswer: 'Top', explanation: "Top notes have the lowest molecular weight and highest volatility.", difficulty: 'Student' },
    { id: 's-4', text: "Scent profile of Vanillin?", options: ['Green', 'Sweet & Creamy', 'Citrus', 'Animalic'], correctAnswer: 'Sweet & Creamy', explanation: "Vanillin provides sweet, comforting, edible notes.", difficulty: 'Student' },
    { id: 's-5', text: "What is 'Sillage'?", options: ['The bottle shape', 'The scent trail left behind', 'The price', 'The expiration date'], correctAnswer: 'The scent trail left behind', explanation: "Sillage (wake) describes the trail of scent a perfume leaves in the air.", difficulty: 'Student' },
    { id: 's-6', text: "Which is a 'White Flower'?", options: ['Rose', 'Lavender', 'Jasmine', 'Geranium'], correctAnswer: 'Jasmine', explanation: "Jasmine, Tuberose, and Gardenia are classic 'White Flowers' containing Indole.", difficulty: 'Student' },
    { id: 's-7', text: "Patchouli is typically classified as...", options: ['Floral', 'Woody/Earthy', 'Citrus', 'Fruity'], correctAnswer: 'Woody/Earthy', explanation: "Patchouli provides a deep, earthy, woody, and camphorous base.", difficulty: 'Student' },
    { id: 's-8', text: "Gourmand fragrances smell like...", options: ['The Ocean', 'Desserts/Food', 'Forests', 'Clean Laundry'], correctAnswer: 'Desserts/Food', explanation: "Gourmand fragrances mimic edible scents like chocolate, vanilla, and caramel.", difficulty: 'Student' },
    { id: 's-9', text: "Which concentration is strongest?", options: ['Eau de Toilette', 'Eau de Cologne', 'Extrait de Parfum', 'Eau de Parfum'], correctAnswer: 'Extrait de Parfum', explanation: "Extrait typically has 20-30%+ concentration.", difficulty: 'Student' },
    { id: 's-10', text: "Calone is the signature molecule for which family?", options: ['Marine/Aquatic', 'Floral', 'Spice', 'Leather'], correctAnswer: 'Marine/Aquatic', explanation: "Calone 1951 smells of melon and sea breeze.", difficulty: 'Student' },
    { id: 's-11', text: "What is the primary source of Vetiver oil?", options: ["Tree Bark", "Flower Petals", "Roots", "Leaves"], correctAnswer: "Roots", explanation: "Vetiver essential oil is distilled from the complex root system of the Vetiver grass.", difficulty: 'Student' },
    { id: 's-12', text: "Which flower is often called the 'King of Flowers'?", options: ["Rose", "Jasmine", "Lavender", "Tuberose"], correctAnswer: "Jasmine", explanation: "Jasmine is traditionally known as the King, while Rose is the Queen.", difficulty: 'Student' },
    { id: 's-13', text: "What does 'Eau de Toilette' generally indicate?", options: ["Highest concentration", "Alcohol-free", "Medium concentration", "Oil-based"], correctAnswer: "Medium concentration", explanation: "EDT typically has a concentration of 5-15% aromatic compounds.", difficulty: 'Student' },
    { id: 's-14', text: "Which of these is a 'Green' note?", options: ["Galbanum", "Vanillin", "Benzoin", "Civet"], correctAnswer: "Galbanum", explanation: "Galbanum resin is the reference material for sharp, bitter green notes.", difficulty: 'Student' },
    { id: 's-15', text: "What is the dominant note in 'Chanel No. 5'?", options: ["Aldehydes", "Fruits", "Spices", "Leather"], correctAnswer: "Aldehydes", explanation: "Chanel No. 5 is famous for its overdose of aliphatic aldehydes (C10, C11, C12).", difficulty: 'Student' },
    { id: 's-16', text: "Which citrus oil is known to be phototoxic?", options: ["Sweet Orange", "Bergamot", "Mandarin", "Yuzu"], correctAnswer: "Bergamot", explanation: "Cold-pressed Bergamot contains bergapten, which causes skin burns in sunlight.", difficulty: 'Student' },
    { id: 's-17', text: "What is a 'Soliflore'?", options: ["A bouquet", "A single flower scent", "A synthetic musk", "A bottle type"], correctAnswer: "A single flower scent", explanation: "A soliflore fragrance focuses on mimicking the scent of a single specific flower.", difficulty: 'Student' },
    { id: 's-18', text: "Which part of the Cinnamon tree gives the spicy oil?", options: ["Leaves", "Bark", "Roots", "Seeds"], correctAnswer: "Bark", explanation: "Cinnamon Bark oil is the spicy, sweet one. Cinnamon Leaf oil smells more like Clove.", difficulty: 'Student' },
    { id: 's-19', text: "What does 'Dry Down' refer to?", options: ["Top notes", "Bottling", "Final scent phase", "Evaporation"], correctAnswer: "Final scent phase", explanation: "Dry down is the lasting impression of the perfume after the volatile notes have evaporated.", difficulty: 'Student' },
    { id: 's-20', text: "Is natural Musk originally plant or animal based?", options: ["Plant", "Mineral", "Animal", "Synthetic"], correctAnswer: "Animal", explanation: "Natural musk comes from the gland of the Musk Deer, though it is banned/restricted now.", difficulty: 'Student' },

    // PRO LEVEL
    { id: 'p-1', text: "The 'Grojsman Accord' contains Iso E Super, Hedione, Methyl Ionone Gamma, and...", options: ['Ambroxan', 'Galaxolide', 'Vanillin', 'Calone'], correctAnswer: 'Galaxolide', explanation: "The 'Hug Me' accord is roughly equal parts of these four materials.", difficulty: 'Pro' },
    { id: 'p-2', text: "Javanol is a high-performance replacer for...", options: ['Linalool', 'Sandalwood', 'Citral', 'Eugenol'], correctAnswer: 'Sandalwood', explanation: "Javanol is a powerful synthetic sandalwood molecule.", difficulty: 'Pro' },
    { id: 'p-3', text: "Trade name for HHCB?", options: ['Iso E Super', 'Galaxolide', 'Hedione', 'Helional'], correctAnswer: 'Galaxolide', explanation: "1,3,4,6,7,8-hexahydro... is Galaxolide.", difficulty: 'Pro' },
    { id: 'p-4', text: "Which molecule adds a 'Sea Breeze' effect?", options: ['Calone', 'Coumarin', 'Civet', 'Castoreum'], correctAnswer: 'Calone', explanation: "Methylbenzodioxepinone (Calone) is the reference for marine notes.", difficulty: 'Pro' },
    { id: 'p-5', text: "Hydroxycitronellal smells primarily of...", options: ['Rose', 'Muguet (Lily of the Valley)', 'Jasmine', 'Cedar'], correctAnswer: 'Muguet (Lily of the Valley)', explanation: "It is a classic Muguet molecule.", difficulty: 'Pro' },
    { id: 'p-6', text: "Which is NOT a Musk?", options: ['Galaxolide', 'Habanolide', 'Ambroxan', 'Ambrettolide'], correctAnswer: 'Ambroxan', explanation: "Ambroxan is an Ambergris material, not a Musk.", difficulty: 'Pro' },
    { id: 'p-7', text: "What defines a Chypre structure?", options: ['Bergamot + Labdanum + Oakmoss', 'Rose + Jasmine', 'Vanilla + Musk', 'Lavender + Coumarin'], correctAnswer: 'Bergamot + Labdanum + Oakmoss', explanation: "The classic contrast of Citrus top and Mossy/Resinous base.", difficulty: 'Pro' },
    { id: 'p-8', text: "Ethyl Maltol smells like...", options: ['Burnt Sugar/Cotton Candy', 'Lemon', 'Pine', 'Mint'], correctAnswer: 'Burnt Sugar/Cotton Candy', explanation: "A powerhouse gourmand molecule.", difficulty: 'Pro' },
    { id: 'p-9', text: "Which usually has the highest impact (strength)?", options: ['Linalool', 'Aldehyde C-12 MNA', 'Hedione', 'Galaxolide'], correctAnswer: 'Aldehyde C-12 MNA', explanation: "Aliphatic Aldehydes have tremendous impact and are used in traces.", difficulty: 'Pro' },
    { id: 'p-10', text: "Dihydromyrcenol is famous for its role in...", options: ['Cool Water (Davidoff)', 'No. 5 (Chanel)', 'Shalimar', 'Opium'], correctAnswer: 'Cool Water (Davidoff)', explanation: "It defines the fresh, metallic, lime-lavender top of 80s/90s fougères.", difficulty: 'Pro' },
    { id: 'p-11', text: "What gives 'Mitsouko' its famous peach note?", options: ["Aldehyde C-14", "Peach Oil", "Citral", "Ethyl Maltol"], correctAnswer: "Aldehyde C-14", explanation: "Gamma-Undecalactone (Aldehyde C-14) was the key to Mitsouko's fruity chypre structure.", difficulty: 'Pro' },
    { id: 'p-12', text: "What is the main chemical in Clove Oil?", options: ["Linalool", "Limonene", "Eugenol", "Geraniol"], correctAnswer: "Eugenol", explanation: "Eugenol makes up 70-90% of clove oil and gives it the spicy, medicinal scent.", difficulty: 'Pro' },
    { id: 'p-13', text: "Which chemical is called 'Leaf Alcohol'?", options: ["Cis-3-Hexenol", "Linalool", "Ethanol", "Menthol"], correctAnswer: "Cis-3-Hexenol", explanation: "Cis-3-Hexenol smells intensely of fresh cut grass and green leaves.", difficulty: 'Pro' },
    { id: 'p-14', text: "What effect does 'Rose Oxide' have?", options: ["Sweet", "Creamy", "Metallic/Green", "Woody"], correctAnswer: "Metallic/Green", explanation: "Rose Oxide adds a sharp, metallic, geranium-like freshness to rose accords.", difficulty: 'Pro' },
    { id: 'p-15', text: "Which is stronger: Vanillin or Ethyl Vanillin?", options: ["Vanillin", "Ethyl Vanillin", "Equal", "Depends"], correctAnswer: "Ethyl Vanillin", explanation: "Ethyl Vanillin is roughly 3-4 times stronger than standard Vanillin.", difficulty: 'Pro' },
    { id: 'p-16', text: "What is 'Hedione' chemically?", options: ["Methyl Salicylate", "Methyl Dihydrojasmonate", "Ethyl Acetate", "Benzyl Acetate"], correctAnswer: "Methyl Dihydrojasmonate", explanation: "Hedione is the trade name for Methyl Dihydrojasmonate, a transparent floralizer.", difficulty: 'Pro' },
    { id: 'p-17', text: "What does IFRA stand for?", options: ["International Fragrance Regulatory Agency", "International Fragrance Association", "Independent Fragrance Research Academy", "Institute of Fragrance Art"], correctAnswer: "International Fragrance Association", explanation: "The body that sets safety standards for the fragrance industry.", difficulty: 'Pro' },
    { id: 'p-18', text: "Aldehyde C-10 smells primarily of...", options: ["Orange Peel/Waxy", "Lemon", "Rose", "Vanilla"], correctAnswer: "Orange Peel/Waxy", explanation: "Decanal (C-10) has a powerful, penetrating, waxy orange-peel odor.", difficulty: 'Pro' },
    { id: 'p-19', text: "Which material smells of 'Mothballs' in high concentration?", options: ["Indole", "Linalool", "Coumarin", "Musk"], correctAnswer: "Indole", explanation: "Indole is fecal/mothball-like in isolation but adds erotic floralcy in dilution.", difficulty: 'Pro' },
    { id: 'p-20', text: "What creates a 'Leather' note?", options: ["Isobutyl Quinoline", "Linalyl Acetate", "Hedione", "Galaxolide"], correctAnswer: "Isobutyl Quinoline", explanation: "IBQ (Pyralone) is a classic leather/green material used in Bandit and other leathers.", difficulty: 'Pro' },

    // NOSE LEVEL
    { id: 'n-1', text: "Who created 'Le Parfum de Thérèse'?", options: ['Jean-Claude Ellena', 'Edmond Roudnitska', 'Ernest Beaux', 'Sophia Grojsman'], correctAnswer: 'Edmond Roudnitska', explanation: "He composed it for his wife; it was released posthumously by Malle.", difficulty: 'Nose' },
    { id: 'n-2', text: "A 'Schiff Base' is formed between...", options: ['Acid + Alcohol', 'Aldehyde + Primary Amine', 'Two Esters', 'Ketone + Musk'], correctAnswer: 'Aldehyde + Primary Amine', explanation: "E.g., Aurantiol (Hydroxycitronellal + Methyl Anthranilate).", difficulty: 'Nose' },
    { id: 'n-3', text: "Why is Oakmoss restricted by IFRA?", options: ['Sensitization (Atranol)', 'Carcinogen', 'Neurotoxin', 'Environmental'], correctAnswer: 'Sensitization (Atranol)', explanation: "Atranol and Chloroatranol are potent allergens found in natural moss.", difficulty: 'Nose' },
    { id: 'n-4', text: "The 'Mellis' accord relies on Eugenol and...", options: ['Benzyl Salicylate', 'Limonene', 'Ethyl Maltol', 'Calone'], correctAnswer: 'Benzyl Salicylate', explanation: "Skeleton of Opium/Youth Dew: Benzyl Salicylate + Eugenol + Patchouli.", difficulty: 'Nose' },
    { id: 'n-5', text: "What is the 'Ambrein' accord (not the chemical)?", options: ['Bergamot + Vanillin + Civet', 'Rose + Oud', 'Iris + Violet', 'Citrus + Cologne'], correctAnswer: 'Bergamot + Vanillin + Civet', explanation: "The skeleton of Shalimar, derived from Jicky.", difficulty: 'Nose' },
    { id: 'n-6', text: "Which molecule is 100% natural but synthesized for cost?", options: ['Vanillin', 'Iso E Super', 'Calone', 'Galaxolide'], correctAnswer: 'Vanillin', explanation: "Nature-identical Vanillin is synthesized from wood pulp or petrochemicals.", difficulty: 'Nose' },
    { id: 'n-7', text: "Alpha-Isomethyl Ionone is primarily...", options: ['Violet/Woody', 'Citrus', 'Green', 'Fruity'], correctAnswer: 'Violet/Woody', explanation: "A standard component for Violet and Iris accords.", difficulty: 'Nose' },
    { id: 'n-8', text: "Which perfumer created 'Germaine Cellier's Bandit'?", options: ['Germaine Cellier', 'Jean Carles', 'Francis Kurkdjian', 'Dominique Ropion'], correctAnswer: 'Germaine Cellier', explanation: "A pioneering female perfumer known for brutal green chypres.", difficulty: 'Nose' },
    { id: 'n-9', text: "Cis-3-Hexenol is also known as...", options: ['Leaf Alcohol', 'Banana Oil', 'Pear Ester', 'Clove Oil'], correctAnswer: 'Leaf Alcohol', explanation: "Smells intensely of cut grass.", difficulty: 'Nose' },
    { id: 'n-10', text: "Indole is naturally found in Jasmine and...", options: ['Feces', 'Apples', 'Pine trees', 'Ocean water'], correctAnswer: 'Feces', explanation: "Indole is fecal in isolation but floral in dilution.", difficulty: 'Nose' },
    { id: 'n-11', text: "Who created 'Shalimar'?", options: ["Coco Chanel", "Jacques Guerlain", "Ernest Beaux", "Francois Coty"], correctAnswer: "Jacques Guerlain", explanation: "Released in 1925, created by Jacques Guerlain.", difficulty: 'Nose' },
    { id: 'n-12', text: "What is the primary odorant in 'Violet Leaf'?", options: ["2,6-Nonadienal", "Ionone", "Iron", "Linalool"], correctAnswer: "2,6-Nonadienal", explanation: "Often called 'Violet Leaf Aldehyde', giving the cucumber/green scent.", difficulty: 'Nose' },
    { id: 'n-13', text: "Linalyl Acetate belongs to which chemical class?", options: ["Aldehydes", "Esters", "Alcohols", "Ketones"], correctAnswer: "Esters", explanation: "It is the ester of Linalool, key to Lavender and Bergamot.", difficulty: 'Nose' },
    { id: 'n-14', text: "Who composed 'L'Air du Temps'?", options: ["Francis Fabron", "Jean Carles", "Germaine Cellier", "Edmond Roudnitska"], correctAnswer: "Francis Fabron", explanation: "Created in 1948 for Nina Ricci.", difficulty: 'Nose' },
    { id: 'n-15', text: "Which molecule causes specific anosmia in many people?", options: ["Citral", "Galaxolide", "Eugenol", "Limonene"], correctAnswer: "Galaxolide", explanation: "Large musk molecules like Galaxolide and Iso E Super often cause partial anosmia.", difficulty: 'Nose' }
];

const VictoryScreen: React.FC<{ onReset: () => void }> = ({ onReset }) => (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/95 animate-fade-in rounded-xl">
        <div className="text-6xl mb-4 animate-bounce">🏆</div>
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a89984] to-yellow-300 mb-4">
            PERFECT SCORE!
        </h2>
        <p className="text-gray-300 mb-8 text-lg">You have mastered this level.</p>
        
        {/* CSS Confetti Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {[...Array(50)].map((_, i) => (
                <div 
                    key={i}
                    className="absolute w-2 h-2 bg-[#a89984] rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `-10px`,
                        opacity: Math.random(),
                        animation: `fall ${2 + Math.random() * 3}s linear infinite`,
                        animationDelay: `${Math.random() * 5}s`
                    }}
                ></div>
            ))}
            <style>{`
                @keyframes fall {
                    to { transform: translateY(800px) rotate(720deg); }
                }
            `}</style>
        </div>

        <button 
            onClick={onReset}
            className="bg-[#a89984] text-black font-bold py-3 px-8 rounded-full hover:bg-white transition-colors shadow-lg z-50"
        >
            Start New Challenge
        </button>
    </div>
);

const TrainingGymView: React.FC<TrainingGymViewProps> = ({ molecules }) => {
    const [mode, setMode] = useState<Mode>('flashcard');
    
    // Flashcard State
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    
    // Merge user molecules with concept cards
    const shuffledFlashcards = useMemo(() => {
        const moleculeCards = molecules.map(m => ({ ...m, type: 'molecule' }));
        // @ts-ignore
        const deck = [...moleculeCards, ...CONCEPT_CARDS];
        return deck.sort(() => 0.5 - Math.random());
    }, [molecules]);
    
    const currentFlashcard = shuffledFlashcards[currentCardIndex];

    // Quiz State
    const [difficulty, setDifficulty] = useState<Difficulty>('Student');
    const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [quizComplete, setQuizComplete] = useState(false);

    useEffect(() => {
        if (mode === 'quiz') {
            generateQuiz();
        }
    }, [mode, difficulty, molecules]);

    const generateQuiz = () => {
        const dynamicQuestions: Question[] = [];
        
        // Generate dynamic questions from user's library
        if (molecules.length >= 4) {
            molecules.forEach((m, i) => {
                if (i % 3 === 0) { 
                    const wrongOptions = molecules
                        .filter(om => om.olfactiveFamily !== m.olfactiveFamily)
                        .map(om => om.olfactiveFamily)
                        .filter((v, k, a) => a.indexOf(v) === k)
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 3);
                    
                    if (wrongOptions.length === 3) {
                        dynamicQuestions.push({
                            id: `dyn-${m.id}`,
                            text: `To which Olfactive Family does '${m.name}' belong?`,
                            options: [...wrongOptions, m.olfactiveFamily].sort(() => 0.5 - Math.random()),
                            correctAnswer: m.olfactiveFamily,
                            explanation: `${m.name} is classified as a ${m.olfactiveFamily} material.`,
                            difficulty: 'Student' 
                        });
                    }
                }
            });
        }

        const allPool = [...STATIC_QUESTIONS, ...dynamicQuestions];
        const levelQuestions = allPool.filter(q => q.difficulty === difficulty);
        
        // Select 10 questions for the quiz
        setQuizQuestions(levelQuestions.sort(() => 0.5 - Math.random()).slice(0, 10));
        setCurrentQuestionIdx(0);
        setScore(0);
        setQuizComplete(false);
        setShowResult(false);
        setSelectedAnswer(null);
    };

    const handleAnswer = (answer: string) => {
        if (showResult) return;
        setSelectedAnswer(answer);
        setShowResult(true);
        if (answer === quizQuestions[currentQuestionIdx].correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIdx < quizQuestions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
            setShowResult(false);
            setSelectedAnswer(null);
        } else {
            setQuizComplete(true);
        }
    };

    const nextCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentCardIndex((prev) => (prev + 1) % shuffledFlashcards.length);
        }, 300);
    };

    // --- THE SHERLOCK HOLMES ENGINE ---
    // Dynamically deduces what the molecule might be based on its stats
    const getMoleculeInsight = (m: Molecule) => {
        const f = m.olfactiveFamily;
        const dna = m.scentDNA || {};
        const highFacets = Object.entries(dna).filter(([_, v]) => v >= 4).map(([k]) => k);
        
        // 1. Specific Combinations
        if (f === OlfactiveFamily.FLORAL) {
            if (highFacets.includes(ScentFacet.ANIMALIC)) return "Floral + Animalic: This screams 'White Flower' (Jasmine/Tuberose). The animalic note is likely Indole, adding a narcotic, skin-like warmth.";
            if (highFacets.includes(ScentFacet.GREEN)) return "Floral + Green: A 'living flower' scent. Think Hyacinth, Violet Leaf, or Muguet. It smells like the stem and the petals together.";
            if (highFacets.includes(ScentFacet.POWDERY)) return "Floral + Powdery: Suggests Ionones (Violet/Iris) or Heliotropin. Classic, cosmetic, makeup-bag scent.";
            if (highFacets.includes(ScentFacet.ALDEHYDIC)) return "Floral + Aldehydic: The 'Chanel No. 5' effect. Aldehydes make the floral notes abstract, sparkling, and soapy.";
        }

        if (f === OlfactiveFamily.WOODY) {
            if (highFacets.includes(ScentFacet.CREAMY)) return "Woody + Creamy: The signature of Sandalwood (or replacers like Javanol). It acts as a fixative that smooths out rough edges.";
            if (highFacets.includes(ScentFacet.EARTHY)) return "Woody + Earthy: Think Vetiver or Patchouli. These are root-derived oils that bring the scent of soil and damp forest floor.";
            if (highFacets.includes(ScentFacet.AMBER) || highFacets.includes(ScentFacet.VELVETY)) return "Woody + Amber/Velvet: Likely Iso E Super or Cedramber. These are 'transparent' woods used to give volume and aura.";
        }

        if (f === OlfactiveFamily.SPICY) {
            if (highFacets.includes(ScentFacet.WARM) || highFacets.includes(ScentFacet.SWEET)) return "Spicy + Sweet: 'Warm Spices' like Cinnamon, Clove, or Nutmeg. They bridge the gap between Gourmand and Oriental.";
            if (highFacets.includes(ScentFacet.ZESTY) || highFacets.includes(ScentFacet.ICY)) return "Spicy + Fresh: 'Cold Spices' like Cardamom, Pink Pepper, or Ginger. They provide energy and fizz to the top notes.";
        }

        if (f === OlfactiveFamily.CITRUS) {
            if (m.impact > 10) return "Citrus with high longevity? This is likely a synthetic (like Dihydromyrcenol) or a specific fraction. Naturals rarely last this long.";
            if (highFacets.includes(ScentFacet.SWEET)) return "Sweet Citrus: Suggests Orange or Mandarin. These lack the sharp 'bite' of lemon and are often used to round out top notes.";
        }

        // 2. General Structural Deductions
        if (m.impact > 300 && m.odorStrength < 5) {
            return "High Tenacity + Low Impact: This is a classic BLENDER or FIXATIVE. It creates a canvas for other ingredients (e.g., Musk, Iso E Super).";
        }
        if (m.impact < 2 && m.odorStrength > 8) {
            return "High Impact + Low Tenacity: A volatile TOP note punch. Use with caution! It will explode initially but disappear in minutes (e.g., certain Aldehydes or Esters).";
        }

        // 3. Fallback
        return `Analyze the radar chart. As a ${m.olfactiveFamily} material, notice which facets pull the shape. Is it linear (one spike) or complex (round shape)?`;
    };

    // RENDERERS
    const renderFlashcardMode = () => (
        <div className="flex flex-col items-center justify-center flex-grow min-h-[600px]">
            {currentFlashcard ? (
                <div className="w-full max-w-md perspective-1000 group">
                    <div
                        className={`relative w-full h-[580px] transform-style-preserve-3d transition-transform duration-700 cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        {/* Front */}
                        <div className="absolute w-full h-full backface-hidden bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 text-center transition-colors duration-300">
                            {/* @ts-ignore */}
                            {currentFlashcard.type === 'molecule' ? (
                                <>
                                    <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-[#111] flex items-center justify-center mb-6 border border-gray-200 dark:border-gray-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#a89984]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.24a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 003.86.517l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318z" />
                                        </svg>
                                    </div>
                                    {/* @ts-ignore */}
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{currentFlashcard.name}</h3>
                                    <p className="text-gray-500 text-sm">Tap to analyze</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-24 h-24 rounded-full bg-[#a89984]/10 flex items-center justify-center mb-6 border border-[#a89984]">
                                        <span className="text-3xl">💡</span>
                                    </div>
                                    {/* @ts-ignore */}
                                    <span className="text-[#a89984] text-xs font-bold uppercase tracking-widest mb-2">{currentFlashcard.category}</span>
                                    {/* @ts-ignore */}
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{currentFlashcard.title}</h3>
                                    {/* @ts-ignore */}
                                    <p className="text-gray-600 dark:text-gray-400 text-sm italic">"{currentFlashcard.frontText}"</p>
                                </>
                            )}
                        </div>

                        {/* Back */}
                        <div className="absolute w-full h-full backface-hidden bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg transform rotate-y-180 p-6 flex flex-col transition-colors duration-300">
                            {/* @ts-ignore */}
                            {currentFlashcard.type === 'molecule' ? (
                                <>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-gray-500">Family</span>
                                        {/* @ts-ignore */}
                                        <span className="text-sm font-bold" style={{ color: CATEGORY_HEX_COLORS[currentFlashcard.olfactiveFamily] }}>{currentFlashcard.olfactiveFamily}</span>
                                    </div>
                                    <div className="flex-grow flex items-center justify-center h-64 w-full">
                                        <div className="w-full h-full">
                                            {/* @ts-ignore */}
                                            <ScentDNARadarChart scentDNA={currentFlashcard.scentDNA} />
                                        </div>
                                    </div>
                                    
                                    {/* Data Grid */}
                                    <div className="grid grid-cols-2 gap-2 text-center mb-3 border-t border-gray-200 dark:border-gray-800 pt-2">
                                        <div className="bg-gray-50 dark:bg-[#111] rounded p-1">
                                            <p className="text-[10px] text-gray-500 uppercase">Impact</p>
                                            {/* @ts-ignore */}
                                            <p className="font-mono text-gray-900 dark:text-white font-bold">{currentFlashcard.odorStrength}/10</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-[#111] rounded p-1">
                                            <p className="text-[10px] text-gray-500 uppercase">Life</p>
                                            {/* @ts-ignore */}
                                            <p className="font-mono text-gray-900 dark:text-white font-bold">{currentFlashcard.impact}h</p>
                                        </div>
                                    </div>

                                    {/* EDUCATIONAL INSIGHT SECTION */}
                                    <div className="bg-[#a89984]/10 border border-[#a89984]/30 rounded p-3 text-left">
                                        <p className="text-[10px] text-[#a89984] font-bold uppercase mb-1">Perfumer's Insight</p>
                                        {/* @ts-ignore */}
                                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{getMoleculeInsight(currentFlashcard)}</p>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col h-full text-center">
                                    {/* @ts-ignore */}
                                    <h4 className="text-lg font-bold text-[#a89984] mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">{currentFlashcard.backContent.title}</h4>
                                    <div className="flex-grow overflow-y-auto text-left space-y-2 mb-2">
                                        {/* @ts-ignore */}
                                        {currentFlashcard.backContent.items.map((item: string, i: number) => (
                                            <div key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start"><span className="text-[#a89984] mr-2">•</span>{item}</div>
                                        ))}
                                    </div>
                                    {/* CONCEPT CARD INSIGHT BOX */}
                                    {/* @ts-ignore */}
                                    {currentFlashcard.backContent.insight && (
                                        <div className="mt-4 bg-[#a89984]/10 border border-[#a89984]/30 rounded p-3 text-left">
                                            <p className="text-[10px] text-[#a89984] font-bold uppercase mb-1">Perfumer's Insight</p>
                                            {/* @ts-ignore */}
                                            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{currentFlashcard.backContent.insight}</p>
                                        </div>
                                    )}
                                    {/* @ts-ignore */}
                                    {currentFlashcard.backContent.footer && (
                                        <p className="text-xs text-gray-500 mt-auto italic border-t border-gray-200 dark:border-gray-800 pt-2">
                                            {/* @ts-ignore */}
                                            {currentFlashcard.backContent.footer}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-8 flex justify-center">
                        <button onClick={nextCard} className="bg-[#a89984] hover:bg-[#968874] text-black font-bold py-3 px-12 rounded-full transition-transform transform active:scale-95 shadow-lg">
                            Next Card
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500">
                    <p>Loading cards...</p>
                </div>
            )}
        </div>
    );

    const renderQuizMode = () => {
        if (quizComplete && score === quizQuestions.length) {
            return <VictoryScreen onReset={generateQuiz} />;
        }

        if (quizComplete) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center animate-fade-in shadow-lg">
                    <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-6">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">{Math.round((score / quizQuestions.length) * 100)}%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Session Complete</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">You scored {score} out of {quizQuestions.length} on {difficulty} difficulty.</p>
                    <div className="flex space-x-4">
                        <button onClick={generateQuiz} className="bg-[#a89984] text-black font-bold py-3 px-8 rounded-md hover:bg-opacity-80 transition-colors">
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        if (quizQuestions.length === 0) {
            return <div className="text-center text-gray-500 py-12">Loading Questions...</div>;
        }

        const question = quizQuestions[currentQuestionIdx];

        return (
            <div className="max-w-2xl mx-auto mt-8">
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full mb-8">
                    <div 
                        className="bg-[#a89984] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((currentQuestionIdx + 1) / quizQuestions.length) * 100}%` }}
                    ></div>
                </div>

                <div className="bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-lg relative overflow-hidden transition-colors duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${
                            difficulty === 'Student' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 
                            difficulty === 'Pro' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 
                            'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                        }`}>
                            {difficulty} Level
                        </span>
                        <span className="text-gray-500 text-sm font-mono">Q {currentQuestionIdx + 1}/{quizQuestions.length}</span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-8 leading-relaxed">{question.text}</h3>

                    <div className="space-y-3">
                        {question.options.map((option, idx) => {
                            let btnClass = "w-full text-left p-4 rounded-lg border transition-all duration-200 font-medium ";
                            
                            if (showResult) {
                                if (option === question.correctAnswer) {
                                    btnClass += "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-100";
                                } else if (option === selectedAnswer) {
                                    btnClass += "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:text-red-100";
                                } else {
                                    btnClass += "bg-gray-50 border-gray-200 text-gray-400 dark:bg-[#111] dark:border-gray-800 dark:text-gray-500 opacity-50";
                                }
                            } else {
                                btnClass += "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 dark:bg-[#111] dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-500";
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(option)}
                                    disabled={showResult}
                                    className={btnClass}
                                >
                                    <div className="flex items-center">
                                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs mr-3 opacity-70">
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        {option}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Explanation & Next Button */}
                    {showResult && (
                        <div className="mt-8 animate-fade-in">
                            <div className="bg-gray-50 dark:bg-gray-800/50 border-l-4 border-[#a89984] p-4 mb-6 rounded-r-md">
                                <h4 className="text-[#a89984] font-bold text-sm mb-1">Did you know?</h4>
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{question.explanation}</p>
                            </div>
                            <div className="flex justify-end">
                                <button 
                                    onClick={nextQuestion}
                                    className="bg-[#a89984] text-black font-bold py-2 px-6 rounded-md hover:bg-opacity-80 transition-colors flex items-center"
                                >
                                    {currentQuestionIdx === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade-in pt-12 min-h-screen flex flex-col bg-gray-100 dark:bg-black transition-colors duration-300">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Olfactive Training Gym</h1>
                <p className="text-gray-500 dark:text-gray-400">Train your nose, test your knowledge, and master the art of perfumery.</p>
            </div>

            {/* Main Tab Switcher */}
            <div className="flex justify-center mb-8">
                <div className="bg-white dark:bg-[#111] p-1 rounded-lg border border-gray-200 dark:border-gray-800 inline-flex shadow-sm dark:shadow-none">
                    <button
                        onClick={() => setMode('flashcard')}
                        className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors ${mode === 'flashcard' ? 'bg-[#a89984] text-black shadow' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                    >
                        Flashcards
                    </button>
                    <button
                        onClick={() => setMode('quiz')}
                        className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors ${mode === 'quiz' ? 'bg-[#a89984] text-black shadow' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                    >
                        The Gauntlet
                    </button>
                </div>
            </div>

            {/* Sub-level Switcher for Quiz */}
            {mode === 'quiz' && !quizComplete && (
                <div className="flex justify-center mb-6 space-x-4">
                    {(['Student', 'Pro', 'Nose'] as Difficulty[]).map((level) => (
                        <button
                            key={level}
                            onClick={() => setDifficulty(level)}
                            className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide border transition-all ${
                                difficulty === level 
                                    ? 'border-[#a89984] text-[#a89984] bg-[#a89984]/10' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-600 dark:hover:text-gray-400'
                            }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex-grow pb-12">
                {mode === 'flashcard' ? renderFlashcardMode() : renderQuizMode()}
            </div>
        </div>
    );
};

export default TrainingGymView;
