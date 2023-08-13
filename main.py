import secrets
import base64


def generate_secret(length=32):
    """Generate a cryptographically secure random secret."""
    return base64.b64encode(secrets.token_bytes(length)).decode('utf-8')


# Generate a secret of 32 bytes (which will be encoded to a base64 string of approximately 44 characters)
secret = generate_secret()

print(secret)
