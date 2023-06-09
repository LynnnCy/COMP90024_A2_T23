# COMP90024 Assignment 2
# Team: 23
# City: Victoria
# Members: Yalin Chen (1218310) Qianchu Li (1433672) Abrar Hayat (1220445) Jie Yang (1290106) Yadvika Jayam Nagaraj Yadav (1406716)

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
@app.route('/intro', methods=['GET'])
def intro():
    # indicate the db name
    db_name = 'lga_geometry_info'
    db = couch[db_name]
    try:
        if request.method == 'GET':
            rows = db.view('info_view/intro', include_docs=True)
            for row in rows:
                note = row['doc']["Introduction"]
                jsonStr = json.dumps(note)
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
                        float(row['doc']['properties']['positive_tweet_count']) / float(row['doc']['properties']['total_tweet_count']) * 100,
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

@app.route('/scatter_plot_note/<param>', methods=['GET'])
def scatter_plot_note(param):
    # indicate the db name
    db_name = 'lga_geometry_info'
    db = couch[db_name]
    try:
        if request.method == 'GET':
            rows = db.view('info_view/notes', include_docs=True)
            for row in rows:
                note= row['doc']["Notes"][param]
                jsonStr = json.dumps(note)
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
    if request.method == 'GET':
        # retrieve the view data
        rows = db.view('count_class/class_each_emo', group=True)
        total_emo_view = db.view('count_positive_doc/different pos emotion', group=True)
        data = {}
        for row in rows:
        
            classification = row['key']
            emotions = row['value']
            data[classification] = emotions
        top_classifications = sorted(data.keys(), key=lambda x: sum(data[x].values()), reverse=True)[:6]
        categories = top_classifications
        emo_view = [view.value for view in total_emo_view]
        #categories = [row.key for row in rows]
        # create the x-axis categories
        EMOTION = ["wna:amusement","wna:awe","wna:joy"]
        #EMOTION = ['news_&_social_concern', 'diaries_&_daily_life', 'film_tv_&_video', 'celebrity_&_pop_culture', 'food_&_dining', 'arts_&_culture']
        series = []
        try:
            for emotion in EMOTION:
                data_values = []
                for classification in top_classifications:
                    value = data[classification].get(emotion, 0)
                    if emotion == 'wna:amusement':
                        value = round(value/emo_view[0]*100, 2)
                    elif emotion == 'wna:awe':
                        value = round(value/emo_view[1]*100, 2)
                    elif emotion == 'wna:joy':
                        value = round(value/emo_view[2]*100, 2)
                    data_values.append(value)
                    
                #data = [row.value[emotion] for row in rows]
                #data = [data[classification].get(emotion, 0) for classification in top_classifications]
                #data[0], data[1], data[2] = round(data[0]/emo_view[0]*100, 2), round(data[1]/emo_view[1]*100, 2), round(data[2]/emo_view[2]*100, 2)
                series.append({
                    'name': emotion,
                    'type': 'bar',
                    'data': data_values
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
        'series': series,

    }
    jsonStr = json.dumps(options)
    return jsonStr  



@app.route('/chart_data_mastodon', methods=['GET', 'POST', 'DELETE'])
def chart_data_mastodon():
    # indicate the db name
    db_name = 'mastodon_data_emotion'
    db = couch[db_name]
    class_ = {}
    if request.method == 'GET':
        # retrieve the view data
        rows = db.view('emotion/class_emotion', group=True)
        total_emo_view = db.view('emotion/emotion_view', group=True)
        data = {}
        for row in rows:
        
            classification = row['key']
            emotions = row['value']
            data[classification] = emotions
        #top_classifications = sorted(data.keys(), key=lambda x: sum(data[x].values()), reverse=True)[:6]
        categories = ['sports', 'diaries_&_daily_life', 'news_&_social_concern', 'arts_&_culture', 'music', 'other_hobbies']
        emo_view = [view.value for view in total_emo_view]

        EMOTION = ["wna:amusement","wna:awe","wna:joy"]
        #EMOTION = ['news_&_social_concern', 'diaries_&_daily_life', 'film_tv_&_video', 'celebrity_&_pop_culture', 'food_&_dining', 'arts_&_culture']
        series = []
        

        try:
            
            for emotion in EMOTION:
                data_values = []
                for classification in categories:
                    value = data[classification].get(emotion, 0)
                    if emotion == 'wna:amusement':
                        value = round(value/emo_view[0]*100, 2)
                    elif emotion == 'wna:awe':
                        value = round(value/emo_view[1]*100, 2)
                    elif emotion == 'wna:joy':
                        value = round(value/emo_view[2]*100, 2)
                    data_values.append(value)

                series.append({
                    'name': emotion,
                    'type': 'bar',
                    'data': data_values
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
    # param= T_ or M_ + topic name=['news & social concern','diaries & daily life','sports', 'film tv & video & music', 'celebrity & pop culture']
    db_name = 'topic_wordcloud'
    db = couch[db_name]
    current_date = datetime.date.today()
    date_list=[current_date.year,current_date.month,current_date.day]
    jsonStr = json.dumps([])
    try:
        if request.method == 'GET':
            # test which data source
            if param[0]=='T':
                rows = db.view('latest_result_t2/twitter_result',
                               keys=[date_list], include_docs=True)                 
                if(len(rows) == 0):
                    jsonStr = get_wordlist_count_until_found(
                        db, 'latest_result_t2/twitter_result', date_list, param)  
                else:
                    for row in rows:        
                        jsonStr = json.dumps(row['doc'][param[2::]])
                        break
            elif param[0] == 'M':
                rows = db.view('latest_result_t2/mastodon_result', include_docs=True)
                if (len(rows) == 0):
                    jsonStr = get_wordlist_count_until_found(
                        db, 'latest_result_t2/mastodon_result', date_list, param)
                else:
                    for row in rows:
                        jsonStr = json.dumps(row['doc'][param[2::]])
                        break
            return jsonStr
    except Exception as e:
        print(e)
        str= 'no implementation'
        return str


def get_wordlist_count_until_found(db, view_name, date_list, param):
    print('HERE')
    jsonStr = json.dumps([])
    tries = 0
    while (tries < 10):
        # keep going back 1 day
        # print(date_list[2])
        if (date_list[2] >= 1):
            date_list[2] = date_list[2] - 1
            rows = db.view(view_name, keys=[date_list], include_docs=True)
            if (len(rows) > 0):
                for row in rows:
                    # print(row['doc'][param[2::]])
                    word_count_list = row['doc'][param[2::]]
                    jsonStr = json.dumps(word_count_list)
                    break
                break
            tries += 1
        else:
            break
    # print(jsonStr)
    return jsonStr


if __name__ == '__main__':
    app.run(debug=True, host='172.26.130.99', port='8080')
