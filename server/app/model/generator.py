import cv2
import numpy as np
import torch
from .neural_network import FeedForwardNetwork
from .helper import hsl_to_rgb_torch, hsv_to_rgb_torch


def process_xy_meshgrid(x_values: np.ndarray, y_values: np.ndarray, symmetry: bool, trig: bool, z1: float, z2: float) -> torch.Tensor:
    '''
    Process x and y coordinate arrays through specified transformations and generates a combined tensor.

    Parameters
    ----------
    x_values : np.ndarray
        The x coordinates array.
    y_values : np.ndarray
        The y coordinates array.
    symmetry : bool
        Apply symmetry by squaring the coordinates if True.
    trig : bool
        Apply trigonometric transformation using z1 and z2 as factors if True.
    z1 : float
        The z1 factor for cosine or constant multiplication.
    z2 : float
        The z2 factor for sine or constant multiplication.

    Returns
    -------
    torch.Tensor
        A tensor combining the transformed x, y, radius, and z1, z2 values.
    '''
    if symmetry:
        x_values = x_values ** 2
        y_values = y_values ** 2

    _radius = np.sqrt(x_values ** 2 + y_values ** 2)

    if trig:
        _z1 = np.cos(z1 * x_values)
        _z2 = np.sin(z2 * y_values)
    else:
        _z1 = np.full_like(x_values, z1, dtype=np.float32)
        _z2 = np.full_like(y_values, z2, dtype=np.float32)

    _x = np.expand_dims(x_values.T.flatten(), axis=1)
    _y = np.expand_dims(y_values.T.flatten(), axis=1)
    _radius = np.expand_dims(_radius.T.flatten(), axis=1)
    _z1 = np.expand_dims(_z1.T.flatten(), axis=1)
    _z2 = np.expand_dims(_z2.T.flatten(), axis=1)

    return torch.from_numpy(np.concatenate([_x, _y, _radius, _z1, _z2], axis=1)).float()


def init_data(image_height: int = 512, image_width: int = 512, symmetry: bool = False, trig: bool = True, z1: float = -0.618, z2: float = 0.618, noise: bool = False, noise_std: float = 0.01):
    '''
    Initialize data for the neural network by creating a meshgrid and processing it.

    Parameters
    ----------
    image_height : int, optional
        The height of the image.
    image_width : int, optional
        The width of the image.
    symmetry : bool, optional
        Apply symmetry transformation if True.
    trig : bool, optional
        Apply trigonometric transformation if True.
    z1 : float, optional
        The z1 factor for cosine or constant multiplication.
    z2 : float, optional
        The z2 factor for sine or constant multiplication.
    noise : bool, optional
        Add Gaussian noise if True.
    noise_std : float, optional
        Standard deviation of the Gaussian noise.

    Returns
    -------
    torch.Tensor
        The initialized data as a tensor.
    '''
    factor = min(image_height, image_width)

    x = [(i / factor - 0.5) * 2 for i in range(image_height)]
    y = [(j / factor - 0.5) * 2 for j in range(image_width)]

    xv, yv = np.meshgrid(x, y)
    processed_data = process_xy_meshgrid(xv, yv, symmetry, trig, z1, z2)

    if noise:
        processed_data += torch.randn_like(processed_data) * noise_std

    return processed_data


