# Task Progress

## UI Bug Fixes & UX Automation

- [x] Read all relevant source files
- [x] Fix 1: TopScreen - Fix H1 text overflow on mobile (adjusted font sizes: text-xl on mobile, added px-2 sm:px-4)
- [x] Fix 2: FaceAnalysis - Removed all camera functionality (videoRef, canvasRef, cameraActive, streamRef, handleCameraStart, handleCapture, stopCamera), kept only "画像をアップロード" button
- [x] Fix 3: app/page.tsx - Verified auto-skip logic: handleFaceAnalysisComplete already sets step("loading") and calls generateResult() directly
- [x] Fix 4: app/api/generate/route.ts - Added unordered list constraint to system prompt's 第3部 section
- [ ] Test: Run `npm run dev` and verify all fixes
- [ ] Git commit and push
