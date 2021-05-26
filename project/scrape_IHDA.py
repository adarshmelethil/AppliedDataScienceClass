import sys
import os 
import io
import requests
import time
import statistics
import datetime
import math
from functools import partial, reduce

import pandas as pd
from bs4 import BeautifulSoup

from posixpath import basename
from urllib.parse import urlsplit, urljoin
import re

# DATA_FOLDER = os.path.join('/content/drive/', 'My Drive', 'ENSF 519', 'Datasets')
DATA_FOLDER = "data2"


# *** *** *** *** *** *** *** *** *** *** *** *** 


removeAllWhiteSpace = partial(re.sub, r'\s+', '')
removeAllTabsAndEnters = partial(re.sub, r'\t|\n', '')

def requestPage(url, request_func, is_html=False):
  resp = request_func(url)
  if resp.status_code != 200:
    print(f"Failed with response code: {resp.status_code}", file=sys.stderr)
    return None
  page_content = resp.text
  if is_html:
    return BeautifulSoup(page_content, "html.parser")
  else:
    return page_content

def postPage(url, requester, data, headers=None, **kwargs):
  return requestPage(url, partial(requester.post, data=data, headers=headers), **kwargs)

def getPage(url, requester, **kwargs):
  return requestPage(url, requester.get, **kwargs)


# *** *** *** *** *** *** *** *** *** *** *** *** 


TABLE_REQUEST_HEADER = {
    "Cache-Control": "max-age=0",
    "Origin": "http://www.ahw.gov.ab.ca",
    "Upgrade-Insecure-Requests": "1",
    "DNT": "1",
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
    "Referer": "http://www.ahw.gov.ab.ca/IHDA_Retrieval/selectSubCategory.do",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "en-US,en;q=0.9",
  }

def newParameterOptionsIndex(optionParameters, number_of_options_to_select_all):
  '''
    Used to keep track of the starting index as you iterate through option paramerters
  
    parameters:
      number_of_options_to_select_all (int): the number of elements that will not be iterated 
  '''
  return [0 for _ in range(len(optionParameters)-number_of_options_to_select_all)]

def incrementParameterOptionsIndexs(parameter_options_indexs, optionParameters, increment_multiple):
  '''
    Increments the index until it overflows and move onto the next index

    parameters:
      increment_multiple (int): the number of parameters that are included per request call, move the index by that much over
  '''
  for i in range(len(parameter_options_indexs)):
    parameter_options_indexs[i] += increment_multiple
    if parameter_options_indexs[i] >= len(optionParameters[i]["options"]):
      parameter_options_indexs[i] = 0
      continue
    return True
  return False

def selectAllParameters(optionParameters, number_of_options_to_select_all):
  '''
    Creates a name value pair for the selections that will ALL be selected, e.g. [(sex, both), (sex, male), (sex, female)]
  '''
  include_all_optionParameters = []
  for i in range(1, number_of_options_to_select_all+1):
    include_all_optionParameters.extend([
      (
        optionParameters[-i]["parameter_name"],
        option["value"],
      )
      for option in optionParameters[-i]["options"]
    ])
  return include_all_optionParameters

def selectFiniteParameters(optionParameters, parameter_options_indexs, increment_multiple):
  '''
    creates a name value pair same as selectAllParameters, except only including 'increment_multiple' number
  '''
  selected_options = []
  for parameter_index, i_start in enumerate(parameter_options_indexs):
    for opParams_options in optionParameters[parameter_index]["options"][i_start:i_start+increment_multiple]:
      selected_options.append(
        (
          optionParameters[parameter_index]["parameter_name"],
          opParams_options["value"],
        )
      )
  return selected_options

