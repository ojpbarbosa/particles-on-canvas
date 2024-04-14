from repository.signature_repository import SignatureRepository
from service.signature_service import SignatureService
from controller.signature_controller import SignatureController
from controller.heartbeat_controller import HeartbeatController


def signature_controller_factory() -> SignatureController:
    signature_repository = SignatureRepository()
    signature_service = SignatureService(signature_repository)
    return SignatureController(signature_service)


def heartbeat_controller_factory() -> HeartbeatController:
    return HeartbeatController()
