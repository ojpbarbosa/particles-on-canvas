import torch
import torch.nn as nn
from typing import List


def init_normal_weights(module: nn.Module):
    """
    Initializes the weights of the module to a normal distribution.

    This function modifies the module's weights and biases in-place if the module
    is of type `Linear`.

    Parameters
    ----------
    module : nn.Module
        The neural network module whose weights and biases are to be initialized.

    Returns
    -------
    None
    """
    classname = module.__class__.__name__
    if classname.find('Linear') != -1:
        module.weight.data.normal_(0.0, 1.0)
        module.bias.data.normal_(0.0, 0.1)
    return None


def get_activation_function(function: str):
    """
    Returns an activation function based on the given string identifier.

    Parameters
    ----------
    function : str
        The name of the activation function to retrieve.

    Returns
    -------
    A PyTorch activation function class or function.
    If the specified function is not found, it defaults to `nn.Tanh()`.

    """
    available_functions = {
        "tanh": nn.Tanh(),
        "sigmoid": nn.Sigmoid(),
        "relu": nn.ReLU(),
        "softsign": nn.Softsign(),
        "sin": torch.sin,
        "cos": torch.cos
    }

    function = function.lower()

    if function in available_functions:
        return available_functions[function]
    else:
        print(f"Non-supported activation function {function}. Using tanh.")
        return nn.Tanh()


class FeedForwardNetwork(nn.Module):
    """
    A feedforward neural network model using PyTorch.

    Parameters
    ----------
    layers_dims : List[int]
        A list containing the sizes of each layer in the network.
    activation_function : str
        The name of the activation function to use between layers.
    color_mode : str
        The color mode of the network's output (e.g., 'rgb', 'hsv', 'cmyk', 'bw').
    alpha : bool
        Indicates whether an alpha channel should be included in the output.

    Attributes
    ----------
    layers : nn.ModuleList
        A list of linear layers in the network.
    activation : Callable
        The activation function to use between layers.

    """

    def __init__(self,
                 layers_dimensions: List[int] = [10, 10, 10, 10, 10],
                 activation_function: str = "tanh",
                 color_mode: str = "rgb",
                 alpha: bool = True):
        super(FeedForwardNetwork, self).__init__()

        # processing the color_mode and alpha to determine the output nodes
        color_mode = color_mode.lower()
        if color_mode in ["rgb", "hsv", "hsl"]:
            out_nodes = 3 + int(alpha)
        elif color_mode == "cmyk":
            out_nodes = 4 + int(alpha)
        else:  # "bw" or default
            out_nodes = 1 + int(alpha)

        # initializing the layers of the network
        input_layer = nn.Linear(
            in_features=5, out_features=layers_dimensions[0], bias=True)
        output_layer = nn.Linear(
            in_features=layers_dimensions[-1], out_features=out_nodes, bias=True)

        self.layers = nn.ModuleList([input_layer] +
                                    [nn.Linear(in_features=layers_dimensions[i],
                                               out_features=layers_dimensions[i + 1], bias=True)
                                     for i in range(len(layers_dimensions) - 1)] +
                                    [output_layer]
                                    )

        self.activation = get_activation_function(activation_function)
        self.apply(init_normal_weights)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Defines the forward pass of the network.

        Parameters
        ----------
        x : torch.Tensor
            The input tensor to the network.

        Returns
        -------
        torch.Tensor
            The output tensor of the network after passing through the layers and activations.
        """
        out = x
        for i, layer in enumerate(self.layers):
            out = layer(out)
            if i < len(self.layers) - 1:
                out = self.activation(out)
            else:
                out = torch.sigmoid(out)

        return out
