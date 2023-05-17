import couchdb
import json

# authentication
admin = 'admin'
password = 'password'
url = f'http://{admin}:{password}@172.26.130.19:5984/'

# get couchdb instance
couch = couchdb.Server(url)

# indicate the db name
db_name = 'testdemo'

# if not exist, create one
if db_name not in couch:
    db = couch.create(db_name)
else:
    db = couch[db_name]

# data to be stored
with open('/Users/yalinchen/Desktop/twitter-huge.json', 'r') as tweets_file:
    line1=tweets_file.readline()
    print(line1)
    for _ in range(166476300):
        entry = json.loads(tweets_file.readline()[:-2])
        # print(entry)
        db.save(entry)