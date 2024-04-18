from typing import Dict, List
from app.repository.signature_repository import SignatureRepository
from app.repository.bucket_repository import BucketRepository


class SignatureService:
    def __init__(self, signature_repository: SignatureRepository, bucket_repository: BucketRepository):
        self.signature_repository = signature_repository
        self.bucket_repository = bucket_repository

    def create_signatures(self, particles: List[Dict], n_images: int,
                          image_height: int, image_width: int, symmetry: bool,
                          trig: bool, alpha: bool, noise: bool, activation: str) -> tuple[List[int], int, str, List]:
        signatures = []

        combined_velocity, color_mode = self._get_signature_color_mode(
            particles)
        layer_dimensions = [10] * (len(particles) + 2)

        for _ in range(n_images):
            seed, image_bytes = self.signature_repository.create_signature(layer_dimensions, color_mode, image_height, image_width, symmetry,
                                                                           trig, alpha, noise, activation)

            image_path = self.bucket_repository.upload_signature(
                f'{seed}.png', image_bytes, 'image/png')

            signatures.append((seed, image_path))

        return (layer_dimensions, combined_velocity, color_mode, signatures)

    def _get_signature_color_mode(self, particles: List[Dict]) -> tuple[int, str]:
        if not particles:
            return (0, 'rgb')

        color_weights = {
            'proton': 'bw',
            'kaon': 'rgb',
            'pion': 'cmyk',
            'electron': 'hsv'
        }

        color_totals = {'bw': 0, 'rgb': 0, 'hsv': 0, 'cmyk': 0}

        combined_velocity = 0

        for index, particle in enumerate(particles):
            particle_type = particle.get('particle', 'electron')
            velocity = particle.get('velocity', 0)
            if velocity < 0:
                velocity = 0
            elif velocity > 0.0299792458:
                velocity = 0.0299792458

            default_priority = len(particles) - index
            priority = particle.get('priority', default_priority)
            if priority < 0:
                priority = 0

            particle_weighted_velocity = velocity * priority
            combined_velocity += particle_weighted_velocity

            color = color_weights.get(particle_type, 'rgb')
            color_totals[color] += particle_weighted_velocity

        combined_velocity *= len(particles)
        max_color = max(color_totals, key=color_totals.get)
        return (combined_velocity, max_color)
