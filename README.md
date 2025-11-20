# NavX — Vehicle AutoRoute Navigator

> Context-aware, explainable route planning for robots and vehicles. NavX selects routes using a multi-criteria cost function (time, risk, comfort, scenic) and executes them with ROS 2 / Nav2. Demonstrations run on TurtleBot3 (real hardware) and in Gazebo simulation.

---

## Project Snapshot

This repository contains a production-quality demo website that documents the NavX project: design goals, core capabilities, system architecture, and example visualizations. The site showcases a modular system composed of:

- **Router Module** — Multi-criteria A* planner
- **Signals Node** — Aggregates LIDAR, IMU, and external context
- **Waypoint Client** — Interfaces with Nav2 FollowWaypoints
- **Web Gateway** — FastAPI + WebSockets
- **Web UI** — Leaflet-based interface and explainability panel

The live demo shown in the site is intended as documentation for a larger codebase (ROS 2 nodes, Python services, and a frontend). The HTML provides a complete, easy-to-read overview with AAA production-quality design features.

## Key Ideas

- **Multi-criteria route scoring:** `Cost = w_time·Time + w_risk·Risk + w_comfort·Comfort − w_scenic·Scenic`
- **Profiles** (Fastest / Safest / Scenic) change the weights and yield different route choices
- **Closed-loop re-planning:** Detect hazards (LIDAR/IMU), compute alternatives, reissue Nav2 goals with low latency (≤2s)
- **Explainability:** UI surfaces quantitative trade-offs (e.g. −22% risk, +8% time) so humans can understand decisions

## Production-Quality Features

The website includes several AAA production-quality enhancements for an immersive experience:

### 1. **Custom Precision Cursor**
- Replaces the default mouse pointer with a targeting system crosshair
- Smooth transitions and hover effects on interactive elements
- Uses `mix-blend-mode: difference` for a futuristic color inversion effect
- Scales up when hovering over buttons, links, and cards

### 2. **CRT Scanline Overlay**
- Subtle horizontal scanline texture across the entire screen
- Creates a monitor/HUD aesthetic consistent with the robotic theme
- Non-intrusive overlay that enhances the technical atmosphere
- Uses CSS gradients for optimal performance

### 3. **Scroll-Triggered Animations**
- Elements fade in and slide up smoothly as they enter the viewport
- Uses Intersection Observer API for efficient, performant animations
- Staggered delays for grid items create a cascading reveal effect
- Only animates once per element to maintain performance

### 4. **Advanced SVG Diagrams**
- Interactive system architecture diagrams with animated data flows
- Hover effects with glow and scale transformations
- Custom SVG patterns for technical aesthetics (grids, hazard stripes)
- Animated status indicators and flow lines

### 5. **Team Section with Professional Cards**
- Grayscale photos that reveal color on hover
- Status indicators (ONLINE, BUSY, FIELD, OFFLINE) with animated dots
- Corner bracket decorations for a tactical/technical look
- Smooth elevation and shadow effects on hover

## File Structure

```
navx/
├── index.html          # Main HTML file with semantic structure
├── styles.css          # Modular, well-organized CSS with comments
├── script.js           # Clean JavaScript with separated concerns
├── README.md           # This file
├── commands/           # Additional resources
└── preloading.html     # Legacy file (integrated into index.html)
```

### Code Organization

The codebase follows best practices for maintainability:

- **Separation of Concerns:** HTML (structure), CSS (presentation), JS (behavior) are in separate files
- **Modular CSS:** Organized by feature with clear section headers
- **Commented Code:** All major sections have descriptive comments
- **Semantic HTML:** Proper use of semantic tags and ARIA attributes
- **Performance Optimized:** CSS animations use transforms, Intersection Observer for scroll detection
- **Mobile Responsive:** Responsive design with mobile navigation toggle

## How to View the Demo Site

### Quick Start
Simply open `index.html` in any modern browser:

1. Locate `index.html` in the repository root
2. Double-click it or open it from your browser (File → Open File...)

