import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

/// CSS styles in React format, matching original CSS


interface OrbitControlsWithEvents extends OrbitControls {
    addEventListener: (type: string, listener: (event: THREE.Event) => void) => void;
    removeEventListener: (type: string, listener: (event: THREE.Event) => void) => void;
}


const styles: { [key: string]: React.CSSProperties } = {
    container: {
        width: '100dvw',
        height: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    globeWrapper: {
        position: 'relative',
        height: '100dvh',
        width: '100dvw',
    },
    canvas3D: {
        display: 'block',
        position: 'absolute',
    },
    canvas2D: {
        display: 'block',
        position: 'absolute',
        pointerEvents: 'none',
    },
    popupOverlay: {
        display: 'block',
        position: 'absolute',
        pointerEvents: 'none',
    },
    popup: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'white',
        opacity: 0,
        color: '#111',
        fontFamily: 'sans-serif',
        padding: '5px 10px',
        fontSize: '15px',
        borderRadius: '3px',
        filter: 'drop-shadow(0px 0px 3px #555555)',
        pointerEvents: 'none',
    },
    title: {
        position: 'fixed',
        bottom: '10%',
        left: 0,
        width: '100%',
        textAlign: 'center',
        fontFamily: 'sans-serif',
    },
};

const Globe: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvas3DRef = useRef<HTMLCanvasElement>(null);
    const canvas2DRef = useRef<HTMLCanvasElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    const [popupContent, setPopupContent] = useState<string>('');

    useEffect(() => {
        if (!containerRef.current || !canvas3DRef.current || !canvas2DRef.current || !popupRef.current) return;
        const canvas3D = canvas3DRef.current;
        const canvas2D = canvas2DRef.current;
        let renderer: THREE.WebGLRenderer;
        let scene: THREE.Scene;
        let camera: THREE.OrthographicCamera;
        let rayCaster: THREE.Raycaster;
        let controls: OrbitControlsWithEvents;
        let globe: THREE.Points;
        let globeMesh: THREE.Mesh;
        let pointer: THREE.Mesh;
        let mapMaterial: THREE.ShaderMaterial;
        let earthTexture: THREE.Texture;
        const overlayCtx: CanvasRenderingContext2D | null = canvas2D.getContext('2d');
        const coordinates2D: [number, number] = [0, 0];
        let clock: THREE.Clock;
        let mouse: THREE.Vector2;
        let popupVisible = false;
        let popupOpenTl: gsap.core.Timeline;
        let popupCloseTl: gsap.core.Timeline;
        let dragged: boolean = false;
        const container: HTMLDivElement = containerRef.current;

        initScene();
        window.addEventListener('resize', updateSize);

        function initScene(): void {
            renderer = new THREE.WebGLRenderer({ canvas: canvas3D, alpha: true });
            renderer.setPixelRatio(2);

            scene = new THREE.Scene();
            camera = new THREE.OrthographicCamera(-1.1, 1.1, 1.1, -1.1, 0, 3);
            camera.position.z = 1.1;

            rayCaster = new THREE.Raycaster();
            rayCaster.far = 1.15;
            mouse = new THREE.Vector2(-1, -1);
            clock = new THREE.Clock();

            createOrbitControls();

            new THREE.TextureLoader().load(
                'https://ksenia-k.com/img/earth-map-colored.png',
                (mapTex: THREE.Texture) => {
                    earthTexture = mapTex;
                    earthTexture.repeat.set(1, 1);
                    createGlobe();
                    createPointer();
                    createPopupTimelines();
                    addCanvasEvents();
                    updateSize();
                    render();
                },
                undefined,
                (err) => console.error('Texture loading error:', err)
            );
        }

        function createOrbitControls(): void {
            controls = new OrbitControls(camera, canvas3D) as OrbitControlsWithEvents;
            controls.enablePan = false;
            controls.enableZoom = false;
            controls.enableDamping = true;
            controls.minPolarAngle = 0.4 * Math.PI;
            controls.maxPolarAngle = 0.4 * Math.PI;
            controls.autoRotate = true;

            let timestamp: number;
            controls.addEventListener('start', () => {
                timestamp = Date.now();
            });
            controls.addEventListener('end', () => {
                dragged = Date.now() - timestamp > 600;
            });
        }

        function createGlobe(): void {
            const globeGeometry = new THREE.IcosahedronGeometry(1, 22);
            mapMaterial = new THREE.ShaderMaterial({
                vertexShader: `
          uniform sampler2D u_map_tex;
          uniform float u_dot_size;
          uniform float u_time_since_click;
          uniform vec3 u_pointer;
          #define PI 3.14159265359
          varying float vOpacity;
          varying vec2 vUv;
          void main() {
              vUv = uv;
              float visibility = step(.2, texture2D(u_map_tex, uv).r);
              gl_PointSize = visibility * u_dot_size;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              vOpacity = (1. / length(mvPosition.xyz) - .7);
              vOpacity = clamp(vOpacity, .03, 1.);
              float t = u_time_since_click - .1;
              t = max(0., t);
              float max_amp = .15;
              float dist = 1. - .5 * length(position - u_pointer);
              float damping = 1. / (1. + 20. * t);
              float delta = max_amp * damping * sin(5. * t * (1. + 2. * dist) - PI);
              delta *= 1. - smoothstep(.8, 1., dist);
              vec3 pos = position;
              pos *= (1. + delta);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
          }
        `,
                fragmentShader: `
          uniform sampler2D u_map_tex;
          varying float vOpacity;
          varying vec2 vUv;
          void main() {
              vec3 color = texture2D(u_map_tex, vUv).rgb;
              color -= .2 * length(gl_PointCoord.xy - vec2(.5));
              float dot = 1. - smoothstep(.38, .4, length(gl_PointCoord.xy - vec2(.5)));
              if (dot < 0.5) discard;
              gl_FragColor = vec4(color, dot * vOpacity);
          }
        `,
                uniforms: {
                    u_map_tex: { value: earthTexture || null },
                    u_dot_size: { value: 0 },
                    u_pointer: { value: new THREE.Vector3(0.0, 0.0, 1.0) },
                    u_time_since_click: { value: 0 },
                },
                alphaTest: 0,
                transparent: true,
            });

            globe = new THREE.Points(globeGeometry, mapMaterial);
            scene.add(globe);

            globeMesh = new THREE.Mesh(
                globeGeometry,
                new THREE.MeshBasicMaterial({
                    color: 0x222222,
                    transparent: true,
                    opacity: 0.05,
                })
            );
            scene.add(globeMesh);
        }

        function createPointer(): void {
            const geometry = new THREE.SphereGeometry(0.04, 16, 16);
            const material = new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0,
            });
            pointer = new THREE.Mesh(geometry, material);
            scene.add(pointer);
        }

        function updateOverlayGraphic(): void {
            const activePointPosition = pointer.position.clone();
            activePointPosition.applyMatrix4(globe.matrixWorld);
            const activePointPositionProjected = activePointPosition.clone();
            activePointPositionProjected.project(camera);
            coordinates2D[0] = (activePointPositionProjected.x + 1) * container.offsetWidth * 0.5;
            coordinates2D[1] = (1 - activePointPositionProjected.y) * container.offsetHeight * 0.5;

            const matrixWorldInverse = controls.object.matrixWorldInverse;
            activePointPosition.applyMatrix4(matrixWorldInverse);

            if (activePointPosition.z > -1) {
                if (!popupVisible) {
                    popupVisible = true;
                    showPopupAnimation(false);
                }

                let popupX = coordinates2D[0];
                popupX -= activePointPositionProjected.x * container.offsetWidth * 0.3;

                let popupY = coordinates2D[1];
                const upDown = activePointPositionProjected.y > 0.6;
                popupY += upDown ? 20 : -20;

                gsap.set(popupRef.current, {
                    x: popupX,
                    y: popupY,
                    xPercent: -35,
                    yPercent: upDown ? 0 : -100,
                });

                popupY += upDown ? -5 : 5;
                const curveMidX = popupX + activePointPositionProjected.x * 100;
                const curveMidY = popupY + (upDown ? -0.5 : 0.1) * coordinates2D[1];

                drawPopupConnector(coordinates2D[0], coordinates2D[1], curveMidX, curveMidY, popupX, popupY);
            } else {
                if (popupVisible) {
                    popupOpenTl.pause(0);
                    popupCloseTl.play(0);
                }
                popupVisible = false;
            }
        }

        function addCanvasEvents(): void {
            container.addEventListener('mousemove', (e: MouseEvent) => {
                updateMousePosition(e.clientX, e.clientY);
            });

            container.addEventListener('click', (e: MouseEvent | TouchEvent) => {
                if (!dragged) {
                    updateMousePosition(
                        'touches' in e ? e.touches[0].pageX : e.clientX,
                        'touches' in e ? e.touches[0].pageY : e.clientY
                    );

                    const res = checkIntersects();
                    if (res.length) {
                        pointer.position.set(res[0].face!.normal.x, res[0].face!.normal.y, res[0].face!.normal.z);
                        mapMaterial.uniforms.u_pointer.value = res[0].face!.normal;
                        setPopupContent(cartesianToLatLong());
                        showPopupAnimation(true);
                        clock.start();
                    }
                }
            });

            function updateMousePosition(eX: number, eY: number): void {
                mouse.x = (eX - container.offsetLeft) / container.offsetWidth * 2 - 1;
                mouse.y = -((eY - container.offsetTop) / container.offsetHeight) * 2 + 1;
            }
        }

        function checkIntersects(): THREE.Intersection[] {
            rayCaster.setFromCamera(mouse, camera);
            const intersects = rayCaster.intersectObject(globeMesh);
            if (intersects.length) {
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = 'auto';
            }
            return intersects;
        }

        function render(): void {
            mapMaterial.uniforms.u_time_since_click.value = clock.getElapsedTime();
            checkIntersects();
            if (pointer) {
                updateOverlayGraphic();
            }
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }

        function updateSize(): void {
            if (!containerRef.current) return;
            const minSide = 0.65 * Math.min(window.innerWidth, window.innerHeight);
            containerRef.current.style.width = `${minSide}px`;
            containerRef.current.style.height = `${minSide}px`;
            renderer.setSize(minSide, minSide);
            canvas2DRef.current!.width = minSide;
            canvas2DRef.current!.height = minSide;
            if (mapMaterial && mapMaterial.uniforms) {
                mapMaterial.uniforms.u_dot_size.value = 0.04 * minSide;
            }
        }

        function cartesianToLatLong(): string {
            const pos = pointer.position;
            const lat = 90 - (Math.acos(pos.y) * 180) / Math.PI;
            const lng = (270 + (Math.atan2(pos.x, pos.z) * 180) / Math.PI) % 360 - 180;
            return `${formatCoordinate(lat, 'N', 'S')}, ${formatCoordinate(lng, 'E', 'W')}`;
        }

        function formatCoordinate(coordinate: number, positiveDirection: string, negativeDirection: string): string {
            const direction = coordinate >= 0 ? positiveDirection : negativeDirection;
            return `${Math.abs(coordinate).toFixed(4)}° ${direction}`;
        }

        function createPopupTimelines(): void {
            popupOpenTl = gsap.timeline({ paused: true })
                .to(pointer.material, { duration: 0.2, opacity: 1 }, 0)
                .fromTo(
                    canvas2DRef.current,
                    { opacity: 0 },
                    { duration: 0.3, opacity: 1 },
                    0.15
                )
                .fromTo(
                    popupRef.current,
                    { opacity: 0, scale: 0.9, transformOrigin: 'center bottom' },
                    { duration: 0.1, opacity: 1, scale: 1 },
                    0.25
                );

            popupCloseTl = gsap.timeline({ paused: true })
                .to(pointer.material, { duration: 0.3, opacity: 0.2 }, 0)
                .to(canvas2DRef.current, { duration: 0.3, opacity: 0 }, 0)
                .to(
                    popupRef.current,
                    { duration: 0.3, opacity: 0, scale: 0.9, transformOrigin: 'center bottom' },
                    0
                );
        }

        function showPopupAnimation(lifted: boolean): void {
            if (lifted) {
                const positionLifted = pointer.position.clone();
                positionLifted.multiplyScalar(1.3);
                gsap.from(pointer.position, {
                    duration: 0.25,
                    x: positionLifted.x,
                    y: positionLifted.y,
                    z: positionLifted.z,
                    ease: 'power3.out',
                });
            }
            popupCloseTl.pause(0);
            popupOpenTl.play(0);
        }

        function drawPopupConnector(startX: number, startY: number, midX: number, midY: number, endX: number, endY: number): void {
            if (!overlayCtx) return;
            overlayCtx.strokeStyle = '#000000';
            overlayCtx.lineWidth = 3;
            overlayCtx.lineCap = 'round';
            overlayCtx.clearRect(0, 0, containerRef.current!.offsetWidth, containerRef.current!.offsetHeight);
            overlayCtx.beginPath();
            overlayCtx.moveTo(startX, startY);
            overlayCtx.quadraticCurveTo(midX, midY, endX, endY);
            overlayCtx.stroke();
        }

        // Cleanup
        return () => {
            window.removeEventListener('resize', updateSize);
            if (containerRef.current) {
                const elements = containerRef.current.querySelectorAll('canvas');
                elements.forEach((element) => element.remove());
            }
            if (scene) {
                scene.traverse((object) => {
                    if (object instanceof THREE.Mesh) {
                        if (object.geometry) object.geometry.dispose();
                        if (object.material) {
                            if (Array.isArray(object.material)) {
                                object.material.forEach((material) => material.dispose());
                            } else {
                                object.material.dispose();
                            }
                        }
                    }
                });
            }
            if (renderer) renderer.dispose();
        };
    }, [containerRef]);

    return (
        <div style={styles.container}>
            <div ref={containerRef} style={styles.globeWrapper}>
                <canvas ref={canvas3DRef} style={styles.canvas3D} id="globe-3d" />
                <canvas ref={canvas2DRef} style={styles.canvas2D} id="globe-2d-overlay" />
                <div style={styles.popupOverlay} id="globe-popup-overlay">
                    <div
                        ref={popupRef}
                        style={styles.popup}
                        className="globe-popup"
                        dangerouslySetInnerHTML={{ __html: popupContent }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Globe;