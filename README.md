# MetricBeat 📊

**Metrics Collection** - Counters, gauges, timing.

## Features

- **🔢 Counters** - Increment values
- **📈 Gauges** - Set values
- **⏱️ Timing** - Measure duration
- **📡 Reporting** - Export metrics

## Installation

```bash
npm install metricbeat
```

## Usage

```typescript
import { MetricBeat } from 'metricbeat';

const metrics = new MetricBeat();

// Counters
metrics.increment('requests');
metrics.increment('errors');

// Gauges
metrics.gauge('memory', 1024);
metrics.gauge('connections', 50);

// Timing
const end = metrics.timing('request_duration');
// ... handle request ...
end(); // Records duration

// Report
metrics.report();
```

## API

| Method | Description |
|--------|-------------|
| `increment(name, value?)` | Add to counter |
| `gauge(name, value)` | Set gauge value |
| `timing(name)` | Start timing |
| `report()` | Print all metrics |

## License

MIT
