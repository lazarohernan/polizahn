<template>
  <div class="shield-container" ref="container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// Las siguientes importaciones no se usan, por lo que las comento
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
// import type { Font } from 'three/examples/jsm/loaders/FontLoader.js';
// Importar RGBELoader para cargar HDRI
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';


const container = ref<HTMLElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let shield: THREE.Object3D | null = null;
let controls: OrbitControls;
let frameId: number;

// Colores basados en la paleta de la aplicación
const SHIELD_COLOR = 0x07141c; // Azul metálico muy oscuro, aún más elegante
// Los siguientes colores están definidos pero no se utilizan
// const ACCENT_COLOR = 0x2a3d23; // Verde mucho más oscuro, elegante y acorde al fondo
// const LIGHT_COLOR = 0xffffff;
// const TEXT_COLOR = 0xffffff; // Color del texto

// Función para crear un escudo 3D más realista
const init = () => {
  if (!container.value) return;
  
  // Configuración básica
  scene = new THREE.Scene();
  scene.background = null; // Fondo transparente

  // --- Cargar HDRI para reflejos realistas ---
  // Puedes cambiar la URL por cualquier HDRI de polyhaven.com o similar
  new RGBELoader().setDataType(THREE.FloatType)
    .load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr', (hdrTexture) => {
      hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = hdrTexture;
      // scene.background = hdrTexture; // Descomenta si quieres ver el fondo
    });
  
  // Configuración de la cámara
  const width = container.value.clientWidth;
  const height = container.value.clientHeight;
  camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000); // FOV mayor para más espacio vertical
  camera.position.set(0, 0, 5.2); // Un poco más cerca, escudo más grande pero sin corte
  
  // Configuración del renderizador con sombras
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true // Permitir transparencia
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;
  container.value.appendChild(renderer.domElement);
  
  // Controles para interacción
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.minDistance = 4.2;
  controls.maxDistance = 7.8;
  controls.target.set(0, 0, 0);
  // Limita el giro solo al eje Y (horizontal)
  controls.minPolarAngle = Math.PI / 2;
  controls.maxPolarAngle = Math.PI / 2;
  controls.update();
  
  // Iluminación mejorada
  setupLighting();
  
  // Crear un mapa de entorno para reflejos metálicos
  setupEnvironmentMap();
  
  // Crear el escudo
  createShield();
  
  // Manejar el redimensionamiento de la ventana
  window.addEventListener('resize', onWindowResize);
  
  // Iniciar la animación
  animate();
};

// Configuración de iluminación avanzada
const setupLighting = () => {
  // Luz ambiental suave
  // Iluminación más suave y difusa
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.14); // Antes 0.3
  scene.add(ambientLight);
  
  // Luz principal desde arriba-derecha
  const mainLight = new THREE.DirectionalLight(0xffffff, 0.33); // Antes 1.0
  mainLight.position.set(5, 10, 7.5);
  mainLight.castShadow = false;
  scene.add(mainLight);
  
  // Luz de relleno desde abajo-izquierda
  const fillLight = new THREE.DirectionalLight(0x2a3d23, 0.18); // Antes 0.5
  fillLight.position.set(-5, -2, 7.5);
  scene.add(fillLight);
  
  // Luz trasera para silueta
  const rimLight = new THREE.DirectionalLight(0x0A2233, 0.18); // Antes 0.7
  rimLight.position.set(0, 0, -10);
  scene.add(rimLight);
  
  // Opcional: puedes eliminar los spotlights para menos brillo especular
  // const spotLight1 = new THREE.SpotLight(0xffffff, 0.18);
  // spotLight1.position.set(3, 3, 5);
  // spotLight1.angle = Math.PI / 6;
  // spotLight1.penumbra = 0.2;
  // spotLight1.castShadow = false;
  // scene.add(spotLight1);
  // 
  // const spotLight2 = new THREE.SpotLight(0xffffff, 0.12);
  // spotLight2.position.set(-3, 3, 5);
  // spotLight2.angle = Math.PI / 6;
  // spotLight2.penumbra = 0.2;
  // spotLight2.castShadow = false;
  // scene.add(spotLight2);
};

