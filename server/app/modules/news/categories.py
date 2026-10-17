from typing import TypedDict


class Category(TypedDict):
    id: str
    label: str


PREDEFINED_CATEGORIES: tuple[Category, ...] = (
    {"id": "business", "label": "Business"},
    {"id": "crime", "label": "Crime"},
    {"id": "domestic", "label": "Domestic"},
    {"id": "education", "label": "Education"},
    {"id": "entertainment", "label": "Entertainment"},
    {"id": "environment", "label": "Environment"},
    {"id": "food", "label": "Food"},
    {"id": "health", "label": "Health"},
    {"id": "lifestyle", "label": "Lifestyle"},
    {"id": "other", "label": "Other"},
    {"id": "politics", "label": "Politics"},
    {"id": "science", "label": "Science"},
    {"id": "sports", "label": "Sports"},
    {"id": "technology", "label": "Technology"},
    {"id": "top", "label": "Top News"},
    {"id": "travel", "label": "Travel"},
    {"id": "world", "label": "World"},
)

CATEGORY_IDS = frozenset(category["id"] for category in PREDEFINED_CATEGORIES)
