# Vectron Robotics — FTC Team 17873

Official website for FTC Team 17873 Vectron Robotics from Colegiul Național „Andrei Mureșanu”, Dej, Romania.

## Quick Start

Open `index.html` in a browser, or run a local server:

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080

## Logos

- **Vectron logo**: Replace `img/vectron-logo.svg` with your team logo from Facebook/socials. The site includes a placeholder SVG using team colors (#000080, #00d4ff).
- **School**: `img/school.jpg` shows the Colegiul Național „Andrei Mureșanu” building (from Wikimedia Commons).

## Robot 3D Model

- **Default**: A procedural FTC-style robot (chassis, wheels, intake) is shown.
- **Custom STL**: Add a file named `robot.stl` in this directory to display your actual robot model. The viewer will automatically load it.

## Tech Stack

- Vanilla HTML/CSS/JS
- [Three.js](https://threejs.org) for 3D visualization
- Team colors: #000080 (navy), #00d4ff (cyan accent)
- No build step required
