from bs4 import BeautifulSoup
import urllib2
import csv

def main():
	parsegymnasts()

def parsegymnasts():
	req = urllib2.Request("https://mtl2017gymcan.com/en/2017/09/05/planet-gym-womens-teams/", headers={'User-Agent': 'Mozilla/5.0'})
	#url = "https://mtl2017gymcan.com/en/2017/09/05/planet-gym-womens-teams/"
	f = urllib2.urlopen(req).read()
	#print f
	soup = BeautifulSoup(f, 'html.parser')

	div = soup.find_all('div',attrs={"class":"entry-content"})[0]
	print type(div)
	print div
	file2 = open('data/gymnasts.csv', 'a')
	writer = csv.writer(file2)
	currentcountry = ""
	for counter,el in enumerate(div):

		#print "counter: " + str(counter)
		#print "el: " + str(el)
		#print "el: " + str(div)
		#print "tag name: " + str(el.name)
		if el.name == 'p':
			#print "country: " + div[counter-1]
			currentcountry = el.text

		if el.name == 'ul':
			#print "country: " + div[counter-1]
			lis = el.find_all('li')
			print "currentcountry: " + str(currentcountry)
			for li in lis:
				print "gymnast:" + str(li.text.encode('utf-8'))
				writer.writerow([currentcountry, li.text.encode('utf-8')])
			print '\n'
if __name__ == "__main__":
	main()