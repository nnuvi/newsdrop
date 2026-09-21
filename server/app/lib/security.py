import hashlib
import hmac
from datetime import datetime, timedelta, timezone

import jwt
from app.core.config import settings
from loguru import logger
from pwdlib import PasswordHash

SECRET_KEY = settings.jwt_secret
ALGORITHM = settings.jwt_algorithm

RESET_TOKEN_MINUTES = 15

hasher = PasswordHash.recommended()
    

# ---------- generic encode / decode ----------


def _encode(
    sub: str,
    token_type: str,
    lifetime: timedelta,
    **extra,
) -> str:
    logger.debug(
        "Creating JWT | type={} subject={} lifetime={}",
        token_type,
        sub,
        lifetime,
    )

    now = datetime.now(timezone.utc)

    payload = {
        "sub": sub,
        "type": token_type,
        "iat": now,
        "exp": now + lifetime,
        **extra,
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    logger.debug(
        "JWT created | type={} subject={}",
        token_type,
        sub,
    )

    return token


def _decode(
    token: str,
    token_type: str,
) -> dict:
    logger.debug(
        "Decoding JWT | expected_type={}",
        token_type,
    )

    payload = jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM],
        options={
            "require": [
                "exp",
                "iat",
                "sub",
            ],
        },
    )

    actual_type = payload.get("type")

    logger.debug(
        "JWT decoded | subject={} type={}",
        payload.get("sub"),
        actual_type,
    )

    if actual_type != token_type:
        logger.warning(
            "JWT type mismatch | expected={} actual={} subject={}",
            token_type,
            actual_type,
            payload.get("sub"),
        )

        raise jwt.InvalidTokenError("wrong token type")

    return payload


# ---------- access tokens ----------


def create_access_token(
    user_id: str,
) -> str:
    logger.debug(
        "Creating access token | user_id={} expiry_minutes={}",
        user_id,
        settings.jwt_expire_minutes,
    )

    return _encode(
        user_id,
        "access",
        timedelta(minutes=settings.jwt_expire_minutes),
    )


def decode_access_token(
    token: str,
) -> dict:
    logger.debug("Decoding access token")

    return _decode(
        token,
        "access",
    )


# ---------- password reset tokens ----------


def password_fingerprint(
    password_hash: str,
) -> str:
    fingerprint = hashlib.sha256(password_hash.encode()).hexdigest()[:16]

    logger.debug("Password fingerprint generated")

    return fingerprint


def create_reset_token(
    user_id: str,
    password_hash: str,
) -> str:
    logger.debug(
        "Creating password reset token | user_id={} expiry_minutes={}",
        user_id,
        RESET_TOKEN_MINUTES,
    )

    return _encode(
        user_id,
        "reset",
        timedelta(minutes=RESET_TOKEN_MINUTES),
        fp=password_fingerprint(password_hash),
    )


def decode_reset_token(
    token: str,
) -> dict:
    logger.debug("Decoding password reset token")

    return _decode(
        token,
        "reset",
    )


def reset_token_matches(
    payload: dict,
    password_hash: str,
) -> bool:
    """
    Return False if the password was changed
    after the reset token was issued.
    """

    token_fingerprint = str(payload.get("fp", ""))

    current_fingerprint = password_fingerprint(password_hash)

    matches = hmac.compare_digest(
        token_fingerprint,
        current_fingerprint,
    )

    logger.debug(
        "Password reset token fingerprint check | user_id={} matches={}",
        payload.get("sub"),
        matches,
    )

    return matches
