import scrapy

class Article(scrapy.Item):
    title = scrapy.Field()
    introtext = scrapy.Field()
    preview_image = scrapy.Field()
    url = scrapy.Field()
    content = scrapy.Field()
