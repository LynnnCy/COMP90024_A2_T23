from flask_apscheduler import APScheduler
from flask import Flask, render_template, request,jsonify
from flask_restful import Api, Resource
import couchdb
import json
import collections
import datetime
from operator import itemgetter
import string
import nltk
from nltk.corpus import stopwords
nltk.download('stopwords')
from nltk.tokenize import word_tokenize

class Config(object):
    JOBS = [
        {
            'id': 'job1',
            'func': '__main__:update_word_cloud_list',
            'args':('Twitter','emotion-data-final','count_class/top5_topic_positive_tweet'),
            'trigger': 'cron',
            'day': '*',
            'hour': '12',
            'minute': '30',
            'second': '00'
        },
        {
            'id': 'job2',
            'func': '__main__:update_word_cloud_list',
            'args':('Mastodon', 'mastodon_data_emotion', 'emotion/top5_topic_positive_post'),
            'trigger': 'cron',
            'day': '*',
            'hour': '12',
            'minute': '40',
            'second': '00'
        }
    ]

def update_word_cloud_list(data_source,db_name,view_name):
# authentication for db
     print('execute task', datetime.datetime.now())
     admin = 'admin'
     password = 'admin'
     url = f'http://{admin}:{password}@172.26.130.99:5984/'

     # get couchdb instance
     couch = couchdb.Server(url)

     db_name= db_name

     print('data_source',data_source,'db_name',db_name)
     #db_name = 'emotion-data-final'
     db = couch[db_name]
    # rows = db.view('count_class/top5_topic_positive_tweet', include_docs=True)
     rows = db.view(view_name, include_docs=True)
     print('db_view', view_name)


     if data_source=='Mastodon':
     # for remove stopwords, only for mastodon
          stop_words = list(set(stopwords.words('english')))
          stop_words.extend(string.punctuation)
          add_remove=["''",'span','/span','class=','https','href=','/a','rel=','target=','_blank','/p','mention','hashtag','//','’','//www.',
                 "'s",'utm_medium=mastodon','utm_source=dlvr.it' ,'``','’','br','utm_source=Twitter','says','would','—','u-url','said','get',
                      'utm_term=Autofeed','nofollow','noopener','noreferrer','p','//press.coop/tags/press','http','amp','press','”','...','–',"'m",
                      'got',"''","<",">","span","/span","class=","“","‘","also","invisible","ellipsis","‘"]
          stop_words.extend(add_remove)

     news_tag_list=[]
     diaries_tag_list=[]
     sports_tag_list=[]
     film_tag_list=[]
     celebrity_tag_list=[]
     for row in rows:
          try:
               if data_source== 'Twitter':
                    hashtags= row['doc']['doc']['data']['entities']['hashtags']
                    class_name=row['doc']['doc']['data']['class']
                    word_list=[]
                    for j in range(len(hashtags)):
                         word_list.append(hashtags[j]['tag'])
               else:
                    text = row['doc']['content']
                    tok_list = word_tokenize(text)
                    class_name = row['doc']['class']
                    word_list = [w for w in tok_list if not w.lower() in stop_words]

               if class_name == 'news_&_social_concern':
                    news_tag_list.extend(word_list)
               elif class_name == 'diaries_&_daily_life':
                    diaries_tag_list.extend(word_list)
               elif class_name == 'sports':
                    sports_tag_list.extend(word_list)
               elif class_name in ['film_tv_&_video', 'music']:
                    film_tag_list.extend(word_list)
               else:
                    celebrity_tag_list.extend(word_list)
          except:
               continue

     def sort_dict(tag_list):
          format_list=[]
          N=100
          tag_dict =collections.Counter(tag_list)
          sort_tag_dict=dict(sorted(tag_dict.items(), key=itemgetter(1), reverse=True)[:N])
          for key, value in sort_tag_dict.items():
               format_list.append({'text':key,'value':value})
          return format_list

     sort_news_tag_list=sort_dict(news_tag_list)
     sort_diaries_tag_list=sort_dict(diaries_tag_list)
     sort_sports_tag_list=sort_dict(sports_tag_list)
     sort_film_tag_list=sort_dict(film_tag_list)
     sort_celebrity_tag_list=sort_dict(celebrity_tag_list)
     current_date = datetime.date.today()
     date_list=[current_date.year,current_date.month,current_date.day]

     full_word_cloud_dict={'data_source':data_source,'created_date':date_list,'news & social concern':sort_news_tag_list,'diaries & daily life':sort_diaries_tag_list,'sports':sort_sports_tag_list,
                     'film tv & video & music':sort_film_tag_list, 'celebrity & pop culture':sort_celebrity_tag_list}
     print(full_word_cloud_dict)
     jfile=json.dumps(full_word_cloud_dict)
     print(jfile)

     db_name = 'topic_wordcloud'
     # load the data into database
     if db_name not in couch:
         db = couch.create(db_name)
     else:
         db = couch[db_name]
     result = json.loads(jfile)
     db.save(result)
     print('finish job')

app = Flask(__name__)
app.config.from_object(Config())

##
@app.route("/hello", methods=["POST", "GET"])
def check():
    return "success", 200

if __name__ == '__main__':
    scheduler = APScheduler()
    scheduler.init_app(app)
    scheduler.start()
    app.run(debug=False)


