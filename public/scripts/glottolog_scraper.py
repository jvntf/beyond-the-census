import requests
import codecs
from BeautifulSoup import BeautifulSoup

url = 'http://glottolog.org/resource/languoid/id/'

langIds = open('../data/langIds')

outputfile = codecs.open('../data/alt_scripts.csv','w+', encoding='utf-8')
outputfile.write('glottocode, langauges\n')

for line in langIds:
	thisUrl = url+line.strip()

	response = requests.get(thisUrl)
	html = response.content

	soup = BeautifulSoup(html)
	lexvo = soup.find('dt')
	if lexvo!=None:
		if lexvo.string.strip() != "lexvo:":
			print lexvo.string.strip()
			continue

		current = lexvo

		outputfile.write(line.strip())
		print line

		# break if we reach the end of the list
		# 
		
		current = current.findNext()
		while (current!=None):
			# break if this one is another dt
			if current.name == 'dt':
				# print current
				break
			try:
				whole = current.string.strip().replace("\n","").replace("  ","")
				whole = whole.split("[")
				# print whole
				#avoid badly formatted text
				if len(whole) == 2:
					language = whole[0]
					code = "["+whole[1]
				outputfile.write(','+language +' '+code)
			except:
				continue

			if current.findNextSibling() == None:
				break
			current = current.findNext()
			# print 'hello'
	outputfile.write('\n')


# langIds = open('../data/langIds')
# for row in langIds:
# 	url = 'http://glottlog.org/resource/languoid/id/'+row
# 	print url