import base64
import cv2
import hashlib
import numpy as np
from typing import List
from model.generator import create_image
from model.neural_network import FeedForwardNetwork


class SignatureRepository:
    def create_signature(self, layer_dimensions: List[int], color_mode: str, image_height: int, image_width: int, symmetry: bool,
                         trig: bool, alpha: bool, noise: bool, activation: str) -> tuple[str, str]:
        network = FeedForwardNetwork(layers_dimensions=layer_dimensions,
                                     activation_function=activation,
                                     color_mode=color_mode,
                                     alpha=alpha)

        base64_image = self._generate_image_base64(network=network, image_height=image_height, image_width=image_width,
                                                   symmetry=symmetry, trig=trig, alpha=alpha, noise=noise, color_mode=color_mode)

        m = hashlib.sha512()
        m.update(base64_image.encode('utf-8'))
        signature = m.hexdigest()

        return (signature, base64_image)

    def _generate_image_base64(self, network: FeedForwardNetwork, image_height: int, image_width: int,
                               symmetry: bool, trig: bool, alpha: bool, noise: bool, color_mode: str) -> str:
        image_tensor = create_image(
            network, image_height=image_height, image_width=image_width, symmetry=symmetry,
            trig=trig, alpha=alpha, with_noise=noise, color_mode=color_mode, save=False)

        image_np = image_tensor.numpy()

        image_np = np.clip(image_np, 0, 1)
        image_np = (image_np * 255).astype(np.uint8)

        _, buffer = cv2.imencode('.png', image_np)

        base64_image = base64.b64encode(buffer).decode('utf-8')

        return base64_image
