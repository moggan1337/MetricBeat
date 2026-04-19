export class MetricBeat {
  private metrics = new Map<string, number>();
  increment(name: string, value = 1) { this.metrics.set(name, (this.metrics.get(name) || 0) + value); }
  gauge(name: string, value: number) { this.metrics.set(name, value); }
  timing(name: string, ms: number) { this.metrics.set(name + '.avg', ms); }
  getMetrics() { return Object.fromEntries(this.metrics); }
  report() { console.log(JSON.stringify(this.getMetrics(), null, 2)); }
}
export default MetricBeat;
