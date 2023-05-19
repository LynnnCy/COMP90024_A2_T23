from flask import Flask, render_template, request,jsonify
from flask_restful import Api, Resource
import couchdb
import json
from flask_cors import CORS
import datetime

# authentication for db
admin = 'admin'
password = 'admin'
url = f'http://{admin}:{password}@172.26.130.99:5984/'

# get couchdb instance
couch = couchdb.Server(url)

app = Flask(__name__)
CORS(app)
api = Api(app)


##### 1 #####
# overall data, have some intro
# present tweet positive tweet %, tweet total (from view)
# present mastodon positive tweet %,  total count (from view 1000 per day)
#### return the view...
@app.route('/tweet_stats', methods=['GET'])
def tweet_stats():
    try:
        if request.method == 'GET':
            db_name = 'emotion-data-final'
            db = couch[db_name]
            tweet_count_view_name = '_all_docs'
            tweet_count_view = db.view(tweet_count_view_name)
            tweet_count = len(tweet_count_view)
            tweet_view_name = 'count_positive_doc/emotionpos-view'
            tweet_view = db.view(tweet_view_name, group_level=1)
            for row in tweet_view:
                if row.key == 'tweets_count':
                    result = {'total_tweet_count': tweet_count, 'positive_tweet_count': row.value,
                              'positive_tweet_percentage': round(row.value / tweet_count * 100, 1)}
                    return jsonify(result)
    except:
        str= 'no implementation'
        return str


@app.route('/math_stats', methods=['GET'])
def mastodon_stats():
    try:
        if request.method == 'GET':
            db_name = 'mastodon_try'
            db = couch[db_name]
            math_view_name = 'positive_content_count/pos_number'
            math_view = db.view(math_view_name, group_level=1)
            tweet_count_view_name = '_all_docs'
            tweet_count_view = db.view(tweet_count_view_name)
            tweet_count = len(tweet_count_view)
            for row in math_view:
                if row.key == 'tweets_count':
                    result = {'total_tweet_count': tweet_count, 'positive_tweet_count': row.value,
                              'positive_tweet_percentage': round(row.value / tweet_count * 100, 1)}
                    return jsonify(result)
    except:
        str= 'no implementation'
        return str



##### 2 #####
# call the map data
@app.route('/getGeoData', methods=['GET'])
def get_geo_data():
    # indicate the db name
    db_name = 'sudo_data_emotion'
    db = couch[db_name]
    try:
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
        return jsonStr
    except:
        str= 'no implementation'
        return str


##### 3 #####
# scatter plot shows the relationship between sudo attributes between positive % tweet count
# proposed attributes:
# age:  "median age",median_income:"median_aud_2017_18", mortgage_stress:"Mortgage stress %",medical_resource:"total medical practitioners % per 100,000"
# unemployment_rate:"unemployment rate (sep 21)",education_level:"full time participation in Secondary School Education at age 16",crime_status:  "total_crime_offences_count"
# when front-end enter a specific attribute, show the related plot
@app.route('/scatter_plot/<param>', methods=['GET', 'POST', 'DELETE'])
def scatter_plot(param):
    # indicate the db name
    db_name = 'sudo_data_emotion'
    db = couch[db_name]
    attributes_dict={'median age':'median age','population density':'population density (persons/km2)',
        'median income':'median_aud_2017_18','mortgage stress %':'Mortgage stress %',
        'unemployment rate':"unemployment rate (sep 21)",
        'education level':"full time participation in Secondary School Education at age 16",
        'total medical practitioners % per 100,000':"total medical practitioners % per 100,000",
        'crime offences count':'total_crime_offences_count'}
    try:
        if request.method == 'GET':
            rows = db.view('_all_docs', include_docs=True)
            return_dict={}
            full_result = []
            for row in rows:
                attributes=attributes_dict[param]
                try:
                    att_result = round(float(row['doc']['properties'][attributes]), 1)
                    pos_tweet_per = round(
                        float(row['doc']['properties']['pos_cnt']) / float(row['doc']['properties']['total_cnt']) * 100,
                        1)
                except:
                    continue
                one_plot=[att_result,pos_tweet_per]
                full_result.append(one_plot)
            return_dict[param]=full_result

            jsonStr = json.dumps(return_dict)
        return jsonStr
    except:
        str= 'no implementation'
        return str



