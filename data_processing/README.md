# Data Processing & Backend

## Maintainer: 
- Yalin CHEN <yalchen@student.unimelb.edu.au>
- Qianchu Li <qianchul1@student.unimelb.edu.au>

## Requirements: 
use pip3 install:
1. geopandas 
2. pandas
3. couchdb
4. shapely.geometry 

## File Structure: 
Data Processing/  
├── SUDO and Geo Processing  
│   ├── SUDO Format File       -> sudo datasets  
│   └── vic_lga      -> includes vic boundary geometry information  
│   └── sudo_data_processing.py   -> processed sudo data, construct lga attributes dict  
│   └── positive_tweet_processing.py   -> summary tweet count by lga   
│   └── sudo_vic_lga_attributes.geojson   -> sudo geojson file, used to stored to db  
│   └── lga_geo.geojson   -> processed from sudo_data_processing.py  
│   └── lga_locations_list.json   -> processed from sudo_data_processing.py
│── call_data.py           -> backend endpoints  
│── update_wordcloud_task.py        -> pre-processed wordcloud schedulers
└── README.md            -> Readme