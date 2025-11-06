# Rently Digital Space - Complete Documentation for Claude

## Project Overview

**Rently** is a dedicated virtual collaboration platform that creates seamless digital gathering spaces for teams. It's a real-time multiplayer web application where users can create customizable virtual offices with proximity-based video chat - walk up to someone and automatically join their conversation.

### Key Concept
This is a **Gather.town-style virtual office** customized for Rently (a Singapore-based company). Users navigate 2D isometric spaces as avatars, and video/audio automatically connects when players are within 3 tiles of each other.

---

## Architecture Overview

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Next.js    │  │   Pixi.js    │  │    Agora     │      │
│  │   (UI/SSR)   │  │  (Renderer)  │  │ (Video Chat) │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          │ HTTP/REST        │ Socket.io        │ WebRTC
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼──────────────┐
│         │                  │                  │              │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐      │
│  │   Express    │  │  Socket.io   │  │    Agora     │      │
│  │   (Routes)   │  │   (Events)   │  │   (Server)   │      │
│  └──────────────┘  └──────┬───────┘  └──────────────┘      │
│                            │                                 │
│                     ┌──────▼───────┐                        │
│                     │ SessionManager│                        │
│                     │   (In-Memory) │                        │
│                     └──────────────┘                        │
│                         SERVER                               │
└──────────────────────────┬───────────────────────────────────┘
                           │
                    ┌──────▼───────┐
                    │   Supabase   │
                    │ (Auth + DB)  │
                    └──────────────┘
```

### Technology Stack

**Frontend:**
- **Next.js 15** - React framework with App Router for SSR/SSG
- **TypeScript** - Type safety across the application
- **Pixi.js 8** - WebGL rendering engine for tile-based graphics
- **TailwindCSS** - Utility-first styling with custom Rently design system
- **Socket.io Client** - Real-time bidirectional communication
- **Agora RTC SDK** - WebRTC video/audio streaming
- **Zod** - Runtime schema validation
- **GSAP** - Animation library

**Backend:**
- **Node.js + Express** - HTTP server for REST API
- **Socket.io** - WebSocket server for real-time events
- **TypeScript** - Type-safe server code
- **Supabase Client** - Database and auth integration

**Infrastructure:**
- **Supabase** - PostgreSQL database, authentication, real-time subscriptions
- **Agora** - Managed WebRTC infrastructure for video chat
- **Heroku** - Deployment platform (backend)

---

## Project Structure

```
gather-clone/
├── backend/                    # Node.js server
│   └── src/
│       ├── index.ts           # Server entry point, Socket.io setup
│       ├── routes/
│       │   ├── routes.ts      # Express API endpoints
│       │   └── route-types.ts # API request/response types
│       ├── sockets/
│       │   ├── sockets.ts     # Socket event handlers
│       │   ├── socket-types.ts# Socket event schemas
│       │   └── helpers.ts     # Socket utilities
│       ├── session.ts         # SessionManager and Session classes
│       ├── Users.ts           # User registry (UID → Supabase user)
│       ├── supabase.ts        # Supabase client initialization
│       └── utils.ts           # Utility functions
│
├── frontend/                   # Next.js application
│   ├── app/                   # App Router pages
│   │   ├── page.tsx          # Landing page (/)
│   │   ├── layout.tsx        # Root layout
│   │   ├── globals.css       # Global styles + Rently design tokens
│   │   ├── play/             # Main collaboration interface
│   │   │   ├── [id]/page.tsx        # Play realm page
│   │   │   ├── PlayClient.tsx       # Client component
│   │   │   ├── PixiApp.tsx          # Pixi canvas wrapper
│   │   │   ├── IntroScreen.tsx      # Character preview before entering
│   │   │   └── SkinMenu/            # Avatar selection
│   │   ├── editor/           # Map editor
│   │   │   ├── [id]/page.tsx        # Editor page
│   │   │   ├── Editor.tsx           # Editor UI
│   │   │   ├── PixiEditor.tsx       # Pixi canvas for editing
│   │   │   ├── TileMenu.tsx         # Sprite selection panel
│   │   │   ├── Toolbars/            # Editor toolbars
│   │   │   ├── Rooms.tsx            # Room management panel
│   │   │   └── SpecialTiles.tsx     # Special tile panel
│   │   ├── manage/           # Realm management dashboard
│   │   ├── signin/           # Authentication pages
│   │   ├── auth/             # OAuth callback handlers
│   │   └── privacy-policy/   # Privacy policy page
│   │
│   ├── components/            # Reusable React components
│   │   ├── Layout/           # Layout components
│   │   ├── Modal/            # Modal dialogs
│   │   ├── VideoChat/        # Video chat UI components
│   │   ├── Dropdown.tsx      # Dropdown menus
│   │   ├── Toggle.tsx        # Toggle switches
│   │   └── LoadingSpinner.tsx# Loading indicators
│   │
│   ├── utils/                 # Utility modules
│   │   ├── pixi/             # Pixi.js game engine
│   │   │   ├── App.ts               # Base Pixi app class
│   │   │   ├── PlayApp.ts           # Play mode implementation
│   │   │   ├── EditorApp.ts         # Editor mode implementation
│   │   │   ├── Player/              # Player character class
│   │   │   ├── spritesheet/         # Sprite definitions
│   │   │   ├── pathfinding.ts       # A* pathfinding algorithm
│   │   │   ├── types.ts             # TypeScript types
│   │   │   └── zod.ts               # RealmData validation schemas
│   │   ├── video-chat/
│   │   │   └── video-chat.ts        # Agora VideoChat class
│   │   ├── backend/
│   │   │   ├── server.ts            # Socket.io client wrapper
│   │   │   └── requests.ts          # HTTP API client
│   │   ├── supabase/         # Supabase utilities
│   │   │   ├── client.ts            # Supabase client
│   │   │   ├── middleware.ts        # Auth middleware
│   │   │   ├── saveRealm.ts         # Server action for saving
│   │   │   └── getPlayRealmData.ts  # Fetch realm data
│   │   ├── aiMapBuilder.ts   # AI-powered map generation
│   │   ├── mapGenerator.ts   # Procedural map generation
│   │   └── signal.ts         # Event bus for component communication
│   │
│   ├── public/                # Static assets
│   │   └── sprites/
│   │       ├── characters/          # Character spritesheets (085 skins)
│   │       └── tiles/               # Tile spritesheets (8 palettes)
│   │
│   ├── middleware.ts          # Next.js middleware for auth
│   ├── next.config.js         # Next.js configuration
│   ├── tailwind.config.js     # Tailwind + Rently design system
│   └── package.json
│
├── README.md                   # Installation and setup guide
└── brand_guidelines.md         # Rently brand design system
```

---

## Core Systems

### 1. Authentication & Authorization

**Flow:**
1. User clicks "Sign in with Google" on landing page (`/`)
2. Redirects to Supabase OAuth flow
3. Returns to `/auth/callback` with code
4. Exchange code for session, set cookies
5. Redirect to `/manage` (realm dashboard)

**Implementation:**
- `frontend/app/signin/GoogleSignInButton.tsx` - OAuth initiation
- `frontend/app/auth/callback/route.ts` - OAuth callback handler
- `frontend/middleware.ts` - Protected route middleware
- `frontend/utils/supabase/middleware.ts` - Session refresh logic

**Authorization Levels:**
- **Realm Owner**: Full edit access, can delete realm
- **Invited User**: Can join if `share_id` is valid and realm is not `only_owner` mode
- **Public Access**: Anyone with `share_id` can join (unless `only_owner`)

### 2. Real-Time Multiplayer (Socket.io)

**Connection Flow:**
```typescript
// Client connects with JWT authentication
const socket = io(BACKEND_URL, {
  extraHeaders: { token: access_token }
});