def transform_colors(image: torch.Tensor, color_mode: str, alpha: bool) -> torch.Tensor:
    '''
    Transform the colors of an image based on the specified color mode and alpha channel inclusion.

    Parameters
    ----------
    image : torch.Tensor
        The image tensor to transform.
    color_mode : str
        The color mode to use for transformation ('rgb', 'bw', 'cmyk', 'hsv', 'hsl').
    alpha : bool
        Include an alpha channel in the output if True.

    Returns
    -------
    torch.Tensor
        The color-transformed image tensor.
    '''
    if alpha:
        alpha_tensor = image[:, :, -1]
        alpha_val = 1 - torch.abs(2 * alpha_tensor - 1)
        alpha_val = 0.25 + 0.75 * alpha_val
        a = alpha_val.unsqueeze(-1)
    else:
        a = torch.ones((image.size(0), image.size(1)),
                       device=image.device).unsqueeze(-1)

    if color_mode == 'rgb':
        processed_image = image[:, :, 0:3]
    elif color_mode == 'bw':
        processed_image = torch.cat([image[:, :, 0].unsqueeze(-1)] * 3, dim=-1)
    elif color_mode == 'cmyk':
        r = (1 - image[:, :, 0]) * image[:, :, 3]
        g = (1 - image[:, :, 1]) * image[:, :, 3]
        b = (1 - image[:, :, 2]) * image[:, :, 3]
        processed_image = torch.stack([r, g, b], dim=-1)
    elif color_mode == 'hsv':
        processed_image = hsv_to_rgb_torch(image)
    elif color_mode == 'hsl':
        h = image[:, :, 0].flatten()
        s = image[:, :, 1].flatten()
        l = image[:, :, 2].flatten()
        processed_image = hsl_to_rgb_torch(h, s, l).view(image.size(
            0), image.size(1), 3)
    else:
        raise ValueError(f'Non-supported color mode {color_mode}')

    return torch.cat([processed_image, a], dim=-1)


def create_image(network: FeedForwardNetwork,
                 image_height: int = 512,
                 image_width: int = 512,
                 symmetry: bool = False,
                 trig: bool = True,
                 color_mode: str = 'rgb',
                 alpha: bool = True,
                 z1: float = -0.618,
                 z2: float = 0.618,
                 filename: str = 'image',
                 file_format: str = 'png',
                 save: bool = True,
                 use_gpu: bool = False,
                 with_noise: bool = False,
                 noise_std: float = 0.01) -> torch.Tensor:
    '''
    Generate and save an image using a specified neural network model and a set of parameters.

    Parameters
    ----------
    network : FeedForwardNetwork
        The neural network model used to generate the image.
    image_height : int, optional
        The height of the output image in pixels. Default is 512.
    image_width : int, optional
        The width of the output image in pixels. Default is 512.
    symmetry : bool, optional
        Whether to apply symmetry in the generation process. Default is False.
    trig : bool, optional
        Whether to use trigonometric functions in the input data initialization. Default is True.
    color_mode : str, optional
        The color mode to apply to the generated image ('rgb', 'bw', 'cmyk', 'hsv', 'hsl'). Default is 'rgb'.
    alpha : bool, optional
        Include an alpha channel in the output image. Default is True.
    z1 : float, optional
        First latent variable for input data initialization. Default is -0.618.
    z2 : float, optional
        Second latent variable for input data initialization. Default is 0.618.
    filename : str, optional
        The filename to save the generated image. Default is 'image'.
    file_format : str, optional
        The file format to save the image (e.g., 'png', 'jpg'). Default is 'png'.
    save : bool, optional
        Whether to save the generated image to disk. Default is True.
    use_gpu : bool, optional
        Whether to perform computation on a GPU. Default is False.
    with_noise : bool, optional
        Whether to add noise to the input data. Default is False.
    noise_std : float, optional
        Standard deviation of the noise added to the input data if 'with_noise' is True. Default is 0.01.

    Returns
    -------
    torch.Tensor
        A tensor representing the generated image, returned as a NumPy array.

    Notes
    -----
    This function handles device placement of tensors (CPU/GPU), noise addition, image generation,
    color transformation based on the specified mode, and optionally saves the image to a file.
    '''
    input_data = init_data(image_height, image_width, symmetry,
                           trig, z1, z2, noise=with_noise, noise_std=noise_std)

    if use_gpu:
        input_data = input_data.cuda()
        network = network.cuda()

    with torch.no_grad():
        image = network(input_data)

    if use_gpu:
        image = image.cpu()

    image = image.view(image_height, image_width, image.size(-1))
    image = transform_colors(image, color_mode, alpha)

    if save:
        if not filename.endswith(f'.{file_format}'):
            filename += f'.{file_format}'

        image_np = image.numpy()

        image_np = np.clip(image_np, 0, 1)
        image_np = (image_np * 255).astype(np.uint8)

        cv2.imwrite(filename, cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR))

    return image
