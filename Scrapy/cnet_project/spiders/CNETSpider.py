# -*- coding: utf-8 -*-
import scrapy
import json
import re
import html2text
from urlparse import urlparse

from cnet_project.items import Article

class CNETSpider(scrapy.Spider):
    handle_httpstatus_list = [301,404, 500]
    name = "CNET"
    allowed_domains = ["www.cnetfrance.fr"]
    # start_urls = ["http://www.cnetfrance.fr/news/"]
    start_urls = ["http://www.cnetfrance.fr/news/mobilite/","http://www.cnetfrance.fr/news/gadget/","http://www.cnetfrance.fr/news/internet/"]

    # def parse(self, response):
    #     for category_link in response.xpath('//ul[@class="catListing"]//div[@class="catHead"]/a'):
    #         url = response.urljoin(category_link.xpath('@href').extract()[0])
    #         requestForTotalPages = scrapy.Request(url, callback=self.parse_category_total_pages, errback=self.http_error)
    #         yield requestForTotalPages
    
    def parse(self, response):
        requestForTotalPages = scrapy.Request(response.url, callback=self.parse_category_total_pages, errback=self.http_error)
        yield requestForTotalPages

    def http_error(self, response):
        print "error to visit"

    def parse_category_total_pages(self, response):
        category_total_pages = int(response.xpath('//div[@class="pageNav"]/ul/li[last()-1]/a/text()').extract()[0])
        #print response.url
        #print category_total_pages
        for i in range(1, category_total_pages):
            print "page is "+str(i)
            request = scrapy.Request("{}{}{}".format(response.url, "?p=", i), callback=self.parse_category, errback=self.http_error)
            yield request

    def parse_category(self, response):
        print response.status
        if not response.xpath('//div[@class="riverPost reviewPost"]').extract():
            print "null response"
            return

        for post_review in response.xpath('//div[@class="riverPost reviewPost"]'):
            article  = Article()
            article['title'] = post_review.xpath('.//a[@class="storyTitle"]/text()').extract()[0].encode('utf-8')
            article['introtext'] = post_review.xpath('.//div[@class="storyDek"]/text()').extract()[0].rstrip('\r\n\t')
            article['preview_image'] = response.urljoin(post_review.xpath('.//div[contains(@class,"imageLinkWrapper")]//img/@src').extract()[0])
            article['url'] = response.urljoin(post_review.xpath('.//a[@class="storyTitle"]/@href').extract()[0])
            request = scrapy.Request(article['url'], callback=self.parse_article)
            request.meta['article'] = article
            # article['date'] = post_review.xpath('.//div[@class="reviewInfo"]/text()').re('\|(.+)\r')[0].encode('utf-8')
            yield request
            
    def parse_article(self, response):
        article = response.meta['article']

        #take domain name
        parsed_uri = urlparse(response.url)
        base_url = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
        #create page copy
        filename = response.url.split("/")[-1]
        body_with_urls = re.sub(r'href="/(.*)"', 'href="'+base_url+(r'\1') +'"', response.body)
        body_with_urls = re.sub(r'src="/(.*)"', 'src="'+base_url+(r'\1') +'"', body_with_urls)
        with open('crawl_three/pages/'+filename, 'wb') as f:
            f.write(body_with_urls)
        
        content_values = ""
        for content_p in response.xpath('//div[@class="article-main-body"]/div/p'):
            content_values += re.compile(r'<[^>]+>').sub('', content_p.extract()).encode('utf-8')
        # if content_p.xpath('./text()').extract():
            # for content_p_value in content_p.xpath():
            #     converter = html2text.HTML2Text()
            #     converter.ignore_links = True
            #     content_values += converter.handle(content_p_value[0])

                    # content_values.append(val)
                    
                # content_p_value.rstrip('\r\n').encode('utf-8')
                # content_p_value.rstrip('\r\n').encode('utf-8')
            # if content_p.xpath('./text()').rstrip('\r\n'):
            #     print
                # print 'str' + str(content_p.xpath('./text()').extract().rstrip('\r\n').encode('utf-8'))
                # content_values.append(content_p.xpath('./text()').extract()[0].encode('utf-8'))
            # print converter.handle(content_p.xpath('/text()').extract()).encode('utf-8')
        # article['content'] = dict(content_values)

        # print "content goes here"
        # # print ''.join(content_values)
        # article['content'] = ''.join(content_values)
        article['content'] = content_values
        yield article