// Server validates token
io.use(async (socket, next) => {
  const token = socket.handshake.headers.token;
  const { data: { user } } = await supabase.auth.getUser(token);
  if (user) {
    Users.set(user.id, user);
    next();
  } else {
    next(new Error("Authentication failed"));
  }
});
```

**Key Events (Client → Server):**

| Event | Parameters | Purpose |
|-------|-----------|---------|
| `joinRealm` | `realmId, shareId` | Join a virtual space |
| `movePlayer` | `x, y` | Update player position |
| `teleport` | `x, y, roomIndex` | Move to different room |
| `changedSkin` | `skin` | Change avatar appearance |
| `sendMessage` | `message` | Send chat message |
| `disconnect` | - | Clean up player on disconnect |

**Key Events (Server → Client):**

| Event | Parameters | Purpose |
|-------|-----------|---------|
| `joinedRealm` | `realmData, roomIndex, x, y` | Confirm successful join |
| `playerJoinedRoom` | `player` | New player entered room |
| `playerLeftRoom` | `uid` | Player left room |
| `playerMoved` | `uid, x, y` | Player position update |
| `playerTeleported` | `uid, x, y` | Player changed rooms |
| `receiveMessage` | `uid, message` | Chat message received |
| `proximityUpdate` | `proximityId` | Video chat channel update |
| `kicked` | `reason` | Forcibly disconnected |

**Session Management:**

File: `backend/src/session.ts`

```typescript
// SessionManager tracks all active realms
class SessionManager {
  private sessions: Map<string, Session> = new Map();

  createSession(realmId: string, realmData: RealmData): Session
  endSession(realmId: string): void
  getSession(realmId: string): Session | undefined
}

// Session tracks players in a single realm
class Session {
  private players: Map<string, Player> = new Map();
  private rooms: Room[] = [];
  private proximityGroups: Map<string, Set<string>> = new Map();

  addPlayer(uid: string, roomIndex: number, x: number, y: number): void
  removePlayer(uid: string): void
  movePlayer(uid: string, x: number, y: number): void
  getProximityId(uid: string): string | null
}
```

**Proximity Algorithm:**

Players within 3-tile radius share the same `proximityId` (UUID), which determines their video chat channel.

```typescript
// Euclidean distance check
const distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
if (distance <= 3) {
  // Players are in proximity
  assignSameProximityId(player1, player2);
}
```

### 3. Rendering Engine (Pixi.js)

**Base App Class** (`frontend/utils/pixi/App.ts`)

Handles core rendering logic shared between play and editor modes:

```typescript
class App {
  app: PIXIApplication;
  floorContainer: PIXIContainer;      // Layer 1: floor tiles
  aboveFloorContainer: PIXIContainer; // Layer 2: rugs, paths
  objectContainer: PIXIContainer;     // Layer 3: furniture, walls

