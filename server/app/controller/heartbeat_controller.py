from flask import request


class HeartbeatController:
    def heartbeat(self, request: request):
        return ('', 204)
