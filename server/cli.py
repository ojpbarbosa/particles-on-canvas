import os
import sys
import time
import json
import argparse
from app.model.neural_network import FeedForwardNetwork
from app.model.generator import create_image


def str_to_bool(string: str) -> bool:
    true_values = {'true', 'yes', 'y', 't', '1'}
    false_values = {'false', 'no', 'n', 'f', '0'}

    lower_string = string.lower()
    if lower_string in true_values:
        return True
    elif lower_string in false_values:
        return False
    else:
        raise ValueError(
            f'Input string "{string}" does not represent a boolean value.')


def parse_args():
    parser = argparse.ArgumentParser()

    parser.add_argument('--image-height', type=int, default=512,
                        help='Image height.')
    parser.add_argument('--image-width', type=int, default=512,
                        help='Image width.')
    parser.add_argument('--color-mode', type=str, default='rgb', choices=[
                        'bw', 'rgb', 'cmyk', 'hsv', 'hsl'], help='Color mode for image generation.')
    parser.add_argument('--alpha', type=str_to_bool, default=True,
                        help='Whether to add an alpha channel to the image.')
    parser.add_argument('--n-images', type=int, default=1,
                        help='Number of images to generate.')
    parser.add_argument('--n-depth', type=int, default=5,
                        help='Number of layers in the neural network.')
    parser.add_argument('--n-size', type=int, default=10,
                        help='Number of neurons in each hidden layer.')
    parser.add_argument('--activation', type=str, default='tanh',
                        help='Activation function for the hidden layers.')
    parser.add_argument('--z1', type=float, default=-0.618,
                        help='Deterministic factor z1 for art generation.')
    parser.add_argument('--z2', type=float, default=0.618,
                        help='Deterministic factor z2 for art generation.')
    parser.add_argument('--trig', type=str_to_bool, default=True,
                        help='Whether to apply trigonometric transformations.')
    parser.add_argument('--noise', type=str_to_bool,
                        default=False, help='Whether to add Gaussian noise.')
    parser.add_argument('--noise-std', type=float, default=0.01,
                        help='Standard deviation of the Gaussian noise.')
    parser.add_argument('--symmetry', type=str_to_bool, default=False,
                        help='Whether to use a symmetry in the network.')
    parser.add_argument('--gpu', type=str_to_bool, default=False,
                        help='Whether to use GPU acceleration.')
    parser.add_argument('--format', type=str, default='png', choices=[
                        'png', 'jpg', 'svg', 'pdf'], help='File format for saving the images.')

    return parser.parse_args()


def main():
    args = parse_args()

    if not os.path.exists('images'):
        os.makedirs('images')
    generation_dir = os.path.join('images', time.strftime('%Y-%m-%d-%H-%M-%S'))
    os.makedirs(generation_dir)

    with open(os.path.join(generation_dir, 'seed.json'), 'w') as f:
        json.dump(vars(args), f, indent=2)

    command_line = 'python ' + ' '.join(sys.argv)
    with open(os.path.join(generation_dir, 'command.txt'), 'w') as f:
        f.write(command_line)

    layer_dimensions = [args.n_size] * args.n_depth

    for i in range(args.n_images):
        print(f'Generating image {i + 1}...')
        start_time = time.time()
        filename = os.path.join(generation_dir, f'image-{i + 1}.{args.format}')

        network = FeedForwardNetwork(layers_dimensions=layer_dimensions,
                                     activation_function=args.activation,
                                     color_mode=args.color_mode,
                                     alpha=args.alpha)

        create_image(network, args.image_height, args.image_width,
                     symmetry=args.symmetry, trig=args.trig,
                     color_mode=args.color_mode, alpha=args.alpha,
                     z1=args.z1, z2=args.z2,
                     filename=filename, file_format=args.format,
                     save=True, use_gpu=args.gpu,
                     with_noise=args.noise, noise_std=args.noise_std)

        print(
            f'Image {i + 1} saved in {filename} ({time.time() - start_time:.2f} s)')


if __name__ == '__main__':
    main()
