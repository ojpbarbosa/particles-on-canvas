from typing import Dict, List
from repository.signature_repository import SignatureRepository


class SignatureService:
    def __init__(self, repository: SignatureRepository):
        self.repository = repository

    def create_signatures(self, particles: List[Dict], n_images: int,
                          image_height: int, image_width: int, symmetry: bool,
                          trig: bool, alpha: bool, noise: bool, activation: str) -> tuple[List[int], int, str, List]:
        signatures = []

        combined_velocity, color_mode = self._get_signature_color_mode(
            particles)
        layer_dimensions = [10] * (len(particles) + 2)

        for _ in range(n_images):
            signatures.append(self.repository.create_signature(layer_dimensions, color_mode, image_height, image_width, symmetry,
                                                               trig, alpha, noise, activation))

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

        color_totals = {'bw': 0, 'rgb': 0, 'hsv': 0, 'cmyk': -10}

        combined_velocity = 0

        for particle in particles:
            particle_type = particle.get('particle', 'electron')
            velocity = particle.get('velocity', 1)
            priority = particle.get('priority', 1)

            particle_weighted_velocity = velocity * priority
            combined_velocity += particle_weighted_velocity

            color = color_weights.get(particle_type, 'rgb')
            color_totals[color] += particle_weighted_velocity

        max_color = max(color_totals, key=color_totals.get)
        return (combined_velocity, max_color)
