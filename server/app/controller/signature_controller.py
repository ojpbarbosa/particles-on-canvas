from flask import request, jsonify
from service.signature_service import SignatureService


class SignatureController:
    def __init__(self, signature_service: SignatureService):
        self.signature_service = signature_service

    def create(self, request: request):
        data = request.json

        particles = data.get('particles', [])

        n_images = int(data.get('images', 1))
        image_height = int(data.get('height', 512))
        image_width = int(data.get('width', 512))

        symmetry = data.get('symmetry', False)
        trig = data.get('trig', False)
        alpha = data.get('alpha', False)
        noise = data.get('noise', False)

        activation = data.get('activation', 'tanh')

        layer_dimensions, combined_velocity, color_mode, signatures = self.signature_service.create_signatures(
            particles, n_images, image_height, image_width, symmetry, trig, alpha, noise, activation
        )

        def split_signatures(signature_tuple):
            seed, image = signature_tuple
            return {
                'seed': seed,
                'image': image
            }

        mapped_signatures = list(map(split_signatures, signatures))

        return jsonify({
            'layerDimensions': layer_dimensions,
            'combinedVelocity': combined_velocity,
            'strategy': color_mode,
            'signatures': mapped_signatures
        }), 201
