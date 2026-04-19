# MetricBeat 📊

> A lightweight, type-safe metrics collection library for Node.js and browser applications.

[![npm version](https://img.shields.io/npm/v/metricbeat.svg)](https://www.npmjs.com/package/metricbeat)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/metricbeat)](https://bundlephobia.com/package/metricbeat)

MetricBeat is a simple yet powerful metrics collection library designed for monitoring application performance and business metrics. It provides counters, gauges, and timing capabilities with zero dependencies and a tiny footprint.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
  - [Counters](#counters)
  - [Gauges](#gauges)
  - [Timing](#timing)
  - [Reporting](#reporting)
- [API Reference](#api-reference)
  - [MetricBeat Class](#metricbeat-class)
  - [Methods](#methods)
- [Advanced Usage](#advanced-usage)
  - [Custom Reporters](#custom-reporters)
  - [Metric Namespacing](#metric-namespacing)
  - [Integration with Monitoring Tools](#integration-with-monitoring-tools)
- [TypeScript Support](#typescript-support)
- [Browser Support](#browser-support)
- [Best Practices](#best-practices)
- [Performance Considerations](#performance-considerations)
- [Migration Guide](#migration-guide)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **🚀 Zero Dependencies** - No external runtime dependencies, minimal bundle size
- **📦 TypeScript Native** - Full TypeScript support with exported types
- **🔢 Counters** - Track incremental events like API requests, errors, user actions
- **📈 Gauges** - Monitor current values like memory usage, active connections, queue depth
- **⏱️ Timers** - Measure operation durations with nanosecond precision
- **📡 Extensible Reporting** - Built-in JSON output, extensible for custom formats
- **🌐 Universal** - Works in Node.js and browser environments
- **⚡ Performance Optimized** - Minimal overhead, designed for high-throughput applications
- **🔄 Stateful** - In-memory metric storage with persistence options
- **🎯 Simple API** - Intuitive interface that gets out of your way

---

## Installation

### npm

```bash
npm install metricbeat
```

### yarn

```bash
yarn add metricbeat
```

### pnpm

```bash
pnpm add metricbeat
```

### Bun

```bash
bun add metricbeat
```

### CDN (Browser)

```html
<script type="module">
  import { MetricBeat } from 'https://esm.sh/metricbeat';
</script>
```

---

## Quick Start

```typescript
import { MetricBeat } from 'metricbeat';

// Initialize the metrics collector
const metrics = new MetricBeat();

// Track a counter
metrics.increment('page_views');
metrics.increment('api_requests');
metrics.increment('errors', 5); // Increment by specific value

// Set a gauge
metrics.gauge('memory_usage_mb', 256);
metrics.gauge('active_users', 42);

// Measure timing
const endTimer = metrics.timing('database_query');
// ... perform database operation ...
endTimer(); // Automatically records duration

// Get all metrics
console.log(metrics.getMetrics());

// Generate a report
metrics.report();
```

---

## Usage Examples

### Counters

Counters are perfect for tracking events that increment over time, such as:

- Number of HTTP requests
- User sign-ups
- Error occurrences
- Completed jobs

```typescript
import { MetricBeat } from 'metricbeat';

const metrics = new MetricBeat();

// Basic increment (default +1)
metrics.increment('requests');
metrics.increment('requests'); // Now equals 2

// Increment by custom value
metrics.increment('bytes_sent', 1024);
metrics.increment('errors', 1);

// Multiple counters
metrics.increment('api.v1.GET');
metrics.increment('api.v1.POST');
metrics.increment('api.v1.PUT');
metrics.increment('api.v1.DELETE');

// Check current value
console.log(metrics.getMetrics());
// Output: { requests: 2, bytes_sent: 1024, errors: 1, 'api.v1.GET': 1, ... }
```

#### Counter Use Cases

```typescript
// Track HTTP requests
function handleRequest(method: string, path: string, statusCode: number) {
  metrics.increment(`http.${method}.${path}`);
  metrics.increment(`http.status.${statusCode}`);
  
  if (statusCode >= 400) {
    metrics.increment('http.errors');
  }
}

// Track user events
function trackUserAction(action: string, userId: string) {
  metrics.increment(`user.action.${action}`);
  metrics.increment(`user.active.${userId}`, 1);
}

// Track background jobs
function trackJobCompletion(jobType: string, duration: number) {
  metrics.increment(`jobs.completed.${jobType}`);
  metrics.increment(`jobs.duration.${jobType}`, duration);
}
```

---

### Gauges

Gauges represent point-in-time values that can go up or down:

- Current memory usage
- Number of active connections
- Queue depth
- Temperature readings

```typescript
import { MetricBeat } from 'metricbeat';

const metrics = new MetricBeat();

// Set a gauge to a specific value
metrics.gauge('memory_usage_bytes', process.memoryUsage().heapUsed);
metrics.gauge('active_connections', 42);
metrics.gauge('queue_depth', 100);

// Update gauges periodically
setInterval(() => {
  const mem = process.memoryUsage();
  metrics.gauge('memory.heap_used', mem.heapUsed);
  metrics.gauge('memory.heap_total', mem.heapTotal);
  metrics.gauge('memory.external', mem.external);
  metrics.gauge('memory.rss', mem.rss);
}, 5000);

// Gauge for cache sizes
metrics.gauge('cache.hits', 950);
metrics.gauge('cache.misses', 50);
```

#### Gauge Use Cases

```typescript
// Monitor system resources
function recordSystemMetrics() {
  const os = require('os');
  
  metrics.gauge('system.load.1min', os.loadavg()[0]);
  metrics.gauge('system.load.5min', os.loadavg()[1]);
  metrics.gauge('system.load.15min', os.loadavg()[2]);
  metrics.gauge('system.memory.free', os.freemem());
  metrics.gauge('system.memory.total', os.totalmem());
  metrics.gauge('system.cpu.count', os.cpus().length);
}

// Monitor application state
function recordApplicationState() {
  metrics.gauge('app.sessions.active', activeSessions.size);
  metrics.gauge('app.workers.active', workerPool.size);
  metrics.gauge('app.cache.size', cache.size());
  metrics.gauge('app.db.pool.connections', dbPool.connections);
}
```

---

### Timing

Timers measure the duration of operations:

- HTTP request latency
- Database query times
- External API calls
- Business process durations

```typescript
import { MetricBeat } from 'metricbeat';

const metrics = new MetricBeat();

// Basic timing with callback
metrics.timing('request_duration', performance.now());
// ... perform operation ...
const duration = performance.now() - startTime;

// Timing wrapper function
function measureTime(name: string, fn: () => void) {
  const start = performance.now();
  try {
    fn();
    metrics.timing(`${name}.success`, performance.now() - start);
  } catch (error) {
    metrics.timing(`${name}.error`, performance.now() - start);
    throw error;
  }
}

// Async timing
async function measureAsync(name: string, fn: () => Promise<void>) {
  const start = performance.now();
  try {
    await fn();
    metrics.timing(`${name}.duration`, performance.now() - start);
  } catch (error) {
    metrics.timing(`${name}.error`, performance.now() - start);
    throw error;
  }
}

// Middleware timing (Express/Next.js style)
function timingMiddleware(req: Request, res: Response, next: () => void) {
  const start = performance.now();
  next();
  metrics.timing(`http.${req.method}.${req.path}`, performance.now() - start);
}
```

#### Timer Use Cases

```typescript
// Database query timing
async function executeQuery(sql: string, params: any[]) {
  const start = performance.now();
  try {
    const result = await db.query(sql, params);
    metrics.timing('db.query.success', performance.now() - start);
    return result;
  } catch (error) {
    metrics.timing('db.query.error', performance.now() - start);
    throw error;
  }
}

// External API timing
async function callExternalAPI(url: string, options: RequestInit) {
  const start = performance.now();
  try {
    const response = await fetch(url, options);
    metrics.timing(`external.${new URL(url).hostname}`, performance.now() - start);
    return response;
  } catch (error) {
    metrics.timing(`external.${new URL(url).hostname}.error`, performance.now() - start);
    throw error;
  }
}

// Function execution timing
function timeFunction<T extends (...args: any[]) => any>(
  name: string,
  fn: T,
  ...args: Parameters<T>
): ReturnType<T> {
  const start = performance.now();
  const result = fn(...args);
  metrics.timing(name, performance.now() - start);
  return result;
}
```

---

### Reporting

MetricBeat provides multiple ways to output and visualize your metrics:

```typescript
import { MetricBeat } from 'metricbeat';

const metrics = new MetricBeat();

// Add some metrics
metrics.increment('requests');
metrics.gauge('memory', 1024);

// Built-in JSON report
metrics.report();
// Output:
// {
//   "requests": 1,
//   "memory": 1024
// }

// Get raw metrics object for custom processing
const allMetrics = metrics.getMetrics();
console.log(allMetrics);

// Custom reporter - console table format
function reportTable(metrics: Record<string, number>) {
  console.log('\n📊 MetricBeat Report');
  console.log('─'.repeat(50));
  
  for (const [name, value] of Object.entries(metrics)) {
    const formattedValue = typeof value === 'number' 
      ? value.toLocaleString() 
      : value;
    console.log(`  ${name.padEnd(30)} ${formattedValue}`);
  }
  
  console.log('─'.repeat(50));
  console.log(`Total metrics: ${Object.keys(metrics).length}`);
}

reportTable(metrics.getMetrics());

// Custom exporter - Prometheus format
function toPrometheusFormat(metrics: Record<string, number>): string {
  return Object.entries(metrics)
    .map(([name, value]) => {
      const sanitizedName = name.replace(/\./g, '_').replace(/ /g, '_');
      return `# HELP ${sanitizedName} MetricBeat metric\n` +
             `# TYPE ${sanitizedName} gauge\n` +
             `${sanitizedName} ${value}`;
    })
    .join('\n');
}

console.log(toPrometheusFormat(metrics.getMetrics()));

// CloudWatch format
function toCloudWatchFormat(metrics: Record<string, number>) {
  return Object.entries(metrics).map(([name, value]) => ({
    MetricName: name,
    Value: value,
    Unit: 'None',
    Timestamp: new Date()
  }));
}
```

---

## API Reference

### MetricBeat Class

```typescript
import { MetricBeat } from 'metricbeat';

const metrics = new MetricBeat(options?: MetricBeatOptions);
```

#### Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `prefix` | `string` | `''` | Prefix for all metric names |
| `enabled` | `boolean` | `true` | Enable/disable metric collection |
| `maxMetrics` | `number` | `1000` | Maximum number of metrics to store |

```typescript
const metrics = new MetricBeat({
  prefix: 'myapp',
  enabled: true,
  maxMetrics: 5000
});
```

---

### Methods

#### `increment(name: string, value?: number): void`

Increments a counter metric by the specified value (default: 1).

```typescript
// Increment by 1
metrics.increment('requests');

// Increment by custom value
metrics.increment('bytes_sent', 1024);

// Increment with namespaced name
metrics.increment('api.users.created', 5);
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | ✅ | Metric name |
| `value` | `number` | ❌ | Increment value (default: 1) |

**Returns:** `void`

---

#### `gauge(name: string, value: number): void`

Sets a gauge metric to a specific value.

```typescript
// Set gauge value
metrics.gauge('memory_usage', 1024);

// Update gauge value
metrics.gauge('active_users', currentUserCount);
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | ✅ | Metric name |
| `value` | `number` | ✅ | Gauge value |

**Returns:** `void`

---

#### `timing(name: string, duration: number): void`

Records a timing/duration metric.

```typescript
// Record timing
metrics.timing('request_duration', 125.5); // milliseconds
metrics.timing('db_query', 23.4);
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | ✅ | Metric name |
| `duration` | `number` | ✅ | Duration in milliseconds |

**Returns:** `void`

---

#### `getMetrics(): Record<string, number>`

Returns all collected metrics as a plain object.

```typescript
const allMetrics = metrics.getMetrics();
// {
//   requests: 150,
//   errors: 5,
//   memory_usage: 1024000,
//   request_duration: 125.5
// }
```

**Returns:** `Record<string, number>` - All metrics as key-value pairs

---

#### `report(): void`

Outputs all metrics to the console in JSON format.

```typescript
metrics.report();
// Console output:
// {
//   "requests": 150,
//   "errors": 5,
//   ...
// }
```

**Returns:** `void`

---

#### `reset(): void`

Clears all collected metrics.

```typescript
metrics.reset();
console.log(metrics.getMetrics()); // {}
```

**Returns:** `void`

---

## Advanced Usage

### Custom Reporters

Create custom reporters for different monitoring systems:

```typescript
// StatsD compatible reporter
class StatsDReporter {
  private host: string;
  private port: number;

  constructor(host = 'localhost', port = 8125) {
    this.host = host;
    this.port = port;
  }

  send(metrics: Record<string, number>) {
    const payload = Object.entries(metrics)
      .map(([name, value]) => `${name}:${value}|g`)
      .join('\n');
    
    // Send to StatsD server
    // udp.send(payload, this.port, this.host);
    console.log('StatsD payload:', payload);
  }
}

// Prometheus exporter
class PrometheusExporter {
  export(metrics: Record<string, number>): string {
    const lines: string[] = [];
    
    for (const [name, value] of Object.entries(metrics)) {
      const cleanName = name.replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`metricbeat_${cleanName} ${value}`);
    }
    
    return lines.join('\n');
  }
}

// Usage
const reporter = new StatsDReporter();
const exporter = new PrometheusExporter();

metrics.report = () => {
  const data = metrics.getMetrics();
  reporter.send(data);
  console.log(exporter.export(data));
};
```

---

### Metric Namespacing

Organize metrics with consistent naming conventions:

```typescript
// Define metric categories
const MetricNames = {
  http: {
    requests: (method: string, path: string) => `http.${method}.${path}`,
    duration: (method: string, path: string) => `http.${method}.${path}.duration`,
    errors: (method: string, path: string) => `http.${method}.${path}.errors`,
  },
  database: {
    queries: (operation: string) => `db.${operation}`,
    duration: (operation: string) => `db.${operation}.duration`,
    errors: (operation: string) => `db.${operation}.errors`,
  },
  business: {
    users: {
      signups: () => 'biz.users.signups',
      logins: () => 'biz.users.logins',
      active: () => 'biz.users.active',
    },
    transactions: {
      total: () => 'biz.transactions.total',
      volume: () => 'biz.transactions.volume',
    },
  },
} as const;

// Usage
metrics.increment(MetricNames.http.requests('GET', '/api/users'));
metrics.increment(MetricNames.http.errors('GET', '/api/users'));
metrics.timing(MetricNames.http.duration('GET', '/api/users'), 45.2);

metrics.increment(MetricNames.business.users.signups());
metrics.gauge(MetricNames.business.users.active(), currentActiveUsers);
```

---

### Integration with Monitoring Tools

#### Prometheus Integration

```typescript
import { MetricBeat } from 'metricbeat';
import express from 'express';

const app = express();
const metrics = new MetricBeat();

// ... your application code ...

// Prometheus metrics endpoint
app.get('/metrics', (req, res) => {
  const allMetrics = metrics.getMetrics();
  
  let output = '# HELP metricbeat_info MetricBeat metrics\n';
  output += '# TYPE metricbeat_info gauge\n';
  output += 'metricbeat_info 1\n\n';
  
  for (const [name, value] of Object.entries(allMetrics)) {
    const cleanName = name.replace(/\./g, '_');
    output += `# HELP metricbeat_${cleanName} MetricBeat metric\n`;
    output += `# TYPE metricbeat_${cleanName} gauge\n`;
    output += `metricbeat_${cleanName} ${value}\n`;
  }
  
  res.set('Content-Type', 'text/plain');
  res.send(output);
});

app.listen(3000);
```

#### CloudWatch Integration

```typescript
import { MetricBeat } from 'metricbeat';
import { CloudWatch } from '@aws-sdk/client-cloudwatch';

const metrics = new MetricBeat();
const cwClient = new CloudWatch({ region: 'us-east-1' });

async function pushToCloudWatch() {
  const allMetrics = metrics.getMetrics();
  const timestamp = new Date();
  
  const metricData = Object.entries(allMetrics).map(([name, value]) => ({
    MetricName: name,
    Value: value,
    Unit: 'None',
    Timestamp: timestamp,
    Dimensions: [
      { Name: 'Service', Value: 'MetricBeat' },
      { Name: 'Environment', Value: process.env.NODE_ENV || 'development' }
    ]
  }));
  
  await cwClient.putMetricData({
    Namespace: 'MyApplication',
    MetricData: metricData
  });
}

// Push every minute
setInterval(pushToCloudWatch, 60000);
```

---

## TypeScript Support

MetricBeat is written in TypeScript and provides full type safety:

```typescript
import { MetricBeat, MetricBeatOptions } from 'metricbeat';

// Typed options
const options: MetricBeatOptions = {
  prefix: 'myapp',
  enabled: true,
  maxMetrics: 1000
};

const metrics = new MetricBeat(options);

// Type-safe methods
metrics.increment('requests', 1);  // ✅
metrics.increment('requests', '1'); // ❌ TypeScript error
metrics.gauge('memory', 1024);     // ✅
metrics.gauge('memory', '1024');   // ❌ TypeScript error

// Typed return value
const allMetrics = metrics.getMetrics();
// Record<string, number>
```

---

## Browser Support

MetricBeat works in all modern browsers:

```html
<!DOCTYPE html>
<html>
<head>
  <title>MetricBeat Browser Demo</title>
</head>
<body>
  <script type="module">
    import { MetricBeat } from './dist/metricbeat.esm.js';
    
    const metrics = new MetricBeat();
    
    // Track page views
    metrics.increment('page.views');
    metrics.gauge('viewport.width', window.innerWidth);
    metrics.gauge('viewport.height', window.innerHeight);
    
    // Track user interactions
    document.addEventListener('click', () => {
      metrics.increment('user.clicks');
    });
    
    // Report on unload
    window.addEventListener('beforeunload', () => {
      metrics.report();
    });
  </script>
</body>
</html>
```

---

## Best Practices

### 1. Use Consistent Naming Conventions

```typescript
// ✅ Good: Consistent dot notation
metrics.increment('api.v1.users.create');
metrics.increment('api.v1.users.delete');
metrics.increment('api.v1.orders.create');

// ❌ Bad: Inconsistent naming
metrics.increment('userCreated');
metrics.increment('delete_order');
metrics.increment('API_ERRORS');
```

### 2. Add Metric Labels/Namespaces

```typescript
// ✅ Good: Namespaced metrics
metrics.increment('service.api.requests');
metrics.increment('service.database.queries');
metrics.increment('service.cache.hits');

// ❌ Bad: Flat naming
metrics.increment('api_requests');
metrics.increment('db_queries');
metrics.increment('cache_hits');
```

### 3. Choose the Right Metric Type

| Scenario | Metric Type |
|----------|-------------|
| Counting events | Counter |
| Current resource usage | Gauge |
| Operation duration | Timer |
| Rate of change | Counter (with time) |

### 4. Avoid High Cardinality

```typescript
// ❌ Bad: High cardinality (thousands of unique values)
metrics.gauge('user.id', userId); // Don't do this!

// ✅ Good: Low cardinality
metrics.increment('users.active');
metrics.gauge('users.active.count', 42);
```

---

## Performance Considerations

MetricBeat is designed for minimal overhead:

- **O(1) operations** - All metric operations are constant time
- **No allocations** - Minimal garbage collection pressure
- **Lazy evaluation** - Metrics stored efficiently in Map
- **Batch reporting** - Collect metrics before sending

For high-throughput applications (>10,000 metrics/second):

```typescript
// Batch updates for high-frequency metrics
class BatchMetrics {
  private batch = new Map<string, number>();
  private flushInterval = 1000; // ms
  
  constructor(private metrics: MetricBeat) {
    setInterval(() => this.flush(), this.flushInterval);
  }
  
  increment(name: string, value = 1) {
    this.batch.set(name, (this.batch.get(name) || 0) + value);
  }
  
  private flush() {
    for (const [name, value] of this.batch) {
      this.metrics.increment(name, value);
    }
    this.batch.clear();
  }
}
```

---

## Migration Guide

### From v0.x to v1.0

```typescript
// v0.x
const mb = new MetricBeat();
mb.inc('requests');
mb.set('memory', 1024);
mb.time('request');

// v1.0
const metrics = new MetricBeat();
metrics.increment('requests');     // was inc()
metrics.gauge('memory', 1024);     // was set()
metrics.timing('request', 50);    // was time()
```

---

## FAQ

**Q: Is MetricBeat thread-safe?**
A: For Node.js, use separate instances per worker or use atomic operations for shared state.

**Q: How do I persist metrics?**
A: Use `getMetrics()` and store to your preferred storage (Redis, database, file).

**Q: Can I export to Prometheus?**
A: Yes, use the Prometheus format shown in the Reporting section.

**Q: What's the bundle size?**
A: ~1KB gzipped, zero dependencies.

---

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

---

## License

MIT License - Copyright (c) 2024 MetricBeat Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

<div align="center">
  <strong>MetricBeat</strong> - Lightweight metrics for modern applications
  
  Made with ❤️ for the developer community
</div>
