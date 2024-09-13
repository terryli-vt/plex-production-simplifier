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
  - Print shipping label once standard pack quantity is reached
- Repair center
  - Change container's status
  - Scrap containers
- Setting
  - Toggle between Test and Production Plex Server
  - Change printer settings
- Other features
  - Real-time Update of the workcenter information
  - Autofocus on the input field
  - Responsive Design for smaller screens (phone and tablet)
- Bug Fixes
  - Waterjet preventing load incorrect carpet source
  - Assembly: check no substrate loaded before production
  - Pack station pack list stay updated with workcenter

## TODO

- User login (operator & admin)
- Spanish version
- About Page & Copyright
