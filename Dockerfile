# 
FROM python:3.9

RUN apt update -y && apt install build-essential
RUN apt install jq -y
# 
WORKDIR /code

# 
RUN pip install --no-cache-dir --upgrade tgtg python-dotenv pymongo fastapi requests fastapi-utils uvicorn httpx

# 
COPY ./app /code/app

RUN chmod +x /code/app/cron.sh
# 
CMD ["uvicorn", "app.main:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "8080"]

EXPOSE 8080
