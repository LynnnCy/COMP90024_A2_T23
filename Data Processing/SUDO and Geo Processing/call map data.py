from flask import Flask, render_template, request, jsonify
from flask_restful import Api, Resource
import couchdb
import json
from flask_cors import CORS

# authentication for db
admin = 'admin'
password = 'admin'
url = f'http://{admin}:{password}@172.26.130.99:5984/'

# get couchdb instance
couch = couchdb.Server(url)

# indicate the db name
db_name = 'sudo_data_load_tweet'

# if not exist, create one
if db_name not in couch:
    db = couch.create(db_name)
else:
    db = couch[db_name]

app = Flask(__name__)
CORS(app)
api = Api(app)


@app.route('/getGeoData', methods=['GET', 'POST', 'DELETE'])
def get_geo_data():
    if request.method == 'GET':
        rows = db.view('_all_docs', include_docs=True)
        full_result = []
        for row in rows:
            result = row['doc']
            pop_item = ['_id', '_rev']
            for i in pop_item:
                result.pop(i, None)
            full_result.append(result)

        jsonStr = json.dumps(full_result)
    # return jsonify(full_result)
    return jsonStr


if __name__ == '__main__':
    app.run(debug=True, host='172.26.130.99', port='8080')