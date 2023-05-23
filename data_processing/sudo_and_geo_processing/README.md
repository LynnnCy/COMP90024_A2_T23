==ONCE==   
1. construct lga code<>lga name<>lga geometry table 
2. construct lga name<>locations list (twitter location is not at lga basis)
3. sort sudo data based on lga code, save the sudo attributes table to couchdb   

==UPDATE==    
4. get the tweet count by bbox  
5. matching the tweet full name with lga name -> tweet count by lga name  
    - sjoin (check whether twitter bbox within lga geometry)  
    - twitter 'full_name' <> lga name based on list (step2)  
6. add tweets count to sudo attributes table in couchdb   



import geopandas as gpd == 0.12.2  
from geopandas import GeoDataFrame  
import pandas as pd ==  2.0.0   
import couchdb == 1.2  
import json  
import geojson ==  3.0.1   
from collections import Counter  
import numpy as np ==1.23.5        
from array import array  
from shapely.geometry import box  
import wikipedia ==  1.4.0    
import re == 2.28.2  