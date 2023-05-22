# import libaries
import geopandas as gpd
from geopandas import GeoDataFrame
import pandas as pd
import couchdb
import json
import geojson
import numpy as np
from array import array
from shapely.geometry import box
import wikipedia
import re

# read geo json file to gdf
lga_gdf = gpd.read_file('lga_geo.geojson')

# read lga_location list json file to dict

# Opening JSON file
f = open('lga_locations_list.json')
# returns JSON object as a dictionary
standard_lga_locations_list = json.load(f)

# get the positive tweet view
# authentication
admin = 'admin'
password = 'admin'
url = f'http://{admin}:{password}@localhost:5984/'

# get couchdb instance
couch = couchdb.Server(url)
# indicate the db name
# indicate the db name
db_name = 'emotion-data-final'
db = couch[db_name]
def get_geo_info():
    view = db.view('Geo_emotiom/geo_emotion_count',group_level=3)
    print('got view')
    view_results = {}
    for row in view:
        k1=row.key[0]
        k2=row.key[1]
        k3=row.key[2]
        count=row.value
        if k1 not in view_results.keys():
            view_results[k1]={'bbox':k2,k3:count}
        else:
            if k3 not in view_results[k1].keys():
                view_results[k1].update({k3:count})
            else:
                view_results[k1][k3]= view_results[k1][k3]+count
    return view_results

view_results=get_geo_info()

emotion_df=pd.DataFrame.from_dict(view_results,orient='index')
emotion_df.shape
emotion_df.reset_index(inplace=True)
emotion_df=emotion_df.replace(np.nan,0)


bbox=[box(x1, y1, x2, y2) for x1,y1,x2,y2 in emotion_df.bbox]
emotion_count_geo_df=gpd.GeoDataFrame(emotion_df, geometry=bbox)
emotion_count_geo_df = emotion_count_geo_df.set_crs('EPSG:4283')
emotion_count_geo_df['positve_count']=emotion_count_geo_df['wna:amusement']+emotion_count_geo_df['awe_positive']+emotion_count_geo_df['wna:joy']
emotion_count_geo_df['negative_count']=emotion_count_geo_df['awe_negative']+emotion_count_geo_df['wna:anger']+emotion_count_geo_df['wna:sadness']+emotion_count_geo_df['wna:negative-fear']+emotion_count_geo_df['wna:annoyance']
emotion_count_geo_df['total_count']=emotion_count_geo_df.iloc[:,2:11].sum(axis=1)
emotion_count_geo_df['neu_count']=emotion_count_geo_df['total_count']-emotion_count_geo_df['positve_count']-emotion_count_geo_df['negative_count']
emotion_count_geo_df['positve_%']=emotion_count_geo_df['positve_count']/emotion_count_geo_df['total_count']*100
emotion_count_geo_df['negative_%']=(emotion_count_geo_df['negative_count']/emotion_count_geo_df['total_count']*100).round(2)

# spatial join name matching
# find the corresponding lga based on bbox geometry
joined_df=gpd.sjoin(emotion_count_geo_df,lga_gdf, how='left', predicate = 'within')
joined_df.shape
joined_df = joined_df.rename(columns={'index': 'tweets_location'})
joined_df.drop(columns=['index_right'],inplace=True)
joined_df=joined_df[joined_df['tweets_location'].str.endswith('Victoria')]
joined_df=joined_df.replace(np.nan,0)

# find the lga based on location list
cannot_find_list=list(joined_df[joined_df['lga_name'].isnull()]['tweets_location'])
for i in range(len(cannot_find_list)):
    place = cannot_find_list[i].split(',')[0]
    for j in range(len(standard_lga_locations_list)):
        key= list(standard_lga_locations_list.keys())[j]
        find_result=[k for k in standard_lga_locations_list[key] if place in k]
        if len(find_result)>0:
            joined_df.loc[i,'lga_name']=key
            break

manual_dict={
    'Melbourne, Victoria': 'Melbourne',
    'Melton, Victoria':'Melton',
    'Sunbury, Victoria':'Hume',
    'Shepparton - Mooroopna, Victoria':'Shepparton',
    'Drysdale - Clifton Springs, Victoria':'Greater Geelong',
    'Pakenham, Victoria':'Cardinia',
    'Torquay - Jan Juc, Victoria':'Surf Coast',
    'Officer, Victoria':'Cardinia',
    'Daylesford - Hepburn Springs, Victoria':'Hepburn',
    'Ocean Grove - Barwon Heads, Victoria':'Greater Geelong',
    'Nagambie, Victoria':'Strathbogie',
    'Falls Creek (Vic.), Victoria':'Alpine',
    'Portland (Vic.), Victoria':'Glenelg',
    'Seville East, Victoria':'Yarra Ranges',
    'Clunes (Vic.), Victoria':'Hepburn',
    'Moe - Newborough, Victoria':'Latrobe',
    'Healesville, Victoria':'Yarra Ranges',
    'Aireys Inlet - Fairhaven, Victoria':'Surf Coast',
    'Point Lonsdale - Queenscliff, Victoria':'Queenscliffe',
    'Warburton, Victoria':'Yarra Ranges',
    'Diggers Rest, Victoria':'Hume',
    'Maryborough (Vic.), Victoria':'Central Goldfields',
}

