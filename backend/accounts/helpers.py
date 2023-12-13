"""Helpers for the accounts app."""
from typing import Optional

import os
import shortuuid
from django.utils.deconstruct import deconstructible


@deconstructible
class RandomFileName:
    """Generate a random filename for uploaded files."""
    def __init__(self, path: Optional[str] = None):
        """Initialize the helper.

        Args:
            path: The path to the file, relative to the media root.
                If ``None``, the path will be
                ``<media root>/<random uuid><extension>``.
        """
        self.path = os.path.join(path, "%s%s")

    def __call__(self, _, filename: str) -> str:
        """Return the path to the file."""
        extension = os.path.splitext(filename)[1]
        return self.path % (shortuuid.uuid(), extension)
