# COMP90024 Assignment 2
# Team: 23
# City: Victoria
# Members: Yalin Chen (1218310) Qianchu Li (1433672) Abrar Hayat (1220445) Jie Yang (1290106) Yadvika Jayam Nagaraj Yadav (1406716)

# import libaries
import geopandas as gpd
from geopandas import GeoDataFrame
import pandas as pd
import couchdb
import geojson
import wikipedia
import re
import json

# 1. construct lga code<>lga name<>lga geometry table
# read lga geometry
lga_shape = gpd.read_file(".vic_lga/vic_lga.shp")
lga_shape_filtered = lga_shape[['ABB_NAME', 'LGA_NAME', 'geometry']]
lga_shape_filtered_drop = lga_shape_filtered.drop(labels=[5, 6, 24, 25, 68], axis=0)
lga_shape_filtered_drop.columns = ['pro_LGA_NAME_2018', 'LGA_NAME', 'geometry']
print(lga_shape_filtered.head(5))
print(lga_shape_filtered_drop.shape)

# lga code - lga name
lga_code = gpd.read_file('./LGA_2018_VIC.csv')
filtered_lga_code = lga_code[['LGA_CODE_2018', 'LGA_NAME_2018']].drop_duplicates()
filtered_lga_code['pro_LGA_NAME_2018'] = filtered_lga_code['LGA_NAME_2018'].str.split('(').str[0].str[:-1]
filtered_lga_code = filtered_lga_code.reset_index().drop(columns=['index'], )
filtered_lga_code = filtered_lga_code.drop(labels=[0, 23, 55, 81], axis=0)
filtered_lga_code.replace('Colac-Otway', 'Colac Otway', inplace=True)
print(filtered_lga_code.shape)

# merge df
lga_geo_df = pd.merge(filtered_lga_code, lga_shape_filtered_drop, on='pro_LGA_NAME_2018', how='left')
lga_geo_df = lga_geo_df[['LGA_CODE_2018', 'pro_LGA_NAME_2018', 'geometry']]
lga_geo_df = lga_geo_df.rename(columns={'LGA_CODE_2018': 'lga_code', 'pro_LGA_NAME_2018': 'lga_name'})
lga_geo_df.head(5)
lga_geo_df = gpd.GeoDataFrame(lga_geo_df, geometry='geometry')

#### save the lga table into databse
lga_geo_df.to_file("lga_geo.geojson", driver='GeoJSON')

# authentication
admin = 'admin'
password = 'admin'
url = f'http://{admin}:{password}@172.26.130.99:5984/'

# get couchdb instance
couch = couchdb.Server(url)
# indicate the db name
db_name = 'lga_geometry_info'

# if not exist, create one
if db_name not in couch:
    db = couch.create(db_name)
    # # # data to be stored
    with open('lga_geo.geojson', 'r') as geo_file:
        gj = geojson.load(geo_file)
        for i in range(len(gj['features'])):
            entry = json.dumps(gj['features'][i])
            result = json.loads(entry)
            db.save(result)
    print('save lga geometry to db: lga_geometry_info completed')
else:
    db = couch[db_name]

### 2. construct lga name<>locations list (twitter location is not at lga basis)
# source from wiki
string = wikipedia.page("List of localities in Victoria").content
# select related info
formatted_list = re.split("•|=|\n", string)
info_list = []
for i in range(len(formatted_list)):
    if formatted_list[i] != '':
        info_list.append(formatted_list[i])

index = []
for i in range(len(info_list)):
    if "″E" in info_list[i]:
        index.append(i)

# construct lga and locations list from wiki
lga_locations_list = {}
full_locations = []
for i in range(len(index) - 1):
    locations = []
    name = info_list[index[i] - 1].strip()
    locations = [k.strip() for k in info_list[index[i] + 1:index[i + 1] - 1]]
    lga_locations_list[name] = locations

# print(lga_locations_list)
# lga <> standard lga list
matching_table = {}
standard_lga = list(lga_geo_df['lga_name'])
for i in range(len(list(lga_locations_list.keys()))):
    # matching_table[standard_lga[i]]=0
    for j in standard_lga:
        if j in list(lga_locations_list.keys())[i]:
            # print(list(dict1.keys())[i])
            matching_table[list(lga_locations_list.keys())[i].strip()] = j