  // Coordinate conversion (isometric)
  convertScreenToTileCoordinates(x, y): Point
  convertTileToScreenCoordinates(x, y): Point

  // Tile rendering
  placeTile(layer, tile, x, y): void
  removeTile(layer, x, y): void

  // Collision detection
  isTileBlocked(x, y): boolean
}
```

**PlayApp** (`frontend/utils/pixi/PlayApp.ts`)

Extends `App` for gameplay:

```typescript
class PlayApp extends App {
  localPlayer: Player;
  remotePlayers: Map<string, Player>;
  camera: { x: number, y: number, zoom: number };

  // Movement
  handleClick(x, y): void {
    const path = bfs(localPlayer.pos, target, blockedTiles);
    localPlayer.followPath(path);
  }

  handleKeyboard(keys): void {
    // WASD movement
  }

  // Multiplayer sync
  syncRemotePlayer(uid, x, y): void {
    remotePlayers.get(uid)?.moveTo(x, y);
  }

  // Camera
  updateCamera(): void {
    app.stage.position.x = -localPlayer.x + screenWidth/2;
    app.stage.position.y = -localPlayer.y + screenHeight/2;
  }
}
```

**EditorApp** (`frontend/utils/pixi/EditorApp.ts`)

Extends `App` for editing:

```typescript
class EditorApp extends App {
  selectedTile: TileData | null;
  currentTool: 'hand' | 'zoom' | 'tile' | 'eraser';
  currentMode: 'single' | 'rectangle';

  // Tile placement
  handleTileClick(x, y): void {
    if (currentTool === 'tile' && selectedTile) {
      placeTile(selectedTile.layer, selectedTile, x, y);
      history.push(snapshot);
    }
  }

  // Special tiles (visualized with gizmos)
  placeImpassable(x, y): void
  placeTeleporter(x, y, targetRoom, targetX, targetY): void
  placeSpawnpoint(x, y): void
  placeFadeArea(x1, y1, x2, y2): void

  // Undo/Redo
  undo(): void {
    currentState = history.pop();
    redraw();
  }
}
```

**Player Character** (`frontend/utils/pixi/Player/Player.ts`)

Animated sprite with movement:

```typescript
class Player {
  sprite: AnimatedSprite;
  targetQueue: Point[] = [];

  // Animation states
  idle(direction: Direction): void {
    sprite.textures = getTextures('idle_' + direction);
    sprite.play();
  }

  walk(direction: Direction): void {
    sprite.textures = getTextures('walk_' + direction);
    sprite.play();
  }

  // Movement
  moveTo(x, y): void {
    targetQueue.push({x, y});
  }

  update(delta): void {
    if (targetQueue.length) {
      // Smooth interpolation to next target
      lerp(currentPos, targetQueue[0], speed * delta);
    }
  }
}
```

**Coordinate System:**

32x32 tile grid with isometric projection:

```
Screen coords → Tile coords:
tileX = Math.floor(screenX / 32)
tileY = Math.floor(screenY / 32)

Tile coords → Screen coords:
screenX = tileX * 32
screenY = tileY * 32
```

### 4. Video Chat System (Agora)

**VideoChat Class** (`frontend/utils/video-chat/video-chat.ts`)

```typescript
class VideoChat {
  client: IAgoraRTCClient;
  localTracks: { audio: IMicrophoneAudioTrack, video: ICameraVideoTrack };

  async joinChannel(proximityId: string, uid: string, realmId: string) {
    // Generate channel name (max 64 chars, Agora limit)
    const channelName = md5(`${realmId}-${proximityId}`).substring(0, 16);

    // Get token from server
    const token = await fetchAgoraToken(channelName, uid);

    // Join Agora channel
    await client.join(AGORA_APP_ID, channelName, token, uid);

    // Publish local tracks
    if (localTracks.audio) await client.publish(localTracks.audio);
    if (localTracks.video) await client.publish(localTracks.video);

    // Subscribe to remote users
    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'video') {
        user.videoTrack.play(`video-${user.uid}`);
      }
      if (mediaType === 'audio') {
        user.audioTrack.play();
      }
    });
  }

  async leaveChannel() {
    await client.leave();
  }

  toggleMic(enabled: boolean) {
    localTracks.audio?.setEnabled(enabled);
  }

  toggleCamera(enabled: boolean) {
    localTracks.video?.setEnabled(enabled);
  }
}
```

**Proximity Integration:**

```typescript
// In PlayClient.tsx
useEffect(() => {
  Server.on('proximityUpdate', async (proximityId: string | null) => {
    if (proximityId) {
      // Join new proximity group
      await videoChat.joinChannel(proximityId, uid, realmId);
    } else {
      // Left all proximity groups
      await videoChat.leaveChannel();
    }
  });
}, []);
```

**Debouncing:**

To prevent rapid channel switching when walking past someone:

```typescript
let proximityTimeout: NodeJS.Timeout;