for i in range(len(list(manual_dict.values()))):
    key=list(manual_dict.keys())[i]
    print(key)
    lga= list(manual_dict.values())[i]
    index=list(joined_df[joined_df['tweets_location']==key].index)
    joined_df.loc[index,'lga_name']=lga

# summary the count into dict
tweet_total_count_dict={}
column_list=list(joined_df.columns)

count=0
for i in range(len(joined_df)):
    try:
        lga_name=joined_df.loc[i].values[-1:][0]
        pos_count,neg_count,total_count=joined_df.loc[i].values[12:15]
        neu_count=joined_df.loc[i].values[15]
        awe_positive,wna_amusement,wna_sadness,awe_negative,wna_negative_fear,wna_anger,wna_annoyance,wna_indifference=joined_df.loc[i].values[2:10]
        value_list=[total_count,pos_count,neg_count,neu_count,awe_positive,wna_amusement,wna_sadness,awe_negative,wna_negative_fear,wna_anger,wna_annoyance,wna_indifference]
        # print(value_list)
        neu_count=total_count-neg_count-pos_count
        if lga_name not in tweet_total_count_dict.keys():
            tweet_total_count_dict[lga_name]={'total_tweet_count':total_count,'positive_tweet_count':pos_count,'negative_tweet_count':neg_count, 'neutral_tweet_count':neu_count,'awe_positive':awe_positive,'wna_amusement':wna_amusement,'wna_sadness':wna_sadness, 'wna_negative_fear':wna_negative_fear,'wna_anger':wna_anger,'wna_annoyance':wna_annoyance,'wna_indifference':wna_indifference}
        else:
            for k in range(len(tweet_total_count_dict[lga_name])):
                key=list(tweet_total_count_dict[lga_name].keys())[k]
                tweet_total_count_dict[lga_name][key]=tweet_total_count_dict[lga_name][key]+value_list[k]
    except:
        count+=1
print('count',count)
print(tweet_total_count_dict)
print(len(tweet_total_count_dict))

# fill number for lag without any data
d1={'Banyule':2,
 'Bayside':2.4,
 'Boroondara':2.2,
 'Brimbank':1.95,
 'Casey':0.2,
 'Darebin':4,
 'Frankston':1.15,
 'Glen Eira':4.5,
 'Greater Dandenong':1.2,
 'Hobsons Bay':1.3,
 'Kingston':1.6,
 'Knox':1.4,
 'Manningham':1.1,
 'Maribyrnong':1.7,
 'Maroondah':1.8,
 'Monash':2.6,
 'Moonee Valley':3.1,
 'Mornington Peninsula':0.2,
 'Nillumbik':0.13,
 'Port Phillip':4.2,
 'Stonnington':3.6,
 'Whitehorse':2.155,
 'Whittlesea':0.155,
 'Wyndham':0.2,
 'Yarra':5}

d3={}
value_list=list(tweet_total_count_dict[0].values())
for i in range(len(d1)):
    sumup=sum(d1.values())
    coef=list(d1.values())[i]
    d2={'total_tweet_count':0,'positive_tweet_count':0,'negative_tweet_count':0, 'neutral_tweet_count':0,
        'awe_positive':0,'wna_amusement':0,'wna_sadness':0, 'wna_negative_fear':0,
        'wna_anger':0,'wna_annoyance':0,'wna_indifference':0}
    for j in range(len(value_list)):
        nan_value=value_list[j]
        fill_value=int(nan_value/sumup * coef)
        key=list(d2.keys())[j]
        d2[key]=fill_value
    d3[list(d1.keys())[i]]=d2

tweet_total_count_dict.update(d3)
l1=[]
for i in tweet_total_count_dict.keys():
    tweet_total_count_dict[i]['positive_tweet_percentage']=round(tweet_total_count_dict[i]['positive_tweet_count']/tweet_total_count_dict[i]['total_tweet_count']*100,1)
    l1.append(tweet_total_count_dict[i]['positive_tweet_percentage'])
print('----',tweet_total_count_dict)
print(l1)



# load summary dict into db
admin = 'admin'
password = 'admin'
url = f'http://{admin}:{password}@localhost:5984/'

# get couchdb instance
couch = couchdb.Server(url)

from datetime import date
# today = date.today()
# print("Today's date:", today)
db_name = 'sudo_data_emotion'
# load the data into database
if db_name not in couch:
    db = couch.create(db_name)
else:
    db = couch[db_name]
with open('sudo_vic_lga_attributes.geojson', 'r') as sudo_file:
    gj = geojson.load(sudo_file)
    for i in range(len(gj['features'])):
    #for i in range(1):
        lga_name = gj['features'][i]['properties']['lga_name']
        try:
            item=tweet_total_count_dict[lga_name]
            gj['features'][i]['properties'].update(item)
        except:
            fill_dict={'total_tweet_count':0,'positive_tweet_count':0,'positive_tweet_percentage':0,'negative_tweet_count':0, 'neutral_tweet_count':0,
        'awe_positive':0,'wna_amusement':0,'wna_sadness':0, 'wna_negative_fear':0,
        'wna_anger':0,'wna_annoyance':0,'wna_indifference':0}
            gj['features'][i]['properties'].update(fill_dict)
            count+=1
        print(count)
        entry = json.dumps(gj['features'][i])
        result = json.loads(entry)
        db.save(result)