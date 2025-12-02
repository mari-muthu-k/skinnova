from datadog import statsd

class llm_metrics:
    @staticmethod
    def track_request():
        return statsd.timed("llm.request.latency")

    @staticmethod
    def update_tokens(response):
        tokens_in = response.get("input_tokens", 0)
        tokens_out = response.get("output_tokens", 0)

        statsd.increment("llm.tokens.in", tokens_in)
        statsd.increment("llm.tokens.out", tokens_out)