Server.on('proximityUpdate', (proximityId) => {
  clearTimeout(proximityTimeout);
  proximityTimeout = setTimeout(() => {
    joinChannel(proximityId);
  }, 1000); // 1 second delay
});
```

### 5. Database Schema (Supabase)

**Tables:**

```sql
-- Realms (virtual spaces)
CREATE TABLE realms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  map_data JSONB NOT NULL, -- RealmData type
  share_id UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
  only_owner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  skin TEXT DEFAULT '/sprites/characters/Character_001.png',
  visited_realms UUID[] DEFAULT '{}'
);

-- Row Level Security (RLS)
ALTER TABLE realms ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own realms"
  ON realms FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can update their own realms"
  ON realms FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own realms"
  ON realms FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own realms"
  ON realms FOR DELETE
  USING (auth.uid() = owner_id);
```

**RealmData Type:**

```typescript
type RealmData = {
  rooms: Room[];
};

type Room = {
  roomName: string;
  width: number;
  height: number;
  floor: TilePoint[];
  above_floor: TilePoint[];
  object: TilePoint[];
  impassable: Point[];
  teleporter: Teleporter[];
  spawnpoint: Point[];
  fade: Fade[];
};

type TilePoint = {
  x: number;
  y: number;
  tile: string; // e.g., "ground/Grass_02"
};

type Teleporter = {
  x: number;
  y: number;
  roomIndex: number;
  targetX: number;
  targetY: number;
};

type Fade = {
  x: number;
  y: number;
  width: number;
  height: number;
};
```

**Validation:**

File: `frontend/utils/pixi/zod.ts`

```typescript
const PointSchema = z.object({
  x: z.number(),
  y: z.number()
});

const TilePointSchema = PointSchema.extend({
  tile: z.string()
});

const TeleporterSchema = PointSchema.extend({
  roomIndex: z.number(),
  targetX: z.number(),
  targetY: z.number()
});

const RoomSchema = z.object({
  roomName: z.string().min(1),
  width: z.number().min(10).max(100),
  height: z.number().min(10).max(100),
  floor: z.array(TilePointSchema).max(10000),
  above_floor: z.array(TilePointSchema).max(10000),
  object: z.array(TilePointSchema).max(10000),
  impassable: z.array(PointSchema),
  teleporter: z.array(TeleporterSchema),
  spawnpoint: z.array(PointSchema),
  fade: z.array(FadeSchema)
});

const RealmDataSchema = z.object({
  rooms: z.array(RoomSchema).min(1).max(50)
});
```

### 6. Map Generation

**AI Map Builder** (`frontend/utils/aiMapBuilder.ts`)

Two-phase OpenAI integration:

```typescript
async function generateAIMap(prompt: string, floorPalette: string, objectPalette: string) {
  // Phase 1: Layout planning
  const layoutPrompt = `Generate a JSON layout plan for: ${prompt}
  Available floor tiles: ${getFloorTileNames(floorPalette)}
  Available objects: ${getObjectTileNames(objectPalette)}`;

  const layout = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: layoutPrompt }],
    response_format: { type: 'json_object' }
  });

  // Phase 2: Detailed sprite placement
  const detailPrompt = `Convert this layout to exact tile coordinates: ${layout}`;
  const realmData = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: detailPrompt }],
    response_format: { type: 'json_object' }
  });

  // Validate sprites exist
  const validatedData = validateAndFixSprites(realmData);

  return RealmDataSchema.parse(validatedData);
}
```

**Procedural Generator** (`frontend/utils/mapGenerator.ts`)

BSP-style algorithm:

```typescript
function generateMap(width: number, height: number, numRooms: number) {
  const rooms: Rectangle[] = [];

  // Randomly place rooms
  for (let i = 0; i < numRooms; i++) {
    const w = random(minSize, maxSize);
    const h = random(minSize, maxSize);
    const x = random(0, width - w);
    const y = random(0, height - h);

    if (!overlaps(rooms, {x, y, w, h})) {
      rooms.push({x, y, w, h, type: randomRoomType()});
    }
  }

  // Connect rooms with hallways
  const hallways = [];
  for (let i = 0; i < rooms.length - 1; i++) {
    const path = createLShapedHallway(rooms[i], rooms[i+1]);
    hallways.push(path);
  }

  // Generate tile data
  return {
    rooms: rooms.map(room => generateRoomTiles(room, hallways))
  };
}
```

**Room Types:**
- Office (desk, chair, computer)
- Meeting (conference table, chairs)
- Lounge (couch, coffee table, plants)
- Kitchen (counter, fridge, table)
- Meditation (mats, plants, low lighting)
- Music (instruments, speakers)

---

## User Flows

### Flow 1: Creating a New Space

```
1. User signs in with Google
   ↓
2. Lands on /manage dashboard
   ↓
3. Clicks "Create New Realm"
   ↓
4. Modal appears with options:
   - Empty template (10x10 room)
   - Starter templates (office, lounge, etc.)
   - AI generation (describe space in text)
   - Procedural generation (Rently office preset)
   ↓
