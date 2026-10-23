---
name: creative-3d-interactive-web
description: Procedures and best practices for building interactive 3D WebGL scenes, Three.js canvases, floating geometric meshes, particle systems, dynamic lighting, and mouse-parallax in modern React web applications.
---

# Creative 3D Interactive WebGL Skill

This skill provides step-by-step methodologies for integrating interactive 3D elements into modern web applications using Three.js and WebGL.

---

## 1. Architecture of a Three.js React Component

### Standard Setup Lifecycle:
1. **Scene Creation**: `const scene = new THREE.Scene();`
2. **Perspective Camera**:
   ```ts
   const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
   camera.position.z = 4;
   ```
3. **WebGL Renderer**:
   ```ts
   const renderer = new THREE.WebGLRenderer({
     canvas: canvasRef.current,
     alpha: true,
     antialias: true,
     powerPreference: 'high-performance'
   });
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
   renderer.setSize(width, height);
   ```
4. **Lighting Setup**:
   - Ambient light for base illumination: `new THREE.AmbientLight(0xffffff, 0.7)`
   - Directional light for depth & highlights: `new THREE.DirectionalLight(primaryColor, 1.5)`
   - Point light for specular glints: `new THREE.PointLight(accentColor, 2, 10)`
5. **Geometry & Materials**:
   - `MeshPhysicalMaterial` or `MeshStandardMaterial` for realistic surface response.
   - Iridescent or glassmorphic parameters (`roughness: 0.15`, `metalness: 0.2`, `clearcoat: 0.8`).
6. **Animation Loop (`requestAnimationFrame`)**:
   - Smooth rotation: `mesh.rotation.y += 0.005;`
   - Mouse target lerping:
     ```ts
     currentMouseX += (targetMouseX - currentMouseX) * 0.05;
     currentMouseY += (targetMouseY - currentMouseY) * 0.05;
     group.rotation.x = currentMouseY * 0.3;
     group.rotation.y = currentMouseX * 0.3;
     ```
7. **Cleanup (Mandatory)**:
   - Cancel `requestAnimationFrame`.
   - Call `geometry.dispose()`, `material.dispose()`, and `renderer.dispose()`.
   - Remove event listeners and disconnect `ResizeObserver`.

---

## 2. Best-Practice Patterns

### A. Floating Polyhedral Orbs
- Use `IcosahedronGeometry(radius, detail)` or `TorusKnotGeometry` with smooth shading.
- Wireframe accents layered over solid meshes create a high-tech architectural aesthetic.

### B. Dynamic Particle Fields
- Use `BufferGeometry` with `Float32Array` positions for 500–2,000 particles.
- Render via `Points` with `PointsMaterial({ size, transparent, opacity: 0.6, blending: THREE.AdditiveBlending })`.

### C. Responsive Canvas Sizing
- Never assume full window width. Attach a `ResizeObserver` to the parent container:
  ```ts
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      if (width && height) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    }
  });
  resizeObserver.observe(containerRef.current);
  ```

---

## 3. Performance & Ergonomics Checklist
- [ ] Render loop is paused or low-power when tab is inactive (`document.hidden`).
- [ ] Pixel ratio capped at `Math.min(window.devicePixelRatio, 2)` to avoid GPU strain on Retina 3x displays.
- [ ] Pointer events set to `pointer-events: none` if canvas is used as an ambient backdrop.
- [ ] Touch gestures supported via normalized pointer coordinates.