##### 4 #####
# pie chart/ bar chart to show the positive count/ group by emotion type and topic classification for tweet and mastondon

@app.route('/bar_chart_data', methods=['GET', 'POST', 'DELETE'])
def bar_chart_tweet():
    # indicate the db name
    db_name = 'emotion-data-final'
    db = couch[db_name]
    class_ = {}
    try:
        if request.method == 'GET':
            # retrieve the view data
            rows = db.view('count_class/emtion_classification', group=True)
            categories = [row.key.split(':')[1] for row in rows]
            # create the x-axis categories
            EMOTION = ['news_&_social_concern', 'diaries_&_daily_life', 'film_tv_&_video', 'celebrity_&_pop_culture', 'food_&_dining', 'arts_&_culture']
            series = []
            try:
                for emotion in EMOTION:
                    data = [row.value[emotion] for row in rows]
                    series.append({
                    'name': emotion,
                    'type': 'bar',
                    'data': data
                })
            except Exception as e:
                pass

        # create the chart options
        options = {
            'xAxis': [{
                'type': 'category',
                'data': categories
            }],
            'yAxis': [{
                'type': 'value'
            }],
            'series': series
        }

        jsonStr = json.dumps(options)
        return jsonStr
    except:
        str= 'no implementation'
        return str

 # bar chart for mastodon
@app.route('/chart_data_mastodon', methods=['GET', 'POST', 'DELETE'])
def chart_data_mastodon():
    # indicate the db name
    db_name = 'mastodon_data_emotion'
    db = couch[db_name]
    class_ = {}
    if request.method == 'GET':
        # retrieve the view data
        rows = db.view('emotion/emotion_class_view', group=True)
        categories = [row.key.split(':')[1] for row in rows]
        # create the x-axis categories
        EMOTION = ['news_&_social_concern', 'diaries_&_daily_life', 'film_tv_&_video', 'celebrity_&_pop_culture', 'food_&_dining', 'arts_&_culture']
        series = []
        try:
            for emotion in EMOTION:
                data = [row.value[emotion] for row in rows]
                series.append({
                'name': emotion,
                'type': 'bar',
                'data': data
            })
        except Exception as e:
            pass

    # create the chart options
    options = {
        'xAxis': [{
            'type': 'category',
            'data': categories
        }],
        'yAxis': [{
            'type': 'value'
        }],
        'series': series
    }

    jsonStr = json.dumps(options)
    return jsonStr

##### 5 ##### word cloud
@app.route('/word_cloud/<param>', methods=['GET', 'POST', 'DELETE'])
def word_cloud(param):
    # indicate the db name
    db_name = 'twitter_topic_wordcloud'
    db = couch[db_name]
    current_date = datetime.date.today()
    l1=[current_date.year,current_date.month,current_date.day]
    try:
        if request.method == 'GET':
            rows = db.view('latest_result/latest_result', include_docs=True)
            flag=0
            for row in rows:
                try:
                    # check if it's the latest record
                    if row['key']==l1:
                        wordcount_list=row['doc'][param]
                       # print('1st',row['key'])
                        jsonStr = json.dumps(wordcount_list)
                    else:
                        flag+=1
                except:
                    # try three times, three latest records in the view;
                    # if latest one is not available, try the next available one
                        if flag >=3:
                            wordcount_list = row['doc'][param]
                          #  print('2nd', row['key'])
                            jsonStr = json.dumps(wordcount_list)
                            break
                        else:
                            continue
            return jsonStr
    except:
        str= 'no implementation'
        return str

if __name__ == '__main__':
    app.run(debug=True, host='172.26.130.99', port='8080')