# print(matching_table)

# construct standard lga and locations list
standard_lga_locations_list = {}
for i in range(len(lga_locations_list.keys())):
    key = list(lga_locations_list.keys())[i]
    try:
        replace_key = matching_table[key]
        standard_lga_locations_list[replace_key] = lga_locations_list[key]
    except:
        pass
print(standard_lga_locations_list)
print('length of standard_lga_locations_list', len(standard_lga_locations_list))


# save to couchdb
db_name = 'lga_locations_list'
# if not exist, create one
if db_name not in couch:
    db = couch.create(db_name)
    with open('lga_locations_list.json', 'w') as fp:
        json.dump(lga_locations_list, fp)
    for i in range(len(standard_lga_locations_list)):
        entry = {list(standard_lga_locations_list.keys())[i]: list(standard_lga_locations_list.values())[i]}
        dump = json.dumps(entry)
        result = json.loads(dump)
        db.save(result)
    print('save lga location list to db: lga_locations_list completed')
else:
    db = couch[db_name]

### 3. sort sudo data based on lga code, save the sudo attributes table to couchdb
# Attributes:
# - family violence rate (1)
# - employee income (4)
# - population statistics (5)
# - housing (4)
# - health workforce (3)
# - education (2)
# - unemployment rate (1)

# family violence rate 2017-18
family_violence = gpd.read_file("./SUDO Format File/family_violence_child_court_afm_rate_lga_jul2013_jun2018.json")
filtered_family_violence = family_violence[['lga_code11', 'affected_family_members_rate_per_100k_2017_18']]
filtered_family_violence = filtered_family_violence.rename(columns={'lga_code11': 'lga_code'})
filtered_family_violence.head(5)

lga_attributes_df = pd.merge(lga_geo_df, filtered_family_violence, on='lga_code', how='left')
print('null value:', lga_attributes_df.isnull().sum())
print('loaded family volence, shape:', lga_attributes_df.shape)

# crime statistics-offences record count 2019
offences_court = gpd.read_file("./SUDO Format File/crime_stats_offences_recorded_offence_type_lga_2010_2019.json")
offences_court['total_crime_offences_count'] = offences_court['total_division_a_offences'] + offences_court[
    'total_division_b_offences'] + offences_court['total_division_c_offences'] + offences_court[
                                                   'total_division_d_offences'] + offences_court[
                                                   'total_division_e_offences'] + offences_court[
                                                   'total_division_f_offences']
filtered_offences_court = offences_court[['lga_code11', 'total_crime_offences_count', ]]
filtered_offences_court = filtered_offences_court.rename(columns={'lga_code11': 'lga_code'})
filtered_offences_court.head(5)

lga_attributes_df = pd.merge(lga_attributes_df, filtered_offences_court, on='lga_code', how='left')
print('null value:', lga_attributes_df.isnull().sum())
print('loaded crime offences, shape:', lga_attributes_df.shape)

# employee income 2017-2018
employee_income = gpd.read_file("./SUDO Format File/abs_personal_income_employee_income_lga_2011_2018.csv")
vic_lga_list = list(filtered_lga_code['LGA_CODE_2018'])
vic_employee_df = employee_income[employee_income['lga_code'].isin(vic_lga_list)]
vic_employee_df = vic_employee_df[
    ['lga_code', 'median_aud_2017_18', 'mean_aud_2017_18', 'median_age_of_earners_years_2017_18',
     'earners_persons_2017_18']]
# print(vic_employee_df.shape)

lga_attributes_df = pd.merge(lga_attributes_df, vic_employee_df, on='lga_code', how='left')
print('null value:', lga_attributes_df.isnull().sum())
print('loaded employee df, shape:', lga_attributes_df.shape)

