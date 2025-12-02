from datadog_api_client.v2 import ApiClient, MonitorsApi

def send_event(title: str, text: str):
    with ApiClient() as api:
        MonitorsApi(api).create_monitor_event(
            body={"title": title, "text": text}
        )