### Local Server (Recommended)
For the best experience with all features:

**PowerShell (Windows):**
```powershell
# From the repository folder that contains index.html
python -m http.server 8000
# Then open http://localhost:8000/index.html
```

**Linux / macOS:**
```bash
python3 -m http.server 8000
# Then open http://localhost:8000/index.html
```

## Browser Compatibility

The website is optimized for modern browsers:
- ✅ Chrome/Edge (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Opera (v76+)

**Note:** Custom cursor effects work best on desktop browsers. Mobile devices will use the standard cursor.

## Suggested Repo Structure for Full Implementation

If you plan to expand this into the full system described on the site:

```
navx/
├── web/                 # React/Leaflet UI
├── gateway/             # FastAPI server (websocket + REST)
├── ros2_nodes/          # rclpy packages: router, signals, waypoint client
├── launch/              # ROS 2 launch files and Nav2 params
├── sim/                 # Gazebo worlds, turtlebot config
├── docs/                # Diagram sources and design notes
└── demo/                # This presentation website
    ├── index.html
    ├── styles.css
    └── script.js
```

## Tech Stack

### Website Demo
- **HTML5** — Semantic structure
- **CSS3** — Advanced animations, grid layouts, custom properties
- **Vanilla JavaScript** — No frameworks, pure performance
- **SVG** — Interactive diagrams and visualizations

### Described System
- **ROS 2 (Humble)** + Nav2
- **Python 3.10+** (rclpy, NumPy, OpenCV)
- **FastAPI** + WebSockets
- **Leaflet.js** for map UI
- **TurtleBot3** hardware (Raspberry Pi + LIDAR + IMU) or Gazebo simulation

## Performance Considerations

The website is optimized for performance:
- **CSS Transforms:** All animations use GPU-accelerated transforms
- **Intersection Observer:** Efficient scroll detection without scroll listeners
- **Minimal Dependencies:** No external libraries (except Google Fonts)
- **Optimized Images:** Team photos use Unsplash with format/size optimization
- **Lazy Animations:** Elements only animate when visible

## Customization Guide

### Changing the Preloader Text
Edit `script.js`:
```javascript
const textToType = "Your Text Here";
const typingSpeed = 150; // Adjust speed (lower = faster)
```

### Adjusting Cursor Style
Edit `styles.css` in the Custom Cursor section:
```css
#custom-cursor {
    width: 20px;  /* Size of cursor */
    height: 20px;
    border: 1px solid rgba(255, 255, 255, 0.8); /* Border color */
}
```

### Modifying Scanline Intensity
Edit `styles.css`:
```css
.crt-overlay {
    opacity: 0.6; /* Adjust from 0 (invisible) to 1 (full) */
    background-size: 100% 4px; /* Line thickness */
}
```

### Changing Animation Speed
Edit `styles.css`:
```css
.reveal-on-scroll {
    transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
    /* Change 0.8s to your preferred duration */
}
```

## Contributing

This repository currently contains a presentation/demo page. If you want to contribute:

1. **Fork** the repository
2. **Create** a feature branch (e.g. `feature/enhanced-animations`)
3. **Test** across multiple browsers
4. **Document** your changes in the README
5. **Submit** a pull request with clear description

### Code Style Guidelines
- Use consistent indentation (2 spaces for HTML/CSS/JS)
- Add comments for complex logic
- Follow existing naming conventions
- Test on both desktop and mobile
- Ensure accessibility (ARIA labels, keyboard navigation)

## Accessibility

The website includes accessibility features:
- Semantic HTML structure
- Keyboard navigation support
- High contrast color scheme
- Readable font sizes with responsive scaling
- Alternative text for meaningful images (where applicable)

**Note:** The custom cursor is a visual enhancement and doesn't interfere with accessibility tools.

## License

This project is open source. Feel free to use and adapt the code for your own projects.

## Credits

- **Design System:** Inspired by technical/tactical UI patterns
- **Fonts:** Oswald and Space Mono (Google Fonts)
- **Team Photos:** Unsplash (example images)
