import numpy as np
import torch


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


def hsl_to_rgb_torch(h: torch.Tensor, s: torch.Tensor, l: torch.Tensor) -> torch.Tensor:
    """
    Convert an HSL image to RGB format using PyTorch.

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
    c = (1 - torch.abs(2 * l - 1)) * s
    x = c * (1 - torch.abs((h * 6) % 2 - 1))
    m = l - c / 2

    r = torch.zeros_like(h)
    g = torch.zeros_like(h)
    b = torch.zeros_like(h)

    # red dominant segment segment
    mask = (0 <= h) & (h < 1/6)
    r[mask], g[mask], b[mask] = c[mask] + m[mask], x[mask] + m[mask], m[mask]

    # Yellow dominant segment
    mask = (1/6 <= h) & (h < 1/3)
    r[mask], g[mask], b[mask] = x[mask] + m[mask], c[mask] + m[mask], m[mask]

    # green dominant segment
    mask = (1/3 <= h) & (h < 1/2)
    r[mask], g[mask], b[mask] = m[mask], c[mask] + m[mask], x[mask] + m[mask]

    # cyan dominant segment
    mask = (1/2 <= h) & (h < 2/3)
    r[mask], g[mask], b[mask] = m[mask], x[mask] + m[mask], c[mask] + m[mask]

    # blue dominant segment
    mask = (2/3 <= h) & (h < 5/6)
    r[mask], g[mask], b[mask] = x[mask] + m[mask], m[mask], c[mask] + m[mask]

    # magenta dominant segment
    mask = (5/6 <= h) & (h < 1)
    r[mask], g[mask], b[mask] = c[mask] + m[mask], m[mask], x[mask] + m[mask]

    rgb = torch.stack((r, g, b), dim=-1)
    return rgb
