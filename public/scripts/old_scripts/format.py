import codecs
import sys
reload(sys)
sys.setdefaultencoding('utf-8')


infile = open('scripts/scripts.csv')



outputfile = codecs.open('scripts/fixedscripts.csv','w+', encoding='utf-8')



for line in infile:
	# print line
	line = line.replace('"','')
	if ',' not in line:
		print 'found'
		outputfile.write(line.strip()+';')
	else:
		print 'not found'
		outputfile.write(line)
	# if ',\n' in line:
	# 	outputfile.write(line)
	# elif '\n' in line:
	# 	# outputfile.write(line.strip() + ';')
