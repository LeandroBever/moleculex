
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Molecule, OlfactiveFamily } from '../../types';
import { CATEGORY_HEX_COLORS } from '../../constants';

interface MoleculeNode {
    id: string;
    family: OlfactiveFamily;
    x: number; y: number;
    vx: number; vy: number;
    radius: number;
    color: string;
}

type Node = MoleculeNode;

interface OlfactoryMindmapProps {
    molecules: Molecule[];
}

// --- Physics Constants ---
const GRAVITY = 0.1;
const DAMPING = 0.9;
const MOUSE_RADIUS = 80;
const MOUSE_STRENGTH = -2.0;
const FAMILY_ATTRACTION = 0.0015;
const COLLISION_DAMPING = 0.2; // Energy loss on bounce, reduced for more stability

const OlfactoryMindmap: React.FC<OlfactoryMindmapProps> = ({ molecules }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const mousePosRef = useRef<{ x: number | null, y: number | null }>({ x: null, y: null });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight,
                });
            }
        };
        const resizeObserver = new ResizeObserver(updateDimensions);
        if (containerRef.current) resizeObserver.observe(containerRef.current);
        updateDimensions();
        return () => { if (containerRef.current) resizeObserver.unobserve(containerRef.current); };
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handlePointerMove = (x: number, y: number) => {
            const rect = container.getBoundingClientRect();
            mousePosRef.current = { x: x - rect.left, y: y - rect.top };
        };

        const clearPointer = () => {
            mousePosRef.current = { x: null, y: null };
        };

        const handleMouseMove = (event: MouseEvent) => {
            handlePointerMove(event.clientX, event.clientY);
        };

        const handleTouchMove = (event: TouchEvent) => {
            event.preventDefault(); // Prevent scrolling while interacting
            if (event.touches.length > 0) {
                const touch = event.touches[0];
                handlePointerMove(touch.clientX, touch.clientY);
            }
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', clearPointer);
        
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', clearPointer);
        container.addEventListener('touchcancel', clearPointer);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', clearPointer);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', clearPointer);
            container.removeEventListener('touchcancel', clearPointer);
        };
    }, []);

    useEffect(() => {
        if (dimensions.width === 0 || molecules.length === 0) return;

        const { width } = dimensions;

        const moleculeNodes: MoleculeNode[] = molecules.map(mol => ({
            id: mol.id,
            family: mol.olfactiveFamily,
            x: Math.random() * width,
            y: (Math.random() - 1.2) * 100, // Start above the visible area
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5),
            radius: 7,
            color: CATEGORY_HEX_COLORS[mol.olfactiveFamily],
        }));
        setNodes(moleculeNodes);
    }, [dimensions, molecules]);

    useEffect(() => {
        let animationFrameId: number;
        const { width, height } = dimensions;
        if (!width || !height || nodes.length === 0) return;

        const simulation = () => {
            setNodes(currentNodes => {
                const newNodes: Node[] = JSON.parse(JSON.stringify(currentNodes));

                newNodes.forEach((node, i) => {
                    // 1. Apply forces
                    // Gravity
                    node.vy += GRAVITY;
                    
                    // Mouse repulsion
                    const mouse = mousePosRef.current;
                    if (mouse.x !== null && mouse.y !== null) {
                        const dx = node.x - mouse.x;
                        const dy = node.y - mouse.y;
                        const distSq = dx * dx + dy * dy;
                        if (distSq < MOUSE_RADIUS * MOUSE_RADIUS) {
                            const dist = Math.sqrt(distSq) || 1;
                            const force = MOUSE_STRENGTH * (1 - dist / MOUSE_RADIUS);
                            node.vx += (dx / dist) * force;
                            node.vy += (dy / dist) * force;
                        }
                    }

                    // 2. Inter-node forces
                    for (let j = i + 1; j < newNodes.length; j++) {
                        const other = newNodes[j];
                        const dx = other.x - node.x;
                        const dy = other.y - node.y;
                        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                        const min = node.radius + other.radius;

                        // Collision repulsion
                        if (dist < min) {
                            const overlap = (min - dist) / dist;
                            const pushX = dx * overlap * 0.5;
                            const pushY = dy * overlap * 0.5;
                            node.vx -= pushX;
                            node.vy -= pushY;
                            other.vx += pushX;
                            other.vy += pushY;
                        }
                        
                        // Family attraction
                        if (node.family === other.family) {
                            const force = (dist - (min * 2)) * FAMILY_ATTRACTION; // Attract to cluster
                            const fx = (dx / dist) * force;
                            const fy = (dy / dist) * force;
                            node.vx += fx;
                            node.vy += fy;
                            other.vx -= fx;
                            other.vy -= fy;
                        }
                    }

                    // 3. Update velocity and position
                    node.vx *= DAMPING;
                    node.vy *= DAMPING;

                    node.x += node.vx;
                    node.y += node.vy;

                    // 4. Handle boundary collisions
                    if (node.y + node.radius > height) {
                        node.y = height - node.radius;
                        node.vy *= -COLLISION_DAMPING;
                    } else if (node.y - node.radius < 0) {
                        node.y = node.radius;
                        node.vy *= -COLLISION_DAMPING;
                    }
                    if (node.x + node.radius > width) {
                        node.x = width - node.radius;
                        node.vx *= -COLLISION_DAMPING;
                    } else if (node.x - node.radius < 0) {
                        node.x = node.radius;
                        node.vx *= -COLLISION_DAMPING;
                    }
                });
                return newNodes;
            });
            animationFrameId = requestAnimationFrame(simulation);
        };
        animationFrameId = requestAnimationFrame(simulation);
        return () => cancelAnimationFrame(animationFrameId);
    }, [dimensions, nodes.length]);


    return (
        <div className="w-full h-full relative" ref={containerRef}>
            {dimensions.width > 0 && (
                <svg width="100%" height="100%">
                    <g className="molecule-nodes">
                        {nodes.map(node => (
                            <circle 
                                key={node.id} 
                                cx={node.x} 
                                cy={node.y} 
                                r={node.radius} 
                                fill={node.color} 
                                fillOpacity={0.8}
                             />
                        ))}
                    </g>
                </svg>
            )}
        </div>
    );
};

export default OlfactoryMindmap;
