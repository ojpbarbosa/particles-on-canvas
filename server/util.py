def str_to_bool(string: str) -> bool:
    """
    Convert a string representation of truth to its boolean value.

    Parameters
    ----------
    string : str
        The string to convert into a boolean value. Accepts 'true', 'yes', 'y', 't', '1' for True
        and 'false', 'no', 'n', 'f', '0' for False, case-insensitively.

    Returns
    -------
    bool
        The boolean value of the input string.

    Raises
    ------
    ValueError
        If the input string does not represent a boolean value.
    """
    true_values = {"true", "yes", "y", "t", "1"}
    false_values = {"false", "no", "n", "f", "0"}

    lower_string = string.lower()
    if lower_string in true_values:
        return True
    elif lower_string in false_values:
        return False
    else:
        raise ValueError(
            f"Input string '{string}' does not represent a boolean value.")