// Configuración del mapa de entorno para reflejos
const setupEnvironmentMap = () => {
  // Crear un cubo de textura para simular reflejos ambientales
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
  cubeRenderTarget.texture.type = THREE.HalfFloatType;
  
  // Crear una escena de fondo para el mapa de entorno
  // const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
  scene.environment = cubeRenderTarget.texture;
  
  // Añadir una luz ambiental para el mapa de entorno
  const envLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  scene.add(envLight);
};

// Crear un escudo 3D más realista
const createShield = () => {
  // Crear un grupo para contener el escudo
  const shieldGroup = new THREE.Group();
  
  // Material metalizado oscuro sin texturas, solo color base y propiedades físicas
  const shieldMaterial = new THREE.MeshPhysicalMaterial({
    color: SHIELD_COLOR,
    metalness: 1.0,
    roughness: 0.48,
    envMapIntensity: 0.55,
    clearcoat: 0.32,
    clearcoatRoughness: 0.22,
    reflectivity: 0.6,
    sheen: 0.5,
    sheenColor: new THREE.Color(0x8fd3f4),
  });
  
  // Material para los acentos (chrome/plata brillante)
  const accentMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xe0e0e0, // Plata
    metalness: 1.0,
    roughness: 0.23, // Más difuso
    clearcoat: 0.5,
    clearcoatRoughness: 0.18,
    reflectivity: 0.8,
    envMapIntensity: 0.7,
    transmission: 0.0,
    ior: 2.3,
    thickness: 0.2,
    sheen: 0.6,
    sheenColor: new THREE.Color(0xffffff),
  });
  
  // Crear un escudo medieval más detallado
  // Base del escudo (forma de lágrima invertida)
  const shieldShape = new THREE.Shape();
  
  // Parte superior del escudo (plana)
  shieldShape.moveTo(-1.2, 1.5);
  shieldShape.lineTo(1.2, 1.5);
  
  // Lado derecho curvo con más puntos para mayor definición
  shieldShape.bezierCurveTo(1.3, 1.4, 1.4, 1.2, 1.45, 1.0);
  shieldShape.bezierCurveTo(1.5, 0.7, 1.5, 0.3, 1.5, 0);
  shieldShape.bezierCurveTo(1.5, -0.4, 1.45, -0.8, 1.35, -1.2);
  shieldShape.bezierCurveTo(1.2, -1.6, 0.9, -1.9, 0.5, -2.2);
  shieldShape.bezierCurveTo(0.3, -2.3, 0.15, -2.4, 0, -2.5);
  
  // Lado izquierdo curvo (simétrico) con más puntos
  shieldShape.bezierCurveTo(-0.15, -2.4, -0.3, -2.3, -0.5, -2.2);
  shieldShape.bezierCurveTo(-0.9, -1.9, -1.2, -1.6, -1.35, -1.2);
  shieldShape.bezierCurveTo(-1.45, -0.8, -1.5, -0.4, -1.5, 0);
  shieldShape.bezierCurveTo(-1.5, 0.3, -1.5, 0.7, -1.45, 1.0);
  shieldShape.bezierCurveTo(-1.4, 1.2, -1.3, 1.4, -1.2, 1.5);
  
  // Configuración de extrusión para dar profundidad y bordes suaves
  const extrudeSettings = {
    steps: 24, // Más subdivisiones para suavidad (antes 16)
    depth: 0.15,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.045,
    bevelOffset: 0,
    bevelSegments: 32 // Mucho más suave (antes 24)
  };
  
  // Crear el escudo base
  const baseShield = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shieldShape, extrudeSettings),
    shieldMaterial
  );
  baseShield.castShadow = true;
  baseShield.receiveShadow = true;
  shieldGroup.add(baseShield);
  
  // Crear un borde metálico
  const borderShape = new THREE.Shape();
  
  // Parte superior del borde con más definición
  borderShape.moveTo(-1.25, 1.55);
  borderShape.lineTo(1.25, 1.55);
  
  // Lado derecho curvo con más puntos para mayor definición
  borderShape.bezierCurveTo(1.35, 1.45, 1.42, 1.25, 1.48, 1.05);
  borderShape.bezierCurveTo(1.53, 0.75, 1.55, 0.35, 1.55, 0);
  borderShape.bezierCurveTo(1.55, -0.45, 1.52, -0.85, 1.42, -1.25);
  borderShape.bezierCurveTo(1.25, -1.65, 0.95, -2.0, 0.52, -2.3);
  borderShape.bezierCurveTo(0.32, -2.4, 0.16, -2.5, 0, -2.6);
  
  // Lado izquierdo curvo (simétrico) con más puntos
  borderShape.bezierCurveTo(-0.16, -2.5, -0.32, -2.4, -0.52, -2.3);
  borderShape.bezierCurveTo(-0.95, -2.0, -1.25, -1.65, -1.42, -1.25);
  borderShape.bezierCurveTo(-1.52, -0.85, -1.55, -0.45, -1.55, 0);
  borderShape.bezierCurveTo(-1.55, 0.35, -1.53, 0.75, -1.48, 1.05);
  borderShape.bezierCurveTo(-1.42, 1.25, -1.35, 1.45, -1.25, 1.55);
  
  // Crear un agujero con la forma del escudo (también con más puntos)
  const holeShape = new THREE.Shape();
  
  // Parte superior del agujero
  holeShape.moveTo(-1.15, 1.45);
  holeShape.lineTo(1.15, 1.45);
  
  // Lado derecho curvo con más definición
  holeShape.bezierCurveTo(1.25, 1.35, 1.32, 1.15, 1.38, 0.95);
  holeShape.bezierCurveTo(1.43, 0.65, 1.45, 0.35, 1.45, 0);
  holeShape.bezierCurveTo(1.45, -0.4, 1.4, -0.75, 1.32, -1.15);
  holeShape.bezierCurveTo(1.15, -1.55, 0.85, -1.85, 0.48, -2.15);
  holeShape.bezierCurveTo(0.28, -2.28, 0.14, -2.35, 0, -2.4);
  
  // Lado izquierdo curvo (simétrico) con más definición
  holeShape.bezierCurveTo(-0.14, -2.35, -0.28, -2.28, -0.48, -2.15);
  holeShape.bezierCurveTo(-0.85, -1.85, -1.15, -1.55, -1.32, -1.15);
  holeShape.bezierCurveTo(-1.4, -0.75, -1.45, -0.4, -1.45, 0);
  holeShape.bezierCurveTo(-1.45, 0.35, -1.43, 0.65, -1.38, 0.95);
  holeShape.bezierCurveTo(-1.32, 1.15, -1.25, 1.35, -1.15, 1.45);
  
  // Añadir el agujero a la forma del borde
  borderShape.holes.push(holeShape);
  
  // Crear el borde
  const border = new THREE.Mesh(
    new THREE.ExtrudeGeometry(borderShape, {
      steps: 20, // Más subdivisiones (antes 12)
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.022,
      bevelOffset: 0,
      bevelSegments: 24 // Mucho más suave (antes 18)
    }),
    accentMaterial
  );
  border.position.z = -0.025;
  border.castShadow = true;
  border.receiveShadow = true;
  shieldGroup.add(border);
  

  
  // Crear el texto "PÓLIZA" con relieve y material metálico
  // Esta función no se utiliza actualmente, pero podría ser útil en el futuro
  // const createTextMesh = (text: string, size = 0.27, height = 0.07, color = TEXT_COLOR) => {
  //   return new Promise<THREE.Mesh>((resolve, reject) => {
  //     const fontLoader = new FontLoader();
  //     fontLoader.load(
  //       'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/fonts/helvetiker_bold.typeface.json',
  //       (font) => {
  //         // Usar la clase importada TextGeometry, no THREE.TextGeometry
  //         const geometry = new TextGeometry(text, {
  //           font: font as Font,
  //           size,
  //           depth: 0.03, // Cambiado de 'height' a 'depth' para evitar error de tipo
  //           curveSegments: 8,
  //           bevelEnabled: true,
  //           bevelThickness: 0.008,
  //           bevelSize: 0.006,
  //           bevelOffset: 0,
  //           bevelSegments: 4,
  //         });
  //         geometry.center();
  //         const mat = new THREE.MeshPhysicalMaterial({
  //           color,
  //           metalness: 1.0,
  //           roughness: 0.23,
  //           envMapIntensity: 2.2,
  //           clearcoat: 0.7,
  //           clearcoatRoughness: 0.06,
  //           reflectivity: 0.85,
  //           sheen: 1.0,
  //           sheenColor: new THREE.Color(0xffffff),
  //         });
  //         const mesh = new THREE.Mesh(geometry, mat);
  //         mesh.position.set(0, 0, 0.21);
  //         mesh.castShadow = true;
  //         mesh.receiveShadow = true;
  //         resolve(mesh);
  //       },
  //       undefined,
  //       (err) => reject(err)
  //     );
  //   });
  // };

  // Crear detalles decorativos sutiles (remaches en el borde)
  const rivetMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 1.0,
    roughness: 0.28, // Más difuso
    envMapIntensity: 0.55,
    reflectivity: 0.7,
  });
  for (let i = 0; i < 20; i++) { // Aumentado de 14 a 20 remaches para mejor definición
    const angle = (i / 20) * Math.PI * 2;
    const rivet = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 16, 16),
      rivetMaterial
    );
    rivet.position.set(Math.sin(angle) * 1.17, Math.cos(angle) * 1.17 + 0.02, 0.14);
    rivet.castShadow = true;
    shieldGroup.add(rivet);
  }

  // Añadir el escudo a la escena
  shieldGroup.rotation.x = -0.2;
  // Al cargar, inclina el escudo un poco de lado (eje Y)
  shieldGroup.rotation.set(0, -0.5, 0);
  shieldGroup.scale.set(0.92, 0.92, 0.92); // Escudo grande pero sin cortes arriba/abajo
  scene.add(shieldGroup);
  shield = shieldGroup;
};

