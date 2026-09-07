# tests/conftest.py  (root — shared across ALL modules)
import pytest
from app.main import app
from httpx import ASGITransport, AsyncClient


@pytest.fixture
async def base_client():
    transport = ASGITransport(app=app)

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:
        try:
            yield client
        finally:
            app.dependency_overrides.clear()


# @pytest.fixture
# async def base_client():
#     """No dependency overrides applied — just the raw app wired for HTTP testing."""
#     transport = ASGITransport(app=app)
#     async with AsyncClient(transport=transport, base_url="http://test") as ac:
#         yield ac
#     app.dependency_overrides.clear()  # reset after every test, no matter which module


# @pytest.fixture
# def auth_headers():
#     from app.core.security import create_access_token
#     token = create_access_token(data={"sub": "test-user-id"})
#     return {"Authorization": f"Bearer {token}"}
