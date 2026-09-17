from unittest.mock import AsyncMock


def make_mock_gemini_ai(summary_text=None):
    mock = AsyncMock()
    mock.summarize.return_value = summary_text or "Mocked summary text."
    return mock