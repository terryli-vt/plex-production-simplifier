# plex-production-simplifier

This application helps to simplify the process of recording production on the Plex ERP

An alternative of Mach 2 application

## Features

- Waterjet workcenter
  - Record production (good and hold parts)
  - Load carpet source
- Edgefold workcenter
  - Record bin-for-bin production
- Assembly workcenter
  - Record production
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

## TODO

- User login (operator & admin)
- Assembly
  - Check workcenter has no substrate loaded before production
- Spanish version
- Responsive Design for smaller screens (phone and tablet)
- About Page & Copyright
