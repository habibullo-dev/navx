# NavX — Vehicle AutoRoute Navigator

> Context-aware, explainable route planning for robots and vehicles. NavX selects routes using a multi-criteria cost function (time, risk, comfort, scenic) and executes them with ROS 2 / Nav2. Demonstrations run on TurtleBot3 (real hardware) and in Gazebo simulation.

---

## Project snapshot

This repository contains a static demo website (`index.html`) that documents the NavX project: design goals, core capabilities, system architecture, and example visualizations. The site describes a modular system composed of:

- A Router Module (multi-criteria A* planner)
- A Signals Node (aggregates LIDAR, IMU, and external context)
- A Waypoint Client (interfaces with Nav2 FollowWaypoints)
- A Web Gateway (FastAPI + WebSockets)
- A Web UI (Leaflet-based interface and explainability panel)

The live demo shown in the site is intended as documentation for a larger codebase (ROS 2 nodes, Python services, and a frontend). If this repo is a sketch or presentation artifact, the HTML provides a complete, easy-to-read overview.

## Key ideas

- Multi-criteria route scoring: Cost = w_time·Time + w_risk·Risk + w_comfort·Comfort − w_scenic·Scenic
- Profiles (Fastest / Safest / Scenic) change the weights and yield different route choices
- Closed-loop re-planning: Detect hazards (LIDAR/IMU), compute alternatives, reissue Nav2 goals with low latency (≤2s)
- Explainability: UI surfaces quantitative trade-offs (e.g. −22% risk, +8% time) so humans can understand decisions

## What you'll find here

- `index.html` — self-contained static HTML that documents the project, diagrams, mockups and feature descriptions.

If you have the broader codebase (ROS 2 packages, FastAPI server, frontend source), this README should be extended with run instructions for those components.

## How to view the demo site

Open the `index.html` file in any modern browser. This file is static and self-contained (no build step required):

1. Locate `index.html` in the repository root.
2. Double-click it or open it from your browser (File → Open File...).

For a simple local server (recommended if images or external resources are added):

PowerShell (Windows):

```powershell
# from the repository folder that contains index.html
python -m http.server 8000
# then open http://localhost:8000/index.html
```

Linux / macOS:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

## Suggested repo structure for a full implementation

If you plan to expand this sketch into the full system described on the site, consider the following layout:

```
navx/
├─ web/                 # React/Leaflet UI
├─ gateway/             # FastAPI server (websocket + REST)
├─ ros2_nodes/          # rclpy packages: router, signals, waypoint client
├─ launch/              # ROS 2 launch files and Nav2 params
├─ sim/                 # Gazebo worlds, turtlebot config
├─ docs/                # Diagram sources and design notes
└─ index.html    # Project presentation (this file)
```

## Tech stack (described in the site)

- ROS 2 (Humble) + Nav2
- Python 3.10+ (rclpy, NumPy, OpenCV)
- FastAPI + WebSockets
- Leaflet.js for map UI
- TurtleBot3 hardware (Raspberry Pi + LIDAR + IMU) or Gazebo simulation

## Contributing

This repository currently contains a presentation/demo page. If you want to contribute code for the planner, ROS 2 nodes, or the UI:

1. Fork the repository.
2. Create a feature branch (e.g. `feature/router-a-star`).
3. Add tests and minimal documentation for new components.
4. Open a pull request with a clear description and testing notes.

If you are integrating full ROS 2 packages, include launch files and CI that at least run static checks (flake8 / ruff, mypy when applicable).
