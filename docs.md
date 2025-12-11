# **FINAL TECH USED (Confirmed)**

## **Hardware**

* **Razer Kiyo Camera** (720p 60FPS — perfect for real-time YOLO)
* **TurtleBot3 Burger**
* **Raspberry Pi or Laptop** running **ROS2 Humble**

## **AI Model**

* **YOLOv8**

  * Real-time object detection
  * High accuracy
  * Perfect for vision-based hazard detection

## **Software & Frameworks**

* **React.js** (Dashboard frontend)
* **HTML/CSS/TailwindCSS** (Styling)
* **Vercel** (Frontend hosting)
* **Git/GitHub** (Version control)
* **FastAPI Backend** (Real-time data streaming)
* **ROS2 Humble + Nav2** (Robot navigation)

---

# ⭐ **PART 1 — Real Life (Full NavX for Drivers)**

## **How real navigation apps get data**

* Real-time GPS data
* Government road sensors
* Accident reports (police + API)
* Camera feeds
* Crowdsourcing events
* Weather APIs
* Historical traffic patterns
* Road geometry data

**NavX** combines these into:
**Safety**, **Comfort**, **Speed** profiles.

---

## **How NavX lets drivers choose a mode**

1. Driver opens NavX app
   Selects:

   * **Fastest**
   * **Safest**
   * **Comfort**

2. NavX fetches real-time data from:

   * Traffic APIs
   * Accident history
   * Weather
   * Road condition API
   * Crowd reports

3. NavX computes **3 routes**:

### **Fast Route**

* High weight on time
* Medium risk consideration
* Low comfort weight

### **Safe Route**

* High hazard weight
* Avoids accident zones
* Avoids risky intersections

### **Comfort Route**

* Avoids rough roads
* Avoids frequent-stop areas
* Prefers wide lanes and smooth flow

4. NavX visualizes all 3 options.

---

## ⭐ **If traffic appears during the drive**

NavX continuously monitors real-time data:

* New traffic
* New road hazard
* Weather change

It recalculates routes and suggests switching:

> “Better route found based on your mode.”

---

# ⭐ **PART 2 — Stage-2 Robot Version (Your Demo)**

Since robots can’t access real APIs, you **simulate** real-life concepts using indoor environment.

### **Fast Route**

Shortest path on grid map.

### **Safe Route**

Fewer YOLO-detected obstacles.

### **Comfort Route**

Smoother turns, fewer angle changes.

### **Traffic Simulation**

If a new obstacle appears:

* Costmap updates
* Nav2 replans
* Route changes based on mode

Examples:

* **Safe Mode** avoids new hazard zones
* **Fast Mode** chooses shortest alternative
* **Comfort Mode** chooses smoothest path

---

# ⭐ **Perfect Explanation for Judges**

> “In the real NavX system, road, traffic, accident, and weather data come from external APIs. In our robotics version, we simulate these inputs using YOLOv8 hazard detection. Obstacles represent congestion or road hazards. When the environment changes, Nav2 replans the path, and NavX selects the best route based on the user’s safety, speed, or comfort preference.”

---

# ⭐ **Summary**

## **Real Life**

* Uses APIs: traffic, weather, road data
* Computes 3 routes
* Recalculates dynamically

## **Robot Demo**

* Uses YOLO detections
* Obstacles = hazards
* Updates costmaps
* Replans automatically
* Switches route based on mode

---

# **1. Camera-Based Perception (Razer Kiyo + YOLOv8)**

* 60FPS video input
* YOLO detects obstacles
* Hazard scoring module generates risk level
* Feeds routing engine
* Advanced and industry-style design

---

# **2. YOLOv8 Real-Time Detection Pipeline**

Pipeline:

```
Camera Input → YOLOv8 Node → Bounding Boxes + Confidence → Hazard Classification → Multi-Criteria Cost Function
```

Features:

* 90+ FPS inference potential
* Fast NMS
* High accuracy
* Suitable for robotics

---

# **3. Multi-Criteria Routing Engine**

Modes: Fastest, Safest, Comfort

### **Cost Function**

```
Cost = w_time*T + w_risk*R + w_comfort*C
```

Where:

* **R (Risk)** = YOLO density + proximity
* **C (Comfort)** = Smoothness + obstacle spacing
* **T (Time)** = distance + estimated time

---

# **4. Nav2 Integration**