5. User selects option and submits
   ↓
6. Frontend calls saveRealm() server action
   ↓
7. Supabase creates new row in 'realms' table
   ↓
8. Redirect to /editor/[id]
   ↓
9. User customizes map with tile editor
   ↓
10. User clicks "Save"
    ↓
11. Frontend calls saveRealm() with updated map_data
    ↓
12. Supabase triggers 'UPDATE' event
    ↓
13. Backend receives real-time notification
    ↓
14. If session exists, all players get kicked
    ↓
15. User can now share via /play/[id]?shareId=[uuid]
```

### Flow 2: Joining a Space

```
1. User receives share link: /play/[realmId]?shareId=[uuid]
   ↓
2. User visits link (may need to sign in first)
   ↓
3. Server component fetches realm from Supabase
   ↓
4. Validates access:
   - Is user the owner? → Allow
   - Is only_owner false AND shareId valid? → Allow
   - Otherwise → Reject (404)
   ↓
5. Renders PlayClient with map data
   ↓
6. IntroScreen shows (character preview)
   ↓
7. User clicks "Enter"
   ↓
8. PixiApp initializes:
   - Load sprite assets
   - Render initial room
   - Create local player at spawnpoint
   ↓
9. Connect to Socket.io server with JWT
   ↓
10. Server validates token
    ↓
11. Client emits 'joinRealm'
    ↓
12. Server checks player limit (max 30)
    ↓
13. If full → kick with "realm full"
    ↓
14. Otherwise, add to session
    ↓
15. Server broadcasts 'playerJoinedRoom' to others
    ↓
16. Client receives 'joinedRealm' confirmation
    ↓
17. Fetch other players in room via API
    ↓
18. Render remote players
    ↓
19. Game loop starts
```

### Flow 3: Walking and Proximity Video

```
1. User clicks on tile in play mode
   ↓
2. PlayApp.handleClick(x, y)
   ↓
3. Run A* pathfinding to find valid path
   ↓
4. If blocked → show error, return
   ↓
5. localPlayer.followPath(path)
   ↓
6. For each tile in path:
   a. Animate player to tile
   b. Emit 'movePlayer' to server
   c. Check for teleporters
   ↓
7. Server receives 'movePlayer'
   ↓
8. session.movePlayer(uid, x, y)
   ↓
9. Update player position in session
   ↓
10. Recalculate proximity groups
    ↓
11. For each player in room:
    - Calculate distance to moved player
    - If distance ≤ 3 tiles:
      * Assign shared proximityId (UUID)
    - If distance > 3 tiles:
      * Remove from proximity group
    ↓
12. Broadcast 'playerMoved' to other players in room
    ↓
13. Send 'proximityUpdate' to affected players
    ↓
14. Client receives 'proximityUpdate'
    ↓
15. If proximityId is not null:
    - videoChat.joinChannel(proximityId, uid, realmId)
    ↓
16. VideoChat generates channel name:
    - md5(`${realmId}-${proximityId}`).substring(0, 16)
    ↓
17. Fetch Agora token from backend
    ↓
18. Join Agora channel
    ↓
19. Publish local mic/camera tracks
    ↓
20. Subscribe to remote users in channel
    ↓
21. Video/audio streams render in VideoBar component
    ↓
22. When user walks away (distance > 3):
    - Receive proximityUpdate with null
    - Leave Agora channel
    - Video/audio stops
```

### Flow 4: Editing and Saving

```
1. User navigates to /editor/[realmId]
   ↓
2. Server validates user is owner
   ↓
3. Fetch realm data from Supabase
   ↓
4. Render Editor component
   ↓
5. EditorApp initializes:
   - Load all sprite palettes
   - Render current room (default: 0)
   - Enable editing tools
   ↓
6. User selects tile from TileMenu
   ↓
7. selectedTile = tileData
   ↓
8. User clicks on canvas
   ↓
9. EditorApp.handleTileClick(x, y)
   ↓
10. If currentTool === 'tile':
    - placeTile(selectedTile.layer, selectedTile, x, y)
    - Push snapshot to undo history
    ↓
11. User places special tiles:
    - Impassable (red gizmo)
    - Teleporter (blue arrow gizmo)
    - Spawnpoint (green circle gizmo)
    - Fade area (purple rectangle gizmo)
    ↓
12. User creates/deletes/renames rooms
    ↓
13. User clicks "Save"
    ↓
14. Validate tile count ≤ 10,000 per room
    ↓
15. Validate room count ≤ 50
    ↓
16. Call saveRealm(access_token, realmData, realmId)
    ↓
17. Server action validates schema with Zod
    ↓
18. Update Supabase 'realms.map_data'
    ↓
19. Supabase real-time triggers 'UPDATE' event
    ↓
20. Backend receives event via subscription
    ↓
21. sessionManager.endSession(realmId)
    ↓
22. All connected players receive 'kicked' event
    ↓
23. Players see "Realm was updated" modal
    ↓
