from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, HttpUrl


class UserCreate(BaseModel):
    """Profile data. Credentials live separately in the auth collection."""

    username: str = Field(
        min_length=3,
        max_length=30,
        pattern=r"^[A-Za-z0-9_]+$",
    )
    full_name: str | None = Field(
        default=None,
        max_length=120,
    )
    avatar_url: HttpUrl | None = None
    avatar_public_id: str | None = None

    role: Literal["user", "admin"] = "user"


class UserUpdate(BaseModel):
    """PATCH body: only the fields that are sent get changed."""

    username: str | None = Field(
        default=None,
        min_length=3,
        max_length=30,
        pattern=r"^[A-Za-z0-9_]+$",
    )
    full_name: str | None = Field(
        default=None,
        max_length=120,
    )
    avatar_url: HttpUrl | None = None
    avatar_public_id: str | None = None


class User(UserCreate):
    id: str
    topic_ids: list[str] = Field(default_factory=list)
    created_at: datetime
    
# from datetime import datetime
# from typing import Literal

# from pydantic import BaseModel, Field, HttpUrl


# class UserCreate(BaseModel):
#     """Profile data. Credentials live separately in the auth collection."""

#     username: str = Field(
#         min_length=3,
#         max_length=30,
#         pattern=r"^[A-Za-z0-9_]+$",
#     )
#     full_name: str | None = Field(
#         default=None,
#         max_length=120,
#     )
#     avatar_url: HttpUrl | None = None
#     avatar_public_id: str | None = None

#     # Feed preferences: what the user follows.
#     # Matches ArticleCreate.categories / ArticleCreate.tags.
#     # categories: list[str] = Field(
#     #     default_factory=list,
#     # )
#     # tags: list[str] = Field(
#     #     default_factory=list,
#     # )

#     # Authorization role.
#     # Registration should not allow clients to choose this value.
#     role: Literal["user", "admin"] = "user"


# class UserUpdate(BaseModel):
#     """PATCH body: only the fields that are sent get changed."""

#     username: str | None = Field(
#         default=None,
#         min_length=3,
#         max_length=30,
#         pattern=r"^[A-Za-z0-9_]+$",
#     )
#     full_name: str | None = Field(
#         default=None,
#         max_length=120,
#     )
#     avatar_url: HttpUrl | None = None
#     avatar_public_id: str | None = None

#     # categories: list[str] | None = None
#     # tags: list[str] | None = None


# class User(UserCreate):
#     id: str
#     created_at: datetime