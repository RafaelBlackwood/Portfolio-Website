import React, { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// ─── D6 Face Texture ──────────────────────────────────────────────────────────
function makeDiceTexture(value, size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Dark gem background
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#1a0830');
  grad.addColorStop(0.5, '#0a0418');
  grad.addColorStop(1, '#060210');
  ctx.fillStyle = grad;
  ctx.roundRect(4, 4, size - 8, size - 8, size * 0.1);
  ctx.fill();

  // Border glow
  ctx.strokeStyle = '#9070e0';
  ctx.lineWidth = 6;
  ctx.roundRect(4, 4, size - 8, size - 8, size * 0.1);
  ctx.stroke();

  // Inner highlight
  ctx.strokeStyle = 'rgba(180,150,255,0.3)';
  ctx.lineWidth = 2;
  ctx.roundRect(12, 12, size - 24, size - 24, size * 0.08);
  ctx.stroke();

  const dotR = size * 0.085;
  const positions = {
    1: [[0.5, 0.5]],
    2: [[0.3, 0.3], [0.7, 0.7]],
    3: [[0.3, 0.3], [0.5, 0.5], [0.7, 0.7]],
    4: [[0.3, 0.3], [0.7, 0.3], [0.3, 0.7], [0.7, 0.7]],
    5: [[0.3, 0.3], [0.7, 0.3], [0.5, 0.5], [0.3, 0.7], [0.7, 0.7]],
    6: [[0.3, 0.22], [0.7, 0.22], [0.3, 0.5], [0.7, 0.5], [0.3, 0.78], [0.7, 0.78]],
  };
  (positions[value] || positions[1]).forEach(([fx, fy]) => {
    const x = fx * size, y = fy * size;
    const dg = ctx.createRadialGradient(x - dotR * 0.3, y - dotR * 0.3, 0, x, y, dotR);
    dg.addColorStop(0, '#ffffff');
    dg.addColorStop(0.6, '#e8d8ff');
    dg.addColorStop(1, '#a090e0');
    ctx.beginPath();
    ctx.arc(x, y, dotR, 0, Math.PI * 2);
    ctx.fillStyle = dg;
    ctx.fill();
  });

  return new THREE.CanvasTexture(canvas);
}

// ─── D20 Face Texture (triangular face with number) ──────────────────────────
function makeD20FaceTexture(value, size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);

  // Draw equilateral triangle filling the canvas
  const pad = 10;
  const cx = size / 2;
  const tip = { x: cx, y: pad };
  const bl  = { x: pad, y: size - pad };
  const br  = { x: size - pad, y: size - pad };

  // Rich dark gem background
  const grad = ctx.createRadialGradient(cx, size * 0.6, 0, cx, size * 0.6, size * 0.7);
  grad.addColorStop(0, '#2a0a10');
  grad.addColorStop(0.4, '#1a0520');
  grad.addColorStop(0.8, '#100315');
  grad.addColorStop(1, '#08010e');

  ctx.beginPath();
  ctx.moveTo(tip.x, tip.y);
  ctx.lineTo(br.x, br.y);
  ctx.lineTo(bl.x, bl.y);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Glowing red/orange edge
  ctx.beginPath();
  ctx.moveTo(tip.x, tip.y);
  ctx.lineTo(br.x, br.y);
  ctx.lineTo(bl.x, bl.y);
  ctx.closePath();
  ctx.strokeStyle = '#d04010';
  ctx.lineWidth = 8;
  ctx.stroke();

  // Inner edge highlight (thinner, brighter)
  ctx.beginPath();
  ctx.moveTo(tip.x, tip.y + 6);
  ctx.lineTo(br.x - 5, br.y - 4);
  ctx.lineTo(bl.x + 5, bl.y - 4);
  ctx.closePath();
  ctx.strokeStyle = 'rgba(255,120,40,0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Iridescent inner shimmer (blue-green hints)
  const shimmer = ctx.createLinearGradient(pad, pad, size - pad, size - pad);
  shimmer.addColorStop(0, 'rgba(0,80,180,0.12)');
  shimmer.addColorStop(0.3, 'rgba(0,160,80,0.08)');
  shimmer.addColorStop(0.7, 'rgba(180,0,60,0.08)');
  shimmer.addColorStop(1, 'rgba(0,60,160,0.12)');

  ctx.beginPath();
  ctx.moveTo(tip.x, tip.y);
  ctx.lineTo(br.x, br.y);
  ctx.lineTo(bl.x, bl.y);
  ctx.closePath();
  ctx.fillStyle = shimmer;
  ctx.fill();

  // Number — cream/yellow, crisp
  const numY = size * 0.63;
  const fontSize = size * 0.36;
  ctx.font = `900 ${fontSize}px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Dark outline for legibility
  ctx.strokeStyle = '#1a0010';
  ctx.lineWidth = fontSize * 0.12;
  ctx.lineJoin = 'round';
  ctx.strokeText(String(value), cx, numY);

  // Crisp filled text — no blur/shadow
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff5b0';
  ctx.fillText(String(value), cx, numY);

  // Thin highlight pass
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${fontSize * 0.92}px Georgia, serif`;
  ctx.fillText(String(value), cx, numY);

  return new THREE.CanvasTexture(canvas);
}