Highlight:

* Behavior Tree
* Global Planner
* Local Planner
* Costmap Server
* Dynamic replanning
* YOLO updates costmaps → Real-time adaptation

---

# **5. Full-Stack Architecture Diagram**

```
Razer Kiyo → YOLOv8 Node → Hazard Score
           → Multi-Criteria Router → Nav2 → TurtleBot3
                                          ↓
                                   FastAPI Backend
                                          ↓
                                React/Tailwind Dashboard (Vercel)
```

---

# **6. Web Dashboard (React + Tailwind + Vercel)**

* Live position
* Path overlays
* Hazard visualization
* Mode switching
* Beautiful UI
* Fast hosting on Vercel

---

# ⭐ **Overall Project Strength**

* AI vision (YOLOv8)
* Robotics navigation (Nav2)
* Real-time route decision
* Multi-criteria routing
* Full-stack dashboard
* Industry-grade technologies
* Clean engineering

---

# **ASCII System Diagram**

```
┌────────────────────┐
│   Razer Kiyo Cam   │
│    (60FPS Video)   │
└─────────┬──────────┘
          ▼
┌───────────────────────┐
│     YOLOv8 Detector    │
│  Object & Hazard Boxes │
└─────────┬─────────────┘
          ▼
┌──────────────────────────────┐
│   Hazard Scoring Module      │
│ - Object density              │
│ - Proximity / risk weights    │
│ - Environment complexity      │
└──────────┬───────────────────┘
           ▼
┌──────────────────────────────┐
│ Multi-Criteria Routing Engine│
│ Cost = w₁·Time + w₂·Risk +   │
│        w₃·Comfort            │
└──────────┬───────────────────┘
           ▼
┌──────────────────────────────┐
│          NAV2 Stack          │
│ Global Planner • Local BT    │
│ Real-time Replanning         │
│ Costmap Updates from YOLO    │
└──────────┬───────────────────┘
           ▼
┌────────────────────────────┐
│       TurtleBot3           │
└──────────┬─────────────────┘
           ▼
┌─────────────────────────────────────────┐
│            FastAPI Backend              │
└──────────────────┬──────────────────────┘
                   ▼
┌────────────────────────────────┐
│   React + Tailwind Dashboard   │
└────────────────────────────────┘
```

---

# **Tech Stack**

* ROS2 Humble
* Python / FastAPI
* YOLOv8
* React.js / Tailwind
* Git / GitHub
* TurtleBot3
* Vercel (optional)

---

# ⭐ **What is Hazard Classification?**

Transforming YOLO detections into:

* Risk score
* Safety level
* Smoothness score

Used for mode selection.

---

# **How NavX Classifies Hazards**

## **1. YOLOv8 Detection**

Outputs:

* Object type
* Bounding box
* Confidence
* Image position

## **2. Distance Estimation**

Based on:

* Bounding box size
* Vertical screen position

## **3. Obstacle Density per Route Zone**

Zones:

* Left (Comfort)
* Center (Fast)
* Right (Safe)

For each zone count:

* Number of objects
* Size
* Proximity

## **4. Hazard Scoring Formula**

```
Risk = Σ (Confidence × ObjectWeight × DistancePenalty)
```

Weight examples:

* Person = 1.0
* Chair = 0.7
* Box = 0.5

Distance penalty:

* Close ×3
* Medium ×2
* Far ×1

---

# ⭐ **Poster Sentence**

**“NavX uses YOLOv8 to detect obstacles and classify hazards based on object type, proximity, and density. The system calculates a real-time risk score for each possible route, enabling safety-aware path selection.”**

---

# ⭐ **Judge-Ready Full Explanation**

“The hazard classification module uses YOLOv8 detections to estimate environmental risk. Each detected object is analyzed by type, bounding-box size, and screen position to compute proximity and potential interference with each candidate route. These factors are weighted to produce a numerical risk score. NavX uses this score to identify the safest, smoothest, or fastest path depending on user-selected mode.”

---

# **Example Route Comparison Table**

| Route Type  | Distance | Hazards | Score      | Result         |
| ----------- | -------- | ------- | ---------- | -------------- |
| **Fast**    | Shortest | High    | Time       | Fast but risky |
| **Safe**    | Medium   | Low     | Risk       | Safest path    |
| **Comfort** | Longest  | Medium  | Smoothness | Most stable    |

---