24. Players can rejoin to see new map
```

---

## Important Files Reference

### Backend Critical Files

| File Path | Purpose | Key Functions/Classes |
|-----------|---------|----------------------|
| `backend/src/index.ts` | Server entry, Socket.io setup, Supabase real-time subscriptions | `io.on('connection')`, `supabase.channel('realms')` |
| `backend/src/sockets/sockets.ts` | All Socket.io event handlers | `joinRealm`, `movePlayer`, `teleport`, `sendMessage`, `disconnect` |
| `backend/src/session.ts` | Session and player state management | `SessionManager`, `Session`, `getProximityId()` |
| `backend/src/routes/routes.ts` | Express REST API endpoints | `/getPlayersInRoom`, `/getPlayerCounts`, `/getAgoraToken` |
| `backend/src/Users.ts` | User registry for auth | `Users: Map<string, User>` |

### Frontend Critical Files

| File Path | Purpose | Key Components/Functions |
|-----------|---------|--------------------------|
| `frontend/app/page.tsx` | Landing page with sign-in | Main homepage, Google auth button |
| `frontend/app/play/[id]/page.tsx` | Play page server component | Fetch realm, validate access, render PlayClient |
| `frontend/app/play/PlayClient.tsx` | Play interface container | VideoChat provider, Socket.io connection, IntroScreen |
| `frontend/app/play/PixiApp.tsx` | Pixi canvas wrapper | PlayApp initialization, resize handling |
| `frontend/app/editor/[id]/page.tsx` | Editor page server component | Validate ownership, fetch realm |
| `frontend/app/editor/Editor.tsx` | Editor UI | Toolbars, tile menu, room panel, save button |
| `frontend/utils/pixi/App.ts` | Base Pixi app class | `convertScreenToTileCoordinates()`, `placeTile()`, `isTileBlocked()` |
| `frontend/utils/pixi/PlayApp.ts` | Play mode Pixi implementation | `handleClick()`, `handleKeyboard()`, `syncRemotePlayer()`, camera system |
| `frontend/utils/pixi/EditorApp.ts` | Editor mode Pixi implementation | `handleTileClick()`, `placeImpassable()`, `placeTeleporter()`, undo/redo |
| `frontend/utils/pixi/Player/Player.ts` | Player character class | `moveTo()`, `idle()`, `walk()`, animation system |
| `frontend/utils/pixi/spritesheet/spritesheet.ts` | Sprite loading and palette management | `loadSpritesheet()`, palette definitions |
| `frontend/utils/video-chat/video-chat.ts` | Agora VideoChat class | `joinChannel()`, `leaveChannel()`, `toggleMic()`, `toggleCamera()` |
| `frontend/utils/backend/server.ts` | Socket.io client wrapper | `Server.connect()`, `Server.emit()`, `Server.on()` |
| `frontend/utils/supabase/saveRealm.ts` | Server action for saving realms | `saveRealm(token, data, id)` |
| `frontend/utils/signal.ts` | Event bus for component communication | `Signal.on()`, `Signal.emit()` |
| `frontend/utils/aiMapBuilder.ts` | AI map generation with OpenAI | `generateAIMap()`, two-phase generation |
| `frontend/utils/mapGenerator.ts` | Procedural map generation | `generateMap()`, `generateRentlyOffice()` |

### Configuration Files

| File Path | Purpose |
|-----------|---------|
| `backend/.env` | Backend environment variables (SUPABASE_URL, SERVICE_ROLE, FRONTEND_URL) |
| `frontend/.env.local` | Frontend environment variables (SUPABASE keys, BACKEND_URL, AGORA_APP_ID, APP_CERTIFICATE) |
| `frontend/tailwind.config.js` | Tailwind config with Rently design tokens |
| `frontend/brand_guidelines.md` | Rently brand colors, typography, voice guidelines |

---

## Key Concepts

### Proximity-Based Video Chat

The core innovation of this platform. Players automatically join video calls when within 3 tiles of each other.

**How it works:**
1. Backend maintains spatial index of player positions
2. On every `movePlayer` event, recalculate distances to all players in room
3. Players within 3-tile radius get assigned same `proximityId` (UUID)
4. Client receives `proximityUpdate` event
5. VideoChat joins Agora channel named `md5(realmId-proximityId)`
6. Multiple proximity groups can exist in same room simultaneously
7. Walking away (>3 tiles) assigns `proximityId = null`, leaving channel

**Debouncing:**
To prevent jarring channel switches when walking past someone, there's a 1-second delay before joining new channels.

### Tile-Based Rendering

Everything is rendered on a 32x32 pixel grid:
- **Floor layer**: Ground tiles (grass, wood, carpet)
- **Above floor layer**: Rugs, paths, decals
- **Object layer**: Furniture, walls, plants (sorted by Y position for depth)

**Collision:**
Each sprite has `collider` array defining blocked sub-tiles:
```typescript
{
  name: "city/Wall_01",
  layer: "object",
  collider: [[0,0], [1,0], [2,0], [3,0]] // 4-tile wide wall
}
```

### Teleporters

Allow movement between rooms without separate "room select" UI:
```typescript
{
  x: 10,
  y: 15,
  roomIndex: 1, // Target room
  targetX: 5,
  targetY: 5
}
```

When player steps on teleporter tile:
1. Fade out screen
2. Emit `teleport` to server
3. Server broadcasts `playerTeleported`
4. Client unrenders current room
5. Renders new room
6. Spawns player at target coordinates
7. Fade in screen

### Private Areas (Fade)

Create exclusive zones with overlay:
```typescript
{
  x: 10,
  y: 10,
  width: 5,
  height: 5
}
```

Players inside see normally. Players outside see black rectangle overlay. Useful for meeting rooms.

### Sprite Palettes

8 distinct visual styles:
1. **ground** - Basic tiles (grass, dirt, water)
2. **grasslands** - Nature theme
3. **village** - Medieval/fantasy
4. **city** - Modern urban
5. **rently** - Custom Rently-branded assets
6. **kenney_city** - Kenney asset pack (urban)
7. **kenney_buildings** - Kenney asset pack (structures)
8. **kenney_landscape** - Kenney asset pack (nature)

Each palette has JSON definition at:
`frontend/utils/pixi/spritesheet/{palette}.ts`

### Character Skins

85 unique character sprites:
- Format: `Character_001.png` through `Character_085.png`
- 8 directions: N, NE, E, SE, S, SW, W, NW
- 2 states: idle, walk
- 4 frames per animation
- Total: 85 × 8 × 2 × 4 = 5,440 frames

Selected via SkinMenu component. Stored in `profiles.skin`.

---

## Design System (Rently Brand)

### Colors

```css
/* Primary */
--dark-plum: #301064;
--plum: #553081;
--plum-stain: #E1CFFF;
--sweet-mint: #11BB8D;

