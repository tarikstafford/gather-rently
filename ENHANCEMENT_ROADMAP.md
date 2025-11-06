# Rently 2D Enhancement Roadmap

## Overview
This roadmap focuses on enhancing the current 2D platform with high-impact features that improve user experience, increase engagement, and provide enterprise value - all while maintaining the proven performance and accessibility of the 2D architecture.

**Risk Level:** Low
**Expected Impact:** High

---

## Phase 1: Core Collaboration Features

### 1.1 Screen Sharing
**Problem:** Users can't present or collaborate on documents/code
**Solution:** Agora screen sharing integration

**Implementation:**
- Add screen share track to Agora client
- Display shared screen in modal overlay or dedicated "presentation mode"
- Only one person can share at a time per proximity group
- Toggle button in video bar

**Files to modify:**
- `frontend/utils/video-chat/video-chat.ts` - Add `startScreenShare()`, `stopScreenShare()`
- `frontend/components/VideoChat/VideoBar.tsx` - Add screen share button
- `frontend/components/VideoChat/ScreenShareModal.tsx` - New component for viewing

**Success Metrics:**
- 50%+ of sessions use screen sharing
- Average screen share duration: 5+ minutes

---

### 1.2 Persistent Whiteboards
**Problem:** No way to brainstorm, sketch ideas, or leave notes
**Solution:** Interactive whiteboard objects in virtual space

**Implementation:**
- New special tile type: "whiteboard"
- Click whiteboard → opens canvas modal (Excalidraw or Tldraw integration)
- Drawings saved to Supabase realtime database
- All players in room see updates in real-time
- Support for text, shapes, freehand drawing

**Files to modify:**
- `frontend/utils/pixi/types.ts` - Add `WhiteboardData` type
- `frontend/utils/pixi/zod.ts` - Add whiteboard schema
- `backend/src/sockets/socket-types.ts` - Add whiteboard events
- `backend/src/sockets/sockets.ts` - Handle whiteboard sync
- `frontend/components/Whiteboard/WhiteboardModal.tsx` - New component