def readInAllData(optionParameters, request_session):
  # iterate through all parameter options except for the last one which will select all
  number_of_options_to_select_all = len(optionParameters)                      # Start by trying to make a request call with all of the parameters selected
  increment_multiple = max([len(op["options"]) for op in optionParameters])    # Start by using the largest possible increment
  parameter_options_indexs = newParameterOptionsIndex(optionParameters, number_of_options_to_select_all)
  reduce_select_all_count = True # When we do a backoff to try and reduce the parameters we reduce the select_all paramters first
  category_param_data = ""

  option_pd = None # aggrgated data structure
  subCategoryParameters_url = urljoin(index_url, optionParameters_form["action"])
  while True:
    start_time = time.time()

    selected_options = [("command", "doGenerateResults")] # this is used server side to indicate what action we want to take
    selected_options.extend(selectFiniteParameters(optionParameters, parameter_options_indexs, increment_multiple))
    selected_options.extend(selectAllParameters(optionParameters, number_of_options_to_select_all))

    new_category_param_data = "&".join(["=".join([selected_option[0],selected_option[1]]) for selected_option in selected_options])
    if category_param_data == new_category_param_data:
      print(f"Duplicate arguments!", file=sys.stderr)
      raise Exception(f"Should not have duplicate parameters!! \n{category_param_data}\n{new_category_param_data}")
    category_param_data = new_category_param_data


    # We are ready to get the data
    # Move to the table screen
    table_page = postPage(
      subCategoryParameters_url,
      data=category_param_data,
      headers=TABLE_REQUEST_HEADER,
      requester=request_session,
      is_html=True)
    
    # Look for the export link, if we don't find it, we need to reduce our parameter selection
    export_link = table_page.find("form", {"name": "selectResults"}).find("table").find("td").find("a")
    if export_link is None:
      if reduce_select_all_count:
        number_of_options_to_select_all -= 1
      else:
        increment_multiple //= 2
      reduce_select_all_count = not reduce_select_all_count
      # reset everything so as not to get duplicate data
      option_pd = None
      parameter_options_indexs = newParameterOptionsIndex(optionParameters, number_of_options_to_select_all)
      category_param_data = ""
      print(f"Reducing parameter selection {number_of_options_to_select_all} - {increment_multiple}", file=sys.stderr)
      continue

    export_url = urljoin(index_url, export_link["href"])
    exported_csv = getPage(export_url, requester=request_session, is_html=False)
    exported_csv_stringio = io.StringIO(exported_csv)
    data_pd = pd.read_csv(exported_csv_stringio)

    if option_pd is not None:
      option_pd = option_pd.append(data_pd, ignore_index=True)
    else:
      option_pd = data_pd
    elapsed_time = time.time() - start_time
    print(f'{str(datetime.timedelta(seconds=elapsed_time))}: {data_pd.shape[0]} \t->\t {option_pd.shape[0]}', file=sys.stderr)
    
    if not incrementParameterOptionsIndexs(parameter_options_indexs, optionParameters, increment_multiple):
      break

  dir_name = os.path.dirname(pickle_file)
  if not os.path.exists(dir_name):
    os.makedirs(dir_name)
  print(f"Writing to pickle'{pickle_file}'", file=sys.stderr)
  option_pd.to_pickle(pickle_file)



# *** *** *** *** *** *** *** *** *** *** *** *** 


request_session = requests.Session()
index_url = "http://www.ahw.gov.ab.ca/IHDA_Retrieval/selectCategory.do"

health_page = getPage(index_url, requester=request_session, is_html=True)

# Category is the Big sections, the first selection you make e.g. 'Addictions and Mental Health'
categories = [
  {
    "link": category_tr.find("td").find("a")["href"],
    "name": removeAllTabsAndEnters(category_tr.find("td").find("a").getText()),
    "description": removeAllTabsAndEnters(category_tr.find("td").find("p").getText()),
  }
  for category_tr in health_page.find("form", {"name": "selectCategory"}).find_all("table")[1].find_all("tr")
]

for category in categories:
  print(f"*** {category['name']} ***", file=sys.stderr)
  category_url = urljoin(index_url, category["link"])
  category["page"] = getPage(category_url, requester=request_session, is_html=True)

  subCategory_form = category["page"].find("form", {"name": "selectSubCategory"})
  # Category options are the dropdown options for each category, e.g. 'Dispensation Rate - Antidepressant and Antianxiety - Age Standardized'
  category["options"] = [
    {
      "value": option["value"],
      "name": removeAllTabsAndEnters(option.getText())
    }
    for option in subCategory_form.find("select", {"name": "displayObject.id"}).find_all("option") if int(option["value"]) >= 0
  ]
  
  subCategory_url = urljoin(index_url, subCategory_form["action"])
  for option in category["options"]:
    print(f"--- {option['name']} ---", file=sys.stderr)
    pickle_file = os.path.join(DATA_FOLDER, category["name"].replace(' ', ''), f"{option['name'].replace(' ', '')}.pickle.gz")
    if os.path.exists(pickle_file):
      print(f"Found : '{pickle_file}'!", file=sys.stderr)
      continue

    select_option_data = {
      "displayObject.id": option["value"],
      "command": "doSelect",
    }
    # This page has the parameters for the particular option
    option["page"] = postPage(subCategory_url, data=select_option_data, requester=request_session, is_html=True)
    
    optionParameters_form = option["page"].find("form", {"name": "selectSubCategoryParameters"})
    
    # This is all the combinations of parameters for a given option
    # Each parameter have their own options...
    optionParameters = [
      {
        "name": removeAllTabsAndEnters(optionParameters_tr.find_all("td")[0].find("b").getText()),
        "parameter_name": optionParameters_tr.find_all("td")[1].find("select")["name"],
        "parameter_id": optionParameters_tr.find_all("td")[1].find("select")["id"],
        "options": [
          {
            "name": removeAllTabsAndEnters(subCategoryParameterOption.getText()),
            "value": subCategoryParameterOption["value"],
          }
          for subCategoryParameterOption in optionParameters_tr.find_all("td")[1].find("select").find_all("option")
        ],
      }
      for optionParameters_tr in optionParameters_form.find_all("tr") if len(optionParameters_tr.find_all("td")) >= 2
    ]

    readInAllData(optionParameters, request_session)
    
    # break # TODO REMOVE
  # break # TODO REMOVE