
import json

class CnetProjectPipeline(object):
    def __init__(self):
        # self.file = open('items.jl', 'wb')
        pass

    def process_item(self, item, spider):
        line = json.dumps(dict(item))
        title = item['url'].split("/")[-1]
        filename = open('crawl_three/json/'+title+'.json', 'wb')
        filename.write('['+line+']')
        return item
