from app.repository.signature_repository import SignatureRepository
from app.repository.bucket_repository import BucketRepository
from app.service.signature_service import SignatureService
from app.controller.signature_controller import SignatureController
from app.controller.heartbeat_controller import HeartbeatController


def signature_controller_factory() -> SignatureController:
    signature_repository = SignatureRepository()
    bucket_repository = BucketRepository()

    signature_service = SignatureService(
        signature_repository, bucket_repository)
    return SignatureController(signature_service)


def heartbeat_controller_factory() -> HeartbeatController:
    return HeartbeatController()
