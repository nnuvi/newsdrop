import hashlib
import hmac
from datetime import UTC, datetime, timedelta

import jwt
from app.core.config import settings
from app.core.logger import logger
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
        "Creating JWT | type={} has_subject={} lifetime={}",
        token_type,
        bool(sub),
        lifetime,
    )

    now = datetime.now(UTC)

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
        "JWT created | type={} has_subject={} has_token={}",
        token_type,
        bool(sub),
        bool(token),
    )

    return token


def _decode(
    token: str,
    token_type: str,
) -> dict:
    logger.debug(
        "Decoding JWT | expected_type={} has_token={}",
        token_type,
        bool(token),
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

    now = int(datetime.now(UTC).timestamp())
    expires_at = payload.get("exp")

    logger.debug(
        "JWT decoded | has_subject={} type={} has_expiry={} expired={}",
        bool(payload.get("sub")),
        actual_type,
        expires_at is not None,
        (expires_at is not None and now >= expires_at),
    )

    if actual_type != token_type:
        logger.warning(
            "JWT type mismatch | expected={} actual={} has_subject={}",
            token_type,
            actual_type,
            bool(payload.get("sub")),
        )

        raise jwt.InvalidTokenError("wrong token type")

    return payload


# ---------- access tokens ----------


def create_access_token(
    user_id: str,
) -> str:
    logger.debug(
        "Creating access token | has_user_id={} expiry_minutes={}",
        bool(user_id),
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
    logger.debug("Decoding access token | has_token={}", bool(token))
    # logger.debug("Decoding access token | token={}", token)

    return _decode(
        token,
        "access",
    )


# ---------- password reset tokens ----------


def password_fingerprint(
    password_hash: str,
) -> str:
    fingerprint = hashlib.sha256(
        password_hash.encode(),
    ).hexdigest()[:16]

    logger.debug(
        "Password fingerprint generated | has_hash={} has_fingerprint={}",
        bool(password_hash),
        bool(fingerprint),
    )

    return fingerprint


def create_reset_token(
    user_id: str,
    password_hash: str,
) -> str:
    logger.debug(
        "Creating password reset token | "
        "has_user_id={} has_password_hash={} expiry_minutes={}",
        bool(user_id),
        bool(password_hash),
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
    logger.debug(
        "Decoding password reset token | has_token={}",
        bool(token),
    )

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
        "Password reset token fingerprint check | has_subject={} matches={}",
        bool(payload.get("sub")),
        matches,
    )

    return matches
