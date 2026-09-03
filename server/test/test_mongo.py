import asyncio

from pymongo import AsyncMongoClient


MONGODB_URI = ""

async def main():
    client = AsyncMongoClient(MONGODB_URI)

    try:
        print("Pinging MongoDB...")
        result = await client.admin.command("ping")
        print("SUCCESS:", result)

    except Exception as e:
        print("FAILED:", repr(e))

    finally:
        await client.close()


asyncio.run(main())

