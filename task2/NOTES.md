## File Sizes

- **Original (model.glb):** 22.7 KB
- **Draco-Compressed (model-compressed.glb):** 8.2 KB


## What Lazy Loading Three.js Prevents and Why It Matters

Three.js is a large library (around 600 KB). If we load it normally, it increases the main bundle size and slows down the initial page loading. By using lazy loading, it loads only when the 3D component is required. This improves first load time, makes the website interactive faster, and gives better overall performance.

## What Would Break if You Skipped dispose() in a Long-Running Session

If we do not use dispose(), the geometries, materials, textures, and renderer will not be cleared from memory. This causes GPU and RAM memory leaks. Over time, the memory usage keeps increasing, which reduces performance, causes frame drops, and may even crash the browser tab in long-running sessions or repeated component mounting.
