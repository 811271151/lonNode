# IonNode Simulator

CLI tool to simulate IoT device data generation and reporting.

## Installation

```bash
cd tools/simulator
pnpm install
pnpm run build
```

## Usage

### Basic Usage

```bash
pnpm simulator --node-id ION-001
```

### With Custom Options

```bash
pnpm simulator --node-id ION-001 --interval 3000 --api-url http://localhost:3000
```

### Options

- `--node-id` (required): Node ID to simulate
- `--interval` (optional): Reporting interval in milliseconds (default: 5000)
- `--api-url` (optional): API endpoint URL (default: http://localhost:3000)

## Example Output

```
[ION-001] Starting simulator...
[ION-001] API URL: http://localhost:3000
[ION-001] Interval: 5000ms
[ION-001] Press Ctrl+C to stop

[ION-001] Generated: Temp=26.5°C Humidity=63.2% Voltage=3.74V Battery=85%
[ION-001] ✓ Data reported successfully (#1)

[ION-001] Generated: Temp=27.1°C Humidity=61.8% Voltage=3.81V Battery=87%
[ION-001] ✓ Data reported successfully (#2)
```

## Multi-Device Simulation

Run multiple instances in separate terminals:

```bash
# Terminal 1
pnpm simulator --node-id ION-001

# Terminal 2
pnpm simulator --node-id ION-002

# Terminal 3
pnpm simulator --node-id ION-003
```

## Data Generation

The simulator generates random data within realistic ranges:

- **Temperature**: 20-35°C
- **Humidity**: 50-80%
- **Voltage**: 3.3-4.1V
- **Battery**: 70-100%

## Stopping

Press `Ctrl+C` to gracefully stop the simulator. It will display the total number of reports sent before exiting.
