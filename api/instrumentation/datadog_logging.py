import logging
from ddtrace import patch

def setup_logging():
    patch(logging=True)
    logging.basicConfig(level=logging.INFO)