/* Neutrals */
--black: #1A1A1A;
--grey-dark: #404040;
--grey: #808080;
--grey-light: #D9D9D9;
--white: #FFFFFF;

/* Gradients */
--dark-plum-linear: linear-gradient(135deg, #301064 0%, #553081 100%);
--mint-linear: linear-gradient(135deg, #11BB8D 0%, #0D8F6D 100%);
```

### Typography

```css
/* Headings */
font-family: 'Archivo', sans-serif;
font-weight: 700;

/* Body */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
font-weight: 400;
```

### Voice & Tone

- Playful but professional
- Trustworthy and helpful
- Local (Singapore-focused)
- Modern and tech-forward

---

## Scalability & Limitations

### Current Limits

| Resource | Limit | Location |
|----------|-------|----------|
| Players per realm | 30 | `backend/src/sockets/sockets.ts:65` |
| Rooms per realm | 50 | `frontend/utils/pixi/zod.ts` |
| Tiles per room | 10,000 | `frontend/utils/pixi/zod.ts` |
| Chat message length | 300 chars | `backend/src/sockets/sockets.ts:134` |
| Realm name length | 50 chars | `frontend/app/manage/page.tsx` |

### In-Memory Sessions

**Important:** All session data (player positions, proximity groups) is stored in-memory on the backend. This means:
- ✅ Fast, no database latency
- ✅ Simple implementation
- ❌ Lost on server restart
- ❌ Cannot scale horizontally without sticky sessions
- ❌ No session persistence or recovery

For production scale, consider:
- Redis for session storage
- Horizontal scaling with session affinity
- Database persistence for critical state

### Supabase Real-Time

Backend subscribes to realm changes:
```typescript
supabase
  .channel('realms')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'realms'
  }, (payload) => {
    if (payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
      sessionManager.endSession(payload.old.id);
    }
  })
  .subscribe();
