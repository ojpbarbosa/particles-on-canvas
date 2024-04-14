import numpy as np
import torch
from multiprocessing import Pool


def hsv_to_rgb(hue: float, saturation: float, value: float) -> tuple:
    """
    Convert a color from HSV to RGB.

    Parameters
    ----------
    hue : float
        Hue component of the color.
    saturation : float
        Saturation component of the color.
    value : float
        Value component of the color.

    Returns
    -------
    tuple
        The RGB representation of the color.
    """
    hue *= 6
    index = np.floor(hue)
    f = hue - index
    p = value * (1 - saturation)
    q = value * (1 - f * saturation)
    t = value * (1 - (1 - f) * saturation)

    mod = int(index % 6)
    r = [value, q, p, p, t, value][mod]
    g = [t, value, value, q, p, p][mod]
    b = [p, p, t, value, value, q][mod]

    return r, g, b


def hsv_to_rgb_torch(image: torch.Tensor) -> torch.Tensor:
    """
    Convert an HSV image to RGB format using a tensor.

    Parameters
    ----------
    image : torch.Tensor
        The image tensor in HSV format.

    Returns
    -------
    torch.Tensor
        The image tensor in RGB format.
    """
    _h = image[:, :, 0].flatten().detach().numpy()
    _s = image[:, :, 1].flatten().detach().numpy()
    _v = image[:, :, 2].flatten().detach().numpy()

    h = 6 * _h
    i = np.floor(h)
    f = h - i
    p = _v * (1 - _s)
    q = _v * (1 - f * _s)
    t = _v * (1 - (1 - f) * _s)

    mod = [int(a % 6) for a in i]
    r_select = torch.tensor([[_v[i], q[i], p[i], p[i], t[i], _v[i]][m] for i, m in enumerate(
        mod)]).view(image.size(0), image.size(1)).unsqueeze(-1)
    g_select = torch.tensor([[t[i], _v[i], _v[i], q[i], p[i], p[i]][m] for i, m in enumerate(
        mod)]).view(image.size(0), image.size(1)).unsqueeze(-1)
    b_select = torch.tensor([[p[i], p[i], t[i], _v[i], _v[i], q[i]][m] for i, m in enumerate(
        mod)]).view(image.size(0), image.size(1)).unsqueeze(-1)

    return torch.cat([r_select, g_select, b_select], dim=-1)


def hsl_to_rgb(h: float, s: float, l: float) -> tuple:
    """
    Convert HSL color space to RGB color space.

    Parameters
    ----------
    h : float
        Hue component of the color, must be in the range [0, 1].
    s : float
        Saturation component of the color, must be in the range [0, 1].
    l : float
        Lightness component of the color, must be in the range [0, 1].

    Returns
    -------
    tuple
        The RGB representation of the color as a tuple (r, g, b), each in the range [0, 1].
    """
    if s == 0:
        # achromatic (grey)
        r = g = b = l
    else:
        def hue_to_rgb(p, q, t):
            if t < 0:
                t += 1
            if t > 1:
                t -= 1
            if t < 1 / 6:
                return p + (q - p) * 6 * t
            if t < 1 / 2:
                return q
            if t < 2 / 3:
                return p + (q - p) * (2 / 3 - t) * 6
            return p

        q = l * (1 + s) if l < 0.5 else l + s - l * s
        p = 2 * l - q
        r = hue_to_rgb(p, q, h + 1/3)
        g = hue_to_rgb(p, q, h)
        b = hue_to_rgb(p, q, h - 1/3)

    return (r, g, b)


def hsl_to_rgb_torch(h: torch.Tensor, s: torch.Tensor, l: torch.Tensor) -> torch.Tensor:
    """
    Convert an HSL image to RGB format using tensors.

    Parameters
    ----------
    h : torch.Tensor
        Hue values of the image.
    s : torch.Tensor
        Saturation values of the image.
    l : torch.Tensor
        Lightness values of the image.

    Returns
    -------
    torch.Tensor
        The image tensor in RGB format.
    """
    _h = h.cpu().data.numpy()
    _s = s.cpu().data.numpy()
    _l = l.cpu().data.numpy()

    with Pool(processes=3) as pool:
        rgb_values = pool.starmap(hsl_to_rgb, zip(_h, _s, _l))

    return torch.Tensor(rgb_values)