# population statistics 2019
population_df = gpd.read_file('./SUDO Format File/abs_data_by_region_pop_and_people_lga_2011_2019.csv')
vic_population_df = population_df[population_df['lga_code_2019'].isin(vic_lga_list)]
print(vic_population_df.shape)
filtered_vic_population_df = vic_population_df[['lga_code_2019', 'estmtd_rsdnt_ppltn_smmry_sttstcs_30_jne_fmls_ttl_nm',
                                                'population_density_as_at_30_june_population_density_personskm2',
                                                'estmtd_rsdnt_ppltn_smmry_sttstcs_30_jne_mdn_age_prsns_yrs',
                                                'estmtd_rsdnt_ppltn_smmry_sttstcs_30_jne_mdn_age_fmls_yrs',
                                                'estmtd_rsdnt_ppltn_smmry_sttstcs_30_jne_mdn_age_mls_yrs']]
filtered_vic_population_df.columns = ['lga_code', 'estimated resident population - total(no.)',
                                      'population density (persons/km2)', 'median age', 'median female gae',
                                      'median male gae']
lga_attributes_df = pd.merge(lga_attributes_df, filtered_vic_population_df, on='lga_code', how='left')
print('null value:', lga_attributes_df.isnull().sum())
print('loaded population_df,shape:', lga_attributes_df.shape)

# housing 2016
housing_df = gpd.read_file('./SUDO Format File/phidu_housing_transport_lga_2016_20.csv')
vic_housing_df = housing_df[housing_df['lga_code'].isin(vic_lga_list)]
print(vic_housing_df.shape)
filtered_vic_housing_df = vic_housing_df[
    ['lga_code', 'mortgage_stress_2016_pc_mortgage_stress', 'rental_stress_2016_pc_rental_stress',
     'persons_living_crowded_dwellings_2016_pc_in', 'persons_living_severely_crowded_dwellings_2016_rate_per_10000']]
filtered_vic_housing_df.columns = ['lga_code', 'Mortgage stress %', 'Rental stress %',
                                   'Persons living crowded dwellings % per 10,000',
                                   'Persons living severely crowded dwellings % per 10,000']

lga_attributes_df = pd.merge(lga_attributes_df, filtered_vic_housing_df, on='lga_code', how='left')
print('null value:', lga_attributes_df.isnull().sum())
print('loaded housing df, shape:', lga_attributes_df.shape)

# health workforce 2018
health_workforce_df = gpd.read_file('./SUDO Format File/phidu_health_workforce_lga_2018.csv')
vic_health_workforce_df = health_workforce_df[health_workforce_df['lga_code'].isin(vic_lga_list)]
filtered_vic_health_workforce_df = vic_health_workforce_df[['lga_code',
                                                            'total_medical_practitioners_2018_rate_per_100000_people',
                                                            'general_medical_practitioners_2018_rate_per_100000_people',
                                                            'ttl_nrss_rgstrd_enrlld_mdwvs_prsn_cntd_2018_rte_pr_100000_pple']]
filtered_vic_health_workforce_df.columns = ['lga_code', 'total medical practitioners % per 100,000',
                                            'general_medical_practitioners % per 100,000',
                                            'total registered nurses % per 100,000']
lga_attributes_df = pd.merge(lga_attributes_df, filtered_vic_health_workforce_df, on='lga_code', how='left')
print('null value:', lga_attributes_df.isnull().sum())
print('loaded healthforce df, shape:', lga_attributes_df.shape)

# education 2019
education_df = gpd.read_file('./SUDO Format File/phidu_education_lga_2016_19.csv')
vic_education_df = education_df[education_df['lga_code'].isin(vic_lga_list)]
filtered_vic_education_df = vic_education_df[['lga_code', 'prtcptn_vctnl_edctn_trnng_ttl_ppltn_2019_sr',
                                              'fll_tme_prtcptn_scndry_schl_edctn_age_16_2016_urp_pple_agd']]
filtered_vic_education_df.columns = ['lga_code', 'total population participates in Vocational Education and Traning',
                                     'full time participation in Secondary School Education at age 16']
lga_attributes_df = pd.merge(lga_attributes_df, filtered_vic_education_df, on='lga_code', how='left')
print('null value:', lga_attributes_df.isnull().sum())
print('loaded educationdf, shape:', lga_attributes_df.shape)

