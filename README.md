# plex-production-simplifier

# Introduction

Plex Simplifier helps to simplify the process of recording production data on the Plex ERP.

The goal is to find a better alternative of Mach 2 application. Plex Simplifier works better than Mach 2 because:

- It is highly customizable. It can be easily modified to fit the needs of the user regarding to the manufacturing process.
- It is more user-friendly.
  - Clean and simple UI, easy to use.
  - Responsive design for smaller screens (works perfect on phones and tablets).
  - Handles scanning with ease (QR Code, Barcode, etc), and the users don't need to worry about parsing the scanned results.
- It provides useful tools that are not included in Mach 2
  - Repair Center: Change container's status, scrap containers
  - Container Label Printer: Print container label with ease given a serial number
  - Ability to hold bad parts during the manufacturing process
  - Check BOM of any part number

# Features

- Waterjet workcenter
  - Record production (good and hold parts)
- Edgefold workcenter
  - Record bin-for-bin production, and hold parts if needed
- Assembly workcenter
  - Record production through scanning
  - Prevent part being recorded if it's not in Edgefold operation
- Packing Station
  - Box vs. Rack packing mode
  - Print shipping label once standard pack quantity is reached (if auto print is enabled)
- Repair center
  - Change container's status
  - Scrap containers
- Container Label Printer
  - Print container label given a serial number through user-specified printer (can be set in the settings page)
- Setting
  - Toggle between Test and Production Plex Server
  - Change workcenters for each step, based on different manufacturing programs
  - Change printer used for printing part and shipping labels
  - Enable/Disable Autoprint feature for pack

# Planned Features

- User login (operator & admin)
- Spanish version
- About Page & Copyright

## Run the app using PM2

1. Build your app using `npm run build`
2. Install `serve` package globally using `npm install -g serve`
3. Use PM2 to serve the app `pm2 serve dist 3000 --spa`

- This command uses PM2 to start the serve package, serving the contents of your `dist` directory on port 3000. The `--spa` flag ensures that Single Page Application (SPA) routing works correctly.
