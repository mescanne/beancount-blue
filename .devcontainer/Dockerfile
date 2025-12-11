# Use the official Python 3.14 image (Debian Bookworm is recommended for Dev Containers)
FROM python:3.14-bookworm

# Install basic development tools (git, etc.)
# Clean up apt cache to keep image size down
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# --- Install uv ---
# The fastest/cleanest way is to copy the binary from the official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# (Optional) Configure uv to create venvs in the project directory by default
# This makes it easier for VS Code to find the interpreter
ENV UV_VENV_IN_PROJECT=1

# Create a non-root user 'vscode' (Best practice for Dev Containers)
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    # Add sudo support for the non-root user
    && apt-get update \
    && apt-get install -y sudo \
    && echo $USERNAME ALL=(ALL) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Set the default user
USER $USERNAME