// ─── Build proper D20 icosahedron geometry with per-face UVs ─────────────────
function buildD20Mesh(radius) {
  // Icosahedron vertices
  const t = (1 + Math.sqrt(5)) / 2;
  const verts = [
    [-1,  t,  0], [ 1,  t,  0], [-1, -t,  0], [ 1, -t,  0],
    [ 0, -1,  t], [ 0,  1,  t], [ 0, -1, -t], [ 0,  1, -t],
    [ t,  0, -1], [ t,  0,  1], [-t,  0, -1], [-t,  0,  1],
  ].map(v => new THREE.Vector3(...v).normalize().multiplyScalar(radius));

  // 20 triangular faces
  const faces = [
    [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
    [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
    [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
    [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
  ];

  // D20 face values (standard arrangement)
  const faceValues = [
    1,2,3,4,5,6,7,8,9,10,
    11,12,13,14,15,16,17,18,19,20
  ];

  const geo = new THREE.BufferGeometry();
  const positions = [];
  const uvs = [];
  const materialIndices = [];

  faces.forEach((face, fi) => {
    const [a, b, c] = face.map(i => verts[i]);
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
    // UV: map the triangle to fill the texture square
    uvs.push(0.5, 1.0,  1.0, 0.0,  0.0, 0.0);
    materialIndices.push(fi);
  });

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeVertexNormals();

  // Build groups so each face uses its own material
  for (let i = 0; i < 20; i++) {
    geo.addGroup(i * 3, 3, i);
  }

  const materials = faceValues.map(v => {
    const tex = makeD20FaceTexture(v);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    return new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.2,
      metalness: 0.4,
      emissive: new THREE.Color(0x200408),
      emissiveIntensity: 0.3,
      side: THREE.FrontSide,
    });
  });

  return new THREE.Mesh(geo, materials);
}

// ─── Face normal detection for D20 ───────────────────────────────────────────
const t = (1 + Math.sqrt(5)) / 2;
const ICO_VERTS_RAW = [
  [-1,  t,  0], [ 1,  t,  0], [-1, -t,  0], [ 1, -t,  0],
  [ 0, -1,  t], [ 0,  1,  t], [ 0, -1, -t], [ 0,  1, -t],
  [ t,  0, -1], [ t,  0,  1], [-t,  0, -1], [-t,  0,  1],
];
const ICO_FACES = [
  [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
  [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
  [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
  [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
];
const D20_FACE_VALUES = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

const FACE_NORMALS_D20 = ICO_FACES.map(([a,b,c]) => {
  const va = new THREE.Vector3(...ICO_VERTS_RAW[a]).normalize();
  const vb = new THREE.Vector3(...ICO_VERTS_RAW[b]).normalize();
  const vc = new THREE.Vector3(...ICO_VERTS_RAW[c]).normalize();
  return va.add(vb).add(vc).normalize();
});

function getTopFaceD20(quaternion) {
  const up = new THREE.Vector3(0, 1, 0);
  let bestVal = 1, bestDot = -Infinity;
  FACE_NORMALS_D20.forEach((n, i) => {
    const world = n.clone().applyQuaternion(quaternion);
    const dot = world.dot(up);
    if (dot > bestDot) { bestDot = dot; bestVal = D20_FACE_VALUES[i]; }
  });
  return bestVal;
}

// ─── D6 face value detection ──────────────────────────────────────────────────
const D6_FACE_NORMALS = [
  new THREE.Vector3( 1,  0,  0),
  new THREE.Vector3(-1,  0,  0),
  new THREE.Vector3( 0,  1,  0),
  new THREE.Vector3( 0, -1,  0),
  new THREE.Vector3( 0,  0,  1),
  new THREE.Vector3( 0,  0, -1),
];
// BoxGeometry applies the D6 materials in this same face-normal order.
const D6_FACE_VALUES = [1, 2, 3, 4, 5, 6];

function getTopFaceD6(quaternion) {
  const up = new THREE.Vector3(0, 1, 0);
  let best = -1, bestDot = -Infinity;
  D6_FACE_NORMALS.forEach((n, i) => {
    const world = n.clone().applyQuaternion(quaternion);
    const dot = world.dot(up);
    if (dot > bestDot) { bestDot = dot; best = i; }
  });
  return D6_FACE_VALUES[best];
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PhysicsDiceRoller({ count = 1, isD20 = false, onResult, onDone, accentColor = '#a080ff' }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const onResultRef = useRef(onResult);
  const onDoneRef = useRef(onDone);

  onResultRef.current = onResult;
  onDoneRef.current = onDone;

  const run = useCallback(() => {
    const el = mountRef.current;
    if (!el) return;
    el.textContent = '';
    const W = el.clientWidth || 320;
    const H = el.clientHeight || 220;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 200);
    camera.position.set(0, 14, 12);
    camera.lookAt(0, 0, 0);

    // Lighting
    scene.add(new THREE.AmbientLight(0x604080, 1.5));
    const dir = new THREE.DirectionalLight(0xffffff, 3);
    dir.position.set(6, 18, 10);
    dir.castShadow = true;
    dir.shadow.mapSize.set(2048, 2048);
    scene.add(dir);
    const fill = new THREE.PointLight(0xff4010, 1.2, 40);
    fill.position.set(-6, 4, 6);
    scene.add(fill);
    const rim = new THREE.PointLight(0x4060ff, 0.8, 40);
    rim.position.set(6, 2, -6);
    scene.add(rim);

    // Floor
    const floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshStandardMaterial({ color: 0x080614, roughness: 0.95, metalness: 0.05, transparent: true, opacity: 0.8 })
    );
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -2.5;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);
    scene.add(new THREE.GridHelper(30, 30, 0x2a1060, 0x120830));

    // Physics
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -30, 0) });
    world.broadphase = new CANNON.NaiveBroadphase();
    world.allowSleep = true;
    world.sleepSpeedLimit = 0.2;
    world.sleepTimeLimit = 0.5;

    const diceMat = new CANNON.Material('dice');
    const wallMat = new CANNON.Material('wall');
    world.addContactMaterial(new CANNON.ContactMaterial(diceMat, wallMat, { friction: 0.7, restitution: 0.1 }));
    world.addContactMaterial(new CANNON.ContactMaterial(diceMat, diceMat, { friction: 0.5, restitution: 0.05 }));

    // Floor body
    const floorBody = new CANNON.Body({ mass: 0, material: wallMat });
    floorBody.addShape(new CANNON.Plane());
    floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    floorBody.position.set(0, -2.5, 0);
    world.addBody(floorBody);

    // Walls
    [
      { pos: [0, 5, -8],  rot: [0, 0, 0] },
      { pos: [0, 5,  8],  rot: [0, Math.PI, 0] },
      { pos: [-8, 5, 0],  rot: [0,  Math.PI/2, 0] },
      { pos: [ 8, 5, 0],  rot: [0, -Math.PI/2, 0] },
    ].forEach(({ pos, rot }) => {
      const b = new CANNON.Body({ mass: 0, material: wallMat });
      b.addShape(new CANNON.Plane());
      b.position.set(...pos);
      b.quaternion.setFromEuler(...rot);
      world.addBody(b);
    });

    // Create dice
    const diceRadius = isD20 ? 1.4 : 1.1;
    const spread = Math.min(count - 1, 3) * 2.0;
    const dice = [];

    for (let i = 0; i < count; i++) {
      let mesh;
      if (isD20) {
        mesh = buildD20Mesh(diceRadius);
      } else {
        const geo = new THREE.BoxGeometry(diceRadius * 2, diceRadius * 2, diceRadius * 2);
        const mats = [1,2,3,4,5,6].map(v => new THREE.MeshStandardMaterial({
          map: makeDiceTexture(v, 256),
          roughness: 0.25, metalness: 0.3,
          emissive: new THREE.Color(0x200830), emissiveIntensity: 0.15,
        }));
        mesh = new THREE.Mesh(geo, mats);
      }
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      const shape = isD20
        ? new CANNON.Sphere(diceRadius * 0.95)
        : new CANNON.Box(new CANNON.Vec3(diceRadius, diceRadius, diceRadius));
      const body = new CANNON.Body({
        mass: 0.5,
        material: diceMat,
        linearDamping: 0.45,
        angularDamping: 0.45,
        allowSleep: true,
        sleepSpeedLimit: 0.1,
        sleepTimeLimit: 0.3,
      });
      body.addShape(shape);

      const sx = (i / Math.max(count - 1, 1) - 0.5) * spread + (Math.random() - 0.5) * 1.0;
      body.position.set(sx, 10 + Math.random() * 4, (Math.random() - 0.5) * 2);
      // Single strong throw — no repeated bouncing
      body.velocity.set(
        (Math.random() - 0.5) * 4,
        -3,
        (Math.random() - 0.5) * 3,
      );
      body.angularVelocity.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
      );
      world.addBody(body);
      dice.push({ mesh, body, settled: false });
    }

    let raf;
    let resultFired = false;
    let doneFired = false;
    const fixedStep = 1 / 120;
    let lastTime = performance.now();
    let totalTime = 0;

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      totalTime += dt;

      world.step(fixedStep, dt, 4);

      dice.forEach(({ mesh, body }) => {
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
      });

      if (!resultFired && totalTime > 1.5) {
        const allSleeping = dice.every(d =>
          d.body.sleepState === CANNON.Body.SLEEPING ||
          (d.body.velocity.length() < 0.3 && d.body.angularVelocity.length() < 0.3)
        );
        if (allSleeping || totalTime > 5) {
          resultFired = true;

          // Freeze all dice in place
          dice.forEach(d => {
            d.body.velocity.set(0, 0, 0);
            d.body.angularVelocity.set(0, 0, 0);
            d.body.type = CANNON.Body.STATIC;
          });

          const results = dice.map(({ mesh }) => {
            const q = new THREE.Quaternion(
              mesh.quaternion.x, mesh.quaternion.y,
              mesh.quaternion.z, mesh.quaternion.w
            );
            return isD20 ? getTopFaceD20(q) : getTopFaceD6(q);
          });
          onResultRef.current?.(results);

          const doneTimer = window.setTimeout(() => {
            if (!doneFired) { doneFired = true; onDoneRef.current?.(); }
          }, 900);
          if (sceneRef.current) sceneRef.current.doneTimer = doneTimer;
        }
      }

      renderer.render(scene, camera);
    };

    raf = requestAnimationFrame(tick);
    sceneRef.current = { renderer, raf, canvas: renderer.domElement };
  }, [count, isD20]);

  useEffect(() => {
    run();
    return () => {
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.raf);
        if (sceneRef.current.doneTimer) {
          window.clearTimeout(sceneRef.current.doneTimer);
        }
        sceneRef.current.renderer.dispose();
        if (sceneRef.current.canvas?.parentNode) {
          sceneRef.current.canvas.parentNode.removeChild(sceneRef.current.canvas);
        }
        sceneRef.current = null;
      }
    };
  }, [run]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', background: 'transparent', color: accentColor }} />;
}