```

This auto-kicks players when owner edits or deletes realm.

---

## Security Considerations

### Authentication

- **JWT tokens** from Supabase in all Socket.io connections
- **Server-side validation** of tokens before allowing joins
- **Service role** for backend Supabase access (bypasses RLS)

### Authorization

- **Row Level Security (RLS)** on Supabase tables
- **Owner-only access** to editor pages (middleware check)
- **Share ID validation** for non-owner joins
- **Private mode** (`only_owner`) blocks all non-owner access

### Input Validation

- **Zod schemas** validate all RealmData before saving
- **Message length limits** prevent spam (300 chars)
- **Tile count limits** prevent DoS (10,000 per room)
- **Room count limits** prevent bloat (50 per realm)

### Potential Vulnerabilities

1. **No rate limiting** on socket events - could spam movePlayer
2. **No profanity filter** on chat messages
3. **No moderation tools** - owner can't kick/ban players
4. **Service role in frontend .env** - should be backend-only
5. **No CSRF protection** on server actions
6. **Agora tokens** generated client-side (should be backend)

---

## Common Debugging Scenarios

### "Failed to connect to realm"

**Causes:**
1. Backend server not running
2. CORS issue (check `FRONTEND_URL` in backend .env)
3. Invalid JWT token (expired session)
4. Socket.io version mismatch

**Debug:**
- Check backend logs: `cd backend && npm run dev`
- Verify `NEXT_PUBLIC_BACKEND_URL` in frontend .env
- Check browser console for WebSocket errors
- Verify Supabase session is valid

### Players not seeing each other

**Causes:**
1. Not in same room
2. Socket event not being broadcast
3. Remote player not rendered

**Debug:**
- Check `backend/src/sockets/sockets.ts:82` - `playerJoinedRoom` event
- Verify `session.getPlayersInRoom()` returns all players
- Check frontend `PlayApp.ts` - `Server.on('playerJoinedRoom')` handler
- Inspect `remotePlayers` Map in React DevTools

### Video chat not connecting

**Causes:**
1. Not in proximity (>3 tiles away)
2. Agora token invalid
3. Agora AppID mismatch
4. Mic/camera permissions denied

**Debug:**
- Check `proximityId` in React DevTools
- Verify `proximityUpdate` event received (console.log)
- Check Agora token generation in backend routes
- Verify `NEXT_PUBLIC_AGORA_APP_ID` and `APP_CERTIFICATE` match Agora console
- Check browser permissions for mic/camera

### Editor not saving

**Causes:**
1. Tile count > 10,000
2. Room count > 50
3. Invalid RealmData schema
4. Supabase RLS blocking update
5. Not the realm owner

**Debug:**
- Check browser console for Zod validation errors
- Verify user is authenticated and is realm owner
- Check Supabase logs for RLS denials
- Inspect `saveRealm` server action response

### Map not rendering

**Causes:**
1. Sprite not found in spritesheet
2. Pixi assets not loaded
3. Layer container not added to stage
4. Invalid tile coordinates (out of bounds)

**Debug:**
- Check browser console for Pixi errors
- Verify spritesheet JSON files loaded (Network tab)
- Inspect `floorContainer`, `aboveFloorContainer`, `objectContainer` in PlayApp
- Check tile coordinates are within room bounds

---

## Development Workflow

### Local Setup

```bash
# Clone repo
git clone https://github.com/tarikstafford/gather-rently.git
cd gather-rently

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Create .env files (see README.md for required variables)

# Run backend
cd backend && npm run dev
# Runs on http://localhost:3001

# Run frontend (in separate terminal)
cd frontend && npm run dev
# Runs on http://localhost:3000
```

### Adding New Sprite Palette

1. Create sprite PNG in `frontend/public/sprites/tiles/{palette}.png`
2. Create JSON definition in `frontend/utils/pixi/spritesheet/{palette}.ts`
3. Add to `spritesheetArray` in `frontend/utils/pixi/spritesheet/spritesheet.ts`
4. Add to palette selector in `frontend/app/editor/Editor.tsx`

### Adding New Socket Event

1. Define types in `backend/src/sockets/socket-types.ts`
2. Add handler in `backend/src/sockets/sockets.ts`
3. Add client listener in `frontend/utils/backend/server.ts` or component
4. Update documentation

### Adding New Room Template

1. Create generator function in `frontend/utils/mapGenerator.ts`
2. Add to template selector in create realm modal
3. Test in editor

---

## Deployment

### Backend (Heroku)

```bash
# Heroku auto-detects backend via Procfile
git push heroku main

# Set environment variables
heroku config:set FRONTEND_URL=https://your-app.vercel.app
heroku config:set SUPABASE_URL=https://xxx.supabase.co
heroku config:set SERVICE_ROLE=xxx
```

### Frontend (Vercel)

```bash
# Connect repo to Vercel
vercel link

# Set environment variables in Vercel dashboard
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_BASE_URL
NEXT_PUBLIC_BACKEND_URL
SERVICE_ROLE
NEXT_PUBLIC_AGORA_APP_ID
APP_CERTIFICATE

# Deploy
vercel --prod
```

### Environment Variables

**Backend (.env):**
```
FRONTEND_URL=https://your-app.vercel.app
SUPABASE_URL=https://xxx.supabase.co
SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
NEXT_PUBLIC_BACKEND_URL=https://your-backend.herokuapp.com
SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_AGORA_APP_ID=xxx
APP_CERTIFICATE=xxx
```

---

## Future Enhancements

### Planned Features
- Screen sharing in video chat
- Text chat UI (currently backend-only)
- Player moderation tools (kick, ban)
- Realm analytics (visitor counts, peak times)
- Mobile responsive controls
- Custom character creator
- Asset marketplace
- Realm templates gallery
- In-world interactive objects (whiteboards, polls)

### Technical Improvements
- Redis for session persistence
- WebRTC SFU for better video quality
- Rate limiting on socket events
- Profanity filter on chat
- Admin dashboard
- Automated testing (Jest, Playwright)
- Performance monitoring (Sentry)
- CDN for sprite assets

---

## Credits

This project is a fork of [gather-clone](https://github.com/trevorwrightdev/gather-clone) by Trevor Wright, which was inspired by Gather.town. Customized with:
- Rently branding and design system
- AI map generation
- Enhanced editor UI
- Singapore-focused features
- Multiple sprite palettes
- Improved documentation

---

## Resources

- **Gather.town**: Inspiration for proximity-based video
- **Pixi.js Docs**: https://pixijs.com/guides
- **Agora Docs**: https://docs.agora.io/en/video-calling/get-started/get-started-sdk
- **Supabase Docs**: https://supabase.com/docs
- **Socket.io Docs**: https://socket.io/docs/v4/
- **Next.js Docs**: https://nextjs.org/docs

---

## License

This project is for Rently internal use only.
