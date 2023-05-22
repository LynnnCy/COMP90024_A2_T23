FROM python:3

WORKDIR /home/ubuntu

RUN pip install couchdb
RUN pip install requests
RUN pip install argparse
RUN pip install mastodon.py
RUN pip install torch
RUN pip install transformers
RUN pip install scipy

COPY Mastodon.py .

ENTRYPOINT ["python", "Mastodon.py"]