// Variables para controlar la rotación
let isAutoRotating = true;
let lastScrollY = window.scrollY;

// Función para manejar el hover
const handleMouseEnter = () => {
  isAutoRotating = false;
};

const handleMouseLeave = () => {
  isAutoRotating = true;
};

// Función para manejar el scroll
const handleScroll = () => {
  const currentScrollY = window.scrollY;
  const scrollDelta = currentScrollY - lastScrollY;
  
  // Ajustar la velocidad de rotación basada en el scroll
  if (Math.abs(scrollDelta) > 5) {
    // rotationSpeed = scrollDelta * 0.001; // Convertir el scroll a rotación
  } else {
    // Reducir gradualmente la velocidad si no hay scroll significativo
    // rotationSpeed *= 0.95;
  }
  
  lastScrollY = currentScrollY;
};

const animate = () => {
  frameId = requestAnimationFrame(animate);
  
  // Asegura que las variables críticas estén inicializadas antes de usarlas
  if (!scene || !camera || !renderer) return;

  // Solo rota sobre el eje Y (vertical central)
  if (shield && isAutoRotating) {
    shield.rotation.y += 0.007;
  }

  // Actualizar controles (para efecto de amortiguación)
  if (controls) {
    controls.update();
  }
  
  // Renderizar la escena
  renderer.render(scene, camera);
};

