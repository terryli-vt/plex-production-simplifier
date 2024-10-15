# plex-production-simplifier

This application helps to simplify the process of recording production on the Plex ERP (an alternative of Mach 2 application)

## Features

- Waterjet workcenter
  - Record production (good and hold parts)
  - Load source
- Edgefold workcenter
  - Record bin-for-bin production
- Assembly workcenter
  - Record production through scanning
  - Prevent part being recorded if it's not in Edgefold operation
- Packing Station
  - Box vs. Rack packing mode
  - Print shipping label once standard pack quantity is reached (if auto print is enabled)
- Repair center
  - Change container's status
  - Scrap containers
- Setting
  - Toggle between Test and Production Plex Server
  - Change printer settings
  - Autoprint Setting for pack
- Other features
  - Real-time Update of the workcenter information
  - Hold status on edgefold and pack
  - Autofocus on the input field
  - Responsive Design for smaller screens (phone and tablet)
- Bug Fixes
  - Waterjet: preventing load incorrect carpet source
  - Assembly: check no substrate loaded before production
  - Assembly: prevent hold parts being assembled
  - Pack station pack list stay updated with workcenter
  - Pack station: prevent hold parts being packed

## TODO

- User login (operator & admin)
- Spanish version
- About Page & Copyright

## Run the app using PM2

1. Build your app using `npm run build`
2. Install `serve` package globally using `npm install -g serve`
3. Use PM2 to serve the app `pm2 serve dist 3000 --spa`

- This command uses PM2 to start the serve package, serving the contents of your `dist` directory on port 3000. The `--spa` flag ensures that Single Page Application (SPA) routing works correctly.
