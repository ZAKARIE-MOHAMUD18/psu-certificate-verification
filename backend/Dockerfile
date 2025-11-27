FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

RUN mkdir -p certificates keys

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]