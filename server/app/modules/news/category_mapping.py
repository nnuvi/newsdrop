NEWSDATA_CATEGORY_MAP: dict[str, str] = {
    "business": "business",
    "crime": "crime",
    "domestic": "domestic",
    "education": "education",
    "entertainment": "entertainment",
    "environment": "environment",
    "food": "food",
    "health": "health",
    "lifestyle": "lifestyle",
    "other": "other",
    "politics": "politics",
    "science": "science",
    "sports": "sports",
    "technology": "technology",
    "top": "top",
    "tourism": "tourism",
    "world": "world",
}


def map_categories(
    categories: list[str],
    provider_mapping: dict[str, str],
) -> list[str]:
    mapped: list[str] = []
    seen: set[str] = set()

    for category in categories:
        normalized = category.strip().lower()
        provider_category = provider_mapping.get(normalized)

        if provider_category and provider_category not in seen:
            mapped.append(provider_category)
            seen.add(provider_category)

    return mapped