const onWindowResize = () => {
  if (!container.value) return;
  
  const width = container.value.clientWidth;
  const height = container.value.clientHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

const cleanup = () => {
  if (frameId) {
    cancelAnimationFrame(frameId);
  }
  
  window.removeEventListener('resize', onWindowResize);
  window.removeEventListener('scroll', handleScroll);
  
  if (container.value) {
    container.value.removeEventListener('mouseenter', handleMouseEnter);
    container.value.removeEventListener('mouseleave', handleMouseLeave);
    
    if (renderer) {
      container.value.removeChild(renderer.domElement);
    }
  }
  
  // Liberar memoria
  if (scene) {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry) {
          object.geometry.dispose();
        }
        
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
    });
  }
};

onMounted(() => {
  init();
  
  // Añadir event listeners para hover y scroll
  if (container.value) {
    container.value.addEventListener('mouseenter', handleMouseEnter);
    container.value.addEventListener('mouseleave', handleMouseLeave);
  }
  
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  // Eliminar event listeners
  if (container.value) {
    container.value.removeEventListener('mouseenter', handleMouseEnter);
    container.value.removeEventListener('mouseleave', handleMouseLeave);
  }
  
  window.removeEventListener('scroll', handleScroll);
  
  cleanup();
});
</script>

<style scoped>
.shield-container {
  height: 520px;
  min-height: 350px;
  max-width: 100vw;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  height: 420px;
  min-height: 300px;
  max-width: 100vw;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 200px;
  max-height: 400px;
  overflow: hidden;
  cursor: pointer; /* Indicar que es interactivo */
}
</style>