**Database Schema:**
```sql
CREATE TABLE whiteboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  realm_id UUID REFERENCES realms(id) ON DELETE CASCADE,
  room_index INTEGER NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  canvas_data JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Success Metrics:**
- 30%+ of realms create at least one whiteboard
- Average 3+ collaborators per whiteboard session

---

### 1.3 Sticky Notes & Text Objects
**Problem:** No way to leave async messages or reminders
**Solution:** Placeable text objects in the world

**Implementation:**
- New special tile: "sticky note"
- Click to add/edit text (max 200 chars)
- Color-coded (yellow, blue, green, pink)
- Visible to all users in room
- Saved to realm data (no separate DB needed)

**Files to modify:**
- `frontend/utils/pixi/types.ts` - Add `StickyNote` type
- `frontend/app/editor/SpecialTiles.tsx` - Add sticky note tool
- `frontend/utils/pixi/PlayApp.ts` - Render sticky notes
- `frontend/components/StickyNoteModal.tsx` - Edit modal

**Success Metrics:**
- Average 5+ sticky notes per active realm
- 70%+ user awareness of feature

---

## Phase 2: Enhanced Map Creation

### 2.1 AI Map Templates Gallery
**Problem:** Users don't know what to prompt the AI with
**Solution:** Curated gallery of pre-made AI prompts

**Implementation:**
- Create 20 template prompts:
  - "Modern tech startup office with standing desks"
  - "Cozy coffee shop with lounge seating"
  - "Conference center with multiple meeting rooms"
  - "Zen meditation space with garden"
  - "Collaborative workspace with breakout areas"
- Gallery UI on create realm modal
- One-click generation from template

**Files to modify:**
- `frontend/app/manage/page.tsx` - Add template gallery
- `frontend/utils/aiMapTemplates.ts` - New file with templates
- `frontend/components/TemplateGallery.tsx` - New component

**Success Metrics:**
- 60%+ of AI-generated maps use templates
- Reduced abandonment on map creation flow

---

### 2.2 Enhanced Procedural Generator
**Problem:** Current procedural maps are basic
**Solution:** Add themes, customization, and better layouts

**Implementation:**
- Theme selection: Modern Office, Creative Studio, Campus, Lounge
- Configurable parameters:
  - Room count (3-15)
  - Size preference (cozy/medium/spacious)
  - Density (sparse/normal/packed)
  - Color palette selection
- Better hallway connections (avoid dead ends)
- Add outdoor spaces (gardens, patios)

**Files to modify:**
- `frontend/utils/mapGenerator.ts` - Enhanced algorithm
- `frontend/components/ProceduralMapModal.tsx` - Config UI
- Add room type generators for each theme

**Success Metrics:**
- 40%+ of realms use procedural generation
- Higher satisfaction scores for generated maps

---

### 2.3 Map Remix Feature
**Problem:** Starting from scratch is intimidating
**Solution:** Allow users to copy and modify existing maps

**Implementation:**
- "Duplicate Realm" button in manage dashboard
- Creates copy with new share_id
- Option to remix community templates
- Public template gallery (opt-in for realm owners)

**Files to modify:**
- `frontend/app/manage/page.tsx` - Add duplicate button
- `frontend/utils/supabase/duplicateRealm.ts` - Server action
- `frontend/app/templates/page.tsx` - New public gallery page

**Database Schema:**
```sql
ALTER TABLE realms ADD COLUMN is_template BOOLEAN DEFAULT FALSE;
ALTER TABLE realms ADD COLUMN template_name TEXT;
ALTER TABLE realms ADD COLUMN template_description TEXT;
ALTER TABLE realms ADD COLUMN template_thumbnail TEXT;
```

**Success Metrics:**
- 25%+ of new realms created via remix
- 100+ community templates within 3 months

---

### 2.4 Import/Export Maps
**Problem:** Can't backup or share maps outside platform
**Solution:** JSON export/import functionality

**Implementation:**
- Export button downloads realm JSON
- Import uploads JSON and validates schema
- Useful for backups and cross-account transfers

**Files to modify:**
- `frontend/app/editor/[id]/page.tsx` - Add export button
- `frontend/app/manage/page.tsx` - Add import button
- Validation via existing Zod schemas

**Success Metrics:**
- Feature awareness: 50%+ of users
- Usage: 10%+ export at least once

---

## Phase 3: Mobile Experience

### 3.1 Mobile-Optimized Controls
**Problem:** Current mobile experience is poor
**Solution:** Touch-optimized UI and virtual joystick

**Implementation:**
- Virtual joystick for movement (bottom-left)
- Larger tap targets for UI buttons
- Swipe to zoom (pinch gesture)
- Simplified UI for small screens
- Portrait mode support

**Files to modify:**
- `frontend/app/play/PlayClient.tsx` - Detect mobile
- `frontend/components/MobileControls/Joystick.tsx` - New component
- `frontend/utils/pixi/PlayApp.ts` - Touch event handlers
- `frontend/app/globals.css` - Mobile-specific styles

**Success Metrics:**
- Mobile session duration increases by 50%
- Mobile bounce rate decreases by 30%

---

### 3.2 Progressive Web App (PWA)
**Problem:** No app-like experience on mobile
**Solution:** Add PWA manifest and service worker

**Implementation:**
- Add web app manifest
- Service worker for offline assets
- "Add to Home Screen" prompt
- App icon and splash screen

**Files to modify:**
- `frontend/app/manifest.ts` - New manifest config
- `frontend/public/sw.js` - Service worker
- `frontend/app/layout.tsx` - Meta tags for PWA

**Success Metrics:**
- 20%+ of mobile users install PWA
- Improved load times on repeat visits

---

### 3.3 Mobile-Specific Features
**Problem:** Mobile users have different needs
**Solution:** Mobile-optimized features

**Implementation:**
- Audio-only mode (disable video on mobile)
- Data saver mode (lower quality textures)
- Battery saver mode (reduce frame rate to 30fps)
- Haptic feedback for interactions

**Files to modify:**
- `frontend/utils/video-chat/video-chat.ts` - Audio-only option
- `frontend/utils/pixi/PlayApp.ts` - Performance modes
- `frontend/components/Settings/MobileSettings.tsx` - New settings

**Success Metrics:**
- 40%+ mobile users enable audio-only
- Session length parity with desktop

---

## Phase 4: Enterprise Features

### 4.1 Custom Branding
**Problem:** Enterprises want their brand identity
**Solution:** White-label customization options

**Implementation:**
- Custom logo upload (replaces Rently logo)
- Brand color theming (primary, secondary colors)
- Custom domain support (CNAME)
- Remove "Powered by Rently" footer (enterprise plan)

**Files to modify:**
- `frontend/app/layout.tsx` - Dynamic logo/colors
- `frontend/tailwind.config.js` - Theme overrides
- Database: Add `branding` JSONB column to realms

**Database Schema:**
```sql
ALTER TABLE realms ADD COLUMN branding JSONB DEFAULT '{
  "logo": null,
  "primaryColor": "#301064",
  "secondaryColor": "#11BB8D",
  "customDomain": null
}'::jsonb;
```

**Success Metrics:**
- 50%+ of enterprise accounts customize branding
- Feature drives 20% pricing premium

---

### 4.2 Analytics Dashboard
**Problem:** Realm owners can't track usage
**Solution:** Usage analytics and insights

**Implementation:**
- Track metrics:
  - Daily/weekly active users
  - Peak concurrent users
  - Average session duration
  - Popular rooms (time spent)
  - Proximity group formations (collaboration metric)
- Visual dashboard with charts
- CSV export for further analysis

**Files to modify:**
- `backend/src/analytics/` - New analytics module
- `frontend/app/analytics/[id]/page.tsx` - Dashboard page
- Database: Analytics events table

**Database Schema:**
```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  realm_id UUID REFERENCES realms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL, -- 'join', 'leave', 'proximity_join', 'room_change'
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_realm_time ON analytics_events(realm_id, created_at);
```

**Success Metrics:**
- 80%+ of realm owners view analytics
- Average 2+ dashboard views per week

---

### 4.3 Admin Moderation Tools
**Problem:** Realm owners can't manage disruptive users
**Solution:** Kick, mute, and ban capabilities

**Implementation:**
- Player list UI showing all current users
- Kick button (immediate disconnect)
- Mute button (disable chat for user)
- Ban list (prevent rejoining)
- Audit log of moderation actions

**Files to modify:**
- `frontend/components/Admin/PlayerList.tsx` - New component
- `backend/src/sockets/sockets.ts` - Add kick/mute/ban events
- Database: Add `banned_users` table

**Database Schema:**
```sql
CREATE TABLE banned_users (
  realm_id UUID REFERENCES realms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  banned_by UUID REFERENCES auth.users(id),
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (realm_id, user_id)
);
```

**Success Metrics:**
- Feature awareness: 90%+ of realm owners
- Usage: 5-10% of realms use moderation tools

---

## Phase 5: Quality of Life Improvements

### 5.1 Improved Chat System
**Problem:** Current chat is basic (backend only, no UI)
**Solution:** Full-featured chat interface

**Implementation:**
- Chat panel UI (bottom-right, collapsible)
- Message history (last 50 messages)
- Typing indicators
- @mentions with autocomplete
- Emoji support
- Chat bubbles above characters (keep this)

**Files to modify:**
- `frontend/components/Chat/ChatPanel.tsx` - New component
- `backend/src/sockets/sockets.ts` - Enhanced message handling
- Store messages in session (in-memory, no DB persistence)

**Success Metrics:**
- Chat usage increases by 200%
- Average 10+ messages per session

---

### 5.2 Minimap
**Problem:** Hard to navigate large spaces
**Solution:** Real-time minimap showing room layout

**Implementation:**
- Top-right corner minimap (toggleable)
- Shows room boundaries, walls, other players
- Click to move camera (optional)
- Highlight current proximity groups

**Files to modify:**
- `frontend/components/Minimap/Minimap.tsx` - New component
- `frontend/utils/pixi/PlayApp.ts` - Generate minimap data
- Use Canvas2D for minimap rendering (lightweight)

**Success Metrics:**
- 60%+ of users enable minimap
- Reduces time to find other players by 40%

---

### 5.3 Quick Actions Menu
**Problem:** Features are buried in UI
**Solution:** Radial menu for common actions

**Implementation:**
- Hold Spacebar → radial menu appears
- Quick access to:
  - Wave/emote
  - Toggle mic/camera
  - Teleport to players
  - Open chat
  - Settings
- Keyboard shortcuts for power users

**Files to modify:**
- `frontend/components/QuickActions/RadialMenu.tsx` - New component
- `frontend/utils/pixi/PlayApp.ts` - Spacebar handler

**Success Metrics:**
- 40%+ of users discover and use quick actions
- Reduces clicks for common tasks by 50%

---

## Implementation Priority

### High Priority (Must-Have)
1. ✅ Screen Sharing (core collaboration need)
2. ✅ Persistent Whiteboards (differentiator)
3. ✅ Mobile-Optimized Controls (accessibility)
4. ✅ AI Map Templates Gallery (reduce friction)
5. ✅ Improved Chat System (basic communication)

### Medium Priority (Should-Have)
6. ✅ Analytics Dashboard (enterprise value)
7. ✅ Custom Branding (enterprise feature)
8. ✅ Enhanced Procedural Generator (user delight)
9. ✅ Admin Moderation Tools (safety)
10. ✅ Sticky Notes (async collaboration)

### Lower Priority (Nice-to-Have)
11. ✅ Minimap (navigation aid)
12. ✅ Map Remix Feature (community growth)
13. ✅ Quick Actions Menu (power users)
14. ✅ PWA Support (mobile experience)
15. ✅ Import/Export Maps (power users)

---


## Success Metrics

### User Engagement
- **Session Duration:** Increase from X to X+50% avg
- **Return Rate:** 60%+ weekly active users return
- **Feature Adoption:** 70%+ users try new features

### Enterprise Value
- **Custom Branding:** 50%+ of paid accounts customize
- **Analytics Usage:** 80%+ of realm owners check dashboard
- **Moderation:** Reduces support tickets by 30%

### Platform Growth
- **Mobile Users:** Increase from X% to X+20%
- **Template Usage:** 40%+ of realms use templates/remixes
- **Community Templates:** 100+ public templates

### Technical Performance
- **Load Time:** <3 seconds on avg internet
- **Frame Rate:** Maintain 60fps with all features
- **Mobile Performance:** 30fps minimum on mid-range phones

---

## Technical Debt to Address

### Quick Wins
1. **Add Error Boundaries:** Prevent full app crashes
2. **Implement Rate Limiting:** Prevent socket spam
3. **Add Profanity Filter:** Chat/realm names
4. **CSRF Protection:** Server actions
5. **Move Service Role to Backend:** Security issue

### Medium Effort
6. **Add Automated Testing:** Jest + Playwright
7. **Performance Monitoring:** Sentry integration
8. **CDN for Sprites:** Cloudflare/AWS CloudFront
9. **Database Indexing:** Optimize queries
10. **Code Documentation:** JSDoc comments

---

## Resource Requirements

### Tools & Services
- **Existing:** Supabase, Agora, Heroku, Vercel (no changes)
- **Optional:**
  - Sentry for error tracking
  - Cloudflare CDN for assets (free tier)
  - Excalidraw/Tldraw license if needed (check terms)

---

## Risk Mitigation

### Technical Risks
- **Screen sharing performance:** Test early, add quality settings
- **Whiteboard sync latency:** Use Supabase realtime, debounce updates
- **Mobile performance:** Progressive enhancement, fallback modes

### Product Risks
- **Feature bloat:** User test each feature, remove if <30% adoption
- **Increased complexity:** Maintain simple onboarding flow
- **Mobile experience:** Test on real devices early and often

### Business Risks
- **Development delays:** Build in 20% buffer time
- **User adoption:** Gradual rollout with beta testing
- **Support burden:** Create docs/tutorials for each feature

---

## Future Advanced Features

Based on user feedback and adoption, consider:
- Video recording/playback
- Calendar integration (schedule meetups)
- Slack/Discord integration
- API for third-party integrations
- Advanced whiteboard tools (LaTeX, code blocks)
- Optimization and performance improvements
- Bug fixes and polish based on metrics

---

## Competitive Advantages

After these enhancements, Rently will have:

✅ **Better collaboration tools** than Gather.town (persistent whiteboards)
✅ **Stronger mobile experience** (PWA, optimized controls)
✅ **Easier map creation** (AI templates, procedural themes, remixes)
✅ **Better enterprise features** (branding, analytics, moderation)
✅ **Singapore-focused** (local branding, regional optimization)

All while maintaining:
- 🚀 Superior performance (2D > 3D)
- 📱 Better accessibility (mobile-first)
- 💰 Lower development/maintenance costs
- ⚡ Faster iteration speed

---

## Next Steps

1. **Validate priorities** with key stakeholders/users
2. **Set up project tracking** (GitHub Projects, Linear, etc.)
3. **Create detailed specs** for Phase 1 features
4. **Assign development resources**
5. **Start with Screen Sharing** (highest impact, clear scope)

Ready to kick off development! 🚀
