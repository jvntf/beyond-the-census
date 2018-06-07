import requests
import codecs

from BeautifulSoup import BeautifulSoup
import sys  

reload(sys)  
sys.setdefaultencoding('utf8')

url = 'http://glottolog.org/resource/languoid/id/'

langIds = open('scripts/langIds.csv')

outputfile = codecs.open('../data/alt_scripts.csv','w+', encoding='utf-8')
outputfile.write('glottocode, langauges\n')

gCodes = open('scripts/langCodes.csv');
isoCodes = open('scripts/allCodes.csv');
langScripts = open ('scripts/langs_scripts.csv')
langGCodes = open('scripts/langIds.csv')

dictLGcodes = {}
for line in langGCodes:
	array = line.split(',')
	# code = langname
	dictLGcodes[array[1].strip()] = array[0].strip()

dictLscripts = {}
for line in langScripts:
	array = line.split(',')
	dictLscripts[array[0].strip()] = array[1].strip()

dictGCode={}
for line in gCodes:
	array = line.split(',')
	#gcode = iso 3
	dictGCode[array[1].strip()] = array[0].strip()	

dictIsoCode={}
for line in isoCodes:
	array = line.split(',')

	#iso 3 = iso 2
	dictIsoCode[array[1].strip()] = array[0].strip()



# for line in langIds:
# 	line = line.split(',')[1]
	
# 	try:
# 		if dictIsoCode[dictGCode[line.strip()]]:
# 			continue
# 			# print line.strip() + ' has iso 3'
# 	except:
# 		try: 
# 			if dictLscripts[dictLGcodes[line.strip()]]:
# 				continue
# 				# print dictLGcodes[line.strip()] + ' yes'
# 		except:
# 			print dictLGcodes[line.strip()] + ' no'
# 			# print line.strip() + ' does not have script'
# 			continue
# 		pass
# 		# print line.strip() + 'does not have iso 3'



# exit()

for line in langIds:
	line = line.split(',')[1]
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
		curCode = line.strip()

		# try:
		# 	print dictIsoCode[dictGCode[curCode]]
		# except:
		# 	print curCode + 'not found'


		# break if we reach the end of the list
		# 
		
		current = current.findNext()
		scriptFile = False
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


				# if "[es]" or "[en]" or '['+dictIsoCode[dictGCode[language]]+']'in code:
				if "[en]" in code:
					outputfile.write(','+language +' '+code)
				elif "[es]" in code:
					outputfile.write(',' + language + ' '+code)
				else:
					try:
						script = dictIsoCode[dictGCode[curCode]]
						if script in code:
							outputfile.write(','+language +' '+code)
							try: 
								sc = dictLscripts[dictLGcodes[curCode]]
								outputfile.write(','+sc + '[sc]')
							except:
								pass

					except:
						# print 'looking for script in other file'
						try: 
							sc = dictLscripts[dictLGcodes[curCode]]
							# print 'sc' + sc
							if scriptFile == False:
								outputfile.write(','+sc + ' [sc]')
							scriptFile = True
						except:
							# print '137curCode ' +sc
							pass
						pass
 			except:
				pass

			if current.findNextSibling() == None:
				break
			current = current.findNext()
			# print 'hello'
	outputfile.write('\n')


# langIds = open('../data/langIds')
# for row in langIds:
# 	url = 'http://glottlog.org/resource/languoid/id/'+row
# 	print url