# unemployment rate 2020-2021
unemployment_rate_df = gpd.read_file('./SUDO Format File/dese_salm_lga_asgs_2021_sep_qrt_2021_smhd_lga_unemp_rates.csv')
vic_unemployment_rate_df = unemployment_rate_df[unemployment_rate_df['lga_code_2021_asgs'].isin(vic_lga_list)]
vic_unemployment_rate_df = vic_unemployment_rate_df[['lga_code_2021_asgs', 'sep_21']]
vic_unemployment_rate_df.columns = ['lga_code', 'unemployment rate (sep 21)']
lga_attributes_df = pd.merge(lga_attributes_df, vic_unemployment_rate_df, on='lga_code', how='left')
print('null value:', lga_attributes_df.isnull().sum())
print('loaded unemployment rate, shape:', lga_attributes_df.shape)

gdf = GeoDataFrame(lga_attributes_df)

##### save lga attributes json and into database
gdf.to_file("sudo_vic_lga_attributes.geojson", driver='GeoJSON')
# indicate the db name
db_name = 'sudo_data_load'

# if not exist, create one
if db_name not in couch:
    db = couch.create(db_name)
    # # data to be stored
    with open('./sudo_vic_lga_attributes.geojson', 'r') as sudo_file:
        gj = geojson.load(sudo_file)
        for i in range(len(gj['features'])):
            entry = json.dumps(gj['features'][i])
            result = json.loads(entry)
            # print(result)
            db.save(result)
    print('save sudo attributes to db: sudo_data_load completed')
else:
    db = couch[db_name]

# load the scatter and introduction into db
note_dict={'Notes':
{"positive tweet per": "Positive Tweet Count / Total Tweet Count *100%, where positive tweets come from amusement + joy + awe (positive) emotion classified, total tweet count only counts the tweet with geographical information.",
"median income": "Employee income is the total (or gross) income received as a return to labour from an employer or from a person's own incorporated business (when they are employed by this business). The data used in deriving employee income comes from both Individual Tax Returns (ITR) and payment summaries (where an individual has not lodged an ITR)(2017-2018)",
 "median age": "this data is from the ABS Data by Region statistics - Population & People (LGA) (2019-2020) dataset",
 "mortgage stress %": "Mortgage stress % is calculated on gross income by PHIDU on 2019",
 "unemployment rate": "The unemployment rate is the percentage of people in the labour force who are unemployed.The data is from the regional estimates from Local Government Area (LGA) at Sep 2021",
 "education Level": "It is measured by Full-Time Participation In Secondary School Education At Age 16 2016 Urp People Aged 16 (2019)",
 "total medical practitioners % per 100,000": "Total Medical Practitioners* Rate Per 100,000 People, calculated by PHIDU on 2018",
 "crime offences count": "the footprint of the number of crime  offences recorded on the Victoria Police Law Enforcement Assistance Program (LEAP) on 2020",
 "population density (persons/km2)": "as at 30 June  2020 Population density (persons/km2)"}}

intro_dict={"Introduction":"Happiness, a state of being often characterized by feelings of joy, satisfaction, and fulfillment, can be a somewhat elusive goal with varying definitions from one individual to another. In general, it is associated with positive emotions and overall life satisfaction.\nLeveraging social media, we aimed to explore the emotional landscape in the state of Victoria during the turbulent years of the COVID-19 outbreak, from 2021 to 2022. Our gauge for happiness was the rate of positive posts. Beyond simply quantifying happiness, we also sought to understand the factors that could induce this state of joy and whether there were regional differences in these aspects. Our findings have been visualized using various tools, including maps, scatter plots, bar charts, and word clouds, among others.\nIn the following section, we compared the analysed results (positive tweet percentage) with multiple datasets from SUDO which includes median income, median age, mortgage stress percentage, unemployment rate, education level, crime count, etc.Interestingly, our analysis revealed a strong negative correlation between the positive tweet count rate and the unemployment rate, albeit with weaker correlations relative to other factors."}

db_name = 'lga_geometry_info'
# load the data into database
if db_name not in couch:
    db = couch.create(db_name)
else:
    db = couch[db_name]
    entry = json.dumps(note_dict)
    note_load = json.loads(entry)
    db.save(note_load)
    entry = json.dumps(intro_dict)
    intro_load = json.loads(entry)
    db.save(intro_load)

