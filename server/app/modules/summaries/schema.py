# from datetime import datetime

# from pydantic import BaseModel


# class SummaryRequest(BaseModel):
#     article_id: str


# class SummaryResponse(BaseModel):
#     id: str
#     article_id: str
#     summary: str
#     provider: str
#     model: str
#     created_at: datetime

from datetime import datetime

from pydantic import BaseModel


class SummaryResponse(BaseModel):
    id: str
    article_id: str
    summary: str
    model: str
    created_at: datetime