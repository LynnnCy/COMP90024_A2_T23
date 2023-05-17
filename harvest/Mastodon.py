import couchdb
import json
import requests
import argparse

from mastodon import Mastodon, StreamListener
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from scipy.special import expit


parser = argparse.ArgumentParser(description='Mastodon bot')

parser.add_argument('--ms_url', type=str, help='Mastodon server url')
parser.add_argument('--ms_token', type=str, help='Mastodon access token')
parser.add_argument('--db_name', type=str, help='CouchDB database name')

args = parser.parse_args()

ms_url   = args.ms_url
ms_token = args.ms_token
db_name  = args.db_name

if ms_url is None:
    print('Mastodon server url is required')
    exit(1)

if ms_token is None:
    print('Mastodon access token is required')
    exit(1)

if db_name is None:
    print('CouchDB database name is required')
    exit(1)

couch = couchdb.Server(f'http://admin:admin@0.0.0.0:5984/')

if db_name not in couch:
    print(f'Database {db_name} does not exist')
    exit(1)

db = couch[db_name]

tokenizer = AutoTokenizer.from_pretrained('cardiffnlp/tweet-topic-21-multi', cache_dir='.')
model = AutoModelForSequenceClassification.from_pretrained('cardiffnlp/tweet-topic-21-multi', cache_dir='.')
class_mapping = model.config.id2label

m = Mastodon(
    api_base_url=ms_url,
    access_token=ms_token
)

# listen on the timeline
class Listener(StreamListener):
    # called when receiving new post or status update
    def on_update(self, status):

        text = status['content']

        res  = requests.get(f'http://senpy.gsi.upm.es/api/sentiment-basic', params={"input": text})
        data = json.loads(res.text)

        try:
            senti = data['entries'][0]['marl:hasOpinion'][0]['marl:hasPolarity']
            status['sentiment'] = senti #add/replace sentiment

            res = requests.get(f'http://senpy.gsi.upm.es/api/emotion-depechemood', params={"input": text})
            data = json.loads(res.text)
            emotions = data['entries'][0]['onyx:hasEmotionSet'][0]['onyx:hasEmotion']
            senpy_max_emotion = max(emotions, key=lambda e: e['onyx:hasEmotionIntensity'])['onyx:hasEmotionCategory']
            status['emotion'] = senpy_max_emotion #add emotion 
            
            tokens = tokenizer(text, return_tensors='pt')
            output = model(**tokens)
            scores = output[0][0].detach().numpy()
            scores = expit(scores)
            predictions = (scores == max(scores)) * 1
            for i in range(len(predictions)):
                if predictions[i]:
                    status['class'] = class_mapping[i]
        except Exception as e:
            print(KeyError)

        json_str = json.dumps(status, indent=2, sort_keys=True, default=str)
        doc_id, doc_rev = db.save(json.loads(json_str))

if __name__ == '__main__':
    print("harvest is listening...")
    m.stream_local(Listener())
