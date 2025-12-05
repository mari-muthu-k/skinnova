import os
from datadog import DogStatsd

print("Initializing Datadog StatsD client...")
if not os.getenv("DD_AGENT_HOST") or not os.getenv("DD_PORT"):
    raise EnvironmentError("Datadog environment variables DD_AGENT_HOST and DD_PORT must be set.")
datadog_statsd = DogStatsd(host=os.getenv("DD_AGENT_HOST"), port=os.getenv("DD_PORT"))
print("Datadog StatsD client initialized.")

class LLMMetrics:
    def __init__(self):
        self.datadog_statsd = datadog_statsd

    def track_request(self):
        return self.datadog_statsd.timed("llm.request.latency")
    
    def update_tokens(self, response):
        tokens_in = response.get("input_tokens", 0)
        tokens_out = response.get("output_tokens", 0)

        self.datadog_statsd.increment("llm.tokens.in", tokens_in)
        self.datadog_statsd.increment("llm.tokens.out", tokens_out)

    def logging_event(self, event_name, value=1):
        self.datadog_statsd.increment(f"llm.event.{event_name}", value)
    

class APIMetrics:
    def __init__(self):
        self.datadog_statsd = datadog_statsd

    def tracked_request(self):
        return self.datadog_statsd.timed("api.request.latency")
    
def send_metric(metric_name: str, value: int):
    datadog_statsd.gauge(metric_name, value)


llm_metrics = LLMMetrics()
api_metrics = APIMetrics()